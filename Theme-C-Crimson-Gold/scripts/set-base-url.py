#!/usr/bin/env python3
"""Switch the site's absolute base URL (canonical, og:url, og:image, JSON-LD).

Usage, from the Theme-C-Crimson-Gold folder (or anywhere):

    python scripts/set-base-url.py                      # use BASE_URL below
    python scripts/set-base-url.py https://example.com/  # or pass one

Pages are published with canonical URLs on the final domain (BASE_URL), so search
engines treat abinitioindia.com as the original even while the site is previewed on
GitHub Pages. Change BASE_URL (keep the trailing slash) if the domain ever changes.
Needs only Python 3.8+.
"""
import os
import re
import sys

BASE_URL = "https://abinitioindia.com/"

THEME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def long_path(p):
    return "\\\\?\\" + os.path.abspath(p) if os.name == "nt" else p


def main():
    new = sys.argv[1] if len(sys.argv) > 1 else BASE_URL
    if not new.endswith("/"):
        new += "/"
    index = open(os.path.join(THEME, "index.html"), encoding="utf-8").read()
    old = re.search(r'<link rel="canonical" href="([^"]+)"', index).group(1)
    if old == new:
        print("Base URL is already", new); return
    changed = 0
    for folder, dirs, files in os.walk(THEME):
        dirs[:] = [d for d in dirs if d not in ("assets", "scripts", ".git")]
        for name in files:
            if name.endswith(".html"):
                path = long_path(os.path.join(folder, name))
                html = open(path, encoding="utf-8").read()
                if old in html:
                    open(path, "w", encoding="utf-8", newline="\n").write(html.replace(old, new))
                    changed += 1
    print(f"Base URL changed from {old} to {new} in {changed} pages.")


if __name__ == "__main__":
    main()
