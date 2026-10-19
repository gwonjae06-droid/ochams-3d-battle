# Audit v5.25

Corrections cover the nine audit findings without adding a supporter.
- All visible legacy menu routes use api.navigate and main mode handlers.
- Weak-element toughness is independent of phase HP clipping, once per action (Galaxy 65).
- Phase HP overflow is NOT carried. UI shows the midpoint and current phase HP ceiling.
- Initial tuning: enemy direct damage x0.85; one initial shield ceil(15% max HP); one phase-2 heal round(20% max HP). Living allies only; no passive healing loop. Preview/practice excluded.
- Study refreshes age and does not decay on the acquisition turn.
- Ultimates remain queued; death cancellations and break action opportunities are reported.
- Practice separates AV/action/SP metrics from real-time DPS. Presets only model weaknesses and selected damage modifiers, not attacks or unique boss mechanics.

Run npm run test:integration for actual inherited rules (no replacement Previous fixture).
Run npm install, npx playwright install chromium, npm run test:browser for actual DOM/navigation tests. Local Three.js fulfills its CDN imports during browser tests.
The full repository integration suite and browser suite have NOT been executed in the assistant sandbox. Only syntax and controlled patch preflights were run there. CI runs the suites after push. Survival values still need play testing; no boss win-rate claim is made. Hard refresh after deployment.
