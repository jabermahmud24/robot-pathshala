// ব্লক-কোডিং গোলকধাঁধা: লেভেল আর প্রোগ্রাম চালানোর ইঞ্জিন
// মানচিত্র: S শুরু, G লক্ষ্য (চার্জিং স্টেশন), B ব্যাটারি, # দেয়াল, . খোলা পথ। মানচিত্রের বাইরেও দেয়াল।
// দিক: 0 উত্তর (ওপরে), 1 পূর্ব (ডানে), 2 দক্ষিণ (নিচে), 3 পশ্চিম (বামে)
window.MZ = {};
{
const MZ = window.MZ;
MZ.L = [
  { t: 'প্রথম পা', map: ['S..G'], dir: 1, par: 3, blocks: ['fwd'],
    learn: 'রোবট ঠিক সেই কাজগুলোই করে যা তুমি বলো, একটার পর একটা। একে বলে ক্রম (sequence)। রোবটকে চার্জিং স্টেশনে পৌঁছে দাও!',
    sol: [{ t: 'fwd', n: 3 }] },
  { t: 'প্রথম বাঁক', map: ['S..', '##.', '##G'], dir: 1, par: 5, blocks: ['fwd', 'right', 'left'],
    learn: 'ঘোরা মানে জায়গা বদলানো নয়, শুধু মুখ ফেরানো। ডান-বাম ভাবো রোবটের চোখ দিয়ে, তোমার চোখ দিয়ে নয়!',
    sol: [{ t: 'fwd', n: 2 }, { t: 'right' }, { t: 'fwd', n: 2 }] },
  { t: 'আঁকাবাঁকা পথ', map: ['S.##', '#.B#', '##.G'], dir: 1, par: 9, blocks: ['fwd', 'right', 'left'],
    learn: 'আঁকাবাঁকা পথে ধাপে ধাপে ভাবো। পথের ব্যাটারি তুলে নিলে বাড়তি তারা পাবে!',
    sol: [{ t: 'fwd' }, { t: 'right' }, { t: 'fwd' }, { t: 'left' }, { t: 'fwd' }, { t: 'right' }, { t: 'fwd' }, { t: 'left' }, { t: 'fwd' }] },
  { t: 'সংখ্যার জাদু', map: ['S....B', '#####.', '#####.', 'G.B...'], dir: 1, par: 5, blocks: ['fwd', 'right', 'left'],
    learn: '“সামনে যাও” ব্লকের সংখ্যায় চাপ দিলে সংখ্যা বাড়ে। একটা ব্লকেই কয়েক ঘর যাওয়া যায়, তাই কোড ছোট হয়। ৫টা ব্লকে পারবে?',
    sol: [{ t: 'fwd', n: 5 }, { t: 'right' }, { t: 'fwd', n: 3 }, { t: 'right' }, { t: 'fwd', n: 5 }] },
  { t: 'লুপের প্রথম পাঠ', map: ['S.##', '#.B#', '##.B', '###G'], dir: 1, par: 5, blocks: ['fwd', 'right', 'left', 'rep'],
    learn: 'একই কাজ বারবার? “বারবার করো” ব্লক দাও। একে বলে লুপ (loop)। ভেতরের ব্লকগুলো যতবার বলবে, ততবার চলবে।',
    sol: [{ t: 'rep', n: 3, body: [{ t: 'fwd' }, { t: 'right' }, { t: 'fwd' }, { t: 'left' }] }] },
  { t: 'বর্গক্ষেত্রে ঘোরা', map: ['S...B', 'G###.', '.###.', '.###.', 'B...B'], dir: 1, par: 3, blocks: ['fwd', 'right', 'left', 'rep'],
    learn: 'চারটা সমান পাশ, চারটা বাঁক। পুরো চক্কর মাত্র ৩টা ব্লকে! লক্ষ্যে পা রাখলেই রোবট থেমে যায়।',
    sol: [{ t: 'rep', n: 4, body: [{ t: 'fwd', n: 4 }, { t: 'right' }] }] },
  { t: 'ঘাস কাটার রোবট', map: ['S.B..', '.B...', '...B.', 'G.B..'], dir: 1, par: 9, blocks: ['fwd', 'right', 'left', 'rep'],
    learn: 'রোবট লন মোয়ারের মতো সারি ধরে মাঠ ঘোরো: ডানে যাও, নামো, বামে যাও, নামো... এই নকশাটা লুপে ভরে দাও।',
    sol: [{ t: 'rep', n: 2, body: [{ t: 'fwd', n: 4 }, { t: 'right' }, { t: 'fwd' }, { t: 'right' }, { t: 'fwd', n: 4 }, { t: 'left' }, { t: 'fwd' }, { t: 'left' }] }] },
  { t: 'রোবট নিজে ভাবে', map: ['S..B..', '#####.', '...G#.', '.####.', '..B...'], dir: 1, par: 4, blocks: ['fwd', 'right', 'left', 'rep', 'while', 'if'],
    learn: 'এবার রোবট নিজে সিদ্ধান্ত নেবে! “যদি সামনে দেয়াল” ব্লক সেন্সর দিয়ে পরীক্ষা করে। সেটা “লক্ষ্যে না পৌঁছানো পর্যন্ত” লুপে রাখো, তাহলে যেকোনো প্যাঁচানো পথ চলবে।',
    sol: [{ t: 'while', body: [{ t: 'if', c: 'wall', then: [{ t: 'right' }], else: [{ t: 'fwd' }] }] }] },
  { t: 'ডানে না বামে?', map: ['S..###', '##.###', '##.B.#', '####.G'], dir: 1, par: 6, blocks: ['fwd', 'right', 'left', 'rep', 'while', 'if'],
    learn: 'কখনো ডানে, কখনো বামে বাঁক। “যদি” ব্লকের শর্তে চাপ দিলে শর্ত বদলায়। আর একটা “যদি”-এর ভেতরে আরেকটা “যদি” রাখা যায়!',
    sol: [{ t: 'while', body: [{ t: 'if', c: 'wall', then: [{ t: 'if', c: 'ropen', then: [{ t: 'right' }], else: [{ t: 'left' }] }], else: [{ t: 'fwd' }] }] }] },
  { t: 'আসল গোলকধাঁধা', map: ['S.#...', '#.#.#.', '#...#.', '###.#.', 'B...#.', '##.#.G'], dir: 1, par: 7, blocks: ['fwd', 'right', 'left', 'rep', 'while', 'if'],
    learn: 'আসল গোলকধাঁধা! গোপন কৌশল: সবসময় ডান হাত দেয়ালে রেখে হাঁটো। ডানে খোলা থাকলে ডানে ঘোরো; নাহলে সামনে দেয়াল থাকলে বামে ঘোরো; নাহলে সামনে যাও।',
    sol: [{ t: 'while', body: [{ t: 'if', c: 'ropen', then: [{ t: 'right' }, { t: 'fwd' }], else: [{ t: 'if', c: 'wall', then: [{ t: 'left' }], else: [{ t: 'fwd' }] }] }] }] }
];
MZ.COND = { wall: 'সামনে দেয়াল', ropen: 'ডানে খোলা পথ', lopen: 'বামে খোলা পথ' };
if (window.LANG === 'en' && window.ENC) { MZ.COND = ENC.cond; MZ.L.forEach((l, i) => { l.t = ENC.maze[i][0]; l.learn = ENC.maze[i][1]; }); }
const DR = [[-1, 0], [0, 1], [1, 0], [0, -1]];
MZ.parse = lv => {
  const g = lv.map.map(r => r.split('')); let s = null, goal = null; const bat = [];
  g.forEach((row, y) => row.forEach((c, x) => { if (c === 'S') s = [y, x]; if (c === 'G') goal = [y, x]; if (c === 'B') bat.push(y + ',' + x); }));
  return { g, rows: g.length, cols: g[0].length, s, goal, bat };
};
MZ.wall = (P, y, x) => y < 0 || x < 0 || y >= P.rows || x >= P.cols || P.g[y][x] === '#';
MZ.count = list => list.reduce((n, b) => n + 1 + (b.body ? MZ.count(b.body) : 0) + (b.then ? MZ.count(b.then) + MZ.count(b.else) : 0), 0);
// প্রোগ্রাম চালায়; প্রতিটা কাজের পর একটা ধাপ দেয়
MZ.run = function* (lv, prog) {
  const P = MZ.parse(lv);
  const st = { y: P.s[0], x: P.s[1], d: lv.dir, got: new Set(), steps: 0, done: false, crash: false, loop: false };
  const at = (y, x) => y === P.goal[0] && x === P.goal[1];
  const cond = c => {
    const d = c === 'wall' ? st.d : c === 'ropen' ? (st.d + 1) % 4 : (st.d + 3) % 4;
    const blocked = MZ.wall(P, st.y + DR[d][0], st.x + DR[d][1]);
    return c === 'wall' ? blocked : !blocked;
  };
  let guard = 0;
  function* ex(list) {
    for (const b of list) {
      if (st.done || st.crash || st.loop) return;
      if (++guard > 3000) { st.loop = true; return; }
      if (b.t === 'fwd') {
        for (let i = 0; i < (b.n || 1); i++) {
          const ny = st.y + DR[st.d][0], nx = st.x + DR[st.d][1];
          if (MZ.wall(P, ny, nx)) { st.crash = true; yield { b, st, kind: 'crash' }; return; }
          st.y = ny; st.x = nx; st.steps++;
          if (P.g[ny][nx] === 'B') st.got.add(ny + ',' + nx);
          if (at(ny, nx)) st.done = true;
          yield { b, st, kind: 'move' };
          if (st.done) return;
          if (st.steps > 400) { st.loop = true; return; }
        }
      } else if (b.t === 'right' || b.t === 'left') {
        st.d = (st.d + (b.t === 'right' ? 1 : 3)) % 4; st.steps++;
        yield { b, st, kind: 'turn' };
        if (st.steps > 400) { st.loop = true; return; }
      } else if (b.t === 'rep') {
        for (let i = 0; i < (b.n || 2); i++) yield* ex(b.body);
      } else if (b.t === 'while') {
        let spins = 0;
        while (!st.done && !st.crash && !st.loop) {
          const before = st.steps; yield* ex(b.body);
          if (st.steps === before && ++spins > 3) { st.loop = true; return; }
        }
      } else if (b.t === 'if') {
        yield* ex(cond(b.c) ? b.then : b.else);
      }
    }
  }
  yield* ex(prog);
  return st;
};
MZ.result = (lv, prog) => { const it = MZ.run(lv, prog); let r, last = null; while (!(r = it.next()).done) last = r.value; const st = r.value || (last && last.st); return { st, P: MZ.parse(lv) }; };
MZ.stars = (lv, prog, st, P) => st.done ? 1 + (st.got.size === P.bat.length ? 1 : 0) + (MZ.count(prog) <= lv.par ? 1 : 0) : 0;
}
