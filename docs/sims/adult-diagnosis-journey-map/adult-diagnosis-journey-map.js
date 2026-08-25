// The Adult Diagnosis Journey Map
// CANVAS_HEIGHT: 450
// Seven stations of the late-diagnosis journey on a winding path, each
// clickable, with an emotion strip underneath and a family-view toggle that
// re-annotates every station with what a supporter can usefully do (and not
// do) at that stage. Understand-level (L2).
// (Understanding ADHD, Chapter 4.)
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50; // 1 row
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const STATIONS = [
  { name: 'Trigger', emotion: 'curiosity',
    person: 'The classic three: your child\'s diagnosis, a life crisis (job, college, new baby), or a video that describes your inner life with unnerving precision. Media recognition is a prompt for evaluation - never the evaluation.',
    family: 'Useful: share what you noticed, once, gently, as an observation. Not useful: forwarding eleven articles or diagnosing them at dinner.' },
  { name: 'Recognition', emotion: 'upheaval',
    person: 'Reading the symptom list and feeling your whole biography reorganize itself. Grace read nine items and cried. Disorienting is normal.',
    family: 'Useful: listen. "That sounds like a lot to take in." Not useful: "everyone does that" - it re-buries what just surfaced.' },
  { name: 'Deciding to seek help', emotion: 'hesitation',
    person: 'The blockers: stigma, cost, "I\'ve managed this long." Counterpoints: managing has a cost you\'ve stopped noticing, treatment works in adults, and the explanation has value on its own.',
    family: 'Useful: offer logistics help IF ASKED (finding names, sitting in the waiting room). Not useful: booking appointments for a grown adult unrequested.' },
  { name: 'The gauntlet', emotion: 'frustration & doubt',
    person: 'Finding an adult-experienced evaluator, waitlists, cost - and the near-universal waiting-room thought: "what if I\'m faking?" That doubt is a normal station, not a sign to turn back.',
    family: 'Useful: name the doubt as normal if they voice it. Not useful: impatience with how long the process takes - the waitlists are real.' },
  { name: 'The evaluation', emotion: 'vulnerability',
    person: 'History-taking, rating scales, collateral, childhood evidence (Chapter 5 walks through all of it). Bring the unedited version of yourself - do not perform wellness.',
    family: 'Useful: honest collateral - the unsoftened questionnaire, the third-grade memories. Not useful: coaching them on what to say.' },
  { name: 'The result', emotion: 'shock (either way)',
    person: 'Diagnosis: an explanation with a literature behind it. No diagnosis: a thorough evaluation still owes you what IS going on - and a thin one deserves a second opinion.',
    family: 'Useful: follow their lead on what the result means. Not useful: relitigating the result because it wasn\'t what you expected.' },
  { name: 'Aftermath', emotion: 'relief braided with grief',
    person: 'Relief (it has a name) arrives braided with grief - for the decades explained too late. Both are correct. They do not cancel. The reframing work of Chapters 4 and 11 starts here.',
    family: 'Useful: "we were grading you on hardware you didn\'t have - I see it now." Not useful: "at least you know now" in month one - it rushes a mourner to gratitude.' }
];

let familyView = false;
let familyCheckbox;
let selStation = -1;
let hoverEmotion = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  familyCheckbox = createCheckbox(' Family view: what a supporter can usefully do at each station', false);
  familyCheckbox.position(10, drawHeight + 14);
  familyCheckbox.parent(document.querySelector('main'));
  familyCheckbox.changed(() => { familyView = familyCheckbox.checked(); });

  describe('A winding path with seven clickable stations of the adult ADHD diagnosis journey - trigger, recognition, deciding, the gauntlet, the evaluation, the result, aftermath - each opening a panel. An emotion strip below shows the typical feeling at each station, and a family-view toggle re-annotates every station with what a supporter should and should not do.', LABEL);
}

function stationPos(i) {
  const x = map(i, 0, STATIONS.length - 1, 70, canvasWidth - 70);
  const y = 120 + (i % 2 === 0 ? 0 : 46);
  return { x, y };
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
  text('The Adult Diagnosis Journey', canvasWidth / 2, 8);
  textSize(defaultTextSize);
  noStroke();
  fill('dimgray');
  textSize(11.5);
  text(familyView ? 'Family view: your part at each station' : 'Click any station. Hover the emotion strip.', canvasWidth / 2, 32);
  textSize(defaultTextSize);

  // path
  stroke(170, 140, 110);
  strokeWeight(5);
  noFill();
  beginShape();
  for (let i = 0; i < STATIONS.length; i++) {
    const p = stationPos(i);
    curveVertex(p.x, p.y);
    if (i === 0 || i === STATIONS.length - 1) curveVertex(p.x, p.y);
  }
  endShape();
  noStroke();

  // stations
  for (let i = 0; i < STATIONS.length; i++) {
    const p = stationPos(i);
    const hovered = dist(mouseX, mouseY, p.x, p.y) < 18;
    const sel = selStation === i;
    stroke(sel ? 'black' : (familyView ? 'seagreen' : 'steelblue'));
    strokeWeight(sel || hovered ? 3 : 2);
    fill(sel ? (familyView ? '#dff0e2' : '#ddeaf7') : 'white');
    circle(p.x, p.y, 34);
    noStroke();
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(13);
    text(i + 1, p.x, p.y);
    textSize(11);
    fill(sel ? 'black' : 'dimgray');
    textAlign(CENTER, i % 2 === 0 ? BOTTOM : TOP);
    text(STATIONS[i].name, p.x, i % 2 === 0 ? p.y - 22 : p.y + 22);
    textSize(defaultTextSize);
  }

  drawEmotionStrip();
  if (selStation >= 0) drawStationPanel();
}

function drawEmotionStrip() {
  const y = 216;
  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, CENTER);
  text('feels like:', 12, y + 10);
  hoverEmotion = -1;
  for (let i = 0; i < STATIONS.length; i++) {
    const p = stationPos(i);
    const w = 76;
    const hovered = mouseX > p.x - w / 2 && mouseX < p.x + w / 2 && mouseY > y && mouseY < y + 20;
    if (hovered) hoverEmotion = i;
    fill(hovered ? color(240, 225, 200) : color(248, 240, 228));
    stroke(200, 180, 150);
    strokeWeight(1);
    rect(p.x - w / 2, y, w, 20, 10);
    noStroke();
    fill('#6b5230');
    textAlign(CENTER, CENTER);
    textSize(9.5);
    text(STATIONS[i].emotion, p.x, y + 10);
  }
  textSize(defaultTextSize);
}

function drawStationPanel() {
  const s = STATIONS[selStation];
  const pw = min(560, canvasWidth - 36);
  const ph = 128;
  const px2 = (canvasWidth - pw) / 2;
  const py2 = drawHeight - ph - 12;
  fill(255, 255, 255, 250);
  stroke(familyView ? 'seagreen' : 'steelblue');
  strokeWeight(2);
  rect(px2, py2, pw, ph, 12);
  noStroke();
  fill(familyView ? 'seagreen' : 'steelblue');
  textAlign(LEFT, TOP);
  textSize(14);
  text((selStation + 1) + '. ' + s.name + (familyView ? ' - the supporter\'s part' : ''), px2 + 14, py2 + 10);
  fill('#333333');
  textSize(12);
  text(familyView ? s.family : s.person, px2 + 14, py2 + 32, pw - 28, ph - 40);
  textSize(defaultTextSize);
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (let i = 0; i < STATIONS.length; i++) {
    const p = stationPos(i);
    if (dist(mouseX, mouseY, p.x, p.y) < 20) {
      selStation = (selStation === i) ? -1 : i;
      return;
    }
  }
  if (hoverEmotion >= 0) { selStation = hoverEmotion; return; }
  selStation = -1;
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
