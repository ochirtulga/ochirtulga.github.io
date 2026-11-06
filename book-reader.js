(() => {
  'use strict';
  const books = Array.isArray(window.OCHI_BOOKS) ? window.OCHI_BOOKS : [];
  const dialog = document.getElementById('project-dialog');
  if (!dialog || !books.length) return;
  const byId = id => document.getElementById(id);
  const page = byId('book-page');
  const toc = byId('book-toc');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 760px)');
  const aliases = { banking: ['career', 'notifications'], bookworm: ['hobbies', 'bookworm'], window: ['independent', 'express-window'] };
  const volumes = { career: 'Volume I', hobbies: 'Volume II', independent: 'Volume III' };
  const kinds = { success: 'Result & lesson', learning: 'Learning note', project: 'Project story', setback: 'Setback & lesson' };
  let book = books[0];
  let current = -1;
  let opener = null;
  let afterClose = null;
  let pageAnimation = null;
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function stopMedia(reset = true) {
    page.querySelectorAll('video').forEach(video => { video.pause();if (reset && video.readyState > 0) video.currentTime = 0; });
  }
  function setContents(open, focus = false) {
    if (open) stopMedia(false);
    dialog.dataset.contentsOpen = String(open);
    byId('book-contents-toggle').setAttribute('aria-expanded', String(open));
    byId('book-contents-toggle').textContent = open ? 'Read' : 'Contents';
    byId('book-contents-toggle').setAttribute('aria-label', open ? 'Read the current page' : 'Show table of contents');
    if (open && focus) toc.querySelector('[aria-current="page"]')?.focus();
  }
  function actionButton(text, callback) {
    const button = element('button', 'book-action', text);
    button.type = 'button';
    button.addEventListener('click', callback);
    return button;
  }
  function leaveBook(callback) {
    afterClose = callback;
    dialog.close();
  }
  function revealSection(id, focusSelector) {
    const target = byId(id);
    if (!target) return;
    if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    const focus = target.querySelector(focusSelector);
    const destination = id === 'hobbies' && focus ? focus.closest('#game-cartridge') || focus : target;
    destination.scrollIntoView({ block: id === 'hobbies' ? 'center' : 'start', behavior: motion.matches ? 'auto' : 'smooth' });
    if (focus) { if (!focus.matches('button,a,input')) focus.tabIndex = -1;focus.focus({ preventScroll: true }); }
  }
  function addDemo(actions) {
    const demo = element('section', 'book-demo');
    demo.id = 'project-demo';
    demo.hidden = true;
    demo.setAttribute('aria-label', 'Bookworm app walkthrough');
    demo.append(element('h4', '', 'Bookworm in action.'));
    const video = element('video');
    video.id = 'bookworm-video';
    video.controls = true;
    video.playsInline = true;
    video.preload = 'none';
    video.poster = 'media/bookworm-poster.jpg';
    const source = element('source');
    source.src = 'media/bookworm-demo.mp4';source.type = 'video/mp4';
    video.append(source);
    demo.append(video, element('p', 'book-demo-caption', 'Local app walkthrough · Sample data'));
    const watch = actionButton('Watch the demo', () => {
      demo.hidden = !demo.hidden;
      watch.textContent = demo.hidden ? 'Watch the demo' : 'Hide the demo';
      watch.setAttribute('aria-expanded', String(!demo.hidden));
      if (demo.hidden) video.pause();
      else { video.play().catch(() => {});demo.scrollIntoView({ block: 'nearest', behavior: motion.matches ? 'auto' : 'smooth' }); }
    });
    watch.id = 'project-watch';watch.setAttribute('aria-controls', demo.id);watch.setAttribute('aria-expanded', 'false');
    actions.append(watch);
    return demo;
  }
  function renderPage() {
    stopMedia();
    pageAnimation?.cancel();
    page.replaceChildren();
    const chapter = book.chapters[current];
    const heading = element('h3', 'book-page-title', chapter?.title || book.subtitle);
    heading.id = 'book-page-title';heading.tabIndex = -1;
    page.append(element('p', 'book-page-context', chapter ? chapter.context : 'Introduction'), heading);
    page.append(element('p', 'book-summary', chapter?.summary || book.intro));
    if (!chapter) {
      if (book.strengths?.length) {
        const strengths = element('ul', 'book-strengths');strengths.setAttribute('role', 'list');
        book.strengths.forEach(strength => {
          const item = element('li');
          const button = actionButton('', () => goTo(book.chapters.findIndex(value => value.id === strength.chapterId), true));
          button.className = 'book-strength-link';
          button.append(element('strong', '', strength.title), element('span', '', strength.text), element('small', '', 'Read the story ↗'));
          item.append(button);strengths.append(item);
        });
        page.append(strengths);
      } else {
        const invitation = element('div', 'book-opening-note');
        invitation.append(element('p', '', 'Each chapter follows the situation, the decisions, the outcome, and the lesson.'), element('p', 'book-hand-note', 'Choose a chapter from the contents.'));
        page.append(invitation);
      }
    } else {
      const meta = element('div', 'book-story-meta');
      meta.append(element('span', 'book-story-kind', kinds[chapter.kind] || 'Story'));
      if (chapter.skills?.length) meta.append(element('span', 'book-story-skills', chapter.skills.join(' / ')));
      page.append(meta);
      const actions = element('div', 'book-actions');
      let demo = null;
      if (chapter.demo) demo = addDemo(actions);
      if (chapter.url) {
        const visit = element('a', 'book-action', 'Visit the website ↗');
        visit.id = 'project-visit';visit.href = chapter.url;visit.target = '_blank';visit.rel = 'noopener noreferrer';actions.append(visit);
      }
      if (chapter.architectureStory) {
        const sketch = actionButton('See the architecture ↗', () => leaveBook(() => window.dispatchEvent(new CustomEvent('ochi:open-architecture-story', { detail: { id: chapter.architectureStory } }))));
        sketch.dataset.bookArchitecture = chapter.architectureStory;actions.append(sketch);
      }
      if (chapter.linkedSection) actions.append(actionButton(chapter.linkedSection === 'game' ? 'Find the game cartridge ↗' : 'Explore the garden ↗', () => leaveBook(() => revealSection(chapter.linkedSection === 'game' ? 'hobbies' : 'home', chapter.linkedSection === 'game' ? '.gk-play' : 'h1'))));
      if (actions.childElementCount) page.append(actions);
      const prose = element('div', 'book-prose');
      chapter.sections.forEach(section => {
        const block = element('section');block.append(element('h4', '', section.heading));
        section.paragraphs.forEach(paragraph => block.append(element('p', '', paragraph)));
        prose.append(block);
      });
      page.append(prose);
      if (chapter.outcome) {
        const result = element('div', 'book-result');
        result.append(element('span', '', chapter.outcome.label), element('strong', '', chapter.outcome.value));page.append(result);
      }
      if (demo) page.append(demo);
    }
    toc.querySelectorAll('.book-toc-button').forEach(button => {
      if (Number(button.dataset.chapterIndex) === current) button.setAttribute('aria-current', 'page');else button.removeAttribute('aria-current');
    });
    byId('book-prev').disabled = current < 0;
    byId('book-next').disabled = current === book.chapters.length - 1;
    byId('book-next').firstChild.textContent = current < 0 ? 'Start reading ' : current === book.chapters.length - 1 ? 'End of book ' : 'Next chapter ';
    byId('book-page-count').textContent = current < 0 ? 'Introduction' : 'Chapter ' + (current + 1) + ' of ' + book.chapters.length;
    page.scrollTop = 0;
  }
  function goTo(index, manual = false) {
    if (index < -1 || index >= book.chapters.length) return;
    current = index;
    renderPage();
    if (manual) {
      setContents(false);
      byId('book-page-title').focus({ preventScroll: true });
      byId('book-announcement').textContent = current < 0 ? 'Introduction.' : 'Chapter ' + (current + 1) + ' of ' + book.chapters.length + '.';
      if (!motion.matches && typeof page.animate === 'function') pageAnimation = page.animate([{ opacity: .45, transform: 'translateX(8px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 160, easing: 'ease-out' });
    }
  }
  function buildContents() {
    const entries = [{ title: 'Introduction', summary: 'A note before the stories' }, ...book.chapters];
    toc.replaceChildren(...entries.map((entry, index) => {
      const item = element('li');
      const button = element('button', 'book-toc-button');button.type = 'button';button.dataset.chapterIndex = String(index - 1);
      const copy = element('span', 'book-toc-copy');copy.append(element('span', 'book-toc-title', entry.title));
      if (index) copy.append(element('small', '', kinds[entry.kind] || 'Story'));
      const leader = element('span', 'book-toc-leader');leader.setAttribute('aria-hidden', 'true');
      const number = element('span', 'book-toc-number', index ? String(index).padStart(2, '0') : '—');number.setAttribute('aria-hidden', 'true');
      button.append(copy, leader, number);button.addEventListener('click', () => goTo(index - 1, true));item.append(button);return item;
    }));
    byId('book-chapter-count').textContent = book.chapters.length + (book.chapters.length === 1 ? ' chapter' : ' chapters');
  }
  function openBook(id, source, chapterId) {
    const selected = (chapterId && books.find(value => value.chapters.some(chapter => chapter.id === chapterId))) || books.find(value => value.id === id);
    if (!selected || !selected.chapters?.length) return;
    book = selected;opener = source;afterClose = null;
    dialog.dataset.book = book.id;dialog.dataset.theme = book.theme;
    byId('book-volume').textContent = volumes[book.id] || 'Selected stories';
    byId('project-dialog-title').textContent = book.title;
    byId('book-announcement').textContent = '';
    buildContents();
    goTo(chapterId ? book.chapters.findIndex(value => value.id === chapterId) : -1);
    setContents(!chapterId);
    dialog.showModal();document.body.classList.add('dialog-open');
    byId(chapterId ? 'book-page-title' : 'project-dialog-title').focus({ preventScroll: true });
  }
  document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', () => openBook(button.dataset.book, button, button.dataset.bookChapter)));
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const alias = aliases[button.dataset.project];
    if (!alias) return;
    const containingBook = books.find(value => value.chapters.some(chapter => chapter.id === alias[1]));
    openBook(containingBook?.id || alias[0], button, alias[1]);
  }));
  byId('book-prev').addEventListener('click', () => goTo(current - 1, true));
  byId('book-next').addEventListener('click', () => goTo(current + 1, true));
  byId('book-contents-toggle').addEventListener('click', () => {
    const open = dialog.dataset.contentsOpen !== 'true';setContents(open, open);
    if (!open) byId('book-page-title').focus({ preventScroll: true });
  });
  byId('close-project').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    stopMedia();pageAnimation?.cancel();document.body.classList.remove('dialog-open');
    const next = afterClose;afterClose = null;
    if (next) window.requestAnimationFrame(next);else opener?.focus({ preventScroll: true });
  });
  const onResize = () => byId('book-contents-toggle').setAttribute('aria-expanded', String(!mobile.matches || dialog.dataset.contentsOpen === 'true'));
  if (mobile.addEventListener) mobile.addEventListener('change', onResize);
})();
