# Release procedure

First, resolve any potential merge conflicts with main on the develop branch

1. `git checkout develop`
2. `git pull origin develop`
3. `git checkout main`
4. `git merge develop` (there should be no merge conflicts)

Then, issue a pull request for merging the develop branch into the main branch. Await approval and then merge.

After completion of the previous steps, draft a new release of the main branch on GitHub:

1. Navigate to [https://github.com/WildMeOrg/codex-frontend/releases/new](https://github.com/WildMeOrg/codex-frontend/releases/new).
2. Designate the target as the main branch.
3. Create a new tag following the SemVer pattern outlined [here](https://semver.org/) (vX.X.X). Note that this exact pattern (no period between v and the first name, for instance) must be followed explicitly.
4. Publish the release.
