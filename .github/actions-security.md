# GitHub Actions security

PR builds run on GitHub-hosted runners with a read-only `GITHUB_TOKEN`. Do not
pass publishing secrets to validation workflows or persist checkout credentials.
Treat PR code, build scripts, dependencies, titles, comments, branch names,
artifacts, and caches as untrusted until reviewed.

Releases must be dispatched from `main` in `trinsic-id/sdk`. Both the entry-point
workflow and the reusable build workflow enforce this condition. Each release
passes only the secrets that its publishing step needs. Documentation sync runs
only on `main`. Preserve these checks when adding a language or release path.

Do not run PR code in `pull_request_target`, issue/comment workflows, or privileged
`workflow_run` jobs. Do not consume PR-produced executables or caches in a
privileged job. Pass event data through environment variables instead of
interpolating it into shell commands or JavaScript. Never print authenticated
URLs or place credentials in uploaded artifacts or cached directories.

Pin actions to full commit SHAs. Dependabot proposes updates to the pins. The
Actions Security workflow checks regular zizmor findings at medium severity and
above; it is a regression check, not a proof that a workflow is safe. To inspect
additional hardening recommendations locally, run `zizmor --persona auditor .github/workflows`.

## Repository settings and remaining secret isolation

Repository settings should default workflow tokens to read-only, disallow
Actions from approving PRs, require approval of workflows from all outside
contributors, and enable secret scanning and push protection. The `main` ruleset
should dismiss stale reviews, require approval of the latest push and code-owner
review, and require the Actions Security check after its first successful run.
These settings are not controlled by this file.

Workflow conditions and removing `secrets: inherit` do **not** isolate repository
secrets from a contributor with repository write access: that contributor can
add a new workflow which requests them. To enforce that boundary, an administrator
must move publishing credentials into environments restricted to the `main`
branch (not a wildcard or a tag named `main`), have publishing jobs explicitly use
those environments, and remove the repository-level copies. Require a reviewer
for particularly sensitive credentials. CI jobs must not select these environments.
GitHub does not return existing secret values through its API; use the credential
issuer or secret manager to populate the environments. Coordinate the workflow
change and secret migration to avoid breaking releases.

Also review organization runner-group access: public PRs must not be able to
request persistent self-hosted runners. Repository-level token defaults do not
cap explicit workflow permissions, and CODEOWNERS does not enforce review unless
the branch rules require it. Administrators and configured ruleset bypass actors
remain trusted.

See GitHub's [secure-use reference](https://docs.github.com/en/actions/reference/security/secure-use)
and [pwn-request guidance](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/).
