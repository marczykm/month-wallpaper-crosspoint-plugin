# Month Wallpaper

Puts a **month calendar on the reader's sleep screen**, refreshed automatically
every time the reader goes to sleep. Nothing to run or pick manually.

You do **not** need to host anything — the plugin uses a hosted instance at
`https://crosspoint-calendar.marczyk.ovh`. To run your own, change the `url` in
`device.json` to your server (it must serve `GET /current.bmp`).

```
reader ──(on sleep)──GET /current.bmp?...──▶ server   (1-bit BMP, current month)
       └▶ /sleep.bmp
```

## Install

Install *Month Wallpaper* from Plugin Hub, or copy this folder
(`manifest.json`, `device.json`, `config.json`, `plugin.js`) to
`/.crosspoint/plugins/monthwallpaper/` on the SD card. Enable plugins in
Settings and restart the reader (event subscriptions are built at boot).

The plugin works out of the box with the defaults. To change them, use the web
UI under **Settings → Month Wallpaper** (Save writes `config.json` in the plugin
folder), or edit the file by hand:

```json
{
  "width": 480,
  "height": 800,
  "country": "US",
  "week_start": "monday",
  "show_adjacent": true
}
```

| Key | Meaning |
|---|---|
| `width`, `height` | Your screen resolution in pixels. |
| `country` | ISO 3166 alpha-2 code (`US`, `DE`, `PL`, …), or `none`. Sets the public holidays **and** the month/weekday name language (its main language). |
| `week_start` | `monday` or `sunday`. |
| `show_adjacent` | `true` to fill leading/trailing cells with the greyed dates of the neighbouring months. |

## How it works

On every sleep the reader downloads the current month to `/sleep.bmp` in the
root of the SD card. The **CUSTOM** sleep screen mode reads that file first, so
set the sleep screen to CUSTOM in the reader settings.
It needs WiFi (battery ≥ 20% and a saved network); if the connection fails, the
previous image is shown. Delivery waits for the next sleep.
