(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const switcher=document.querySelector('.portfolio-switcher');
  switcher?.querySelector('a')?.addEventListener('click',()=>{switcher.open=false;});
  document.addEventListener('click',event=>{if(switcher?.open&&!switcher.contains(event.target))switcher.open=false;});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&switcher?.open){switcher.open=false;switcher.querySelector('summary').focus();}});
  const links=[...document.querySelectorAll('.main-nav a')];
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){links.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}}},{rootMargin:'-15% 0px -65% 0px',threshold:0});['about','work','education','hobbies'].forEach(id=>observer.observe(byId(id)));}
  byId('copyright-year').textContent=String(new Date().getFullYear());
})();
