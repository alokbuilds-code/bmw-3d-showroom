/**
 * Main Application Orchestrator for BMW 3D Web Experience 2.0
 * Features real-time audio FFT spectrum visualization, Launch Control simulator,
 * camera director presets, atmospheric studio switching, high-beam laser controls,
 * scrollytelling telemetry, and 360° customizer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize 3D WebGL Scene
  let threeScene = null;
  try {
    threeScene = new BMWThreeScene('bmw-webgl-canvas');
  } catch (err) {
    console.error("ThreeScene initialization error:", err);
  }

  // 2. Initialize Web Audio Engine 2.0
  const audioEngine = new BMWAudioEngine();

  // State Management
  let activeCar = BMW_CARS[0]; // M8 Competition default
  let selectedWheelPkg = WHEEL_PACKAGES[0];
  let basePrice = 138800;
  let addedOptionsPrice = 0;
  let isHighBeams = false;
  let currentAtmosphere = 'midnight';

  // Launch Control Simulator State
  let isBrakeHeld = false;
  let isThrottleHeld = false;
  let isLaunching = false;
  let launchTimerInterval = null;
  let launchStartTime = 0;

  // DOM Elements
  const header = document.getElementById('bmw-header');
  const cursorGlow = document.getElementById('cursor-glow');
  const launchWarpOverlay = document.getElementById('launch-warp-overlay');
  const engineStartBtn = document.getElementById('engine-start-btn');
  const engineBtnText = document.getElementById('engine-btn-text');
  const revPedalBtn = document.getElementById('rev-pedal-btn');
  const launchControlBtn = document.getElementById('launch-control-btn');
  
  // HUD Elements
  const hudSpeed = document.getElementById('hud-speed');
  const hudRpm = document.getElementById('hud-rpm');
  const rpmBarFill = document.getElementById('rpm-bar-fill');
  const hudGear = document.getElementById('hud-gear');
  const hudGforce = document.getElementById('hud-gforce');
  const hudExhaustValves = document.getElementById('hud-exhaust-valves');
  const hudBoostVal = document.getElementById('hud-boost-val');
  const boostBarFill = document.getElementById('boost-bar-fill');
  const headlightToggleBtn = document.getElementById('headlight-toggle-btn');
  const atmosphereToggleBtn = document.getElementById('atmosphere-toggle-btn');
  const audioSpectrumCanvas = document.getElementById('hud-audio-spectrum');
  const spectrumCtx = audioSpectrumCanvas ? audioSpectrumCanvas.getContext('2d') : null;

  // Camera Director Buttons
  const camPresetBtns = document.querySelectorAll('.cam-preset-btn');

  // Launch Modal Elements
  const launchModal = document.getElementById('launch-modal-overlay');
  const launchCloseBtn = document.getElementById('launch-close-btn');
  const launchStepTitle = document.getElementById('launch-step-title');
  const launchStatusDesc = document.getElementById('launch-status-desc');
  const launchTimerDisplay = document.getElementById('launch-timer-display');
  const brakePedalBtn = document.getElementById('brake-pedal-btn');
  const throttlePedalBtn = document.getElementById('throttle-pedal-btn');

  // Scrolly Story Elements
  const scrollySection = document.getElementById('dynamics');
  const storyStepBadge = document.getElementById('story-step-badge');
  const storyTitle = document.getElementById('story-title');
  const storyDesc = document.getElementById('story-desc');
  const storyStatVal1 = document.getElementById('story-stat-val-1');
  const storyStatVal2 = document.getElementById('story-stat-val-2');

  // Fleet & Customizer Elements
  const fleetGrid = document.getElementById('fleet-grid');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const colorSwatchesGrid = document.getElementById('color-swatches-grid');
  const wheelOptionsList = document.getElementById('wheel-options-list');
  const selectedPaintName = document.getElementById('selected-paint-name');
  const selectedWheelName = document.getElementById('selected-wheel-name');
  const configTotalPrice = document.getElementById('config-total-price');
  const turntableSlider = document.getElementById('turntable-slider');
  const turntableViewport = document.getElementById('turntable-viewport');

  // Reservation Modal Elements
  const reserveModal = document.getElementById('reserve-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const openConfigBtn = document.getElementById('open-config-btn');
  const customizerOrderBtn = document.getElementById('customizer-order-btn');

  // ==========================================================================
  // CURSOR AMBIENT GLOW
  // ==========================================================================
  if (cursorGlow) {
    window.addEventListener('pointermove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // ==========================================================================
  // HEADER SCROLL & NAV LINKS
  // ==========================================================================
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateNavActiveOnScroll();
    handleScrollyChoreography();
  });

  function updateNavActiveOnScroll() {
    const sections = ['hero', 'dynamics', 'fleet', 'customizer', 'heritage'];
    const scrollPos = window.scrollY + 200;

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      }
    });
  }

  // ==========================================================================
  // CAMERA DIRECTOR PRESET BUTTONS
  // ==========================================================================
  camPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      camPresetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const preset = btn.getAttribute('data-cam');
      if (threeScene) {
        threeScene.setCameraPreset(preset);
      }
    });
  });

  // ==========================================================================
  // HEADLIGHT & ATMOSPHERE TOGGLES
  // ==========================================================================
  if (headlightToggleBtn) {
    headlightToggleBtn.addEventListener('click', () => {
      isHighBeams = !isHighBeams;
      headlightToggleBtn.style.color = isHighBeams ? 'var(--bmw-electric-cyan)' : 'var(--text-silver)';
      headlightToggleBtn.style.boxShadow = isHighBeams ? '0 0 12px var(--bmw-electric-cyan)' : 'none';
      if (threeScene) {
        threeScene.setHeadlightsHigh(isHighBeams);
      }
    });
  }

  if (atmosphereToggleBtn) {
    atmosphereToggleBtn.addEventListener('click', () => {
      currentAtmosphere = currentAtmosphere === 'midnight' ? 'studio' : 'midnight';
      atmosphereToggleBtn.style.color = currentAtmosphere === 'studio' ? '#ffaa00' : 'var(--text-silver)';
      if (threeScene) {
        threeScene.setAtmosphereMode(currentAtmosphere);
      }
    });
  }

  // ==========================================================================
  // WEB AUDIO ENGINE INTEGRATION & AUDIO SPECTRUM
  // ==========================================================================
  audioEngine.onStateChange = (state) => {
    if (state === 'starting') {
      engineBtnText.textContent = 'CRANKING...';
      engineStartBtn.classList.remove('running');
    } else if (state === 'running') {
      engineBtnText.textContent = 'ENGINE STOP';
      engineStartBtn.classList.add('running');
      hudExhaustValves.textContent = 'OPEN (SPORT)';
      hudExhaustValves.style.color = 'var(--bmw-electric-cyan)';
    } else {
      engineBtnText.textContent = 'ENGINE START';
      engineStartBtn.classList.remove('running');
      hudExhaustValves.textContent = 'CLOSED';
      hudExhaustValves.style.color = '#fff';
      hudRpm.textContent = '0';
      rpmBarFill.style.width = '0%';
      hudBoostVal.textContent = '0.00 BAR';
      boostBarFill.style.width = '0%';
    }
  };

  audioEngine.onRPMUpdate = (rpm) => {
    hudRpm.textContent = rpm.toLocaleString();
    const percent = Math.min(100, Math.max(0, (rpm / 7500) * 100));
    rpmBarFill.style.width = `${percent}%`;

    if (rpm > 6500) {
      rpmBarFill.classList.add('redline');
    } else {
      rpmBarFill.classList.remove('redline');
    }

    // Emit tire smoke if revving above 5,000 RPM while stationary
    if (rpm > 5000 && threeScene) {
      threeScene.emitTireSmoke(0.85);
    }
  };

  audioEngine.onBoostUpdate = (boost) => {
    hudBoostVal.textContent = `${boost.toFixed(2)} BAR`;
    const boostPct = Math.min(100, (boost / 1.85) * 100);
    boostBarFill.style.width = `${boostPct}%`;
  };

  engineStartBtn.addEventListener('click', () => {
    audioEngine.toggleEngine();
  });

  // Rev Pedal (Hold to Rev)
  const startRevving = () => {
    audioEngine.revThrottle(6800);
    revPedalBtn.style.transform = 'scale(0.95)';
    if (threeScene) {
      threeScene.emitTireSmoke(1.0);
    }
  };

  const stopRevving = () => {
    audioEngine.releaseThrottle();
    revPedalBtn.style.transform = 'scale(1)';
  };

  revPedalBtn.addEventListener('mousedown', startRevving);
  revPedalBtn.addEventListener('mouseup', stopRevving);
  revPedalBtn.addEventListener('mouseleave', stopRevving);
  revPedalBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startRevving(); });
  revPedalBtn.addEventListener('touchend', stopRevving);

  // Real-time Audio Spectrum Rendering Loop
  function renderAudioSpectrum() {
    requestAnimationFrame(renderAudioSpectrum);
    if (!spectrumCtx || !audioSpectrumCanvas) return;

    const width = audioSpectrumCanvas.width;
    const height = audioSpectrumCanvas.height;
    spectrumCtx.clearRect(0, 0, width, height);

    const data = audioEngine.getFrequencyData();
    if (!data || !audioEngine.isRunning) {
      // Gentle idle wave baseline
      spectrumCtx.fillStyle = 'rgba(0, 102, 177, 0.15)';
      for (let i = 0; i < 28; i++) {
        spectrumCtx.fillRect(i * 10, height - 3, 6, 2);
      }
      return;
    }

    const barCount = 28;
    const barWidth = 7;
    const barGap = 3;

    for (let i = 0; i < barCount; i++) {
      const val = data[i] || 0;
      const barHeight = Math.max(2, (val / 255) * height);
      const x = i * (barWidth + barGap);
      const y = height - barHeight;

      const grad = spectrumCtx.createLinearGradient(0, height, 0, 0);
      grad.addColorStop(0, '#0066b1');
      grad.addColorStop(0.7, '#00e5ff');
      grad.addColorStop(1, '#ff3344');

      spectrumCtx.fillStyle = grad;
      spectrumCtx.fillRect(x, y, barWidth, barHeight);
    }
  }
  renderAudioSpectrum();

  // ==========================================================================
  // LAUNCH CONTROL SIMULATOR
  // ==========================================================================
  if (launchControlBtn) {
    launchControlBtn.addEventListener('click', () => {
      openLaunchModal();
    });
  }

  function openLaunchModal() {
    launchModal.classList.add('open');
    resetLaunchState();
  }

  function closeLaunchModal() {
    launchModal.classList.remove('open');
    resetLaunchState();
  }

  if (launchCloseBtn) {
    launchCloseBtn.addEventListener('click', closeLaunchModal);
  }

  function resetLaunchState() {
    isBrakeHeld = false;
    isThrottleHeld = false;
    isLaunching = false;
    clearInterval(launchTimerInterval);
    launchTimerDisplay.textContent = '3.00s';
    launchStepTitle.textContent = 'PREPARE LAUNCH CONTROL';
    launchStatusDesc.textContent = 'Step on Brake + Throttle to prime TwinPower Turbo boost.';
    brakePedalBtn.classList.remove('active');
    throttlePedalBtn.classList.remove('active');
    document.body.classList.remove('screen-shake');
    launchWarpOverlay.classList.remove('active');
  }

  // Brake Pedal Events
  const pressBrake = () => {
    if (isLaunching) return;
    isBrakeHeld = true;
    brakePedalBtn.classList.add('active');
    checkLaunchPrimed();
  };

  const releaseBrake = () => {
    if (!isBrakeHeld) return;
    isBrakeHeld = false;
    brakePedalBtn.classList.remove('active');

    // Trigger Launch if Throttle is held and Boost was built!
    if (isThrottleHeld && !isLaunching) {
      executeLaunch();
    }
  };

  brakePedalBtn.addEventListener('mousedown', pressBrake);
  brakePedalBtn.addEventListener('mouseup', releaseBrake);
  brakePedalBtn.addEventListener('touchstart', (e) => { e.preventDefault(); pressBrake(); });
  brakePedalBtn.addEventListener('touchend', releaseBrake);

  // Throttle Pedal Events
  const pressThrottle = () => {
    if (isLaunching) return;
    isThrottleHeld = true;
    throttlePedalBtn.classList.add('active');
    checkLaunchPrimed();
  };

  const releaseThrottle = () => {
    isThrottleHeld = false;
    throttlePedalBtn.classList.remove('active');
    if (!isLaunching) {
      audioEngine.releaseThrottle();
      resetLaunchState();
    }
  };

  throttlePedalBtn.addEventListener('mousedown', pressThrottle);
  throttlePedalBtn.addEventListener('mouseup', releaseThrottle);
  throttlePedalBtn.addEventListener('touchstart', (e) => { e.preventDefault(); pressThrottle(); });
  throttlePedalBtn.addEventListener('touchend', releaseThrottle);

  function checkLaunchPrimed() {
    if (isBrakeHeld && isThrottleHeld && !isLaunching) {
      audioEngine.engageLaunchControl();
      launchStepTitle.textContent = 'BOOST PRIMED: 1.8 BAR!';
      launchStepTitle.style.color = 'var(--bmw-red)';
      launchStatusDesc.textContent = 'REVS LOCKED AT 4,200 RPM. RELEASE BRAKE TO LAUNCH!';

      if (threeScene) {
        threeScene.emitTireSmoke(1.4);
      }
    }
  }

  function executeLaunch() {
    isLaunching = true;
    launchStepTitle.textContent = 'LAUNCHED! FULL POWER!';
    launchStepTitle.style.color = 'var(--bmw-electric-cyan)';
    launchStatusDesc.textContent = 'M xDrive Vectoring 100% Torque. Launch sprint active!';

    // Screen Shake & Warp Lines
    document.body.classList.add('screen-shake');
    launchWarpOverlay.classList.add('active');

    // 3D Camera punch & tire smoke burst
    if (threeScene) {
      threeScene.triggerLaunchPunch();
      threeScene.emitTireSmoke(2.0);
      threeScene.setBrakeHeat(1.0);
    }

    audioEngine.releaseLaunchControl();

    // 0-100 km/h Digital Sprint Stopwatch
    let currentSpeed = 0;
    const targetSprintTime = 2.98; // M8 Competition official
    launchStartTime = performance.now();

    launchTimerInterval = setInterval(() => {
      const elapsed = (performance.now() - launchStartTime) / 1000;
      launchTimerDisplay.textContent = `${elapsed.toFixed(2)}s`;

      currentSpeed = Math.min(100, Math.floor((elapsed / targetSprintTime) * 100));
      hudSpeed.textContent = currentSpeed;
      hudGear.textContent = elapsed < 1.2 ? 'D1' : (elapsed < 2.2 ? 'D2' : 'D3');
      hudGforce.textContent = (1.45 - (elapsed * 0.15)).toFixed(2) + ' G';

      if (elapsed >= targetSprintTime) {
        clearInterval(launchTimerInterval);
        finishLaunch(targetSprintTime);
      }
    }, 30);
  }

  function finishLaunch(time) {
    document.body.classList.remove('screen-shake');
    launchWarpOverlay.classList.remove('active');
    hudSpeed.textContent = "100";
    launchStepTitle.textContent = "0-100 KM/H ACHIEVED!";
    launchStatusDesc.textContent = `Official Sprint Time: ${time} seconds. Motorsport Benchmark.`;
    
    setTimeout(() => {
      isLaunching = false;
    }, 1500);
  }

  // ==========================================================================
  // SCROLLYTELLING & TELEMETRY SYNC
  // ==========================================================================
  function handleScrollyChoreography() {
    if (!scrollySection || !threeScene) return;

    const sectionTop = scrollySection.offsetTop;
    const sectionHeight = scrollySection.offsetHeight;
    const scrollY = window.scrollY;

    const progress = (scrollY - sectionTop) / (sectionHeight - window.innerHeight);
    const clamped = Math.max(0, Math.min(1, progress));

    threeScene.updateScroll(clamped);

    const chapterIdx = Math.min(3, Math.floor(clamped * 4));
    const point = BMW_TELEMETRY_POINTS[chapterIdx];

    if (point && !isLaunching) {
      storyStepBadge.textContent = `CHAPTER 0${chapterIdx + 1} / 04`;
      storyTitle.textContent = point.title;
      storyDesc.textContent = point.note;

      hudSpeed.textContent = point.speed;
      hudGear.textContent = point.gear;
      hudGforce.textContent = point.gForce;

      if (!audioEngine.isRunning) {
        hudRpm.textContent = point.rpm;
        const rpmNum = parseInt(point.rpm.replace(',', '')) || 0;
        rpmBarFill.style.width = `${Math.min(100, (rpmNum / 7500) * 100)}%`;
      }

      if (chapterIdx === 0) {
        storyStatVal1.textContent = "617 HP";
        storyStatVal2.textContent = "3.0 SEC";
      } else if (chapterIdx === 1) {
        storyStatVal1.textContent = "124 KM/H";
        storyStatVal2.textContent = "0.9 G";
      } else if (chapterIdx === 2) {
        storyStatVal1.textContent = "248 KM/H";
        storyStatVal2.textContent = "1.45 G";
      } else {
        storyStatVal1.textContent = "305 KM/H";
        storyStatVal2.textContent = "7,200 RPM";
      }
    }
  }

  // ==========================================================================
  // FLEET SHOWCASE RENDERING & FILTERING
  // ==========================================================================
  function renderFleet(filter = 'all') {
    fleetGrid.innerHTML = '';

    const filtered = filter === 'all' 
      ? BMW_CARS 
      : BMW_CARS.filter(car => car.category === filter);

    filtered.forEach(car => {
      const card = document.createElement('div');
      card.className = 'fleet-card';
      card.innerHTML = `
        <div class="card-media-wrap">
          <img src="${car.heroImage}" alt="${car.name}" class="card-img" loading="lazy">
          <span class="card-badge">${car.badge}</span>
          <span class="card-price">${car.price}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${car.name}</h3>
          <p class="card-subtitle">${car.subtitle}</p>
          
          <div class="card-specs-row">
            <div class="mini-spec">
              <span class="mini-spec-num">${car.horsepower.split(' ')[0]}</span>
              <span class="mini-spec-label">HP Power</span>
            </div>
            <div class="mini-spec">
              <span class="mini-spec-num">${car.acceleration}</span>
              <span class="mini-spec-label">${car.accelerationUnit}</span>
            </div>
            <div class="mini-spec">
              <span class="mini-spec-num">${car.topSpeed.split(' ')[0]}</span>
              <span class="mini-spec-label">Top km/h</span>
            </div>
          </div>

          <p style="font-size: 0.84rem; color: var(--text-dim); line-height: 1.5; margin-bottom: 20px;">
            ${car.description.substring(0, 115)}...
          </p>

          <div class="card-footer">
            <button class="btn-outline inspect-3d-btn" data-id="${car.id}">
              <span>Inspect in 3D</span>
            </button>
            <button class="btn-primary reserve-car-btn" data-id="${car.id}">
              <span>Build & Order</span>
            </button>
          </div>
        </div>
      `;

      fleetGrid.appendChild(card);
    });

    document.querySelectorAll('.inspect-3d-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        selectCarForCustomizer(id);
        document.getElementById('customizer').scrollIntoView({ behavior: 'smooth' });
      });
    });

    document.querySelectorAll('.reserve-car-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        selectCarForCustomizer(id);
        openReservationModal();
      });
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderFleet(filter);
    });
  });

  renderFleet('all');

  // ==========================================================================
  // 360° CUSTOMIZER STUDIO
  // ==========================================================================
  function selectCarForCustomizer(carId) {
    const found = BMW_CARS.find(c => c.id === carId);
    if (!found) return;
    activeCar = found;

    if (threeScene) {
      threeScene.setCarColor(activeCar.defaultColor);
    }
    selectedPaintName.textContent = activeCar.colorName;

    const parsedBase = parseInt(activeCar.price.replace(/[^0-9]/g, '')) || 120000;
    basePrice = parsedBase;
    updatePriceSummary();

    buildColorSwatches();
  }

  function buildColorSwatches() {
    colorSwatchesGrid.innerHTML = '';
    activeCar.availableColors.forEach((col, idx) => {
      const swatch = document.createElement('div');
      swatch.className = `color-swatch ${idx === 0 ? 'active' : ''}`;
      swatch.style.backgroundColor = col.hex;
      swatch.title = `${col.name} (${col.finish})`;

      swatch.addEventListener('click', () => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        selectedPaintName.textContent = col.name;
        if (threeScene) {
          threeScene.setCarColor(col.hex);
        }
      });

      colorSwatchesGrid.appendChild(swatch);
    });
  }

  function buildWheelOptions() {
    wheelOptionsList.innerHTML = '';
    WHEEL_PACKAGES.forEach((pkg, idx) => {
      const opt = document.createElement('div');
      opt.className = `wheel-opt ${idx === 0 ? 'active' : ''}`;
      opt.innerHTML = `
        <span class="wheel-opt-name">${pkg.name}</span>
        <span class="wheel-opt-price">${pkg.price}</span>
      `;

      opt.addEventListener('click', () => {
        document.querySelectorAll('.wheel-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        selectedWheelPkg = pkg;
        selectedWheelName.textContent = pkg.name;

        if (threeScene) {
          threeScene.setWheelFinish(pkg.rimColor, pkg.caliperColor);
        }

        if (pkg.id === 'm-frozen-gold') addedOptionsPrice = 4200;
        else if (pkg.id === 'm-carbon-ceramic') addedOptionsPrice = 8500;
        else addedOptionsPrice = 0;

        updatePriceSummary();
      });

      wheelOptionsList.appendChild(opt);
    });
  }

  function updatePriceSummary() {
    const total = basePrice + addedOptionsPrice;
    configTotalPrice.textContent = `$${total.toLocaleString()}`;
  }

  if (turntableSlider) {
    turntableSlider.addEventListener('input', (e) => {
      if (threeScene) {
        threeScene.turntableRotation = parseFloat(e.target.value);
      }
    });
  }

  if (turntableViewport) {
    turntableViewport.addEventListener('mouseenter', () => {
      const canvasCont = document.getElementById('canvas-container');
      if (canvasCont) canvasCont.classList.add('interactive');
    });
    turntableViewport.addEventListener('mouseleave', () => {
      const canvasCont = document.getElementById('canvas-container');
      if (canvasCont) canvasCont.classList.remove('interactive');
    });
  }

  buildColorSwatches();
  buildWheelOptions();

  // ==========================================================================
  // MODAL RESERVATION SYSTEM
  // ==========================================================================
  function openReservationModal() {
    const modalSummaryModel = document.getElementById('modal-summary-model');
    const modalSummaryPaint = document.getElementById('modal-summary-paint');
    const modalSummaryWheels = document.getElementById('modal-summary-wheels');
    const modalSummaryPrice = document.getElementById('modal-summary-price');

    modalSummaryModel.textContent = activeCar.name;
    modalSummaryPaint.textContent = selectedPaintName.textContent;
    modalSummaryWheels.textContent = selectedWheelPkg.name;
    modalSummaryPrice.textContent = configTotalPrice.textContent;

    reserveModal.classList.add('open');
  }

  function closeReservationModal() {
    reserveModal.classList.remove('open');
  }

  if (openConfigBtn) openConfigBtn.addEventListener('click', openReservationModal);
  if (customizerOrderBtn) customizerOrderBtn.addEventListener('click', openReservationModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeReservationModal);

  reserveModal.addEventListener('click', (e) => {
    if (e.target === reserveModal) {
      closeReservationModal();
    }
  });

  window.submitReservation = () => {
    const refCode = `BMW-${Math.floor(100000 + Math.random() * 900000)}`;
    alert(`Thank you for configuring your ${activeCar.name}!\n\nYour official BMW Priority Reservation Code: ${refCode}\nConfigured Price: ${configTotalPrice.textContent}\n\nA BMW Client Advisor will contact you within 24 hours.`);
    closeReservationModal();
  };
});
