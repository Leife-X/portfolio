// ============================================
// BOOT SEQUENCE
// ============================================
window.addEventListener('DOMContentLoaded', () => {
  const boot = document.getElementById('boot-screen');
  const bar = document.querySelector('.boot-bar-fill');
  gsap.to(bar, { width: '100%', duration: 1.1, ease: 'power2.inOut' });
  gsap.to(boot, {
    opacity: 0, duration: 0.5, delay: 1.2, ease: 'power1.out',
    onComplete: () => { boot.style.display = 'none'; playIntro(); }
  });
});

// ============================================
// LOAD CONTENT
// ============================================
async function loadContent() {
  try {
    const res = await fetch('content/data.json');
    const data = await res.json();
    renderProfile(data.profile);
    renderMissions(data.missions);
    renderLoadout(data.loadout);
    renderExperience(data.experience);
    renderArchive(data.archive);
    renderContact(data.profile.contact);
  } catch (err) {
    console.error('Could not load content/data.json', err);
  }
}

function renderProfile(profile) {
  document.getElementById('agent-name').textContent = profile.name.toUpperCase();
  document.getElementById('agent-role').textContent = profile.role.toUpperCase();
  document.getElementById('agent-bio').textContent = profile.bio;
  document.title = `${profile.name} — ${profile.role}`;
  const photoImg = document.querySelector('#agent-photo img');
  if (profile.photo) photoImg.src = profile.photo;
  const resumeLink = document.getElementById('resume-link');
  if (profile.resume) resumeLink.href = profile.resume;
}

function renderMissions(missions = []) {
  const grid = document.getElementById('missions-grid');
  grid.innerHTML = missions.map(m => `
    <article class="mission-card">
      <div class="mission-top">
        <span class="mission-codename">${m.codename || ''}</span>
        <span class="mission-status ${m.status === 'DEPLOYED' ? 'deployed' : ''}">${m.status || ''}</span>
      </div>
      <h3 class="mission-title">${m.title}</h3>
      <p class="mission-desc">${m.description}</p>
      <div class="mission-tech">
        ${(m.tech || []).map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

function renderLoadout(loadout = {}) {
  const grid = document.getElementById('loadout-grid');
  const groups = [
    { label: 'LANGUAGES', items: loadout.languages },
    { label: 'FRAMEWORKS', items: loadout.frameworks },
    { label: 'TOOLS', items: loadout.tools }
  ];
  grid.innerHTML = groups.filter(g => g.items && g.items.length).map(g => `
    <div class="loadout-group">
      <h3>${g.label}</h3>
      <ul>${g.items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>
  `).join('');
}

function renderExperience(experience = []) {
  const timeline = document.getElementById('experience-timeline');
  if (!experience.length) {
    timeline.innerHTML = `<p style="color:var(--white-dim); font-family:var(--font-mono); font-size:13px;">No entries yet — add your work experience via the admin panel or content/data.json.</p>`;
    return;
  }
  timeline.innerHTML = experience.map(e => `
    <div class="timeline-item">
      <span class="timeline-period">${e.period || ''}</span>
      <div class="timeline-role-row">
        <span class="timeline-role">${e.role}</span>
        ${e.type ? `<span class="timeline-type">${e.type}</span>` : ''}
      </div>
      <span class="timeline-org">${e.org || ''}</span>
      ${e.photo ? `
      <div class="timeline-photo">
        <img src="${e.photo}" alt="${e.org || e.role}" onerror="this.parentElement.classList.add('no-photo')">
        <div class="timeline-photo-placeholder"><span>ADD LOCATION PHOTO</span></div>
      </div>` : ''}
      <p class="timeline-summary">${e.summary || ''}</p>
    </div>
  `).join('');
}

function embedVideo(url) {
  let embedSrc = null;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (yt) embedSrc = `https://www.youtube.com/embed/${yt[1]}`;
  else if (vimeo) embedSrc = `https://player.vimeo.com/video/${vimeo[1]}`;
  if (!embedSrc) return `<a href="${url}" target="_blank" rel="noopener" style="color:var(--cyan); font-family:var(--font-mono); font-size:12px;">▶ WATCH VIDEO</a>`;
  return `<iframe src="${embedSrc}" style="width:100%; height:100%; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
}

function renderArchive(archive = []) {
  const grid = document.getElementById('archive-grid');
  const filtersWrap = document.getElementById('archive-filters');

  // Build the unique category list from the data — the tab bar adapts automatically
  const categories = ['ALL', ...new Set(archive.map(a => (a.category || 'DESIGN').toUpperCase()))];

  filtersWrap.innerHTML = categories.map((c, i) => `
    <button class="filter-tab ${i === 0 ? 'active' : ''}" data-filter="${c}">${c}</button>
  `).join('');

  grid.innerHTML = archive.map(a => `
    <article class="archive-card" data-category="${(a.category || 'DESIGN').toUpperCase()}">
      <div class="archive-thumb">
        <span class="archive-category-badge">${a.category || 'DESIGN'}</span>
        ${a.video_url ? embedVideo(a.video_url) : `<img src="${a.image}" alt="${a.title}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'; this.parentElement.textContent='IMAGE: ${a.image}'">`}
      </div>
      <div class="archive-body">
        <h3>${a.title}</h3>
        <p>${a.description}</p>
        <div class="mission-tech">${(a.tools || []).map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
      </div>
    </article>
  `).join('');

  filtersWrap.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      filtersWrap.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      grid.querySelectorAll('.archive-card').forEach(card => {
        const show = filter === 'ALL' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });
}

function renderContact(contact = {}) {
  const wrap = document.getElementById('contact-links');
  const links = [
    contact.email ? { label: 'EMAIL', value: contact.email, href: `mailto:${contact.email}` } : null,
    contact.github ? { label: 'GITHUB', value: contact.github.replace('https://', ''), href: contact.github } : null,
    contact.linkedin ? { label: 'LINKEDIN', value: contact.linkedin.replace('https://', ''), href: contact.linkedin } : null,
  ].filter(Boolean);
  wrap.innerHTML = links.map(l => `
    <a class="contact-link" href="${l.href}" target="_blank" rel="noopener">
      <span style="color:var(--cyan)">${l.label}</span> ${l.value}
    </a>
  `).join('');
  document.getElementById('year').textContent = new Date().getFullYear();
}

loadContent();

// ============================================
// GSAP SCROLL / PARALLAX
// ============================================
window.addEventListener('load', () => {
  gsap.registerPlugin(ScrollTrigger);

  // Parallax layers move at different speeds — the Genshin-style scroll feel
  document.querySelectorAll('[data-speed]').forEach(el => {
    const speed = parseFloat(el.dataset.speed);
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('.section'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // Section reveal animations
  gsap.utils.toArray('.mission-card').forEach((card, i) => {
    gsap.from(card, {
      y: 40, opacity: 0, duration: 0.6, delay: i * 0.05,
      scrollTrigger: { trigger: card, start: 'top 90%' }
    });
  });

  gsap.utils.toArray('.loadout-group').forEach((el, i) => {
    gsap.from(el, {
      y: 30, opacity: 0, duration: 0.5, delay: i * 0.08,
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });

  gsap.utils.toArray('.timeline-item').forEach((el, i) => {
    gsap.from(el, {
      x: -20, opacity: 0, duration: 0.5, delay: i * 0.08,
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });

  gsap.utils.toArray('.archive-card').forEach((el, i) => {
    gsap.from(el, {
      y: 30, opacity: 0, duration: 0.5, delay: i * 0.08,
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });

  gsap.utils.toArray('.section-head').forEach(el => {
    gsap.from(el, {
      x: -20, opacity: 0, duration: 0.6,
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
});

// ============================================
// ACTIVE NAV HIGHLIGHT (tactical HUD tracking)
// ============================================
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.hud-nav a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => observer.observe(s));

// ============================================
// RETICLE FOLLOW (desktop only, decorative HUD cursor)
// ============================================
const reticle = document.getElementById('reticle');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('mousemove', e => {
    reticle.style.opacity = 1;
    reticle.style.left = e.clientX + 'px';
    reticle.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => reticle.style.transform = 'translate(-50%,-50%) scale(1.6)');
    el.addEventListener('mouseleave', () => reticle.style.transform = 'translate(-50%,-50%) scale(1)');
  });
}

// ============================================
// INTRO GLITCH SEQUENCE (agent name typing/flicker on load)
// ============================================
function playIntro() {
  const tl = gsap.timeline();
  tl.from('.agent-frame', { opacity: 0, scale: 0.9, duration: 0.6, ease: 'power2.out' })
    .from('.eyebrow', { opacity: 0, y: 10, duration: 0.4 }, '-=0.2')
    .from('.agent-name', { opacity: 0, y: 20, duration: 0.5 }, '-=0.2')
    .from('.agent-role', { opacity: 0, duration: 0.4 }, '-=0.2')
    .from('.agent-bio', { opacity: 0, y: 10, duration: 0.4 }, '-=0.2')
    .from('.agent-actions', { opacity: 0, y: 10, duration: 0.4 }, '-=0.2')
    .from('.hud-nav', { opacity: 0, x: -20, duration: 0.5 }, '-=0.6');
}
