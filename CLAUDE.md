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
| **MicroSim implementation** | `microsim-generator` | **next — 23 specified, placeholders live** |
| Glossary, FAQ, quizzes, references | `book-installer` feature 39 | not started |

All 23 specified MicroSims currently show placeholder pages under
`docs/sims/<sim-id>/main.html` (catalog: `docs/sims/index.md`). Specs live in
each chapter's `#### Diagram:` details blocks with `Status: Specified`.
Session logs for content generation are in `logs/`.

Regenerating `learning-graph.json`: run from `docs/learning-graph/`

```bash
python3 csv-to-json.py learning-graph.csv learning-graph.json color-config.json metadata.json taxonomy-names.json
```

`color-config.json` and `taxonomy-names.json` are committed so colors and legend
names stay stable across regenerations. After regenerating, re-run the group
reordering step from `book-installer/references/learning-graph-viewer.md` Step 4,
or the legend order will no longer match `concept-taxonomy.md`.

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
