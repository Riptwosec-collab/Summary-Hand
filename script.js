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

const names = [
  "คุณอนัตยา",
  "คุณพัชรีพร",
  "คุณทิพินา",
  "คุณอิสุน",
  "คุณสัสรชัย",
  "คุณมาธิยา",
  "คุณนัฐ",
  "คุณจุฑาวรรณ",
  "คุณรังสินา",
  "คุณขนิษฐา",
  "คุณชลธีราช",
  "คุณวงศ์ยา",
  "คุณรุ่งอัยน์",
  "คุณวิภากร",
  "คุณสุทธยา",
  "คุณณัฐณิชา",
  "คุณน้ำฝน",
  "คุณวณิดา",
  "คุณฟาริดา",
  "คุณธัญชนก",
  "คุณอัญชลี",
  "คุณธิติมา",
  "คุณรัชชิสรี",
  "คุณศิริวรรณ",
  "คุณธิภาดา",
  "คุณศรีชณญา",
  "คุณสายๆ",
  "คุณเปี่ยงสด",
  "คุณวรากานต์",
  "คุณอัครชัย",
  "คุณพาณิชยา",
  "คุณสุพัตรา",
  "คุณเดือนเพ็ญ",
  "คุณชุดิมา",
  "คุณเอ็กธิภา",
  "คุณสุพัตตรา ระ",
];

const statusCycle = [
  { label: "3 ครั้ง", className: "green" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "ไม่ประเมิน", className: "black" },
  { label: "ไม่ประเมิน", className: "black" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "มากกว่า 4 ครั้ง", className: "purple" },
  { label: "มากกว่า 4 ครั้ง", className: "purple" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "3 ครั้ง", className: "green" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "มากกว่า 4 ครั้ง", className: "purple" },
  { label: "ไม่ประเมิน", className: "black" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "4 ครั้ง", className: "blue" },
  { label: "2 ครั้ง", className: "red" },
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

const baseRows = [
  [33.3, 0, 0, 33.3, 33.3, 33.3, 66.7, 0, 100, 0, ""],
  [25, 0, 25, 25, 25, 25, 25, 0, 100, 0, ""],
  [0, 0, 0, 25, 75, 50, 25, 0, 75, 25, ""],
  [25, 25, 25, 0, 25, 25, 75, 0, 100, 0, ""],
  [50, 0, 25, 0, 25, 50, 50, 0, 75, 25, ""],
  ["", "", "", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", "", "", ""],
  [25, 0, 50, 0, 25, 75, 25, 0, 100, 0, ""],
  [50, 0, 0, 25, 25, 75, 25, 0, 100, 0, ""],
  [50, 0, 25, 0, 25, 25, 75, 0, 100, 0, ""],
  [25, 75, 0, 0, 0, 0, 0, 100, 0, 100, ""],
  [25, 0, 50, 0, 25, 75, 25, 0, 75, 25, ""],
  [25, 0, 25, 0, 50, 75, 25, 0, 100, 0, ""],
  [0, 25, 0, 75, 0, 100, 0, 0, 100, 0, ""],
  [37.6, 12.6, 12.6, 25, 12.6, 37.5, 50, 13.5, 50, 50, ""],
  [0, 0, 100, 0, 0, 100, 0, 0, 100, 0, ""],
  [25, 0, 0, 0, 75, 0, 100, 0, 100, 0, ""],
  [50, 0, 25, 0, 25, 25, 75, 0, 75, 25, ""],
  [25, 25, 25, 25, 0, 50, 50, 0, 100, 0, ""],
  [25, 25, 0, 50, 0, 75, 25, 0, 75, 25, ""],
  [25, 50, 25, 0, 0, 25, 50, 25, 50, 50, ""],
  [0, 0, 75, 25, 0, 75, 25, 0, 100, 0, ""],
  [50, 0, 25, 25, 0, 50, 50, 0, 100, 0, ""],
  [25, 25, 25, 0, 25, 50, 50, 0, 100, 0, ""],
  [25, 0, 0, 25, 50, 50, 50, 0, 100, 0, ""],
  [0, 0, 75, 25, 0, 100, 0, 0, 100, 0, ""],
  [0, 0, 0, 100, 0, 66.7, 33.3, 0, 100, 0, ""],
  [0, 0, 25, 25, 25, 75, 25, 0, 100, 0, ""],
  [25, 25, 25, 25, 0, 75, 25, 0, 100, 0, ""],
  [25, 0, 25, 0, 50, 50, 50, 0, 100, 0, ""],
  [25, 0, 0, 25, 50, 75, 25, 0, 75, 25, ""],
  [60, 0, 20, 20, 0, 40, 60, 0, 100, 0, ""],
  ["", "", "", "", "", "", "", "", "", "", ""],
  [0, 25, 0, 25, 50, 0, 100, 0, 100, 0, ""],
  [25, 0, 25, 0, 50, 25, 50, 25, 75, 25, ""],
  [0, 0, 50, 0, 50, 100, 0, 0, 100, 0, ""],
];

const totals = [26.03, 9.586666667, 23.58666667, 19.46129032, 21.53, 54.25, 38.66666667, 4.616666667, 88.28125, 11.71875, ""];

const tableHead = document.querySelector("#tableHead");
const tableBody = document.querySelector("#tableBody");
const monthTabs = document.querySelector("#monthTabs");

let activeMonth = 0;

function shortCode(index, monthIndex) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let seed = (index + 7) * 7919 + (monthIndex + 11) * 104729;
  let code = "";
  for (let i = 0; i < 5; i += 1) {
    seed = (seed * 1664525 + 1013904223 + i * 97) >>> 0;
    code += alphabet[seed % alphabet.length];
  }
  return code;
}

function monthAdjustedValue(value, rowIndex, colIndex, monthIndex) {
  if (value === "") return "";
  if (monthIndex === 0) return value;
  const offset = ((rowIndex + colIndex + monthIndex) % 4) * 25;
  if (value % 25 === 0) return offset;
  return Number((value + (monthIndex % 3 === 0 ? 0.1 : 0)).toFixed(1));
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

function renderRows() {
  const rows = names.map((name, index) => {
    const tr = document.createElement("tr");
    const rowNum = document.createElement("td");
    rowNum.className = "row-num";
    rowNum.textContent = index + 2;
    tr.append(rowNum);

    const nameCell = document.createElement("td");
    nameCell.className = "name-col";
    nameCell.textContent = name;
    tr.append(nameCell);

    const urlCell = document.createElement("td");
    urlCell.className = "url-col";
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = `https://shorturl.asia/${shortCode(index, activeMonth)}`;
    urlCell.append(link);
    tr.append(urlCell);

    const countCell = document.createElement("td");
    countCell.className = "count-col";
    const status = statusCycle[index];
    const pill = document.createElement("span");
    pill.className = `pill ${status.className}`;
    pill.textContent = status.label;
    countCell.append(pill);
    tr.append(countCell);

    baseRows[index].forEach((value, colIndex) => {
      const td = document.createElement("td");
      td.className = colIndex === 10 ? "empty-col" : "metric-col";
      td.textContent = monthAdjustedValue(value, index, colIndex, activeMonth);
      if (index === 10 && colIndex === 10) td.classList.add("selected-cell");
      tr.append(td);
    });

    return tr;
  });

  const blankRow = document.createElement("tr");
  const blankRowNum = document.createElement("td");
  blankRowNum.className = "row-num";
  blankRowNum.textContent = names.length + 2;
  blankRow.append(blankRowNum);

  columns.forEach((column, index) => {
    const td = document.createElement("td");
    td.className = column.className.replace(/h-[a-z0-9-]+/g, "").trim();
    if (index === 2) {
      const pill = document.createElement("span");
      pill.className = "pill black";
      pill.textContent = "";
      td.append(pill);
    }
    blankRow.append(td);
  });

  const totalRow = document.createElement("tr");
  totalRow.className = "total-row";

  const rowNum = document.createElement("td");
  rowNum.className = "row-num";
  rowNum.textContent = names.length + 3;
  totalRow.append(rowNum);

  const totalLabel = document.createElement("td");
  totalLabel.className = "name-col total-label";
  totalLabel.textContent = "Total";
  totalRow.append(totalLabel);

  const blankUrl = document.createElement("td");
  blankUrl.className = "url-col";
  totalRow.append(blankUrl);

  const blankCount = document.createElement("td");
  blankCount.className = "count-col";
  totalRow.append(blankCount);

  totals.forEach((value, index) => {
    const td = document.createElement("td");
    td.className = index === 10 ? "empty-col" : "metric-col";
    td.textContent = value;
    totalRow.append(td);
  });

  rows.push(blankRow, totalRow);
  tableBody.replaceChildren(...rows);
}

function renderTabs() {
  const tabs = months.map((month, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `month-tab${index === activeMonth ? " active" : ""}`;
    button.textContent = month;
    button.addEventListener("click", () => {
      activeMonth = index;
      renderRows();
      renderTabs();
    });
    return button;
  });

  monthTabs.replaceChildren(...tabs);
}

renderHeader();
renderRows();
renderTabs();
