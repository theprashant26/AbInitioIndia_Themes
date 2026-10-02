#!/usr/bin/env python3
"""Inline Theme C's critical (first-screen) CSS into every page.

Usage, from the Theme-C-Crimson-Gold folder (or anywhere):

    python scripts/build-critical.py

How it works
  * assets/css/style.css contains named blocks:
        /*! critical:NAME:start */  …  /*! critical:NAME:end */
  * PAGE_BLOCKS below says which blocks each kind of page needs for its first
    screen (header, banner/hero and the first content section).
  * For every .html file the script joins those blocks, minifies them, fixes the
    font URLs for the page's folder depth and writes them inside <style> between
        <!-- critical-css:start -->   and   <!-- critical-css:end -->
The full style.css is still loaded (non-blocking) on every page, so only the marked
blocks need to stay in sync. Re-run this command after editing any marked block or
after adding a page type (add it to PAGE_BLOCKS). Needs only Python 3.8+.
"""
import fnmatch
import os
import re
import sys

THEME = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS = os.path.join(THEME, "assets", "css", "style.css")
START, END = "<!-- critical-css:start -->", "<!-- critical-css:end -->"

# First match wins. Paths are relative to the theme folder, with forward slashes.
PAGE_BLOCKS = [
    ("index.html", ["base", "light", "home"]),
    ("services.html", ["base", "tabs"]),
    ("services/*.html", ["base", "light", "side", "prose"]),
    ("insights.html", ["base", "light", "insights"]),
    ("insights/*.html", ["base", "light", "article", "prose"]),
    ("about.html", ["base", "light", "about"]),
    ("team.html", ["base", "light", "team"]),
    ("mentors.html", ["base", "light", "team"]),
    ("contact.html", ["base", "light", "contact"]),
    ("faq.html", ["base", "light", "faq"]),
    ("404.html", ["base", "center"]),
    ("thank-you.html", ["base", "center"]),
    ("*.html", ["base", "light", "side", "prose"]),          # legal pages
]


def long_path(p):
    """Windows needs the extended prefix for the very long article file names."""
    return "\\\\?\\" + os.path.abspath(p) if os.name == "nt" else p


def minify(css):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"\s+", " ", css)
    css = re.sub(r"\s*([{};:,>])\s*", r"\1", css)
    return css.replace(";}", "}").strip()


def read_blocks(css):
    blocks = {}
    for name, body in re.findall(r"/\*! critical:([\w-]+):start \*/(.*?)/\*! critical:\1:end \*/", css, re.S):
        blocks[name] = blocks.get(name, "") + minify(body)
    if "base" not in blocks:
        sys.exit("style.css has no /*! critical:base:start */ … block")
    return blocks


def blocks_for(rel):
    for pattern, names in PAGE_BLOCKS:
        if fnmatch.fnmatch(rel, pattern) and ("/" in pattern) == ("/" in rel):
            return names
    return ["base"]


def main():
    blocks = read_blocks(open(CSS, encoding="utf-8").read())
    sizes = []
    for folder, dirs, files in os.walk(THEME):
        dirs[:] = [d for d in dirs if d not in ("assets", "scripts", ".git")]
        for name in files:
            if not name.endswith(".html"):
                continue
            path = os.path.join(folder, name)
            rel = os.path.relpath(path, THEME).replace(os.sep, "/")
            prefix = "../" * rel.count("/")
            names = blocks_for(rel)
            missing = [n for n in names if n not in blocks]
            if missing:
                sys.exit(f"{rel}: unknown critical block(s) {missing}")
            css = "".join(blocks[n] for n in names).replace("url(../fonts/", "url(" + prefix + "assets/fonts/")
            with open(long_path(path), encoding="utf-8") as f:
                html = f.read()
            if START not in html:
                continue
            new = re.sub(re.escape(START) + r".*?" + re.escape(END),
                         lambda _: START + "<style>" + css + "</style>" + END, html, count=1, flags=re.S)
            if new != html:
                with open(long_path(path), "w", encoding="utf-8", newline="\n") as f:
                    f.write(new)
            sizes.append(len(css))
    print(f"Critical CSS inlined into {len(sizes)} pages "
          f"({min(sizes) / 1024:.1f}-{max(sizes) / 1024:.1f} KB per page, blocks: {', '.join(sorted(blocks))}).")


if __name__ == "__main__":
    main()
