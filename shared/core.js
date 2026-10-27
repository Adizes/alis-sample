/* Shared browser utilities (bundled inside each widget's private scope). */
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function md(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }
function fill(s, map) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; }); }
function store(key, val) { try { if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
function load(key) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
function qs(name) { try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; } }

var SCRIPT_SRC = (document.currentScript && document.currentScript.src) || '';
// .../<tool>/dist/<file>.js  →  .../shared/assets/
function detectAssets() { return SCRIPT_SRC ? SCRIPT_SRC.replace(/\/[^\/]+\/dist\/[^\/]*$/, '/shared/assets/') : ''; }

function loadScript(src) {
  return new Promise(function (res, rej) {
    var s = document.createElement('script');
    s.src = src; s.async = true; s.onload = res; s.onerror = function () { rej(new Error('load ' + src)); };
    document.head.appendChild(s);
  });
}
function fetchB64(url) {
  return fetch(url).then(function (r) { if (!r.ok) throw new Error(url + ' ' + r.status); return r.arrayBuffer(); }).then(function (buf) {
    var bytes = new Uint8Array(buf), bin = '', chunk = 0x8000;
    for (var i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    return btoa(bin);
  });
}

// POST to the Apps Script web app. text/plain avoids the CORS preflight.
function api(endpoint, payload, timeoutMs) {
  if (!endpoint) return Promise.resolve({ ok: true, demo: true, id: 'DEMO-' + Date.now().toString(36).toUpperCase() });
  var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  var t = ctrl ? setTimeout(function () { ctrl.abort(); }, timeoutMs || 30000) : null;
  return fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow',
    signal: ctrl ? ctrl.signal : undefined,
  }).then(function (r) { return r.json(); }).then(function (j) {
    if (t) clearTimeout(t);
    if (!j || !j.ok) { var e = new Error((j && j.error) || 'server'); e.code = j && j.error; throw e; }
    return j;
  }, function (e) { if (t) clearTimeout(t); throw e; });
}

function injectStyle(id, css, rootSel) {
  if (document.getElementById(id)) return;
  var st = document.createElement('style');
  st.id = id;
  st.textContent = css.split('__ROOT__').join(rootSel);
  document.head.appendChild(st);
}
function loadFontCss() {
  if (document.querySelector('link[data-adz-font]')) return;
  var l = document.createElement('link');
  l.rel = 'stylesheet'; l.setAttribute('data-adz-font', '1');
  l.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap';
  document.head.appendChild(l);
}
function utmMeta(startedAt) {
  return {
    page: location.href.split('#')[0], referrer: document.referrer || '',
    utm_source: qs('utm_source') || '', utm_medium: qs('utm_medium') || '', utm_campaign: qs('utm_campaign') || '',
    utm_content: qs('utm_content') || '', utm_term: qs('utm_term') || '',
    startedAt: startedAt || '', tz: (Intl.DateTimeFormat().resolvedOptions().timeZone || ''),
  };
}
function formatDate(iso, locale) {
  try { return new Date(iso || Date.now()).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }); }
  catch (e) { return String(iso || '').slice(0, 10); }
}
