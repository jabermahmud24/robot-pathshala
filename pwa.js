{
const $ = id => document.getElementById(id);
const btn = $('installBtn'), toast = $('toast');
const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
let deferred = null;
function show(msg, action, label) {
  toast.querySelector('span').textContent = msg;
  const a = toast.querySelector('button.do');
  a.hidden = !action; a.textContent = label || ''; a.onclick = action || null;
  toast.hidden = false;
}
window.RB && (window.RB.toast = show);
toast.querySelector('button.x').addEventListener('click', () => { toast.hidden = true; });

/* install button */
if (!standalone) {
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; btn.hidden = false; });
  if (ios) btn.hidden = false;
}
btn.addEventListener('click', async () => {
  if (deferred) {
    deferred.prompt();
    try { const r = await deferred.userChoice; if (r.outcome === 'accepted') btn.hidden = true; } catch (e) {}
    deferred = null;
  } else {
    const d = $('iosHelp');
    try { d.showModal(); } catch (e) { d.setAttribute('open', ''); }
  }
});
$('iosClose').addEventListener('click', () => $('iosHelp').close());
window.addEventListener('appinstalled', () => { btn.hidden = true; show(L('অ্যাপ ইনস্টল হয়েছে! এখন হোম স্ক্রিন থেকে খোলো।', 'App installed! Open it from your home screen.')); });

/* share the site */
const sb = $('shareBtn');
if (sb) sb.addEventListener('click', async () => {
  const url = 'https://jabermahmud24.github.io/robot-pathshala/' + (window.LANG === 'en' ? '?lang=en' : '');
  const data = { title: L('রোবট পাঠশালা', 'Robot Pathshala'), text: L('বাংলায় খেলতে খেলতে রোবট শেখো!', 'Learn how robots work, through play!'), url };
  try { if (navigator.share) { await navigator.share(data); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
  try { await navigator.clipboard.writeText(url); show(L('লিংক কপি হয়েছে! এখন যেকোনো জায়গায় পেস্ট করো।', 'Link copied! Paste it anywhere.')); }
  catch (e) { show(url); }
});

/* offline support and updates */
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  try {
    navigator.serviceWorker.register('sw.js').then(reg => {
      const ask = w => show(L('নতুন আপডেট এসেছে!', 'A new update is ready!'), () => { w.postMessage('update'); }, L('এখনই দেখো', 'Update now'));
      if (reg.waiting && navigator.serviceWorker.controller) ask(reg.waiting);
      const track = w => {
        if (!w) return;
        const done = () => { if (navigator.serviceWorker.controller) ask(w); else show(L('এখন ইন্টারনেট ছাড়াও রোবট পাঠশালা চলবে!', 'Robot Pathshala now works without internet!')); };
        if (w.state === 'installed') return done();
        w.addEventListener('statechange', () => { if (w.state === 'installed') done(); });
      };
      track(reg.installing);
      reg.addEventListener('updatefound', () => track(reg.installing));
    }).catch(() => {});
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!reloaded) { reloaded = true; location.reload(); } });
  } catch (e) {}
}
window.addEventListener('offline', () => show(L('ইন্টারনেট নেই, তবু চিন্তা নেই: সব পাঠ আর খেলা চলবে।', 'No internet? No problem: all lessons and games still work.')));
}
