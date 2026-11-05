# Ochi — Reliable, by design.

Personal portfolio of Ochirtulga Namjim, a software engineer from Mongolia, based in Austin.

Live at [ochirtulga.github.io](https://ochirtulga.github.io/).

## The site

A buildless static website with direct About, Work, Education, and Hobbies navigation; book-shaped project case studies; an automatically advancing architecture story; a seasonal tree with leaf stories; and an original playable game cartridge.

- `index.html`, `styles.css`, `app.js`: content, layout, and project interactions.
- `tree.css`, `tree.js`: the seasonal SVG tree and interactive stories.
- `game.css`, `game.js`: the Leaf keeper cartridge, game, and end-of-round leaderboard.
- `game-config.js`: the public leaderboard API address; contains no secrets.
- `architecture.css`, `architecture.js`: six chapters explaining the notification-service migration, with automatic and manual playback.
- `hobbies.css`: the illustrated food, travel/adventure, and basketball pursuits.
- `portrait-lights.jpeg`: the uploaded purple-light portrait in About.
- `resume.pdf`: the original résumé PDF, included unchanged.
- `media/bookworm-demo.mp4`, `media/bookworm-poster.jpg`: a local Bookworm app walkthrough using sample data.

## Run locally

```sh
python3 -m http.server 4173
```

Open http://localhost:4173. No installation or build step is needed.

## Publish

GitHub Pages serves the `main` branch from the repository root. Commit and push site changes; `.nojekyll` enables direct static hosting.

## Replace the portrait

Replace `portrait-lights.jpeg` and push. The About portrait uses `object-fit: cover`; adjust `.portrait img`'s `object-position` in `styles.css` if the new crop needs changing. Update the intrinsic dimensions in `index.html` for a replacement image.

## Portfolio navigation

The **Portfolios** header menu identifies this site as **The garden**. The second portfolio is marked **Coming soon** while it is being planned. When it is built, replace that disabled entry with its URL and add a link back to this site in the second portfolio.

## Shared mini-game leaderboard

Leaf keeper asks for an optional nickname before its 25-second round. Completed ranked rounds are saved to https://ochi-leaf-keeper-api.ochro.chatgpt.site and the top ten appears after play. Each browser identifier has one personal-best entry; blank nicknames become Anonymous. The game clearly explains that nicknames and best scores are public.

The API runs separately on Cloudflare Workers with D1 through Sites. The database is never accessed directly from this static website. Server-issued round tokens, time and score limits, and idempotent submissions prevent duplicate scores. The game remains playable as an explicitly unranked round if the shared service is unavailable. These checks support a casual game and do not prove every catch was made by a human.

## Architecture story

The migration story starts with the RabbitMQ/.NET monolith and a database server shared with other systems. The next chapters cover scaling and maintenance constraints, Kafka messaging, the Spring Boot service, Cassandra storage, and the guaranteed SLA result. The downtime figures are SLA guarantees, not measured outage totals.

The story advances every ten seconds while visible. Selecting a chapter pauses automatic playback; hover and keyboard focus also pause it for reading. Reduced-motion preferences start it paused. The six chapters keep a stable layout across desktop and mobile.
