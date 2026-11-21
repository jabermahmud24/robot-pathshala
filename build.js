{
const RB = window.RB, bn = RB.bn, P = window.BP, M = window.BM;
const $ = id => document.getElementById(id);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const D = '#1d1b3a';
const GROUPS = [['move', 'কীভাবে চলবে?', 1], ['sense', 'কী দিয়ে টের পাবে?', 3], ['tool', 'হাতে কী থাকবে?', 1], ['power', 'শক্তি আসবে কোথা থেকে?', 1], ['brain', 'কেমন মস্তিষ্ক?', 1]];
const store = RB.store;
let b = Object.assign({ move: 'wheel', sense: ['cam'], tool: 'none', power: 'sbat', brain: 'micro' }, store.get('bot', {}));
if (!Array.isArray(b.sense)) b.sense = ['cam'];
let mi = Math.max(0, M.findIndex(m => m.id === store.get('mission', 'flood')));
let best = store.get('stars', {});
const f1 = n => bn(Math.round(n * 10) / 10);
const dur = m => m >= 60 ? `${f1(m / 60)} ঘণ্টা` : `${bn(Math.round(m))} মিনিট`;

function stats() {
  const parts = [P.move[b.move], ...b.sense.map(k => P.sense[k]), P.tool[b.tool], P.power[b.power], P.brain[b.brain]];
  const cost = parts.reduce((s, p) => s + p[1], 0), kg = parts.reduce((s, p) => s + p[2], 0), w = parts.reduce((s, p) => s + p[3], 0);
  const cap = P.power[b.power][5];
  return { cost, kg, w, cap, run: w ? cap / w * 60 : Infinity };
}
const has = t => t.split('+').every(k => b.move === k || b.tool === k || b.power === k || b.brain === k || b.sense.includes(k));
const sp = v => { const i = v.indexOf(':'); return [v.slice(0, i), v.slice(i + 1)]; };

function evaluate(m) {
  const L = [], st = stats();
  L.push(sp(m.mv[b.move]));
  m.need.forEach(([any, ok, no]) => L.push(any.some(has) ? ['ok', ok] : ['fail', no]));
  if (b.move === 'prop' && st.kg > 6) L.push(['fail', `রোবটের ওজন ${f1(st.kg)} কেজি। প্রপেলার ৬ কেজির বেশি তুলতে পারে না; হালকা কিছু বাছো।`]);
  const pw = b.power, bad = m.bad || {};
  if (!bad[pw]) {
    if (pw === 'plug') L.push(b.move === 'fixed' ? ['ok', 'দেয়ালের সকেট থেকে সারাদিন বিদ্যুৎ পেল।'] : ['warn', 'চলন্ত রোবটের পেছনে তার টানলে জড়িয়ে যায়, আর বেশি দূরে যাওয়া যায় না।']);
    else if (pw === 'rtg') L.push(['ok', 'পারমাণবিক ব্যাটারি বছরের পর বছর বিদ্যুৎ দেবে।']);
    else if (pw === 'solar' && m.sun) L.push(['ok', 'রোদে নিজেই চার্জ হয়ে টানা কাজ চালিয়ে গেল।']);
    else {
      if (pw === 'solar') L.push(['warn', 'এখানে রোদ নেই, তাই সৌর প্যানেল শুধু একটা ব্যাটারির মতো কাজ করল।']);
      if (m.long) L.push(['fail', 'কয়েক দিনেই ব্যাটারি শেষ! এই মিশন চলবে অনেক দিন; নিজে নিজে শক্তি বানাতে পারে এমন কিছু লাগবে।']);
      else if (st.run >= m.min) L.push(['ok', `ব্যাটারি চলবে প্রায় ${dur(st.run)}; মিশনে লাগবে ${dur(m.min)}।`]);
      else L.push(['fail', `মাত্র ${dur(st.run)} চলেই ব্যাটারি শেষ! মিশনে লাগবে ${dur(m.min)}। বড় ব্যাটারি দাও, বা কম বিদ্যুৎ খায় এমন জিনিস বাছো।`]);
    }
  }
  Object.entries(bad).forEach(([k, v]) => { if (has(k)) L.push(sp(v)); });
  (m.opt || []).forEach(([t, msg]) => { if (has(t)) L.push(['bonus', msg]); });
  L.push(st.cost > m.budget ? ['fail', `খরচ ${bn(st.cost)} কয়েন, কিন্তু বাজেট মাত্র ${bn(m.budget)}। কিছু দামি জিনিস বাদ দাও।`] : ['ok', `খরচ ${bn(st.cost)} কয়েন, বাজেটের মধ্যেই!`]);
  return L;
}

/* ----- drawing the robot from its parts ----- */
function sensorIcon(k, x) {
  const y = 46;
  if (k === 'cam') return `<rect x="${x - 9}" y="${y - 7}" width="18" height="12" rx="3" fill="${D}"/><circle cx="${x}" cy="${y - 1}" r="4" fill="#5be0ff"/>`;
  if (k === 'heat') return `<rect x="${x - 9}" y="${y - 7}" width="18" height="12" rx="3" fill="${D}"/><circle cx="${x}" cy="${y - 1}" r="4" fill="#ff5a3c"/>`;
  if (k === 'sonar') return `<rect x="${x - 11}" y="${y - 6}" width="22" height="10" rx="3" fill="#8a93b0"/><circle cx="${x - 5}" cy="${y - 1}" r="3.6" fill="${D}"/><circle cx="${x + 5}" cy="${y - 1}" r="3.6" fill="${D}"/>`;
  if (k === 'lidar') return `<rect x="${x - 8}" y="${y - 8}" width="16" height="12" rx="3" fill="${D}"/><ellipse cx="${x}" cy="${y - 8}" rx="8" ry="3" fill="#5be0ff"/>`;
  if (k === 'gps') return `<line x1="${x}" y1="${y + 4}" x2="${x}" y2="${y - 10}" stroke="${D}" stroke-width="3"/><path d="M${x - 8} ${y - 14} q8 8 16 0" fill="#fff" stroke="${D}" stroke-width="2"/>`;
  if (k === 'chem') return `<rect x="${x - 8}" y="${y - 6}" width="16" height="10" rx="2" fill="#2fa84f"/><path d="M${x - 5} ${y - 3}h10M${x - 5} ${y}h10" stroke="#fff" stroke-width="1.5"/>`;
  return '';
}
function botSvg() {
  const body = b.brain === 'ai' ? '#7a5cff' : '#ff5a3c';
  let back = '', base = '', front = '', top = '';
  if (b.power === 'plug') back += `<path d="M62 90 C40 96 24 124 -10 128" stroke="${D}" stroke-width="3" fill="none"/>`;
  if (b.power === 'rtg') back += `<rect x="40" y="62" width="20" height="30" rx="4" fill="#8a93b0"/>${[68, 75, 82].map(y => `<line x1="36" y1="${y}" x2="64" y2="${y}" stroke="${D}" stroke-width="2"/>`).join('')}<circle cx="50" cy="56" r="4" fill="#ffcd1f"/>`;
  if (b.power === 'solar') back += `<line x1="70" y1="56" x2="64" y2="30" stroke="${D}" stroke-width="3"/><g transform="rotate(-14 62 24)"><rect x="34" y="17" width="58" height="15" rx="2" fill="#2f5fd0" stroke="#cfe0ff" stroke-width="1.5"/><path d="M48 17v15M63 17v15M78 17v15M34 24.5h58" stroke="#cfe0ff" stroke-width=".8"/></g>`;
  if (b.tool === 'spray') back += `<rect x="42" y="52" width="20" height="30" rx="7" fill="#2fa84f"/><rect x="48" y="47" width="8" height="6" fill="${D}"/>`;
  if (b.tool === 'box') back += `<rect x="36" y="58" width="28" height="24" rx="2" fill="#c9905a" stroke="${D}" stroke-width="1.5"/><path d="M36 70h28M50 58v24" stroke="${D}" stroke-width="1"/>`;
  const m = b.move;
  if (m === 'wheel') base = [76, 124].map(x => `<circle cx="${x}" cy="104" r="15" fill="${D}"/><circle cx="${x}" cy="104" r="6" fill="#c9d1e3"/>`).join('');
  if (m === 'track') base = `<rect x="52" y="94" width="96" height="24" rx="12" fill="${D}"/>` + [64, 82, 100, 118, 136].map(x => `<circle cx="${x}" cy="106" r="6" fill="#8a93b0"/>`).join('');
  if (m === 'legs') base = [[66, -6], [84, 6], [116, -6], [134, 6]].map(([x, k]) => `<path d="M${x} 94 L${x + k} 108 L${x} 122" stroke="${D}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  if (m === 'prop') base = [[34, 42], [166, 42]].map(([x, y]) => `<line x1="100" y1="62" x2="${x}" y2="${y + 4}" stroke="${D}" stroke-width="5"/><rect x="${x - 3}" y="${y - 2}" width="6" height="8" fill="${D}"/><ellipse class="spin" cx="${x}" cy="${y - 3}" rx="26" ry="4" fill="#9fd3ff" opacity=".9"/>`).join('');
  if (m === 'hull') base = `<path d="M40 92 L160 92 L146 118 L54 118 Z" fill="#f2f4fa" stroke="${D}" stroke-width="2"/><path d="M47 104 L153 104" stroke="#ff5a3c" stroke-width="3"/>`;
  if (m === 'fixed') base = `<rect x="90" y="96" width="20" height="20" fill="${D}"/><rect x="66" y="114" width="68" height="9" rx="3" fill="${D}"/>`;
  if (m === 'thr') base = `<rect x="22" y="70" width="12" height="18" rx="3" fill="${D}"/><ellipse cx="20" cy="79" rx="3" ry="14" fill="#9fd3ff"/>`;
  const bodyEl = m === 'thr'
    ? `<ellipse cx="96" cy="79" rx="62" ry="22" fill="${body}"/><ellipse cx="96" cy="90" rx="56" ry="10" fill="#000" opacity=".15"/>`
    : `<rect x="58" y="54" width="84" height="44" rx="13" fill="${body}"/><rect x="58" y="84" width="84" height="14" rx="7" fill="#000" opacity=".15"/><rect x="66" y="58" width="36" height="6" rx="3" fill="#fff" opacity=".35"/>`;
  const face = `<rect x="74" y="64" width="52" height="18" rx="8" fill="${D}"/><circle cx="89" cy="73" r="4.5" fill="#5be0ff"/><circle cx="111" cy="73" r="4.5" fill="#5be0ff"/>`;
  const chip = b.brain === 'ai' ? `<rect x="91" y="85" width="18" height="10" rx="2" fill="#ffcd1f"/><text x="100" y="93" text-anchor="middle" font-size="8" font-weight="800" fill="${D}" font-family="sans-serif">AI</text>` : `<rect x="94" y="86" width="12" height="8" rx="2" fill="#ffcd1f"/>`;
  const batt = b.power === 'sbat' ? `<rect x="122" y="86" width="12" height="8" rx="2" fill="#fff"/><rect x="124" y="88" width="6" height="4" fill="#2fa84f"/>` : b.power === 'bbat' ? `<rect x="116" y="84" width="20" height="11" rx="2" fill="#fff"/><rect x="118" y="86" width="14" height="7" fill="#2fa84f"/>` : '';
  const xs = [80, 100, 120];
  top = b.sense.filter(k => k !== 'bump').map((k, i) => sensorIcon(k, xs[i])).join('');
  if (b.sense.includes('bump')) front += `<rect x="141" y="62" width="8" height="32" rx="4" fill="#ffcd1f" stroke="${D}" stroke-width="1.5"/>`;
  if (b.tool === 'grip') front += `<path d="M140 72 L162 60 L176 72" stroke="#8a93b0" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="162" cy="60" r="5" fill="${D}"/><path d="M176 72 l8 -6 M176 72 l9 5" stroke="${D}" stroke-width="4" stroke-linecap="round"/>`;
  if (b.tool === 'vac') front += `<ellipse cx="100" cy="${m === 'prop' ? 104 : 100}" rx="28" ry="5" fill="#8a93b0"/>${[80, 90, 100, 110, 120].map(x => `<line x1="${x}" y1="${m === 'prop' ? 106 : 102}" x2="${x}" y2="${m === 'prop' ? 112 : 108}" stroke="${D}" stroke-width="2"/>`).join('')}`;
  if (b.tool === 'spray') front += `<path d="M140 88 L170 96" stroke="${D}" stroke-width="3"/>${[0, 1, 2, 3].map(i => `<circle cx="${174 + i * 5}" cy="${98 + (i % 2) * 5}" r="2" fill="#2fa84f"/>`).join('')}`;
  if (b.tool === 'hose') front += `<rect x="120" y="40" width="44" height="11" rx="4" fill="#c2410c" transform="rotate(-16 120 46)"/>${[0, 1, 2].map(i => `<circle cx="${170 + i * 7}" cy="${30 - i * 2}" r="${3 - i * .6}" fill="#22b5e8"/>`).join('')}`;
  if (b.tool === 'drill') front += `<rect x="128" y="96" width="10" height="8" fill="${D}"/><path d="M133 104 l-4 4 l8 4 l-8 4 l4 6" stroke="#8a93b0" stroke-width="3" fill="none"/>`;
  return `${back}${base}${bodyEl}${face}${chip}${batt}${top}${front}`;
}

/* ----- scenes ----- */
const sky = (a, c) => `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${c}"/></linearGradient></defs><rect width="600" height="260" fill="url(#sk)"/>`;
const waves = (y, col) => `<rect x="0" y="${y}" width="600" height="${260 - y}" fill="${col}"/><path d="M0 ${y} ${Array.from({ length: 16 }, (_, i) => `q${18.75} -7 37.5 0`).join(' ')}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>`;
const SC = {
  flood: () => sky('#9fd4f5', '#d9f0ff') + [[90, 120], [300, 100], [470, 130]].map(([x, h]) => `<rect x="${x}" y="${205 - h}" width="96" height="${h}" fill="#e9d3b0"/><path d="M${x - 10} ${205 - h} L${x + 48} ${165 - h} L${x + 106} ${205 - h} Z" fill="#b5523b"/><rect x="${x + 36}" y="${225 - h}" width="22" height="22" fill="#6b8bb0"/>`).join('') + `<circle cx="518" cy="${30}" r="7" fill="#5c3b28"/><rect x="512" y="37" width="12" height="18" rx="4" fill="#ff8a3d"/>` + waves(185, '#4c97c9'),
  mars: () => sky('#f6c08e', '#e48a55') + `<circle cx="500" cy="60" r="18" fill="#fff3d6" opacity=".7"/><path d="M0 170 Q120 120 250 160 T600 140 V260 H0Z" fill="#cf6a3c"/><rect x="0" y="205" width="600" height="55" fill="#b5502d"/>${[[120, 214, 22], [380, 222, 14], [520, 212, 26], [260, 230, 10]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .55}" fill="#8f3b20"/>`).join('')}`,
  paddy: () => sky('#bfe6ff', '#eaf7ff') + `<rect x="0" y="170" width="600" height="90" fill="#6b5a3e"/><path d="M470 170 v-44 h70 v44 Z" fill="#d9b47a"/><path d="M460 128 L505 96 L550 128 Z" fill="#8a6a3f"/>${Array.from({ length: 5 }, (_, r) => Array.from({ length: 24 }, (_, c) => `<path d="M${c * 26 + (r % 2) * 13} ${248 - r * 16} l-5 -14 M${c * 26 + (r % 2) * 13} ${248 - r * 16} l0 -16 M${c * 26 + (r % 2) * 13} ${248 - r * 16} l5 -14" stroke="#3fa34d" stroke-width="3" stroke-linecap="round"/>`).join('')).join('')}`,
  home: () => `<rect width="600" height="260" fill="#ffe7c7"/><rect x="60" y="40" width="110" height="80" rx="4" fill="#bfe6ff" stroke="#c9905a" stroke-width="6"/><rect x="0" y="205" width="600" height="55" fill="#d9a56b"/><rect x="360" y="150" width="200" height="56" rx="6" fill="#7a5cff"/><rect x="360" y="132" width="50" height="28" rx="8" fill="#fff"/><rect x="230" y="160" width="80" height="10" fill="#8a5a33"/><rect x="236" y="170" width="8" height="36" fill="#8a5a33"/><rect x="296" y="170" width="8" height="36" fill="#8a5a33"/>${[[110, 230], [200, 240], [330, 228], [450, 236]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#8a6a3f"/>`).join('')}`,
  factory: () => `<rect width="600" height="260" fill="#dfe4ec"/>${[0, 1, 2, 3].map(i => `<rect x="${40 + i * 150}" y="30" width="90" height="50" fill="#bfe6ff" stroke="#9aa3b5" stroke-width="4"/>`).join('')}<rect x="0" y="205" width="600" height="55" fill="#9aa3b5"/><rect x="280" y="160" width="320" height="16" rx="8" fill="#4b5470"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${300 + i * 60}" y="136" width="34" height="24" fill="#c9905a" stroke="#1d1b3a" stroke-width="1.5"/>`).join('')}<rect x="300" y="176" width="10" height="30" fill="#4b5470"/><rect x="580" y="176" width="10" height="30" fill="#4b5470"/>`,
  fire: () => `<rect width="600" height="260" fill="#2b2230"/><rect x="0" y="205" width="600" height="55" fill="#4a3a3a"/>${[[160, 210, 40, -12], [260, 214, 60, 8], [330, 206, 30, 20]].map(([x, y, w, r]) => `<rect x="${x}" y="${y - 8}" width="${w}" height="10" fill="#6b5a4a" transform="rotate(${r} ${x} ${y})"/>`).join('')}${[[460, 90], [520, 120], [400, 130]].map(([x, h]) => `<path d="M${x - 30} 205 Q${x - 34} ${205 - h * .6} ${x} ${205 - h} Q${x + 34} ${205 - h * .6} ${x + 30} 205 Z" fill="#ff7a1a"/><path d="M${x - 16} 205 Q${x - 18} ${205 - h * .35} ${x} ${205 - h * .6} Q${x + 18} ${205 - h * .35} ${x + 16} 205 Z" fill="#ffd23f"/>`).join('')}${[[120, 50, 40], [220, 40, 50], [340, 60, 46], [470, 30, 40], [560, 50, 36]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#6e6670" opacity=".55"/>`).join('')}`,
  river: () => sky('#cfe6f5', '#eef7ff') + `${[[20, 60], [80, 90], [150, 50], [400, 80], [470, 110], [540, 70]].map(([x, h]) => `<rect x="${x}" y="${170 - h}" width="56" height="${h}" fill="#8fa3b8"/>`).join('')}` + waves(170, '#3c7f8c') + `${[[180, 196, 20], [330, 214, 70], [420, 200, -30], [520, 228, 50], [260, 236, -60]].map(([x, y, r]) => `<rect x="${x}" y="${y}" width="22" height="9" rx="4" fill="#bfe9ff" stroke="#fff" stroke-width="1.5" transform="rotate(${r} ${x} ${y})"/>`).join('')}`,
  forest: () => sky('#cfeedd', '#eef9f2') + `<rect x="0" y="200" width="600" height="60" fill="#6b5a3e"/>${[60, 200, 340, 470, 570].map((x, i) => `<rect x="${x - 6}" y="${90 + (i % 2) * 20}" width="12" height="${110 - (i % 2) * 20}" fill="#5c4630"/><path d="M${x - 30} 205 q12 -26 30 -26 q18 0 30 26" fill="none" stroke="#5c4630" stroke-width="4"/><circle cx="${x}" cy="${86 + (i % 2) * 20}" r="40" fill="#2f7a3f"/><circle cx="${x - 26}" cy="${104 + (i % 2) * 20}" r="26" fill="#3d8f4c"/>`).join('')}${[214, 222, 230].map(x => `<line x1="${x * 2}" y1="200" x2="${x * 2}" y2="188" stroke="#5c4630" stroke-width="3"/>`).join('')}<g transform="translate(500 176)"><ellipse cx="0" cy="12" rx="34" ry="14" fill="#f08a24"/>${[-18, -6, 6, 18].map(x => `<path d="M${x} 0 q3 12 0 24" stroke="${D}" stroke-width="3" fill="none"/>`).join('')}<circle cx="32" cy="4" r="12" fill="#f08a24"/><circle cx="36" cy="1" r="2" fill="${D}"/></g>`
};

/* ----- UI ----- */
function stars(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }
function title() {
  const total = Object.values(best).reduce((s, v) => s + v, 0), max = M.length * 3;
  const rank = total >= max - 2 ? 'রোবট কিংবদন্তি' : total >= 15 ? 'মাস্টার বিল্ডার' : total >= 6 ? 'তরুণ প্রকৌশলী' : 'শিক্ষানবিশ';
  $('bRank').innerHTML = `মোট তারা <b>${bn(total)}/${bn(max)}</b> · তোমার পদবি: <b>${rank}</b>`;
}
function renderMissions() {
  $('missions').innerHTML = M.map((m, i) => `<button class="mcard" data-i="${i}" aria-pressed="${i === mi}"><b>${m.t}</b><span class="st">${best[m.id] ? stars(best[m.id]) : 'নতুন'}</span></button>`).join('');
  const m = M[mi];
  $('mT').textContent = m.t; $('mS').textContent = m.s;
  $('mNeed').innerHTML = `<span>বাজেট: <b>${bn(m.budget)} কয়েন</b></span><span>চলতে হবে: <b>${m.long ? 'অনেক দিন' : dur(m.min)}</b></span>`;
  $('scene').querySelector('#bg').innerHTML = SC[m.scene]();
  $('hintBox').hidden = true; $('hintBox').textContent = 'সাহায্য: ' + m.hint;
  title();
}
function renderShop() {
  $('shop').innerHTML = GROUPS.map(([g, h, max]) => `<div class="pg"><h3>${h}${max > 1 ? ` <small>(${bn(b.sense.length)}/${bn(max)} জায়গা ভরা)</small>` : ''}</h3><div class="pgrid">${Object.entries(P[g]).map(([k, p]) => {
    const on = g === 'sense' ? b.sense.includes(k) : b[g] === k;
    const meta = RB.lv > 1 ? `<i>${f1(p[2])} কেজি${p[3] ? ' · ' + bn(p[3]) + ' ওয়াট' : ''}</i>` : '';
    return `<button class="part" data-g="${g}" data-k="${k}" aria-pressed="${on}"><span class="pn">${p[0]}</span><span class="pc">${bn(p[1])} কয়েন</span><small>${p[4]}</small>${meta}</button>`;
  }).join('')}</div></div>`).join('');
}
function bar(label, val, frac, warn) { return `<div class="sr"><span>${label}</span><div class="sb"><i style="width:${Math.min(100, Math.max(3, frac * 100))}%;background:${warn ? '#ff5a3c' : '#2fa84f'}"></i></div><b>${val}</b></div>`; }
function renderStats() {
  const st = stats(), m = M[mi];
  const endless = b.power === 'plug' || b.power === 'rtg' || (b.power === 'solar' && m.sun);
  const runTxt = endless ? 'অফুরন্ত' : dur(st.run);
  const runOk = endless || (!m.long && st.run >= m.min);
  let h = bar('খরচ', `${bn(st.cost)}/${bn(m.budget)}`, st.cost / m.budget, st.cost > m.budget)
    + bar('ওজন', `${f1(st.kg)} কেজি`, st.kg / 20, b.move === 'prop' && st.kg > 6)
    + bar('চলবে', runTxt, endless ? 1 : Math.min(1, st.run / (m.long ? 99999 : m.min)), !runOk)
    + bar('গতি', ['স্থির', 'ধীর', 'ধীর', 'মাঝারি', 'দ্রুত', 'খুব দ্রুত'][P.move[b.move][5]], P.move[b.move][5] / 5, false);
  if (RB.lv === 3 && !endless) h += `<p class="calc">হিসাব: ব্যাটারি ${bn(st.cap)} ওয়াট-ঘণ্টা ÷ মোট বিদ্যুৎ খরচ ${bn(st.w)} ওয়াট = ${f1(st.cap / st.w)} ঘণ্টা</p>`;
  else if (RB.lv === 2) h += `<p class="calc">মোট বিদ্যুৎ খরচ: ${bn(st.w)} ওয়াট। যত বেশি ওয়াট, ব্যাটারি তত তাড়াতাড়ি ফুরায়।</p>`;
  $('stats').innerHTML = h;
}
const bot = $('bot');
function place() {
  const m = M[mi];
  bot.classList.remove('oops', 'win');
  bot.style.transition = 'none'; bot.style.left = '4%';
  bot.style.bottom = b.move === 'prop' ? '40%' : b.move === 'thr' ? '-2%' : (m.water && b.move === 'hull') ? '9%' : '12%';
}
function renderBot() { bot.innerHTML = botSvg(); }
function all() { renderMissions(); renderShop(); renderStats(); renderBot(); place(); $('result').innerHTML = ''; store.set('bot', b); store.set('mission', M[mi].id); }

let timers = [];
function run() {
  timers.forEach(clearTimeout); timers = [];
  const m = M[mi], L = evaluate(m);
  const fails = L.filter(x => x[0] === 'fail').length, warns = L.filter(x => x[0] === 'warn').length;
  const got = fails ? 0 : 3 - Math.min(2, warns);
  const name = ($('botName').value || 'রোবু').trim();
  $('result').innerHTML = `<ul class="log" id="log"></ul><div id="verdict"></div>`;
  place(); void bot.offsetWidth;
  bot.style.transition = reduce ? 'none' : 'left 2.6s ease-in-out';
  bot.style.left = fails ? '30%' : '62%';
  const step = reduce ? 0 : 330, ic = { ok: '✓', warn: '!', fail: '✗', bonus: '+' };
  L.forEach((x, i) => timers.push(setTimeout(() => { $('log').insertAdjacentHTML('beforeend', `<li class="${x[0]}"><span>${ic[x[0]]}</span>${x[1]}</li>`); }, step * (i + 1))));
  $('runBtn').disabled = true; $('runBtn2').disabled = true;
  timers.push(setTimeout(() => {
    $('runBtn').disabled = false; $('runBtn2').disabled = false;
    bot.classList.add(fails ? 'oops' : 'win');
    if (got > (best[m.id] || 0)) { best[m.id] = got; store.set('stars', best); }
    const real = (m.real || []).map(e => RB.ROB.find(r => r.e === e)).filter(Boolean);
    const nextI = (mi + 1) % M.length;
    $('verdict').innerHTML = fails
      ? `<div class="verdict lose"><b>${name} মিশনে আটকে গেল!</b><p>লাল ✗ চিহ্নগুলো ঠিক করে আবার চেষ্টা করো। ${bn(fails)}টা সমস্যা বাকি।</p></div>`
      : `<div class="verdict win"><span class="big">${stars(got)}</span><b>${name} মিশন জিতেছে!</b><p>${got < 3 ? 'হলুদ ! চিহ্নগুলো ঠিক করলে ৩ তারা পাবে।' : 'নিখুঁত রোবট! তুমি সত্যিকারের প্রকৌশলীর মতো ভেবেছ।'}</p>${real.length ? `<p class="real">এমন আসল রোবট দেখো: ${real.map(r => `<button class="chip" data-id="${r.id}">${r.n}</button>`).join(' ')}</p>` : ''}${got ? `<button class="btn" id="nextM" data-i="${nextI}">পরের মিশন: ${M[nextI].t} →</button>` : ''}</div>`;
    renderMissions();
  }, step * (L.length + 1) + (reduce ? 0 : 400)));
}

$('missions').addEventListener('click', e => { const c = e.target.closest('.mcard'); if (!c) return; mi = +c.dataset.i; all(); });
$('shop').addEventListener('click', e => {
  const c = e.target.closest('.part'); if (!c) return;
  const g = c.dataset.g, k = c.dataset.k;
  if (g === 'sense') {
    if (b.sense.includes(k)) b.sense = b.sense.filter(x => x !== k);
    else if (b.sense.length < 3) b.sense.push(k);
    else { $('shopMsg').textContent = 'সেন্সর বসানোর জায়গা মাত্র ৩টি! আগে একটা খুলে নাও।'; setTimeout(() => { $('shopMsg').textContent = ''; }, 2600); return; }
  } else b[g] = k;
  store.set('bot', b); renderShop(); renderStats(); renderBot(); place(); $('result').innerHTML = '';
});
$('runBtn').addEventListener('click', run);
$('runBtn2').addEventListener('click', () => { $('scene').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); run(); });
$('hintBtn').addEventListener('click', () => { $('hintBox').hidden = !$('hintBox').hidden; });
$('resetBtn').addEventListener('click', () => { b = { move: 'wheel', sense: [], tool: 'none', power: 'sbat', brain: 'micro' }; all(); });
$('result').addEventListener('click', e => {
  const c = e.target.closest('[data-id]'); if (c) return RB.openRobot(+c.dataset.id, RB.ROB);
  if (e.target.id === 'nextM') { mi = +e.target.dataset.i; all(); $('banao').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
});
try { $('botName').value = store.get('botName', 'রোবু'); } catch (e) {}
$('botName').addEventListener('input', e => store.set('botName', e.target.value));
RB.onLv.push(() => { renderShop(); renderStats(); });
all();
}
