/**
 * Real-World BMW Fleet Specifications & Photography Assets
 * Features verified technical specifications and high-resolution automotive imagery.
 */

const BMW_CARS = [
  {
    id: "m8-competition",
    name: "BMW M8 Competition Gran Coupé",
    subtitle: "The Ultimate Four-Door Supercar",
    series: "M Performance",
    category: "m-power",
    heroImage: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
    ],
    turntableAngleBase: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=85",
    badge: "M POWER FLAGSHIP",
    price: "$138,800",
    engine: "4.4-liter BMW M TwinPower Turbo V8",
    horsepower: "617 HP @ 6,000 RPM",
    torque: "750 Nm (553 lb-ft)",
    acceleration: "3.0s",
    accelerationUnit: "0-100 km/h",
    topSpeed: "305 km/h",
    topSpeedLabel: "190 mph (M Driver's Pkg)",
    transmission: "8-Speed M Steptronic with Drivelogic",
    drivetrain: "M xDrive with 2WD Track Mode",
    fuelEfficiency: "15 / 22 mpg",
    curbWeight: "1,980 kg",
    defaultColor: "#002D62",
    colorName: "Marina Bay Blue Metallic",
    availableColors: [
      { name: "Marina Bay Blue Metallic", hex: "#002D62", finish: "metallic" },
      { name: "Frozen Deep Grey Matte", hex: "#22252a", finish: "matte" },
      { name: "Isle of Man Green Metallic", hex: "#0e3a2f", finish: "metallic" },
      { name: "Alpine White", hex: "#f0f2f5", finish: "gloss" },
      { name: "Fire Red Metallic", hex: "#8b0e14", finish: "metallic" }
    ],
    features: [
      "Adaptive M Suspension Professional with active roll stabilization",
      "M Carbon Ceramic Brakes with high-gloss gold calipers",
      "BMW Live Cockpit Professional with 12.3\" dual curved display",
      "Bowers & Wilkins Diamond Surround Sound System (16 speakers)"
    ],
    description: "The peak of luxury meets ruthless performance. Powered by the 4.4L high-revving TwinPower Turbo V8 pushing 617 horsepower through intelligent M xDrive all-wheel drive, the M8 Competition Gran Coupé redefines grand touring excellence."
  },
  {
    id: "m4-competition",
    name: "BMW M4 Competition Coupé G82",
    subtitle: "Precision Engineering. Pure Adrenaline.",
    series: "M Performance",
    category: "m-power",
    heroImage: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
    ],
    turntableAngleBase: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=85",
    badge: "TRACK ICON",
    price: "$82,200",
    engine: "3.0-liter BMW M TwinPower Turbo Inline-6",
    horsepower: "503 HP @ 6,250 RPM",
    torque: "650 Nm (479 lb-ft)",
    acceleration: "3.4s",
    accelerationUnit: "0-100 km/h",
    topSpeed: "290 km/h",
    topSpeedLabel: "180 mph",
    transmission: "8-Speed M Steptronic with Drivelogic",
    drivetrain: "Rear-Wheel Drive / M xDrive Available",
    fuelEfficiency: "16 / 23 mpg",
    curbWeight: "1,775 kg",
    defaultColor: "#0e3a2f",
    colorName: "Isle of Man Green Metallic",
    availableColors: [
      { name: "Isle of Man Green Metallic", hex: "#0e3a2f", finish: "metallic" },
      { name: "Sao Paulo Yellow", hex: "#d5df00", finish: "gloss" },
      { name: "Toronto Red Metallic", hex: "#a4161a", finish: "metallic" },
      { name: "Portimao Blue", hex: "#0047AB", finish: "metallic" },
      { name: "Black Sapphire Metallic", hex: "#0d0e11", finish: "metallic" }
    ],
    features: [
      "M Carbon Bucket Seats with illuminated M badging",
      "M Carbon exterior styling with high-downforce rear winglet",
      "M Traction Control with 10-stage variable drift analyzer",
      "M Compound high-performance brake system"
    ],
    description: "Sculpted for track dominance with its iconic frameless vertical kidney grille, carbon fiber roof, and high-revving 503 HP twin-turbo inline-six that screams all the way to 7,200 RPM."
  },
  {
    id: "i7-xdrive60",
    name: "BMW i7 xDrive60 Sedan",
    subtitle: "Forwardism. Electric Luxury Redefined.",
    series: "BMW i All-Electric",
    category: "electric-i",
    heroImage: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80"
    ],
    turntableAngleBase: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1400&q=85",
    badge: "FLAGSHIP ELECTRIC",
    price: "$119,300",
    engine: "Dual 5th Generation BMW eDrive Electric Motors",
    horsepower: "536 HP (Instant Electric)",
    torque: "745 Nm (549 lb-ft)",
    acceleration: "4.5s",
    accelerationUnit: "0-100 km/h",
    topSpeed: "240 km/h",
    topSpeedLabel: "149 mph (electronically limited)",
    transmission: "Single-Speed Automatic eDrive",
    drivetrain: "Intelligent Dual-Motor Electric All-Wheel Drive",
    fuelEfficiency: "318 Miles Range (EPA)",
    curbWeight: "2,640 kg",
    defaultColor: "#1a1d24",
    colorName: "Two-Tone Black Sapphire / Oxide Grey",
    availableColors: [
      { name: "Black Sapphire Metallic", hex: "#111317", finish: "metallic" },
      { name: "Oxide Grey Metallic", hex: "#7a7b80", finish: "metallic" },
      { name: "Mineral White Metallic", hex: "#e5e7eb", finish: "gloss" },
      { name: "Tanzanite Blue II", hex: "#0b1d3a", finish: "metallic" },
      { name: "Aventurin Red", hex: "#5b0d18", finish: "metallic" }
    ],
    features: [
      "BMW Crystal Headlights with Swarovski glass elements",
      "31.3\" 8K BMW Theater Screen with Amazon Fire TV built-in",
      "Executive Lounge seating with continuous calf rest & massage",
      "BMW Interaction Bar with faceted ambient crystal glass"
    ],
    description: "The pinnacle of electric luxury motoring. Featuring an unprecedented 31.3\" theater screen, Swarovski crystal lighting, silent dual-motor thrust, and over 300 miles of whisper-quiet range."
  },
  {
    id: "m3-cs",
    name: "BMW M3 CS Limited Edition",
    subtitle: "Pure Motorsport DNA. Road Legal Weapon.",
    series: "M Performance",
    category: "m-power",
    heroImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
    ],
    turntableAngleBase: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1400&q=85",
    badge: "LIMITED COMPETITION SPORT",
    price: "$118,700",
    engine: "3.0-liter BMW M TwinPower Turbo High-Output I6",
    horsepower: "543 HP @ 6,250 RPM",
    torque: "650 Nm (479 lb-ft)",
    acceleration: "3.2s",
    accelerationUnit: "0-100 km/h",
    topSpeed: "302 km/h",
    topSpeedLabel: "188 mph",
    transmission: "8-Speed M Steptronic with Drivelogic",
    drivetrain: "M xDrive with Active M Differential",
    fuelEfficiency: "15 / 22 mpg",
    curbWeight: "1,755 kg (Lightweight Carbon Body)",
    defaultColor: "#d2d6dc",
    colorName: "Frozen Solid White",
    availableColors: [
      { name: "Frozen Solid White", hex: "#d2d6dc", finish: "matte" },
      { name: "Signal Green", hex: "#00c853", finish: "gloss" },
      { name: "Brooklyn Grey Metallic", hex: "#4b5563", finish: "metallic" },
      { name: "Black Sapphire", hex: "#090a0d", finish: "metallic" }
    ],
    features: [
      "Carbon-fiber reinforced plastic (CFRP) hood, splitter & diffuser",
      "Yellow GT-racing daytime running lights (DRLs)",
      "Titanium rear silencer generating racecar acoustics",
      "Cast aluminum M strut brace for extreme torsional rigidity"
    ],
    description: "Forged on the Nürburgring Nordschleife. 543 horsepower, 75 pounds of weight shed through carbon fiber composites, and racing suspension dialed for surgical apex precision."
  },
  {
    id: "vision-neue-klasse",
    name: "BMW Vision Neue Klasse",
    subtitle: "The Dawn of a New Automotive Era",
    series: "Concept & Future",
    category: "concept",
    heroImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1920&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
    ],
    turntableAngleBase: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=85",
    badge: "FUTURE OF MOBILITY",
    price: "Concept Vehicle",
    engine: "6th Gen BMW eDrive with 800V High-Density Architecture",
    horsepower: "650+ HP Equivalent",
    torque: "900 Nm Instantaneous",
    acceleration: "2.8s (Projected)",
    accelerationUnit: "0-100 km/h",
    topSpeed: "260 km/h",
    topSpeedLabel: "162 mph",
    transmission: "Intelligent Direct Drive",
    drivetrain: "Quad-Motor Electric Torque Vectoring",
    fuelEfficiency: "+30% Range / +30% Faster Charging",
    curbWeight: "Ultra-Lightweight Circular Architecture",
    defaultColor: "#f3f4f6",
    colorName: "Luminous Joy Metallic",
    availableColors: [
      { name: "Luminous Joy Metallic", hex: "#eef2f6", finish: "metallic" },
      { name: "Electric Cyan", hex: "#00e5ff", finish: "metallic" },
      { name: "Deep Obsidian", hex: "#0a0c10", finish: "matte" }
    ],
    features: [
      "BMW Panoramic Vision projecting full windshield interactive HUD",
      "100% Secondary raw materials with circular zero-carbon lifecycle",
      "Next-generation cylindrical battery cells with 20% higher density",
      "Interactive 3D central display with gesture & eye-tracking"
    ],
    description: "A visionary transformation of the Ultimate Driving Machine. Neue Klasse introduces electric, digital, and circular design principles that will define every future BMW generation."
  }
];

// Technical telemetry milestone data for scroll story points
const BMW_TELEMETRY_POINTS = [
  {
    step: 0,
    title: "M TwinPower Turbocharged",
    speed: "0",
    rpm: "850",
    gear: "P",
    gForce: "0.0G",
    hudStatus: "SYSTEM CHECK: OK",
    note: "Engine primed at optimal operating temperatures. Launch control ready."
  },
  {
    step: 1,
    title: "Aerodynamic Downforce Vectoring",
    speed: "124",
    rpm: "4,200",
    gear: "D3",
    gForce: "0.9G",
    hudStatus: "AERO SPOILER DEPLOYED",
    note: "Active kidney slats open for maximum intercooler airflow. Active rear diffuser trims drag."
  },
  {
    step: 2,
    title: "M xDrive Apex Traction",
    speed: "248",
    rpm: "6,600",
    gear: "D5",
    gForce: "1.45G",
    hudStatus: "M DIFFERENTIAL: 100% LOCK",
    note: "Active M differential delivers razor-sharp torque vectoring across rear axle."
  },
  {
    step: 3,
    title: "Terminal Velocity Mastery",
    speed: "305",
    rpm: "7,200",
    gear: "D7",
    gForce: "1.2G",
    hudStatus: "M DRIVER'S PKG ACTIVE",
    note: "Quad-tailpipe sport exhaust valves wide open. 617 horses at full singing pitch."
  }
];

// Wheel package selections
const WHEEL_PACKAGES = [
  {
    id: "m-star-813m",
    name: "20\"/21\" M Star-Spoke 813M Bi-Color",
    price: "+$0 (Standard)",
    rimColor: "#333b47",
    caliperColor: "#0055ff",
    accent: "Burnished Diamond Cut"
  },
  {
    id: "m-frozen-gold",
    name: "20\" M Performance 1000M Frozen Gold",
    price: "+$4,200",
    rimColor: "#cba135",
    caliperColor: "#e21a1a",
    accent: "Motorsport Champagne Gold"
  },
  {
    id: "m-carbon-ceramic",
    name: "21\" M Jet Black Forged with Gold Calipers",
    price: "+$8,500",
    rimColor: "#0d0f12",
    caliperColor: "#e6a100",
    accent: "Carbon Ceramic Brake Pack"
  }
];

window.BMW_CARS = BMW_CARS;
window.BMW_TELEMETRY_POINTS = BMW_TELEMETRY_POINTS;
window.WHEEL_PACKAGES = WHEEL_PACKAGES;
