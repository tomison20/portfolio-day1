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
  }

})();
