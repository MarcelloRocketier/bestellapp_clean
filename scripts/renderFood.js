// Array der verfügbaren Gerichte
const foodItems = [
  { id: 1, name: "Quesadilla", image: "img/food/quesadilla.jpg", price: 6.5, category: "Vegetarisch" },
  { id: 2, name: "Tacos al Pastor", image: "img/food/tacosalpastor.jpg", price: 7, category: "Tacos" },
  { id: 3, name: "Tamales", image: "img/food/tamales.jpg", price: 5, category: "Vegetarisch" },
  { id: 4, name: "Fajitas", image: "img/food/fajitas.jpg", price: 7.5, category: "Fleisch" },
  { id: 5, name: "Chili con Carne", image: "img/food/chiliconcarne.jpg", price: 6, category: "Fleisch" },
  { id: 6, name: "Ceviche", image: "img/food/ceviche.jpg", price: 6.5, category: "Meeresfrüchte" },
];

// Warenkorb (initial leer, eventuell aus localStorage laden)
let cart = [];
const savedCart = localStorage.getItem("cart");
if (savedCart) {
  cart = JSON.parse(savedCart);
}

/* Funktionen für den Warenkorb */

// Fügt ein Gericht zum Warenkorb hinzu
function addToCart(id) {
  const item = foodItems.find(food => food.id === id);
  const cartItem = cart.find(i => i.id === id);

  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  renderCart();
  saveCart();
}

// Speichert den Warenkorb im LocalStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Rendert den Warenkorb und zeigt alle Artikel an
function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Dein Warenkorb ist leer.</p>";
    return;
  }

  cart.forEach((item) => {
    cartContainer.innerHTML += `
      <div class="cart-item">
        <span class="item-name">${item.name}</span>
        <div class="quantity-control">
          <button onclick="changeQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
        <span class="price">${(item.price * item.quantity).toFixed(2)} €</span>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">x</button>
      </div>
    `;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartContainer.innerHTML += `<hr><p><strong>Gesamt: ${total.toFixed(2)} €</strong></p>`;
}

// Ändert die Menge eines Artikels
function changeQuantity(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  renderCart();
  saveCart();
}

// Entfernt einen Artikel aus dem Warenkorb
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
  saveCart();
}
/* Funktionen für das Menü     */

// Rendert das Menü basierend auf einem Filter (Kategorie)
function renderMenu(filter = "Alle") {
  const menuSection = document.querySelector(".menu");
  menuSection.innerHTML = "";

  let filteredItems = filter === "Alle"
    ? [...foodItems]
    : foodItems.filter(item => item.category === filter);

  const sortSelect = document.getElementById("sort-select");
  const sortValue = sortSelect ? sortSelect.value : "";

  if (sortValue === "price-asc") {
    filteredItems.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-desc") {
    filteredItems.sort((a, b) => b.price - a.price);
  } else if (sortValue === "name-asc") {
    filteredItems.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "name-desc") {
    filteredItems.sort((a, b) => b.name.localeCompare(a.name));
  }

  filteredItems.forEach((item) => {
    menuSection.innerHTML += `
      <div class="food-card">
        <img src="${item.image}" alt="${item.name}" />
        <h2>${item.name}</h2>
        <p>${item.price.toFixed(2)} €</p>
        <button onclick="addToCart(${item.id})">In den Warenkorb</button>
      </div>
    `;
  });
}

// Rendert die Filter-Buttons basierend auf den Kategorien
function renderFilters() {
  const categories = ["Alle", ...new Set(foodItems.map(item => item.category))];
  const container = document.getElementById("filter-buttons");
  container.innerHTML = "";

  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category;
    button.onclick = () => {
      // Entfernt die aktive Klasse von allen Buttons und fügt sie dem geklickten Button hinzu
      document.querySelectorAll("#filter-buttons button").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      renderMenu(category);
    };
    container.appendChild(button);
  });

  const defaultBtn = container.querySelector("button");
  if (defaultBtn) defaultBtn.classList.add("active");
}
/* Funktionen für Bestellungen */

// Öffnet das Bestellformular (falls der Warenkorb nicht leer ist)
function handleOrder() {
  if (cart.length === 0) {
    alert("Dein Warenkorb ist leer.");
    return;
  }
  document.getElementById("order-form").classList.remove("hidden-order-form");
}

// Zeigt das Order Success Modal an und leert den Warenkorb
function submitOrder() {
  const name = document.getElementById("customer-name").value.trim();
  const address = document.getElementById("customer-address").value.trim();
  const note = document.getElementById("customer-note").value.trim();

  if (!name || !address) {
    alert("Bitte fülle Name und Adresse aus.");
    return;
  }

  const summary = cart.map(item =>
    `${item.name} x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} €`
  ).join("<br>");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `
    <strong>Name:</strong> ${name}<br>
    <strong>Adresse:</strong> ${address}<br><br>
    <strong>Bestellung:</strong><br>${summary}<br><br>
    <strong>Gesamt:</strong> ${total.toFixed(2)} €<br>
    <strong>Notiz:</strong> ${note || "-"}`;

  // Zeige die Bestellzusammenfassung im Modal
  document.getElementById("order-summary-text").innerHTML = message;
  document.getElementById("order-success").classList.remove("hidden");

  // Warenkorb leeren und speichern
  cart = [];
  saveCart();
  renderCart();
  // Schließe das Bestellformular
  document.getElementById("order-form").classList.add("hidden-order-form");
}

// Schließt das Bestellbestätigungs-Modal
function closeOrderModal() {
  document.getElementById("order-success").classList.add("hidden");
}

/* Funktionen für Toggle & Darkmode */

// Toggle für den Warenkorb (insbesondere für Mobile)
function setupCartToggle() {
  const cartEl = document.querySelector(".cart");
  const toggleBtn = document.getElementById("cart-toggle");

  toggleBtn.onclick = () => {
    cartEl.classList.toggle("open");
  };
}

// Darkmode-Einstellungen
function setupDarkmode() {
  const toggleBtn = document.getElementById("darkmode-toggle");
  const savedMode = localStorage.getItem("darkmode");

  if (savedMode === "on") {
    document.body.classList.add("darkmode");
  }

  toggleBtn.onclick = () => {
    document.body.classList.toggle("darkmode");
    const isDark = document.body.classList.contains("darkmode");
    localStorage.setItem("darkmode", isDark ? "on" : "off");
  };
}

// Init-Funktion, die beim Laden der Seite aufgerufen wird
function initApp() {
  renderFilters();
  renderMenu();
  renderCart();

  const submitBtn = document.getElementById("submit-order");
  if (submitBtn) submitBtn.onclick = submitOrder;

  const orderBtn = document.getElementById("order-button");
  if (orderBtn) orderBtn.onclick = handleOrder;

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.onchange = () => {
      const activeFilterBtn = document.querySelector("#filter-buttons button.active");
      const activeCategory = activeFilterBtn ? activeFilterBtn.textContent : "Alle";
      renderMenu(activeCategory);
    };
  }

  // Setze Toggle-Funktion für den Warenkorb
  setupCartToggle();
  // Setze Darkmode-Funktionalität
  setupDarkmode();
}

// Exponiere Funktionen im globalen Scope, falls nötig
window.closeOrderModal = closeOrderModal;
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
