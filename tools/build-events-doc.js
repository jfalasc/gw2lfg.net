/*
 * Builds EVENTS.md from events.js.
 *
 *   node tools/build-events-doc.js
 *
 * events.js is the single source of truth. EVENTS.md is a generated view of
 * it, so the two can never disagree — add an event in one place, regenerate,
 * and it appears in both. Record a check by setting lastVerified on the event.
 */

const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");
const eventsPath = path.join(projectRoot, "events.js");
const outputPath = path.join(projectRoot, "EVENTS.md");

/* An event unchecked for this long is called out at the top of the document. */
const staleAfterDays = 90;

const dayOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const shortDay = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun"
};

function loadEvents() {
  const source = fs.readFileSync(eventsPath, "utf8");
  // events.js is a plain script that declares `events`, not a module.
  return new Function(`${source}; return events;`)();
}

function formatToday() {
  return new Date().toISOString().slice(0, 10);
}

function daysSince(dateText) {
  const then = new Date(`${dateText}T00:00:00Z`);

  if (Number.isNaN(then.getTime())) {
    return null;
  }

  return Math.floor((Date.now() - then.getTime()) / 86400000);
}

/* "Mon, Tue, Thu 02:00" — or several groups when the times differ. */
function formatSchedule(schedule) {
  if (!Array.isArray(schedule) || schedule.length === 0) {
    return "_no times set_";
  }

  const byTime = new Map();

  schedule.forEach((entry) => {
    if (!byTime.has(entry.time)) {
      byTime.set(entry.time, []);
    }

    byTime.get(entry.time).push(entry.day);
  });

  return Array.from(byTime.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([time, days]) => {
      const ordered = dayOrder.filter((day) => days.includes(day));
      const label = ordered.length === 7
        ? "Daily"
        : ordered.map((day) => shortDay[day]).join(", ");

      return `${label} ${time}`;
    })
    .join(" · ");
}

function formatVerified(event) {
  if (!event.lastVerified) {
    return "**never**";
  }

  const age = daysSince(event.lastVerified);

  if (age === null) {
    return `\`${event.lastVerified}\` _(unreadable date)_`;
  }

  if (age >= staleAfterDays) {
    return `${event.lastVerified} **(${age}d)**`;
  }

  return `${event.lastVerified} (${age}d)`;
}

function needsChecking(event) {
  if (!event.lastVerified) {
    return true;
  }

  const age = daysSince(event.lastVerified);
  return age === null || age >= staleAfterDays;
}

function escapeCell(text) {
  return String(text == null ? "" : text).replace(/\|/g, "\\|").trim();
}

/* Guild tags are stored bare, so the brackets go on for display. */
function formatGuild(event) {
  return event.guild ? `\`[${escapeCell(event.guild)}]\`` : "—";
}

/* Keeps a guild's events together — one guild can then be checked in one go.
   Tags are compared case-insensitively so "uLT" sits with the U's, and events
   run by no guild collect at the end rather than sorting under a dash. */
function byGuildThenName(a, b) {
  const guildA = a.guild || "";
  const guildB = b.guild || "";

  if (Boolean(guildA) !== Boolean(guildB)) {
    return guildA ? -1 : 1;
  }

  return (
    guildA.localeCompare(guildB, "en", { sensitivity: "base" }) ||
    a.name.localeCompare(b.name) ||
    a.username.localeCompare(b.username)
  );
}

function buildRegionTable(events) {
  const lines = [
    "| Event | Guild | Host | Runs (UTC) | Last verified |",
    "| --- | --- | --- | --- | --- |"
  ];

  events
    .slice()
    .sort(byGuildThenName)
    .forEach((event) => {
      lines.push(
        `| ${escapeCell(event.name)} ` +
        `| ${formatGuild(event)} ` +
        `| ${escapeCell(event.username)} ` +
        `| ${formatSchedule(event.schedule)} ` +
        `| ${formatVerified(event)} |`
      );
    });

  return lines.join("\n");
}

function buildByDay(events) {
  const lines = [];

  dayOrder.forEach((day) => {
    const slots = [];

    events.forEach((event) => {
      (event.schedule || []).forEach((entry) => {
        if (entry.day === day) {
          slots.push({ time: entry.time, event });
        }
      });
    });

    if (slots.length === 0) {
      return;
    }

    slots.sort((a, b) =>
      a.time.localeCompare(b.time) || a.event.name.localeCompare(b.event.name));

    lines.push(`### ${day}`, "");

    slots.forEach((slot) => {
      lines.push(
        `- \`${slot.time}\` **${slot.event.name}** ` +
        (slot.event.guild ? `\`[${slot.event.guild}]\` ` : "") +
        `— ${slot.event.username} (${slot.event.region})`
      );
    });

    lines.push("");
  });

  return lines.join("\n");
}

function buildDocument(events) {
  const regions = Array.from(new Set(events.map((event) => event.region))).sort();
  const slotCount = events.reduce(
    (total, event) => total + (event.schedule || []).length,
    0
  );
  const stale = events.filter(needsChecking);

  const lines = [
    "# GW2 LFG — Event Register",
    "",
    `Generated ${formatToday()} · **${events.length} events** · ` +
    `${slotCount} weekly time slots · ` +
    regions
      .map((region) =>
        `${events.filter((event) => event.region === region).length} ${region}`)
      .join(" / "),
    "",
    "> ## ⚠️ Do not edit this file",
    ">",
    "> It is rebuilt from scratch every time, so anything you type here is",
    "> thrown away. The real list is [`events.js`](events.js) — edit that.",
    "",
    "## How this file works",
    "",
    "### To rebuild this file, run this one command",
    "",
    "From the project folder:",
    "",
    "```bash",
    "node tools/build-events-doc.js",
    "```",
    "",
    "That is the whole thing. It takes under a second and prints how many events",
    "it found. **You do not have to remember it when committing** — a pre-commit",
    "hook runs it for you whenever `events.js` is part of a commit. Run it by",
    "hand when you want the day counts below refreshed without having changed",
    "any events.",
    "",
    "### To record that an event is still running",
    "",
    "Find it in `events.js` and set today's date:",
    "",
    "```js",
    `lastVerified: "${formatToday()}",`,
    "```",
    "",
    "### To add or change an event",
    "",
    "Edit `events.js`. **Every time and day in it is UTC** — the site converts",
    "to each visitor's local time in the browser. All times shown in this",
    "document are UTC too.",
    "",
    `### What "Needs checking" means`,
    "",
    "An event appears in that list when **any** of these is true:",
    "",
    "- `lastVerified` is `null` — it has never been checked. Shows as **never**.",
    `- It was last checked **${staleAfterDays} or more days ago**. The age is ` +
    "shown in bold, like `2026-05-12 **(111d)**`.",
    "- Its date cannot be read, such as a typo like `2026-13-45`.",
    "",
    `Two things to know about the ${staleAfterDays}-day clock:`,
    "",
    "1. It counts from `lastVerified`, **not** from when you last edited the",
    "   event. Changing an event's time does not reset it — only confirming",
    "   the event still runs does, by setting the date.",
    "2. It is worked out **when this file is rebuilt**, not continuously. An",
    `   event that quietly passes ${staleAfterDays} days will not appear in`,
    "   the list until the next rebuild. That is why running the command now",
    "   and then matters even when nothing has changed.",
    "",
    "Every row shows its age, so you can see something approaching the",
    "threshold before it crosses.",
    "",
    "---",
    ""
  ];

  lines.push(
    `## Needs checking (${stale.length})`,
    "",
    `Never verified, or last verified ${staleAfterDays}+ days ago.`,
    ""
  );

  if (stale.length === 0) {
    lines.push("_Nothing outstanding — every event has been checked recently._", "");
  } else {
    lines.push(
      "| Event | Guild | Host | Region | Runs (UTC) | Last verified |",
      "| --- | --- | --- | --- | --- | --- |"
    );

    stale
      .slice()
      .sort(byGuildThenName)
      .forEach((event) => {
        lines.push(
          `| ${escapeCell(event.name)} ` +
          `| ${formatGuild(event)} ` +
          `| ${escapeCell(event.username)} ` +
          `| ${escapeCell(event.region)} ` +
          `| ${formatSchedule(event.schedule)} ` +
          `| ${formatVerified(event)} |`
        );
      });

    lines.push(
      "",
      "To record a check, set `lastVerified` on that event in `events.js`:",
      "",
      "```js",
      `lastVerified: "${formatToday()}",`,
      "```",
      ""
    );
  }

  lines.push("---", "");

  regions.forEach((region) => {
    const regionEvents = events.filter((event) => event.region === region);

    lines.push(
      `## ${region} events (${regionEvents.length})`,
      "",
      buildRegionTable(regionEvents),
      ""
    );
  });

  lines.push(
    "---",
    "",
    "## Weekly schedule (UTC)",
    "",
    "Every run, in order, so a new event can be checked against the existing",
    "slots before it is added.",
    "",
    buildByDay(events)
  );

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}

function main() {
  const events = loadEvents();

  if (!Array.isArray(events) || events.length === 0) {
    throw new Error("events.js did not yield a non-empty events array.");
  }

  fs.writeFileSync(outputPath, buildDocument(events), "utf8");

  const stale = events.filter(needsChecking).length;
  console.log(
    `EVENTS.md written — ${events.length} events, ${stale} needing a check.`
  );
}

main();
