const foodItems = [
    { id: 1, name: "Quesadilla", image: "img/food/quesadilla.jpg", price: 6.5 },
    { id: 2, name: "Tacos al Pastor", image: "img/food/tacosalpastor.jpg", price: 7 },
    { id: 3, name: "Tamales", image: "img/food/tamales.jpg", price: 5 },
    { id: 4, name: "Fajitas", image: "img/food/fajitas.jpg", price: 7.5 },
    { id: 5, name: "Chili con Carne", image: "img/food/chiliconcarne.jpg", price: 6 },
    { id: 6, name: "Ceviche", image: "img/food/ceviche.jpg", price: 6.5 },
  ];
  
  let cart = [];
  
  function addToCart(id) {
    const item = foodItems.find((food) => food.id === id);
    const cartItem = cart.find((i) => i.id === id);
  
    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
  
    renderCart();
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
        <p>${item.name} x ${item.quantity} — ${(item.price * item.quantity).toFixed(2)} €</p>
      `;
    });
  
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartContainer.innerHTML += `<hr><p><strong>Gesamt: ${total.toFixed(2)} €</strong></p>`;
  }
  
  
  function renderMenu() {
    const menuSection = document.querySelector(".menu");
    menuSection.innerHTML = ""; // alte Inhalte löschen
  
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
  
  document.addEventListener("DOMContentLoaded", renderMenu);
  