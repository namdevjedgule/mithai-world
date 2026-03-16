const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  hamburger.classList.toggle("active");
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

  anchor.addEventListener("click", function (e) {

    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);

    if (!target) return;

    e.preventDefault();

    const navbarHeight = document.querySelector("nav").offsetHeight;

    window.scrollTo({
      top: target.offsetTop - navbarHeight,
      behavior: "smooth"
    });

    history.pushState(null, null, targetId);

    navLinks.classList.remove("active");

  });

});

const track = document.getElementById("sliderTrack");
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

function updateDots(){

dots.forEach(dot => dot.classList.remove("active"));

let dotIndex = index - 1;

if(dotIndex >= dots.length) dotIndex = 0;
if(dotIndex < 0) dotIndex = dots.length - 1;

dots[dotIndex].classList.add("active");

}

function nextSlide(){

index++;

track.style.transition = "0.7s ease-in-out";
track.style.transform = `translateX(-${index*100}%)`;

updateDots();

}

function prevSlide(){

index--;

track.style.transition = "0.7s ease-in-out";
track.style.transform = `translateX(-${index*100}%)`;

updateDots();

}

nextBtn.addEventListener("click",nextSlide);
prevBtn.addEventListener("click",prevSlide);

track.addEventListener("transitionend",()=>{

if(allSlides[index].id==="first-clone"){

track.style.transition="none";
index=1;

track.style.transform=`translateX(-${index*100}%)`;

}

if(allSlides[index].id==="last-clone"){

track.style.transition="none";
index=slides.length;

track.style.transform=`translateX(-${index*100}%)`;

}

});

dots.forEach((dot,i)=>{

dot.addEventListener("click",()=>{

index=i+1;

track.style.transition="0.7s";
track.style.transform=`translateX(-${index*100}%)`;

updateDots();

});

});

setInterval(()=>{

nextSlide();

},5000);

// let sliderInterval = setInterval(nextSlide, 4000);

// track.addEventListener("mouseenter", () => {
//     clearInterval(sliderInterval);
// });

// track.addEventListener("mouseleave", () => {
//     sliderInterval = setInterval(nextSlide, 4000);
// });

let startX = 0;

track.addEventListener("touchstart", (e)=>{
    startX = e.touches[0].clientX;
});

track.addEventListener("touchend", (e)=>{
    let endX = e.changedTouches[0].clientX;

    if(startX - endX > 50) nextSlide();
    if(endX - startX > 50) prevSlide();
});

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");

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

const sellersTrack = document.querySelector(".sellers-track");
const sellersSlides = document.querySelectorAll(".sellers-slide");

const nextSellers = document.querySelector(".next-sellers");
const prevSellers = document.querySelector(".prev-sellers");

let sellersIndex = 0;

function updateSellers(){
  sellersTrack.style.transform =
  `translateX(-${sellersIndex * 100}%)`;
}

nextSellers.addEventListener("click",()=>{

  sellersIndex++;
  updateSellers();

});

prevSellers.addEventListener("click",()=>{

  if(sellersIndex === 0){
    sellersIndex = sellersSlides.length - 2;
    sellersTrack.style.transition = `translateX(-${(sellersSlides.length - 1) * 100}%)`;
    setTimeout(() => {
      sellersTrack.style.transition = "transform 0.6s ease";
      updateSellers();
    },50);
  }else{
    sellersIndex--;
    updateSellers();
  }

});

sellersTrack.addEventListener("transitionend",()=>{

  if(sellersIndex === sellersSlides.length - 1){
    sellersTrack.style.transition = "none";
    sellersIndex = 0;
    sellersTrack.style.transform = `translateX(0%)`;

    setTimeout(() => {
      sellersTrack.style.transition = "transform 0.6s ease";
    },50);
  }

});

document.querySelectorAll(".qty-select").forEach(select => {

select.addEventListener("change", function(){

const card = this.closest(".product-card");

const newPriceEl = card.querySelector(".new");
const oldPriceEl = card.querySelector(".old");

let baseNew = parseFloat(newPriceEl.dataset.new);
let baseOld = parseFloat(oldPriceEl.dataset.old);

let quantity = this.value;

let newPrice = baseNew;
let oldPrice = baseOld;

if(quantity == 500){
newPrice = baseNew * 1.25;
oldPrice = baseOld * 1.25;
}

if(quantity == 1000){
newPrice = baseNew * 2.5;
oldPrice = baseOld * 2.5;
}

newPriceEl.innerText = "₹" + Math.round(newPrice);
oldPriceEl.innerText = "₹" + Math.round(oldPrice);

});

});

document.addEventListener("DOMContentLoaded", function(){

const track = document.querySelector(".testimonial-track");
const cards = document.querySelectorAll(".testimonial-card");
const slider = document.querySelector(".testimonial-slider");
const dots = document.querySelectorAll(".dots span");

let testimonialIndex = 0;
const cardsPerSlide = 3;
const totalSlides = Math.ceil(cards.length / cardsPerSlide);

function updateDots(){
    dots.forEach(dot => dot.classList.remove("active"));
    dots[testimonialIndex].classList.add("active");
}

function slideTestimonials(){

    testimonialIndex++;

    if(testimonialIndex >= totalSlides){
        testimonialIndex = 0;
    }

    const slideWidth = slider.offsetWidth;

    track.style.transform = "translateX(-" + (testimonialIndex * slideWidth) + "px)";

    updateDots();
}

setInterval(slideTestimonials, 4000);

});

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){
            entry.target.classList.add("show");
        }

    });

});

const hiddenElements = document.querySelectorAll(".slide-left, .slide-right");

hiddenElements.forEach((el) => observer.observe(el));

const products = {

snacks:[
{name:"Samosa", img:"images/products/samosa.jpg"},
{name:"Dhokla", img:"images/products/dhokla.jpg"},
{name:"Jalebi", img:"images/products/jalebi.jpg"},
{name:"Veg Pattis", img:"images/products/pattis.jpg"},
{name:"Kachori", img:"images/products/kachori.jpg"}
],

seasonal:[
{name:"Gajar Halwa", img:"images/products/gajar-halwa.jpg"},
{name:"Desi Ghee Gujiya", img:"images/products/gujiya.jpg"},
{name:"Malai Modak", img:"images/products/modak.jpg"},
{name:"Rabdi", img:"images/products/rabdi.jpg"}
],

milk:[
{name:"Malai Burfi", img:"images/products/malai-burfi.jpg"},
{name:"Kalakand", img:"images/products/kalakand.jpg"},
{name:"Mango Malai", img:"images/products/mango-malai.jpg"},
{name:"Chocolate Burfi", img:"images/products/chocolate-burfi.jpg"},
{name:"Pista Burfi", img:"images/products/pista-burfi.jpg"}
],

desi:[
{name:"Gulab Jamun Juicy", img:"images/products/gulab-jamun.jpg"},
{name:"Gulab Jamun Dry", img:"images/products/gulab-jamun-dry.jpg"},
{name:"Balushahi", img:"images/products/balushahi.jpg"},
{name:"Sugar Coated Gulab Jamun", img:"images/products/sugar-gulab.jpg"},
{name:"Badami Halwa", img:"images/products/badami-halwa.jpg"}
],

bengali:[
{name:"Angoor Rasmalai", img:"images/products/angoor-rasmalai.jpg"},
{name:"Rasmalai", img:"images/products/rasmalai.jpg"},
{name:"Malai Rabdi", img:"images/products/malai-rabdi.jpg"},
{name:"Gud Rasmalai Sugarfree", img:"images/products/gud-rasmalai.jpg"},
{name:"Bengali Malai Cham Cham", img:"images/products/cham-cham.jpg"}
],

dairy:[
{name:"Kharvas", img:"images/products/kharvas.jpg"},
{name:"Malai Kulfi", img:"images/products/kulfi.jpg"},
{name:"Paneer", img:"images/products/paneer.jpg"},
{name:"Khoya Fika", img:"images/products/khoya.jpg"},
{name:"Dahi", img:"images/products/dahi.jpg"}
],

dryfruit:[
{name:"Kaju Katli", img:"images/products/kaju-katli.jpg"},
{name:"Anjeer Roll", img:"images/products/anjeer-roll.jpg"},
{name:"Pista Roll", img:"images/products/pista-roll.jpg"},
{name:"Dry Fruit Burfi", img:"images/products/dryfruit-burfi.jpg"},
{name:"Apple Dry Fruit", img:"images/products/apple-dryfruit.jpg"}
],

north:[
{name:"Mohanthal", img:"images/products/mohanthal.jpg"},
{name:"Sutarfeni", img:"images/products/sutarfeni.jpg"},
{name:"Petha", img:"images/products/petha.jpg"},
{name:"Patisa", img:"images/products/patisa.jpg"},
{name:"Patasa", img:"images/products/patasa.jpg"}
]

};

const cards = document.querySelectorAll(".category-card");
const popup = document.getElementById("productPopup");
const popupProducts = document.getElementById("popupProducts");
const popupTitle = document.getElementById("popupTitle");

cards.forEach(card=>{

card.addEventListener("click",()=>{

let category = card.getAttribute("data-category");

popupTitle.innerText = card.querySelector("h3").innerText;

popupProducts.innerHTML="";

products[category].forEach(product=>{

popupProducts.innerHTML+=`

<div class="popup-product">
<img src="${product.img}">
<p>${product.name}</p>
<button>order</button>
</div>

`;

});

popup.style.display="flex";

});

});

document.querySelector(".close-popup").onclick=()=>{
popup.style.display="none";
};

window.onclick=(e)=>{
if(e.target==popup){
popup.style.display="none";
}
};