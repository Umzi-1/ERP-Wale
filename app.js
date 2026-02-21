const erpCatalog = [
  {
    name: "Odoo",
    fit: "Startups, SMEs, and cost-conscious scaling businesses",
    strengths: "Modular apps, fast deployment, high flexibility",
    complexity: "Low to Medium",
    tags: ["startup", "mid", "low", "medium", "fast", "cost", "flexibility"],
  },
  {
    name: "Microsoft Dynamics 365",
    fit: "Mid-market to enterprise, Microsoft ecosystem users",
    strengths: "Strong CRM + ERP integration, familiar UX, cloud options",
    complexity: "Medium",
    tags: ["mid", "enterprise", "medium", "high", "normal", "scale", "flexibility"],
  },
  {
    name: "SAP S/4HANA",
    fit: "Complex global enterprises with deep process requirements",
    strengths: "Advanced controls, global compliance, industry depth",
    complexity: "High",
    tags: ["enterprise", "high", "long", "scale"],
  },
  {
    name: "Oracle ERP Cloud",
    fit: "Enterprises needing robust finance and global standardization",
    strengths: "Finance excellence, analytics, enterprise governance",
    complexity: "High",
    tags: ["enterprise", "high", "normal", "long", "scale"],
  },
];

const tableBody = document.getElementById("erp-table-body");
const results = document.getElementById("results");

function renderTable() {
  const rows = erpCatalog
    .map(
      (erp) => `
      <tr>
        <td><strong>${erp.name}</strong></td>
        <td>${erp.fit}</td>
        <td>${erp.strengths}</td>
        <td>${erp.complexity}</td>
      </tr>
    `
    )
    .join("");

  tableBody.innerHTML = rows;
}

function recommendERP(formValues) {
  const scores = erpCatalog.map((erp) => {
    let score = 0;

    [formValues.size, formValues.budget, formValues.timeline, formValues.priority].forEach(
      (factor) => {
        if (erp.tags.includes(factor)) score += 1;
      }
    );

    return { ...erp, score };
  });

  return scores.sort((a, b) => b.score - a.score).slice(0, 3);
}

document.getElementById("assessment-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  const answers = {
    size: formData.get("size"),
    budget: formData.get("budget"),
    timeline: formData.get("timeline"),
    priority: formData.get("priority"),
  };

  const recommendations = recommendERP(answers);

  results.innerHTML = `
    <article class="card">
      <h4>Your ERP shortlist</h4>
      <p>Based on your priorities, start your evaluation with:</p>
      <ol class="recommendation-list">
        ${recommendations
          .map(
            (erp) =>
              `<li><strong>${erp.name}</strong> <span class="muted">(${erp.fit})</span></li>`
          )
          .join("")}
      </ol>
      <p class="muted">Next step: request a partner match for implementation proposals.</p>
    </article>
  `;
});

document.getElementById("lead-form").addEventListener("submit", (event) => {
  event.preventDefault();

  results.insertAdjacentHTML(
    "beforeend",
    `
    <article class="card">
      <h4>Partner match request captured</h4>
      <p>Thanks! We’ll route your request to verified implementation partners aligned to your ERP shortlist.</p>
    </article>
  `
  );

  event.target.reset();
});

renderTable();
