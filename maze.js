{
const RB = window.RB, MZ = window.MZ, bn = RB.bn, store = RB.store;
const $ = id => document.getElementById(id);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const D = '#1d1b3a', CELL = 40;
const BL = {
  fwd: [L('সামনে যাও', 'Move forward'), 'fwd'], right: [L('ডানে ঘোরো ↻', 'Turn right ↻'), 'turn'], left: [L('বামে ঘোরো ↺', 'Turn left ↺'), 'turn'],
  rep: [L('বারবার করো', 'Repeat'), 'rep'], while: [L('লক্ষ্যে না পৌঁছানো পর্যন্ত বারবার', 'Repeat until goal'), 'whl'], if: [L('যদি … নাহলে', 'If … else'), 'iff']
};
let li = store.get('mzLevel', 0), best = store.get('maze', {}), saved = store.get('mzProg', {});
let prog = [], target = 'r', running = false, timer = null, ids = new WeakMap(), robo = null, angle = 0;
const clone = o => JSON.parse(JSON.stringify(o));
function listAt(path) {
  const t = path.split('.'); let list = prog;
  for (let i = 1; i < t.length; i += 2) list = list[+t[i]][t[i + 1]];
  return list;
}
function nodeAt(path) { const t = path.split('.'); const idx = +t.pop(); return [listAt(t.join('.')), idx]; }
const unlocked = i => i === 0 || (best[i - 1] || 0) > 0;
const stars = n => '★'.repeat(n) + '☆'.repeat(3 - n);

/* ----- level bar ----- */
function renderLevels() {
  $('mzLv').innerHTML = MZ.L.map((l, i) => `<button class="lvb" data-i="${i}" aria-pressed="${i === li}" ${unlocked(i) ? '' : 'disabled'}><b>${bn(i + 1)}</b><span>${unlocked(i) ? (best[i] ? stars(best[i]) : L('নতুন', 'New')) : L('তালা', 'Locked')}</span></button>`).join('');
}

/* ----- board ----- */
function drawBoard() {
  const lv = MZ.L[li], P = MZ.parse(lv), W = P.cols * CELL, H = P.rows * CELL, svg = $('mzSvg');
  svg.setAttribute('viewBox', `-4 -4 ${W + 8} ${H + 8}`);
  let s = `<rect x="-4" y="-4" width="${W + 8}" height="${H + 8}" rx="12" fill="#2b3a67"/>`;
  P.g.forEach((row, y) => row.forEach((c, x) => {
    const X = x * CELL, Y = y * CELL;
    if (c === '#') s += `<rect x="${X + 1}" y="${Y + 1}" width="${CELL - 2}" height="${CELL - 2}" rx="5" fill="#46578f"/><rect x="${X + 1}" y="${Y + 1}" width="${CELL - 2}" height="8" rx="4" fill="#5d70ad"/>`;
    else s += `<rect x="${X + 1}" y="${Y + 1}" width="${CELL - 2}" height="${CELL - 2}" rx="5" fill="${(x + y) % 2 ? '#f4f1e6' : '#ebe6d6'}"/>`;
    if (c === 'G') s += `<rect x="${X + 6}" y="${Y + 6}" width="28" height="28" rx="6" fill="#ffcd1f"/><path d="M${X + 22} ${Y + 9} L${X + 14} ${Y + 22} H${X + 20} L${X + 17} ${Y + 31} L${X + 27} ${Y + 17} H${X + 21} Z" fill="${D}"/>`;
    if (c === 'B') s += `<g class="bat" data-k="${y},${x}"><rect x="${X + 12}" y="${Y + 11}" width="16" height="20" rx="3" fill="#2fa84f" stroke="${D}" stroke-width="1.5"/><rect x="${X + 17}" y="${Y + 8}" width="6" height="4" fill="${D}"/><path d="M${X + 21} ${Y + 14} L${X + 16} ${Y + 22} H${X + 20} L${X + 18} ${Y + 28} L${X + 24} ${Y + 19} H${X + 20} Z" fill="#fff"/></g>`;
    if (c === 'S') s += `<circle cx="${X + 20}" cy="${Y + 20}" r="15" fill="none" stroke="#c9bfa0" stroke-width="2" stroke-dasharray="4 4"/>`;
  }));
  s += `<g id="mzTrail"></g><g id="mzBot"><g><rect x="-14" y="-12" width="28" height="26" rx="8" fill="#ff5a3c" stroke="${D}" stroke-width="1.5"/><rect x="-9" y="-8" width="18" height="9" rx="4" fill="${D}"/><circle cx="-4" cy="-3.5" r="2.4" fill="#5be0ff"/><circle cx="4" cy="-3.5" r="2.4" fill="#5be0ff"/><path d="M-6 -16 L0 -23 L6 -16 Z" fill="#ffcd1f" stroke="${D}" stroke-width="1.2"/></g></g>`;
  svg.innerHTML = s;
  robo = $('mzBot'); angle = lv.dir * 90; place(P.s[0], P.s[1], false);
}
function place(y, x, anim) {
  robo.style.transition = anim && !reduce ? 'transform .32s ease-in-out' : 'none';
  robo.style.transform = `translate(${x * CELL + 20}px,${y * CELL + 20}px) rotate(${angle}deg)`;
}

/* ----- program editor ----- */
function blk(b, p) {
  ids.set(b, p);
  const [label, cls] = BL[b.t];
  const x = `<button class="x" data-act="del" data-p="${p}" aria-label="${L('মুছে ফেলো', 'Delete')}">×</button>`;
  if (b.t === 'fwd') return `<div class="blk ${cls}" data-id="${p}"><span>${label}</span><button class="pill" data-act="n" data-p="${p}">${bn(b.n || 1)} ${L('ঘর', (b.n || 1) > 1 ? 'squares' : 'square')}</button>${x}</div>`;
  if (b.t === 'right' || b.t === 'left') return `<div class="blk ${cls}" data-id="${p}"><span>${label}</span>${x}</div>`;
  if (b.t === 'rep') return `<div class="blk ${cls} box" data-id="${p}"><div class="bh"><span>${L('বারবার করো', 'Repeat')}</span><button class="pill" data-act="n" data-p="${p}">${bn(b.n || 2)} ${L('বার', 'times')}</button>${x}</div>${slot(b.body, p + '.body')}</div>`;
  if (b.t === 'while') return `<div class="blk ${cls} box" data-id="${p}"><div class="bh"><span>${label}</span>${x}</div>${slot(b.body, p + '.body')}</div>`;
  return `<div class="blk ${cls} box" data-id="${p}"><div class="bh"><span>${L('যদি', 'If')}</span><button class="pill" data-act="c" data-p="${p}">${MZ.COND[b.c]}</button>${x}</div><div class="blab">${L('তাহলে', 'then')}</div>${slot(b.then, p + '.then')}<div class="blab">${L('নাহলে', 'else')}</div>${slot(b.else, p + '.else')}</div>`;
}
function slot(list, path) {
  return `<div class="slot">${list.map((b, i) => blk(b, path + '.' + i)).join('')}<button class="drop${target === path ? ' on' : ''}" data-act="tgt" data-p="${path}">${target === path ? L('+ নতুন ব্লক এখানে বসবে', '+ New blocks go here') : L('+ এখানে বসাও', '+ Put blocks here')}</button></div>`;
}
function renderProg() {
  ids = new WeakMap();
  $('mzProg').innerHTML = prog.length ? slot(prog, 'r') : `<p class="empty2">${L('ওপরের ব্লকে চাপ দিয়ে প্রোগ্রাম বানাও।', 'Tap the blocks above to build a program.')}</p>${slot(prog, 'r')}`;
  const n = MZ.count(prog), par = MZ.L[li].par;
  $('mzCount').textContent = L(`${bn(n)}টি ব্লক · ৩ তারার জন্য ${bn(par)}টি বা কম`, `${n} blocks · ${par} or fewer for 3 stars`);
  saved[li] = prog; store.set('mzProg', saved);
}
function renderPal() {
  $('mzPal').innerHTML = MZ.L[li].blocks.map(t => `<button class="blk ${BL[t][1]} add" data-add="${t}">${BL[t][0]}</button>`).join('');
}
function validTarget() { try { listAt(target); } catch (e) { target = 'r'; } }

/* ----- running ----- */
function stop() { clearTimeout(timer); timer = null; running = false; $('mz').classList.remove('running'); $('mzRun').textContent = L('চালাও ▶', 'Run ▶'); }
function resetBoard() { stop(); drawBoard(); document.querySelectorAll('#mzProg .now').forEach(e => e.classList.remove('now')); }
function msg(html, kind) { $('mzMsg').innerHTML = html; $('mzMsg').className = 'mzmsg ' + (kind || ''); }
function run() {
  if (running) { resetBoard(); msg(''); return; }
  if (!prog.length) { msg(L('আগে কিছু ব্লক যোগ করো!', 'Add some blocks first!'), 'warn'); return; }
  resetBoard(); msg(L('রোবট চলছে…', 'The robot is running…'));
  running = true; $('mz').classList.add('running'); $('mzRun').textContent = L('থামাও ■', 'Stop ■');
  const lv = MZ.L[li], P = MZ.parse(lv), it = MZ.run(lv, prog);
  let lastSt = null;
  const tick = () => {
    const r = it.next();
    document.querySelectorAll('#mzProg .now').forEach(e => e.classList.remove('now'));
    if (r.done) return finish(r.value || lastSt, lv, P);
    const { b, st, kind } = r.value; lastSt = st;
    const el = document.querySelector(`#mzProg [data-id="${ids.get(b)}"]`); if (el) el.classList.add('now');
    if (kind === 'turn') { angle += b.t === 'right' ? 90 : -90; place(st.y, st.x, true); }
    if (kind === 'move') {
      place(st.y, st.x, true);
      $('mzTrail').insertAdjacentHTML('beforeend', `<circle cx="${st.x * CELL + 20}" cy="${st.y * CELL + 20}" r="3" fill="#ff5a3c" opacity=".5"/>`);
      const bat = document.querySelector(`#mzSvg .bat[data-k="${st.y},${st.x}"]`); if (bat) bat.style.opacity = '0';
    }
    if (kind === 'crash') { robo.classList.add('bump'); setTimeout(() => robo.classList.remove('bump'), 500); }
    timer = setTimeout(tick, reduce ? 60 : 380);
  };
  tick();
}
function finish(st, lv, P) {
  stop();
  if (st.done) {
    const got = MZ.stars(lv, prog, st, P);
    if (got > (best[li] || 0)) { best[li] = got; store.set('maze', best); RB.ping && RB.ping(); }
    const tips = [];
    if (st.got.size < P.bat.length) tips.push(L(`পথে ${bn(P.bat.length - st.got.size)}টা ব্যাটারি রয়ে গেছে; সব তুললে আরও একটা তারা।`, `${P.bat.length - st.got.size} battery left on the way; collect them all for another star.`));
    if (MZ.count(prog) > lv.par) tips.push(L(`${bn(lv.par)}টি বা কম ব্লকে পারবে? তাহলে আরও একটা তারা।`, `Can you do it in ${lv.par} blocks or fewer? That's another star.`));
    const next = li + 1 < MZ.L.length ? `<button class="btn" id="mzNext">${L('পরের লেভেল →', 'Next level →')}</button>` : `<b>${L('তুমি সব লেভেল শেষ করেছ! সত্যিকারের প্রোগ্রামার!', 'You finished every level! A real programmer!')}</b>`;
    msg(`<span class="st">${stars(got)}</span> ${L('দারুণ! রোবট চার্জিং স্টেশনে পৌঁছেছে!', 'Brilliant! The robot reached the charging station!')} ${tips.join(' ')} ${next}`, 'win');
    renderLevels();
  } else if (st.crash) { msg(L('ধাক্কা! সামনে দেয়াল ছিল। রোবট যে ব্লকে থেমেছে, সেটা দেখে প্রোগ্রাম ঠিক করো।', 'Bump! There was a wall ahead. Look at the block where the robot stopped and fix your program.'), 'lose'); }
  else if (st.loop) { msg(L('রোবট একই জায়গায় ঘুরপাক খাচ্ছে! লুপের ভেতরে এমন কিছু রাখো যাতে রোবট এগোয়।', 'The robot is going round in circles! Put something inside the loop that moves it forward.'), 'lose'); }
  else msg(L('প্রোগ্রাম শেষ, কিন্তু রোবট এখনো লক্ষ্যে পৌঁছায়নি। আরও ব্লক যোগ করো।', 'The program finished, but the robot hasn\'t reached the goal yet. Add more blocks.'), 'warn');
}

function load(i) {
  stop(); li = i; store.set('mzLevel', li);
  const lv = MZ.L[li];
  prog = clone(saved[li] || []); target = 'r';
  $('mzT').textContent = `${L('লেভেল', 'Level')} ${bn(li + 1)}: ${lv.t}`; $('mzLearn').textContent = lv.learn;
  renderLevels(); renderPal(); renderProg(); drawBoard(); msg('');
}

$('mzLv').addEventListener('click', e => { const c = e.target.closest('.lvb'); if (c && !c.disabled) load(+c.dataset.i); });
$('mzPal').addEventListener('click', e => {
  const c = e.target.closest('[data-add]'); if (!c || running) return;
  if (MZ.count(prog) >= 40) { msg(L('ব্লক অনেক বেশি হয়ে গেছে! লুপ ব্যবহার করে ছোট করো।', 'Too many blocks! Use a loop to make it shorter.'), 'warn'); return; }
  validTarget();
  const t = c.dataset.add, b = { t };
  if (t === 'fwd') b.n = 1; if (t === 'rep') { b.n = 2; b.body = []; } if (t === 'while') b.body = [];
  if (t === 'if') { b.c = 'wall'; b.then = []; b.else = []; }
  const list = listAt(target); list.push(b);
  if (b.body) target = `${target}.${list.length - 1}.body`;
  if (b.then) target = `${target}.${list.length - 1}.then`;
  resetBoard(); renderProg(); msg('');
});
$('mzProg').addEventListener('click', e => {
  const c = e.target.closest('[data-act]'); if (!c || running) return;
  const p = c.dataset.p;
  if (c.dataset.act === 'tgt') target = p;
  else {
    const [list, i] = nodeAt(p), b = list[i];
    if (c.dataset.act === 'del') { list.splice(i, 1); if (target.startsWith(p)) target = 'r'; }
    if (c.dataset.act === 'n') b.n = b.t === 'fwd' ? (b.n || 1) % 6 + 1 : (b.n || 2) % 9 + 2;
    if (c.dataset.act === 'c') { const ks = Object.keys(MZ.COND); b.c = ks[(ks.indexOf(b.c) + 1) % ks.length]; }
  }
  resetBoard(); renderProg(); msg('');
});
$('mzRun').addEventListener('click', run);
$('mzReset').addEventListener('click', () => { resetBoard(); msg(''); });
$('mzClear').addEventListener('click', () => { if (running) return; prog = []; target = 'r'; resetBoard(); renderProg(); msg(''); });
$('mzMsg').addEventListener('click', e => { if (e.target.id === 'mzNext') { load(li + 1); $('kod').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); } });
if (!unlocked(li)) li = 0;
load(li);
}
