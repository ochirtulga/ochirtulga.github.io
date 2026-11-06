# Ochi — Reliable, by design.

Personal portfolio of Ochirtulga Namjim, a software engineer from Mongolia, based in Austin.

Live at [ochirtulga.github.io](https://ochirtulga.github.io/).

## The site

A buildless static website with direct About, Work, Education, and Hobbies navigation; three books with clickable contents and eleven story chapters; six selectable engineering stories with 28 diagram chapters; a seasonal tree with leaf stories; and an original playable game cartridge.

- `index.html`, `styles.css`, `app.js`: content, layout, general navigation, and footer.
- `book-stories.js`, `book-reader.js`, `book-reader.css`: the three volumes, contents, narrative chapters, pagination, and media actions.
- `tree.css`, `tree.js`: the seasonal SVG tree and interactive stories.
- `weather.css`, `weather.js`: seasonal weather behind the tree, with pause and reduced-motion support.
- `game.css`, `game.js`: the Leaf keeper cartridge, game, and end-of-round leaderboard.
- `game-config.js`: the public leaderboard API address; contains no secrets.
- `architecture.css`, `architecture.js`: the desktop story index, mobile picker, directional diagrams, chapter progress, result shortcut, and automatic/manual playback.
- `architecture-stories.js`: five additional problem-solving stories, including the six-step AI evaluation workflow.
- `story-order.js`: shared relevance priority for the diagram story index and book chapters.
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

The caption sits inside the bottom border of the photo frame. The tree opens in the current calendar season on every page load, using the visitor’s local month and Northern Hemisphere seasons. Manual season choices apply during the visit; The calendar **Today** control returns to the calendar.

Seasonal weather sits behind the tree: spring rain/clouds, summer sunshine, autumn wind/leaves, and winter snow. The weather pause control keeps motion paused across season switches. Animations also pause offscreen and in hidden tabs. Reduced-motion preferences show a static scene with no motion control. Weather is decorative and uses no location or weather service.

The tree caption and 44px next-story button share one left-aligned strip. One compact toolbar groups the four seasons, the calendar Today control, and a weather pause/play icon. Utility controls keep accessible names and native tooltips; on phones the calendar is an icon. All controls have 44px touch targets.

## Portfolio navigation

The **Portfolios** header menu identifies this site as **The garden**. The second portfolio is marked **Coming soon** while it is being planned. When it is built, replace that disabled entry with its URL and add a link back to this site in the second portfolio.

## Shared mini-game leaderboard

Leaf keeper asks for an optional nickname before its 25-second round. Completed ranked rounds are saved to https://ochi-leaf-keeper-api.ochro.chatgpt.site and the top ten appears after play. Each browser identifier has one personal-best entry; blank nicknames become Anonymous. The game clearly explains that nicknames and best scores are public.

The API runs separately on Cloudflare Workers with D1 through Sites. The database is never accessed directly from this static website. Server-issued round tokens, time and score limits, and idempotent submissions prevent duplicate scores. The game remains playable as an explicitly unranked round if the shared service is unavailable. These checks support a casual game and do not prove every catch was made by a human.

## Education

The education section shows full degree levels, subjects, institutions, country flags with text labels, and links to official university sites. A Mongolia–United States study journey replaces the old root illustration. All four certifications are visible, grouped into cloud (Amazon Web Services), data (DataStax), and IT governance (ISACA). The degree names follow the original portfolio; country labels are verified against the institutions’ official sites. SVG flags are from [flag-icons](https://github.com/lipis/flag-icons), distributed under the included MIT license.

## Three books

**Professional career** links six strengths—system design, problem solving, trade-offs/tools, automation, learning quickly, and ownership—to six real stories. It includes the owner's data-retention setback and the lesson of designing retention and backups with stakeholder needs. The roughly one-week main-table need is contextual to that experience. **Hobby projects** contains Leaf keeper, Bookworm, and the garden. **Freelance & temporary work** contains Stellar AI, then Express Window.

The native reader has clickable contents, chapter headings, previous/next navigation, and page counts. Desktop shows contents beside the reading page; mobile switches between them. Chapters use Situation, Decisions, Outcome, and Lesson. Media pauses on chapter changes, contents navigation, and close. Bookworm's sample-data walkthrough and Express Window's website action are preserved. Architecture links close the reader, select the appropriate diagram story, and hand over keyboard focus. Escape/close returns focus to the opener.

## Work timeline

**Where I've worked** is a vertical timeline (`#work-timeline`) with seven roles across six date nodes, newest first. The two 2017 roles share a node because their within-year order is unknown. Dates sit in a desktop gutter and move above the role on phones. Story buttons open the matching book at its relevant chapter; the résumé download serves the unchanged PDF. The work history remains visible without JavaScript.

## Engineering stories

The notification story has six chapters: Before, Challenges, Events, Routing, Delivery, and Result. It starts with RabbitMQ, a .NET monolith, and a shared database server. In the new architecture, a core transaction microservice produces records into a Kafka notification topic. Notification processing microservices consume this topic and publish category topics. Channel services consume their own topics with priority handling, send notifications, and record delivery success/failure in Cassandra. The repeated path represents each category/channel without inventing a count or channel names. The downtime figures are SLA guarantees, not measured outage totals.

Five more stories draw on the original résumé: behavioral loan scoring (approval time from 3 days to 3 hours), asynchronous order history (50% lower API response time), pipeline setup (roughly 3–4 errors per 10 runs to 1), the distributed data platform (approximately 50% lower licensing costs), and coding-agent evaluation built around real open-source PRs. The four non-AI stories follow Situation, Challenge, Approach, and Result. AI verification uses six chapters: Study, Tests, Brief, Hints, Runs, and Review. Component diagrams avoid implying an undocumented deployment topology.

The owner's expanded AI story starts with learning the codebase and PR, writing tests for a correct implementation, and preparing agent instructions. Tests run before and after implementation. Agents unable to complete the task without hints retry with guidance about pitfalls and the solution approach, without direct answers. Ten coding agents attempt the work; every output is reviewed, with feedback on failures and strengths. No success-rate improvement or parallel-execution claim is made.

`story-order.js` defines the relevance order: AI verification, notifications, order history, data platform, loan scoring, pipeline setup, data retention, Express Window, Leaf keeper, Bookworm, then the garden. Diagram lists and the initial selection follow it, as do book contents, pagination, and strength links within each volume. The three book themes retain their order; **Start with AI verification** opens the canonical AI chapter directly. The work timeline remains chronological. Tree story cycling starts with an AI note, retaining the nine original leaf positions and touch targets.

The desktop index shows all six stories and their organizations; smaller screens use a native picker. Numbered chapters show progress, **See the result** opens the final chapter, and directional arrows follow the diagram flow horizontally on desktop and vertically on phones. Component layouts avoid implying an undocumented order.

The section uses an engineering-notebook design with hand-drawn SVG outlines and arrows, graph paper, handwritten headings and diagram labels, and highlighted results. Original local symbols in `ink/architecture/` make the nodes recognizable: upright cylinder databases, app services, queues/topics, routing, distributed compute, processing, documents, validation, warnings, performance, cost, and delivery. Each node has an explicit semantic icon; the legend follows the current chapter. The full notification graph uses responsive nodes and measured SVG connections, with a branch from channel services to Cassandra separate from sending notifications. It redraws on resize and becomes a vertical flow on phones. The self-hosted Kalam font is distributed under the included SIL Open Font License; body text and navigation use the site's standard type.

The selected story advances every ten seconds while visible and loops within that story. Selecting another story starts at chapter 1 and pauses automatic playback. Manual chapter selection, hovering the chapter body, and keyboard focus also pause it for reading. Explicit Play resumes from the controls. Reduced-motion preferences start it paused. Simple chapters reserve reading space; the full notification diagram expands to keep its nodes and connections readable.

Tree story leaves use subdued colors and soft idle halos, with stronger hover, focus, and selected states. Transparent touch targets are retained.
