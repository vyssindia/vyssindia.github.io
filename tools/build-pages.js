#!/usr/bin/env node
/* Builds the scheme detail pages (yojana/<id>/index.html) and 404.html from the current
   layout template (yojana/anudan/index.html) and assets/yojana-data.js.
   Run from repo root:  node tools/build-pages.js && node tools/prerender.js
   Pages keep the same look as the category pages: MR/HI toggle, current menu, layout.css only. */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const sb = { window: {} }; vm.createContext(sb);
vm.runInContext(fs.readFileSync(path.join(root, 'assets/yojana-data.js'), 'utf8'), sb);
const CATS = sb.window.VYSS_CATS, Y = sb.window.VYSS_YOJANA.filter(Boolean);
const T = fs.readFileSync(path.join(root, 'yojana/anudan/index.html'), 'utf8');
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const WA = m => 'https://wa.me/918275562968?text=' + encodeURIComponent(m);
const cut = (s, n) => { s = s.replace(/\s+/g, ' ').trim(); return s.length <= n ? s : s.slice(0, n - 1).replace(/[\s,.;:–-]+\S*$/, '') + '…'; };
const headStart = T.indexOf('<title>'), headEnd = T.indexOf('<link rel="icon"');
const [pre, rest] = [T.slice(0, headStart), T.slice(headEnd)];
function page(o) {
  let s = pre + o.head + rest;
  s = s.replace(/<main id="main">[\s\S]*?<\/main>/, () => '<main id="main">' + o.main + '</main>');
  // header WhatsApp + floating button: scheme-specific prefill in MR / HI
  if (o.waMr) {
    const attr = ' data-wa-mr="' + esc(o.waMr) + '" data-wa-hi="' + esc(o.waHi) + '"';
    s = s.replace(/<a class="btn wa-btn hwa" href="[^"]*"/, () => '<a class="btn wa-btn hwa" href="' + WA(o.waMr) + '"' + attr);
    s = s.replace(/<a class="fab" href="[^"]*"/, () => '<a class="fab" href="' + WA(o.waMr) + '"' + attr);
  }
  if (o.noCurrent) s = s.replace(/ aria-current="page"/g, '');
  return s;
}
const warn = T.match(/<div class="warn">[\s\S]*?<\/div>/)[0];
const help = T.match(/<p class="helpnote"[\s\S]*?<\/p>/)[0];
for (const y of Y) {
  const c = CATS.find(x => x.id === y.cat);
  const url = 'https://vyss.in' + y.page;
  const title = y.title.mr + ' | VYSS नागेपल्ली, अहेरी';
  const desc = cut(y.body.mr, 155);
  const img = y.poster ? 'https://vyss.in' + y.poster.replace(/\.webp$/, '.jpg') : 'https://vyss.in/assets/og-1200x630.jpg';
  const head = '<title>' + esc(title) + '</title>\n<meta name="description" content="' + esc(desc) + '">\n<link rel="canonical" href="' + url + '">\n' +
    '<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">\n<link rel="apple-touch-icon" href="/assets/favicon-192.png">\n<link rel="preload" as="image" href="/assets/logo-horizontal.webp" type="image/webp" fetchpriority="high">\n<meta name="theme-color" content="#0B5D1E">\n' +
    '<meta property="og:type" content="article"><meta property="og:site_name" content="वनवासी युवा सेवा संस्था (VYSS)">\n' +
    '<meta property="og:url" content="' + url + '"><meta property="og:title" content="' + esc(title) + '"><meta property="og:description" content="' + esc(desc) + '">\n' +
    '<meta property="og:image" content="' + img + '"><meta property="og:locale" content="mr_IN"><meta property="og:locale:alternate" content="hi_IN">\n<meta name="twitter:card" content="summary_large_image">\n';
  const poster = y.poster ? '<div class="poster-big"><a href="' + esc(y.poster) + '" target="_blank" rel="noopener"><picture><source srcset="' + esc(y.poster) + '" type="image/webp"><img src="' + esc(y.poster.replace(/\.webp$/, '.jpg')) + '" width="720" height="720" loading="lazy" alt="' + esc(y.title.mr) + ' – पोस्टर"></picture></a></div>' : '';
  const main = '<div class="ph-hero"><div class="wrap"><p class="crumb"><a href="/" data-hi="मुख्य पृष्ठ">मुख्यपृष्ठ</a> / <a href="/yojana/" data-hi="योजना">योजना</a> / <a href="/yojana/' + c.id + '/" data-hi="' + esc(c.hi) + '">' + esc(c.mr) + '</a></p>' +
    '<h1 data-hi="' + esc(y.title.hi) + '">' + esc(y.title.mr) + '</h1><p data-hi="' + esc(c.dhi) + '">' + esc(c.dmr) + '</p></div></div>' +
    '<section><div class="wrap" style="max-width:860px">' + help + '<div class="list" data-yojana-one="' + esc(y.id) + '"><!--PRERENDER--><!--/PRERENDER--></div>' + poster +
    '<p style="margin-top:18px"><a class="back" href="/yojana/' + c.id + '/" data-hi="← ' + esc(c.hi) + '">← ' + esc(c.mr) + '</a> &nbsp; <a class="back" href="/yojana/#quiz" data-hi="🔎 मेरे लिए कौन-सी योजना?">🔎 माझ्यासाठी कोणती योजना?</a></p></div></section>' + warn;
  const html = page({ head, main, waMr: y.wa, waHi: 'नमस्ते, मुझे ' + y.title.hi + ' के बारे में जानकारी चाहिए' });
  const dir = path.join(root, 'yojana', y.id); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), y.rseti ? html.replace('<html lang="mr">', '<html lang="mr"><!-- RSETI page: replaced by tools/rseti-remove.js on 12 Nov 2026 -->') : html);
}
// 404
const h404 = '<title>पान सापडले नाही (404) | VYSS नागेपल्ली, अहेरी</title>\n<meta name="robots" content="noindex">\n<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">\n<link rel="apple-touch-icon" href="/assets/favicon-192.png">\n<meta name="theme-color" content="#0B5D1E">\n';
const m404 = '<div class="ph-hero"><div class="wrap"><h1 data-hi="😕 यह पेज नहीं मिला">😕 हे पान सापडले नाही</h1><p data-hi="यह जानकारी हटा दी गई है या लिंक गलत है। नीचे के बटन से आगे बढ़ें।">ही माहिती काढली आहे किंवा लिंक चुकीची आहे. खालील बटणाने पुढे जा.</p></div></div>' +
  '<section><div class="wrap e404"><div class="card"><p data-hi="नई योजनाएँ, नौकरियाँ और निःशुल्क फॉर्म मदद – मुख्य पृष्ठ पर।">नवीन योजना, नोकरी व मोफत फॉर्म मदत – मुख्यपृष्ठावर.</p><p class="acts">' +
  '<a class="btn big" href="/" data-hi="🏠 मुख्य पृष्ठ">🏠 मुख्यपृष्ठ</a><a class="btn s big" href="/yojana/" data-hi="📜 मौजूदा योजनाएँ">📜 सध्याच्या योजना</a>' +
  '<a class="btn wa-btn big" href="' + WA('नमस्कार, मला योजनेबद्दल माहिती हवी आहे') + '" data-wa-mr="नमस्कार, मला योजनेबद्दल माहिती हवी आहे" data-wa-hi="नमस्ते, मुझे योजना के बारे में जानकारी चाहिए" target="_blank" rel="noopener" data-hi="💬 WhatsApp पर पूछें">💬 WhatsApp वर विचारा</a></p></div></div></section>';
let p404 = page({ head: h404, main: m404, noCurrent: true });
fs.writeFileSync(path.join(root, '404.html'), p404);
console.log('built ' + Y.length + ' detail pages + 404.html');
