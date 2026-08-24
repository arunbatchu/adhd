2026-08-24 17:38:34
# Chapter 5 Content Generation

**Skill:** chapter-content-generator v1.09, sequential mode
**End:** 2026-08-24 17:41:12

## Elaboration Budget (cis_max=1869)

- Tier A (3): Diagnostic Evaluation, Evaluation Report, What A Diagnosis Means
- Tier B (3): Who Can Diagnose, Differential Diagnosis, Finding A Clinician
- Tier C (19): remaining

Budget sum: ~4,530-7,250 words.

## Elements

- 1 workflow spec (Specified, 0 reused): evaluation-anatomy-map with rate-the-vignette L5 mode (serves Diagnostic Evaluation, Tier A)
- 2 markdown tables (clinician comparison; report-reading is a list), preparation checklist list
- 1 tip admonition, 1 collapsible question (30-minute clinic teardown)
- Worked examples: two-families report reading (Evaluation Report), what-diagnosis-means both-directions treatment

## Verification

- Concepts covered: 25/25
- TODO removed: yes
- mkdocs build --strict: pass
