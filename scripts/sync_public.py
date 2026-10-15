#!/usr/bin/env python3
"""Public-only GitHub repository snapshot. No private data or tokens are exported."""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OWNERS_FILE = ROOT / "config" / "owners.json"
OUTPUT = ROOT / "data" / "public_snapshot.json"
FIELDS = ("id", "name", "full_name", "html_url", "description", "archived",
          "fork", "default_branch", "language", "homepage", "created_at",
          "updated_at", "pushed_at", "open_issues_count", "visibility", "private")

def fetch(url: str) -> list[dict]:
    request = urllib.request.Request(
        url, headers={"Accept": "application/vnd.github+json",
                      "User-Agent": "Project-Atlas-public-sync/1.0"})
    with urllib.request.urlopen(request, timeout=35) as response:
        return json.load(response)

def owner_repos(owner: str) -> list[dict]:
    out = []
    for page in range(1, 31):
        query = urllib.parse.urlencode({"type": "owner", "per_page": 100, "page": page})
        url = ("https://api.github.com/users/"
               + urllib.parse.quote(owner, safe="") + "/repos?" + query)
        batch = fetch(url)
        if not isinstance(batch, list):
            raise ValueError("Expected repository array")
        for item in batch:
            # Defense in depth: export only public records from an unauthenticated endpoint.
            if item.get("private") or item.get("visibility") != "public":
                continue
            if item.get("owner", {}).get("login", "").lower() != owner.lower():
                continue
            row = {key: item.get(key) for key in FIELDS}
            row["id"] = int(item["id"])
            row["private"] = False
            row["visibility"] = "public"
            row["owner"] = {"login": item["owner"]["login"]}
            out.append(row)
        if len(batch) < 100:
            break
    else:
        raise RuntimeError("Pagination cap reached; increase before publishing")
    return out

def main() -> int:
    owners = json.loads(OWNERS_FILE.read_text(encoding="utf-8"))["owners"]
    if not isinstance(owners, list) or not owners:
        raise ValueError("config/owners.json needs a nonempty owners array")
    rows, errors = {}, []
    for owner in owners:
        if not isinstance(owner, str) or not owner or "/" in owner:
            raise ValueError("Invalid owner: " + str(owner))
        try:
            for item in owner_repos(owner):
                rows[item["id"]] = item
        except (urllib.error.URLError, ValueError, RuntimeError) as err:
            errors.append(owner + ": " + str(err))
    if errors:
        print("Sync failed, preserving previous snapshot:", " | ".join(errors), file=sys.stderr)
        return 1
    data = {
        "schema_version": 1,
        "sync_scope": "public_repositories_only",
        "synced_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "owners": owners,
        "repositories": sorted(rows.values(), key=lambda item: (item["owner"]["login"].lower(), item["name"].lower()))
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Public repositories exported:", len(data["repositories"]))
    return 0

if __name__ == "__main__":
    sys.exit(main())
