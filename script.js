console.log("GW2 LFG scaffold loaded.");

if (typeof events !== "undefined") {
  console.log(events);
} else {
  console.warn("events.js did not load or 'events' is undefined.");
}

const scheduleDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

const utcDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const timelineTickOffsets = [0, 4, 8, 12, 16, 20, 24];
const timelineWindowHours = 24;
const timelineRefreshMilliseconds = 60 * 1000;

const eventRegions = ["NA", "EU"];
const selectedRegionStorageKey = "gw2LfgSelectedRegion";

let selectedEventRegion = getInitialEventRegion();
let selectedScheduleDay = getCurrentUtcDayName();

function getCurrentUtcDayName() {
  return utcDayNames[new Date().getUTCDay()];
}

function getUtcStartOfToday(referenceDate = new Date()) {
  return new Date(Date.UTC(
    referenceDate.getUTCFullYear(),
    referenceDate.getUTCMonth(),
    referenceDate.getUTCDate()
  ));
}

function getNextOccurrenceOfDay(dayName) {
  const todayUtc = getUtcStartOfToday();
  const currentDayIndex = todayUtc.getUTCDay();
  const targetDayIndex = utcDayNames.indexOf(dayName);

  if (targetDayIndex === -1) {
    return todayUtc;
  }

  const daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7;

  const targetDate = new Date(todayUtc);
  targetDate.setUTCDate(todayUtc.getUTCDate() + daysUntilTarget);

  return targetDate;
}

function formatUtcDateKey(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatUtcDateLabel(date) {
  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatTimelineTimeLabel(date) {
  return date.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function formatTimelineDateLabel(date) {
  return date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric"
  });
}

function normalizeRegion(region) {
  if (typeof region !== "string") {
    return "";
  }

  return region.trim().toUpperCase();
}

function getInitialEventRegion() {
  try {
    const storedRegion = normalizeRegion(localStorage.getItem(selectedRegionStorageKey));

    if (eventRegions.includes(storedRegion)) {
      return storedRegion;
    }
  } catch (error) {
    console.warn("Could not read saved region preference.");
    console.warn(error);
  }

  return "NA";
}

function saveSelectedEventRegion(region) {
  try {
    localStorage.setItem(selectedRegionStorageKey, region);
  } catch (error) {
    console.warn("Could not save region preference.");
    console.warn(error);
  }
}

function setSelectedEventRegion(region) {
  const normalizedRegion = normalizeRegion(region);

  if (!eventRegions.includes(normalizedRegion)) {
    return;
  }

  if (normalizedRegion === selectedEventRegion) {
    return;
  }

  selectedEventRegion = normalizedRegion;
  saveSelectedEventRegion(selectedEventRegion);

  renderRegionToggle();
  renderSchedule();
  renderTimeline();
}

function renderRegionToggle() {
  const regionToggle = document.getElementById("regionToggle");

  if (!regionToggle) {
    return;
  }

  const buttons = regionToggle.querySelectorAll("[data-region]");

  buttons.forEach((button) => {
    const buttonRegion = normalizeRegion(button.dataset.region);
    const isActive = buttonRegion === selectedEventRegion;

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function initializeRegionToggle() {
  const regionToggle = document.getElementById("regionToggle");

  if (!regionToggle) {
    return;
  }

  const buttons = regionToggle.querySelectorAll("[data-region]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setSelectedEventRegion(button.dataset.region);
    });
  });

  renderRegionToggle();
}

function getEventSource() {
  if (typeof events === "undefined" || !Array.isArray(events)) {
    return [];
  }

  return events.filter((event) => {
    return normalizeRegion(event.region) === selectedEventRegion;
  });
}

function parseTimeParts(time24) {
  if (typeof time24 !== "string") {
    return null;
  }

  const match = time24.match(/^(\d{2}):(\d{2})$/);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return { hours, minutes };
}

function parseUtcDateTime(dateKey, time24) {
  if (typeof dateKey !== "string") {
    return null;
  }

  const dateMatch = dateKey.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const timeParts = parseTimeParts(time24);

  if (!dateMatch || !timeParts) {
    return null;
  }

  const year = Number(dateMatch[1]);
  const monthIndex = Number(dateMatch[2]) - 1;
  const day = Number(dateMatch[3]);

  return new Date(Date.UTC(
    year,
    monthIndex,
    day,
    timeParts.hours,
    timeParts.minutes
  ));
}

/* ---------- Schedule ---------- */

function getEventsForScheduleDay(dayName) {
  const targetDate = getNextOccurrenceOfDay(dayName);
  const targetDateKey = formatUtcDateKey(targetDate);
  const matches = [];

  getEventSource().forEach((event) => {
    if (event.recurring === true && Array.isArray(event.schedule)) {
      event.schedule.forEach((entry) => {
        if (entry.day === dayName) {
          matches.push({
            name: event.name,
            region: event.region || "Region TBD",
            username: event.username || event.host || "Unknown player",
            description: event.description || "",
            time: entry.time,
            recurring: true
          });
        }
      });
    }

    if (event.recurring === false && event.date === targetDateKey) {
      matches.push({
        name: event.name,
        region: event.region || "Region TBD",
        username: event.username || event.host || "Unknown player",
        description: event.description || "",
        time: event.time,
        recurring: false
      });
    }
  });

  matches.sort((a, b) => a.time.localeCompare(b.time));

  return {
    targetDate,
    targetDateKey,
    events: matches
  };
}

function formatScheduleTime(time24) {
  return `${time24} UTC`;
}

function renderScheduleDayButtons() {
  const container = document.getElementById("scheduleDayButtons");

  if (!container) {
    return;
  }

  container.replaceChildren();

  const dayClassMap = {
    Monday: "day-mon",
    Tuesday: "day-tues",
    Wednesday: "day-wed",
    Thursday: "day-thurs",
    Friday: "day-fri",
    Saturday: "day-sat",
    Sunday: "day-sun"
  };

  scheduleDays.forEach((day) => {
    const button = document.createElement("button");
    const screenReaderText = document.createElement("span");

    button.type = "button";
    button.className = "schedule-day-button";
    button.classList.add(dayClassMap[day]);
    button.setAttribute("aria-label", `Show ${day} events`);

    screenReaderText.className = "sr-only";
    screenReaderText.textContent = day;

    button.appendChild(screenReaderText);

    if (day === selectedScheduleDay) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      selectedScheduleDay = day;
      renderSchedule();
    });

    container.appendChild(button);
  });
}

function renderScheduleEvents() {
  const selectedDayLabel = document.getElementById("scheduleSelectedDay");
  const selectedDateLabel = document.getElementById("scheduleSelectedDate");
  const selectedDayCount = document.getElementById("scheduleSelectedDayCount");
  const viewport = document.getElementById("scheduleEventsViewport");
  const track = document.getElementById("scheduleEventsTrack");

  if (!selectedDayLabel || !selectedDayCount || !viewport || !track) {
    return;
  }

  const scheduleResult = getEventsForScheduleDay(selectedScheduleDay);
  const targetDate = scheduleResult.targetDate;
  const dayEvents = scheduleResult.events;

  selectedDayLabel.textContent = selectedScheduleDay;

  if (selectedDateLabel) {
    selectedDateLabel.textContent = formatUtcDateLabel(targetDate);
  }

  selectedDayCount.textContent = `${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}`;

  track.replaceChildren();
  viewport.scrollLeft = 0;

  if (dayEvents.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "schedule-empty-state";
    emptyState.textContent = `No ${selectedEventRegion} events scheduled for ${selectedScheduleDay} (${formatUtcDateLabel(targetDate)}).`;
    track.appendChild(emptyState);
    return;
  }

  dayEvents.forEach((event) => {
    const card = document.createElement("article");
    const summary = document.createElement("div");
    const time = document.createElement("div");
    const name = document.createElement("h4");
    const details = document.createElement("div");

    const region = document.createElement("p");
    const regionLabel = document.createElement("strong");

    const postedBy = document.createElement("p");
    const postedByLabel = document.createElement("strong");

    const description = document.createElement("p");
    const descriptionLabel = document.createElement("strong");

    card.className = "schedule-event-card";
    card.setAttribute("tabindex", "0");

    summary.className = "schedule-event-summary";

    time.className = "schedule-event-time";
    time.textContent = formatScheduleTime(event.time);

    name.className = "schedule-event-name";
    name.textContent = event.name;

    details.className = "schedule-event-details";

    region.className = "schedule-event-region";
    regionLabel.textContent = "Region:";
    region.append(regionLabel, ` ${event.region || "Region TBD"}`);

    postedBy.className = "schedule-event-poster";
    postedByLabel.textContent = "Posted by:";
    postedBy.append(postedByLabel, ` ${event.username || "Unknown player"}`);

    description.className = "schedule-event-description";
    descriptionLabel.textContent = "Description:";
    description.append(descriptionLabel, ` ${event.description || "No additional details yet."}`);

    summary.append(time, name);
    details.append(region, postedBy, description);
    card.append(summary, details);
    track.appendChild(card);
  });
}

function renderSchedule() {
  renderScheduleDayButtons();
  renderScheduleEvents();
}

/* ---------- Timeline ---------- */

function getRecurringOccurrenceDate(entry, referenceDate) {
  if (!entry || typeof entry.day !== "string" || typeof entry.time !== "string") {
    return null;
  }

  const targetDayIndex = utcDayNames.indexOf(entry.day);
  const timeParts = parseTimeParts(entry.time);

  if (targetDayIndex === -1 || !timeParts) {
    return null;
  }

  const todayUtc = getUtcStartOfToday(referenceDate);
  const currentDayIndex = todayUtc.getUTCDay();
  const daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7;

  const occurrenceDate = new Date(todayUtc);
  occurrenceDate.setUTCDate(todayUtc.getUTCDate() + daysUntilTarget);
  occurrenceDate.setUTCHours(timeParts.hours, timeParts.minutes, 0, 0);

  if (occurrenceDate < referenceDate) {
    occurrenceDate.setUTCDate(occurrenceDate.getUTCDate() + 7);
  }

  return occurrenceDate;
}

function getTimelineOccurrences(referenceDate = new Date()) {
  const windowStart = referenceDate;
  const windowEnd = new Date(windowStart.getTime() + timelineWindowHours * 60 * 60 * 1000);
  const occurrences = [];

  getEventSource().forEach((event) => {
    if (event.recurring === true && Array.isArray(event.schedule)) {
      event.schedule.forEach((entry) => {
        const occurrenceDate = getRecurringOccurrenceDate(entry, windowStart);

        if (!occurrenceDate) {
          return;
        }

        if (occurrenceDate >= windowStart && occurrenceDate <= windowEnd) {
          occurrences.push({
            name: event.name,
            region: event.region || "Region TBD",
            username: event.username || event.host || "Unknown player",
            description: event.description || "",
            time: entry.time,
            date: formatUtcDateKey(occurrenceDate),
            startsAt: occurrenceDate,
            recurring: true
          });
        }
      });
    }

    if (event.recurring === false) {
      const occurrenceDate = parseUtcDateTime(event.date, event.time);

      if (!occurrenceDate) {
        return;
      }

      if (occurrenceDate >= windowStart && occurrenceDate <= windowEnd) {
        occurrences.push({
          name: event.name,
          region: event.region || "Region TBD",
          username: event.username || event.host || "Unknown player",
          description: event.description || "",
          time: event.time,
          date: event.date,
          startsAt: occurrenceDate,
          recurring: false
        });
      }
    }
  });

  occurrences.sort((a, b) => a.startsAt - b.startsAt);

  return occurrences;
}

function groupTimelineOccurrences(occurrences) {
  const groups = new Map();

  occurrences.forEach((occurrence) => {
    const key = occurrence.startsAt.getTime();

    if (!groups.has(key)) {
      groups.set(key, {
        startsAt: occurrence.startsAt,
        events: []
      });
    }

    groups.get(key).events.push(occurrence);
  });

  return Array.from(groups.values()).sort((a, b) => a.startsAt - b.startsAt);
}

function renderTimelineLabels(referenceDate = new Date()) {
  const labelsContainer = document.getElementById("timelineLabels");

  if (!labelsContainer) {
    return;
  }

  labelsContainer.replaceChildren();

  timelineTickOffsets.forEach((offset) => {
    const labelDate = new Date(referenceDate.getTime() + offset * 60 * 60 * 1000);
    const label = document.createElement("span");
    const main = document.createElement("span");
    const sub = document.createElement("span");
    const leftPercent = (offset / timelineWindowHours) * 100;

    label.className = "timeline-label";
    label.style.left = `${leftPercent}%`;

    main.className = "timeline-label-main";
    sub.className = "timeline-label-sub";

    if (offset === 0) {
      main.textContent = "Now";
      sub.textContent = `${formatTimelineTimeLabel(labelDate)} UTC`;
    } else if (offset === 24) {
      main.textContent = "+24h";
      sub.textContent = `${formatTimelineTimeLabel(labelDate)} UTC`;
    } else {
      main.textContent = `${formatTimelineTimeLabel(labelDate)} UTC`;
      sub.textContent = formatTimelineDateLabel(labelDate);
    }

    label.append(main, sub);
    labelsContainer.appendChild(label);
  });
}

function renderTimelineTicks() {
  const ticksContainer = document.getElementById("timelineTicks");

  if (!ticksContainer) {
    return;
  }

  ticksContainer.replaceChildren();

  timelineTickOffsets.forEach((offset) => {
    const tick = document.createElement("span");
    const leftPercent = (offset / timelineWindowHours) * 100;

    tick.className = "timeline-tick";
    tick.style.left = `${leftPercent}%`;

    ticksContainer.appendChild(tick);
  });
}

function createTimelineTooltip(group) {
  const tooltip = document.createElement("span");
  const timeLine = document.createElement("span");

  tooltip.className = "timeline-pin-tooltip";

  timeLine.className = "timeline-tooltip-time";
  timeLine.textContent = `${formatUtcDateLabel(group.startsAt)} — ${formatTimelineTimeLabel(group.startsAt)} UTC`;
  tooltip.appendChild(timeLine);

  group.events.forEach((event) => {
    const eventBlock = document.createElement("span");
    const eventName = document.createElement("span");

    const eventRegion = document.createElement("span");
    const eventRegionLabel = document.createElement("strong");

    const eventPostedBy = document.createElement("span");
    const eventPostedByLabel = document.createElement("strong");

    const eventDescription = document.createElement("span");
    const eventDescriptionLabel = document.createElement("strong");

    eventBlock.className = "timeline-tooltip-event";

    eventName.className = "timeline-tooltip-name";
    eventName.textContent = event.name;

    eventRegion.className = "timeline-tooltip-meta";
    eventRegionLabel.textContent = "Region:";
    eventRegion.append(eventRegionLabel, ` ${event.region || "Region TBD"}`);

    eventPostedBy.className = "timeline-tooltip-meta";
    eventPostedByLabel.textContent = "Posted by:";
    eventPostedBy.append(eventPostedByLabel, ` ${event.username || "Unknown player"}`);

    eventDescription.className = "timeline-tooltip-meta";
    eventDescriptionLabel.textContent = "Description:";
    eventDescription.append(
      eventDescriptionLabel,
      ` ${event.description || "No additional details yet."}`
    );

    eventBlock.append(eventName, eventRegion, eventPostedBy, eventDescription);
    tooltip.appendChild(eventBlock);
  });

  return tooltip;
}

function renderTimelinePins(referenceDate = new Date()) {
  const pinsContainer = document.getElementById("timelinePins");
  const emptyState = document.getElementById("timelineEmptyState");

  if (!pinsContainer) {
    return;
  }

  const occurrences = getTimelineOccurrences(referenceDate);
  const groupedOccurrences = groupTimelineOccurrences(occurrences);

  pinsContainer.replaceChildren();

  if (emptyState) {
    emptyState.textContent = `No ${selectedEventRegion} events scheduled in the next 24 hours.`;
    emptyState.hidden = groupedOccurrences.length !== 0;
  }

  if (groupedOccurrences.length === 0) {
    return;
  }

  groupedOccurrences.forEach((group) => {
    const pin = document.createElement("button");
    const dot = document.createElement("span");
    const tooltip = createTimelineTooltip(group);

    const hoursFromNow = (group.startsAt.getTime() - referenceDate.getTime()) / (60 * 60 * 1000);
    const leftPercent = Math.max(0, Math.min(100, (hoursFromNow / timelineWindowHours) * 100));

    pin.type = "button";
    pin.className = "timeline-pin";
    pin.style.left = `${leftPercent}%`;

    if (leftPercent < 12) {
      pin.classList.add("near-left-edge");
    }

    if (leftPercent > 88) {
      pin.classList.add("near-right-edge");
    }

    pin.setAttribute(
      "aria-label",
      `${group.events.length === 1 ? group.events[0].name : `${group.events.length} events`} at ${formatTimelineTimeLabel(group.startsAt)} UTC on ${formatUtcDateLabel(group.startsAt)}`
    );

    dot.className = "timeline-pin-dot";
    pin.appendChild(dot);

    if (group.events.length > 1) {
      const count = document.createElement("span");
      count.className = "timeline-pin-count";
      count.textContent = group.events.length;
      pin.appendChild(count);
    }

    pin.appendChild(tooltip);
    pinsContainer.appendChild(pin);
  });
}

function renderTimeline(referenceDate = new Date()) {
  const timelineBar = document.getElementById("timelineBar");

  if (timelineBar) {
    timelineBar.setAttribute(
      "aria-label",
      `Upcoming ${selectedEventRegion} events in the next 24 hours`
    );
  }

  renderTimelineLabels(referenceDate);
  renderTimelineTicks();
  renderTimelinePins(referenceDate);
}

/* ---------- Discord feeds ---------- */

const discordMessageLimit = 5;
const discordFeedRefreshMilliseconds = 30 * 1000;
const discordFeedJsonUrl = "https://gw2-lfg-bot-production.up.railway.app/discordFeed.json";

let discordFeedsLastCheckedAt = null;

let currentDiscordFeeds =
  typeof discordFeeds !== "undefined" && Array.isArray(discordFeeds)
    ? discordFeeds
    : [];

function getDiscordFeedSource() {
  if (Array.isArray(currentDiscordFeeds)) {
    return currentDiscordFeeds;
  }

  return [];
}

function getDiscordFeedById(feedId) {
  return getDiscordFeedSource().find((feed) => feed.id === feedId);
}

function formatDiscordLastChecked(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "Live refresh pending";
  }

  const timePart = date.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  return `Last checked: ${timePart} UTC`;
}

function formatDiscordTimestamp(timestamp) {
  if (typeof timestamp !== "string") {
    return "Time unavailable";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  const datePart = date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric"
  });

  const timePart = date.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  return `${datePart} — ${timePart} UTC`;
}

function createDiscordMessageCard(message) {
  const card = document.createElement("article");
  const topLine = document.createElement("div");
  const author = document.createElement("span");
  const time = document.createElement("time");
  const content = document.createElement("p");

  card.className = "discord-message-card";

  topLine.className = "discord-message-topline";

  author.className = "discord-message-author";
  author.textContent = message.authorName || "Unknown player";

  time.className = "discord-message-time";
  time.textContent = formatDiscordTimestamp(message.timestamp);

  if (message.timestamp) {
    time.dateTime = message.timestamp;
  }

  content.className = "discord-message-content";
  content.textContent = message.content || "No message content.";

  topLine.append(author, time);
  card.append(topLine, content);

  if (message.jumpUrl && message.jumpUrl !== "#") {
    const link = document.createElement("a");
    link.className = "discord-message-link";
    link.href = message.jumpUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View in Discord";
    card.appendChild(link);
  }

  return card;
}

function renderDiscordFeedPanel(panel, feed) {
  panel.replaceChildren();

  if (!feed) {
    const unavailable = document.createElement("div");
    unavailable.className = "discord-feed-empty";
    unavailable.textContent = "Discord feed unavailable.";
    panel.appendChild(unavailable);
    return;
  }

  const header = document.createElement("div");
  const titleRow = document.createElement("div");
  const title = document.createElement("h2");
  const badge = document.createElement("span");
  const meta = document.createElement("div");
  const status = document.createElement("div");
  const description = document.createElement("p");
  const messageList = document.createElement("div");

  header.className = "discord-feed-header";

  titleRow.className = "discord-feed-title-row";

  title.className = "discord-feed-title";
  title.textContent = feed.title || "Discord Feed";

  badge.className = "discord-live-badge";
  badge.textContent = "Live";

  meta.className = "discord-feed-meta";
  meta.textContent = `${feed.serverName || "Discord"} · ${feed.channelName || "#channel"}`;

  status.className = "discord-feed-status";
  status.textContent = formatDiscordLastChecked(discordFeedsLastCheckedAt);

  description.className = "discord-feed-description";
  description.textContent = feed.description || "Recent group-finder posts from Discord.";

  messageList.className = "discord-feed-messages";

  titleRow.append(title, badge);
  header.append(titleRow, meta, status, description);

  const messages = Array.isArray(feed.messages)
    ? feed.messages.slice(0, discordMessageLimit)
    : [];

  if (messages.length === 0) {
    const empty = document.createElement("div");
    empty.className = "discord-feed-empty";
    empty.textContent = "No recent messages.";
    messageList.appendChild(empty);
  } else {
    messages.forEach((message) => {
      messageList.appendChild(createDiscordMessageCard(message));
    });
  }

  panel.append(header, messageList);
}

function renderDiscordFeeds() {
  const panels = document.querySelectorAll(".discord-feed-panel");

  panels.forEach((panel) => {
    const feedId = panel.dataset.feedId;
    const feed = getDiscordFeedById(feedId);
    renderDiscordFeedPanel(panel, feed);
  });
}

async function loadDiscordFeedsFromJson() {
  try {
    const response = await fetch(`${discordFeedJsonUrl}?updated=${Date.now()}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Could not load ${discordFeedJsonUrl}: ${response.status}`);
    }

    const jsonFeedData = await response.json();

    if (!Array.isArray(jsonFeedData)) {
      throw new Error(`${discordFeedJsonUrl} did not contain an array.`);
    }

    currentDiscordFeeds = jsonFeedData;
    discordFeedsLastCheckedAt = new Date();

    renderDiscordFeeds();
  } catch (error) {
    console.warn("Using existing Discord feed data because JSON refresh failed.");
    console.warn(error);
  }
}

/* ---------- UTC clock ---------- */

function formatCurrentUtcDateTime(referenceDate = new Date()) {
  const datePart = referenceDate.toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const timePart = referenceDate.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  return `${datePart} — ${timePart} UTC`;
}

function formatCurrentLocalTime(referenceDate = new Date()) {
  const datePart = referenceDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const timePart = referenceDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short"
  });

  return `${datePart} — ${timePart}`;
}

function formatUtcOffset(referenceDate = new Date()) {
  const offsetMinutes = -referenceDate.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absoluteOffsetMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absoluteOffsetMinutes / 60);
  const minutes = absoluteOffsetMinutes % 60;

  if (minutes === 0) {
    return `${sign}${hours} hour${hours === 1 ? "" : "s"}`;
  }

  return `${sign}${hours}:${String(minutes).padStart(2, "0")} hours`;
}

function updateUtcClock() {
  const now = new Date();

  const localClockValue = document.getElementById("localClockValue");
  const utcOffsetValue = document.getElementById("utcOffsetValue");
  const utcClockValue = document.getElementById("utcClockValue");

  if (localClockValue) {
    localClockValue.textContent = formatCurrentLocalTime(now);
  }

  if (utcOffsetValue) {
    utcOffsetValue.textContent = formatUtcOffset(now);
  }

  if (utcClockValue) {
    utcClockValue.textContent = formatCurrentUtcDateTime(now);
  }
}

function initializePage() {
  initializeRegionToggle();
  renderSchedule();
  renderTimeline();
  renderDiscordFeeds();
  loadDiscordFeedsFromJson();
  updateUtcClock();

  setInterval(updateUtcClock, 1000);
  setInterval(renderTimeline, timelineRefreshMilliseconds);
  setInterval(loadDiscordFeedsFromJson, discordFeedRefreshMilliseconds);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}