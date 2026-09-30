# PSYNOVA — Integrated Build

This package combines the **functional PSYNOVA application** from `psynova.zip` with the **Stitch PSYNOVA UI/UX direction** from `stitch_psynova_distress_monitoring_platform`.

## What was integrated

- Stitch dark atmospheric visual system (emerald/mint palette, glass cards, grid background, typography).
- Stitch-style responsive navigation and portal actions.
- Rebuilt landing page with:
  - “Don’t wait for the crisis. Detect the trajectory.” hero
  - live monitor card driven by the application's existing case data
  - distress gauge and trend visualization
  - six-stage trajectory pipeline
  - human-in-the-loop messaging
- Restyled the existing professional dashboard and its functional tabs.
- Preserved the original PSYNOVA services, AI engine, storage layer, authentication, multilingual support, victim check-in flow, case management, alerts, follow-ups and analytics.
- Restyled the privacy/demo-data notice for the new visual system.

## Run

```bash
npm install
npm run dev
```

Or, if you use Bun:

```bash
bun install
bun run dev
```

## Important

The project remains a prototype and uses the existing synthetic/demo data and existing Firebase configuration blueprint. The AI output is intended for human review and is not a clinical diagnosis.
