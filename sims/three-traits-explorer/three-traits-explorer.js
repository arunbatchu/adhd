// Three Traits Across Three Ages Explorer
// CANVAS_HEIGHT: 450
// A 3x3 clickable grid: inattention, hyperactivity, and impulsivity as they
// look in childhood, adolescence, and adulthood. A "Who gets noticed?" toggle
// shades each cell by how likely that presentation is to trigger a referral,
// making the diagnosis gap visible (Understanding ADHD, Chapter 1).
// MicroSim template version 2026.03

let containerWidth;
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 50; // 1 row
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;
let margin = 25;
let defaultTextSize = 16;

// grid geometry (computed each frame from canvasWidth)
const COLS = ['Child (6-12)', 'Teen (13-18)', 'Adult (19+)'];
const ROWS = ['Inattention', 'Hyperactivity', 'Impulsivity'];
const ROW_COLORS = ['#4a78b5', '#d98032', '#7d5ba6']; // blue, orange, purple
let headerH = 46;    // title band
let colHeadH = 26;
let rowHeadW = 110;

// referral likelihood per cell 0..1 (1 = usually noticed)
// rows: inattention, hyperactivity, impulsivity; cols: child, teen, adult
const NOTICED = [
  [0.25, 0.20, 0.10],
  [0.95, 0.55, 0.15],
  [0.85, 0.60, 0.30]
];

const CELLS = [
  [ // inattention
    { snap: 'Reads the same page four times; loses the folder weekly',
      examples: ['Homework "done" but lost', 'Misses multi-step instructions', 'Daydreams through lessons'],
      quote: '"I was listening... what did she say?"',
      misread: 'Misread as: not trying, careless' },
    { snap: 'Bright but "not applying herself"; missing assignments pile up',
      examples: ['Finished work never turned in', 'Studies but can\'t hold focus', 'Grades slide as demands rise'],
      quote: '"Everyone else can just do it. What is wrong with me?"',
      misread: 'Misread as: lazy, unmotivated' },
    { snap: 'Drowning inbox, double-booked calendar, unopened mail drawer',
      examples: ['Loses keys and threads of talk', 'Forgets commitments made sincerely', 'Avoids paperwork for weeks'],
      quote: '"I run twice as hard to look half as organized."',
      misread: 'Misread as: doesn\'t care about you' }
  ],
  [ // hyperactivity
    { snap: 'Out of seat during dinner, the fire drill, and grandma\'s visit',
      examples: ['Runs and climbs at wrong times', 'Can\'t stay seated when asked', 'Always "on the go"'],
      quote: '"My legs just want to GO."',
      misread: 'Misread as: bad parenting, defiance' },
    { snap: 'Motor goes inside: fidgeting, restlessness, talking fast',
      examples: ['Jiggling knee, chewed pens', 'Feels crawling restlessness in class', 'Fills every silence'],
      quote: '"I look calm. Inside, my brain is channel-surfing itself."',
      misread: 'Misread as: grew out of it' },
    { snap: 'Overfilled calendar, three side projects, can\'t relax on vacation',
      examples: ['Volunteers for too much', 'Job changes when roles get routine', 'Stillness is uncomfortable'],
      quote: '"A quiet Saturday stresses me more than a deadline."',
      misread: 'Misread as: allergic to rest, never satisfied' }
  ],
  [ // impulsivity
    { snap: 'Blurts answers, grabs toys, cuts the lunch line',
      examples: ['Answers before the question ends', 'Trouble waiting turns', 'Interrupts constantly'],
      quote: '"The words come out before I decide to say them."',
      misread: 'Misread as: rude, spoiled' },
    { snap: 'Risky choices in the moment: driving, spending, comebacks',
      examples: ['The sharp reply sent unread', 'Impulse purchases', 'Dares accepted instantly'],
      quote: '"I knew better one second AFTER I did it."',
      misread: 'Misread as: doesn\'t think, doesn\'t care' },
    { snap: 'The sent email, the sudden quit, the argument sentence you can\'t unsay',
      examples: ['Interrupts in meetings', 'Big decisions made in minutes', 'Regret arrives right on time'],
      quote: '"My brake works. It\'s just slower than my accelerator."',
      misread: 'Misread as: unreliable, self-centered' }
  ]
];

let noticedOn = false;
let selRow = -1, selCol = -1;   // expanded cell (-1 = none)
let noticedCheckbox, closeHint = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);

  noticedCheckbox = createCheckbox(' Who gets noticed? (shade by referral likelihood)', false);
  noticedCheckbox.position(10, drawHeight + 12);
  noticedCheckbox.parent(document.querySelector('main'));
  noticedCheckbox.changed(() => { noticedOn = noticedCheckbox.checked(); });

  describe('A three-by-three grid showing how inattention, hyperactivity, and impulsivity look in childhood, adolescence, and adulthood. Click any cell for examples, a first-person quote, and the common misreading. A checkbox shades cells by how likely each presentation is to be noticed and referred for evaluation.', LABEL);
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
  text('Three Traits Across Three Ages', canvasWidth / 2, 10);
  textSize(defaultTextSize);

  drawGrid();
  if (selRow >= 0) drawDetail();
}

function cellRect(r, c) {
  const gx = rowHeadW;
  const gy = headerH + colHeadH;
  const cw = (canvasWidth - rowHeadW - 10) / 3;
  const ch = (drawHeight - gy - 10) / 3;
  return { x: gx + c * cw, y: gy + r * ch, w: cw - 6, h: ch - 6 };
}

function drawGrid() {
  const gy = headerH + colHeadH;
  // column headers
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(14);
  for (let c = 0; c < 3; c++) {
    const rct = cellRect(0, c);
    text(COLS[c], rct.x + rct.w / 2, headerH + colHeadH / 2);
  }
  // row headers
  textAlign(RIGHT, CENTER);
  for (let r = 0; r < 3; r++) {
    const rct = cellRect(r, 0);
    fill(ROW_COLORS[r]);
    text(ROWS[r], rowHeadW - 8, rct.y + rct.h / 2);
  }
  textSize(defaultTextSize);

  // cells
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const rct = cellRect(r, c);
      const hovered = mouseX > rct.x && mouseX < rct.x + rct.w &&
                      mouseY > rct.y && mouseY < rct.y + rct.h;
      let base = color(ROW_COLORS[r]);
      // shading: noticed cells dark/saturated, missed cells pale
      const level = noticedOn ? NOTICED[r][c] : 0.55;
      const bg = lerpColor(color(245), base, 0.15 + 0.75 * level);
      stroke(hovered ? 'black' : 'silver');
      strokeWeight(hovered ? 2 : 1);
      fill(bg);
      rect(rct.x, rct.y, rct.w, rct.h, 8);

      noStroke();
      fill(level > 0.55 ? 'white' : '#333333');
      textAlign(LEFT, TOP);
      textSize(12.5);
      text(CELLS[r][c].snap, rct.x + 8, rct.y + 6, rct.w - 16, rct.h - 10);
      if (noticedOn) {
        textAlign(RIGHT, BOTTOM);
        textSize(11);
        const pct = round(NOTICED[r][c] * 100);
        text(pct >= 50 ? 'usually noticed' : 'usually missed', rct.x + rct.w - 6, rct.y + rct.h - 4);
      }
      textSize(defaultTextSize);
    }
  }

  // hint
  if (selRow < 0) {
    noStroke();
    fill('dimgray');
    textAlign(CENTER, BOTTOM);
    textSize(12);
    text('Click any cell to expand it', canvasWidth / 2, drawHeight - 4);
    textSize(defaultTextSize);
  }
}

function drawDetail() {
  const d = CELLS[selRow][selCol];
  const pw = min(460, canvasWidth - 40);
  const ph = 250;
  const px = (canvasWidth - pw) / 2;
  const py = (drawHeight - ph) / 2 + 10;

  fill(255, 255, 255, 248);
  stroke(ROW_COLORS[selRow]);
  strokeWeight(2);
  rect(px, py, pw, ph, 12);
  noStroke();

  fill(ROW_COLORS[selRow]);
  textAlign(LEFT, TOP);
  textSize(16);
  text(ROWS[selRow] + ' - ' + COLS[selCol], px + 14, py + 12);

  fill('black');
  textSize(13);
  let y = py + 40;
  for (const ex of d.examples) {
    text('- ' + ex, px + 14, y, pw - 28, 40);
    y += 22;
  }
  fill('#444444');
  textStyle(ITALIC);
  text(d.quote, px + 14, y + 6, pw - 28, 44);
  textStyle(NORMAL);
  fill('firebrick');
  text(d.misread, px + 14, py + ph - 52, pw - 28, 40);

  fill('dimgray');
  textAlign(RIGHT, BOTTOM);
  textSize(11);
  text('click anywhere to close', px + pw - 10, py + ph - 6);
  textSize(defaultTextSize);
}

function mousePressed() {
  if (mouseY < 0 || mouseY > drawHeight) return;
  if (selRow >= 0) { selRow = -1; selCol = -1; return; }
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const rct = cellRect(r, c);
      if (mouseX > rct.x && mouseX < rct.x + rct.w &&
          mouseY > rct.y && mouseY < rct.y + rct.h) {
        selRow = r; selCol = c;
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
