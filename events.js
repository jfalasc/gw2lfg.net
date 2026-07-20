const events = [
  {
    name: "HoT Meta Train",
    region: "NA",
    username: "Lamshire.3058",
    description: "Hosted by [LEG]! Tangled Depths -> Auric Basin -> Dragon's Stand -> Auric Basin -> Verdant Brink",
    recurring: true,
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
    description: "Hosted by [JMAW]!",
    recurring: true,
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
    description: "Hosted by Convergence Corp!",
    recurring: true,
    schedule: [
      { day: "Tuesday", time: "01:00" },
      { day: "Saturday", time: "18:00" },
    ]
  },
  {
    name: "Convergence CMs",
    region: "NA",
    username: "LilyVelour.8395",
    description: "Hosted by [LILY]!",
    recurring: true,
    schedule: [
      { day: "Tuesday", time: "23:30" },
      { day: "Saturday", time: "20:30" },
    ]
  },
  {
    name: "SotO Meta Train",
    region: "NA",
    username: "LilyVelour.8395",
    description: "Hosted by [LILY]! Skywatch > Amnytas > Nayos",
    recurring: true,
    schedule: [
      { day: "Wednesday", time: "20:30" },
    ]
  },
  {
    name: "SotO Convergence CMs",
    region: "NA",
    username: "MarshAll.3528",
    description: "Hosted by [FB]!",
    recurring: true,
    schedule: [
      { day: "Sunday", time: "01:50" },
    ]
  },
  {
    name: "World Tour Meta Train",
    region: "NA",
    username: "MarshAll.3528",
    description: "Hosted by [FB]! Metas from every expansion",
    recurring: true,
    schedule: [
      { day: "Monday", time: "02:00" },
    ]
  },
  {
    name: "EoD Meta Train",
    region: "NA",
    username: "MarshAll.3528",
    description: "Hosted by [FB]! Seitung Province -> Kaineng City -> Echovald Wilds -> Dragon's End",
    recurring: true,
    schedule: [
      { day: "Tuesday", time: "03:30" },
    ]
  },
  {
    name: "S4 Meta Train",
    region: "NA",
    username: "MarshAll.3528",
    description: "Hosted by [FB]! Every season 4 meta",
    recurring: true,
    schedule: [
      { day: "Saturday", time: "01:45" },
    ]
  },
  {
    name: "Core Meta Train",
    region: "NA",
    username: "Wolfspear.7180",
    description: "Hosted by [BUTR]! Tequatl -> LLA -> Megadestroyer -> Triple Trouble",
    recurring: true,
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
    description: "Times subject to change! Weekends depend on availability! Message Maverick.3574 for details",
    recurring: true,
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
    description: "Hosted by [DBJC]!",
    recurring: true,
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
    description: "Hosted by [SAS]!",
    recurring: true,
    schedule: [
      { day: "Monday", time: "22:00" },
    ]
  },
  {
    name: "SotO Convergence CMs",
    region: "NA",
    username: "Mr Paul.8247",
    description: "Hosted by [SAS]!",
    recurring: true,
    schedule: [
      { day: "Thursday", time: "20:00" },
    ]
  },
  {
    name: "Hero Point Train",
    region: "NA",
    username: "Hempia.5981",
    description: "Hosted by [SIN]!",
    recurring: true,
    schedule: [
      { day: "Saturday", time: "18:00" },
    ]
  },
  {
    name: "Silverwastes RIBA Farm",
    region: "NA",
    username: "EverCursed.9084",
    description: "Hosted by [Sw]!",
    recurring: true,
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
    description: "Crystal Oasis pinata meta hosted by [MEAT]!",
    recurring: true,
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
    description: "Bava Nisos farm train before reset, then meta after reset",
    recurring: true,
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
    description: "Hosted by [AO]!",
    recurring: true,
    schedule: [
      { day: "Saturday", time: "01:30" },
    ]
  },
  {
    name: "HoT Meta Train",
    region: "NA",
    username: "Shazilee.1098",
    description: "Hosted by [SHAZ]! Dragon's Stand & Auric Basin",
    recurring: true,
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
    description: "Hosted by [NOPE]!",
    recurring: true,
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
    description: "Hosted by [DCAP]!",
    recurring: true,
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
    description: "Hosted by [DCAP]!",
    recurring: true,
    schedule: [
      { day: "Thursday", time: "13:00" },
    ]
  },
  {
    name: "Gyala Delve",
    region: "NA",
    username: "Dark Raven.2160",
    description: "Hosted by [DCAP]!",
    recurring: true,
    schedule: [
      { day: "Friday", time: "08:00" },
    ]
  },
  {
    name: "Battle for Lion's Arch",
    region: "NA",
    username: "Dark Raven.2160",
    description: "Hosted by [DCAP]!",
    recurring: true,
    schedule: [
      { day: "Monday", time: "13:00" },
    ]
  },
  {
    name: "Dragonstorm & Dragon's Stand",
    region: "NA",
    username: "Dark Raven.2160",
    description: "Hosted by [DCAP]!",
    recurring: true,
    schedule: [
      { day: "Tuesday", time: "13:00" },
    ]
  },
  {
    name: "SotO & JW Convergence CMs",
    region: "NA",
    username: "darens.2547",
    description: "Hosted by [ZERO]!",
    recurring: true,
    schedule: [
      { day: "Monday", time: "14:00" },
    ]
  },
  {
    name: "Dragon's End & Dragonstorm",
    region: "NA",
    username: "sim.1203",
    description: "Hosted by [Hs]!",
    recurring: true,
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
    description: "Hosted by [ZERO]!",
    recurring: true,
    schedule: [
      { day: "Thursday", time: "15:00" },
    ]
  },
  {
    name: "Griffon Flight Training",
    region: "NA",
    username: "Thy Weeping Willow.6851",
    description: "Hosted by [Wing]! Learn how to get the most out of your griffon!",
    recurring: true,
    schedule: [
      { day: "Sunday", time: "19:30" },
    ]
  },
  {
    name: "Griffon Flight Training",
    region: "NA",
    username: "Thy Weeping Willow.6851",
    description: "Hosted by [Wing]! Learn how to get the most out of your griffon!",
    recurring: true,
    schedule: [
      { day: "Monday", time: "18:30" },
    ]
  },
  {
    name: "Triple Trouble",
    region: "NA",
    username: "CasFamGaming.9843",
    description: "Hosted by [WHAM]!",
    recurring: true,
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
    description: "Hosted by [RNT]!",
    recurring: true,
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
    description: "Hosted by [WILT]!",
    recurring: true,
    schedule: [
      { day: "Wednesday", time: "01:00" },
      { day: "Thursday", time: "01:00" },
    ]
  },
  {
    name: "Convergence CMs",
    region: "NA",
    username: "SoBread.5628",
    description: "Hosted by [COFE]!",
    recurring: true,
    schedule: [
      { day: "Wednesday", time: "05:00" },
      { day: "Friday", time: "05:00" },
    ]
  },
  {
    name: "JW Convergence CMs",
    region: "NA",
    username: "Ohnage.1638",
    description: "Hosted by [uLT]!",
    recurring: true,
    schedule: [
      { day: "Saturday", time: "20:00" },
    ]
  },
  {
    name: "SotO Convergence CMs",
    region: "NA",
    username: "Ohnage.1638",
    description: "Hosted by [uLT]!",
    recurring: true,
    schedule: [
      { day: "Sunday", time: "17:00" },
    ]
  },
  {
    name: "Griffon Flight Training",
    region: "EU",
    username: "Thy Weeping Willow.6851",
    description: "Hosted by [Wing]! Learn how to get the most out of your griffon!",
    recurring: true,
    schedule: [
      { day: "Monday", time: "18:30" },
    ]
  },
  {
    name: "Triple Trouble",
    region: "EU",
    username: "Tanylyla.6397",
    description: "Hosted by the EU TT Discord server: https://discord.com/invite/6YG5CC6",
    recurring: true,
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
    description: "Seitung Province -> Kaineng City -> Echovald Forest -> Dragon's End",
    recurring: true,
    schedule: [
      { day: "Sunday", time: "08:00" },
      { day: "Monday", time: "08:00" },
      { day: "Tuesday", time: "08:00" },
      { day: "Wednesday", time: "08:00" },
      { day: "Thursday", time: "08:00" },
      { day: "Friday", time: "08:00" },
      { day: "Saturday", time: "08:00" },
    ]
  },
  {
    name: "Weekly Rifts",
    region: "EU",
    username: "Platanium.4532",
    description: "Hosted by [Hs]!",
    recurring: true,
    schedule: [
      { day: "Tuesday", time: "17:30" },
    ]
  },
  {
    name: "EoD Meta Train",
    region: "EU",
    username: "Platanium.4532",
    description: "Hosted by [Hs]! Seitung Province -> Kaineng City -> Echovald Forest -> Dragon's End -> Echovald Forest -> Gyala Delve",
    recurring: true,
    schedule: [
      { day: "Sunday", time: "17:30" },
    ]
  },
];