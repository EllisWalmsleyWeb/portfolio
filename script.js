// Dark mode functionality

const toggleButton = document.querySelector(".lighting-selector");
const body = document.body;

// If no preference is set, enable dark mode by default
if (!localStorage.getItem("darkMode")) {
  localStorage.setItem("darkMode", "enabled"); // Set dark mode as default
}

// Apply dark mode if enabled in localStorage
if (localStorage.getItem("darkMode") === "enabled") {
  body.classList.add("dark-mode");
  toggleButton.innerHTML = `<i class="bx bx-sun">`;
}

// Toggle Function
toggleButton.addEventListener("click", () => {
  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    localStorage.setItem("darkMode", "disabled");
    toggleButton.innerHTML = `<i class='bx bxs-moon' ></i>`;
  } else {
    body.classList.add("dark-mode");
    localStorage.setItem("darkMode", "enabled");
    toggleButton.innerHTML = `<i class="bx bx-sun">`;
  }
});

// Main link functionality
// Main link functionality
const mainLinks = document.querySelectorAll(".change-text");
const paragraph = document.querySelector(".main-text");

mainLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault(); // Prevents the default link behavior

    // Remove the 'main-active-link' ID from the previously active link
    const activeLink = document.querySelector("#main-active-link");
    if (activeLink) {
      activeLink.removeAttribute("id"); // Remove the ID from the previous active link
    }

    // Add the 'main-active-link' ID to the clicked link
    link.id = "main-active-link";

    const newText = link.getAttribute("data-text"); // Gets the text from the data-text attribute
    paragraph.textContent = newText; // Changes the paragraph text
  });
});
