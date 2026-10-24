/**
 * CYBERPUNK CHIBI COMPANION - STANDALONE CONTROLLER
 * Features:
 * - Direct grab & drag (mouse & touch)
 * - Gravity physics drop when released mid-air
 * - Realistic landing squish & walk-to-home cycle
 * - Orientation correction for walk direction
 * - Click for speech bubbles
 * - Zero external dependencies, immune to reload/cache timing issues
 */

(function () {
  function initChibi() {
    const chibi = document.getElementById('chibi-companion');
    const chibiChar = document.getElementById('chibi-char');
    const chibiImg = document.getElementById('chibi-img');
    const chibiBubble = document.getElementById('chibi-bubble');

    if (!chibi || !chibiChar || !chibiImg) return;

    // Prevent default browser image dragging
    chibi.setAttribute('draggable', 'false');
    chibiChar.setAttribute('draggable', 'false');
    chibiImg.setAttribute('draggable', 'false');
    chibi.ondragstart = () => false;

    const sprites = {
      idle: 'Interactive Chibi/idle.png',
      walk: 'Interactive Chibi/walk.png',
      grabbed: 'Interactive Chibi/grabbed.png',
      falling1: 'Interactive Chibi/falling1.png',
      falling2: 'Interactive Chibi/falling2.png',
      land: 'Interactive Chibi/land.png'
    };

    const dialogLines = [
      "Welcome to John's digital command center!",
      "Need a hardware specialist? John's got you covered!",
      "ESP32 & IoT telemetry running at full capacity!",
      "Check out the T.A.S.K. kiosk capstone project!",
      "Click 'RESUME.PDF' to view verified credentials!",
      "You can drag me anywhere around the screen!"
    ];

    // Preload sprites
    Object.values(sprites).forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    let isDragging = false;
    let isFalling = false;
    let isWalking = false;
    let currentX = 0;
    let currentY = 0;
    let animFrame = null;
    let bubbleTimeout = null;

    const speak = (text) => {
      if (!chibiBubble) return;
      const span = chibiBubble.querySelector('span');
      if (span) span.textContent = text;
      chibiBubble.classList.add('visible');
      if (bubbleTimeout) clearTimeout(bubbleTimeout);
      bubbleTimeout = setTimeout(() => {
        chibiBubble.classList.remove('visible');
      }, 4200);
    };

    // Speech bubble welcome
    setTimeout(() => {
      speak("Systems online! Feel free to explore John's portfolio.");
    }, 2800);

    // Random idle chatter every 30s
    setInterval(() => {
      if (!isDragging && !isFalling && !isWalking) {
        const rand = dialogLines[Math.floor(Math.random() * dialogLines.length)];
        speak(rand);
      }
    }, 30000);

    const getHomePos = () => {
      const charWidth = chibiChar.offsetWidth || (window.innerWidth < 480 ? 150 : 240);
      const charHeight = chibiChar.offsetHeight || (window.innerWidth < 480 ? 150 : 240);
      const offsetRight = window.innerWidth < 480 ? 14 : 24;
      const offsetBottom = window.innerWidth < 480 ? 12 : 16;
      return {
        x: Math.max(10, window.innerWidth - charWidth - offsetRight),
        y: Math.max(10, window.innerHeight - charHeight - offsetBottom)
      };
    };

    const resetToHome = () => {
      if (isDragging || isFalling || isWalking) return;
      const home = getHomePos();
      currentX = home.x;
      currentY = home.y;
      chibi.style.left = `${currentX}px`;
      chibi.style.top = `${currentY}px`;
      chibi.style.right = 'auto';
      chibi.style.bottom = 'auto';
    };

    // Initialize position
    resetToHome();
    setTimeout(resetToHome, 100);
    window.addEventListener('load', resetToHome);
    window.addEventListener('resize', resetToHome);

    // Gravity Drop Physics
    const startGravityFall = () => {
      if (animFrame) cancelAnimationFrame(animFrame);
      isFalling = true;
      let velocityY = 2;
      const gravity = 1.0;
      const home = getHomePos();
      const floorY = home.y;
      let frame = 0;

      const fallStep = () => {
        velocityY += gravity;
        currentY += velocityY;
        frame++;

        chibiImg.src = (frame % 16 < 8) ? sprites.falling1 : sprites.falling2;

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

    // Landing sequence
    const onLand = () => {
      chibiImg.src = sprites.land;
      chibiChar.style.transform = 'scale(0.92, 1.08)';

      setTimeout(() => {
        chibiChar.style.transform = 'scale(1)';
        startWalkingHome();
      }, 450);
    };

    // Walk horizontally across floor back to home base
    const startWalkingHome = () => {
      const home = getHomePos();
      const distance = home.x - currentX;

      if (Math.abs(distance) < 8) {
        currentX = home.x;
        chibi.style.left = `${currentX}px`;
        chibiImg.src = sprites.idle;
        chibiChar.style.transform = 'scale(1)';
        isWalking = false;
        speak("Back at my post! Ready to assist.");
        return;
      }

      isWalking = true;
      chibiImg.src = sprites.walk;

      // Facing direction: walking right = scaleX(1), walking left = scaleX(-1)
      const walkRight = distance > 0;
      chibiChar.style.transform = walkRight ? 'scaleX(1)' : 'scaleX(-1)';

      const walkSpeed = 6;

      const walkStep = () => {
        if (isDragging) {
          isWalking = false;
          return;
        }

        if (walkRight) {
          currentX += walkSpeed;
          if (currentX >= home.x) {
            finishWalking();
            return;
          }
        } else {
          currentX -= walkSpeed;
          if (currentX <= home.x) {
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

    // Direct Drag Controller
    let startX = 0;
    let startY = 0;
    let hasMoved = false;

    const startDrag = (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      if (e.cancelable) e.preventDefault();

      if (animFrame) cancelAnimationFrame(animFrame);
      isDragging = true;
      isFalling = false;
      isWalking = false;
      hasMoved = false;

      chibiImg.src = sprites.grabbed;
      chibiChar.style.transform = 'scale(1.08)';

      const pt = e.touches ? e.touches[0] : e;
      startX = pt.clientX;
      startY = pt.clientY;

      const rect = chibi.getBoundingClientRect();
      const offsetX = pt.clientX - rect.left;
      const offsetY = pt.clientY - rect.top;

      const onMove = (ev) => {
        if (!isDragging) return;
        if (ev.cancelable) ev.preventDefault();

        const p = ev.touches ? ev.touches[0] : ev;
        if (Math.abs(p.clientX - startX) > 4 || Math.abs(p.clientY - startY) > 4) {
          hasMoved = true;
        }

        const charW = chibiChar.offsetWidth || (window.innerWidth < 480 ? 150 : 240);
        const charH = chibiChar.offsetHeight || (window.innerWidth < 480 ? 150 : 240);

        let newX = p.clientX - offsetX;
        let newY = p.clientY - offsetY;

        const maxX = window.innerWidth - charW - 8;
        const maxY = window.innerHeight - charH - 8;
        newX = Math.max(8, Math.min(maxX, newX));
        newY = Math.max(8, Math.min(maxY, newY));

        currentX = newX;
        currentY = newY;

        chibi.style.left = `${newX}px`;
        chibi.style.top = `${newY}px`;
        chibi.style.right = 'auto';
        chibi.style.bottom = 'auto';
      };

      const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;

        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onEnd);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);

        if (!hasMoved) {
          // It was just a click/tap
          chibiImg.src = sprites.idle;
          chibiChar.style.transform = 'scale(1)';
          const rand = dialogLines[Math.floor(Math.random() * dialogLines.length)];
          speak(rand);
          return;
        }

        const home = getHomePos();
        // If released near floor level
        if (Math.abs(currentY - home.y) < 25) {
          currentY = home.y;
          chibi.style.top = `${currentY}px`;
          onLand();
        } else {
          startGravityFall();
        }
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);
    };

    chibi.addEventListener('mousedown', startDrag);
    chibi.addEventListener('touchstart', startDrag, { passive: false });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChibi);
  } else {
    initChibi();
  }
})();
