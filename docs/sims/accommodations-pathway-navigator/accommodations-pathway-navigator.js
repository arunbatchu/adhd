// The Accommodations Pathway Navigator
// CANVAS_HEIGHT: 450
// Branching map of the two accommodation pathways - K-12 (504 vs IEP) and
// college (disability services) - with every node clickable for what happens,
// who acts (color-coded parent/shared/student), what to put in writing, and
// the classic mistake. Scenario presets trace Amara (504), Dev (IEP), and a
// college freshman. A who-owns toggle makes the ownership handoff stark.
// Apply-level (L3). US-based process. (Understanding ADHD, Chapter 12.)
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50; // 1 row
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// owner: 0 parent-led, 1 shared, 2 student-led
const OWNER_COLORS = ['#c98a3d', '#7d5ba6', '#3f7d4e'];
const OWNER_NAMES = ['parent-led', 'shared', 'student-led'];

// nodes: fx/fy fractions of draw area
const NODES = [
  { id: 'start', label: 'Struggling +\nADHD diagnosis', fx: 0.5, fy: 0.10, owner: 1, path: 'both',
    info: 'The entry point. The question that splits the map: K-12, or college? Different laws, different drivers.',
    mistake: 'Classic mistake: assuming the process finds you. Nothing starts until someone asks in writing.' },
  { id: 'k-request', label: 'WRITTEN request\nto the school', fx: 0.22, fy: 0.28, owner: 0, path: 'k12',
    info: 'An email to the principal or counselor requesting evaluation for a 504/IEP starts legal clocks a hallway chat does not. Attach the evaluation report.',
    mistake: 'Classic mistake: mentioning it verbally at conferences and waiting. Amara\'s version one.' },
  { id: 'k-eval', label: 'School\nevaluation', fx: 0.22, fy: 0.46, owner: 1, path: 'k12',
    info: 'The school gathers data - teacher input, records, your documentation. Bring the Chapter 5 report; its recommendations section was written for this.',
    mistake: 'Classic mistake: "she\'s passing, so no plan." Passing is not the standard - access is. Ask what the grades cost.' },
  { id: 'k-decide', label: 'Needs specialized\ninstruction?', fx: 0.22, fy: 0.64, owner: 1, path: 'k12', diamond: true,
    info: 'The fork: access changes only (504) or actual teaching changes and services (IEP). ADHD alone often fits a 504; ADHD + learning disabilities often needs the IEP.',
    mistake: 'Classic mistake: fighting for the "bigger" plan on principle. The right plan is the one matching the need.' },
  { id: 'k-504', label: '504 plan', fx: 0.10, fy: 0.82, owner: 1, path: 'k12',
    info: 'Accommodations formalized: extended time, seating, written instructions, check-ins. Signed, distributed to all teachers, reviewed each spring.',
    mistake: 'Classic mistake: the plan exists but is not followed. Escalate politely, in writing: teacher, coordinator, principal, district.' },
  { id: 'k-iep', label: 'IEP', fx: 0.345, fy: 0.82, owner: 1, path: 'k12',
    info: 'Everything a 504 offers plus services, instruction changes, measurable goals, annual team reviews, parental sign-off. Dev\'s path: ADHD plus dyslexia.',
    mistake: 'Classic mistake: skipping the annual review. Plans decay like every system - fourth grade\'s plan will not fit seventh.' },
  { id: 'c-selfid', label: 'Student self-identifies\nto disability services', fx: 0.78, fy: 0.28, owner: 2, path: 'college',
    info: 'The college will not find you. The student registers with disability services BEFORE the first semester - accommodations do not apply retroactively to failed midterms.',
    mistake: 'Classic mistake: waiting for the first disaster. Or a parent calling - FERPA and the ADA make the student the only driver.' },
  { id: 'c-docs', label: 'Provide\ndocumentation', fx: 0.78, fy: 0.46, owner: 2, path: 'college',
    info: 'The evaluation report again - check the college\'s recency requirements before freshman year.',
    mistake: 'Classic mistake: discovering junior year that the documentation is "too old" mid-crisis.' },
  { id: 'c-process', label: 'Interactive process\n+ letters issued', fx: 0.78, fy: 0.64, owner: 2, path: 'college',
    info: 'An intake conversation - rehearse the 20-second mechanism-pattern-ask - then accommodation letters: extended time, reduced-distraction testing, notes support, priority registration.',
    mistake: 'Classic mistake: under-asking. Priority registration is underused gold.' },
  { id: 'c-activate', label: 'ACTIVATE letters\nevery term', fx: 0.78, fy: 0.82, owner: 2, path: 'college',
    info: 'Letters typically must be requested each term and delivered to each professor. A prospective-memory task gating all the others - calendar it with an alarm, first week, every term.',
    mistake: 'Classic mistake: registered freshman year, never activated since. The letters do nothing from a drawer.' }
];

const EDGES = [
  ['start', 'k-request'], ['start', 'c-selfid'],
  ['k-request', 'k-eval'], ['k-eval', 'k-decide'],
  ['k-decide', 'k-504'], ['k-decide', 'k-iep'],
  ['c-selfid', 'c-docs'], ['c-docs', 'c-process'], ['c-process', 'c-activate']
];

const SCENARIOS = {
  'Explore freely': [],
  'Amara, 7th grade (504)': ['start', 'k-request', 'k-eval', 'k-decide', 'k-504'],
  'Dev, 10th grade (IEP)': ['start', 'k-request', 'k-eval', 'k-decide', 'k-iep'],
  'College freshman': ['start', 'c-selfid', 'c-docs', 'c-process', 'c-activate']
};

let scenarioSelect, ownerCheckbox;
let showOwners = false;
let activePath = [];
let selNode = null;

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
    activePath = SCENARIOS[scenarioSelect.value()];
    selNode = null;
  });

  ownerCheckbox = createCheckbox(' Who owns each step? (parent / shared / student)', false);
  ownerCheckbox.position(220, drawHeight + 14);
  ownerCheckbox.parent(document.querySelector('main'));
  ownerCheckbox.changed(() => { showOwners = ownerCheckbox.checked(); });

  describe('Branching flowchart of the two accommodation pathways: K-12 through written request, school evaluation, and the 504-versus-IEP fork, and college through student self-identification, documentation, the interactive process, and per-term letter activation. Every node opens details on what happens, who acts, and the classic mistake. Scenario presets trace three cases, and an ownership toggle color-codes the parent-to-student handoff.', LABEL);
}

function nodeRect(n) {
  const w = min(150, canvasWidth * 0.22), h = 42;
  return { x: n.fx * canvasWidth - w / 2, y: 40 + n.fy * (drawHeight - 90) - h / 2, w, h };
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
  text('The Accommodations Pathways (US)', canvasWidth / 2, 6);
  textSize(defaultTextSize);

  // branch labels
  noStroke();
  fill('dimgray');
  textSize(12);
  textAlign(CENTER, TOP);
  text('K-12: parents can drive', canvasWidth * 0.22, 30);
  text('College: only the student drives', canvasWidth * 0.78, 30);
  textSize(defaultTextSize);

  // edges
  for (const [a, b] of EDGES) {
    const na = NODES.find(n => n.id === a), nb = NODES.find(n => n.id === b);
    const ra = nodeRect(na), rb = nodeRect(nb);
    const onPath = activePath.includes(a) && activePath.includes(b);
    stroke(onPath ? color(230, 126, 34) : color(170));
    strokeWeight(onPath ? 3 : 1.5);
    line(ra.x + ra.w / 2, ra.y + ra.h, rb.x + rb.w / 2, rb.y);
    // arrowhead
    const ax = rb.x + rb.w / 2, ay = rb.y;
    noStroke();
    fill(onPath ? color(230, 126, 34) : color(170));
    triangle(ax - 4, ay - 6, ax + 4, ay - 6, ax, ay);
  }

  // nodes
  for (const n of NODES) {
    const r = nodeRect(n);
    const hovered = mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h;
    const onPath = activePath.includes(n.id);
    const ownerCol = OWNER_COLORS[n.owner];
    stroke(hovered || selNode === n.id ? 'black' : (showOwners ? ownerCol : 'gray'));
    strokeWeight(hovered || selNode === n.id ? 2.5 : (showOwners ? 2.5 : 1.2));
    fill(onPath ? '#fdebd2' : 'white');
    if (n.diamond) {
      quad(r.x + r.w / 2, r.y - 4, r.x + r.w + 6, r.y + r.h / 2, r.x + r.w / 2, r.y + r.h + 4, r.x - 6, r.y + r.h / 2);
    } else {
      rect(r.x, r.y, r.w, r.h, 8);
    }
    noStroke();
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(10.5);
    text(n.label, r.x + r.w / 2, r.y + r.h / 2);
    if (showOwners) {
      fill(ownerCol);
      textSize(9);
      textAlign(CENTER, TOP);
      text(OWNER_NAMES[n.owner], r.x + r.w / 2, r.y + r.h + 2);
    }
    textSize(defaultTextSize);
  }

  if (showOwners) drawOwnerLegend();
  if (selNode) drawNodePanel();
  else {
    noStroke();
    fill('dimgray');
    textSize(11);
    textAlign(CENTER, BOTTOM);
    text('Click any step - or load a scenario below', canvasWidth / 2, drawHeight - 4);
    textSize(defaultTextSize);
  }
}

function drawOwnerLegend() {
  const lx = 12, ly = drawHeight - 74;
  fill(255, 255, 255, 230);
  stroke(210);
  rect(lx, ly, 118, 62, 8);
  noStroke();
  textSize(10.5);
  textAlign(LEFT, CENTER);
  for (let i = 0; i < 3; i++) {
    fill(OWNER_COLORS[i]);
    circle(lx + 14, ly + 13 + i * 18, 10);
    fill('black');
    text(OWNER_NAMES[i], lx + 26, ly + 13 + i * 18);
  }
  textSize(defaultTextSize);
}

function drawNodePanel() {
  const n = NODES.find(x => x.id === selNode);
  const pw = min(520, canvasWidth - 40);
  const ph = 108;
  const px2 = (canvasWidth - pw) / 2;
  const py2 = drawHeight - ph - 8;
  fill(255, 255, 255, 250);
  stroke(OWNER_COLORS[n.owner]);
  strokeWeight(2);
  rect(px2, py2, pw, ph, 10);
  noStroke();
  fill(OWNER_COLORS[n.owner]);
  textAlign(LEFT, TOP);
  textSize(13);
  text(n.label.replace('\n', ' ') + '   [' + OWNER_NAMES[n.owner] + ']', px2 + 12, py2 + 8);
  fill('#333333');
  textSize(11.5);
  text(n.info, px2 + 12, py2 + 28, pw - 24, 48);
  fill('firebrick');
  text(n.mistake, px2 + 12, py2 + 76, pw - 24, 30);
  textSize(defaultTextSize);
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  for (const n of NODES) {
    const r = nodeRect(n);
    if (mouseX > r.x - 6 && mouseX < r.x + r.w + 6 && mouseY > r.y - 4 && mouseY < r.y + r.h + 4) {
      selNode = (selNode === n.id) ? null : n.id;
      return;
    }
  }
  selNode = null;
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
