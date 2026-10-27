/* Express Diagnostics — PDF report (jsPDF). Used by the widget (one person) and the admin (team).
 * d = { result: ED.score(...), company, participants: [names], dateIso }
 */
var ED_DIAGRAM = {
  culture: ['values', 'climate'],
  causes: [['planning', 'responsibility', 'authority'], ['information', 'corrective', 'reward']],
  subsystems: [['client', 'transformation'], ['human', 'financial']],
  manifestations: [['inefficiency', 'behaviour'], ['changes', 'ineffectiveness']],
};
function edCellByKey(result, key) { for (var i = 0; i < result.cells.length; i++) if (result.cells[i].key === key) return result.cells[i]; return null; }
function edQuestionText(t, q) { var x = t.questions[q.i]; return q.zone === 2 ? (x.z2 || x.t) : q.zone === 3 ? (x.z3 || x.t) : x.t; }
function edCounts(result) { var c = { red: 0, yellow: 0, green: 0 }; result.cells.forEach(function (x) { c[x.color]++; }); return c; }

function renderEdPdf(A, lang, d) {
  var t = ED_I18N[lang] || ED_I18N.en, r = d.result, team = r.participants > 1;
  var doc = newPdf(A), K = pdfKit(doc), C = PDF_C;
  var W = 612, H = 792, M = 54, CW = W - 2 * M;
  var dateStr = formatDate(d.dateIso, t.locale);
  var page = 1;
  var textColor = { green: C.green, yellow: C.yellowText, red: C.red };

  function footer() {
    K.font('regular', 7.5, C.SOFT);
    doc.text(t.pdf.footer + (d.company ? '  ·  ' + d.company : ''), M, H - 30);
    doc.text(t.pdf.page + ' ' + page, W - M, H - 30, { align: 'right' });
    K.stroke(C.LINE, 0.6); K.dash([]); doc.line(M, H - 44, W - M, H - 44);
  }
  function newPage() { footer(); doc.addPage(); page++; }
  function heading(text, y, size) {
    K.fill(C.RED); doc.rect(M, y - (size || 20) + 2, 3, (size || 20) + 2, 'F');
    K.font('bold', size || 20, C.INK); doc.text(text, M + 12, y);
    return y;
  }
  // Coloured box with frame style
  function swatch(x, y, w, h, color, border, n) {
    K.fill(C[color + 'T']); doc.rect(x, y, w, h, 'F');
    K.dash([]);
    if (!team) { K.stroke(C[color], 0.8); doc.rect(x, y, w, h, 'S'); return; }
    if (border === 'thick') { K.stroke(C.INK, 2.2); doc.rect(x + 1.1, y + 1.1, w - 2.2, h - 2.2, 'S'); }
    else if (border === 'thin') { K.stroke(C.INK, 0.8); doc.rect(x, y, w, h, 'S'); }
    else { K.stroke(C.INK, 0.8); K.dash([1, 1.6]); doc.rect(x, y, w, h, 'S'); K.dash([]); }
  }
  function legend(y) {
    K.font('bold', 9.5, C.INK); doc.text(t.pdf.colorsTitle, M, y); y += 16;
    ['green', 'yellow', 'red'].forEach(function (c, i) {
      var x = M + i * (CW / 3);
      swatch(x, y - 9, 18, 12, c, 'dotted');
      K.font('regular', 8.5, C.INK); doc.text(K.split(t.colors[c], CW / 3 - 30, 'regular', 8.5), x + 24, y);
    });
    y += 24;
    if (team) {
      K.font('bold', 9.5, C.INK); doc.text(t.frames.title, M, y);
      var ftw = doc.getTextWidth(t.frames.title);
      K.font('regular', 8, C.MUTED); doc.text('  ·  ' + t.frames.sub, M + ftw, y);
      y += 16;
      ['dotted', 'thin', 'thick'].forEach(function (b, i) {
        var x = M + i * (CW / 3);
        swatch(x, y - 9, 18, 13, 'green', b);
        K.font('regular', 8, C.INK); doc.text(K.split(t.frames[b], CW / 3 - 30, 'regular', 8), x + 24, y);
      });
      y += 30;
    }
    return y;
  }

  /* ---------------- Page 1: cover ---------------- */
  if (A.logo) doc.addImage(A.logo, 'PNG', M, 50, 150, 50);
  var y = 200;
  K.font('bold', 38, C.INK); doc.text(t.pdf.title, M, y);
  K.font('light', 38, C.INK); doc.text(t.pdf.subtitle, M, y + 44);
  K.fill(C.RED); doc.rect(M, y + 64, 60, 4, 'F');
  y += 110;
  function meta(label, value) {
    K.font('semibold', 8, C.RED); doc.text(label.toUpperCase(), M, y);
    K.font('bold', 15, C.INK); doc.text(K.split(value, CW, 'bold', 15)[0] || '', M, y + 19);
    y += 44;
  }
  meta(t.pdf.company, d.company || '');
  meta(t.pdf.date, dateStr);
  K.font('semibold', 8, C.RED); doc.text((team ? t.pdf.participantsCount + ': ' + r.participants : t.pdf.participants).toUpperCase(), M, y);
  y += 17;
  var names = (d.participants || []).slice(0, 14);
  K.font('regular', 10.5, C.INK);
  names.forEach(function (nm, i) { doc.text((i + 1) + '.  ' + nm, M, y); y += 15; });
  if ((d.participants || []).length > names.length) { K.font('regular', 9.5, C.MUTED); doc.text('+ ' + (d.participants.length - names.length), M, y); y += 15; }
  K.font('regular', 9, C.MUTED); doc.text(t.pdf.design, M, y + 6);
  // at a glance
  var counts = edCounts(r), by = Math.max(y + 48, 470), bw = (CW - 16) / 3;
  K.font('bold', 9.5, C.INK); doc.text(t.pdf.summary, M, by - 10);
  ['red', 'yellow', 'green'].forEach(function (c, i) {
    var bx = M + i * (bw + 8);
    K.fill(C.PAPER); doc.rect(bx, by, bw, 62, 'F');
    K.fill(C[c]); doc.rect(bx, by, 4, 62, 'F');
    K.font('bold', 26, C.INK); doc.text(String(counts[c]), bx + 16, by + 34);
    K.font('semibold', 8.5, C.MUTED); doc.text(K.split(t.colorShort[c], bw - 60, 'semibold', 8.5), bx + 52, by + 25);
  });
  y = by + 90;
  K.font('bold', 9.5, C.INK); doc.text(t.pdf.howTitle, M, y);
  K.rich(t.pdf.howBody, M, y + 15, CW, 8.5, { color: C.MUTED, lh: 1.5 });

  /* ---------------- Page 2: causal diagram ---------------- */
  newPage();
  heading(t.diagram.title, 74, 15);
  y = 104;
  var bh = 32, gap = 6;
  function cellBox(key, x, yy, w) {
    var c = edCellByKey(r, key);
    swatch(x, yy, w, bh, c ? c.color : 'yellow', c ? c.border : 'dotted');
    var label = t.diagram.labels[key];
    var lines = K.split(label, w - 12, 'semibold', 8.5);
    K.font('semibold', 8.5, C.INK);
    var ty = yy + bh / 2 - (lines.length - 1) * 5 - 1;
    lines.forEach(function (l, i) { doc.text(l, x + w / 2, ty + i * 10, { align: 'center' }); });
    if (c) { K.font('bold', 7.5, textColor[c.color]); doc.text(Math.round(c.percent) + '%', x + w / 2, ty + lines.length * 10 - 0.5, { align: 'center' }); }
  }
  function frame(x, yy, w, h, title, fillc, dotted) {
    if (fillc) { K.fill(fillc); doc.rect(x, yy, w, h, 'F'); }
    K.stroke(dotted ? C.SOFT : C.INK, dotted ? 0.6 : 0.9); K.dash(dotted ? [1, 1.6] : []); doc.rect(x, yy, w, h, 'S'); K.dash([]);
    if (title) { K.font('bold', 9.5, C.INK); doc.text(title, x + w / 2, yy + 15, { align: 'center' }); }
  }
  // External
  frame(M, y, CW, 28, '', C.PAPER); K.font('bold', 10.5, C.INK); doc.text(t.diagram.external, W / 2, y + 18, { align: 'center' });
  K.arrowDown(W / 2, y + 28, y + 42);
  // Internal container
  var iy = y + 42, ih = 482;
  frame(M, iy, CW, ih, '', C.PAPER); K.font('bold', 10.5, C.INK); doc.text(t.diagram.internal, W / 2, iy + 18, { align: 'center' });
  var ix = M + 18, iw = CW - 36;
  // Systemic causes
  var sy = iy + 30, sh = 192;
  frame(ix, sy, iw, sh, t.diagram.causes, C.WHITE);
  var cx0 = ix + 12, cw0 = iw - 24;
  frame(cx0, sy + 24, cw0, 64, t.diagram.culture, null, true);
  var half = (cw0 - 12 - gap) / 2;
  cellBox('values', cx0 + 6, sy + 46, half);
  cellBox('climate', cx0 + 6 + half + gap, sy + 46, half);
  var third = (cw0 - 2 * gap) / 3;
  [0, 1, 2].forEach(function (k) { K.arrowDown(cx0 + third * k + gap * k + third / 2, sy + 92, sy + 106, C.SOFT, 1.2); });
  ED_DIAGRAM.causes.forEach(function (row, ri) {
    row.forEach(function (key, k) { cellBox(key, cx0 + k * (third + gap), sy + 110 + ri * (bh + gap), third); });
  });
  K.arrowDown(W / 2, sy + sh, sy + sh + 14);
  function block(title, rows, yy) {
    var hh = 30 + rows.length * (bh + gap) + 6;
    frame(ix, yy, iw, hh, title, C.WHITE);
    var w2 = (cw0 - gap) / 2;
    rows.forEach(function (row, ri) { row.forEach(function (key, k) { cellBox(key, cx0 + k * (w2 + gap), yy + 26 + ri * (bh + gap), w2); }); });
    return yy + hh;
  }
  var ny = block(t.diagram.subsystems, ED_DIAGRAM.subsystems, sy + sh + 14);
  K.arrowDown(W / 2, ny, ny + 14);
  block(t.diagram.manifestations, ED_DIAGRAM.manifestations, ny + 14);
  legend(iy + ih + 26);

  /* ---------------- Page 3: radars ---------------- */
  newPage();
  var titles = [t.radar.title1, t.radar.title2];
  ED.RADARS.forEach(function (ids, k) {
    var top = k === 0 ? 74 : 392;
    K.font('bold', 13, C.INK);
    var tl = K.split(titles[k], CW, 'bold', 13);
    tl.forEach(function (l, i) { doc.text(l, W / 2, top + i * 16, { align: 'center' }); });
    var cells = ids.map(function (id) { return ED.cellById(r, id); });
    pdfRadar(doc, K, W / 2, top + 150, 100, cells.map(function (c) { return c.percent; }), cells.map(function (c) { return t.cells[c.key]; }),
      { normal: r.norms.upperPercent, abnormal: r.norms.lowerPercent, colors: cells.map(function (c) { return textColor[c.color]; }) });
  });
  var ly = 722, items = [[C.green, t.radar.normal, true], [C.red, t.radar.abnormal, true], [C.INK, t.radar.yours, false]];
  items.forEach(function (it, i) {
    var lx = M + 30 + i * (CW / 3);
    K.stroke(it[0], it[2] ? 1 : 1.6); K.dash(it[2] ? [2.5, 2] : []); doc.line(lx, ly - 3, lx + 22, ly - 3); K.dash([]);
    K.font('regular', 9, C.INK); doc.text(it[1], lx + 30, ly);
  });

  /* ---------------- Pages 4+: key organizational factors ---------------- */
  newPage();
  heading(t.pdf.keyFactors, 74, 18);
  K.font('regular', 9, C.MUTED); doc.text(t.pdf.keyFactorsHelp, M, 96);
  y = legend(122) + 6;
  var textW = CW - 40;
  r.cells.forEach(function (c, ci) {
    var rows = c.questions.map(function (qi) {
      var q = r.questions[qi], txt = edQuestionText(t, q);
      var lines = K.split(txt, textW, 'regular', 9.5), extra = 0;
      if (q.zone === 0) {
        K.font('regular', 9.5, C.INK); var lw = doc.getTextWidth(lines[lines.length - 1]);
        K.font('regular', 8, C.SOFT); if (lw + doc.getTextWidth('  ·  ' + t.noAnswer) > textW) extra = 12;
      }
      return { q: q, lines: lines, h: Math.max(20, lines.length * 12.5 + 7 + extra) };
    });
    if (y + 30 + rows[0].h > H - 60) { newPage(); y = 70; }
    K.font('bold', 11.5, C.INK); doc.text((ci + 1) + '. ' + t.cells[c.key], M, y);
    var pct = Math.round(c.percent) + '%  ·  ' + t.colorShort[c.color];
    K.font('semibold', 8.5, textColor[c.color]); doc.text(pct, W - M, y, { align: 'right' });
    y += 10;
    rows.forEach(function (row) {
      if (y + row.h > H - 60) {
        newPage(); y = 70;
        K.font('bold', 11.5, C.SOFT); doc.text((ci + 1) + '. ' + t.cells[c.key] + ' (' + t.pdf.cont + ')', M, y); y += 10;
      }
      swatch(M, y + 2, 24, 16, row.q.color, row.q.border);
      K.font('regular', 9.5, C.INK);
      var ty = y + 13;
      row.lines.forEach(function (l, i) { doc.text(l, M + 36, ty + i * 12.5); });
      if (row.q.zone === 0) {
        K.font('regular', 9.5, C.INK);
        var lw = doc.getTextWidth(row.lines[row.lines.length - 1]), sfx = '  ·  ' + t.noAnswer;
        K.font('regular', 8, C.SOFT);
        if (lw + doc.getTextWidth(sfx) > textW) doc.text(t.noAnswer, M + 36, ty + row.lines.length * 12.5);
        else doc.text(sfx, M + 36 + lw, ty + (row.lines.length - 1) * 12.5);
      }
      y += row.h + 3;
    });
    y += 16;
  });

  footer();

  doc.setProperties({ title: t.pdf.title + ' — ' + (d.company || ''), author: 'Adizes Institute', creator: 'Adizes Institute' });
  return doc;
}
