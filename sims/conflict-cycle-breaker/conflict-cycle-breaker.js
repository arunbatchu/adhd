// The Conflict Cycle Breaker
// CANVAS_HEIGHT: 520
// The family conflict loop as an interactive causal ring: seven stages, each
// clickable with anatomy, sample dialogue, and WHO can act there - plus
// green exit nodes that cut specific edges and show the replacement
// sentence. A run-one-turn animation walks the loop with dialogue.
// Analyze-level (L4). (Understanding ADHD, Chapter 14.)

function isInIframe() {
  try { return window.self !== window.top; } catch (e) { return true; }
}

// who: 0 family, 1 person with ADHD, 2 either
const WHO_COLORS = ['#c98a3d', '#3f7d4e', '#7d5ba6'];
const WHO_NAMES = ['family member', 'person with ADHD', 'either person'];

const STAGES = [
  { id: 1, label: 'Demand at a\nbad moment', who: 0,
    dialogue: '"Take the trash out NOW" - mid-game, mid-transition, 9 pm, fried battery.',
    detail: 'Timing and form set the turn\'s trajectory. The family member acts here: daylight, calm, one thing at a time, warning before transitions.' },
  { id: 2, label: 'Disappointing\nresponse', who: 2,
    dialogue: '"In a minute" (the minute never comes) - or the task genuinely evaporates.',
    detail: 'Task initiation, transition tax, or prospective memory doing what Chapter 2 said they do. Not chosen - but real, and it lands on the other person\'s day.' },
  { id: 3, label: 'Escalated\nrepetition', who: 0,
    dialogue: '"Did you do it YET? I\'ve asked THREE times."',
    detail: 'The unrequested reminder, repeated, with rising emotional load. The exit here: the system carries the reminder, not the person.' },
  { id: 4, label: 'Defensive spike\n(RSD)', who: 1,
    dialogue: '"GET OFF MY BACK." (or total shutdown)',
    detail: 'The tone got detected as correction; the file that says "I am the failure" got touched. The exit here belongs to the person: the pause - "I\'m taking ten."' },
  { id: 5, label: 'Blowup', who: 2,
    dialogue: 'Words at intensity 95 that both people have to metabolize later.',
    detail: 'The turn\'s crater. Repair (the green node after this stage) converts it from damage into data.' },
  { id: 6, label: 'Stories confirmed,\nledgers updated', who: 2,
    dialogue: '"Nothing works with him." / "Nothing I do is enough."',
    detail: 'Both sides file the turn as evidence. The ledgers are what make the NEXT turn faster.' },
  { id: 7, label: 'Ambient tension\nrises', who: 2,
    dialogue: '(The house gets quieter and tighter.)',
    detail: 'Which makes the next demand land worse - feeding stage one. Around and around, each turn faster.' }
];

const EXITS = [
  { id: 101, label: 'Time the\ndemand', cuts: 'e1', who: 0,
    replace: 'Replacement: "After this round ends - five-minute warning - can you take the trash?" (daylight, warning, one thing)' },
  { id: 102, label: 'System carries\nthe reminder', cuts: 'e3', who: 0,
    replace: 'Replacement: "Want me to add it to the board?" - the calendar nags so the family member can retire from the reminder business.' },
  { id: 103, label: 'The pause\n("taking ten")', cuts: 'e4', who: 1,
    replace: 'Replacement: "I\'m taking ten - we\'re okay - I\'ll come back." Pre-agreed, time-boxed, always returns.' },
  { id: 104, label: 'Repair', cuts: 'e5', who: 2,
    replace: 'Replacement: "That got away from us - we\'re okay - can we try again after dinner?" Relationship first, content second, then ONE system patch.' },
  { id: 105, label: 'Call the\nloop', cuts: 'e6', who: 2,
    replace: 'Replacement: "We\'re doing the thing. Restart after dinner?" - the most advanced move; available at every stage.' }
];

const RING_EDGES = [
  { id: 'e1', from: 1, to: 2 }, { id: 'e2', from: 2, to: 3 },
  { id: 'e3', from: 3, to: 4 }, { id: 'e4', from: 4, to: 5 },
  { id: 'e5', from: 5, to: 6 }, { id: 'e6', from: 6, to: 7 },
  { id: 'e7', from: 7, to: 1 }
];

const liveEdgeColor = '#8d3b31';
const cutEdgeColor = '#c8c8c8';

let nodes, edges, network;
let cutEdges = new Set();
let turnTimer = null;

function ringPosition(i, n, r, cx, cy) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function setPanel(title, text) {
  document.getElementById('status-title').textContent = title;
  document.getElementById('status-text').textContent = text;
}

function buildData() {
  cutEdges = new Set();
  const nodeArr = [];
  const R = 170, CX = -90, CY = 5;
  STAGES.forEach((s, i) => {
    const p = ringPosition(i, STAGES.length, R, CX, CY);
    nodeArr.push({
      id: s.id, label: s.label, x: p.x, y: p.y,
      color: { background: '#e8a49c', border: WHO_COLORS[s.who] },
      font: { size: 12.5, face: 'Arial', color: '#3a1f1b' }
    });
  });
  EXITS.forEach((ex, i) => {
    const anchor = RING_EDGES.find(e => e.id === ex.cuts);
    const fromIdx = STAGES.findIndex(s => s.id === anchor.from);
    const p = ringPosition(fromIdx + 0.5, STAGES.length, R + 115, CX, CY);
    nodeArr.push({
      id: ex.id, label: ex.label, x: p.x, y: p.y,
      color: { background: '#a5d6a7', border: '#2e7d32' },
      font: { size: 11.5, face: 'Arial', color: '#1b3a1e' },
      shapeProperties: { borderDashes: [6, 4] }
    });
  });

  const edgeArr = RING_EDGES.map(e => ({
    id: e.id, from: e.from, to: e.to,
    color: { color: liveEdgeColor }, width: 2.5,
    arrows: { to: { enabled: true, scaleFactor: 1 } }
  }));
  EXITS.forEach(ex => {
    const anchor = RING_EDGES.find(e => e.id === ex.cuts);
    edgeArr.push({
      id: 'x' + ex.id, from: ex.id, to: anchor.from,
      dashes: [4, 4], color: { color: '#2e7d32' }, width: 1.2,
      arrows: { to: { enabled: false } }
    });
  });

  nodes = new vis.DataSet(nodeArr);
  edges = new vis.DataSet(edgeArr);
}

function cutEdge(exit) {
  const edgeId = exit.cuts;
  if (cutEdges.has(edgeId)) {
    cutEdges.delete(edgeId);
    edges.update({ id: edgeId, color: { color: liveEdgeColor }, dashes: false, width: 2.5 });
    setPanel('Loop restored here', 'The exit was un-applied.');
    return;
  }
  cutEdges.add(edgeId);
  edges.update({ id: edgeId, color: { color: cutEdgeColor }, dashes: [4, 6], width: 1.5 });
  setPanel(exit.label.replace('\n', ' ') + '  [' + WHO_NAMES[exit.who] + ']', exit.replace);
}

function runOneTurn() {
  if (turnTimer) return;
  let i = 0;
  const step = () => {
    if (i > 0) {
      const prev = STAGES[i - 1];
      nodes.update({ id: prev.id, color: { background: '#e8a49c', border: WHO_COLORS[prev.who] } });
    }
    if (i >= STAGES.length) {
      turnTimer = null;
      setPanel('One full turn', 'That took the loop about ten seconds. Real households run it in minutes - and each turn makes the next one faster. Now cut it: click a green exit.');
      return;
    }
    // stop at a cut edge
    if (i > 0 && cutEdges.has(RING_EDGES[i - 1].id)) {
      turnTimer = null;
      setPanel('The turn stopped here', 'The cut edge held: the loop could not reach ' + STAGES[i].label.replace('\n', ' ') + '. That is one exit doing its job.');
      return;
    }
    const s = STAGES[i];
    nodes.update({ id: s.id, color: { background: '#f5c542', border: '#a67c00' } });
    setPanel('Stage ' + (i + 1) + ': ' + s.label.replace('\n', ' '), s.dialogue);
    i++;
    turnTimer = setTimeout(step, 1400);
  };
  step();
}

function initializeNetwork() {
  buildData();
  const enableMouse = !isInIframe();
  const options = {
    layout: { improvedLayout: false },
    physics: { enabled: false },
    interaction: {
      selectConnectedEdges: false,
      zoomView: enableMouse,
      dragView: enableMouse,
      dragNodes: enableMouse,
      navigationButtons: true,
      keyboard: { enabled: true, bindToWindow: false, speed: { x: 2, y: 2, zoom: 0.01 } }
    },
    nodes: {
      shape: 'ellipse', margin: 8, borderWidth: 3,
      shadow: { enabled: true, color: 'rgba(0,0,0,0.15)', size: 5, x: 2, y: 2 }
    },
    edges: { smooth: { type: 'curvedCW', roundness: 0.18 } }
  };

  const container = document.getElementById('network');
  network = new vis.Network(container, { nodes, edges }, options);

  network.once('afterDrawing', function () {
    const pos = network.getViewPosition();
    network.moveTo({
      position: { x: pos.x + 95, y: pos.y },
      scale: Math.min(0.95, Math.max(0.58, container.offsetWidth / 950)),
      animation: false
    });
  });

  network.on('click', function (params) {
    if (params.nodes.length === 0) return;
    const id = params.nodes[0];
    const ex = EXITS.find(x => x.id === id);
    if (ex) { cutEdge(ex); return; }
    const s = STAGES.find(x => x.id === id);
    if (s) {
      setPanel(s.label.replace('\n', ' ') + '  [' + WHO_NAMES[s.who] + ' acts here]',
        s.dialogue + '  ' + s.detail);
    }
  });

  network.on('hoverNode', function () { container.style.cursor = 'pointer'; });
  network.on('blurNode', function () { container.style.cursor = 'default'; });
}

document.addEventListener('DOMContentLoaded', function () {
  initializeNetwork();
  document.getElementById('turn-btn').addEventListener('click', runOneTurn);
  document.getElementById('reset-btn').addEventListener('click', function () {
    if (turnTimer) { clearTimeout(turnTimer); turnTimer = null; }
    initializeNetwork();
    setPanel('A loop either person can cut',
      'Click any red stage for its anatomy and who can act there. Click a green exit to cut the loop and see the replacement sentence. Or run one turn and watch it spin.');
  });
});
