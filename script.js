// Dark mode functionality

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.querySelector(".lighting-selector");
  const body = document.body;
  const location = document.querySelector(".location");
  const freelance = document.querySelector(".freelance");
  const nav = document.querySelector("nav");

  // If no preference is set, enable dark mode by default
  if (!localStorage.getItem("darkMode")) {
    localStorage.setItem("darkMode", "enabled"); // Set dark mode as default
  }

  // Check localStorage and immediately apply dark mode if enabled
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
  }

  // After the page is fully loaded, apply the transition class
  window.addEventListener("load", () => {
    body.classList.add("transition-enabled");
    nav.classList.add("transition-enabled");
  });

  // Toggle dark mode when the lighting selector is clicked
  toggleButton.addEventListener("click", () => {
    if (body.classList.contains("dark-mode")) {
      body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "disabled");
      toggleButton.innerHTML = `<i class='bx bxs-moon'></i>`;
      location.innerHTML = `<i class='bx bxs-location-plus' ></i>UK, Lancashire`;
      freelance.innerHTML = `<i class='bx bx-briefcase-alt' ></i>Freelance`;
    } else {
      body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "enabled");
      toggleButton.innerHTML = `<i class="bx bx-sun"></i>`;
      location.innerHTML = `<i class='bx bx-location-plus' ></i>UK, Lancashire`;
      freelance.innerHTML = `<i class='bx bxs-briefcase-alt' ></i>Freelance`;
    }
  });
});

// Nav link functionality
const navLinks = document.querySelectorAll(".nav-item a");
const sections = document.querySelectorAll("main, section");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    // Remove 'nav-active-link' ID from the previously active link
    document.querySelector("#nav-active-link")?.removeAttribute("id");

    // Add 'nav-active-link' ID to the clicked link
    link.id = "nav-active-link";
  });
});

// Function to update active link based on scroll position
function updateActiveNav() {
  let currentSectionId = "";
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    // Check if the middle of the section is in view
    if (
      rect.top <= window.innerHeight / 2 &&
      rect.bottom >= window.innerHeight / 2
    ) {
      currentSectionId = section.id;
    }
  });
  if (currentSectionId) {
    navLinks.forEach((link) => {
      // Match href with the current section's id
      if (link.getAttribute("href").includes(`#${currentSectionId}`)) {
        link.id = "nav-active-link";
      } else {
        link.removeAttribute("id");
      }
    });
  }
}

// Update active nav link on scroll
document.addEventListener("scroll", updateActiveNav);

// Typing effect
document.addEventListener("DOMContentLoaded", () => {
  const paragraph = document.querySelector(".main-text");
  const mainLinks = document.querySelectorAll(".change-text");
  let typingTimeout; // Track the active timeout
  let caretTimeout; // Track the caret visibility timeout
  let index = 0; // Track typing position
  let isTyping = false; // To avoid typing effect overlap

  function typeEffect(text, delay = 0) {
    clearTimeout(typingTimeout); // Stop ongoing typing effect
    clearTimeout(caretTimeout); // Stop caret timeout
    paragraph.textContent = ""; // Clear previous text
    index = 0; // Reset index
    let caretVisible = false; // Track the caret visibility

    // Add the caret | symbol at the end
    paragraph.textContent = ""; // Start with no text during the delay

    // Start typing after the delay
    setTimeout(() => {
      // Add caret right after the text
      paragraph.textContent = text + "|";

      function type() {
        if (index < text.length) {
          paragraph.textContent = text.substring(0, index + 1) + "|"; // Update text and keep caret
          index++;
          typingTimeout = setTimeout(type, 33); // Adjust speed if needed
        } else {
          clearTimeout(caretTimeout); // Clear caret after typing is done
          paragraph.textContent = text; // Remove the caret after typing is complete
        }
      }

      // Toggle caret visibility during typing
      caretTimeout = setInterval(() => {
        caretVisible = !caretVisible;
        if (caretVisible) {
          paragraph.textContent = text.substring(0, index) + "|"; // Show caret
        } else {
          paragraph.textContent = text.substring(0, index); // Hide caret
        }
      }, 500); // Toggle caret every 500ms

      type(); // Start typing effect
    }, delay); // Initial delay
  }

  // Initial load animation with 0.8s delay
  typeEffect(paragraph.textContent.trim(), 800);

  // Add event listeners to all main links
  mainLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default link behavior

      // Remove 'main-active-link' ID from the previous active link
      document.querySelector("#main-active-link")?.removeAttribute("id");

      // Set clicked link as active
      link.id = "main-active-link";

      // Get the new text and animate it immediately (no delay)
      const newText = link.getAttribute("data-text");
      typeEffect(newText);

      // Ensuring line breaks on engineers section
      if (newText.includes("const")) {
        paragraph.classList.add("line-breaks");
      } else {
        paragraph.classList.remove("line-breaks");
      }
    });
  });
});

// Work section

// Scroll indicator
document.addEventListener("DOMContentLoaded", () => {
  const scrollIndicator = document.querySelector(".scroll-indicator");

  // Show indicator initially
  scrollIndicator.classList.add("visible");

  // Hide indicator on first scroll
  let hasScrolled = false;
  window.addEventListener("scroll", () => {
    if (!hasScrolled) {
      hasScrolled = true;
      scrollIndicator.classList.remove("visible");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const projectGrid = document.querySelector(".project-grid");
  const scrollContainer = document.querySelector(".project-scroll-container");

  let isScrolling = true;
  let isDragging = false;
  let startX;
  let scrollLeft;
  let animationFrameId;
  let lastScrollPosition = 0;
  const scrollSpeed = 0.5;

  // Function to check if device is mobile/tablet
  function isMobileDevice() {
    return window.innerWidth <= 768;
  }

  // Function to handle project cloning
  function handleProjectCloning() {
    // Clear existing clones first
    const originalProjects = Array.from(projectGrid.children).slice(
      0,
      projectGrid.children.length / 2
    );
    projectGrid.innerHTML = "";

    // Add original projects back
    originalProjects.forEach((project) => {
      projectGrid.appendChild(project.cloneNode(true));
    });

    // Only clone for desktop
    if (!isMobileDevice()) {
      originalProjects.forEach((project) => {
        projectGrid.appendChild(project.cloneNode(true));
      });
    }
  }

  // Auto-scroll animation
  function autoScroll() {
    if (isScrolling && !isDragging && !isMobileDevice()) {
      lastScrollPosition += scrollSpeed;

      if (lastScrollPosition >= projectGrid.scrollWidth / 2) {
        lastScrollPosition = 0;
      }

      scrollContainer.scrollLeft = lastScrollPosition;
    }
    if (!isMobileDevice()) {
      animationFrameId = requestAnimationFrame(autoScroll);
    }
  }

  // Initialize the layout
  handleProjectCloning();

  // Only start auto-scroll if not mobile
  if (!isMobileDevice()) {
    autoScroll();
  }

  // Event Listeners for desktop only
  if (!isMobileDevice()) {
    scrollContainer.addEventListener("mouseenter", () => {
      isScrolling = false;
    });

    scrollContainer.addEventListener("mouseleave", () => {
      isScrolling = true;
    });

    scrollContainer.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
      lastScrollPosition = scrollLeft;
      scrollContainer.style.cursor = "grabbing";
    });

    scrollContainer.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainer.scrollLeft = scrollLeft - walk;
      lastScrollPosition = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener("mouseup", () => {
      isDragging = false;
      scrollContainer.style.cursor = "grab";
    });

    scrollContainer.addEventListener("mouseleave", () => {
      isDragging = false;
      scrollContainer.style.cursor = "grab";
    });
  }

  // Handle resize events
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      handleProjectCloning();
      lastScrollPosition = 0;
      scrollContainer.scrollLeft = 0;

      // Reinitialize scroll animation based on device type
      cancelAnimationFrame(animationFrameId);
      if (!isMobileDevice()) {
        autoScroll();
      }
    }, 250);
  });
});

// Tech tag colors
// Add this to your existing JavaScript file
document.addEventListener("DOMContentLoaded", () => {
  // Color mapping for different technologies
  const techColors = {
    React: "rgba(97, 218, 251, 0.2)",
    JavaScript: "rgba(247, 223, 30, 0.2)",
    TypeScript: "rgba(49, 120, 198, 0.2)",
    "Node.js": "rgba(51, 153, 51, 0.2)",
    Firebase: "rgba(255, 202, 40, 0.2)",
    CSS: "rgba(38, 77, 228, 0.2)",
    "Vue.js": "rgba(65, 184, 131, 0.2)",
    "Next.js": "rgba(0, 0, 0, 0.2)",
    Tailwind: "rgba(56, 189, 248, 0.2)",
    MongoDB: "rgba(0, 237, 100, 0.2)",
    "React Native": "rgba(97, 218, 251, 0.2)",
    Redux: "rgba(118, 74, 188, 0.2)",
    Express: "rgba(68, 68, 68, 0.2)",
    "API Integration": "rgba(106, 115, 125, 0.2)",
    Vuex: "rgba(65, 184, 131, 0.2)",
  };

  // Get all tech tags
  const techTags = document.querySelectorAll(".tech-tag");

  // For each tech tag, check its content and apply the corresponding background color
  techTags.forEach((tag) => {
    const tagText = tag.textContent.trim();
    for (const [tech, color] of Object.entries(techColors)) {
      if (tagText.includes(tech)) {
        tag.style.backgroundColor = color;
        // Adjust text color based on background brightness
        const isLightBackground = tech === "JavaScript"; // Add more conditions if needed
        tag.style.color = isLightBackground
          ? "var(--text-color)"
          : "var(--text-color)";
        break; // Stop after finding the first match
      }
    }
  });
});

// Scrolling tech stack functionality
const techList = document.querySelector(".tech-list");
let scrolling = true;

// Clone elements to create an infinite loop
const items = [...techList.children];
items.forEach((item) => {
  const clone = item.cloneNode(true);
  techList.appendChild(clone);
});

function startScrolling() {
  const speed = 1; // Adjust speed as needed
  function scroll() {
    if (scrolling) {
      techList.scrollLeft += speed;
      // Instead of resetting to 0, subtract one cycle’s width
      if (techList.scrollLeft >= techList.scrollWidth / 2) {
        techList.scrollLeft -= techList.scrollWidth / 2;
      }
    }
    requestAnimationFrame(scroll);
  }
  scroll();
}

// Pause scrolling on hover
techList.addEventListener("mouseenter", () => (scrolling = false));
techList.addEventListener("mouseleave", () => (scrolling = true));

// Start infinite scrolling
startScrolling();
