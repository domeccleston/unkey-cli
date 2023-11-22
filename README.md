# unkey-cli

CLI login example built with [Unkey](https://unkey.dev/)

# Login

`unkey-cli login` does the following:

1. Opens a new browser window for your user to log in with your service
2. If this is sucessful, queries Unkey for a new API key
3. Stores the key locally in `.unkey`

# Example use case

[Vercel](https://vercel.com) has a CLI for deploying web applications (as well as a their more frequently used web app)

If you want to deploy your frontend with their CLI, you:

1. Run `vercel login` to log in to the web app and set a local credential in `.vercel`
2. Run `vercel deploy` which takes local files and uploads them to the Vercel CI/CD to be deployed.

This is a simplified example the kind of tool that you could build with this template.
