# ochirtulga · portfolio

One page. No framework, no build step, no dependencies beyond three webfonts.

- `index.html` · all content
- `styles.css` · design tokens at the top; everything derives from them
- `script.js` · scroll fill for the vertical-script column, days-in-service count, font fallback check
- `profile.jpg` · portrait, 640px wide (resized from the old portfolio repo)

## Run locally

Any static server, e.g.:

```sh
python3 -m http.server 4173
```

## Deploy

Copy the three files (plus this README if you like) into the `ochirtulga.github.io`
repo and push · GitHub Pages serves it as-is.

## Note

The left column is "N. Ochirtulga" (ᠨ. ᠣᠴᠢᠷᠲᠤᠯᠭᠠ) in traditional Mongolian script,
rendered with Noto Sans Mongolian. Verify the shaping reads correctly before
deploying · if it ever fails to load, the page swaps in a plain progress rule.
