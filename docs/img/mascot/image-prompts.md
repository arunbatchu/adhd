# Bhindi — Image Generation Prompts

These generated the seven poses in this directory, using OpenAI `gpt-image-2`
at 1024x1024 with `background: transparent`. Each prompt is self-contained —
the full character description is repeated every time, so poses can be
regenerated one at a time without drifting.

Generated 2026-08-29. The working script is `scripts/generate-mascot.py`.

## Base character description

Included verbatim at the start of every pose prompt:

```
A friendly cartoon mascot cat named Bhindi for an educational book.  Bhindi is a domestic shorthair mix with soft bluish-grey fur, a slightly  paler chest and muzzle, and large round warm yellow eyes. Gentle, kind,  calm expression - a caring companion, never mischievous or manic.  Simple flat vector illustration, clean bold outlines, soft rounded shapes,  friendly and modern children's-book style, minimal shading.  Full body, sitting or standing, facing the viewer.  Consistent character design across all images.  Isolated on a fully transparent background, no scene, no ground shadow,  no text, no border, no frame.
```

## Pose prompts

### neutral.png

```
A friendly cartoon mascot cat named Bhindi for an educational book.  Bhindi is a domestic shorthair mix with soft bluish-grey fur, a slightly  paler chest and muzzle, and large round warm yellow eyes. Gentle, kind,  calm expression - a caring companion, never mischievous or manic.  Simple flat vector illustration, clean bold outlines, soft rounded shapes,  friendly and modern children's-book style, minimal shading.  Full body, sitting or standing, facing the viewer.  Consistent character design across all images.  Isolated on a fully transparent background, no scene, no ground shadow,  no text, no border, no frame.

Pose: Bhindi sitting calmly and upright, tail curled around her paws, looking at the viewer with a soft, steady, reassuring expression.
```

### welcome.png

```
A friendly cartoon mascot cat named Bhindi for an educational book.  Bhindi is a domestic shorthair mix with soft bluish-grey fur, a slightly  paler chest and muzzle, and large round warm yellow eyes. Gentle, kind,  calm expression - a caring companion, never mischievous or manic.  Simple flat vector illustration, clean bold outlines, soft rounded shapes,  friendly and modern children's-book style, minimal shading.  Full body, sitting or standing, facing the viewer.  Consistent character design across all images.  Isolated on a fully transparent background, no scene, no ground shadow,  no text, no border, no frame.

Pose: Bhindi standing, one front paw raised in a friendly small wave, head tilted slightly, warm welcoming smile.
```

### thinking.png

```
A friendly cartoon mascot cat named Bhindi for an educational book.  Bhindi is a domestic shorthair mix with soft bluish-grey fur, a slightly  paler chest and muzzle, and large round warm yellow eyes. Gentle, kind,  calm expression - a caring companion, never mischievous or manic.  Simple flat vector illustration, clean bold outlines, soft rounded shapes,  friendly and modern children's-book style, minimal shading.  Full body, sitting or standing, facing the viewer.  Consistent character design across all images.  Isolated on a fully transparent background, no scene, no ground shadow,  no text, no border, no frame.

Pose: Bhindi sitting, one paw resting thoughtfully against her cheek, eyes looking upward and slightly to the side, curious and considering.
```

### tip.png

```
A friendly cartoon mascot cat named Bhindi for an educational book.  Bhindi is a domestic shorthair mix with soft bluish-grey fur, a slightly  paler chest and muzzle, and large round warm yellow eyes. Gentle, kind,  calm expression - a caring companion, never mischievous or manic.  Simple flat vector illustration, clean bold outlines, soft rounded shapes,  friendly and modern children's-book style, minimal shading.  Full body, sitting or standing, facing the viewer.  Consistent character design across all images.  Isolated on a fully transparent background, no scene, no ground shadow,  no text, no border, no frame.

Pose: Bhindi sitting upright and alert, one paw raised with index-toe pointing gently upward as if offering a helpful idea, bright attentive eyes.
```

### warning.png

```
A friendly cartoon mascot cat named Bhindi for an educational book.  Bhindi is a domestic shorthair mix with soft bluish-grey fur, a slightly  paler chest and muzzle, and large round warm yellow eyes. Gentle, kind,  calm expression - a caring companion, never mischievous or manic.  Simple flat vector illustration, clean bold outlines, soft rounded shapes,  friendly and modern children's-book style, minimal shading.  Full body, sitting or standing, facing the viewer.  Consistent character design across all images.  Isolated on a fully transparent background, no scene, no ground shadow,  no text, no border, no frame.

Pose: Bhindi sitting upright, both front paws raised in a soft calming gesture, ears slightly back, gently cautionary but never frightening or angry.
```

### encouraging.png

```
A friendly cartoon mascot cat named Bhindi for an educational book.  Bhindi is a domestic shorthair mix with soft bluish-grey fur, a slightly  paler chest and muzzle, and large round warm yellow eyes. Gentle, kind,  calm expression - a caring companion, never mischievous or manic.  Simple flat vector illustration, clean bold outlines, soft rounded shapes,  friendly and modern children's-book style, minimal shading.  Full body, sitting or standing, facing the viewer.  Consistent character design across all images.  Isolated on a fully transparent background, no scene, no ground shadow,  no text, no border, no frame.

Pose: Bhindi leaning slightly forward, one paw extended toward the viewer in a supportive gesture, kind steady eyes, quietly rooting for you.
```

### celebration.png

```
A friendly cartoon mascot cat named Bhindi for an educational book.  Bhindi is a domestic shorthair mix with soft bluish-grey fur, a slightly  paler chest and muzzle, and large round warm yellow eyes. Gentle, kind,  calm expression - a caring companion, never mischievous or manic.  Simple flat vector illustration, clean bold outlines, soft rounded shapes,  friendly and modern children's-book style, minimal shading.  Full body, sitting or standing, facing the viewer.  Consistent character design across all images.  Isolated on a fully transparent background, no scene, no ground shadow,  no text, no border, no frame.

Pose: Bhindi standing with both front paws raised happily above her head, eyes bright and cheerful, tail up, delighted but gentle - not wild.
```

## Notes

- Do not change the coat colour, eye colour, or art-style clause between poses.
  Character consistency across images matters more than any single image.
- `background: transparent` produces a genuine alpha channel with gpt-image-2;
  all seven came back 59-68% fully transparent. Verify alpha after any
  regeneration rather than assuming it.
- Source images are 1024x1024. They are trimmed to their alpha bounding box,
  squared with 4px padding, and downscaled to 512x512 before committing —
  the mascot renders at 90px, so 512 is ample and keeps the repo light.
