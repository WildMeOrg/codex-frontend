# codex-frontend

The frontend for Codex, written in React with Material UI components.

## Contributions

Found a bug? Submit a report [here](https://github.com/WildMeOrg/codex-frontend/issues/new).

Developer contributions are very much appreciated. Refer to the [contribution guide](https://github.com/WildMeOrg/codex-frontend/blob/develop/docs/contribution-guide.md) or reach out to us on the [Wild Me discord](https://discord.gg/zw4tr3RE4R).

## Setup and Installation
To install a working codex-frontend dev environment, you'll need install the backend by following the instructions in the [Houston](https://github.com/WildMeOrg/houston). 

Instructions assume that you are signed into your GitHub account, have admin access to your OS's terminal, and have Git, [Docker](https://docs.docker.com/get-docker/), and docker-compose installed. Instructions are written for linux with limited support for other OSs.

1. From your browser in the top right corner of the [codex-frontend repo](https://github.com/WildMeOrg/codex-frontend), click the **Fork** button. Confirm the be redirected to your own fork (check the url for your USERNAME in the namespace).
1. In your terminal, enter the command `git clone https://github.com/USERNAME/codex-frontend`
1. Once you have both houston and codex-frontend repos available, move to your codex-frontend repo with `cd codex-frontend`
1. Add a reference to the original codex-frontend repo to denote it as an upstream repo.
```
git remote add upstream https://github.com/WildMeOrg/codex-frontend
git fetch upstream
```
1. Set up (husky)[https://github.com/typicode/husky] so that the linter runs before you commit. 
  1. Run the command `npm install husky -D`
  1. `npm run prepare`
1. In the `houston` project, edit the `docker-compose.codex.yml` file to redirect to your local copy of the dev-frontend code.
  1. In the file, find `dev-frontend:` and navigate to `volumes:`
  1. Delete the line `- ../../_frontend:/code`
  1. In its place, enter `- LOCATION/codex-frontend:/code` where LOCATION is the relative path to your local copy.
  1. Save your changes.
1. Back in the terminal, `cd` to your local `houston` copy and run the following commands, noting that the docker-compose steps may take a long time to run the first time:
```
./scripts/codex/activate.sh
./scripts/codex/build.frontend.sh
docker-compose pull
docker-compose build
docker-compose up -d
```
1. In your browser, go to `https://localhost:84`. If you see a welcome screen with Codex Initialized, you're ready to get started!
  1. If you see a blank screen or a 502 nginx error, run `docker-compose down` to bring down the instance.
  1. Allocate more memory to Docker.
    * If you're on linux, enter the command `sudo sysctl -w vm.max_map_count=262144`. This will need to be done each time you restart your system. Instead, add `vm.max_map_count = 262144` to your system file `/etc/sysctl.conf`
    * If you're leveraging Docker Desktop, go to Settings > Resources and adjust the Memory limit.
  1. Run `docker-compose up` again.

### App Setup
1. At http://localhost:84, work through the admin initial setup.
1. Navigate to Set Settings > Custom Fields
1. Add Species
1. Add Regions

## Development

### Create Local Branch
1. Verify you are on the main branch. The branch you have checked out will be used as the base for your new branch, so you typically want to start from main.
`git checkout main`
1. Create your feature branch (FEATUREBRANCHNAME). It can be helpful to include the issue number (ISSUENUMBER) you are working to address.
`git branch ISSUENUMBER-FEATUREBRANCHNAME`
1. Change to your feature branch so your changes are grouped together.
`git checkout ISSUENUMBER-FEATUREBRANCHNAME`
1. Update your branch (this is not needed if you just created a new branch, but is a good habit to get into).
`git pull upstream`

### Git Commands
As you make the code changes necessary for the issue you're working on, you may find the following git commands useful.
* `git log`: latest commits of current branch
* `git status`: current staged and unstaged modifications
* `git diff --staged`: the differences between the staging area and the last commit
* `git add <file name>`: add files that have changes to staging in preparation for commit
* `git commit`: commits the staged files, opens a text editor for you to write a commit log

### Docker Commands
The following commands are helpful when developing in this manner:

- `docker-compose up -d`: Run all containers in daemon mode, so you don't see all the logs running together.
- `docker-compose restart <image>`: Restart a particular docker image (remember these are listed in `docker-compose.yml`).
- `docker-compose logs -f <image>`: Show logs for a particular image.
- `docker-compose down`: Stop all images.

## Configuration and build

A build can be initiated with the command `npm run build`. You can specify the URL for Houston in `/config/config.json` or as a command line argument. Here are some examples:

```
npm run build -- --env=houston=https://houston.dyn.wildme.io
npm run build -- --env=houston=http://localhost:9999
npm run build -- --env=houston=relative // use relative file paths for API requests
```

## Submit PR
Up to this point, all changes have been done to your local copy of codex-frontend. You need to push the new commits to a remote branch to start the PR process.
Note: Now is the time to clean up your PR if you choose to squash commits. If you're looking for more information on these practices, see this [pull request tutorial](https://yangsu.github.io/pull-request-tutorial).

1. Push to the remote version of your branch `git push <remote> ISSUENUMBER-FEATUREBRANCHNAME` If you want to push upstream directly, use `git push origin ISSUENUMBER-FEATUREBRANCHNAME`
1. When prompted, provide your username and GitHub Personal Access Token. If you do not have a GitHub Personal Access Token, or do not have one with the correct permissions for your newly forked repository, you will need to [create a Personal Access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
1. Check the fork's page on GitHub to verify that you see a new branch with your added commits. You should see a line saying "This branch is X commits ahead" and a **Pull request** link.
1. Click the **Pull request** link to open a form that says "Able to merge". (If it says there are merge conflicts, go to the [Wild Me Development Discord](https://discord.gg/zw4tr3RE4R) for help).
1. Use an explicit title for the PR and provide details in the comment area. Details can include text, files, or images, and should provide details as to what was done and why design decisions were made.
1. Click ** Create a pull request**.

### Respond to Feedback
At this point, it's on us to get you feedback on your submission. Someone from the Wild ME team will review the project and provide any feedback that may be necessary. If changes are recommended, you'll need to checkout the branch you're working from, update the branch, and make these changes locally.

1. `git checkout ISSUENUMBER-FEATUREBRANCHNAME`
1. `git pull upstream main`
1. Make required changes
1. `git add <filename>` for all files impacted by changes
1. `git commit`

## Thanks

- Thanks to [Lokalise](https://lokalise.com/) for providing translation management services.
- Thanks to [Flatfile](https://flatfile.io/) for providing data import services.
- Thanks to Emily Ke for developing the server status screen, page transitions, and more!
- Thanks to Madeleine Webb for design assistance.
- Thanks to Iris Shin for design assistance.
