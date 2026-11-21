
// ========================================
// Bella Italia - Restaurant Menu & Cart
// ========================================

// IMPORTANT:
// Replace this number with your restaurant's WhatsApp number.
// Include country code without + or spaces.
// Example UAE: 971501234567

const WHATSAPP_NUMBER = "971501234567";

// ========================================
// Products
// ========================================

const products = [
  // Pizza
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizza",
    description: "Fresh mozzarella, tomato sauce, basil and olive oil.",
    price: 35,
    image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    category: "Pizza",
    description: "Classic tomato sauce, mozzarella and spicy pepperoni.",
    price: 42,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Vegetarian Pizza",
    category: "Pizza",
    description: "Fresh mushrooms, peppers, olives, onions and mozzarella.",
    price: 39,
    image: "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Four Cheese Pizza",
    category: "Pizza",
    description: "A delicious combination of four Italian cheeses.",
    price: 45,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80"
  },

  // Pasta
  {
    id: 5,
    name: "Spaghetti Bolognese",
    category: "Pasta",
    description: "Spaghetti with rich traditional tomato and meat sauce.",
    price: 38,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Fettuccine Alfredo",
    category: "Pasta",
    description: "Creamy Alfredo sauce with parmesan cheese.",
    price: 40,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Penne Arrabbiata",
    category: "Pasta",
    description: "Penne pasta with spicy tomato, garlic and fresh herbs.",
    price: 34,
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Creamy Mushroom Pasta",
    category: "Pasta",
    description: "Pasta with fresh mushrooms and creamy parmesan sauce.",
    price: 42,
    image: "https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?auto=format&fit=crop&w=800&q=80"
  }
];

// ========================================
// Cart Storage
// ========================================

let cart = [];

try {
  cart = JSON.parse(localStorage.getItem("bellaItaliaCart")) || [];
  if (!Array.isArray(cart)) cart = [];
} catch {
  cart = [];
}

// ========================================
// Helpers
// ========================================

function formatPrice(price) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2
  }).format(price);
}

function saveCart() {
  localStorage.setItem("bellaItaliaCart", JSON.stringify(cart));
}

function getProduct(productId) {
  return products.find(product => product.id === Number(productId));
}

// ========================================
// Render Products
// ========================================

function renderProducts(category, elementId) {
  const container = document.getElementById(elementId);

  if (!container) return;

  const categoryProducts = products.filter(
    product => product.category === category
  );

  container.innerHTML = categoryProducts.map(product => `
    <div class="col-md-6 col-lg-3">
      <article class="food-card">
        <div class="food-image">
          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          >
        </div>

        <div class="food-content">
          <h3>${product.name}</h3>
          <p>${product.description}</p>

          <div class="food-bottom">
            <span class="food-price">
              ${formatPrice(product.price)}
            </span>

            <button
              class="add-btn"
              type="button"
              data-action="add"
              data-id="${product.id}"
            >
              <i class="bi bi-plus-lg"></i> Add
            </button>
          </div>
        </div>
      </article>
    </div>
  `).join("");
}

// ========================================
// Add Product to Cart
// ========================================

function addToCart(productId) {
  const product = getProduct(productId);

  if (!product) return;

  const existingItem = cart.find(
    item => item.id === product.id
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      quantity: 1
    });
  }

  updateCart();
}

// ========================================
// Update Quantity
// ========================================

function updateQuantity(productId, change) {
  const item = cart.find(
    item => item.id === Number(productId)
  );

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  updateCart();
}

// ========================================
// Remove Product
// ========================================

function removeFromCart(productId) {
  cart = cart.filter(
    item => item.id !== Number(productId)
  );

  updateCart();
}

// ========================================
// Calculate Total
// ========================================

function calculateTotal() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.id);

    if (!product) return total;

    return total + product.price * item.quantity;
  }, 0);
}

// ========================================
// Render Cart
// ========================================

function renderCart() {
  const cartContainer = document.getElementById("cartItems");

  if (!cartContainer) return;

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart text-center">
        <i class="bi bi-basket"></i>
        <p>Your cart is empty.</p>
      </div>
    `;

    return;
  }

  cartContainer.innerHTML = cart.map(item => {
    const product = getProduct(item.id);

    if (!product) return "";

    return `
      <div class="cart-item">

        <img src="${product.image}" alt="${product.name}">

        <div class="cart-item-info">
          <h6>${product.name}</h6>

          <div class="cart-item-price">
            ${formatPrice(product.price * item.quantity)}
          </div>

          <div class="quantity-controls">

            <button
              type="button"
              data-action="decrease"
              data-id="${product.id}"
              aria-label="Decrease quantity"
            >−</button>

            <span>${item.quantity}</span>

            <button
              type="button"
              data-action="increase"
              data-id="${product.id}"
              aria-label="Increase quantity"
            >+</button>

            <button
              type="button"
              class="remove-btn"
              data-action="remove"
              data-id="${product.id}"
              aria-label="Remove ${product.name}"
            >
              <i class="bi bi-trash"></i>
            </button>

          </div>
        </div>

      </div>
    `;
  }).join("");
}

// ========================================
// Update Cart UI
// ========================================

function updateCart() {
  // Remove products that no longer exist
  cart = cart.filter(item => getProduct(item.id));

  renderCart();

  const total = calculateTotal();

  const count = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTotal").textContent = formatPrice(total);

  document.getElementById("checkoutButton").disabled =
    cart.length === 0;

  saveCart();
}

// ========================================
// Cart Button Events
// ========================================

document.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");

  if (!button) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);

  if (action === "add") {
    addToCart(id);
  }

  if (action === "increase") {
    updateQuantity(id, 1);
  }

  if (action === "decrease") {
    updateQuantity(id, -1);
  }

  if (action === "remove") {
    removeFromCart(id);
  }
});

// ========================================
// WhatsApp Checkout
// ========================================

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  if (!/^\d{8,15}$/.test(WHATSAPP_NUMBER)) {
    alert("Please configure the restaurant WhatsApp number in script.js.");
    return;
  }

  let message = `Hello Bella Italia! 🍕\n`;
  message += `I would like to place an order:\n\n`;

  cart.forEach((item, index) => {
    const product = getProduct(item.id);

    if (!product) return;

    const itemTotal = product.price * item.quantity;

    message += `${index + 1}. ${product.name}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Price: ${formatPrice(itemTotal)}\n\n`;
  });

  message += `--------------------------\n`;
  message += `Total: ${formatPrice(calculateTotal())}\n\n`;
  message += `Thank you!`;

  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank", "noopener,noreferrer");
}

document.getElementById("checkoutButton")
  ?.addEventListener("click", checkoutWhatsApp);

// ========================================
// Initialize Website
// ========================================

renderProducts("Pizza", "pizzaProducts");
renderProducts("Pasta", "pastaProducts");
updateCart();
