# Understanding ADHD — Project Instructions

An intelligent textbook built with Dan McCreary's `claude-skills` pipeline
(https://github.com/dmccreary/claude-skills, cloned at
`~/projects/claude-skills`). Public repo, deployed to
https://arunbatchu.github.io/adhd/ via `mkdocs gh-deploy --force`.

## The book

**Audience is two readers at once**: the person who has ADHD, and the people who
care for them — parents, partners, siblings, friends. Every major topic should
address both sides. This dual address is the book's distinctive contribution; do
not let it collapse into a book written only for the person with ADHD, or only
for caregivers.

Particular emphasis, reflected throughout the learning graph and chapters:

- Late diagnosis in adulthood, and ADHD in girls and women (masking, high
  achievement hiding the struggle, the gender diagnosis gap)
- Supporting an **adult** family member without parenting them — autonomy is a
  first-class concern, not an afterthought
- Caring for the caregiver: strain, burnout, boundaries

The two capstones, both in Chapter 15: the **Personal Owner's Manual** (concept
245), written by the person with ADHD, and the **Family Support Plan** (concept
300), written by the people around them. Late chapters should feed sections into
both.

## Privacy rule — load-bearing

This repo is **public**. The author's motivation is a family member's recent
ADHD diagnosis. **Her name, her diagnosis, and any detail of her situation must
never appear in repo content, commit messages, or the deployed site.** Describe
the motivation generically ("written for families after a new diagnosis").
Personal context lives only in the author's local Claude memory directory, never
here.

## Pipeline state

| Step | Skill | Status |
|---|---|---|
| Scaffold | `book-installer` feature 0 | done |
| Course description | `course-description-analyzer` v0.03 | done — scored 98/100 |
| Learning graph | `learning-graph-generator` v1.06 | done — 300 concepts, 12 taxonomies, valid DAG |
| Graph viewer | `book-installer` feature 23 | done — v1.04, CIS-sized nodes |
| Chapter structure | `book-chapter-generator` v1.0.0 | done — 15 chapters, 0 dependency violations |
| Chapter content | `chapter-content-generator` v1.09 | done — all 15 chapters, ~65k words, 300/300 concepts, 23 MicroSim specs |
| MicroSim implementation | `microsim-generator` conventions | done — all 23 implemented (17 p5.js, 3 vis-network, 2 Chart.js, 1 HTML/JS), browser-QA'd |
| Glossary, FAQ, quizzes, references | dedicated generator skills | done — 300-term glossary, 108-question FAQ (+chatbot JSON), 300 quiz questions in two sets per chapter, 150 annotated references |
| Front matter, cover, screenshots | 2026-08-29 polish pass | done — real landing/about/README, graph-derived cover, 23 sim screenshots, book metrics |

All 23 MicroSims are implemented and embedded (catalog: `docs/sims/index.md`;
each sim dir has main.html, `<sim-id>.js` with a `// CANVAS_HEIGHT:` comment,
index.md, metadata.json, and `<sim-id>.png` screenshot). Iframe heights are
synced from CANVAS_HEIGHT by `sync-iframe-heights.py` (in Dan's microsim-utils
skill) — rerun it after any height change. Session logs are in `logs/`.

**Screenshots and the cover are reproducible on this machine** (2026-08-29).
There is no `bk-capture-screenshot` here, so capture uses Playwright driving
the *installed* Google Chrome — no browser download needed:

```python
p.chromium.launch(executable_path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
```

Regenerate the cover with `python3 scripts/generate-cover.py` (renders the
learning graph via `scripts/cover-graph-render.html`, then composites the
title). To re-shoot a sim, load its `main.html` and clip to the iframe height
from its `index.md`. Note `mkdocs serve`'s watcher often serves a **stale**
build — restart it, or verify against `site/` after `mkdocs build`.

Regenerating `learning-graph.json`: run from `docs/learning-graph/`

```bash
python3 csv-to-json.py learning-graph.csv learning-graph.json color-config.json metadata.json taxonomy-names.json
```

`color-config.json` and `taxonomy-names.json` are committed so colors and legend
names stay stable across regenerations. After regenerating, re-run the group
reordering step from `book-installer/references/learning-graph-viewer.md` Step 4,
or the legend order will no longer match `concept-taxonomy.md`.

**Counting caveat:** `book-metrics.py` counts only `quiz.md`, so its Chapter
Quizzes row reads 150. The real total is 300 — each chapter also has a
`quiz-applied.md`, a scenario-based set weighted to Apply/Analyze/Evaluate that
complements the recall-weighted original. Keep the reader-facing counts in
`README.md`, `docs/about.md`, and `docs/index.md` in sync by hand.

## Mascot

**Bhindi** is the book's learning mascot — a caring bluish-grey shorthair cat
with yellow eyes. Canonical description, voice rules, and placement limits are
in `docs/img/mascot/character-sheet.md`; read it before writing Bhindi dialogue
or generating new art. Seven poses live in `docs/img/mascot/`, generated with
OpenAI `gpt-image-2` via `scripts/generate-mascot.py` (prompts preserved in
`docs/img/mascot/image-prompts.md`). Rendering check: `learning-graph/mascot-test.md`.

**The rule that matters most:** Bhindi never appears beside crisis guidance,
grief, shame, or caregiver-burnout material. A cartoon cat next to Chapter 6's
988 guidance or Chapter 11's shame sections undercuts the book. Hard limits from
Dan's `mascot-placement-rules.md` also apply — at most six per chapter, one
welcome and one celebration, never two back-to-back, never decorative.

**Placement, as it stands (2026-08-29):** 52 admonitions across 11 chapters —
1-5, 7-10, 12, 13 — at 4-5 per chapter, well under Dan's ceiling of 9. Chapters
**6, 11, 14, and 15 are deliberately mascot-free**: they carry the crisis
guidance, grief, shame, and caregiver-burnout material, and a cartoon cat there
undercuts the book. Keep them clean.

Chapter 4 also has no `celebration` — it ends in late-diagnosis grief and
reframing, where a celebration lands wrong. Validate any change with:

```bash
for f in docs/chapters/*/index.md; do python3 "$HOME/projects/claude-skills/skills/book-installer/scripts/validate-chapter-mascots.py" "$f"; done
```

## Working rules

- **Read `CONTENT-GENERATION-GUIDE.md` before generating any chapter content.**
  It carries the CIS-driven word-count targets and the anti-padding rules. The
  `CIS Score` column in each chapter's "Concepts Covered" table is not
  decorative — `chapter-content-generator` reads it to size each concept.
- Never add `navigation.tabs` to `mkdocs.yml` — these books use side navigation.
- Verify with `mkdocs build --strict` before committing. It catches broken nav
  links, which are the common failure.
- Add every new `.md` file to the `nav:` block in `mkdocs.yml`.
- Blank line before every markdown list — MkDocs requires it.
- Deploy with `mkdocs gh-deploy --force`. The `site/` directory is gitignored;
  `gh-pages` is a generated branch, never edited by hand.

## Voice

Plain English, short sentences, active voice, contractions are fine. No
literary flourishes, no "it's not X, it's Y" constructions, no section that
builds to a bolded aphorism. The author's full style rules are in
`~/.claude/writing-voice.md` and
`~/CascadeProjects/netrii-wisdom-refinery/WRITING_STYLE.md` — read them before
writing prose that ships.

For this book specifically: never write about ADHD in a way that shames the
reader who has it, and never write about caregivers as saints or victims. Both
readers are competent adults doing something hard.
