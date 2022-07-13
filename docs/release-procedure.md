# Release procedure

## Alert the team

A release PR should not happen while there are remaining work items in QA.

Consult the front-end team if there are still items in QA, or if other previous merges need to be omitted from the release.

The develop branch should be "frozen" during the release procedure; please be sure that everyone on the team is notified of the freeze and when it is completed.

## Merge and create the PR

First, resolve any potential merge conflicts with main on the develop branch

1. `git checkout develop`
2. `git pull origin develop`
3. `git checkout main`
4. `git merge develop` (there should be no merge conflicts)
5. Update the version in package.json.

Then, issue a pull request for merging the develop branch into the main branch. Await approval and then merge.

## Draft a new release

After completion of the previous steps, draft a new release of the main branch on GitHub:

1. Navigate to [https://github.com/WildMeOrg/codex-frontend/releases/new](https://github.com/WildMeOrg/codex-frontend/releases/new).
2. Designate the target as the main branch.
3. Create a new tag following the SemVer pattern outlined [here](https://semver.org/) (vX.X.X). Note that this exact pattern (no period between v and the first name, for instance) must be followed explicitly.
4. Publish the release.
