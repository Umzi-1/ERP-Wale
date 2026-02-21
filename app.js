const vendors = [
  { name: "Oracle", segment: "Enterprise", summary: "Strong finance, global controls, analytics." },
  { name: "SAP", segment: "Enterprise", summary: "Deep industry process coverage and scale." },
  { name: "Microsoft", segment: "Mid to Enterprise", summary: "Dynamics suite with strong ecosystem fit." },
  { name: "Infor", segment: "Mid to Enterprise", summary: "Industry-focused cloud ERP solutions." },
  { name: "Epicor", segment: "SMB to Mid", summary: "Manufacturing and distribution strength." },
  { name: "Workday", segment: "Enterprise", summary: "Finance + HCM excellence with cloud-first model." },
  { name: "Acumatica", segment: "SMB to Mid", summary: "Flexible cloud ERP with strong usability." },
  { name: "Sage", segment: "SMB", summary: "Finance-led ERP and accounting centric options." },
  { name: "IFS", segment: "Mid to Enterprise", summary: "Asset-intensive and service-centric operations." },
  { name: "Odoo", segment: "SMB to Mid", summary: "Modular, cost-effective, rapid implementation." },
];

const featureMatrix = [
  ["Oracle", "✔", "✔", "◐", "◐", "◐", "✔"],
  ["SAP", "✔", "✔", "✔", "◐", "◐", "✔"],
  ["Microsoft", "✔", "✔", "◐", "◐", "✔", "✔"],
  ["Infor", "✔", "✔", "✔", "◐", "◐", "◐"],
  ["Epicor", "✔", "✔", "✔", "◐", "◐", "◐"],
  ["Workday", "✔", "◐", "✖", "✔", "◐", "✔"],
  ["Acumatica", "✔", "✔", "◐", "◐", "◐", "◐"],
  ["Sage", "✔", "◐", "✖", "◐", "◐", "◐"],
  ["IFS", "✔", "✔", "✔", "◐", "◐", "✔"],
  ["Odoo", "✔", "◐", "◐", "◐", "✔", "◐"],
];

const partners = [
  { name: "NexGen ERP Consulting", badges: "Certified • Gold", expertise: "SAP, Oracle, IFS", region: "Global" },
  { name: "ScaleOps Implementers", badges: "Certified", expertise: "Microsoft, Acumatica, Sage", region: "EMEA + APAC" },
  { name: "Agile ERP Labs", badges: "Premium", expertise: "Odoo, Epicor, Infor", region: "India + Middle East" },
];

function renderCards() {
  document.getElementById("vendor-cards").innerHTML = vendors
    .map(
      (v) => `
      <article class="card">
        <h4>${v.name}</h4>
        <p><strong>Fit:</strong> ${v.segment}</p>
        <p class="muted">${v.summary}</p>
      </article>`
    )
    .join("");
}

function renderFeatureMatrix() {
  document.getElementById("feature-matrix-body").innerHTML = featureMatrix
    .map(
      (row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`
    )
    .join("");
}

function renderPartners() {
  document.getElementById("partner-list").innerHTML = partners
    .map(
      (p) => `
      <article class="card">
        <h4>${p.name}</h4>
        <p>${p.badges}</p>
        <p><strong>Expertise:</strong> ${p.expertise}</p>
        <p><strong>Region:</strong> ${p.region}</p>
        <button class="btn small" data-partner="${p.name}">Request Contact</button>
      </article>`
    )
    .join("");

  document.querySelectorAll("[data-partner]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.getElementById("partner-status").textContent = `Request submitted to ${btn.dataset.partner}. A specialist will reach out shortly.`;
    });
  });
}

function getLeadStorage() {
  return JSON.parse(localStorage.getItem("erpLeads") || "[]");
}

function setLeadStorage(leads) {
  localStorage.setItem("erpLeads", JSON.stringify(leads));
}

function renderLeadConsole() {
  const leads = getLeadStorage();
  const list = document.getElementById("lead-console");
  if (!leads.length) {
    list.innerHTML = "<li>No leads yet. Submit the readiness form to see entries.</li>";
    return;
  }
  list.innerHTML = leads
    .slice(-5)
    .reverse()
    .map((lead) => `<li><strong>${lead.company}</strong> • ${lead.email} • ${lead.recommendation}</li>`)
    .join("");
}

function recommendationEngine({ employees, budget, maturity, priority }) {
  const score = new Map(vendors.map((v) => [v.name, 0]));

  if (employees === "10-50" || employees === "51-200") ["Odoo", "Sage", "Acumatica", "Epicor"].forEach((v) => score.set(v, score.get(v) + 2));
  if (employees === "201-1000" || employees === "1000+") ["SAP", "Oracle", "Microsoft", "IFS", "Workday"].forEach((v) => score.set(v, score.get(v) + 2));

  if (budget === "low") ["Odoo", "Sage", "Acumatica"].forEach((v) => score.set(v, score.get(v) + 2));
  if (budget === "mid") ["Microsoft", "Infor", "Epicor"].forEach((v) => score.set(v, score.get(v) + 2));
  if (budget === "high") ["SAP", "Oracle", "Workday", "IFS"].forEach((v) => score.set(v, score.get(v) + 2));

  if (maturity === "basic") ["Odoo", "Sage", "Acumatica"].forEach((v) => score.set(v, score.get(v) + 1));
  if (maturity === "advanced") ["SAP", "Oracle", "IFS", "Workday"].forEach((v) => score.set(v, score.get(v) + 1));

  if (priority === "cost") ["Odoo", "Sage", "Acumatica", "Epicor"].forEach((v) => score.set(v, score.get(v) + 2));
  if (priority === "control") ["SAP", "Oracle", "Workday"].forEach((v) => score.set(v, score.get(v) + 2));
  if (priority === "scale") ["Microsoft", "SAP", "Oracle", "IFS"].forEach((v) => score.set(v, score.get(v) + 2));

  return [...score.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((entry) => entry[0]);
}

document.getElementById("assessment-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData.entries());

  const shortlist = recommendationEngine(payload);
  const complexity = payload.maturity === "advanced" ? 78 : payload.maturity === "intermediate" ? 55 : 34;

  document.getElementById("assessment-results").innerHTML = `
    <article class="card">
      <h4>Readiness Report</h4>
      <p><strong>Complexity Index:</strong> ${complexity}/100</p>
      <p><strong>Shortlist:</strong> ${shortlist.join(", ")}</p>
      <p><strong>Next best action:</strong> Generate RFP and invite 2-3 implementation partners.</p>
    </article>
  `;

  const leads = getLeadStorage();
  leads.push({
    company: payload.company,
    email: payload.email,
    recommendation: shortlist.join(", "),
  });
  setLeadStorage(leads);
  renderLeadConsole();
});

document.getElementById("calc-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const users = Number(formData.get("users"));
  const currentCost = Number(formData.get("currentCost"));
  const savingsPercent = Number(formData.get("savingsPercent"));
  const implCost = Number(formData.get("implCost"));

  const annualSavings = currentCost * (savingsPercent / 100);
  const threeYearTco = implCost + currentCost * 3 - annualSavings * 3;
  const roi = implCost ? ((annualSavings * 3 - implCost) / implCost) * 100 : 0;
  const paybackMonths = annualSavings ? Math.ceil((implCost / annualSavings) * 12) : "N/A";

  document.getElementById("calc-results").innerHTML = `
    <article class="card">
      <h4>Financial Snapshot</h4>
      <p><strong>Users modeled:</strong> ${users}</p>
      <p><strong>Estimated annual savings:</strong> $${annualSavings.toLocaleString()}</p>
      <p><strong>3-year TCO estimate:</strong> $${threeYearTco.toLocaleString()}</p>
      <p><strong>3-year ROI:</strong> ${roi.toFixed(1)}%</p>
      <p><strong>Estimated payback:</strong> ${paybackMonths} months</p>
    </article>
  `;
});

document.getElementById("rfp-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const scope = formData.get("scope");
  const vendorList = formData.get("vendors");
  const timeline = formData.get("timeline");

  const content = [
    "ERP RFP Draft",
    "================",
    `Scope: ${scope}`,
    `Preferred vendors: ${vendorList}`,
    `Timeline: ${timeline}`,
    "Milestones:",
    "1. Discovery & design",
    "2. Configuration & migration",
    "3. UAT & training",
    "4. Go-live & hypercare",
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "erp-rfp-draft.txt";
  link.click();
  URL.revokeObjectURL(link.href);
});

document.getElementById("partner-onboard-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const company = formData.get("partnerCompany");
  document.getElementById("onboard-status").textContent = `Partner onboarded: ${company}. Admin review pending.`;
  e.target.reset();
});

renderCards();
renderFeatureMatrix();
renderPartners();
renderLeadConsole();
