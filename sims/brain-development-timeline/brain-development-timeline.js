// Brain Development Timeline
// CANVAS_HEIGHT: 480
// Two developmental curves - typical and ADHD - for the brain's
// self-management (prefrontal) regions, with a draggable age cursor that
// reads out concrete values and the age-equivalent gap, plus a demand-line
// overlay showing what the environment expects at each age.
// Illustrative of the published delayed-maturation trajectory shape,
// not a clinical measurement of any individual (Understanding ADHD, Ch 1-2).
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80; // 2 rows
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 110;
let defaultTextSize = 16;

// plot geometry
let plotL = 60, plotR = 20, plotT = 60, plotB = 60;

// milestones: clickable markers
const MILESTONES = [
  { age: 5.5, label: 'school entry',
    note: 'Sit still, follow group rules, wait turns - the first big demand spike, arriving on a fixed schedule.' },
  { age: 12, label: 'middle school',
    note: 'Seven teachers, lockers, homework alone. Planning demands jump exactly while the maturation gap is widest.' },
  { age: 19, label: 'college / first job',
    note: 'All external scaffolding drops at once. Many undiagnosed people hit their first real collapse here.' }
];

let ageSlider, demandCheckbox;
let showDemand = false;
let selectedMilestone = -1;

// maturation model: smooth logistic-ish curve, percent developed vs age.
// ADHD curve = same shape shifted ~3 years later, converging by mid-20s.
function maturation(age) {
  // logistic centered ~11, scaled so ~4y=25%, 25y=~99%
  const v = 100 / (1 + exp(-(age - 10.0) / 3.4));
  return constrain(v, 0, 100);
}
function maturationADHD(age) {
  // 3-year shift, partially converging after ~20
  const shift = age < 20 ? 3.0 : max(0.8, 3.0 - (age - 20) * 0.44);
  return maturation(age - shift);
}
// what the environment expects (step-ish rising line, in same 0-100 units)
function demandLevel(age) {
  if (age < 5.5) return 15;
  if (age < 12) return 45;
  if (age < 15) return 62;
  if (age < 19) return 75;
  return 92;
}
// invert maturation to find the typical age with the same level
function ageEquivalent(level) {
  // solve logistic inverse
  const clamped = constrain(level, 1, 99);
  return 10.0 + 3.4 * log(clamped / (100 - clamped));
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  ageSlider = createSlider(4, 25, 8, 0.5);
  ageSlider.position(sliderLeftMargin, drawHeight + 10);
  ageSlider.size(canvasWidth - sliderLeftMargin - margin);
  ageSlider.parent(document.querySelector('main'));

  demandCheckbox = createCheckbox(' Show what the environment expects (the demand line)', false);
  demandCheckbox.position(10, drawHeight + 47);
  demandCheckbox.parent(document.querySelector('main'));
  demandCheckbox.changed(() => { showDemand = demandCheckbox.checked(); });

  describe('Line graph of self-management brain development from age 4 to 25. A gray curve shows typical development and an orange curve shows the ADHD trajectory, the same shape running about three years later. A slider moves an age cursor that reads out both percentages and the gap in years. A checkbox overlays the environment demand line, and clickable markers explain school entry, middle school, and the college transition.', LABEL);
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
  text('Brain Development: Same Route, Later Timetable', canvasWidth / 2, 8);
  textSize(defaultTextSize);

  drawAxes();
  if (showDemand) drawDemandLine();
  drawCurve(maturation, color(120));
  drawCurve(maturationADHD, color(230, 126, 34));
  drawMilestones();
  drawCursor();
  drawLegend();
  if (selectedMilestone >= 0) drawMilestoneNote();

  // control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  text('Age: ' + nf(ageSlider.value(), 1, 1), 10, drawHeight + 20);
}

function px(age) { return map(age, 4, 25, plotL, canvasWidth - plotR); }
function py(v)   { return map(v, 0, 100, drawHeight - plotB, plotT); }

function drawAxes() {
  stroke('gray');
  strokeWeight(1);
  line(plotL, plotT - 10, plotL, drawHeight - plotB);
  line(plotL, drawHeight - plotB, canvasWidth - plotR, drawHeight - plotB);
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(CENTER, TOP);
  for (let a = 5; a <= 25; a += 5) {
    text(a, px(a), drawHeight - plotB + 6);
    stroke(230);
    line(px(a), plotT, px(a), drawHeight - plotB);
    noStroke();
  }
  textAlign(RIGHT, CENTER);
  for (let v = 0; v <= 100; v += 25) {
    text(v + '%', plotL - 6, py(v));
  }
  textAlign(CENTER, TOP);
  text('age (years)', (plotL + canvasWidth - plotR) / 2, drawHeight - 28);
  push();
  translate(16, (plotT + drawHeight - plotB) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('self-management regions: percent developed', 0, 0);
  pop();
  textSize(defaultTextSize);
}

function drawCurve(fn, col) {
  stroke(col);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let a = 4; a <= 25.01; a += 0.25) {
    vertex(px(a), py(fn(a)));
  }
  endShape();
  noStroke();
}

function drawDemandLine() {
  stroke(70, 130, 90);
  strokeWeight(2);
  drawingContext.setLineDash([6, 5]);
  noFill();
  beginShape();
  for (let a = 4; a <= 25.01; a += 0.25) {
    vertex(px(a), py(demandLevel(a)));
  }
  endShape();
  drawingContext.setLineDash([]);
  noStroke();

  // shade the struggle zone: demand above ADHD curve
  fill(200, 80, 60, 26);
  beginShape();
  for (let a = 4; a <= 25.01; a += 0.25) vertex(px(a), py(demandLevel(a)));
  for (let a = 25; a >= 4; a -= 0.25) vertex(px(a), py(min(demandLevel(a), maturationADHD(a))));
  endShape(CLOSE);
}

function drawMilestones() {
  for (let i = 0; i < MILESTONES.length; i++) {
    const m = MILESTONES[i];
    const x = px(m.age);
    const y = drawHeight - plotB;
    const hovered = dist(mouseX, mouseY, x, y - 8) < 12;
    fill(hovered || selectedMilestone === i ? 'steelblue' : 'lightsteelblue');
    stroke('steelblue');
    strokeWeight(1);
    triangle(x - 7, y, x + 7, y, x, y - 14);
    noStroke();
    fill('dimgray');
    textSize(10.5);
    textAlign(CENTER, TOP);
    text(m.label, x, y - 34);
    textSize(defaultTextSize);
  }
}

function drawMilestoneNote() {
  const m = MILESTONES[selectedMilestone];
  const pw = min(400, canvasWidth - 60);
  const pxm = constrain(px(m.age) - pw / 2, 20, canvasWidth - pw - 20);
  fill(255, 255, 255, 246);
  stroke('steelblue');
  strokeWeight(1.5);
  rect(pxm, plotT + 8, pw, 78, 10);
  noStroke();
  fill('steelblue');
  textAlign(LEFT, TOP);
  textSize(14);
  text(m.label + ' (~age ' + m.age + ')', pxm + 12, plotT + 16);
  fill('black');
  textSize(12.5);
  text(m.note, pxm + 12, plotT + 36, pw - 24, 48);
  textSize(defaultTextSize);
}

function drawCursor() {
  const a = ageSlider.value();
  const x = px(a);
  stroke('black');
  strokeWeight(1);
  drawingContext.setLineDash([3, 4]);
  line(x, plotT, x, drawHeight - plotB);
  drawingContext.setLineDash([]);

  const vT = maturation(a);
  const vA = maturationADHD(a);
  noStroke();
  fill(120);
  circle(x, py(vT), 10);
  fill(230, 126, 34);
  circle(x, py(vA), 10);

  // infobox
  const gapYears = max(0, a - ageEquivalent(vA));
  const bw = 235, bh = 76;
  const bx = (x + bw + 30 < canvasWidth) ? x + 14 : x - bw - 14;
  fill(255, 255, 255, 240);
  stroke(200);
  rect(bx, plotT + 96, bw, bh, 10);
  noStroke();
  fill('black');
  textAlign(LEFT, TOP);
  textSize(12.5);
  text('At age ' + nf(a, 1, 1) + ':', bx + 10, plotT + 103);
  fill(90);
  text('Typical: ' + nf(vT, 1, 0) + '% developed', bx + 10, plotT + 121);
  fill(200, 100, 20);
  text('ADHD: ' + nf(vA, 1, 0) + '%  (like a typical ' + nf(ageEquivalent(vA), 1, 0) + '-year-old)', bx + 10, plotT + 139);
  fill('firebrick');
  text('Gap: roughly ' + nf(gapYears, 1, 1) + ' years', bx + 10, plotT + 157);
  textSize(defaultTextSize);
}

function drawLegend() {
  const lx = plotL + 10, ly = plotT + 6;
  noStroke();
  fill(255, 255, 255, 220);
  stroke(220);
  rect(lx - 6, ly - 4, 168, showDemand ? 58 : 42, 8);
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);
  stroke(120); strokeWeight(3); line(lx, ly + 8, lx + 24, ly + 8); noStroke();
  fill('black'); text('typical development', lx + 30, ly + 8);
  stroke(230, 126, 34); strokeWeight(3); line(lx, ly + 26, lx + 24, ly + 26); noStroke();
  fill('black'); text('ADHD trajectory', lx + 30, ly + 26);
  if (showDemand) {
    stroke(70, 130, 90); strokeWeight(2);
    drawingContext.setLineDash([5, 4]);
    line(lx, ly + 44, lx + 24, ly + 44);
    drawingContext.setLineDash([]);
    noStroke();
    fill('black'); text('what\'s expected', lx + 30, ly + 44);
  }
  textSize(defaultTextSize);
}

function mousePressed() {
  // milestone markers
  for (let i = 0; i < MILESTONES.length; i++) {
    const x = px(MILESTONES[i].age);
    const y = drawHeight - plotB;
    if (dist(mouseX, mouseY, x, y - 8) < 14) {
      selectedMilestone = (selectedMilestone === i) ? -1 : i;
      return;
    }
  }
  if (mouseY > 0 && mouseY < drawHeight) selectedMilestone = -1;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  ageSlider.size(canvasWidth - sliderLeftMargin - margin);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
