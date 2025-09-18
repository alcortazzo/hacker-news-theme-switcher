# Hacker News Theme Switcher

Simple Firefox and Chrome extension to switch Hacker News between Light, Dark, or System theme. Adds a small dropdown. Nothing else.

## Install

-   Firefox Add-ons: https://addons.mozilla.org/en-US/firefox/addon/hacker-news-theme-switcher/
-   Chrome Web Store: https://chromewebstore.google.com/detail/hacker-news-theme-switche/elkikjmnlnadlcebiooibcplnenjglip

## Features

-   Light / Dark / System modes
-   Saves your choice
-   System option tracks OS theme changes

## Screenshots

|             Light             |            Dark             |
| :---------------------------: | :-------------------------: |
| ![Light theme](img/light.png) | ![Dark theme](img/dark.png) |

## How it works

`content.js` injects a `<select>` and toggles a `hn-dark-theme` class. `matchMedia('(prefers-color-scheme: dark)')` is used for System mode.

## Permissions

Uses only `storage` to remember the selected theme. No network, no tracking.

## License

MIT (see `LICENSE`).
