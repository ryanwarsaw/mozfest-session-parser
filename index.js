var dotenv = require("dotenv");
var graphql = require("graphql-client");

var client = graphql({
  url: "https://api.github.com/graphql",
  headers: {
    Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN
  }
});
