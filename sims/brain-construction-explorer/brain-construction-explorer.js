// Brain Construction Schedule Explorer
// CANVAS_HEIGHT: 480
// A side-profile brain whose regions fill with color as they mature. An age
// slider (0-30) drives the fill; the prefrontal region visibly finishes last.
// An ADHD toggle shifts only the prefrontal schedule ~2-3 years later, and a
// life-demands track lights milestones that arrive on a fixed schedule.
// Click any region for what it handles and when it matures.
// Illustrative of maturation ordering, not clinical measurement.
// (Understanding ADHD, Chapter 2.)
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 80; // 2 rows
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let sliderLeftMargin = 175; // Play button + "Age: nn" label
let defaultTextSize = 16;

// regions: relative placement inside a head profile facing RIGHT
// center = logistic midpoint age; speed = steepness
const REGIONS = [
  { name: 'Visual (back)', center: 4, speed: 1.6, col: [100, 150, 210],
    fx: 0.255, fy: 0.48, fw: 0.16, fh: 0.30,
    info: 'Seeing and processing images. Among the earliest regions to mature - toddlers see the world in full fidelity.' },
  { name: 'Movement & sensation', center: 6, speed: 1.8, col: [110, 180, 140],
    fx: 0.42, fy: 0.33, fw: 0.19, fh: 0.26,
    info: 'Moving the body, feeling touch. Matures early - which is why a 6-year-old can run, climb, and grab with precision.' },
  { name: 'Emotion (deep centers)', center: 7, speed: 2.0, col: [220, 150, 90],
    fx: 0.47, fy: 0.62, fw: 0.17, fh: 0.20,
    info: 'Generating feelings - fear, joy, anger - at full strength from early childhood. The emotions arrive years before the systems that manage them.' },
  { name: 'Language & integration', center: 10, speed: 2.4, col: [170, 130, 200],
    fx: 0.60, fy: 0.40, fw: 0.17, fh: 0.28,
    info: 'Words, meaning, connecting information across senses. Matures through the school years.' },
  { name: 'Prefrontal (self-management)', center: 16, speed: 3.2, col: [230, 126, 34],
    fx: 0.775, fy: 0.47, fw: 0.16, fh: 0.30, prefrontal: true,
    info: 'Planning, self-control, judgment, working memory - the circuit breaker panel. Installed LAST: construction runs into the mid-20s. With the ADHD toggle on, this one region runs ~2-3 years later still.' }
];

const MILESTONES = [
  { age: 5, label: 'kindergarten' },
  { age: 10, label: 'homework alone' },
  { age: 16, label: 'driver\'s license' },
  { age: 18, label: 'college / job' }
];

let ageSlider, adhdCheckbox, playButton;
let adhdOn = false;
let playing = false;
let selRegion = -1;

function maturity(center, speed, age) {
  return constrain(100 / (1 + exp(-(age - center) / speed)), 0, 100);
}

function regionMaturity(r, age) {
  let c = r.center;
  if (r.prefrontal && adhdOn) c += 2.5;
  return maturity(c, r.speed, age);
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  playButton = createButton('Play');
  playButton.position(10, drawHeight + 8);
  playButton.parent(document.querySelector('main'));
  playButton.mousePressed(() => {
    playing = !playing;
    playButton.html(playing ? 'Stop' : 'Play');
  });

  ageSlider = createSlider(0, 30, 10, 0.5);
  ageSlider.position(sliderLeftMargin, drawHeight + 10);
  ageSlider.size(canvasWidth - sliderLeftMargin - margin);
  ageSlider.parent(document.querySelector('main'));

  adhdCheckbox = createCheckbox(' ADHD trajectory (prefrontal region runs ~2-3 years later)', false);
  adhdCheckbox.position(10, drawHeight + 47);
  adhdCheckbox.parent(document.querySelector('main'));
  adhdCheckbox.changed(() => { adhdOn = adhdCheckbox.checked(); });

  describe('Side-profile brain with five clickable regions that fill with color as they mature, driven by an age slider from 0 to 30. The prefrontal self-management region visibly finishes last. A toggle shifts only the prefrontal schedule two to three years later to show the ADHD trajectory, and a milestone track lights kindergarten, homework, driving, and college as the slider passes them.', LABEL);
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
  text('Brain Construction Schedule', canvasWidth / 2, 8);
  textSize(defaultTextSize);

  if (playing) {
    let a = ageSlider.value() + 0.06;
    if (a >= 30) { a = 30; playing = false; playButton.html('Play'); }
    ageSlider.value(a);
  }
  const age = ageSlider.value();

  drawHead();
  drawRegions(age);
  drawMilestoneTrack(age);
  if (selRegion >= 0) drawRegionInfo(age);

  // control labels
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  text('Age: ' + nf(age, 1, 1), 75, drawHeight + 20);
}

function headBox() {
  // head area occupies center of draw region
  const w = min(canvasWidth - 80, 560);
  const h = 250;
  return { x: (canvasWidth - w) / 2, y: 55, w: w, h: h };
}

function drawHead() {
  const b = headBox();
  // simple head profile facing right: skull ellipse + face hint
  stroke(150);
  strokeWeight(2);
  fill(250);
  ellipse(b.x + b.w * 0.52, b.y + b.h * 0.48, b.w * 0.78, b.h * 0.86);
  // nose hint
  line(b.x + b.w * 0.905, b.y + b.h * 0.50, b.x + b.w * 0.95, b.y + b.h * 0.60);
  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, TOP);
  text('back of head', b.x + b.w * 0.08, b.y + b.h * 0.92);
  textAlign(RIGHT, TOP);
  text('forehead', b.x + b.w * 0.95, b.y + b.h * 0.05);
  textSize(defaultTextSize);
}

function regionRect(r) {
  const b = headBox();
  return {
    x: b.x + (r.fx - r.fw / 2) * b.w,
    y: b.y + (r.fy - r.fh / 2) * b.h,
    w: r.fw * b.w,
    h: r.fh * b.h
  };
}

function drawRegions(age) {
  for (let i = 0; i < REGIONS.length; i++) {
    const r = REGIONS[i];
    const m = regionMaturity(r, age) / 100;
    const rr = regionRect(r);
    const hovered = mouseX > rr.x && mouseX < rr.x + rr.w && mouseY > rr.y && mouseY < rr.y + rr.h;

    // pale base
    stroke(hovered || selRegion === i ? 'black' : 'gray');
    strokeWeight(hovered || selRegion === i ? 2 : 1);
    fill(245);
    ellipse(rr.x + rr.w / 2, rr.y + rr.h / 2, rr.w, rr.h);
    // saturated fill by maturity
    noStroke();
    fill(r.col[0], r.col[1], r.col[2], 40 + 215 * m);
    ellipse(rr.x + rr.w / 2, rr.y + rr.h / 2, rr.w * (0.35 + 0.65 * m), rr.h * (0.35 + 0.65 * m));

    // percent label
    fill(m > 0.55 ? 255 : 60);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(round(m * 100) + '%', rr.x + rr.w / 2, rr.y + rr.h / 2);
    textSize(defaultTextSize);
  }
  // callout for prefrontal lag when toggle on
  if (adhdOn) {
    const r = REGIONS[4];
    const rr = regionRect(r);
    noStroke();
    fill('firebrick');
    textSize(11);
    textAlign(CENTER, TOP);
    text('running late', rr.x + rr.w / 2, rr.y + rr.h + 4);
    textSize(defaultTextSize);
  }
  // hint
  noStroke();
  fill('dimgray');
  textSize(11.5);
  textAlign(CENTER, TOP);
  text('Click a region to learn what it does', canvasWidth / 2, 34);
  textSize(defaultTextSize);
}

function drawMilestoneTrack(age) {
  const y = drawHeight - 52;
  const trackL = 60, trackR = canvasWidth - 30;
  stroke(180);
  strokeWeight(2);
  line(trackL, y, trackR, y);
  noStroke();
  fill('dimgray');
  textSize(11);
  textAlign(LEFT, CENTER);
  text('life demands:', trackL - 50, y - 16);
  for (let mi = 0; mi < MILESTONES.length; mi++) {
    const m = MILESTONES[mi];
    const x = map(m.age, 0, 30, trackL, trackR);
    const hit = age >= m.age;
    fill(hit ? color(200, 90, 60) : color(210));
    stroke(hit ? color(150, 60, 40) : color(170));
    strokeWeight(1);
    circle(x, y, 12);
    noStroke();
    fill(hit ? 'black' : 'gray');
    textAlign(CENTER, TOP);
    // stagger labels so neighbors (16, 18) don't overlap
    text(m.label, x, y + 8 + (mi % 2 === 1 ? 13 : 0));
    textAlign(CENTER, BOTTOM);
    text(m.age, x, y - 8);
  }
  textSize(defaultTextSize);
  // demand-vs-prefrontal caption when a milestone just passed
  const pf = REGIONS[4];
  const pfM = round(regionMaturity(pf, age));
  const lastHit = MILESTONES.filter(m => age >= m.age).pop();
  if (lastHit) {
    noStroke();
    fill('firebrick');
    textSize(12);
    textAlign(CENTER, BOTTOM);
    text('"' + lastHit.label + '" arrived at age ' + lastHit.age +
      ' - self-management available: ' + pfM + '%', canvasWidth / 2, drawHeight - 4);
    textSize(defaultTextSize);
  }
}

function drawRegionInfo(age) {
  const r = REGIONS[selRegion];
  const m = round(regionMaturity(r, age));
  const pw = min(430, canvasWidth - 50);
  const px2 = (canvasWidth - pw) / 2;
  const py2 = 62;
  fill(255, 255, 255, 246);
  stroke(r.col[0], r.col[1], r.col[2]);
  strokeWeight(2);
  rect(px2, py2, pw, 96, 10);
  noStroke();
  fill(r.col[0] * 0.8, r.col[1] * 0.8, r.col[2] * 0.8);
  textAlign(LEFT, TOP);
  textSize(14);
  text(r.name + ' - ' + m + '% at age ' + nf(age, 1, 1), px2 + 12, py2 + 10);
  fill('black');
  textSize(12);
  text(r.info, px2 + 12, py2 + 32, pw - 24, 60);
  fill('dimgray');
  textAlign(RIGHT, BOTTOM);
  textSize(10.5);
  text('click elsewhere to close', px2 + pw - 8, py2 + 92);
  textSize(defaultTextSize);
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (let i = 0; i < REGIONS.length; i++) {
    const rr = regionRect(REGIONS[i]);
    if (mouseX > rr.x && mouseX < rr.x + rr.w && mouseY > rr.y && mouseY < rr.y + rr.h) {
      selRegion = (selRegion === i) ? -1 : i;
      return;
    }
  }
  selRegion = -1;
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
