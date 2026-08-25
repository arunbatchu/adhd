// The Capstone Builder
// CANVAS_HEIGHT: 620
// Guided writing environment for the book's two capstone documents: the
// Personal Owner's Manual (written by the person with ADHD) and the Family
// Support Plan (written by the people around them). Section-by-section
// prompt cards with starter questions, chapter references, and example
// lines; free text persisted in localStorage; an assemble view that shows
// empty sections honestly; print support. Create-level (L6).
// (Understanding ADHD, Chapter 15.)

const DOCS = {
  person: {
    title: "Personal Owner's Manual",
    storageKey: 'adhd-capstone-person',
    sections: [
      { name: 'How my brain works',
        purpose: 'Your mechanism paragraph, in your own words, without shame.',
        starters: 'What steers your attention? What currencies does your motivation accept (interest, novelty, urgency, people)? What does the discount curve do to your deadlines?',
        example: 'Example: "My attention steers by interest and urgency. Important-but-boring is my hardest category - that\'s mechanics, not caring."',
        chref: 'Chapters 1-2' },
      { name: 'My profile',
        purpose: 'Which executive functions hit hardest, which hold - and your presentation.',
        starters: 'Rank your six: working memory, brake, gear shift, map-maker, starter motor, dashboard. Which two cost you most? Which is actually fine?',
        example: 'Example: "Starter motor and prospective memory are my weak pair. Working memory is average. My brake is fine unless I\'m exhausted."',
        chref: 'Chapters 2-3' },
      { name: 'My conditions',
        purpose: 'When you work best - and what reliably breaks you.',
        starters: 'Best hours? Best task shapes? Medication windows? And the reliable breakers: surprise transitions? multi-step verbal instructions? 9 pm hard conversations?',
        example: 'Example: "Mornings before 11 are gold. Nothing important lands on me after 9 pm - ask me anything then and you\'ll meet the worst of me."',
        chref: 'Chapters 3, 7, 13' },
      { name: 'My tells and my weather',
        purpose: 'What your overwhelm, RSD spike, and burnout onset look like from outside.',
        starters: 'What do others see ten minutes before you notice? What helps mid-squall - and what makes it worse? How long do you need after?',
        example: 'Example: "If I go quiet and short, I\'m at 80. Reassure, don\'t litigate. I\'m back in ten minutes; give me the ten."',
        chref: 'Chapters 6, 11' },
      { name: 'What masking costs me',
        purpose: 'The section the family most needs to read: where the mask is on, and what it costs.',
        starters: 'Where do you perform fine at a price? What does the bill look like when it comes due at home? Where do you need to be allowed not to mask?',
        example: 'Example: "Work gets my best hours of acting normal. The 6 pm flatness is the receipt. Home needs to be where the mask can come off without a verdict."',
        chref: 'Chapter 3' },
      { name: 'My systems and my part',
        purpose: 'What you run - so helpers know what is already covered.',
        starters: 'Your capture point? Your alarms? The launchpad? The weekly review? What do you own that nobody needs to remind you about?',
        example: 'Example: "Everything dated goes in my phone at the moment of commitment. If it\'s not in there, tell me once - then it\'s on me."',
        chref: 'Chapters 9-10' },
      { name: 'The help I actually want',
        purpose: 'The filled-in menu: which reminders, from whom, through which channels - and what nobody should do.',
        starters: 'Which domains get a reminder, and in what form? What kind of company on hard tasks? What help is explicitly NOT wanted?',
        example: 'Example: "Add things to the shared board, don\'t tell me twice. Sunday admin hour with company: yes. Questions about my medication: no."',
        chref: 'Chapter 14' },
      { name: 'My strengths, and what I\'m building around them',
        purpose: 'The inventory Chapter 13 spends: what your wiring is good at, and where you\'re pointing it.',
        starters: 'What do you produce that others don\'t? Where has hyperfocus paid off? What conditions buy your traits at a premium?',
        example: 'Example: "Crisis calm, idea volume, deadline sprints. I\'m steering toward work with urgency built in and staffing out the admin."',
        chref: 'Chapters 11, 13' }
    ]
  },
  family: {
    title: 'Family Support Plan',
    storageKey: 'adhd-capstone-family',
    sections: [
      { name: 'Our understanding',
        purpose: 'The mechanism-language summary in your own words - including the myths you\'re retiring.',
        starters: 'What do you now know this is and isn\'t? Which verdicts were landing on mechanisms? What does the reframe you owe the past sound like?',
        example: 'Example: "We were grading her on hardware she didn\'t have. Lazy is retired. Forgetting is a cue problem, not a caring problem."',
        chref: 'Chapters 1-4' },
      { name: 'Our agreements',
        purpose: 'The negotiated infrastructure - every item traceable to "who asked?"',
        starters: 'The shared calendar? Reminder channels and their limits? The family meeting slot? The squall and repair protocols?',
        example: 'Example: "The board does the reminding. One verbal reminder max, only for the two domains she requested. Meeting: Sundays, 20 minutes, wins first."',
        chref: 'Chapters 9, 14' },
      { name: 'Our lines',
        purpose: 'What we don\'t do - written down so nobody renegotiates mid-crisis.',
        starters: 'No unrequested tracking? No treatment surveillance? Consequences belong to their owner? What is the narrow safety exception, exactly?',
        example: 'Example: "We don\'t monitor her medication. We don\'t open her mail. Safety signals - self-harm talk, not lifestyle choices - we act on immediately."',
        chref: 'Chapters 6, 14' },
      { name: 'Each supporter\'s role',
        purpose: 'Who does what - including who is deliberately just family.',
        starters: 'Who is the invited early-warning contact? Who body-doubles what? Who is off-duty by design? Any overlooked sibling to check on?',
        example: 'Example: "Dad: Tuesday admin body-double (invited). Mom: burnout early-warning contact. Grandma: just grandma."',
        chref: 'Chapters 8, 14' },
      { name: 'The caregiver\'s own plan',
        purpose: 'The oxygen mask, in writing.',
        starters: 'Whose tank needs watching? What protected time goes on which calendar? Who checks the strain tells monthly? Which support group?',
        example: 'Example: "Choir goes back on Mom\'s calendar with appointment status. Dad asks her the four strain questions on the first Sunday of each month."',
        chref: 'Chapter 15' },
      { name: 'Review date',
        purpose: 'When you reread both documents together.',
        starters: 'Annual date? Plus any transition trigger (new school, new job, new baby, retirement)?',
        example: 'Example: "Every Thanksgiving weekend, and at any Chapter 4 transition. Whoever remembers first wins nothing - it\'s on the calendar."',
        chref: 'Chapters 4, 10' }
    ]
  }
};

let role = null;
let idx = 0;
let drafts = {};

function $(id) { return document.getElementById(id); }

function loadDrafts() {
  try {
    const raw = localStorage.getItem(DOCS[role].storageKey);
    drafts = raw ? JSON.parse(raw) : {};
  } catch (e) { drafts = {}; }
}

function saveDrafts() {
  try { localStorage.setItem(DOCS[role].storageKey, JSON.stringify(drafts)); } catch (e) {}
}

function pickRole(r) {
  role = r;
  idx = 0;
  loadDrafts();
  $('role-person').classList.toggle('active', r === 'person');
  $('role-family').classList.toggle('active', r === 'family');
  $('editor').style.display = 'block';
  $('output').style.display = 'none';
  $('exchange').style.display = 'none';
  $('printbtn').style.display = 'none';
  renderRail();
  renderSection();
}

function renderRail() {
  const rail = $('rail');
  rail.innerHTML = '';
  DOCS[role].sections.forEach((s, i) => {
    const b = document.createElement('button');
    b.textContent = (i + 1) + '. ' + s.name;
    if (i === idx) b.classList.add('current');
    if (drafts[s.name] && drafts[s.name].trim().length > 0) b.classList.add('drafted');
    b.onclick = () => { stash(); idx = i; renderRail(); renderSection(); };
    rail.appendChild(b);
  });
}

function renderSection() {
  const s = DOCS[role].sections[idx];
  $('purpose').textContent = (idx + 1) + '. ' + s.name + ' — ' + s.purpose;
  $('starters').textContent = s.starters;
  $('example').textContent = s.example;
  $('chref').textContent = 'Draws on: ' + s.chref;
  $('text').value = drafts[s.name] || '';
}

function stash() {
  const s = DOCS[role].sections[idx];
  drafts[s.name] = $('text').value;
  saveDrafts();
}

function assemble() {
  stash();
  const doc = DOCS[role];
  const out = $('output');
  let html = '<h2>' + doc.title + '</h2>';
  const today = new Date().toISOString().split('T')[0];
  let emptyCount = 0;
  for (const s of doc.sections) {
    html += '<h3>' + s.name + '</h3>';
    const t = (drafts[s.name] || '').trim();
    if (t.length > 0) {
      html += '<p>' + t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>';
    } else {
      html += '<p class="empty">(not drafted yet - an honest draft beats a complete-looking one)</p>';
      emptyCount++;
    }
  }
  html += '<div class="meta">Drafted: ' + today + ' · ' + (doc.sections.length - emptyCount) + ' of ' + doc.sections.length +
    ' sections drafted · Review date: ____________ · Exchange scheduled for: ____________</div>';
  out.innerHTML = html;
  out.style.display = 'block';
  $('exchange').style.display = 'block';
  $('printbtn').style.display = 'inline-block';
  out.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function () {
  $('role-person').onclick = () => pickRole('person');
  $('role-family').onclick = () => pickRole('family');
  $('prev').onclick = () => { stash(); idx = Math.max(0, idx - 1); renderRail(); renderSection(); };
  $('next').onclick = () => { stash(); idx = Math.min(DOCS[role].sections.length - 1, idx + 1); renderRail(); renderSection(); };
  $('assemble').onclick = assemble;
  $('printbtn').onclick = () => window.print();
  $('text') && ($('text').oninput = () => { stash(); renderRail(); });
});
