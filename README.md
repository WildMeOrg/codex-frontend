# codex-frontend

The frontend for Codex, written in React with Material UI components. This project is not in production yet, but it is under active development.

## Contributions 

Found a bug? Submit a report [here](https://github.com/WildMeOrg/codex-frontend/issues/new).

Developer contributions are very much appreciated =). Take a gander at the [contribution guide](https://github.com/WildMeOrg/codex-frontend/blob/master/CONTRIBUTION_GUIDE.md). If you a Java dev looking to help with our project, take a look at the [backend](https://github.com/WildMeOrg/Wildbook). And if you are a Python dev or data scientist take a look at [IBEIS](https://github.com/WildMeOrg/ibeis). 

We are also looking for help from designers and 3D modelers! Please send an email to ben@wildme.org if you are interested.

## Development 

To successfully run the project, you will need to recreate one file that is gitignored for security reasons, `/src/constants/apiKeys.js`. Follow the instructions in the template located at `/src/constants/apiKeysTemplate.js`. After that, just run

```js
npm install 
npm start 
```

The development environment is mostly used on OSX but should work on Windows as well. Use Powershell or edit the `npm start:win32` command to set `NODE_ENV` using the appropriate syntax for your preferred shell.

## Configuration and build

A build can be initiated with the command `npm run build`. You can specify the URL for Houston in `/config/config.json` or as a command line argument. Here are some examples:

```
npm run build -- --env=houston=https://houston.dyn.wildme.io
npm run build -- --env=houston=http://localhost:9999
npm run build -- --env=houston=relative // use relative file paths for API requests
```

## Thanks

Thanks to [Lokalise](https://lokalise.com/) for providing translation management services.

Thanks to [flatfile](https://flatfile.io/) for providing data import services.

Thanks to Emily Ke and Madeleine Webb for their contributions. 

