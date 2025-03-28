const foodItems = [
  { id: 1, name: "Quesadilla", image: "img/food/quesadilla.jpg", price: 6.5 },
  { id: 2, name: "Tacos al Pastor", image: "img/food/tacosalpastor.jpg", price: 7 },
  { id: 3, name: "Tamales", image: "img/food/tamales.jpg", price: 5 },
  { id: 4, name: "Fajitas", image: "img/food/fajitas.jpg", price: 7.5 },
  { id: 5, name: "Chili con Carne", image: "img/food/chiliconcarne.jpg", price: 6 },
  { id: 6, name: "Ceviche", image: "img/food/ceviche.jpg", price: 6.5 },
];

let cart = [];
const savedCart = localStorage.getItem("cart");
if (savedCart) {
  cart = JSON.parse(savedCart);
}

function addToCart(id) {
  const item = foodItems.find((food) => food.id === id);
  const cartItem = cart.find((i) => i.id === id);

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

  cart.forEach((item) => {
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

function renderMenu() {
  const menuSection = document.querySelector(".menu");
  menuSection.innerHTML = "";
  foodItems.forEach((item) => {
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

function initApp() {
  renderMenu();
  renderCart();

  const orderBtn = document.getElementById("order-button");
  if (orderBtn) {
    orderBtn.onclick = handleOrder;
  }
}

function handleOrder() {
  if (cart.length === 0) {
    alert("Dein Warenkorb ist leer.");
    return;
  }

  const summary = cart.map(item => {
    return `${item.name} x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)} €`;
  }).join("\n");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const confirmText = `Deine Bestellung:\n\n${summary}\n\nGesamt: ${total.toFixed(2)} €\n\nJetzt wirklich bestellen?`;

  if (confirm(confirmText)) {
    alert("Vielen Dank für deine Bestellung!");
    cart = [];
    saveCart();
    renderCart();
  }
}

window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
