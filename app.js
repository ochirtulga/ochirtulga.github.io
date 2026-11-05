(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const switcher=document.querySelector('.portfolio-switcher');
  switcher?.querySelector('a')?.addEventListener('click',()=>{switcher.open=false;});
  document.addEventListener('click',event=>{if(switcher?.open&&!switcher.contains(event.target))switcher.open=false;});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&switcher?.open){switcher.open=false;switcher.querySelector('summary').focus();}});
  const projects = {
    banking: {context:'Khan Bank / Selected engineering work',title:'A monolith, untangled.',intro:'A bank’s SMS notification service, migrated into a focused, Kafka-based microservice.',stack:'Java / Kafka / Cassandra',problem:'The notification service lived inside the banking monolith. It needed a more independent, reliable architecture.',design:'Separated notification processing into a dedicated microservice using Kafka for event streaming and Cassandra for storage.',components:['Banking events','Kafka','Notifications','Cassandra'],result:'Guaranteed SLA downtime changed from 2,000 to 20 minutes per year. The work was recognized by the Head of IT.'},
    bookworm: {context:'An independent project / iOS',title:'One more chapter.',intro:'A reading companion for keeping a personal library, taking on reading challenges, and collecting achievements.',stack:'React Native / Expo / Supabase',problem:'My reading habit deserved better tooling: one home for the books, the goals, and the small victories.',design:'A mobile app built with React Native and Expo, backed by Supabase. Designed around the reading habit it supports.',components:['iOS app','React Native','Expo','Supabase'],result:'A personal reading companion, built after hours because it was something I wanted to use myself.'},
    window: {context:'Express Window / Erdenet, Mongolia',title:'Made for real work.',intro:'The public website and internal tools for a family window-and-door business in Mongolia.',stack:'Next.js / React / Java / Spring Boot / AWS',problem:'The business needed an online presence and a practical way to manage its orders and inventory.',design:'Built the public website alongside internal order and inventory management tools, delivering the work end to end.',components:['Public website','Order management','Inventory tools'],result:'A live public website and internal tools for the company’s day-to-day work.',url:'https://expresswindow.online'}
  };
  const dialog=byId('project-dialog');
  const watch=byId('project-watch');
  const video=byId('bookworm-video');
  function setDemo(open){
    byId('project-demo').hidden=!open;
    byId('project-chapters').hidden=open;
    watch.setAttribute('aria-expanded',String(open));
    watch.replaceChildren(document.createTextNode(open?'Read the story ':'Watch the demo '));
    const icon=document.createElement('span');icon.setAttribute('aria-hidden','true');icon.textContent=open?'↩':'▶';watch.append(icon);
    if(open)video.play().catch(()=>{});else{video.pause();if(video.readyState>0)video.currentTime=0;}
  }
  let opener=null;
  document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
    const p=projects[button.dataset.project];if(!p||!dialog)return;
    opener=button;
    setDemo(false);
    watch.hidden=button.dataset.project!=='bookworm';
    for(const [id,text] of Object.entries({context:p.context,'dialog-title':p.title,intro:p.intro,stack:p.stack,problem:p.problem,design:p.design,result:p.result}))byId('project-'+id).textContent=text;
    byId('project-components').replaceChildren(...p.components.map(text=>{const element=document.createElement('span');element.textContent=text;return element;}));
    const visit=byId('project-visit');visit.hidden=!p.url;if(p.url)visit.href=p.url;else visit.removeAttribute('href');
    dialog.showModal();dialog.scrollTop=0;document.body.classList.add('dialog-open');
  }));
  byId('close-project')?.addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
  watch?.addEventListener('click',()=>setDemo(watch.getAttribute('aria-expanded')!=='true'));
  dialog?.addEventListener('close',()=>{setDemo(false);document.body.classList.remove('dialog-open');opener?.focus();});
  const stories={events:'Banking events start the notification flow. The migration separated this responsibility from the bank’s monolithic application.',kafka:'A Kafka-based notification service, migrated out of the banking monolith. Select a component to explore.',service:'A dedicated microservice handles SMS notifications, with a clear responsibility in the banking platform.',data:'Cassandra supports the migrated notification service, alongside Kafka-based event streaming.'};
  document.querySelectorAll('[data-node]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-node]').forEach(node=>node.setAttribute('aria-pressed',String(node===button)));byId('architecture-story').textContent=stories[button.dataset.node];}));
  const links=[...document.querySelectorAll('.main-nav a')];
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){links.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}}},{rootMargin:'-15% 0px -65% 0px',threshold:0});['about','work','education','hobbies'].forEach(id=>observer.observe(byId(id)));}
  byId('copyright-year').textContent=String(new Date().getFullYear());
})();
