// Reward Discounting Simulator
// CANVAS_HEIGHT: 480
// Delay discounting made manipulable: drag a reward marker along the delay
// axis and watch its motivational value collapse under an ADHD-steep
// hyperbolic curve versus a typical one. A motivation threshold shows where
// tasks stop starting, and four intervention chips rescue a below-threshold
// task - each explaining its mechanism. Apply-level (L3).
// (Understanding ADHD, Chapter 2.)
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80; // 2 rows: scenario select + typical toggle; chips
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// plot geometry
let plotL = 62, plotR = 20, plotT = 56, plotB = 52;
const MAX_DELAY = 60; // days
const THRESHOLD = 30; // motivational value below which the task doesn't start

// hyperbolic discounting: V = A / (1 + k*D)
const K_TYPICAL = 0.03;
const K_ADHD = 0.35;

// reward marker (learner-set)
let rewardA = 80;   // value at zero delay (0-100)
let rewardD = 21;   // delay in days
let dragging = false;

// interventions
const CHIPS = [
  { label: 'Today-sized piece', on: false,
    mech: 'Breaking off a piece due today moves the payoff near zero delay - the curve barely discounts it.' },
  { label: 'Body double / audience', on: false,
    mech: 'A person present adds social currency and arousal - the whole curve lifts.' },
  { label: 'Make it novel / a game', on: false,
    mech: 'Interest and novelty are currencies this reward system accepts - the curve lifts.' },
  { label: 'Deadline tomorrow', on: false,
    mech: 'A manufactured near deadline moves the consequence into motivational range.' }
];

const SCENARIOS = [
  { name: 'Assignment due in 3 weeks', A: 80, D: 21 },
  { name: 'Gym habit (payoff in months)', A: 70, D: 55 },
  { name: 'Renew registration (due in 10 days)', A: 60, D: 10 },
  { name: 'Custom (drag the marker)', A: 80, D: 21 }
];

let scenarioSelect, typicalCheckbox;
let showTypical = true;
let chipRects = [];

function effective() {
  // apply interventions to delay and amplitude
  let A = rewardA, D = rewardD;
  if (CHIPS[0].on) D = min(D, 0.5);
  if (CHIPS[3].on) D = min(D, 1);
  let mult = 1;
  if (CHIPS[1].on) mult *= 1.6;
  if (CHIPS[2].on) mult *= 1.5;
  return { A: min(100, A * mult), D: D };
}

function valueAt(A, D, k) { return A / (1 + k * D); }

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  scenarioSelect = createSelect();
  SCENARIOS.forEach(s => scenarioSelect.option(s.name));
  scenarioSelect.position(10, drawHeight + 8);
  scenarioSelect.parent(document.querySelector('main'));
  scenarioSelect.changed(() => {
    const s = SCENARIOS.find(x => x.name === scenarioSelect.value());
    if (s) { rewardA = s.A; rewardD = s.D; CHIPS.forEach(c => c.on = false); }
  });

  typicalCheckbox = createCheckbox(' Show typical curve', true);
  typicalCheckbox.position(canvasWidth - 190, drawHeight + 10);
  typicalCheckbox.parent(document.querySelector('main'));
  typicalCheckbox.changed(() => { showTypical = typicalCheckbox.checked(); });

  describe('Graph of motivational value versus delay. A gray gentle curve shows typical delay discounting; an orange steep curve shows ADHD discounting. Drag the reward marker to set its delay; readouts show its value under each curve against a motivation threshold. Four intervention buttons - today-sized piece, body double, make it a game, deadline tomorrow - visibly rescue a below-threshold task and explain the mechanism.', LABEL);
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
  text('Why "Important" Loses to "Now"', canvasWidth / 2, 8);
  textSize(defaultTextSize);

  handleDrag();
  drawAxes();
  drawThreshold();
  const eff = effective();
  if (showTypical) drawCurve(eff.A, K_TYPICAL, color(130));
  drawCurve(eff.A, K_ADHD, color(230, 126, 34));
  drawMarker(eff);
  drawReadout(eff);
  drawChips();
}

function px(d) { return map(d, 0, MAX_DELAY, plotL, canvasWidth - plotR); }
function py(v) { return map(v, 0, 100, drawHeight - plotB, plotT); }

function drawAxes() {
  stroke('gray');
  strokeWeight(1);
  line(plotL, plotT - 8, plotL, drawHeight - plotB);
  line(plotL, drawHeight - plotB, canvasWidth - plotR, drawHeight - plotB);
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(CENTER, TOP);
  const ticks = [0, 7, 14, 21, 30, 45, 60];
  for (const t of ticks) text(t === 0 ? 'now' : t + 'd', px(t), drawHeight - plotB + 5);
  textAlign(RIGHT, CENTER);
  for (let v = 0; v <= 100; v += 25) text(v, plotL - 6, py(v));
  textAlign(CENTER, TOP);
  text('delay until payoff', (plotL + canvasWidth - plotR) / 2, drawHeight - 24);
  push();
  translate(16, (plotT + drawHeight - plotB) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('motivational value', 0, 0);
  pop();
  textSize(defaultTextSize);
}

function drawThreshold() {
  stroke(150, 60, 60);
  strokeWeight(1.5);
  drawingContext.setLineDash([7, 5]);
  line(plotL, py(THRESHOLD), canvasWidth - plotR, py(THRESHOLD));
  drawingContext.setLineDash([]);
  noStroke();
  fill(150, 60, 60);
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text('motivation threshold - below this, the task doesn\'t start', plotL + 6, py(THRESHOLD) - 3);
  textSize(defaultTextSize);
}

function drawCurve(A, k, col) {
  stroke(col);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let d = 0; d <= MAX_DELAY; d += 0.5) vertex(px(d), py(valueAt(A, d, k)));
  endShape();
  noStroke();
  // threshold crossing marker
  const dCross = (A / THRESHOLD - 1) / k;
  if (dCross > 0 && dCross < MAX_DELAY) {
    fill(col);
    circle(px(dCross), py(THRESHOLD), 7);
    textSize(10.5);
    textAlign(CENTER, TOP);
    fill(col);
    text(nf(dCross, 1, 0) + 'd', px(dCross), py(THRESHOLD) + 6);
    textSize(defaultTextSize);
  }
}

function drawMarker(eff) {
  const x = px(rewardD), y = py(valueAt(eff.A, eff.D, K_ADHD));
  // stem showing the full (undiscounted) size at its delay
  stroke(200);
  strokeWeight(1);
  line(x, py(0), x, py(eff.A));
  noStroke();
  fill(60, 90, 150, 60);
  circle(x, py(eff.A), 16);
  // the felt value under ADHD curve
  fill(230, 126, 34);
  stroke('white');
  strokeWeight(2);
  circle(x, y, dragging ? 20 : 16);
  noStroke();
  fill('dimgray');
  textSize(10.5);
  textAlign(CENTER, BOTTOM);
  text('drag me', x, py(eff.A) - 10);
  textSize(defaultTextSize);
}

function drawReadout(eff) {
  const vA = valueAt(eff.A, eff.D, K_ADHD);
  const vT = valueAt(eff.A, eff.D, K_TYPICAL);
  const bw = 205, bh = 88;
  const bx = canvasWidth - bw - 18, by = plotT + 2;
  fill(255, 255, 255, 240);
  stroke(200);
  rect(bx, by, bw, bh, 10);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(12);
  fill('black');
  text('Reward size: ' + round(eff.A) + '   Delay: ' + nf(eff.D, 1, 1) + 'd', bx + 10, by + 8);
  fill(120);
  text('Typical brain feels: ' + nf(vT, 1, 0), bx + 10, by + 26);
  fill(200, 100, 20);
  text('ADHD brain feels: ' + nf(vA, 1, 0), bx + 10, by + 44);
  fill(vA >= THRESHOLD ? 'seagreen' : 'firebrick');
  text(vA >= THRESHOLD ? 'Above threshold: it starts' : 'Below threshold: it stalls', bx + 10, by + 62);
  textSize(defaultTextSize);

  // mechanism caption for last-toggled chip
  const active = CHIPS.filter(c => c.on);
  if (active.length > 0) {
    const msg = active[active.length - 1].mech;
    fill(255, 255, 255, 238);
    stroke(200);
    rect(plotL + 4, plotT + 2, min(300, canvasWidth - bw - plotL - 40), 66, 10);
    noStroke();
    fill('seagreen');
    textSize(11.5);
    textAlign(LEFT, TOP);
    text(msg, plotL + 12, plotT + 10, min(284, canvasWidth - bw - plotL - 56), 54);
    textSize(defaultTextSize);
  }
}

function drawChips() {
  chipRects = [];
  let x = 10;
  const y = drawHeight + 44;
  textSize(12);
  for (let i = 0; i < CHIPS.length; i++) {
    const w = textWidth(CHIPS[i].label) + 22;
    const r = { x: x, y: y, w: w, h: 26 };
    chipRects.push(r);
    stroke(CHIPS[i].on ? 'seagreen' : 'silver');
    strokeWeight(CHIPS[i].on ? 2 : 1);
    fill(CHIPS[i].on ? '#e4f1e6' : 'white');
    rect(r.x, r.y, r.w, r.h, 13);
    noStroke();
    fill(CHIPS[i].on ? 'seagreen' : '#333333');
    textAlign(CENTER, CENTER);
    text(CHIPS[i].label, r.x + r.w / 2, r.y + r.h / 2);
    x += w + 8;
  }
  textSize(defaultTextSize);
}

function handleDrag() {
  if (dragging) {
    rewardD = constrain(map(mouseX, plotL, canvasWidth - plotR, 0, MAX_DELAY), 0, MAX_DELAY);
    if (SCENARIOS.length) scenarioSelect.value('Custom (drag the marker)');
  }
}

function mousePressed() {
  // chips
  for (let i = 0; i < chipRects.length; i++) {
    const r = chipRects[i];
    if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) {
      CHIPS[i].on = !CHIPS[i].on;
      return;
    }
  }
  // marker drag (near the delay x anywhere in plot)
  if (mouseY > plotT && mouseY < drawHeight - plotB && abs(mouseX - px(rewardD)) < 24) {
    dragging = true;
  }
}

function mouseReleased() { dragging = false; }

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  typicalCheckbox.position(canvasWidth - 190, drawHeight + 10);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
