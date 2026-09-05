# Wplace Overlay Gallery Tweaks

A userscript that tweaks Wplace's new overlay gallery and template tools to give them a simpler user experience without removing the features introduced in the September 2026 1.6.0 update.

⚠️ **Currently in beta.** This is a work-in-progress done as a proof of concept, so bugs and broken functionality are not only possible but expected. So far I have only worked on the overlay menu/modal, so be on the lookout for updates that expand the number of features.

## Features
* **Click anywhere on a template row to start painting**, rather than opening the details screen first, just like the old UI.
* **Compact list view** for the overlay gallery, similar to the old look.
* **List/Grid toggle** so you can switch back to Wplace's new gallery layout whenever you want.
* **Optional progress bars** in case you find them to be an unnecessary eyesore like me.
* **Quick template actions** accessible directly from the gallery:
  * Edit placement
  * Edit pixels
  * View details
  * Delete
* **Template information tweaks**, including:
  * Layout adjusted slightly and now shows total pixel count
* Your selected preferences are remembered between visits.

More coming soon! The toolbar will be next.

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser.
2. Open [the userscript](https://raw.githubusercontent.com/VWBeetle/wplace-overlay-gallery-tweaks/main/wplace-overlay-gallery-tweaks.user.js).
3. Tampermonkey should prompt you to install it.
4. Reload [wplace.live](https://wplace.live/).

The script will run automatically whenever you use Wplace.

## Why?

Wplace's 1.6.0 update introduced a redesigned overlay gallery and new template management tools. While the update adds useful functionality, it also takes more clicks to perform some common actions and displays fewer templates at once. It also has so many controls that it can be overwhelming.

This script keeps the new functionality while making the gallery more compact and putting commonly used template actions closer at hand.

The end goal is to use this script as a base to update my [Template Tools](https://github.com/VWBeetle/wplace-template-tools/) user script to work with the updated Wplace, but I decided it would be good to publish as a standalone script first for anyone looking to return to something more similar to the old Wplace UI.

## Credits

Icons used by the script are from [Heroicons](https://heroicons.com/) by Tailwind Labs and are licensed under the MIT License.

## License

MIT License
