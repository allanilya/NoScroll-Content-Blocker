# NoScroll

A simple solution to block addictive short-form video content (YouTube Shorts, Instagram Reels) on mobile browsers.

## Overview

NoScroll helps you reclaim your attention by removing distracting short-form video content from popular social media platforms when browsing on mobile devices. This project focuses on making the blocking process as simple as possible for Safari on iOS and macOS.

## Features

 -✅ Block YouTube Shorts in Safari (iOS & macOS)
- ✅ Block Instagram Reels in Safari (iOS & macOS)
- ✅ User-friendly installation instructions
- ✅ No programming knowledge required
- ✅ Free and open source


## iOS Instructions

### Content Blocker App (1Blocker, AdGuard, etc.)

1. Install a content blocker app that supports custom rules:
   - [1Blocker](https://apps.apple.com/app/1blocker-ad-blocker-privacy/id1365531024) (Free version works)
   - [AdGuard](https://apps.apple.com/app/adguard-adblock-privacy/id1047223162) (Free version works)

2. Add custom CSS rules for YouTube Shorts:
   ```
   /* In your content blocker app */
   URL pattern: *youtube.com*
   CSS Selector: ytd-rich-shelf-renderer[is-shorts],ytd-reel-shelf-renderer,ytd-reel-item-renderer,ytd-shorts,ytd-shorts-carousel-renderer,ytd-shorts-video-renderer,ytd-rich-grid-slim-renderer[is-shorts],ytd-rich-section-renderer[is-shorts],ytd-guide-entry-renderer[title="Shorts"],ytd-mini-guide-entry-renderer[title="Shorts"],a[title="Shorts"],a[href="/shorts"],[href*="/shorts/"],[title*="shorts"],#shorts-inner-container,#shorts-container,.pivot-shorts,.pivot-bar-item-renderer[tab-identifier="FEshorts"],button[aria-label*="Shorts"],ytm-pivot-bar-item-renderer[tab-identifier="FEshorts"],.ytm-shorts-shelf,[data-content-type="shorts"],[tab-title="Shorts"],ytd-video-preview,ytd-thumbnail-overlay-inline-unplayable-renderer

   ```

3. Add custom CSS rules for Instagram Reels:
   ```
   /* In your content blocker app */
   URL pattern: *instagram.com*
   CSS Selector: a[href="/reels/"], a[href*="/reels"], div[role="tablist"] a:nth-child(2), div[data-media-type="reels"]
   ```

## macOS Instructions

### Method 1: Content Blocker Extension

1. Install a content blocker extension for Safari:
   - [1Blocker](https://1blocker.com)
   - [AdGuard](https://adguard.com/en/adguard-mac/overview.html)

2. Add custom CSS rules as described in the iOS instructions above

### Method 2: User Script Manager

1. Install a user script manager:
   - [Userscripts Safari Extension](https://github.com/quoid/userscripts)

2. Create a new script using macOSmethod2.js

## Disclaimer

This project is not affiliated with YouTube, Instagram, or their parent companies. Use at your own risk.