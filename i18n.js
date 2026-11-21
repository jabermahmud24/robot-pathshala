// ভাষা বদল: বাংলা (bn) আর English (en)। অগ্রগতি দুই ভাষাতেই একই থাকে।
{
let lang = 'bn';
try { lang = JSON.parse(localStorage.getItem('lang')) || 'bn'; } catch (e) {}
if (lang !== 'en') lang = 'bn';
window.LANG = lang;
window.L = (bn, en) => lang === 'en' ? en : bn;
document.documentElement.lang = lang;
// পাতার স্থির লেখা
const S = {
  'রোবট পাঠশালা': 'Robot Pathshala', 'গল্প': 'Story', 'আজকের প্রশ্ন': 'Daily question', 'রোবটের ভেতর': 'Inside a robot', '১০০ রোবট': '100 robots', 'কোডিং': 'Coding', 'মিশন': 'Missions', 'কুইজ': 'Quiz', 'সনদ': 'Certificate',
  'অ্যাপ হিসেবে নাও': 'Install app',
  'রোবট কীভাবে কাজ করে?': 'How does a robot work?',
  'নিচের রোবটের যেকোনো অংশে চাপ দাও। দেখবে প্রতিটা অংশ কী কাজ করে, আর আমাদের শরীরের কোন অংশের সাথে মেলে।': 'Tap any part of the robot below. You will see what each part does, and which part of our own body it is like.',
  'তোমার স্তর বেছে নাও': 'Choose your level',
  'ছোট্ট বিজ্ঞানী · ৭–১০': 'Little scientist · 7–10', 'তরুণ প্রকৌশলী · ১১–১৪': 'Young engineer · 11–14', 'রোবট বিশেষজ্ঞ · ১৫–১৮': 'Robot expert · 15–18',
  'রোবুর অভিযান': "Robu's adventure",
  'রোবুর সাথে ১০টা অধ্যায়ের অভিযানে চলো। প্রতিটা অধ্যায়ের কাজ শেষ করলে পরেরটা খুলে যাবে।': 'Join Robu on a 10-chapter adventure. Finish the task in each chapter to unlock the next one.',
  'চলো যাই →': "Let's go →",
  'প্রতিদিন একটা নতুন প্রশ্ন। প্রতিদিন উত্তর দিলে তোমার ধারা বাড়বে!': 'A new question every day. Answer every day to grow your streak!',
  'সব রোবট তিনটা কাজ বারবার করে': 'Every robot does three things, over and over',
  'টের পাওয়া, ভাবা, তারপর কাজ করা। দেয়ালটা সরিয়ে দেখো রোবট কখন থামে।': 'Sense, think, then act. Move the wall and watch when the robot stops.',
  '১. টের পাওয়া': '1. Sense', 'সেন্সর দূরত্ব মাপছে': 'The sensor measures distance', '২. ভাবা': '2. Think', 'মস্তিষ্ক নিয়ম মিলাচ্ছে': 'The brain checks its rule', '৩. কাজ করা': '3. Act', 'মোটর চাকা ঘোরাচ্ছে': 'The motors turn the wheels',
  'দেয়ালের দিকে চলা রোবট': 'A robot driving towards a wall', 'দেয়াল কত দূরে': 'How far is the wall', 'কত কাছে এলে থামবে': 'Stop when this close', 'আবার চালাও': 'Run again',
  'রোবটের মাথায় যে নিয়ম চলছে': "The rule running in the robot's head",
  '১০০টি রোবটের জগৎ': 'A world of 100 robots', 'রোবট খোঁজো… যেমন: ড্রোন, মঙ্গল': 'Search robots… e.g. drone, Mars', 'রোবট খোঁজো': 'Search robots',
  'কোড লিখে রোবট চালাও': 'Code a robot',
  'ব্লক জুড়ে প্রোগ্রাম বানাও, তারপর চালিয়ে দেখো রোবট চার্জিং স্টেশনে পৌঁছায় কি না। প্রতিটা লেভেলে নতুন কিছু শিখবে।': 'Snap blocks together into a program, then run it and see if the robot reaches the charging station. Every level teaches something new.',
  'গোলকধাঁধা': 'Maze', 'ব্লক': 'Blocks', 'চাপ দিলে প্রোগ্রামে যোগ হবে': 'tap to add to your program', 'তোমার প্রোগ্রাম': 'Your program',
  'চালাও ▶': 'Run ▶', 'রোবট শুরুতে ফেরাও': 'Back to start', 'সব মুছে ফেলো': 'Clear all',
  'রোবট বানাও, মিশন জেতো': 'Build a robot, win the mission',
  'একটা মিশন বেছে নাও, বাজেটের মধ্যে যন্ত্রাংশ কিনে রোবট বানাও, তারপর পরীক্ষা চালাও। রোবট সফল হবে, না আটকে যাবে?': 'Pick a mission, buy parts within your budget to build a robot, then test it. Will it succeed, or get stuck?',
  'তোমার রোবট': 'Your robot', 'রোবট তৈরি! মিশন শুরু করো': 'Robot ready! Start the mission', 'রোবটের নাম': "Robot's name", 'মিশন শুরু করো!': 'Start mission!', 'সাহায্য': 'Hint', 'নতুন করে বানাও': 'Start over',
  'কুইজ: কোন রোবট?': 'Quiz: which robot?', 'আবার খেলো': 'Play again',
  'তোমার সনদ': 'Your certificate',
  'সব ৮টা রোবট মিশন জিতলে তোমার নাম লেখা সনদ খুলে যাবে। ছবি হিসেবে রেখে দাও, বা প্রিন্ট করে বাবা-মা আর শিক্ষককে দেখাও!': 'Win all 8 robot missions to unlock a certificate with your name on it. Save it as a picture, or print it to show your parents and teachers!',
  'সনদে তোমার নাম': 'Your name on the certificate', 'যেমন: নুসরাত জাহান': 'e.g. Nusrat Jahan', 'সনদে নাম বসাও': 'Put my name on it', 'ছবি নামাও': 'Save picture', 'প্রিন্ট করো': 'Print', 'সনদপত্র': 'Certificate',
  'বাংলাদেশের ৭ থেকে ১৮ বছরের শিক্ষার্থীদের জন্য রোবটিক্স শেখার খেলাঘর। ছবিগুলো শেখানোর জন্য আঁকা নকশা, আসল রোবটের হুবহু ছবি নয়।': 'A robotics playground for students aged 7 to 18 in Bangladesh. The pictures are drawings made for learning, not exact copies of the real robots.',
  'রোবটের ভেতরের নীল নকশা': "Blueprint of the robot's insides", 'বাইরে': 'Outside', 'ভেতরে': 'Inside', 'বন্ধ করো': 'Close',
  'ছবির ওপর আঙুল টেনে রোবটের ভেতরটা দেখো': 'Drag across the picture to see inside the robot',
  'ভেতরে কী কী আছে': "What's inside", 'আসল রোবটের ছবি দেখো (উইকিপিডিয়া) ↗': 'See photos of the real robot (Wikipedia) ↗',
  '← আগের': '← Previous', 'পরের →': 'Next →',
  'আইফোনে অ্যাপ হিসেবে রাখো': 'Add the app to your iPhone', 'Safari ব্রাউজারে এই সাইটটা খোলো।': 'Open this site in the Safari browser.',
  'নিচের': 'Tap the', 'শেয়ার': 'Share', 'বোতামে চাপ দাও (চারকোনা বাক্স থেকে ওপরের দিকে তীর)।': 'button (a square with an arrow pointing up).',
  'তালিকা থেকে': 'From the list, choose', 'বেছে নাও।': '.', 'ওপরে ডান কোণে': 'In the top-right corner, tap',
  'চাপো। হোম স্ক্রিনে রোবট পাঠশালার আইকন চলে আসবে!': '. The Robot Pathshala icon will appear on your home screen!', 'বুঝেছি': 'Got it'
};
window.I18N_STATIC = S;
function translate(root) {
  if (lang !== 'en') return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
  nodes.forEach(n => {
    if (n.parentElement && /^(SCRIPT|STYLE)$/.test(n.parentElement.tagName)) return;
    const k = n.nodeValue.replace(/\s+/g, ' ').trim();
    if (k && S[k] !== undefined) n.nodeValue = n.nodeValue.replace(n.nodeValue.trim(), S[k]);
  });
  root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el => ['placeholder', 'aria-label', 'title'].forEach(a => { const v = el.getAttribute(a); if (v && S[v.trim()]) el.setAttribute(a, S[v.trim()]); }));
}
translate(document.body);
if (lang === 'en') document.title = 'Robot Pathshala';
// ভাষা বদলের বোতাম
const btn = document.getElementById('langBtn');
if (btn) {
  btn.textContent = lang === 'en' ? 'বাংলা' : 'English';
  btn.setAttribute('aria-label', lang === 'en' ? 'বাংলায় দেখো' : 'Switch to English');
  btn.addEventListener('click', () => {
    try { localStorage.setItem('lang', JSON.stringify(lang === 'en' ? 'bn' : 'en')); } catch (e) {}
    try { sessionStorage.setItem('langScroll', String(window.scrollY)); } catch (e) {}
    location.reload();
  });
}
try { const y = +sessionStorage.getItem('langScroll'); if (y) { sessionStorage.removeItem('langScroll'); addEventListener('load', () => scrollTo(0, y)); } } catch (e) {}
}
