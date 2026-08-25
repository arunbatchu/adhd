// Titration Response Tracker
// CANVAS_HEIGHT: 505
// Dev's eight-week stimulant titration as an interactive Chart.js line
// chart: three target-symptom series plus side-effect burden, dose-step
// annotations, hoverable weekly diary notes, and a decision mode asking the
// learner to make the prescriber's call at weeks 3, 5, and 7 with explained
// feedback. Apply-level (L3). No dosing advice - the decisions are about
// reading data, and every real call belongs to the prescriber.
// (Understanding ADHD, Chapter 7.)

const WEEKS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// ratings 0-10 (higher = better for targets; higher = worse for side effects)
const DATA = {
  homework:  [2, 3, 4, 6, 6, 7, 7, 7, 7],
  mornings:  [3, 3, 4, 5, 6, 7, 7, 6, 7],
  teacher:   [2, 2, 3, 6, 6, 7, 7, 7, 7],
  sideFx:    [0, 1, 1, 4, 3, 2, 2, 6, 2]
};

const DIARY = [
  'Week 0 (baseline): homework battles nightly; teacher reports missing work.',
  'Week 1 (start low XR): "maybe something? hard to say."',
  'Week 2: slightly easier starts. Appetite fine.',
  'Week 3 (step up): homework starting before 9 pm; teacher notes improvement - and lunch is coming home untouched.',
  'Week 4: gains holding. Dose moved earlier + breakfast-first instructions.',
  'Week 5: lunch partially back. Solid weeks.',
  'Week 6 (step up again): trying for more coverage.',
  'Week 7: flat at dinner, irritable, not himself. Targets no better.',
  'Week 8 (stepped back down): settled at the week-5 level. Landed.'
];

const DOSE_STEPS = [
  { week: 1, label: 'start low' },
  { week: 3, label: 'step up' },
  { week: 6, label: 'step up' },
  { week: 8, label: 'step back' }
];

const DECISIONS = [
  { week: 3,
    q: 'Week 3: targets improving, but lunch is untouched. Your call?',
    options: ['Stop the trial', 'Hold dose + engineer around appetite', 'Step up now', 'Switch class'],
    correct: 1,
    fb: 'Hold and engineer. Real target response + the most common side effect = keep the gains, move the dose earlier, breakfast before the dose kicks in, calories at wear-off. Appetite is a management problem before it is a stop-the-trial problem.' },
  { week: 5,
    q: 'Week 5: appetite partially recovered, targets holding at 7/10. Your call?',
    options: ['Declare done forever', 'Step up to chase 10/10', 'Hold - consider a small step only if coverage gaps remain', 'Add a second medication'],
    correct: 2,
    fb: 'Hold, mostly. 7/10 with manageable side effects is a strong landing zone. Chasing perfection with dose is how overshoots happen - a careful step for genuine coverage gaps is defensible, which is what week 6 tried.' },
  { week: 7,
    q: 'Week 7: flat affect, irritable, targets NOT better than week 5. Your call?',
    options: ['Push through - he\'ll adjust', 'Step back down', 'Stop everything permanently', 'Blame the school'],
    correct: 1,
    fb: 'Step back down. Flatness + no target gain = overshoot, the classic too-far signal. It moves the dose; it does not end the trial, and it is NOT "what medication does" - week 8 lands at the week-5 sweet spot.' }
];

let chart;
let currentDecision = 0;
let answered = [false, false, false];

function buildChart() {
  const ctx = document.getElementById('chart').getContext('2d');

  const stepAnnotations = {
    id: 'doseSteps',
    afterDatasetsDraw(c) {
      const { ctx, chartArea, scales } = c;
      ctx.save();
      for (const s of DOSE_STEPS) {
        const x = scales.x.getPixelForValue(s.week);
        ctx.strokeStyle = 'rgba(120,120,120,0.55)';
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(s.label, x, chartArea.top + 10);
      }
      ctx.restore();
    }
  };

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: WEEKS.map(w => 'wk ' + w),
      datasets: [
        { label: 'Homework starts before 8pm', data: DATA.homework, borderColor: '#4a78b5', backgroundColor: 'rgba(74,120,181,0.15)', tension: 0.25 },
        { label: 'Calm mornings', data: DATA.mornings, borderColor: '#6f9e6a', backgroundColor: 'rgba(111,158,106,0.15)', tension: 0.25 },
        { label: 'Teacher: work arriving', data: DATA.teacher, borderColor: '#8a6fb0', backgroundColor: 'rgba(138,111,176,0.15)', tension: 0.25 },
        { label: 'Side-effect burden', data: DATA.sideFx, borderColor: '#c0563e', backgroundColor: 'rgba(192,86,62,0.12)', borderDash: [6, 4], tension: 0.25 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        y: { min: 0, max: 10, title: { display: true, text: 'weekly rating (0-10)' } },
        x: { title: { display: true, text: 'titration week' } }
      },
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 14, font: { size: 10.5 } } },
        tooltip: {
          callbacks: {
            afterBody: (items) => {
              const w = items[0].dataIndex;
              return '\n' + DIARY[w];
            }
          }
        }
      }
    },
    plugins: [stepAnnotations]
  });
}

function renderDecision() {
  const qEl = document.getElementById('q');
  const btnRow = document.getElementById('buttons');
  const fb = document.getElementById('fb');
  btnRow.innerHTML = '';
  fb.textContent = '';

  if (currentDecision >= DECISIONS.length) {
    qEl.textContent = 'All three calls made. The pattern to keep: track targets AND side effects weekly, expect an overshoot to be information, and bring the sheet to every appointment. (Real dose decisions always belong to the prescriber.)';
    const again = document.createElement('button');
    again.textContent = 'Replay decisions';
    again.onclick = () => { currentDecision = 0; answered = [false, false, false]; renderDecision(); };
    btnRow.appendChild(again);
    return;
  }

  const d = DECISIONS[currentDecision];
  qEl.textContent = 'Decision ' + (currentDecision + 1) + ' of 3 - ' + d.q;
  d.options.forEach((opt, i) => {
    const b = document.createElement('button');
    b.textContent = opt;
    b.onclick = () => {
      if (answered[currentDecision]) return;
      answered[currentDecision] = true;
      b.classList.add('picked');
      const right = i === d.correct;
      fb.innerHTML = (right
        ? '<span class="good">Good call.</span> '
        : '<span class="bad">The stronger call: "' + d.options[d.correct] + '".</span> ') + d.fb;
      const next = document.createElement('button');
      next.textContent = currentDecision < 2 ? 'Next decision' : 'Finish';
      next.onclick = () => { currentDecision++; renderDecision(); };
      btnRow.appendChild(next);
    };
    btnRow.appendChild(b);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  buildChart();
  renderDecision();
});
