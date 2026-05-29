/* ================================================================
   GANGADHAR I YALEHOLI — Portfolio Script
   Light Theme: Aurora Particle BG · Cursor · Typewriter
   Counters · Scroll Reveals · Mobile Nav
   ================================================================ */
(function () {
  'use strict';

  // ── AURORA PARTICLE BACKGROUND ──────────────────────────
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let mX = -999, mY = -999;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initP(); });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.a = Math.random() * 0.3 + 0.4;
      // Alternate between indigo and orange tints
      this.color = Math.random() > 0.6 ? '180,60,0' : '50,20,160';
    }
     
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.a})`;
      ctx.fill();
    }
  }

  function initP() {
    const n = Math.min(Math.floor(W * H / 2000), 400);
    particles = Array.from({ length: n }, () => new Particle());
  }
  initP();

  window.addEventListener('mousemove', e => { mX = e.clientX; mY = e.clientY; });

  function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, W, H);

    // Soft connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 160) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79,50,184,${0.12 * (1 - d/160)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
      // Mouse proximity highlight
      const mdx = particles[i].x - mX;
      const mdy = particles[i].y - mY;
      const md = Math.sqrt(mdx*mdx + mdy*mdy);
      if (md < 200) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mX, mY);
        ctx.strokeStyle = `rgba(232,99,26,${0.22*(1-md/200)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      particles[i].update();
      particles[i].draw();
    }
  }
  loop();

  // ── CUSTOM CURSOR ────────────────────────────────────────
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    cur.style.left = e.clientX + 'px';
    cur.style.top = e.clientY + 'px';
    mX = e.clientX; mY = e.clientY;
  });

  function trailLoop() {
    rx += (mX - rx) * 0.13;
    ry += (mY - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(trailLoop);
  }
  trailLoop();

  document.querySelectorAll('a, button, .sk-tag, .proj-card, .tl-card, .ccard, .social-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.width = '18px'; cur.style.height = '18px';
      cur.style.background = 'var(--orange)';
      ring.style.width = '44px'; ring.style.height = '44px';
      ring.style.borderColor = 'var(--orange)';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width = '10px'; cur.style.height = '10px';
      cur.style.background = 'var(--indigo)';
      ring.style.width = '32px'; ring.style.height = '32px';
      ring.style.borderColor = 'var(--indigo)';
    });
  });

  // ── NAV SCROLL ───────────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ── MOBILE NAV ───────────────────────────────────────────
  const burger = document.getElementById('hamburger');
  const drawer = document.getElementById('drawer');
  let open = false;

  burger.addEventListener('click', () => {
    open = !open;
    drawer.classList.toggle('open', open);
    const ss = burger.querySelectorAll('span');
    if (open) {
      ss[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
      ss[1].style.opacity = '0';
      ss[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
    } else {
      ss.forEach(s => s.removeAttribute('style'));
    }
  });

  document.querySelectorAll('.d-link').forEach(l => {
    l.addEventListener('click', () => {
      open = false; drawer.classList.remove('open');
      burger.querySelectorAll('span').forEach(s => s.removeAttribute('style'));
    });
  });

  // ── TYPEWRITER ───────────────────────────────────────────
  const roles = [
    'DevOps Engineer',
    'Kubernetes Architect',
    'AWS Cloud Specialist',
    'GitOps Practitioner',
    'CI/CD Pipeline Builder',
    'Infrastructure Automation',
    'Music Composer'
  ];
  const tw = document.getElementById('typewriter');
  let ri = 0, ci = 0, del = false;

  function type() {
    const cur = roles[ri];
    if (!del) {
      tw.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del = true; setTimeout(type, 2200); return; }
    } else {
      tw.textContent = cur.slice(0, --ci);
      if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, del ? 45 : 85);
  }
  type();

  // ── COUNTER ANIMATION ────────────────────────────────────
  function counter(el) {
    const target = +el.dataset.count;
    const dur = 1600;
    const t0 = performance.now();
    function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(e * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  // ── INTERSECTION OBSERVERS ───────────────────────────────
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // Counters trigger
  const metaObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.querySelectorAll('.meta-val').forEach(counter);
        metaObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.4 });
  const heroMeta = document.querySelector('.hero-meta');
  if (heroMeta) metaObs.observe(heroMeta);

  // Staggered reveals for project cards
  const projCards = document.querySelectorAll('.proj-card');
  const projObs = new IntersectionObserver(entries => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) {
        setTimeout(() => en.target.classList.add('visible'), i * 120);
        projObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });
  projCards.forEach(c => projObs.observe(c));

  // Staggered timeline items
  const tlItems = document.querySelectorAll('.tl-item');
  const tlObs = new IntersectionObserver(entries => {
    entries.forEach((en, i) => {
      if (en.isIntersecting) {
        setTimeout(() => en.target.classList.add('visible'), i * 150);
        tlObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.08 });
  tlItems.forEach(el => tlObs.observe(el));

  // ── SMOOTH SCROLL ────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 74, behavior: 'smooth' }); }
    });
  });

  // ── ACTIVE NAV HIGHLIGHT ─────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 110) cur = s.id; });
    navAs.forEach(a => {
      const active = a.getAttribute('href') === '#' + cur;
      a.style.color = active ? 'var(--indigo)' : '';
    });
  }, { passive: true });

  console.log('%c Gangadhar I Yaleholi', 'color:#4f32b8;font-size:18px;font-weight:800;');
  console.log('%c DevOps Engineer & Music Composer', 'color:#e8631a;font-size:13px;');
})();
