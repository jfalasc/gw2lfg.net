const events = [
  {
    name: "HoT Meta Train",
    region: "NA",
    username: "GoodJudy.7238",
    description: "Hosted by Unchained Legacy [LEG]! Tangled Depths -> Auric Basin -> Dragon's Stand -> Auric Basin -> Verdant Brink",
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
    description: "Hosted by Jade Maw Brotherhood [JMAW]",
    recurring: true,
    schedule: [
      { day: "Tuesday", time: "02:30" },
      { day: "Thursday", time: "02:30" },
      { day: "Saturday", time: "02:30" }
    ]
  },
  {
    name: "Convergence CMs",
    region: "NA",
    username: "SunMatrix.4168",
    description: "Hosted by Convergence Corp",
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
    description: "Hosted by Cabaret Velour [LILY]",
    recurring: true,
    schedule: [
      { day: "Wednesday", time: "01:00" },
      { day: "Saturday", time: "21:00" },
    ]
  },
  {
    name: "SotO Meta Train",
    region: "NA",
    username: "LilyVelour.8395",
    description: "Hosted by Cabaret Velour [LILY]! Skywatch > Amnytas > Nayos",
    recurring: true,
    schedule: [
      { day: "Wednesday", time: "20:30" },
    ]
  },
  {
    name: "SotO Convergence CMs",
    region: "NA",
    username: "MarshAll.3528",
    description: "Hosted by Firebranders [FB]",
    recurring: true,
    schedule: [
      { day: "Sunday", time: "02:00" },
    ]
  },
  {
    name: "World Tour Meta Train",
    region: "NA",
    username: "MarshAll.3528",
    description: "Hosted by Firebranders [FB]! HoT -> PoF -> S4 -> S5 -> EoD -> SotO -> JW",
    recurring: true,
    schedule: [
      { day: "Monday", time: "02:00" },
    ]
  },
  {
    name: "EoD Meta Train",
    region: "NA",
    username: "MarshAll.3528",
    description: "Hosted by Firebranders [FB]! Seitung Province -> Kaineng City -> Echovald Wilds -> Dragon's End",
    recurring: true,
    schedule: [
      { day: "Tuesday", time: "03:30" },
    ]
  },
  {
    name: "S4 Meta Train",
    region: "NA",
    username: "MarshAll.3528",
    description: "Hosted by Firebranders [FB]! Istan -> Jahai/Sandswept -> Istan -> Thunderhead -> Jahai -> Jahai/Sandswept > Thunderhead -> Kourna/Jahai/Sandswept",
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
    username: "Shiv Deeviant.8072.3574",
    description: "Hosted by [DBJC]",
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
    description: "Hosted by Silverwastes Anonymous [SAS]",
    recurring: true,
    schedule: [
      { day: "Monday", time: "22:00" },
    ]
  },
  {
    name: "SotO Convergence CMs",
    region: "NA",
    username: "Mr Paul.8247",
    description: "Hosted by Silverwastes Anonymous [SAS]",
    recurring: true,
    schedule: [
      { day: "Thursday", time: "20:00" },
    ]
  },
  {
    name: "PoF/S4 Bounties",
    region: "NA",
    username: "Hempia.5981",
    description: "Hosted by [SIN]",
    recurring: true,
    schedule: [
      { day: "Wednesday", time: "23:00" },
    ]
  },
  {
    name: "HoT HP Train",
    region: "NA",
    username: "Hempia.5981",
    description: "Hosted by [SIN]",
    recurring: true,
    schedule: [
      { day: "Saturday", time: "18:00" },
    ]
  },
  {
    name: "Silverwastes RIBA Farm",
    region: "NA",
    username: "EverCursed.9084",
    description: "Hosted by [Sw]",
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
    name: "PoF Meta Train",
    region: "NA",
    username: "OverRealm.3542",
    description: "Hosted by [AO]",
    recurring: true,
    schedule: [
      { day: "Saturday", time: "03:30" },
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
];