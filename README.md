# Month Wallpaper – CrossPoint plugin

Month-calendar sleep wallpaper plugin for CrossPoint readers. The installable
plugin lives in [`monthwallpaper.crosspoint-plugin/`](monthwallpaper.crosspoint-plugin/);
see its README for usage and configuration.

## Releasing

Plugin Hub discovers this repository via the `crosspoint-plugin` topic and
publishes from immutable GitHub Release tags.

1. Change the plugin and bump `version` in `manifest.json` and `device.json`
   (`MAJOR.MINOR.PATCH`). Never reuse a tag.
2. Merge to `main`.
3. Publish a non-draft, non-prerelease Release whose tag equals the manifest
   version (e.g. `1.2.0`).
