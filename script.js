// Page transition and animation coordination
document.addEventListener("DOMContentLoaded", () => {
  // Remove any lingering fade-out class
  document.body.classList.remove("fade-out");

  // Setup typing effect
  const paragraph = document.querySelector(".main-text");
  const mainLinks = document.querySelectorAll(".change-text");
  let typingTimeout;
  let caretTimeout;
  let index = 0;
  let isTyping = false;

  // Store the initial text content and clear the paragraph
  const initialText = paragraph ? paragraph.textContent.trim() : "";
  if (paragraph) {
    paragraph.textContent = "";
  }

  function typeEffect(text, delay = 0) {
    clearTimeout(typingTimeout);
    clearTimeout(caretTimeout);
    paragraph.textContent = "";
    index = 0;
    let caretVisible = false;

    const startTyping = () => {
      paragraph.textContent = "|";

      function type() {
        if (index < text.length) {
          paragraph.textContent = text.substring(0, index + 1) + "|";
          index++;
          typingTimeout = setTimeout(type, 25);
        } else {
          clearTimeout(caretTimeout);
          paragraph.textContent = text;
        }
      }

      caretTimeout = setInterval(() => {
        caretVisible = !caretVisible;
        if (caretVisible) {
          paragraph.textContent = text.substring(0, index) + "|";
        } else {
          paragraph.textContent = text.substring(0, index);
        }
      }, 500);

      type();
    };

    setTimeout(startTyping, delay);
  }

  // Handle initial page load animation
  const startInitialAnimations = () => {
    // Remove the temporary hide class
    document.body.classList.remove("content-hidden");
    // Add fade-in class
    document.body.classList.add("fade-in");

    // Start typing effect for initial load
    if (paragraph) {
      setTimeout(() => {
        typeEffect(initialText, 400);
      }, 400); // Match fade-in duration
    }
  };

  // Start initial animations after a brief delay to ensure DOM is ready
  setTimeout(startInitialAnimations, 50);

  // Handle link clicks for main text changes
  mainLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector("#main-active-link")?.removeAttribute("id");
      link.id = "main-active-link";

      const newText = link.getAttribute("data-text");
      typeEffect(newText);

      if (newText.includes("const")) {
        paragraph.classList.add("line-breaks");
      } else {
        paragraph.classList.remove("line-breaks");
      }
    });
  });

  // Handle page navigation
  const navLinks = document.querySelectorAll("a[href]");
  navLinks.forEach((link) => {
    link.addEventListener("click", handleLinkClick);
  });
});

function handleLinkClick(e) {
  const href = e.currentTarget.href;
  if (!href.includes(window.location.origin)) return;

  e.preventDefault();

  // Start fade out
  document.body.classList.add("fade-out");
  document.body.classList.remove("fade-in");

  // Navigate after fade-out completes
  setTimeout(() => {
    window.location.href = href;
  }, 400);
}

// Handle browser back/forward navigation
window.addEventListener("pageshow", (e) => {
  const paragraph = document.querySelector(".main-text");

  if (e.persisted && paragraph) {
    // Store the text before clearing
    const text = paragraph.textContent.trim();
    paragraph.textContent = "";

    // Coming from browser cache (back/forward navigation)
    document.body.classList.remove("fade-out");
    document.body.classList.add("fade-in");

    // For back/forward navigation, wait for fade-in duration before typing
    setTimeout(() => {
      typeEffect(text, 400);
    }, 400);
  }
});

// --- Nav bar functionality ---

// Navbar active link
document.addEventListener("DOMContentLoaded", () => {
  // Get the current page filename from the URL
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    // Get the href filename
    const href = link.getAttribute("href");

    // Add active class if the href matches current page
    if (href === currentPage) {
      link.classList.add("active");
    }
  });
});

// Navbar toggling
const toggleNav = () => {
  const nav = document.querySelector("nav");
  const currentState = document.body.dataset.nav === "true";

  // If we're closing the nav menu
  if (currentState) {
    document.body.dataset.nav = "false";
    // Add an event listener for the transition end
    const handleTransitionEnd = () => {
      // Only reset scroll if we're on mobile
      if (window.innerWidth <= 768) {
        nav.scrollTop = 0;
      }
      // Remove the event listener after it's fired
      nav.removeEventListener("transitionend", handleTransitionEnd);
    };
    nav.addEventListener("transitionend", handleTransitionEnd);
  } else {
    // If we're opening the nav menu
    document.body.dataset.nav = "true";
  }
};

// Add window resize handler to ensure scroll reset works when switching between mobile and desktop
window.addEventListener("resize", () => {
  const nav = document.querySelector("nav");
  if (window.innerWidth <= 768 && document.body.dataset.nav !== "true") {
    nav.scrollTop = 0;
  }
});

// Scrolling between pages functionality
document.addEventListener("DOMContentLoaded", () => {
  // Create scroll indicator
  const scrollIndicator = document.createElement("div");
  scrollIndicator.className = "scroll-indicator";
  scrollIndicator.innerHTML = '<div class="scroll-progress"></div>';
  document.body.appendChild(scrollIndicator);

  // Create navigation preview
  const navPreview = document.createElement("div");
  navPreview.className = "nav-preview";
  navPreview.innerHTML = `
    <div class="nav-preview-text">Navigating to</div>
    <div class="nav-preview-destination"></div>
    <button class="nav-preview-cancel">Stay here</button>
  `;
  document.body.appendChild(navPreview);

  // Navigation state
  let isNavigating = false;
  let scrollTimeout;
  let navigationTarget = null;
  let scrollProgress = 0;
  const scrollThreshold = 100; // Amount of scroll needed to trigger navigation

  // Get current page and possible navigation targets
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const pages = ["index.html", "work.html", "about.html", "contact.html"];
  const currentIndex = pages.indexOf(currentPage);

  // Helper function to check if at page boundaries
  function isAtPageBoundary() {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Add a small buffer (1px) to account for browser rounding
    const atTop = scrollPosition <= 1;
    const atBottom = Math.ceil(scrollPosition + windowHeight) >= documentHeight - 1;

    return { atTop, atBottom };
  }

  // Handle scroll events
  window.addEventListener("wheel", (e) => {
    if (isNavigating) return;

    const { atTop, atBottom } = isAtPageBoundary();
    const scrollingUp = e.deltaY < 0;
    const scrollingDown = e.deltaY > 0;

    // Only accumulate scroll progress if at boundaries and scrolling in the right direction
    if ((atTop && scrollingUp) || (atBottom && scrollingDown)) {
      // Clear previous timeout
      clearTimeout(scrollTimeout);

      // Update scroll progress
      scrollProgress += e.deltaY;
      const progressPercent = Math.min((Math.abs(scrollProgress) / scrollThreshold) * 100, 100);
      document.querySelector(".scroll-progress").style.height = `${progressPercent}%`;

      // Show scroll indicator
      scrollIndicator.style.opacity = "1";

      // Determine navigation direction and target
      if (Math.abs(scrollProgress) >= scrollThreshold) {
        const direction = scrollProgress > 0 ? 1 : -1;
        const targetIndex = (currentIndex + direction + pages.length) % pages.length;
        navigationTarget = pages[targetIndex];

        // Show navigation preview
        isNavigating = true;
        navPreview.classList.add("active");
        document.querySelector(".nav-preview-destination").textContent =
          navigationTarget.replace(".html", "").charAt(0).toUpperCase() +
          navigationTarget.replace(".html", "").slice(1);

        // Auto-navigate after delay unless cancelled
        scrollTimeout = setTimeout(() => {
          if (isNavigating) {
            window.location.href = navigationTarget;
          }
        }, 2000);
      }
    } else {
      // Reset progress if not at boundaries
      scrollProgress = 0;
      document.querySelector(".scroll-progress").style.height = "0%";
      scrollIndicator.style.opacity = "0";
    }
  });

  // Reset scroll progress when wheel stops
  window.addEventListener(
    "wheel",
    debounce(() => {
      if (!isNavigating) {
        scrollProgress = 0;
        document.querySelector(".scroll-progress").style.height = "0%";
        scrollIndicator.style.opacity = "0";
      }
    }, 150)
  );

  // Cancel navigation
  document.querySelector(".nav-preview-cancel").addEventListener("click", () => {
    isNavigating = false;
    scrollProgress = 0;
    navigationTarget = null;
    clearTimeout(scrollTimeout);
    navPreview.classList.remove("active");
    document.querySelector(".scroll-progress").style.height = "0%";
    scrollIndicator.style.opacity = "0";
  });

  // Utility function for debouncing
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
});
