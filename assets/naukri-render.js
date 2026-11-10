/* Render open job cards from window.VYSS_JOBS; hide after endsAt (Asia/Kolkata).
   Optional per-job fields (old jobs work without them): addedOn "YYYY-MM-DD" -> 'नवीन' tag for 7 days;
   hi: {title, org, posts, who, lastDateLabel, extraNote, checklist} -> Hindi text when हिंदी is selected. */
(function () {
  var T = {
    mr: { last: 'शेवटची तारीख', posts: 'पदे', who: 'कोण अर्ज करू शकतो', links: 'अधिकृत लिंक', free: 'VYSS ची मदत मोफत. नोकरीची हमी नाही.',
      docs: 'कागदपत्रांची यादी', fill: 'मोफत फॉर्म भरा', fillP: 'VYSS तुमचा अर्ज मोफत भरण्यास मदत करेल. खालील बटण दाबून WhatsApp वर विचारा:',
      ask: 'WhatsApp वर विचारा', isNew: 'नवीन',
      left: function (d) { return d === 0 ? '⏰ आज शेवटचा दिवस' : '⏰ फक्त ' + d + ' दिवस बाकी'; },
      msg: function (n) { return 'नमस्कार, मला ' + n + ' साठी मोफत फॉर्म मदत हवी आहे.'; } },
    hi: { last: 'अंतिम तिथि', posts: 'पद', who: 'कौन आवेदन कर सकता है', links: 'आधिकारिक लिंक', free: 'VYSS की मदद निःशुल्क। नौकरी की गारंटी नहीं।',
      docs: 'दस्तावेज़ों की सूची', fill: 'निःशुल्क फॉर्म भरें', fillP: 'VYSS आपका आवेदन निःशुल्क भरने में मदद करेगा। नीचे का बटन दबाकर WhatsApp पर पूछें:',
      ask: 'WhatsApp पर पूछें', isNew: 'नया',
      left: function (d) { return d === 0 ? '⏰ आज अंतिम दिन' : '⏰ सिर्फ़ ' + d + ' दिन बाकी'; },
      msg: function (n) { return 'नमस्ते, मुझे ' + n + ' के लिए निःशुल्क फॉर्म मदद चाहिए।'; } }
  };
  function lang() { try { return localStorage.getItem('vyss-lang') === 'hi' ? 'hi' : 'mr'; } catch (e) { return 'mr'; } }
  function isOpen(job) {
    if (!job || !job.endsAt) return false;
    var end = new Date(job.endsAt).getTime(); /* endsAt carries +05:30, so this is an exact IST comparison */
    if (isNaN(end)) return false;
    return Date.now() <= end;
  }
  function isNew(job) {
    if (!job.addedOn) return false;
    var t = new Date(job.addedOn + 'T00:00:00+05:30').getTime();
    return !isNaN(t) && Date.now() - t >= 0 && Date.now() - t <= 7 * 864e5;
  }
  function daysLeft(job) {
    var t = new Date(job.endsAt).getTime(), D = 864e5, o = 19800000;
    if (isNaN(t) || Date.now() > t) return null;
    return Math.floor((t + o) / D) - Math.floor((Date.now() + o) / D);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function renderJob(job, l) {
    var t = T[l], h = (l === 'hi' && job.hi) ? job.hi : {};
    var f = function (k) { return h[k] != null ? h[k] : job[k]; };
    var links = (job.officialLinks || []).map(function (x) {
      return '<a href="' + esc(x.url) + '" target="_blank" rel="noopener">' + esc(x.label) + ' →</a>';
    }).join(' · ');
    var checks = (f('checklist') || []).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('');
    var name = job.waJobName || job.title;
    return (
      '<article class="card naukri-card" id="job-' + esc(job.id) + '" data-ends="' + esc(job.endsAt) + '">' +
        '<div class="tags">' + (isNew(job) ? '<span class="t new">' + t.isNew + '</span>' : '') +
        (function () { var d = daysLeft(job); return d !== null && d <= 7 ? '<span class="t soon">' + t.left(d) + '</span>' : ''; })() +
        '<span class="t date">📅 ' + t.last + ': ' + esc(f('lastDateLabel')) + '</span></div>' +
        '<h3>💼 ' + esc(f('title')) + '</h3>' +
        '<p class="naukri-org"><strong>' + esc(f('org')) + '</strong></p>' +
        '<p><strong>' + t.posts + ':</strong> ' + esc(f('posts')) + '</p>' +
        '<p><strong>' + t.who + ':</strong> ' + esc(f('who')) + '</p>' +
        (f('extraNote') ? '<p><small>' + esc(f('extraNote')) + '</small></p>' : '') +
        '<p><small>' + t.links + ': ' + links + '<br>' + t.free + '</small></p>' +
        '<div class="naukri-docs dk"><b>📄 ' + t.docs + '</b><ul class="docs">' + checks + '</ul></div>' +
        '<div class="naukri-help"><h4>' + t.fill + '</h4><p>' + t.fillP + '</p>' +
          '<p class="naukri-btns">' +
            '<a class="btn wa-btn" href="https://wa.me/918275562968?text=' + encodeURIComponent(t.msg(name)) + '" target="_blank" rel="noopener">💬 ' + t.ask + '</a>' +
          '</p></div>' +
      '</article>'
    );
  }
  function byEnd(a, b) { return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime(); }
  window.VYSS_JOBS_RENDER = { renderJob: renderJob, isOpen: isOpen, byEnd: byEnd };
  function run() {
    var grid = document.getElementById('naukri-grid');
    var empty = document.getElementById('naukri-empty');
    if (!grid) return;
    var open = (Array.isArray(window.VYSS_JOBS) ? window.VYSS_JOBS : []).filter(isOpen).sort(byEnd);
    if (!open.length) { grid.innerHTML = ''; grid.hidden = true; if (empty) empty.hidden = false; return; }
    grid.hidden = false; if (empty) empty.hidden = true;
    var l = lang();
    grid.innerHTML = open.map(function (j) { return renderJob(j, l); }).join('');
  }
  document.addEventListener('vyss:lang', run);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
