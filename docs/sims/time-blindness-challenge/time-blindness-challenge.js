// Time Blindness Challenge
// CANVAS_HEIGHT: 450
// Three rounds that measure the learner's felt time against actual time:
// (1) click when you think 30 seconds have passed, while drifting shapes
// distract; (2) do an engaging click-the-numbers task, then estimate how
// long it took; (3) predict how long a repeat will take, then do it.
// A results panel accumulates felt-vs-actual with signed errors; a visible
// clock toggle demonstrates externalized time removing the error.
// Demonstration, not a diagnostic test. (Understanding ADHD, Chapter 3.)
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50; // 1 row
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// state machine
// idle -> r1 -> r1done -> r2 -> r2estimate -> r3predict -> r3 -> summary
let state = 'idle';
let startFrame = 0;
let results = []; // {round, felt, actual}

// round 2/3: click-the-numbers task
let targets = [];
let nextTarget = 1;
const N_TARGETS = 12;
let r2actual = 0, r3predict = 0, r3actual = 0;

// drifting distractor shapes for round 1
let drifters = [];

let actionButton, resetButton, clockCheckbox;
let showClock = false;

// estimate scale interaction
let scaleHover = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  actionButton = createButton('Start Round 1');
  actionButton.position(10, drawHeight + 10);
  actionButton.parent(document.querySelector('main'));
  actionButton.mousePressed(advance);

  resetButton = createButton('Reset');
  resetButton.position(130, drawHeight + 10);
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetAll);

  clockCheckbox = createCheckbox(' Visible clock (round 2/3)', false);
  clockCheckbox.position(210, drawHeight + 14);
  clockCheckbox.parent(document.querySelector('main'));
  clockCheckbox.changed(() => { showClock = clockCheckbox.checked(); });

  for (let i = 0; i < 14; i++) {
    drifters.push({ x: random(1), y: random(1), r: random(14, 42), dx: random(-0.4, 0.4), dy: random(-0.3, 0.3), c: random(120, 220) });
  }

  describe('Three timed rounds comparing felt time to actual time: waiting out thirty seconds among drifting distractor shapes, judging the duration of an engaging click-the-numbers task, and predicting a repeat. A results panel shows signed errors, and a visible-clock toggle demonstrates that externalized time removes the error. A demonstration, not a test.', LABEL);
}

function elapsedSec() { return (frameCount - startFrame) / 60; }

function advance() {
  if (state === 'idle') { state = 'r1'; startFrame = frameCount; actionButton.html('...waiting...'); }
  else if (state === 'r1done') { buildTargets(); state = 'r2'; startFrame = frameCount; actionButton.html('...clicking...'); }
  else if (state === 'r3predict') { /* needs scale click, ignore */ }
  else if (state === 'summary') { resetAll(); }
}

function resetAll() {
  state = 'idle';
  results = [];
  nextTarget = 1;
  actionButton.html('Start Round 1');
}

function buildTargets() {
  targets = [];
  nextTarget = 1;
  for (let n = 1; n <= N_TARGETS; n++) {
    targets.push({
      n: n,
      fx: random(0.08, 0.92),
      fy: random(0.18, 0.9),
      hit: false
    });
  }
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
  text('Time Blindness Challenge', canvasWidth / 2, 8);
  textSize(defaultTextSize);

  drawResultsPanel();

  if (state === 'idle') {
    centerMsg('Round 1: press Start, then click anywhere\nwhen you think 30 seconds have passed.\nNo counting allowed - just feel it.');
  } else if (state === 'r1') {
    runDrifters();
    centerMsg('Click when you feel 30 seconds have passed...');
  } else if (state === 'r1done') {
    centerMsg('Round 2: click the numbers 1 to ' + N_TARGETS + ' in order,\nas fast as you can. Afterward you\'ll estimate\nhow long it took. Press the button to begin.');
    actionButton.html('Start Round 2');
  } else if (state === 'r2') {
    drawTargets();
    if (showClock) drawClock();
  } else if (state === 'r2estimate') {
    drawEstimateScale('Round 2 took... (click the scale)', 5, 60);
  } else if (state === 'r3predict') {
    drawEstimateScale('Predict: how long will a REPEAT of the same task take?', 5, 60);
  } else if (state === 'r3') {
    drawTargets();
    if (showClock) drawClock();
  } else if (state === 'summary') {
    drawSummary();
    actionButton.html('Play again');
  }
}

function centerMsg(msg) {
  fill(255, 255, 255, 238);
  stroke(200);
  rect(canvasWidth / 2 - 210, 130, 420, 92, 12);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(14);
  text(msg, canvasWidth / 2, 176);
  textSize(defaultTextSize);
}

function runDrifters() {
  noStroke();
  for (const d of drifters) {
    d.x = (d.x + d.dx / 200 + 1) % 1;
    d.y = (d.y + d.dy / 200 + 1) % 1;
    fill(d.c, d.c, 240, 70);
    circle(d.x * canvasWidth, 40 + d.y * (drawHeight - 80), d.r);
  }
}

function drawTargets() {
  for (const t of targets) {
    if (t.hit) continue;
    const x = t.fx * canvasWidth, y = t.fy * (drawHeight - 60) + 40;
    const isNext = t.n === nextTarget;
    stroke(isNext ? 'seagreen' : 'silver');
    strokeWeight(isNext ? 2.5 : 1);
    fill(isNext ? 'honeydew' : 'white');
    circle(x, y, 38);
    noStroke();
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(15);
    text(t.n, x, y);
    textSize(defaultTextSize);
  }
  noStroke();
  fill('dimgray');
  textAlign(CENTER, TOP);
  textSize(12);
  text('Click ' + nextTarget + ' next', canvasWidth / 2, 30);
  textSize(defaultTextSize);
}

function drawClock() {
  fill(255, 255, 255, 240);
  stroke(180);
  rect(canvasWidth - 110, 30, 92, 30, 8);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(15);
  text(nf(elapsedSec(), 1, 1) + ' s', canvasWidth - 64, 45);
  textSize(defaultTextSize);
}

function scaleRect() {
  return { x: 60, y: 250, w: canvasWidth - 120, h: 14 };
}

function drawEstimateScale(prompt, lo, hi) {
  centerMsgAt(prompt, 180);
  const r = scaleRect();
  stroke('gray');
  strokeWeight(2);
  line(r.x, r.y + r.h / 2, r.x + r.w, r.y + r.h / 2);
  noStroke();
  fill('dimgray');
  textSize(11);
  for (let s = lo; s <= hi; s += 5) {
    const x = map(s, lo, hi, r.x, r.x + r.w);
    stroke('gray');
    line(x, r.y, x, r.y + r.h);
    noStroke();
    textAlign(CENTER, TOP);
    text(s + 's', x, r.y + r.h + 4);
  }
  // hover marker
  if (mouseY > r.y - 20 && mouseY < r.y + 40 && mouseX > r.x && mouseX < r.x + r.w) {
    const val = map(mouseX, r.x, r.x + r.w, lo, hi);
    fill('seagreen');
    circle(mouseX, r.y + r.h / 2, 12);
    textAlign(CENTER, BOTTOM);
    textSize(13);
    text(nf(val, 1, 0) + ' s', mouseX, r.y - 8);
  }
  textSize(defaultTextSize);
}

function centerMsgAt(msg, y) {
  fill(255, 255, 255, 238);
  stroke(200);
  rect(canvasWidth / 2 - 220, y - 40, 440, 54, 12);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(14);
  text(msg, canvasWidth / 2, y - 13);
  textSize(defaultTextSize);
}

function drawResultsPanel() {
  const bw = 250;
  fill(255, 255, 255, 235);
  stroke(210);
  rect(canvasWidth - bw - 10, drawHeight - 110, bw, 100, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(12);
  text('Felt vs actual', canvasWidth - bw + 2, drawHeight - 103);
  let y = drawHeight - 85;
  textSize(11.5);
  for (const res of results) {
    const err = res.felt - res.actual;
    fill('#333333');
    text(res.round + ': felt ' + nf(res.felt, 1, 0) + 's / actual ' + nf(res.actual, 1, 0) + 's', canvasWidth - bw + 2, y);
    fill(abs(err) < 4 ? 'seagreen' : 'firebrick');
    text((err > 0 ? '+' : '') + nf(err, 1, 0) + 's', canvasWidth - 48, y);
    y += 18;
  }
  if (results.length === 0) {
    fill('gray');
    text('(no rounds yet)', canvasWidth - bw + 2, y);
  }
  textSize(defaultTextSize);
}

function drawSummary() {
  fill(255, 255, 255, 246);
  stroke(150);
  rect(canvasWidth / 2 - 230, 60, 460, 210, 12);
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(17);
  text('Your time sense, measured', canvasWidth / 2, 72);
  textAlign(LEFT, TOP);
  textSize(12.5);
  const lx = canvasWidth / 2 - 210;
  let y = 104;
  for (const res of results) {
    const err = res.felt - res.actual;
    text(res.round + ': felt ' + nf(res.felt, 1, 0) + 's, actual ' + nf(res.actual, 1, 0) + 's (' + (err > 0 ? 'overestimated' : 'underestimated') + ' by ' + nf(abs(err), 1, 0) + 's)', lx, y, 430, 34);
    y += 26;
  }
  y += 6;
  fill('#444444');
  text('Engaging tasks compress felt time ("time flies") - that is the 5:52 shower in miniature. The fix is not feeling harder: turn on the visible clock and replay round 2 - the error shrinks to nothing. Externalized time beats felt time.', lx, y, 430, 90);
  textSize(defaultTextSize);
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;

  if (state === 'r1') {
    results.push({ round: 'R1 wait 30s', felt: 30, actual: elapsedSec() });
    state = 'r1done';
    return;
  }
  if (state === 'r2' || state === 'r3') {
    for (const t of targets) {
      if (t.hit || t.n !== nextTarget) continue;
      const x = t.fx * canvasWidth, y = t.fy * (drawHeight - 60) + 40;
      if (dist(mouseX, mouseY, x, y) < 22) {
        t.hit = true;
        nextTarget++;
        if (nextTarget > N_TARGETS) {
          if (state === 'r2') {
            r2actual = elapsedSec();
            state = 'r2estimate';
            actionButton.html('(click the scale)');
          } else {
            r3actual = elapsedSec();
            results.push({ round: 'R3 predicted', felt: r3predict, actual: r3actual });
            state = 'summary';
          }
        }
        return;
      }
    }
    return;
  }
  if (state === 'r2estimate' || state === 'r3predict') {
    const r = scaleRect();
    if (mouseY > r.y - 20 && mouseY < r.y + 40 && mouseX > r.x && mouseX < r.x + r.w) {
      const val = map(mouseX, r.x, r.x + r.w, 5, 60);
      if (state === 'r2estimate') {
        results.push({ round: 'R2 task felt', felt: val, actual: r2actual });
        state = 'r3predict';
      } else {
        r3predict = val;
        buildTargets();
        state = 'r3';
        startFrame = frameCount;
        actionButton.html('...clicking...');
      }
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
