/* Shared PDF helpers (jsPDF + Montserrat). Bundled inside each widget and the admin. */
var JSPDF_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
var PDF_ASSETS = {};
function getPdfAssets(base) {
  if (PDF_ASSETS[base]) return PDF_ASSETS[base];
  var jsp = (window.jspdf && window.jspdf.jsPDF) ? Promise.resolve() : loadScript(JSPDF_URL);
  var f = function (n) { return fetchB64(base + 'fonts/Montserrat-' + n + '.ttf'); };
  var img = function (n) { return fetchB64(base + n).then(function (b) { return 'data:image/png;base64,' + b; }).catch(function () { return null; }); };
  var p = Promise.all([jsp, f('Light'), f('Regular'), f('SemiBold'), f('Bold'), img('adizes-logo-color.png'), img('adizes-logo-color-white.png'), img('arrow-red.png'), img('arrow-white.png')])
    .then(function (a) { return { fonts: { Light: a[1], Regular: a[2], SemiBold: a[3], Bold: a[4] }, logo: a[5], logoWhite: a[6], arrowRed: a[7], arrowWhite: a[8] }; });
  p.catch(function () { delete PDF_ASSETS[base]; });
  PDF_ASSETS[base] = p;
  return p;
}

function hexRgb(hex) { var n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }

var PDF_C = {
  INK: '#111111', MUTED: '#5f6368', SOFT: '#8a8f96', LINE: '#e4e4e4', PAPER: '#f5f5f5', RED: '#d7141a', WHITE: '#ffffff',
  green: '#1e8e4e', yellow: '#d9a400', red: '#d7141a', yellowText: '#9a7200',
  greenT: '#dcf2e5', yellowT: '#fff0bf', redT: '#fbd6d7',
};

// New letter-size document with Montserrat registered as family 'M' (light/regular/semibold/bold).
function newPdf(A) {
  var doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'letter', compress: true });
  ['Light', 'Regular', 'SemiBold', 'Bold'].forEach(function (w) {
    doc.addFileToVFS('M-' + w + '.ttf', A.fonts[w]);
    doc.addFont('M-' + w + '.ttf', 'M', w.toLowerCase());
  });
  return doc;
}

function pdfKit(doc) {
  var K = {};
  K.font = function (w, size, color) { doc.setFont('M', w); doc.setFontSize(size); doc.setTextColor.apply(doc, hexRgb(color || PDF_C.INK)); };
  K.fill = function (c) { doc.setFillColor.apply(doc, hexRgb(c)); };
  K.stroke = function (c, w) { doc.setDrawColor.apply(doc, hexRgb(c)); if (w != null) doc.setLineWidth(w); };
  K.dash = function (arr) { if (doc.setLineDashPattern) doc.setLineDashPattern(arr || [], 0); };
  K.alpha = function (a) { if (doc.setGState) doc.setGState(new doc.GState({ opacity: a })); };
  K.split = function (text, width, w, size) { doc.setFont('M', w); doc.setFontSize(size); return doc.splitTextToSize(String(text), width); };
  // Wrapped text with **bold** spans. Returns the y after the last line.
  K.rich = function (text, x, y, width, size, opts) {
    opts = opts || {};
    var lh = size * (opts.lh || 1.5), color = opts.color || PDF_C.INK, bcolor = opts.bold || color;
    var reg = opts.weight || 'regular', bw = opts.boldWeight || 'bold';
    var tokens = [];
    String(text).split(/(\*\*.+?\*\*)/).forEach(function (part) {
      if (!part) return;
      var b = /^\*\*.+\*\*$/.test(part); if (b) part = part.slice(2, -2);
      part.split(/(\s+)/).forEach(function (w) { if (w) tokens.push({ w: w, b: b }); });
    });
    var lines = [[]], lw = 0;
    tokens.forEach(function (tk) {
      doc.setFont('M', tk.b ? bw : reg); doc.setFontSize(size);
      var tw = doc.getTextWidth(tk.w), space = /^\s+$/.test(tk.w);
      if (!space && lw + tw > width && lines[lines.length - 1].length) { lines.push([]); lw = 0; }
      if (space && !lines[lines.length - 1].length) return;
      lines[lines.length - 1].push({ w: tk.w, b: tk.b, tw: tw }); lw += tw;
    });
    lines.forEach(function (ln) {
      while (ln.length && /^\s+$/.test(ln[ln.length - 1].w)) ln.pop();
      var cx = x;
      if (opts.align === 'center') { var tot = ln.reduce(function (a, b) { return a + b.tw; }, 0); cx = x + (width - tot) / 2; }
      ln.forEach(function (tk) {
        K.font(tk.b ? bw : reg, size, tk.b ? bcolor : color);
        if (!/^\s+$/.test(tk.w)) doc.text(tk.w, cx, y);
        cx += tk.tw;
      });
      y += lh;
    });
    return y;
  };
  K.richHeight = function (text, width, size, opts) {
    opts = opts || {};
    return K.split(String(text).replace(/\*\*/g, ''), width, opts.weight || 'regular', size).length * size * (opts.lh || 1.5);
  };
  // Down arrow (line + head)
  K.arrowDown = function (x, y1, y2, color, w) {
    K.stroke(color || PDF_C.INK, w || 1.4); K.dash([]); doc.line(x, y1, x, y2 - 4);
    K.fill(color || PDF_C.INK); doc.triangle(x - 4, y2 - 5, x + 4, y2 - 5, x, y2, 'F');
  };
  return K;
}

/* Radar chart: values in 0–100 (%), labels per axis, clockwise from the top. */
function pdfRadar(doc, K, cx, cy, R, values, labels, opts) {
  opts = opts || {};
  var n = values.length;
  function pt(i, pct) { var a = (-90 + i * 360 / n) * Math.PI / 180; return [cx + R * pct / 100 * Math.cos(a), cy + R * pct / 100 * Math.sin(a)]; }
  function poly(pct) { var p = []; for (var i = 0; i < n; i++) p.push(pt(i, pct)); return p; }
  function path(points, style) {
    var rel = []; for (var i = 1; i < points.length; i++) rel.push([points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]]);
    doc.lines(rel, points[0][0], points[0][1], [1, 1], style, true);
  }
  // grid
  K.dash([]);
  [25, 50, 75, 100].forEach(function (g) { K.stroke(PDF_C.LINE, 0.7); path(poly(g), 'S'); });
  for (var i = 0; i < n; i++) { var e = pt(i, 100); K.stroke(PDF_C.LINE, 0.7); doc.line(cx, cy, e[0], e[1]); }
  K.font('regular', 6.5, PDF_C.SOFT);
  [25, 50, 75, 100].forEach(function (g) { doc.text(g + '%', cx + 3, cy - R * g / 100 + 8); });
  // reference rings
  [[opts.normal || 75, PDF_C.green], [opts.abnormal || 50, PDF_C.red]].forEach(function (rf) {
    K.stroke(rf[1], 1); K.dash([2.5, 2]); path(poly(rf[0]), 'S'); K.dash([]);
    poly(rf[0]).forEach(function (p) { K.fill(rf[1]); doc.circle(p[0], p[1], 1.6, 'F'); });
  });
  // company
  var pts = values.map(function (v, k) { return pt(k, Math.max(0, Math.min(100, v))); });
  K.alpha(0.12); K.fill(PDF_C.INK); path(pts, 'F'); K.alpha(1);
  K.stroke(PDF_C.INK, 1.6); path(pts, 'S');
  pts.forEach(function (p, k) { K.fill(PDF_C.WHITE); K.stroke(PDF_C.INK, 1.2); doc.circle(p[0], p[1], 2.8, 'FD'); });
  // labels + values
  for (var j = 0; j < n; j++) {
    var a = (-90 + j * 360 / n) * Math.PI / 180, lx = cx + (R + 14) * Math.cos(a), ly = cy + (R + 14) * Math.sin(a);
    var align = Math.abs(Math.cos(a)) < 0.2 ? 'center' : Math.cos(a) > 0 ? 'left' : 'right';
    var lines = K.split(labels[j], 104, 'semibold', 8);
    var top = Math.sin(a) < -0.2 ? ly - (lines.length - 1) * 10 - 9 : Math.sin(a) > 0.2 ? ly + 6 : ly - (lines.length * 10) / 2 + 3;
    K.font('semibold', 8, PDF_C.INK);
    lines.forEach(function (l, k) { doc.text(l, lx, top + k * 10, { align: align }); });
    K.font('bold', 8, (opts.colors && opts.colors[j]) || PDF_C.RED);
    doc.text(Math.round(values[j]) + '%', lx, top + lines.length * 10, { align: align });
  }
}
