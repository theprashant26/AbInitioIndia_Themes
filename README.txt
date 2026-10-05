Ab Initio India – Website theme options
=======================================
Static website themes with a glassmorphism signature style, each with its own layout.
Built with Bootstrap 5.3, Bootstrap Icons, GSAP and ScrollTrigger (all included locally).
No build step: every page is plain HTML/CSS/JS.

Theme-A-Heritage      "Ivory Gold Glass"     – light luxury editorial: ivory, champagne, soft gold hairlines,
                      Cormorant Garamond / Manrope, sharp corners. Asymmetric hero with an arched photo of
                      Lutyens' Delhi, logo marquee between gold hairlines, compact two-column services list,
                      arched team portraits, magazine insights, deep warm-ink footer.
Theme-B-Brand-Blue    "Aurora Brand Glass"   – client's chosen theme. White pages with a faint blue/sunflower
                      tint behind the hero; blue #1552A1 + sunflower #FACF00 accents, Plus Jakarta Sans.
                      Split hero with a floating bento cluster, bento services grid with hover tilt,
                      "How we work" process timeline, filterable insights grid.

Theme C "Royal Crimson Glass" has been moved off the main branch and is kept for later use:
  branch  archive/theme-c-crimson-gold   (whole repo as it was, Theme C launch-ready)
  tag     theme-c-crimson-gold-v1
  Browse / download:  https://github.com/theprashant26/AbInitioIndia_Themes/tree/archive/theme-c-crimson-gold
  Restore locally:    git checkout archive/theme-c-crimson-gold -- Theme-C-Crimson-Gold
  Its own launch notes (critical CSS, redirects, canonical URLs) are in that branch's README.

Live preview: https://theprashant26.github.io/AbInitioIndia_Themes/
(the root index.html is a chooser page with a preview of each theme)

Pages (identical set in every theme folder)
-------------------------------------------
index.html                     Homepage
about.html                     About us – firm profile, philosophy, mission/vision, transactions handled
team.html                      Our team (11 members, photos and bios)
mentors.html                   Our mentors (5 mentors)
services.html                  Our services – all 8 services and company values
services/business-advocacy.html
services/strategic-advisory.html
services/transaction-advisory.html
services/structure-advisory.html
services/mergers-acquisitions.html
services/india-entry-strategy.html
services/regulatory-practice-advisory.html
services/capital-market-services.html
insights.html                  All 38 articles, newest first
insights/<article-slug>.html   One page per article (slugs match abinitioindia.com)
contact.html                   Offices, phones, email, WhatsApp, Google Map, enquiry form (FormSubmit)
faq.html                       Frequently asked questions (accordion)
privacy-policy.html
disclaimer.html
terms-of-use.html
cookie-policy.html
accessibility-statement.html
404.html                       Not-found page
thank-you.html                 Shown after the enquiry form is sent (not indexed)
sitemap.xml, robots.txt

Each theme folder is fully self-contained: assets/css/style.css (tokens first, then the
.glass / .glass-strong / .glass-dark system, then components), assets/js/main.js, local vendor
libraries, and its own images in assets/img (team/, mentors/, services/, insights/, pages/,
clients/, stock/ and v/ for resized WebP variants). Client logos are WebP with a JPG/PNG fallback
and neutral file names (client-01 … client-11).

Performance
-----------
Pages link assets/vendor/bootstrap.subset.min.css – the Bootstrap 5.3 rules each theme actually
uses (about 23 KB instead of 227 KB). The full bootstrap.min.css is kept alongside it; switch the
<link> back to it if you add Bootstrap components that the subset does not include.
Icon and Google Fonts stylesheets load without blocking rendering; images use WebP variants.

Motion
------
CSS hero entrance, IntersectionObserver section reveals, slow CSS background drift, and GSAP
ScrollTrigger (loaded after the page is idle, desktop only) for the Theme B hero parallax.
Content is visible by default: the "hidden before reveal" state only applies once a script adds
.motion to <html>; anything already on screen is revealed at once, and a 1.5 s safety timer reveals
everything. All non-essential motion is off under prefers-reduced-motion.

Photo credits (free to use under the Pexels licence, https://www.pexels.com/license/)
-------------------------------------------------------------------------------------
- Lutyens' Delhi government building (listed on Pexels as "Rashtrapati Bhavan in Delhi") – Maahid Photos, https://www.pexels.com/photo/rashtrapati-bhavan-in-delhi-3881113/ (Theme A)
- Boardroom table and chairs – Leandro Alamino, https://www.pexels.com/photo/black-leather-office-rolling-chairs-beside-brown-wooden-table-3906592/ (Theme A)
- Team meeting in a conference room – Tiger Lily, https://www.pexels.com/photo/employees-having-a-meeting-inside-the-conference-room-7108454/ (Theme B)
All are stored locally as WebP (each under 250 KB) – nothing is hotlinked.

Notes
-----
- The enquiry form uses FormSubmit (https://formsubmit.co). The first submission sends an
  activation email to mail@abinitioindia.com; it must be confirmed once before enquiries arrive.
- Two article slugs are longer than Windows' 260-character path limit allows by default.
  On Windows, clone with:  git config --global core.longpaths true

Content, logos, team photos and article images are taken from the current abinitioindia.com website.
Prepared by Prashant Kumar
