#!/usr/bin/env python3
"""Translations workbook for both tests (questions, survey screens, reports and emails).

  python3 tools/translations.py export [translations/Adizes-Translations.xlsx]
      language files -> Excel workbook (one column per language)
  python3 tools/translations.py import [translations/Adizes-Translations.xlsx]
      Excel workbook -> language files (then run `npm run build`)

To add a language: add a column with the header "Language name [code]", e.g. "Português [pt]",
fill it, and import. Empty cells fall back to English and are listed by the import.
"""
import json, os, re, subprocess, sys, tempfile
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT = os.path.join(ROOT, 'translations', 'Adizes-Translations.xlsx')
SHEETS = [('ed', 'Express Diagnostics'), ('es', 'Engagement Survey'), ('emails', 'Emails')]
LANG_ORDER = ['en', 'es', 'lv', 'lt']
F = 'Arial'
HEAD = PatternFill('solid', fgColor='111111')
KEYFILL = PatternFill('solid', fgColor='F2F2F2')
ENFILL = PatternFill('solid', fgColor='FAFAFA')
TODO = PatternFill('solid', fgColor='FFF2B3')
LINE = Border(bottom=Side(style='thin', color='E4E4E4'))

SECTION = {
    'langName': 'Language name (shown in the admin)', 'locale': 'Locale for dates (e.g. lv-LV)',
    'ui': 'Survey · buttons and labels', 'intro': 'Survey · intro screen', 'review': 'Survey · review screen',
    'thanks': 'Survey · thank-you screen', 'states': 'Survey · link messages', 'scale': 'Answer options',
    'scales': 'Answer options', 'dontKnow': 'Answer option “Don’t know”', 'cannot': 'Answer option “I cannot answer”',
    'cells': 'Factor names', 'diagram': 'Report · causal diagram', 'radar': 'Report · radar charts',
    'colors': 'Report · colour legend', 'colorShort': 'Report · factor status', 'frames': 'Report · frame legend',
    'noAnswer': 'Report · “no answer” mark', 'pdf': 'Report (PDF)', 'levels': 'Engagement levels',
    'tests': 'Test names', 'invite': 'Invitation / reminder email', 'report': 'Report email',
    'months': 'Month names (dates in emails)', 'dateFormat': 'Date format in emails',
}
ED_ZONE = {'t': 'statement (what participants read; zone 1 in the report)', 'z2': 'report wording, zone 2 (attention)', 'z3': 'report wording, zone 3 (anomaly)'}


def where(set_id, key):
    p = key.split('.')
    if p[0] == 'questions':
        n = int(p[1]) + 1
        if set_id == 'ed':
            return f'Statement {n} · {ED_ZONE.get(p[2], p[2])}'
        return f'Question {n}'
    if p[0] == 'levels' and len(p) > 2:
        return 'Engagement level · ' + ('name' if p[2] == 'name' else 'description line')
    base = SECTION.get(p[0], p[0])
    return base


def notes(text):
    out = []
    ph = sorted(set(re.findall(r'\{\w+\}', text)))
    if ph:
        out.append('Keep ' + ', '.join(ph))
    if '**' in text:
        out.append('Keep **bold** marks')
    return ' · '.join(out)


def run_node(*args):
    subprocess.run(['node', os.path.join(ROOT, 'tools', 'i18n.mjs'), *args], check=True)


def lang_name(data, code):
    for sid in ('ed', 'es', 'emails'):
        v = data['sets'][sid]['langs'].get(code, {}).get('langName')
        if v:
            return v
    return code


def export(path):
    with tempfile.TemporaryDirectory() as d:
        tmp = os.path.join(d, 'flat.json')
        run_node('dump', tmp)
        data = json.load(open(tmp, encoding='utf8'))
    langs = sorted({l for s in data['sets'].values() for l in s['langs']},
                   key=lambda l: (LANG_ORDER.index(l) if l in LANG_ORDER else 99, l))
    wb = Workbook()
    rd = wb.active
    rd.title = 'Read me'
    rows = [
        ('Adizes Assessments — translations', 'title'),
        ('Express Diagnostics · Engagement Survey: questions, survey screens, reports and emails.', ''),
        ('', ''),
        ('HOW TO EDIT', 'h'),
        ('1. Edit only the language columns (English, Español, Latviešu, Lietuvių …). Columns A–B are reference.', ''),
        ('2. Yellow cells are empty: they will show the English text until they are filled.', ''),
        ('3. Keep {placeholders} exactly as they are, e.g. {company}, {first}, {n}, {date}. They are replaced automatically.', ''),
        ('4. Keep **double asterisks** where they appear: they mark bold text in the report.', ''),
        ('5. Do not change the order of rows or the Key column. Question order and answer values never change.', ''),
        ('6. To add a language, add a column with the header "Language name [code]", e.g. "Português [pt]", and fill it.', ''),
        ('7. Send the file back (or run: python3 tools/translations.py import) and publish a new version.', ''),
        ('', ''),
        ('EXAMPLE ROW', 'h'),
        ('Key: intro.deadline · Where: Survey · intro screen · English: "Open until {date}" · Español: "Abierta hasta el {date}"', ''),
        ('', ''),
        ('CÓMO EDITAR (ES)', 'h'),
        ('Edita solo las columnas de idioma. Las celdas amarillas están vacías (se mostrará el inglés). '
         'Respeta los {marcadores} y los **asteriscos**. No cambies el orden ni la columna Key. '
         'Para un idioma nuevo, agrega una columna "Nombre [código]".', ''),
        ('', ''),
        ('Sheets: Express Diagnostics · Engagement Survey · Emails', ''),
    ]
    for i, (t, kind) in enumerate(rows, 1):
        c = rd.cell(row=i, column=1, value=t)
        c.font = Font(name=F, size=16 if kind == 'title' else 10, bold=kind in ('title', 'h'), color='D7141A' if kind == 'h' else '111111')
        c.alignment = Alignment(wrap_text=True, vertical='top')
    rd.column_dimensions['A'].width = 120

    for sid, title in SHEETS:
        s = data['sets'][sid]
        ws = wb.create_sheet(title)
        heads = ['Key', 'Where it is used', 'Notes'] + [f'{lang_name(data, l)} [{l}]' for l in langs]
        for j, h in enumerate(heads, 1):
            c = ws.cell(row=1, column=j, value=h)
            c.font = Font(name=F, bold=True, color='FFFFFF', size=10)
            c.fill = HEAD
            c.alignment = Alignment(vertical='center', wrap_text=True)
        for i, key in enumerate(s['keys'], 2):
            en = s['langs'].get('en', {}).get(key, '')
            vals = [key, where(sid, key), notes(en)] + [s['langs'].get(l, {}).get(key, '') for l in langs]
            for j, v in enumerate(vals, 1):
                c = ws.cell(row=i, column=j, value=v)
                c.font = Font(name=F, size=9 if j <= 3 else 10, color='6B6F76' if j <= 3 else '111111', bold=(j == 4))
                c.alignment = Alignment(wrap_text=True, vertical='top')
                c.border = LINE
                if j <= 3:
                    c.fill = KEYFILL
                elif j == 4:
                    c.fill = ENFILL
                elif not str(v).strip():
                    c.fill = TODO
        widths = [22, 26, 16] + [48] * len(langs)
        for j, w in enumerate(widths, 1):
            ws.column_dimensions[get_column_letter(j)].width = w
        ws.row_dimensions[1].height = 28
        ws.freeze_panes = 'E2'
        ws.auto_filter.ref = f'A1:{get_column_letter(len(heads))}{len(s["keys"]) + 1}'
    os.makedirs(os.path.dirname(path), exist_ok=True)
    wb.save(path)
    counts = ', '.join(f'{t}: {len(data["sets"][sid]["keys"])}' for sid, t in SHEETS)
    print(f'workbook written: {path} ({counts} texts; languages: {", ".join(langs)})')


def do_import(path):
    wb = load_workbook(path, data_only=True)
    out = {'sets': {}}
    for sid, title in SHEETS:
        ws = wb[title]
        heads = [c.value for c in ws[1]]
        cols = {}
        for j, h in enumerate(heads):
            m = re.search(r'\[([a-z]{2,3}(?:-[A-Za-z]{2,4})?)\]\s*$', str(h or ''))
            if m:
                cols[m.group(1)] = j
        if 'en' not in cols:
            sys.exit(f'{title}: the English [en] column is missing')
        langs = {l: {} for l in cols}
        keys = []
        for row in ws.iter_rows(min_row=2, values_only=True):
            key = row[0]
            if not key:
                continue
            keys.append(key)
            for l, j in cols.items():
                v = row[j] if j < len(row) else None
                if v is not None and str(v).strip() != '':
                    langs[l][key] = str(v).replace('\r\n', '\n')
        out['sets'][sid] = {'title': title, 'keys': keys, 'langs': langs}
    with tempfile.TemporaryDirectory() as d:
        tmp = os.path.join(d, 'flat.json')
        json.dump(out, open(tmp, 'w', encoding='utf8'), ensure_ascii=False)
        run_node('build', tmp)
    print('imported. Next: npm run build (and npm test)')


if __name__ == '__main__':
    if len(sys.argv) < 2 or sys.argv[1] not in ('export', 'import'):
        print(__doc__)
        sys.exit(1)
    p = sys.argv[2] if len(sys.argv) > 2 else DEFAULT
    export(p) if sys.argv[1] == 'export' else do_import(p)
