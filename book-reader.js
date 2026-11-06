(() => {
  'use strict';
  const priority = new Map((window.OCHI_STORY_ORDER || []).map((id, index) => [id, index]));
  const rank = id => priority.get(id) ?? Infinity;
  const books = Array.isArray(window.OCHI_BOOKS) ? window.OCHI_BOOKS.map(book => ({
    ...book,
    chapters: [...book.chapters].sort((a, b) => rank(a.id) - rank(b.id)),
    strengths: book.strengths ? [...book.strengths].sort((a, b) => rank(a.chapterId) - rank(b.chapterId)) : undefined
  })) : [];
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
  let leaf = 0;
  let leaves = [];
  let tocLeaves = [];
  let tocLeaf = 0;
  let opener = null;
  let afterClose = null;
  let pageAnimation = null;
  let body = null;
  let layoutTimer = 0;
  let layoutDirty = false;
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const chapter = () => book.chapters[current];
  const contentsVisible = () => !mobile.matches || dialog.dataset.contentsOpen === 'true';
  const readingVisible = () => !mobile.matches || dialog.dataset.contentsOpen !== 'true';
  function stopMedia(reset = true) {
    page.querySelectorAll('video').forEach(video => { video.pause();if (reset && video.readyState > 0) video.currentTime = 0; });
  }
  function announce() {
    byId('book-announcement').textContent = `${chapter()?.title || 'Introduction'} Page ${leaf + 1} of ${leaves.length}.`;
  }
  function focusPage() { byId('book-page-title')?.focus({ preventScroll: true }); }
  function setContents(open, focus = false) {
    if (open && mobile.matches) stopMedia(false);
    dialog.dataset.contentsOpen = String(open);
    const toggle = byId('book-contents-toggle');
    toggle.setAttribute('aria-expanded', String(!mobile.matches || open));
    toggle.textContent = open ? 'Read' : 'Contents';
    toggle.setAttribute('aria-label', open ? 'Read the current page' : 'Show table of contents');
    if (dialog.open) {
      if (open) buildContents();
      if (readingVisible() && (!leaves.length || layoutDirty) && !(leaves[leaf]?.kind === 'demo' && page.querySelector('video'))) paginate();
      if (focus) {
        if (open) toc.querySelector('[aria-current="page"]')?.focus();
        else focusPage();
      }
    }
  }
  function actionButton(text, callback) {
    const button = element('button', 'book-action', text);
    button.type = 'button';button.addEventListener('click', callback);return button;
  }
  function leaveBook(callback) { afterClose = callback;dialog.close(); }
  function revealSection(id, focusSelector) {
    const target = byId(id);
    if (!target) return;
    if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    const focus = target.querySelector(focusSelector);
    const destination = id === 'hobbies' && focus ? focus.closest('#game-cartridge') || focus : target;
    destination.scrollIntoView({ block: id === 'hobbies' ? 'center' : 'start', behavior: motion.matches ? 'auto' : 'smooth' });
    if (focus) { if (!focus.matches('button,a,input')) focus.tabIndex = -1;focus.focus({ preventScroll: true }); }
  }
  function actionsFor(data) {
    const actions = element('div', 'book-actions');
    if (data.demo) {
      const watch = actionButton('Watch the demo', () => {
        const target = leaves.findIndex(value => value.kind === 'demo');
        if (target >= 0) turnTo(target, true);
        page.querySelector('video')?.play().catch(() => {});
      });
      watch.id = 'project-watch';actions.append(watch);
    }
    if (data.url) {
      const visit = element('a', 'book-action', data.urlLabel || 'Visit the website ↗');
      visit.id = 'project-visit';visit.href = data.url;visit.target = '_blank';visit.rel = 'noopener noreferrer';actions.append(visit);
    }
    if (data.sourceUrl) {
      const source = element('a', 'book-action', 'View project source ↗');
      source.href = data.sourceUrl;source.target = '_blank';source.rel = 'noopener noreferrer';source.dataset.bookSource = '';actions.append(source);
    }
    if (data.architectureStory) {
      const sketch = actionButton('See the architecture ↗', () => leaveBook(() => window.dispatchEvent(new CustomEvent('ochi:open-architecture-story', { detail: { id: data.architectureStory } }))));
      sketch.dataset.bookArchitecture = data.architectureStory;actions.append(sketch);
    }
    if (data.linkedSection) actions.append(actionButton(data.linkedSection === 'game' ? 'Find the game cartridge ↗' : 'Explore the garden ↗', () => leaveBook(() => revealSection(data.linkedSection === 'game' ? 'hobbies' : 'home', data.linkedSection === 'game' ? '.gk-play' : 'h1'))));
    return actions;
  }
  function textUnit(type, key, text, extra = {}) {
    const words = text.trim().split(/\s+/u);
    return { type, key, words, start: 0, end: words.length, ...extra };
  }
  function unitsForChapter() {
    const data = chapter();
    if (!data) {
      const units = [textUnit('summary', 'intro', book.intro)];
      if (book.strengths?.length) book.strengths.forEach((strength, i) => units.push({ type: 'strength', key: 'strength-' + i, data: strength }));
      else units.push(textUnit('opening', 'opening', 'Each chapter follows the situation, the decisions, the outcome, and the lesson. Choose a story from the contents, or turn the page to begin.'));
      return units;
    }
    const units = [textUnit('summary', 'summary', data.summary), { type: 'meta', key: 'meta', data }, { type: 'actions', key: 'actions', data }];
    data.sections.forEach((section, s) => section.paragraphs.forEach((text, p) => units.push(textUnit('prose', `section-${s}-paragraph-${p}`, text, { section: s, paragraph: p, heading: section.heading }))));
    if (data.outcome) units.push({ type: 'result', key: 'result', data: data.outcome });
    return units;
  }
  function renderUnits(units) {
    body.dataset.pageKind = 'reading';
    body.replaceChildren();
    let strengthList = null;
    units.forEach((unit, i) => {
      let node;
      const value = unit.words?.slice(unit.start, unit.end).join(' ');
      if (unit.type === 'summary') node = element('p', 'book-summary', value);
      if (unit.type === 'opening') node = element('p', 'book-opening-note', value);
      if (unit.type === 'meta') {
        node = element('div', 'book-story-meta');
        node.append(element('span', 'book-story-kind', kinds[unit.data.kind] || 'Story'));
        if (unit.data.skills?.length) node.append(element('span', 'book-story-skills', unit.data.skills.join(' / ')));
      }
      if (unit.type === 'actions') node = actionsFor(unit.data);
      if (unit.type === 'prose') {
        node = element('div', 'book-prose');
        const section = element('section');
        const previous = units[i - 1];
        if (previous?.type !== 'prose' || previous.section !== unit.section) {
          const heading = element('h4', '', unit.heading);
          if (unit.start > 0 || unit.paragraph > 0) heading.append(element('span', 'book-continuation', ' continued'));
          section.append(heading);
        }
        section.append(element('p', '', value));node.append(section);
      }
      if (unit.type === 'result') {
        node = element('div', 'book-result');node.append(element('span', '', unit.data.label), element('strong', '', unit.data.value));
      }
      if (unit.type === 'strength') {
        if (!strengthList) { strengthList = element('ul', 'book-strengths');body.append(strengthList); }
        const item = element('li');
        node = actionButton('', () => goToChapter(book.chapters.findIndex(value => value.id === unit.data.chapterId), true));
        node.className = 'book-strength-link';
        node.append(element('strong', '', unit.data.title), element('span', '', unit.data.text), element('small', '', 'Read the story ↗'));
        item.append(node);strengthList.append(item);
      } else { strengthList = null;if (node) body.append(node); }
      if (node) { node.dataset.sourceKey = unit.key;node.dataset.wordStart = String(unit.start || 0);node.dataset.wordEnd = String(unit.end || 0); }
    });
  }
  const fits = () => body.scrollHeight <= body.clientHeight + 1 && body.scrollWidth <= body.clientWidth + 1;
  function bookmark() {
    const value = leaves[leaf];
    if (value?.kind === 'demo') return { kind: 'demo' };
    const first = value?.units[0];
    return first ? { key: first.key, start: first.start || 0 } : null;
  }
  function paginate(anchor = bookmark(), last = false) {
    if (!dialog.open || !readingVisible()) { layoutDirty = true;return; }
    stopMedia();pageAnimation?.cancel();
    const data = chapter();
    const header = element('div', 'book-page-header');
    const heading = element('h3', 'book-page-title', data?.title || book.subtitle);
    heading.id = 'book-page-title';heading.tabIndex = -1;
    header.append(element('p', 'book-page-context', data?.context || 'Introduction'), heading);
    body = element('div', 'book-page-body');
    page.replaceChildren(header, body);
    if (body.clientHeight < 1) { layoutDirty = true;return; }
    const queue = unitsForChapter();
    const result = [];
    let pending = [];
    const finish = () => { if (pending.length) result.push({ kind: 'reading', units: pending });pending = []; };
    while (queue.length) {
      const unit = queue[0];
      renderUnits([...pending, unit]);
      if (fits()) { pending.push(unit);queue.shift();continue; }
      if (pending.length) { finish();continue; }
      // Keep paragraphs together when they fit a fresh page. Long paragraphs are
      // split at word boundaries, with their section heading repeated on each leaf.
      if (unit.words && unit.end - unit.start > 1) {
        let low = 1, high = unit.end - unit.start, count = 0;
        while (low <= high) {
          const mid = Math.floor((low + high) / 2);
          renderUnits([{ ...unit, end: unit.start + mid }]);
          if (fits()) { count = mid;low = mid + 1; } else high = mid - 1;
        }
        if (count) {
          pending.push({ ...unit, end: unit.start + count });finish();
          if (unit.start + count < unit.end) queue[0] = { ...unit, start: unit.start + count };else queue.shift();
          continue;
        }
      }
      // An indivisible link/result is retained; ordinary supported viewports fit
      // these short blocks. No paragraph is truncated or discarded.
      pending.push(unit);queue.shift();finish();
    }
    finish();
    if (data?.demo) result.push({ kind: 'demo', units: [] });
    leaves = result.length ? result : [{ kind: 'reading', units: [] }];
    let target = 0;
    if (last) target = leaves.length - 1;
    else if (anchor?.kind === 'demo') target = leaves.findIndex(value => value.kind === 'demo');
    else if (anchor) target = leaves.findIndex(value => value.units.some(unit => unit.key === anchor.key && (!unit.words || unit.start <= anchor.start && unit.end > anchor.start)));
    leaf = Math.max(0, target);
    layoutDirty = false;
    renderLeaf();
  }
  function renderDemo() {
    body.dataset.pageKind = 'demo';body.replaceChildren();
    const demo = element('section', 'book-demo');demo.id = 'project-demo';demo.setAttribute('aria-label', 'Bookworm app walkthrough');
    demo.append(element('h4', '', 'Bookworm in action.'));
    const video = element('video');video.id = 'bookworm-video';video.controls = true;video.playsInline = true;video.preload = 'metadata';video.poster = 'media/bookworm-poster.jpg';
    const source = element('source');source.src = 'media/bookworm-demo.mp4';source.type = 'video/mp4';video.append(source);
    demo.append(video, element('p', 'book-demo-caption', 'Local app walkthrough · Sample data'));body.append(demo);
  }
  function renderLeaf() {
    const value = leaves[leaf];
    if (!value || !body) return;
    stopMedia();pageAnimation?.cancel();
    if (value.kind === 'demo') renderDemo();else renderUnits(value.units);
    dialog.dataset.chapterId = chapter()?.id || 'introduction';
    dialog.dataset.pageIndex = String(leaf);dialog.dataset.pageCount = String(leaves.length);dialog.dataset.pageKind = value.kind;
    const first = current < 0 && leaf === 0;
    const lastPage = leaf === leaves.length - 1;
    const lastStory = current === book.chapters.length - 1;
    byId('book-prev').disabled = first;
    const next = byId('book-next');
    next.disabled = false;
    const nextText = lastPage ? lastStory ? 'Contents' : current < 0 ? 'Start reading' : 'Next story' : 'Next page';
    next.replaceChildren(document.createTextNode(nextText + ' '), element('span', '', '→'));
    next.lastElementChild.setAttribute('aria-hidden', 'true');
    next.setAttribute('aria-label', lastPage && lastStory ? 'Return to table of contents' : nextText);
    byId('book-prev').setAttribute('aria-label', leaf > 0 ? 'Previous page' : 'Previous story');
    byId('book-page-count').replaceChildren(element('span', '', `Page ${leaf + 1} of ${leaves.length}`), element('span', '', current < 0 ? 'Introduction' : `Story ${current + 1} of ${book.chapters.length}`));
    updateTocSelection();
  }
  function turnTo(index, manual = false) {
    if (index < 0 || index >= leaves.length) return;
    leaf = index;renderLeaf();
    if (manual) {
      focusPage();announce();
      if (!motion.matches) pageAnimation = body.animate([{ opacity: .55, transform: 'translateX(7px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 140, easing: 'ease-out' });
    }
  }
  function goToChapter(index, manual = false, last = false) {
    if (index < -1 || index >= book.chapters.length) return;
    current = index;leaf = 0;leaves = [];
    dialog.dataset.contentsOpen = 'false';
    byId('book-contents-toggle').textContent = 'Contents';
    byId('book-contents-toggle').setAttribute('aria-expanded', String(!mobile.matches));
    byId('book-contents-toggle').setAttribute('aria-label', 'Show table of contents');
    paginate(null, last);buildContents();
    if (manual) { focusPage();announce(); }
  }
  function nextPage() {
    if (leaf < leaves.length - 1) turnTo(leaf + 1, true);
    else if (current < book.chapters.length - 1) goToChapter(current + 1, true);
    else { setContents(true, true);if (!mobile.matches) toc.querySelector('[aria-current="page"]')?.focus(); }
  }
  function previousPage() {
    if (leaves[leaf]?.kind === 'demo' && layoutDirty) {
      paginate(null, true);turnTo(Math.max(0, leaves.length - 2), true);return;
    }
    if (leaf > 0) turnTo(leaf - 1, true);
    else if (current >= 0) goToChapter(current - 1, true, true);
  }
  function tocEntry(entry, index) {
    const item = element('li');
    const button = element('button', 'book-toc-button');button.type = 'button';button.dataset.chapterIndex = String(index - 1);
    const copy = element('span', 'book-toc-copy');copy.append(element('span', 'book-toc-title', entry.title));
    const leader = element('span', 'book-toc-leader');leader.setAttribute('aria-hidden', 'true');
    const number = element('span', 'book-toc-number', index ? String(index).padStart(2, '0') : '—');number.setAttribute('aria-hidden', 'true');
    button.append(copy, leader, number);button.addEventListener('click', () => goToChapter(index - 1, true));item.append(button);return item;
  }
  function updateTocSelection() {
    toc.querySelectorAll('.book-toc-button').forEach(button => {
      if (Number(button.dataset.chapterIndex) === current) button.setAttribute('aria-current', 'page');else button.removeAttribute('aria-current');
    });
  }
  function showTocLeaf(index, focus = false) {
    if (index < 0 || index >= tocLeaves.length) return;
    tocLeaf = index;
    toc.replaceChildren(...tocLeaves[index].map(index => tocEntry(index < 0 ? { title: 'Introduction' } : book.chapters[index], index + 1)));
    updateTocSelection();
    byId('book-toc-prev').disabled = index === 0;
    byId('book-toc-next').disabled = index === tocLeaves.length - 1;
    byId('book-toc-page-count').textContent = `${index + 1} of ${tocLeaves.length}`;
    byId('book-toc-prev').parentElement.hidden = tocLeaves.length < 2;
    if (focus) toc.querySelector('button')?.focus();
  }
  function buildContents() {
    if (!dialog.open || !contentsVisible() || toc.clientHeight < 1) return;
    const entries = [{ title: 'Introduction' }, ...book.chapters];
    const result = [];
    let group = [];
    const pager = byId('book-toc-prev').parentElement;
    // First give the complete contents list all available space. Only reserve
    // paging controls on windows where the full list genuinely does not fit.
    pager.hidden = true;
    toc.replaceChildren(...entries.map(tocEntry));
    if (toc.scrollHeight <= toc.clientHeight + 1) {
      tocLeaves = [entries.map((_, index) => index - 1)];
      showTocLeaf(0);
      byId('book-chapter-count').textContent = book.chapters.length + ' stories';
      return;
    }
    pager.hidden = false;
    toc.replaceChildren();
    entries.forEach((entry, index) => {
      const item = tocEntry(entry, index);toc.append(item);
      if (toc.scrollHeight > toc.clientHeight + 1 && group.length) {
        result.push(group);group = [];toc.replaceChildren(item);
      }
      group.push(index - 1);
    });
    if (group.length) result.push(group);
    tocLeaves = result;
    const selected = result.findIndex(group => group.includes(current));
    showTocLeaf(Math.max(0, selected));
    byId('book-chapter-count').textContent = book.chapters.length + ' stories';
  }
  function reflow() {
    if (!dialog.open) return;
    byId('book-contents-toggle').setAttribute('aria-expanded', String(!mobile.matches || dialog.dataset.contentsOpen === 'true'));
    const focused = document.activeElement;
    const tocChapter = focused?.closest('.book-toc-button')?.dataset.chapterIndex;
    const hadTitleFocus = focused?.id === 'book-page-title';
    if (leaves[leaf]?.kind === 'demo' && page.querySelector('video')) layoutDirty = true;
    else if (readingVisible()) paginate();
    else layoutDirty = true;
    buildContents();
    if (hadTitleFocus) focusPage();
    if (tocChapter !== undefined) toc.querySelector(`[data-chapter-index="${tocChapter}"]`)?.focus({ preventScroll: true });
  }
  function scheduleReflow() { clearTimeout(layoutTimer);layoutTimer = setTimeout(reflow, 80); }
  function openBook(id, source, chapterId) {
    const selected = (chapterId && books.find(value => value.chapters.some(chapter => chapter.id === chapterId))) || books.find(value => value.id === id);
    if (!selected?.chapters?.length) return;
    book = selected;opener = source;afterClose = null;leaves = [];leaf = 0;tocLeaves = [];tocLeaf = 0;
    current = chapterId ? book.chapters.findIndex(value => value.id === chapterId) : -1;
    dialog.dataset.book = book.id;dialog.dataset.theme = book.theme;
    byId('book-volume').textContent = volumes[book.id] || 'Selected stories';
    byId('project-dialog-title').textContent = book.title;
    byId('book-announcement').textContent = '';
    dialog.dataset.contentsOpen = String(!chapterId);
    byId('book-contents-toggle').textContent = chapterId ? 'Contents' : 'Read';
    byId('book-contents-toggle').setAttribute('aria-label', chapterId ? 'Show table of contents' : 'Read the current page');
    byId('book-contents-toggle').setAttribute('aria-expanded', String(!mobile.matches || !chapterId));
    dialog.showModal();document.body.classList.add('dialog-open');
    reflow();
    if (chapterId) focusPage();else byId('project-dialog-title').focus({ preventScroll: true });
  }
  document.querySelectorAll('[data-book]').forEach(button => button.addEventListener('click', () => openBook(button.dataset.book, button, button.dataset.bookChapter)));
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const alias = aliases[button.dataset.project];if (!alias) return;
    openBook(alias[0], button, alias[1]);
  }));
  byId('book-prev').addEventListener('click', previousPage);
  byId('book-next').addEventListener('click', nextPage);
  byId('book-toc-prev').addEventListener('click', () => showTocLeaf(tocLeaf - 1, true));
  byId('book-toc-next').addEventListener('click', () => showTocLeaf(tocLeaf + 1, true));
  byId('book-contents-toggle').addEventListener('click', () => setContents(dialog.dataset.contentsOpen !== 'true', true));
  byId('close-project').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('video,input,textarea,select,[contenteditable=true]') || !window.getSelection()?.isCollapsed) return;
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    if (mobile.matches && dialog.dataset.contentsOpen === 'true') {
      const target = tocLeaf + (event.key === 'ArrowRight' ? 1 : -1);
      if (target >= 0 && target < tocLeaves.length) { event.preventDefault();showTocLeaf(target, true); }
    } else if (!byId('book-contents').contains(event.target)) { event.preventDefault();event.key === 'ArrowRight' ? nextPage() : previousPage(); }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    clearTimeout(layoutTimer);stopMedia();pageAnimation?.cancel();document.body.classList.remove('dialog-open');
    const next = afterClose;afterClose = null;
    if (next) requestAnimationFrame(next);else opener?.focus({ preventScroll: true });
  });
  if ('ResizeObserver' in window) new ResizeObserver(scheduleReflow).observe(dialog);
  window.addEventListener('resize', scheduleReflow);
  window.visualViewport?.addEventListener('resize', scheduleReflow);
  if (document.fonts) { document.fonts.ready.then(scheduleReflow);document.fonts.addEventListener('loadingdone', scheduleReflow); }
})();
