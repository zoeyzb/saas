# RevenueOS UX redesign — 2026-10-17

## Constraints
- Preserve all existing browser-based simulation records, routes, chart modes, CRM workflows, exports, and responsive support.
- No live billing or service integrations; do not imply that simulated actions contact external services.
- Keep Orbital-inspired exact dark palette tokens: #050505, #161413, #F3EEE3, #8F8B82, #E5484D, #D9B59A, #8FAE8B.
- Reduce sidebar to six navigable destinations; preserve deep links to legacy routes.
- All primary navigation, tabs, buttons, and settings controls must work by mouse and keyboard.

## IA
1. Command Center → cc
2. Revenue → rev, fc, sub, tx, pf, rp
3. Customers → crm, pl, ret, mk
4. Intelligence → ins
5. Operations → auto, int
6. Settings → st, team; Settings internal tabs workspace, team, appearance, audit

## Acceptance criteria
- Large editorial page headings with supporting context; legible KPI numbers in Inter Tight.
- Command Center focuses on 3D overview, four KPIs, movement and prioritized decisions, with no stretched empty panels.
- Intelligence groups risk, upside, collections and pipeline signals with clear impacts and meaningful actions.
- Currency selector removed rather than implying unsupported conversion.
- Destructive reset confirms before clearing saved data.
- Simulated bulk actions require confirmation and describe local side effects.
- Main sidebar has only six visible primary destinations; internal destinations reachable by context tabs, search, and old hashes.
- Desktop/mobile no unintentional horizontal overflow; 3D modes and pipeline still work.
- Tests, browser smoke, and GitHub Pages verified before release.
