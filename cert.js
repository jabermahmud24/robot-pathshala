{
const RB = window.RB, bn = RB.bn, store = RB.store;
const $ = id => document.getElementById(id);
const cv = $('cCanvas'), W = 1600, H = 1131;
const NEED = 8;
const L = RB.L;
const rank = n => n >= 22 ? L('রোবট কিংবদন্তি', 'Robot legend') : n >= 15 ? L('মাস্টার বিল্ডার', 'Master builder') : n >= 6 ? L('তরুণ প্রকৌশলী', 'Young engineer') : L('শিক্ষানবিশ', 'Apprentice');
const fmtDate = () => { try { return new Intl.DateTimeFormat(RB.en ? 'en-GB' : 'bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch (e) { return bn(new Date().toLocaleDateString()); } };
function row(label, a, b, req) {
  return `<div class="cr ${a >= b ? 'ok' : ''}"><span>${label}${req ? ` <em>${L('(দরকার)', '(required)')}</em>` : ''}</span><span class="tp"><i style="width:${Math.min(100, Math.round(a / b * 100))}%"></i></span><b>${bn(Math.min(a, b))}/${bn(b)}</b></div>`;
}
function renderProgress() {
  const s = RB.stat(), open = s.missionsDone >= NEED;
  $('cProg').innerHTML = row(L('রোবট মিশন জেতা', 'Robot missions won'), s.missionsDone, NEED, true) + row(L('কোডিং লেভেল', 'Coding levels'), s.mazeDone, 10) + row(L('কুইজে সেরা স্কোর', 'Best quiz score'), s.quiz, 6) + row(L('রোবট চেনা', 'Robots explored'), s.seen, 100);
  $('cLock').hidden = open;
  $('cLock').innerHTML = `<b>${L('সনদ এখনো তালাবন্ধ', 'Certificate still locked')}</b><span>${L(`আর ${bn(NEED - s.missionsDone)}টি মিশন জিতলেই খুলে যাবে!`, `Win ${NEED - s.missionsDone} more mission${NEED - s.missionsDone > 1 ? 's' : ''} to unlock it!`)}</span><a href="#banao" class="btn">${L('মিশনে যাও →', 'Go to missions →')}</a>`;
  ['cMake', 'cSave', 'cPrint'].forEach(id => { $(id).disabled = !open; });
  return open;
}
function img(svg) { return new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); }); }
async function draw() {
  const s = RB.stat(), name = ($('cName').value || '').trim() || L('তোমার নাম', 'Your name');
  try { await Promise.all([document.fonts.load('800 100px "Baloo Da 2"', 'সনদ'), document.fonts.load('600 40px "Hind Siliguri"', 'সনদ')]); } catch (e) {}
  const c = cv.getContext('2d');
  c.fillStyle = '#ffffff'; c.fillRect(0, 0, W, H);
  c.fillStyle = '#ffcd1f'; c.fillRect(0, 0, W, H);
  c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect ? c.roundRect(46, 46, W - 92, H - 92, 34) : c.rect(46, 46, W - 92, H - 92); c.fill();
  c.strokeStyle = '#ff5a3c'; c.lineWidth = 6; c.beginPath(); c.roundRect ? c.roundRect(70, 70, W - 140, H - 140, 24) : c.rect(70, 70, W - 140, H - 140); c.stroke();
  // corner gears
  [[110, 110], [W - 110, 110], [110, H - 110], [W - 110, H - 110]].forEach(([x, y]) => {
    c.fillStyle = '#1d1b3a'; c.beginPath(); c.arc(x, y, 26, 0, Math.PI * 2); c.fill();
    for (let k = 0; k < 8; k++) { c.save(); c.translate(x, y); c.rotate(k * Math.PI / 4); c.fillRect(-7, -36, 14, 14); c.restore(); }
    c.fillStyle = '#ffcd1f'; c.beginPath(); c.arc(x, y, 11, 0, Math.PI * 2); c.fill();
  });
  const robu = await img(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="40 20 120 185">${RB.robu('happy')}</svg>`);
  if (robu) c.drawImage(robu, W / 2 - 78, 88, 156, 240);
  c.textAlign = 'center'; c.textBaseline = 'alphabetic';
  const T = (txt, y, font, col) => { c.font = font; c.fillStyle = col; c.fillText(txt, W / 2, y, W - 260); };
  T(L('সনদপত্র', 'Certificate'), 420, '800 104px "Baloo Da 2", "Hind Siliguri", sans-serif', '#1d1b3a');
  T(L('রোবট পাঠশালা', 'Robot Pathshala'), 482, '700 40px "Baloo Da 2", "Hind Siliguri", sans-serif', '#ff5a3c');
  T(L('এই মর্মে প্রত্যয়ন করা হচ্ছে যে', 'This is to certify that'), 560, '500 36px "Hind Siliguri", sans-serif', '#4b4868');
  T(name, 670, '800 92px "Baloo Da 2", "Hind Siliguri", sans-serif', '#d93b1f');
  c.strokeStyle = '#1d1b3a'; c.lineWidth = 2; c.beginPath(); c.moveTo(W / 2 - 360, 700); c.lineTo(W / 2 + 360, 700); c.stroke();
  T(L(`রোবট পাঠশালার সব ${bn(NEED)}টি রোবট মিশন সফলভাবে শেষ করে`, `has successfully completed all ${NEED} robot missions of Robot Pathshala`), 770, '500 36px "Hind Siliguri", sans-serif', '#1d1b3a');
  T(L(`“${rank(s.missionStars)}” পদবি অর্জন করেছে।`, `and earned the title “${rank(s.missionStars)}”.`), 826, '600 38px "Hind Siliguri", sans-serif', '#1d1b3a');
  T(L(`মিশনে তারা ${bn(s.missionStars)}/${bn(24)}  ·  কোডিং লেভেল ${bn(s.mazeDone)}/${bn(10)}  ·  কুইজে সেরা ${bn(s.quiz)}/${bn(6)}  ·  চেনা রোবট ${bn(s.seen)}টি`, `Mission stars ${s.missionStars}/24  ·  Coding levels ${s.mazeDone}/10  ·  Best quiz ${s.quiz}/6  ·  Robots explored ${s.seen}`), 892, '500 28px "Hind Siliguri", sans-serif', '#5b5878');
  // seal
  const sx = W / 2, sy = 990;
  c.fillStyle = '#ffcd1f'; c.beginPath();
  for (let k = 0; k < 24; k++) { const r = k % 2 ? 50 : 62, a = k * Math.PI / 12; c.lineTo(sx + r * Math.cos(a), sy + r * Math.sin(a)); }
  c.closePath(); c.fill(); c.fillStyle = '#ff5a3c'; c.beginPath(); c.arc(sx, sy, 40, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#fff'; c.font = '700 44px sans-serif'; c.fillText('★', sx, sy + 15);
  c.textAlign = 'left'; c.fillStyle = '#1d1b3a'; c.font = '600 30px "Hind Siliguri", sans-serif'; c.fillText(L('তারিখ: ', 'Date: ') + fmtDate(), 170, 1010);
  c.textAlign = 'right'; c.font = '800 44px "Baloo Da 2", sans-serif'; c.fillStyle = '#ff5a3c'; c.fillText(L('রোবু', 'Robu'), W - 210, 990);
  c.strokeStyle = '#1d1b3a'; c.beginPath(); c.moveTo(W - 460, 1004); c.lineTo(W - 170, 1004); c.stroke();
  c.font = '500 26px "Hind Siliguri", sans-serif'; c.fillStyle = '#1d1b3a'; c.fillText(L('প্রধান শিক্ষক রোবট, রোবট পাঠশালা', 'Head teacher robot, Robot Pathshala'), W - 170, 1042);
}
$('cMake').addEventListener('click', () => { store.set('certName', $('cName').value); draw(); });
$('cName').addEventListener('input', () => store.set('certName', $('cName').value));
$('cSave').addEventListener('click', async () => {
  await draw();
  try { const a = document.createElement('a'); a.download = 'robot-pathshala-sonod.png'; a.href = cv.toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove(); }
  catch (e) { RB.toast && RB.toast(L('ছবি নামানো গেল না। সনদের ছবিতে আঙুল চেপে ধরে “Save image” বেছে নাও।', 'Couldn\'t save the picture. Press and hold the certificate and choose “Save image”.')); }
});
$('cPrint').addEventListener('click', async () => {
  await draw();
  $('printArea').innerHTML = `<img src="${cv.toDataURL('image/png')}" alt="${L('সনদ', 'Certificate')}">`;
  setTimeout(() => { try { window.print(); } catch (e) {} }, 200);
});
$('cName').value = store.get('certName', '');
document.addEventListener('rb:progress', renderProgress);
renderProgress(); draw();
}
