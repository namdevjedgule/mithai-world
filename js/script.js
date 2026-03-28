document.addEventListener("DOMContentLoaded", function () {

  function loadHTML(id, file, callback) {
    fetch(file)
      .then(response => response.text())
      .then(data => {
        document.getElementById(id).innerHTML = data;
        if (callback) callback();
      })
      .catch(err => console.log(err));
  }

  loadHTML("cart", "cart.html");

  loadHTML("navbar", "navbar.html", function () {

    updateCartCount();

    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("navLinks");

    if (hamburger && navLinks) {
      hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("active");
      });
    }

    document.querySelectorAll("#navLinks a").forEach(link => {
      link.addEventListener("click", () => {
        if (navLinks) navLinks.classList.remove("active");
        if (hamburger) hamburger.classList.remove("active");
      });
    });

    const pageName = document.getElementById("pageName");
    if (pageName) {
      pageName.innerText = document.title;
    }

    document.querySelectorAll('a[href^="index.html#"]').forEach(anchor => {

      anchor.addEventListener("click", function (e) {

        if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {

          const targetId = this.getAttribute("href").split("#")[1];
          const target = document.getElementById(targetId);

          if (!target) return;

          e.preventDefault();

          const nav = document.querySelector("nav");
          const navbarHeight = nav ? nav.offsetHeight : 0;

          window.scrollTo({
            top: target.offsetTop - navbarHeight,
            behavior: "smooth"
          });

          history.pushState(null, null, "#" + targetId);
        }
      });
    });

  });

  loadHTML("footer", "footer.html");

  const track = document.getElementById("sliderTrack");

  if (track) {

    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    let index = 1;

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    firstClone.id = "first-clone";
    lastClone.id = "last-clone";

    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    const allSlides = document.querySelectorAll(".slide");

    track.style.transform = `translateX(-100%)`;

    function updateDots() {

      dots.forEach(dot => dot.classList.remove("active"));

      let dotIndex = index - 1;

      if (dotIndex >= dots.length) dotIndex = 0;
      if (dotIndex < 0) dotIndex = dots.length - 1;

      dots[dotIndex].classList.add("active");

    }

    function nextSlide() {
      index++;
      track.style.transition = "0.7s ease-in-out";
      track.style.transform = `translateX(-${index * 100}%)`;
      updateDots();
    }

    function prevSlide() {
      index--;
      track.style.transition = "0.7s ease-in-out";
      track.style.transform = `translateX(-${index * 100}%)`;
      updateDots();
    }

    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);

    track.addEventListener("transitionend", () => {

      if (allSlides[index].id === "first-clone") {
        track.style.transition = "none";
        index = 1;
        track.style.transform = `translateX(-${index * 100}%)`;
      }

      if (allSlides[index].id === "last-clone") {
        track.style.transition = "none";
        index = slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
      }

    });

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        index = i + 1;
        track.style.transition = "0.7s";
        track.style.transform = `translateX(-${index * 100}%)`;
        updateDots();
      });
    });

    setInterval(nextSlide, 5000);

    let startX = 0;

    track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", (e) => {
      let endX = e.changedTouches[0].clientX;

      if (startX - endX > 50) nextSlide();
      if (endX - startX > 50) prevSlide();
    });
  }

  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-links a");

  if (sections.length && navItems.length) {

    window.addEventListener("scroll", () => {

      let current = "";

      sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
          current = section.getAttribute("id");
        }

      });

      navItems.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }

      });

    });

  }

  const sellersTrack = document.querySelector(".sellers-track");

  if (sellersTrack) {

    const nextSellers = document.querySelector(".next-sellers");
    const prevSellers = document.querySelector(".prev-sellers");

    let sellersIndex = 0;

    let isDesktop = window.innerWidth > 576;

    if (isDesktop) {

      const slides = document.querySelectorAll(".sellers-slide");

      const firstClone = slides[0].cloneNode(true);
      const lastClone = slides[slides.length - 1].cloneNode(true);

      firstClone.id = "firstClone";
      lastClone.id = "lastClone";

      sellersTrack.appendChild(firstClone);
      sellersTrack.insertBefore(lastClone, sellersTrack.firstChild);

      sellersIndex = 1;

      sellersTrack.style.transform = `translateX(-100%)`;
    }

    function getItems() {
      return window.innerWidth <= 576
        ? document.querySelectorAll(".product-card")
        : document.querySelectorAll(".sellers-track .sellers-slide");
    }

    function updateSellers() {

      if (window.innerWidth <= 576) {
        const cardWidth = document.querySelector(".product-card").offsetWidth + 20;
        sellersTrack.style.transform =
          `translateX(-${sellersIndex * cardWidth}px)`;

      } else {
        sellersTrack.style.transition = "0.6s ease";
        sellersTrack.style.transform =
          `translateX(-${sellersIndex * 100}%)`;
      }
    }

    nextSellers.addEventListener("click", () => {

      let items = getItems();

      if (window.innerWidth <= 576) {
        sellersIndex = (sellersIndex + 1) % items.length;
      } else {
        sellersIndex++;
      }

      updateSellers();
    });

    prevSellers.addEventListener("click", () => {

      let items = getItems();

      if (window.innerWidth <= 576) {
        sellersIndex = (sellersIndex - 1 + items.length) % items.length;
      } else {
        sellersIndex--;
      }

      updateSellers();
    });

    sellersTrack.addEventListener("transitionend", () => {

      if (window.innerWidth <= 576) return;

      const slides = document.querySelectorAll(".sellers-track .sellers-slide");

      if (slides[sellersIndex].id === "firstClone") {
        sellersTrack.style.transition = "none";
        sellersIndex = 1;
        sellersTrack.style.transform = `translateX(-100%)`;
      }

      if (slides[sellersIndex].id === "lastClone") {
        sellersTrack.style.transition = "none";
        sellersIndex = slides.length - 2;
        sellersTrack.style.transform =
          `translateX(-${sellersIndex * 100}%)`;
      }

    });

  }

  document.querySelectorAll(".qty-select").forEach(select => {

    select.addEventListener("change", function () {

      const card = this.closest(".product-card");

      const newPriceEl = card.querySelector(".new");
      const oldPriceEl = card.querySelector(".old");

      let basePrice = parseFloat(newPriceEl.dataset.new);
      let qty = parseFloat(this.value);

      let newPrice = basePrice * qty;
      let oldPrice = (basePrice * 1.1) * qty;

      newPriceEl.innerText = "₹" + Math.round(newPrice);
      oldPriceEl.innerText = "₹" + Math.round(oldPrice);
    });

  });

  const testimonialTrack = document.querySelector(".testimonial-track");

  if (testimonialTrack) {

    const cards = document.querySelectorAll(".testimonial-card");
    const slider = document.querySelector(".testimonial-slider");
    const dotsContainer = document.querySelector(".dots");

    let index = 0;
    let interval;

    function getCardsPerSlide() {
      if (window.innerWidth <= 576) return 1;
      if (window.innerWidth <= 992) return 2;
      return 3;
    }

    let cardsPerSlide = getCardsPerSlide();
    let totalSlides = Math.ceil(cards.length / cardsPerSlide);

    function cloneFirstSlide() {
      const firstGroup = Array.from(cards).slice(0, cardsPerSlide);

      firstGroup.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add("clone");
        testimonialTrack.appendChild(clone);
      });
    }

    cloneFirstSlide();

    function createDots() {
      dotsContainer.innerHTML = "";

      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("span");

        if (i === 0) dot.classList.add("active");

        dot.addEventListener("click", () => {
          index = i;
          moveSlide();
          resetAutoSlide();
        });

        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      const dots = document.querySelectorAll(".dots span");

      dots.forEach(dot => dot.classList.remove("active"));

      if (dots[index % totalSlides]) {
        dots[index % totalSlides].classList.add("active");
      }
    }

    function moveSlide() {

      const slideWidth = slider.offsetWidth;

      testimonialTrack.style.transition = "transform 0.6s ease";
      testimonialTrack.style.transform =
        `translateX(-${index * slideWidth}px)`;

      updateDots();
    }

    function autoSlide() {
      index++;
      moveSlide();
    }

    function startAutoSlide() {
      interval = setInterval(autoSlide, 4000);
    }

    function resetAutoSlide() {
      clearInterval(interval);
      startAutoSlide();
    }

    testimonialTrack.addEventListener("transitionend", () => {

      if (index >= totalSlides) {

        testimonialTrack.style.transition = "none";
        index = 0;

        testimonialTrack.style.transform = `translateX(0px)`;
      }

    });

    window.addEventListener("resize", () => {

      cardsPerSlide = getCardsPerSlide();
      totalSlides = Math.ceil(cards.length / cardsPerSlide);

      testimonialTrack.innerHTML = "";
      cards.forEach(card => testimonialTrack.appendChild(card));

      cloneFirstSlide();

      index = 0;

      createDots();
      moveSlide();
    });

    createDots();
    startAutoSlide();
  }

  function revealOnScroll() {

    const elements = document.querySelectorAll(".slide-left, .slide-right");

    elements.forEach(el => {

      const elementTop = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        el.classList.add("show");
      }

    });
  }

  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", revealOnScroll);

});

let cart;
try {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
} catch (e) {
  cart = [];
  localStorage.removeItem("cart");
}

let currentProduct = "";
let currentPrice = 0;
let currentUnit = "";

function showAlert(message, type = "success") {

  let alertBox = document.getElementById("customAlert");
  if (!alertBox) return;

  alertBox.innerText = message;
  alertBox.className = `custom-alert show ${type}`;

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 2500);
}

function updateCartCount() {
  let countEl = document.getElementById("cartCount");
  let cartIcon = document.querySelector(".cart-icon");

  if (countEl) countEl.innerText = cart.length;

  if (cartIcon) {
    cartIcon.classList.add("bounce");
    setTimeout(() => cartIcon.classList.remove("bounce"), 300);
  }
}

function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}


function renderCart() {
  let container = document.getElementById("cartContainer");
  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<div class="empty">Your cart is empty 🛒</div>`;
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.quantity;
    total += itemTotal;

    let displayQty =
      item.unit === "KG"
        ? item.quantity + " kg"
        : item.quantity + " PCS";

    container.innerHTML += `
      <div class="cart-card">
        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>₹${item.price}/${item.unit}</p>

          <div class="qty-controls">
            <button onclick="decreaseQty(${index})">-</button>
            <span>${displayQty}</span>
            <button onclick="increaseQty(${index})">+</button>
          </div>
        </div>

        <div class="cart-actions">
          <p><b>₹${itemTotal}</b></p>
          <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  container.innerHTML += `
    <div class="summary">
      <h3>Total: ₹${total}</h3>
      <button class="checkout-btn" onclick="checkout()">Order on WhatsApp</button>
      <button class="reset-btn" onclick="reset()">reset</button>
    </div>
  `;
}

function increaseQty(index) {

  if (cart[index].unit === "KG") {
    cart[index].quantity += 0.25;
    cart[index].quantity = parseFloat(cart[index].quantity.toFixed(2));
  } else {
    cart[index].quantity += 1;
  }
  updateCart();
}

function decreaseQty(index) {

  if (cart[index].unit === "KG") {

    if (cart[index].quantity > 0.25) {
      cart[index].quantity -= 0.25;
      cart[index].quantity = parseFloat(cart[index].quantity.toFixed(2));
    } else {
      cart.splice(index, 1);
    }

  } else {

    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }

  }

  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function checkout() {

  if (cart.length === 0) {
    showAlert("Cart is empty!", "error");
    return;
  }

  let grandTotal = 0;

  let message = "🛍 *Mithai World Order*\n";
  message += "━━━━━━━━━━━━━━━\n\n";

  cart.forEach((item, index) => {

    let total = item.price * item.quantity;
    grandTotal += total;

    let displayQty;

    if (item.unit === "KG") {
      if (item.quantity === 0.1) displayQty = "100 gm";
      else if (item.quantity === 0.25) displayQty = "250 gm";
      else if (item.quantity === 0.5) displayQty = "500 gm";
      else if (item.quantity === 1) displayQty = "1 kg";
      else displayQty = item.quantity + " kg";
    } else {
      displayQty = item.quantity + " PCS";
    }

    message += `*${index + 1}. ${item.name}*\n`;
    message += `   Price: ₹${item.price} / ${item.unit}\n`;
    message += `   Quantity: ${displayQty}\n`;
    message += `   Item Total: ₹${total}\n\n`;
  });

  message += "━━━━━━━━━━━━━━━\n";
  message += `*Total Bill: ₹${grandTotal}*\n\n`;
  message += "📍 Please confirm my order.\n";
  message += "🙏 Thank you!";

  const PHONE = "919858106106";
  let url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");

  cart = [];
  localStorage.removeItem("cart");
  updateCart();
}

function reset() {
  if (cart.length === 0) {
    showAlert("Cart is already empty!", "error");
    return;
  }

  let confirmClear = confirm("Are you sure you want to clear the cart?");

  if (!confirmClear) return;

  cart = [];
  localStorage.removeItem("cart");

  updateCart(); 

  showAlert("Cart cleared 🗑️", "success");
}

function addItemToCart(name, price, unit, quantity) {

  let existing = cart.find(item => item.name === name && item.unit === unit);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ name, price, unit, quantity });
  }

  updateCart();
  showAlert("Added to cart ✅", "success");
}

function addToCartUnified(button, name, price, unit) {

  let card = button.closest(".product-card");
  let select = card.querySelector(".qty-select");

  if (select) {
    let quantity = parseFloat(select.value);
    addItemToCart(name, price, unit, quantity);

  } else {
    currentProduct = name;
    currentPrice = price;
    currentUnit = unit;

    openQtyModal(name, unit);
  }
}

function openQtyModal(name, unit) {
  currentProduct = name;
  currentUnit = unit;

  document.getElementById("qtyModal").style.display = "flex";
  document.getElementById("productName").innerText = name;

  let kgOptions = document.getElementById("kgOptions");
  let qtyInput = document.getElementById("qtyInput");

  if (unit === "KG") {
    kgOptions.style.display = "block";
    qtyInput.style.display = "none";
  } else {
    kgOptions.style.display = "none";
    qtyInput.style.display = "block";
  }
}

function confirmQty() {
  let quantity =
    currentUnit === "KG"
      ? parseFloat(document.getElementById("kgOptions").value)
      : parseFloat(document.getElementById("qtyInput").value);

  if (!quantity || quantity <= 0) {
    showAlert("Enter valid quantity!", "error");
    return;
  }

  addItemToCart(currentProduct, currentPrice, currentUnit, quantity);
  closeQtyModal();
}

function closeQtyModal() {
  document.getElementById("qtyModal").style.display = "none";
}

window.onload = function () {
  cart = JSON.parse(localStorage.getItem("cart")) || [];

  updateCartCount();
  renderCart();
};

function goToFestival(name) {
  let phone = "919858106106";

  let msg = `Hello Mithai World! 🎉
I am interested in your ${name}.
Please share details and offers.`;

  let url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}
