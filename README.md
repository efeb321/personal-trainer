# Together Strong v0.4.5

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


## v0.4.5 demo flow
- The exercise card shows the exercise-library animation thumbnail first.
- Tapping the exercise opens the library Quick Animation first.
- If a curated YouTube demo exists, a second button labeled More Detailed Video is available.
- YouTube is secondary and only opens when requested.
