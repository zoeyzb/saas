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
