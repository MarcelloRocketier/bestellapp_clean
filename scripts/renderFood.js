// Array der verfügbaren Gerichte
const foodItems = [
  { id: 1, name: "Quesadilla", image: "img/food/quesadilla.jpg", price: 6.5, category: "Vegetarisch" },
  { id: 2, name: "Tacos al Pastor", image: "img/food/tacosalpastor.jpg", price: 7, category: "Tacos" },
  { id: 3, name: "Tamales", image: "img/food/tamales.jpg", price: 5, category: "Vegetarisch" },
  { id: 4, name: "Fajitas", image: "img/food/fajitas.jpg", price: 7.5, category: "Fleisch" },
  { id: 5, name: "Chili con Carne", image: "img/food/chiliconcarne.jpg", price: 6, category: "Fleisch" },
  { id: 6, name: "Ceviche", image: "img/food/ceviche.jpg", price: 6.5, category: "Meeresfrüchte" },
];

// Warenkorb (initial leer, evtl. aus LocalStorage laden)
let cart = [];
const savedCart = localStorage.getItem("cart");
if (savedCart) {
  cart = JSON.parse(savedCart);
}

// Funktionen für den Warenkorb   

/**
Gibt den HTML-Code für einen einzelnen Warenkorb-Eintrag zurück.
 * @param {Object} item - Das Warenkorb-Item.
 * @returns {string} HTML-String für das Item.
 */

function getCartItemHTML(item) {
  return `
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
}

/**
 * Fügt ein Gericht zum Warenkorb hinzu und aktualisiert die Anzeige.
 * @param {number} id - Die ID des Gerichts.
 */

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

/**
 * Speichert den Warenkorb im LocalStorage.
 */

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Rendert den Warenkorb, indem für jedes Item die HTML-Template-Funktion verwendet wird.
 */

function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Dein Warenkorb ist leer.</p>";
    return;
  }

  cart.forEach((item) => {
    cartContainer.innerHTML += getCartItemHTML(item);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartContainer.innerHTML += `<hr><p><strong>Gesamt: ${total.toFixed(2)} €</strong></p>`;
}

/**
 * Ändert die Menge eines Artikels im Warenkorb.
 * @param {number} id - Die ID des Artikels.
 * @param {number} delta - Die Änderung der Menge (positiv oder negativ).
 */

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

/**
 * Entfernt einen Artikel aus dem Warenkorb.
 * @param {number} id - Die ID des zu entfernenden Artikels.
 */

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
  saveCart();
}

/* Funktionen für das Menü        */

/**
 * Rendert das Menü basierend auf einem Filter (Kategorie).
 * @param {string} [filter="Alle"] - Die Kategorie, nach der gefiltert werden soll.
 */

function renderMenu(filter = "Alle") {
  const menuSection = document.querySelector(".menu");
  menuSection.innerHTML = "";

  let filteredItems = filter === "Alle"
    ? [...foodItems]
    : foodItems.filter(item => item.category === filter);

  const sortSelect = document.getElementById("sort-select");
  const sortValue = sortSelect ? sortSelect.value : "";

  // Sortierlogik ausgelagert in sortItems() 

  filteredItems = sortItems(filteredItems, sortValue);

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

/**
 * Rendert die Filter-Buttons basierend auf den Kategorien.
 */

function renderFilters() {
  const categories = ["Alle", ...new Set(foodItems.map(item => item.category))];
  const container = document.getElementById("filter-buttons");
  container.innerHTML = "";

  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category;
    button.onclick = () => {
      document.querySelectorAll("#filter-buttons button").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      renderMenu(category);
    };
    container.appendChild(button);
  });

  // Setze den ersten Button standardmäßig als aktiv

  const defaultBtn = container.querySelector("button");
  if (defaultBtn) defaultBtn.classList.add("active");
}


/* Funktionen für Bestellungen    */

/**
 * Öffnet das Bestellformular, sofern der Warenkorb nicht leer ist.
 */

function handleOrder() {
  if (cart.length === 0) {
    alert("Dein Warenkorb ist leer.");
    return;
  }
  document.getElementById("order-form").classList.remove("hidden-order-form");
}

/**
 * Verarbeitet die Bestellung, zeigt das Order Success Modal an und leert den Warenkorb.
 */

function submitOrder() {
  const name = document.getElementById("customer-name").value.trim();
  const address = document.getElementById("customer-address").value.trim();
  const note = document.getElementById("customer-note").value.trim();

  if (!name || !address) {
    alert("Bitte fülle Name und Adresse aus.");
    return;
  }

  // Bestellzusammenfassung in separate Funktion ausgelagert

  const summaryHTML = getOrderSummaryHTML(name, address, note, cart);
  document.getElementById("order-summary-text").innerHTML = summaryHTML;
  document.getElementById("order-success").classList.remove("hidden");

  cart = [];
  saveCart();
  renderCart();
  document.getElementById("order-form").classList.add("hidden-order-form");
}

/**
 * Schließt das Bestellbestätigungs-Modal.
 */

function closeOrderModal() {
  document.getElementById("order-success").classList.add("hidden");
}

/* Funktionen für Toggle & Darkmode */
/**
 * Schaltet den Warenkorb-Toggle ein (insbesondere für mobile Geräte).
 */

function setupCartToggle() {
  const cartEl = document.querySelector(".cart");
  const toggleBtn = document.getElementById("cart-toggle");
  toggleBtn.onclick = () => {
    cartEl.classList.toggle("open");
  };
}

/**
 * Setzt die Darkmode-Funktionalität.
 */

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

/* Hilfsfunktionen (Refactoring)  */
/**
 * Sortiert ein Array von Items basierend auf dem angegebenen Sortierwert.
 * @param {Array} items - Die zu sortierenden Items.
 * @param {string} sortValue - Der Sortierwert ("price-asc", "price-desc", "name-asc", "name-desc").
 * @returns {Array} Die sortierten Items.
 */

function sortItems(items, sortValue) {
  switch (sortValue) {
    case "price-asc":
      return items.sort((a, b) => a.price - b.price);
    case "price-desc":
      return items.sort((a, b) => b.price - a.price);
    case "name-asc":
      return items.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return items.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return items;
  }
}

/*Funktion getOrderSummaryHTML() */
/**
 * Baut den HTML-Code für die Bestellzusammenfassung.
 * @param {string} name - Der Name des Kunden.
 * @param {string} address - Die Adresse des Kunden.
 * @param {string} note - Eine optionale Notiz.
 * @param {Array} cart - Das aktuelle Warenkorb-Array.
 * @returns {string} Der HTML-String für die Bestellzusammenfassung.
 */

function getOrderSummaryHTML(name, address, note, cart) {
  const summary = cart.map(item =>
    `${item.name} x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} €`
  ).join("<br>");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return `
    <strong>Name:</strong> ${name}<br>
    <strong>Adresse:</strong> ${address}<br><br>
    <strong>Bestellung:</strong><br>${summary}<br><br>
    <strong>Gesamt:</strong> ${total.toFixed(2)} €<br>
    <strong>Notiz:</strong> ${note || "-"}
  `;
}

/* Funktion setupSortListener() */
/**
 * Setzt den Eventlistener für das Sortier-Dropdown.
 */

function setupSortListener() {
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.onchange = () => {
      const activeFilterBtn = document.querySelector("#filter-buttons button.active");
      const activeCategory = activeFilterBtn ? activeFilterBtn.textContent : "Alle";
      renderMenu(activeCategory);
    };
  }
}

// Initialisierung

// Init-Funktion: Wird beim Laden der Seite aufgerufen und initialisiert alle Funktionen.

function initApp() {
  renderFilters();
  renderMenu();
  renderCart();

  const submitBtn = document.getElementById("submit-order");
  if (submitBtn) submitBtn.onclick = submitOrder;

  const orderBtn = document.getElementById("order-button");
  if (orderBtn) orderBtn.onclick = handleOrder;

  // Verwendet die neue Hilfsfunktion für den Sortier-Listener
  setupSortListener();

  // Setzt Toggle-Funktion für den Warenkorb
  setupCartToggle();
  
  // Setzt Darkmode-Funktionalität
  setupDarkmode();
}

// Exponiert Funktionen, die in HTML inline verwendet werden
window.closeOrderModal = closeOrderModal;
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
