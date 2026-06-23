/* ==========================================
   AETHER ACADEMY GLOBAL JAVASCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburgerMenu();
  initActiveNavLink();
  initTestimonialsSlider();
  initAcademicTabs();
  initAccordions();
  initGalleryFilter();
  initGalleryLightbox();
  initContactForm();
});

/* --- Navbar Scroll Effect --- */
function initNavbar() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --- Hamburger Mobile Menu --- */
function initHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

/* --- Active Nav Link Handler --- */
function initActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (navLinks.length === 0) return;

  // Get current page name (e.g. index.html)
  const page = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === 'index.html' && href === './') || (href === 'index.html' && page === '')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* --- Testimonials Slider --- */
function initTestimonialsSlider() {
  const track = document.querySelector('.testimonial-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.slider-controls');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoSlideInterval;

  // Create dot indicators
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('slider-dot');
    if (index === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dotsContainer.appendChild(dot);

    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoSlide();
    });
  });

  const dots = document.querySelectorAll('.slider-dot');

  function goToSlide(index) {
    currentIndex = index;
    // Apply transform
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slides.length) {
      nextIndex = 0;
    }
    goToSlide(nextIndex);
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  startAutoSlide();
}

/* --- Academics Tabs --- */
function initAcademicTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabBtns.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPanelId = btn.getAttribute('data-tab');

      // Update button active state
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panel visibility
      tabPanels.forEach(panel => {
        if (panel.id === targetPanelId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* --- Admissions Accordion --- */
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  if (accordionHeaders.length === 0) return;

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const currentItem = header.parentElement;
      const isActive = currentItem.classList.contains('active');

      // Close all accordion items
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
      });

      // If it wasn't active, open it
      if (!isActive) {
        currentItem.classList.add('active');
      }
    });
  });
}

/* --- Gallery Filter --- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filters .btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button style
      filterBtns.forEach(b => {
        b.classList.remove('btn-accent');
        b.classList.add('btn-secondary');
      });
      btn.classList.add('btn-accent');
      btn.classList.remove('btn-secondary');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          // Add subtle entry transition
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --- Gallery Lightbox --- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');

  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  let currentImageArray = [];
  let currentActiveIndex = 0;

  // Gather visible image elements
  function updateImageArray() {
    currentImageArray = [];
    galleryItems.forEach(item => {
      if (item.style.display !== 'none') {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-overlay h3').textContent;
        currentImageArray.push({
          src: img.getAttribute('src'),
          caption: caption
        });
      }
    });
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      updateImageArray();
      const clickedImgSrc = item.querySelector('img').getAttribute('src');
      
      // Find index in current filtered array
      currentActiveIndex = currentImageArray.findIndex(imgObj => imgObj.src === clickedImgSrc);
      
      openLightbox();
    });
  });

  function openLightbox() {
    if (currentActiveIndex === -1) return;
    const imageObj = currentImageArray[currentActiveIndex];
    
    lightboxImg.setAttribute('src', imageObj.src);
    lightboxCaption.textContent = imageObj.caption;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scroll
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Close lightbox on click outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      currentActiveIndex = (currentActiveIndex + 1) % currentImageArray.length;
      openLightbox();
    } else if (e.key === 'ArrowLeft') {
      currentActiveIndex = (currentActiveIndex - 1 + currentImageArray.length) % currentImageArray.length;
      openLightbox();
    }
  });
}

/* --- Form Validations & Simulation --- */
function initContactForm() {
  const form = document.querySelector('.school-form');
  if (!form) return;

  const inputs = form.querySelectorAll('.form-control');
  const alertPopup = document.getElementById('alertPopup');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    inputs.forEach(input => {
      const formGroup = input.parentElement;
      const val = input.value.trim();

      // Check required
      if (input.hasAttribute('required') && !val) {
        setError(formGroup, 'This field is required.');
        hasError = true;
      } else if (input.type === 'email' && val && !validateEmail(val)) {
        setError(formGroup, 'Please enter a valid email address.');
        hasError = true;
      } else if (input.id === 'phone' && val && !validatePhone(val)) {
        setError(formGroup, 'Please enter a valid 10-digit phone number.');
        hasError = true;
      } else {
        clearError(formGroup);
      }
    });

    if (!hasError) {
      // Simulate submission
      showToast();
      form.reset();
    }
  });

  // Dynamic clear on input
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const formGroup = input.parentElement;
      if (formGroup.classList.contains('has-error')) {
        clearError(formGroup);
      }
    });
  });

  function setError(formGroup, message) {
    formGroup.classList.add('has-error');
    const errorEl = formGroup.querySelector('.form-error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(formGroup) {
    formGroup.classList.remove('has-error');
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^\d{10}$/; // standard 10 digit check
    return re.test(phone.replace(/[-()+\s]/g, '')); // strip characters and check length
  }

  function showToast() {
    if (!alertPopup) return;
    alertPopup.classList.add('active');
    
    setTimeout(() => {
      alertPopup.classList.remove('active');
    }, 4000);
  }
}
