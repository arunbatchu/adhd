// Next-Action Trainer
// CANVAS_HEIGHT: 450
// Two modes for the highest-value habit in Chapter 9. Judge mode: pick the
// real next action among four candidates, with feedback naming the test each
// failure flunks. Build mode: write your own next action for a stalled
// project; forgiving heuristics check verb-first, specificity, and the
// could-I-start-now test. Create-level (L6).
// (Understanding ADHD, Chapter 9.)
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50; // 1 row: mode select + new task + input (build mode)
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const JUDGE = [
  { task: 'Apply for the internship',
    opts: [
      { t: 'Work on the application', bad: 'Topic, not an action - "work on" gives the starter motor nothing its size.' },
      { t: 'Think about essay topics', bad: 'Thinking is not physically startable - it has no visible first motion.' },
      { t: 'Open the portal and screenshot the requirements list', good: true },
      { t: 'Be more organized about deadlines', bad: 'A character goal, not an action. Nothing to do right now.' }
    ] },
  { task: 'Do the taxes',
    opts: [
      { t: 'Find last year\'s return in email and download it', good: true },
      { t: 'Get serious about finances', bad: 'Character goal. Not startable.' },
      { t: 'Do the taxes this weekend', bad: 'Same project with a date stapled on - still fifty invisible steps.' },
      { t: 'Figure out the tax situation', bad: '"Figure out" requires further decisions before anything physical happens.' }
    ] },
  { task: 'Clean the garage',
    opts: [
      { t: 'Clean for an hour', bad: 'A container, not a first step - you still must decide where to start.' },
      { t: 'Put the three bikes on the wall rack', good: true },
      { t: 'Stop being a pack rat', bad: 'Character goal - and an unkind one. Nothing startable.' },
      { t: 'Sort everything into keep/donate/trash', bad: '"Everything" is a project. The real first step is one shelf, one box.' }
    ] },
  { task: 'Fix the resume',
    opts: [
      { t: 'Polish the resume', bad: '"Polish" is a topic. Which line? Doing what to it?' },
      { t: 'Update skills section', bad: 'Closer - but still requires deciding what to add first.' },
      { t: 'Add the July project as one bullet under current job', good: true },
      { t: 'Make it stand out more', bad: 'Not physically specifiable. No visible first motion.' }
    ] },
  { task: 'Plan grandma\'s birthday',
    opts: [
      { t: 'Text the family group: "dinner or lunch party?"', good: true },
      { t: 'Organize the whole celebration', bad: 'The entire project wearing a task costume.' },
      { t: 'Start thinking about venues', bad: '"Start thinking" - no first motion, requires decisions.' },
      { t: 'Handle grandma\'s birthday', bad: '"Handle" is the vaguest verb in the language.' }
    ] },
  { task: 'Renew the car registration',
    opts: [
      { t: 'Deal with the car stuff', bad: 'Vague verb + vague object. Nothing startable.' },
      { t: 'Find the renewal notice on the counter and put it by the laptop', good: true },
      { t: 'Stop procrastinating on paperwork', bad: 'Character goal - Chapter 1 retired this strategy.' },
      { t: 'Set aside time for adulting', bad: 'A container with no contents.' }
    ] }
];

const BUILD_TASKS = [
  'Clean the garage', 'Plan grandma\'s birthday', 'Fix the resume',
  'Sort the medical bills', 'Start exercising again', 'Deal with the email backlog',
  'Get the ADHD evaluation scheduled', 'Organize the kitchen'
];

const VERBS = ['open', 'find', 'put', 'text', 'call', 'email', 'write', 'grab', 'move', 'download', 'print', 'set', 'add', 'book', 'search', 'pull', 'place', 'take', 'photograph', 'screenshot', 'walk', 'ask', 'pick', 'lay', 'stack', 'fill', 'schedule', 'list'];

let mode = 'judge';
let modeSelect, newButton, buildInput, checkButton;
let jIdx = 0, jPicked = -1, jOrder = [];
let bIdx = 0, bFeedback = null, chainCount = 0;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  modeSelect = createSelect();
  modeSelect.option('Judge mode');
  modeSelect.option('Build mode');
  modeSelect.position(10, drawHeight + 10);
  modeSelect.parent(document.querySelector('main'));
  modeSelect.changed(() => {
    mode = modeSelect.value() === 'Judge mode' ? 'judge' : 'build';
    jPicked = -1; bFeedback = null; chainCount = 0;
    syncControls();
  });

  newButton = createButton('New task');
  newButton.position(120, drawHeight + 10);
  newButton.parent(document.querySelector('main'));
  newButton.mousePressed(() => {
    if (mode === 'judge') { jIdx = (jIdx + 1) % JUDGE.length; jPicked = -1; jOrder = shuffle([0, 1, 2, 3]); }
    else { bIdx = (bIdx + 1) % BUILD_TASKS.length; bFeedback = null; chainCount = 0; buildInput.value(''); }
  });

  buildInput = createInput('');
  buildInput.position(210, drawHeight + 10);
  buildInput.size(max(120, canvasWidth - 330));
  buildInput.attribute('placeholder', 'write the next action...');
  buildInput.parent(document.querySelector('main'));

  checkButton = createButton('Check it');
  checkButton.position(canvasWidth - 105, drawHeight + 10);
  checkButton.parent(document.querySelector('main'));
  checkButton.mousePressed(checkBuild);

  jOrder = shuffle([0, 1, 2, 3]);
  syncControls();

  describe('Two-mode trainer for writing real next actions. Judge mode shows a stalled task and four candidate actions - pick the genuinely startable one and get feedback naming the test each failure flunks. Build mode gives a vague project and a text field; forgiving heuristics check for a physical verb, specificity, and the could-I-start-now test, then ask "and after that?" to build a chain.', LABEL);
}

function syncControls() {
  if (mode === 'build') { buildInput.show(); checkButton.show(); }
  else { buildInput.hide(); checkButton.hide(); }
}

function checkBuild() {
  const raw = buildInput.value().trim();
  if (raw.length === 0) return;
  const lower = raw.toLowerCase();
  const firstWord = lower.split(/\s+/)[0];
  const verbFirst = VERBS.includes(firstWord);
  const specific = raw.length >= 15 && /\b(the|my|a|an|one|two|three)\b/.test(lower);
  const notProject = !/\b(everything|all of|whole|entire|organize my life|be more|stop being|get serious)\b/.test(lower);

  let score = (verbFirst ? 1 : 0) + (specific ? 1 : 0) + (notProject ? 1 : 0);
  let lines = [];
  lines.push(verbFirst ? '+ Starts with a physical verb ("' + firstWord + '")'
    : '- Try starting with a doing-verb: open, find, text, put... ("' + firstWord + '" doesn\'t move a hand)');
  lines.push(specific ? '+ Names a specific object or place'
    : '- Make it more specific: which thing, where exactly?');
  lines.push(notProject ? '+ Small enough to be one action'
    : '- This still smells like a project - split it again');

  if (score === 3) {
    chainCount++;
    if (chainCount < 3) {
      bFeedback = { ok: true, lines: lines, extra: 'That\'s a real next action. Now the chain question: AND AFTER THAT? Write the following step (only the first link needs to exist today - this is practice).' };
    } else {
      bFeedback = { ok: true, lines: lines, extra: 'Three links - that\'s a chain. Notice you never planned the whole project; you only ever needed the next ninety seconds. Press "New task" for another.' };
    }
    buildInput.value('');
  } else {
    bFeedback = { ok: false, lines: lines, extra: 'Rewrite and check again. The test: could you start it right now without deciding anything further?' };
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
  text('Next-Action Trainer', canvasWidth / 2, 8);
  textSize(defaultTextSize);

  if (mode === 'judge') drawJudge();
  else drawBuild();
}

function drawJudge() {
  const j = JUDGE[jIdx];
  noStroke();
  fill('dimgray');
  textAlign(CENTER, TOP);
  textSize(13);
  text('Stalled task:', canvasWidth / 2, 42);
  fill('black');
  textSize(17);
  text('"' + j.task + '"', canvasWidth / 2, 60);
  textSize(12);
  fill('dimgray');
  text('Which one is a real next action - startable right now, no further decisions?', canvasWidth / 2, 86);
  textSize(defaultTextSize);

  for (let k = 0; k < 4; k++) {
    const i = jOrder[k];
    const o = j.opts[i];
    const r = { x: canvasWidth / 2 - min(260, canvasWidth / 2 - 20), y: 112 + k * 46, w: min(520, canvasWidth - 40), h: 38 };
    const hovered = mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h;
    const revealed = jPicked >= 0;
    let bg = 'white';
    if (revealed && o.good) bg = '#e4f1e6';
    else if (revealed && jPicked === i && !o.good) bg = '#fbe9e2';
    stroke(hovered && !revealed ? 'black' : 'silver');
    strokeWeight(hovered && !revealed ? 2 : 1);
    fill(bg);
    rect(r.x, r.y, r.w, r.h, 8);
    noStroke();
    fill('black');
    textAlign(LEFT, CENTER);
    textSize(12.5);
    text(o.t, r.x + 12, r.y + r.h / 2, r.w - 24);
    textSize(defaultTextSize);
  }

  if (jPicked >= 0) {
    const o = j.opts[jPicked];
    const pw = min(540, canvasWidth - 40);
    const px2 = (canvasWidth - pw) / 2;
    fill(o.good ? '#eef7ee' : '#fdf3ee');
    stroke(o.good ? 'seagreen' : 'chocolate');
    strokeWeight(1.5);
    rect(px2, 302, pw, 84, 10);
    noStroke();
    fill(o.good ? 'seagreen' : 'chocolate');
    textAlign(LEFT, TOP);
    textSize(12.5);
    if (o.good) {
      text('Yes. Verb-first, specific, startable in under ten minutes, and it requires no further decisions. Press "New task" for another.', px2 + 12, 312, pw - 24, 66);
    } else {
      text('Not quite: ' + o.bad + ' (The green one passes the test: startable now, nothing left to decide.)', px2 + 12, 312, pw - 24, 66);
    }
    textSize(defaultTextSize);
  }
}

function drawBuild() {
  noStroke();
  fill('dimgray');
  textAlign(CENTER, TOP);
  textSize(13);
  text('Vague stalled project:', canvasWidth / 2, 46);
  fill('black');
  textSize(18);
  text('"' + BUILD_TASKS[bIdx] + '"', canvasWidth / 2, 66);
  textSize(12.5);
  fill('dimgray');
  text(chainCount === 0
    ? 'Write ONE next action in the box below, then press "Check it".'
    : 'Chain link ' + (chainCount + 1) + ': and after that?', canvasWidth / 2, 96);
  textSize(defaultTextSize);

  // heuristics reminder card
  fill(255, 255, 255, 235);
  stroke(210);
  rect(canvasWidth / 2 - 190, 122, 380, 62, 10);
  noStroke();
  fill('#555555');
  textSize(11.5);
  textAlign(LEFT, TOP);
  text('A real next action: starts with a doing-verb - names a specific object or place - takes under ten minutes - needs no further decisions.', canvasWidth / 2 - 178, 132, 356, 46);
  textSize(defaultTextSize);

  if (bFeedback) {
    const pw = min(540, canvasWidth - 40);
    const px2 = (canvasWidth - pw) / 2;
    fill(bFeedback.ok ? '#eef7ee' : '#fdf3ee');
    stroke(bFeedback.ok ? 'seagreen' : 'chocolate');
    strokeWeight(1.5);
    rect(px2, 198, pw, 168, 10);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(12);
    let y = 208;
    for (const line of bFeedback.lines) {
      fill(line.startsWith('+') ? 'seagreen' : 'chocolate');
      text(line, px2 + 12, y, pw - 24, 30);
      y += 24;
    }
    fill('#333333');
    text(bFeedback.extra, px2 + 12, y + 6, pw - 24, 80);
    textSize(defaultTextSize);
  }
}

function mousePressed() {
  if (mode !== 'judge' || mouseY < 0 || mouseY > drawHeight) return;
  if (jPicked >= 0) return;
  const j = JUDGE[jIdx];
  for (let k = 0; k < 4; k++) {
    const i = jOrder[k];
    const r = { x: canvasWidth / 2 - min(260, canvasWidth / 2 - 20), y: 112 + k * 46, w: min(520, canvasWidth - 40), h: 38 };
    if (mouseX > r.x && mouseX < r.x + r.w && mouseY > r.y && mouseY < r.y + r.h) {
      jPicked = i;
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  buildInput.size(max(120, canvasWidth - 330));
  checkButton.position(canvasWidth - 105, drawHeight + 10);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
