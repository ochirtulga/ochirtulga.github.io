# Ochi — Reliable, by design.

Personal portfolio of Ochirtulga Namjim, a software engineer from Mongolia, based in Austin.

Live at [ochirtulga.github.io](https://ochirtulga.github.io/).

## The site

A buildless static website with direct About, Work, Education, and Hobbies navigation; three books with clickable contents and eleven story chapters; six selectable engineering stories with diagram chapters; a seasonal tree with leaf stories; and an original playable game cartridge.

- `index.html`, `styles.css`, `app.js`: content, layout, general navigation, and footer.
- `book-stories.js`, `book-reader.js`, `book-reader.css`: the three volumes, contents, narrative chapters, pagination, and media actions.
- `tree.css`, `tree.js`: the seasonal SVG tree and interactive stories.
- `weather.css`, `weather.js`: seasonal weather behind the tree, with pause and reduced-motion support.
- `game.css`, `game.js`: the Leaf keeper cartridge, game, and end-of-round leaderboard.
- `game-config.js`: the public leaderboard API address; contains no secrets.
- `architecture.css`, `architecture.js`: the desktop story index, mobile picker, directional diagrams, chapter progress, result shortcut, and automatic/manual playback.
- `architecture-stories.js`: five additional problem-solving stories, each with Situation, Challenge, Approach, and Result chapters.
- `experience.css`: the always-visible vertical career timeline with dates, roles, project/story links, and résumé download.
- `education.css`, `flags/`: degree records, the country study journey, visible certification groups, and local flag SVGs with their MIT license.
- `ink/`, `fonts/`: original pen-outline SVGs and the self-hosted Kalam handwriting font with its SIL Open Font License.
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

The caption sits inside the bottom border of the photo frame. The tree opens in the current calendar season on every page load, using the visitor’s local month and Northern Hemisphere seasons. Manual season choices apply during the visit; **Use today's season** returns to the calendar.

Seasonal weather sits behind the tree: spring rain/clouds, summer sunshine, autumn wind/leaves, and winter snow. **Pause weather** keeps motion paused across season switches. Animations also pause offscreen and in hidden tabs. Reduced-motion preferences show a static scene with no motion control. Weather is decorative and uses no location or weather service.

## Portfolio navigation

The **Portfolios** header menu identifies this site as **The garden**. The second portfolio is marked **Coming soon** while it is being planned. When it is built, replace that disabled entry with its URL and add a link back to this site in the second portfolio.

## Shared mini-game leaderboard

Leaf keeper asks for an optional nickname before its 25-second round. Completed ranked rounds are saved to https://ochi-leaf-keeper-api.ochro.chatgpt.site and the top ten appears after play. Each browser identifier has one personal-best entry; blank nicknames become Anonymous. The game clearly explains that nicknames and best scores are public.

The API runs separately on Cloudflare Workers with D1 through Sites. The database is never accessed directly from this static website. Server-issued round tokens, time and score limits, and idempotent submissions prevent duplicate scores. The game remains playable as an explicitly unranked round if the shared service is unavailable. These checks support a casual game and do not prove every catch was made by a human.

## Education

The education section shows full degree levels, subjects, institutions, country flags with text labels, and links to official university sites. A Mongolia–United States study journey replaces the old root illustration. All four certifications are visible, grouped into cloud (Amazon Web Services), data (DataStax), and IT governance (ISACA). The degree names follow the original portfolio; country labels are verified against the institutions’ official sites. SVG flags are from [flag-icons](https://github.com/lipis/flag-icons), distributed under the included MIT license.

## Three books

**Professional career** links six strengths—system design, problem solving, trade-offs/tools, automation, learning quickly, and ownership—to six real stories. It includes the owner's data-retention setback and the lesson of designing retention and backups with stakeholder needs. The roughly one-week main-table need is contextual to that experience. **Hobby projects** contains Bookworm, the garden, and Leaf keeper. **Freelance & temporary work** contains Express Window and Stellar AI.

The native reader has clickable contents, chapter headings, previous/next navigation, and page counts. Desktop shows contents beside the reading page; mobile switches between them. Chapters use Situation, Decisions, Outcome, and Lesson. Media pauses on chapter changes, contents navigation, and close. Bookworm's sample-data walkthrough and Express Window's website action are preserved. Architecture links close the reader, select the appropriate diagram story, and hand over keyboard focus. Escape/close returns focus to the opener.

## Work timeline

**Where I've worked** is a vertical timeline (`#work-timeline`) with seven roles across six date nodes, newest first. The two 2017 roles share a node because their within-year order is unknown. Dates sit in a desktop gutter and move above the role on phones. Story buttons open the matching book at its relevant chapter; the résumé download serves the unchanged PDF. The work history remains visible without JavaScript.

## Engineering stories

The migration story starts with the RabbitMQ/.NET monolith and a database server shared with other systems. The next chapters cover scaling and maintenance constraints, Kafka messaging, the Spring Boot service, Cassandra storage, and the guaranteed SLA result. The downtime figures are SLA guarantees, not measured outage totals.

Five more stories draw on the original résumé: behavioral loan scoring (approval time from 3 days to 3 hours), asynchronous order history (50% lower API response time), pipeline setup (roughly 3–4 errors per 10 runs to 1), the distributed data platform (approximately 50% lower licensing costs), and AI engineering tasks with objective automated verification. Each follows Situation, Challenge, Approach, and Result. Component diagrams avoid implying an undocumented deployment topology.

The desktop index shows all six stories and their organizations; smaller screens use a native picker. Numbered chapters show progress, **See the result** opens the final chapter, and directional arrows follow the diagram flow horizontally on desktop and vertically on phones. Component layouts avoid implying an undocumented order.

The section uses an engineering-notebook design with hand-drawn SVG outlines and arrows, graph paper, handwritten headings and diagram labels, and highlighted results. The self-hosted Kalam font is distributed under the included SIL Open Font License; body text and navigation use the site's standard type.

The selected story advances every ten seconds while visible and loops within that story. Selecting another story starts at chapter 1 and pauses automatic playback. Manual chapter selection, hovering the chapter body, and keyboard focus also pause it for reading. Explicit Play resumes from the controls. Reduced-motion preferences start it paused. Chapter panels keep controls steady across desktop and mobile.

Tree story leaves use subdued colors and soft idle halos, with stronger hover, focus, and selected states. Transparent touch targets are retained.
