# Hotfix procedure 

The first step is to branch off of main and propose a patch version.

1. `git checkout main`
2. `git pull origin main`
3. `git checkout -b your-branch-name`
4. Bump the patch version in `package.json`

Next you need to fix the bug. Unfortunately this guide can't tell you how to fix the bug. After that though:

5. Create a pull request to merge your changes into the `main` branch.
6. Two code reviews are required for hotfixes. Reviewers, be careful, you will probably be the final set of eyes before this goes to production.
7. Merge the pull request 
8. Create a new tag for your release and deploy to production. 

Finally, you need to get your change into the develop branch as well.

9. `git pull origin develop`
10. Fix any merge conflicts and verify the bugfix works on develop as well.
11. Create a pull request into `develop`. 
12. Only one code review is required for this PR. The reviewer's primary job is to make sure there is no extra or missing code.
13. Merge the pull request

And that's it! Admittedly it's a long road, but being careful about hotfixes is well worth it.