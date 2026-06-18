/* ===========================================================================
   READY TO ANTWERP?  —  shared page script (loaded on every page)
   1) Interviews / Deskresearch tabs (only present on the Connect page)
   2) mobile menu toggle
   3) sidebar: current page's group stays expanded; sub-link scroll-spy
   4) accordion (one open at a time)
   5) reveal-on-scroll
   6) gamification swiper (only present on the Connect page)
   =========================================================================== */
(function(){
  "use strict";

  var toc     = document.getElementById('toc');
  var menuBtn = document.getElementById('menuBtn');
  var tabs    = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var panels  = Array.prototype.slice.call(document.querySelectorAll('.tabpanel'));

  /* ---- 1. tabs (no-op when a page has none) ---- */
  function activateTab(name){
    tabs.forEach(function(t){
      var on = t.getAttribute('data-tab') === name;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    panels.forEach(function(p){
      var on = p.id === 'panel-' + name;
      p.classList.toggle('active', on);
      if(on){ p.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in-view'); }); }
    });
  }
  tabs.forEach(function(t){
    t.addEventListener('click', function(){ activateTab(t.getAttribute('data-tab')); updateActive(); });
  });

  /* ---- 2. mobile menu ---- */
  if(menuBtn && toc){
    menuBtn.addEventListener('click', function(){ toc.classList.toggle('open'); });
  }

  /* ---- 3. sidebar ---- */
  var page     = document.body.getAttribute('data-page');
  var groups   = Array.prototype.slice.call(document.querySelectorAll('.toc .grp'));
  var subLinks = Array.prototype.slice.call(document.querySelectorAll('.toc .sub a'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-section]'));

  /* the group for this page is always the open/active one */
  groups.forEach(function(g){ g.classList.toggle('active', g.getAttribute('data-group') === page); });

  function hashOf(href){ var i = href.indexOf('#'); return i >= 0 ? href.slice(i) : ''; }
  function isSamePage(href){ return href.charAt(0) === '#'; }

  subLinks.forEach(function(a){
    a.addEventListener('click', function(e){
      var href = a.getAttribute('href');
      if(isSamePage(href)){
        var tab = a.getAttribute('data-tab');
        if(tab){
          e.preventDefault();
          activateTab(tab);
          var target = document.querySelector(href);
          if(target){ requestAnimationFrame(function(){ target.scrollIntoView({behavior:'smooth', block:'start'}); }); }
        }
      }
      if(window.matchMedia('(max-width:1080px)').matches && toc){ toc.classList.remove('open'); }
    });
  });

  /* scroll-spy: highlight the sub-link of the section currently in view */
  function linkFor(id){ return subLinks.filter(function(a){ return hashOf(a.getAttribute('href')) === '#'+id; })[0]; }
  function setActiveSub(section){
    if(!section) return;
    subLinks.forEach(function(a){ a.classList.remove('active'); });
    var l = linkFor(section.id);
    if(l) l.classList.add('active');
  }
  var ticking = false;
  function updateActive(){
    if(!sections.length) return;
    var marker = window.innerHeight * 0.32;
    var current = null, bestDist = Infinity;
    sections.forEach(function(s){
      if(s.offsetParent === null) return;            /* skip hidden (inactive tab) */
      var top = s.getBoundingClientRect().top;
      if(top - marker <= 0){
        var d = Math.abs(top - marker);
        if(d < bestDist){ bestDist = d; current = s; }
      }
    });
    if(!current){ current = sections[0]; }
    setActiveSub(current);
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){ window.requestAnimationFrame(updateActive); ticking = true; }
  }, {passive:true});
  window.addEventListener('resize', updateActive);

  /* if deep-linked into a tabbed section, open its tab first */
  (function openTabForHash(){
    if(!location.hash) return;
    var el; try{ el = document.querySelector(location.hash); }catch(e){ return; }
    if(!el || !el.closest) return;
    var panel = el.closest('.tabpanel');
    if(panel){ activateTab(panel.id.replace('panel-','')); requestAnimationFrame(function(){ el.scrollIntoView({block:'start'}); }); }
  })();
  updateActive();

  /* ---- 4. accordion: one open at a time ---- */
  var accs = Array.prototype.slice.call(document.querySelectorAll('.acc'));
  accs.forEach(function(acc){
    var head = acc.querySelector('.acc-head');
    if(!head) return;
    head.addEventListener('click', function(){
      var isOpen = acc.classList.contains('open');
      accs.forEach(function(a){
        a.classList.remove('open');
        var h = a.querySelector('.acc-head'); if(h) h.setAttribute('aria-expanded','false');
      });
      if(!isOpen){ acc.classList.add('open'); head.setAttribute('aria-expanded','true'); }
    });
  });

  /* ---- 5. reveal on scroll ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('in-view'); io.unobserve(en.target); }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('in-view'); });
  }

  /* ---- 6. gamification: swipeable reference cards (arrows + dots) ---- */
  (function(){
    var sw = document.querySelector('.swiper'); if(!sw) return;
    var track = sw.querySelector('.swipe-track');
    var n = track.children.length, i = 0;
    var dots = Array.prototype.slice.call(sw.querySelectorAll('.swipe-dot'));
    function go(k){
      i = (k + n) % n;
      track.style.transform = 'translateX(' + (-i * 100) + '%)';
      dots.forEach(function(d, x){ d.classList.toggle('active', x === i); });
    }
    var prev = sw.querySelector('.prev'), next = sw.querySelector('.next');
    if(prev) prev.addEventListener('click', function(){ go(i - 1); });
    if(next) next.addEventListener('click', function(){ go(i + 1); });
    dots.forEach(function(d, x){ d.addEventListener('click', function(){ go(x); }); });
    go(0);
  })();
})();

/* ---- user journey: phase cards with a smooth swipe ---- */
(function(){
  "use strict";
  var modal = document.getElementById('ujModal'); if(!modal) return;
  var track = modal.querySelector('.uj-track');
  var count = track ? track.children.length : 0;
  var idx = 0;
  function move(){ if(track) track.style.transform = 'translateX(' + (-idx * 100) + '%)'; }
  function go(i){ if(!count) return; idx = (i + count) % count; move(); }
  function open(i){ go(i); modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); }
  function close(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
  Array.prototype.slice.call(document.querySelectorAll('.uj-btn')).forEach(function(b){
    b.addEventListener('click', function(){ open(parseInt(b.getAttribute('data-phase'), 10) || 0); });
  });
  var prev = modal.querySelector('.uj-prev'), next = modal.querySelector('.uj-next');
  if(prev) prev.addEventListener('click', function(){ go(idx - 1); });
  if(next) next.addEventListener('click', function(){ go(idx + 1); });
  modal.addEventListener('click', function(e){ if(e.target === modal) close(); });
  document.addEventListener('keydown', function(e){
    if(!modal.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    else if(e.key === 'ArrowLeft') go(idx - 1);
    else if(e.key === 'ArrowRight') go(idx + 1);
  });
})();
