// ---------- Reveal on scroll ----------
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

// ---------- Mobile nav ----------
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

const setActiveLink = () => {
  if (!navLinks) return;
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.querySelectorAll('a').forEach((link) => {
    const href = link.getAttribute('href');
    const isActive = href && (href === currentPath || (currentPath === '' && href === 'index.html'));
    link.classList.toggle('active', isActive);
  });
};

if (menuToggle && navLinks) {
  setActiveLink();
  navLinks.setAttribute('aria-hidden', 'true');

  const closeMobileNav = () => {
    navLinks.classList.remove('open');
    document.body.classList.remove('nav-open');
    document.documentElement.classList.remove('nav-open');
    navLinks.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    navLinks.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('nav-open', isOpen);
    document.documentElement.classList.toggle('nav-open', isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileNav();
  });

  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 721px)').matches) {
      closeMobileNav();
    }
  });
}

// ---------- Dashboard: animate gauge bars & stat counters on view ----------
const gaugeFills = document.querySelectorAll('.gauge-fill');
gaugeFills.forEach((bar) => {
  const target = bar.getAttribute('data-fill') || '0';
  requestAnimationFrame(() => {
    bar.style.width = target + '%';
  });
});

const counters = document.querySelectorAll('[data-count]');
counters.forEach((el) => {
  const target = parseFloat(el.getAttribute('data-count'));
  const suffix = el.getAttribute('data-suffix') || '';
  const decimals = el.getAttribute('data-count').includes('.') ? 1 : 0;
  let frame = 0;
  const totalFrames = 40;
  const step = () => {
    frame++;
    const progress = Math.min(frame / totalFrames, 1);
    const value = target * progress;
    el.textContent = value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  step();
});

// ---------- Task checklist toggle (dashboard) ----------
document.querySelectorAll('.task-check').forEach((box) => {
  box.addEventListener('click', () => box.classList.toggle('done'));
});

// ---------- Dashboard mobile hamburger and working dashboard sections ----------
const dashMenuToggle = document.querySelector('.dash-menu-toggle');
const dashSidebar = document.querySelector('.dash-sidebar');
const closedDashMenuLabel = 'Dashboard Menu';
const openDashMenuLabel = 'Close Dashboard Menu';
if (dashMenuToggle && dashSidebar) {
  dashMenuToggle.addEventListener('click', () => {
    const isOpen = dashSidebar.classList.toggle('open');
    dashMenuToggle.setAttribute('aria-expanded', String(isOpen));
    dashMenuToggle.textContent = isOpen ? openDashMenuLabel : closedDashMenuLabel;
  });
}

const dashboardDetails = {
  overview: {
    title: 'Farm Overview', tag: 'Live dashboard',
    intro: 'A complete snapshot of Greenfield Farm with crop health, irrigation, labour tasks, alerts, and harvest planning in one place.',
    cards: [
      ['Today\'s priority', 'Inspect tomato greenhouse, irrigate the south orchard, and review market prices before dispatch decisions.'],
      ['Farm progress', '14 active fields are tracked with crop stage, moisture level, field health, inventory, and task completion.'],
      ['Recommended action', 'Keep low-moisture plots on drip irrigation and update inventory after fertilizer and pesticide usage.']
    ]
  },
  crops: {
    title: 'Crops & Yield', tag: 'Season planning',
    intro: 'Track crop stages from nursery to harvest and compare expected yield against previous seasons for better planning.',
    cards: [
      ['Wheat block', 'North field is in grain-filling stage with strong canopy growth and an expected yield of 4.8 t/ha.'],
      ['Rice paddock', 'East paddock is stable after transplanting with healthy water coverage and low disease pressure.'],
      ['Harvest note', 'Schedule labour and transport early for mango and vegetable blocks to reduce post-harvest loss.']
    ]
  },
  water: {
    title: 'Water Usage', tag: 'Irrigation control',
    intro: 'Monitor weekly water usage, high-consumption days, and moisture gaps to reduce waste while protecting crop health.',
    cards: [
      ['Peak usage', 'Thursday had the highest irrigation load; check valve timing and pump schedule for overuse.'],
      ['Saving plan', 'Move dry-zone crops to early morning watering and keep drip lines active for short, controlled cycles.'],
      ['Alert', 'West greenhouse moisture is only 22%, so inspect emitters and flush clogged lines today.']
    ]
  },
  soil: {
    title: 'Soil Health', tag: 'Nutrient status',
    intro: 'Review moisture, pH, organic matter, nitrogen demand, and field-level soil improvement tasks.',
    cards: [
      ['Moisture', 'North field and east paddock are in safe range, while south orchard and west greenhouse need attention.'],
      ['Nutrition', 'Wheat needs nitrogen top-dressing; mango block should receive compost mulch around root zones.'],
      ['Best practice', 'Record every input application to compare yield gain with fertilizer and water cost.']
    ]
  },
  weather: {
    title: 'Weather', tag: 'Farm forecast',
    intro: 'Use weather signals to schedule irrigation, spraying, labour work, and harvest activities safely.',
    cards: [
      ['Today', 'Sunny weather with light breeze is suitable for field inspection, irrigation checks, and harvest preparation.'],
      ['Spray window', 'Avoid spraying during strong wind; choose calm evening hours for better coverage.'],
      ['Preparation', 'Keep shade nets, mulch, and emergency pump checks ready for heat stress days.']
    ]
  },
  inventory: {
    title: 'Inventory', tag: 'Stock control',
    intro: 'Track seeds, fertilizers, organic inputs, tools, packing materials, and reorder levels before stockouts happen.',
    cards: [
      ['Seeds', 'Wheat and vegetable seeds are sufficient for current blocks; rice nursery seed stock should be reviewed next week.'],
      ['Inputs', 'Nitrogen fertilizer is moving fast due to top-dressing tasks. Update stock after today\'s application.'],
      ['Packing', 'Fruit crates and produce bags should be ordered before mango dispatch begins.']
    ]
  },
  market: {
    title: 'Market Prices', tag: 'Sales planning',
    intro: 'Compare crop prices, demand trends, and dispatch timing to choose the best selling window.',
    cards: [
      ['Wheat', 'Current demand is steady; hold premium lots for bulk buyers when moisture and grading are confirmed.'],
      ['Tomato', 'Price movement is sensitive to supply, so send only clean, graded produce to protect margins.'],
      ['Action', 'Check wholesale rate, local mandi demand, and transport availability before final harvest dispatch.']
    ]
  },
  settings: {
    title: 'Settings', tag: 'Farm profile',
    intro: 'Manage farm profile details, notification preferences, field names, alert thresholds, and dashboard display settings.',
    cards: [
      ['Profile', 'Update farmer name, farm location, crop area, and preferred language for clear records.'],
      ['Alerts', 'Set warning levels for low moisture, pest reports, high water usage, and stock reorder reminders.'],
      ['Access', 'Keep dashboard access protected and use logout after checking farm data on shared devices.']
    ]
  }
};

const dashDetailTitle = document.getElementById('dashDetailTitle');
const dashDetailIntro = document.getElementById('dashDetailIntro');
const dashDetailTag = document.getElementById('dashDetailTag');
const dashDetailGrid = document.getElementById('dashDetailGrid');
const dashSectionControls = document.querySelectorAll('.dash-nav [data-section]');

dashSectionControls.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const section = link.dataset.section || 'overview';
    const data = dashboardDetails[section];
    if (data && dashDetailTitle && dashDetailIntro && dashDetailTag && dashDetailGrid) {
      dashDetailTitle.textContent = data.title;
      dashDetailIntro.textContent = data.intro;
      dashDetailTag.textContent = data.tag;
      dashDetailGrid.innerHTML = data.cards.map(([title, text]) => `<div class="detail-card"><h4>${title}</h4><p>${text}</p></div>`).join('');
      dashSectionControls.forEach((item) => {
        item.classList.remove('active');
        item.setAttribute('aria-pressed', 'false');
      });
      link.classList.add('active');
      link.setAttribute('aria-pressed', 'true');
    }
    if (dashSidebar && window.matchMedia('(max-width: 1080px)').matches) {
      dashSidebar.classList.remove('open');
      if (dashMenuToggle) {
        dashMenuToggle.setAttribute('aria-expanded', 'false');
        dashMenuToggle.textContent = closedDashMenuLabel;
      }
    }
  });
});
