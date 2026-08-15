// ---------------------------------------------------------------------------
// Footer year
// ---------------------------------------------------------------------------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------------------------------
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

navToggle.addEventListener("click", () => {
  const isHidden = mobileNav.classList.contains("hidden");
  mobileNav.classList.toggle("hidden", !isHidden);
  mobileNav.classList.toggle("flex", isHidden);
  navToggle.setAttribute("aria-expanded", String(isHidden));
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.add("hidden");
    mobileNav.classList.remove("flex");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ---------------------------------------------------------------------------
// Floating nav — invisible at the top of the page, becomes a solid pill
// stuck to the top once the user scrolls past NAV_SCROLL_THRESHOLD.
// ---------------------------------------------------------------------------
const mainNav = document.getElementById("mainNav");
const NAV_SCROLL_THRESHOLD = 24;
const NAV_SCROLLED_CLASSES = [
  "border",
  "border-tomato-500/20",
  "bg-ink-light/90",
  "backdrop-blur",
  "shadow-lg",
  "shadow-black/30",
  "rounded-full"
];

function updateNavOnScroll() {
  const isScrolled = window.scrollY > NAV_SCROLL_THRESHOLD;
  mainNav.classList.toggle(NAV_SCROLLED_CLASSES[0], isScrolled);
  NAV_SCROLLED_CLASSES.forEach((cls) => mainNav.classList.toggle(cls, isScrolled));
}

window.addEventListener("scroll", updateNavOnScroll, { passive: true });
updateNavOnScroll();

// ---------------------------------------------------------------------------
// Scroll reveal
// ---------------------------------------------------------------------------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

// ---------------------------------------------------------------------------
// Work History — edit this array to add, remove, or reorder roles.
// The first entry is real. The other three are placeholders so the
// tab-switching UI has something to show — swap in real company/role/
// dates/bullets before publishing.
// ---------------------------------------------------------------------------
const EXPERIENCE = [
  {
    company: "A-Team-Event",
    role: "Event Assistant",
    location: "Frankfurt, Germany",
    dates: "07/2026 – Present",
    bullets: [
      "Handled on-site logistics and material transport",
      "Maintained compliance with food hygiene standard",
      "Provided catering service at live events"
    ],
  },
  {
    company: "Decathlon",
    role: "Warehouse Associate",
    location: "Schwetzingen, Germany",
    dates: "07/2025 – 05/2026",
    bullets: [
      "Sorted, scanned and packed customer orders to meet dispatch deadlines",
      "Loaded finished orders for shipping partners including DHL and Hermes",
      "Worked within a fast-paced logistics team to hit daily targets",
    ],
  },
  {
    company: "Carrefour",
    role: "Sales Assistant",
    location: "Agadir, Morocco",
    dates: "04/2023 – 09/2023",
    bullets: [
      "Assisted customers with product selection and general inquiries on the sales floor",
      "Restocked shelves and maintained product displays throughout the store",
      "Operated the cash register and processed customer transactions",
    ],
  },
];

let activeExperienceIndex = 0;

function renderExperience() {
  const tabsEl = document.getElementById("experienceTabs");
  const contentEl = document.getElementById("experienceContent");

  tabsEl.innerHTML = EXPERIENCE.map((exp, i) => {
    const isActive = i === activeExperienceIndex;
    const tabClasses = isActive
      ? "border-tomato-500/40 bg-tomato-500/10 text-tomato-200"
      : "border-transparent text-cream/50 hover:bg-ink-light hover:text-cream/80";
    return `
      <li class="flex-shrink-0 md:flex-shrink">
        <button type="button" data-index="${i}" class="exp-tab w-full whitespace-nowrap rounded-xl border px-4 py-3 text-left font-mono text-xs transition ${tabClasses}">
          ${exp.company}
        </button>
      </li>
    `;
  }).join("");

  const exp = EXPERIENCE[activeExperienceIndex];
  contentEl.innerHTML = `
    <div class="rounded-2xl border border-tomato-500/20 bg-ink-light p-7">
      <div class="flex flex-wrap items-baseline justify-between gap-3">
        <h3 class="font-display text-lg font-semibold text-cream">${exp.role} <span class="text-tomato-300">— ${exp.company}</span></h3>
        <span class="font-mono text-xs text-cream/50">${exp.dates}</span>
      </div>
      <p class="mt-1 text-sm text-cream/50">${exp.location}</p>
      <ul class="mt-5 space-y-2.5 text-sm text-cream/65">
        ${exp.bullets
          .map(
            (b) =>
              `<li class="flex gap-3"><span class="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-tomato-400"></span>${b}</li>`
          )
          .join("")}
      </ul>
    </div>
  `;

  tabsEl.querySelectorAll(".exp-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeExperienceIndex = Number(btn.dataset.index);
      renderExperience();
    });
  });
}

renderExperience();

// ---------------------------------------------------------------------------
// Projects — edit this array to add, remove, or reorder your work.
// No backend, no database: this list IS the source of truth.
// imageUrl uses GitHub's own auto-generated repo preview image, so it stays
// in sync with each repo automatically. Swap in a real screenshot path
// (e.g. "assets/projects/adidas.png") any time you want a custom one.
// ---------------------------------------------------------------------------
const PROJECTS = [
  {
    title: "Adidas US Sales Analytics",
    description: "Exploratory analysis of Adidas's U.S. retail sales — regional performance, product trends, and profit margins broken down and visualized.",
    tags: ["Pandas", "Matplotlib", "Python", "Power BI", "PostgreSQL", "HTML"],
    githubUrl: "https://github.com/SALAHDDINEDKAKI/adidas-us-sales-analytics",
    liveUrl: "",
    imageUrl: "/Protfolio/assets/thumbnail1.png",
  },
  {
    title: "HR KPI Excel Dashboard",
    description: "An HR analytics dashboard built in Excel tracking headcount, attrition, average tenure, salary by department, and performance rating distribution.",
    tags: ["Excel", "KPI Dashboard", "Pivots", "Charts"],
    githubUrl: "https://github.com/SALAHDDINEDKAKI/hr-kpi-excel-dashboard",
    liveUrl: "",
    imageUrl: "/Protfolio/assets/thumbnail3.png",
  },
  {
    title: "Healthcare Spending vs. Life Expectancy",
    description: "A data story exploring the relationship between healthcare spending and life expectancy across countries, built with pandas and matplotlib/seaborn.",
    tags: ["Python", "Pandas", "Data Visualization", "Matplotlib", "Seaborn"],
    githubUrl: "https://github.com/SALAHDDINEDKAKI/healthcare-spending-life-expectancy",
    liveUrl: "",
    imageUrl: "/Protfolio/assets/thumbnail2.png",
  },
  {
    title: "SaaS Subscription SQL Analysis",
    description: "Eight business-question SQL queries against a SaaS subscription dataset in PostgreSQL, churn, revenue, and customer behavior answered directly in SQL.",
    tags: ["SQL", "PostgreSQL", "Data Analysis"],
    githubUrl: "https://github.com/SALAHDDINEDKAKI/saas-subscription-sql-analysis",
    liveUrl: "",
    imageUrl: "/Protfolio/assets/thumbnail4.png",
  },
  {
    title: "Ev population analysis",
    description: "Analysis of Washington State's electric vehicle registration data using Python, SQL, and Power BI",
    tags: ["Python", "SQL", "Power BI", "Data Analysis"],
    githubUrl: "https://github.com/SALAHDDINEDKAKI/ev-population-analysis",
    liveUrl: "",
    imageUrl: "/Protfolio/assets/thumbnail5.png",
  },
];

function externalLinkSVG() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>`;
}

function githubMarkSVG() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.58.24 2.75.12 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.2.67.8.56A10.53 10.53 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z"/></svg>`;
}

function renderProjects() {
  const grid = document.getElementById("projectsGrid");

  grid.innerHTML = PROJECTS.map(
    (p) => `
    <article class="overflow-hidden rounded-2xl border border-tomato-500/20 bg-ink-light transition hover:border-tomato-500/40 hover:-translate-y-1">
      <div class="aspect-video w-full border-b border-tomato-500/20 bg-ink">
        <img src="${p.imageUrl}" alt="${p.title}" class="h-full w-full object-cover" loading="lazy" />
      </div>
      <div class="p-6">
        <div class="flex items-start justify-between gap-3">
          <h3 class="font-display text-lg font-semibold text-cream">${p.title}</h3>
          <div class="flex flex-shrink-0 gap-2">
            ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener" aria-label="View code on GitHub" class="text-cream/40 transition hover:text-tomato-300">${githubMarkSVG()}</a>` : ""}
            ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener" aria-label="View live project" class="text-cream/40 transition hover:text-tomato-300">${externalLinkSVG()}</a>` : ""}
          </div>
        </div>
        <p class="mt-2 text-sm text-cream/60">${p.description}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          ${p.tags.map((t) => `<span class="rounded-full border border-tomato-500/25 px-3 py-1 font-mono text-[11px] text-tomato-200">${t}</span>`).join("")}
        </div>
      </div>
    </article>
  `
  ).join("");
}

renderProjects();

// ---------------------------------------------------------------------------
// Contact form — no backend, so this opens the visitor's email client with
// the message pre-filled (a mailto: link built from the form fields).
// ---------------------------------------------------------------------------
const CONTACT_EMAIL = "salahddinedkaki@gmail.com";
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const subject = contactForm.subject.value.trim();
  const message = contactForm.message.value.trim();

  const body = `From: ${name} (${email})\n\n${message}`;
  const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoUrl;

  formStatus.textContent = "Opening your email client to send this…";
  formStatus.className = "mt-3 font-mono text-xs text-emerald-400";
});