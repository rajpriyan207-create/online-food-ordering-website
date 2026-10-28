/* ===== Online Food Ordering Website - Application Logic =====
   Frontend demonstration only: no backend, no real orders, no payments. */

"use strict";

// ---------- 1. Data: food items (array of objects) ----------
const FOODS = [
  { id: 1,  name: "Chicken Biryani",      category: "Biryani",       price: 220, image: "images/chicken-biryani.svg",      description: "Fragrant basmati rice cooked with tender chicken and spices." },
  { id: 2,  name: "Veg Biryani",          category: "Biryani",       price: 160, image: "images/veg-biryani.svg",          description: "Aromatic rice with mixed vegetables, mint and masala." },
  { id: 3,  name: "Mutton Biryani",       category: "Biryani",       price: 300, image: "images/mutton-biryani.svg",       description: "Slow-cooked mutton layered with seasoned basmati rice." },
  { id: 4,  name: "Masala Dosa",          category: "South Indian",  price: 80,  image: "images/masala-dosa.svg",          description: "Crispy dosa filled with spiced potato, served with chutney." },
  { id: 5,  name: "Idli Sambar",          category: "South Indian",  price: 60,  image: "images/idli-sambar.svg",          description: "Soft steamed idlis served with hot sambar and chutney." },
  { id: 6,  name: "Medu Vada",            category: "South Indian",  price: 50,  image: "images/medu-vada.svg",            description: "Crunchy urad dal vadas served with sambar." },
  { id: 7,  name: "Ven Pongal",           category: "South Indian",  price: 70,  image: "images/pongal.svg",               description: "Comforting rice and moong dal dish tempered with pepper and ghee." },
  { id: 8,  name: "Veg Burger",           category: "Fast Food",     price: 99,  image: "images/veg-burger.svg",           description: "Crispy veg patty with lettuce, cheese and sauce in a soft bun." },
  { id: 9,  name: "Chicken Burger",       category: "Fast Food",     price: 129, image: "images/chicken-burger.svg",       description: "Juicy chicken patty with fresh lettuce and creamy mayo." },
  { id: 10, name: "Margherita Pizza",     category: "Fast Food",     price: 249, image: "images/margherita-pizza.svg",     description: "Classic pizza with tomato sauce, mozzarella and basil." },
  { id: 11, name: "French Fries",         category: "Fast Food",     price: 79,  image: "images/french-fries.svg",         description: "Golden crispy fries lightly salted." },
  { id: 12, name: "Veg Meals",            category: "Meals & Curries", price: 120, image: "images/veg-meals.svg",          description: "Full meals with rice, sambar, rasam, poriyal, kootu and curd." },
  { id: 13, name: "Parotta with Salna",   category: "Meals & Curries", price: 90, image: "images/parotta-salna.svg",       description: "Flaky layered parottas served with spicy salna." },
  { id: 14, name: "Paneer Butter Masala", category: "Meals & Curries", price: 180, image: "images/paneer-butter-masala.svg", description: "Soft paneer cubes in a rich, creamy tomato gravy." },
  { id: 15, name: "Filter Coffee",        category: "Beverages",     price: 30,  image: "images/filter-coffee.svg",        description: "Strong South Indian filter coffee with frothy milk." },
  { id: 16, name: "Masala Tea",           category: "Beverages",     price: 25,  image: "images/masala-tea.svg",           description: "Hot tea brewed with ginger, cardamom and milk." },
  { id: 17, name: "Fresh Lime Soda",      category: "Beverages",     price: 40,  image: "images/fresh-lime-soda.svg",      description: "Refreshing lime soda, sweet or salt." },
  { id: 18, name: "Mango Lassi",          category: "Beverages",     price: 60,  image: "images/mango-lassi.svg",          description: "Chilled yoghurt drink blended with ripe mango." },
  { id: 19, name: "Gulab Jamun",          category: "Desserts",      price: 50,  image: "images/gulab-jamun.svg",          description: "Soft milk-solid balls soaked in warm sugar syrup (2 pieces)." },
  { id: 20, name: "Ice Cream Cup",        category: "Desserts",      price: 70,  image: "images/ice-cream.svg",            description: "Three scoops of assorted ice cream with a cherry on top." }
];

const CART_KEY = "foodOrderingCart_v1";
const DELIVERY_CHARGE = 30;
const FREE_DELIVERY_ABOVE = 500;
const MAX_QTY = 20;

// ---------- 2. Application state ----------
let cart = [];                 // array of { id, qty }
let selectedCategory = "All";
let searchText = "";

// ---------- 3. DOM references ----------
const $ = (id) => document.getElementById(id);
const foodGrid = $("foodGrid"), noResults = $("noResults"), resultCount = $("resultCount");
const searchInput = $("searchInput"), categoryFilters = $("categoryFilters");
const cartList = $("cartList"), emptyCart = $("emptyCart"), cartFooter = $("cartFooter"), cartBadge = $("cartBadge");
const summaryTable = $("summaryTable"), summaryBody = $("summaryBody"), totalsBox = $("totals");
const emptySummary = $("emptySummary"), deliveryHint = $("deliveryHint");
const orderForm = $("orderForm");

// ---------- 4. Helper functions ----------
const formatINR = (n) => "\u20B9" + Number(n).toLocaleString("en-IN");
const findFood = (id) => FOODS.find((f) => f.id === id);

function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---------- 5. Local Storage ----------
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ }
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    if (!Array.isArray(saved)) return [];
    // Keep only valid items (known id, whole quantity between 1 and MAX_QTY)
    return saved
      .filter((i) => i && findFood(i.id) && Number.isInteger(i.qty) && i.qty >= 1)
      .map((i) => ({ id: i.id, qty: Math.min(i.qty, MAX_QTY) }));
  } catch (e) {
    return [];
  }
}

// ---------- 6. Menu: display, search and filter ----------
function getCategories() {
  return ["All", ...new Set(FOODS.map((f) => f.category))];
}

function renderCategories() {
  categoryFilters.innerHTML = getCategories()
    .map((c) => `<button type="button" class="chip${c === selectedCategory ? " active" : ""}" data-category="${escapeHTML(c)}" aria-pressed="${c === selectedCategory}">${escapeHTML(c)}</button>`)
    .join("");
}

function getVisibleFoods() {
  const term = searchText.trim().toLowerCase();
  return FOODS.filter((f) =>
    (selectedCategory === "All" || f.category === selectedCategory) &&
    f.name.toLowerCase().includes(term)
  );
}

function renderMenu() {
  const items = getVisibleFoods();
  foodGrid.innerHTML = items.map((f) => `
    <article class="food-card">
      <img src="${f.image}" alt="${escapeHTML(f.name)}" loading="lazy">
      <div class="food-body">
        <span class="tag">${escapeHTML(f.category)}</span>
        <h3>${escapeHTML(f.name)}</h3>
        <p>${escapeHTML(f.description)}</p>
        <div class="food-foot">
          <span class="price">${formatINR(f.price)}</span>
          <button type="button" class="btn btn-primary" data-add="${f.id}">Add to Cart</button>
        </div>
      </div>
    </article>`).join("");
  noResults.hidden = items.length > 0;
  resultCount.textContent = `Showing ${items.length} of ${FOODS.length} items`;
}

// ---------- 7. Cart operations ----------
function addToCart(id) {
  const line = cart.find((i) => i.id === id);
  if (line) { if (line.qty < MAX_QTY) line.qty += 1; }
  else cart.push({ id, qty: 1 });
  updateCart();
}

function changeQty(id, delta) {
  const line = cart.find((i) => i.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty < 1) { removeFromCart(id); return; }
  if (line.qty > MAX_QTY) line.qty = MAX_QTY;
  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  updateCart();
}

function clearCart() {
  cart = [];
  updateCart();
}

// ---------- 8. Calculations ----------
function calculateTotals() {
  const subtotal = cart.reduce((sum, i) => sum + findFood(i.id).price * i.qty, 0);
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_CHARGE;
  return { subtotal, delivery, total: subtotal + delivery, count: cart.reduce((s, i) => s + i.qty, 0) };
}

// ---------- 9. Render cart and order summary ----------
function renderCart() {
  const isEmpty = cart.length === 0;
  emptyCart.hidden = !isEmpty;
  cartFooter.hidden = isEmpty;
  cartList.innerHTML = cart.map((i) => {
    const f = findFood(i.id);
    return `
      <li class="cart-item">
        <img src="${f.image}" alt="${escapeHTML(f.name)}">
        <div>
          <h3>${escapeHTML(f.name)}</h3>
          <span class="unit">${formatINR(f.price)} each</span>
        </div>
        <div class="cart-right">
          <div class="line-total">${formatINR(f.price * i.qty)}</div>
          <div class="qty">
            <button type="button" class="qty-btn" data-dec="${f.id}" aria-label="Decrease quantity of ${escapeHTML(f.name)}">&minus;</button>
            <span class="qty-num" aria-live="polite">${i.qty}</span>
            <button type="button" class="qty-btn" data-inc="${f.id}" aria-label="Increase quantity of ${escapeHTML(f.name)}">+</button>
          </div>
          <button type="button" class="remove-btn" data-remove="${f.id}">Remove</button>
        </div>
      </li>`;
  }).join("");
}

function renderSummary() {
  const t = calculateTotals();
  const isEmpty = cart.length === 0;
  summaryTable.hidden = isEmpty;
  totalsBox.hidden = isEmpty;
  emptySummary.hidden = !isEmpty;
  deliveryHint.hidden = isEmpty;

  summaryBody.innerHTML = cart.map((i) => {
    const f = findFood(i.id);
    return `<tr><td>${escapeHTML(f.name)}</td><td>${i.qty}</td><td>${formatINR(f.price)}</td><td>${formatINR(f.price * i.qty)}</td></tr>`;
  }).join("");

  $("subtotalValue").textContent = formatINR(t.subtotal);
  $("deliveryValue").textContent = t.delivery === 0 && !isEmpty ? "FREE" : formatINR(t.delivery);
  $("totalValue").textContent = formatINR(t.total);
  deliveryHint.textContent = t.delivery > 0
    ? `Add items worth ${formatINR(FREE_DELIVERY_ABOVE - t.subtotal)} more for free delivery.`
    : "You have free delivery on this order.";
}

function updateCart() {
  saveCart();
  renderCart();
  renderSummary();
  cartBadge.textContent = calculateTotals().count;
  if (cart.length > 0) $("errCart").textContent = "";
}

// ---------- 10. Form validation ----------
function setError(fieldId, errId, message) {
  const field = $(fieldId).closest(".field");
  $(errId).textContent = message;
  field.classList.toggle("invalid", message !== "");
  return message === "";
}

function validateForm() {
  const name = $("custName").value.trim();
  const phone = $("custPhone").value.trim();
  const email = $("custEmail").value.trim();
  const address = $("custAddress").value.trim();
  const pin = $("custPin").value.trim();
  const payment = $("custPayment").value;
  const results = [];

  results.push(setError("custName", "errName",
    name === "" ? "Please enter your name." :
    !/^[A-Za-z][A-Za-z .'-]{1,49}$/.test(name) ? "Name must be 2-50 letters (letters, spaces, . ' - only)." : ""));

  results.push(setError("custPhone", "errPhone",
    phone === "" ? "Please enter your mobile number." :
    !/^[6-9]\d{9}$/.test(phone) ? "Enter a valid 10-digit Indian mobile number starting with 6-9." : ""));

  results.push(setError("custEmail", "errEmail",
    email === "" ? "Please enter your email." :
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "Enter a valid email address (e.g. name@example.com)." : ""));

  results.push(setError("custAddress", "errAddress",
    address === "" ? "Please enter your delivery address." :
    address.length < 10 ? "Address is too short (minimum 10 characters)." : ""));

  results.push(setError("custPin", "errPin",
    pin === "" ? "Please enter your PIN code." :
    !/^[1-9]\d{5}$/.test(pin) ? "Enter a valid 6-digit PIN code." : ""));

  results.push(setError("custPayment", "errPayment", payment === "" ? "Please select a payment method." : ""));

  const cartOk = cart.length > 0;
  $("errCart").textContent = cartOk ? "" : "Your cart is empty. Add at least one item before submitting.";
  results.push(cartOk);

  return results.every(Boolean);
}

// ---------- 11. Order submission and confirmation ----------
function submitOrder(event) {
  event.preventDefault();
  if (!validateForm()) {
    const firstBad = orderForm.querySelector(".field.invalid input, .field.invalid textarea, .field.invalid select");
    if (firstBad) firstBad.focus();
    return;
  }
  const t = calculateTotals();
  const orderId = "DEMO-" + Date.now().toString().slice(-6);

  $("confName").textContent = $("custName").value.trim();
  $("confId").textContent = "#" + orderId;
  $("confBody").innerHTML = cart.map((i) => {
    const f = findFood(i.id);
    return `<tr><td>${escapeHTML(f.name)}</td><td>${i.qty}</td><td>${formatINR(f.price * i.qty)}</td></tr>`;
  }).join("");
  $("confTotal").textContent = formatINR(t.total) + (t.delivery === 0 ? " (free delivery)" : ` (includes ${formatINR(t.delivery)} delivery)`);
  $("confMeta").textContent = `Payment: ${$("custPayment").value} | PIN code: ${$("custPin").value.trim()}`;

  $("confirmModal").hidden = false;
  $("closeModalBtn").focus();

  clearCart();          // order is "submitted": empty the cart and Local Storage copy
  orderForm.reset();
  orderForm.querySelectorAll(".field").forEach((f) => f.classList.remove("invalid"));
}

function closeModal() {
  $("confirmModal").hidden = true;
}

// ---------- 12. Event listeners ----------
searchInput.addEventListener("input", (e) => { searchText = e.target.value; renderMenu(); });

categoryFilters.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-category]");
  if (!btn) return;
  selectedCategory = btn.dataset.category;
  renderCategories();
  renderMenu();
});

foodGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (btn) addToCart(Number(btn.dataset.add));
});

cartList.addEventListener("click", (e) => {
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  const rem = e.target.closest("[data-remove]");
  if (inc) changeQty(Number(inc.dataset.inc), 1);
  else if (dec) changeQty(Number(dec.dataset.dec), -1);
  else if (rem) removeFromCart(Number(rem.dataset.remove));
});

$("clearCartBtn").addEventListener("click", clearCart);
orderForm.addEventListener("submit", submitOrder);
$("closeModalBtn").addEventListener("click", closeModal);
$("confirmModal").addEventListener("click", (e) => { if (e.target.id === "confirmModal") closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// Phone and PIN fields accept digits only
["custPhone", "custPin"].forEach((id) => {
  $(id).addEventListener("input", (e) => { e.target.value = e.target.value.replace(/\D/g, ""); });
});

// ---------- 13. Start-up ----------
function init() {
  cart = loadCart();          // restore cart saved in Local Storage
  renderCategories();
  renderMenu();
  updateCart();
}
init();

window.FOOD_APP_LOADED = true;   // tells index.html that the script loaded correctly
