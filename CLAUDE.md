# gw2lfg.net

A static site that shows when Guild Wars 2 community events run, converted to
each visitor's local time. Hosted on GitHub Pages at <https://www.gw2lfg.net>,
deployed by pushing to `main`.

No build step, no dependencies, no framework. Open `index.html` and it works.
Keep it that way — the site the browser loads is four files plus two images,
and that simplicity is the point, not an accident.

## The one rule that matters

**Every time in `events.js` is UTC.** Nothing in the file says so, and getting
it wrong silently shifts events for every visitor. `script.js` converts to the
viewer's local time (or leaves it in UTC when the UTC toggle is on) at render
time. Never store a local time.

Days are UTC days too. An event at `{ day: "Saturday", time: "02:00" }` shows
up on *Friday* evening for North American visitors, and that is correct.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page structure. Static shell — the script fills everything in. |
| `events.js` | The event data. Source of truth for both the site and `EVENTS.md`. |
| `script.js` | All behaviour: time conversion, schedule, timeline, Discord feed. |
| `style.css` | All styling, including the schedule panel that used to be images. |
| `EVENTS.md` | **Generated.** Human-readable event register. Do not hand-edit. |
| `tools/build-events-doc.js` | Generates `EVENTS.md` from `events.js`. |

The Discord feed is fetched at runtime from the Railway URL in `script.js` and
has no local copy. Committed snapshots were tried early on and removed: a stale
file is worse than nothing here, because the panel labels whatever it renders
"Live", and this site exists to say what is happening *now*. If the fetch
fails, the panel says so and keeps the last good data it had this session.

## Adding or changing an event

1. Edit `events.js`. Times are UTC. Set `lastVerified` to today's date in
   `YYYY-MM-DD` form, or `null` if it has not been checked. Set `guild` to the
   guild tag with no brackets (`"LEG"`, not `"[LEG]"`), or `null` when the
   event is not run by a guild — the document adds the brackets.
2. Regenerate the document:

   ```bash
   node tools/build-events-doc.js
   ```

3. Bump the cache-busting version in `index.html` (see below).

Never edit `EVENTS.md` directly — the next generation overwrites it. It exists
so a person can scan the schedule and see what needs re-checking; `events.js`
is where changes are made.

### Rebuilding the register

One command, from the project root:

```bash
node tools/build-events-doc.js
```

`tools/hooks/pre-commit` runs it automatically whenever `events.js` is part of
a commit, and stages the result. Install it once per clone:

```bash
cp tools/hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

The hook is deliberately scoped to `events.js`. `EVENTS.md` embeds today's
date and the days-since-verified counters, so rebuilding on *every* commit
would rewrite it during unrelated work and fill the history with date churn.

The hook keeps the document in step with the data; it does not keep the dates
fresh. Nothing fires if `events.js` is untouched, so a register left alone for
months still shows months-old ages until someone rebuilds it by hand. Run the
command occasionally for that.

### How "Missing information" is decided

An event appears there when it has a non-empty `needsInfo` array, and each
entry is printed as written. The generator also adds one automatically when
`username` is not in `Name.1234` form, since that means a character name was
recorded instead of a GW2 account — unless the event's own `needsInfo` already
mentions the account, so the two do not duplicate each other.

Remove an entry once it is answered; the event drops off the list when the
array is empty.

`guild: null` alone does **not** mean the guild is missing — plenty of events
are genuinely run by an individual or a Discord community rather than a guild.
The two cases are told apart by `needsInfo`:

| | meaning |
| --- | --- |
| `guild: null`, no `needsInfo` | checked; this event has no guild |
| `guild: null` + `"guild tag"` in `needsInfo` | we have not found out yet |

So do not auto-flag every null guild. Add the `needsInfo` line when the guild
is unknown, and leave it off once you have confirmed there isn't one — as with
the EU Triple Trouble, which is run by a Discord server.

### How "Needs checking" is decided

`staleAfterDays` at the top of the generator is the threshold — currently 90.
An event is listed when `lastVerified` is `null`, unparseable, or that many
days old or more.

Two properties worth remembering:

- The clock runs from `lastVerified`, not from when the entry was last edited.
  Changing an event's time does not reset it; only setting the date does.
- Staleness is evaluated at generation time, not continuously. An event that
  crosses the threshold appears only at the next rebuild.

### Naming

Name an event after the content, and do not append a redundant "Meta".

- One map or encounter — just its name: `Gyala Delve`, `Dragon's End`,
  `Triple Trouble`, `Drizzlewood Coast`, `Twisted Marionette`.
  Not `Gyala Delve Meta`, not `Drizzlewood Coast Meta`.
- A train across several maps — keep the words that say so:
  `HoT Meta Train`, `EoD Meta Train`, `Core Meta Train`, `Hero Point Train`.
- Convergences take their expansion as a prefix: `SotO Convergence CMs`,
  `JW Convergence CMs`, `VoE Convergence CMs`.
- "Meta" only earns a place when it distinguishes something, as in
  `Bava Nisos Farm & Meta`, which is a farm before reset and a meta after.

**Reuse an existing name when the content is the same.** Several hosts run the
same content, and the register groups by name — inventing a variant spelling
splits one activity into two rows. Check the existing names first:

```bash
node -e "const e=new Function(require('fs').readFileSync('events.js','utf8')+'; return events;')(); console.log([...new Set(e.map(x=>x.name))].sort().join('\n'))"
```

Discord event titles do not follow this convention, so titles taken from
screenshots usually need trimming — "Gyala Delve Meta @ Daily" is the event
`Gyala Delve`, running daily.

An event's shape:

```js
{
  name: "HoT Meta Train",
  region: "NA",                 // "NA" or "EU"
  username: "Lamshire.3058",    // the GW2 account hosting it
  guild: "LEG",                 // guild tag WITHOUT brackets, or null
  description: "Hosted by [LEG]! Tangled Depths -> Auric Basin -> ...",
  recurring: true,
  lastVerified: "2026-08-31",   // or null if never checked
  needsInfo: [                  // optional; omit when nothing is outstanding
    "guild tag"
  ],
  schedule: [
    { day: "Monday", time: "02:00" }   // UTC day, UTC 24-hour time
  ]
}
```

`recurring: false` is handled by `script.js` (it reads `date` + `time` instead
of `schedule`), but no event currently uses it.

## Cache busting

`index.html` loads its assets with a `?v=N` query string:

```html
<link rel="stylesheet" href="style.css?v=N" />
<script src="events.js?v=N"></script>
<script src="script.js?v=N"></script>
```

Check what `N` currently is rather than assuming — this note would go stale
otherwise:

```bash
grep -o '?v=[0-9]*' index.html | sort -u
```

**Bump all three together on every deploy.** They are maintained by hand, so
they drift the moment one is forgotten — and the failure is invisible to you
and visible to everyone else, who keep getting the old file.

## Layout conventions

- **Breakpoints** are 1500 / 1100 / 900 / 700px. 700px is the important one:
  below it the schedule day rail becomes a horizontal week strip, event cards
  become a vertical list, and the UTC clock stops floating.
- **Never give the schedule a fixed aspect ratio again.** It used to be pinned
  to `960/700` so it lined up with a background image, and that clipped two
  thirds of the events on phones with no way to scroll to them. The panel is
  CSS now and sizes to its content.
- **Colour flows through custom properties as RGB triples**, so alpha can be
  mixed without `color-mix()`:

  ```css
  --day-accent-rgb: 74 159 240;
  background: rgb(var(--day-accent-rgb) / 0.16);
  ```

  Each day button sets its own `--day-accent-rgb`; `.schedule-frame` also
  carries the selected day's class, so the panel and everything inside it pick
  the colour up by inheritance. Event cards use `--event-accent-rgb`, set by a
  `.time-*` class for the part of day they fall in.
- **`position: fixed` does not escape the timeline.** `.timeline-pin` has a
  `transform` and `.timeline-card` a `backdrop-filter`, and either one makes a
  fixed descendant resolve against that ancestor instead of the viewport.
  Tooltips are positioned by script relative to the card instead.
- **A class selector outranks `[hidden]`.** Anything given `display: grid` or
  `flex` needs an explicit `[hidden] { display: none }` companion rule, or the
  `hidden` attribute silently does nothing.

## Behaviour worth knowing

- The schedule follows the current day until the visitor picks another; after
  that the pinned day stays put, but the "today" arrow still tracks the real
  day across midnight.
- The now bar (last started / next up) only appears when the day in view *is*
  today. Simultaneous events are grouped, so both show rather than one being
  picked arbitrarily — about a quarter of NA entries share a start time.
- `updateScheduleNowState()` only toggles classes and rewrites text. Do not
  call `renderScheduleEvents()` on a timer: it rebuilds the cards, which closes
  any open popover and resets the horizontal scroll.
- Timeline tooltips open on hover, on `:focus-visible`, and on click. The click
  path exists because touch devices have no hover and browsers withhold
  `:focus-visible` from taps.
- A tooltip covering several events is tall, so `placeTimelineTooltip()` picks
  a direction as it appears: upward by default, downward only when it does not
  fit above *and* there is more room below. Comparing both sides matters —
  flipping to a tighter side just moves the clipping to the other end.
- All three timers skip their work while `document.hidden`, and catch up on
  `visibilitychange`. Without that, a tab left open polls the Discord feed
  2,880 times a day for nobody.

## Testing

There are no automated tests. Verify changes in a browser at several widths —
320, 375, 768 and 1440 are the useful ones. The recurring things to check:

- No element extends past the viewport, and the page never scrolls sideways.
- Every event for the selected day is reachable.
- The schedule and timeline agree with each other in both Local and UTC modes.
- Timeline tooltips, at several scroll positions. Fitting on screen is not the
  same as being visible: check what is actually painted on top, not just the
  bounding box. A tooltip once passed a geometry check while rendering behind
  the schedule panel.

`elementFromPoint` is the way to check that, but the tooltip sets
`pointer-events: none`, so hit-testing skips it and always reports whatever is
underneath. Override it for the duration of the check or the result is
meaningless:

```js
// in devtools, before probing
document.head.insertAdjacentHTML("beforeend",
  "<style>.timeline-pin-tooltip{pointer-events:auto !important}</style>");
```

To serve locally:

```bash
npx --yes http-server . -p 8137 -c-1
```
