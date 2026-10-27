// Build: node build.mjs
//   express-diagnostics/dist/express-diagnostics(.min).js  ← one self-contained file for Webflow
//   apps-script/Code.gs                                     ← the backend to paste into Apps Script
// (Founder Dependency keeps its own build: founder-dependency/build.mjs)
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { minify } from 'terser';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const VERSION = process.env.ADZ_VERSION || pkg.version;
const read = (p) => readFileSync(join(root, p), 'utf8');
const css = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '\n').trim();

function langs(dir) {
  return readdirSync(join(root, dir)).filter(f => f.endsWith('.js'))
    .sort((a, b) => (a === 'en.js' ? -1 : b === 'en.js' ? 1 : a.localeCompare(b)));
}

async function widget({ name, title, dir, i18nVar, shared }) {
  const ls = langs(dir + '/src/i18n');
  const i18n = ls.map(f => read(dir + '/src/i18n/' + f)).join('\n');
  const styles = css(read('shared/ui.css') + '\n' + read(dir + '/src/styles.css'));
  const app = read(dir + '/src/app.js').replace('__CSS__', JSON.stringify(styles)).replace("'__VERSION__'", JSON.stringify(VERSION));
  const banner = `/*! Adizes · ${title} v${VERSION} · github.com/Adizes/alis-sample */\n`;
  const out = banner + `(function(){\n'use strict';\nvar ${i18nVar} = {};\n${i18n}\n${shared.map(read).join('\n')}\n${app}\n})();\n`;
  mkdirSync(join(root, dir, 'dist'), { recursive: true });
  writeFileSync(join(root, dir, 'dist', name + '.js'), out);
  const min = await minify(out, { compress: true, mangle: true, format: { comments: /^!/ } });
  writeFileSync(join(root, dir, 'dist', name + '.min.js'), min.code);
  console.log(`${name} v${VERSION}: ${ls.join(', ')} · ${(out.length / 1024).toFixed(1)} KB → ${(min.code.length / 1024).toFixed(1)} KB min`);
}

await widget({
  name: 'express-diagnostics', title: 'Express Diagnostics', dir: 'express-diagnostics', i18nVar: 'ED_I18N',
  shared: ['shared/core.js', 'shared/ed-engine.js', 'shared/pdfkit.js', 'shared/ed-report.js', 'shared/ed-visuals.js'],
});

// Apps Script: config + shared engine + the rest of src/*.gs, in file-name order.
{
  const files = readdirSync(join(root, 'apps-script/src')).filter(f => f.endsWith('.gs')).sort();
  const parts = [read('apps-script/src/' + files[0]), '/* ===== shared/ed-engine.js (same file the widget uses) ===== */\n' + read('shared/ed-engine.js')]
    .concat(files.slice(1).map(f => read('apps-script/src/' + f)));
  const code = parts.join('\n\n').replace(/__RELEASE__/g, 'v' + VERSION).replace(/'__VERSION__'/g, JSON.stringify(VERSION));
  writeFileSync(join(root, 'apps-script/Code.gs'), code);
  console.log(`apps-script/Code.gs v${VERSION}: ${files.join(', ')} · ${(code.length / 1024).toFixed(1)} KB`);
}
