2026-08-24 17:44:13
# Chapter 7 Content Generation

**Skill:** chapter-content-generator v1.09, sequential mode
**End:** 2026-08-24 17:47:15

## Elaboration Budget (cis_max=1869)

- Tier A (1): Medication Overview
- Tier B (3): Stimulant Medications, Non-Stimulant Medications, Side Effects
- Tier C (21): remaining

Budget sum: ~3,770-6,150 words.

## Elements

- 1 chart microsim spec (Specified, 0 reused): titration-response-tracker (Chart.js, decision mode + blank tracker)
- 2 markdown tables (medication menu, concepts)
- 1 tip admonition, 1 collapsible question (two-weeks-in scenario)
- Worked examples: Sana's parents (overview framing), Dev's titration compressed
- Safety: no dosing advice; all decisions routed to prescriber; misconceptions teardown evidence-based

## Verification

- Concepts covered: 25/25
- TODO removed: yes
- mkdocs build --strict: pass
