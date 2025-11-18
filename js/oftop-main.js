/**
 * GUHA Promoters - Oftop Design System JavaScript
 * Main JavaScript file for interactions and animations
 */

// ============================================
// MOBILE MENU TOGGLE
// ============================================

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        const isExpanded = navMenu.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);

        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });

    // Close mobile menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });
}

// ============================================
// STICKY NAVIGATION ON SCROLL
// ============================================

const mainNav = document.getElementById('mainNav');

if (mainNav) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ============================================
// HERO SLIDER FUNCTIONALITY
// ============================================

let slideIndex = 1;
let slideTimer;

// Initialize slider if exists
if (document.querySelector('.hero-slider')) {
    showSlides(slideIndex);
    autoSlide();
}

// Next/previous controls
function changeSlide(n) {
    clearTimeout(slideTimer);
    showSlides(slideIndex += n);
    autoSlide();
}

// Dot controls
function currentSlide(n) {
    clearTimeout(slideTimer);
    showSlides(slideIndex = n);
    autoSlide();
}

// Show slides
function showSlides(n) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');

    if (!slides.length) return;

    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }

    // Hide all slides and remove active class
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Remove active class from all dots
    if (dots.length) {
        dots.forEach(dot => {
            dot.classList.remove('active');
            dot.setAttribute('aria-pressed', 'false');
        });
    }

    // Show current slide and activate corresponding dot
    slides[slideIndex - 1].classList.add('active');
    if (dots.length) {
        dots[slideIndex - 1].classList.add('active');
        dots[slideIndex - 1].setAttribute('aria-pressed', 'true');
    }
}

// Auto slide every 6 seconds
function autoSlide() {
    slideTimer = setTimeout(() => {
        slideIndex++;
        showSlides(slideIndex);
        autoSlide();
    }, 6000);
}

// Pause auto-slide on hover
const heroSlider = document.querySelector('.hero-slider');
if (heroSlider) {
    heroSlider.addEventListener('mouseenter', () => {
        clearTimeout(slideTimer);
    });

    heroSlider.addEventListener('mouseleave', () => {
        autoSlide();
    });
}

// Keyboard navigation for slider
document.addEventListener('keydown', (e) => {
    if (!heroSlider) return;

    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// ============================================
// SMOOTH SCROLL BEHAVIOR
// ============================================

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// BACK TO TOP BUTTON
// ============================================

const backToTop = document.getElementById('backToTop');

if (backToTop) {
    // Show/hide back to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Scroll to top on click
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// SCROLL ANIMATIONS (FADE IN ON SCROLL)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and stats
const animatedElements = document.querySelectorAll('.card, .stat-item, .property-card, .split-layout');
animatedElements.forEach(el => {
    observer.observe(el);
});

// ============================================
// FORM VALIDATION (Newsletter)
// ============================================

const newsletterForms = document.querySelectorAll('form');

newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');

        if (emailInput && emailInput.value) {
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailRegex.test(emailInput.value)) {
                // Success message (you can customize this)
                alert('Thank you for subscribing! We will keep you updated.');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        }
    });
});

// ============================================
// LAZY LOADING IMAGES
// ============================================

if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ============================================
// PROPERTY CARD HOVER EFFECTS
// ============================================

const propertyCards = document.querySelectorAll('.property-card, .card');

propertyCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ============================================
// STATISTICS COUNTER ANIMATION
// ============================================

const counters = document.querySelectorAll('.stat-number');
const speed = 200; // Animation speed

const countUp = (counter) => {
    const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
    const suffix = counter.textContent.replace(/[0-9]/g, '');
    let count = 0;
    const increment = target / speed;

    const updateCount = () => {
        count += increment;

        if (count < target) {
            counter.textContent = Math.ceil(count) + suffix;
            requestAnimationFrame(updateCount);
        } else {
            counter.textContent = target + suffix;
        }
    };

    updateCount();
};

// Observe statistics and animate when visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target.querySelector('.stat-number');
            if (counter && !counter.classList.contains('counted')) {
                counter.classList.add('counted');
                countUp(counter);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(item => {
    statsObserver.observe(item);
});

// ============================================
// PARALLAX EFFECT FOR HERO SECTIONS
// ============================================

const parallaxElements = document.querySelectorAll('.hero-slide-bg');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach(element => {
        const parent = element.closest('.hero-slider');
        if (parent) {
            const offset = parent.offsetTop;
            const distance = (scrolled - offset);
            element.style.transform = `translateY(${distance * 0.5}px)`;
        }
    });
});

// ============================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ============================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// ============================================
// PRELOADER (Optional)
// ============================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%c GUHA Promoters ', 'background: #1B2A47; color: #C97659; font-size: 20px; padding: 10px;');
console.log('%c Oftop Design System Loaded Successfully ✓ ', 'background: #C97659; color: white; font-size: 12px; padding: 5px;');
