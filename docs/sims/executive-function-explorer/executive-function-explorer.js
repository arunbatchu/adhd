// Executive Function Explorer
// CANVAS_HEIGHT: 450
// Six executive functions as clickable cards (explore mode), plus a quiz
// mode that shows an everyday scenario and asks the learner to attribute it
// to the right component - with explained feedback. Analyze-level (L4):
// replacing global judgments ("irresponsible") with component-level
// diagnosis ("task initiation"). (Understanding ADHD, Chapter 2.)
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50; // 1 row
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

const EF = [
  { name: 'Working memory', plain: 'The mental desk', col: '#4a78b5',
    def: 'The small workspace where you hold information WHILE using it.',
    ages: 'Child: loses step 2 of 3 instructions. Teen: "I told you twice." Adult: arrives at the store, list gone.',
    judgment: 'Judged as: careless, not listening',
    ask: 'Ask instead: "how do we get this onto paper at the moment it arrives?"' },
  { name: 'Response inhibition', plain: 'The brake', col: '#c0563e',
    def: 'Stopping an action that is already loading - the blurt, the grab, the reply.',
    ages: 'Child: blurts answers. Teen: the sent text. Adult: the impulse purchase, the sharp reply to the boss.',
    judgment: 'Judged as: rude, reckless',
    ask: 'Ask instead: "what pause could we build in front of this?"' },
  { name: 'Cognitive flexibility', plain: 'The gear shift', col: '#6f9e6a',
    def: 'Disengaging from one task, rule, or expectation and engaging another.',
    ages: 'Child: meltdown at "bath time NOW." Teen: stuck on a ruined plan. Adult: cannot drop a dead approach.',
    judgment: 'Judged as: defiant, rigid',
    ask: 'Ask instead: "what warning would make this transition cheaper?"' },
  { name: 'Planning & prioritizing', plain: 'The map-maker', col: '#8a6fb0',
    def: 'Breaking a goal into ordered steps and deciding what matters most.',
    ages: 'Child: frozen by "clean your room." Teen: college apps untouched. Adult: everything feels equally urgent.',
    judgment: 'Judged as: lazy, overwhelmed by nothing',
    ask: 'Ask instead: "what is the first marked step - and is it small enough?"' },
  { name: 'Task initiation', plain: 'The starter motor', col: '#c78f2e',
    def: 'Converting intention into the first action. Separate from ability AND desire.',
    ages: 'Child: sits at homework, cannot begin. Teen: starts the essay at 11 pm in panic. Adult: taxes untouched for weeks, in misery.',
    judgment: 'Judged as: procrastinator, does not care',
    ask: 'Ask instead: "what would make starting smaller - or supply the urgency?"' },
  { name: 'Self-monitoring', plain: 'The dashboard', col: '#5b8a8f',
    def: 'The background process tracking how you are doing while you do it.',
    ages: 'Child: does not notice the class moved on. Teen: overtalks past the eye-rolls. Adult: misses that the meeting has cooled.',
    judgment: 'Judged as: oblivious, self-centered',
    ask: 'Ask instead: "what feedback could arrive earlier and kinder?"' }
];

const SCENARIOS = [
  { t: 'He agreed to take out the trash, walked past it four times, and swears he still meant to.', a: 4,
    why: 'The intention exists and the ability exists - converting intention into action at the moment is task initiation (with a dose of prospective memory). Not defiance: nothing about walking past it was chosen.' },
  { t: 'You gave her three instructions. She did the first one beautifully and looks blank about the rest.', a: 0,
    why: 'Three sequential verbal items exceeded the mental desk. The second instruction shoved out the first. Fix is paper, not repetition.' },
  { t: 'The restaurant was closed, and the whole evening collapsed into a meltdown.', a: 2,
    why: 'A surprise plan-change demands an instant gear shift. Weak cognitive flexibility makes unbudgeted transitions genuinely expensive.' },
  { t: 'He blurted the punchline of his sister\'s story. Again.', a: 1,
    why: 'The brake. The thought arrived and exited before review - partly because working memory cannot be trusted to hold it for a turn.' },
  { t: '"Apply to colleges" has been on her list for two months. She has not opened the portal.', a: 3,
    why: 'A fifty-step project with no marked first step reads as a wall. The map-maker has to break it down before the starter motor has anything its size.' },
  { t: 'He kept explaining the game for ten minutes after everyone stopped listening.', a: 5,
    why: 'The dashboard was not flagging the room\'s signals in real time. Feedback arrived late, from other people, at social cost.' },
  { t: 'She started the report the night before - after three weeks of dread and cleaning everything except her desk.', a: 4,
    why: 'Classic initiation failure with decoy productivity. The deadline finally supplied external ignition. The dread is the tell that this was never indifference.' },
  { t: 'Halfway through the errand he forgot why he went upstairs, twice.', a: 0,
    why: 'Working memory dropped the goal mid-carry. The information was never filed; it cannot be retrieved. Externalize the errand list.' },
  { t: 'Homework "switch to math now" starts a battle every single evening.', a: 2,
    why: 'Subject switches are transitions - each costs a gear shift. Warnings and ritualized transitions pay the toll in advance.' },
  { t: 'She interrupted the meeting with the answer... to the previous question.', a: 1,
    why: 'The brake plus the leaky desk: the thought had to exit now or be lost. A notepad gives the thought a place to wait, so the brake has time to work.' }
];

let quizMode = false;
let quizCheckbox, nextButton;
let selCard = -1;
let qIdx = 0, qAnswered = false, qCorrect = false, qScore = 0, qAsked = 0;
let qOrder = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  quizCheckbox = createCheckbox(' Quiz mode: which function is this?', false);
  quizCheckbox.position(10, drawHeight + 12);
  quizCheckbox.parent(document.querySelector('main'));
  quizCheckbox.changed(() => {
    quizMode = quizCheckbox.checked();
    selCard = -1;
    if (quizMode) resetQuiz();
    nextButton[quizMode ? 'show' : 'hide']();
  });

  nextButton = createButton('Next scenario');
  nextButton.position(310, drawHeight + 8);
  nextButton.parent(document.querySelector('main'));
  nextButton.mousePressed(() => {
    if (!qAnswered) return;
    qIdx = (qIdx + 1) % qOrder.length;
    qAnswered = false;
  });
  nextButton.hide();

  describe('Six executive function cards - working memory, response inhibition, cognitive flexibility, planning, task initiation, self-monitoring - each expandable with examples at three ages, the judgment it attracts, and the better question to ask. A quiz mode presents everyday scenarios to attribute to the right function, with explained feedback and a score.', LABEL);
}

function resetQuiz() {
  qOrder = shuffle([...Array(SCENARIOS.length).keys()]);
  qIdx = 0; qAnswered = false; qScore = 0; qAsked = 0;
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
  text(quizMode ? 'Which Function Is This?' : 'The Six Executive Functions', canvasWidth / 2, 8);
  textSize(defaultTextSize);

  if (quizMode) {
    drawScenario();
    drawCards(210);
    if (qAnswered) drawQuizFeedback();
  } else {
    drawCards(56);
    if (selCard >= 0) drawCardDetail();
  }

  if (quizMode) {
    fill('black');
    noStroke();
    textAlign(RIGHT, CENTER);
    textSize(13);
    text('Score: ' + qScore + ' / ' + qAsked, canvasWidth - 15, drawHeight + 25);
    textSize(defaultTextSize);
  }
}

function cardRect(i, topY) {
  const cols = 3;
  const cw = (canvasWidth - 40) / cols;
  const ch = quizMode ? 52 : 96;
  const r = floor(i / cols), c = i % cols;
  return { x: 20 + c * cw + 3, y: topY + r * (ch + 8), w: cw - 6, h: ch };
}

function drawCards(topY) {
  for (let i = 0; i < EF.length; i++) {
    const rct = cardRect(i, topY);
    const hovered = mouseX > rct.x && mouseX < rct.x + rct.w && mouseY > rct.y && mouseY < rct.y + rct.h;
    stroke(hovered ? 'black' : 'silver');
    strokeWeight(hovered ? 2 : 1);
    fill(255);
    rect(rct.x, rct.y, rct.w, rct.h, 8);
    noStroke();
    fill(EF[i].col);
    rect(rct.x, rct.y, rct.w, quizMode ? 6 : 10, 8, 8, 0, 0);
    fill('black');
    textAlign(CENTER, quizMode ? CENTER : TOP);
    textSize(13);
    if (quizMode) {
      text(EF[i].name, rct.x + 5, rct.y + 4, rct.w - 10, rct.h - 8);
    } else {
      text(EF[i].name, rct.x + 5, rct.y + 16, rct.w - 10, 34);
      fill('dimgray');
      textSize(12);
      textStyle(ITALIC);
      text(EF[i].plain, rct.x + 5, rct.y + 52, rct.w - 10, 30);
      textStyle(NORMAL);
    }
    textSize(defaultTextSize);
  }
  if (!quizMode && selCard < 0) {
    noStroke();
    fill('dimgray');
    textAlign(CENTER, TOP);
    textSize(12);
    text('Click a card to expand it', canvasWidth / 2, 34);
    textSize(defaultTextSize);
  }
}

function drawCardDetail() {
  const e = EF[selCard];
  const pw = min(500, canvasWidth - 44);
  const ph = 196;
  const px2 = (canvasWidth - pw) / 2;
  const py2 = drawHeight - ph - 14;
  fill(255, 255, 255, 250);
  stroke(e.col);
  strokeWeight(2);
  rect(px2, py2, pw, ph, 12);
  noStroke();
  fill(e.col);
  textAlign(LEFT, TOP);
  textSize(15);
  text(e.name + '  (' + e.plain.toLowerCase() + ')', px2 + 12, py2 + 10);
  fill('black');
  textSize(12);
  text(e.def, px2 + 12, py2 + 34, pw - 24, 34);
  fill('#333333');
  text(e.ages, px2 + 12, py2 + 66, pw - 24, 52);
  fill('firebrick');
  text(e.judgment, px2 + 12, py2 + 122, pw - 24, 20);
  fill('seagreen');
  text(e.ask, px2 + 12, py2 + 144, pw - 24, 40);
  fill('dimgray');
  textAlign(RIGHT, BOTTOM);
  textSize(10.5);
  text('click the card again to close', px2 + pw - 8, py2 + ph - 6);
  textSize(defaultTextSize);
}

function drawScenario() {
  const s = SCENARIOS[qOrder[qIdx]];
  const cw = min(560, canvasWidth - 40);
  const cx = (canvasWidth - cw) / 2;
  fill('white');
  stroke('gray');
  strokeWeight(1.5);
  rect(cx, 40, cw, 108, 10);
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textSize(14);
  text('"' + s.t + '"', cx + 12, 54, cw - 24, 90);
  fill('dimgray');
  textSize(11.5);
  text(qAnswered ? '' : 'Click the executive function underneath this behavior', cx + 12, 126, cw - 24, 20);
  textSize(defaultTextSize);
}

function drawQuizFeedback() {
  const s = SCENARIOS[qOrder[qIdx]];
  const pw = min(540, canvasWidth - 44);
  const ph = 118;
  const px2 = (canvasWidth - pw) / 2;
  const py2 = drawHeight - ph - 10;
  fill(qCorrect ? '#eef7ee' : '#fdeeee');
  stroke(qCorrect ? 'seagreen' : 'firebrick');
  strokeWeight(2);
  rect(px2, py2, pw, ph, 10);
  noStroke();
  fill(qCorrect ? 'seagreen' : 'firebrick');
  textAlign(LEFT, TOP);
  textSize(13.5);
  text((qCorrect ? 'Correct: ' : 'Actually: ') + EF[s.a].name, px2 + 12, py2 + 8);
  fill('#333333');
  textSize(12);
  text(s.why, px2 + 12, py2 + 28, pw - 24, ph - 36);
  textSize(defaultTextSize);
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  const topY = quizMode ? 210 : 56;
  for (let i = 0; i < EF.length; i++) {
    const rct = cardRect(i, topY);
    if (mouseX > rct.x && mouseX < rct.x + rct.w && mouseY > rct.y && mouseY < rct.y + rct.h) {
      if (quizMode) {
        if (qAnswered) return;
        const s = SCENARIOS[qOrder[qIdx]];
        qAnswered = true;
        qAsked++;
        qCorrect = (i === s.a);
        if (qCorrect) qScore++;
      } else {
        selCard = (selCard === i) ? -1 : i;
      }
      return;
    }
  }
  if (!quizMode) selCard = -1;
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
