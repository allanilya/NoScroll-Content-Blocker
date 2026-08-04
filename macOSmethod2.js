// ==UserScript==
// @name         ShortBlocker
// @namespace    https://github.com/yourusername/shortblocker
// @version      1.0
// @description  Block YouTube Shorts and Instagram Reels
// @author       Allan Ilyasov
// @match        *://*.youtube.com/*
// @match        *://*.instagram.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // For YouTube
    if(window.location.hostname.includes('youtube.com')) {
        const style = document.createElement('style');
        style.textContent = `
            ytd-guide-entry-renderer[title="Shorts"],
            ytd-mini-guide-entry-renderer[title="Shorts"],
            a[title="Shorts"],
            a[href="/shorts"],
            #shorts-inner-container,
            #shorts-container,
            ytd-rich-grid-slim-renderer[is-shorts],
            ytd-rich-section-renderer[is-shorts],
            ytd-reel-shelf-renderer,
            ytd-shorts,
            ytd-shorts-carousel-renderer,
            ytd-shorts-video-renderer,
            ytd-reel-item-renderer,
            .pivot-shorts, 
            .pivot-bar-item-renderer[tab-identifier="FEshorts"], 
            button[aria-label*="Shorts"], 
            ytm-pivot-bar-item-renderer[tab-identifier="FEshorts"], 
            .ytm-shorts-shelf, 
            [data-content-type="shorts"], 
            [tab-title="Shorts"]
            { display: none !important; }
        `;
        document.head.appendChild(style);
        
        // Mutation observer to handle dynamically loaded content
        const observer = new MutationObserver(() => {
            const shortsElements = document.querySelectorAll(
                'ytd-guide-entry-renderer[title="Shorts"], ytd-mini-guide-entry-renderer[title="Shorts"], a[title="Shorts"], a[href="/shorts"], #shorts-inner-container, #shorts-container, ytd-rich-grid-slim-renderer[is-shorts], ytd-rich-section-renderer[is-shorts], ytd-reel-shelf-renderer, ytd-shorts, ytd-shorts-carousel-renderer, ytd-shorts-video-renderer, ytd-reel-item-renderer, .pivot-shorts, .pivot-bar-item-renderer[tab-identifier="FEshorts"], button[aria-label*="Shorts"], ytm-pivot-bar-item-renderer[tab-identifier="FEshorts"], .ytm-shorts-shelf, [data-content-type="shorts"], [tab-title="Shorts"]'
            );
            shortsElements.forEach(el => {
                el.style.display = 'none';
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });

        // Remove thumbnails
        const thumbStyle = document.createElement('style');
        thumbStyle.textContent = `
            ytd-thumbnail img, ytd-rich-thumbnail img,
            ytd-moving-thumbnail-renderer, yt-image img
            { display: none !important; }
        `;
        document.head.appendChild(thumbStyle);

        // Block live sound previews on hover
        function mutePreviewVideo(video) {
            video.muted = true;
            video.volume = 0;
            video.addEventListener('volumechange', () => {
                if (!video.muted) {
                    video.muted = true;
                    video.volume = 0;
                }
            });
        }

        const previewObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.tagName === 'VIDEO' && node.closest('ytd-video-preview, ytd-thumbnail-overlay-inline-unplayable-renderer')) {
                        mutePreviewVideo(node);
                    }
                    node.querySelectorAll('ytd-video-preview video, ytd-thumbnail-overlay-inline-unplayable-renderer video').forEach(mutePreviewVideo);
                }
            }
        });

        previewObserver.observe(document.body, { childList: true, subtree: true });
    }

    // For Instagram
    if(window.location.hostname.includes('instagram.com')) {
        const style = document.createElement('style');
        style.textContent = `
            a[href="/reels/"], 
            a[href*="/reels"], 
            div[role="tablist"] a:nth-child(2), 
            div[data-media-type="reels"]
            { display: none !important; }
        `;
        document.head.appendChild(style);
        
        // Mutation observer for Instagram
        const observer = new MutationObserver(() => {
            const reelsElements = document.querySelectorAll(
                'a[href="/reels/"], a[href*="/reels"], div[role="tablist"] a:nth-child(2), div[data-media-type="reels"]'
            );
            reelsElements.forEach(el => {
                el.style.display = 'none';
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();