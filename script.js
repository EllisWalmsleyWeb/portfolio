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

const track = document.getElementById("image-track");

// Initialize the track
if (track) {
  // Convert existing images to new structure
  const images = track.querySelectorAll(".image");
  images.forEach((img) => {
    // Create new container
    const container = document.createElement("div");
    container.className = "image-container";

    // Move image into container
    img.parentNode.insertBefore(container, img);
    container.appendChild(img);

    // Add overlay elements
    const overlay = document.createElement("div");
    overlay.className = "image-overlay";

    const title = document.createElement("h3");
    title.className = "project-title";
    title.textContent = img.getAttribute("alt") || "Project Title";

    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = img.getAttribute("data-description") || "Click for more details.";

    const infoIcon = document.createElement("i");
    infoIcon.className = "bx bx-info-circle info-icon";

    overlay.appendChild(title);
    overlay.appendChild(description);
    overlay.appendChild(infoIcon);
    container.appendChild(overlay);

    // Store href as data attribute
    container.dataset.href = img.dataset.href;
  });

  let isDragging = false;
  let startX = 0;
  let movementX = 0;

  // Click handler for containers
  track.addEventListener("click", (e) => {
    if (movementX > 5) return; // Don't trigger click if we were dragging

    const container = e.target.closest(".image-container");
    if (!container) return;

    // Handle info icon click
    if (e.target.classList.contains("info-icon")) {
      const href = container.dataset.href;
      if (href) window.location.href = href;
      return;
    }

    // Toggle active state for container
    const wasActive = container.classList.contains("active");

    // Remove active class from all containers
    track.querySelectorAll(".image-container").forEach((cont) => {
      cont.classList.remove("active");
    });

    // Toggle active state if this wasn't already active
    if (!wasActive) {
      container.classList.add("active");
    }
  });

  // Mouse and touch event handlers
  const handleOnDown = (e) => {
    isDragging = true;
    startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    track.dataset.mouseDownAt = startX;
  };

  const handleOnUp = () => {
    isDragging = false;
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
    setTimeout(() => {
      movementX = 0;
    }, 100);
  };

  const handleOnMove = (e) => {
    if (track.dataset.mouseDownAt === "0") return;

    const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    movementX = Math.abs(startX - currentX);

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - currentX;
    const maxDelta = window.innerWidth / 2;
    const percentage = (mouseDelta / maxDelta) * -100;
    const nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage;
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -52);

    track.dataset.percentage = nextPercentage;

    // Move the track
    track.animate(
      {
        transform: `translate(${nextPercentage}%, -50%)`,
      },
      { duration: 1200, fill: "forwards" }
    );

    // Add opacity calculation for each image
    const images = track.getElementsByClassName("image");
    for (const image of images) {
      // Get image position relative to the text area
      const imageRect = image.getBoundingClientRect();
      const textArea = document.querySelector(".work-text").getBoundingClientRect();

      // Calculate distance to text area
      const distanceToText = imageRect.left - textArea.right;

      // Fade out as images get closer to text
      if (distanceToText < 5) {
        const opacity = Math.max(0, distanceToText / 5);
        image.style.opacity = opacity;
      } else {
        image.style.opacity = 1;
      }

      // Update object position
      image.animate(
        {
          objectPosition: `${100 + nextPercentage}% center`,
        },
        { duration: 1200, fill: "forwards" }
      );
    }
  };

  // Add event listeners
  window.addEventListener("mousedown", handleOnDown);
  window.addEventListener("touchstart", handleOnDown);
  window.addEventListener("mouseup", handleOnUp);
  window.addEventListener("touchend", handleOnUp);
  window.addEventListener("mousemove", handleOnMove);
  window.addEventListener("touchmove", handleOnMove);

  // Initialize track percentage
  track.dataset.percentage = 0;
  track.dataset.prevPercentage = 0;

  // Prevent image dragging
  track.querySelectorAll("img").forEach((img) => {
    img.addEventListener("dragstart", (e) => e.preventDefault());
  });
}
