// Attention Spotlight Simulator
// CANVAS_HEIGHT: 480
// Learners steer an attention spotlight, hold it on a target task, resist
// capture by pulsing distractors, and (optionally) practice task switching.
// Teaches: attention is a set of skills - selecting, sustaining, resisting
// capture, and shifting (Understanding ADHD, Chapter 1).
// MicroSim template version 2026.03

// global variables for width and height
let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80; // 2 rows x 35 + 10
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 300; // two buttons + label/value text before slider
let defaultTextSize = 16;

// session state
let isRunning = false;
let sessionFrames = 0;
const SESSION_SECONDS = 60;
let sessionOver = false;

// spotlight
let spotX = 200, spotY = 200;
const SPOT_R = 70;
let capturedBy = -1;        // index of the item holding the beam, -1 = free
let captureFramesLeft = 0;
let captureCount = 0;
let captionText = '';
let captionFrames = 0;

// focus tracking
let focusFrames = 0;

// task switching
let taskSwitchOn = false;
let targetIdx = 0;          // index into items[] of the current target
let shiftCueFrame = -1;     // frame when target switched
let shiftCosts = [];        // seconds from switch to re-settling

// stage items: relative positions (fx, fy are fractions of stage size)
let items = [
  { label: 'The form',   fx: 0.30, fy: 0.55, target: true,  distractor: false },
  { label: 'The stove',  fx: 0.72, fy: 0.30, target: false, distractor: false },
  { label: 'Phone',      fx: 0.55, fy: 0.70, target: false, distractor: true },
  { label: 'TV',         fx: 0.15, fy: 0.25, target: false, distractor: true },
  { label: 'Chatter',    fx: 0.48, fy: 0.22, target: false, distractor: true },
  { label: 'Window',     fx: 0.85, fy: 0.60, target: false, distractor: true },
  { label: 'Clock',      fx: 0.70, fy: 0.82, target: false, distractor: true },
  { label: 'Snack',      fx: 0.12, fy: 0.78, target: false, distractor: true }
];
let pulse = [];             // per-item pulse intensity 0..1

// controls
let startButton, resetButton, distractionSlider, switchCheckbox;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  startButton = createButton('Start');
  startButton.position(10, drawHeight + 8);
  startButton.parent(document.querySelector('main'));
  startButton.mousePressed(toggleSession);

  resetButton = createButton('Reset');
  resetButton.position(80, drawHeight + 8);
  resetButton.parent(document.querySelector('main'));
  resetButton.mousePressed(resetSession);

  distractionSlider = createSlider(0, 10, 5, 1);
  distractionSlider.position(sliderLeftMargin, drawHeight + 10);
  distractionSlider.size(canvasWidth - sliderLeftMargin - margin);
  distractionSlider.parent(document.querySelector('main'));

  switchCheckbox = createCheckbox(' Task switch mode (target moves every 15 s)', false);
  switchCheckbox.position(10, drawHeight + 47);
  switchCheckbox.parent(document.querySelector('main'));
  switchCheckbox.changed(() => { taskSwitchOn = switchCheckbox.checked(); });

  for (let i = 0; i < items.length; i++) pulse.push(0);

  describe('Interactive attention spotlight simulation. Drag a spotlight to keep a target task lit while pulsing distractors try to capture the beam. Sliders control distraction intensity; a checkbox adds task switching. A summary reports time on target, captures, and shift cost.', LABEL);
}

function draw() {
  updateCanvasSize();

  // drawing region
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  // control region
  fill('white');
  rect(0, drawHeight, canvasWidth, canvasHeight - drawHeight);
  noStroke();

  // title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22);
  text('Attention Spotlight Simulator', canvasWidth / 2, 8);
  textSize(defaultTextSize);

  const secondsLeft = max(0, SESSION_SECONDS - sessionFrames / 60);

  if (isRunning && !sessionOver) {
    sessionFrames++;
    if (sessionFrames >= SESSION_SECONDS * 60) endSession();
    runDistractors();
    runTaskSwitch();
    moveSpotlight();
    scoreFrame();
  }

  drawStage();
  drawSpotlight();
  drawHud(secondsLeft);
  if (sessionOver) drawSummary();

  // control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  text('Distraction: ' + distractionSlider.value(), 160, drawHeight + 20);
}

// ---- session mechanics ----

function toggleSession() {
  if (sessionOver) resetSession();
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Pause' : 'Start');
}

function resetSession() {
  isRunning = false;
  sessionOver = false;
  sessionFrames = 0;
  focusFrames = 0;
  captureCount = 0;
  capturedBy = -1;
  captureFramesLeft = 0;
  captionText = '';
  captionFrames = 0;
  targetIdx = 0;
  shiftCueFrame = -1;
  shiftCosts = [];
  items[0].target = true;
  items[1].target = false;
  startButton.html('Start');
}

function endSession() {
  isRunning = false;
  sessionOver = true;
  startButton.html('Start');
}

function runDistractors() {
  const intensity = distractionSlider.value(); // 0..10
  for (let i = 0; i < items.length; i++) {
    if (!items[i].distractor) { pulse[i] = 0; continue; }
    // random pulses; more intensity = more frequent and stronger
    if (pulse[i] <= 0 && random(1000) < intensity * 1.2) {
      pulse[i] = 1;
    }
    if (pulse[i] > 0) pulse[i] -= 0.008;
  }
}

function runTaskSwitch() {
  if (!taskSwitchOn) return;
  // switch target between the form (0) and the stove (1) every 15 s
  if (sessionFrames > 0 && sessionFrames % (15 * 60) === 0) {
    targetIdx = (targetIdx === 0) ? 1 : 0;
    items[0].target = (targetIdx === 0);
    items[1].target = (targetIdx === 1);
    shiftCueFrame = sessionFrames;
    setCaption('Switch! New target: ' + items[targetIdx].label);
  }
}

function moveSpotlight() {
  // captured beam sticks to its captor for a while
  if (capturedBy >= 0) {
    const p = itemPos(capturedBy);
    spotX = lerp(spotX, p.x, 0.2);
    spotY = lerp(spotY, p.y, 0.2);
    captureFramesLeft--;
    if (captureFramesLeft <= 0) capturedBy = -1;
    return;
  }
  // free beam follows the mouse while it is over the drawing region
  if (mouseY > 0 && mouseY < drawHeight && mouseX > 0 && mouseX < canvasWidth) {
    spotX = lerp(spotX, mouseX, 0.25);
    spotY = lerp(spotY, mouseY, 0.25);
  }
  // capture check: a pulsing distractor near the beam grabs it
  for (let i = 0; i < items.length; i++) {
    if (!items[i].distractor || pulse[i] < 0.5) continue;
    const p = itemPos(i);
    if (dist(spotX, spotY, p.x, p.y) < SPOT_R + 12) {
      capturedBy = i;
      captureFramesLeft = 120; // 2 seconds of stickiness
      captureCount++;
      setCaption('Capture: ' + items[i].label + ' pulled the spotlight');
      break;
    }
  }
}

function scoreFrame() {
  const t = itemPos(targetIdx);
  const onTarget = dist(spotX, spotY, t.x, t.y) < SPOT_R;
  if (onTarget) {
    focusFrames++;
    // settled after a switch: record the shift cost once
    if (shiftCueFrame >= 0) {
      shiftCosts.push((sessionFrames - shiftCueFrame) / 60);
      shiftCueFrame = -1;
    }
  }
}

function setCaption(msg) {
  captionText = msg;
  captionFrames = 150;
}

// ---- drawing helpers ----

function itemPos(i) {
  return {
    x: items[i].fx * canvasWidth,
    y: 50 + items[i].fy * (drawHeight - 100)
  };
}

function drawStage() {
  for (let i = 0; i < items.length; i++) {
    const p = itemPos(i);
    const lit = dist(spotX, spotY, p.x, p.y) < SPOT_R;
    const pulseGlow = items[i].distractor ? pulse[i] : 0;

    // pulsing halo for active distractors
    if (pulseGlow > 0) {
      noStroke();
      fill(255, 120, 60, 90 * pulseGlow);
      circle(p.x, p.y, 60 + 30 * pulseGlow);
    }

    // item body
    if (items[i].target) {
      stroke('green');
      strokeWeight(3);
    } else {
      stroke('gray');
      strokeWeight(1);
    }
    fill(lit ? 'lightyellow' : 'gainsboro');
    circle(p.x, p.y, 44);

    noStroke();
    fill(lit ? 'black' : 'dimgray');
    textAlign(CENTER, CENTER);
    textSize(13);
    text(items[i].label, p.x, p.y + 36);
    textSize(defaultTextSize);
  }
}

function drawSpotlight() {
  // beam
  noFill();
  stroke(capturedBy >= 0 ? 'orangered' : 'goldenrod');
  strokeWeight(3);
  circle(spotX, spotY, SPOT_R * 2);
  noStroke();
  fill(255, 236, 150, 40);
  circle(spotX, spotY, SPOT_R * 2);
}

function drawHud(secondsLeft) {
  // focus meter
  const meterW = 160;
  const pct = sessionFrames > 0 ? focusFrames / sessionFrames : 0;
  noStroke();
  fill(255, 255, 255, 230);
  stroke(200);
  rect(canvasWidth - meterW - 15, 36, meterW, 58, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Time on target: ' + nf(pct * 100, 1, 0) + '%', canvasWidth - meterW - 5, 42);
  text('Captures: ' + captureCount, canvasWidth - meterW - 5, 58);
  text('Time left: ' + nf(secondsLeft, 1, 0) + ' s', canvasWidth - meterW - 5, 74);
  textSize(defaultTextSize);

  // capture / switch caption
  if (captionFrames > 0) {
    captionFrames--;
    fill(255, 255, 255, 235);
    stroke(200);
    rect(canvasWidth / 2 - 170, drawHeight - 44, 340, 30, 10);
    noStroke();
    fill('firebrick');
    textAlign(CENTER, CENTER);
    textSize(14);
    text(captionText, canvasWidth / 2, drawHeight - 29);
    textSize(defaultTextSize);
  }

  // idle hint
  if (!isRunning && !sessionOver && sessionFrames === 0) {
    fill(255, 255, 255, 235);
    stroke(200);
    rect(canvasWidth / 2 - 190, drawHeight / 2 - 26, 380, 52, 10);
    noStroke();
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(14);
    text('Press Start, then keep the spotlight (your mouse)\non the green-ringed target for 60 seconds.', canvasWidth / 2, drawHeight / 2);
    textSize(defaultTextSize);
  }
}

function drawSummary() {
  const pct = sessionFrames > 0 ? focusFrames / sessionFrames : 0;
  const avgShift = shiftCosts.length > 0
    ? shiftCosts.reduce((a, b) => a + b, 0) / shiftCosts.length : 0;
  fill(255, 255, 255, 245);
  stroke(180);
  rect(canvasWidth / 2 - 200, drawHeight / 2 - 80, 400, 160, 12);
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(18);
  text('Session summary', canvasWidth / 2, drawHeight / 2 - 68);
  textSize(14);
  textAlign(LEFT, TOP);
  const lx = canvasWidth / 2 - 180;
  text('Time on target: ' + nf(pct * 100, 1, 0) + '%  (sustaining)', lx, drawHeight / 2 - 38);
  text('Captures: ' + captureCount + '  (resisting capture)', lx, drawHeight / 2 - 16);
  if (shiftCosts.length > 0) {
    text('Average shift cost: ' + nf(avgShift, 1, 1) + ' s  (shifting)', lx, drawHeight / 2 + 6);
  } else {
    text('Shift cost: no task switches this run  (shifting)', lx, drawHeight / 2 + 6);
  }
  text('Raise Distraction and try again - same task, higher load.', lx, drawHeight / 2 + 34);
  textSize(defaultTextSize);
}

// ---- responsiveness ----

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  distractionSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
