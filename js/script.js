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

      let baseNew = parseFloat(newPriceEl.dataset.new);
      let baseOld = parseFloat(oldPriceEl.dataset.old);

      let quantity = this.value;

      let newPrice = baseNew;
      let oldPrice = baseOld;

      if (quantity == 500) {
        newPrice = baseNew * 1.25;
        oldPrice = baseOld * 1.25;
      }

      if (quantity == 1000) {
        newPrice = baseNew * 2.5;
        oldPrice = baseOld * 2.5;
      }

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

function showAlert(message, type = "success") {

  let alertBox = document.getElementById("customAlert");

  alertBox.innerText = message;
  alertBox.className = `custom-alert show ${type}`;

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 2500);
}

let selectedProduct = {};

function openQtyModal(name, price, unit) {
  selectedProduct = { name, price, unit };

  document.getElementById("productName").innerText = `Enter Quantity (${unit})`;
  document.getElementById("qtyInput").value = "";

  document.getElementById("qtyModal").style.display = "flex";
}

function closeQtyModal() {
  document.getElementById("qtyModal").style.display = "none";
}

function confirmQty() {
  let quantity = document.getElementById("qtyInput").value;

  if (!quantity || isNaN(quantity) || quantity <= 0) {
    showAlert("Enter valid quantity!", "error");
    return;
  }

  quantity = parseFloat(quantity);

  let existing = cart.find(item => item.name === selectedProduct.name);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      name: selectedProduct.name,
      price: selectedProduct.price,
      unit: selectedProduct.unit,
      quantity
    });
  }

  updateCart();

  showAlert("Added to cart ✅", "success");

  closeQtyModal();
}

function updateCartCount() {
  let countEl = document.getElementById("cartCount");

  if (countEl) {
    countEl.innerText = cart.length;
  }
}

function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

updateCartCount();

function openCart() {

  let cartBox = document.getElementById("cartBox");
  if (!cartBox) return;

  cartBox.style.display = "block";

  let cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  let grandTotal = 0;

  cart.forEach((item, index) => {

    let total = item.price * item.quantity;
    grandTotal += total;

    cartItems.innerHTML += `
      <div class="cart-item">
        <b>${item.name}</b><br>
        ₹${item.price}/${item.unit}

        <div class="qty-controls">
          <button onclick="decreaseQty(${index})">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQty(${index})">+</button>
        </div>

        <p>Total: ₹${total}</p>

        <button class="remove-btn" onclick="removeItem(${index})">
          Remove ❌
        </button>

        <hr>
      </div>
    `;
  });

  cartItems.innerHTML += `<h3>Total Bill: ₹${grandTotal}</h3>`;
}

function increaseQty(index) {
  cart[index].quantity += 1;
  updateCart();
  openCart();
}

function decreaseQty(index) {

  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }

  updateCart();
  openCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
  openCart();
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

    message += `*${index + 1}. ${item.name}*\n`;
    message += `   Price: ₹${item.price} / ${item.unit}\n`;
    message += `   Quantity: ${item.quantity} ${item.unit}\n`;
    message += `   Item Total: ₹${total}\n\n`;
  });

  message += "━━━━━━━━━━━━━━━\n";
  message += `*Total Bill: ₹${grandTotal}*\n\n`;
  message += "📍 Please confirm my order.\n🙏 Thank you!";

  let url = `https://wa.me/919858106106?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");

  cart = [];
  localStorage.removeItem("cart");
  updateCartCount();
}

function closeCart() {
  let cartBox = document.getElementById("cartBox");
  if (cartBox) cartBox.style.display = "none";
}

function resetCart() {

  showAlert("Cart cleared 🗑", "success");

  cart = [];
  localStorage.removeItem("cart");

  updateCartCount();

  let cartItems = document.getElementById("cartItems");
  if (cartItems) {
    cartItems.innerHTML = "<p>Cart is empty</p>";
  }
}

function orderTopSeller(button) {

  const card = button.closest(".product-card");

  const productName = card.querySelector("h3").innerText;

  const priceText = card.querySelector(".new").innerText;
  const quantitySelect = card.querySelector(".qty-select");

  const quantity = quantitySelect.options[quantitySelect.selectedIndex].text;

  let phoneNumber = "919858106106";

  let message = `Hello Mithai World! 👋
I want to order:

🍽 Product: ${productName}
⚖ Quantity: ${quantity}
💰 Price: ${priceText}

Please confirm my order.`;

  let url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
}

function goToFestival(name) {
  let phone = "919858106106";

  let msg = `Hello Mithai World! 🎉
I am interested in your ${name}.
Please share details and offers.`;

  let url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}