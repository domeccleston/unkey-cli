# unkey-cli

Template for building a command line interface with [Unkey](https://unkey.dev/).

This template does two things:

1. Allow users to log in and store auth credentials locally
2. Allow users to access protected resources with the local credentials

This CLI is for example purposes – it's intended that you should customize it for your own product (`acme login` -> store key in `.acme`).

# Login

`unkey-cli login` does the following:

1. Opens a new browser window for your user to log in with your service
2. If this is sucessful, queries Unkey for a new API key
3. Stores the key locally in `.unkey`


# Access

`unkey-cli access` checks the local auth credentials with Unkey: if the auth credentials fail, it will show an error message. If successful, the user can access your API.

# Example use case

[Vercel](https://vercel.com) has a CLI for deploying web applications (as well as a their more frequently used web app)

If you want to deploy your frontend with their CLI, you:

1. Run `vercel login` to log in to the web app and set a local credential in `.vercel`
2. Run `vercel deploy` which takes local files and uploads them to the Vercel CI/CD to be deployed.

This is a simplified example the kind of tool that you could build with this template.
