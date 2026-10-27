/* Express Diagnostics — on-screen visuals (HTML causal map + SVG radar). Class names use the "adz-" prefix. */
function edDiagramHtml(t, r) {
  function cell(key) {
    var c = edCellByKey(r, key);
    return '<div class="adz-cell is-' + c.color + (r.participants > 1 ? ' is-' + c.border : '') + '">' +
      '<span>' + esc(t.diagram.labels[key]) + '</span><b>' + Math.round(c.percent) + '%</b></div>';
  }
  function rows(list, cls) { return list.map(function (row) { return '<div class="adz-row ' + cls + '">' + row.map(cell).join('') + '</div>'; }).join(''); }
  var D = ED_DIAGRAM, arrow = '<div class="adz-arrow" aria-hidden="true"></div>';
  return '<div class="adz-diagram">' +
    '<div class="adz-box adz-box--ext">' + esc(t.diagram.external) + '</div>' + arrow +
    '<div class="adz-box adz-box--int"><div class="adz-box-t">' + esc(t.diagram.internal) + '</div>' +
      '<div class="adz-box adz-box--white"><div class="adz-box-t">' + esc(t.diagram.causes) + '</div>' +
        '<div class="adz-culture"><div class="adz-box-t">' + esc(t.diagram.culture) + '</div>' + rows([D.culture], 'adz-row--2') + '</div>' +
        rows(D.causes, 'adz-row--3') +
      '</div>' + arrow +
      '<div class="adz-box adz-box--white"><div class="adz-box-t">' + esc(t.diagram.subsystems) + '</div>' + rows(D.subsystems, 'adz-row--2') + '</div>' + arrow +
      '<div class="adz-box adz-box--white"><div class="adz-box-t">' + esc(t.diagram.manifestations) + '</div>' + rows(D.manifestations, 'adz-row--2') + '</div>' +
    '</div></div>';
}

function edRadarSvg(t, r, ids, title) {
  var n = ids.length, S = 360, cx = S / 2, cy = S / 2, R = 112;
  var cells = ids.map(function (id) { return ED.cellById(r, id); });
  function pt(i, pct) { var a = (-90 + i * 360 / n) * Math.PI / 180; return [cx + R * pct / 100 * Math.cos(a), cy + R * pct / 100 * Math.sin(a)]; }
  function poly(pct) { var p = []; for (var i = 0; i < n; i++) p.push(pt(i, pct).map(function (v) { return v.toFixed(1); }).join(',')); return p.join(' '); }
  var g = '';
  [25, 50, 75, 100].forEach(function (v) { g += '<polygon points="' + poly(v) + '" class="adz-grid"/>'; });
  for (var i = 0; i < n; i++) { var e = pt(i, 100); g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '" class="adz-grid"/>'; }
  g += '<polygon points="' + poly(r.norms.upperPercent) + '" class="adz-ref adz-ref--ok"/>';
  g += '<polygon points="' + poly(r.norms.lowerPercent) + '" class="adz-ref adz-ref--bad"/>';
  var you = cells.map(function (c, k) { return pt(k, Math.max(0, Math.min(100, c.percent))).map(function (v) { return v.toFixed(1); }).join(','); }).join(' ');
  g += '<polygon points="' + you + '" class="adz-you"/>';
  cells.forEach(function (c, k) { var p = pt(k, Math.max(0, Math.min(100, c.percent))); g += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.5" class="adz-dot"/>'; });
  cells.forEach(function (c, k) {
    var a = (-90 + k * 360 / n) * Math.PI / 180, lx = cx + (R + 16) * Math.cos(a), ly = cy + (R + 16) * Math.sin(a);
    var anchor = Math.abs(Math.cos(a)) < 0.2 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
    var dy = Math.sin(a) < -0.2 ? -8 : Math.sin(a) > 0.2 ? 12 : 2;
    var words = t.cells[c.key].split(' '), lines = [], cur = '';
    words.forEach(function (w) { if ((cur + ' ' + w).trim().length > 14 && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); });
    lines.push(cur);
    var base = ly + dy - (Math.sin(a) < -0.2 ? (lines.length - 1) * 12 : 0);
    g += '<text x="' + lx.toFixed(1) + '" y="' + base.toFixed(1) + '" text-anchor="' + anchor + '" class="adz-lbl">' +
      lines.map(function (l, j) { return '<tspan x="' + lx.toFixed(1) + '" dy="' + (j ? 12 : 0) + '">' + esc(l) + '</tspan>'; }).join('') +
      '<tspan x="' + lx.toFixed(1) + '" dy="12" class="adz-val is-' + c.color + '">' + Math.round(c.percent) + '%</tspan></text>';
  });
  return '<figure class="adz-radar"><figcaption>' + esc(title) + '</figcaption><svg viewBox="-60 -10 ' + (S + 120) + ' ' + (S + 30) + '" role="img" aria-label="' + esc(title) + '">' + g + '</svg></figure>';
}
