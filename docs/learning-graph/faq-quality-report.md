# FAQ Quality Report

Generated: 2026-08-24

## Overall Statistics

- **Total Questions:** 93
- **Overall Quality Score:** 76/100
- **Content Completeness Score:** 95/100 (course description 98/100, valid 300-concept DAG, 300-term glossary, ~65k words of chapters, 100% concept-to-chapter coverage)
- **Concept Coverage:** 67% (201/300 concepts addressed by at least one question; zero high-CIS gaps remain)

## Category Breakdown

| Category | Questions |
|---|---|
| Getting Started | 11 |
| Core Concepts | 29 |
| Technical Details | 19 |
| Common Challenges | 13 |
| Best Practices | 12 |
| Advanced Topics | 8 |
| (uncategorized) | 1 |

## Bloom's Taxonomy Distribution

| Level | Actual | Target | Deviation |
|-------|--------|--------|-----------|
| Remember | 20% | 20% | 0% |
| Understand | 38% | 30% | +8% |
| Apply | 14% | 25% | -11% |
| Analyze | 14% | 15% | -1% |
| Evaluate | 12% | 7% | +5% |
| Create | 2% | 3% | -1% |

Total absolute deviation 26% → Bloom's score 15/25. The Apply shortfall is
partly structural: the book's apply-level material lives in the MicroSims and
chapter exercises, which many answers link to.

## Answer Quality Analysis

- Links: 91/93 answers link to source content (98%) — all file-only, zero anchor fragments, all targets verified to exist
- Marked "**Example:**" blocks: 3/93 (4%); however most answers embed concrete inline scenarios (worked mini-cases, quoted sentences) rather than marked blocks
- Average answer length: 104 words (target 100-300)
- Complete standalone answers: 93/93
- Duplicates: 0

Answer quality score: 21/25.

## Organization

- Six standard categories in learning-progression order: yes
- Progressive difficulty: yes (easy in Getting Started through hard in Advanced)
- Duplicates: none
- Clear, searchable questions: yes

Organization score: 20/20. Coverage score: 20/30.

## Recommendations

1. Ten gap-closing questions were added during generation, eliminating all high-CIS coverage gaps. Next improvement: more Apply-level "how do I..." questions from the Chapters 9-10 toolkit.
2. Medium: convert the strongest inline scenarios into marked **Example:** blocks for RAG-friendliness.
3. Low: see faq-coverage-gaps.md for the 116 uncovered concepts, most of which are leaf concepts already covered individually by the glossary.
