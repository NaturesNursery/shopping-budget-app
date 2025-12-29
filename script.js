let budget = 0;
let remaining = 0;
let items = [];

function setBudget() {
  budget = parseFloat(document.getElementById("budgetInput").value);
  remaining = budget;
  updateRemaining();
}

function addItem() {
  const name = document.getElementById("itemName").value;
  const price = parseFloat(document.getElementById("itemPrice").value);

  if (!name || isNaN(price)) return;

  items.push({ name, price });
  remaining -= price;

  const row = document.createElement("tr");
  row.innerHTML = `<td>${name}</td><td>${price.toFixed(2)}</td>`;
  document.getElementById("itemList").appendChild(row);

  updateRemaining();

  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";
}

function updateRemaining() {
  document.getElementById("remaining").innerText = remaining.toFixed(2);
}

function exportCSV() {
  let csv = "Item,Price\n";
  items.forEach(i => {
    csv += `${i.name},${i.price}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "shopping_list.csv";
  a.click();
}
