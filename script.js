// Initialize cart
window.cart = [];

function loadCart() {
  const saved = localStorage.getItem('cart');
  if (saved) window.cart = JSON.parse(saved);
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(window.cart));
}

window.addToCart = function (name, price) {
  const existing = window.cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    window.cart.push({ name, price, quantity: 1 });
  }
  saveCart();
  updateCartDisplay();
};

window.removeFromCart = function (index) {
  window.cart.splice(index, 1);
  saveCart();
  updateCartDisplay();
};

function updateCartDisplay() {
  const countElem = document.getElementById('cart-count');
  const itemsContainer = document.getElementById('cart-items');
  const totalElem = document.getElementById('cart-total');

  const totalQuantity = window.cart.reduce((sum, i) => sum + i.quantity, 0);
  if (countElem) countElem.innerText = totalQuantity;

  if (itemsContainer) itemsContainer.innerHTML = '';
  let totalPrice = 0;

  if (window.cart.length === 0 && itemsContainer) {
    itemsContainer.innerHTML = '<p>Your cart is empty.</p>';
  }

  window.cart.forEach((item, index) => {
    totalPrice += item.price * item.quantity;
    if (itemsContainer) {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)} <button onclick="removeFromCart(${index})">❌</button>`;
      itemsContainer.appendChild(div);
    }
  });

  if (totalElem) totalElem.innerText = `Total: ₹${totalPrice.toFixed(2)}`;
}

function clearCart() {
  window.cart.length = 0;
  saveCart();
}

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  updateCartDisplay();

  const checkoutForm = document.getElementById('checkout-form');

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', e => {
      e.preventDefault();

      // Build cart summary
      const cartSummary = window.cart.map(item =>
        `${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');

      // Inject into hidden textarea
      const cartTextarea = document.getElementById('cart-summary');
      if (cartTextarea) cartTextarea.value = cartSummary;

      // Create form data & send to Google Form
      const formData = new FormData(checkoutForm);
      fetch('https://docs.google.com/forms/d/e/1FAIpQLSei9Yc9xZJ4hKW8e8ZDeRHmEt9/formResponse', {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      }).then(() => {
        alert('Your order has been submitted successfully!');
        checkoutForm.reset();
        clearCart();
        updateCartDisplay();
      }).catch(() => {
        alert('⚠️ Something went wrong. Please try again.');
      });
    });
  }

  // Gallery Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  document.querySelectorAll('.gallery-grid img').forEach(img => {
    img.addEventListener('click', () => {
      lightbox.style.display = 'flex';
      lightboxImg.src = img.src;
    });
  });
  lightbox.addEventListener('click', () => lightbox.style.display = 'none');

  // Testimonials
  const testimonials = document.querySelectorAll('.testimonial');
  let currentTestimonial = 0;
  function showTestimonial(idx) {
    testimonials.forEach((t, i) => t.classList.toggle('active', i === idx));
  }
  showTestimonial(currentTestimonial);
  setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
  }, 5000);

  // Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Thank you! We will get back to you soon.');
      contactForm.reset();
    });
  }
});
