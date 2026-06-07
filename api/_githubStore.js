const STORE_PATH = "data/submissions.json";

function repoConfig() {
  return {
    repo: process.env.GITHUB_REPO || "Riptwosec-collab/Summary-Hand",
    branch: process.env.GITHUB_BRANCH || "master",
    token: process.env.GITHUB_TOKEN,
  };
}

function jsonResponse(response, statusCode, body, extraHeaders = {}) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  Object.entries(extraHeaders).forEach(([key, value]) => response.setHeader(key, value));
  response.end(JSON.stringify(body));
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Form-Token, X-Admin-Password",
  };
}

async function githubRequest(path, options = {}) {
  const { token } = repoConfig();
  if (!token) {
    throw new Error("Missing GITHUB_TOKEN");
  }

  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${response.status}: ${text}`);
  }

  return response.json();
}

async function readSubmissions() {
  const { repo, branch } = repoConfig();
  const file = await githubRequest(`/repos/${repo}/contents/${STORE_PATH}?ref=${branch}`);
  const content = Buffer.from(file.content, "base64").toString("utf8");
  return {
    sha: file.sha,
    submissions: JSON.parse(content || "[]"),
  };
}

async function writeSubmissions(submissions, sha, message = "Record hand hygiene assessment submission") {
  const { repo, branch } = repoConfig();
  const content = Buffer.from(JSON.stringify(submissions, null, 2)).toString("base64");
  return githubRequest(`/repos/${repo}/contents/${STORE_PATH}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content,
      sha,
      branch,
    }),
  });
}

async function appendSubmission(submission) {
  const { submissions, sha } = await readSubmissions();
  submissions.push(submission);
  await writeSubmissions(submissions, sha);
  return submissions.length;
}

module.exports = {
  appendSubmission,
  corsHeaders,
  jsonResponse,
  readSubmissions,
  writeSubmissions,
};
