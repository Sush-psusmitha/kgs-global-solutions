/* =========================================================
   KGS SITE SEARCH — SEARCH ENGINE + UI
   =========================================================
   Desktop-only site search that lives directly in the header,
   in the spot the old "Start Free Trial" button used to sit:
   an always-visible input with a decorative icon; typing shows
   a live dropdown of matches underneath it.

   Data comes from window.KGS_SEARCH_INDEX (js/search-index.js),
   which must be loaded before this file.

   This file must work on file:// as well as on a real server,
   and from pages at any folder depth. To make result links
   resolve correctly regardless of depth, each page passes the
   path prefix back to the site root via a data attribute on
   this script's own <script> tag, e.g.:
     <script src="../js/search.js" data-root="../"></script>
   ========================================================= */
'use strict';

(function () {

  /* ---------------------------------------------------------
     0. SITE ROOT PREFIX
     Resolved once, from the <script> tag that loaded this file,
     so every generated link points at the right depth.
     --------------------------------------------------------- */
  var thisScript = document.currentScript;
  var ROOT = (thisScript && thisScript.getAttribute('data-root')) || './';

  function resolveUrl(pageUrl) {
    return ROOT + pageUrl;
  }

  /* ---------------------------------------------------------
     1. TEXT HELPERS — normalize, escape, highlight, snippet
     --------------------------------------------------------- */
  function normalize(str) {
    return (str || '').toString().toLowerCase().trim();
  }

  function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Wraps every occurrence of the query's words in <mark> tags.
  // Text is HTML-escaped first so highlighting can never inject markup.
  function highlight(text, query) {
    var safe = escapeHtml(text || '');
    var words = normalize(query).split(/\s+/).filter(Boolean).map(escapeRegExp);
    if (!words.length) return safe;
    var pattern = new RegExp('(' + words.join('|') + ')', 'gi');
    return safe.replace(pattern, '<mark>$1</mark>');
  }

  // Builds a short excerpt of `text` centred on the first query match.
  function makeSnippet(text, query, maxLen) {
    text = text || '';
    maxLen = maxLen || 90;
    var lower = normalize(text);
    var firstWord = normalize(query).split(/\s+/).filter(Boolean)[0] || '';
    var idx = firstWord ? lower.indexOf(firstWord) : -1;
    if (idx === -1) idx = 0;
    var start = Math.max(0, idx - 30);
    var snippet = text.slice(start, start + maxLen);
    if (start > 0) snippet = '…' + snippet;
    if (start + maxLen < text.length) snippet += '…';
    return snippet;
  }

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () { fn.apply(null, args); }, delay);
    };
  }

  /* ---------------------------------------------------------
     2. RANKING — exact matches first, then partial matches
     --------------------------------------------------------- */
  function scoreEntry(entry, queryLower, queryWords) {
    var title = normalize(entry.title);
    var desc = normalize(entry.description);
    var heading = normalize(entry.heading);
    var category = normalize(entry.category);
    var keywords = (entry.keywords || []).map(normalize);
    var score = 0;

    // Whole-query match against the title carries the most weight.
    if (title === queryLower) score += 100;
    else if (title.indexOf(queryLower) === 0) score += 70;
    else if (title.indexOf(queryLower) !== -1) score += 50;

    if (keywords.indexOf(queryLower) !== -1) score += 60;
    else if (keywords.some(function (k) { return k.indexOf(queryLower) !== -1; })) score += 30;

    if (category === queryLower) score += 40;
    if (heading.indexOf(queryLower) !== -1) score += 20;
    if (desc.indexOf(queryLower) !== -1) score += 15;

    // Per-word scoring so multi-word queries still match partially.
    queryWords.forEach(function (word) {
      if (!word) return;
      if (title.indexOf(word) !== -1) score += 8;
      if (keywords.some(function (k) { return k.indexOf(word) !== -1; })) score += 6;
      if (heading.indexOf(word) !== -1) score += 4;
      if (desc.indexOf(word) !== -1) score += 3;
    });

    return score;
  }

  function runSearch(query, limit) {
    var index = window.KGS_SEARCH_INDEX || [];
    var q = normalize(query);
    if (!q) return [];
    var words = q.split(/\s+/).filter(Boolean);

    var results = index
      .map(function (entry) { return { entry: entry, score: scoreEntry(entry, q, words) }; })
      .filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; });

    return typeof limit === 'number' ? results.slice(0, limit) : results;
  }

  /* ---------------------------------------------------------
     3. HEADER SEARCH — icon toggles a full-width panel
     Markup (see navbar-right / search panel in the header):
       button#searchToggle        — icon-only trigger in the navbar
       .search-panel#searchPanel  — full-viewport-width panel
         .search-panel-field#navSearch
           input#searchInput
         .search-dropdown         — live results, inside the panel
     --------------------------------------------------------- */
  var navSearch = document.getElementById('navSearch');
  var input = document.getElementById('searchInput');
  var dropdown = document.getElementById('searchDropdown');
  var searchToggle = document.getElementById('searchToggle');
  var searchPanel = document.getElementById('searchPanel');
  var searchClear = document.getElementById('searchClear');
  var navbar = document.getElementById('navbar');

  if (!navSearch || !input || !dropdown) return;

  var activeIndex = -1;
  var currentResults = [];

  function isDesktop() {
    return !searchToggle || searchToggle.offsetParent !== null;
  }

  function updateClearButton() {
    if (!searchClear) return;
    searchClear.classList.toggle('show', input.value.length > 0);
  }

  function openSearchPanel() {
    if (!searchPanel) return;
    if (typeof closeAllDropdowns === 'function') closeAllDropdowns();
    searchPanel.classList.add('open');
    searchToggle.setAttribute('aria-expanded', 'true');
    if (navbar) navbar.classList.add('search-active');
    setTimeout(function () { input.focus(); }, 50);
  }

  function closeSearchPanel() {
    if (!searchPanel) return;
    searchPanel.classList.remove('open');
    searchToggle.setAttribute('aria-expanded', 'false');
    if (navbar) navbar.classList.remove('search-active');
    closeDropdown();
  }

  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (searchPanel.classList.contains('open')) closeSearchPanel();
      else openSearchPanel();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', function (e) {
      e.stopPropagation();
      input.value = '';
      updateClearButton();
      closeDropdown();
      input.focus();
    });
  }

  function closeDropdown() {
    dropdown.classList.remove('show');
    dropdown.innerHTML = '';
    currentResults = [];
    activeIndex = -1;
  }

  function renderResultItem(result, index) {
    var entry = result.entry;
    var el = document.createElement('a');
    el.href = resolveUrl(entry.url);
    el.className = 'search-suggestion-item';
    el.setAttribute('role', 'option');
    if (index === activeIndex) el.classList.add('active');
    el.innerHTML =
      '<span class="search-suggestion-cat">' + escapeHtml(entry.category) + '</span>' +
      '<span class="search-suggestion-text">' +
        '<span class="search-suggestion-title">' + highlight(entry.title, input.value) + '</span>' +
        '<span class="search-suggestion-desc">' + highlight(makeSnippet(entry.description, input.value), input.value) + '</span>' +
      '</span>';
    return el;
  }

  function renderDropdown(query) {
    dropdown.innerHTML = '';

    if (!query.trim()) {
      closeDropdown();
      return;
    }

    currentResults = runSearch(query, 8);
    activeIndex = -1;
    dropdown.classList.add('show');

    if (!currentResults.length) {
      dropdown.innerHTML = '<p class="search-no-results">No results for “' + escapeHtml(query) + '”. Try a different term.</p>';
      return;
    }

    var list = document.createElement('div');
    list.setAttribute('role', 'listbox');
    currentResults.forEach(function (result, i) {
      list.appendChild(renderResultItem(result, i));
    });
    dropdown.appendChild(list);
  }

  var debouncedRender = debounce(function () {
    renderDropdown(input.value);
  }, 120);

  input.addEventListener('input', function () {
    updateClearButton();
    debouncedRender();
  });

  input.addEventListener('focus', function () {
    if (input.value) renderDropdown(input.value);
  });

  input.addEventListener('keydown', function (e) {
    var items = dropdown.querySelectorAll('.search-suggestion-item');

    if (e.key === 'ArrowDown' && items.length) {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      renderDropdown(input.value);
    } else if (e.key === 'ArrowUp' && items.length) {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, -1);
      renderDropdown(input.value);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      var target = currentResults[activeIndex > -1 ? activeIndex : 0];
      if (target) window.location.href = resolveUrl(target.entry.url);
    } else if (e.key === 'Escape') {
      input.value = '';
      updateClearButton();
      closeSearchPanel();
    }
  });

  // Click outside the panel (and outside the toggle button) closes the panel.
  document.addEventListener('click', function (e) {
    if (!searchPanel) return;
    if (!searchPanel.classList.contains('open')) return;
    if (searchPanel.contains(e.target) || (searchToggle && searchToggle.contains(e.target))) return;
    closeSearchPanel();
  });

  // "/" or Ctrl/Cmd+K opens the panel and focuses the input — desktop only, and not while typing elsewhere.
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;

    if (!isDesktop()) return;

    if (!typing && e.key === '/') {
      e.preventDefault();
      openSearchPanel();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchPanel();
    }
  });

}());
