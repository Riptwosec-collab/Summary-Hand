const { corsHeaders, jsonResponse, readSubmissions, writeSubmissions } = require("./_githubStore");
const { randomUUID } = require("crypto");

const MAX_ROUNDS_PER_MONTH = 4;

async function readJsonBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return JSON.parse(request.body.replace(/^\uFEFF/, ""));

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8").replace(/^\uFEFF/, "");
  return rawBody ? JSON.parse(rawBody) : {};
}

function normalizeMoment(moment) {
  return {
    moment: Number(moment.moment),
    handwash: String(moment.handwash || ""),
    steps: String(moment.steps || ""),
    compliant: moment.handwash !== "ไม่ล้างมือ",
    completeSteps: moment.steps === "ครบ 7 ขั้นตอน",
  };
}

function normalizeSubmission(body) {
  const name = String(body.name || "").trim();
  const moments = Array.isArray(body.moments) ? body.moments.map(normalizeMoment) : [];
  const receivedAt = new Date();
  const month = receivedAt.getMonth() + 1;
  const year = receivedAt.getFullYear();

  if (!name) {
    throw new Error("Missing name");
  }

  if (moments.length !== 5 || moments.some((item) => item.moment < 1 || item.moment > 5)) {
    throw new Error("Invalid moments");
  }

  return {
    id: String(body.id || randomUUID()),
    submittedAt: body.submittedAt || receivedAt.toISOString(),
    receivedAt: receivedAt.toISOString(),
    source: body.source || "hand-washing-form",
    name,
    month,
    year,
    moments,
  };
}

function normalizeName(value) {
  return String(value || "")
    .replace(/[\s\u200B-\u200D\uFEFF]+/g, "")
    .trim();
}

function nextRoundFor(submissions, name, month, year) {
  const targetName = normalizeName(name);
  const usedRounds = new Set();

  submissions.forEach((item) => {
    if (
      normalizeName(item.name) === targetName &&
      Number(item.month) === month &&
      Number(item.year) === year &&
      Number(item.round) >= 1
    ) {
      usedRounds.add(Number(item.round));
    }
  });

  for (let round = 1; round <= MAX_ROUNDS_PER_MONTH; round += 1) {
    if (!usedRounds.has(round)) return round;
  }

  return MAX_ROUNDS_PER_MONTH + 1;
}

async function handler(request, response) {
  const headers = corsHeaders();

  if (request.method === "OPTIONS") {
    return jsonResponse(response, 204, {}, headers);
  }

  if (request.method !== "POST") {
    return jsonResponse(response, 405, { ok: false, error: "Method not allowed" }, headers);
  }

  if (process.env.FORM_TOKEN && request.headers["x-form-token"] !== process.env.FORM_TOKEN) {
    return jsonResponse(response, 401, { ok: false, error: "Unauthorized form token" }, headers);
  }

  try {
    const body = await readJsonBody(request);
    const submission = normalizeSubmission(body);
    const { submissions, sha } = await readSubmissions();

    if (submissions.some((item) => String(item.id || "") === submission.id)) {
      return jsonResponse(response, 200, {
        ok: true,
        duplicate: true,
        id: submission.id,
        message: "Submission already recorded",
      }, headers);
    }

    const nextRound = nextRoundFor(submissions, submission.name, submission.month, submission.year);
    if (nextRound > MAX_ROUNDS_PER_MONTH) {
      return jsonResponse(response, 409, {
        ok: false,
        error: `เดือนนี้ประเมินครบ ${MAX_ROUNDS_PER_MONTH} ครั้งแล้ว`,
        status: "complete",
      }, headers);
    }

    submission.round = nextRound;
    submissions.push(submission);
    await writeSubmissions(submissions, sha);

    return jsonResponse(response, 200, {
      ok: true,
      id: submission.id,
      count: submissions.length,
      round: nextRound,
      month: submission.month,
      year: submission.year,
      remainingRounds: MAX_ROUNDS_PER_MONTH - nextRound,
      complete: nextRound >= MAX_ROUNDS_PER_MONTH,
    }, headers);
  } catch (error) {
    return jsonResponse(response, 400, { ok: false, error: error.message }, headers);
  }
}

module.exports = handler;
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
