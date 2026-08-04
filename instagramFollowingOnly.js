// ==UserScript==
// @name         Instagram Following-Only Feed
// @namespace    https://github.com/yourusername/shortblocker
// @version      1.0
// @description  Hide non-following content (Suggested/Sponsored posts) from Instagram home feed
// @author       Allan Ilyasov
// @match        *://*.instagram.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    if (!window.location.hostname.includes('instagram.com')) return;

    // Flip to false once everything is confirmed working.
    const DEBUG = true;
    const log = (...args) => { if (DEBUG) console.log('[NoScroll IG]', ...args); };

    log('script loaded on', window.location.href);

    // Exact-text labels that only ever appear as their own element (not substrings of captions)
    const EXACT_LABELS = ['Follow', 'Ad', 'Sponsored'];
    // Markers that indicate "end of following's posts, suggested content starts here"
    const CUTOFF_MARKERS = ["You're all caught up", 'Suggested Posts', 'Suggested for you'];

    function isHomeFeed() {
        return window.location.pathname === '/' || window.location.pathname === '';
    }

    // --- Per-post detection: hide any article with an exact "Follow"/"Ad"/"Sponsored" label ---
    function articleHasExactLabel(article) {
        const candidates = article.querySelectorAll('button, div[role="button"], span, a');
        for (const el of candidates) {
            if (el.children.length > 0) continue; // only leaf elements, avoid matching whole subtrees
            const t = (el.textContent || '').trim();
            if (EXACT_LABELS.includes(t)) return t;
        }
        return null;
    }

    function hideFlaggedPosts() {
        if (!isHomeFeed()) return;

        const articles = document.querySelectorAll('article');
        articles.forEach(article => {
            if (article.dataset.nsChecked === '1') return;

            const label = articleHasExactLabel(article);
            log('post scanned, matched label:', label);

            if (label) {
                article.style.display = 'none';
                log('HIDDEN a post via label:', label);
            }

            article.dataset.nsChecked = '1';
        });
    }

    // --- Structural cutoff: once we find the "caught up" / "Suggested Posts" marker,
    // hide it and everything after it at that nesting level, so nothing suggested renders. ---
    let cutoffParent = null;
    let cutoffIndex = -1;

    // The real feed list is the closest common ancestor of all <article> posts.
    // Searching only inside this container (never the whole page) avoids matching
    // unrelated UI like the desktop sidebar's "Suggested for you" follow-suggestions widget.
    function getFeedContainer() {
        const articles = document.querySelectorAll('article');
        if (articles.length === 0) return null;

        let ancestor = articles[0].parentElement;
        const last = articles[articles.length - 1];
        while (ancestor && !ancestor.contains(last)) {
            ancestor = ancestor.parentElement;
        }
        return ancestor;
    }

    function findCutoffMarkerLeaf(feedContainer) {
        const walker = document.createTreeWalker(feedContainer, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            const t = node.textContent.trim();
            if (CUTOFF_MARKERS.some(marker => t === marker || t.startsWith(marker))) {
                return node.parentElement;
            }
        }
        return null;
    }

    function establishCutoff() {
        if (cutoffParent) return;
        if (!isHomeFeed()) return;

        const feedContainer = getFeedContainer();
        if (!feedContainer) return;

        const leaf = findCutoffMarkerLeaf(feedContainer);
        if (!leaf) return;

        for (let ancestor = leaf; ancestor && ancestor !== feedContainer; ancestor = ancestor.parentElement) {
            const parent = ancestor.parentElement;
            if (!parent) break;
            const siblings = Array.from(parent.children);
            const idx = siblings.indexOf(ancestor);
            const laterSiblings = siblings.slice(idx + 1);
            const hasArticleAfter = laterSiblings.some(
                sib => sib.tagName === 'ARTICLE' || sib.querySelector('article')
            );
            if (hasArticleAfter) {
                cutoffParent = parent;
                cutoffIndex = idx;
                log('cutoff established at', ancestor, 'index', idx, 'of parent', parent);
                return;
            }
        }
        log('cutoff marker text found inside feed but could not locate a list-level ancestor');
    }

    function applyCutoff() {
        if (!cutoffParent) return;
        const siblings = Array.from(cutoffParent.children);
        siblings.slice(cutoffIndex).forEach(el => {
            if (el.style.display !== 'none') {
                el.style.display = 'none';
                log('cutoff-hidden element', el);
            }
        });
    }

    function runAll() {
        hideFlaggedPosts();
        establishCutoff();
        applyCutoff();
    }

    const observer = new MutationObserver(runAll);
    observer.observe(document.body, { childList: true, subtree: true });

    // Re-scan on SPA navigation (Instagram is a React app, no full reloads)
    let lastPath = window.location.pathname;
    setInterval(() => {
        if (window.location.pathname !== lastPath) {
            lastPath = window.location.pathname;
            document.querySelectorAll('article[data-ns-checked]').forEach(a => delete a.dataset.nsChecked);
            cutoffParent = null;
            cutoffIndex = -1;
        }
    }, 500);

    runAll();
})();
