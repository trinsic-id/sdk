# GitHub Actions security

The threat model is an external contributor without repository write access.
Repository writers, administrators, and configured ruleset bypass actors are
trusted. Publishing credentials may remain in repository or environment secrets;
isolating them from trusted writers is outside this policy.

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

## Repository settings and trust boundaries

Repository settings should default workflow tokens to read-only, disallow
Actions from approving PRs, require approval of workflows from all outside
contributors, and enable secret scanning and push protection. The `main` ruleset
should dismiss stale reviews, require approval of the latest push and code-owner
review, and require the Actions Security check after its first successful run.
These settings are not controlled by this file.

For public fork PRs, GitHub withholds repository secrets and limits the
`GITHUB_TOKEN` to read access. Approving a fork workflow permits its execution;
it does not grant it publishing secrets. A contributor changing workflow YAML
in their fork cannot bypass that platform boundary. Privileged triggers such as
`pull_request_target` and `workflow_run` have different rules, which is why this
policy prohibits using them to execute PR-controlled code or artifacts.

Keep publishing secrets out of PR validation even when GitHub would withhold
them. Environment migration is optional defense in depth under this threat
model, not a prerequisite for accepting external contributions. Existing
protected environments must retain their branch restrictions.

Also review organization runner-group access: public PRs must not be able to
request persistent self-hosted runners. Repository-level token defaults do not
cap explicit workflow permissions, and CODEOWNERS does not enforce review unless
the branch rules require it. Administrators and configured ruleset bypass actors
remain trusted.

See GitHub's [secure-use reference](https://docs.github.com/en/actions/reference/security/secure-use)
and [pwn-request guidance](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/).
