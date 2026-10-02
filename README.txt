Ab Initio India – Website theme options
=======================================
Three static website themes with a glassmorphism signature style, each with its own layout.
Built with Bootstrap 5.3, Bootstrap Icons, GSAP and ScrollTrigger (all included locally).
No build step: every page is plain HTML/CSS/JS.

Theme-A-Heritage      "Midnight Gold Glass"  – midnight + amber/gold light, Cormorant Garamond / Manrope
                      Full-viewport centred hero over India Gate at night, glass client-logo marquee,
                      sticky stacking service cards, editorial about/team layouts, magazine insights.
Theme-B-Brand-Blue    "Aurora Brand Glass"   – blue #1552A1 + sunflower #FACF00 aurora, Plus Jakarta Sans
                      Split hero with a floating bento cluster, bento services grid with hover tilt,
                      "How we work" process timeline, filterable insights grid.
Theme-C-Crimson-Gold  "Royal Crimson Glass"  – crimson-to-wine with gold light leaks, DM Serif Display / DM Sans
                      Full-bleed India Gate hero with a large glass panel, tabbed services, large glass
                      testimonial, insights carousel, mentors as tabs, insights grouped by year.

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
clients/, stock/ and v/ for resized WebP variants).

Motion
------
CSS hero entrance, IntersectionObserver section reveals, slow CSS background drift, and GSAP
ScrollTrigger (loaded after the page is idle) for the Theme B hero parallax, the Theme A stacking
cards and the Theme C hero parallax. All non-essential motion is off under prefers-reduced-motion.

Photo credits (free to use under the Pexels licence, https://www.pexels.com/license/)
-------------------------------------------------------------------------------------
- India Gate at night – Ranjeet Chauhan, https://www.pexels.com/photo/india-gate-in-new-delhi-at-night-19927020/ (Theme A)
- Boardroom table and chairs – Leandro Alamino, https://www.pexels.com/photo/black-leather-office-rolling-chairs-beside-brown-wooden-table-3906592/ (Theme A)
- Team meeting in a conference room – Tiger Lily, https://www.pexels.com/photo/employees-having-a-meeting-inside-the-conference-room-7108454/ (Theme B)
- India Gate at sunset – Ravi Roshan, https://www.pexels.com/photo/india-gate-in-new-delhi-at-sunset-16960242/ (Theme C)
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
