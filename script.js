document.querySelectorAll(".counter").forEach((counter) => {
  const target = Number(counter.dataset.target);
  const suffix = counter.dataset.suffix || "";
  const duration = 1200;
  const startTime = performance.now();

  function countUp(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.floor(target * progress);

    counter.textContent = value.toLocaleString("en-IN") + suffix;

    if (progress < 1) {
      requestAnimationFrame(countUp);
    }
  }

  requestAnimationFrame(countUp);
});

const homeCarousel = document.querySelector("[data-home-carousel]");

if (homeCarousel) {
  const track = homeCarousel.querySelector("[data-carousel-track]");
  const slides = Array.from(homeCarousel.querySelectorAll(".home-carousel-slide"));
  const dots = Array.from(homeCarousel.querySelectorAll("[data-carousel-dot]"));
  const previousButton = homeCarousel.querySelector("[data-carousel-previous]");
  const nextButton = homeCarousel.querySelector("[data-carousel-next]");
  const toggleButton = homeCarousel.querySelector("[data-carousel-toggle]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let autoplayTimer;
  let paused = reducedMotion;
  let interactionPaused = false;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${activeIndex * (100 / slides.length)}%)`;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.setAttribute("aria-hidden", String(!isActive));
      slide.toggleAttribute("inert", !isActive);
      slide.setAttribute("aria-label", `${slideIndex + 1} of ${slides.length}`);
      dots[slideIndex].setAttribute("aria-pressed", String(isActive));
    });
  }

  function updateAutoplay() {
    window.clearInterval(autoplayTimer);
    if (!paused && !interactionPaused && !document.hidden && slides.length > 1) {
      autoplayTimer = window.setInterval(() => showSlide(activeIndex + 1), 5000);
    }
  }

  function setPaused(nextPaused) {
    paused = nextPaused;
    toggleButton.textContent = paused ? "Play" : "Pause";
    toggleButton.setAttribute("aria-label", paused ? "Resume slideshow" : "Pause slideshow");
    updateAutoplay();
  }

  previousButton.addEventListener("click", () => {
    showSlide(activeIndex - 1);
    updateAutoplay();
  });

  nextButton.addEventListener("click", () => {
    showSlide(activeIndex + 1);
    updateAutoplay();
  });

  toggleButton.addEventListener("click", () => setPaused(!paused));

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      updateAutoplay();
    });
  });

  homeCarousel.addEventListener("mouseenter", () => {
    interactionPaused = true;
    updateAutoplay();
  });

  homeCarousel.addEventListener("mouseleave", () => {
    interactionPaused = homeCarousel.contains(document.activeElement);
    updateAutoplay();
  });

  homeCarousel.addEventListener("focusin", () => {
    interactionPaused = true;
    updateAutoplay();
  });

  homeCarousel.addEventListener("focusout", (event) => {
    if (!homeCarousel.contains(event.relatedTarget)) {
      interactionPaused = homeCarousel.matches(":hover");
      updateAutoplay();
    }
  });

  document.addEventListener("visibilitychange", updateAutoplay);
  showSlide(0);
  setPaused(reducedMotion);
}

const selectedService = new URLSearchParams(window.location.search).get("service");
const serviceSelect = document.querySelector("#service");

if (selectedService && serviceSelect) {
  serviceSelect.value = selectedService;
}

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const message = [
      `Naam: ${formData.get("name")}`,
      `Mobile: ${formData.get("phone")}`,
      `Email: ${formData.get("email")}`,
      `Service: ${formData.get("service")}`,
      `Address: ${formData.get("address")}`
    ].join("\n");

    const whatsappNumber = "919817058496";
    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  });
}