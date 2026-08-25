---
title: Attention Spotlight Simulator
description: Steer an attention spotlight, hold it on a boring target task, resist capture by pulsing distractors, and feel what each attention skill costs.
---
# Attention Spotlight Simulator

<iframe src="main.html" height="482px" scrolling="no"></iframe>

[Run the Attention Spotlight Simulator Fullscreen](./main.html){ .md-button .md-button--primary }

Place the following line in your website to include this MicroSim in your course:

```html
<iframe src="https://arunbatchu.github.io/adhd/sims/attention-spotlight-simulator/main.html" height="482px" scrolling="no"></iframe>
```

## Description

This MicroSim puts you in the operator's seat of the attention spotlight from
[Chapter 1](../../chapters/01-what-adhd-is/index.md). Your mouse steers the
beam. The task is simple and boring on purpose: keep the beam on the
green-ringed target ("The form") for sixty seconds while distractors — the
phone, the TV, chatter — pulse and try to grab it. When a pulsing distractor
captures the beam, it sticks for two seconds before you can pull away, and a
caption names what happened.

The controls model the chapter's vocabulary directly:

- **Time on target** measures *sustaining* attention
- **Captures** measure *resisting capture*
- **Task switch mode** moves the target every fifteen seconds and measures your *shift cost*
- The **Distraction slider** raises the environment's load — same task, same effort, harder steering

Raising the distraction level models what a higher-ADHD-load environment feels
like: the task never changed, but holding it got harder.

## Lesson Plan

1. **Predict** (2 min): Before running, have learners guess their time-on-target percentage at distraction level 5.
2. **Run** (2 min): One 60-second session at level 5. Compare the result to the prediction.
3. **Manipulate** (3 min): Repeat at distraction 0 and distraction 10. Discuss: what changed — the person, or the environment?
4. **Extend** (3 min): Turn on task switch mode. Discuss why the moments after each switch feel expensive, and connect to transition struggles at home.
5. **Debrief** (2 min): Map each on-screen number to the chapter's skill names: sustaining, resisting capture, shifting.

## References

- [Chapter 1: What ADHD Is And Is Not](../../chapters/01-what-adhd-is/index.md) — the attention skills this simulation demonstrates
- [p5.js Reference](https://p5js.org/reference/)
