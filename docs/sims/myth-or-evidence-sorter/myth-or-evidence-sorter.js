// Myth or Evidence Sorter
// CANVAS_HEIGHT: 450
// Learners judge claims about ADHD as myth or evidence-supported BEFORE the
// answer is revealed, then read a short explanation tied to the chapter
// concept it rests on. Evaluate-level (L5) classification with mandatory
// prediction and explained feedback (Understanding ADHD, Chapter 1).
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50; // 1 row: Next + Shuffle buttons
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// claim pool: m = true means it is a myth
const CLAIMS = [
  { t: 'ADHD was invented in the 1990s to sell medication.', m: true,
    e: 'Clinical descriptions date to 1798 (Crichton) and 1902 (Still) - long before any drug existed to sell. Two centuries of consistent description is a discovered condition, not an invented one.' },
  { t: 'ADHD is roughly 70-80% heritable - about as heritable as height.', m: false,
    e: 'Twin studies consistently put heritability around 70-80%. It runs densely in families, which is why a child\'s diagnosis so often leads to a parent\'s.' },
  { t: 'People with ADHD can focus for hours on things they enjoy.', m: false,
    e: 'True - and it disproves nothing. Attention steers by interest, novelty, and urgency. Hyperfocus on a game plus paralysis on a form is the signature of attention regulation, not proof of choice.' },
  { t: 'Sugar causes ADHD.', m: true,
    e: 'Tested repeatedly in controlled studies; the effect is not there. ADHD\'s causes are genes (heavily) and early biological factors (modestly) - not diet.' },
  { t: 'Adults need 6 or more symptoms in a category to be diagnosed.', m: true,
    e: 'The DSM-5 drops the threshold to 5 symptoms at age 17 and older, acknowledging that symptoms soften with maturation while still causing impairment.' },
  { t: 'Hyperactivity usually disappears completely in adults.', m: true,
    e: 'It usually goes inside: inner restlessness, overcommitment, a jiggling knee, a mind with forty tabs open. The motor gets a costume, not a retirement.' },
  { t: 'A straight-A student can have undiagnosed ADHD.', m: false,
    e: 'High intelligence and effort can mask ADHD for years - the grades show no impairment while the private cost accumulates. Masking is a main engine of late diagnosis, especially in girls and women.' },
  { t: 'If he really cared, he would remember.', m: true,
    e: 'Forgetting in ADHD is selective by cue, not by caring. Prospective memory - remembering to act at the right moment, unprompted - is among the least reliable functions in the ADHD brain.' },
  { t: 'ADHD occurs at every level of intelligence.', m: false,
    e: 'ADHD and intelligence are independent. The diagnosis says nothing about how smart a person is - and intelligence often hides the condition and delays diagnosis.' },
  { t: 'Bad parenting causes ADHD.', m: true,
    e: 'ADHD is neurodevelopmental: heritability ~70-80%, plus modest early biological risks (prematurity, low birth weight, prenatal exposures). Parenting shapes outcomes; it does not cause the condition.' },
  { t: 'Symptoms must appear before age 12 for a diagnosis.', m: false,
    e: 'The DSM-5 requires several symptoms present before age 12. ADHD does not start at 30 - though its discovery often does, once someone finally asks the right questions about childhood.' },
  { t: 'Everyone is a little ADHD.', m: true,
    e: 'Everyone is sometimes distracted. ADHD requires a lifelong pattern, in two or more settings, causing real impairment, meeting strict symptom counts. The criteria exist exactly to separate the condition from ordinary distractibility.' },
  { t: 'ADHD brains show measurable developmental differences on group-level imaging.', m: false,
    e: 'Longitudinal imaging found the cortex maturing on the normal trajectory but 2-3 years later, especially in prefrontal regions. (No scan can diagnose an individual, though.)' },
  { t: 'People with ADHD just need to try harder.', m: true,
    e: 'By the time anyone reaches evaluation they have spent years trying harder - it is the one strategy guaranteed to have already failed. What works is changing the system around the effort.' },
  { t: 'Girls with ADHD are more likely to be inattentive and get missed.', m: false,
    e: 'Girls more often show the quiet, inattentive presentation and internalized struggle. Referral runs on disruption, so they slip through - the engine of the gender diagnosis gap.' },
  { t: 'Laziness explains why the important task stays undone for weeks.', m: true,
    e: 'Genuinely lazy people are untroubled by not working. People with ADHD sit in front of the undone task in escalating misery. The suffering is the tell; the mechanism is task initiation and delay aversion.' }
];

let order = [];        // shuffled indices
let idx = 0;           // position in order
let answered = false;  // has the current claim been judged?
let lastCorrect = false;
let score = 0, attempted = 0, streak = 0;
let missed = [];       // indices missed this round
const ROUND = 10;
let roundOver = false;

let nextButton, shuffleButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  nextButton = createButton('Next claim');
  nextButton.position(10, drawHeight + 10);
  nextButton.parent(document.querySelector('main'));
  nextButton.mousePressed(nextClaim);

  shuffleButton = createButton('Shuffle & restart');
  shuffleButton.position(110, drawHeight + 10);
  shuffleButton.parent(document.querySelector('main'));
  shuffleButton.mousePressed(restart);

  restart();

  describe('A claim about ADHD appears on a card. Choose Myth or Supported-by-evidence before the answer is revealed; the card then flips to show the correct classification with a short explanation tied to the chapter concept. Score and streak counters track a ten-claim round, ending with a summary of missed claims.', LABEL);
}

function restart() {
  order = shuffle([...Array(CLAIMS.length).keys()]);
  idx = 0;
  answered = false;
  score = 0; attempted = 0; streak = 0;
  missed = [];
  roundOver = false;
}

function nextClaim() {
  if (!answered && !roundOver) return; // must judge first
  if (attempted >= ROUND) { roundOver = true; return; }
  idx = (idx + 1) % order.length;
  answered = false;
}

function judge(sayMyth) {
  if (answered || roundOver) return;
  const c = CLAIMS[order[idx]];
  answered = true;
  attempted++;
  lastCorrect = (sayMyth === c.m);
  if (lastCorrect) { score++; streak++; }
  else { streak = 0; missed.push(order[idx]); }
  if (attempted >= ROUND) roundOver = true;
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);
  noStroke();

  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(20);
  text('Myth or Evidence?', canvasWidth / 2, 8);
  textSize(defaultTextSize);

  // score strip
  noStroke();
  fill('dimgray');
  textAlign(RIGHT, TOP);
  textSize(13);
  text('Score: ' + score + ' / ' + attempted + '   Streak: ' + streak, canvasWidth - 12, 12);
  textAlign(LEFT, TOP);
  text('Round: ' + min(attempted + (answered ? 0 : 1), ROUND) + ' of ' + ROUND, 12, 12);
  textSize(defaultTextSize);

  if (roundOver && answered) { drawSummary(); drawControlHints(); return; }

  drawCard();
  drawZones();
  drawControlHints();
}

function drawCard() {
  const c = CLAIMS[order[idx]];
  const cw = min(520, canvasWidth - 50);
  const ch = answered ? 210 : 120;
  const cx = (canvasWidth - cw) / 2;
  const cy = 46;

  fill(answered ? (lastCorrect ? '#eef7ee' : '#fdeeee') : 'white');
  stroke(answered ? (lastCorrect ? 'seagreen' : 'firebrick') : 'gray');
  strokeWeight(2);
  rect(cx, cy, cw, ch, 12);
  noStroke();

  fill('black');
  textAlign(CENTER, TOP);
  textSize(15);
  text('"' + c.t + '"', cx + 14, cy + 14, cw - 28, 70);

  if (answered) {
    textAlign(LEFT, TOP);
    fill(lastCorrect ? 'seagreen' : 'firebrick');
    textSize(14);
    const verdict = c.m ? 'MYTH' : 'SUPPORTED BY EVIDENCE';
    text((lastCorrect ? 'Correct - ' : 'Not quite - ') + 'this is: ' + verdict, cx + 14, cy + 78);
    fill('#333333');
    textSize(12.5);
    text(c.e, cx + 14, cy + 100, cw - 28, ch - 108);
  }
  textSize(defaultTextSize);
}

function zoneRects() {
  const zw = min(220, (canvasWidth - 70) / 2);
  const zy = 290, zh = 78;
  return [
    { x: canvasWidth / 2 - zw - 12, y: zy, w: zw, h: zh, label: 'Myth', myth: true },
    { x: canvasWidth / 2 + 12, y: zy, w: zw, h: zh, label: 'Supported by evidence', myth: false }
  ];
}

function drawZones() {
  for (const z of zoneRects()) {
    const hovered = mouseX > z.x && mouseX < z.x + z.w && mouseY > z.y && mouseY < z.y + z.h;
    const active = !answered;
    fill(active ? (hovered ? (z.myth ? '#f6d4c8' : '#cfe4d2') : (z.myth ? '#fbe9e2' : '#e4f1e6')) : '#f0f0f0');
    stroke(active && hovered ? 'black' : 'silver');
    strokeWeight(active && hovered ? 2 : 1);
    rect(z.x, z.y, z.w, z.h, 12);
    noStroke();
    fill(active ? 'black' : 'gray');
    textAlign(CENTER, CENTER);
    textSize(15);
    text(z.label, z.x + z.w / 2, z.y + z.h / 2);
    textSize(defaultTextSize);
  }
  if (!answered) {
    noStroke();
    fill('dimgray');
    textAlign(CENTER, TOP);
    textSize(12);
    text('Commit to a judgment - the answer reveals only after you choose', canvasWidth / 2, 258);
    textSize(defaultTextSize);
  }
}

function drawSummary() {
  const cw = min(540, canvasWidth - 50);
  const cx = (canvasWidth - cw) / 2;
  fill(255, 255, 255, 248);
  stroke(150);
  strokeWeight(1.5);
  rect(cx, 44, cw, drawHeight - 70, 12);
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(18);
  text('Round complete: ' + score + ' of ' + ROUND, canvasWidth / 2, 56);
  textSize(13);
  textAlign(LEFT, TOP);
  let y = 90;
  if (missed.length === 0) {
    textAlign(CENTER, TOP);
    text('Perfect round. You can now answer the skeptical uncle.', canvasWidth / 2, y);
  } else {
    text('Worth a second look:', cx + 16, y);
    y += 22;
    for (const mi of missed.slice(0, 4)) {
      fill('firebrick');
      text('- "' + CLAIMS[mi].t + '"', cx + 16, y, cw - 32, 40);
      y += 36;
      fill('#333333');
      textSize(11.5);
      text(CLAIMS[mi].e, cx + 28, y, cw - 44, 44);
      y += 44;
      textSize(13);
    }
  }
  fill('dimgray');
  textAlign(CENTER, BOTTOM);
  textSize(12);
  text('Press "Shuffle & restart" to play again', canvasWidth / 2, drawHeight - 34);
  textSize(defaultTextSize);
}

function drawControlHints() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text(answered && !roundOver ? 'Press "Next claim" to continue' : '', 250, drawHeight + 25);
  textSize(defaultTextSize);
}

function mousePressed() {
  if (answered || roundOver) return;
  for (const z of zoneRects()) {
    if (mouseX > z.x && mouseX < z.x + z.w && mouseY > z.y && mouseY < z.y + z.h) {
      judge(z.myth);
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
