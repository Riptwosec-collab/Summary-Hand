const months = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

const columns = [
  { title: "", className: "name-col" },
  { title: "", className: "url-col head-link" },
  { title: "จำนวนครั้งที่ประเมิน", className: "count-col head-count" },
  { title: "Moment 1", className: "metric-col h-moment-1" },
  { title: "Moment 2", className: "metric-col h-moment-2" },
  { title: "Moment 3", className: "metric-col h-moment-3" },
  { title: "Moment 4", className: "metric-col h-moment-4" },
  { title: "Moment 5", className: "metric-col h-moment-5" },
  { title: "น้ำสบู่", className: "metric-col h-enter" },
  { title: "Alcohol", className: "metric-col h-alcohol" },
  { title: "ไม่ล้างมือ", className: "metric-col h-no-tool" },
  { title: "ครบ", className: "metric-col h-complete" },
  { title: "ไม่ครบ", className: "metric-col h-incomplete" },
  { title: "รวม 5 moment", className: "empty-col h-total" },
];

const tableHead = document.querySelector("#tableHead");
const tableBody = document.querySelector("#tableBody");
const monthTabs = document.querySelector("#monthTabs");
const sheetApp = document.querySelector("#sheetApp");
const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
const summaryStatus = document.querySelector("#summaryStatus");
const logoutButton = document.querySelector("#logoutButton");

let activeMonth = new Date().getMonth();
let adminPassword = sessionStorage.getItem("summary-hand-admin-password") || "";

function formatValue(value) {
  if (value === "" || value === null || typeof value === "undefined") return "";
  if (typeof value !== "number") return value;
  return Number.isInteger(value) ? String(value) : String(value);
}

async function fetchSummary() {
  const response = await fetch("/api/summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Password": adminPassword,
    },
    body: JSON.stringify({
      month: activeMonth + 1,
      year: new Date().getFullYear(),
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.error || "โหลดข้อมูลไม่สำเร็จ");
  }
  return data;
}

function renderHeader() {
  const headerRow = document.createElement("tr");
  const corner = document.createElement("th");
  corner.className = "corner";
  corner.textContent = "1";
  headerRow.append(corner);

  columns.forEach((column) => {
    const th = document.createElement("th");
    th.className = column.className;
    th.textContent = column.title;
    headerRow.append(th);
  });

  tableHead.replaceChildren(headerRow);
}

function renderRows(summary) {
  const rows = summary.rows.map((row, index) => {
    const tr = document.createElement("tr");
    const values = [
      row.name,
      "",
      row.status,
      ...row.momentValues,
      row.soap,
      row.alcohol,
      row.noHandwash,
      row.complete,
      row.incomplete,
      row.totalMoment,
    ];

    const rowNum = document.createElement("td");
    rowNum.className = "row-num";
    rowNum.textContent = index + 2;
    tr.append(rowNum);

    values.forEach((value, valueIndex) => {
      const td = document.createElement("td");
      td.className = columns[valueIndex].className.replace(/h-[a-z0-9-]+/g, "").trim();

      if (valueIndex === 2) {
        const pill = document.createElement("span");
        pill.className = `pill ${value.className}`;
        pill.textContent = value.label;
        td.append(pill);
      } else {
        td.textContent = formatValue(value);
      }

      tr.append(td);
    });

    return tr;
  });

  const totalRow = document.createElement("tr");
  totalRow.className = "total-row";

  const rowNum = document.createElement("td");
  rowNum.className = "row-num";
  rowNum.textContent = summary.rows.length + 3;
  totalRow.append(rowNum);

  const totalCells = ["Total", "", "", ...summary.totals];
  totalCells.forEach((value, index) => {
    const td = document.createElement("td");
    const column = columns[index];
    td.className = column.className.replace(/h-[a-z0-9-]+/g, "").trim();
    td.textContent = formatValue(value);
    totalRow.append(td);
  });

  rows.push(totalRow);
  tableBody.replaceChildren(...rows);
}

function renderTabs() {
  const tabs = months.map((month, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `month-tab${index === activeMonth ? " active" : ""}`;
    button.textContent = month;
    button.addEventListener("click", async () => {
      activeMonth = index;
      renderTabs();
      await loadSummary();
    });
    return button;
  });

  monthTabs.replaceChildren(...tabs);
}

async function loadSummary() {
  summaryStatus.textContent = "กำลังโหลดข้อมูล...";
  try {
    const summary = await fetchSummary();
    renderRows(summary);
    summaryStatus.textContent = `เดือน ${months[activeMonth]} | รายการที่ส่งมา ${summary.submissionCount} รายการ`;
  } catch (error) {
    summaryStatus.textContent = error.message;
    if (error.message.includes("Unauthorized")) {
      sessionStorage.removeItem("summary-hand-admin-password");
      sheetApp.classList.add("locked");
    }
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.textContent = "";
  adminPassword = new FormData(loginForm).get("password");
  sessionStorage.setItem("summary-hand-admin-password", adminPassword);
  sheetApp.classList.remove("locked");
  try {
    await loadSummary();
  } catch (error) {
    loginError.textContent = error.message;
    sheetApp.classList.add("locked");
  }
});

logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem("summary-hand-admin-password");
  adminPassword = "";
  sheetApp.classList.add("locked");
});

renderHeader();
renderTabs();

if (adminPassword) {
  sheetApp.classList.remove("locked");
  loadSummary();
}
