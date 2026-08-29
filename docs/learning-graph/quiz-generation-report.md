# Quiz Generation Quality Report

Generated: 2026-08-24
Execution Mode: Serial (1 agent)

## Overall Statistics

- **Total Chapters:** 15
- **Total Questions:** 150 (10 per chapter)
- **Overall Quality Score:** 84/100

## Per-Chapter Summary

| Chapter | Questions | Bloom (R/U/Ap/An/E/C) | Answers (A/B/C/D) |
|---|---|---|---|
| 1. What ADHD Is And Is Not | 10 | 4/4/1/1/0/0 | 3/2/3/2 |
| 2. The ADHD Brain | 10 | 4/4/1/1/0/0 | 3/2/3/2 |
| 3. Presentations And Everyday Traits | 10 | 4/4/1/1/0/0 | 3/2/3/2 |
| 4. ADHD Across The Lifespan | 10 | 3/3/3/1/0/0 | 3/2/3/2 |
| 5. Getting A Diagnosis | 10 | 3/3/3/1/0/0 | 2/3/3/2 |
| 6. Co-occurring Conditions | 10 | 3/3/3/1/0/0 | 2/3/2/3 |
| 7. Medication | 10 | 3/3/3/1/0/0 | 3/2/3/2 |
| 8. Treatment Beyond Medication | 10 | 3/3/3/1/0/0 | 3/2/3/2 |
| 9. Building Daily Systems | 10 | 3/3/3/1/0/0 | 3/2/3/2 |
| 10. Tools And Keeping Systems Alive | 10 | 3/3/3/1/0/0 | 3/2/3/2 |
| 11. Emotional Life And Identity | 10 | 3/3/3/1/0/0 | 3/2/3/2 |
| 12. School And College | 10 | 3/3/3/1/0/0 | 3/2/3/2 |
| 13. Work And Career | 10 | 3/3/3/1/0/0 | 3/2/3/2 |
| 14. Family Life And Communication | 10 | 3/3/3/1/0/0 | 3/2/3/2 |
| 15. Partners And Caring For The Caregiver | 10 | 1/2/3/2/1/1 | 3/2/3/2 |

## Bloom's Taxonomy Distribution (Overall)

| Level | Actual | Blended target | Deviation |
|-------|--------|--------|-----------|
| Remember | 31% | ~28% | +3% |
| Understand | 31% | ~31% | 0% |
| Apply | 26% | ~26% | 0% |
| Analyze | 11% | ~12% | -1% |
| Evaluate | 0.7% | ~0.7% | 0% |
| Create | 0.7% | ~0.7% | 0% |

Chapter-type targets were hit exactly: introductory (1-3), intermediate (4-14), advanced (15).

## Answer Balance (Overall)

- A: 29% (43/150), B: 21% (32/150), C: 29% (44/150), D: 21% (31/150)

All within the 20-30% band; per-chapter balance is 2-3 per letter everywhere.

## Validation

- Duplicate questions: 0 (programmatic check)
- Metadata-vs-file answer mismatches: 0
- Concept labels: all 150 match learning-graph.json exactly
- Links: every question links [Chapter N](index.md), same-directory, zero anchors
- Unique concepts tested: 139/300 (quizzes prioritize high-CIS and section-level concepts)

## Recommendations

1. Consider a second quiz per chapter drawing on the remaining untested leaf concepts if readers want more practice.
2. The quiz bank (learning-graph/quiz-bank.json) is ready for LMS export or chatbot integration.

---

## Applied Quiz Set (added 2026-08-29)

A second quiz was added to every chapter as `quiz-applied.md` — 150 further
questions, 10 per chapter, bringing the book to **300 quiz questions**.

The two sets are complementary by design. The original set leans toward
Remember and Understand (62% combined), which suits a first pass after
reading. The applied set is scenario-based and weighted toward the higher
Bloom levels: each question opens with a situation drawn from the chapter's
own worked examples — Omar's forty minutes of homework, Dana's eight-minute
belief, Sana's collapse at 24, the mother who sent eleven articles — and asks
the reader to apply the chapter's framework rather than recall a definition.

| Property | Original set | Applied set |
|---|---|---|
| Questions | 150 (10 per chapter) | 150 (10 per chapter) |
| Emphasis | Remember / Understand | Apply / Analyze / Evaluate |
| Stem style | Direct question | Situation, then "what does this chapter say?" |
| Best used | After first reading | Before an exam, or on a second pass |

Verification performed on the applied set: sequential numbering 1-10 per
chapter, exactly four options per question, one answer block per question, and
every `Concept Tested` value matched against a real `ConceptLabel` in
`learning-graph.csv` (150/150 matched). Answer-position distribution across the
150 questions is A 36, B 41, C 39, D 34 — no positional bias a test-taker could
exploit.
