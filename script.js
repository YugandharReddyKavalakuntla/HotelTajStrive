const items = [
  { id: 1, name: "Black Cod Miso", price: 499, img: "assets/1.jpg", category: "Food" },
  { id: 2, name: "Foie Gras on Brioche", price: 499, img: "assets/2.jpg", category: "Food" },
  { id: 3, name: "Butter Chicken", price: 399, img: "assets/3.jpg", category: "Food" },
  { id: 4, name: "Hyderabadi Biryani", price: 299, img: "assets/4.webp", category: "Food" },
  { id: 5, name: "Laal Maas", price: 299, img: "assets/5.jpg", category: "Food" },
  { id: 6, name: "Galouti Kebab", price: 199, img: "assets/6.webp", category: "Food" },
  { id: 7, name: "Virgin Mojito", price: 199, img: "assets/7.webp", category: "Beverage" },
  { id: 8, name: "Apple Cinnamon Sparkle", price: 199, img: "assets/8.webp", category: "Beverage" },
  { id: 9, name: "Tropical Sunset", price: 199, img: "assets/9.jpeg", category: "Beverage" },
  { id: 10, name: "Lemongrass & Ginger Fizz", price: 199, img: "assets/10.jpeg", category: "Beverage" },
  { id: 11, name: "Coconut Rose Elixir", price: 199, img: "assets/11.jpeg", category: "Beverage" },
  { id: 12, name: "Water", price: 20, img: "assets/water.jpg", category: "Beverage" }
];

// CART FUNCTIONS
let cart = JSON.parse(localStorage.getItem("userCart")) || {};

function saveCart() {
  localStorage.setItem("userCart", JSON.stringify(cart));
}

function updateCartCount() {
  const count = Object.values(cart).reduce((sum, v) => sum + v, 0);
  const el = document.getElementById("cartCount");
  if (el) el.textContent = count;
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderMenu();
}

function increaseQty(id) {
  addToCart(id);
}

function decreaseQty(id) {
  if (!cart[id]) return;
  cart[id]--;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  renderMenu();
}

// MENU RENDERING
function showMenu(type) {
  document.getElementById("foodMenu")?.classList.toggle("d-none", type !== "food");
  document.getElementById("beverageMenu")?.classList.toggle("d-none", type !== "beverage");
}

function renderMenu() {
  const foodMenu = document.getElementById("foodMenu");
  const bevMenu = document.getElementById("beverageMenu");
  if (!foodMenu || !bevMenu) return;

  foodMenu.innerHTML = bevMenu.innerHTML = "";
  items.forEach(item => {
    const qty = cart[item.id] || 0;
    const col = document.createElement("div");
    col.className = "col-sm-6 col-lg-4 mb-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${item.img}" class="card-img-top" alt="${item.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text fw-semibold">₹${item.price}</p>
          <div class="mt-auto">
            ${qty > 0
              ? `<div class="d-flex justify-content-center align-items-center">
                  <button class="btn btn-danger btn-sm me-2" onclick="decreaseQty(${item.id})">−</button>
                  <span>${qty}</span>
                  <button class="btn btn-success btn-sm ms-2" onclick="increaseQty(${item.id})">+</button>
                </div>`
              : `<button class="btn btn-outline-success w-100" onclick="addToCart(${item.id})">+ Add</button>`}
          </div>
        </div>
      </div>`;
    (item.category === "Food" ? foodMenu : bevMenu).appendChild(col);
  });
  updateCartCount();
}

// CART PAGE RENDERING
function renderCartPage() {
  const tbody = document.querySelector("#cartPageTable tbody");
  const totals = document.getElementById("totals");
  if (!tbody) return;

  tbody.innerHTML = "";
  let total = 0;

  Object.entries(cart).forEach(([id, qty]) => {
    const item = items.find(i => i.id == id);
    const sub = item.price * qty;
    total += sub;
    tbody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${qty}</td>
        <td>₹${item.price.toFixed(2)}</td>
        <td>₹${sub.toFixed(2)}</td>
      </tr>`;
  });

  if (total === 0) {
    totals.classList.add("d-none");
    return;
  }

  const cgst = total * 0.025;
  const sgst = total * 0.025;
  const grand = total + cgst + sgst;

  document.getElementById("cartItemTotal").textContent = total.toFixed(2);
  document.getElementById("cartCgst").textContent = cgst.toFixed(2);
  document.getElementById("cartSgst").textContent = sgst.toFixed(2);
  document.getElementById("cartGrandTotal").textContent = grand.toFixed(2);
  totals.classList.remove("d-none");
}

// ✅ FINAL: PRINT INVOICE (Refresh Safe + Mobile Compatible)
function printInvoice() {
  const name = document.getElementById("customerName").value.trim();
  const mobile = document.getElementById("customerMobile").value.trim();
  const table = document.getElementById("tableNumber").value.trim();

  if (!name || !/^[6-9]\d{9}$/.test(mobile) || !table) {
    alert("Please enter a valid name, 10-digit mobile number, and table number.");
    return;
  }

  document.getElementById("invCustomerName").textContent = name;
  document.getElementById("invCustomerMobile").textContent = mobile;
  document.getElementById("invTableNumber").textContent = table;
  document.getElementById("invDate").textContent = new Date().toLocaleString();

  const invTbody = document.querySelector("#invItems tbody");
  invTbody.innerHTML = "";

  let total = 0;
  Object.entries(cart).forEach(([id, qty]) => {
    const item = items.find(i => i.id == id);
    const sub = item.price * qty;
    total += sub;
    invTbody.innerHTML += `<tr><td>${item.name}</td><td>${qty}</td><td>₹${item.price.toFixed(2)}</td><td>₹${sub.toFixed(2)}</td></tr>`;
  });

  const cgst = total * 0.025;
  const sgst = total * 0.025;
  const grand = total + cgst + sgst;

  document.getElementById("invTotal").textContent = total.toFixed(2);
  document.getElementById("invCgst").textContent = cgst.toFixed(2);
  document.getElementById("invSgst").textContent = sgst.toFixed(2);
  document.getElementById("invGrand").textContent = grand.toFixed(2);

  // Show invoice
  document.getElementById("invoice").classList.remove("d-none");

  // Clear cart before print
  localStorage.removeItem("userCart");

  // Trigger print
  window.print();

  // Force redirect after short delay (works on mobile)
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

// PAGE INIT
document.addEventListener("DOMContentLoaded", () => {
  const isCartPage = window.location.pathname.includes("cart");
  if (isCartPage) {
    renderCartPage();
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) checkoutBtn.addEventListener("click", printInvoice);
  } else {
    renderMenu();
    showMenu("food");
  }
});
