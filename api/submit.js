const { appendSubmission, corsHeaders, jsonResponse } = require("./_githubStore");
const { randomUUID } = require("crypto");

async function readJsonBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return JSON.parse(request.body);

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
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
  const round = Number(body.round);
  const moments = Array.isArray(body.moments) ? body.moments.map(normalizeMoment) : [];

  if (!name) {
    throw new Error("Missing name");
  }

  if (!Number.isInteger(round) || round < 1 || round > 4) {
    throw new Error("Invalid round");
  }

  if (moments.length !== 5 || moments.some((item) => item.moment < 1 || item.moment > 5)) {
    throw new Error("Invalid moments");
  }

  return {
    id: randomUUID(),
    submittedAt: body.submittedAt || new Date().toISOString(),
    receivedAt: new Date().toISOString(),
    source: body.source || "hand-washing-form",
    name,
    round,
    month: Number(body.month) || new Date().getMonth() + 1,
    year: Number(body.year) || new Date().getFullYear(),
    moments,
  };
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
    const count = await appendSubmission(submission);
    return jsonResponse(response, 200, { ok: true, id: submission.id, count }, headers);
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
