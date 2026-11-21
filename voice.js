// বাংলায় পড়ে শোনানো (ফোনের নিজস্ব টেক্সট-টু-স্পিচ দিয়ে, ইন্টারনেট ছাড়াও চলতে পারে)
{
const RB = window.RB;
const synth = window.speechSynthesis;
const ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
let playing = null;
const voice = () => synth && synth.getVoices().find(v => /^bn/i.test(v.lang));
function stopAll() { try { synth.cancel(); } catch (e) {} if (playing) playing.classList.remove('on'); playing = null; }
function speak(btn) {
  if (!synth || !window.SpeechSynthesisUtterance) { RB.toast && RB.toast('এই ব্রাউজারে পড়ে শোনানোর সুবিধা নেই।'); return; }
  if (playing === btn) { stopAll(); return; }
  stopAll();
  const text = btn.dataset.say.split(',').map(s => document.querySelector(s.trim())).filter(el => el && !el.hidden).map(el => el.innerText.replace(/[✓✗★☆×↻↺→]/g, ' ')).join('। ').trim();
  if (!text) return;
  const u = new SpeechSynthesisUtterance(text);
  const v = voice(); if (v) u.voice = v;
  u.lang = v ? v.lang : 'bn-BD'; u.rate = .9;
  u.onend = u.onerror = () => { btn.classList.remove('on'); if (playing === btn) playing = null; };
  btn.classList.add('on'); playing = btn;
  synth.speak(u);
  if (!v && synth.getVoices().length) RB.toast && RB.toast('তোমার ফোনে বাংলা কণ্ঠ পাওয়া যায়নি। ফোনের সেটিংসে “টেক্সট-টু-স্পিচ” থেকে বাংলা ভাষা যোগ করো।');
}
document.querySelectorAll('[data-say]').forEach(b => { b.classList.add('say'); b.innerHTML = ICON + '<span>শোনো</span>'; b.setAttribute('aria-label', 'পড়ে শোনাও'); });
document.addEventListener('click', e => { const b = e.target.closest('[data-say]'); if (b) speak(b); });
try { synth && synth.getVoices(); synth && synth.addEventListener && synth.addEventListener('voiceschanged', () => {}); } catch (e) {}
window.addEventListener('pagehide', stopAll);
document.getElementById('dlg') && document.getElementById('dlg').addEventListener('close', stopAll);
}
