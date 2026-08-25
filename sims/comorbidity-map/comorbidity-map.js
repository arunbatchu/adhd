// The ADHD Comorbidity Map
// CANVAS_HEIGHT: 558
// Relationship map: 12 co-occurring conditions around a central ADHD node,
// with edges typed by mechanism - shared roots, consequence, entangled,
// look-alike. Click a condition for its field-guide entry (definition,
// relationship, the tell, the treatment lane). Filter buttons isolate each
// mechanism class; a Dev-case button highlights his three interacting nodes.
// Analyze-level (L4). (Understanding ADHD, Chapter 6.)

function isInIframe() {
  try { return window.self !== window.top; } catch (e) { return true; }
}

const EDGE_STYLES = {
  roots:       { color: '#4a78b5', dashes: false, arrows: 'to' },
  consequence: { color: '#d98032', dashes: false, arrows: 'to' },
  entangled:   { color: '#7d5ba6', dashes: false, arrows: 'to, from' },
  lookalike:   { color: '#9e9e9e', dashes: [6, 5], arrows: '' }
};

const CONDITIONS = [
  { id: 2, label: 'Anxiety', type: 'consequence', x: -380, y: -170, freq: 'common (25-33%)',
    info: 'Persistent excessive worry. Runs both ways: ADHD manufactures things to worry about; anxiety shreds focus. TELL: worry persisting even when the week went fine. LANE: own treatment lane (ADHD-informed CBT), often alongside ADHD care.' },
  { id: 3, label: 'Depression', type: 'consequence', x: -180, y: -240, freq: 'markedly elevated',
    info: 'Persistent low mood or loss of interest. Manufactured by years of unexplained struggle. TELL: flatness that novelty and interest cannot touch, for weeks. Severe cases jump the treatment queue. Self-harm talk: act immediately (988 in the US).' },
  { id: 4, label: 'Learning disabilities\n& dyslexia', type: 'roots', x: 130, y: -240, freq: 'frequent (30-45%)',
    info: 'Specific academic-skill difficulties despite adequate intelligence. Shares genetics with ADHD; each camouflages the other. TELL: struggle cratering ONE subject while sparing others. LANE: own intervention + school accommodations.' },
  { id: 5, label: 'Autism', type: 'roots', x: 330, y: -160, freq: 'notable overlap',
    info: 'Both diagnoses allowed together only since 2013. Shared surface (social friction, sensory sensitivity), different machinery. TELL: sensory overwhelm plus deep need for routine and predictability. LANE: autism-specific resources.' },
  { id: 6, label: 'Sleep disorders', type: 'entangled', x: 400, y: 0, freq: 'very common',
    info: 'Delayed sleep phase (body clock at 1-3 am) and sleep apnea (snoring + daytime fog). Each worsens the other with ADHD. TELL: fog that tracks the clock. LANE: parallel treatment - clock repair or sleep study alongside ADHD care.' },
  { id: 7, label: 'Substance use', type: 'entangled', x: 350, y: 160, freq: 'elevated risk',
    info: 'Earlier start, faster escalation in untreated ADHD - often self-medication of under-arousal or misery. Treating ADHD is neutral-to-PROTECTIVE. TELL: "needing" a substance to sleep, settle, or socialize. LANE: clinician-sequenced; severity can jump the queue.' },
  { id: 8, label: 'Disordered eating', type: 'entangled', x: 160, y: 250, freq: 'elevated (binge-type most)',
    info: 'Impulsivity + dopamine + meals skipped all day, ravenous nights. Stimulant appetite effects intersect. TELL: secrecy, shame, or loss of control around food. LANE: own treatment, medically weighted - early screening matters.' },
  { id: 9, label: 'Bipolar\n(distinction)', type: 'lookalike', x: -80, y: 270, freq: 'differential + rare overlap',
    info: 'Surface overlap: energy, impulsivity, sleep changes. The distinguishing structure is TIME: ADHD is chronic and always-on; bipolar is episodic - a departure from baseline with reduced NEED for sleep. Both-in-one-person is psychiatrist territory.' },
  { id: 10, label: 'ODD', type: 'consequence', x: -300, y: 230, freq: 'large minority (children)',
    info: 'Angry, defiant pattern toward authority. Much of what reads as opposition is transition tax + demand overload + a soured correction relationship - and improves when those are repaired. TELL: defiance persisting across ALL settings even after repair. LANE: parent training first.' },
  { id: 11, label: 'Tic disorders', type: 'roots', x: -420, y: 90, freq: 'regular co-occurrence',
    info: 'Sudden repetitive movements or sounds; shares genetics with ADHD. Tics wax and wane naturally - which makes everything look causal that is not. Stimulant prohibition has softened under better research. LANE: prescriber monitoring.' },
  { id: 12, label: 'Trauma', type: 'entangled', x: -420, y: -40, freq: 'elevated exposure',
    info: 'Hypervigilance, concentration problems, volatility - a surface that mimics ADHD (look-alike) AND elevated co-occurrence (entangled). Differential runs on onset timeline and the texture of inattention. LANE: its own treatment - no stimulant treats hypervigilance.' },
  { id: 13, label: 'ADHD burnout', type: 'consequence', x: 0, y: -320, freq: 'common after masking runs',
    info: 'System collapse after months or years of masking and over-performance. Looks like depression; its signature is collapse-after-overextension. LANE: reduce load and rebuild sustainable supports - pushing through is the disease.' }
];

const EDGES = CONDITIONS.map(c => ({
  id: 'e' + c.id,
  from: c.type === 'consequence' ? 1 : c.id,
  to: c.type === 'consequence' ? c.id : 1,
  type: c.type
}));

const DEV_NODES = [1, 4, 3];

let nodes, edges, network;
let currentFilter = 'all';

function nodeColor(c, dim) {
  const palette = {
    roots: { bg: '#d6e4f5', bd: '#4a78b5' },
    consequence: { bg: '#fbe3cc', bd: '#d98032' },
    entangled: { bg: '#e6dcf2', bd: '#7d5ba6' },
    lookalike: { bg: '#eeeeee', bd: '#9e9e9e' }
  };
  const p = palette[c.type];
  return {
    background: dim ? '#f4f4f4' : p.bg,
    border: dim ? '#cccccc' : p.bd
  };
}

function buildData(filter, devMode) {
  const nodeArr = [{
    id: 1, label: 'ADHD', x: 0, y: 0,
    color: { background: '#3b5b80', border: '#22364d' },
    font: { size: 20, color: 'white', face: 'Arial' },
    shape: 'ellipse', margin: 14
  }];
  for (const c of CONDITIONS) {
    const dim = devMode ? !DEV_NODES.includes(c.id)
      : (filter !== 'all' && c.type !== filter);
    nodeArr.push({
      id: c.id, label: c.label, x: c.x, y: c.y,
      color: nodeColor(c, dim),
      font: { size: 13, color: dim ? '#aaaaaa' : '#333333', face: 'Arial' }
    });
  }
  const edgeArr = EDGES.map(e => {
    const s = EDGE_STYLES[e.type];
    const c = CONDITIONS.find(x => 'e' + x.id === e.id);
    const dim = devMode ? !DEV_NODES.includes(c.id)
      : (currentFilter !== 'all' && e.type !== currentFilter);
    return {
      id: e.id, from: e.from, to: e.to,
      color: { color: dim ? '#e0e0e0' : s.color },
      dashes: s.dashes,
      width: dim ? 1 : 2.5,
      arrows: s.arrows === '' ? { to: { enabled: false } }
        : s.arrows === 'to, from'
          ? { to: { enabled: true, scaleFactor: 0.8 }, from: { enabled: true, scaleFactor: 0.8 } }
          : { to: { enabled: true, scaleFactor: 1 } }
    };
  });
  // Dev extra edge: reading disability feeding depression
  if (devMode) {
    edgeArr.push({ id: 'dev', from: 4, to: 3, color: { color: '#d98032' }, width: 2.5, arrows: { to: { enabled: true } }, label: 'daily defeat', font: { size: 10, color: '#a06020' } });
  }
  return { nodeArr, edgeArr };
}

function setPanel(title, text) {
  document.getElementById('status-title').textContent = title;
  document.getElementById('status-text').textContent = text;
}

let devMode = false;

function render() {
  const { nodeArr, edgeArr } = buildData(currentFilter, devMode);
  nodes = new vis.DataSet(nodeArr);
  edges = new vis.DataSet(edgeArr);
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
      shape: 'box', margin: 8, borderWidth: 2.5,
      shadow: { enabled: true, color: 'rgba(0,0,0,0.12)', size: 4, x: 1, y: 1 }
    },
    edges: { smooth: { type: 'curvedCW', roundness: 0.12 } }
  };
  const container = document.getElementById('network');
  network = new vis.Network(container, { nodes, edges }, options);

  network.once('afterDrawing', function () {
    const pos = network.getViewPosition();
    network.moveTo({
      position: { x: pos.x + 100, y: pos.y },
      scale: Math.min(0.85, Math.max(0.5, container.offsetWidth / 1150)),
      animation: false
    });
  });

  network.on('click', function (params) {
    if (params.nodes.length === 0) return;
    const id = params.nodes[0];
    if (id === 1) {
      setPanel('ADHD (the hub)', 'Roughly two-thirds of children with ADHD have at least one traveling condition; adult rates run comparably high. When treatment stalls, ask what ELSE is true before turning the one dial you know.');
      return;
    }
    const c = CONDITIONS.find(x => x.id === id);
    if (c) setPanel(c.label.replace('\n', ' ') + '  [' + c.freq + ']', c.info);
  });

  network.on('hoverNode', function () { container.style.cursor = 'pointer'; });
  network.on('blurNode', function () { container.style.cursor = 'default'; });
}

document.addEventListener('DOMContentLoaded', function () {
  render();

  document.querySelectorAll('.btn[data-filter]').forEach(btn => {
    btn.addEventListener('click', function () {
      currentFilter = this.dataset.filter;
      devMode = false;
      document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      render();
      const names = { all: 'All relationships', roots: 'Shared roots (blue): genetic and developmental overlap', consequence: 'Consequences (orange): downstream of unexplained, untreated years', entangled: 'Entangled (purple): mutual amplification, treated in parallel', lookalike: 'Look-alikes (gray dashed): primarily differential-diagnosis relationships' };
      setPanel(names[currentFilter].split(':')[0], names[currentFilter]);
    });
  });

  document.getElementById('dev-btn').addEventListener('click', function () {
    devMode = !devMode;
    document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
    if (devMode) this.classList.add('active');
    render();
    if (devMode) {
      setPanel('Dev, 15: three things true at once',
        'ADHD (treated, working) + a reading disability that outgrew its camouflage in 10th grade + emerging low mood fed by daily defeat. Adjusting the stimulant - the only dial the family knew - would have done nothing. The clinician sequenced reading intervention in parallel and watched the mood lift as defeats stopped accumulating.');
    }
  });
});
