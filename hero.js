/**
 * Hero Section - Vanilla JavaScript
 * Handles navigation, mobile menu, and text animations
 */

/**
 * Split text into individual character spans
 * @param {string} text - Text to split
 * @returns {HTMLElement[]} Array of span elements
 */
function splitText(text) {
  const characters = text.split("");
  return characters.map((char) => {
    const span = document.createElement("span");
    span.className = "char inline-block";
    span.textContent = char === " " ? "\u00A0" : char;
    return span;
  });
}

/**
 * Hero Section Manager
 * Handles navigation, mobile menu, and animations
 */
class HeroSection {
  constructor(containerId = "root", options = {}) {
    this.container = document.getElementById(containerId);
    this.heroSection = document.querySelector(".hero-section");
    this.navVisible = false;
    this.onNavClick = options.onNavClick || null;

    if (!this.container || !this.heroSection) {
      console.warn("Hero section container not found");
      return;
    }

    this.init();
  }

  /**
   * Initialize hero section
   */
  init() {
    this.setupNavigation();
    this.setupTextAnimation();
    this.setupScrollIndicator();
  }

  /**
   * Setup navigation with mobile menu toggle
   */
  setupNavigation() {
    const nav = this.heroSection.querySelector("nav");
    if (!nav) return;

    const menuButton = nav.querySelector(".md\\:hidden");
    const mobileNavPanel = nav.querySelector(".md\\:hidden.mt-6");

    // Find or create mobile nav panel
    let mobilePanel = nav.querySelector(
      '.md\\:hidden[style*="display: none"], .md\\:hidden.mt-6',
    );

    // Handle menu toggle
    if (menuButton) {
      menuButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });
    }

    // Setup all navigation links
    const navLinks = [
      ...nav.querySelectorAll('button[onclick*="handleNavClick"]'),
      ...nav.querySelectorAll("[data-nav-id]"),
    ];

    // Fallback: find all buttons in nav that look like nav links
    const buttons = nav.querySelectorAll("button:not(.md\\:hidden)");
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const text = button.textContent.trim().toUpperCase();
        const sectionMap = {
          BECKYHEBRON: "hero",
          ABOUT: "about",
          SERVICES: "services",
          PORTFOLIO: "portfolio",
          CONTACT: "contact",
          BOOK: "contact",
        };

        const sectionId = sectionMap[text];
        if (sectionId) {
          this.handleNavClick(sectionId);
        }
      });
    });
  }

  /**
   * Toggle mobile menu visibility
   */
  toggleMobileMenu() {
    this.navVisible = !this.navVisible;
    const nav = this.heroSection.querySelector("nav");
    const mobilePanel = nav.querySelector(".md\\:hidden.mt-6");

    if (mobilePanel) {
      mobilePanel.style.display = this.navVisible ? "block" : "none";
    }

    const menuButton = nav.querySelector(
      '.md\\:hidden[class*="text-\\[10px\\]"]',
    );
    if (menuButton) {
      menuButton.textContent = this.navVisible ? "CLOSE" : "MENU";
    }
  }

  /**
   * Handle navigation click
   * @param {string} sectionId - ID of section to navigate to
   */
  handleNavClick(sectionId) {
    this.navVisible = false;

    // Close mobile menu
    const nav = this.heroSection.querySelector("nav");
    const mobilePanel = nav?.querySelector(".md\\:hidden.mt-6");
    if (mobilePanel) {
      mobilePanel.style.display = "none";
    }

    // Scroll to section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }

    // Call custom callback if provided
    if (this.onNavClick) {
      this.onNavClick(sectionId);
    }
  }

  /**
   * Setup hero name text animation with character splits
   */
  setupTextAnimation() {
    const heroName = this.heroSection.querySelector(".hero-name");
    if (!heroName) return;

    const textDivs = heroName.querySelectorAll(".overflow-hidden");
    textDivs.forEach((div) => {
      const originalText = div.textContent.trim();
      div.innerHTML = "";

      const characters = splitText(originalText);
      characters.forEach((char) => {
        div.appendChild(char);
      });
    });
  }

  /**
   * Setup scroll indicator animation
   */
  setupScrollIndicator() {
    const indicator = this.heroSection.querySelector(".scroll-indicator");
    if (!indicator) return;

    // Show scroll indicator on page load
    indicator.style.opacity = "1";

    // Hide scroll indicator when user scrolls
    let scrollTimeout;
    window.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);

      if (window.scrollY > 50) {
        indicator.style.opacity = "0";
        indicator.style.pointerEvents = "none";
      } else {
        indicator.style.opacity = "1";
        indicator.style.pointerEvents = "auto";
      }
    });

    // Animate scroll indicator line
    if (typeof gsap !== "undefined") {
      const scrollLine = indicator.querySelector(".scroll-indicator-line");
      if (scrollLine) {
        gsap.to(scrollLine, {
          y: 20,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }
  }

  /**
   * Get current nav visible state
   */
  isMenuOpen() {
    return this.navVisible;
  }

  /**
   * Manually toggle menu
   */
  toggleMenu() {
    this.toggleMobileMenu();
  }

  /**
   * Navigate to a section
   */
  navigateTo(sectionId) {
    this.handleNavClick(sectionId);
  }
}

/**
 * Initialize on DOM ready
 */
document.addEventListener("DOMContentLoaded", () => {
  const hero = new HeroSection("root", {
    onNavClick: (sectionId) => {
      console.log("Navigating to:", sectionId);
    },
  });

  // Make available globally if needed
  window.heroSection = hero;
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = { HeroSection, splitText };
}
