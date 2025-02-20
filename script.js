// Dark mode functionality

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.querySelector(".lighting-selector");
  const body = document.body;
  const location = document.querySelector(".location");
  const freelance = document.querySelector(".freelance");

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

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    // Remove 'nav-active-link' ID from the previously active link
    document.querySelector("#nav-active-link")?.removeAttribute("id");

    // Add 'nav-active-link' ID to the clicked link
    link.id = "nav-active-link";
  });
});

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
  let speed = 1; // Adjust speed as needed

  function scroll() {
    if (scrolling) {
      techList.scrollLeft += speed;
      if (techList.scrollLeft >= techList.scrollWidth / 2) {
        techList.scrollLeft = 0; // Reset scroll for infinite loop
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
