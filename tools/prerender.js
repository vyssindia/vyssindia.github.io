#!/usr/bin/env node
/* Optional SEO step: copies the job and scheme cards into the static HTML so search engines
   and no-JavaScript phones can see them. The JS data files stay the source of truth: in the
   browser, naukri-render.js and vyss.js re-render from jobs-data.js and yojana-data.js
   (expired jobs still hide). Run from the repo root after editing data:
     node tools/prerender.js
   It only rewrites the text between <!--PRERENDER--> and <!--/PRERENDER-->. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const noop = () => {};
const store = {};
const sandbox = {
  console, Date, Math, JSON, Intl, encodeURIComponent, isNaN, CustomEvent: function () {},
  localStorage: { getItem: k => store[k] || null, setItem: (k, v) => { store[k] = v; } },
  document: { readyState: 'loading', addEventListener: noop, querySelectorAll: () => [], getElementById: () => null, documentElement: {} },
  requestAnimationFrame: noop, addEventListener: noop
};
sandbox.window = sandbox;
vm.createContext(sandbox);
for (const f of ['jobs-data.js', 'yojana-data.js', 'vyss.js', 'naukri-render.js'])
  vm.runInContext(fs.readFileSync(path.join(root, 'assets', f), 'utf8'), sandbox, { filename: f });
const put = (file, html) => {
  const p = path.join(root, file);
  let s = fs.readFileSync(p, 'utf8');
  if (!/<!--PRERENDER-->[\s\S]*?<!--\/PRERENDER-->/.test(s)) { console.warn('no PRERENDER markers in ' + file); return s; }
  s = s.replace(/<!--PRERENDER-->[\s\S]*?<!--\/PRERENDER-->/, () => '<!--PRERENDER-->' + html + '<!--/PRERENDER-->');
  fs.writeFileSync(p, s);
  return s;
};
// Jobs
const J = sandbox.VYSS_JOBS_RENDER;
const open = (sandbox.VYSS_JOBS || []).filter(J.isOpen).sort(J.byEnd);
let n = put('naukri/index.html', open.map(j => J.renderJob(j, 'mr')).join(''));
n = open.length ? n.replace('<div id="naukri-empty">', '<div id="naukri-empty" hidden>')
                : n.replace('<div id="naukri-empty" hidden>', '<div id="naukri-empty">');
fs.writeFileSync(path.join(root, 'naukri/index.html'), n);
// Schemes by category
const Y = (sandbox.VYSS_YOJANA || []).filter(Boolean);
for (const c of sandbox.VYSS_CATS || []) {
  const list = Y.filter(y => y.cat === c.id && !sandbox.VYSS.isGone(y)).sort((a, b) => sandbox.VYSS.isPast(a.endsAt) - sandbox.VYSS.isPast(b.endsAt));
  put('yojana/' + c.id + '/index.html', list.map(y => sandbox.VYSS.card(y, 'mr')).join(''));
}
// Scheme detail pages (one card each)
for (const y of Y) {
  const f = 'yojana/' + y.id + '/index.html';
  if (fs.existsSync(path.join(root, f))) put(f, sandbox.VYSS.card(Object.assign({}, y, { _one: true }), 'mr'));
}
console.log('prerendered: ' + open.length + ' jobs, ' + Y.length + ' schemes');
