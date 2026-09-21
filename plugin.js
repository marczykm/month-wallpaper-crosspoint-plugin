// Month Wallpaper settings. Edits /.crosspoint/month-wallpaper.json, which the
// on-device screen (device.json) reads as {cfg.KEY} to build the catalog URL.
// If the file is missing, it is created with the server's defaults so the
// on-device screen always has every key to substitute.
CrossPoint.registerPlugin(async (container, api) => {
  const CONFIG_PATH = '/.crosspoint/month-wallpaper.json';
  const DEFAULTS = {
    width: 480,
    height: 800,
    country: 'none',
    week_start: 'monday',
    show_adjacent: true,
  };

  container.innerHTML =
    '<h2>Month Wallpaper</h2>' +
    '<p id="mw-status">Checking configuration…</p>' +
    '<div class="setting-row"><span class="setting-name">Screen width (px)</span>' +
    '<span class="setting-control"><input type="number" id="mw-width" min="1" step="1"></span></div>' +
    '<div class="setting-row"><span class="setting-name">Screen height (px)</span>' +
    '<span class="setting-control"><input type="number" id="mw-height" min="1" step="1"></span></div>' +
    '<div class="setting-row"><span class="setting-name">Country</span>' +
    '<span class="setting-control"><input type="text" id="mw-country" maxlength="4" placeholder="US, DE, PL… or none"></span></div>' +
    '<div class="setting-row"><span class="setting-name">Week starts on</span>' +
    '<span class="setting-control"><select id="mw-week">' +
    '<option value="monday">Monday</option><option value="sunday">Sunday</option>' +
    '</select></span></div>' +
    '<div class="setting-row"><span class="setting-name">Show adjacent months</span>' +
    '<span class="setting-control"><input type="checkbox" id="mw-adjacent"></span></div>' +
    '<div class="setting-row">' +
    '<button type="button" class="btn-small btn-add" id="mw-save">Save</button> ' +
    '<button type="button" class="btn-small" id="mw-reset">Reset to defaults</button>' +
    '</div>' +
    '<p style="color:#666">Country sets public holidays and the month/weekday language ' +
    '(ISO 3166 alpha-2 code, or "none"). Download the wallpaper on the reader: ' +
    'Settings &gt; System &gt; Plugins &gt; Month Wallpaper.</p>';

  const widthEl = document.getElementById('mw-width');
  const heightEl = document.getElementById('mw-height');
  const countryEl = document.getElementById('mw-country');
  const weekEl = document.getElementById('mw-week');
  const adjacentEl = document.getElementById('mw-adjacent');
  const status = (t) => { document.getElementById('mw-status').textContent = t; };

  async function loadConfig() {
    try {
      const r = await fetch('/download?path=' + encodeURIComponent(CONFIG_PATH));
      if (!r.ok) return null;
      return JSON.parse(await r.text());
    } catch (e) {
      return null;
    }
  }

  function writeConfig(cfg) {
    return api.writeFile(CONFIG_PATH, btoa(JSON.stringify(cfg)));
  }

  function fill(cfg) {
    widthEl.value = cfg.width;
    heightEl.value = cfg.height;
    countryEl.value = cfg.country;
    weekEl.value = cfg.week_start === 'sunday' ? 'sunday' : 'monday';
    adjacentEl.checked = cfg.show_adjacent !== false && cfg.show_adjacent !== 'false';
  }

  function currentConfig() {
    const width = parseInt(widthEl.value, 10);
    const height = parseInt(heightEl.value, 10);
    if (!(width > 0) || !(height > 0)) throw new Error('width and height must be positive numbers');
    const country = countryEl.value.trim();
    if (country && country.toLowerCase() !== 'none' && !/^[A-Za-z]{2}$/.test(country)) {
      throw new Error('country must be a two-letter code or "none"');
    }
    return {
      width,
      height,
      country: !country || country.toLowerCase() === 'none' ? 'none' : country.toUpperCase(),
      week_start: weekEl.value,
      show_adjacent: adjacentEl.checked,
    };
  }

  document.getElementById('mw-save').onclick = async () => {
    try {
      const cfg = currentConfig();
      await writeConfig(cfg);
      fill(cfg);
      status('Saved.');
    } catch (e) {
      status('Error: ' + e.message);
    }
  };

  document.getElementById('mw-reset').onclick = async () => {
    try {
      await writeConfig(DEFAULTS);
      fill(DEFAULTS);
      status('Reset to defaults.');
    } catch (e) {
      status('Error: ' + e.message);
    }
  };

  const existing = await loadConfig();
  if (existing) {
    // Keys missing from a hand-written file fall back to the defaults.
    fill({ ...DEFAULTS, ...existing });
    status('Configured. Change below and Save.');
  } else {
    fill(DEFAULTS);
    try {
      await writeConfig(DEFAULTS);
      status('Created a default configuration. Change below and Save.');
    } catch (e) {
      status('Not configured yet (could not create defaults: ' + e.message + ').');
    }
  }
});
