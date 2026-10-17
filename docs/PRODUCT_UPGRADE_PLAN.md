# RevenueOS — Premium Experience Overhaul (October 17, 2026)

## Mission and reality check
Target: excellent, legible, visually distinctive SaaS demo with coherent financial workflows. "1000/1000" is an aspiration, not a measurable quality guarantee. Scope retains the current React/Three.js static client app, no fake real integrations, and no misleading claims of forecast accuracy.

## Existing contracts (do not break)
- 16+ deep-linked screens under six primary sidebar destinations
- CRM, pipeline, local invoices/refunds/subscriptions, marketing, reports, automation, integration demos, CSV and PDF exports, themes and local storage
- Sample data is simulated. Do not claim production sync, billing, AI analysis, or predictive training.
- No new dependencies or API keys; no web-server migration

## Phased priority work
### P0 — Confidence and navigation
- Visible Predictions shortcut from Command Center and contextual finance tabs; legacy #/fc hash still loads
- Guardrail: automated route and scenario regression tests, desktop/mobile Chrome verification

### P1 — Prediction Studio
- Clear headline and 6/12/24 month deterministic scenario comparison
- Bear/Base/Bull computed from editable baseline rates, with a chart that labels historical vs projected dates
- Three projected paths, exact endpoints, ARR, delta vs now, scenario spread; no invented confidence intervals
- Reusable pure projection functions independently unit tested
- Assumptions show new bookings, churn, expansion, and computed net growth; current local workspace is the data source
- Scenario difference and sensitivity explanations; no unsupported certainty about future outcomes

### P2 — Financial intelligence
- Insights can be filtered by concern type and sorted by actionable impact
- Simulation actions require confirmation and do not imply external transactions
- Preserve existing financial invariants and source-of-truth calculations

### P3 — Visual quality and performance
- Orbital-consistent neutrals (#050505, #161413, #F3EEE3, #8F8B82)
- Champagne revenue #D9B59A, positive green #8FAE8B, critical red #E5484D
- Slender 3D columns, clear legend, restrained lighting, no unnecessary animations
- Fit charts and labels at desktop, tablet and mobile, focus states and reduced motion
- Avoid giant empty panels and fake/decorative widgets

## Verification gates
1. JS syntax
2. Existing application behavior, data integrity and all deep links
3. Forecast pure-math unit tests including scenarios, zero base, negative net, 6/12/24 months
4. Real Chrome tests: scenario selection, inputs, labels, navigation, all modes, confirmation, light/dark, mobile widths
5. No JS runtime errors, overflow or overlap
6. Commit on main and verify GitHub Pages matches local source

## Repositories / workflow influences
- github/spec-kit: requirements, acceptance criteria, scoped implementation tasks (adapted; no code copied)
- addyosmani/agent-skills: inspect-first incremental UI engineering and testing (adapted)
- Egonex-AI/Understand-Anything: existing single-file architecture and state/action impact mapping (adapted)
- No code or dependencies copied from outside projects

## Honest aspirational 1,000-point scorecard
The following is a product-evaluation rubric, not an objective score already achieved.
| Area | Points | Evidence required for full marks |
|---|---:|---|
| Hierarchy and navigation | 150 | Clear labels, consistent tabs, no lost capabilities, working deep links |
| Visual system | 180 | Accessible typography, polished surfaces, intentional semantic palette |
| Predictions and intelligence | 220 | Correct deterministic scenario math, comparisons, sensitivity, editable/persistent rates, CSV and provenance |
| End-to-end demo functionality | 180 | Functional controls, saved local state, exports and confirmations |
| Responsive and accessible UX | 120 | Usable keyboard controls, mobile no overlap, readable charts, reduced-motion support |
| Performance | 80 | No background WebGL on unrelated routes, renderer cleanup, predictable repaint costs |
| Reliability and verification | 70 | Automated regression tests, Chrome E2E on main journeys, verified live artifact |
| **Total** | **1,000** | **Design aspiration, not guaranteed or externally certified** |

## Release verification additions
- Real Chrome CSV download (12 future projection rows, model metadata)
- Forecasting 6/12/24 horizon and Bear/Base/Bull switching
- Base assumption updates change the actual computed figure
- Intelligence filter category/count and empty state
- 3D canvas with unchanged interactions and thinner matte columns

## Follow-up visual and intelligence refinement (completed)
- Shared metric strips and card headings on legacy financial/operations screens
- Disclosed all four revenue plan colors in the 3D chart legend
- Replaced decorative floating button magnetism with stable controls
- Removed 600ms route-wide content fading and prevented misleading blank states
- Added inspectable, record-backed signal evidence with customer drawer and
  transaction drill-downs, without additional claims of external data
- Made expanded signals size to their own contents, rather than stretching
  adjacent empty cards
- Unchanged static-demo contracts, operations, forecasting and deep links
- Verification: 96 automated checks; real desktop/mobile browser interaction,
  card/legend counts, evidence-to-customer flow and no horizontal overflow
