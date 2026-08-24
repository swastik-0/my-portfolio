/**
 * Portfolio — Shared JavaScript
 * Handles: mobile nav, scroll animations, and contact form validation.
 */
(function () {
  'use strict';

  /* ===========================================
     MOBILE NAVIGATION TOGGLE
     =========================================== */
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      primaryNav.setAttribute('data-visible', String(!isOpen));

      // Trap focus inside nav when open
      if (!isOpen) {
        const firstLink = primaryNav.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    // Close nav on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.setAttribute('data-visible', 'false');
        navToggle.focus();
      }
    });

    // Close nav when clicking a link (mobile)
    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.setAttribute('data-visible', 'false');
      });
    });
  }

  /* ===========================================
     SCROLL-TRIGGERED ANIMATIONS
     =========================================== */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15,
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        animationObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll, .stagger-children').forEach((el) => {
    animationObserver.observe(el);
  });

  /* ===========================================
     CONTACT FORM VALIDATION (accessible)
     =========================================== */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const fields = {
      name: {
        el: document.getElementById('contact-name'),
        error: document.getElementById('contact-name-error'),
        validate(value) {
          if (!value.trim()) return 'Please enter your name.';
          if (value.trim().length < 2) return 'Name must be at least 2 characters.';
          return '';
        },
      },
      email: {
        el: document.getElementById('contact-email'),
        error: document.getElementById('contact-email-error'),
        validate(value) {
          if (!value.trim()) return 'Please enter your email address.';
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address.';
          return '';
        },
      },
      subject: {
        el: document.getElementById('contact-subject'),
        error: document.getElementById('contact-subject-error'),
        validate(value) {
          if (!value.trim()) return 'Please enter a subject.';
          return '';
        },
      },
      message: {
        el: document.getElementById('contact-message'),
        error: document.getElementById('contact-message-error'),
        validate(value) {
          if (!value.trim()) return 'Please enter your message.';
          if (value.trim().length < 10) return 'Message must be at least 10 characters.';
          return '';
        },
      },
    };

    /**
     * Validates a single field and updates ARIA state.
     * @param {object} field - The field config object.
     * @returns {boolean} - True if field is valid.
     */
    function validateField(field) {
      const msg = field.validate(field.el.value);
      field.error.textContent = msg;

      if (msg) {
        field.el.setAttribute('aria-invalid', 'true');
        field.el.setAttribute('aria-describedby', field.error.id);
        return false;
      }

      field.el.removeAttribute('aria-invalid');
      return true;
    }

    // Real-time validation on blur
    Object.values(fields).forEach((field) => {
      field.el.addEventListener('blur', () => validateField(field));
      field.el.addEventListener('input', () => {
        // Clear error as user types (after initial validation)
        if (field.el.getAttribute('aria-invalid') === 'true') {
          validateField(field);
        }
      });
    });

    // Form submission
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      let firstInvalidField = null;

      Object.values(fields).forEach((field) => {
        if (!validateField(field)) {
          isValid = false;
          if (!firstInvalidField) firstInvalidField = field.el;
        }
      });

      if (!isValid) {
        // Focus the first invalid field for accessibility
        if (firstInvalidField) firstInvalidField.focus();
        return;
      }

      // Simulate successful submission
      const successMsg = document.getElementById('form-success');
      if (successMsg) {
        successMsg.classList.add('is-visible');
        successMsg.setAttribute('role', 'status');
      }

      // Reset form
      contactForm.reset();
      Object.values(fields).forEach((field) => {
        field.el.removeAttribute('aria-invalid');
        field.error.textContent = '';
      });

      // Hide success after 5 seconds
      setTimeout(() => {
        if (successMsg) successMsg.classList.remove('is-visible');
      }, 5000);
    });
  }

  /* ===========================================
     HEADER SCROLL EFFECT (subtle)
     =========================================== */
  const header = document.querySelector('.site-header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener(
      'scroll',
      () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
          header.style.borderBottomColor = 'hsla(225, 30%, 40%, 0.3)';
        } else {
          header.style.borderBottomColor = '';
        }
        lastScroll = scrollY;
      },
      { passive: true }
    );
  }
})();
