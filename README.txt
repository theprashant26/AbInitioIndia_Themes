Ab Initio India – Website theme options
=======================================
Three static website themes with a glassmorphism signature style, each with its own layout.
Built with Bootstrap 5.3, Bootstrap Icons, GSAP and ScrollTrigger (all included locally).
No build step: every page is plain HTML/CSS/JS.

Theme-A-Heritage      "Ivory Gold Glass"     – light luxury editorial: ivory, champagne, soft gold hairlines,
                      Cormorant Garamond / Manrope, sharp corners. Asymmetric hero with an arched photo of
                      Lutyens' Delhi, logo marquee between gold hairlines, compact two-column services list,
                      arched team portraits, magazine insights, deep warm-ink footer.
Theme-B-Brand-Blue    "Aurora Brand Glass"   – blue #1552A1 + sunflower #FACF00 aurora, Plus Jakarta Sans
                      Split hero with a floating bento cluster, bento services grid with hover tilt,
                      "How we work" process timeline, filterable insights grid.
Theme-C-Crimson-Gold  "Royal Crimson Glass"  – launch-ready version. Crimson feature bands (hero, banners,
                      services, testimonial, CTA, footer) alternate with ivory/sand content sections;
                      DM Serif Display / DM Sans self-hosted. India Gate hero, client-logo marquee, real
                      stats band (186% / 8470 / 270), services tabs (accordion on mobile), testimonial
                      panel, team teaser, insights with featured article + filter + search + load more,
                      article pages with lightbox and share row, contact form with inline validation.

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
ScrollTrigger (loaded after the page is idle, desktop only) for the Theme B and Theme C hero parallax.
Content is visible by default: the "hidden before reveal" state only applies once a script adds
.motion to <html>; anything already on screen is revealed at once, and a 1.5 s safety timer reveals
everything. All non-essential motion is off under prefers-reduced-motion.

Theme C – launch notes
----------------------
Everything below lives inside Theme-C-Crimson-Gold/ and needs only Python 3.8+.

1. Critical CSS (fast first paint)
   Each page inlines the CSS for its first screen and loads the full style.css without
   blocking. The inlined parts are the blocks in assets/css/style.css marked
   "critical:<name>:start" … "critical:<name>:end". After editing any marked block run:
       python scripts/build-critical.py
   (the page → block mapping is at the top of that script).

2. Redirects from the old WordPress URLs (keeps Google rankings)
   redirects.csv maps every old abinitioindia.com URL (all pages, the 38 articles, team
   profiles, services, blog, categories/tags, old theme-demo pages) to its new page.
   To regenerate the server files after editing the CSV:
       python scripts/build-redirects.py
   Apache: upload .htaccess with the site to the web root (needs mod_alias, standard).
   nginx: put the map {} block from nginx-redirects.conf in the http {} context and add
          if ($abinitio_redirect) { return 301 $abinitio_redirect; }  inside the server {} block.
   Test after launch: https://abinitioindia.com/our-team/ should 301 to /team.html.

3. Canonical URLs
   Every page's canonical, og:url, og:image and structured-data URLs point to the final
   address https://abinitioindia.com/... (so the GitHub Pages preview is never treated as
   the original). To change the domain, edit BASE_URL in scripts/set-base-url.py and run:
       python scripts/set-base-url.py
   Note: sitemap.xml was left unchanged for the preview; regenerate it on the live domain at launch.

4. Structured data: Organization (ProfessionalService with address, phone, email, hours and
   social profiles) on the home, about and contact pages; Article on every insight.

Photo credits (free to use under the Pexels licence, https://www.pexels.com/license/)
-------------------------------------------------------------------------------------
- Lutyens' Delhi government building (listed on Pexels as "Rashtrapati Bhavan in Delhi") – Maahid Photos, https://www.pexels.com/photo/rashtrapati-bhavan-in-delhi-3881113/ (Theme A)
- Boardroom table and chairs – Leandro Alamino, https://www.pexels.com/photo/black-leather-office-rolling-chairs-beside-brown-wooden-table-3906592/ (Theme A)
- Team meeting in a conference room – Tiger Lily, https://www.pexels.com/photo/employees-having-a-meeting-inside-the-conference-room-7108454/ (Theme B)
- India Gate at sunset – Saurabh Kumar, https://www.pexels.com/photo/people-near-the-india-gate-during-sunset-6472566/ (Theme C)
- Modern conference room – Fahad Puthawala, https://www.pexels.com/photo/modern-conference-room-with-professional-setup-32168739/ (Theme C)
All are stored locally as WebP (each under 250 KB) – nothing is hotlinked.

Notes
-----
- The enquiry form uses FormSubmit (https://formsubmit.co). The first submission sends an
  activation email to mail@abinitioindia.com; it must be confirmed once before enquiries arrive.
- Two article slugs are longer than Windows' 260-character path limit allows by default.
  On Windows, clone with:  git config --global core.longpaths true

Content, logos, team photos and article images are taken from the current abinitioindia.com website.
Prepared by Prashant Kumar
