window.RB = {};
{
const RB = window.RB;
const D = '#1d1b3a';
RB.bn = n => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
RB.store = {
  get(k, f) { try { const v = localStorage.getItem(k); return v === null ? f : JSON.parse(v); } catch (e) { return f; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
RB.CATS = {
  home: ['ঘরের রোবট', '#ff8a3d'], humanoid: ['হিউম্যানয়েড', '#7a5cff'], factory: ['কারখানা ও গুদাম', '#e09b00'],
  medical: ['চিকিৎসা', '#ff4f86'], space: ['মহাকাশ', '#3d5afe'], farm: ['কৃষি', '#2fa84f'],
  air: ['আকাশ ও ড্রোন', '#1ea7dc'], water: ['পানি ও সমুদ্র', '#0b93a6'], transport: ['চলাচল ও ডেলিভারি', '#e8432f'],
  rescue: ['উদ্ধার ও নিরাপত্তা', '#c2410c'], learn: ['শেখা ও খেলা', '#b545d6'], nature: ['প্রকৃতি থেকে শেখা', '#6aa312']
};
RB.ROB = (window.R || []).map((a, i) => ({ id: i, n: a[0], e: a[1], c: a[2], s: a[3], d: a[4], w: a[5], m: a[6], t: a[7] }));

const eye = (x, y, r = 5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x + .6}" cy="${y}" r="${r * .48}" fill="${D}"/>`;
const wh = (x, y, r = 13) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${D}"/><circle cx="${x}" cy="${y}" r="${r * .42}" fill="#c9d1e3"/>`;
const shine = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="#fff" opacity=".35"/>`;
const S = {
  disc: c => `<ellipse cx="100" cy="104" rx="62" ry="17" fill="${c}"/><ellipse cx="100" cy="104" rx="62" ry="17" fill="#000" opacity=".28"/><ellipse cx="100" cy="95" rx="62" ry="17" fill="${c}"/>${shine(62, 87, 50, 6)}<rect x="90" y="80" width="20" height="11" rx="5" fill="${D}"/><circle cx="100" cy="97" r="3" fill="#7dffb6"/>`,
  wheel: c => `<line x1="100" y1="46" x2="100" y2="30" stroke="${D}" stroke-width="3"/><circle cx="100" cy="28" r="4" fill="#ff5a3c"/><rect x="55" y="46" width="90" height="56" rx="14" fill="${c}"/><rect x="55" y="84" width="90" height="18" rx="9" fill="#000" opacity=".18"/>${shine(64, 51, 40, 6)}<rect x="68" y="58" width="64" height="26" rx="9" fill="${D}"/><circle cx="87" cy="71" r="5" fill="#5be0ff"/><circle cx="113" cy="71" r="5" fill="#5be0ff"/>${wh(74, 108, 14)}${wh(126, 108, 14)}`,
  rover: c => `<line x1="132" y1="62" x2="132" y2="34" stroke="${D}" stroke-width="4"/><rect x="122" y="24" width="24" height="14" rx="4" fill="${c}"/><circle cx="140" cy="31" r="3.5" fill="#5be0ff"/><path d="M52 70 L36 92 L30 88" stroke="${D}" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="46" y="60" width="108" height="22" rx="5" fill="${c}"/><rect x="46" y="74" width="108" height="8" rx="3" fill="#000" opacity=".2"/><path d="M58 100 L80 82 L100 100 M100 100 L120 82 L142 100" stroke="${D}" stroke-width="4" fill="none"/>${wh(58, 104, 12)}${wh(100, 104, 12)}${wh(142, 104, 12)}`,
  track: c => `<path d="M120 56 L150 32 L168 42" stroke="${c}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M166 36 l8 -6 M168 46 l9 2" stroke="${D}" stroke-width="4" stroke-linecap="round"/><rect x="52" y="52" width="96" height="38" rx="10" fill="${c}"/>${shine(60, 57, 46, 6)}<circle cx="76" cy="70" r="7" fill="${D}"/><circle cx="76" cy="70" r="3" fill="#5be0ff"/><rect x="40" y="88" width="120" height="26" rx="13" fill="${D}"/>${[56, 80, 104, 128, 144].map(x => `<circle cx="${x}" cy="101" r="6" fill="#8a93b0"/>`).join('')}`,
  dog: c => `${[[72, -6], [88, 6], [118, -6], [132, 6]].map(([x, k]) => `<path d="M${x} 78 L${x + k} 96 L${x} 116" stroke="${D}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}<rect x="58" y="52" width="86" height="30" rx="13" fill="${c}"/><rect x="58" y="70" width="86" height="12" rx="6" fill="#000" opacity=".2"/>${shine(66, 56, 44, 6)}<rect x="136" y="38" width="32" height="26" rx="9" fill="${c}"/><rect x="146" y="44" width="20" height="10" rx="5" fill="${D}"/><circle cx="160" cy="49" r="3" fill="#5be0ff"/>`,
  arm: c => `<rect x="58" y="110" width="64" height="14" rx="5" fill="${D}"/><rect x="70" y="98" width="40" height="14" rx="5" fill="${c}"/><line x1="90" y1="100" x2="112" y2="56" stroke="${c}" stroke-width="16" stroke-linecap="round"/><line x1="112" y1="56" x2="152" y2="46" stroke="${c}" stroke-width="12" stroke-linecap="round"/><circle cx="90" cy="100" r="9" fill="${D}"/><circle cx="112" cy="56" r="8" fill="${D}"/><path d="M154 46 L166 36 M154 46 L168 54" stroke="${D}" stroke-width="5" stroke-linecap="round"/>`,
  hum: c => `<line x1="78" y1="56" x2="62" y2="88" stroke="${c}" stroke-width="10" stroke-linecap="round"/><line x1="122" y1="56" x2="138" y2="88" stroke="${c}" stroke-width="10" stroke-linecap="round"/><rect x="83" y="88" width="14" height="32" rx="6" fill="${D}"/><rect x="103" y="88" width="14" height="32" rx="6" fill="${D}"/><rect x="76" y="48" width="48" height="44" rx="14" fill="${c}"/><rect x="76" y="78" width="48" height="14" rx="7" fill="#000" opacity=".2"/><circle cx="100" cy="64" r="5" fill="#5be0ff"/><rect x="94" y="40" width="12" height="10" fill="${D}"/><rect x="82" y="14" width="36" height="30" rx="12" fill="${c}"/>${shine(88, 17, 18, 5)}<rect x="87" y="24" width="26" height="12" rx="6" fill="${D}"/><circle cx="94" cy="30" r="3" fill="#5be0ff"/><circle cx="106" cy="30" r="3" fill="#5be0ff"/>`,
  cute: c => `<ellipse cx="100" cy="94" rx="32" ry="26" fill="${c}"/><ellipse cx="100" cy="106" rx="30" ry="12" fill="#000" opacity=".15"/>${wh(80, 118, 8)}${wh(120, 118, 8)}<circle cx="100" cy="52" r="26" fill="${c}"/>${shine(84, 32, 18, 6)}<rect x="80" y="40" width="40" height="24" rx="11" fill="${D}"/><path d="M88 54 q4 -6 8 0 M104 54 q4 -6 8 0" stroke="#5be0ff" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  car: c => `<rect x="94" y="40" width="12" height="9" rx="3" fill="${D}"/><rect x="66" y="48" width="70" height="30" rx="12" fill="${c}"/><rect x="74" y="54" width="54" height="16" rx="6" fill="${D}"/><rect x="38" y="70" width="124" height="30" rx="13" fill="${c}"/><rect x="38" y="88" width="124" height="12" rx="6" fill="#000" opacity=".2"/>${shine(48, 74, 50, 6)}<circle cx="156" cy="80" r="4" fill="#fff3a1"/>${wh(70, 102)}${wh(130, 102)}`,
  drone: c => `${[[48, 52], [152, 52], [70, 40], [130, 40]].map(([x, y]) => `<line x1="100" y1="66" x2="${x}" y2="${y}" stroke="${D}" stroke-width="5"/><ellipse cx="${x}" cy="${y - 4}" rx="22" ry="4" fill="${c}" opacity=".85"/><rect x="${x - 3}" y="${y - 5}" width="6" height="8" fill="${D}"/>`).join('')}<rect x="80" y="58" width="40" height="22" rx="9" fill="${c}"/>${shine(86, 61, 18, 5)}<circle cx="100" cy="86" r="7" fill="${D}"/><circle cx="100" cy="86" r="3" fill="#5be0ff"/>`,
  plane: c => `<path d="M92 72 L70 30 L86 30 L118 72 Z" fill="${c}"/><path d="M92 76 L76 108 L90 108 L114 76 Z" fill="${c}"/><path d="M92 76 L76 108 L90 108 L114 76 Z" fill="#000" opacity=".2"/><ellipse cx="100" cy="74" rx="60" ry="11" fill="${c}"/>${shine(70, 66, 50, 5)}<path d="M42 72 L32 54 L44 54 L54 70 Z" fill="${c}"/><circle cx="148" cy="72" r="4" fill="${D}"/><ellipse cx="162" cy="74" rx="3" ry="16" fill="${D}" opacity=".7"/>`,
  sat: c => `<line x1="100" y1="80" x2="170" y2="108" stroke="${D}" stroke-width="3"/><rect x="26" y="66" width="44" height="18" fill="#3d5afe"/><rect x="130" y="66" width="44" height="18" fill="#3d5afe"/><line x1="70" y1="75" x2="130" y2="75" stroke="${D}" stroke-width="3"/><rect x="86" y="64" width="28" height="30" rx="3" fill="${c}"/><path d="M62 58 Q100 18 138 58 Z" fill="#f2f4fa"/><path d="M62 58 Q100 40 138 58 Z" fill="#000" opacity=".12"/><line x1="100" y1="44" x2="100" y2="64" stroke="${D}" stroke-width="3"/>`,
  sub: c => `<path d="M150 70 L186 54 L186 92 Z" fill="#fff3a1" opacity=".45"/><rect x="88" y="40" width="26" height="22" rx="6" fill="${c}"/><ellipse cx="100" cy="76" rx="58" ry="21" fill="${c}"/><ellipse cx="100" cy="86" rx="54" ry="10" fill="#000" opacity=".18"/>${shine(68, 62, 48, 6)}<circle cx="120" cy="74" r="8" fill="${D}"/><circle cx="120" cy="74" r="4" fill="#5be0ff"/><circle cx="92" cy="76" r="5" fill="${D}"/><rect x="34" y="64" width="8" height="26" rx="3" fill="${D}"/>`,
  boat: c => `<path d="M100 22 L100 80 L140 80 Z" fill="#f2f4fa"/><path d="M96 34 L96 80 L68 80 Z" fill="#f2f4fa" opacity=".8"/><line x1="98" y1="20" x2="98" y2="84" stroke="${D}" stroke-width="3"/><path d="M38 84 L162 84 L148 106 L52 106 Z" fill="${c}"/><path d="M45 96 L155 96 L148 106 L52 106 Z" fill="#000" opacity=".2"/><path d="M24 116 q12 -8 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" stroke="#1ea7dc" stroke-width="4" fill="none"/>`,
  fish: c => `<path d="M58 72 L28 50 L34 72 L28 94 Z" fill="${c}"/><ellipse cx="100" cy="72" rx="46" ry="24" fill="${c}"/><ellipse cx="100" cy="82" rx="40" ry="11" fill="#000" opacity=".15"/>${shine(80, 54, 36, 6)}<path d="M96 50 L110 34 L118 52 Z" fill="${c}"/>${eye(128, 66, 6)}<path d="M84 60 q-6 12 0 24" stroke="${D}" stroke-width="3" fill="none" opacity=".5"/>`,
  snake: c => `${Array.from({ length: 10 }, (_, i) => { const x = 36 + i * 13, y = 80 + Math.sin(i * .9) * 16; return `<circle cx="${x}" cy="${y}" r="11" fill="${c}"/><circle cx="${x}" cy="${y}" r="11" fill="#000" opacity="${i % 2 ? .18 : 0}"/>`; }).join('')}<circle cx="164" cy="66" r="14" fill="${c}"/>${eye(168, 62, 5)}<circle cx="176" cy="70" r="3" fill="#5be0ff"/>`,
  bug: c => `${[60, 84, 108].map(x => `<path d="M${x + 14} 80 L${x} 104 M${x + 14} 76 L${x} 52" stroke="${D}" stroke-width="4" stroke-linecap="round"/>`).join('')}<ellipse cx="84" cy="60" rx="26" ry="10" fill="#fff" opacity=".55" transform="rotate(-20 84 60)"/><ellipse cx="96" cy="78" rx="38" ry="18" fill="${c}"/>${shine(74, 64, 34, 6)}<circle cx="140" cy="74" r="14" fill="${c}"/>${eye(144, 70, 5)}`,
  soft: c => `${[56, 76, 96, 116, 136].map((x, i) => `<path d="M${x + 4} 74 q${i % 2 ? 10 : -10} 22 ${i % 2 ? -4 : 4} 40" stroke="${c}" stroke-width="11" fill="none" stroke-linecap="round"/>`).join('')}<ellipse cx="100" cy="56" rx="38" ry="32" fill="${c}"/>${shine(78, 32, 24, 7)}${eye(88, 56, 6)}${eye(112, 56, 6)}`
};
RB.pic = (shape, col) => `<rect width="200" height="140" fill="${col}" opacity=".13"/><circle cx="100" cy="70" r="60" fill="${col}" opacity=".16"/><ellipse cx="100" cy="124" rx="62" ry="7" fill="#000" opacity=".13"/>${(S[shape] || S.cute)(col)}`;

/* ----- reading level ----- */
RB.lv = RB.store.get('lv', 1);
RB.onLv = [];
const lvBtns = document.querySelectorAll('.lv');
function setLv(v) {
  RB.lv = v; RB.store.set('lv', v);
  lvBtns.forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.lv === v)));
  RB.onLv.forEach(f => f());
}
lvBtns.forEach(b => b.addEventListener('click', () => setLv(+b.dataset.lv)));

/* ----- body explorer ----- */
const PARTS = {
  sensor: ['সেন্সর', 'চোখ-কান', 'আমাদের শরীরে: চোখ, কান, নাক আর ত্বক।', [
    'সেন্সর হলো রোবটের চোখ-কান। ক্যামেরা দিয়ে দেখে, মাইক্রোফোন দিয়ে শোনে, আর স্পর্শ সেন্সর দিয়ে বোঝে কিছু গায়ে লাগল কি না।',
    'সেন্সর চারপাশের আলো, শব্দ, দূরত্ব বা তাপকে বৈদ্যুতিক সংকেতে বদলে দেয়। আল্ট্রাসনিক সেন্সর শব্দ ছুড়ে প্রতিধ্বনি শুনে দূরত্ব মাপে, বাদুড় যেমন করে।',
    'সেন্সর অ্যানালগ বা ডিজিটাল সংকেত দেয়; ADC অ্যানালগ সংকেতকে সংখ্যায় বদলায়। আসল রোবটে ক্যামেরা, LiDAR, IMU আর এনকোডারের তথ্য মেলানো হয় (সেন্সর ফিউশন), কারণ একা কোনো সেন্সর পুরো নির্ভুল নয়। নয়েজ কমাতে কালম্যান ফিল্টারের মতো পদ্ধতি লাগে।']],
  brain: ['মস্তিষ্ক', 'চিন্তা', 'আমাদের শরীরে: মস্তিষ্ক আর স্নায়ু।', [
    'মস্তিষ্ক হলো ছোট্ট একটা কম্পিউটার। সেন্সর যা জানায় তা শুনে ঠিক করে এখন কী করতে হবে।',
    'রোবটের মস্তিষ্ককে মাইক্রোকন্ট্রোলার বলে, যেমন আরডুইনো বা ESP32। আমরা কোড লিখে নিয়ম দিই: “যদি সামনে বাধা থাকে, তাহলে ঘোরো।” সে সেকেন্ডে হাজার বার এই নিয়ম পরীক্ষা করে।',
    'ছোট রোবটে মাইক্রোকন্ট্রোলার মোটর আর সেন্সর সামলায়; বড় রোবটে সাথে থাকে Raspberry Pi বা GPU-ওয়ালা কম্পিউটার, যা ক্যামেরার ছবিতে AI চালায়। অনেক রোবট ROS 2 সফটওয়্যারে চলে, যেখানে আলাদা প্রোগ্রাম (নোড) বার্তা পাঠিয়ে একে অপরের সাথে কথা বলে।']],
  arm: ['হাত ও মোটর', 'কাজ', 'আমাদের শরীরে: হাত, পেশি আর হাড়ের জোড়া।', [
    'হাত দিয়ে রোবট জিনিস ধরে, তোলে, রাখে। প্রতিটা জোড়ায় একটা মোটর থাকে, যা আমাদের পেশির মতো টানে।',
    'যে অংশ নড়াচড়া তৈরি করে তাকে অ্যাকচুয়েটর বলে। সার্ভো মোটর বলে দেওয়া কোণে ঘুরে থেমে যায়, তাই রোবট হাতের জন্য ভালো। হাতের মাথার আঁকশিকে গ্রিপার বলে।',
    'বাহু কত দিকে স্বাধীনভাবে নড়তে পারে তাকে ডিগ্রি অব ফ্রিডম (DOF) বলে; কারখানার বাহুতে সাধারণত ৬টি। জোড়ার কোণ থেকে হাতের অবস্থান বের করা ফরওয়ার্ড কাইনেমেটিক্স; নির্দিষ্ট জায়গায় পৌঁছাতে কোন জোড়া কত ঘুরবে তা বের করা ইনভার্স কাইনেমেটিক্স।']],
  move: ['চাকা ও চলাচল', 'চলা', 'আমাদের শরীরে: পা। রিকশার চেইন যেমন প্যাডেলের শক্তি চাকায় নেয়, মোটরের শক্তিও তেমন চাকায় যায়।', [
    'চাকা দিয়ে রোবট এদিক-ওদিক যায়। কোনো রোবটের চাকা থাকে, কারও পা, আবার কারও পাখা।',
    'দুই চাকার রোবট বাঁক নেয় এক চাকা জোরে আর অন্যটা আস্তে ঘুরিয়ে (ডিফারেনশিয়াল ড্রাইভ)। গিয়ার মোটরের গতি কমিয়ে জোর বাড়ায়, সাইকেলের গিয়ারের মতো।',
    'চাকার এনকোডার ঘূর্ণন গুনে রোবট কত দূর গেল আন্দাজ করে (ওডোমেট্রি), কিন্তু চাকা পিছলালে ভুল জমে। তাই LiDAR বা ক্যামেরা দিয়ে ম্যাপে নিজের জায়গা ঠিক করে নেয় (লোকালাইজেশন)। গতি ঠিক রাখতে PID নিয়ন্ত্রণ লাগে।']],
  power: ['ব্যাটারি', 'শক্তি', 'আমাদের শরীরে: খাবার, যা আমাদের শক্তি দেয়।', [
    'ব্যাটারি রোবটকে শক্তি দেয়, যেমন খাবার আমাদের শক্তি দেয়। চার্জ শেষ হলে রোবট থেমে যায়।',
    'বেশিরভাগ রোবট মোবাইল ফোনের মতো লিথিয়াম ব্যাটারিতে চলে। মোটর সবচেয়ে বেশি বিদ্যুৎ খায়। অনেক রোবট চার্জ কমলে নিজেই চার্জারে ফিরে যায়।',
    'শক্তি (ওয়াট-ঘণ্টা) = ভোল্টেজ × অ্যাম্পিয়ার-ঘণ্টা। মোটর আর কম্পিউটারের আলাদা ভোল্টেজ লাগে, তাই ভোল্টেজ রেগুলেটর থাকে। মহাকাশে সৌর প্যানেল বা পারমাণবিক RTG ব্যবহার হয়।']],
  antenna: ['অ্যান্টেনা', 'যোগাযোগ', 'আমাদের শরীরে: মুখে কথা বলা আর কানে শোনা।', [
    'অ্যান্টেনা দিয়ে রোবট দূরের মানুষ বা অন্য রোবটের সাথে কথা বলে, যেমন রিমোট কন্ট্রোল গাড়ি।',
    'রোবট ওয়াই-ফাই, ব্লুটুথ বা রেডিও তরঙ্গে তথ্য পাঠায়। ড্রোনের ভিডিও এভাবেই চালকের ফোনে আসে।',
    'দূরত্ব বাড়লে সংকেত দেরিতে পৌঁছায় (ল্যাটেন্সি)। মঙ্গলে সংকেত যেতে কয়েক মিনিট লাগে, তাই রোভারকে অনেক সিদ্ধান্ত নিজেই নিতে হয়। এজন্যই স্বয়ংক্রিয়তা (অটোনমি) দরকার।']]
};
const M = '#e3e9f4', M2 = '#b9c4d8';
const stage = document.getElementById('stage');
stage.innerHTML = `<svg viewBox="0 0 420 440" preserveAspectRatio="xMidYMid meet" role="img" aria-label="অংশ চেনার রোবট">
<style>.spin{transform-box:fill-box;transform-origin:center}.part.on .spin{animation:spin 1.4s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.wave{opacity:0}.part.on .wave{animation:wave 1.6s ease-out infinite}@keyframes wave{0%{opacity:.9;r:12}100%{opacity:0;r:44}}</style>
<ellipse cx="210" cy="414" rx="150" ry="14" fill="#000" opacity=".14"/>
<g class="part" data-p="antenna"><rect class="hl" x="180" y="6" width="60" height="76" rx="26" fill="transparent" stroke="transparent"/><circle class="wave" cx="210" cy="32" r="12" fill="none" stroke="#ff5a3c" stroke-width="3"/><line x1="210" y1="40" x2="210" y2="80" stroke="${D}" stroke-width="7" stroke-linecap="round"/><circle cx="210" cy="32" r="12" fill="#ff5a3c"/><circle cx="206" cy="28" r="4" fill="#fff" opacity=".6"/></g>
<g class="part" data-p="arm"><rect class="hl" x="40" y="186" width="96" height="152" rx="30" fill="transparent" stroke="transparent"/><rect class="hl" x="284" y="186" width="96" height="152" rx="30" fill="transparent" stroke="transparent"/>
${[[1, 118, 74, 84], [-1, 302, 346, 336]].map(([k, sx, ex, hx]) => `<line x1="${sx}" y1="206" x2="${ex}" y2="262" stroke="${M}" stroke-width="24" stroke-linecap="round"/><line x1="${sx}" y1="214" x2="${ex}" y2="270" stroke="${M2}" stroke-width="6" stroke-linecap="round"/><line x1="${ex}" y1="262" x2="${hx}" y2="312" stroke="${M}" stroke-width="20" stroke-linecap="round"/><circle cx="${sx}" cy="206" r="17" fill="${D}"/><circle cx="${ex}" cy="262" r="13" fill="${D}"/><circle cx="${ex}" cy="262" r="5" fill="#5be0ff"/><path d="M${hx} 314 l${-12 * k} 18 M${hx} 314 l${12 * k} 16" stroke="${D}" stroke-width="7" stroke-linecap="round"/>`).join('')}</g>
<g class="part" data-p="move"><rect class="hl" x="116" y="334" width="188" height="80" rx="26" fill="transparent" stroke="transparent"/><rect x="140" y="332" width="140" height="30" rx="10" fill="${D}"/>${[160, 260].map(x => `<circle cx="${x}" cy="378" r="31" fill="${D}"/><g class="spin"><circle cx="${x}" cy="378" r="19" fill="#8a93b0"/><path d="M${x - 17} 378 H${x + 17} M${x} 361 V395" stroke="${D}" stroke-width="5"/></g><circle cx="${x}" cy="378" r="6" fill="#ffcd1f"/>`).join('')}</g>
<rect x="194" y="166" width="32" height="22" fill="${D}"/>
<rect x="118" y="184" width="184" height="152" rx="34" fill="#ff5a3c"/><rect x="118" y="300" width="184" height="36" rx="18" fill="#000" opacity=".16"/><rect x="132" y="192" width="60" height="9" rx="4.5" fill="#fff" opacity=".35"/>
<g class="part" data-p="brain"><rect class="hl" x="140" y="196" width="140" height="82" rx="18" fill="transparent" stroke="transparent"/><rect x="150" y="204" width="120" height="64" rx="14" fill="${D}"/><rect x="196" y="222" width="28" height="28" rx="4" fill="#5be0ff"/><path d="M196 230 H164 M196 242 H172 V258 M224 230 H256 M224 242 H248 V214 M210 222 V212" stroke="#5be0ff" stroke-width="3" fill="none"/><circle cx="164" cy="230" r="3.5" fill="#ffcd1f"/><circle cx="256" cy="230" r="3.5" fill="#ffcd1f"/><circle cx="172" cy="258" r="3.5" fill="#ffcd1f"/></g>
<g class="part" data-p="power"><rect class="hl" x="160" y="276" width="104" height="50" rx="14" fill="transparent" stroke="transparent"/><rect x="168" y="284" width="82" height="34" rx="8" fill="#fff"/><rect x="250" y="293" width="7" height="16" rx="2" fill="#fff"/>${[0, 1, 2, 3].map(i => `<rect x="${174 + i * 18}" y="290" width="14" height="22" rx="3" fill="${i < 3 ? '#2fa84f' : '#d6dbe6'}"/>`).join('')}</g>
<g class="part" data-p="sensor"><rect class="hl" x="122" y="70" width="176" height="108" rx="36" fill="transparent" stroke="transparent"/><rect x="128" y="104" width="16" height="36" rx="7" fill="#ffcd1f"/><rect x="276" y="104" width="16" height="36" rx="7" fill="#ffcd1f"/><rect x="140" y="78" width="140" height="92" rx="30" fill="${M}"/><rect x="140" y="140" width="140" height="30" rx="15" fill="${M2}"/><rect x="158" y="98" width="104" height="50" rx="20" fill="${D}"/><circle cx="186" cy="123" r="13" fill="#5be0ff"/><circle cx="234" cy="123" r="13" fill="#5be0ff"/><circle cx="181" cy="118" r="4" fill="#fff"/><circle cx="229" cy="118" r="4" fill="#fff"/></g>
</svg>`;
RB.setLv = setLv;
const chips = document.getElementById('partChips');
chips.innerHTML = Object.entries(PARTS).map(([k, v]) => `<button class="chip" data-p="${k}" aria-pressed="false">${v[0]}</button>`).join('');
let cur = 'sensor';
function showPart(k) {
  cur = k; const p = PARTS[k];
  stage.querySelectorAll('.part').forEach(g => g.classList.toggle('on', g.dataset.p === k));
  chips.querySelectorAll('.chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.p === k)));
  document.getElementById('pTag').textContent = 'কাজ: ' + p[1];
  document.getElementById('pTitle').textContent = p[0];
  document.getElementById('pText').textContent = p[3][RB.lv - 1];
  document.getElementById('pAnalogy').textContent = p[2];
}
stage.querySelectorAll('.part').forEach(g => g.addEventListener('click', () => showPart(g.dataset.p)));
chips.addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) showPart(b.dataset.p); });
RB.onLv.push(() => showPart(cur));
showPart(cur);
}
