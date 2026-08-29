# Mascot Test Page

A rendering check for Bhindi, this book's learning mascot. Every admonition
style appears below with its pose. If a pose shows a white or checkered box
behind it, its alpha channel is broken and the image needs regenerating.

Character rules and placement limits are in
[Bhindi's character sheet](../img/mascot/character-sheet.md).

## The seven poses

!!! mascot-welcome "Welcome"

    ![Bhindi waving](../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Chapter openings, at most one per chapter. Bhindi says hello and gets out of
    the way.

!!! mascot-thinking "Something worth pausing on"

    ![Bhindi thinking](../img/mascot/thinking.png){ class="mascot-admonition-img" }
    A key concept that repays a second read. Used sparingly — if everything is
    marked important, nothing is.

!!! mascot-tip "A tip"

    ![Bhindi pointing](../img/mascot/tip.png){ class="mascot-admonition-img" }
    A concrete, actionable hint the reader could use today. Never a restatement
    of the paragraph above it.

!!! mascot-warning "A common misreading"

    ![Bhindi cautioning](../img/mascot/warning.png){ class="mascot-admonition-img" }
    A mistake families reliably make. Cautionary, never scolding, and never
    used for medical danger — that material stays plain.

!!! mascot-encourage "This part is hard"

    ![Bhindi encouraging](../img/mascot/encouraging.png){ class="mascot-admonition-img" }
    Genuinely difficult material. This is the pose for hard-but-not-raw
    content; anything rawer gets no mascot at all.

!!! mascot-celebration "You got through it"

    ![Bhindi celebrating](../img/mascot/celebration.png){ class="mascot-admonition-img" }
    Chapter close, at most one per chapter. The dark background is deliberate —
    pale highlights in celebration art vanish against light panels.

!!! mascot-neutral "General purpose"

    ![Bhindi sitting](../img/mascot/neutral.png){ class="mascot-admonition-img" }
    The default pose, and the source image for the site favicon.

## Collapsible variant

Every style also works on a `???` block, so a mascot aside can be folded away.

??? mascot-tip "Click to open a folded tip"

    ![Bhindi pointing](../img/mascot/tip.png){ class="mascot-admonition-img" }
    Folded asides are useful where a tip would otherwise interrupt a run of
    argument.

## Transparency check

Each pose below sits on a saturated background. Any visible rectangle means a
broken alpha channel.

<div style="background:#00695c;padding:14px;border-radius:6px;display:flex;gap:10px;flex-wrap:wrap" markdown>
![neutral](../img/mascot/neutral.png){ width="86" }
![welcome](../img/mascot/welcome.png){ width="86" }
![thinking](../img/mascot/thinking.png){ width="86" }
![tip](../img/mascot/tip.png){ width="86" }
![warning](../img/mascot/warning.png){ width="86" }
![encouraging](../img/mascot/encouraging.png){ width="86" }
![celebration](../img/mascot/celebration.png){ width="86" }
</div>

## Placement limits

Taken from [the character sheet](../img/mascot/character-sheet.md), which is
canonical:

- No more than **six** mascot admonitions in a chapter, and fewer is better
- One `welcome` and one `celebration` per chapter, maximum
- Never two mascot admonitions back to back — at least one paragraph between
- Never decorative: every appearance carries a message worth reading
- **Never** beside crisis guidance, grief, shame, or caregiver-burnout material
