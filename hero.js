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

    const menuButton = nav.querySelector("button.md\\:hidden");

    // Create mobile nav panel if it doesn't exist
    let mobilePanel = nav.querySelector(".mobile-nav-panel");
    if (!mobilePanel && menuButton) {
      mobilePanel = document.createElement("div");
      mobilePanel.className =
        "mobile-nav-panel md:hidden mt-6 pb-4 border-t border-[#E8DFD0]/10 pt-6 space-y-4 hidden";
      mobilePanel.innerHTML = `
        <button class="mobile-nav-item block font-['Cinzel'] text-xs tracking-[0.3em] text-[#E8DFD0]/70 hover:text-[#E8DFD0] transition-colors duration-300 uppercase" data-id="about">ABOUT</button>
        <button class="mobile-nav-item block font-['Cinzel'] text-xs tracking-[0.3em] text-[#E8DFD0]/70 hover:text-[#E8DFD0] transition-colors duration-300 uppercase" data-id="services">SERVICES</button>
        <button class="mobile-nav-item block font-['Cinzel'] text-xs tracking-[0.3em] text-[#E8DFD0]/70 hover:text-[#E8DFD0] transition-colors duration-300 uppercase" data-id="portfolio">PORTFOLIO</button>
        <button class="mobile-nav-item block font-['Cinzel'] text-xs tracking-[0.3em] text-[#E8DFD0]/70 hover:text-[#E8DFD0] transition-colors duration-300 uppercase" data-id="contact">CONTACT</button>
        <button class="mobile-nav-item block font-['Cinzel'] text-xs tracking-[0.25em] text-[#C9A84C] uppercase mt-2" data-id="contact">BOOK</button>
      `;
      nav.appendChild(mobilePanel);
    }

    // Handle menu button toggle
    if (menuButton) {
      menuButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.toggleMobileMenu();
      });
    }

    // Setup logo button
    const logoButton = nav.querySelector("button:not(.md\\:hidden)");
    if (logoButton) {
      logoButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleNavClick("hero");
      });
    }

    // Setup desktop navigation links
    const desktopNav = nav.querySelector(".hidden.md\\:flex");
    if (desktopNav) {
      const desktopButtons = desktopNav.querySelectorAll("button");
      desktopButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          const text = button.textContent.trim().toUpperCase();
          const sectionMap = {
            ABOUT: "about",
            SERVICES: "services",
            PORTFOLIO: "portfolio",
            CONTACT: "contact",
          };
          const sectionId = sectionMap[text];
          if (sectionId) {
            this.handleNavClick(sectionId);
          }
        });
      });
    }

    // Setup desktop book button
    const bookButton = nav.querySelector("button.hidden.md\\:block");
    if (bookButton) {
      bookButton.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleNavClick("contact");
      });
    }

    // Setup mobile navigation items
    const mobileItems = nav.querySelectorAll(".mobile-nav-item");
    mobileItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const sectionId = item.dataset.id;
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
    const mobilePanel = nav?.querySelector(".mobile-nav-panel");
    const menuButton = nav?.querySelector("button.md\\:hidden");

    if (mobilePanel) {
      mobilePanel.classList.toggle("hidden", !this.navVisible);
    }

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
    const mobilePanel = nav?.querySelector(".mobile-nav-panel");
    if (mobilePanel) {
      mobilePanel.classList.add("hidden");
    }

    // Update menu button text
    const menuButton = nav?.querySelector("button.md\\:hidden");
    if (menuButton) {
      menuButton.textContent = "MENU";
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
