// ==UserScript==
// @name         Hide YouTube Thumbnails
// @namespace    https://github.com/yourusername/shortblocker
// @version      1.0
// @description  Remove all YouTube video thumbnails
// @author       Allan Ilyasov
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS at document-start before content loads
    const style = document.createElement('style');
    style.textContent = `
        ytd-thumbnail, ytd-rich-thumbnail,
        ytd-moving-thumbnail-renderer, yt-image,
        #thumbnail, a#thumbnail
        { display: none !important; }
    `;
    (document.head || document.documentElement).appendChild(style);

    const SELECTOR = 'ytd-thumbnail, ytd-rich-thumbnail, ytd-moving-thumbnail-renderer, yt-image, #thumbnail, a#thumbnail';

    function hideThumbnails() {
        document.querySelectorAll(SELECTOR).forEach(el => {
            el.style.display = 'none';
        });
    }

    // Re-run on every YouTube SPA navigation
    window.addEventListener('yt-navigate-finish', hideThumbnails);

    const observer = new MutationObserver(hideThumbnails);
    document.addEventListener('DOMContentLoaded', () => {
        hideThumbnails();
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
