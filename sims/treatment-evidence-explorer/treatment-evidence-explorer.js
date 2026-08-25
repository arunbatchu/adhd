// Treatment Evidence Explorer
// CANVAS_HEIGHT: 560
// Horizontal bar ranking of ADHD treatments by evidence strength (1-5,
// testimonial-only to meta-analytic), with color depth encoding approximate
// effect magnitude. Hover for one-line verdicts; click a bar for the full
// reasoning naming the evidence-pyramid floor. A claim-tester mode presents
// marketplace claims to place on the pyramid. Evaluate-level (L5).
// Scales are deliberately qualitative. (Understanding ADHD, Chapter 8.)

const TREATMENTS = [
  { name: 'Stimulant medication', ev: 5, effect: 3,
    verdict: 'Reference row: piles of RCTs and meta-analyses; the strongest single lever for core symptoms.',
    detail: 'Top of the pyramid: decades of randomized trials and meta-analyses, ~70-80% response across the two classes. Included here for scale honesty - everything else is judged against this.' },
  { name: 'Behavioral parent training', ev: 5, effect: 2,
    verdict: 'Strongest in its class; first-line for preschoolers.',
    detail: 'Solid RCTs; guidelines put it BEFORE medication for young children. Technical training for parenting a nonstandard nervous system - not remedial parenting.' },
  { name: 'ADHD-adapted CBT (adults)', ev: 4, effect: 2,
    verdict: 'Solid trials in adults; best for skills + the internalized-verdict work.',
    detail: 'Strong RCT support in adults and teens. Ask therapists directly about ADHD experience - generic CBT can misfire on skills gaps.' },
  { name: 'Psychoeducation', ev: 4, effect: 2,
    verdict: 'Guideline-recommended first step; accurate models change behavior.',
    detail: 'Listed as a first step of care in guidelines. Reading this book together is the intervention. Cheap, safe, load-bearing.' },
  { name: 'Sleep interventions', ev: 4, effect: 2,
    verdict: 'The cheapest symptom reduction in the book.',
    detail: 'Sleep loss degrades exactly the functions ADHD strains. Fixed wake time, morning light, clinician help for delayed phase - well-supported, high leverage.' },
  { name: 'Exercise', ev: 4, effect: 1,
    verdict: 'Real short-term attention/EF effects; modest over time. A daily tool, not a cure.',
    detail: 'Meta-analyses show acute EF benefits and modest chronic effects. Adherence design matters more than the optimal program.' },
  { name: 'Mindfulness (adapted)', ev: 3, effect: 1,
    verdict: 'Moderate, growing evidence - strongest for emotional regulation.',
    detail: 'Multiple trials, many small, blinding impossible. Rep-training for the spotlight; short adapted formats count.' },
  { name: 'Omega-3', ev: 3, effect: 1,
    verdict: 'Meta-analyses: real but SMALL. A low-risk add-on, never a substitute.',
    detail: 'The one supplement with actual data - a fraction of medication\'s effect size. Reasonable to discuss with a clinician; unreasonable as a replacement.' },
  { name: 'Digital therapeutics', ev: 3, effect: 1,
    verdict: 'Young category: one FDA-authorized game; measures improve, real-world effects more modest.',
    detail: 'EndeavorRx has trial support on attention measures. Not snake oil - early. Judge each product on its own trials.' },
  { name: 'ADHD coaching', ev: 2, effect: 2,
    verdict: 'Genuinely helpful for scaffolding; unregulated title - vet credentials.',
    detail: 'Helpful in practice, thin on controlled trials, and anyone can claim the title tomorrow. Ask how they work and what happens when you miss a session.' },
  { name: 'Neurofeedback', ev: 2, effect: 1,
    verdict: 'The better the controls, the smaller the effect - the classic placebo-plus-practice tell.',
    detail: 'Unblinded studies look encouraging; sham-controlled trials shrink toward nothing. Safe but expensive. Fine as a luxury, wrong as a substitute for evidence-based care.' },
  { name: 'Generic supplement blends', ev: 1, effect: 0,
    verdict: 'Testimonial floor. Not required to prove efficacy before sale.',
    detail: 'The standard playbook: a kernel of real science stretched into an unearned conclusion, testimonial walls, "natural" doing the work evidence should. The burden of proof you should demand is the one the law does not.' }
];

const EV_LABELS = ['', 'testimonials only', 'observational / thin', 'some RCTs', 'strong RCTs', 'meta-analytic'];

const CLAIMS = [
  { t: '"Clinically proven brain supplement - 5,000 five-star reviews!"', level: 1,
    fb: 'Testimonial floor. Reviews are not trials, and supplements need not prove efficacy before sale. "Clinically proven" without a cited trial is decoration.' },
  { t: '"FDA-authorized prescription video game for pediatric ADHD"', level: 3,
    fb: 'Some RCTs - real trials on attention measures earned the authorization; real-world functioning evidence is more modest. Legitimate, early, judged per product.' },
  { t: '"Parent training program tested in randomized trials across 30 years"', level: 5,
    fb: 'Meta-analytic support - parent training is among the best-evidenced interventions in the field and first-line for preschoolers.' },
  { t: '"Our neurofeedback protocol: 89% success in our clinic\'s internal data"', level: 2,
    fb: 'Observational and unblinded - exactly the study type where neurofeedback shines and exactly the type that sham-controlled trials deflate.' },
  { t: '"Coaching guaranteed to fix your ADHD in 12 weeks"', level: 1,
    fb: 'Guarantee language is the exit cue. Coaching can help, but "guaranteed fix" claims for a neurodevelopmental condition live on the testimonial floor regardless of the service attached.' },
  { t: '"Omega-3 shows small benefits in pooled analyses of randomized trials"', level: 5,
    fb: 'That is an honestly stated meta-analytic claim - note it claims a SMALL effect. Trustworthy claims tend to sound exactly this boring.' }
];

let chart;
let claimIdx = -1, claimAnswered = false;

function barColor(t) {
  const depth = [0.25, 0.45, 0.7, 0.9][t.effect];
  return 'rgba(58, 96, 150, ' + depth + ')';
}

function buildChart() {
  const ctx = document.getElementById('chart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: TREATMENTS.map(t => t.name),
      datasets: [{
        label: 'evidence strength',
        data: TREATMENTS.map(t => t.ev),
        backgroundColor: TREATMENTS.map(barColor),
        borderColor: '#3a6096',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: 0, max: 5,
          ticks: { callback: v => EV_LABELS[v] || '', font: { size: 9.5 }, maxRotation: 0 },
          title: { display: true, text: 'evidence pyramid floor', font: { size: 11 } }
        },
        y: { ticks: { font: { size: 10.5 } } }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => EV_LABELS[ctx.parsed.x],
            afterLabel: ctx => TREATMENTS[ctx.dataIndex].verdict
          }
        }
      },
      onClick: (evt, elements) => {
        if (elements.length === 0) return;
        const t = TREATMENTS[elements[0].index];
        document.getElementById('q').textContent = t.name + ' - ' + EV_LABELS[t.ev];
        document.getElementById('fb').textContent = t.detail;
      }
    }
  });
}

function renderClaimTester() {
  const btnRow = document.getElementById('buttons');
  btnRow.innerHTML = '';
  const start = document.createElement('button');
  start.textContent = claimIdx < 0 ? 'Start claim tester' : 'Next claim';
  start.onclick = nextClaim;
  btnRow.appendChild(start);
}

function nextClaim() {
  claimIdx = (claimIdx + 1) % CLAIMS.length;
  claimAnswered = false;
  const c = CLAIMS[claimIdx];
  document.getElementById('q').textContent = 'Claim ' + (claimIdx + 1) + ' of ' + CLAIMS.length + ': ' + c.t;
  document.getElementById('fb').textContent = 'Which pyramid floor does this claim live on?';
  const btnRow = document.getElementById('buttons');
  btnRow.innerHTML = '';
  [1, 2, 3, 4, 5].forEach(level => {
    const b = document.createElement('button');
    b.textContent = EV_LABELS[level];
    b.onclick = () => {
      if (claimAnswered) return;
      claimAnswered = true;
      b.classList.add('picked');
      const right = level === c.level;
      document.getElementById('fb').innerHTML =
        (right ? '<span class="good">Right floor.</span> '
               : '<span class="bad">It lives on: ' + EV_LABELS[c.level] + '.</span> ') + c.fb;
      const next = document.createElement('button');
      next.textContent = 'Next claim';
      next.onclick = nextClaim;
      btnRow.appendChild(next);
    };
    btnRow.appendChild(b);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  buildChart();
  renderClaimTester();
});
