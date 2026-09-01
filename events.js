/*
 * Event data for gw2lfg.net — the single source of truth.
 *
 * ALL TIMES AND DAYS BELOW ARE UTC. The site converts them to each visitor's
 * local time in the browser. An event at { day: "Saturday", time: "02:00" }
 * therefore shows on FRIDAY evening in North America, which is correct.
 *
 * lastVerified is the date the event was last confirmed to still be running,
 * as "YYYY-MM-DD", or null if it never has been. Anything null or older than
 * 90 days is listed under "Needs checking" in EVENTS.md.
 *
 * After editing this file, rebuild the register:  node tools/build-events-doc.js
 * (a pre-commit hook does this for you when events.js is part of a commit.)
 */
const events = [
  {
    name: "HoT Meta Train",
    region: "NA",
    username: "Lamshire.3058",
    guild: "LEG",
    description: "Hosted by [LEG]! Tangled Depths -> Auric Basin -> Dragon's Stand -> Auric Basin -> Verdant Brink",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Monday", time: "02:00" },
      { day: "Tuesday", time: "02:00" },
      { day: "Thursday", time: "02:00" }
    ]
  },
  {
    name: "Gyala Delve",
    region: "NA",
    username: "Ruinandshotel.9278",
    guild: "JMAW",
    description: "Hosted by [JMAW]!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Tuesday", time: "01:30" },
      { day: "Thursday", time: "01:30" },
      { day: "Saturday", time: "01:30" }
    ]
  },
  {
    name: "Convergence CMs",
    region: "NA",
    username: "SunMatrix.4168",
    guild: "CC",
    description: "Hosted by Convergence Corp!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Tuesday", time: "01:00" },
      { day: "Saturday", time: "18:00" },
    ]
  },
  {
    name: "Convergence CMs",
    region: "NA",
    username: "LilyVelour.8395",
    guild: "LILY",
    description: "Hosted by [LILY]!",
    recurring: true,
    lastVerified: "2026-09-01",
    needsInfo: [
      "Tuesday slot runs every OTHER Tuesday, not weekly - the register can only express weekly, so this slot currently over-reports",
    ],
    schedule: [
      { day: "Wednesday", time: "00:00" },
      { day: "Saturday", time: "21:00" },
    ]
  },
  {
    name: "SotO Meta Train",
    region: "NA",
    username: "LilyVelour.8395",
    guild: "LILY",
    description: "Hosted by [LILY]! Skywatch > Amnytas > Nayos",
    recurring: true,
    lastVerified: null,
    schedule: [
      { day: "Wednesday", time: "20:30" },
    ]
  },
  {
    name: "SotO Convergence CMs",
    region: "NA",
    username: "MarshAll.3528",
    guild: "FB",
    description: "Hosted by [FB]!",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Sunday", time: "01:50" },
    ]
  },
  {
    name: "World Tour Meta Train",
    region: "NA",
    username: "MarshAll.3528",
    guild: "FB",
    description: "Hosted by [FB]! Metas from every expansion",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Monday", time: "02:00" },
    ]
  },
  {
    name: "EoD Meta Train",
    region: "NA",
    username: "MarshAll.3528",
    guild: "FB",
    description: "Hosted by [FB]! Seitung Province -> Kaineng City -> Echovald Wilds -> Dragon's End",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Tuesday", time: "03:30" },
    ]
  },
  {
    name: "S4 Meta Train",
    region: "NA",
    username: "MarshAll.3528",
    guild: "FB",
    description: "Hosted by [FB]! Every season 4 meta",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Saturday", time: "01:45" },
    ]
  },
  {
    name: "Core Meta Train",
    region: "NA",
    username: "Wolfspear.7180",
    guild: "BUTR",
    description: "Hosted by [BUTR]! Tequatl -> LLA -> Megadestroyer -> Triple Trouble",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Sunday", time: "00:00" },
      { day: "Monday", time: "00:00" },
      { day: "Tuesday", time: "00:00" },
      { day: "Wednesday", time: "00:00" },
      { day: "Thursday", time: "00:00" },
      { day: "Friday", time: "00:00" },
      { day: "Saturday", time: "00:00" },
    ]
  },
  {
    name: "Dragonfall Farm Train",
    region: "NA",
    username: "Maverick.3574",
    guild: null,
    description: "Times subject to change! Weekends depend on availability! Message Maverick.3574 for details",
    recurring: true,
    lastVerified: null,
    needsInfo: [
      "guild tag",
    ],
    schedule: [
      { day: "Monday", time: "21:00" },
      { day: "Tuesday", time: "21:00" },
      { day: "Wednesday", time: "21:00" },
      { day: "Thursday", time: "21:00" },
      { day: "Friday", time: "21:00" },
    ]
  },
  {
    name: "Dragon's End",
    region: "NA",
    username: "Shiv Deeviant.8072",
    guild: "DBJC",
    description: "Hosted by [DBJC]!",
    recurring: true,
    lastVerified: null,
    schedule: [
      { day: "Monday", time: "22:00" },
      { day: "Tuesday", time: "22:00" },
      { day: "Wednesday", time: "22:00" },
      { day: "Thursday", time: "22:00" },
      { day: "Friday", time: "22:00" },
    ]
  },
  {
    name: "JW Convergence CMs",
    region: "NA",
    username: "Mr Paul.8247",
    guild: "SAS",
    description: "Hosted by [SAS]!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Monday", time: "20:00" },
    ]
  },
  {
    name: "SotO Convergence CMs",
    region: "NA",
    username: "Mr Paul.8247",
    guild: "SAS",
    description: "Hosted by [SAS]!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Thursday", time: "20:00" },
    ]
  },
  {
    name: "Hero Point Train",
    region: "NA",
    username: "Hempia.5981",
    guild: "SIN",
    description: "Hosted by [SIN]!",
    recurring: true,
    lastVerified: null,
    schedule: [
      { day: "Saturday", time: "18:00" },
    ]
  },
  {
    name: "Silverwastes RIBA Farm",
    region: "NA",
    username: "EverCursed.9084",
    guild: "Sw",
    description: "Hosted by [Sw]!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Sunday", time: "23:30" },
      { day: "Monday", time: "23:30" },
      { day: "Tuesday", time: "23:30" },
      { day: "Wednesday", time: "23:30" },
      { day: "Thursday", time: "23:30" },
      { day: "Friday", time: "23:30" },
      { day: "Saturday", time: "23:30" },
    ]
  },
  {
    name: "Casino Blitz",
    region: "NA",
    username: "grace.3689",
    guild: "MEAT",
    description: "Crystal Oasis pinata meta hosted by [MEAT]!",
    recurring: true,
    lastVerified: null,
    schedule: [
      { day: "Sunday", time: "00:00" },
      { day: "Monday", time: "00:00" },
      { day: "Tuesday", time: "00:00" },
      { day: "Wednesday", time: "00:00" },
      { day: "Thursday", time: "00:00" },
      { day: "Friday", time: "00:00" },
      { day: "Saturday", time: "00:00" },
    ]
  },
  {
    name: "Bava Nisos Farm & Meta",
    region: "NA",
    username: "Sylphonete.7583",
    guild: null,
    description: "Bava Nisos farm train before reset, then meta after reset",
    recurring: true,
    lastVerified: null,
    needsInfo: [
      "guild tag",
    ],
    schedule: [
      { day: "Sunday", time: "23:20" },
      { day: "Monday", time: "23:20" },
      { day: "Tuesday", time: "23:20" },
      { day: "Wednesday", time: "23:20" },
      { day: "Thursday", time: "23:20" },
      { day: "Friday", time: "23:20" },
      { day: "Saturday", time: "23:20" },
    ]
  },
  {
    name: "PoF Meta Train",
    region: "NA",
    username: "OverRealm.3542",
    guild: "AO",
    description: "Hosted by [AO]!",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Saturday", time: "01:30" },
    ]
  },
  {
    name: "HoT Meta Train",
    region: "NA",
    username: "Shazilee.1098",
    guild: "SHAZ",
    description: "Hosted by [SHAZ]! Dragon's Stand & Auric Basin",
    recurring: true,
    lastVerified: null,
    schedule: [
      { day: "Wednesday", time: "03:00" },
      { day: "Saturday", time: "03:00" },
      { day: "Sunday", time: "03:00" },
    ]
  },
  {
    name: "Triple Trouble",
    region: "NA",
    username: "Wolfspear.7180",
    guild: "NOPE",
    description: "Hosted by [NOPE]!",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Sunday", time: "19:30" },
      { day: "Monday", time: "19:30" },
      { day: "Tuesday", time: "19:30" },
      { day: "Wednesday", time: "19:30" },
      { day: "Thursday", time: "19:30" },
      { day: "Friday", time: "19:30" },
      { day: "Saturday", time: "19:30" },
    ]
  },
  {
    name: "Triple Trouble",
    region: "NA",
    username: "Dark Raven.2160",
    guild: "DCAP",
    description: "Hosted by [DCAP]!",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Sunday", time: "12:00" },
      { day: "Monday", time: "12:00" },
      { day: "Tuesday", time: "12:00" },
      { day: "Wednesday", time: "12:00" },
      { day: "Thursday", time: "12:00" },
      { day: "Friday", time: "12:00" },
      { day: "Saturday", time: "12:00" },
    ]
  },
  {
    name: "Twisted Marionette",
    region: "NA",
    username: "Dark Raven.2160",
    guild: "DCAP",
    description: "Hosted by [DCAP]!",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Thursday", time: "13:00" },
    ]
  },
  {
    name: "Gyala Delve",
    region: "NA",
    username: "Dark Raven.2160",
    guild: "DCAP",
    description: "Hosted by [DCAP]!",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Friday", time: "08:00" },
    ]
  },
  {
    name: "Battle for Lion's Arch",
    region: "NA",
    username: "Dark Raven.2160",
    guild: "DCAP",
    description: "Hosted by [DCAP]!",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Monday", time: "13:00" },
    ]
  },
  {
    name: "Dragonstorm & Dragon's Stand",
    region: "NA",
    username: "Dark Raven.2160",
    guild: "DCAP",
    description: "Hosted by [DCAP]!",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Tuesday", time: "13:00" },
    ]
  },
  {
    name: "SotO & JW Convergence CMs",
    region: "NA",
    username: "darens.2547",
    guild: "ZERO",
    description: "Hosted by [ZERO]!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Monday", time: "14:00" },
    ]
  },
  {
    name: "Dragon's End & Dragonstorm",
    region: "NA",
    username: "sim.1203",
    guild: "Hs",
    description: "Hosted by [Hs]!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Sunday", time: "02:30" },
      { day: "Monday", time: "02:30" },
      { day: "Tuesday", time: "02:30" },
      { day: "Wednesday", time: "02:30" },
      { day: "Thursday", time: "02:30" },
      { day: "Friday", time: "02:30" },
      { day: "Saturday", time: "02:30" },
    ]
  },
  {
    name: "World Tour Meta Train",
    region: "NA",
    username: "darens.2547",
    guild: "ZERO",
    description: "Hosted by [ZERO]!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Thursday", time: "15:00" },
    ]
  },
  {
    name: "Griffon Flight Training",
    region: "NA",
    username: "Thy Weeping Willow.6851",
    guild: "Wing",
    description: "Hosted by [Wing]! Learn how to get the most out of your griffon!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Sunday", time: "19:30" },
    ]
  },
  {
    name: "Griffon Flight Training",
    region: "NA",
    username: "Thy Weeping Willow.6851",
    guild: "Wing",
    description: "Hosted by [Wing]! Learn how to get the most out of your griffon!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Monday", time: "18:30" },
    ]
  },
  {
    name: "Triple Trouble",
    region: "NA",
    username: "CasFamGaming.9843",
    guild: "WHAM",
    description: "Hosted by [WHAM]!",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Sunday", time: "03:30" },
      { day: "Monday", time: "03:30" },
      { day: "Tuesday", time: "03:30" },
      { day: "Wednesday", time: "03:30" },
      { day: "Thursday", time: "03:30" },
      { day: "Friday", time: "03:30" },
      { day: "Saturday", time: "03:30" },
    ]
  },
  {
    name: "Triple Trouble",
    region: "NA",
    username: "Dampevamp.6035",
    guild: "RNT",
    description: "Hosted by [RNT]!",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Sunday", time: "07:30" },
      { day: "Monday", time: "07:30" },
      { day: "Tuesday", time: "07:30" },
      { day: "Wednesday", time: "07:30" },
      { day: "Thursday", time: "07:30" },
      { day: "Friday", time: "07:30" },
      { day: "Saturday", time: "07:30" },
    ]
  },
  {
    name: "Convergence CMs",
    region: "NA",
    username: "calmerthanu.8375",
    guild: "WILT",
    description: "Hosted by [WILT]!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Wednesday", time: "01:00" },
      { day: "Thursday", time: "01:00" },
    ]
  },
  {
    name: "Convergence CMs",
    region: "NA",
    username: "SoBread.5628",
    guild: "COFE",
    description: "Hosted by [COFE]!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Wednesday", time: "05:00" },
      { day: "Friday", time: "05:00" },
    ]
  },
  {
    name: "JW Convergence CMs",
    region: "NA",
    username: "Ohnage.1638",
    guild: "uLT",
    description: "Hosted by [uLT]!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Saturday", time: "20:00" },
    ]
  },
  {
    name: "SotO Convergence CMs",
    region: "NA",
    username: "Ohnage.1638",
    guild: "uLT",
    description: "Hosted by [uLT]!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Sunday", time: "17:00" },
    ]
  },
  {
    name: "Griffon Flight Training",
    region: "EU",
    username: "Thy Weeping Willow.6851",
    guild: "Wing",
    description: "Hosted by [Wing]! Learn how to get the most out of your griffon!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Monday", time: "18:30" },
    ]
  },
  {
    name: "Triple Trouble",
    region: "EU",
    username: "Tanylyla.6397",
    guild: null,
    description: "Hosted by the EU TT Discord server: https://discord.com/invite/6YG5CC6",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Sunday", time: "19:15" },
      { day: "Tuesday", time: "19:15" },
      { day: "Wednesday", time: "19:15" },
      { day: "Thursday", time: "19:15" },
      { day: "Friday", time: "19:15" },
      { day: "Saturday", time: "19:15" },
    ]
  },
  {
    name: "EoD Meta Train",
    region: "EU",
    username: "Oregon.9387",
    guild: null,
    description: "Seitung Province -> Kaineng City -> Echovald Forest -> Dragon's End",
    recurring: true,
    lastVerified: "2026-08-31",
    needsInfo: [
      "guild tag",
    ],
    schedule: [
      { day: "Sunday", time: "09:30" },
      { day: "Monday", time: "09:30" },
      { day: "Tuesday", time: "09:30" },
      { day: "Wednesday", time: "09:30" },
      { day: "Thursday", time: "09:30" },
      { day: "Friday", time: "09:30" },
      { day: "Saturday", time: "09:30" },
    ]
  },
  {
    name: "Weekly Rifts",
    region: "EU",
    username: "Platanium.4532",
    guild: "Hs",
    description: "Hosted by [Hs]!",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Tuesday", time: "17:30" },
    ]
  },
  {
    name: "EoD Meta Train",
    region: "EU",
    username: "Platanium.4532",
    guild: "Hs",
    description: "Hosted by [Hs]! Seitung Province -> Kaineng City -> Echovald Forest -> Dragon's End -> Echovald Forest -> Gyala Delve",
    recurring: true,
    lastVerified: "2026-09-01",
    schedule: [
      { day: "Sunday", time: "17:30" },
    ]
  },
  {
    name: "Amalgamated Meta Train",
    region: "EU",
    username: "Literious.4205",
    guild: "VEIN",
    description: "Hosted by [VEIN]! AB > Drakkar > Junundu > Palawadan > Vabbi > VBMatri > Effigy > LLA > Chak > Doomlore > Oil Floes > DBS > EoD Train. The route changes depending on commanders and requests.",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Monday", time: "08:45" },
      { day: "Wednesday", time: "08:45" },
      { day: "Friday", time: "08:45" },
    ]
  },
  {
    name: "EoD Meta Train",
    region: "EU",
    username: "Literious.4205",
    guild: "VEIN",
    description: "Hosted by [VEIN]! Aetherblade Assault > Kaineng Blackout > Gang War > Soo Won > Aspenwood. Runs into the daily scheduled Gyala Delve.",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Monday", time: "11:30" },
      { day: "Tuesday", time: "11:30" },
      { day: "Wednesday", time: "11:30" },
      { day: "Thursday", time: "11:30" },
      { day: "Friday", time: "11:30" },
      { day: "Saturday", time: "11:30" },
      { day: "Sunday", time: "11:30" },
    ]
  },
  {
    name: "Gyala Delve",
    region: "EU",
    username: "Literious.4205",
    guild: "VEIN",
    description: "Hosted by [VEIN]! Part 1 + Part 2. Bring Filters, Protocols, Keys and Lures, plus Shrimplings (optional).",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Monday", time: "14:15" },
      { day: "Tuesday", time: "14:15" },
      { day: "Wednesday", time: "14:15" },
      { day: "Thursday", time: "14:15" },
      { day: "Friday", time: "14:15" },
      { day: "Saturday", time: "14:15" },
      { day: "Sunday", time: "14:15" },
    ]
  },
  {
    name: "VoE Convergence CMs",
    region: "EU",
    username: "Literious.4205",
    guild: "VEIN",
    description: "Hosted by [VEIN]! All bosses. Voice and performance expected.",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Monday", time: "14:30" },
    ]
  },
  {
    name: "Drizzlewood Coast",
    region: "EU",
    username: "Literious.4205",
    guild: "VEIN",
    description: "Hosted by [VEIN]! South + North. Flex schedule - usually daily somewhere between dinner and midnight, and sometimes during the day. Bring Keys (optional).",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Monday", time: "16:30" },
      { day: "Tuesday", time: "16:30" },
      { day: "Wednesday", time: "16:30" },
      { day: "Thursday", time: "16:30" },
      { day: "Friday", time: "16:30" },
      { day: "Saturday", time: "16:30" },
      { day: "Sunday", time: "16:30" },
    ]
  },
  {
    name: "Tower of Nightmares",
    region: "NA",
    username: "LadyDestinee.5178",
    guild: "WoM",
    description: "Hosted by [WoM]!",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Monday", time: "01:30" },
    ]
  },
  {
    name: "World Tour Meta Train",
    region: "NA",
    username: "LadyDestinee.5178",
    guild: "WoM",
    description: "Hosted by [WoM]!",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Saturday", time: "23:45" },
    ]
  },
  {
    name: "Battle for Lion's Arch",
    region: "NA",
    username: "Empress Adorafae.9028",
    guild: "DAWN",
    description: "Hosted by [DAWN]!",
    recurring: true,
    lastVerified: "2026-08-31",
    schedule: [
      { day: "Wednesday", time: "01:00" },
    ]
  },
  {
    name: "Gyala Delve",
    region: "NA",
    username: "viioculi.9154",
    guild: null,
    description: "Echovald and Aspenwood into Gyala Delve. Announced Friday evenings in the group-finder Discord.",
    recurring: true,
    lastVerified: "2026-09-01",
    needsInfo: [
      "guild tag",
    ],
    schedule: [
      { day: "Saturday", time: "04:00" },
    ]
  },
  {
    name: "Inner Nayos",
    region: "NA",
    username: "Go Mango",
    guild: null,
    description: "Lava Chicken pre-event through to Eparch. Announced nightly in the group-finder Discord.",
    recurring: true,
    lastVerified: "2026-09-01",
    needsInfo: [
      "full account name — only the character name \"Go Mango\" is known",
      "guild tag",
      "confirmed start time — announcements scatter between 02:30 and 05:00 UTC",
    ],
    schedule: [
      { day: "Sunday", time: "04:00" },
      { day: "Monday", time: "04:00" },
      { day: "Tuesday", time: "04:00" },
      { day: "Wednesday", time: "04:00" },
      { day: "Thursday", time: "04:00" },
      { day: "Friday", time: "04:00" },
      { day: "Saturday", time: "04:00" },
    ]
  },
  {
    name: "Convergence CMs",
    region: "NA",
    username: null,
    guild: "SLPY",
    description: "Hosted by [SLPY] The Sleepiest Warriors! Streamed at twitch.tv/projektdyad.",
    recurring: true,
    lastVerified: "2026-09-01",
    needsInfo: [
      "host GW2 account name - the schedule page lists only the guild and stream",
    ],
    schedule: [
      { day: "Saturday", time: "01:00" },
    ]
  },
  {
    name: "Convergence CMs",
    region: "EU",
    username: null,
    guild: null,
    description: "Hosted by Mook Chivalry.",
    recurring: true,
    lastVerified: "2026-09-01",
    needsInfo: [
      "host GW2 account name",
      "guild tag",
    ],
    schedule: [
      { day: "Monday", time: "13:00" },
    ]
  },
  {
    name: "Convergence CMs",
    region: "EU",
    username: null,
    guild: "VII",
    description: "Hosted by [VII] Septem!",
    recurring: true,
    lastVerified: "2026-09-01",
    needsInfo: [
      "host GW2 account name",
    ],
    schedule: [
      { day: "Saturday", time: "12:00" },
    ]
  },
];