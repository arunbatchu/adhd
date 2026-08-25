// The Disclosure Decision Navigator
// CANVAS_HEIGHT: 450
// The graduated-disclosure ladder from Chapter 13: informal specific ask,
// partial disclosure, formal ADA disclosure. Clickable levels show the
// script, what it gets, what it risks, and when to escalate. Factor chips
// (workplace size, manager relationship, performance situation, stigma
// climate, need for formal protection) highlight which level the factors
// favor - always as decision support, never a verdict. Evaluate-level (L5).
// (Understanding ADHD, Chapter 13.)
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50; // 1 row
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const LEVELS = [
  { name: '1. Informal specific ask', short: 'No diagnosis attached',
    script: '"I do my best work with written follow-ups and morning focus blocks - can we set that up?"',
    gets: 'Gets: most accommodations, quietly. Nothing to un-ring.',
    risks: 'Risks: no legal protection; depends on the manager\'s goodwill.',
    escalate: 'Escalate when: asks are denied twice, or you need paper.' },
  { name: '2. Partial disclosure', short: 'Condition named, not the diagnosis',
    script: '"I have a medical condition that affects attention. Here\'s what helps: real deadlines and written follow-ups."',
    gets: 'Gets: more weight behind the asks; opens the formal door.',
    risks: 'Risks: invites questions; partially un-un-ringable.',
    escalate: 'Escalate when: you need the ADA\'s actual machinery.' },
  { name: '3. Formal ADA disclosure', short: 'In writing, through HR',
    script: 'Written notice to HR naming the disability and requesting the interactive process, with documentation.',
    gets: 'Gets: legal protection, formal accommodations, a paper trail.',
    risks: 'Risks: permanent record; stigma is illegal and still real. Timing matters: BEFORE a performance crisis.',
    escalate: 'This is the top rung. Beyond it: agencies and lawyers.' }
];

const FACTORS = [
  { name: 'Workplace', opts: ['small firm', 'large org'], val: 1 },
  { name: 'Manager', opts: ['strained', 'trusted'], val: 1 },
  { name: 'Performance', opts: ['thriving', 'fine', 'flagged'], val: 0 },
  { name: 'Stigma climate', opts: ['rough', 'okay'], val: 1 },
  { name: 'Need legal protection', opts: ['no', 'yes'], val: 0 }
];

const SCENARIOS = {
  'Explore freely': null,
  'Thriving, wants focus blocks': { f: [1, 1, 0, 1, 0], why: 'Thriving + trusted manager + no protection need: the informal ask gets everything with nothing to un-ring. Level 1 fits.' },
  'Bad review season coming': { f: [1, 1, 2, 1, 1], why: 'Timing analysis: protection works best BEFORE the crisis - disclosure after a bad review reads as excuse. If protection is genuinely needed, formalize now, in writing. Level 3.' },
  'New hire, small conservative firm': { f: [0, 0, 1, 0, 0], why: 'Caution factors stack: small firm, no track record, rough climate. Start at level 1 - ask for conditions, not with a diagnosis - and build capital first.' },
  'Informal asks denied twice': { f: [1, 0, 1, 1, 1], why: 'The informal route is exhausted. Partial disclosure adds weight; if that fails, the formal process exists for exactly this. Level 2, ready to go 3.' }
};

let scenarioSelect;
let selLevel = -1;
let scenarioWhy = null;

function favoredLevel() {
  const f = FACTORS.map(x => x.val);
  if (f[4] === 1 || f[2] === 2) return 2;              // need protection or flagged -> formal
  if (f[1] === 0 || f[3] === 0 || f[0] === 0) return 0; // strained/rough/small -> stay informal
  if (f[2] === 0 && f[1] === 1) return 0;               // thriving + trusted -> informal
  return 1;
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  scenarioSelect = createSelect();
  Object.keys(SCENARIOS).forEach(k => scenarioSelect.option(k));
  scenarioSelect.position(10, drawHeight + 10);
  scenarioSelect.parent(document.querySelector('main'));
  scenarioSelect.changed(() => {
    const s = SCENARIOS[scenarioSelect.value()];
    if (s) {
      s.f.forEach((v, i) => FACTORS[i].val = v);
      scenarioWhy = s.why;
    } else {
      scenarioWhy = null;
    }
  });

  describe('The three-level graduated disclosure ladder - informal specific ask, partial disclosure, formal ADA disclosure - each expandable with a sample script, what it gets, what it risks, and when to escalate. Factor chips for workplace size, manager relationship, performance situation, stigma climate, and protection need highlight which level the factors favor, with four playable scenarios. Framed as decision support: not disclosing is also a legitimate outcome.', LABEL);
}

function levelRect(i) {
  const w = min(300, canvasWidth * 0.46);
  return { x: 20, y: 66 + i * 78, w: w, h: 68 };
}

function factorRect(i) {
  const x0 = min(340, canvasWidth * 0.5);
  return { x: x0, y: 66 + i * 44, w: canvasWidth - x0 - 20, h: 36 };
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
  textSize(18);
  text('The Disclosure Ladder: Strategy, Not Confession', canvasWidth / 2, 6);
  textSize(defaultTextSize);

  const fav = favoredLevel();

  // ladder levels
  for (let i = 2; i >= 0; i--) {
    const r = levelRect(2 - i); // draw top rung first visually? keep order: index 0 top = level 1
  }
  for (let i = 0; i < 3; i++) {
    const r = levelRect(i);
    const hovered = mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h;
    const isFav = fav === i;
    stroke(hovered || selLevel === i ? 'black' : (isFav ? 'seagreen' : 'silver'));
    strokeWeight(isFav ? 3 : (hovered ? 2 : 1));
    fill(isFav ? '#e9f4ea' : 'white');
    rect(r.x, r.y, r.w, r.h, 10);
    noStroke();
    fill('black');
    textAlign(LEFT, TOP);
    textSize(13);
    text(LEVELS[i].name, r.x + 10, r.y + 8);
    fill('dimgray');
    textSize(11);
    text(LEVELS[i].short, r.x + 10, r.y + 27);
    if (isFav) {
      fill('seagreen');
      textSize(10.5);
      text('← your factors favor starting here', r.x + 10, r.y + 46);
    } else {
      fill('gray');
      textSize(10.5);
      text('click for script, gets, risks', r.x + 10, r.y + 46);
    }
    textSize(defaultTextSize);
  }

  // factor chips
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text('Your factors (click to change):', factorRect(0).x, 60);
  textSize(defaultTextSize);
  for (let i = 0; i < FACTORS.length; i++) {
    const r = factorRect(i);
    const f = FACTORS[i];
    const hovered = mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h;
    stroke(hovered ? 'black' : 'silver');
    strokeWeight(hovered ? 2 : 1);
    fill('white');
    rect(r.x, r.y, r.w, r.h, 8);
    noStroke();
    fill('#555555');
    textAlign(LEFT, CENTER);
    textSize(11);
    text(f.name + ':', r.x + 8, r.y + r.h / 2);
    fill('steelblue');
    textAlign(RIGHT, CENTER);
    textSize(12);
    text(f.opts[f.val], r.x + r.w - 10, r.y + r.h / 2);
    textSize(defaultTextSize);
  }

  // principle bar
  fill(252, 246, 232);
  stroke(200, 170, 110);
  strokeWeight(1);
  rect(20, drawHeight - 96, canvasWidth - 40, 24, 8);
  noStroke();
  fill('#7a5c20');
  textAlign(CENTER, CENTER);
  textSize(11.5);
  text('Disclosure is strategy, not confession. Deciding NOT to disclose is also a legitimate outcome.', canvasWidth / 2, drawHeight - 84);
  textSize(defaultTextSize);

  // detail / scenario panel
  if (selLevel >= 0) drawLevelPanel();
  else if (scenarioWhy) drawWhyPanel();
}

function drawLevelPanel() {
  const l = LEVELS[selLevel];
  const pw = canvasWidth - 40;
  const ph = 62;
  fill(255, 255, 255, 250);
  stroke('steelblue');
  strokeWeight(2);
  rect(20, drawHeight - ph - 6, pw, ph, 10);
  noStroke();
  fill('steelblue');
  textAlign(LEFT, TOP);
  textSize(11.5);
  text(l.script, 32, drawHeight - ph + 2, pw - 24, 30);
  fill('#333333');
  textSize(10.5);
  text(l.gets + '  ' + l.risks + '  ' + l.escalate, 32, drawHeight - ph + 30, pw - 24, 30);
  textSize(defaultTextSize);
}

function drawWhyPanel() {
  const pw = canvasWidth - 40;
  const ph = 62;
  fill(255, 255, 255, 250);
  stroke('seagreen');
  strokeWeight(2);
  rect(20, drawHeight - ph - 6, pw, ph, 10);
  noStroke();
  fill('seagreen');
  textAlign(LEFT, TOP);
  textSize(11.5);
  text(scenarioWhy, 32, drawHeight - ph + 4, pw - 24, ph - 12);
  textSize(defaultTextSize);
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (let i = 0; i < 3; i++) {
    const r = levelRect(i);
    if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) {
      selLevel = (selLevel === i) ? -1 : i;
      return;
    }
  }
  for (let i = 0; i < FACTORS.length; i++) {
    const r = factorRect(i);
    if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) {
      FACTORS[i].val = (FACTORS[i].val + 1) % FACTORS[i].opts.length;
      scenarioSelect.value('Explore freely');
      scenarioWhy = null;
      return;
    }
  }
  selLevel = -1;
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
