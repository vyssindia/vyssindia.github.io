# नवीन नोकरी कशी जोडावी

1. `assets/jobs-data.js` मधील `window.VYSS_JOBS` array मध्ये नवीन object घाला. पद्धत आधीसारखीच आहे; हीच फाईल source of truth आहे.
2. आवश्यक फील्ड्स: `id`, `title`, `org`, `posts`, `who`, `lastDateLabel`, `endsAt` (ISO + `+05:30`; यानंतर कार्ड आपोआप लपते), `officialLinks` [{label,url}] (फक्त verified), `checklist`, `waJobName`. `extraNote` optional.
3. Optional फील्ड्स: `addedOn: "YYYY-MM-DD"` ('नवीन' tag 7 दिवस) आणि `hi: {title, org, posts, who, lastDateLabel, extraNote, checklist}` (हिंदी मजकूर).
4. Optional पण शिफारस केलेले (SEO / no-JS फोनसाठी): repo root मधून `node tools/prerender.js` चालवा. हे `naukri/index.html` आणि `yojana/*/index.html` मधील `<!--PRERENDER-->…<!--/PRERENDER-->` मध्ये कार्ड्स static HTML म्हणून लिहिते. हे चालवले नाही तरी साइट बरोबर दिसते, कारण ब्राउझरमधील JS नेहमी `jobs-data.js` / `yojana-data.js` मधूनच पुन्हा render करते. फक्त crawlers ना जुनी यादी दिसते.
5. अधिकृत स्रोत तपासा; verify न झालेले लिंक किंवा तारीख घालू नका. Preview करा, Rahul ची हाँ घ्या, मगच deploy करा.
