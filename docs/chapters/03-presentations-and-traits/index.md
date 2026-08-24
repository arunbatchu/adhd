---
title: Presentations And Everyday Traits
description: The three official presentations of ADHD and the everyday traits families actually see - hyperfocus, time blindness, restlessness, masking, and the inconsistency that confuses everyone
generated_by: claude skill chapter-content-generator
date: 2026-08-24 09:20:00
version: 1.09
---

# Presentations And Everyday Traits

## Summary

This chapter covers the three official presentations of ADHD and the everyday traits families actually recognize: hyperfocus, time blindness, procrastination, forgetfulness, and the inconsistency that confuses everyone. It also introduces masking — working hard to look fine — which matters for the chapters ahead. After this chapter, readers can name what they are seeing instead of arguing about it.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

| Concept | CIS Score |
|---------|-----------|
| Inattentive Presentation | 2 |
| Hyperactive-Impulsive Type | 3 |
| Combined Presentation | 1 |
| Symptom Criteria | 182 |
| Symptom Thresholds | 1 |
| Situational Variability | 28 |
| Hyperfocus | 2 |
| Time Blindness | 7 |
| Distractibility | 18 |
| Mind Wandering | 1 |
| Internal Restlessness | 185 |
| Fidgeting | 1 |
| Excessive Talking | 1 |
| Interrupting | 1 |
| Forgetfulness | 39 |
| Losing Things | 4 |
| Task Switching Difficulty | 1 |
| Procrastination | 7 |
| Decision Paralysis | 1 |
| Sensory Sensitivity | 1 |
| Restlessness In Adults | 183 |
| Performance Inconsistency | 3 |
| Masking | 24 |
| Compensation Strategies | 1 |
| Boredom Intolerance | 1 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: What ADHD Is And Is Not](../01-what-adhd-is/index.md)
- [Chapter 2: The ADHD Brain](../02-the-adhd-brain/index.md)

---

Two people sit in the same clinic waiting room with the same diagnosis. One is a nine-year-old boy who hasn't stopped moving since he arrived. The other is a thirty-eight-year-old woman doing email on her phone, outwardly the calmest person in the building. Same condition, almost no visible overlap. This chapter explains how that's possible — first through the official machinery of presentations and symptom counts, then through the everyday traits that never appear on diagnostic forms but fill every family's actual arguments: time blindness, hyperfocus, losing the keys, the maddening "you did it fine yesterday."

The chapter's goal is vocabulary. Families who can say "that's time blindness" or "she's masking" have something to work on; families without the words argue about character instead. By the end, both readers should be able to watch a week of ordinary life and narrate it in terms this book can build on.

## The Official Sorting: Symptoms, Thresholds, Presentations

Chapter 1 gave you the DSM-5's structure; here's the layer of it that determines what a diagnosis actually *says*. The **symptom criteria** are the eighteen specific behaviors the DSM-5 recognizes — nine inattentive (careless mistakes, difficulty sustaining attention, not seeming to listen, not following through, poor organization, avoiding sustained mental effort, losing things, distractibility, forgetfulness) and nine hyperactive-impulsive (fidgeting, leaving the seat, inappropriate running or restlessness, inability to be quiet in leisure, "driven by a motor," excessive talking, blurting answers, trouble waiting turns, interrupting). Everything the evaluator counts, every rating scale a school sends home, every checkbox in the report — it's all built from these eighteen. Notice what you can now see that a checklist reader can't: each symptom is an executive function from Chapter 2 failing in public. "Doesn't follow through" is task initiation and prospective memory; "loses things" is working memory; "blurts" is response inhibition. The DSM counts surface behaviors because surfaces can be counted — but you know the machinery underneath.

The **symptom thresholds** are the counting rules: six or more symptoms within a category for children, five or more from age seventeen up, persisting six months, at a level out of step with developmental age. The threshold is a line drawn across a continuum — someone with four symptoms doesn't have a different kind of brain than someone with six, but the diagnosis attaches where the count crosses the line *and* impairs life across settings.

Which side of the eighteen dominates the count determines the **presentation** — and here are all three, each defined in one breath. The **inattentive presentation** means the count is met on the inattentive side only: the daydreamer, the quietly drowning student, Chapter 1's Elena — disproportionately girls and women, disproportionately missed. The **hyperactive-impulsive type** means the count is met on the hyperactive-impulsive side only: the classic visible picture, most common in young children, and the rarest presentation overall. The **combined presentation** — both counts met — is the most common in clinical settings and the picture most people imagine when they hear "ADHD."

One more fact rescues families from a common confusion: presentations are snapshots, and they *shift*. The DSM-5 deliberately renamed them from "subtypes" to "presentations" because longitudinal research showed the same person moving between pictures as they age — most typically, a hyperactive-impulsive child becomes a combined-presentation teen and then an inattentive-looking adult as the visible motor goes inside (Chapter 1's Devon). A worked example of why this matters: Nora's son was diagnosed combined at eight. At sixteen he sits through dinner fine, so Nora wonders if he's "growing out of it" — while his grades quietly collapse from missed assignments. He hasn't grown out of anything; his presentation has shifted toward inattentive, the visible half faded, and the invisible half is running the show. Families who know presentations shift keep watching the right things.

Explore how the eighteen symptoms sort — and how the same person's picture can drift over time — in the explorer below.

#### Diagram: Symptom and Presentation Explorer

<iframe src="../../sims/symptom-presentation-explorer/main.html" width="100%" height="500px" scrolling="no"></iframe>

[Run the Symptom and Presentation Explorer fullscreen](../../sims/symptom-presentation-explorer/main.html){ .md-button }

<details markdown="1">
<summary>Symptom and Presentation Explorer</summary>
Type: infographic
**sim-id:** symptom-presentation-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective: Understand (L2, Bloom verb: classify) how the 18 DSM-5 symptoms divide into two categories, how threshold counts determine presentation, and why the same person's presentation can shift across ages.

Canvas layout: Responsive. Two labeled columns ("Inattentive symptoms", "Hyperactive-impulsive symptoms"), each holding 9 symptom chips. Below: two counters, a threshold line indicator, and a resulting-presentation banner. Side panel: infobox.

Visual elements:

- Each symptom chip is clickable to toggle "present/absent"; hovering shows the underlying executive function from Chapter 2 ("blurts answers -> response inhibition")
- Live counters per column; when a column's count crosses the threshold (6, or 5 in adult mode), it highlights and the banner updates the resulting presentation (inattentive / hyperactive-impulsive / combined / below threshold)
- An "age" toggle: child (threshold 6) vs adult 17+ (threshold 5), visibly moving the threshold line
- Three preset case buttons: "Marcus, 9" (hyperactive-impulsive pattern), "Elena, 15" (inattentive pattern), "Devon at 9 vs Devon at 39" (a two-step preset that first shows combined, then unchecks visible hyperactive chips and checks internal ones, showing the drift toward an inattentive-looking adult picture)

Interactive controls: Chip toggles, age toggle, preset buttons, reset button.

Data visibility requirements:

- Stage 1: Show both counts and threshold at all times
- Stage 2: On each toggle, show the updated presentation determination with a one-line explanation
- Final: The Devon preset ends with a caption explaining presentation shift and why "sits still now" does not mean "outgrew it"

Instructional rationale: Classification with visible counting rules is an L2 task best served by letting the learner operate the actual decision procedure; the presets connect the mechanics to the chapter's named cases.

Implementation: p5.js, responsive layout, chips reflow on resize.
</details>

## The Inconsistency That Drives Everyone Crazy

Before the everyday traits, one concept that frames all of them. **Situational variability** is the well-documented fact that ADHD symptoms change strength with the situation: the same child who can't sit through five minutes of homework plays chess for an hour; the same adult who misses every internal deadline never misses a client's. This follows directly from Chapter 2's machinery — interest, novelty, urgency, one-on-one attention, and immediate feedback all raise the reward system's pull and lower the load, so symptoms genuinely shrink in situations that supply them. Video games are the canonical example: constant novelty, instant feedback, escalating challenge — a machine purpose-built to fit an interest-based nervous system. A child focusing on Fortnite proves nothing about what he can do with a worksheet.

Its cousin is **performance inconsistency** — the same task, wildly different results on different days: Tuesday's flawless essay, Thursday's disaster; the monthly report done brilliantly one month and forgotten the next. Chapter 2 predicted this too (regulation is inconsistent by nature; sleep, load, and interest move daily), but here's the family consequence spelled out: *the good day gets weaponized*. "You did it perfectly last week, so I know you can" feels like encouragement and lands like an accusation, because it converts the best-ever performance into the new minimum standard. The accurate reading of a great day is "conditions lined up" — and the useful move is asking *which* conditions, so you can line them up on purpose. Write that question down; it's half of Chapter 9.

!!! tip "For both readers"
    Variability is the signature of ADHD, not evidence against it. If someone says "she can't have ADHD — I've seen her focus for hours," you now have the answer: uneven-by-situation is exactly what the condition looks like. Consistency is what would be surprising.

## The Traits Families Actually See

The DSM's eighteen symptoms are what evaluators count. What families live with is a different list — traits with no diagnostic checkbox that fill the actual arguments. Each gets its working definition here, grouped the way they show up.

### Where the attention goes

**Distractibility** is attention's capture problem from Chapter 1 running at full strength: external events — a noise, a notification, a person walking past — yank the spotlight off task, and each yank costs the re-entry toll of finding your place again. The tax is bigger than the interruptions themselves: twenty small captures can hollow out a work hour while looking, from the outside, like an hour of work. **Mind wandering** is the internal version — the default mode network from Chapter 2 flickering on mid-task, so you surface three paragraphs later having read every word and absorbed none. External noise-proofing doesn't touch this one, which is why "just work somewhere quiet" only half-helps.

**Hyperfocus** is the trait that surprises outsiders most: a state of intense, tunnel-vision absorption — hours vanishing into a game, a project, a rabbit hole — with time, hunger, and bladder signals all muted. It's the regulation coin's other face: the spotlight that resists steering *toward* dull tasks also resists steering *away* from gripping ones. Hyperfocus is genuinely double-edged — aimed at the right target it produces extraordinary work (Chapter 11 returns to this as a strength), and aimed anywhere it makes the person unreachable, late, and startled by nightfall. The family-relevant fact: interruption *hurts* — being yanked out of hyperfocus is jarring and often triggers a snap that reads as hostility. A negotiated protocol (a shoulder tap plus a five-minute warning, not a shouted demand from another room) prevents a nightly fight.

### Time

**Time blindness** is a weakened felt sense of time: how long things take, how much has passed, how far away a deadline sits. Researchers describe the ADHD time horizon as collapsed to "now" and "not now" — a deadline is motivationally invisible until it crosses into *now* (Chapter 2's discount curve, wearing a watch). In daily life it looks like chronic lateness that keeps surprising the person themselves, "five more minutes" that was forty, wildly optimistic estimates ("I'll be ready in ten"), and the 4 pm discovery that the day is gone. The worked example every couple will recognize: Dana needs to leave at 6:00 and starts getting ready at 5:52, sincerely believing showering, dressing, and finding shoes fits in eight minutes — the same eight-minute belief as last time, unrevised, because the *feel* of duration never updates the way visible clocks would force it to. That's the fix's shape, and Chapter 10 builds it: time made visible and external — analog clocks, timers, alarms at the *start* of getting-ready, not the departure.

Test your own time sense against the clock below — most people are off; the question is by how much and in which direction.

#### Diagram: Time Blindness Challenge

<iframe src="../../sims/time-blindness-challenge/main.html" width="100%" height="500px" scrolling="no"></iframe>

[Run the Time Blindness Challenge fullscreen](../../sims/time-blindness-challenge/main.html){ .md-button }

<details markdown="1">
<summary>Time Blindness Challenge</summary>
Type: microsim
**sim-id:** time-blindness-challenge<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective: Apply (L3, Bloom verb: demonstrate) what degraded time perception feels like by estimating intervals and task durations without a clock, then comparing felt time against actual time.

Canvas layout: Responsive. Center: a challenge area. Below: controls. Side/bottom: results panel that accumulates across rounds.

Challenge rounds:

1. Interval estimation: "Click when you think 30 seconds have passed" (no clock visible; a simple distractor animation plays — drifting shapes — because empty waiting and distracted waiting produce different errors)
2. Duration judgment: a simple engaging mini-task (clicking sequential numbered targets) runs for an unrevealed duration; learner then estimates how long it took
3. Planning estimate: learner estimates how long round 2 would take to repeat, then repeats it; sim compares estimate vs actual

Visual elements:

- Results panel showing, per round: felt time vs actual time, signed error, and a growing scatter of all attempts
- After three rounds, a summary: average error direction ("time flies during engaging tasks - you underestimated by 40%") linked to a one-paragraph explanation of the now/not-now horizon
- A comparison note: typical estimation error ranges vs the learner's, framed non-diagnostically ("this is a demonstration, not a test")

Interactive controls: Start round buttons, "try with a visible clock" toggle for round 2 (demonstrating that externalized time removes the error - the chapter's fix, made experiential), reset.

Data visibility requirements:

- Stage 1: Show felt vs actual numerically after every round
- Stage 2: Show the error shrink when the visible-clock toggle is on
- Final: Summary connects each error to a daily-life equivalent ("the 5:52 shower")

Instructional rationale: Time blindness is a felt phenomenon; a demonstration the learner performs on themselves, with numeric feedback and an externalization toggle that visibly fixes it, teaches both the trait and its remedy in one artifact.

Implementation: p5.js, responsive, uses frame timing; no external assets.
</details>

### The motor, inside and out

**Fidgeting** — the tapping foot, clicked pen, bounced knee, chewed everything — is the visible spillover of a motor that idles high, and Chapter 2 gave you its secret: it's often *functional*, adding stimulation that helps regulate arousal. The research-informed move is channeling it (quiet fidgets, standing desks, doodling) rather than suppressing it, because suppression spends load the person needs for the actual task.

**Internal restlessness** is the same motor felt from inside with the outside stilled: a crawling, revving, can't-settle sensation — a mind that channel-surfs itself, a body that finds stillness genuinely uncomfortable even in a person sitting perfectly still. This is the form restlessness takes as people age and social pressure clamps the visible version, and it's among the most commonly reported adult symptoms — and among the least visible to families, which is exactly why it needs its name said out loud. A person describing "I can't relax, my brain won't shut up, vacations stress me" is reporting a core ADHD symptom, not a personality flaw or an ingratitude for the vacation.

**Restlessness in adults** is how that plays out at the life scale, and it deserves its own entry because families misread it so consistently. The adult version rarely looks like pacing. It looks like *structural* motion: overfilled calendars, three side projects, volunteering for too much, job changes when roles get routine, difficulty with slow evenings, the partner who can't just sit and watch the movie. A worked example: Priya's husband finally gets a quiet Saturday with nothing planned — and by 10 am she has reorganized a closet, proposed a day trip, and started two loads of laundry, visibly agitated by the calm he finds restorative. He reads it as her rejecting rest, or him. The accurate read: unstructured stillness is under-arousal (Chapter 2), and her system escapes discomfort through motion. Couples who know this negotiate — restful-for-her can be a hike he joins, and restful-for-him gets protected windows she plans around — instead of fighting about whose Saturday is correct. **Boredom intolerance** is the same wiring at the trait level: for an interest-based nervous system, boredom isn't mild tedium, it registers closer to physical discomfort — something to be escaped *now* — which is the engine behind channel-flipping, tab-hoarding, risky-novelty-seeking, and abandoned hobbies. The escape behaviors differ by age; the discomfort underneath is one thing.

### The social spillover

**Excessive talking** is verbal hyperactivity — long stories, filled silences, monologues past the listener's visible exhaustion — usually with weak self-monitoring (Chapter 2's dashboard) failing to flag the room's signals in real time. **Interrupting** is response inhibition failing socially: the thought arrives, and — partly because working memory can't be trusted to *hold* it until a turn opens — it exits immediately. That last clause matters for families: many people with ADHD interrupt not from disrespect but from experience — every unspoken thought is a thought likely lost. Knowing that doesn't make interruption costless; it changes the fix from "be less rude" to workable mechanics (a notepad in meetings, an agreed hand signal at dinner, the listener's grace of finishing the sentence anyway).

### Objects and errands

**Forgetfulness** in ADHD is Chapter 2's memory chapter happening daily: appointments, commitments, the reason you walked into this room — overwhelmingly failures of prospective memory and working-memory encoding, not the filing cabinet. Its signature is unevenness (2014's insult: perfectly preserved; this morning's promise: gone), which is exactly what makes it read as selective caring. It isn't selective by importance; it's selective by *cue* — what got externalized, what fired at the right moment. **Losing things** is the same machinery applied to objects: keys, phone, wallet, glasses, the permission slip — set down mid-thought with attention already three steps ahead, so the location was never encoded at all. You can't retrieve a memory that was never filed. This is why retracing steps fails and why the fix is spatial rather than mnemonic: one bowl by the door, one pocket, one charger spot — locations doing the remembering. Chapter 9 calls this giving everything a home.

### Getting stuck

**Task switching difficulty** is cognitive flexibility's daily face: transitions cost extra — leaving the house, stopping the game, moving between homework subjects — and *surprise* transitions cost most. The scene every parent of a child with ADHD knows: twenty pleasant minutes of Legos, then "time for bath" detonates a meltdown. The trigger wasn't bath; it was the unbudgeted gear-shift. Warnings ("five more minutes"), countdowns, and ritualized transitions pay the toll in advance.

**Procrastination** in ADHD is task initiation failure wearing a moral costume. The observable behavior — important task untouched for weeks, then done in a deadline sprint — is identical to not caring, which is why it draws so much judgment including self-judgment. You have the machinery now: a distant deadline sits below the motivation threshold (delay aversion) and the starter motor doesn't turn without urgency, interest, or a smaller first step. The suffering is the tell, as with Chapter 1's laziness myth: ADHD procrastination is spent *in misery about the undone thing*, often while doing decoy productivity (cleaning everything except writing the essay). **Decision paralysis** is the stall's other flavor: choices — even small ones — freeze the system, because comparing options runs entirely in working memory while every option's downsides pull at attention. Menus, twelve open tabs comparing toasters, an unanswered RSVP aging into rudeness. The practical unlocks are structural: shrink the option set, set a decision deadline, or make it reversible ("pick one; we can change it").

### The volume knobs

**Sensory sensitivity** — sounds, textures, tags, lights, chewing noises registering at painful volume — is common in ADHD (though not part of the diagnostic criteria), and it quietly raises the load on everything else: a scratchy uniform or humming fluorescent light is a tax on the same budget attention runs on. Families who take "this sock seam is unbearable" as data rather than drama remove real obstacles cheaply.

Here's the whole toolkit of traits in one reference table — the prose above is the explanation; this is the lookup:

| Trait | One-line definition | The misread it invites |
|---|---|---|
| Distractibility | External events capture the spotlight | "Doesn't respect my time" |
| Mind wandering | Internal thoughts capture it | "Wasn't listening on purpose" |
| Hyperfocus | Absorption that mutes time and signals | "Can focus when *she* wants to" |
| Time blindness | Weak felt sense of duration and deadlines | "Late because we don't matter" |
| Fidgeting | Visible motor spillover; often self-regulating | "Not paying attention" |
| Internal restlessness | The motor felt inside, invisible | "Can't ever be satisfied" |
| Restlessness in adults | Overcommitment, job churn, no slow evenings | "Allergic to commitment / rest" |
| Boredom intolerance | Boredom registers as near-physical discomfort | "Immature, always chasing new" |
| Excessive talking / interrupting | Verbal spillover + weak brake + leaky memory | "Rude, self-centered" |
| Forgetfulness / losing things | Prospective memory and encoding failures | "Remembers what he cares about" |
| Task switching difficulty | Transitions cost extra, surprises cost most | "Defiant about every little thing" |
| Procrastination / decision paralysis | Starter motor + threshold + frozen choice | "Lazy, doesn't care" |
| Sensory sensitivity | Input arrives at painful volume | "Dramatic, picky" |

## Masking: Working Hard to Look Fine

One trait gets its own section because the rest of the book keeps returning to it. **Masking** is the continuous, effortful concealment of symptoms — suppressing the fidget, rehearsing the sentence to avoid blurting, triple-checking everything to hide the forgetting, arriving painfully early to hide time blindness, mimicking calm while internally revving. And **compensation strategies** are masking's constructive twin: the self-built workarounds — obsessive list-making, staying late to redo work, using raw intelligence to reconstruct missed instructions — that deliver normal-looking *results* at abnormal private cost. Together they explain the most confusing sentence families say: "But she does fine."

Three facts about masking organize everything later chapters do with it. First, it *works* — that's the problem. Masked ADHD produces decent grades and good performance reviews, so nobody refers the person for evaluation; masking is the engine of late diagnosis, and it's disproportionately how girls and women present, which Chapter 4 takes up in full. Second, it's *expensive*: masking spends the same executive budget everything else runs on, all day. The bill arrives at home — the composed-at-school child who detonates at 3:30 in the kitchen (families should hear the school-home contrast as evidence of effort, since home is where the mask comes off, and read that as trust rather than targeting). The adult version is the worker praised for calm competence who collapses on the couch, socially empty, every single evening. Third, prolonged masking corrodes from inside: exhaustion, anxiety, and the particular loneliness of being valued for a performance — "if they knew what this costs me, they'd know I'm a fraud."

The worked example that ties this chapter shut: Grace, 34, is the colleague everyone calls organized — color-coded calendar, first to every meeting, notes for everything. At her evaluation (she finally went after her daughter's diagnosis; the geneticist's waiting room, Chapter 1) she meets the inattentive symptom list and starts crying: she has all nine. Every "organized" behavior on her reputation is a compensation strategy she built by hand, and maintaining the machine costs her every evening and most of her self-worth. Nobody missed Grace's ADHD because it was mild. They missed it because she was carrying it beautifully. When Chapter 15 has the person with ADHD write an Owner's Manual, the masking section — *what looking fine costs me, and where I need to be allowed not to* — is the page families most need to read.

??? question "Check yourself: 'He sat through his sister's whole two-hour recital, so the fidgeting in class is clearly a choice.' What three concepts from this chapter answer this? Click to check."
    (1) Situational variability — symptom strength genuinely changes with setting; a one-off high-stakes event with novelty and social pressure supplies conditions a daily classroom doesn't. (2) Masking — sitting still for two hours is likely effortful suppression, not comfort; the cost was paid invisibly and probably came due afterward. (3) Performance inconsistency — one good performance sets what's *possible* under ideal conditions, never what's *sustainable* under ordinary ones. Bonus: internal restlessness — stillness on the outside says nothing about what it took on the inside.

## What to Carry Out of This Chapter

For the reader with ADHD:

- Your presentation is a snapshot, and it can shift with age — a quieter outside doesn't mean it went away, and you're allowed to say so.
- The traits in this chapter are mechanisms, not flaws: time blindness, boredom intolerance, decision paralysis all have machinery behind them and levers in front of them (Chapters 9-10).
- Notice what your masking costs. Where it's worth it, keep it; where it's eating you, this book works on where the mask can come off.

For the reader who loves someone with ADHD:

- Learn the traits table well enough to name what you're seeing. "That's the transition tax" starts a different conversation than "why is bath time always war."
- Never bill someone's best day as their new minimum, and never read a school-home (or work-home) gap as targeting you — home is where the mask comes off, and that's a form of trust.
- The traits you find most maddening — lateness, interrupting, the untouched project — are the ones with the most mechanical fixes coming in Part Three. Hold on.

Next, Chapter 4 follows all of this across a life: what ADHD looks like at six, sixteen, and forty-six, why girls and women slip through every net, and what happens when diagnosis finally arrives decades late.
