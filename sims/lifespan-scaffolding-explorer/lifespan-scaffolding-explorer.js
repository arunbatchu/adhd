// Lifespan Demands and Scaffolding Explorer
// CANVAS_HEIGHT: 450
// Two stepped series across seven life stages: executive demands (rising)
// and external scaffolding (falling in steps). The shaded gap is what a
// person must supply themselves. Click a stage for its ADHD picture and
// classic failure mode; the rebuild toggle overlays deliberately rebuilt
// support; the Amara button walks an undiagnosed case across the stages.
// Analyze-level (L4). (Understanding ADHD, Chapter 4.)
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50; // 1 row
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const STAGES = [
  { name: 'Early\nchildhood', demand: 15, scaffold: 92, rebuilt: 92,
    picture: 'Motor at lifetime peak; parents run everything. Well-scaffolded homes can make ADHD nearly invisible - support, and also a hidden debt.',
    drops: 'Nothing yet - the household does the executive functioning.',
    failure: 'Failure mode: few. The scaffolding covers the gap.' },
  { name: 'Elementary', demand: 35, scaffold: 78, rebuilt: 80,
    picture: 'First sit-still demands; referral runs on disruption. Jonah gets flagged; Amara reads by the window and never trips the alarm.',
    drops: 'Drops here: all-day parental supervision.',
    failure: 'Failure mode: the disruptive get help; the quiet get "needs to work on organization."' },
  { name: 'Middle\nschool', demand: 55, scaffold: 60, rebuilt: 68,
    picture: 'Seven teachers, a locker, long-horizon projects - a direct assault on planning and prospective memory as supervision backs off.',
    drops: 'Drops here: one-teacher oversight, daily parent contact.',
    failure: 'Failure mode: assignments done but never turned in; grades slide.' },
  { name: 'High\nschool', demand: 70, scaffold: 45, rebuilt: 60,
    picture: 'Stakes get real: driving, substances, permanent records. Peers\' prefrontal growth accelerates while the lag holds - the gap looks widest.',
    drops: 'Drops here: homework enforcement, schedule management.',
    failure: 'Failure mode: surveillance wars at home; the D in a subject he could ace.' },
  { name: 'College', demand: 88, scaffold: 10, rebuilt: 45,
    picture: 'The steepest cliff: 12 class hours, 30 invisible study hours, a December deadline mentioned in August, total anonymity.',
    drops: 'Drops here: EVERYTHING - parents\' schedule, teachers who notice, daily deadlines, enforced routines.',
    failure: 'Failure mode: the first real collapse, often in bright, masked students. Anika\'s semester.' },
  { name: 'Early\ncareer', demand: 82, scaffold: 18, rebuilt: 48,
    picture: 'Work can fit better than school ever did - or remove the last safety nets. Apartment, bills, and the disclosure question arrive together.',
    drops: 'Drops here: resource rooms, extra time, the May reset button.',
    failure: 'Failure mode: brilliant-but-flaky reputation; late fees; burnout of the compensators.' },
  { name: 'Established\nadulthood', demand: 78, scaffold: 22, rebuilt: 52,
    picture: 'Heaviest load of the lifespan - job, household, kids - run with zero institutional scaffolding while looking approximately fine.',
    drops: 'Drops here: nothing left to drop. What exists is what was deliberately built.',
    failure: 'Failure mode: the invisible daily tax; a partner drifting into case manager.' }
];

const AMARA = [
  'Age 7: coping. Report card says "a joy, needs organization." Nobody calls.',
  'Age 12: coping, barely. Loses the binder war but grades hold on brains.',
  'Age 16: straining. All-nighters begin; everyone reads the As as thriving.',
  'Age 19: COLLAPSE. First semester of real self-management - no syllabus mother, no reset. This is where an observer first notices anything.',
  'The condition was present at every stage. Only the scaffolding changed.'
];

let rebuildOn = false;
let selStage = -1;
let amaraStep = -1;
let rebuildCheckbox, amaraButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  amaraButton = createButton('Follow Amara');
  amaraButton.position(10, drawHeight + 10);
  amaraButton.parent(document.querySelector('main'));
  amaraButton.mousePressed(() => {
    amaraStep = (amaraStep + 1) % (AMARA.length + 1);
    if (amaraStep === AMARA.length) amaraStep = -1;
    selStage = -1;
    amaraButton.html(amaraStep === -1 ? 'Follow Amara' : 'Amara: next');
  });

  rebuildCheckbox = createCheckbox(' Rebuild support on purpose (planners, coaching, accommodations, family agreements)', false);
  rebuildCheckbox.position(130, drawHeight + 14);
  rebuildCheckbox.parent(document.querySelector('main'));
  rebuildCheckbox.changed(() => { rebuildOn = rebuildCheckbox.checked(); });

  describe('Stepped chart across seven life stages showing executive demands rising while external scaffolding falls, with the gap between them shaded as what you must supply yourself. Stages are clickable for their ADHD picture and failure mode; a toggle overlays deliberately rebuilt support narrowing the gap; a button walks Amara, an undiagnosed case, across the stages to her first collapse at college.', LABEL);
}

let plotL = 55, plotR = 20, plotT = 52, plotB = 74;

function stageX(i) {
  return map(i, 0, STAGES.length - 1, plotL + 30, canvasWidth - plotR - 40);
}
function py(v) { return map(v, 0, 100, drawHeight - plotB, plotT); }

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
  text('Demands Rise. Scaffolding Drops. The Gap Is Yours.', canvasWidth / 2, 8);
  textSize(defaultTextSize);

  drawGapShading();
  drawSeries(STAGES.map(s => s.demand), color(180, 70, 60), 'demands on you');
  drawSeries(STAGES.map(s => s.scaffold), color(80, 110, 170), 'scaffolding provided');
  if (rebuildOn) drawSeries(STAGES.map(s => s.rebuilt), color(70, 140, 90), 'rebuilt support', true);
  drawStageLabels();
  drawLegend();
  if (amaraStep >= 0) drawAmara();
  else if (selStage >= 0) drawStageInfo();
}

function drawGapShading() {
  noStroke();
  fill(200, 80, 60, 30);
  beginShape();
  for (let i = 0; i < STAGES.length; i++) vertex(stageX(i), py(STAGES[i].demand));
  for (let i = STAGES.length - 1; i >= 0; i--) {
    const base = rebuildOn ? STAGES[i].rebuilt : STAGES[i].scaffold;
    vertex(stageX(i), py(min(base, STAGES[i].demand)));
  }
  endShape(CLOSE);
  // gap label at college
  fill(150, 60, 50);
  textSize(11);
  textAlign(CENTER, CENTER);
  const gy = (py(STAGES[4].demand) + py(rebuildOn ? STAGES[4].rebuilt : STAGES[4].scaffold)) / 2;
  text('what you must\nsupply yourself', stageX(4), gy);
  textSize(defaultTextSize);
}

function drawSeries(vals, col, label, dashed) {
  stroke(col);
  strokeWeight(3);
  if (dashed) drawingContext.setLineDash([7, 5]);
  noFill();
  beginShape();
  for (let i = 0; i < vals.length; i++) vertex(stageX(i), py(vals[i]));
  endShape();
  drawingContext.setLineDash([]);
  noStroke();
  for (let i = 0; i < vals.length; i++) {
    fill(col);
    circle(stageX(i), py(vals[i]), 8);
  }
}

function drawStageLabels() {
  for (let i = 0; i < STAGES.length; i++) {
    const x = stageX(i);
    const hovered = mouseY > drawHeight - plotB && mouseY < drawHeight - 20 && abs(mouseX - x) < 34;
    noStroke();
    fill(hovered || selStage === i ? 'black' : 'dimgray');
    textAlign(CENTER, TOP);
    textSize(11);
    text(STAGES[i].name, x, drawHeight - plotB + 8);
    textSize(defaultTextSize);
    if (amaraStep >= 0 && amaraStep < 4) {
      // Amara marker walks stages 1,2,3,4 (elementary..college)
      const amStage = amaraStep + 1;
      if (i === amStage) {
        fill(230, 126, 34);
        circle(x, py(STAGES[i].demand) - 18, 12);
        textSize(10);
        textAlign(CENTER, BOTTOM);
        fill(200, 100, 20);
        text('Amara', x, py(STAGES[i].demand) - 26);
        textSize(defaultTextSize);
      }
    }
  }
  noStroke();
  fill('dimgray');
  textSize(10.5);
  textAlign(CENTER, BOTTOM);
  text('click a stage name for its picture', canvasWidth / 2, drawHeight - 6);
  textSize(defaultTextSize);
}

function drawLegend() {
  const lx = plotL + 4, ly = plotT + 2;
  fill(255, 255, 255, 225);
  stroke(220);
  rect(lx - 6, ly - 4, 172, rebuildOn ? 56 : 40, 8);
  noStroke();
  textSize(11.5);
  textAlign(LEFT, CENTER);
  stroke(180, 70, 60); strokeWeight(3); line(lx, ly + 6, lx + 20, ly + 6); noStroke();
  fill('black'); text('demands on you', lx + 26, ly + 6);
  stroke(80, 110, 170); strokeWeight(3); line(lx, ly + 22, lx + 20, ly + 22); noStroke();
  fill('black'); text('scaffolding provided', lx + 26, ly + 22);
  if (rebuildOn) {
    stroke(70, 140, 90); strokeWeight(3);
    drawingContext.setLineDash([5, 4]);
    line(lx, ly + 38, lx + 20, ly + 38);
    drawingContext.setLineDash([]);
    noStroke();
    fill('black'); text('rebuilt on purpose (Part 3)', lx + 26, ly + 38);
  }
  textSize(defaultTextSize);
}

function infoPanel(title, lines, col) {
  const pw = min(470, canvasWidth - 44);
  const ph = 118;
  const px2 = (canvasWidth - pw) / 2;
  const py2 = plotT + 46;
  fill(255, 255, 255, 248);
  stroke(col);
  strokeWeight(2);
  rect(px2, py2, pw, ph, 10);
  noStroke();
  fill(col);
  textAlign(LEFT, TOP);
  textSize(13.5);
  text(title, px2 + 12, py2 + 8);
  fill('#333333');
  textSize(11.5);
  text(lines, px2 + 12, py2 + 28, pw - 24, ph - 36);
  textSize(defaultTextSize);
}

function drawStageInfo() {
  const s = STAGES[selStage];
  infoPanel(s.name.replace('\n', ' '), s.picture + ' ' + s.drops + ' ' + s.failure, color(80, 110, 170));
}

function drawAmara() {
  infoPanel('Following Amara (undiagnosed, inattentive)', AMARA[amaraStep], color(230, 126, 34));
}

function mousePressed() {
  if (mouseY < drawHeight - plotB || mouseY > drawHeight - 20) {
    if (mouseY > 0 && mouseY < drawHeight - plotB) { selStage = -1; }
  }
  for (let i = 0; i < STAGES.length; i++) {
    if (mouseY > drawHeight - plotB && mouseY < drawHeight - 20 && abs(mouseX - stageX(i)) < 34) {
      selStage = (selStage === i) ? -1 : i;
      amaraStep = -1;
      amaraButton.html('Follow Amara');
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
