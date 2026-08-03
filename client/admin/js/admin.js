const API = window.API_BASE_URL;
const TOKEN_KEY = "portfolio_admin_token";

const loginView = document.getElementById("loginView");
const dashboardView = document.getElementById("dashboardView");
const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");
const loginBtn = document.getElementById("loginBtn");

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

function showDashboard() {
  loginView.hidden = true;
  dashboardView.hidden = false;
  loadProjects();
  loadMessages();
}

function showLogin() {
  loginView.hidden = false;
  dashboardView.hidden = true;
}

// ---------------------------------------------------------------------------
// Login / logout
// ---------------------------------------------------------------------------
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in…";
  loginStatus.textContent = "";

  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed.");

    localStorage.setItem(TOKEN_KEY, data.token);
    showDashboard();
  } catch (err) {
    loginStatus.textContent = err.message;
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Log in";
  }
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem(TOKEN_KEY);
  showLogin();
});

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("is-active"));
    tab.classList.add("is-active");
    document.getElementById(`panel-${tab.dataset.tab}`).classList.add("is-active");
  });
});

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
const projectForm = document.getElementById("projectForm");
const projectsList = document.getElementById("projectsList");
const newProjectBtn = document.getElementById("newProjectBtn");
const cancelProjectBtn = document.getElementById("cancelProjectBtn");

function openProjectForm(project = null) {
  projectForm.hidden = false;
  document.getElementById("projectId").value = project?._id || "";
  document.getElementById("title").value = project?.title || "";
  document.getElementById("description").value = project?.description || "";
  document.getElementById("githubUrl").value = project?.githubUrl || "";
  document.getElementById("liveUrl").value = project?.liveUrl || "";
  document.getElementById("tags").value = (project?.tags || []).join(", ");
  document.getElementById("order").value = project?.order ?? 0;
  projectForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

function hideProjectForm() {
  projectForm.reset();
  projectForm.hidden = true;
}

newProjectBtn.addEventListener("click", () => openProjectForm());
cancelProjectBtn.addEventListener("click", hideProjectForm);

projectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("projectId").value;

  const payload = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    githubUrl: document.getElementById("githubUrl").value.trim(),
    liveUrl: document.getElementById("liveUrl").value.trim(),
    tags: document
      .getElementById("tags")
      .value.split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    order: Number(document.getElementById("order").value) || 0,
  };

  const url = id ? `${API}/api/projects/${id}` : `${API}/api/projects`;
  const method = id ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Save failed.");
    hideProjectForm();
    loadProjects();
  } catch (err) {
    alert(err.message);
  }
});

async function loadProjects() {
  try {
    const res = await fetch(`${API}/api/projects`);
    const projects = await res.json();
    renderProjectsList(projects);
  } catch (err) {
    projectsList.innerHTML = `<p class="empty-state">Couldn't load projects.</p>`;
  }
}

function renderProjectsList(projects) {
  if (!projects.length) {
    projectsList.innerHTML = `<p class="empty-state">No projects yet. Click "+ New project" to add one.</p>`;
    return;
  }

  projectsList.innerHTML = projects
    .map(
      (p) => `
    <div class="admin-item glass">
      <div class="admin-item-main">
        <div class="admin-item-title">${escapeHtml(p.title)}</div>
        <div class="admin-item-meta">${(p.tags || []).join(" · ") || "No tags"}</div>
        <div class="admin-item-body">${escapeHtml(p.description)}</div>
      </div>
      <div class="admin-item-actions">
        <button class="btn btn-ghost btn-small" data-edit="${p._id}">Edit</button>
        <button class="btn btn-danger btn-small" data-delete="${p._id}">Delete</button>
      </div>
    </div>
  `
    )
    .join("");

  projectsList.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const project = projects.find((p) => p._id === btn.dataset.edit);
      openProjectForm(project);
    });
  });

  projectsList.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this project? This can't be undone.")) return;
      await fetch(`${API}/api/projects/${btn.dataset.delete}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      loadProjects();
    });
  });
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------
const messagesList = document.getElementById("messagesList");
const unreadBadge = document.getElementById("unreadBadge");

async function loadMessages() {
  try {
    const res = await fetch(`${API}/api/contact`, { headers: authHeaders() });
    const messages = await res.json();
    renderMessages(messages);
  } catch (err) {
    messagesList.innerHTML = `<p class="empty-state">Couldn't load messages.</p>`;
  }
}

function renderMessages(messages) {
  const unreadCount = messages.filter((m) => !m.read).length;
  unreadBadge.hidden = unreadCount === 0;
  unreadBadge.textContent = unreadCount;

  if (!messages.length) {
    messagesList.innerHTML = `<p class="empty-state">No messages yet.</p>`;
    return;
  }

  messagesList.innerHTML = messages
    .map(
      (m) => `
    <div class="admin-item glass">
      <div class="admin-item-main">
        <div class="admin-item-title">
          ${!m.read ? '<span class="unread-dot"></span>' : ""}
          ${escapeHtml(m.subject)}
        </div>
        <div class="admin-item-meta">${escapeHtml(m.name)} · ${escapeHtml(m.email)} · ${new Date(m.createdAt).toLocaleString()}</div>
        <div class="admin-item-body">${escapeHtml(m.message)}</div>
      </div>
      <div class="admin-item-actions">
        ${!m.read ? `<button class="btn btn-ghost btn-small" data-read="${m._id}">Mark read</button>` : ""}
        <button class="btn btn-danger btn-small" data-delete-msg="${m._id}">Delete</button>
      </div>
    </div>
  `
    )
    .join("");

  messagesList.querySelectorAll("[data-read]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await fetch(`${API}/api/contact/${btn.dataset.read}/read`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      loadMessages();
    });
  });

  messagesList.querySelectorAll("[data-delete-msg]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this message?")) return;
      await fetch(`${API}/api/contact/${btn.dataset.deleteMsg}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      loadMessages();
    });
  });
}

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------
function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
if (getToken()) {
  showDashboard();
} else {
  showLogin();
}
