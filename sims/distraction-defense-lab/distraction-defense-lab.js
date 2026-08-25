// Distraction Defense Lab
// CANVAS_HEIGHT: 480
// Configure combinations of four distraction defenses and run a simulated
// work hour (played back in seconds). Capture events break the focus
// timeline with labels; each active defense independently stops or shortens
// some attempts, and which layer caught which attempt is shown. A comparison
// strip stores the last four runs so "layers beat any single defense" is
// readable from the learner's own data. Apply-level (L3).
// (Understanding ADHD, Chapter 10.)
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80; // 2 rows of checkboxes + run button
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// attempt types and which defense primarily counters them
const TYPES = [
  { name: 'notification', counter: 2, cost: 9,  label: 'notification → video spiral' },
  { name: 'phone reach',  counter: 0, cost: 12, label: 'phone within reach → check' },
  { name: 'browse urge',  counter: 1, cost: 7,  label: 'urge → "just one tab"' },
  { name: 'boredom drift',counter: 3, cost: 6,  label: 'boredom → wandered off' }
];

const DEFENSES = [
  { name: 'Distance (phone away)', short: 'dist' },
  { name: 'Friction (unblock delay)', short: 'fric' },
  { name: 'Silence (notifs off)', short: 'sil' },
  { name: 'Urgency (sprint timer)', short: 'urg' }
];

let defOn = [false, false, false, false];
let badDay = false;
let checkboxes = [], badDayBox, runButton;

let run = null;        // current run result
let runs = [];         // history (max 4)
let revealT = 0;       // animation progress 0..1

function simulate() {
  // generate 8-11 capture attempts across 60 minutes
  const n = floor(random(8, 12));
  const events = [];
  for (let i = 0; i < n; i++) {
    const type = TYPES[floor(random(TYPES.length))];
    events.push({ time: random(2, 58), type: type });
  }
  events.sort((a, b) => a.time - b.time);

  const weaken = badDay ? 0.3 : 0;
  const outcomes = [];
  for (const e of events) {
    let caught = null;
    let shortened = false;
    // the primary counter-defense stops the attempt with high probability
    const ci = e.type.counter;
    if (defOn[ci] && random(1) < (0.85 - weaken)) {
      caught = ci;
    } else {
      // any other active defense can shorten the spiral
      for (let d = 0; d < 4; d++) {
        if (d !== ci && defOn[d] && random(1) < (0.35 - weaken * 0.5)) {
          shortened = true;
          break;
        }
      }
    }
    outcomes.push({ time: e.time, type: e.type, caught: caught, shortened: shortened });
  }

  // compute stats
  let captures = outcomes.filter(o => o.caught === null);
  let lost = 0;
  for (const c of captures) lost += (c.shortened ? c.type.cost * 0.4 : c.type.cost) + 1; // +1 re-entry toll
  lost = min(lost, 55);
  const focused = 60 - lost;

  // longest unbroken segment
  const capTimes = captures.map(c => c.time).sort((a, b) => a - b);
  let longest = 0, prev = 0;
  for (const t of capTimes) { longest = max(longest, t - prev); prev = t; }
  longest = max(longest, 60 - prev);

  return {
    config: defOn.slice(),
    bad: badDay,
    events: outcomes,
    focused: focused,
    captures: captures.length,
    longest: longest,
    reentry: captures.length // ~1 min each
  };
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  runButton = createButton('Run hour');
  runButton.position(10, drawHeight + 8);
  runButton.parent(document.querySelector('main'));
  runButton.mousePressed(() => {
    run = simulate();
    runs.push(run);
    if (runs.length > 4) runs.shift();
    revealT = 0;
  });

  const positions = [
    { x: 100, y: drawHeight + 10 },
    { x: 300, y: drawHeight + 10 },
    { x: 100, y: drawHeight + 45 },
    { x: 300, y: drawHeight + 45 }
  ];
  for (let i = 0; i < 4; i++) {
    const cb = createCheckbox(' ' + DEFENSES[i].name, false);
    cb.position(positions[i].x, positions[i].y);
    cb.parent(document.querySelector('main'));
    const idx = i;
    cb.changed(() => { defOn[idx] = cb.checked(); });
    checkboxes.push(cb);
  }

  badDayBox = createCheckbox(' Bad day', false);
  badDayBox.position(10, drawHeight + 45);
  badDayBox.parent(document.querySelector('main'));
  badDayBox.changed(() => { badDay = badDayBox.checked(); });

  describe('Simulated one-hour work session shown as a timeline. Toggle four defenses - distance, friction, silence, urgency - and run the hour: capture events break the green focus bar with labels, and each active defense shows which attempts it caught. A results readout gives focused minutes, captures, longest unbroken segment, and re-entry toll, with a strip comparing the last four runs.', LABEL);
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
  text('Distraction Defense Lab', canvasWidth / 2, 8);
  textSize(defaultTextSize);

  if (run) {
    if (revealT < 1) revealT = min(1, revealT + 0.012);
    drawTimeline();
    drawReadout();
  } else {
    fill(255, 255, 255, 238);
    stroke(200);
    rect(canvasWidth / 2 - 210, 130, 420, 80, 12);
    noStroke();
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(14);
    text('Choose your defenses below, then press "Run hour".\nFirst try it with NO defenses for an honest baseline.', canvasWidth / 2, 170);
    textSize(defaultTextSize);
  }
  drawComparison();

  // control label
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(12);
  textSize(defaultTextSize);
}

function drawTimeline() {
  const tx = 40, tw = canvasWidth - 80, ty = 60, th = 34;
  // base bar (focus)
  stroke('silver');
  strokeWeight(1);
  fill('#dfeede');
  rect(tx, ty, tw * revealT, th, 4);
  noStroke();

  // captures
  for (const e of run.events) {
    const x = tx + (e.time / 60) * tw;
    if ((e.time / 60) > revealT) continue;
    if (e.caught !== null) {
      // caught: small shield tick
      fill(60, 120, 80);
      triangle(x - 4, ty + th + 12, x + 4, ty + th + 12, x, ty + th + 2);
    } else {
      const w = ((e.shortened ? e.type.cost * 0.4 : e.type.cost) / 60) * tw;
      fill(e.shortened ? color(235, 180, 120) : color(215, 100, 80));
      rect(x, ty, min(w, tx + tw - x), th, 2);
    }
  }

  // axis labels
  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, TOP);
  text('0 min', tx, ty + th + 18);
  textAlign(RIGHT, TOP);
  text('60 min', tx + tw, ty + th + 18);
  textAlign(CENTER, TOP);
  text('green = focused   red = captured   orange = shortened   ▲ = a defense caught it', canvasWidth / 2, ty + th + 18);
  textSize(defaultTextSize);

  // event log (last few, revealed progressively)
  const visible = run.events.filter(e => (e.time / 60) <= revealT);
  const logY = ty + th + 44;
  fill(255, 255, 255, 235);
  stroke(215);
  rect(tx, logY, tw, 96, 8);
  noStroke();
  textSize(11);
  textAlign(LEFT, TOP);
  let y = logY + 8;
  for (const e of visible.slice(-5)) {
    if (e.caught !== null) {
      fill(60, 120, 80);
      text(nf(e.time, 1, 0) + ' min: ' + e.type.name + ' — caught by ' + DEFENSES[e.caught].name.split(' (')[0].toLowerCase(), tx + 10, y);
    } else if (e.shortened) {
      fill(190, 130, 50);
      text(nf(e.time, 1, 0) + ' min: ' + e.type.label + ' — shortened by another layer', tx + 10, y);
    } else {
      fill(180, 70, 55);
      text(nf(e.time, 1, 0) + ' min: ' + e.type.label + ' (' + e.type.cost + ' min + re-entry)', tx + 10, y);
    }
    y += 17;
  }
  textSize(defaultTextSize);
}

function drawReadout() {
  if (revealT < 1) return;
  const bw = min(430, canvasWidth - 80);
  const bx = (canvasWidth - bw) / 2, by = 258;
  fill(255, 255, 255, 242);
  stroke(180);
  rect(bx, by, bw, 62, 10);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  fill('black');
  text('Focused: ' + nf(run.focused, 1, 0) + ' of 60 min      Captures: ' + run.captures +
    '      Longest unbroken: ' + nf(run.longest, 1, 0) + ' min', bx + 12, by + 9);
  fill('#666666');
  text('Re-entry toll paid: ~' + run.reentry + ' min (finding your place again after each capture)', bx + 12, by + 27);
  fill(run.focused > 40 ? 'seagreen' : (run.focused > 25 ? 'chocolate' : 'firebrick'));
  text(run.focused > 40 ? 'Strong hour. Note which layer caught what.' : (run.focused > 25 ? 'Partial protection - one layer is not a stack.' : 'This is the honest baseline. Add layers and re-run.'), bx + 12, by + 45);
  textSize(defaultTextSize);
}

function drawComparison() {
  if (runs.length === 0) return;
  const sy = 336, sh = 52;
  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, TOP);
  text('Your last runs:', 40, sy - 14);
  const cw = (canvasWidth - 80) / 4;
  for (let i = 0; i < runs.length; i++) {
    const r = runs[i];
    const x = 40 + i * cw;
    fill('white');
    stroke(r === run ? 'black' : 'silver');
    strokeWeight(r === run ? 2 : 1);
    rect(x, sy, cw - 8, sh, 8);
    noStroke();
    // config icons
    textSize(10);
    fill('#555555');
    const cfg = DEFENSES.map((d, j) => r.config[j] ? d.short : null).filter(Boolean).join('+') || 'none';
    text(cfg + (r.bad ? ' (bad day)' : ''), x + 6, sy + 5, cw - 18, 14);
    // focused bar
    fill('#dfeede');
    stroke('silver');
    strokeWeight(1);
    rect(x + 6, sy + 24, cw - 20, 10, 3);
    noStroke();
    fill(80, 140, 90);
    rect(x + 6, sy + 24, (cw - 20) * (r.focused / 60), 10, 3);
    fill('black');
    textSize(10);
    text(nf(r.focused, 1, 0) + ' min focused, ' + r.captures + ' captures', x + 6, sy + 37, cw - 16, 14);
  }
  textSize(defaultTextSize);
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
