// Symptom and Presentation Explorer
// CANVAS_HEIGHT: 480
// The 18 DSM-5 ADHD symptoms as toggleable chips in two columns, with live
// counters, the diagnostic threshold (6 child / 5 adult), and the resulting
// presentation. Presets walk Marcus (hyperactive-impulsive), Elena
// (inattentive), and Devon at 9 vs 39 (presentation shift). Hovering any
// chip names the executive function underneath it.
// (Understanding ADHD, Chapters 1 and 3.)
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80; // 2 rows: preset buttons; adult checkbox
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const INATT = [
  { s: 'Careless mistakes', ef: 'self-monitoring' },
  { s: 'Trouble sustaining attention', ef: 'attention regulation' },
  { s: 'Doesn\'t seem to listen', ef: 'working memory' },
  { s: 'Doesn\'t follow through', ef: 'task initiation + prospective memory' },
  { s: 'Poor organization', ef: 'planning & prioritizing' },
  { s: 'Avoids sustained mental effort', ef: 'delay aversion' },
  { s: 'Loses things', ef: 'working memory (encoding)' },
  { s: 'Easily distracted', ef: 'resisting capture' },
  { s: 'Forgetful in daily activities', ef: 'prospective memory' }
];
const HYPIMP = [
  { s: 'Fidgets, squirms', ef: 'arousal regulation' },
  { s: 'Leaves seat', ef: 'response inhibition' },
  { s: 'Runs/climbs; restlessness', ef: 'arousal regulation' },
  { s: 'Can\'t do leisure quietly', ef: 'arousal regulation' },
  { s: '"Driven by a motor"', ef: 'arousal regulation' },
  { s: 'Talks excessively', ef: 'self-monitoring' },
  { s: 'Blurts answers', ef: 'response inhibition' },
  { s: 'Trouble waiting turns', ef: 'response inhibition + delay aversion' },
  { s: 'Interrupts, intrudes', ef: 'response inhibition + working memory' }
];

let inattOn = new Array(9).fill(false);
let hypOn = new Array(9).fill(false);
let adultMode = false;
let devonStage = 0; // 0 = not shown, 1 = age 9, 2 = age 39
let caption = 'Toggle symptoms, or load a preset below.';

let adultCheckbox, marcusBtn, elenaBtn, devonBtn, resetBtn;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  marcusBtn = createButton('Marcus, 9');
  marcusBtn.position(10, drawHeight + 8);
  marcusBtn.parent(document.querySelector('main'));
  marcusBtn.mousePressed(() => {
    reset(false);
    [0, 1, 2, 4, 6, 7].forEach(i => hypOn[i] = true);
    caption = 'Marcus, 9: six hyperactive-impulsive symptoms, few inattentive. The classic visible picture - flagged by November.';
  });

  elenaBtn = createButton('Elena, 15');
  elenaBtn.position(95, drawHeight + 8);
  elenaBtn.parent(document.querySelector('main'));
  elenaBtn.mousePressed(() => {
    reset(false);
    [1, 2, 3, 4, 5, 7, 8].forEach(i => inattOn[i] = true);
    caption = 'Elena, 15: seven inattentive symptoms, zero visible motor. Nobody is disrupted except her - and no referral comes.';
  });

  devonBtn = createButton('Devon 9 → 39');
  devonBtn.position(172, drawHeight + 8);
  devonBtn.parent(document.querySelector('main'));
  devonBtn.mousePressed(() => {
    if (devonStage !== 1) {
      reset(false);
      devonStage = 1;
      [0, 1, 2, 4, 6, 7].forEach(i => hypOn[i] = true);
      [1, 3, 7].forEach(i => inattOn[i] = true);
      caption = 'Devon at 9: combined presentation - the motor is public. Click the button again to age him thirty years.';
    } else {
      reset(false);
      devonStage = 2;
      adultCheckbox.checked(true);
      adultMode = true;
      [0, 4].forEach(i => hypOn[i] = true); // fidgets, driven by a motor (internal)
      [1, 3, 4, 5, 8].forEach(i => inattOn[i] = true);
      caption = 'Devon at 39: visible chips unchecked, internal ones on. He "sits still now" - the presentation shifted, nothing was outgrown.';
    }
  });

  resetBtn = createButton('Reset');
  resetBtn.position(272, drawHeight + 8);
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(() => { reset(true); });

  adultCheckbox = createCheckbox(' Adult (17+): threshold drops from 6 to 5', false);
  adultCheckbox.position(10, drawHeight + 47);
  adultCheckbox.parent(document.querySelector('main'));
  adultCheckbox.changed(() => { adultMode = adultCheckbox.checked(); });

  describe('Two columns of nine toggleable symptom chips - inattentive and hyperactive-impulsive - with live counts against the diagnostic threshold of six for children or five for adults, and a banner showing the resulting presentation. Preset buttons load Marcus, Elena, and Devon at ages 9 and 39 to demonstrate presentation shift. Hovering a chip names the executive function underneath it.', LABEL);
}

function reset(clearCaption) {
  inattOn.fill(false);
  hypOn.fill(false);
  devonStage = 0;
  if (clearCaption) {
    caption = 'Toggle symptoms, or load a preset below.';
    adultCheckbox.checked(false);
    adultMode = false;
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
  textSize(19);
  text('The 18 Symptoms and the Counting Rules', canvasWidth / 2, 6);
  textSize(defaultTextSize);

  drawColumns();
  drawBanner();
}

function chipRect(col, i) {
  const colW = (canvasWidth - 30) / 2;
  const x = 10 + col * (colW + 10);
  const y = 56 + i * 27;
  return { x: x, y: y, w: colW, h: 24 };
}

function drawColumns() {
  const nI = inattOn.filter(Boolean).length;
  const nH = hypOn.filter(Boolean).length;
  const thr = adultMode ? 5 : 6;

  // column headers with counters
  noStroke();
  textSize(13.5);
  textAlign(LEFT, TOP);
  fill(nI >= thr ? 'seagreen' : '#4a78b5');
  text('Inattentive: ' + nI + ' / ' + thr + (nI >= thr ? '  ✓ met' : ''), chipRect(0, 0).x + 4, 34);
  fill(nH >= thr ? 'seagreen' : '#c0563e');
  text('Hyperactive-impulsive: ' + nH + ' / ' + thr + (nH >= thr ? '  ✓ met' : ''), chipRect(1, 0).x + 4, 34);
  textSize(defaultTextSize);

  let hoverEf = null;
  for (let col = 0; col < 2; col++) {
    const list = col === 0 ? INATT : HYPIMP;
    const state = col === 0 ? inattOn : hypOn;
    const hue = col === 0 ? color(74, 120, 181) : color(192, 86, 62);
    for (let i = 0; i < 9; i++) {
      const r = chipRect(col, i);
      const hovered = mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h;
      if (hovered) hoverEf = list[i].ef;
      stroke(hovered ? 'black' : 'silver');
      strokeWeight(hovered ? 1.5 : 1);
      fill(state[i] ? hue : color(250));
      rect(r.x, r.y, r.w, r.h, 12);
      noStroke();
      fill(state[i] ? 'white' : '#444444');
      textAlign(LEFT, CENTER);
      textSize(12);
      text((state[i] ? '☑ ' : '☐ ') + list[i].s, r.x + 10, r.y + r.h / 2);
      textSize(defaultTextSize);
    }
  }

  // hover EF tooltip
  if (hoverEf) {
    const tw = textWidth('underneath: ' + hoverEf) + 40;
    fill(255, 255, 250, 245);
    stroke(180);
    rect(canvasWidth / 2 - tw / 2, drawHeight - 88, tw, 24, 8);
    noStroke();
    fill('#555555');
    textAlign(CENTER, CENTER);
    textSize(11.5);
    text('underneath: ' + hoverEf, canvasWidth / 2, drawHeight - 76);
    textSize(defaultTextSize);
  }
}

function drawBanner() {
  const nI = inattOn.filter(Boolean).length;
  const nH = hypOn.filter(Boolean).length;
  const thr = adultMode ? 5 : 6;
  let label, col;
  if (nI >= thr && nH >= thr) { label = 'Combined presentation'; col = color(110, 70, 140); }
  else if (nI >= thr) { label = 'Predominantly inattentive presentation'; col = color(74, 120, 181); }
  else if (nH >= thr) { label = 'Predominantly hyperactive-impulsive presentation'; col = color(192, 86, 62); }
  else { label = 'Below threshold - no presentation determined'; col = color(120); }

  fill(255, 255, 255, 242);
  stroke(col);
  strokeWeight(2);
  rect(15, drawHeight - 58, canvasWidth - 30, 50, 10);
  noStroke();
  fill(col);
  textAlign(LEFT, TOP);
  textSize(14);
  text(label, 28, drawHeight - 50);
  fill('#444444');
  textSize(11.5);
  text(caption + '  (Counts alone never diagnose: duration, onset, settings, and impairment gates all apply - Ch. 5.)', 28, drawHeight - 31, canvasWidth - 56, 30);
  textSize(defaultTextSize);
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (let col = 0; col < 2; col++) {
    for (let i = 0; i < 9; i++) {
      const r = chipRect(col, i);
      if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) {
        if (col === 0) inattOn[i] = !inattOn[i];
        else hypOn[i] = !hypOn[i];
        caption = 'Custom pattern.';
        devonStage = 0;
        return;
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
