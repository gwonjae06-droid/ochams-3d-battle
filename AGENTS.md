# Maintenance rules

Respond to the user in Korean. Inspect the current main HEAD before editing.

## Scope and preservation
- Prefer small changes; do not rewrite the runtime string-patching loader as incidental cleanup.
- Preserve story, boss and practice modes. Do not change combat balance without an explicit request.
- Preserve localStorage keys ochams-story-v2, ochams-campaign-v4 and ochams-delivery-mvp-v1. Never clear unrelated storage.
- Story saves version 1 address events by pos: do not insert, remove or reorder events without a tested migration. Preserve event IDs and option IDs as well.
- Keep episode 1 solo, Park joining in episode 2, and Choi joining in episode 4.
- DeliveryBattleAdapter is a mock until explicitly integrated and tested. Do not report it as real combat.
- Portrait filenames do not establish character identity. Use labeled placeholders until mappings are verified.

## Change procedure
1. Read the actual affected files and callers; do not rely only on handover notes.
2. Add a regression test for each reproducible bug. Separate behavior changes from cleanup.
3. Run npm test and npm run test:browser when Node, dependencies and Chromium are available. npm test includes the integration tests.
4. For UI changes check desktop and mobile, keyboard navigation, double input, reload, save import and corrupt saves.
5. For combat changes check boss mode, practice mode, SP, action order, break recovery and campaign storage isolation.
6. Distinguish tests actually run, tests only inspected, and checks unavailable in the environment. CI configuration is not evidence of CI success.
7. Before any GitHub write, obtain confirmation for the exact target and complete contents. After writing, verify the resulting commit and changed files.

## Release checklist
- No uncaught browser errors on the tested routes.
- Both settlement endings remain reachable, retry does not charge twice, and stale UI input does not advance state.
- Existing saves still restore or have an explicit tested migration.
- No forced reading delay used to claim a 15-minute story. Report path-specific text counts and reading-time assumptions.
- Do not claim mobile, WebGL, audio listening, deployment or full-playthrough success without performing those checks.
