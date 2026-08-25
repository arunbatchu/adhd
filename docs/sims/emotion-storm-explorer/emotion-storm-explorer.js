// The Ninety-Second Storm Explorer
// CANVAS_HEIGHT: 450
// A real-time emotional surge curve the learner steers: an RSD-fast spike at
// trigger onset, then decision points offering the chapter's regulation kit -
// pause moves (draft-don't-send, leave the room, physical dump), reframing
// (hold two readings), or acting on it now (which refuels the surge).
// Some triggers turn out real, most don't - the skills' value doesn't
// depend on the alarm being false. Family-view toggle annotates what a
// bystander helps or escalates. Apply-level (L3).
// (Understanding ADHD, Chapter 11.)
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50; // 1 row
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const SCENARIOS = [
  { trigger: 'Your friend replies to your long message with just: "ok"',
    readings: ['She\'s furious and done with me', 'She\'s driving and typed one word', 'She\'s busy and will write later'],
    catastrophic: 0,
    truth: false,
    reveal: 'She was in the car. The full reply came an hour later. False alarm - the ninth of nine "ok" texts that meant nothing.' },
  { trigger: 'Your boss messages: "come see me before you leave today"',
    readings: ['I\'m being fired', 'A schedule question', 'Feedback on the report - could be either way'],
    catastrophic: 0,
    truth: false,
    reveal: 'She wanted you on a new project. The alarm was false - and acting at intensity 30 instead of 95 is why the meeting went well.' },
  { trigger: 'Your partner says: "we need to talk about the bill that didn\'t get paid"',
    readings: ['They think I\'m a failure and this is the last straw', 'They\'re stressed about money, not about me', 'They want a system fix, not a verdict'],
    catastrophic: 0,
    truth: true,
    reveal: 'The concern was real - the bill did lapse. But entering the conversation at intensity 30 turned it into a Chapter 9 system redesign instead of a fight. The skills\' value never depended on the alarm being false.' },
  { trigger: 'Mid-sentence in the meeting, a colleague talks over you',
    readings: ['Everyone thinks my ideas are worthless', 'He interrupts everyone - watch for two minutes', 'He\'s excited, not hostile'],
    catastrophic: 0,
    truth: false,
    reveal: 'He interrupted two other people in the next five minutes. Not about you. The noted-down point landed fine when you raised it later.' },
  { trigger: 'Your sibling jokes: "running late again? shocking."',
    readings: ['They\'ve always thought I\'m a joke', 'Lazy sibling humor, zero information', 'Mildly annoying, worth a calm word later'],
    catastrophic: 0,
    truth: false,
    reveal: 'It was reflex humor. The calm word later ("that one lands on a sore spot") did more than any comeback would have.' },
  { trigger: 'The teacher calls: "we should discuss how your child is doing"',
    readings: ['Everything is falling apart again', 'Could be routine - teachers call for good things too', 'One data point; ask what it\'s about before assuming'],
    catastrophic: 0,
    truth: true,
    reveal: 'There was a real issue - missing assignments (the backpack, Chapter 12). Arriving curious instead of flooded made you an ally in the meeting instead of a defendant.' }
];

const PAUSE_MOVES = [
  { label: 'Draft it - don\'t send', note: 'The hot reply goes to drafts for an hour. Always calmer or unnecessary by then.' },
  { label: '"I\'m taking ten" (leave the room)', note: 'The pre-agreed protocol. Not storming off - the skill working.' },
  { label: 'Physical dump (stairs, walk)', note: 'The surge is somatic. Spend it somatically.' }
];

let scen = 0;
let simT = 0;              // seconds of sim time (runs ~2x real time)
let intensity = 0;
let running = false;
let phase = 'intro';       // intro, running, decision, reframe, done
let decisionAt = [6, 14, 22];
let decisionIdx = 0;
let log = [];
let timeAbove70 = 0;
let familyView = false;
let curve = [];            // sampled {t, v}
let buttons = [];          // clickable rects rebuilt each frame

let familyCheckbox, scenButton, replayButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  scenButton = createButton('New scenario');
  scenButton.position(10, drawHeight + 10);
  scenButton.parent(document.querySelector('main'));
  scenButton.mousePressed(() => { scen = (scen + 1) % SCENARIOS.length; reset(); });

  replayButton = createButton('Replay');
  replayButton.position(115, drawHeight + 10);
  replayButton.parent(document.querySelector('main'));
  replayButton.mousePressed(reset);

  familyCheckbox = createCheckbox(' Family view: what helps vs escalates at each choice', false);
  familyCheckbox.position(190, drawHeight + 14);
  familyCheckbox.parent(document.querySelector('main'));
  familyCheckbox.changed(() => { familyView = familyCheckbox.checked(); });

  reset();

  describe('A real-time emotional surge curve spikes when a trigger lands - an ambiguous text, a boss\'s summons - then decision points offer pause moves, reframing with candidate readings, or acting on the surge, which refuels it. The curve decays when not refueled, a counter tracks time above intensity seventy, and each scenario ends by revealing whether the fear was real - most are not, and the skills help either way. A family-view toggle annotates what a bystander does that helps or escalates.', LABEL);
}

function reset() {
  simT = 0;
  intensity = 0;
  running = false;
  phase = 'intro';
  decisionIdx = 0;
  log = [];
  timeAbove70 = 0;
  curve = [];
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
  textSize(19);
  text('The Ninety-Second Storm', canvasWidth / 2, 8);
  textSize(defaultTextSize);

  buttons = [];

  if (phase === 'running') {
    stepSim();
  }

  drawCurvePlot();
  drawTriggerCard();

  if (phase === 'intro') drawIntro();
  else if (phase === 'decision') drawDecision();
  else if (phase === 'reframe') drawReframe();
  else if (phase === 'done') drawDone();
}

function stepSim() {
  const dt = 1 / 30; // sim seconds per frame (2x speed)
  simT += dt;
  // spike at t=1..2
  if (simT < 1) intensity = 0;
  else if (simT < 2) intensity = map(simT, 1, 2, 0, 95);
  else intensity = max(8, intensity - dt * (intensity * 0.055)); // exponential-ish decay
  if (intensity > 70) timeAbove70 += dt;
  curve.push({ t: simT, v: intensity });

  if (decisionIdx < decisionAt.length && simT >= decisionAt[decisionIdx]) {
    phase = 'decision';
  }
  if (simT >= 30) phase = 'done';
}

function plotRect() { return { x: 50, y: 118, w: canvasWidth - 90, h: 130 }; }

function drawCurvePlot() {
  const p = plotRect();
  stroke('gray');
  strokeWeight(1);
  noFill();
  rect(p.x, p.y, p.w, p.h);
  // 70-line
  const y70 = p.y + p.h - (70 / 100) * p.h;
  stroke(200, 120, 120);
  drawingContext.setLineDash([5, 4]);
  line(p.x, y70, p.x + p.w, y70);
  drawingContext.setLineDash([]);
  noStroke();
  fill(170, 90, 90);
  textSize(10);
  textAlign(LEFT, BOTTOM);
  text('70: words said here must be metabolized later', p.x + 4, y70 - 2);

  // curve
  stroke(200, 90, 50);
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (const pt of curve) {
    vertex(p.x + (pt.t / 30) * p.w, p.y + p.h - (pt.v / 100) * p.h);
  }
  endShape();
  noStroke();

  // labels
  fill('dimgray');
  textSize(10.5);
  textAlign(LEFT, TOP);
  text('0 s', p.x, p.y + p.h + 4);
  textAlign(RIGHT, TOP);
  text('~5 min (compressed)', p.x + p.w, p.y + p.h + 4);
  textAlign(RIGHT, BOTTOM);
  fill('black');
  textSize(11);
  text('time above 70: ' + nf(timeAbove70, 1, 1) + ' s', p.x + p.w, p.y - 4);
  push();
  translate(p.x - 30, p.y + p.h / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  fill('dimgray');
  text('surge intensity', 0, 0);
  pop();
  textSize(defaultTextSize);
}

function drawTriggerCard() {
  const s = SCENARIOS[scen];
  fill('white');
  stroke('gray');
  strokeWeight(1.5);
  rect(30, 36, canvasWidth - 60, 68, 10);
  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, TOP);
  text('Trigger (' + (scen + 1) + ' of ' + SCENARIOS.length + '):', 42, 44);
  fill('black');
  textSize(13.5);
  text(s.trigger, 42, 60, canvasWidth - 84, 42);
  textSize(defaultTextSize);
}

function makeButton(label, x, y, w, h, cb, note) {
  buttons.push({ x, y, w, h, cb, label, note });
  const hovered = mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h;
  stroke(hovered ? 'black' : 'silver');
  strokeWeight(hovered ? 2 : 1);
  fill(hovered ? '#e8eef6' : 'white');
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(12);
  text(label, x + 5, y + 4, w - 10, h - 8);
  textSize(defaultTextSize);
}

function drawIntro() {
  fill(255, 255, 255, 240);
  stroke(200);
  rect(canvasWidth / 2 - 190, 268, 380, 70, 10);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(13);
  text('Press Start. The trigger lands at second one.\nYou\'ll make three choices as the surge runs.', canvasWidth / 2, 292);
  textSize(defaultTextSize);
  makeButton('Start', canvasWidth / 2 - 45, 344, 90, 32, () => { phase = 'running'; });
}

function drawDecision() {
  const pauseMove = PAUSE_MOVES[decisionIdx % PAUSE_MOVES.length];
  noStroke();
  fill('black');
  textSize(13);
  textAlign(CENTER, TOP);
  text('Decision ' + (decisionIdx + 1) + ' of 3 - intensity is at ' + nf(intensity, 1, 0) + '. What now?', canvasWidth / 2, 262);
  textSize(defaultTextSize);

  const bw = min(190, (canvasWidth - 60) / 3), bh = 46, gap = 10;
  const total = bw * 3 + gap * 2;
  const x0 = (canvasWidth - total) / 2, y0 = 286;

  makeButton(pauseMove.label, x0, y0, bw, bh, () => {
    intensity = max(6, intensity * 0.55);
    log.push({ good: true, msg: 'Paused: ' + pauseMove.note });
    nextDecision();
  });
  makeButton('Reframe: another reading?', x0 + bw + gap, y0, bw, bh, () => {
    phase = 'reframe';
  });
  makeButton('Act on it NOW', x0 + 2 * (bw + gap), y0, bw, bh, () => {
    intensity = min(98, intensity + 45);
    log.push({ good: false, msg: 'Re-fueled: expression re-triggers the surge. The curve knows.' });
    nextDecision();
  });

  if (familyView) {
    fill(240, 248, 240, 245);
    stroke(150, 180, 150);
    rect(x0, y0 + bh + 8, total, 40, 8);
    noStroke();
    fill('seagreen');
    textSize(11);
    textAlign(LEFT, CENTER);
    text('Family view: reassure ("we\'re okay, take your ten") helps. Litigating the trigger\'s size right now refuels it.', x0 + 10, y0 + bh + 28, total - 20);
    textSize(defaultTextSize);
  } else if (log.length > 0) {
    const last = log[log.length - 1];
    noStroke();
    fill(last.good ? 'seagreen' : 'firebrick');
    textSize(11);
    textAlign(CENTER, TOP);
    text(last.msg, canvasWidth / 2, y0 + bh + 14, canvasWidth - 80);
    textSize(defaultTextSize);
  }
}

function nextDecision() {
  decisionIdx++;
  phase = 'running';
}

function drawReframe() {
  const s = SCENARIOS[scen];
  noStroke();
  fill('black');
  textSize(13);
  textAlign(CENTER, TOP);
  text('Hold two readings. Which alternative is at least plausible?', canvasWidth / 2, 258);
  textSize(defaultTextSize);
  const bw = min(200, (canvasWidth - 60) / 3), bh = 52, gap = 8;
  const total = bw * 3 + gap * 2;
  const x0 = (canvasWidth - total) / 2, y0 = 282;
  for (let i = 0; i < 3; i++) {
    const reading = s.readings[i];
    makeButton(reading, x0 + i * (bw + gap), y0, bw, bh, () => {
      if (i === s.catastrophic) {
        intensity = min(98, intensity + 12);
        log.push({ good: false, msg: 'That IS the catastrophic reading - rehearsing it refuels. Try holding a second one next time.' });
      } else {
        intensity = max(6, intensity * 0.5);
        log.push({ good: true, msg: 'Hypothesis held. A fact became a hypothesis - the alarm quiets while evidence is pending.' });
      }
      nextDecision();
    });
  }
}

function drawDone() {
  const s = SCENARIOS[scen];
  fill(255, 255, 255, 248);
  stroke(150);
  rect(canvasWidth / 2 - 225, 258, 450, 116, 12);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  text('What was actually true: ' + (s.truth ? 'the concern was REAL.' : 'false alarm.'), canvasWidth / 2 - 210, 268);
  fill('#333333');
  textSize(11.5);
  text(s.reveal, canvasWidth / 2 - 210, 288, 420, 56);
  fill(timeAbove70 < 3 ? 'seagreen' : 'chocolate');
  textSize(12);
  text('Time above intensity 70: ' + nf(timeAbove70, 1, 1) + ' s - the number these skills exist to shrink.', canvasWidth / 2 - 210, 348, 420, 24);
  textSize(defaultTextSize);
}

function mousePressed() {
  for (const b of buttons) {
    if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
      b.cb();
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
