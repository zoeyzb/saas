# RevenueOS

A revenue intelligence dashboard with a 3D revenue skyline, CRM, pipeline, marketing, retention, subscriptions, transactions, profitability, reports, automations, integrations, team and settings. Everything runs in the browser with no build step.

## Run it

```
npm start          # serves the folder at http://localhost:3000
```

Or open `index.html` directly. It needs internet for the CDN scripts and fonts (React 18, Three.js r128, GSAP 3.12, jsPDF, Tailwind).

## Test it

```
npm test           # 57 end-to-end checks, no dependencies
npm run check      # syntax check
```

The test runs the real app code against a small React stand-in. It opens all 16 pages, clicks the real handlers (deal moves, drag and drop, cancel and reactivate, invoices, refunds, forms, exports, integration sync and connect) and verifies that MRR, cash and the MRR bridge reconcile afterwards.

## Structure

```
index.html          page shell and CDN scripts
src/app.js          data model, calculations, 3D scenes, charts and all pages
src/styles.css      design system: materials, lighting, motion
tests/smoke.test.js end-to-end behaviour test
```

## Data and limits

- Customers, deals, transactions, campaigns and integration feeds are sample records. State is saved in localStorage (`revenueos-v2`). Settings, Workspace, Reset restores the originals.
- Nothing connects to a real service. Integrations use sample feeds, and the API key is never shown on screen (Copy and Rotate only).
- There is no server, sign-in or database. Those would be the next step for a production build.

## Push to GitHub

```
git init
git add .
git commit -m "Add RevenueOS dashboard"
git branch -M main
git remote add origin https://github.com/zoeyzb/saas.git
git push -u origin main
```

## Navigation & visual UX

The desktop sidebar offers six primary destinations: **Command Center, Revenue,
Customers, Intelligence, Operations, Settings**. Related legacy screens are
reached using in-page contextual tabs. All existing hash-route URLs remain
supported, including `#/sub`, `#/pf`, `#/pl`, and `#/tx`.

The Command Center focuses on the interactive 3D revenue visualization, four
decision-useful KPIs, a recurring-revenue bridge and priority signals. The
Intelligence page groups locally computed attention signals, cash collection,
expansion opportunities and pipeline estimates. Simulated bulk follow-ups and
subscription upgrades ask for confirmation.

Settings exposes Workspace, Team & access, Appearance and Audit log. Currency
remains USD because the sample financial data is denominated in USD; no
unsupported currency conversion is offered. Workspace reset requires consent.
All interactions remain browser-local; external integration actions are
simulated rather than connected to third-party services.

See `docs/UX_REDESIGN_SPEC.md` for design decisions and acceptance criteria.

## Prediction Studio (illustrative)
Open **Revenue → Predictions** or **Command Center → Open Predictions**.
It uses your local recurring-revenue record history and the three editable
monthly assumptions (new bookings, expansion and churn). The 6-, 12- and
24-month Bear/Base/Bull projections are deterministic compounding scenarios,
not fitted forecasts or statistical confidence intervals.

- Change a slider to update your saved Base case and all three scenario paths.
- Toggle scenario and horizon to inspect the projected MRR, ARR, change and range.
- Review downside/upside sensitivity; export actuals, scenario projections
  and the exact scenario rates as a real CSV.
- The comparison never changes customer subscriptions or transactions.
  The simulation does not connect to Stripe or a forecasting API.

Financial Intelligence adds category filters and a link to Predictions. The
Command Center retains its 3D chart with slimmer matte financial bars.

## Visual consistency and drill-down refinement

The original finance and operations pages now share the same editorial
section-heading, metric-strip and card styles as the Predictions experience.
Cards no longer stretch simply to match the tallest neighbor, and profit/
retention charts use consistent green-for-gains, red-for-losses, champagne-
for-revenue semantics. These changes do not alter calculations or sample data.

**Intelligence → Inspect evidence** expands a signal into linked live workspace
records: at-risk customers (health and MRR), eligible account upgrades,
outstanding invoices, weighted deals, and expense components. Clicking an
account opens the existing drawer; invoice and cost rows navigate to the
corresponding filtered transactions. Filtering and simulation actions remain
unchanged.

**Command Center 3D chart** now includes a legible plan-to-color legend,
while maintaining revenue/expense, profit, and forecast modes. Phone-sized
screens display a compact legend without horizontal overflow. Page navigation
no longer hides content during a staggered entrance animation. This remains
a browser-local demo rather than a real-time financial system.
