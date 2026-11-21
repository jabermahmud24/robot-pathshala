{
const RB = window.RB, bn = RB.bn, store = RB.store;
const $ = id => document.getElementById(id);
const D = '#1d1b3a';
// রোবু: সাইটের মাসকট
RB.robu = (mood = 'happy') => {
  const mouth = mood === 'wow' ? `<ellipse cx="100" cy="122" rx="9" ry="8" fill="${D}"/>` : mood === 'think' ? `<path d="M88 124 h24" stroke="${D}" stroke-width="5" stroke-linecap="round"/>` : `<path d="M84 118 q16 14 32 0" fill="none" stroke="${D}" stroke-width="5" stroke-linecap="round"/>`;
  const eyes = mood === 'think' ? `<circle cx="84" cy="94" r="9" fill="#5be0ff"/><circle cx="116" cy="94" r="9" fill="#5be0ff"/><circle cx="88" cy="90" r="3" fill="#fff"/><circle cx="120" cy="90" r="3" fill="#fff"/>` : `<circle cx="84" cy="96" r="10" fill="#5be0ff"/><circle cx="116" cy="96" r="10" fill="#5be0ff"/><circle cx="80" cy="92" r="3.5" fill="#fff"/><circle cx="112" cy="92" r="3.5" fill="#fff"/>`;
  return `<ellipse cx="100" cy="196" rx="54" ry="7" fill="#000" opacity=".12"/><line x1="100" y1="44" x2="100" y2="62" stroke="${D}" stroke-width="6"/><circle cx="100" cy="38" r="10" fill="#ff5a3c"/><rect x="52" y="86" width="14" height="30" rx="6" fill="#ffcd1f"/><rect x="134" y="86" width="14" height="30" rx="6" fill="#ffcd1f"/><rect x="60" y="62" width="80" height="78" rx="24" fill="#ff5a3c"/><rect x="60" y="116" width="80" height="24" rx="12" fill="#000" opacity=".12"/><rect x="70" y="80" width="60" height="30" rx="14" fill="${D}"/>${eyes}${mouth}<rect x="76" y="144" width="48" height="34" rx="10" fill="#ff5a3c"/><rect x="88" y="152" width="24" height="12" rx="3" fill="#ffcd1f"/><circle cx="82" cy="186" r="10" fill="${D}"/><circle cx="118" cy="186" r="10" fill="${D}"/><path d="M76 154 L54 168 M124 154 L146 140" stroke="#c9d1e3" stroke-width="8" stroke-linecap="round"/>`;
};
// সব অগ্রগতি এক জায়গায়
RB.stat = () => {
  const p = RB.prog, missions = store.get('stars', {}), maze = store.get('maze', {});
  return {
    parts: ['sensor', 'brain', 'arm', 'move', 'power', 'antenna'].filter(k => p['part_' + k]).length,
    sim: !!p.sim, seen: (store.get('seen', []) || []).length,
    maze: i => (maze[i] || 0) > 0, mazeDone: Object.values(maze).filter(v => v > 0).length, mazeStars: Object.values(maze).reduce((s, v) => s + v, 0),
    mission: id => (missions[id] || 0) > 0, missionsDone: Object.values(missions).filter(v => v > 0).length, missionStars: Object.values(missions).reduce((s, v) => s + v, 0),
    quiz: p.quizBest || 0
  };
};
const CH = [
  { t: 'হ্যালো! আমি রোবু', mood: 'happy', say: ['হ্যালো বন্ধু! আমি রোবু, ঢাকার এক ছোট্ট রোবট।', 'আমাকে সবে বানানো হয়েছে, তাই নিজের শরীরের কিছুই চিনি না!', 'আমার শরীরের ৬টা অংশেই একবার করে চাপ দিয়ে চিনিয়ে দেবে?'],
    task: 'রোবটের ৬টা অংশ চেনো', go: '#ghor', prog: s => [s.parts, 6] },
  { t: 'রোবু ভাবতে শেখে', mood: 'think', say: ['ধন্যবাদ! এখন জানি আমার চোখ, মস্তিষ্ক আর চাকা আছে।', 'কিন্তু সামনে দেয়াল দেখলে থামব কীভাবে?', 'চলো “টের পাওয়া, ভাবা, কাজ করা” পরীক্ষাটা করে দেখি। দেয়ালটা সরিয়ে দেখো।'],
    task: 'দেয়াল সরিয়ে পরীক্ষা চালাও', go: '#chokro', prog: s => [s.sim ? 1 : 0, 1] },
  { t: 'নতুন বন্ধুরা', mood: 'wow', say: ['ওয়াও! পৃথিবীতে আমার মতো আরও কত রোবট!', 'কেউ মঙ্গলে পাথর খোঁড়ে, কেউ সাগরের নিচে সাঁতরায়, কেউ হাসপাতালে ওষুধ পৌঁছায়।', 'অন্তত ১০টা রোবটের সাথে পরিচয় করো, আর তাদের ভেতরটাও দেখো।'],
    task: '১০টা রোবটের কার্ড খোলো', go: '#robot', prog: s => [Math.min(s.seen, 10), 10] },
  { t: 'রোবু কোড শেখে', mood: 'think', say: ['জানো, আমাকে চালাতে হলে কোড লিখতে হয়।', 'কোড মানে রোবটের জন্য ধাপে ধাপে নির্দেশ।', 'ব্লক জুড়ে জুড়ে আমাকে চার্জিং স্টেশনে পৌঁছে দাও। প্রথম ৩টা লেভেল পার করো!'],
    task: 'কোডিংয়ের লেভেল ৩ শেষ করো', go: '#kod', prog: s => [[0, 1, 2].filter(s.maze).length, 3] },
  { t: 'সিলেটের বন্যা', mood: 'wow', say: ['জরুরি খবর! সিলেটে বন্যা, অনেক মানুষ ছাদে আটকে আছে।', 'আমি একা সবাইকে খুঁজে পাব না।', 'একটা উদ্ধারকারী রোবট বানাও, যে মানুষ খুঁজে লাইফ জ্যাকেট পৌঁছে দেবে!'],
    task: '“বন্যায় উদ্ধার” মিশন জেতো', go: '#banao', mission: 'flood', prog: s => [s.mission('flood') ? 1 : 0, 1] },
  { t: 'লুপের জাদু', mood: 'think', say: ['একই কাজ বারবার লিখতে লিখতে আমার হাত ব্যথা!', 'শুনেছি প্রোগ্রামারদের একটা জাদু আছে, নাম “লুপ”।', 'লুপ দিয়ে কোডিংয়ের লেভেল ৬ পর্যন্ত শেষ করো।'],
    task: 'কোডিংয়ের লেভেল ৬ শেষ করো', go: '#kod', prog: s => [[3, 4, 5].filter(s.maze).length, 3] },
  { t: 'ক্ষেতের বন্ধু', mood: 'happy', say: ['নানুর গ্রাম থেকে ফোন এসেছে: ধানে পোকা লেগেছে!', 'ওষুধ ছিটাতে হবে, কিন্তু একটা ধানগাছও মাড়ানো চলবে না।', 'কৃষকদের জন্য একটা রোবট বানাও।'],
    task: '“ধানক্ষেতে স্প্রে” মিশন জেতো', go: '#banao', mission: 'paddy', prog: s => [s.mission('paddy') ? 1 : 0, 1] },
  { t: 'রোবু নিজে ভাবে', mood: 'think', say: ['এতদিন তুমি আমাকে প্রতিটা পা বলে দিয়েছ।', 'এবার আমি নিজে সিদ্ধান্ত নিতে চাই: “যদি সামনে দেয়াল থাকে, তাহলে ঘুরব”।', 'আমাকে ভাবতে শেখাও, লেভেল ৮ পর্যন্ত শেষ করো!'],
    task: 'কোডিংয়ের লেভেল ৮ শেষ করো', go: '#kod', prog: s => [[6, 7].filter(s.maze).length, 2] },
  { t: 'সুন্দরবনের রহস্য', mood: 'wow', say: ['বন বিভাগ জানতে চায় সুন্দরবনে কয়টা রয়েল বেঙ্গল টাইগার আছে।', 'কিন্তু শর্ত একটাই: বাঘকে একটুও ভয় দেখানো যাবে না।', 'চুপচাপ বাঘ গুনতে পারে, এমন রোবট বানাতে পারবে?'],
    task: '“সুন্দরবনে বাঘ গোনা” মিশন জেতো', go: '#banao', mission: 'forest', prog: s => [s.mission('forest') ? 1 : 0, 1] },
  { t: 'রোবুর বড় স্বপ্ন', mood: 'happy', say: ['তুমি তো এখন সত্যিকারের রোবট প্রকৌশলী!', 'শেষ ধাপ: সব ৮টা মিশন জেতো, আর কুইজে অন্তত ৫টা ঠিক উত্তর দাও।', 'তারপর তোমার নাম লেখা সনদ তোমার!'],
    task: 'সব মিশন আর কুইজে ৫ পাও', go: '#sanad', prog: s => [Math.min(s.missionsDone, 8) + (s.quiz >= 5 ? 1 : 0), 9] }
];
const done = (c, s) => { const [a, b] = c.prog(s); return a >= b; };
let sel = null;
function render() {
  const s = RB.stat();
  let cur = CH.findIndex(c => !done(c, s)); const all = cur < 0; if (all) cur = CH.length - 1;
  if (sel === null || sel > cur) sel = cur;
  $('stPath').innerHTML = CH.map((c, i) => `<button class="stn ${done(c, s) ? 'ok' : ''} ${i === cur && !all ? 'cur' : ''}" data-i="${i}" aria-pressed="${i === sel}" ${i > cur ? 'disabled' : ''} aria-label="অধ্যায় ${bn(i + 1)}: ${c.t}"><b>${done(c, s) ? '✓' : bn(i + 1)}</b></button>`).join('<span class="stl"></span>');
  const c = CH[sel], [a, b] = c.prog(s), ok = a >= b;
  $('stPic').innerHTML = RB.robu(c.mood);
  $('stT').textContent = `অধ্যায় ${bn(sel + 1)}: ${c.t}`;
  $('stText').innerHTML = (all && sel === CH.length - 1 ? ['অভিনন্দন! আমরা একসাথে পুরো অভিযান শেষ করলাম।', 'বড় হয়ে তুমি হয়তো বাংলাদেশের জন্য এমন রোবট বানাবে, যা বন্যায় মানুষ বাঁচাবে বা কৃষকদের সাহায্য করবে।', 'নিচে তোমার সনদ অপেক্ষা করছে!'] : c.say).map(t => `<p>${t}</p>`).join('');
  $('stTask').innerHTML = `<span class="tk ${ok ? 'ok' : ''}">${ok ? '✓ কাজ শেষ' : 'কাজ'}: ${c.task}</span><span class="tp"><i style="width:${Math.round(a / b * 100)}%"></i></span><b>${bn(a)}/${bn(b)}</b>`;
  $('stGo').textContent = ok ? (sel < CH.length - 1 ? 'পরের অধ্যায় →' : 'সনদ দেখো →') : 'চলো যাই →';
  $('stGo').dataset.go = ok && sel < CH.length - 1 ? 'next' : (ok ? '#sanad' : c.go);
  $('stGo').dataset.mission = c.mission || '';
}
$('stPath').addEventListener('click', e => { const b = e.target.closest('.stn'); if (b && !b.disabled) { sel = +b.dataset.i; render(); } });
$('stGo').addEventListener('click', e => {
  const g = e.currentTarget.dataset.go;
  if (g === 'next') { sel++; render(); return; }
  const m = e.currentTarget.dataset.mission;
  if (m) { const card = [...document.querySelectorAll('.mcard')].find(c => window.BM[+c.dataset.i].id === m); if (card) card.click(); }
  const el = document.querySelector(g); if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});
document.addEventListener('rb:progress', render);
render();
}
