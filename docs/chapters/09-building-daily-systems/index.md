---
title: Building Daily Systems
description: The practical toolkit - externalizing memory, capture systems, task breakdown, time estimation, body doubling, routines, and environment design for an ADHD brain
generated_by: claude skill chapter-content-generator
date: 2026-08-24 12:20:00
version: 1.09
---

# Building Daily Systems

## Summary

This chapter begins the practical toolkit: externalizing memory instead of trusting it, breaking tasks down, estimating time, using timers, body doubling, and building routines that fit an ADHD brain. These are the daily mechanics that turn understanding into a better Tuesday. After this chapter, readers have a starter set of systems to try.

## Concepts Covered

This chapter covers the following 15 concepts from the learning graph:

| Concept | CIS Score |
|---------|-----------|
| Externalizing Memory | 32 |
| Capture Systems | 6 |
| To-Do Lists That Work | 3 |
| Task Breakdown | 2 |
| Defining Next Actions | 1 |
| Time Estimation | 4 |
| Timers And Alarms | 2 |
| Pomodoro Technique | 1 |
| Body Doubling | 4 |
| Accountability Partners | 3 |
| Routines And Habits | 8 |
| Habit Stacking | 1 |
| Morning Routines | 1 |
| Evening Routines | 1 |
| Environment Design | 9 |

## Prerequisites

This chapter builds on concepts from:

- [Chapter 2: The ADHD Brain](../02-the-adhd-brain/index.md)
- [Chapter 3: Presentations And Everyday Traits](../03-presentations-and-traits/index.md)
- [Chapter 8: Treatment Beyond Medication](../08-treatment-beyond-medication/index.md)

---

Eight chapters of understanding now get cashed in. Everything here follows one engineering rule, derived from everything you know: *stop asking the brain to do what it's bad at, and move that work into the world.* Working memory leaks — so put information on paper. Prospective memory misfires — so let alarms do the firing. Time is invisible — so make it visible. Starting is the hard part — so shrink the start. None of these systems requires becoming a different person; that's the point of them.

Two ground rules before the toolkit. First, systems beat willpower — Chapter 1's willpower myth retired trying-harder as a strategy, and this chapter is what replaced it. Second, expect iteration: the first version of any system will half-work, and per Chapter 3's variability, a system that fails on Tuesday may fit fine with one adjustment. Tinkering is the method, not a sign of failure. For the family reader: your role throughout this chapter is collaborator and occasional infrastructure — never enforcement. A system imposed on a person with ADHD is a nag with laminations; a system built *with* them is scaffolding they'll actually stand on. Chapter 14 draws these lines carefully; keep them in view all chapter.

## The Master Principle: Externalizing Memory

**Externalizing memory** means moving information out of your head and into reliable external storage — paper, phone, whiteboard, alarm, a bowl by the door — the moment it arrives. It's the master principle because it directly patches the two most reliable failure points from Chapter 2: working memory (the leaky desk — information never encoded can't be recalled) and prospective memory (the alarm that doesn't fire — intentions kept "in mind" don't surface on schedule). The rule in its usable form: **if it matters, it doesn't live in your head.** Not the appointment, not the promise to your wife, not the great idea in the shower, not "I'll bring the form Thursday." Heads are for having thoughts, not holding them.

The worked example is Chapter 2's Sam, re-run with the system installed. Tuesday morning, Sam promises to pick up the prescription. *At the moment of promising* — this timing is the whole trick — he sets a 5:05 pm phone alarm labeled "PHARMACY before home," in front of his wife. At 5:05 the alarm fires as he's walking out into the same distracting phone call as before; the label steers the drive. Nothing about Sam's brain changed between the two versions of this story. The intention was moved from the least reliable storage he owns (prospective memory) to the most reliable (a device that never forgets and interrupts on schedule). His wife's part also changed: instead of testing his love nightly against his weakest brain function, she watched him build the alarm — which reads as the promise being taken seriously, because it is. Externalization done at the moment of commitment is what taking-it-seriously *looks like* in an ADHD household.

## Capture, Lists, and the Art of Starting

**Capture systems** are externalization's front door: one *always-available* place where every incoming commitment, idea, and obligation lands the instant it appears — before working memory can drop it. The operative word is *one*: five capture points (a notebook here, three apps, a sticky note ecosystem) recreate the original problem as "which list was that on?" Pick the tool that is always physically present (for most people, the phone's notes or reminders app; for some, a pocket notebook or a kitchen whiteboard for household items) and grant it a monopoly. The capture habit itself — reaching for it *mid-conversation*, at the mailbox, in the parking lot — feels rude and mechanical for about two weeks, and then it quietly removes a whole category of failure. Families: when your person pauses a conversation to capture, that's the system working; the respectful move is to wait, not to add two more items while they type.

**To-do lists that work** are what capture becomes after a nightly two-minute sort, and the ADHD-specific engineering matters because standard list advice fails this population predictably. Three rules fix most of it. Keep *today's list* to three-to-five items and physically separate from the everything-list — a forty-item list is Chapter 3's decision paralysis printed out, and its daily non-completion is a shame generator (Chapter 11 cares about this). Write items as actions, not topics (next paragraph). And put the list where the eyes already go — taped to the monitor, on the lock screen — because a list that must be remembered-to-be-checked dies by the very failure mode it was built to fix.

**Task breakdown** attacks the paralysis in front of big vague tasks — Chapter 2's map-maker function, outsourced to a calmer moment. "Clean the garage," "apply to colleges," "do taxes" are not tasks; they're *projects* wearing a task's name, fifty invisible steps with no marked entrance. The technique: split any project into steps small enough that no single step is scary — and if a step still produces the avoidance feeling, split *that* step. **Defining next actions** is the breakdown's cutting edge and the single highest-value habit in this section: for anything stalled, name the *physically next thing* — not "work on taxes" but "find last year's return in the email and download it." Concrete, small, start-able in under ten minutes. The test of a real next action is that you could do it right now without deciding anything further. Most "procrastination" on projects (Chapter 3 absolved the character; this is the mechanism) is actually an undefined next action: the starter motor has nothing its size to grab. A worked example in one line: "renew the car registration" sat for three weeks; "find the renewal notice on the counter and put it by the laptop" took ninety seconds and broke the dam — because the ninety-second version asked nothing of planning, only of doing.

#### Diagram: Next-Action Trainer

<iframe src="../../sims/next-action-trainer/main.html" width="100%" height="452px" scrolling="no"></iframe>

[Run the Next-Action Trainer fullscreen](../../sims/next-action-trainer/main.html){ .md-button }

<details markdown="1">
<summary>Next-Action Trainer</summary>
Type: microsim
**sim-id:** next-action-trainer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective: Create (L6, Bloom verb: formulate) proper next actions by decomposing vague stalled tasks into concrete, immediately startable steps, and judging candidate actions against the "startable now, no further decisions" test.

Canvas layout: Responsive. Left/top: a "stalled task" card. Right/bottom: workspace and feedback panel.

Modes:

1. Judge mode: shows a stalled task ("apply for the internship") and four candidate next actions of varying quality ("work on application", "think about essay topics", "open the portal and screenshot the requirements list", "be more organized about deadlines"); learner picks the real next action; feedback names the test each failed candidate flunks (topic-not-action, requires further decisions, not physically specifiable, character-goal-not-action)
2. Build mode: shows a vague project ("clean the garage", "plan grandma's birthday", "fix the resume") and a free-text field; learner writes their own next action; the sim checks it against heuristics (starts with a verb, mentions a specific object/place, estimated under 10 minutes via a self-rated slider) and gives rubric-style feedback rather than right/wrong
3. Chain mode: after a valid next action, asks "and after that?" three times, demonstrating that chains are built one link at a time and only the first link needs to exist today

Content pool: at least 12 stalled tasks spanning home, school, work, and family life, several drawn from the book's running examples (registration renewal, the taxes, the college applications).

Interactive controls: Mode selector, task shuffle, a "still scary? split it again" button in build mode that prompts a smaller re-write.

Data visibility requirements: Feedback always names the specific heuristic passed or failed; a summary screen collects the learner's built actions into a copyable list formatted like the chapter's today-list (3-5 items max, action-phrased).

Instructional rationale: Formulating next actions is a generative skill — a Create-level objective — so the sim centers free construction with rubric feedback, using judge mode only as the on-ramp.

Implementation: p5.js with HTML input overlay for text entry; responsive; heuristic checks are keyword/length/slider-based, deliberately forgiving.
</details>

## Making Time Visible

**Time estimation** — the skill time blindness (Chapter 3) degrades — improves with one mechanical practice: *measure, don't vibe*. The technique is an estimation log: before a recurring task, write the guess; after, write the actual; review weekly. Dana's eight-minute getting-ready belief (Chapter 3) survives only because it's never confronted with data — three logged mornings reveal it's twenty-six minutes, and the *revised number*, not self-scolding, is what changes the departure math. Two rules of thumb while calibration builds: multiply gut estimates for boring multi-step tasks by 1.5 to 2, and schedule backward from hard deadlines using the logged numbers ("leave at 6:00" becomes "shower at 5:20," alarm set accordingly — at the *start* of the sequence, where Chapter 3 said it belongs).

**Timers and alarms** are prospective memory outsourced, and the difference between the two is worth one sentence: *alarms* fire at clock times (take the medication, leave for pickup, start winding down), while *timers* make durations visible and finite. Uses beyond the obvious: the transition warning ("five more minutes" made real, paying Chapter 3's transition tax in advance), the wear-off alarm (Chapter 7's 5 pm cliff, scheduled around), and the visible countdown — analog or app — that turns abstract time into a shrinking shape the eyes can check. Label every alarm with its *action* ("PHARMACY before home"), because an unlabeled 5:05 alarm two hours after setting it is a mystery, not an instruction.

The **Pomodoro technique** packages timers into a work rhythm: commit to one task for a fixed sprint (classically 25 minutes), take a short timed break (5), repeat; every few cycles, a longer break. Why it fits this brain specifically: the sprint is small enough for the starter motor (you're not starting the thesis, you're starting 25 minutes), the ticking countdown supplies urgency the deadline is too far away to provide (Chapter 2's discount curve, artificially steepened), and the sanctioned break gives restlessness a legal exit instead of a guilty one. ADHD adaptations that practitioners converge on: tune the sprint length to your actual attention (some do better at 15, some at 45 — the log tells you), guard the break's end with its own alarm (the break is where Pomodoro dies), and if hyperfocus arrives mid-sprint on the *right* task, let it run — the technique is a starter, not a governor.

## Borrowing Other People's Presence

**Body doubling** is the strategy with the strangest name and the most devoted users: doing your work *in the presence of another person* who is simply there — working on their own things, not helping, not supervising. The wife reading while you do taxes; the friend on a video call, each muted, doing separate chores; a café's ambient population. Why mere presence works maps onto Chapter 2: another person supplies mild arousal (climbing out of the under-stimulated fog), a whiff of social accountability (someone would notice you wandering off), and interest-currency (even boring tasks become slightly performed). It costs nothing and converts some people's worst task categories from impossible to routine — which makes it the first thing to try on any chronically stalled chore. For the family reader, note what body doubling asks of you and what it doesn't: sit nearby with your own book — and resist narrating, correcting, or supervising, which converts a body double into a foreman and cancels the effect.

**Accountability partners** are the scheduled version of the same physics: a specific person expecting a specific thing at a specific time — the gym friend at 7 am, the Sunday "did we both do our admin?" text, the writing group's Friday pages. The mechanism is external deadline manufacture: the reward system that ignores "someday" responds to "Casey is standing outside at 7." Design rules learned the hard way: make the commitment concrete and dated (not "let's keep each other on track"), keep stakes friendly (shame-based accountability gets avoided along with the task — the partner you start dodging has become a second deadline problem), and prefer peers over spouses for recurring task accountability, because Chapter 14 will have strong opinions about what chronic monitor-roles do to a marriage.

## Routines: Automating the Decisions Away

**Routines and habits** matter to this brain for a reason Chapter 2 makes precise: every decision spends load, and a routine is a *decision eliminator* — the sequence runs on rails, so the executive budget stays unspent for things that deserve it. The honest ADHD caveat comes first: habits form more slowly and break more easily with ADHD (interest fades, one disrupted week derails the rails), so the design rules below matter more here than for other brains, and a collapsed routine is a Tuesday event to be re-started, not a character verdict. The rules: anchor every routine to an existing fixed event rather than a clock time ("after the coffee finishes" survives weekends; "at 7:15" doesn't); keep chains short (three-to-five steps — long routines fail at their weakest link); externalize the sequence itself (a checklist on the bathroom mirror is the routine's memory, so the head doesn't have to be); and rebuild shrunk, not bigger, after a collapse (the two-step version that runs beats the seven-step version that doesn't).

**Habit stacking** is the anchoring rule as a technique: attach a new habit directly onto an existing automatic one — *after I pour the coffee, I take the medication; after I take the medication, I check the today-list.* The existing habit becomes the cue, which is exactly the externalization principle again — the trigger lives in the environment's sequence, not in remembering. Stack one new link at a time; a five-link stack installed in one motivated weekend is a Chapter 3 abandoned-hobby story waiting to happen.

**Morning routines** deserve their own engineering because mornings are the day's cascade point — a derailed morning taxes everything after it — and because mornings run on the day's *least* medicated, least caffeinated, most rushed brain. The ADHD-specific move: shift every possible decision to the night before (clothes chosen, bag packed, breakfast planned, keys in the bowl), so the morning is pure execution on rails. Keep the live sequence stupid-simple and posted where it happens. **Evening routines** are the morning's supply line plus the sleep-protection front line from Chapters 6 and 8: a *launchpad* ritual (bag, keys, forms, tomorrow's three-item list — five minutes that de-mine the morning) followed by a wind-down with its own start alarm, because the night's real enemy is the un-decided drift into one-more-episode. The pair works as a loop: the evening routine is genuinely the morning routine's first half.

## Environment Design: The Room Is Part of the Brain

**Environment design** is the principle underneath half this chapter, promoted to a strategy: since the environment steers the spotlight more than intention does (Chapter 1), *arrange the environment to do the steering you want.* Its two operating rules point in opposite directions. **Add friction to the wrong things**: the phone charges in the kitchen during homework (the capture that can't happen), the game controller lives in a drawer across the room, the snacks aren't at the desk. **Remove friction from the right things**: the gym bag packed by the door, the vitamin bottle *on* the coffee maker, the guitar on a wall hook instead of in a case, the form already clipped to the clipboard with a pen. Each moved object is a decision pre-made and a temptation pre-blocked — willpower stored in furniture. Two applications tie the chapter's threads together: give every routinely-lost object a single *home* (Chapter 3's losing-things fix — the bowl, the hook, the charger spot — locations doing the remembering), and build *visual triggers* for anything that must happen (the trash by the front door on trash night; out of sight is genuinely out of mind for this brain, so put things in sight on purpose). A worked example at household scale: Rosa's family (Chapter 3) stopped relitigating her forgetting and spent one Saturday on infrastructure — key bowl by the door, charger shelf, a launchpad table, the shared whiteboard for household captures, alarms installed for the recurring three. Cost: an afternoon and $40. Effect: the four most common fights now have no occasion. Nobody's brain changed; the house got smarter.

Here's the starter set, collected — every row explained above:

| System | Fixes | First step tonight |
|---|---|---|
| One capture point | Working memory leaks | Pick the tool; grant it a monopoly |
| Today-list (3-5 actions) | List paralysis and shame | Sort capture into tomorrow's three |
| Next actions | Stalled projects | Name one ninety-second first step |
| Estimation log | Time blindness | Guess-then-time one recurring task |
| Labeled alarms | Prospective memory | Set the medication and departure alarms |
| Pomodoro sprints | Task initiation | One 25-minute sprint, break alarm set |
| Body double | The impossible chore | Schedule one co-working hour |
| Habit stack | Routine building | Attach one new link to the coffee |
| Launchpad + wind-down alarm | Chaotic mornings, stolen sleep | Five-minute evening reset tonight |
| Object homes + friction moves | Lost things, phone spirals | The bowl, the hook, the kitchen charger |

!!! tip "For both readers"
    Pick *one* row each — the person with ADHD chooses theirs, the family member chooses one for their own life (these systems are just good engineering; using them yourself beats prescribing them). Run both for two weeks before adding anything. The classic failure mode of this chapter is installing all ten systems in one inspired weekend and abandoning the wreckage by Thursday — that's Chapter 3's novelty curve, and the counter-move is boring, deliberate one-at-a-time.

??? question "Check yourself: 'I bought her a beautiful planner and she used it for nine days. She just won't stick to anything.' Diagnose with this chapter. Click to check."
    Several mechanisms, no character required. (1) The planner was likely *given*, not co-built — imposed systems become laminated nags. (2) A planner is five systems in one (capture, lists, calendar, breakdown, review) — installed all at once, the classic collapse pattern the chapter warns about. (3) Paper planners must be *remembered-to-be-checked* — they die by the exact prospective-memory failure they're meant to fix, unless placed in a forced sightline or paired with an alarm. (4) Nine days is the novelty curve expiring on schedule; the fix is anchoring the check to an existing habit (stack: after coffee, open planner), not re-motivating. (5) A collapsed system gets rebuilt *shrunk* — maybe just the today-list on the lock screen — not re-imposed whole. And the "won't stick to anything" framing is Chapter 1's willpower myth; nine days of use is evidence of effort meeting an unengineered tool.

## What to Carry Out of This Chapter

For the reader with ADHD:

- If it matters, it doesn't live in your head. Capture at the moment of arrival, alarm at the moment of promising.
- Stalled means the next action is undefined or too big. Name the ninety-second version and split anything still scary.
- Start one system, anchored to an existing habit, and expect to rebuild it smaller after it collapses. Rebuilding is the skill.

For the reader who loves someone with ADHD:

- Build systems *with*, never *for* — and use a few yourself; shared infrastructure beats prescribed infrastructure.
- Your presence is a tool: body doubling helps, foreman mode cancels it. Sit nearby with your own book.
- When a system collapses, the useful sentence is "want to restart the small version together?" — not an audit of day nine.

Chapter 10 extends the toolkit into planners, calendars, apps, and the maintenance question nobody warns you about: what to do when every system you build eventually stops working — and why that's normal.
