// The Stigma Cycle
// CANVAS_HEIGHT: 520
// Interactive causal loop: six stages of the ADHD stigma cycle arranged in a
// ring, plus two green break-point nodes. Clicking a stage shows its concrete
// example and how it feeds the next stage; clicking a break point cuts the
// edge it interrupts and explains what changes downstream.
// (Understanding ADHD, Chapter 1.)

// ---- environment detection ----
function isInIframe() {
  try { return window.self !== window.top; } catch (e) { return true; }
}

// ---- content ----
const LOOP_NODES = [
  { id: 1, label: 'Public\nstigma',
    detail: 'Jokes, judgment, "excuse" talk. Example: the staff-room comment - "that family medicates instead of parenting."',
    feeds: 'Feeds hiding: nobody rushes to claim a label their world mocks.' },
  { id: 2, label: 'Hiding\n& delay',
    detail: 'Symptoms concealed, evaluation postponed. Example: the 34-year-old teacher who suspects ADHD but does not book the evaluation.',
    feeds: 'Feeds unexplained struggle: without an evaluation there is no accurate story.' },
  { id: 3, label: 'Unexplained\nstruggle',
    detail: 'Years of difficulty with no accurate story. Lost homework, late fees, jobs and friendships strained - all uncaptioned.',
    feeds: 'Feeds myth explanations: struggle gets explained anyway, by whatever is lying around.' },
  { id: 4, label: 'Myth\nexplanations',
    detail: '"Lazy." "Careless." "Doesn\'t apply herself." The myths from Chapter 1, filling the caption the missing diagnosis left blank.',
    feeds: 'Feeds self-stigma: verdicts repeated daily get believed.' },
  { id: 5, label: 'Self-\nstigma',
    detail: 'The person believes the verdicts. Late-diagnosed adults often say the decades of thinking they were defective hurt more than the symptoms.',
    feeds: 'Feeds visible struggle: shame drives hiding and avoidance, which worsen outcomes.' },
  { id: 6, label: 'Visible\nstruggle',
    detail: 'Worsened outcomes others observe - and judge. The struggle everyone can see, minus the mechanism nobody can.',
    feeds: 'Feeds public stigma: visible struggle plus moral-failure explanations keep the culture\'s story alive.' }
];

const BREAK_NODES = [
  { id: 101, label: 'Accurate\ninformation', cutsEdge: '3-4',
    detail: 'BREAK POINT: accurate information cuts the link between struggle and myth explanations. When the family knows about attention regulation and prospective memory, "lazy" loses its job. The loop weakens here every time a symptom gets a mechanical caption instead of a character verdict.' },
  { id: 102, label: 'Family uses the\nregulation lens', cutsEdge: '4-5',
    detail: 'BREAK POINT: a family that responds with the regulation lens cuts the link between myth explanations and self-stigma. For one person\'s daily life, family is the loudest culture there is - if the verdicts stop arriving at home, they stop being believed.' }
];

const RING_EDGES = [
  { id: '1-2', from: 1, to: 2 }, { id: '2-3', from: 2, to: 3 },
  { id: '3-4', from: 3, to: 4 }, { id: '4-5', from: 4, to: 5 },
  { id: '5-6', from: 5, to: 6 }, { id: '6-1', from: 6, to: 1 }
];

// ---- colors ----
const loopColor  = { background: '#e8a49c', border: '#a94438' };
const breakColor = { background: '#a5d6a7', border: '#2e7d32' };
const cutEdgeColor = '#c8c8c8';
const liveEdgeColor = '#8d3b31';

let nodes, edges, network;
let cutEdges = new Set();

function ringPosition(i, n, r, cx, cy) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function buildData() {
  cutEdges = new Set();
  const nodeArr = [];
  const R = 165, CX = -80, CY = 10;
  LOOP_NODES.forEach((n, i) => {
    const p = ringPosition(i, 6, R, CX, CY);
    nodeArr.push({
      id: n.id, label: n.label, x: p.x, y: p.y,
      color: { background: loopColor.background, border: loopColor.border },
      font: { size: 14, face: 'Arial', color: '#3a1f1b' }
    });
  });
  // break nodes sit outside the ring near the edges they cut
  const p34 = ringPosition(2.5, 6, R + 120, CX, CY);
  const p45 = ringPosition(3.5, 6, R + 120, CX, CY);
  nodeArr.push({
    id: 101, label: BREAK_NODES[0].label, x: p34.x, y: p34.y,
    color: { background: breakColor.background, border: breakColor.border },
    font: { size: 13, face: 'Arial', color: '#1b3a1e' },
    shapeProperties: { borderDashes: [6, 4] }
  });
  nodeArr.push({
    id: 102, label: BREAK_NODES[1].label, x: p45.x, y: p45.y,
    color: { background: breakColor.background, border: breakColor.border },
    font: { size: 13, face: 'Arial', color: '#1b3a1e' },
    shapeProperties: { borderDashes: [6, 4] }
  });

  const edgeArr = RING_EDGES.map(e => ({
    id: e.id, from: e.from, to: e.to,
    label: 'feeds',
    font: { size: 10, color: '#777777', align: 'middle' },
    color: { color: liveEdgeColor },
    width: 2.5
  }));
  // dashed connectors from break nodes to the edges they cut (visual anchors)
  edgeArr.push({ id: 'b1', from: 101, to: 4, dashes: [4, 4], arrows: '', color: { color: '#2e7d32' }, width: 1.5 });
  edgeArr.push({ id: 'b2', from: 102, to: 5, dashes: [4, 4], arrows: '', color: { color: '#2e7d32' }, width: 1.5 });

  nodes = new vis.DataSet(nodeArr);
  edges = new vis.DataSet(edgeArr);
}

function setPanel(title, text) {
  document.getElementById('status-title').textContent = title;
  document.getElementById('status-text').textContent = text;
}

function cutEdge(edgeId, breakNode) {
  if (cutEdges.has(edgeId)) {
    // toggle back
    cutEdges.delete(edgeId);
    edges.update({ id: edgeId, color: { color: liveEdgeColor }, dashes: false, width: 2.5 });
    setPanel('Loop restored here', 'The break point was un-applied. The stage feeds the next again.');
    return;
  }
  cutEdges.add(edgeId);
  edges.update({ id: edgeId, color: { color: cutEdgeColor }, dashes: [4, 6], width: 1.5 });
  setPanel(breakNode.label.replace('\n', ' '), breakNode.detail);
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
      shape: 'ellipse',
      margin: 10,
      borderWidth: 3,
      shadow: { enabled: true, color: 'rgba(0,0,0,0.15)', size: 5, x: 2, y: 2 }
    },
    edges: {
      arrows: { to: { enabled: true, scaleFactor: 1.1 } },
      smooth: { type: 'curvedCW', roundness: 0.2 }
    }
  };

  const container = document.getElementById('network');
  network = new vis.Network(container, { nodes, edges }, options);

  network.once('afterDrawing', function () {
    const pos = network.getViewPosition();
    network.moveTo({
      position: { x: pos.x + 90, y: pos.y },
      scale: Math.min(1.0, Math.max(0.62, container.offsetWidth / 900)),
      animation: false
    });
  });

  network.on('click', function (params) {
    if (params.nodes.length === 0) return;
    const id = params.nodes[0];
    if (id === 101) { cutEdge('3-4', BREAK_NODES[0]); return; }
    if (id === 102) { cutEdge('4-5', BREAK_NODES[1]); return; }
    const n = LOOP_NODES.find(x => x.id === id);
    if (n) {
      setPanel(n.label.replace('\n', ' '), n.detail + ' ' + n.feeds);
      // highlight the outgoing edge
      RING_EDGES.forEach(e => {
        if (cutEdges.has(e.id)) return;
        edges.update({ id: e.id, width: e.from === id ? 5 : 2.5 });
      });
    }
  });

  network.on('hoverNode', function (params) {
    const n = LOOP_NODES.find(x => x.id === params.node);
    if (n) container.style.cursor = 'pointer';
  });
  network.on('blurNode', function () { container.style.cursor = 'default'; });
}

document.addEventListener('DOMContentLoaded', function () {
  initializeNetwork();
  document.getElementById('reset-btn').addEventListener('click', function () {
    initializeNetwork();
    setPanel('A reinforcing loop',
      'Each stage feeds the next, around and around. Click any red stage to see it up close - or click a green break point to cut the loop and watch what changes downstream.');
  });
});
