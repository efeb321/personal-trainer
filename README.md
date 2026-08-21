# Together Strong v0.4.4 — Audited Beta

This build was audited before packaging.

Changes:
- Removed duplicate YouTube iframe IDs that could break demo behavior.
- Day 1 uses manually verified exact YouTube demonstrations for all six exercises.
- Exercise 2 is kettlebell glute bridge, not barbell.
- Exercise 3 is bench-supported single-arm kettlebell row.
- Exercise 6 is one-arm kettlebell suitcase carry.
- Added safe storage fallback so localStorage failure cannot freeze the app.
- Exercise library loads from jsDelivr with GitHub Raw fallback.
- Service-worker caching is disabled during beta to prevent stale builds.
