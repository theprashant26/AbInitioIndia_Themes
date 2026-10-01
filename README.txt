Ab Initio India – Website theme options
=======================================
Three static website themes, built with Bootstrap 5.3, Bootstrap Icons and GSAP
(same stack as the Ab Initio Legal site). All libraries are included locally.
No build step: every page is plain HTML/CSS/JS.

Theme-A-Heritage      Ink black + antique gold, Cormorant Garamond / Manrope (matches Ab Initio Legal)
Theme-B-Brand-Blue    Logo blue #1552A1 + sunflower #FACF00, Plus Jakarta Sans
Theme-C-Crimson-Gold  Ivory, crimson and gold, DM Serif Display / DM Sans

Live preview: https://theprashant26.github.io/AbInitioIndia_Themes/
(the root index.html is a chooser page linking to all three themes)

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

Images live in each theme's assets/img (team/, mentors/, services/, insights/, pages/),
so every theme folder is fully self-contained.

Notes
-----
- The enquiry form uses FormSubmit (https://formsubmit.co). The first submission sends an
  activation email to mail@abinitioindia.com; it must be confirmed once before enquiries arrive.
- Two article slugs are longer than Windows' 260-character path limit allows by default.
  On Windows, clone with:  git config --global core.longpaths true

Content, logos and images are taken from the current abinitioindia.com website.
Prepared by Prashant Kumar
