/**
 * BRUTALIST PORTFOLIO — LOGIC
 * MOTION AS PRESENCE.
 */

(function () {
  'use strict';

  // --- Theme Toggle ---
  const html = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const THEME_KEY = 'portfolio-theme';

  function getTheme() {
    return localStorage.getItem(THEME_KEY) ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // --- Mobile Nav ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // --- Active Link ---
  const sections = document.querySelectorAll('section[id], footer[id]');

  function updateActiveLink() {
    const scrollY = window.scrollY;
    const offset = 100;

    let activeId = '';

    sections.forEach((section) => {
      const id = section.getAttribute('id');
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollY >= top - offset && scrollY < top + height - offset) {
        activeId = id;
      }
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      const href = link.getAttribute('href');
      const targetId = href?.replace('#', '');

      if (targetId === activeId) {
        link.style.textDecoration = 'underline';
        link.style.background = 'var(--text)';
        link.style.color = 'var(--bg)';
      } else {
        link.style.textDecoration = 'none';
        link.style.background = 'transparent';
        link.style.color = 'var(--text)';
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // --- CUSTOM CURSOR & MOTION ---
  const cursor = document.querySelector('.cursor');

  // Only init motion if fine pointer (mouse)
  if (window.matchMedia('(pointer: fine)').matches && cursor) {

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Lerp factor (Lower = slower/heavier)
    const lerp = 0.15;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const cursorBg = document.querySelector('.cursor-bg');

    function animateCursor() {
      // Linear interpolation for smooth trailing
      cursorX += (mouseX - cursorX) * lerp;
      cursorY += (mouseY - cursorY) * lerp;

      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

      // Move background element (Opposite direction, very subtle)
      if (cursorBg) {
        const moveX = (window.innerWidth / 2 - mouseX) * 0.05;
        const moveY = (window.innerHeight / 2 - mouseY) * 0.05;
        cursorBg.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
      }

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // -- MAGNETIC BUTTONS --
    const magnets = document.querySelectorAll('.btn, .nav-link, .theme-toggle');

    magnets.forEach((magnet) => {
      magnet.addEventListener('mousemove', (e) => {
        const rect = magnet.getBoundingClientRect();
        // Calculate distance from center
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Push button towards mouse (Magnetic attraction)
        magnet.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;

        // Expand cursor
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%) scale(1.5)`;
      });

      magnet.addEventListener('mouseleave', () => {
        // Reset button position
        magnet.style.transform = `translate(0px, 0px)`;
        // Reset cursor scale
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%) scale(1)`;
      });
    });
    // --- TEXT SCRAMBLE EFFECT ---
    class TextScramble {
      constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
      }

      setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
          const from = oldText[i] || '';
          const to = newText[i] || '';
          const start = Math.floor(Math.random() * 40);
          const end = start + Math.floor(Math.random() * 40);
          this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
      }

      update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
          let { from, to, start, end, char } = this.queue[i];
          if (this.frame >= end) {
            complete++;
            output += to;
          } else if (this.frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = this.chars[Math.floor(Math.random() * this.chars.length)];
              this.queue[i].char = char;
            }
            output += `<span class="dud">${char}</span>`;
          } else {
            output += from;
          }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
          this.resolve();
        } else {
          this.frameRequest = requestAnimationFrame(this.update);
          this.frame++;
        }
      }
    }

    // Initialize Scramble on Hover
    const phrases = [
      'TOM ISON',
      'CREATIVE_DEV',
      'SYSTEM_READY',
      'HELLO_WORLD'
    ];

    const el = document.querySelector('.hero-name');
    if (el) {
      const fx = new TextScramble(el);
      let counter = 0;

      const next = () => {
        fx.setText(phrases[counter]).then(() => {
          setTimeout(next, 2000); // Auto cycle for demo, or bind to hover
        });
        counter = (counter + 1) % phrases.length;
      };

      // Auto cycle name for kinetic feel
      // next(); 

      // Hover effect instead of auto-cycle
      el.addEventListener('mouseenter', () => {
        fx.setText('SYSTEM_BREACH');
      });
      el.addEventListener('mouseleave', () => {
        fx.setText('TOM ISON');
      });
    }

    // --- VELOCITY SKEW (TEXT ONLY) ---
    let lastScrollY = window.scrollY;
    const skewTargets = document.querySelectorAll('h1, h2, .project-strip h3');

    function textVelocity() {
      const currentScrollY = window.scrollY;
      const speed = currentScrollY - lastScrollY;
      const skew = Math.min(Math.max(speed * 0.08, -4), 4); // Reduced intensity

      skewTargets.forEach(target => {
        target.style.transform = `skewX(${skew}deg)`;
        target.style.transition = 'transform 0.1s ease-out';
      });

      lastScrollY = currentScrollY;

      clearTimeout(window.scrollTimeout);
      window.scrollTimeout = setTimeout(() => {
        skewTargets.forEach(target => {
          target.style.transform = `skewX(0deg)`;
          target.style.transition = 'transform 0.4s ease-out';
        });
      }, 50);

      requestAnimationFrame(textVelocity);
    }

    window.addEventListener('scroll', () => {
      // textVelocity is called via RAF loop or just triggered here? 
      // Better to just update vars here and have loop run, but for simplicity:
      // We already have a RAF loop for cursor, but let's keep this separate or merged.
      // Actually, let's just run it.
    }, { passive: true });

    // Start the loop
    function loop() {
      textVelocity();
      // requestAnimationFrame(loop); // recursive loop is better for smooth motion
    }
    // Initialize loop
    // Note: textVelocity calls requestAnimationFrame(textVelocity) at the end, so we just need to start it once.
    requestAnimationFrame(textVelocity);
  }

})();
