/* ---------- book data ---------- */
const CHAPTERS = [{"num": "I", "title": "The signal", "paras": ["Eli was analyzing a glowing cube in a contained chamber. The cube sat on a small metal stand in the middle of the room, behind a thick glass wall. It wasn’t very big, about the size of a shoe box, but it glowed a white light that seemed to change colors when she wasn’t looking straight at it. Every once and a while it gave off a low hum, almost like it was breathing.", "She was with the head researcher, Dr. Voss. Dr. Voss stroud next to her with a clip board watching the numbers on the monitor go up and down.", "“Readings are spanking again,” Eli said, tapping the screen. “Every time it hums, the energy jumps. Like it’s trying to say something.”", "“A signal.” Dr. Voss said quietly. “Whe just don’t know what or who it’s for.”", "Eli leaned closer to the glass. For a split second the cube flashed red then blue back to white. She blinked “Did you see that?”", "Dr. Voss didn’t answer right away. She wrote something on her clipboard and flipped the page so Eli couldn’t see it. “It’s late,” She finally said. “Log your notes and get some rest. We’ll start again in the next morning.”"]}, {"num": "II", "title": "The Undiscovered", "paras": ["Then she noticed something - a wall with no wallpaper. Eli says “Why does this wall not have wallpaper but everywhere around it does?”, she gets a response, “Trust the building and only the building.”", "Eli in denial, thinks nothing of it and keeps walking around. Then she finds a radio on the floor, but it’s broken yet it still works. Eli has no way to fix the radio. The radio crackles “Hello, I’m glad you found thi-” Silence comes among Eli and the entire facility, the only thing Eli could hear is the buzzing of lights.", "Then Eli tries to talk to whoever is on the other side, “Hello? Who is this?”. The radio crackles once more “This is Dr. Voss, whatever you do don’t-”. After that all Eli could hear was the buzzing of lights, and what sounded like taping on the wall or a pipe.", "Lights start to flicker, a hallway goes dark behind Eli. The radio crackles but with an unsettling message, “I recommend you to run-”. Eli starts to run and the lights flicker off behind her, she later finds a pan on the floor.", "Then all lights go out, pure silence. Interrupting the unsettling silence is the radio “It’s Dr. Voss, only trust your-”. Eli slows down to speak to Dr. Voss hoping to get a response back, “Hello? Dr. Voss?”, no response. Then the lights turn back on.", "All Eli can do is trust herself and what she remembers but she doesn't even remember anything let alone trust herself. With no direction at all she starts to wander in random directions. She found a room that looked somewhat like a puzzle but there seemed to be no way to get in. She tried to knock on the door and the window. But at that moment the lights flickered then completely turned off. Eli, hearing what sounded like someone running to her hid in an unscrewed vent.", "Then she crawled through the vent only to figure out how to get into the room, and in the room was one bright, glowing red cube. Eli tries to talk on the radio once again “Dr. Voss, I found a red cube in a room. What does it do?” Dr. Voss responded with “It is used to open some doors that-”.  “Hello? Dr. Voss?”, no response.", "Eli, having gotten no response from Dr. Voss grabs the cube and leaves the room through the vent and continues to wander not knowing if she will ever get out of this place.", "The lights suddenly go out, no flickering, no sound, nothing to see. Eli, nervously holding out the glowing red cube for some light and sees a shadowed figure just standing there staring. Eli jokingly says “Well that is quite a nice ceiling isn't it?”. The entity starts running to her fast, then Eli starts running. She later takes a turn and hides against the wall, losing the entity.", "A few minutes later Eli finds a random door. Next to the door is a platform a perfect size for the red cube. Eli places the cube on the platform, the door opens. She walks in to find a backpack with food, drinks, a blue glowing cube just like the red one, and a clearance level 2 key card. ‘Who put this here?’ Eli thinks.", "Eli goes back to walking around and drinking soda, looking for a clearance level 2 door.But the area she is in feels familiar for some reason. Then she remembers what Dr. Voss said only trust your- Eli still didn't figure out the last part but assumes Dr. Voss meant what she remembers.", "Eli doesn't know why but she remembers that to the right of her down the hall and a left is a door. She walks towards the door, it takes a few minutes but she gets there. The door has a card scanner just like the one at the lobby. Yet this door has a sign that says \"Continue at your own risk” in black words with a bright yellow background. She disregards the sign and scans the clearance level 2 key card and opens the door…"]}];

const $ = id => document.getElementById(id);
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cap = s => s.replace(/\b\w/g, c => c.toUpperCase());

/* contents */
$('tocList').innerHTML = CHAPTERS.map((c, i) => {
  const words = c.paras.join(' ').split(/\s+/).length;
  return `<li><a href="#chapter-${i+1}" data-go="chapter-${i+1}"><span class="n">${c.num}</span><span class="t">${esc(cap(c.title))}</span><span class="m">${Math.max(1,Math.round(words/230))} min</span></a></li>`;
}).join('') + `<li class="soon"><a><span class="n">III</span><span class="t">Coming soon</span><span class="m">—</span></a></li>`;

/* split each chapter into book pages (~250 words, never splitting a paragraph) */
const PAGE_WORDS = 250;
CHAPTERS.forEach(c => {
  c.pages = []; let pg = [], n = 0;
  for (const p of c.paras) {
    const w = p.split(/\s+/).length;
    if (pg.length && n + w > PAGE_WORDS) { c.pages.push(pg); pg = []; n = 0; }
    pg.push(p); n += w;
  }
  if (pg.length) c.pages.push(pg);
});

/* routing on #name only: #chapter-2 or #chapter-2-page-3 */
let current = -1, page = 1;
function route() {
  const m = location.hash.match(/^#chapter-(\d+)(?:-page-(\d+))?$/);
  if (m && CHAPTERS[m[1]-1]) { openChapter(+m[1]-1, +(m[2] || 1)); return; }
  document.body.classList.remove('reading'); current = -1;
  if (location.hash === '#contents') $('contents').scrollIntoView();
  $('progress').style.width = 0;
}
const pageHash = (ci, p) => `#chapter-${ci+1}-page-${p}`;
function openChapter(i, p) {
  const c = CHAPTERS[i];
  p = Math.min(Math.max(1, p), c.pages.length);
  current = i; page = p;
  document.body.classList.add('reading');
  $('rTag').textContent = `Chapter ${c.num} · Page ${p} of ${c.pages.length}`;
  $('rTitle').textContent = cap(c.title);
  $('rBody').classList.toggle('cont', p > 1);
  $('rBody').innerHTML = c.pages[p-1].map(t => `<p>${esc(t)}</p>`).join('');
  $('progress').style.width = (p / c.pages.length * 100) + '%';
  const last = p === c.pages.length;
  $('wip').style.display = last ? '' : 'none';
  const prev = p > 1 ? pageHash(i, p-1) : i > 0 ? pageHash(i-1, CHAPTERS[i-1].pages.length) : null;
  const next = !last ? pageHash(i, p+1) : i < CHAPTERS.length-1 ? pageHash(i+1, 1) : null;
  $('rPrev').style.visibility = prev ? 'visible' : 'hidden';
  $('rNext').style.visibility = next ? 'visible' : 'hidden';
  if (prev) $('rPrev').href = prev;
  if (next) $('rNext').href = next;
  $('rNext').textContent = last && next ? 'Next chapter →' : 'Next page →';
  $('rPrev').textContent = p === 1 && prev ? '← Prev chapter' : '← Prev page';
  window.scrollTo(0, 0);
}
addEventListener('hashchange', route);
addEventListener('keydown', e => {
  if (current < 0 || e.target.closest('input')) return;
  if (e.key === 'ArrowRight' && $('rNext').style.visibility !== 'hidden') location.hash = $('rNext').getAttribute('href');
  if (e.key === 'ArrowLeft' && $('rPrev').style.visibility !== 'hidden') location.hash = $('rPrev').getAttribute('href');
});

/* the cube: hums, and flashes red→blue when you aren't looking straight at it */
(function cube(){
  const ch = $('chamber'), en = $('energy'), sg = $('sig');
  let e = 0;
  setInterval(() => { e = 3.1 + Math.sin(Date.now()/670)*1.4 + Math.random()*.3; en.textContent = e.toFixed(2); }, 140);
  function flash(){
    ch.classList.add('flash'); sg.textContent = 'SPIKE';
    setTimeout(() => { ch.classList.remove('flash'); ch.classList.add('flash2'); }, 160);
    setTimeout(() => { ch.classList.remove('flash2'); sg.textContent = 'LISTENING'; }, 330);
    setTimeout(flash, 4000 + Math.random()*7000);
  }
  setTimeout(flash, 2500);
})();

route();
