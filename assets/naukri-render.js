/* Render open job cards; hide after endsAt using Asia/Kolkata wall-clock comparison. */
(function () {
  function nowInKolkata() {
    try {
      var parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hourCycle: 'h23'
      }).formatToParts(new Date());
      var get = function (t) { return parts.find(function (p) { return p.type === t; }).value; };
      return new Date(
        get('year') + '-' + get('month') + '-' + get('day') +
        'T' + get('hour') + ':' + get('minute') + ':' + get('second') + '+05:30'
      );
    } catch (e) {
      return new Date();
    }
  }

  function isOpen(job, now) {
    if (!job || !job.endsAt) return false;
    var end = new Date(job.endsAt);
    if (isNaN(end.getTime())) return false;
    return now.getTime() <= end.getTime();
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function waHref(jobName) {
    var msg = 'नमस्कार, मला ' + jobName + ' साठी मोफत फॉर्म मदत हवी आहे.';
    return 'https://wa.me/918275562968?text=' + encodeURIComponent(msg);
  }

  function renderJob(job) {
    var links = (job.officialLinks || []).map(function (l) {
      return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + ' →</a>';
    }).join(' · ');
    var checks = (job.checklist || []).map(function (c) {
      return '<li>' + esc(c) + '</li>';
    }).join('');
    var wa = waHref(job.waJobName || job.title);
    var form = 'https://docs.google.com/forms/d/e/1FAIpQLSckU60Jkive6EZ89aru78TZxyDDnucaY7zXdhnORbkxHZitTg/viewform';
    return (
      '<article class="card naukri-card" id="job-' + esc(job.id) + '" data-ends="' + esc(job.endsAt) + '">' +
        '<span class="badge u">शेवटची तारीख: ' + esc(job.lastDateLabel) + '</span>' +
        '<h3>' + esc(job.title) + '</h3>' +
        '<p class="naukri-org"><strong>' + esc(job.org) + '</strong></p>' +
        '<p><strong>पदे:</strong> ' + esc(job.posts) + '</p>' +
        '<p><strong>कोण अर्ज करू शकतो:</strong> ' + esc(job.who) + '</p>' +
        (job.extraNote ? '<p><small>' + esc(job.extraNote) + '</small></p>' : '') +
        '<p><small>अधिकृत लिंक: ' + links + '<br>VYSS ची मदत मोफत. नोकरीची हमी नाही.</small></p>' +
        '<div class="naukri-docs"><h4>कागदपत्रांची यादी</h4><ul class="docs">' + checks + '</ul></div>' +
        '<div class="naukri-help">' +
          '<h4>मोफत फॉर्म भरा</h4>' +
          '<p>VYSS तुमचा अर्ज मोफत भरण्यास मदत करेल. खालीलपैकी एक निवडा:</p>' +
          '<p class="naukri-btns">' +
            '<a class="btn s wa" data-wa="' + esc('नमस्कार, मला ' + (job.waJobName || job.title) + ' साठी मोफत फॉर्म मदत हवी आहे.') + '" href="' + wa + '" target="_blank" rel="noopener">WhatsApp करा →</a>' +
            '<a class="btn" href="' + form + '" target="_blank" rel="noopener">Google फॉर्म भरा</a>' +
          '</p>' +
        '</div>' +
      '</article>'
    );
  }

  function run() {
    var grid = document.getElementById('naukri-grid');
    var empty = document.getElementById('naukri-empty');
    if (!grid) return;
    var jobs = Array.isArray(window.VYSS_JOBS) ? window.VYSS_JOBS : [];
    var now = nowInKolkata();
    var open = jobs.filter(function (j) { return isOpen(j, now); });
    if (!open.length) {
      grid.innerHTML = '';
      grid.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }
    grid.hidden = false;
    if (empty) empty.hidden = true;
    grid.innerHTML = open.map(renderJob).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
