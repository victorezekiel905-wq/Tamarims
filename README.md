# Tamarims D Place

Website for Tamarims D Place (Tamarims Play Centre), Awoyaya, Ibeju-Lekki, Lagos.

Plain HTML, CSS and JavaScript with no build step. Open `index.html` in a browser or upload the folder to any static host.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home: video hero, attractions, parties, reviews, hours and map |
| `play.html` | Things to do: soft play, trampoline, bowling, VR, arcade, snooker, kiddie rides, extras |
| `parties.html` | Parties and events, with an enquiry form that opens WhatsApp |
| `gallery.html` | Filterable photo and video gallery with a lightbox |
| `visit.html` | Opening hours, address, map, FAQs and a contact form |
| `404.html` | Not found page |

## Assets

- `assets/css/style.css`: all styles
- `assets/js/main.js`: menu, hero video, live open or closed status (Lagos time), reveals, gallery, forms
- `assets/logo/`: vector logo redrawn from the brand artwork (`logo.svg`, `logo-white.svg`, `mark.svg`, `mark-white.svg`)
- `assets/video/`: silent loops cut from the Tamarims Instagram reels, with `.webp` posters
- `assets/img/`: photos from the Tamarims Facebook page and stills from the reels; `map.webp` uses OpenStreetMap data
- `assets/fonts/`: Cabinet Grotesk and Satoshi (Fontshare, free for commercial use)

## Things to update

- The WhatsApp number used by the forms and buttons is set in `assets/js/main.js` (`WHATSAPP`) and in each page's `wa.me` links.
- Opening hours are in the pages and in the `status()` function in `assets/js/main.js`.
- When a domain is live, check the canonical and Open Graph URLs (currently `https://tamarims.com`) and `sitemap.xml`.
