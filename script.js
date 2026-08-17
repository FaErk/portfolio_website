function toggleMenu() {
    const menu = document.querySelector(".menu-elements");
    const icon = document.querySelector(".hamburger-icon");

    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

const lightbox = document.getElementById("image-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const closeButton = document.querySelector(".lightbox-close");

const zoomInButton = document.getElementById("zoom-in");
const zoomOutButton = document.getElementById("zoom-out");
const zoomResetButton = document.getElementById("zoom-reset");
const zoomLevel = document.getElementById("zoom-level");

const projectImages = document.querySelectorAll(
    ".project-img, .project-img2, .project-img3"
);

let scale = 1;
let translateX = 0;
let translateY = 0;

let isDragging = false;
let startX = 0;
let startY = 0;


/* =========================================================
   OPEN LIGHTBOX
========================================================= */

projectImages.forEach((image) => {

    image.addEventListener("click", () => {

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        resetZoom();

        lightbox.classList.add("open");

        // Prevent background page from scrolling
        document.body.style.overflow = "hidden";
    });

});


/* =========================================================
   CLOSE LIGHTBOX
========================================================= */

function closeLightbox() {

    lightbox.classList.remove("open");

    document.body.style.overflow = "";

    resetZoom();
}

closeButton.addEventListener("click", closeLightbox);


/* Click outside image */

lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {
        closeLightbox();
    }

});


/* Escape key */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape" && lightbox.classList.contains("open")) {
        closeLightbox();
    }

});


/* =========================================================
   ZOOM
========================================================= */

function updateImageTransform() {

    lightboxImage.style.transform =
        `translate(${translateX}px, ${translateY}px) scale(${scale})`;

    zoomLevel.textContent = `${Math.round(scale * 100)}%`;
}


zoomInButton.addEventListener("click", () => {

    scale += 0.25;

    // Maximum 400%
    scale = Math.min(scale, 4);

    updateImageTransform();
});


zoomOutButton.addEventListener("click", () => {

    scale -= 0.25;

    // Minimum 50%
    scale = Math.max(scale, 0.5);

    updateImageTransform();
});


zoomResetButton.addEventListener("click", resetZoom);


function resetZoom() {

    scale = 1;
    translateX = 0;
    translateY = 0;

    updateImageTransform();
}


/* =========================================================
   MOUSE WHEEL ZOOM
========================================================= */

lightbox.addEventListener("wheel", (event) => {

    if (!lightbox.classList.contains("open")) {
        return;
    }

    event.preventDefault();

    if (event.deltaY < 0) {
        scale += 0.1;
    } else {
        scale -= 0.1;
    }

    scale = Math.min(Math.max(scale, 0.5), 4);

    updateImageTransform();

}, { passive: false });


/* =========================================================
   DRAG IMAGE
========================================================= */

lightboxImage.addEventListener("mousedown", (event) => {

    if (scale <= 1) {
        return;
    }

    isDragging = true;

    startX = event.clientX - translateX;
    startY = event.clientY - translateY;

});


document.addEventListener("mousemove", (event) => {

    if (!isDragging) {
        return;
    }

    translateX = event.clientX - startX;
    translateY = event.clientY - startY;

    updateImageTransform();

});


document.addEventListener("mouseup", () => {

    isDragging = false;

});


/* =========================================================
   TOUCH / MOBILE DRAGGING
========================================================= */

lightboxImage.addEventListener("touchstart", (event) => {

    if (scale <= 1) {
        return;
    }

    const touch = event.touches[0];

    isDragging = true;

    startX = touch.clientX - translateX;
    startY = touch.clientY - translateY;

}, { passive: true });


lightboxImage.addEventListener("touchmove", (event) => {

    if (!isDragging) {
        return;
    }

    const touch = event.touches[0];

    translateX = touch.clientX - startX;
    translateY = touch.clientY - startY;

    updateImageTransform();

}, { passive: true });


lightboxImage.addEventListener("touchend", () => {

    isDragging = false;

});