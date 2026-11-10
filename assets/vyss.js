/* VYSS site JS: भाषा (मराठी/हिंदी), योजना कार्ड्स, 'माझ्यासाठी कोणती योजना?' प्रश्नावली. No framework. */
(function(){
var WA='918275562968',KEY='vyss-lang',DAY=864e5;
var U={
 mr:{docs:'लागणारी कागदपत्रे',docsWa:'कागदपत्रांसाठी WhatsApp करा',docsMore:'इतर कागदपत्रांसाठी WhatsApp करा',ask:'WhatsApp वर विचारा',more:'पूर्ण माहिती',src:'अधिकृत',news:'बातमी',checked:'माहिती तपासली',noSrc:'अधिकृत माहिती: अधिकृत संकेतस्थळ / संबंधित कार्यालय पहा.',isNew:'नवीन',past:'शेवटची तारीख गेली',poster:'पोस्टर',
  none:'तुमच्या उत्तरांनुसार सध्या जुळणारी योजना साइटवर नाही. WhatsApp वर विचारा – आम्ही मदत करू.',found:' योजना तुमच्यासाठी असू शकतात',pick:'कृपया तिन्ही प्रश्नांची उत्तरे निवडा.',
  hint:'हा फक्त अंदाज आहे. अंतिम पात्रता अधिकृत जाहिरातीनुसार – अर्जापूर्वी WhatsApp वर खात्री करा.',jobs:'नोकरीच्या जाहिराती पहा →',count:' योजना',open:' खुल्या जाहिराती',noJobs:'सध्या खुली जाहिरात नाही',
  waMsg:function(y){return y.wa},left:function(n){return n===0?'⏰ आज शेवटचा दिवस':'⏰ फक्त '+n+' दिवस बाकी'}},
 hi:{docs:'ज़रूरी दस्तावेज़',docsWa:'दस्तावेज़ों के लिए WhatsApp करें',docsMore:'अन्य दस्तावेज़ों के लिए WhatsApp करें',ask:'WhatsApp पर पूछें',more:'पूरी जानकारी',src:'आधिकारिक',news:'समाचार',checked:'जानकारी जाँची',noSrc:'आधिकारिक जानकारी: आधिकारिक वेबसाइट / संबंधित कार्यालय देखें।',isNew:'नया',past:'अंतिम तिथि निकल गई',poster:'पोस्टर',
  none:'आपके उत्तरों के अनुसार अभी साइट पर मेल खाती योजना नहीं है। WhatsApp पर पूछें – हम मदद करेंगे।',found:' योजनाएँ आपके लिए हो सकती हैं',pick:'कृपया तीनों प्रश्नों के उत्तर चुनें।',
  hint:'यह केवल अनुमान है। अंतिम पात्रता आधिकारिक विज्ञापन के अनुसार – आवेदन से पहले WhatsApp पर पुष्टि करें।',jobs:'नौकरी के विज्ञापन देखें →',count:' योजनाएँ',open:' खुले विज्ञापन',noJobs:'अभी कोई खुला विज्ञापन नहीं',
  waMsg:function(y){return 'नमस्ते, मुझे '+y.title.hi+' के बारे में जानकारी चाहिए'},left:function(n){return n===0?'⏰ आज अंतिम दिन':'⏰ सिर्फ़ '+n+' दिन बाकी'}}
};
function lang(){try{return localStorage.getItem(KEY)==='hi'?'hi':'mr'}catch(e){return 'mr'}}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function waHref(msg){return 'https://wa.me/'+WA+'?text='+encodeURIComponent(msg)}
function isPast(iso){if(!iso)return false;var t=new Date(iso).getTime();return !isNaN(t)&&Date.now()>t}
function istDay(t){return Math.floor((t+19800000)/DAY)}
function daysLeft(iso){if(!iso)return null;var t=new Date(iso).getTime();if(isNaN(t)||Date.now()>t)return null;return istDay(t)-istDay(Date.now())}
var GRACE=3*DAY,MON={mr:['जाने','फेब्रु','मार्च','एप्रि','मे','जून','जुलै','ऑग','सप्टें','ऑक्टो','नोव्हें','डिसें'],hi:['जन','फ़र','मार्च','अप्रै','मई','जून','जुल','अग','सितं','अक्टू','नवं','दिसं']};
function isGone(y){var e=y&&(y.endsAt||y.hideAfter);if(!e)return false;var t=new Date(e).getTime();return !isNaN(t)&&Date.now()>t+GRACE}
function fmtDay(d,l){var p=String(d||'').split('-');if(p.length<3)return '';return (+p[2])+' '+MON[l][+p[1]-1]+' '+p[0]}
function isNew(d){if(!d)return false;var t=new Date(d+'T00:00:00+05:30').getTime();return !isNaN(t)&&Date.now()-t>=0&&Date.now()-t<=7*DAY}
window.VYSS={lang:lang,esc:esc,waHref:waHref,isPast:isPast,isGone:isGone,isNew:isNew,U:U,WA:WA};

function applyLang(l){
 document.documentElement.lang=l==='hi'?'hi':'mr';
 document.querySelectorAll('[data-hi]').forEach(function(el){
  if(l==='mr'&&el.dataset.mr==null)return;
  if(el.dataset.mr==null)el.dataset.mr=el.innerHTML;
  el.innerHTML=l==='hi'?el.dataset.hi:el.dataset.mr;
 });
 document.querySelectorAll('a[data-wa-mr]').forEach(function(a){a.href=waHref(l==='hi'&&a.dataset.waHi?a.dataset.waHi:a.dataset.waMr)});
 document.querySelectorAll('.lang button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.l===l?'true':'false')});
 render();
 document.dispatchEvent(new CustomEvent('vyss:lang',{detail:l}));
}
function setLang(l){try{localStorage.setItem(KEY,l)}catch(e){}applyLang(l)}

function card(y,l){
 var u=U[l],past=isPast(y.endsAt),tags='';
 if(isNew(y.added)&&!past)tags+='<span class="t new">'+u.isNew+'</span>';
 if(past)tags+='<span class="t past">'+u.past+'</span>';
 var dl=daysLeft(y.endsAt);if(dl!==null&&dl<=7)tags+='<span class="t soon">'+u.left(dl)+'</span>';
 var tg=(y.tags||[]).slice().sort(function(a,b){return (b.c==='date')-(a.c==='date')});
 tg.forEach(function(t){tags+='<span class="t '+(t.c||'')+'">'+(t.c==='date'?'📅 ':'')+esc(t[l])+'</span>'});
 var d=y.docs,docs;
 if(d&&d[l]&&d[l].length){docs='<div class="dk"><b>📄 '+u.docs+'</b><ul class="docs">'+d[l].map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>'+
   (d['note_'+l]?'<small>'+esc(d['note_'+l])+'</small>':'')+(d.partial?'<small>'+u.docsMore+'</small>':'')+'</div>'}
 else docs='<div class="dk"><b>📄 '+u.docs+'</b><p>'+u.docsWa+'</p></div>';
 var lk=function(s){return '<a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s[l])+'</a>'},S=y.src||[];
 var off=S.filter(function(s){return s.k!=='news'}).map(lk).join(' · '),nw=S.filter(function(s){return s.k==='news'}).map(lk).join(' · ');
 var src=(off?'🔗 <b>'+u.src+':</b> '+off:'')+(y.srcNote?(off?'<br>':'')+esc(y.srcNote[l]):(off?'':esc(u.noSrc)))+(nw?'<br>📰 '+u.news+': '+nw:'')+(y.checked?'<br>✔ '+u.checked+': '+fmtDay(y.checked,l):'');
 var th=y.img?'<a class="thumb" href="'+esc(y.poster)+'" target="_blank" rel="noopener" aria-label="'+u.poster+'"><img src="'+esc(y.img)+'" width="84" height="84" loading="lazy" decoding="async" alt="'+esc(y.title[l])+' – '+u.poster+'"></a>':'';
 return '<article class="card yc'+(past?' is-past':'')+'" id="y-'+esc(y.id)+'"><div class="top">'+th+'<div><h3>'+esc(y.title[l])+'</h3><div class="tags">'+tags+'</div></div></div>'+
  '<p>'+esc(y.body[l])+'</p>'+docs+'<p class="src"><small>'+src+'</small></p>'+
  '<div class="acts"><a class="btn wa-btn" href="'+waHref(u.waMsg(y))+'" target="_blank" rel="noopener">💬 '+u.ask+'</a>'+(y._one?'':'<a class="btn ghost" href="'+esc(y.page)+'">'+u.more+' →</a>')+'</div></article>';
}
window.VYSS.card=function(y,l){var h=card(y,l);return y.rseti?'<!--RSETI-->'+h+'<!--/RSETI-->':h};
function render(){
 var l=lang(),Y=(window.VYSS_YOJANA||[]).filter(Boolean),u=U[l];
 document.querySelectorAll('[data-yojana-list]').forEach(function(el){
  var c=el.getAttribute('data-yojana-list');
  var list=Y.filter(function(y){return y.cat===c&&!isGone(y)});
  list.sort(function(a,b){return isPast(a.endsAt)-isPast(b.endsAt)});
  el.innerHTML=list.map(function(y){return window.VYSS.card(y,l)}).join('');
 });
 document.querySelectorAll('[data-yojana-one]').forEach(function(el){
  var y=Y.filter(function(x){return x.id===el.getAttribute('data-yojana-one')})[0];
  if(y)el.innerHTML=window.VYSS.card(Object.assign({},y,{_one:true}),l);
 });
 document.querySelectorAll('[data-count-cat]').forEach(function(el){
  var c=el.getAttribute('data-count-cat');
  var n=Y.filter(function(y){return (c==='all'||y.cat===c)&&!isPast(y.endsAt)&&!isGone(y)}).length;
  el.textContent=n+u.count;
 });
 document.querySelectorAll('[data-count-jobs]').forEach(function(el){
  var J=(window.VYSS_JOBS||[]).filter(function(j){return j&&j.endsAt&&!isPast(j.endsAt)});
  el.textContent=J.length?J.length+u.open:u.noJobs;
 });
 var q=document.getElementById('quiz-result');if(q&&q.dataset.shown)quiz(false);
}
function quiz(scroll){
 var f=document.getElementById('quiz'),out=document.getElementById('quiz-result');if(!f||!out)return;
 var l=lang(),u=U[l],v=function(n){var x=f.querySelector('input[name='+n+']:checked');return x&&x.value};
 var age=v('age'),cat=v('cat'),role=v('role');
 out.dataset.shown='1';
 if(!age||!cat||!role){out.innerHTML='<p class="qmsg">'+u.pick+'</p>';return}
 var A={lt18:[0,17],a18_50:[18,50],gt50:[51,200]}[age];
 var Y=(window.VYSS_YOJANA||[]).filter(Boolean).filter(function(y){
  if(isPast(y.endsAt)||isGone(y))return false;var r=y.q||{};
  if(r.cats&&r.cats.indexOf(cat)<0)return false;
  if(r.roles&&r.roles.indexOf(role)<0)return false;
  if(r.age&&(A[1]<r.age[0]||A[0]>r.age[1]))return false;
  return true;
 });
 var h=Y.length?'<p class="qmsg"><b>'+Y.length+u.found+'</b></p><div class="list">'+Y.map(function(y){return card(y,l)}).join('')+'</div>':'<p class="qmsg">'+u.none+'</p>';
 if(role==='yuva'||role==='vidyarthi')h+='<p style="margin-top:14px"><a class="btn s" href="/naukri/">💼 '+u.jobs+'</a></p>';
 out.innerHTML=h+'<p class="note">'+u.hint+'</p>';
 if(scroll)out.scrollIntoView({behavior:'smooth',block:'start'});
}
function fabGuard(){
 var f=document.querySelector('.fab');if(!f)return;var q=false;
 function chk(){q=false;var H=window.innerHeight,W=window.innerWidth,hide=false;
  if(W<=860){var rows=document.querySelectorAll('.acts,.naukri-btns,.quiz button,.hero .b,footer');
   for(var i=0;i<rows.length;i++){var r=rows[i].getBoundingClientRect();if(r.bottom>H-96&&r.top<H-12){hide=true;break}}}
  f.classList.toggle('away',hide)}
 window.addEventListener('scroll',function(){if(!q){q=true;requestAnimationFrame(chk)}},{passive:true});window.addEventListener('resize',chk);chk();
}
function init(){
 document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.l)})});
 var f=document.getElementById('quiz');if(f)f.addEventListener('submit',function(e){e.preventDefault();quiz(true)});
 applyLang(lang());
 fabGuard();
 document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href*="wa.me"]');if(a&&window.goatcounter&&goatcounter.count){goatcounter.count({path:'whatsapp-click',title:'WhatsApp button click',event:true})}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
