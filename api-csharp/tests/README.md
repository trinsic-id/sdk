# C# SDK compatibility tests

`run-compatibility.sh` builds current and `origin/main` packages from the selected environment's Swagger document, then compares them with the NuGet versions in `compatibility.json`. It uses the existing `TRINSIC_TEST_*` variables and writes the shared result envelope to `SDK_COMPATIBILITY_RESULTS_PATH`.
