## :page_with_curl: Mozilla Festival: Session Parser

If you don't know what Mozilla Festival is, you can learn more [here](https://mozillafestival.org/about).

Every year the Mozilla Festival team uses Github as it's tool of choice to catalog,
coordinate and decide which sessions are going to be present at the next event. For example
here is the 2017 version: [mozfest-program-2017](https://github.com/MozillaFoundation/mozfest-program-2017).

This tool uses GitHub's v4 GraphQL API to parse issues from past or present program repositories.

## Installation / Setup

The following contains instructions for getting this repository to run:

  - Clone (Recommended) or download this repository using the respective commands/tools for your machine.
  - Verify that you're using Node `7.6` or higher, this is important since this script uses async/await functionality.
  - Install the dependencies via NPM by typing `npm install` while in the root project directory.
  - Create an `.env` file and populate it with the following key-value pairs:
    - `GITHUB_ACCESS_TOKEN=your_token_here` This is your personal access token to your GitHub account.
      - See [article](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) for details on generating an access token, and remember don't publish your token anywhere, even on GitHub.
    - `GITHUB_REPOSITORY_NAME=repository_name` This changes every year, make sure you update it accordingly.
    - `GITHUB_ORGANIZATION_NAME=MozillaFoundation` This rarely changes, but if it does just update it accordingly.
  - Run the parsing script by typing: `npm start`.

  If the script is successful, it will write a file called `sessions.json` to the root of the project folder.
