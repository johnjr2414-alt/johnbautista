/**
 * projects.js — Image Gallery Logic for Portfolio Projects Section
 * Handles prev/next navigation and thumbnail switching for project cards.
 */

(function () {
  'use strict';

  function initGalleries() {
    const cards = document.querySelectorAll('[data-gallery]');

    cards.forEach(function (card) {
      const slides   = card.querySelectorAll('.gallery-slide');
      const thumbs   = card.querySelectorAll('.gallery-thumb');
      const prevBtn  = card.querySelector('.gallery-prev');
      const nextBtn  = card.querySelector('.gallery-next');
      const counter  = card.querySelector('.gallery-counter');

      if (!slides.length) return;

      let current = 0;

      function goTo(index) {
        slides[current].classList.remove('active');
        thumbs[current] && thumbs[current].classList.remove('active');

        current = (index + slides.length) % slides.length;

        slides[current].classList.add('active');
        thumbs[current] && thumbs[current].classList.add('active');

        if (counter) {
          counter.textContent = (current + 1) + ' / ' + slides.length;
        }
      }

      // Initial state
      goTo(0);

      if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

      thumbs.forEach(function (thumb, i) {
        thumb.addEventListener('click', function () { goTo(i); });
      });

      // Keyboard support when card is focused
      card.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft')  goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleries);
  } else {
    initGalleries();
  }
})();
