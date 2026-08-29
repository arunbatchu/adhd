# Understanding ADHD

**An intelligent textbook about ADHD, written for the person who has it and the
people who care for them — to read together.**

📖 **Read it here: <https://arunbatchu.github.io/adhd/>**

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Built with Material for MkDocs](https://img.shields.io/badge/Material_for_MkDocs-526CFE?logo=MaterialForMkDocs&logoColor=white)](https://squidfunk.github.io/mkdocs-material/)

## What This Is

An ADHD diagnosis lands on more than one person. Most ADHD books pick a single
reader — the patient, or the parent, or the clinician. This one addresses two
readers at once, in every chapter: the person who has ADHD, and the parent,
partner, sibling, or friend trying to work out how to help.

Particular emphasis on things the literature tends to underserve:

- **Late diagnosis in adulthood**, and ADHD in girls and women — masking, high
  achievement hiding the struggle, and the gender diagnosis gap
- **Supporting an adult** family member without parenting them
- **Caring for the caregiver** — strain, burnout, and boundaries

The book ends with two documents the readers write themselves: a **personal
owner's manual** by the person with ADHD, and a **family support plan** by the
people around them. Then they trade.

## What's Inside

| Element | Count |
|---|---|
| Chapters | 15 |
| Words | ~65,000 |
| Concepts in the learning graph | 300 |
| Interactive MicroSims | 23 |
| Glossary terms | 300 |
| FAQ questions | 93 |
| Quiz questions | 150 |
| Annotated references | 150 |

This is an **intelligent textbook**: concepts are organized as a dependency
graph, content is generated against that graph so nothing is introduced before
its prerequisites, and interactive simulations let readers test ideas directly
rather than just read about them.

## Repository Layout

```
docs/
├── index.md                  Landing page
├── about.md                  Audience, how to read, limits, citation
├── course-description.md     Seed document (Bloom's-organized outcomes)
├── glossary.md               300 ISO 11179-compliant terms
├── faq.md                    93 questions
├── chapters/                 15 chapters, each with index/quiz/references
├── learning-graph/           Concept graph, taxonomy, quality reports
│   ├── learning-graph.csv     Source of truth (300 concepts + dependencies)
│   ├── learning-graph.json    Generated; includes Concept Impact Scores
│   └── csv-to-json.py         Regeneration script
└── sims/                     23 MicroSims + interactive graph viewer
```

## Building Locally

```bash
pip install mkdocs mkdocs-material
mkdocs serve
```

Then open <http://127.0.0.1:8000/adhd/>.

Verify before committing — this catches broken nav links, the common failure:

```bash
mkdocs build --strict
```

Deploy to GitHub Pages:

```bash
mkdocs gh-deploy --force
```

## Regenerating the Learning Graph

`learning-graph.csv` is the source of truth. After editing it, regenerate the
JSON from `docs/learning-graph/`:

```bash
python3 csv-to-json.py learning-graph.csv learning-graph.json color-config.json metadata.json taxonomy-names.json
```

`color-config.json` and `taxonomy-names.json` are committed so legend colors
and names stay stable across regenerations.

## How It Was Built

Generated with [Dan McCreary's](https://github.com/dmccreary)
[claude-skills](https://github.com/dmccreary/claude-skills) intelligent-textbook
pipeline, using Claude Code:

| Step | Skill |
|---|---|
| Scaffold | `book-installer` feature 0 |
| Course description | `course-description-analyzer` |
| Learning graph (300 concepts) | `learning-graph-generator` |
| Chapter structure (15 chapters) | `book-chapter-generator` |
| Chapter content (~65k words) | `chapter-content-generator` |
| MicroSims (23) | `microsim-generator` conventions |
| Glossary, FAQ, quizzes, references | dedicated generator skills |

Project conventions and current pipeline state are in
[CLAUDE.md](CLAUDE.md).

## A Note on Limits

This book explains; it does not diagnose or prescribe. It describes what an
evaluation involves but cannot replace one, and explains how ADHD medications
work while leaving dosing to you and your prescriber. Where evidence is thin
or contested, the book says so.

If you are in crisis, contact a clinician — or in the US, call or text **988**
for the Suicide and Crisis Lifeline.

## Contributing

Corrections, particularly on clinical accuracy and broken links, are welcome —
please open an issue or a pull request.

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Share
and adapt for non-commercial purposes, with attribution, under the same
license.

To cite:

```
Batchu, Arun. Understanding ADHD: A Guidebook for People with ADHD and the
People Who Care for Them. 2026. https://arunbatchu.github.io/adhd/
```
