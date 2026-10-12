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
file is worse than nothing here, and this site exists to say what is happening
*now*. If the fetch fails, the panel says so and keeps the last good data it
had this session.

The panel makes **no freshness claim of its own** — there is deliberately no
"Live" badge. The page cannot stand behind that word, because the bot can
stall while the endpoint keeps serving its last good file. Reporting an age
instead was tried and cried wolf on ordinary quiet nights. Every message
carries its own date and time, so a reader can judge for themselves. Do not
reintroduce a badge that asserts the feed is current.

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
- Every convergence is `Convergence CMs`, with **no expansion prefix**. Not
  `SotO Convergence CMs`, not `JW Convergence CMs`, not `VoE Convergence CMs`.
  Hosts rotate which convergence they run from week to week, so the prefix
  recorded a detail that was not stable and split one activity across four
  names. The expansion stays out of the name; put it in `description` if it
  is genuinely fixed for that host.
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

### Descriptions

Write them in the owner's format, which was chosen deliberately: the first
batch named guilds in full ("Hosted by Firebranders [FB]") and every one was
cut back to the tag a few days later.

- Open with `Hosted by [TAG]!` — the tag only, never the guild's full name,
  and always the `!`. Most descriptions stop there.
- Add at most one short fragment after it, with no full stop:
  `Hosted by [FB]! Metas from every expansion`.
- Routes put ` -> ` between stops, and `&` stands in for "and".
- An event with no guild gets a plain fragment instead, as with Oregon's
  `Seitung Province -> Kaineng City -> ...`. Use `Hosted by Name!` only for a
  named organisation or leader, as with `Hosted by Convergence Corp!`.
- Leave out what the site already shows or what only matters to us: start
  times and offsets (the card shows the time in the visitor's own zone),
  days, and where the event is announced.

Do keep what a visitor needs before joining — a requirement such as
`Requires EoD & Jade Bot mastery`, or a host's warning that the time moves,
in the owner's own phrase `Times subject to change!`.

### One entry per host, not one per run

When a host runs the same event on several days, that is **one** event with
several entries in `schedule` — not one event object per day. Both render the
same on the site, but the register prints a row per object, so splitting them
puts two identical-looking rows next to each other and makes a single activity
look like a duplicate.

Two entries with the same `name`, `guild`, `username` and `region` are almost
always this mistake. The check:

```bash
node -e "const e=new Function(require('fs').readFileSync('events.js','utf8')+'; return events;')(); const m=new Map(); e.forEach(x=>{const k=[x.name,x.guild,x.username,x.region].join('|'); m.set(k,(m.get(k)||0)+1)}); console.log([...m].filter(([,n])=>n>1).map(([k,n])=>n+'x  '+k).join('\n')||'none')"
```

Same host, same time, **different region** is the exception — `region` holds
one value, so listing an event for both audiences needs an object each. The
`[Wing]` Griffon Flight Training at Monday 18:30 is NA and EU deliberately.

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
- **`backdrop-filter` carries the panels.** They are translucent over a busy
  background image, and the blur is what turns that image into a smooth wash.
  `-webkit-backdrop-filter` accompanies every declaration, because Safari
  needed the prefix until 18.

## Colour-rewriting extensions

Three defences, added after the episode below.

`index.html` carries `<meta name="darkreader-lock">`, which asks Dark Reader
not to process the page at all. That is the real fix — the panels are
translucent over a background image and Dark Reader turns them unreadable.
Do not remove it. Any site may use the lock; the "site must already be dark"
rules in Dark Reader's docs apply to its built-in list of dark sites, not to
the tag.

`style.css` sets `color-scheme: only light` on `html`, which is Chrome's
documented opt-out from its own automatic dark theme ("darken websites",
mostly on Android). The Dark Reader lock does not reach that, and the notice
below cannot see it either, because the browser recolours at paint time and
the computed colours stay untouched. `only light` changes nothing else — with
no `color-scheme` declared the page already rendered light.

The About blurb also tells visitors in one line to turn dark mode extensions
off for the site, for anyone the notice does not reach.

The lock only covers Dark Reader, so `initializeColourNotice()` in `script.js`
shows a notice when it detects the page being recoloured anyway. It looks for
Dark Reader's own markers (`data-darkreader-mode`, injected `style.darkreader`)
and, for extensions that leave none, reads back `.colour-probe` — one pixel of
a known colour. If what comes back is not what the stylesheet set, something
is rewriting colours. Windows High Contrast is deliberately excluded via
`forced-colors`, since that is the reader's own choice rather than a fault.

The notice is the one solid surface on the site: no alpha, no backdrop-filter,
dark text on a light amber ground. It has to stay legible while the very thing
it warns about is recolouring it, so building it like the frosted panels would
defeat the purpose. It is dismissible and the choice is remembered.

## Before believing a "the site looks wrong" report

One user's page looked washed out with the artwork showing through the
schedule panel. Two fixes went out on the theory that `backdrop-filter` was
not painting for them. It turned out they were running **Dark Reader**, which
rewrites a page's colours wholesale and mangles translucent panels.

The tell was in their screenshot and got missed: the *artwork itself* was
recoloured, and so were the nav buttons and toggles. No failure of one CSS
property can do that — only something transforming the whole page.

So before changing any CSS for a report like this, establish:

- Which browser and version, and **what extensions** — Dark Reader, Stylus,
  and colour-vision filters all rewrite pages.
- Does it still happen in a **private window**, where extensions are usually
  disabled? This one question settles most of these in seconds.
- Is it one machine or several? One machine points at that machine.

Reproduce it locally before editing anything. Two speculative fixes reached
production here because none of the above was asked first.

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
