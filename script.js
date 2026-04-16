const siteNavItems = [
  { href: "index.html", label: "Inicio" },
  { href: "plot.html", label: "Historia" },
  { href: "hierarquia.html", label: "Hierarquia / Titulos" },
  { href: "familias.html", label: "Familias" },
  { href: "regras.html", label: "Regras" },
  { href: "ficha.html", label: "Ficha" },
  { href: "etiqueta.html", label: "Etiqueta / Vestimenta" }
];

function buildHeader() {
  const headerTarget = document.getElementById("site-header");
  if (!headerTarget) return;

  const current = location.pathname.split("/").pop() || "index.html";
  const activePage = current === "familia.html" ? "familias.html" : current;

  headerTarget.innerHTML = `
    <header class="topbar">
      <div class="container topbar-inner">
        <a class="brand" href="index.html">
          <div class="brand-mark" aria-hidden="true">W</div>
          <div class="brand-copy">
            <strong>Whispers</strong>
            <span>for Love</span>
          </div>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
        <nav class="nav" aria-label="Navegacao principal">
          <ul class="nav-list" id="site-nav">
            ${siteNavItems.map((item) => `
              <li><a href="${item.href}" class="${activePage === item.href ? "active" : ""}">${item.label}</a></li>
            `).join("")}
          </ul>
        </nav>
      </div>
    </header>
  `;

  const navToggle = headerTarget.querySelector(".nav-toggle");
  const navList = headerTarget.querySelector(".nav-list");
  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
}

function buildFooter() {
  const footerTarget = document.getElementById("site-footer");
  if (!footerTarget) return;

  footerTarget.innerHTML = `
    <footer class="footer">
      <div class="container footer-panel">
        <p>Whispers for Love &bull; Entre bailes, promessas e segredos, o coracao pode ser o maior risco.</p>
      </div>
    </footer>
  `;
}

function initReveal() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealItems.forEach((item) => observer.observe(item));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderFamilyPage() {
  const mount = document.getElementById("family-page");
  if (!mount || !window.familyData) return;

  const params = new URLSearchParams(location.search);
  const slug = params.get("casa") || "beaumont";
  const family = window.familyData[slug] || window.familyData.beaumont;

  document.title = `${family.casa} | Whispers for Love`;
  const heading = document.getElementById("family-heading");
  if (heading) heading.textContent = family.casa;

  const membersHtml = family.membros.map((member) => {
    const statusClass = member.status === "Disponivel" ? "status-available" : "status-unavailable";
    return `
      <article class="member-card">
        <div class="member-top">
          <h3>${escapeHtml(member.nome)}</h3>
          <span class="status-badge ${statusClass}">${escapeHtml(member.status)}</span>
        </div>
        <p><strong>Idade:</strong> ${escapeHtml(member.idade)}</p>
        <p>${escapeHtml(member.descricao)}</p>
      </article>
    `;
  }).join("");

  mount.innerHTML = `
    <p class="intro">Escolha um dos membros disponiveis desta familia para interpretar no RPG. Os indisponiveis continuam visiveis para manter a estrutura da casa completa.</p>
    <div class="family-sheet">
      <article class="info-card family-section">
        <span class="card-kicker">${escapeHtml(family.titulo)}</span>
        <h2>${escapeHtml(family.casa)}</h2>
        <div class="family-meta">
          <p><strong>Sobrenome:</strong> ${escapeHtml(family.sobrenome)}</p>
          <p><strong>Descricao:</strong> ${escapeHtml(family.descricao)}</p>
          <p><strong>Aparencia:</strong> ${escapeHtml(family.aparencia)}</p>
        </div>
      </article>
      <div class="member-list">${membersHtml}</div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  buildHeader();
  buildFooter();
  initReveal();
  renderFamilyPage();
});
