const foodItems = [
  { id: 1, name: "Quesadilla", image: "img/food/quesadilla.jpg", price: 6.5, category: "Vegetarisch" },
  { id: 2, name: "Tacos al Pastor", image: "img/food/tacosalpastor.jpg", price: 7, category: "Tacos" },
  { id: 3, name: "Tamales", image: "img/food/tamales.jpg", price: 5, category: "Vegetarisch" },
  { id: 4, name: "Fajitas", image: "img/food/fajitas.jpg", price: 7.5, category: "Fleisch" },
  { id: 5, name: "Chili con Carne", image: "img/food/chiliconcarne.jpg", price: 6, category: "Fleisch" },
  { id: 6, name: "Ceviche", image: "img/food/ceviche.jpg", price: 6.5, category: "Meeresfrüchte" },
];

let cart = [];
const savedCart = localStorage.getItem("cart");
if (savedCart) {
  cart = JSON.parse(savedCart);
}

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

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Dein Warenkorb ist leer.</p>";
    return;
  }

  cart.forEach(item => {
    cartContainer.innerHTML += `
      <div class="cart-item">
        <span>${item.name}</span>
        <span>
          <button onclick="changeQuantity(${item.id}, -1)">➖</button>
          ${item.quantity}
          <button onclick="changeQuantity(${item.id}, 1)">➕</button>
          <button onclick="removeFromCart(${item.id})">🗑</button>
        </span>
        <span>${(item.price * item.quantity).toFixed(2)} €</span>
      </div>
    `;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartContainer.innerHTML += `<hr><p><strong>Gesamt: ${total.toFixed(2)} €</strong></p>`;
}

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

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
  saveCart();
}

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

  filteredItems.forEach(item => {
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

  const defaultBtn = container.querySelector("button");
  if (defaultBtn) {
    defaultBtn.classList.add("active");
  }
}

function submitOrder() {
  const name = document.getElementById("customer-name").value.trim();
  const address = document.getElementById("customer-address").value.trim();
  const note = document.getElementById("customer-note").value.trim();

  if (!name || !address) {
    alert("Bitte fülle Name und Adresse aus.");
    return;
  }

  const summary = cart.map(item => {
    return `${item.name} x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} €`;
  }).join("\n");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const message = `Bestellung von ${name}\nAdresse: ${address}\n\n${summary}\n\nGesamt: ${total.toFixed(2)} €\n\nNotiz: ${note || "-"}`;

  alert("Vielen Dank für deine Bestellung!\n\n" + message);

  cart = [];
  saveCart();
  renderCart();
  document.getElementById("order-form").style.display = "none";
}

function handleOrder() {
  if (cart.length === 0) {
    alert("Dein Warenkorb ist leer.");
    return;
  }

  document.getElementById("order-form").style.display = "flex";
}

function setupCartToggle() {
  const cart = document.querySelector(".cart");
  const toggleBtn = document.getElementById("cart-toggle");

  toggleBtn.onclick = function () {
    cart.classList.toggle("open");
  };
}

function setupDarkmode() {
  const toggleBtn = document.getElementById("darkmode-toggle");
  const savedMode = localStorage.getItem("darkmode");

  if (savedMode === "on") {
    document.body.classList.add("darkmode");
  }

  toggleBtn.onclick = function () {
    document.body.classList.toggle("darkmode");
    const isDark = document.body.classList.contains("darkmode");
    localStorage.setItem("darkmode", isDark ? "on" : "off");
  };
}

function initApp() {
  renderFilters();
  renderMenu();
  renderCart();

  const orderBtn = document.getElementById("order-button");
  if (orderBtn) {
    orderBtn.onclick = handleOrder;
  }

  const submitBtn = document.getElementById("submit-order");
  if (submitBtn) {
    submitBtn.onclick = submitOrder;
  }

  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.onchange = function () {
      const activeFilterBtn = document.querySelector("#filter-buttons button.active");
      const activeCategory = activeFilterBtn ? activeFilterBtn.textContent : "Alle";
      renderMenu(activeCategory);
    };
  }

  setupDarkmode();
  setupCartToggle();
}

window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
