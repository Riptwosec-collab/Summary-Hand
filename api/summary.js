const { corsHeaders, jsonResponse, readSubmissions } = require("./_githubStore");

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

const staffNames = [
  "คุณอนัตยา",
  "คุณพัชรพร",
  "คุณพิพินา",
  "คุณอลิน",
  "คุณสัสรชัย",
  "คุณนารียา",
  "คุณนุ้ย",
  "คุณวาวรรณ",
  "คุณรังสินา",
  "คุณขนิษฐา",
  "คุณอัสรีราช",
  "คุณวาดียา",
  "คุณรุ่งอรัย",
  "คุณวารีการ",
  "คุณสุกรยา",
  "คุณณัฐณิชา",
  "คุณน้ำฝน",
  "คุณวนิดา",
  "คุณฟาริดา",
  "คุณธัญชนก",
  "คุณอัญชลี",
  "คุณธนัชสิรี",
  "คุณศิริวรรณ",
  "คุณธากา",
  "คุณศรีธนญา",
  "คุณสายฯ",
  "คุณเปี่ยลด",
  "คุณวรากานต์",
  "คุณอัครชัย",
  "คุณพาณิชยา",
  "คุณสุพัตรา",
  "คุณเดือนเพ็ญ",
  "คุณชุติมา",
  "คุณลักษิกา",
  "คุณสุพัตรา ระ",
];

function assertAdmin(request, body) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) {
    throw new Error("Missing ADMIN_PASSWORD");
  }

  const password = request.headers["x-admin-password"] || body?.password;
  if (password !== configuredPassword) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
}

function percent(value, denominator) {
  if (!denominator) return "";
  const output = (value / denominator) * 100;
  return Number(output.toFixed(2));
}

function statusForCount(count) {
  if (!count) return { label: "ไม่ประเมิน", className: "black" };
  if (count > 4) return { label: "มากกว่า 4 ครั้ง", className: "purple" };
  if (count === 3) return { label: "3 ครั้ง", className: "green" };
  if (count === 2) return { label: "2 ครั้ง", className: "red" };
  return { label: `${count} ครั้ง`, className: "blue" };
}

function aggregate(submissions, month, year) {
  const filtered = submissions.filter((item) => {
    const itemMonth = Number(item.month);
    const itemYear = Number(item.year);
    return (!month || itemMonth === month) && (!year || itemYear === year);
  });

  const names = [...new Set([...staffNames, ...filtered.map((item) => item.name)])];
  const rows = names.map((name) => {
    const personSubmissions = filtered.filter((item) => item.name === name);
    const rounds = new Set(personSubmissions.map((item) => item.round));
    const roundCount = rounds.size;
    const denominatorRounds = Math.max(roundCount, 4);
    const allMoments = personSubmissions.flatMap((item) => item.moments || []);
    const momentValues = [1, 2, 3, 4, 5].map((momentNumber) => {
      const compliantCount = personSubmissions.filter((item) =>
        (item.moments || []).some((moment) => Number(moment.moment) === momentNumber && moment.compliant),
      ).length;
      return percent(compliantCount, denominatorRounds);
    });
    const answeredMomentCount = allMoments.length;
    const soapCount = allMoments.filter((moment) => moment.handwash === "ล้างมือด้วยน้ำสบู่").length;
    const alcoholCount = allMoments.filter((moment) => moment.handwash === "ล้างมือด้วย Alcohol").length;
    const noHandwashCount = allMoments.filter((moment) => moment.handwash === "ไม่ล้างมือ").length;
    const completeCount = allMoments.filter((moment) => moment.completeSteps).length;
    const incompleteCount = allMoments.filter((moment) => !moment.completeSteps).length;

    return {
      name,
      status: statusForCount(roundCount),
      momentValues,
      soap: percent(soapCount, answeredMomentCount),
      alcohol: percent(alcoholCount, answeredMomentCount),
      noHandwash: percent(noHandwashCount, answeredMomentCount),
      complete: percent(completeCount, answeredMomentCount),
      incomplete: percent(incompleteCount, answeredMomentCount),
      totalMoment: "",
    };
  });

  const assessedRows = rows.filter((row) => row.status.label !== "ไม่ประเมิน");
  const totals = Array.from({ length: 10 }, (_, index) => {
    const values = assessedRows
      .map((row) => [...row.momentValues, row.soap, row.alcohol, row.noHandwash, row.complete, row.incomplete][index])
      .filter((value) => typeof value === "number");
    if (!values.length) return "";
    return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(8));
  });

  return {
    month,
    year,
    rows,
    totals: [...totals, ""],
    submissionCount: filtered.length,
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

  try {
    const body = await readJsonBody(request);
    assertAdmin(request, body);
    const { submissions } = await readSubmissions();
    const month = Number(body?.month) || new Date().getMonth() + 1;
    const year = Number(body?.year) || new Date().getFullYear();
    return jsonResponse(response, 200, { ok: true, ...aggregate(submissions, month, year) }, headers);
  } catch (error) {
    return jsonResponse(response, error.statusCode || 500, { ok: false, error: error.message }, headers);
  }
}

module.exports = handler;
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
