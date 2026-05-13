// Portfolio Section - Vanilla JavaScript
// Images data array
const portfolioImages = [
  {
    src: "images/bridal.jpg",
    alt: "Bridal makeup portrait",
  },
  {
    src: "images/eyemakeup.jpg",
    alt: "Editorial eye makeup",
  },
  {
    src: "images/glamour.jpg",
    alt: "Film glamour makeup",
  },
  {
    src: "images/sexy.jpg",
    alt: "Red carpet glamour makeup",
  },
  {
    src: "images/avant.jpg",
    alt: "Avant garde makeup art",
  },
  {
    src: "images/beauty.jpg",
    alt: "Natural beauty makeup",
  },
];

/**
 * Initialize Portfolio Section
 * Renders mobile and desktop gallery layouts with scroll animations
 */
class PortfolioSection {
  constructor(containerId = "portfolio") {
    this.container = document.getElementById(containerId);
    this.images = portfolioImages;
    this.scrollTrigger = null;

    if (!this.container) {
      console.warn(`Portfolio container with id "${containerId}" not found`);
      return;
    }

    this.init();
  }

  /**
   * Initialize the portfolio section
   */
  init() {
    this.renderMobileGallery();
    this.renderDesktopGallery();
    this.setupScrollEffect();
    this.setupResponsiveHandlers();
  }

  /**
   * Render mobile horizontal scroll gallery
   */
  renderMobileGallery() {
    const mobileContainer = this.container.querySelector(
      ".md\\:hidden.overflow-x-auto",
    );

    if (!mobileContainer) return;

    const flexWrapper = mobileContainer.querySelector(".flex");
    if (flexWrapper) {
      flexWrapper.innerHTML = "";

      this.images.forEach((img) => {
        const imageWrapper = document.createElement("div");
        imageWrapper.className =
          "flex-shrink-0 snap-start w-[72vw] aspect-[2/3] overflow-hidden";

        const imgElement = document.createElement("img");
        imgElement.src = img.src;
        imgElement.alt = img.alt;
        imgElement.className = "w-full h-full object-cover object-top";
        imgElement.loading = "lazy";

        imageWrapper.appendChild(imgElement);
        flexWrapper.appendChild(imageWrapper);
      });
    }
  }

  /**
   * Render desktop gallery
   */
  renderDesktopGallery() {
    const desktopContainer = this.container.querySelector(".portfolio-gallery");

    if (!desktopContainer) return;

    desktopContainer.innerHTML = "";

    this.images.forEach((img) => {
      const imageWrapper = document.createElement("div");
      imageWrapper.className =
        "flex-shrink-0 w-[260px] md:w-[320px] lg:w-[380px] aspect-[2/3] overflow-hidden";

      const imgElement = document.createElement("img");
      imgElement.src = img.src;
      imgElement.alt = img.alt;
      imgElement.className = "w-full h-full object-cover object-top";
      imgElement.loading = "lazy";

      imageWrapper.appendChild(imgElement);
      desktopContainer.appendChild(imageWrapper);
    });
  }

  /**
   * Setup scroll effect for desktop gallery
   * Uses GSAP ScrollTrigger for horizontal scroll animation
   */
  setupScrollEffect() {
    // Check if we're on desktop and GSAP is available
    const isDesktop = window.innerWidth >= 768;
    const desktopGallery = this.container.querySelector(".portfolio-gallery");

    if (!isDesktop || !desktopGallery || typeof gsap === "undefined") {
      return;
    }

    // Register ScrollTrigger plugin
    if (gsap.registerPlugin && !gsap.plugins.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Kill existing animation if any
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }

    // Calculate total scroll distance
    const galleryWidth = desktopGallery.scrollWidth;
    const viewportWidth = desktopGallery.clientWidth;
    const scrollDistance = galleryWidth - viewportWidth;

    // Create the scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.container,
        start: "top top",
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: 1,
        markers: false,
      },
    });

    // Animate horizontal scroll
    tl.to(
      desktopGallery,
      {
        x: -scrollDistance,
        ease: "none",
      },
      0,
    );

    this.scrollTrigger = tl.scrollTrigger;
  }

  /**
   * Setup responsive event handlers
   */
  setupResponsiveHandlers() {
    window.addEventListener("resize", () => {
      // Refresh scroll effect on window resize
      if (this.scrollTrigger && typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.refresh());
      }
    });
  }

  /**
   * Update images dynamically
   */
  updateImages(newImages) {
    this.images = newImages;
    this.renderMobileGallery();
    this.renderDesktopGallery();
    // Refresh scroll effect after updating images
    this.setupScrollEffect();
  }

  /**
   * Get current images
   */
  getImages() {
    return this.images;
  }

  /**
   * Add image to portfolio
   */
  addImage(imageObj) {
    this.images.push(imageObj);
    this.renderMobileGallery();
    this.renderDesktopGallery();
    // Refresh scroll effect after adding image
    this.setupScrollEffect();
  }

  /**
   * Remove image by index
   */
  removeImage(index) {
    this.images.splice(index, 1);
    this.renderMobileGallery();
    this.renderDesktopGallery();
    // Refresh scroll effect after removing image
    this.setupScrollEffect();
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  // Check if GSAP is loaded
  if (typeof gsap !== "undefined") {
    const portfolio = new PortfolioSection("portfolio");
    // Make available globally if needed
    window.portfolioSection = portfolio;
  } else {
    console.warn("GSAP library not loaded. Install GSAP for scroll effects.");
    // Still initialize without scroll effects
    const portfolio = new PortfolioSection("portfolio");
    window.portfolioSection = portfolio;
  }
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = { PortfolioSection, portfolioImages };
}
