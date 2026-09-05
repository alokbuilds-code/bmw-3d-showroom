# BMW M-Experience | The Ultimate Driving Machine in 3D

[![WebGL](https://img.shields.io/badge/WebGL-Three.js_r128-0066B1?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Web Audio API](https://img.shields.io/badge/Audio-Web_Audio_API_2.0-00E5FF?style=for-the-badge&logo=soundcharts&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Status](https://img.shields.io/badge/Build-Production_Grade-E21A1A?style=for-the-badge&logo=bmw&logoColor=white)](#)
[![Zero Dependency](https://img.shields.io/badge/Dependencies-Zero_Build_Step-success?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-white?style=for-the-badge)](#)

> **An award-winning interactive 3D automotive web experience celebrating Bavarian engineering. Built from scratch with pure HTML5, CSS3, Three.js WebGL, and procedural Web Audio API synthesis.**

---

## ✦ Key Highlights

- **Real-Time Three.js 3D Showroom**: Procedural BMW M-Sport Gran Coupé model with `MeshPhysicalMaterial` metallic paint shaders, clearcoat reflections, carbon fiber roof, dual kidney grilles, and laser headlights.
- **Volumetric Laser Projector Beams**: Dual conical light projection beams piercing through dark tarmac with ground illumination splash discs.
- **Interactive 0-100 km/h Launch Control Simulator**: Stand on Brake + Full Throttle to build **1.80 BAR** turbo boost, lock revs at **4,200 RPM** with antilag combustion pops, and release for tire smoke plumes, screen shake, and a live digital stopwatch sprint.
- **Web Audio Engine 2.0 (Zero External Audio Files)**: Procedurally synthesized starter motor crank, V8 cold start ignition roar, multi-harmonic idle rumble, turbo wastegate flutter (*"stututu"*), and overrun exhaust backfires/pops.
- **Live FFT Audio Waveform Spectrum**: 28-band real-time acoustic equalizer canvas dancing to engine throttle directly inside the telemetry HUD.
- **Scroll-Choreographed 3D Camera**: Fluidly glides through 4 cinematic chapters (*Front 3/4*, *Aero Profile*, *Quad Diffuser*, *Driver Cockpit POV*) synced with live telemetry speed, RPM, and lateral G-force.
- **360° Studio & Color Customizer**: Live paint finish switcher (*Isle of Man Green*, *Marina Bay Blue*, *Frozen Deep Grey Matte*, *Sao Paulo Yellow*, *Fire Red*, *Alpine White*) and forged wheel packages with live MSRP calculation.
- **Verified BMW Fleet Showcase**: High-resolution photography and technical specs for the **BMW M8 Competition**, **BMW M4 Competition G82**, **BMW i7 xDrive60**, **BMW M3 CS**, and **BMW Vision Neue Klasse**.

---

## ✦ Interactive Controls

| Control | Action | Visual / Audio Output |
| :--- | :--- | :--- |
| **ENGINE START / STOP** | Header red pulsing button | Cranks starter motor, fires V8 combustion catch, idles at 850 RPM |
| **HOLD TO REV & BURBLE** | Hero button / Spacebar / Click | Revs to 6,800 RPM with screaming turbo spool, releases with exhaust crackles |
| **LAUNCH CONTROL (0-100)** | Red hero pill button | Opens M Driver Telemetry, builds boost, burns rubber, clocks 0-100 sprint |
| **CAMERA POV DIRECTOR** | Bottom floating pill bar | Instant camera cuts: *Front 3/4*, *Aero Profile*, *Cockpit POV*, *Quad Exhaust*, *360° Drone* |
| **LASER HIGH-BEAM** | HUD circular light icon | Toggles high-intensity laser projector beam width and ground splash discs |
| **STUDIO / MIDNIGHT MODE** | HUD circular moon icon | Switches between high-contrast Midnight Stealth and bright Luxury Studio lighting |
| **360° TURNTABLE** | Drag on canvas / slider | Rotates showroom turntable smoothly with inertia dampening |
| **COLOR SWATCHES** | 360° Studio palette | Updates real-time metallic car paint shader and configurator drawer |

---

## ✦ Tech Stack & Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BMW WEB ARCHITECTURE                     │
├─────────────────┬──────────────────────────┬────────────────┤
│   FRONTEND      │     GRAPHICS (WEBGL)     │     AUDIO      │
├─────────────────┼──────────────────────────┼────────────────┤
│ • Semantic HTML5│ • Three.js (r128)        │ • Web Audio API│
│ • CSS3 Variables│ • MeshPhysicalMaterial   │ • FFT Analyser │
│ • Glassmorphism │ • ACESFilmicToneMapping  │ • WaveShaper   │
│ • Responsive UI │ • Volumetric Projection  │ • BiquadFilter │
│ • JetBrains Mono│ • Particle Smoke Physics │ • Oscillators  │
└─────────────────┴──────────────────────────┴────────────────┘
```

---

## ✦ Repository Structure

```
bmw-m-experience/
├── index.html            # Semantic HTML5 markup, HUD overlays, launch dialog
├── style.css             # Root stylesheet (mirrored)
├── css/
│   ├── style.css         # BMW M-Sport design system & glassmorphic layout
│   └── animations.css    # Launch warp shake, antilag glow, and keyframes
├── js/
│   ├── car-data.js       # Real-world fleet specifications & high-res photography
│   ├── audio-engine.js   # Web Audio V8 synthesizer, exhaust crackles & FFT analyser
│   ├── three-scene.js    # Three.js 3D showroom, volumetric beams & camera presets
│   └── app.js            # Main orchestrator, launch control simulator & spectrum
└── README.md             # Project documentation
```

---

## ✦ Quick Start

This project is built with **zero build tools, bundlers, or package managers**. It runs natively in any modern browser.

### Option 1: Direct File Launch
Simply open `index.html` in any web browser:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Option 2: Local HTTP Server (Recommended for WebGL)
Using Python or Node's `npx serve`:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```
Then navigate to `http://localhost:8000` in your browser.

---

## ✦ Design Philosophy

Designed in adherence to **BMW's Modern Luxury & Motorsport Design Language**:
- **Palette**: Deep Carbon (`#07070a`), Bavarian Light Blue (`#0066b1`), Deep Navy (`#002d62`), M-Red (`#e21a1a`), and Electric Cyan (`#00e5ff`).
- **Typography**: Space Grotesk (avant-garde headlines), Inter (clean UI), and JetBrains Mono (precision telemetry metrics).
- **Lighting**: High-contrast studio keylights with complementary rim illumination mimicking professional automotive photography bays.

---

## ✦ License

Distributed under the **MIT License**. See `LICENSE` for more information.

*Disclaimer: This is an educational, portfolio-grade creative development project celebrating BMW automotive engineering. BMW and the BMW logo are registered trademarks of BMW AG.*
