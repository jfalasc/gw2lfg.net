if (typeof events === "undefined" || !Array.isArray(events)) {
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

const timeDisplayModes = ["local", "utc"];
const selectedTimeDisplayModeStorageKey = "gw2LfgTimeDisplayMode";

let selectedEventRegion = getInitialEventRegion();
let selectedTimeDisplayMode = getInitialTimeDisplayMode();
let selectedScheduleDay = getCurrentDisplayDayName();
let scheduleFollowsCurrentDay = true;
let lastScheduleDialogTrigger = null;

/* ---------- Shared date and time helpers ---------- */

function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

function getUtcStartOfToday(referenceDate = new Date()) {
  return new Date(Date.UTC(
    referenceDate.getUTCFullYear(),
    referenceDate.getUTCMonth(),
    referenceDate.getUTCDate()
  ));
}

function getDisplayDayIndex(date) {
  if (!isValidDate(date)) {
    return 0;
  }

  return selectedTimeDisplayMode === "utc"
    ? date.getUTCDay()
    : date.getDay();
}

function getCurrentDisplayDayName(referenceDate = new Date()) {
  return utcDayNames[getDisplayDayIndex(referenceDate)];
}

function getStartOfDisplayDay(referenceDate = new Date()) {
  if (selectedTimeDisplayMode === "utc") {
    return new Date(Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate()
    ));
  }

  return new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );
}

function addDisplayDays(referenceDate, amount) {
  const result = new Date(referenceDate);

  if (selectedTimeDisplayMode === "utc") {
    result.setUTCDate(result.getUTCDate() + amount);
  } else {
    result.setDate(result.getDate() + amount);
  }

  return result;
}

function getNextOccurrenceOfDisplayDay(dayName, referenceDate = new Date()) {
  const todayStart = getStartOfDisplayDay(referenceDate);
  const currentDayIndex = getDisplayDayIndex(todayStart);
  const targetDayIndex = utcDayNames.indexOf(dayName);

  if (targetDayIndex === -1) {
    return todayStart;
  }

  const daysUntilTarget = (targetDayIndex - currentDayIndex + 7) % 7;
  return addDisplayDays(todayStart, daysUntilTarget);
}

function formatUtcDateKey(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTimeDisplayModeLabel() {
  return selectedTimeDisplayMode === "utc" ? "UTC" : "Local time";
}

function getTimeDisplayModeTitle() {
  return selectedTimeDisplayMode === "utc" ? "UTC" : "Local Time";
}

function getDisplayDateOptions(options = {}) {
  if (selectedTimeDisplayMode === "utc") {
    return {
      ...options,
      timeZone: "UTC"
    };
  }

  return { ...options };
}

function formatDisplayDateLabel(date) {
  if (!isValidDate(date)) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-US", getDisplayDateOptions({
    month: "short",
    day: "numeric",
    year: "numeric"
  }));
}

function formatDisplayWeekday(date) {
  if (!isValidDate(date)) {
    return "";
  }

  return date.toLocaleDateString("en-US", getDisplayDateOptions({
    weekday: "short"
  }));
}

function formatDisplayTime(date, includeZone = true) {
  if (!isValidDate(date)) {
    return "Time unavailable";
  }

  const options = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  };

  if (selectedTimeDisplayMode === "utc") {
    options.timeZone = "UTC";
  } else if (includeZone) {
    options.timeZoneName = "short";
  }

  const formattedTime = date.toLocaleTimeString("en-US", options);

  if (selectedTimeDisplayMode === "utc" && includeZone) {
    return `${formattedTime} UTC`;
  }

  return formattedTime;
}

function formatDisplayDateTime(date, includeYear = false) {
  if (!isValidDate(date)) {
    return "Time unavailable";
  }

  const dateOptions = {
    weekday: "short",
    month: "short",
    day: "numeric"
  };

  if (includeYear) {
    dateOptions.year = "numeric";
  }

  const datePart = date.toLocaleDateString(
    "en-US",
    getDisplayDateOptions(dateOptions)
  );

  return `${datePart} — ${formatDisplayTime(date, true)}`;
}

function formatCurrentDisplayDateTime(referenceDate = new Date()) {
  if (!isValidDate(referenceDate)) {
    return "Time unavailable";
  }

  const datePart = referenceDate.toLocaleDateString(
    "en-US",
    getDisplayDateOptions({
      weekday: "long",
      month: "short",
      day: "numeric"
    })
  );

  return `${datePart} — ${formatDisplayTime(referenceDate, true)}`;
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

/* ---------- Region preference ---------- */

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

/* ---------- Time display preference ---------- */

function normalizeTimeDisplayMode(mode) {
  if (typeof mode !== "string") {
    return "";
  }

  return mode.trim().toLowerCase();
}

function getInitialTimeDisplayMode() {
  try {
    const storedMode = normalizeTimeDisplayMode(
      localStorage.getItem(selectedTimeDisplayModeStorageKey)
    );

    if (timeDisplayModes.includes(storedMode)) {
      return storedMode;
    }
  } catch (error) {
    console.warn("Could not read saved time display preference.");
    console.warn(error);
  }

  return "local";
}

function saveSelectedTimeDisplayMode(mode) {
  try {
    localStorage.setItem(selectedTimeDisplayModeStorageKey, mode);
  } catch (error) {
    console.warn("Could not save time display preference.");
    console.warn(error);
  }
}

function setSelectedTimeDisplayMode(mode) {
  const normalizedMode = normalizeTimeDisplayMode(mode);

  if (!timeDisplayModes.includes(normalizedMode)) {
    return;
  }

  if (normalizedMode === selectedTimeDisplayMode) {
    return;
  }

  selectedTimeDisplayMode = normalizedMode;

  if (scheduleFollowsCurrentDay) {
    selectedScheduleDay = getCurrentDisplayDayName();
  }

  saveSelectedTimeDisplayMode(selectedTimeDisplayMode);

  renderTimeDisplayToggle();
  renderSchedule();
  renderTimeline();
  renderDiscordFeeds();
  updateDisplayClock();
}

function renderTimeDisplayToggle() {
  const timeDisplayToggle = document.getElementById("timeDisplayToggle");

  if (!timeDisplayToggle) {
    return;
  }

  const buttons = timeDisplayToggle.querySelectorAll("[data-time-display-mode]");

  buttons.forEach((button) => {
    const buttonMode = normalizeTimeDisplayMode(button.dataset.timeDisplayMode);
    const isActive = buttonMode === selectedTimeDisplayMode;

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function initializeTimeDisplayToggle() {
  const timeDisplayToggle = document.getElementById("timeDisplayToggle");

  if (!timeDisplayToggle) {
    return;
  }

  const buttons = timeDisplayToggle.querySelectorAll("[data-time-display-mode]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      setSelectedTimeDisplayMode(button.dataset.timeDisplayMode);
    });
  });

  renderTimeDisplayToggle();
}

/* ---------- Event data ---------- */

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

function createEventOccurrence(event, startsAt, sourceTime, recurring) {
  return {
    name: event.name,
    region: event.region || "Region TBD",
    username: event.username || event.host || "Unknown player",
    description: event.description || "",
    time: sourceTime,
    date: formatUtcDateKey(startsAt),
    startsAt,
    recurring
  };
}

function getEventOccurrencesInRange(
  windowStart,
  windowEnd,
  { includeWindowEnd = false } = {}
) {
  if (!isValidDate(windowStart) || !isValidDate(windowEnd)) {
    return [];
  }

  if (windowEnd < windowStart) {
    return [];
  }

  const occurrences = [];

  function isInRange(date) {
    if (!isValidDate(date)) {
      return false;
    }

    return date >= windowStart && (
      includeWindowEnd
        ? date <= windowEnd
        : date < windowEnd
    );
  }

  getEventSource().forEach((event) => {
    if (event.recurring === true && Array.isArray(event.schedule)) {
      event.schedule.forEach((entry) => {
        const startsAt = getRecurringOccurrenceDate(entry, windowStart);

        if (isInRange(startsAt)) {
          occurrences.push(
            createEventOccurrence(event, startsAt, entry.time, true)
          );
        }
      });
    }

    if (event.recurring === false) {
      const startsAt = parseUtcDateTime(event.date, event.time);

      if (isInRange(startsAt)) {
        occurrences.push(
          createEventOccurrence(event, startsAt, event.time, false)
        );
      }
    }
  });

  occurrences.sort((a, b) => a.startsAt - b.startsAt);

  return occurrences;
}

/* ---------- Schedule ---------- */

function getEventsForScheduleDay(dayName, referenceDate = new Date()) {
  const targetDate = getNextOccurrenceOfDisplayDay(dayName, referenceDate);
  const windowEnd = addDisplayDays(targetDate, 1);

  return {
    targetDate,
    windowEnd,
    events: getEventOccurrencesInRange(targetDate, windowEnd)
  };
}

function getScheduleEventDetailsElements() {
  return {
    panel: document.getElementById("scheduleEventDetailsPanel"),
    closeButton: document.getElementById("scheduleEventDetailsClose"),
    title: document.getElementById("scheduleEventDetailsTitle"),
    timeLabel: document.getElementById("scheduleEventDetailsTimeLabel"),
    time: document.getElementById("scheduleEventDetailsTime"),
    region: document.getElementById("scheduleEventDetailsRegion"),
    poster: document.getElementById("scheduleEventDetailsPoster"),
    description: document.getElementById("scheduleEventDetailsDescription")
  };
}

function clearSelectedScheduleCards() {
  document.querySelectorAll(".schedule-event-card.is-selected").forEach((card) => {
    card.classList.remove("is-selected");
    card.setAttribute("aria-pressed", "false");
    card.setAttribute("aria-expanded", "false");
  });
}

function positionScheduleEventDetailsPanel(triggerCard) {
  const detailsElements = getScheduleEventDetailsElements();

  if (!detailsElements.panel || detailsElements.panel.hidden) {
    return;
  }

  if (!triggerCard || window.innerWidth <= 700) {
    detailsElements.panel.style.left = "";
    detailsElements.panel.style.top = "";
    detailsElements.panel.style.right = "";
    detailsElements.panel.style.bottom = "";
    return;
  }

  const gap = 14;
  const viewportPadding = 16;
  const cardRect = triggerCard.getBoundingClientRect();
  const panelRect = detailsElements.panel.getBoundingClientRect();

  let left = cardRect.right + gap;

  if (left + panelRect.width > window.innerWidth - viewportPadding) {
    left = cardRect.left - panelRect.width - gap;
  }

  left = Math.max(
    viewportPadding,
    Math.min(left, window.innerWidth - panelRect.width - viewportPadding)
  );

  let top = cardRect.top + (cardRect.height - panelRect.height) / 2;

  top = Math.max(
    viewportPadding,
    Math.min(top, window.innerHeight - panelRect.height - viewportPadding)
  );

  detailsElements.panel.style.left = `${left}px`;
  detailsElements.panel.style.top = `${top}px`;
  detailsElements.panel.style.right = "auto";
  detailsElements.panel.style.bottom = "auto";
}

function repositionOpenScheduleEventDetailsPanel() {
  const detailsElements = getScheduleEventDetailsElements();

  if (
    detailsElements.panel &&
    !detailsElements.panel.hidden &&
    lastScheduleDialogTrigger &&
    document.body.contains(lastScheduleDialogTrigger)
  ) {
    positionScheduleEventDetailsPanel(lastScheduleDialogTrigger);
  }
}

function openScheduleEventDetails(scheduleEvent, triggerCard) {
  const detailsElements = getScheduleEventDetailsElements();

  if (
    !detailsElements.panel ||
    !detailsElements.title ||
    !detailsElements.timeLabel ||
    !detailsElements.time ||
    !detailsElements.region ||
    !detailsElements.poster ||
    !detailsElements.description
  ) {
    return;
  }

  clearSelectedScheduleCards();

  if (triggerCard) {
    triggerCard.classList.add("is-selected");
    triggerCard.setAttribute("aria-pressed", "true");
    triggerCard.setAttribute("aria-expanded", "true");
    lastScheduleDialogTrigger = triggerCard;
  }

  detailsElements.title.textContent = scheduleEvent.name || "Event details";
  detailsElements.timeLabel.textContent =
    selectedTimeDisplayMode === "utc" ? "UTC time" : "Local time";
  detailsElements.time.textContent = formatDisplayDateTime(scheduleEvent.startsAt);
  detailsElements.region.textContent = scheduleEvent.region || "Region TBD";
  detailsElements.poster.textContent = scheduleEvent.username || "Unknown player";
  detailsElements.description.textContent =
    scheduleEvent.description || "No additional details yet.";

  detailsElements.panel.hidden = false;

  requestAnimationFrame(() => {
    positionScheduleEventDetailsPanel(triggerCard);
  });
}

function closeScheduleEventDetails(restoreFocus = true) {
  const detailsElements = getScheduleEventDetailsElements();

  if (!detailsElements.panel || detailsElements.panel.hidden) {
    return;
  }

  detailsElements.panel.hidden = true;
  clearSelectedScheduleCards();

  if (
    restoreFocus &&
    lastScheduleDialogTrigger &&
    document.body.contains(lastScheduleDialogTrigger)
  ) {
    lastScheduleDialogTrigger.focus();
  }

  lastScheduleDialogTrigger = null;
}

function initializeScheduleEventDetails() {
  const detailsElements = getScheduleEventDetailsElements();

  if (!detailsElements.panel) {
    return;
  }

  if (detailsElements.closeButton) {
    detailsElements.closeButton.addEventListener("click", () => {
      closeScheduleEventDetails();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeScheduleEventDetails();
    }
  });

  window.addEventListener("resize", repositionOpenScheduleEventDetailsPanel);
  window.addEventListener("scroll", repositionOpenScheduleEventDetailsPanel, true);
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
    button.setAttribute(
      "aria-label",
      `Show ${day} events in ${getTimeDisplayModeLabel()}`
    );

    screenReaderText.className = "sr-only";
    screenReaderText.textContent = day;

    button.appendChild(screenReaderText);

    if (day === selectedScheduleDay) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      selectedScheduleDay = day;
      scheduleFollowsCurrentDay = day === getCurrentDisplayDayName();
      renderSchedule();
    });

    container.appendChild(button);
  });
}

function renderScheduleEvents(referenceDate = new Date()) {
  const selectedDayLabel = document.getElementById("scheduleSelectedDay");
  const selectedDateLabel = document.getElementById("scheduleSelectedDate");
  const selectedDayCount = document.getElementById("scheduleSelectedDayCount");
  const viewport = document.getElementById("scheduleEventsViewport");
  const track = document.getElementById("scheduleEventsTrack");

  if (!selectedDayLabel || !selectedDayCount || !viewport || !track) {
    return;
  }

  closeScheduleEventDetails(false);

  const scheduleResult = getEventsForScheduleDay(
    selectedScheduleDay,
    referenceDate
  );
  const targetDate = scheduleResult.targetDate;
  const dayEvents = scheduleResult.events;

  selectedDayLabel.textContent = selectedScheduleDay;

  if (selectedDateLabel) {
    selectedDateLabel.textContent =
      `${formatDisplayDateLabel(targetDate)} · ${getTimeDisplayModeTitle()}`;
  }

  selectedDayCount.textContent =
    `${dayEvents.length} event${dayEvents.length === 1 ? "" : "s"}`;

  track.replaceChildren();
  viewport.scrollLeft = 0;

  if (dayEvents.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "schedule-empty-state";
    emptyState.textContent =
      `No ${selectedEventRegion} events scheduled for ${selectedScheduleDay} ` +
      `(${formatDisplayDateLabel(targetDate)}, ${getTimeDisplayModeLabel()}).`;
    track.appendChild(emptyState);
    return;
  }

  dayEvents.forEach((event) => {
    const card = document.createElement("article");
    const summary = document.createElement("div");
    const time = document.createElement("div");
    const name = document.createElement("h4");
    const formattedTime = formatDisplayTime(event.startsAt, true);

    card.className = "schedule-event-card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");
    card.setAttribute("aria-expanded", "false");
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute(
      "aria-label",
      `View details for ${event.name} at ${formatDisplayDateTime(event.startsAt)}`
    );

    summary.className = "schedule-event-summary";

    time.className = "schedule-event-time";
    time.textContent = formattedTime;

    name.className = "schedule-event-name";
    name.textContent = event.name;

    summary.append(time, name);
    card.append(summary);

    card.addEventListener("click", () => {
      openScheduleEventDetails(event, card);
    });

    card.addEventListener("keydown", (keyboardEvent) => {
      if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
        keyboardEvent.preventDefault();
        openScheduleEventDetails(event, card);
      }
    });

    track.appendChild(card);
  });
}

function renderSchedule(referenceDate = new Date()) {
  if (scheduleFollowsCurrentDay) {
    selectedScheduleDay = getCurrentDisplayDayName(referenceDate);
  }

  renderScheduleDayButtons();
  renderScheduleEvents(referenceDate);
}

/* ---------- Timeline ---------- */

function getTimelineOccurrences(referenceDate = new Date()) {
  const windowEnd = new Date(
    referenceDate.getTime() + timelineWindowHours * 60 * 60 * 1000
  );

  return getEventOccurrencesInRange(referenceDate, windowEnd, {
    includeWindowEnd: true
  });
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

    const weekdayLabel = formatDisplayWeekday(labelDate);
    const timeLabel = formatDisplayTime(labelDate, false);

    if (offset === 0) {
      main.textContent = "Now";
    } else {
      main.textContent = `+${offset}h`;
    }

    sub.textContent = `${weekdayLabel} ${timeLabel}`;

    label.setAttribute(
      "aria-label",
      `${offset === 0 ? "Now" : `${offset} hours from now`}: ` +
      `${formatDisplayDateTime(labelDate)}`
    );

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
  timeLine.textContent = formatDisplayDateTime(group.startsAt, true);
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
    eventPostedBy.append(
      eventPostedByLabel,
      ` ${event.username || "Unknown player"}`
    );

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
    emptyState.textContent =
      `No ${selectedEventRegion} events scheduled in the next 24 hours.`;
    emptyState.hidden = groupedOccurrences.length !== 0;
  }

  if (groupedOccurrences.length === 0) {
    return;
  }

  groupedOccurrences.forEach((group) => {
    const pin = document.createElement("button");
    const dot = document.createElement("span");
    const tooltip = createTimelineTooltip(group);

    const hoursFromNow =
      (group.startsAt.getTime() - referenceDate.getTime()) /
      (60 * 60 * 1000);
    const leftPercent = Math.max(
      0,
      Math.min(100, (hoursFromNow / timelineWindowHours) * 100)
    );

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
      `${group.events.length === 1
        ? group.events[0].name
        : `${group.events.length} events`} at ` +
      `${formatDisplayDateTime(group.startsAt)}`
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
  const timelineTitle = document.getElementById("timelineTitle");
  const timelineBar = document.getElementById("timelineBar");

  if (timelineTitle) {
    timelineTitle.textContent =
      `Next 24 Hours — ${getTimeDisplayModeTitle()}`;
  }

  if (timelineBar) {
    timelineBar.setAttribute(
      "aria-label",
      `Upcoming ${selectedEventRegion} events in the next 24 hours, ` +
      `shown in ${getTimeDisplayModeLabel()}`
    );
  }

  renderTimelineLabels(referenceDate);
  renderTimelineTicks();
  renderTimelinePins(referenceDate);
}

/* ---------- Discord feeds ---------- */

const discordMessageLimit = 5;
const discordFeedRefreshMilliseconds = 30 * 1000;
const discordFeedJsonUrl =
  "https://gw2-lfg-bot-production.up.railway.app/discordFeed.json";

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

function formatDiscordTimestamp(timestamp) {
  if (typeof timestamp !== "string") {
    return "Time unavailable";
  }

  const date = new Date(timestamp);

  if (!isValidDate(date)) {
    return "Time unavailable";
  }

  const datePart = date.toLocaleDateString(
    "en-US",
    getDisplayDateOptions({
      month: "short",
      day: "numeric"
    })
  );

  return `${datePart} — ${formatDisplayTime(date, true)}`;
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
  const messageList = document.createElement("div");

  header.className = "discord-feed-header";

  titleRow.className = "discord-feed-title-row";

  title.className = "discord-feed-title";
  title.textContent = feed.title || "Discord Feed";

  badge.className = "discord-live-badge";
  badge.textContent = "Live";

  messageList.className = "discord-feed-messages";

  titleRow.append(title, badge);
  header.appendChild(titleRow);

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

    renderDiscordFeeds();
  } catch (error) {
    console.warn("Using existing Discord feed data because JSON refresh failed.");
    console.warn(error);
    renderDiscordFeeds();
  }
}

/* ---------- Display clock ---------- */

function updateDisplayClock() {
  const now = new Date();
  const displayClockLabel = document.getElementById("displayClockLabel");
  const displayClockValue = document.getElementById("displayClockValue");
  const utcOffsetValue = document.getElementById("utcOffsetValue");

  if (displayClockLabel) {
    displayClockLabel.textContent =
      selectedTimeDisplayMode === "utc"
        ? "Current UTC time:"
        : "Current local time:";
  }

  if (displayClockValue) {
    displayClockValue.textContent = formatCurrentDisplayDateTime(now);
  }

  if (utcOffsetValue) {
    utcOffsetValue.textContent = formatUtcOffset(now);
  }

  if (
    scheduleFollowsCurrentDay &&
    selectedScheduleDay !== getCurrentDisplayDayName(now)
  ) {
    selectedScheduleDay = getCurrentDisplayDayName(now);
    renderSchedule(now);
  }
}

function initializePage() {
  initializeRegionToggle();
  initializeTimeDisplayToggle();
  initializeScheduleEventDetails();
  renderSchedule();
  renderTimeline();
  loadDiscordFeedsFromJson();
  updateDisplayClock();

  setInterval(updateDisplayClock, 1000);
  setInterval(renderTimeline, timelineRefreshMilliseconds);
  setInterval(loadDiscordFeedsFromJson, discordFeedRefreshMilliseconds);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}
