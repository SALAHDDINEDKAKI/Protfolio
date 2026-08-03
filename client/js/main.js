// ---------------------------------------------------------------------------
// Footer year
// ---------------------------------------------------------------------------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------------------------------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

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
// Projects — loaded from the API, with a graceful fallback if the
// backend isn't running yet (e.g. while you're still setting it up).
// ---------------------------------------------------------------------------
const FALLBACK_PROJECTS = [
  {
    title: "Add your first project",
    description:
      "This is placeholder content. Log into the admin panel to add your real projects — they'll appear here automatically, no code changes needed.",
    tags: ["Getting started"],
    githubUrl: "https://github.com/SALAHDDINEDKAKI",
    liveUrl: "",
  },
];

function projectIconSVG() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>`;
}

function externalLinkSVG() {
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/></svg>`;
}

function githubMarkSVG() {
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.58.24 2.75.12 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.2.67.8.56A10.53 10.53 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z"/></svg>`;
}

function renderProjects(projects) {
  const grid = document.getElementById("projectsGrid");

  if (!projects || projects.length === 0) {
    grid.innerHTML = `<p class="projects-state">No projects yet — add some from the admin panel.</p>`;
    return;
  }

  grid.innerHTML = projects
    .map(
      (p) => `
    <article class="project-card glass">
      <div class="project-card-top">
        <div class="project-icon">${projectIconSVG()}</div>
        <div class="project-links">
          ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener" aria-label="View code on GitHub">${githubMarkSVG()}</a>` : ""}
          ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener" aria-label="View live project">${externalLinkSVG()}</a>` : ""}
        </div>
      </div>
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.description || ""}</p>
      <div class="project-tags">
        ${(p.tags || []).map((t) => `<span>${t}</span>`).join("")}
      </div>
    </article>
  `
    )
    .join("");
}

async function loadProjects() {
  try {
    const res = await fetch(`${window.API_BASE_URL}/api/projects`);
    if (!res.ok) throw new Error("Bad response");
    const data = await res.json();
    renderProjects(data.length ? data : FALLBACK_PROJECTS);
  } catch (err) {
    // Backend not reachable yet — show fallback so the page still looks complete.
    renderProjects(FALLBACK_PROJECTS);
  }
}

loadProjects();

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: contactForm.name.value.trim(),
    email: contactForm.email.value.trim(),
    subject: contactForm.subject.value.trim(),
    message: contactForm.message.value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
  formStatus.textContent = "";
  formStatus.className = "form-status";

  try {
    const res = await fetch(`${window.API_BASE_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Request failed");

    formStatus.textContent = "Message sent — thanks! I'll get back to you soon.";
    formStatus.classList.add("success");
    contactForm.reset();
  } catch (err) {
    formStatus.textContent =
      "Couldn't send right now — the backend may not be running yet. You can email me directly instead.";
    formStatus.classList.add("error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send message";
  }
});
