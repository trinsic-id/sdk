# Maintaining generator templates

[manifest.json](manifest.json) records the exact generator version, download URL,
JAR SHA-256, embedded template paths, and original template SHA-256 values.
[patches/](patches/) contains our changes, derived from
[OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator) under the
[Apache License 2.0](LICENSE). There are no independently maintained template copies.

`helpers/generate-client.sh` downloads the pinned JAR if needed, verifies its
checksum and embedded version, extracts the registered templates, verifies their
checksums, and applies each patch with `git apply`. It generates using that exact
JAR and a temporary override directory, then removes the temporary files. Any
baseline or patch mismatch stops generation before existing SDK output is deleted.

The patches preserve these changes:

- C# `httpclient`: property initializers, required writable properties, and null
  checks, while retaining defaults and JSON serialization behavior.
- Go: keyed model construction, no positional factories, and updated model docs.
- Java `native`: private field constructors for Jackson, public named setters.

TypeScript uses `useSingleRequestParameter=true` and needs no template patch.

Run `npm run templates:check` to verify the current artifact, template baselines,
and patches. CI runs this check and `npm run test:templates`; every API generation
also performs the baseline checks. The tools need Node 18+, Java, Git, and `unzip`;
the maintenance tests additionally use `zip` to create fixture JARs.

To upgrade, start with the existing pin intact. Substitute the new version and
its exact artifact URL below:

```sh
npm run templates:upgrade -- \
  --version X.Y.Z \
  --url https://github.com/trinsic-id/static-dependencies/releases/download/openapitools-X.Y.Z/openapi-generator-cli-X.Y.Z.jar \
  --output .context/template-upgrade
```

If a merge already updated `openapitools.json`, first restore its version and
download URL to the values in the existing manifest. Acceptance below writes the
new pin together with the reviewed patches.

Optionally pass `--jar /path/to/candidate.jar` to use an already downloaded JAR.
The command stages the candidate without executing it or changing tracked files.
It creates `upstream.diff`, `review.json` (including the candidate checksum),
`upstream-old/`, `upstream-new/`, and `merged/`. The merge uses the old upstream
template, our patched version, and the new upstream template.

Review the upstream diff and every merged template even if the merge is clean:
upstream changes outside our edits may affect their behavior. Resolve conflicts
by editing files in `merged/`. Leave the upstream snapshots intact. Accept the
reviewed result with:

```sh
npm run templates:accept -- --from .context/template-upgrade --reviewed
```

Acceptance verifies the candidate again, rejects unresolved conflicts or a stale
review, regenerates and checks the patches, and updates the root `openapitools.json`
and manifest. It does not commit, publish, or change SDK package versions.

Rebuild the affected SDKs, inspect the generated changes, then run:

```sh
npm run templates:check
npm run test:templates
npm run test:sdk-construction
# Run for each rebuilt SDK: csharp, go, java, python, ruby, typescript.
SDK_LANGUAGE=csharp npm run test:sdk-headers
```

To edit our patches without upgrading, stage the current version and artifact URL,
edit `merged/`, and use the same review/accept workflow. The generated override
files can be inspected with `node helpers/template-overrides.mjs prepare --output
.context/inspect-templates` (the output directory must be empty).
