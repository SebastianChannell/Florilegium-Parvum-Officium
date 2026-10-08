# Existing sites inspected

Read-only temporary clones:

- `SebastianChannell/Florilegium-Officium`, commit `4bf602121da1a8c8c84a86a841fa0d37463c9aff`.
- `SebastianChannell/Florilegium`, commit `c1c1da47342a10c74186dc7b40ec929df06d5131`.

Officium uses static `public/` HTML/CSS/JS on Cloudflare Pages; background `#070606`, purple `#8451cf`, warm text, compact hour controls, platform UI fonts, Iowan Old Style/Palatino/Georgia prayer text, and adjacent Latin/English cells. Its DO content/API/server integration was not reused.

Parvum Officium reuses those visual conventions, the exact existing Sites menu destinations, and the Domus purple-cross favicon. Gold `#D7AA62` distinguishes prayer headings/references. Shared prayer rows use CSS grid. No other repository was modified, and no new navigation destination/domain was invented.

Cloudflare Pages with `public` output is the established hosting convention. This new repository had no hosting binding; none was created. No deployment or DNS change occurred.
