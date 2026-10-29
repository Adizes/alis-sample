/* Engagement Survey — group PDF report (jsPDF), rendered in the admin.
 * d = { agg: ES.aggregate(responses), company, launchName, invited, dateIso, comments: true|false }
 */
var ES_LEVEL_C = { fully: '#1e8e4e', engaged: '#2457c5', somewhat: '#d9a400', disengaged: '#d7141a' };
var ES_LEVEL_T = { fully: '#dcf2e5', engaged: '#e3eafb', somewhat: '#fff0bf', disengaged: '#fbd6d7' };
var ES_BAR = { 5: '#1e8e4e', 4: '#4f7fe0', 3: '#e8b923', 2: '#d7141a', 1: '#c4c4c4' };

function renderEsPdf(A, lang, d) {
  var t = ES_I18N[lang] || ES_I18N.en, P = t.pdf, g = d.agg;
  var doc = newPdf(A), K = pdfKit(doc), C = PDF_C;
  var W = 612, H = 792, M = 54, CW = W - 2 * M, page = 1;
  var dateStr = formatDate(d.dateIso, t.locale);
  function pct(v) { return Math.round(v) + '%'; }
  function footer() {
    K.font('regular', 7.5, C.SOFT);
    doc.text(P.footer + (d.company ? '  ·  ' + d.company : ''), M, H - 30);
    doc.text(P.page + ' ' + page, W - M, H - 30, { align: 'right' });
    K.stroke(C.LINE, 0.6); K.dash([]); doc.line(M, H - 44, W - M, H - 44);
  }
  function newPage() { footer(); doc.addPage(); page++; return 70; }
  function heading(text, y, sub) {
    K.fill(C.RED); doc.rect(M, y - 16, 3, 20, 'F');
    K.font('bold', 17, C.INK); doc.text(text, M + 12, y);
    if (sub) return K.rich(sub, M, y + 20, CW, 9, { color: C.MUTED, lh: 1.45 }) + 10;
    return y + 26;
  }
  function bar(x, y, w, h, dist, n, q50) {
    var cx = x, order = [5, 4, 3, 2, 1];
    order.forEach(function (v) {
      var c = dist[v] || 0; if (!c || !n) return;
      var sw = w * c / n;
      K.fill(q50 && v === 1 ? '#7a0c10' : ES_BAR[v]); doc.rect(cx, y, sw, h, 'F');
      if (sw >= 18) { K.font('bold', 6.5, v === 3 || v === 1 && !q50 ? C.INK : C.WHITE); doc.text(String(Math.round(c / n * 100)), cx + sw / 2, y + h / 2 + 2.3, { align: 'center' }); }
      cx += sw;
    });
  }
  function legend(y) {
    var x = M;
    [5, 4, 3, 2, 1].forEach(function (v) {
      var label = P.legend[v]; K.font('regular', 7.5, C.INK);
      var w = doc.getTextWidth(label) + 26;
      if (x + w > W - M) { x = M; y += 13; }
      K.fill(ES_BAR[v]); doc.rect(x, y - 7, 10, 8, 'F'); doc.text(label, x + 14, y);
      x += w;
    });
    return y + 14;
  }

  /* ---------------- 1 · cover ---------------- */
  if (A.logo) doc.addImage(A.logo, 'PNG', M, 50, 150, 50);
  var y = 196;
  K.font('bold', 38, C.INK); doc.text(P.title, M, y);
  K.font('light', 38, C.INK); doc.text(P.subtitle, M, y + 44);
  K.fill(C.RED); doc.rect(M, y + 64, 60, 4, 'F');
  y += 108;
  function meta(label, value) {
    K.font('semibold', 8, C.RED); doc.text(label.toUpperCase(), M, y);
    K.font('bold', 14, C.INK); doc.text(K.split(value, CW, 'bold', 14)[0] || '', M, y + 18);
    y += 40;
  }
  meta(P.company, d.company || '');
  if (d.launchName) meta(P.launch, d.launchName);
  meta(P.date, dateStr);
  meta(P.responses, g.n + (d.invited ? ' ' + P.of + ' ' + d.invited + ' ' + P.invited : ''));
  y = K.rich(P.anon, M, y + 2, CW, 9, { color: C.MUTED, lh: 1.5 }) + 18;
  // at a glance: 4 levels + KPI
  var bw = (CW - 24) / 4;
  ES.LEVELS.forEach(function (k, i) {
    var bx = M + i * (bw + 8);
    K.fill(C.PAPER); doc.rect(bx, y, bw, 64, 'F'); K.fill(ES_LEVEL_C[k]); doc.rect(bx, y, bw, 4, 'F');
    K.font('bold', 22, C.INK); doc.text(pct(g.overall.pct[k]), bx + 12, y + 34);
    K.font('semibold', 8, C.MUTED); doc.text(K.split(t.levels[k].name, bw - 20, 'semibold', 8), bx + 12, y + 49);
  });
  y += 82;
  K.font('bold', 11, C.INK); doc.text(P.positive + ':  ', M, y);
  var lw = doc.getTextWidth(P.positive + ':  ');
  K.font('bold', 11, C.green); doc.text(pct(g.overall.positive), M + lw, y);
  y += 30;
  K.font('bold', 9.5, C.INK); doc.text(P.contents, M, y); y += 14;
  K.font('regular', 9, C.MUTED);
  P.toc.forEach(function (s, i) { if (i === 5 && !d.comments) return; doc.text((i + 1) + '.  ' + s, M, y); y += 13; });

  /* ---------------- 2 · levels ---------------- */
  y = newPage();
  y = heading(P.levelsTitle, y, P.levelsHelp);
  ES.LEVELS.forEach(function (k) {
    var L = t.levels[k], v = g.overall.pct[k], c = g.overall.count[k];
    var desc = L.desc.map(function (x) { return '•  ' + x; });
    var lines = []; desc.forEach(function (x) { lines = lines.concat(K.split(x, CW - 190, 'regular', 8.5)); });
    var h = Math.max(70, lines.length * 11.5 + 30);
    K.fill(ES_LEVEL_T[k]); doc.rect(M, y, CW, h, 'F'); K.fill(ES_LEVEL_C[k]); doc.rect(M, y, 4, h, 'F');
    K.font('bold', 11, C.INK); doc.text(L.name, M + 16, y + 20);
    K.font('bold', 26, ES_LEVEL_C[k] === '#d9a400' ? C.yellowText : ES_LEVEL_C[k]); doc.text(pct(v), M + 16, y + 50);
    K.font('regular', 8.5, C.MUTED); doc.text(c + ' ' + P.people, M + 16, y + 63);
    // bar
    K.fill('#ffffff'); doc.rect(M + 90, y + 42, 70, 8, 'F'); K.fill(ES_LEVEL_C[k]); doc.rect(M + 90, y + 42, 70 * v / 100, 8, 'F');
    K.font('regular', 8.5, C.INK); lines.forEach(function (ln, i) { doc.text(ln, M + 180, y + 20 + i * 11.5); });
    y += h + 8;
  });
  y += 8;
  K.fill(C.INK); doc.rect(M, y, CW, 42, 'F');
  K.font('semibold', 10, C.WHITE); doc.text(P.positive, M + 16, y + 26);
  K.font('bold', 20, C.WHITE); doc.text(pct(g.overall.positive), W - M - 16, y + 28, { align: 'right' });

  /* ---------------- 3 · by area ---------------- */
  y = newPage();
  y = heading(P.byAreaTitle, y, P.byAreaHelp);
  var cols = [{ name: P.company_col, levels: g.overall, bold: true }].concat(g.areas.map(function (a) { return { name: a.name, levels: a.levels }; }));
  if (g.other.levels) cols.push({ name: P.other, levels: g.other.levels });
  if (!g.areas.length) { K.rich(P.noAreas, M, y + 6, CW, 10, { color: C.INK }); }
  else {
    var per = 5, labelW = 150;
    for (var start = 0; start < cols.length; start += per) {
      var chunk = cols.slice(start, start + per);
      if (start > 0) chunk = [cols[0]].concat(chunk);
      var cw = (CW - labelW) / chunk.length;
      var rows = [[P.respondents, function (L) { return String(L.n); }]].concat(ES.LEVELS.map(function (k) { return [t.levels[k].name, function (L) { return pct(L.pct[k]); }, k]; }), [[P.positive, function (L) { return pct(L.positive); }, 'pos']]);
      var th = 22 + rows.length * 22;
      if (y + th > H - 70) y = newPage();
      K.fill('#fafafa'); doc.rect(M, y, CW, 22, 'F');
      chunk.forEach(function (c, i) { K.font('bold', 8, C.INK); doc.text(K.split(c.name, cw - 8, 'bold', 8)[0], M + labelW + i * cw + cw / 2, y + 14, { align: 'center' }); });
      var ry = y + 22;
      rows.forEach(function (r) {
        K.stroke(C.LINE, 0.5); doc.line(M, ry, W - M, ry);
        if (r[2] && r[2] !== 'pos') { K.fill(ES_LEVEL_C[r[2]]); doc.rect(M, ry + 7, 8, 8, 'F'); }
        K.font(r[2] === 'pos' ? 'bold' : 'regular', 8.5, C.INK); doc.text(r[0], M + (r[2] && r[2] !== 'pos' ? 14 : 0), ry + 14);
        chunk.forEach(function (c, i) { K.font(r[2] === 'pos' || c.bold ? 'bold' : 'regular', 9, C.INK); doc.text(r[1](c.levels), M + labelW + i * cw + cw / 2, ry + 14.5, { align: 'center' }); });
        ry += 22;
      });
      y = ry + 18;
    }
  }
  if (g.other.hidden) { K.rich(fill(P.hidden, { n: g.other.hidden }), M, Math.min(y + 4, H - 70), CW, 8.5, { color: C.MUTED }); }

  /* ---------------- 4 · factors grid ---------------- */
  y = newPage();
  y = heading(P.factorsTitle, y, P.factorsHelp);
  var gw = (CW - 4 * 6) / 5, gy = y;
  ES.GROUPS.forEach(function (gr, i) {
    var gx = M + i * (gw + 6), yy = gy;
    K.fill(C.INK); doc.rect(gx, yy, gw, 30, 'F');
    K.font('bold', 7.5, C.WHITE);
    var gl = K.split(P.groups[gr], gw - 10, 'bold', 7.5); gl.forEach(function (l, j) { doc.text(l, gx + gw / 2, yy + 13 + j * 9 - (gl.length - 1) * 4, { align: 'center' }); });
    yy += 36;
    g.cats.filter(function (c) { return c.group === gr; }).forEach(function (c) {
      K.fill(C[c.color + 'T']); doc.rect(gx, yy, gw, 52, 'F'); K.stroke(C[c.color], 0.8); doc.rect(gx, yy, gw, 52, 'S');
      K.font('semibold', 7.8, C.INK);
      var ll = K.split(t.cells[c.key], gw - 10, 'semibold', 7.8); ll.forEach(function (l, j) { doc.text(l, gx + gw / 2, yy + 17 + j * 9.5, { align: 'center' }); });
      K.font('bold', 12, c.color === 'yellow' ? C.yellowText : C[c.color]); doc.text(pct(c.percent), gx + gw / 2, yy + 44, { align: 'center' });
      yy += 58;
    });
  });
  y = gy + 36 + 4 * 58 + 18;
  ['green', 'yellow', 'red'].forEach(function (c, i) {
    var x = M + i * (CW / 3);
    K.fill(C[c + 'T']); doc.rect(x, y - 8, 16, 11, 'F'); K.stroke(C[c], 0.8); doc.rect(x, y - 8, 16, 11, 'S');
    K.font('regular', 8.5, C.INK); doc.text(P.colors[c], x + 22, y + 1);
  });

  /* ---------------- 5 · what matters most ---------------- */
  y = newPage();
  y = heading(P.topTitle, y, P.topHelp);
  y = legend(y) + 8;
  if (!g.top.length) { K.font('regular', 10, C.MUTED); doc.text('—', M, y + 6); }
  g.top.forEach(function (q, i) {
    var lines = K.split((q.i + 1) + '. ' + t.questions[q.i], CW - 245, 'regular', 9);
    var h = Math.max(36, lines.length * 11.5 + 14);
    if (y + h > H - 60) y = newPage();
    K.font('bold', 15, C.RED); doc.text(pct(q.mostPct), M, y + 16);
    K.font('regular', 6.5, C.MUTED); K.split(P.mostPct, 62, 'regular', 6.5).slice(0, 2).forEach(function (l, j) { doc.text(l, M, y + 25 + j * 7.5); });
    K.font('regular', 9, C.INK); lines.forEach(function (l, j) { doc.text(l, M + 70, y + 12 + j * 11.5); });
    bar(W - M - 160, y + 4, 160, 14, q.dist, q.n, q.scale === 'C');
    K.stroke(C.LINE, 0.5); doc.line(M, y + h, W - M, y + h);
    y += h + 6;
  });

  /* ---------------- 6 · all questions ---------------- */
  y = newPage();
  y = heading(P.distTitle, y, P.distHelp);
  y = legend(y) + 4;
  y = K.rich(P.q50, M, y, CW, 7.5, { color: C.MUTED, lh: 1.4 }) + 6;
  var lastCat = null;
  g.questions.forEach(function (q) {
    var lines = K.split((q.i + 1) + '. ' + t.questions[q.i], CW - 200, 'regular', 8.5);
    var h = Math.max(20, lines.length * 10.5 + 8);
    var head = q.cat !== lastCat;
    if (y + h + (head ? 22 : 0) > H - 60) { y = newPage(); head = true; }
    if (head) {
      var cat = ES.CATS.filter(function (c) { return c.id === q.cat; })[0];
      K.font('bold', 9.5, C.INK); doc.text(t.cells[cat.key], M, y + 10); y += 18; lastCat = q.cat;
    }
    K.font('regular', 8.5, C.INK); lines.forEach(function (l, j) { doc.text(l, M, y + 9 + j * 10.5); });
    bar(W - M - 180, y + 1, 140, 12, q.dist, q.n, q.scale === 'C');
    K.font('bold', 8, C.RED); doc.text(pct(q.mostPct), W - M, y + 10, { align: 'right' });
    y += h;
  });

  /* ---------------- 7 · comments ---------------- */
  if (d.comments) {
    y = newPage();
    y = heading(P.commentsTitle, y, P.commentsHelp);
    if (!g.nComments) { K.font('regular', 10, C.MUTED); doc.text(P.noComments, M, y + 6); }
    g.questions.forEach(function (q) {
      if (!q.comments.length) return;
      var ql = K.split((q.i + 1) + '. ' + t.questions[q.i], CW, 'bold', 9);
      if (y + ql.length * 11.5 + 26 > H - 60) y = newPage();
      K.font('bold', 9, C.INK); ql.forEach(function (l, j) { doc.text(l, M, y + j * 11.5); }); y += ql.length * 11.5 + 4;
      q.comments.forEach(function (cm) {
        var cl = K.split('“' + cm + '”', CW - 16, 'regular', 8.5);
        if (y + cl.length * 11 + 6 > H - 60) { y = newPage(); }
        K.fill(C.LINE); doc.rect(M, y - 6, 2, cl.length * 11, 'F');
        K.font('regular', 8.5, C.INK_2 || '#3a3a3a'); cl.forEach(function (l, j) { doc.text(l, M + 10, y + 2 + j * 11); });
        y += cl.length * 11 + 6;
      });
      y += 8;
    });
  }
  footer();
  doc.setProperties({ title: P.title + ' — ' + (d.company || ''), author: 'Adizes Institute', creator: 'Adizes Institute' });
  return doc;
}
