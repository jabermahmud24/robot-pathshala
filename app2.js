{
const RB = window.RB, bn = RB.bn, ROB = RB.ROB, CATS = RB.CATS;
const $ = id => document.getElementById(id);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ----- sense, think, act simulator ----- */
const sim = $('simSvg'), wallR = $('wallR'), thrR = $('thrR');
let pos = 0, ang = 0, phase = 'go', t0 = 0, tick = 0, lastKey = '';
const LEN = 14;
const NOTES = [
  'রোবট এই তিনটা কাজ বারবার করে, এক সেকেন্ডে অনেকবার। ঠিক যেমন তুমি রাস্তা পার হওয়ার আগে দেখো, ভাবো, তারপর হাঁটো।',
  'এই চক্রের নাম সেন্স–থিংক–অ্যাক্ট লুপ। থামার সীমা খুব কম দিলে কী হয়? আসল রোবট থামতেও একটু সময় নেয়, তাই দেয়ালে ধাক্কা খাওয়ার ঝুঁকি বাড়ে।',
  'এই স্তরে রোবট দেয়ালের কাছে এসে নিজে গতি কমায়: গতি = K × (দূরত্ব − সীমা)। একে P-নিয়ন্ত্রণ বলে, PID-র প্রথম অংশ। গতি দ্বিগুণ হলে ব্রেক করার দূরত্ব প্রায় চারগুণ হয় (v²/2a), তাই আগেভাগে আস্তে হওয়া জরুরি।'
];
function code(d, thr, go) {
  const a = s => `<span class="act">${s}</span>`;
  if (RB.lv === 3) return [
    'void loop() {',
    `  long d = sonar.ping_cm();      // এখন ${d}`,
    `  if (d < ${thr}) {`,
    go ? '    stopMotors(); turnLeft();' : '    ' + a('stopMotors(); turnLeft();'),
    '  } else {',
    go ? a(`    int speed = constrain(K * (d - ${thr}), 40, 255);`) : `    int speed = constrain(K * (d - ${thr}), 40, 255);`,
    go ? a('    forward(speed);') : '    forward(speed);',
    '  }', '}'].join('\n');
  return [
    'বারবার করো {',
    `  দূরত্ব = সেন্সর.মাপো()     // এখন ${bn(d)} সেমি`,
    `  যদি (দূরত্ব < ${bn(thr)}) {`,
    go ? '    মোটর.থামো(); ঘোরো()' : '    ' + a('মোটর.থামো(); ঘোরো()'),
    '  } নাহলে {',
    go ? '    ' + a('মোটর.সামনে_চলো()') : '    মোটর.সামনে_চলো()',
    '  }', '}'].join('\n');
}
function drawSim() {
  const W = sim.clientWidth, H = sim.clientHeight; if (!W) return;
  const wall = +wallR.value, thr = +thrR.value, pad = 16, gy = H - 34;
  const X = u => pad + u * (W - 2 * pad - 18) / 100;
  const d = Math.max(0, Math.round(wall - pos - LEN));
  const rx = X(pos), rw = X(pos + LEN) - rx, rh = Math.min(46, rw * .75), cx = rx + rw / 2, cy = gy - 12 - rh / 2;
  const fx = X(pos + LEN), wx = X(wall), lx = X(wall - thr);
  let waves = '';
  if (phase === 'go') for (let i = 0; i < 3; i++) { const r = ((tick * .8 + i * 12) % 36) + 6; waves += `<path d="M${fx + r} ${cy - r * .7} q${r * .35} ${r * .7} 0 ${r * 1.4}" stroke="#22b5e8" stroke-width="3" fill="none" opacity="${1 - r / 44}"/>`; }
  sim.innerHTML = `<line x1="0" y1="${gy}" x2="${W}" y2="${gy}" stroke="currentColor" opacity=".25" stroke-width="2"/>
  <line x1="${lx}" y1="${gy - 92}" x2="${lx}" y2="${gy}" stroke="#ff5a3c" stroke-width="2" stroke-dasharray="6 5"/>
  <text x="${lx - 6}" y="${gy - 96}" text-anchor="end" font-size="14" fill="#ff5a3c" font-weight="600">থামার সীমা</text>
  <rect x="${wx}" y="${gy - 110}" width="18" height="110" rx="3" fill="#8a6a4a"/>${[0, 1, 2, 3, 4].map(i => `<line x1="${wx}" y1="${gy - 22 * i - 11}" x2="${wx + 18}" y2="${gy - 22 * i - 11}" stroke="#5c4330" stroke-width="2"/>`).join('')}
  ${waves}
  <line x1="${fx}" y1="${gy + 16}" x2="${wx}" y2="${gy + 16}" stroke="currentColor" stroke-width="1.5" opacity=".6"/>
  <text x="${(fx + wx) / 2}" y="${gy + 30}" text-anchor="middle" font-size="14" fill="currentColor" style="font-weight:600">${bn(d)} সেমি</text>
  <g transform="rotate(${-ang} ${cx} ${cy})"><rect x="${rx}" y="${cy - rh / 2}" width="${rw}" height="${rh}" rx="10" fill="#ff5a3c"/><rect x="${fx - 10}" y="${cy - 9}" width="10" height="18" rx="3" fill="#1d1b3a"/><circle cx="${fx - 5}" cy="${cy - 4}" r="2.5" fill="#5be0ff"/><circle cx="${fx - 5}" cy="${cy + 4}" r="2.5" fill="#5be0ff"/></g>
  <circle cx="${rx + rw * .25}" cy="${gy - 10}" r="10" fill="#1d1b3a"/><circle cx="${rx + rw * .75}" cy="${gy - 10}" r="10" fill="#1d1b3a"/>`;
  const go = phase === 'go', key = d + phase + RB.lv + thr;
  if (key !== lastKey) {
    lastKey = key;
    $('s1t').textContent = `দূরত্ব = ${bn(d)} সেমি`;
    $('s2t').textContent = go ? `${bn(d)} > ${bn(thr)}, তাই চলতে থাকো` : `${bn(d)} < ${bn(thr)}! থামতে হবে`;
    $('s3t').textContent = go ? 'মোটর চাকা সামনে ঘোরাচ্ছে' : 'মোটর থামল, এবার ঘুরছে';
    $('s2').classList.toggle('live', !go); $('s3').classList.toggle('live', !go); $('s1').classList.add('live');
    $('codeBox').innerHTML = code(d, thr, go);
  }
}
function stopPos() { return +wallR.value - LEN - +thrR.value; }
function reset() { pos = 0; ang = 0; phase = 'go'; if (reduce) { pos = Math.max(0, stopPos()); phase = 'stop'; ang = 0; } drawSim(); }
function frame(now) {
  tick++;
  const wall = +wallR.value, thr = +thrR.value, d = wall - pos - LEN;
  if (phase === 'go') {
    let v = .32;
    if (RB.lv === 3) v = Math.min(.32, Math.max(.05, .03 * (d - thr)));
    pos += v;
    if (d - v <= thr) { pos = Math.max(0, wall - LEN - thr); phase = 'stop'; t0 = now; }
  } else if (now - t0 > 700 && now - t0 < 1700) { ang = Math.min(90, (now - t0 - 700) / 1000 * 90); }
  else if (now - t0 > 3000) { pos = 0; ang = 0; phase = 'go'; }
  drawSim();
  requestAnimationFrame(frame);
}
const upd = () => { $('wallV').textContent = bn(wallR.value) + ' সেমি'; $('thrV').textContent = bn(thrR.value) + ' সেমি'; };
[wallR, thrR].forEach(r => r.addEventListener('input', () => { upd(); RB.mark('sim'); if (reduce) reset(); else if (phase !== 'go') reset(); }));
$('simGo').addEventListener('click', () => { reset(); RB.mark('sim'); });
const roSim = new ResizeObserver(drawSim); roSim.observe(sim);
upd();
RB.onLv.push(() => { $('loopNote').textContent = NOTES[RB.lv - 1]; lastKey = ''; drawSim(); });
if (reduce) reset(); else requestAnimationFrame(frame);

/* ----- catalogue of 100 robots ----- */
const seen = new Set(RB.store.get('seen', []));
let cat = 'all', list = ROB;
const grid = $('grid'), q = $('q');
const counts = {}; ROB.forEach(r => counts[r.c] = (counts[r.c] || 0) + 1);
$('catChips').innerHTML = `<button class="chip" data-c="all" aria-pressed="true">সব ${bn(ROB.length)}</button>` +
  Object.entries(CATS).map(([k, v]) => `<button class="chip" data-c="${k}" aria-pressed="false">${v[0]} ${bn(counts[k] || 0)}</button>`).join('');
const card = r => `<button class="rc${seen.has(r.id) ? ' seen' : ''}" data-id="${r.id}"><svg class="pic" viewBox="0 0 200 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${RB.pic(r.s, CATS[r.c][1])}</svg><b>${r.n}</b><small>${r.e}</small></button>`;
function seenText() { $('seenCount').textContent = seen.size >= ROB.length ? `অভিনন্দন! তুমি ${bn(ROB.length)}টি রোবটই দেখেছ। এখন তুমি রোবট বিশেষজ্ঞ!` : `${bn(ROB.length)}টির মধ্যে ${bn(seen.size)}টি রোবট দেখেছ। যেকোনো কার্ডে চাপ দিয়ে রোবটের ভেতরের নীল নকশা দেখো।`; }
function render() {
  const s = q.value.trim().toLowerCase();
  list = ROB.filter(r => (cat === 'all' || r.c === cat) && (!s || (r.n + ' ' + r.e + ' ' + r.d + ' ' + CATS[r.c][0]).toLowerCase().includes(s)));
  grid.innerHTML = list.length ? list.map(card).join('') : `<p class="empty">“${RB.esc(q.value)}” নামে কোনো রোবট পাওয়া যায়নি। অন্য শব্দ লিখে দেখো, যেমন: চাকা, পানি, কৃষি।</p>`;
  seenText();
}
$('catChips').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; cat = b.dataset.c; $('catChips').querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', String(x === b))); render(); });
q.addEventListener('input', render);
grid.addEventListener('click', e => { const b = e.target.closest('.rc'); if (b) openRobot(+b.dataset.id, list); });

/* ----- robot detail dialog ----- */
const dlg = $('dlg');
let mList = ROB, mId = 0;
let mAct = -1, splitX = 50;
function setSplit(x) {
  splitX = Math.max(0, Math.min(100, x));
  $('mPic').style.clipPath = `inset(0 ${100 - splitX}% 0 0)`;
  $('divider').style.left = splitX + '%';
  $('splitR').value = Math.round(splitX);
}
function drawBlue() {
  const r = ROB[mId];
  $('mBlue').innerHTML = RB.blue(r.s, r.p, mAct);
  $('mParts').querySelectorAll('.pt').forEach((b, i) => b.setAttribute('aria-pressed', String(i === mAct)));
}
const split = $('split');
let dragging = false;
const fromEvent = e => { const b = split.getBoundingClientRect(); setSplit((e.clientX - b.left) / b.width * 100); };
split.addEventListener('pointerdown', e => { if (e.target.closest('.xbtn')) return; dragging = true; fromEvent(e); try { split.setPointerCapture(e.pointerId); } catch (er) {} });
split.addEventListener('pointermove', e => { if (dragging) fromEvent(e); });
['pointerup', 'pointercancel'].forEach(t => split.addEventListener(t, () => { dragging = false; }));
$('splitR').addEventListener('input', e => setSplit(+e.target.value));
$('mParts').addEventListener('click', e => {
  const b = e.target.closest('.pt'); if (!b) return;
  mAct = +b.dataset.i === mAct ? -1 : +b.dataset.i;
  if (mAct >= 0 && splitX > 10) setSplit(0);
  drawBlue();
});
function fillRobot() {
  const r = ROB[mId], col = CATS[r.c][1];
  mAct = -1;
  $('mPic').innerHTML = `<rect width="200" height="140" fill="#ffffff"/>` + RB.pic(r.s, col);
  $('mParts').innerHTML = r.p.map(([k], i) => `<button class="pt" data-i="${i}" aria-pressed="false"><span class="n">${bn(i + 1)}</span>${RB.glyph(k)}<span><b>${RB.COMP[k][0]}</b><small>${RB.COMP[k][1]}</small></span></button>`).join('');
  drawBlue(); setSplit(50);
  $('mEasy').innerHTML = r.a ? `<b>সহজ করে বুঝি</b>${r.a}` : ''; $('mEasy').hidden = !r.a;
  $('mFun').innerHTML = r.f ? `<b>মজার তথ্য</b>${r.f}` : ''; $('mFun').hidden = !r.f;
  $('mPhoto').href = 'https://en.wikipedia.org/w/index.php?search=' + encodeURIComponent(r.e);
  $('mCat').textContent = CATS[r.c][0]; $('mCat').style.color = col;
  $('mName').textContent = r.n; $('mEn').textContent = r.e; $('mDesc').textContent = r.d;
  const f = [['কী দিয়ে টের পায়', r.w], ['কীভাবে নড়ে আর কাজ করে', r.m]];
  if (RB.lv > 1) f.push(['ভেতরের প্রযুক্তি', r.t]);
  if (RB.lv === 1) f.push(['আরও জানতে চাও?', 'ওপরে স্তর বদলে “তরুণ প্রকৌশলী” বেছে নিলে এই রোবটের ভেতরের প্রযুক্তিও দেখতে পাবে।']);
  $('mFacts').innerHTML = f.map(([h, t]) => `<div class="fact"><span>${h}</span>${t}</div>`).join('');
  if (!seen.has(r.id)) { seen.add(r.id); RB.store.set('seen', [...seen]); RB.ping(); const c = grid.querySelector(`[data-id="${r.id}"]`); if (c) c.classList.add('seen'); seenText(); }
}
function openRobot(id, from) { mList = from && from.length ? from : ROB; mId = id; fillRobot(); if (!dlg.open) { try { dlg.showModal(); } catch (e) { dlg.setAttribute('open', ''); } } }
RB.openRobot = openRobot;
function step(k) { const i = mList.findIndex(r => r.id === mId); mId = mList[(i + k + mList.length) % mList.length].id; fillRobot(); }
$('mPrev').addEventListener('click', () => step(-1));
$('mNext').addEventListener('click', () => step(1));
$('mClose').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
RB.onLv.push(() => { if (dlg.open) fillRobot(); });
render();

/* ----- quiz ----- */
const QN = 6;
let qs = [], qi = 0, score = 0;
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function newQuiz() { qs = shuffle(ROB.map(r => r.id)).slice(0, QN); qi = 0; score = 0; $('qEnd').hidden = true; $('qAns').hidden = false; ask(); }
let right = '', why = '';
function ask() {
  const r = ROB[qs[qi]];
  $('qNum').textContent = `প্রশ্ন ${bn(qi + 1)} / ${bn(QN)} · স্কোর ${bn(score)}`;
  let opts;
  if (qi % 2 === 1 && r.p.length > 1) {
    const i = Math.floor(Math.random() * r.p.length), k = r.p[i][0], name = RB.COMP[k][0];
    const own = new Set(r.p.map(p => RB.COMP[p[0]][0]));
    const wrong = shuffle([...new Set(Object.values(RB.COMP).map(c => c[0]))].filter(n => !own.has(n))).slice(0, 3);
    $('qPic').innerHTML = RB.blue(r.s, r.p, i);
    $('qText').textContent = `${r.n}-এর নীল নকশায় হলুদ বৃত্তের ${bn(i + 1)} নম্বর অংশটা কী?`;
    right = name; why = RB.COMP[k][1];
    opts = shuffle([name, ...wrong]);
  } else {
    const others = shuffle(ROB.filter(x => x.id !== r.id)).slice(0, 3);
    $('qPic').innerHTML = RB.pic(r.s, CATS[r.c][1]);
    $('qText').textContent = r.d + ' এটা কোন রোবট?';
    right = r.n; why = r.f || '';
    opts = shuffle([r, ...others].map(o => o.n));
  }
  $('qAns').innerHTML = opts.map(o => `<button class="ans" data-v="${o}">${o}</button>`).join('');
}
$('qAns').addEventListener('click', e => {
  const btn = e.target.closest('.ans'); if (!btn || $('qAns').dataset.lock) return;
  const ok = btn.dataset.v === right;
  $('qAns').dataset.lock = '1';
  if (ok) score++;
  $('qAns').querySelectorAll('.ans').forEach(x => { x.disabled = true; if (x.dataset.v === right) x.classList.add('ok'); else if (x === btn) x.classList.add('no'); });
  $('qNum').textContent = `প্রশ্ন ${bn(qi + 1)} / ${bn(QN)} · স্কোর ${bn(score)} · ${ok ? 'ঠিক হয়েছে!' : 'এবার হয়নি, পরেরটায় হবে!'}`;
  if (why) $('qText').textContent = (ok ? 'ঠিক! ' : `উত্তর: ${right}। `) + why;
  setTimeout(() => {
    delete $('qAns').dataset.lock;
    qi++;
    if (qi < QN) return ask();
    $('qAns').hidden = true; $('qEnd').hidden = false;
    $('qText').textContent = 'কুইজ শেষ!';
    $('qNum').textContent = `তোমার স্কোর ${bn(score)} / ${bn(QN)}`;
    if (score > (RB.prog.quizBest || 0)) RB.mark('quizBest', score);
    $('qStars').textContent = '★'.repeat(score) + '☆'.repeat(QN - score);
    $('qMsg').textContent = score >= 5 ? 'দারুণ! তুমি সত্যিকারের রোবট বিশেষজ্ঞ।' : score >= 3 ? 'ভালো হয়েছে! ১০০ রোবটের তালিকা ঘুরে আবার চেষ্টা করো।' : 'চিন্তা নেই! রোবটের কার্ডগুলো পড়ে আবার খেলো, এবার আরও ভালো হবে।';
  }, 2600);
});
$('qAgain').addEventListener('click', newQuiz);
newQuiz();

RB.setLv(RB.lv);
}
