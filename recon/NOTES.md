# Recon: amazon.com (signed-out, 2026-10-02)

Account sign-up was not done by the agent (credential entry is off-limits for it). Only signed-out flows were observed.

## Surfaces observed
- **Header:** logo, "Deliver to" chip with a location popover, category dropdown plus search, language, "Hello, sign in / Account & Lists" flyout (Sign in button, "New customer? Start here"), Returns & Orders, cart with count. A second nav strip: All, Prime, Deals, ...
- **Home:** large category cards (Shop kitchen must-haves, beauty, fashion, toys), carousel arrows, then rows of 4-up cards with links.
- **Search results:** left filter rail (Popular Shopping Ideas, Customer Reviews "4 & Up", Brands checkboxes, Connectivity, ...). Sort dropdown (Featured). Result count line. Rows: image, title, rating + count, "10K+ bought in past month", Best Seller badge, "See options", colour/pattern variants link.
- **Product page:** breadcrumb, gallery with thumbnail column, title, brand store link, rating + review count, "Overall Pick" badge, colour swatches, buy box on the right (price, delivery, qty, Add to Cart / Buy Now, Add to List).

## Decisions
- Build: home, search + filters + sort, PDP, cart, checkout, order confirmation, orders, local auth, deliver-to.
- Leave out: Prime, seller, returns, reviews posting, real payments, recommendations ML.
- Stack: Vite + React + TS, HashRouter, localStorage persistence, GitHub Pages deploy.
