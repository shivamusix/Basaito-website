# Basaito website

Static site, no build step. Deployed via Cloudflare Pages, connected to this repo.

## File structure

```
index.html         All page content, in the 9 sections described in the dev brief
css/style.css       Design system (colors, type, spacing) + all component/layout styles
js/main.js          Nav, mobile menu, scroll reveal, active-link highlighting, FAQ accordion, tracking
assets/             Favicon, OG share image, (add photos/logo here)
robots.txt
sitemap.xml
```

## Editing copy

Open `index.html` and edit the text directly inside each `<section>` — they're ordered and commented to match the developer brief (Hero, Channel strip, The problem, Services, The Basaito Loop, How we work, Founder + track record, FAQ, Final CTA). There's no CMS; every edit is a direct HTML edit.

## Still to plug in before launch

- **Booking link** — set `BOOKING_URL` at the top of `js/main.js` to the real Cal.com / Calendly link. Until then, audit buttons don't navigate anywhere (they still fire tracking).
- **Tracking IDs** — GA4, Meta Pixel and LinkedIn Insight Tag snippets are in `index.html` `<head>`, commented out. Fill in the real IDs and remove the surrounding `<!-- -->`.
- **Logo** — currently a text wordmark ("Basaito."). Drop an SVG into `assets/` and swap it into the `.nav__logo` and `.footer__logo` markup if a real logo is provided.
- **Founder photo** — `.about__photo` currently shows a placeholder initial. Replace with `<img src="assets/shivam.jpg" alt="Shivam, founder of Basaito" loading="lazy">`.
- **Instagram handle** — footer link currently points to `#`.
- **Social share image** — `assets/og-image.png` is a generated placeholder in the brand colors; swap for a designed one if wanted.

## Deploying

Cloudflare Pages project `basaito-website` builds straight from this repo with no build command (output directory = root). Push to `main` to publish to `basaito.com`; any other branch gets its own preview URL at `<branch>.basaito-website.pages.dev`.
