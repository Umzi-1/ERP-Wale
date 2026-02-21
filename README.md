# ERP Matchmaker — Phase 1 MVP

A neutral ERP marketplace prototype that helps buyers learn ERP basics, run readiness diagnostics, compare major OEMs, estimate TCO/ROI, and connect with implementation partners.

## Included in this Phase 1 build

- ERP education and vendor discovery cards.
- OEM coverage for: Oracle, SAP, Microsoft, Infor, Epicor, Workday, Acumatica, Sage, IFS, Odoo.
- Email-gated ERP Readiness Assessment with shortlist recommendation.
- Basic TCO + ROI calculators.
- Feature parity matrix for top modules.
- Partner directory with quick contact actions.
- Downloadable RFP draft generator.
- Basic partner onboarding form and lead delivery console (local storage demo).

## Conflict resolution status

This branch now contains a clean, conflict-free version of:

- `README.md`
- `app.js`
- `index.html`
- `styles.css`

## Preview / Run

```bash
npm start
```

Then open:

- `http://localhost:3000`

Use a custom port (for hosted previews):

```bash
PORT=4173 npm start
```

## If GitHub shows merge conflicts on this PR

Use command-line conflict resolution and keep this branch's resolved Phase-1 files:

```bash
git fetch origin
git checkout <your-pr-branch>
git merge origin/main
bash scripts/resolve_pr_conflicts.sh
node --check app.js && node --check server.js
git commit -m "Resolve merge conflicts in app.js/index.html/styles.css/README.md"
git push
```

If conflicts still remain, open the files listed by `git status`, remove conflict markers manually (`<<<<<<<`, `=======`, `>>>>>>>`), then add/commit/push.

