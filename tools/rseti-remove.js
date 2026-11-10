#!/usr/bin/env node
// RSETI removal – run ONCE on/after 12 Nov 2026 12:05 AM IST (rseti-hatao routine), from repo root:
//     node tools/rseti-remove.js            (makes the changes)
//     node tools/rseti-remove.js --dry      (only lists what would change)
//   Then: node tools/prerender.js, review `git diff`, commit, push.
//   What it does:
//   1. assets/yojana-data.js: deletes RSETI-START … RSETI-END (the RSETI scheme card).
//   2. Every .html + sitemap.xml: deletes <!--RSETI--> … <!--/RSETI--> blocks, also the escaped
//      &lt;!--RSETI--&gt; … &lt;!--/RSETI--&gt; copies inside data-hi (Hindi) attributes.
//   3. index.html: removes "RSETI मोफत प्रशिक्षण, " from meta description + og:description.
//   4. yojana/rseti-gadchiroli/index.html: replaced by a short "प्रशिक्षण नोंदणी संपली" page (noindex),
//      built from 404.html (same header/footer, buttons to प्रशिक्षण योजना / सर्व योजना / WhatsApp).
//   5. Deletes assets/post-720.jpg, assets/post-720.webp, assets/thumbs/post.webp (RSETI poster) –
//      only if no other file still references them.
//   6. Prints any remaining "RSETI" mentions in public files for a final manual check. 
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), dry = process.argv.includes('--dry');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8');
const wr = (f, s, why) => { console.log((dry ? '[dry] ' : '') + 'edit ' + f + ' – ' + why); if (!dry) fs.writeFileSync(path.join(root, f), s); };
const walk = d => fs.readdirSync(path.join(root, d), { withFileTypes: true }).flatMap(e => e.name === '.git' ? [] : e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk('.').map(f => f.replace(/^\.\//, ''));
// 1
let y = rd('assets/yojana-data.js'), y2 = y.replace(/\/\*RSETI-START\*\/[\s\S]*?\/\*RSETI-END\*\/\n?/g, '');
if (y2 !== y) wr('assets/yojana-data.js', y2, 'RSETI card removed');
// 4 (before 2, so the page itself is swapped not trimmed)
const RP = 'yojana/rseti-gadchiroli/index.html';
let p404 = rd('404.html');
const WA = 'https://wa.me/918275562968?text=' + encodeURIComponent('नमस्कार, मला मोफत प्रशिक्षणाबद्दल माहिती हवी आहे');
let ended = p404
  .replace(/<title>[\s\S]*?<\/title>/, '<title>RSETI प्रशिक्षण – नोंदणी संपली | VYSS नागेपल्ली, अहेरी</title>')
  .replace(/<main id="main">[\s\S]*?<\/main>/, () => '<main id="main"><div class="ph-hero"><div class="wrap"><h1 data-hi="RSETI गडचिरोली प्रशिक्षण – पंजीकरण समाप्त">RSETI गडचिरोली प्रशिक्षण – नोंदणी संपली</h1>' +
    '<p data-hi="इस प्रशिक्षण की पंजीकरण की अंतिम तिथि (11 नवंबर 2026) निकल गई है। नया प्रशिक्षण आने पर हमारी वेबसाइट और WhatsApp Channel पर बताया जाएगा।">या प्रशिक्षणाच्या नोंदणीची शेवटची तारीख (11 नोव्हेंबर 2026) संपली आहे. नवीन प्रशिक्षण आल्यावर आमच्या वेबसाइटवर व WhatsApp Channel वर कळवू.</p></div></div>' +
    '<section><div class="wrap e404"><div class="card"><p data-hi="अन्य निःशुल्क प्रशिक्षण और योजनाएँ नीचे देखें।">इतर मोफत प्रशिक्षण व योजना खाली पहा.</p><p class="acts">' +
    '<a class="btn big" href="/yojana/prashikshan/" data-hi="🎓 प्रशिक्षण योजनाएँ">🎓 प्रशिक्षण योजना</a><a class="btn s big" href="/yojana/" data-hi="📜 सभी योजनाएँ">📜 सर्व योजना</a>' +
    '<a class="btn wa-btn big" href="' + WA + '" data-wa-mr="नमस्कार, मला मोफत प्रशिक्षणाबद्दल माहिती हवी आहे" data-wa-hi="नमस्ते, मुझे निःशुल्क प्रशिक्षण के बारे में जानकारी चाहिए" target="_blank" rel="noopener" data-hi="💬 WhatsApp पर पूछें">💬 WhatsApp वर विचारा</a></p></div></div></section></main>');
if (fs.existsSync(path.join(root, RP))) wr(RP, ended, 'replaced with "नोंदणी संपली" page');
// 2
for (const f of files.filter(f => /\.(html|xml)$/.test(f) && f !== RP && f !== '404.html')) {
  const s = rd(f), s2 = s.replace(/<!--RSETI-->[\s\S]*?<!--\/RSETI-->\s*/g, '').replace(/&lt;!--RSETI--&gt;[\s\S]*?&lt;!--\/RSETI--&gt;\s*/g, '');
  if (s2 !== s) wr(f, s2, 'RSETI blocks removed');
}
// 3
const ix = dry ? rd('index.html') : rd('index.html');
const ix2 = ix.split('RSETI मोफत प्रशिक्षण, ').join('');
if (ix2 !== ix) wr('index.html', ix2, 'RSETI removed from meta description / og:description');
// 5
const assets = ['assets/post-720.jpg', 'assets/post-720.webp', 'assets/thumbs/post.webp'];
const after = f => (dry ? null : rd(f));
for (const a of assets) {
  if (!fs.existsSync(path.join(root, a))) continue;
  const name = '/' + a;
  const users = files.filter(f => /\.(html|js|css|xml)$/.test(f) && !f.startsWith('tools/')).filter(f => (after(f) || rd(f)).includes(name));
  if (dry) { console.log('[dry] delete ' + a + ' (currently referenced by: ' + (users.join(', ') || 'none') + ')'); continue; }
  if (users.length) { console.log('KEEP ' + a + ' – still referenced by ' + users.join(', ')); continue; }
  fs.unlinkSync(path.join(root, a)); console.log('deleted ' + a);
}
// 6
if (!dry) {
  const left = files.filter(f => /\.(html|js|xml)$/.test(f) && !f.startsWith('tools/') && f !== RP && fs.existsSync(path.join(root, f)))
    .filter(f => f !== 'assets/vyss.js' && /RSETI|rseti/.test(rd(f)));
  console.log(left.length ? 'CHECK – RSETI still mentioned in: ' + left.join(', ') : 'OK – no RSETI mentions left (except the "नोंदणी संपली" page).');
}
