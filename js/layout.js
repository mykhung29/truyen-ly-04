// Global variables
let currentTheme = localStorage.getItem("theme") || "light";
let isUserMenuOpen = false;
let isMobileMenuOpen = false;
let isSearchActive = false;

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  initializeTheme();
  initializeScrollEffects();
  initializeAnimations();
  initializeSearch();
  setupEventListeners();
  updateReadingProgress();
});

// Theme Management
function initializeTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon();
}

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);
  updateThemeIcon();

  // Add transition effect
  document.body.style.transition = "all 0.3s ease";
  setTimeout(() => {
    document.body.style.transition = "";
  }, 300);

  showNotification(
    `Đã chuyển sang chế độ ${currentTheme === "light" ? "sáng" : "tối"}`,
    "info"
  );
}

function updateThemeIcon() {
  const icon = document.getElementById("themeIcon");
  icon.className = currentTheme === "light" ? "fas fa-moon" : "fas fa-sun";
}

// Scroll Effects
function initializeScrollEffects() {
  const header = document.getElementById("header");
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    const scrollY = window.scrollY;

    // Header scroll effect
    if (scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Back to top button
    if (scrollY > 300) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }

    // Update reading progress
    updateReadingProgress();
  });
}

// Reading Progress
function updateReadingProgress() {
  const scrollTop = window.pageYOffset;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  document.getElementById("readingProgress").style.width = scrollPercent + "%";
}

// Search Functionality
function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchSuggestions = document.getElementById("searchSuggestions");

  if (searchInput) {
    searchInput.addEventListener("focus", function () {
      isSearchActive = true;
      searchSuggestions.classList.add("active");
    });

    searchInput.addEventListener("blur", function () {
      setTimeout(() => {
        isSearchActive = false;
        searchSuggestions.classList.remove("active");
      }, 200);
    });

    searchInput.addEventListener("input", function () {
      const query = this.value.trim();
      if (query.length > 0) {
        // Simulate search suggestions
        updateSearchSuggestions(query);
      }
    });

    searchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        const query = this.value.trim();
        if (query) {
          performSearch(query);
        }
      }
    });
  }
}

function updateSearchSuggestions(query) {
  const suggestions = [
    { type: "manga", name: "One Piece", icon: "fas fa-book" },
    { type: "manga", name: "Naruto", icon: "fas fa-book" },
    { type: "manga", name: "Attack on Titan", icon: "fas fa-book" },
    { type: "author", name: "Oda Eiichiro", icon: "fas fa-user" },
    { type: "genre", name: "Action", icon: "fas fa-tag" },
  ];

  const filteredSuggestions = suggestions.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const suggestionsContainer = document.getElementById("searchSuggestions");
  suggestionsContainer.innerHTML = "";

  filteredSuggestions.forEach((item) => {
    const suggestionElement = document.createElement("a");
    suggestionElement.href = "#";
    suggestionElement.className = "search-suggestion";
    suggestionElement.innerHTML = `
                    <i class="${item.icon}"></i>
                    <span>${item.name}</span>
                `;
    suggestionElement.addEventListener("click", function (e) {
      e.preventDefault();
      performSearch(item.name);
    });
    suggestionsContainer.appendChild(suggestionElement);
  });
}

function performSearch(query) {
  window.location.href = `search.html?q=${encodeURIComponent(query)}`;
  // Close search suggestions
  document.getElementById("searchSuggestions").classList.remove("active");
  // Clear search input
  document.getElementById("searchInput").value = "";
}

// User Menu
function toggleUserMenu() {
  const dropdown = document.getElementById("userDropdown");
  isUserMenuOpen = !isUserMenuOpen;

  if (isUserMenuOpen) {
    dropdown.classList.add("active");
  } else {
    dropdown.classList.remove("active");
  }
}

// Mobile Menu
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  const icon = document.getElementById("mobileMenuIcon");

  isMobileMenuOpen = !isMobileMenuOpen;

  if (isMobileMenuOpen) {
    mobileMenu.classList.add("active");
    icon.className = "fas fa-times";
    document.body.style.overflow = "hidden";
  } else {
    mobileMenu.classList.remove("active");
    icon.className = "fas fa-bars";
    document.body.style.overflow = "";
  }
}

// Action Functions
function toggleBookmarks() {
  showNotification("Bạn có 5 bookmark mới!", "info");
}

function toggleNotifications() {
  showNotification("3 chapter mới đã được cập nhật!", "success");
}

// Newsletter Subscription
function subscribeNewsletter(event) {
  event.preventDefault();

  const form = event.target;
  const input = form.querySelector(".newsletter-input");
  const btnText = form.querySelector(".btn-text");
  const loading = form.querySelector(".loading");

  // Show loading
  btnText.classList.add("hidden");
  loading.classList.remove("hidden");

  // Simulate API call
  setTimeout(() => {
    // Hide loading
    btnText.classList.remove("hidden");
    loading.classList.add("hidden");

    // Show success message
    showNotification(
      "Đăng ký thành công! Bạn sẽ nhận được thông báo chapter mới.",
      "success"
    );

    // Clear input
    input.value = "";
  }, 2000);
}

// Scroll to Top
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Notification System
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300 ${getNotificationClass(
    type
  )}`;
  notification.innerHTML = `
                <div class="flex items-center">
                    <i class="${getNotificationIcon(type)} mr-3"></i>
                    <span>${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto hide after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(full)";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

function getNotificationClass(type) {
  const classes = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
  };
  return classes[type] || classes.info;
}

function getNotificationIcon(type) {
  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  };
  return icons[type] || icons.info;
}

// Animation Observer
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements with animation classes
  document
    .querySelectorAll(".animate-fade-in-up, .animate-slide-in-right")
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      observer.observe(el);
    });
}

// Event Listeners
function setupEventListeners() {
  // Close dropdowns when clicking outside
  document.addEventListener("click", function (event) {
    const userMenu = document.querySelector(".user-menu");
    const mobileMenu = document.getElementById("mobileMenu");
    const searchContainer = document.querySelector(".search-container");

    // Close user menu if clicking outside
    if (!userMenu.contains(event.target) && isUserMenuOpen) {
      toggleUserMenu();
    }

    // Close mobile menu if clicking on overlay
    if (event.target === mobileMenu && isMobileMenuOpen) {
      toggleMobileMenu();
    }

    // Close search suggestions if clicking outside
    if (!searchContainer.contains(event.target) && isSearchActive) {
      document.getElementById("searchSuggestions").classList.remove("active");
      isSearchActive = false;
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", function (event) {
    // ESC to close menus
    if (event.key === "Escape") {
      if (isUserMenuOpen) toggleUserMenu();
      if (isMobileMenuOpen) toggleMobileMenu();
      if (isSearchActive) {
        document.getElementById("searchSuggestions").classList.remove("active");
        isSearchActive = false;
      }
    }

    // Ctrl/Cmd + K for search
    if ((event.ctrlKey || event.metaKey) && event.key === "k") {
      event.preventDefault();
      const searchInput = document.querySelector(".search-input");
      if (searchInput) {
        searchInput.focus();
      }
    }

    // Ctrl/Cmd + D for dark mode
    if ((event.ctrlKey || event.metaKey) && event.key === "d") {
      event.preventDefault();
      toggleTheme();
    }

    // Space for scroll down
    if (event.key === " " && !event.target.matches("input, textarea")) {
      event.preventDefault();
      window.scrollBy(0, window.innerHeight * 0.8);
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}



// Add hover effects to cards
document.querySelectorAll(".hover-lift").forEach((element) => {
  element.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-8px) scale(1.02)";
  });

  element.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Random manga function
function getRandomManga() {
  const mangaList = [
    "One Piece",
    "Naruto",
    "Attack on Titan",
    "Demon Slayer",
    "My Hero Academia",
    "Dragon Ball",
    "Death Note",
    "Fullmetal Alchemist",
  ];
  const randomManga = mangaList[Math.floor(Math.random() * mangaList.length)];
  showNotification(`Truyện ngẫu nhiên: ${randomManga}`, "info");
}
