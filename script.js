let budget = 0;
let remaining = 0;
let items = [];

const budgetInput = document.getElementById("budgetInput");
const remainingSpan = document.getElementById("remaining");

const setBudgetBtn = document.getElementById("setBudgetBtn");

const itemNameInput = document.getElementById("itemName");
const itemQtyInput = document.getElementById("itemQty");
const itemPriceInput = document.getElementById("itemPrice");
const addItemBtn = document.getElementById("addItemBtn");

const itemsTableBody = document.querySelector("#itemsTable tbody");
const exportBtn = document.getElementById("exportBtn");

function updateRemainingDisplay() {
  remainingSpan.textContent = remaining.toFixed(2);
}

function setBudget() {
  const val = parseFloat(budgetInput.value);
  if (isNaN(val) || val < 0) return;

  budget = val;
  remaining = budget - items.reduce((sum, i) => sum + i.total, 0);
  updateRemainingDisplay();
}

function addItem() {
  const name = itemNameInput.value.trim();
  const qty = parseInt(itemQtyInput.value, 10);
  const price = parseFloat(itemPriceInput.value);

  if (!name) return;
  if (isNaN(qty) || qty < 1) return;
  if (isNaN(price) || price < 0) return;

  const total = qty * price;

  items.push({ name, qty, price, total });
  remaining = budget - items.reduce((sum, i) => sum + i.total, 0);
  updateRemainingDisplay();

  renderTable();

  // clear inputs (keep qty at 1 for convenience)
  itemNameInput.value = "";
  itemQtyInput.value = "1";
  itemPriceInput.value = "";
  itemNameInput.focus();
}

function removeItem(index) {
  items.splice(index, 1);
  remaining = budget - items.reduce((sum, i) => sum + i.total, 0);
  updateRemainingDisplay();
  renderTable();
}

function renderTable() {
  itemsTableBody.innerHTML = "";

  items.forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${escapeHtml(item.name)}</td>
      <td>${item.qty}</td>
      <td>${item.price.toFixed(2)}</td>
      <td>${item.total.toFixed(2)}</td>
      <td><button class="remove-btn" data-index="${index}">X</button></td>
    `;

    itemsTableBody.appendChild(tr);
  });

  // hook up remove buttons
  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.getAttribute("data-index"), 10);
      removeItem(idx);
    });
  });
}

function exportToCSV() {
  const rows = [
    ["Item", "Qty", "Price", "Total"],
    ...items.map(i => [i.name, i.qty, i.price.toFixed(2), i.total.toFixed(2)])
  ];

  const csv = rows.map(r => r.map(escapeCsv).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "shopping-list.csv";
  a.click();

  URL.revokeObjectURL(url);
}

function escapeCsv(value) {
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

setBudgetBtn.addEventListener("click", setBudget);
addItemBtn.addEventListener("click", addItem);
exportBtn.addEventListener("click", exportToCSV);

// Optional: press Enter to add item when cursor is in price box
itemPriceInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addItem();
});

updateRemainingDisplay();
