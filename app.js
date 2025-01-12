// Fetch products from JSON and display them
fetch('products.json')
  .then(response => response.json())
  .then(products => displayProducts(products))
  .catch(error => console.error('Error fetching products:', error));

let cart = [];

// Display products
function displayProducts(products) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = products.map(product => `
    <div class="product">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>Price: $${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    </div>
  `).join('');
}

// Add product to cart
function addToCart(productId) {
  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      const product = products.find(item => item.id === productId);
      const existingItem = cart.find(item => item.id === productId);

      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      updateCartUI();
    });
}

// Update cart UI
function updateCartUI() {
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const totalPrice = document.getElementById('total-price');

  cartCount.textContent = cart.reduce((count, item) => count + item.quantity, 0);
  totalPrice.textContent = cart.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2);

  cartItems.innerHTML = cart.map(item => `
    <li>
      <span>${item.name} (x${item.quantity})</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
      <button onclick="changeQuantity(${item.id}, 1)">+</button>
      <button onclick="changeQuantity(${item.id}, -1)">-</button>
    </li>
  `).join('');
}

// Change quantity
function changeQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);

  if (item) {
    item.quantity += change;

    if (item.quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
    }

    updateCartUI();
  }
}

// Clear cart
document.getElementById('clear-cart').addEventListener('click', () => {
  cart = [];
  updateCartUI();
});
