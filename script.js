/* ═══════════════════════════════════════════════
   ANTI-GRAVITY PORTFOLIO — JAVASCRIPT ENGINE
   Interactions, Animations, Canvas Stars, Typing
═══════════════════════════════════════════════ */

'use strict';

// ─── DOM Ready ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCursorGlow();
  initStarCanvas();
  initParticles();
  initNavbar();
  initTypingEffect();
  initScrollAnimations();
  initActiveNavHighlight();
  initHamburger();
  initCounterAnimations();
});

/* ══════════════════════════════════════════════
   1. CUSTOM CURSOR GLOW
══════════════════════════════════════════════ */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.08;
    curY += (mouseY - curY) * 0.08;
    glow.style.left = curX + 'px';
    glow.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements
  const interactive = document.querySelectorAll('a, button, .skill-pill, .stat-card, .project-card');
  interactive.forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('mouseenter', () => {
      glow.style.width  = '500px';
      glow.style.height = '500px';
      glow.style.background = 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)';
    });
    el.addEventListener('mouseleave', () => {
      glow.style.width  = '300px';
      glow.style.height = '300px';
      glow.style.background = 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)';
    });
  });
}

/* ══════════════════════════════════════════════
   2. STAR FIELD CANVAS
══════════════════════════════════════════════ */
function initStarCanvas() {
  const canvas = document.getElementById('stars-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = Math.floor((W * H) / 6000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.2,
        alpha: Math.random() * 0.6 + 0.1,
        speed: Math.random() * 0.3 + 0.05,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: Math.random() < 0.15
          ? (Math.random() < 0.5 ? '#a855f7' : '#60a5fa')
          : '#ffffff'
      });
    }
  }

  let t = 0;
  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    t += 0.01;
    stars.forEach(s => {
      const twinkle = Math.sin(t + s.twinkleOffset) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha * twinkle;
      ctx.fill();
      // Tiny glow for colored stars
      if (s.color !== '#ffffff' && s.r > 1) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
        grad.addColorStop(0, s.color + '30');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fill();
      }
      // Slow drift
      s.y -= s.speed * 0.3;
      if (s.y < -5) { s.y = H + 5; s.x = Math.random() * W; }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resize);
  resize();
  drawStars();

  // Shooting stars
  function shootingStar() {
    const angle = Math.random() * 0.5 + 0.1;
    const x = Math.random() * W;
    const y = Math.random() * H * 0.5;
    const len = Math.random() * 100 + 60;
    let progress = 0;

    function draw() {
      progress += 3;
      if (progress > len) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + progress * Math.cos(angle), y + progress * Math.sin(angle));
      ctx.lineTo(x + (progress - 20) * Math.cos(angle), y + (progress - 20) * Math.sin(angle));
      const grad = ctx.createLinearGradient(
        x + progress * Math.cos(angle), y + progress * Math.sin(angle),
        x + (progress - 20) * Math.cos(angle), y + (progress - 20) * Math.sin(angle)
      );
      grad.addColorStop(0, 'rgba(255,255,255,0.8)');
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
      requestAnimationFrame(draw);
    }
    draw();
  }

  setInterval(shootingStar, 4000 + Math.random() * 3000);
}

/* ══════════════════════════════════════════════
   3. FLOATING PARTICLES
══════════════════════════════════════════════ */
function initParticles() {
  const container = document.getElementById('particles');
  const colors = [
    'rgba(124,58,237,0.6)',
    'rgba(37,99,235,0.6)',
    'rgba(168,85,247,0.5)',
    'rgba(96,165,250,0.5)',
    'rgba(6,182,212,0.4)'
  ];

  function createParticle() {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      box-shadow: 0 0 ${size * 3}px ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 30000);
  }

  // Initial batch
  for (let i = 0; i < 25; i++) createParticle();
  setInterval(createParticle, 800);
}

/* ══════════════════════════════════════════════
   4. NAVBAR SCROLL EFFECT
══════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ══════════════════════════════════════════════
   5. TYPING EFFECT
══════════════════════════════════════════════ */
function initTypingEffect() {
  const el = document.getElementById('typed-text');
  const phrases = [
    'Aspiring Software Engineer',
    'Full-Stack Developer',
    'DSA Problem Solver',
    'AI & ML Enthusiast',
    'Open Source Contributor'
  ];
  let pIdx = 0, cIdx = 0, isDeleting = false;

  function type() {
    const current = phrases[pIdx];
    if (!isDeleting) {
      el.textContent = current.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx === current.length) {
        isDeleting = true;
        setTimeout(type, 2200);
        return;
      }
    } else {
      el.textContent = current.slice(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        isDeleting = false;
        pIdx = (pIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, isDeleting ? 55 : 90);
  }
  type();
}

/* ══════════════════════════════════════════════
   6. SCROLL ANIMATIONS (AOS-like)
══════════════════════════════════════════════ */
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════
   7. ACTIVE NAV HIGHLIGHT ON SCROLL
══════════════════════════════════════════════ */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ══════════════════════════════════════════════
   8. HAMBURGER MENU
══════════════════════════════════════════════ */
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');

  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    const [s1, s2, s3] = btn.querySelectorAll('span');
    if (links.classList.contains('open')) {
      s1.style.transform = 'rotate(45deg) translate(5px, 5px)';
      s2.style.opacity   = '0';
      s3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      s1.style.transform = s2.style.opacity = s3.style.transform = '';
      s2.style.opacity = '1';
    }
  });

  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      const spans = btn.querySelectorAll('span');
      spans.forEach(s => s.style.transform = '');
      spans[1].style.opacity = '1';
    });
  });
}

/* ══════════════════════════════════════════════
   9. COUNTER ANIMATIONS FOR STATS
══════════════════════════════════════════════ */
function initCounterAnimations() {
  const counters = [
    { id: 'stat-cgpa',   value: '9.5 / 10',   numeric: 9.5, suffix: ' / 10',  decimals: 1 },
    { id: 'stat-dsa',    value: '100+',         numeric: 100, suffix: '+',      decimals: 0 },
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const valEl = el.querySelector('.stat-value');
        const config = counters.find(c => c.id === el.id);
        if (!config || !valEl) return;

        let start = 0;
        const duration = 1500;
        const startTime = performance.now();

        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = (start + (config.numeric - start) * eased).toFixed(config.decimals);
          valEl.textContent = current + config.suffix;
          if (progress < 1) requestAnimationFrame(update);
          else valEl.textContent = config.value;
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => {
    const el = document.getElementById(c.id);
    if (el) observer.observe(el);
  });
}

/* ══════════════════════════════════════════════
   10. MOUSE PARALLAX ON HERO VISUAL
══════════════════════════════════════════════ */
(function initParallax() {
  const visual = document.querySelector('.hero-visual');
  const icons  = document.querySelectorAll('.floating-icon');
  if (!visual) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    icons.forEach((icon, i) => {
      const depth = (i + 1) * 5;
      icon.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
    });
  });
})();

/* ══════════════════════════════════════════════
   11. PROFILE IMAGE FALLBACK GLOW PULSE
══════════════════════════════════════════════ */
(function initProfileGlow() {
  const wrapper = document.querySelector('.profile-image-wrapper');
  if (!wrapper) return;

  let hue = 270;
  function animateGlow() {
    hue = (hue + 0.3) % 360;
    wrapper.style.boxShadow = `
      0 0 40px hsla(${hue}, 70%, 60%, 0.5),
      0 0 80px hsla(${hue + 30}, 70%, 50%, 0.25),
      inset 0 0 40px hsla(${hue}, 70%, 60%, 0.1)
    `;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
})();

/* ══════════════════════════════════════════════
   12. NEON CARD MOUSE TILT EFFECT
══════════════════════════════════════════════ */
document.querySelectorAll('.project-card, .profile-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect  = card.getBoundingClientRect();
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;
    const cx    = rect.width / 2;
    const cy    = rect.height / 2;
    const rotX  = ((y - cy) / cy) * -8;
    const rotY  = ((x - cx) / cx) * 8;
    card.style.transform    = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    card.style.boxShadow    = `0 20px 60px rgba(124,58,237,0.25), 0 4px 20px rgba(0,0,0,0.4)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});

/* ══════════════════════════════════════════════
   13. SMOOTH REVEAL STAGGER FOR SKILL PILLS
══════════════════════════════════════════════ */
(function initSkillPillReveal() {
  const pills = document.querySelectorAll('.skill-pill');
  const obs   = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        pills.forEach((pill, i) => {
          setTimeout(() => {
            pill.style.opacity   = '1';
            pill.style.transform = 'translateY(0)';
          }, i * 40);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });

  if (pills.length) {
    pills.forEach(p => {
      p.style.opacity   = '0';
      p.style.transform = 'translateY(12px)';
      p.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
    obs.observe(pills[0]);
  }
})();

/* ══════════════════════════════════════════════
   14. ACTIVE NAV LINK SMOOTH SCROLL
══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ══════════════════════════════════════════════
   15. BACK TO TOP VISIBILITY
══════════════════════════════════════════════ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.style.opacity = window.scrollY > 400 ? '1' : '0.3';
  }, { passive: true });
})();
