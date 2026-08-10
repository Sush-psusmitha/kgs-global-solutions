/* =========================================
   KOTNANI GLOBAL SOLUTIONS — script.js
   ========================================= */
'use strict';

/* =============================================
   UTILS
   ============================================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* =============================================
   NAVBAR — transparent on hero, black on scroll
   ============================================= */
(function () {
  var nav = document.getElementById('navbar');
  if (!nav) return;
  function update() {
    nav.classList.toggle('is-scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}());

/* =============================================
   NAVBAR — DESKTOP DROPDOWNS
   ============================================= */
const dropdownItems = $$('.nav-item.has-dropdown');

function closeAllDropdowns(except = null) {
  dropdownItems.forEach(item => {
    if (item === except) return;
    item.classList.remove('open');
    const btn = item.querySelector('[aria-haspopup]');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}

let dropdownCloseTimer = null;

dropdownItems.forEach(item => {
  const trigger = item.querySelector('[aria-haspopup]');
  if (!trigger) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = item.classList.contains('open');
    closeAllDropdowns();
    if (!isOpen) {
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });

  item.addEventListener('mouseenter', () => {
    clearTimeout(dropdownCloseTimer);
    closeAllDropdowns(item);
    item.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  });

  item.addEventListener('mouseleave', () => {
    clearTimeout(dropdownCloseTimer);
    dropdownCloseTimer = setTimeout(() => {
      item.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }, 250);
  });

  item.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      trigger.focus();
    }
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.has-dropdown')) {
    closeAllDropdowns();
  }
});

window.addEventListener('scroll', () => {
  closeAllDropdowns();
}, { passive: true });

/* =============================================
   NAVBAR SCROLL — shrink effect
   ============================================= */
const navbar = $('#navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (currentScrollY > lastScrollY && currentScrollY > navbar.offsetHeight) {
    navbar.classList.add('nav-hidden');
  } else {
    navbar.classList.remove('nav-hidden');
  }

  lastScrollY = currentScrollY;
}, { passive: true });

/* =============================================
   MOBILE MENU
   ============================================= */
const hamburger    = $('#hamburger');
const mobileMenu   = $('#mobileMenu');
const mobileClose  = $('#mobileClose');
const mobileOverlay = $('#mobileOverlay');

function openMobileMenu() {
  mobileMenu.removeAttribute('hidden');
  requestAnimationFrame(() => {
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('show');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  });
}

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('show');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  setTimeout(() => {
    if (!mobileMenu.classList.contains('open')) {
      mobileMenu.setAttribute('hidden', '');
    }
  }, 380);
}

if (hamburger)     hamburger.addEventListener('click', openMobileMenu);
if (mobileClose)   mobileClose.addEventListener('click', closeMobileMenu);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMobileMenu();
    closeAllDropdowns();
  }
});

/* =============================================
   MOBILE ACCORDION
   ============================================= */
const accTriggers = $$('.mob-acc-trigger');

accTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const panel = trigger.nextElementSibling;
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    accTriggers.forEach(t => {
      if (t !== trigger) {
        t.setAttribute('aria-expanded', 'false');
        const p = t.nextElementSibling;
        p.classList.remove('open');
        p.style.maxHeight = '';
      }
    });

    trigger.setAttribute('aria-expanded', String(!isOpen));
    panel.classList.toggle('open', !isOpen);
    panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : '';
  });
});

/* =============================================
   HERO INPUT — focus ring enhancement
   ============================================= */
const heroForm  = $('.hero-form');
const heroInput = $('.hero-input');

if (heroInput && heroForm) {
  heroInput.addEventListener('focus', () => {
    heroForm.style.borderColor = 'rgba(195, 91, 255, 0.5)';
    heroForm.style.boxShadow   = '0 0 0 3px rgba(195, 91, 255, 0.1)';
  });
  heroInput.addEventListener('blur', () => {
    heroForm.style.borderColor = '';
    heroForm.style.boxShadow   = '';
  });
}

/* =============================================
   AI CAPABILITIES SECTIONS — scroll-triggered entrance.
   Shared between the homepage's .ai-section (light) and the
   services/industries pages' .aic-section (dark) — each page only
   ever has one of the two. All cards render at once and the content
   column stays sticky via CSS while they scroll past — no scroll-jack JS needed.
   ============================================= */
['.ai-section', '.aic-section'].forEach(function (sectionSelector) {
  var section = document.querySelector(sectionSelector);
  if (!section) return;

  var sectionObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        section.classList.add('is-visible');
        sectionObserver.unobserve(section);
      }
    },
    { threshold: 0.15 }
  );
  sectionObserver.observe(section);
});

/* =============================================
   FEATURED SOLUTIONS — Slick carousel
   ============================================= */
(function (jQ) {
  if (!jQ || !jQ.fn || !jQ.fn.slick) return;

  var fsSection = document.querySelector('.fs-section');
  if (!fsSection) return;

  var $slider = jQ('#fsSlider');
  if (!$slider.length) return;

  $slider.slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    arrows: false,
    dots: false,
    swipe: true,
    touchThreshold: 10,
    responsive: [
      { breakpoint: 1300, settings: { slidesToShow: 3 } },
      { breakpoint: 800, settings: { slidesToShow: 2 } },
      { breakpoint: 520, settings: { slidesToShow: 1 } }
    ]
  });

  var prevBtn = document.querySelector('.fs-prev');
  var nextBtn = document.querySelector('.fs-next');

  if (prevBtn) prevBtn.addEventListener('click', function () { $slider.slick('slickPrev'); });
  if (nextBtn) nextBtn.addEventListener('click', function () { $slider.slick('slickNext'); });

  /* Swap fill state on navigation */
  function updateNavFill(currentSlide, slick) {
    var atStart = currentSlide === 0;
    var atEnd = currentSlide >= slick.slideCount - slick.options.slidesToShow;
    if (prevBtn) prevBtn.classList.toggle('fs-btn--fill', !atStart);
    if (nextBtn) nextBtn.classList.toggle('fs-btn--fill', !atEnd);
  }

  $slider.on('afterChange', function (e, slick, currentSlide) { updateNavFill(currentSlide, slick); });

  /* Scroll reveal */
  var fsObs = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      fsSection.classList.add('is-visible');
      fsObs.unobserve(fsSection);
    }
  }, { threshold: 0.1 });

  fsObs.observe(fsSection);
}(window.jQuery));

/* =============================================
   OVERVIEW SECTION — scroll-triggered entrance
   ============================================= */
const overviewSection = document.querySelector('.overview-section');
if (overviewSection) {
  const overviewObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        overviewSection.classList.add('is-visible');
        overviewObserver.unobserve(overviewSection);
      }
    },
    { threshold: 0.15 }
  );
  overviewObserver.observe(overviewSection);
}

/* =============================================
   INSIGHTS SECTION — scroll-triggered entrance
   ============================================= */
const insightsSection = document.querySelector('.insights-section');
if (insightsSection) {
  const insightsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        insightsSection.classList.add('is-visible');
        insightsObserver.unobserve(insightsSection);
      }
    },
    { threshold: 0.1 }
  );
  insightsObserver.observe(insightsSection);
}



(function () {
  'use strict';
 
  /* Generic observe-once helper */
  function revealOnScroll(selector, visibleClass, threshold) {
    threshold = threshold || 0.12;
    var els = document.querySelectorAll(selector);
    if (!els.length) return;
 
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: threshold });
 
    els.forEach(function (el) { observer.observe(el); });
  }
 
  /* ── CTA section ── */
  revealOnScroll('.cta-section', 'cta--visible', 0.15);
 
  /* ── Footer grid + bottom bar ── */
  revealOnScroll('.footer-grid',   'footer--visible', 0.08);
  revealOnScroll('.footer-bottom', 'footer--visible', 0.5);

  /* ── Sections with no bespoke entrance animation of their own —
     plain fade/slide-up, same as everything else above. Excludes
     .hero on every page: that's the LCP candidate, so it must never
     start hidden behind an opacity transition. ── */
  [
    /* index.html */
    '.stats-section', '.sb-section', '.clients-static-section',
    '.ai-services-section', '.arch-section', '.ind-section',
    '.nwi-section',
    /* services/cybersecurity.html */
    '.svc-intro-section', '.tech-section', '.plat-section',
    '.why-section', '.svcfaq-section', '.svcblog-section',
    '.svcform-section',
    /* industries/banking-finance.html */
    '.indpg-intro-section', '.indpg-services-section',
    '.indpg-partners-section', '.indpg-ai-section',
    /* shared between both pages */
    '.cs-section', '.stt-section',
    /* about.html */
    '.abt-intro-section',
    /* locations.html */
    '.loc-section', '.infra-section', '.adv-section',
    /* insights.html */
    '.blg-section', '.bcat-section',
    /* certifications.html */
    '.cert-detail', '.clients-section',
    /* certifications.html + customers.html (shared kgs-adv section) */
    '.kgs-adv',
    /* case-studies.html */
    '.cs-projects',
    /* case-studies pages — shared case-study template (13 files) */
    '.csabt-section', '.csstat-section', '.csbody-section', '.cstech-section',
    /* corporate-social-responsibility.html */
    '.csr-section', '.lcs-result',
    /* contact.html — .cus-section already has its own page-level
       IntersectionObserver wiring is-visible (see inline script at
       bottom of contact.html); this entry is redundant-but-harmless
       and kept for discoverability/consistency with the rest of the
       site's sections. */
    '.cus-section',
    /* customers.html */
    '.cust-clients',
    /* careers.html */
    '.job-positions',
    /* privacy-policy.html, terms-and-conditions.html */
    '.lgl-body',
    /* management-team.html — .mgt-section already has its own
       page-level IntersectionObserver wiring is-visible (see inline
       script at bottom of management-team.html); kept here too for
       the same reason as .cus-section above. */
    '.mgt-section',
    /* news-and-events.html */
    '.nev-slider', '.nev-news',
    /* sitemap.html */
    '.sitemap-section',
    /* testimonials.html */
    '.tsm-section',
    /* insights article pages — shared template (8 files) */
    '.art-body', '.art-similar',
    /* product/mapmyclasses.html */
    '.pdi-section', '.pui-section', '.pbn-section', '.ppl-section', '.pwc-section'
  ].forEach(function (selector) {
    revealOnScroll(selector, 'is-visible', 0.12);
  });

}());

/* =============================================
   TESTIMONIALS — Slick carousel
   Uses window.jQuery to avoid collision with the
   custom $ selector util defined at the top.
   ============================================= */
(function (jQ) {
  if (!jQ || !jQ.fn || !jQ.fn.slick) return;

  var $slider = jQ('#tmSlider');
  if (!$slider.length) return;

  $slider.slick({
    slidesToShow: 4,       /* applies at ≥ 1440px */
    slidesToScroll: 1,
    infinite: true,
    arrows: false,
    swipe: true,
    touchThreshold: 10,
    centerMode: true,
    centerPadding: '80px',
    autoplay: true,
    autoplaySpeed: 1500,
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        /* laptop / small desktop  1024 – 1439px → 3 full cards */
        breakpoint: 1440,
        settings: { slidesToShow: 3, centerPadding: '70px' }
      },
      {
        /* tablet landscape  768 – 1023px → 2 full cards */
        breakpoint: 1200,
        settings: { slidesToShow: 2, centerPadding: '50px' }
      },
      {
        /* mobile landscape / large phone → 1 card */
        breakpoint: 640,
        settings: { slidesToShow: 1, centerPadding: '36px' }
      },
      {
        /* small phone → tighter padding */
        breakpoint: 400,
        settings: { slidesToShow: 1, centerPadding: '20px' }
      }
    ]
  });

  var btnPrev = document.getElementById('tmPrev');
  var btnNext = document.getElementById('tmNext');

  if (btnPrev) { btnPrev.addEventListener('click', function () { $slider.slick('slickPrev'); }); }
  if (btnNext) { btnNext.addEventListener('click', function () { $slider.slick('slickNext'); }); }

  /* Pop-fade active cards on each slide change */
  function popActiveCards() {
    var $cards = jQ('.tm-slider .slick-active .tm-card');
    $cards.removeClass('tm-card--pop');
    $cards[0] && $cards[0].offsetWidth; /* force reflow */
    $cards.addClass('tm-card--pop');
    setTimeout(function () { $cards.removeClass('tm-card--pop'); }, 460);
  }

  $slider.on('afterChange', popActiveCards);
  $slider.on('init', popActiveCards);

}(window.jQuery));





/* =============================================
   SVC OVERVIEW — scroll reveal
   ============================================= */
(function () {
  var svcOverview = document.querySelector('.svc-overview');
  if (!svcOverview) return;

  var svcOvObs = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      svcOverview.classList.add('is-visible');
      svcOvObs.unobserve(svcOverview);
    }
  }, { threshold: 0.15 });

  svcOvObs.observe(svcOverview);
}());

/* =============================================
   SVC SERVICES — scroll reveal
   ============================================= */
(function () {
  var svcServices = document.querySelector('.svc-services');
  if (!svcServices) return;

  var svcSrvObs = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      svcServices.classList.add('is-visible');
      svcSrvObs.unobserve(svcServices);
    }
  }, { threshold: 0.08 });

  svcSrvObs.observe(svcServices);
}());

/* =============================================
   TECHNOLOGY STACK — scroll reveal
   ============================================= */
(function () {
  var tsSection = document.querySelector('.ts-section');
  if (!tsSection) return;

  var tsObs = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      tsSection.classList.add('is-visible');
      tsObs.unobserve(tsSection);
    }
  }, { threshold: 0.08 });

  tsObs.observe(tsSection);
}());

/* =============================================
   WHY CHOOSE US — Slick slider + scroll reveal
   Uses window.jQuery to avoid collision with the
   custom $ selector util defined at the top.
   ============================================= */
(function (jQ) {
  if (!jQ || !jQ.fn || !jQ.fn.slick) return;

  var wcuSection = document.querySelector('.wcu-section');
  if (!wcuSection) return;

  var $slider = jQ('.wcu-slider');
  if (!$slider.length) return;

  $slider.slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    arrows: false,
    dots: false,
    swipe: true,
    touchThreshold: 10,
    responsive: [
      {
        breakpoint: 1240,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 560,
        settings: { slidesToShow: 1 }
      }
    ]
  });

  /* Wire up custom prev / next buttons */
  var prevBtn = document.querySelector('.wcu-prev');
  var nextBtn = document.querySelector('.wcu-next');

  if (prevBtn) prevBtn.addEventListener('click', function () { $slider.slick('slickPrev'); });
  if (nextBtn) nextBtn.addEventListener('click', function () { $slider.slick('slickNext'); });

  /* Swap fill state on navigation */
  $slider.on('afterChange', function (e, slick, currentSlide) {
    var atStart = currentSlide === 0;
    var atEnd   = currentSlide >= slick.slideCount - slick.options.slidesToShow;
    if (prevBtn) prevBtn.classList.toggle('wcu-btn--fill', !atStart);
    if (nextBtn) nextBtn.classList.toggle('wcu-btn--fill', !atEnd);
  });

  /* Scroll reveal */
  var wcuObs = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      wcuSection.classList.add('is-visible');
      wcuObs.unobserve(wcuSection);
    }
  }, { threshold: 0.08 });

  wcuObs.observe(wcuSection);

}(window.jQuery));



/* =============================================
   FAQ — accordion + scroll reveal
   ============================================= */
(function () {
  var section = document.querySelector('.faq-section');
  if (!section) return;

  /* Split items into two independent columns so opening one item
     never affects the height of the item beside it. */
  var list = section.querySelector('.faq-list');
  if (list) {
    var allItems = Array.prototype.slice.call(list.querySelectorAll('.faq-item'));
    if (allItems.length > 1) {
      var mid = Math.ceil(allItems.length / 2);
      var col1 = document.createElement('div');
      col1.className = 'faq-col';
      var col2 = document.createElement('div');
      col2.className = 'faq-col';
      allItems.forEach(function (item, i) {
        (i < mid ? col1 : col2).appendChild(item);
      });
      list.innerHTML = '';
      list.appendChild(col1);
      list.appendChild(col2);
    }
  }

  var items = section.querySelectorAll('.faq-item');

  function openItem(item) {
    var ans = item.querySelector('.faq-a');
    var btn = item.querySelector('.faq-q');
    item.classList.add('is-open');
    ans.style.maxHeight = ans.scrollHeight + 'px';
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  function closeItem(item) {
    var ans = item.querySelector('.faq-a');
    var btn = item.querySelector('.faq-q');
    item.classList.remove('is-open');
    ans.style.maxHeight = '0';
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  items.forEach(function (item) {
    /* Initialise any item pre-marked as open */
    if (item.classList.contains('is-open')) openItem(item);

    item.querySelector('.faq-q').addEventListener('click', function () {
      var wasOpen = item.classList.contains('is-open');
      items.forEach(closeItem);
      if (!wasOpen) openItem(item);
    });
  });

  /* Scroll reveal */
  var faqObs = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      section.classList.add('is-visible');
      faqObs.unobserve(section);
    }
  }, { threshold: 0.06 });

  faqObs.observe(section);
}());



/* =============================================
   INDUSTRIES WE SERVE — pill-to-card carousel
   Clicking a pill slides its matching card to the start
   of the track, but the target is clamped to the track's
   real max scroll — scrollIntoView's start-alignment does
   NOT do this on its own; for the last card it would leave
   the remainder of the viewport empty since there's nothing
   after it to fill the gap. Clamping instead settles the
   last card flush against the end with no trailing space.
   ============================================= */
(function () {
  var track = document.querySelector('.ind-cards');
  var pills = document.querySelectorAll('.ind-pill');
  if (!track || !pills.length) return;

  var cards = track.querySelectorAll('.ind-card');

  function setActivePill(pill) {
    pills.forEach(function (p) {
      var active = p === pill;
      p.classList.toggle('ind-pill--active', active);
      p.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      var key = pill.getAttribute('data-industry');
      var card = track.querySelector('.ind-card[data-industry="' + key + '"]');
      if (!card) return;
      setActivePill(pill);

      var trackRect = track.getBoundingClientRect();
      var cardRect = card.getBoundingClientRect();
      var cardPosInTrack = (cardRect.left - trackRect.left) + track.scrollLeft;
      var paddingLeft = parseFloat(window.getComputedStyle(track).paddingLeft) || 0;
      var maxScroll = track.scrollWidth - track.clientWidth;
      var target = Math.max(0, Math.min(cardPosInTrack - paddingLeft, maxScroll));

      track.scrollTo({ left: target, behavior: 'smooth' });
    });
  });

  // Keep the active pill in sync when the track is scrolled/swiped
  // directly instead of via a pill click.
  var syncTimer = null;
  track.addEventListener('scroll', function () {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      var trackLeft = track.getBoundingClientRect().left;
      var closest = null;
      var closestDist = Infinity;
      cards.forEach(function (card) {
        var dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
        if (dist < closestDist) {
          closestDist = dist;
          closest = card;
        }
      });
      if (!closest) return;
      var key = closest.getAttribute('data-industry');
      var pill = document.querySelector('.ind-pill[data-industry="' + key + '"]');
      if (pill) setActivePill(pill);
    }, 120);
  }, { passive: true });
}());

/* =============================================
   CASE STUDIES — auto-slide and prev/next nav
   ============================================= */
(function () {
  var track = document.querySelector('.cs-slider');
  if (!track) return;

  var prevBtn = document.querySelector('.cs-nav-btn--prev');
  var nextBtn = document.querySelector('.cs-nav-btn--next');
  var cards = track.querySelectorAll('.cs-slide-card');
  var totalCards = cards.length;
  var currentIndex = 0;
  var autoPlayInterval = 3000; // 5 seconds
  var autoPlayTimer = null;
  var isTransitioning = false;

  function scrollToCard(index, instant) {
    var card = cards[index];
    if (!card) return;

    var trackRect = track.getBoundingClientRect();
    var cardRect = card.getBoundingClientRect();
    var cardPosInTrack = (cardRect.left - trackRect.left) + track.scrollLeft;
    var paddingLeft = parseFloat(window.getComputedStyle(track).paddingLeft) || 0;
    var maxScroll = track.scrollWidth - track.clientWidth;
    var target = Math.max(0, Math.min(cardPosInTrack - paddingLeft, maxScroll));

    isTransitioning = true;
    track.scrollTo({ left: target, behavior: instant ? 'instant' : 'smooth' });
    currentIndex = index;

    // Allow scroll event sync to resume after the scroll finishes
    setTimeout(function () {
      isTransitioning = false;
    }, instant ? 50 : 600);
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(function () {
      var nextIndex = (currentIndex + 1) % totalCards;
      // Looping from the last card back to the first would otherwise
      // animate a long smooth scroll backwards through every card in
      // between — jump instantly instead so the first card simply
      // picks up next, with no visible reverse motion.
      var isWrapping = nextIndex === 0 && currentIndex === totalCards - 1;
      scrollToCard(nextIndex, isWrapping);
    }, autoPlayInterval);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // Prev/next button handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      var prevIndex = (currentIndex - 1 + totalCards) % totalCards;
      var isWrapping = prevIndex === totalCards - 1 && currentIndex === 0;
      scrollToCard(prevIndex, isWrapping);
      startAutoPlay(); // Reset timer on user interaction
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      var nextIndex = (currentIndex + 1) % totalCards;
      var isWrapping = nextIndex === 0 && currentIndex === totalCards - 1;
      scrollToCard(nextIndex, isWrapping);
      startAutoPlay(); // Reset timer on user interaction
    });
  }

  // Track scroll event to keep currentIndex in sync when swiping manually
  var syncTimer = null;
  track.addEventListener('scroll', function () {
    if (isTransitioning) return; // Ignore programmatic scrolls

    clearTimeout(syncTimer);
    syncTimer = setTimeout(function () {
      var trackLeft = track.getBoundingClientRect().left;
      var closest = null;
      var closestDist = Infinity;
      var closestIndex = 0;

      cards.forEach(function (card, index) {
        var dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
        if (dist < closestDist) {
          closestDist = dist;
          closest = card;
          closestIndex = index;
        }
      });

      if (closest && closestIndex !== currentIndex) {
        currentIndex = closestIndex;
        startAutoPlay(); // Reset timer since user swiped
      }
    }, 120);
  }, { passive: true });

  // Start auto play initially
  startAutoPlay();

  // Pause on hover
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);
}());

/* =============================================
   WHY CHOOSE US — auto-sliding Slick carousel
   ============================================= */
(function (jQ) {
  if (!jQ || !jQ.fn || !jQ.fn.slick) return;

  var whySection = document.querySelector('.why-section');
  if (!whySection) return;

  var $slider = jQ('#whySlider');
  if (!$slider.length) return;

  $slider.slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 600,
    arrows: false,
    dots: false,
    swipe: true,
    pauseOnHover: true,
    touchThreshold: 10,
    centerMode: true,
    centerPadding: '80px',
    responsive: [
      { breakpoint: 1300, settings: { slidesToShow: 3, centerPadding: '70px' } },
      { breakpoint: 900, settings: { slidesToShow: 2, centerPadding: '50px' } },
      { breakpoint: 600, settings: { slidesToShow: 1, centerPadding: '36px' } },
      { breakpoint: 400, settings: { slidesToShow: 1, centerPadding: '20px' } }
    ]
  });
}(window.jQuery));

/* =============================================
   SERVICE PAGE TESTIMONIALS — center-mode peek Slick carousel
   ============================================= */
(function (jQ) {
  if (!jQ || !jQ.fn || !jQ.fn.slick) return;

  var sttSection = document.querySelector('.stt-section');
  if (!sttSection) return;

  var $slider = jQ('#sttSlider');
  if (!$slider.length) return;

  $slider.slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 600,
    arrows: false,
    dots: false,
    swipe: true,
    pauseOnHover: true,
    touchThreshold: 10,
    centerMode: true,
    centerPadding: '60px',
    responsive: [
      { breakpoint: 1300, settings: { slidesToShow: 2, centerPadding: '50px' } },
      { breakpoint: 992, settings: { slidesToShow: 1, centerPadding: '40px' } },
      { breakpoint: 420, settings: { slidesToShow: 1, centerPadding: '20px' } }
    ]
  });
}(window.jQuery));

/* =============================================
   SERVICE PAGE FAQ — accordion (one open at a time)
   ============================================= */
(function () {
  var items = document.querySelectorAll('.svcfaq-item');
  if (!items.length) return;

  items.forEach(function (item) {
    var question = item.querySelector('.svcfaq-question');
    var answer = item.querySelector('.svcfaq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');

      items.forEach(function (other) {
        if (other === item) return;
        other.classList.remove('is-open');
        var otherQuestion = other.querySelector('.svcfaq-question');
        var otherAnswer = other.querySelector('.svcfaq-answer');
        if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
        if (otherAnswer) otherAnswer.style.maxHeight = '';
      });

      item.classList.toggle('is-open', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : '';
    });
  });

  // First question starts expanded
  var firstItem = items[0];
  var firstQuestion = firstItem.querySelector('.svcfaq-question');
  var firstAnswer = firstItem.querySelector('.svcfaq-answer');
  if (firstQuestion && firstAnswer) {
    firstItem.classList.add('is-open');
    firstQuestion.setAttribute('aria-expanded', 'true');
    firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
  }
}());

/* =============================================
   INDUSTRY PAGE STATS — count up from 0 on scroll into view.
   Parses each value's existing text (e.g. "$50B+", ">17k", "96%")
   into a leading/trailing non-numeric part and the number itself,
   so the same markup works with no JS (shows the final value) and
   just animates the digits when script runs.
   ============================================= */
(function () {
  var els = document.querySelectorAll('.indpg-stats-value');
  if (!els.length) return;

  function animateCount(el) {
    var text = el.textContent.trim();
    var match = text.match(/^(\D*)([\d,]+(?:\.\d+)?)(\D*)$/);
    if (!match) return;

    var prefix = match[1];
    var rawNumber = match[2].replace(/,/g, '');
    var suffix = match[3];
    var target = parseFloat(rawNumber);
    if (isNaN(target)) return;

    var decimals = (rawNumber.split('.')[1] || '').length;
    var duration = 3000;
    var startTime = null;

    /* Renders as <span class="stat-sign">prefix</span><span class="stat-num">N</span><span class="stat-sign">suffix</span>
       instead of plain text, so CSS can color the digits separately from
       the surrounding symbols (e.g. "$" / "+" / "%") where needed. */
    function render(numText) {
      el.innerHTML =
        (prefix ? '<span class="stat-sign">' + prefix + '</span>' : '') +
        '<span class="stat-num">' + numText + '</span>' +
        (suffix ? '<span class="stat-sign">' + suffix + '</span>' : '');
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      var current = target * eased;
      render(current.toFixed(decimals));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        render(rawNumber);
      }
    }

    requestAnimationFrame(step);
  }

  var animated = new WeakSet();
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !animated.has(entry.target)) {
        animated.add(entry.target);
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  els.forEach(function (el) { observer.observe(el); });
}());

/* =============================================
   INDUSTRY PAGE AI CAPABILITIES — hover-switched tab panel.
   Click also switches (not just hover) so it still works on
   touch devices, which have no real hover state.
   ============================================= */
(function () {
  var tabs = document.querySelectorAll('.indpg-ai-tab');
  if (!tabs.length) return;

  var panels = document.querySelectorAll('.indpg-ai-panel-item');

  function activate(index) {
    tabs.forEach(function (tab) {
      var active = tab.getAttribute('data-tab') === index;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach(function (panel) {
      panel.classList.toggle('is-active', panel.getAttribute('data-panel') === index);
    });
  }

  tabs.forEach(function (tab) {
    var index = tab.getAttribute('data-tab');
    tab.addEventListener('mouseenter', function () { activate(index); });
    tab.addEventListener('click', function () { activate(index); });
  });
}());

/* =============================================
   PRODUCT BENEFITS — ERP / LMS engine tabs
   (product/mapmyclasses.html). Click-only (no hover switch,
   unlike the role tabs above) since these sit above a full
   card grid rather than a single small panel.
   ============================================= */
(function () {
  var tabs = document.querySelectorAll('.pbn-tab');
  if (!tabs.length) return;

  var panels = document.querySelectorAll('.pbn-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-tab');

      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      panels.forEach(function (panel) {
        panel.classList.toggle('is-active', panel.getAttribute('data-panel') === target);
      });
    });
  });
}());

/* =============================================
   PRODUCT PLATFORMS — role transformation tabs
   (product/mapmyclasses.html). Same click-only pattern as the
   ERP/LMS tabs above.
   ============================================= */
(function () {
  var tabs = document.querySelectorAll('.ppl-tab');
  if (!tabs.length) return;

  var panels = document.querySelectorAll('.ppl-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-tab');

      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      panels.forEach(function (panel) {
        panel.classList.toggle('is-active', panel.getAttribute('data-panel') === target);
      });
    });
  });
}());

/* =============================================
   HEADER + CARD STAGGER — runs alongside the section-level
   revealOnScroll() above: header fades in first, then each card
   in sequence. Deliberately skips cards inside a Slick carousel
   (see the matching comment in css/style.css) since those sections
   already get the single whole-block reveal instead.
   ============================================= */
(function () {
  var headerSelector = [
    '.sb-header', '.ai-services-header', '.arch-title', '.ind-heading',
    '.nwi-heading', '.cs-heading', '.tech-heading', '.why-heading',
    '.stt-title', '.svcfaq-title', '.svcblog-heading',
    '.indpg-services-heading', '.indpg-intro-title', '.indpg-partners-heading',
    '.indpg-ai-heading', '.clients-title', '.plat-heading', '.svc-intro-title',
    '.abt-intro-title', '.wcu2-title'
  ].join(', ');

  var cardSelector = [
    '.stats-item', '.sb-card', '.ai-card', '.nwi-item', '.tech-card',
    '.svcfaq-item', '.svcblog-card', '.indpg-stats-card', '.abt-intro-item',
    '.abt-mission-item', '.wcu2-item', '.pbn-card', '.pwc-card'
  ].join(', ');

  var sections = document.querySelectorAll('section');
  if (!sections.length) return;

  var triggered = new WeakSet();

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var section = entry.target;
      if (triggered.has(section)) return;
      triggered.add(section);
      observer.unobserve(section);

      var header = section.querySelector(headerSelector);
      if (header) header.classList.add('is-visible');

      var cards = section.querySelectorAll(cardSelector);
      cards.forEach(function (card, i) {
        setTimeout(function () {
          card.classList.add('is-visible');
        }, 120 + i * 80);
      });
    });
  }, { threshold: 0.1 });

  sections.forEach(function (section) {
    if (section.querySelector(headerSelector) || section.querySelector(cardSelector)) {
      observer.observe(section);
    }
  });
}());

/* =============================================
   ABOUT PAGE — split media/content reveal
   Used by sections where an image column and a text column
   should each fade in independently as they're scrolled into
   view, rather than as one single whole-block trigger (needed
   for the tall multi-row Success Journey timeline, reused here
   for the Manifesto section's image + list split).
   ============================================= */
(function () {
  var els = document.querySelectorAll('.ojs-media, .ojs-content, .abt-mnf-content, .abt-mnf-media');
  if (!els.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  els.forEach(function (el) { observer.observe(el); });
}());

/* =============================================
   HERO INTRO — letter-by-letter flip-in + button reveal
   Splits the hero title and description into per-letter spans
   (grouped by word so wrapping stays natural) and cascades a CSS
   flip animation across them: title first, then the paragraph.
   The action buttons aren't split — once the text animation
   finishes, each button simply fades/slides in as a whole element.
   Original text is preserved via aria-label since the split spans
   are aria-hidden.
   ============================================= */
(function () {
  var blocks = document.querySelectorAll('.hero-content');
  if (!blocks.length) return;

  var STEP = 0.016;          // seconds between each letter within one element
  var FLIP_DURATION = 0.45;  // must match the CSS animation-duration
  var GROUP_GAP = 0.08;      // extra pause between title -> desc -> buttons

  function splitLetters(el, startDelay, step) {
    var text = el.textContent.trim();
    if (!text) return startDelay;

    el.setAttribute('aria-label', text);
    el.classList.add('js-flip-text');

    var wrapper = document.createElement('span');
    wrapper.setAttribute('aria-hidden', 'true');

    var words = text.split(/\s+/);
    var i = 0;
    words.forEach(function (word, wi) {
      var wordSpan = document.createElement('span');
      wordSpan.className = 'split-word';

      word.split('').forEach(function (ch) {
        var letterSpan = document.createElement('span');
        letterSpan.className = 'split-letter';
        letterSpan.style.setProperty('--letter-delay', (startDelay + i * step) + 's');
        letterSpan.textContent = ch;
        wordSpan.appendChild(letterSpan);
        i++;
      });

      wrapper.appendChild(wordSpan);
      if (wi < words.length - 1) wrapper.appendChild(document.createTextNode(' '));
    });

    el.textContent = '';
    el.appendChild(wrapper);

    requestAnimationFrame(function () {
      el.classList.add('letters-in');
    });

    return startDelay + i * step + FLIP_DURATION;
  }

  function revealButton(el, delay) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.setProperty('--btn-delay', delay + 's');
    requestAnimationFrame(function () {
      el.classList.add('btn-in');
    });
  }

  blocks.forEach(function (block) {
    var title = block.querySelector('.hero-title');
    var desc = block.querySelector('.hero-desc');
    var buttons = block.querySelectorAll('.hero-actions a');

    var delay = 0;
    if (title) delay = splitLetters(title, delay, STEP) + GROUP_GAP;
    if (desc) delay = splitLetters(desc, delay, STEP * 0.55) + GROUP_GAP;
    buttons.forEach(function (btn) { revealButton(btn, delay); });
  });
}());
