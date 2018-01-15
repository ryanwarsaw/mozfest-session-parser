## :page_with_curl: Mozilla Festival: Session Parser

If you don't know what Mozilla Festival is, you can learn more ![here](https://mozillafestival.org/about).

Every year the Mozilla Festival team uses Github as it's tool of choice to catalog,
coordinate and decide which sessions are going to be present at the next event. For example
here is the 2017 version: ![mozfest-program-2017](https://github.com/MozillaFoundation/mozfest-program-2017).

This tool uses the official Github API (v4 GraphQL) to parse the tickets in past or present program repositories. It then takes that parsed information, and neatly formats into CSV format, for further manipulation by other tools.

## Installation / Setup

The following contains instructions for getting this repository to run:

  - Clone (Recommended) or download this repository using the respective commands/tools for your machine.
  - Verify that you're using a recent version of Node, `Node 4+` is highly recommended.
  - Install the dependencies via NPM by typing `npm install` while in the root project directory.
  - Create a `.env` file and enter the key-value pair: `GITHUB_ACCESS_TOKEN=your_token_here`
    - See: https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/ for instructions on how to generate your own access token, and *remember* do not share/post your token anywhere, even Github.
  - Run the parsing script by typing: `npm start`.
