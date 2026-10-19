/**
 * CYBERPUNK CIRCUITRY PORTFOLIO - JAVASCRIPT CONTROLLER
 * Modules:
 * 1. 04-Phase Bootloader Initialization Sequence (2.4s)
 * 2. Multi-layer Animated Circuit Signal Canvas
 * 3. Diagnostic Terminal Typing Engine
 * 4. ScrollSpy & Navigation Highlighting
 * 5. Interactive Chibi Companion (Physics, Drag & Drops, Sprites)
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. 04-PHASE BOOTLOADER SYSTEM INITIALIZATION (2.4s)
  // =========================================================================
  const bootOverlay = document.getElementById('boot-overlay');
  const bootFill = document.getElementById('boot-fill');
  const bootLines = document.querySelectorAll('.boot-line');
  const skipBtn = document.getElementById('skip-boot');

  let bootDone = false;

  const runBootloader = () => {
    // Check if user already booted during session
    if (sessionStorage.getItem('jb_booted') === 'true') {
      finishBoot();
      return;
    }

    const phases = [
      { progress: 25, delay: 350, lineIdx: 0 },
      { progress: 55, delay: 850, lineIdx: 1 },
      { progress: 85, delay: 1400, lineIdx: 2 },
      { progress: 100, delay: 2100, lineIdx: 3 }
    ];

    phases.forEach((p) => {
      setTimeout(() => {
        if (bootDone) return;
        bootFill.style.width = `${p.progress}%`;
        bootLines.forEach((l, i) => {
          if (i <= p.lineIdx) l.classList.add('active');
        });
      }, p.delay);
    });

    setTimeout(() => {
      finishBoot();
    }, 2600);
  };

  const finishBoot = () => {
    if (bootDone) return;
    bootDone = true;
    sessionStorage.setItem('jb_booted', 'true');
    bootOverlay.classList.add('hidden');
    document.body.classList.remove('initializing');
    initTerminalTyping();
  };

  if (skipBtn) {
    skipBtn.addEventListener('click', finishBoot);
  }

  runBootloader();

  // =========================================================================
  // 2. MULTI-LAYER ANIMATED CIRCUIT SIGNAL CANVAS
  // =========================================================================
  const canvas = document.getElementById('circuit-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let circuitTracks = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      buildTracks();
    };

    // Generate PCB-style geometric paths (horizontal, vertical, 45-deg)
    const buildTracks = () => {
      circuitTracks = [];
      const trackCount = Math.floor(width / 140);

      for (let i = 0; i < trackCount; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        let path = [{ x, y }];
        let steps = 4 + Math.floor(Math.random() * 5);

        for (let s = 0; s < steps; s++) {
          const dir = Math.floor(Math.random() * 4);
          const len = 60 + Math.random() * 120;
          if (dir === 0) x += len;
          else if (dir === 1) y += len;
          else if (dir === 2) { x += len; y += len; } // 45 deg
          else { x -= len; }
          path.push({ x, y });
        }
        circuitTracks.push(path);
      }

      // Initialize electrical pulse particles
      particles = [];
      const pCount = Math.min(24, Math.floor(width / 70));
      for (let j = 0; j < pCount; j++) {
        const trackIdx = Math.floor(Math.random() * circuitTracks.length);
        particles.push({
          track: circuitTracks[trackIdx],
          segment: 0,
          progress: Math.random(),
          speed: 0.004 + Math.random() * 0.008,
          color: Math.random() > 0.4 ? '#00E5FF' : '#168BFF',
          size: 2 + Math.random() * 2
        });
      }
    };

    window.addEventListener('resize', resize);
    resize();

    // Render loop
    const animateCircuit = () => {
      ctx.clearRect(0, 0, width, height);

      // Render faint stationary traces
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(22, 139, 255, 0.07)';
      for (let i = 0; i < circuitTracks.length; i++) {
        const pts = circuitTracks[i];
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let k = 1; k < pts.length; k++) {
          ctx.lineTo(pts[k].x, pts[k].y);
        }
        ctx.stroke();

        // Draw faint terminal junction pads
        const end = pts[pts.length - 1];
        ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
        ctx.fillRect(end.x - 2, end.y - 2, 4, 4);
      }

      // Render moving electrical signal pulses
      particles.forEach((p) => {
        if (!p.track || p.track.length < 2) return;
        const p1 = p.track[p.segment];
        const p2 = p.track[p.segment + 1];

        if (!p2) {
          p.segment = 0;
          p.progress = 0;
          return;
        }

        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          p.segment++;
          if (p.segment >= p.track.length - 1) {
            p.segment = 0;
            // Maybe switch track
            p.track = circuitTracks[Math.floor(Math.random() * circuitTracks.length)];
          }
        }

        const currX = p1.x + (p2.x - p1.x) * p.progress;
        const currY = p1.y + (p2.y - p1.y) * p.progress;

        // Glowing pulse head
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(currX, currY, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadow for performance
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animateCircuit);
    };

    animateCircuit();
  }

  // =========================================================================
  // 3. DIAGNOSTIC HUD TERMINAL TYPING ENGINE
  // =========================================================================
  const terminalScreen = document.getElementById('terminal-screen');
  const terminalLogData = [
    { text: '> Initializing system telemetry...', type: 'cyan', delay: 150 },
    { text: '> Loading hardware & embedded profiles... [OK]', type: 'normal', delay: 450 },
    { text: '> IoT LoRa & ESP32 firmware modules: READY', type: 'normal', delay: 800 },
    { text: '> Workflow pipelines: SYNCHRONIZED', type: 'blue', delay: 1200 },
    { text: '> Portfolio status: ONLINE // RECRUITER_ACCESS: GRANTED', type: 'success', delay: 1600 }
  ];

  let termInitialized = false;

  function initTerminalTyping() {
    if (termInitialized || !terminalScreen) return;
    termInitialized = true;
    terminalScreen.innerHTML = '';

    terminalLogData.forEach((item) => {
      setTimeout(() => {
        const line = document.createElement('span');
        line.className = `terminal-line ${item.type}`;
        line.textContent = item.text;
        terminalScreen.appendChild(line);
      }, item.delay);
    });

    // Add trailing block cursor after all lines appear
    setTimeout(() => {
      const cursor = document.createElement('span');
      cursor.className = 'term-cursor';
      terminalScreen.appendChild(cursor);
    }, 1800);
  }

  // =========================================================================
  // 4. SCROLLSPY & NAVIGATION HIGHLIGHTING
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  // Mobile Drawer Toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', mobileDrawer.classList.contains('open'));
    });
  }

  if (drawerClose && mobileDrawer) {
    drawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  });

  // IntersectionObserver for active section highlight
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((nl) => {
          if (nl.getAttribute('data-nav') === id) {
            nl.classList.add('active');
          } else {
            nl.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => navObserver.observe(sec));

  // =========================================================================
  // 4.5 HOLOGRAPHIC CORE HOVER DECRYPTION (AUTO-CLOSE ON LEAVE)
  // =========================================================================
  const holoStage = document.getElementById('holo-stage');
  const coreInfoOverlay = document.getElementById('core-info-overlay');
  let holoTimer = null;

  if (holoStage && coreInfoOverlay) {
    const showCoreInfo = () => {
      coreInfoOverlay.classList.add('open');
      coreInfoOverlay.setAttribute('aria-hidden', 'false');
      holoStage.classList.add('active-core');
    };

    const hideCoreInfo = () => {
      if (holoTimer) {
        clearTimeout(holoTimer);
        holoTimer = null;
      }
      coreInfoOverlay.classList.remove('open');
      coreInfoOverlay.setAttribute('aria-hidden', 'true');
      holoStage.classList.remove('active-core');
    };

    // When cursor enters: wait 1s (or CSS hover also provides instant responsiveness)
    holoStage.addEventListener('mouseenter', () => {
      if (holoTimer) clearTimeout(holoTimer);
      holoTimer = setTimeout(() => {
        showCoreInfo();
      }, 800);
    });

    // When cursor leaves: immediately close
    holoStage.addEventListener('mouseleave', () => {
      hideCoreInfo();
    });

    // Mobile tap support to toggle
    holoStage.addEventListener('click', (e) => {
      if (e.target.closest('.hud-link')) return; // allow clicking phone/email
      if (coreInfoOverlay.classList.contains('open')) {
        hideCoreInfo();
      } else {
        showCoreInfo();
      }
    });
  }

  // =========================================================================
  // 5. INTERACTIVE CYBERPUNK CHIBI COMPANION (PHYSICS, DRAG & DROP, SPRITES)
  // =========================================================================
  const chibi = document.getElementById('chibi-companion');
  const chibiChar = document.getElementById('chibi-char');
  const chibiImg = document.getElementById('chibi-img');
  const chibiBubble = document.getElementById('chibi-bubble');

  // Show only welcome message on startup, no extra dialogue
  if (chibiBubble) {
    setTimeout(() => {
      chibiBubble.classList.add('visible');
      setTimeout(() => {
        chibiBubble.classList.remove('visible');
      }, 5000);
    }, 2800);
  }

  if (chibi && chibiImg) {
    const sprites = {
      idle: 'Interactive Chibi/idle.png',
      walk: 'Interactive Chibi/walk.png',
      grabbed: 'Interactive Chibi/grabbed.png',
      falling1: 'Interactive Chibi/falling1.png',
      falling2: 'Interactive Chibi/falling2.png',
      land: 'Interactive Chibi/land.png'
    };

    // Preload all sprites into memory so transitions are instant with no lag
    Object.values(sprites).forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    let isDragging = false;
    let isFalling = false;
    let isWalking = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    let currentX = 0;
    let currentY = 0;
    let animFrame = null;

    // Home base coordinates (bottom-right)
    const getHomePos = () => {
      const charWidth = chibiChar.offsetWidth || 240;
      const charHeight = chibiChar.offsetHeight || 240;
      const offsetRight = window.innerWidth < 480 ? 14 : 24;
      const offsetBottom = window.innerWidth < 480 ? 12 : 16;
      return {
        x: window.innerWidth - charWidth - offsetRight,
        y: window.innerHeight - charHeight - offsetBottom
      };
    };

    // Setup initial coordinates on page load
    const setupPos = () => {
      const home = getHomePos();
      currentX = home.x;
      currentY = home.y;
      chibi.style.left = `${currentX}px`;
      chibi.style.top = `${currentY}px`;
      chibi.style.bottom = 'auto';
      chibi.style.right = 'auto';
    };
    setupPos();
    window.addEventListener('resize', () => {
      if (!isDragging && !isFalling && !isWalking) {
        setupPos();
      }
    });

    // Start Gravity Drop Physics with falling1 & falling2 frame cycling
    const startGravityFall = () => {
      if (animFrame) cancelAnimationFrame(animFrame);
      isFalling = true;
      let velocityY = 1.5;
      const gravity = 0.95; // Smooth realistic drop
      const home = getHomePos();
      const floorY = home.y;
      let frameCounter = 0;

      const fallStep = () => {
        velocityY += gravity;
        currentY += velocityY;
        frameCounter++;

        // Alternate falling1 and falling2 every 8 frames (~130ms) for noticeable leg kicking
        if (frameCounter % 16 < 8) {
          chibiImg.src = sprites.falling1;
        } else {
          chibiImg.src = sprites.falling2;
        }

        if (currentY >= floorY) {
          currentY = floorY;
          chibi.style.top = `${currentY}px`;
          isFalling = false;
          onLand();
        } else {
          chibi.style.top = `${currentY}px`;
          animFrame = requestAnimationFrame(fallStep);
        }
      };

      animFrame = requestAnimationFrame(fallStep);
    };

    // Land on the ground
    const onLand = () => {
      chibiImg.src = sprites.land;
      chibiChar.style.transform = 'scale(0.92, 1.08)';

      setTimeout(() => {
        chibiChar.style.transform = 'scale(1)';
        startWalkingHome();
      }, 550); // Give clear visibility to the landing pose
    };

    // Walk horizontally across floor back to home base
    const startWalkingHome = () => {
      const home = getHomePos();
      const distance = home.x - currentX;

      // If already at or near home base
      if (Math.abs(distance) < 8) {
        currentX = home.x;
        chibi.style.left = `${currentX}px`;
        chibiImg.src = sprites.idle;
        chibiChar.style.transform = 'scale(1)';
        isWalking = false;
        return;
      }

      isWalking = true;
      chibiImg.src = sprites.walk;

      // The walk sprite naturally faces right or left.
      // In the previous version, scaleX(-1) made it walk backwards.
      // Invert the mirror logic so it faces forward in the walking direction:
      const walkRight = distance > 0;
      chibiChar.style.transform = walkRight ? 'scaleX(1)' : 'scaleX(-1)';

      const walkSpeed = 6; // pixels per frame

      const walkStep = () => {
        if (isDragging) {
          isWalking = false;
          return;
        }

        if (walkRight) {
          currentX += walkSpeed;
          if (currentX >= home.x) {
            currentX = home.x;
            finishWalking();
            return;
          }
        } else {
          currentX -= walkSpeed;
          if (currentX <= home.x) {
            currentX = home.x;
            finishWalking();
            return;
          }
        }

        chibi.style.left = `${currentX}px`;
        animFrame = requestAnimationFrame(walkStep);
      };

      animFrame = requestAnimationFrame(walkStep);
    };

    const finishWalking = () => {
      isWalking = false;
      const home = getHomePos();
      currentX = home.x;
      currentY = home.y;
      chibi.style.left = `${currentX}px`;
      chibi.style.top = `${currentY}px`;
      chibiImg.src = sprites.idle;
      chibiChar.style.transform = 'scale(1)';
    };

    // Drag and Drop Logic using PointerEvents for universal support
    const onPointerDown = (e) => {
      if (animFrame) cancelAnimationFrame(animFrame);
      isDragging = true;
      isFalling = false;
      isWalking = false;
      chibiImg.src = sprites.grabbed;
      chibiChar.style.transform = 'scale(1.1)';
      
      const clientX = e.clientX;
      const clientY = e.clientY;

      const rect = chibi.getBoundingClientRect();
      dragStartX = clientX;
      dragStartY = clientY;
      initialLeft = rect.left;
      initialTop = rect.top;

      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();

      const clientX = e.clientX;
      const clientY = e.clientY;

      const dx = clientX - dragStartX;
      const dy = clientY - dragStartY;

      const charWidth = chibiChar.offsetWidth || 240;
      const charHeight = chibiChar.offsetHeight || 240;

      currentX = Math.max(10, Math.min(window.innerWidth - charWidth - 10, initialLeft + dx));
      currentY = Math.max(10, Math.min(window.innerHeight - charHeight - 10, initialTop + dy));

      chibi.style.left = `${currentX}px`;
      chibi.style.top = `${currentY}px`;
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      const home = getHomePos();
      // If released already on floor, immediately walk home
      if (Math.abs(currentY - home.y) < 15) {
        currentY = home.y;
        chibi.style.top = `${currentY}px`;
        onLand();
      } else {
        // Fall to bottom via gravity
        startGravityFall();
      }
    };

    chibi.addEventListener('pointerdown', onPointerDown);
  }

});
