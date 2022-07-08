# Release procedure

First, resolve any potential merge conflicts with main on the develop branch

1. `git checkout develop`
2. `git pull origin develop`
3. `git checkout main`
4. `git merge develop` (there should be no merge conflicts)

Then, draft a new release of the main branch on GitHub:

1. Navigate to [https://github.com/WildMeOrg/codex-frontend/releases/new](https://github.com/WildMeOrg/codex-frontend/releases/new).
2. Designate the target as the main branch.
3. Create a new tag following the SemVer pattern outlined [here](https://semver.org/) (vX.X.X).
4. Publish the release.
