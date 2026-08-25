// Anatomy of a Thorough Evaluation
// CANVAS_HEIGHT: 450
// Hub-and-spoke map of the components of a real ADHD evaluation with two
// criteria gates. Explore mode: click any component for what it contributes,
// its limits, and the red flag of its absence. Rate mode: four vignette
// evaluations to judge thorough vs insufficient, with feedback naming the
// missing components. Evaluate-level (L5).
// (Understanding ADHD, Chapter 5.)
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50; // 1 row
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const COMPONENTS = [
  { name: 'Clinical\ninterview', optional: false,
    info: 'The spine: 60-90 minutes walking current symptoms, history to childhood, school/work, sleep, family history. Red flag if missing: a diagnosis without a life history.' },
  { name: 'Rating\nscales', optional: false,
    info: 'Standardized checklists with population norms (Vanderbilt, Conners, ASRS). Converts "very distractible" into percentiles. Limit: never stands alone.' },
  { name: 'Self-\nreport', optional: false,
    info: 'The person\'s own questionnaires. Honest limit: people with ADHD are imprecise self-observers - both under-reporting (maskers) and over-reporting occur. Why collateral exists.' },
  { name: 'Collateral\ninformation', optional: false,
    info: 'The same questions asked of people who see the person daily - parent, partner, teacher - plus report cards. Red flag if missing: a diagnosis built on one person\'s self-view.' },
  { name: 'Childhood\nhistory', optional: false,
    info: 'Evidence of symptoms before age 12 - old report cards are gold. Serves the onset gate: ADHD does not start at 35, though its discovery often does.' },
  { name: 'Neuropsych\ntesting', optional: true,
    info: 'OPTIONAL: hours of standardized cognitive tasks. NOT required for diagnosis - valuable when complicated: suspected learning disabilities, ambiguous differentials, accommodation documentation.' },
  { name: 'Computer test\n(CPT)', optional: true,
    info: 'ONE DATA POINT: 20 boring minutes measuring sustained attention. Plenty of people with ADHD pass; plenty without score poorly. An evaluation that is ONLY this has inverted the evidence hierarchy.' }
];

const GATES = [
  { name: 'Onset\nbefore 12?',
    info: 'GATE: several symptoms present before age 12. Blind spot: none - but it is why the old report cards matter.' },
  { name: 'Impairment,\n2+ settings?',
    info: 'GATE: real costs in more than one setting. Blind spot: high-achievement masking hides impairment in the transcript while it accumulates in private. A good evaluator asks what the grades COST.' }
];

const VIGNETTES = [
  { t: 'A 20-minute video chat. The provider asks about current focus problems, then prescribes the same day.',
    thorough: false,
    why: 'Insufficient: no real clinical interview, no childhood evidence, no collateral, no differential. Telehealth is fine - hollowness is not.' },
  { t: 'A computer attention test at a clinic. Score below average. Diagnosis issued on the result.',
    thorough: false,
    why: 'Insufficient: a CPT is one data point, never the verdict. No interview, no history, no collateral - the evidence hierarchy is inverted.' },
  { t: 'Two sessions: a 75-minute interview covering childhood, rating scales from the person AND their partner, old report cards reviewed, sleep and anxiety explicitly ruled out.',
    thorough: true,
    why: 'Thorough: interview spine, scales, self-report plus collateral, childhood evidence, and differential discipline. No neuropsych battery - and none was needed.' },
  { t: 'Full neuropsychological battery with school records - but the evaluator never asks about sleep, mood, or what the symptoms cost outside school.',
    thorough: false,
    why: 'Closer - but the differential (sleep, mood) and the impairment gate got skipped. Hours of testing cannot substitute for the questions not asked.' }
];

let rateMode = false;
let rateCheckbox, nextButton;
let selNode = -1; // 0-6 components, 100/101 gates
let vIdx = 0, vAnswered = false, vCorrect = false, vScore = 0, vAsked = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  rateCheckbox = createCheckbox(' Rate-this-evaluation mode', false);
  rateCheckbox.position(10, drawHeight + 12);
  rateCheckbox.parent(document.querySelector('main'));
  rateCheckbox.changed(() => {
    rateMode = rateCheckbox.checked();
    selNode = -1;
    vIdx = 0; vAnswered = false; vScore = 0; vAsked = 0;
    nextButton[rateMode ? 'show' : 'hide']();
  });

  nextButton = createButton('Next vignette');
  nextButton.position(240, drawHeight + 8);
  nextButton.parent(document.querySelector('main'));
  nextButton.mousePressed(() => {
    if (!vAnswered) return;
    vIdx = (vIdx + 1) % VIGNETTES.length;
    vAnswered = false;
  });
  nextButton.hide();

  describe('Hub-and-spoke map of ADHD evaluation components - clinical interview, rating scales, self-report, collateral, childhood history, optional neuropsych testing, and computer tests - with two criteria gates. Click components for their purpose, limits, and the red flag of their absence. A rate mode presents four vignette evaluations to judge thorough or insufficient with explained feedback.', LABEL);
}

function nodePos(i) {
  // components around a hub at center-left
  const cx = canvasWidth * 0.42, cy = 205, r = min(150, canvasWidth * 0.3);
  const angle = -HALF_PI + (i * TWO_PI) / COMPONENTS.length;
  return { x: cx + r * cos(angle), y: cy + r * sin(angle) * 0.78 };
}
function gatePos(g) {
  return { x: canvasWidth * 0.78, y: 150 + g * 110 };
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
  text('Anatomy of a Thorough Evaluation', canvasWidth / 2, 8);
  textSize(defaultTextSize);

  if (rateMode) {
    drawVignette();
  } else {
    drawMap();
    if (selNode >= 0) drawNodePanel();
  }

  if (rateMode) {
    fill('black');
    noStroke();
    textAlign(RIGHT, CENTER);
    textSize(13);
    text('Score: ' + vScore + ' / ' + vAsked, canvasWidth - 15, drawHeight + 25);
    textSize(defaultTextSize);
  }
}

function drawMap() {
  const cx = canvasWidth * 0.42, cy = 205;

  // spokes
  stroke(190);
  strokeWeight(1.5);
  for (let i = 0; i < COMPONENTS.length; i++) {
    const p = nodePos(i);
    line(cx, cy, p.x, p.y);
  }
  // gates path: hub -> gate1 -> gate2
  stroke(150, 110, 60);
  strokeWeight(2);
  drawingContext.setLineDash([6, 5]);
  line(cx, cy, gatePos(0).x, gatePos(0).y);
  line(gatePos(0).x, gatePos(0).y, gatePos(1).x, gatePos(1).y);
  drawingContext.setLineDash([]);
  noStroke();

  // hub
  stroke('black');
  strokeWeight(2);
  fill('lightsteelblue');
  ellipse(cx, cy, 118, 54);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(12.5);
  text('Diagnostic\nconclusion', cx, cy);

  // component nodes
  for (let i = 0; i < COMPONENTS.length; i++) {
    const p = nodePos(i);
    const hovered = dist(mouseX, mouseY, p.x, p.y) < 34;
    stroke(hovered || selNode === i ? 'black' : 'gray');
    strokeWeight(hovered || selNode === i ? 2 : 1.2);
    if (COMPONENTS[i].optional) drawingContext.setLineDash([5, 4]);
    fill(COMPONENTS[i].optional ? color(248, 244, 232) : 'white');
    ellipse(p.x, p.y, 104, 46);
    drawingContext.setLineDash([]);
    noStroke();
    fill('black');
    textSize(11);
    textAlign(CENTER, CENTER);
    text(COMPONENTS[i].name, p.x, p.y);
  }

  // gates
  for (let g = 0; g < 2; g++) {
    const p = gatePos(g);
    const hovered = dist(mouseX, mouseY, p.x, p.y) < 34;
    stroke(hovered || selNode === 100 + g ? 'black' : color(150, 110, 60));
    strokeWeight(hovered || selNode === 100 + g ? 2.5 : 2);
    fill(252, 244, 224);
    quad(p.x, p.y - 30, p.x + 52, p.y, p.x, p.y + 30, p.x - 52, p.y);
    noStroke();
    fill(110, 80, 40);
    textSize(10.5);
    textAlign(CENTER, CENTER);
    text(GATES[g].name, p.x, p.y);
  }
  textSize(defaultTextSize);

  if (selNode < 0) {
    noStroke();
    fill('dimgray');
    textSize(11.5);
    textAlign(CENTER, TOP);
    text('Click any component or gate. Dashed = optional / one data point.', canvasWidth / 2, 32);
    textSize(defaultTextSize);
  }
}

function drawNodePanel() {
  let title, info;
  if (selNode >= 100) { title = GATES[selNode - 100].name.replace('\n', ' '); info = GATES[selNode - 100].info; }
  else { title = COMPONENTS[selNode].name.replace('\n', ' '); info = COMPONENTS[selNode].info; }
  const pw = min(560, canvasWidth - 36);
  const ph = 92;
  const px2 = (canvasWidth - pw) / 2;
  const py2 = drawHeight - ph - 10;
  fill(255, 255, 255, 250);
  stroke(selNode >= 100 ? color(150, 110, 60) : 'steelblue');
  strokeWeight(2);
  rect(px2, py2, pw, ph, 10);
  noStroke();
  fill(selNode >= 100 ? color(110, 80, 40) : 'steelblue');
  textAlign(LEFT, TOP);
  textSize(13.5);
  text(title, px2 + 12, py2 + 8);
  fill('#333333');
  textSize(11.5);
  text(info, px2 + 12, py2 + 28, pw - 24, ph - 36);
  textSize(defaultTextSize);
}

function rateZones() {
  const zw = min(190, (canvasWidth - 70) / 2), zy = 292, zh = 56;
  return [
    { x: canvasWidth / 2 - zw - 12, y: zy, w: zw, h: zh, label: 'Thorough', val: true },
    { x: canvasWidth / 2 + 12, y: zy, w: zw, h: zh, label: 'Insufficient', val: false }
  ];
}

function drawVignette() {
  const v = VIGNETTES[vIdx];
  const cw = min(580, canvasWidth - 36);
  const cx = (canvasWidth - cw) / 2;
  fill('white');
  stroke('gray');
  strokeWeight(1.5);
  rect(cx, 44, cw, 116, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(13);
  text('Evaluation ' + (vIdx + 1) + ' of ' + VIGNETTES.length + ':', cx + 12, 52);
  fill('#333333');
  text(v.t, cx + 12, 74, cw - 24, 84);
  textSize(defaultTextSize);

  for (const z of rateZones()) {
    const hovered = mouseX > z.x && mouseX < z.x + z.w && mouseY > z.y && mouseY < z.y + z.h;
    const active = !vAnswered;
    fill(active ? (hovered ? (z.val ? '#cfe4d2' : '#f6d4c8') : (z.val ? '#e4f1e6' : '#fbe9e2')) : '#f0f0f0');
    stroke(active && hovered ? 'black' : 'silver');
    strokeWeight(active && hovered ? 2 : 1);
    rect(z.x, z.y, z.w, z.h, 10);
    noStroke();
    fill(active ? 'black' : 'gray');
    textAlign(CENTER, CENTER);
    textSize(14);
    text(z.label, z.x + z.w / 2, z.y + z.h / 2);
    textSize(defaultTextSize);
  }

  if (vAnswered) {
    const pw = min(560, canvasWidth - 40);
    const px2 = (canvasWidth - pw) / 2;
    fill(vCorrect ? '#eef7ee' : '#fdeeee');
    stroke(vCorrect ? 'seagreen' : 'firebrick');
    strokeWeight(2);
    rect(px2, 172, pw, 108, 10);
    noStroke();
    fill(vCorrect ? 'seagreen' : 'firebrick');
    textAlign(LEFT, TOP);
    textSize(13);
    text((vCorrect ? 'Correct. ' : 'Not quite. ') + (VIGNETTES[vIdx].thorough ? 'This one is thorough.' : 'This one is insufficient.'), px2 + 12, 180);
    fill('#333333');
    textSize(12);
    text(VIGNETTES[vIdx].why, px2 + 12, 200, pw - 24, 76);
    textSize(defaultTextSize);
  }
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;

  if (rateMode) {
    if (vAnswered) return;
    for (const z of rateZones()) {
      if (mouseX > z.x && mouseX < z.x + z.w && mouseY > z.y && mouseY < z.y + z.h) {
        vAnswered = true;
        vAsked++;
        vCorrect = (z.val === VIGNETTES[vIdx].thorough);
        if (vCorrect) vScore++;
        return;
      }
    }
    return;
  }

  for (let i = 0; i < COMPONENTS.length; i++) {
    const p = nodePos(i);
    if (dist(mouseX, mouseY, p.x, p.y) < 40) { selNode = (selNode === i) ? -1 : i; return; }
  }
  for (let g = 0; g < 2; g++) {
    const p = gatePos(g);
    if (dist(mouseX, mouseY, p.x, p.y) < 40) { selNode = (selNode === 100 + g) ? -1 : 100 + g; return; }
  }
  selNode = -1;
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
