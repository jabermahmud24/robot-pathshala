{
const RB = window.RB, bn = RB.bn, store = RB.store, ROB = RB.ROB;
const $ = id => document.getElementById(id);
const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const today = new Date(); const tk = dayKey(today);
const dayNum = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 864e5);
// প্রতিদিন একই প্রশ্ন: তারিখ থেকে বানানো এলোমেলো সংখ্যা
let seed = dayNum * 2654435761 % 4294967296;
const rnd = () => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pick = a => a[Math.floor(rnd() * a.length)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const r = ROB[Math.floor(rnd() * ROB.length)];
let Q;
if (dayNum % 2 === 0 || r.p.length < 2) {
  const others = shuffle(ROB.filter(x => x.id !== r.id)).slice(0, 3);
  Q = { pic: RB.pic(r.s, RB.CATS[r.c][1]), q: r.d + RB.L(' এটা কোন রোবট?', ' Which robot is this?'), right: r.n, opts: shuffle([r.n, ...others.map(o => o.n)]) };
} else {
  const i = Math.floor(rnd() * r.p.length), k = r.p[i][0], name = RB.COMP[k][0];
  const own = new Set(r.p.map(p => RB.COMP[p[0]][0]));
  const wrong = shuffle([...new Set(Object.values(RB.COMP).map(c => c[0]))].filter(n => !own.has(n))).slice(0, 3);
  Q = { pic: RB.blue(r.s, r.p, i), q: RB.L(`${r.n}-এর নীল নকশায় হলুদ বৃত্তের ${bn(i + 1)} নম্বর অংশটা কী?`, `On the ${r.n} blueprint, what is part number ${i + 1} in the yellow circle?`), right: name, opts: shuffle([name, ...wrong]) };
}
let log = store.get('daily', {});
function streak() {
  let n = 0; const d = new Date(today);
  if (log[tk] === undefined) d.setDate(d.getDate() - 1);
  while (log[dayKey(d)] !== undefined) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function week() {
  const out = [], names = RB.en ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
  for (let i = 6; i >= 0; i--) { const d = new Date(today); d.setDate(d.getDate() - i); const v = log[dayKey(d)]; out.push(`<span class="wd ${v === undefined ? '' : v ? 'ok' : 'try'} ${i === 0 ? 'now' : ''}"><i></i>${names[d.getDay()]}</span>`); }
  return out.join('');
}
function render() {
  const n = streak(), answered = log[tk] !== undefined;
  $('dStreak').innerHTML = `<svg viewBox="0 0 24 24" class="flame" aria-hidden="true"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 0 2 1 3 2 3 0-3-1-5 1-8z" fill="#ff5a3c"/><path d="M12 12c1 2 3 3 3 5a3 3 0 0 1-6 0c0-2 2-3 3-5z" fill="#ffcd1f"/></svg><b>${bn(n)}</b><span>${RB.L('দিনের ধারা', n === 1 ? 'day streak' : 'day streak')}</span>`;
  $('dWeek').innerHTML = week();
  $('dPic').innerHTML = Q.pic;
  $('dQ').textContent = Q.q;
  $('dAns').innerHTML = Q.opts.map(o => `<button class="ans" data-v="${RB.esc(o)}" ${answered ? 'disabled' : ''}>${RB.esc(o)}</button>`).join('');
  if (answered) {
    $('dAns').querySelectorAll('.ans').forEach(b => { if (b.dataset.v === Q.right) b.classList.add('ok'); });
    $('dAfter').hidden = false;
    $('dAfter').innerHTML = RB.en ? `<b>${log[tk] ? 'Correct!' : `The answer was: ${RB.esc(Q.right)}`}</b> Today's robot is the <button class="linkish" data-id="${r.id}">${r.n}</button>. ${r.f ? 'Fun fact: ' + r.f : ''} <span class="soft">A new question comes tomorrow; come back to keep your streak!</span>` : `<b>${log[tk] ? 'ঠিক উত্তর!' : `উত্তর ছিল: ${RB.esc(Q.right)}`}</b> আজকের রোবট <button class="linkish" data-id="${r.id}">${r.n}</button>। ${r.f ? 'মজার তথ্য: ' + r.f : ''} <span class="soft">কাল নতুন প্রশ্ন আসবে, ধারা ধরে রাখতে আবার এসো!</span>`;
  } else $('dAfter').hidden = true;
}
$('dAns').addEventListener('click', e => {
  const b = e.target.closest('.ans'); if (!b || log[tk] !== undefined) return;
  const ok = b.dataset.v === Q.right;
  log[tk] = ok ? 1 : 0; store.set('daily', log); RB.mark('dailyBest', Math.max(RB.prog.dailyBest || 0, streak()));
  render(); if (!ok) b.classList.add('no');
});
$('dAfter').addEventListener('click', e => { const c = e.target.closest('[data-id]'); if (c) RB.openRobot(+c.dataset.id, ROB); });
render();
}
