# Ochi — Reliable, by design.

Personal portfolio of Ochirtulga Namjim, a software engineer from Mongolia, based in Austin.

Live at [ochirtulga.github.io](https://ochirtulga.github.io/).

## The site

A buildless static website with direct About, Work, Education, and Hobbies navigation; book-shaped project case studies; an interactive architecture diagram; a seasonal tree with leaf stories; and an original playable game cartridge.

- `index.html`, `styles.css`, `app.js`: content, layout, and project interactions.
- `tree.css`, `tree.js`: the seasonal SVG tree and interactive stories.
- `game.css`, `game.js`: the Leaf keeper cartridge and game.
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
