const dotenv = require("dotenv").config();
const graphql = require("graphql-client");
const fs = require("fs");

const TOTAL_COUNT_QUERY = `
query($organization: String!, $repository: String!) {
  repository(owner: $organization, name: $repository) {
    issues {
      totalCount
    }
  }
}
`;

const ISSUE_INFO_QUERY = `
query ($organization: String!, $repository: String!, $endCursor: String) {
  repository(owner: $organization, name: $repository) {
    issues(first: 100, after: $endCursor) {
      edges {
        node {
          title
          body
          closed
          labels(first: 100) {
            edges {
              node {
                name
              }
            }
          }
          milestone {
            title
          }
        }
      }
      pageInfo {
        endCursor
      }
    }
  }
}
`;

let client = graphql({
  url: "https://api.github.com/graphql",
  headers: {
    Authorization: "Bearer " + process.env.GITHUB_ACCESS_TOKEN
  }
});

const variables = {
  organization: process.env.GITHUB_ORGANIZATION_NAME,
  repository: process.env.GITHUB_REPOSITORY_NAME
};

/**
 * Send GraphQL query to Github's API to see how many issues the repository has to calculate the amount of
 * requests we need to make. There is an artifical limit of 100 issues per request, hence we have to do this.
 *
 * Write results from #parseIssueInfo() function to the sessions.json file.
 **/
client.query(TOTAL_COUNT_QUERY, variables, (req, res) => {
  if (res.status === 401) throw new Error("Unable to fulfill request, not authorized. Check your Github token credentials.");
}).then(async (body) => {
  let totalCount = body["data"]["repository"]["issues"]["totalCount"];
  console.log(`Populating sessions array with ${totalCount} sessions.`)
  let sessions = await parseIssueInfo(totalCount);
  fs.writeFile("sessions.json", JSON.stringify(sessions, null, 2), (err) => {
    if (err) throw err;
    console.log(`Finished writing ${sessions.length} sessions to sessions.json file.`);
  });
}).catch((err) => {
  throw new Error(err.message);
});

/**
 * Process GraphQL response and use regex to select the information in the issue that we want, then properly
 * format (remove whitespace, newlines, etc) all of the information and insert the result into the sessions array.
 **/
async function parseIssueInfo(totalIssues) {
  let numOfRequests = totalIssues < 100 ? 1 : Math.ceil(totalIssues / 100);
  let sessions = [];
  for (let i = 0; i < numOfRequests; i++) {
    try {
      let response = await client.query(ISSUE_INFO_QUERY, variables);
      variables["endCursor"] = response["data"]["repository"]["issues"]["pageInfo"]["endCursor"];
      response["data"]["repository"]["issues"]["edges"].forEach((issue) => {
        let moreDetails = issue["node"]["body"].split(/###|\]\*\*|\*\*\[/);
        let session = {
          title: issue["node"]["title"].trim(),
          owner: {},
          milestone: issue["node"]["milestone"] !== null ? issue["node"]["milestone"]["title"] : undefined,
          labels: issue["node"]["labels"]["edges"].length < 0 ? undefined : issue["node"]["labels"]["edges"].map(label => label["node"]["name"]),
          closed: issue["node"]["closed"]
        };
        moreDetails.forEach((element, index) => {
          const detailField = element.trim();
          if (detailField === "UUID") {
            return session.uuid = moreDetails[index + 1].trim();
          } else if (detailField === "Submitter's Name") {
            return session.owner.name = moreDetails[index + 1].trim();
          } else if (detailField === "Submitter's Affiliated Organisation") {
            return session.owner.organization = moreDetails[index + 1].trim();
          } else if (detailField === "Submitter's Github") {
            return session.owner.github = moreDetails[index + 1].trim();
          } else if (detailField === "Additional facilitators") {
            return session.additional_facilitators = moreDetails[index + 1]
              .split(",")
              .map(element => element.trim())
              .filter(element => element !== "");
          } else if (detailField.includes("What will happen in your session?")) {
            return session.description = detailField
              .replace("What will happen in your session?", "")
              .replace(/[\r\n]/g, "")
              .trim();
          } else if (detailField.includes("What is the goal or outcome of your session?")) {
            return session.goal = detailField
              .replace("What is the goal or outcome of your session?", "")
              .replace(/[\r\n]/g, "")
              .trim();
          } else if (detailField
            .includes("If your session requires additional materials or electronic equipment, please outline your needs.")) {
            return session.required = detailField
              .replace("If your session requires additional materials or electronic equipment, please outline your needs.", "")
              .replace(/[\r\n]/g, "")
              .trim();
          } else if (detailField.includes("Time needed")) {
            return session.time = detailField.replace("Time needed", "").trim();
          }
        });
        sessions.push(session);
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }
  return sessions;
}
