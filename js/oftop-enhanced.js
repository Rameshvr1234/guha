/**
 * GUHA Promoters - Enhanced Oftop Design System JavaScript
 * Includes: Swiper.js, AOS, Form Validation, and Performance Optimizations
 *
 * @version 2.0.0
 * @author GUHA Promoters Development Team
 */

// ============================================
// PAGE PRELOADER
// ============================================

// Mark document as loading
document.body.classList.add('loading');

// Handle preloader
window.addEventListener('load', function() {
    // Wait for all resources including images and iframes
    setTimeout(function() {
        const preloader = document.getElementById('preloader');

        // Add loaded class to trigger fade out
        if (preloader) {
            preloader.classList.add('loaded');
        }

        // Remove loading class from body
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');

        // Remove preloader from DOM after animation
        setTimeout(function() {
            if (preloader) {
                preloader.remove();
            }
        }, 500);
    }, 500); // Small delay to ensure smooth experience
});

// ============================================
// INITIALIZE ON DOM LOADED
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: false
        });
    }

    // Initialize all components
    initMobileMenu();
    initStickyNav();
    initBackToTop();
    initHeroSlider();
    initPropertySlider();
    initSmoothScroll();
    initFormValidation();
    initContactForm();
    initLazyLoading();
    initStatisticsCounter();
    initAccordion();
    initLightbox();
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================

function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (!mobileMenuToggle || !navMenu) return;

    function openMenu() {
        navMenu.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    }

    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !mobileMenuToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Close mobile menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    // Close menu on resize if window becomes larger
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ============================================
// STICKY NAVIGATION ON SCROLL
// ============================================

function initStickyNav() {
    const mainNav = document.getElementById('mainNav');
    if (!mainNav) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const currentScroll = window.pageYOffset;

                if (currentScroll > 100) {
                    mainNav.classList.add('scrolled');
                } else {
                    mainNav.classList.remove('scrolled');
                }

                lastScroll = currentScroll;
                ticking = false;
            });

            ticking = true;
        }
    });
}

// ============================================
// HERO SLIDER WITH SWIPER.JS
// ============================================

function initHeroSlider() {
    // Check if we're using Swiper or custom slider
    const swiperContainer = document.querySelector('.hero-swiper');

    if (swiperContainer && typeof Swiper !== 'undefined') {
        // Use Swiper.js
        const heroSwiper = new Swiper('.hero-swiper', {
            loop: true,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            keyboard: {
                enabled: true,
            },
            a11y: {
                prevSlideMessage: 'Previous slide',
                nextSlideMessage: 'Next slide',
            }
        });

        // Pause on hover
        swiperContainer.addEventListener('mouseenter', function() {
            heroSwiper.autoplay.stop();
        });

        swiperContainer.addEventListener('mouseleave', function() {
            heroSwiper.autoplay.start();
        });
    } else {
        // Use custom slider (existing implementation)
        initCustomHeroSlider();
    }
}

// ============================================
// CUSTOM HERO SLIDER (FALLBACK)
// ============================================

let slideIndex = 1;
let slideTimer;
let isTransitioning = false;

function initCustomHeroSlider() {
    if (!document.querySelector('.hero-slider')) return;

    // Initialize YouTube player API for better video control
    initYouTubePlayer();

    // Show first slide with smooth entrance
    showSlides(slideIndex, true);

    // Wait for page to fully load before starting auto-slide
    window.addEventListener('load', function() {
        setTimeout(function() {
            autoSlide();
        }, 1000); // Wait 1 second after page load to start auto-sliding
    });

    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    });

    // Pause on hover
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', function() {
            clearTimeout(slideTimer);
        });

        heroSlider.addEventListener('mouseleave', function() {
            autoSlide();
        });
    }
}

// Initialize YouTube Player API
function initYouTubePlayer() {
    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Lazy load YouTube video iframe after page loads
    window.addEventListener('load', function() {
        setTimeout(function() {
            const heroVideo = document.getElementById('heroVideo');
            if (heroVideo && heroVideo.dataset.src) {
                heroVideo.src = heroVideo.dataset.src;
                heroVideo.removeAttribute('data-src');
            }
        }, 800); // Wait 800ms after page load to start video
    });
}

function changeSlide(n) {
    if (isTransitioning) return; // Prevent overlapping transitions
    clearTimeout(slideTimer);
    showSlides(slideIndex += n);
    autoSlide();
}

function currentSlide(n) {
    if (isTransitioning) return; // Prevent overlapping transitions
    clearTimeout(slideTimer);
    showSlides(slideIndex = n);
    autoSlide();
}

function showSlides(n, isInitial = false) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');

    if (!slides.length) return;

    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;

    // Set transitioning flag
    isTransitioning = true;

    // Get current and next slides
    const currentSlide = document.querySelector('.hero-slide.active');
    const nextSlide = slides[slideIndex - 1];

    // Remove active class from all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    // Update dots
    if (dots.length) {
        dots.forEach(dot => {
            dot.classList.remove('active');
            dot.setAttribute('aria-pressed', 'false');
        });
        dots[slideIndex - 1].classList.add('active');
        dots[slideIndex - 1].setAttribute('aria-pressed', 'true');
    }

    // Add active class with smooth transition
    if (isInitial) {
        // First load - no transition needed
        nextSlide.classList.add('active');
        setTimeout(function() {
            isTransitioning = false;
        }, 100);
    } else {
        // Smooth crossfade between slides
        nextSlide.style.opacity = '0';
        nextSlide.classList.add('active');

        // Trigger reflow
        nextSlide.offsetHeight;

        // Fade in next slide
        setTimeout(function() {
            nextSlide.style.opacity = '1';
        }, 50);

        // Remove inline styles after transition
        setTimeout(function() {
            nextSlide.style.opacity = '';
            isTransitioning = false;
        }, 1050); // Match CSS transition duration (1s) + buffer
    }

    // Animate hero content
    animateHeroContent(nextSlide);
}

function animateHeroContent(slide) {
    const heroContent = slide.querySelector('.hero-content-inner');
    if (heroContent) {
        // Reset animation
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';

        // Trigger animation
        setTimeout(function() {
            heroContent.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300); // Start after slide transition begins
    }
}

function autoSlide() {
    clearTimeout(slideTimer);
    slideTimer = setTimeout(function() {
        if (!isTransitioning) {
            slideIndex++;
            showSlides(slideIndex);
            autoSlide();
        } else {
            // If still transitioning, wait a bit more
            setTimeout(autoSlide, 500);
        }
    }, 7000); // Changed from 6000 to 7000ms for better pacing
}

// ============================================
// PROPERTY SLIDER WITH SWIPER.JS
// ============================================

function initPropertySlider() {
    if (typeof Swiper !== 'undefined' && document.querySelector('.property-swiper')) {
        const propertySwiper = new Swiper('.property-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
            }
        });
    }
}

// ============================================
// SMOOTH SCROLL BEHAVIOR
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without scrolling
                history.pushState(null, null, href);
            }
        });
    });
}

// ============================================
// BACK TO TOP BUTTON
// ============================================

function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// FORM VALIDATION
// ============================================

function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

            // Clear previous errors
            form.querySelectorAll('.error-message').forEach(msg => msg.remove());
            form.querySelectorAll('.error').forEach(input => input.classList.remove('error'));

            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Submit form
                submitForm(form);
            }
        });

        // Real-time validation
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
    input.classList.remove('error');

    // Check if empty
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Min length
    if (input.hasAttribute('minlength')) {
        const minLength = parseInt(input.getAttribute('minlength'));
        if (value.length < minLength) {
            isValid = false;
            errorMessage = `Minimum ${minLength} characters required`;
        }
    }

    if (!isValid) {
        input.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        errorDiv.setAttribute('role', 'alert');
        input.parentElement.appendChild(errorDiv);
    }

    return isValid;
}

function submitForm(form) {
    const formData = new FormData(form);

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Send AJAX request to PHP backend
    fetch('ajax/sendemail.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(data.message, 'success');
            form.reset();

            // Clear any validation errors
            form.querySelectorAll('.error-message').forEach(msg => msg.remove());
            form.querySelectorAll('.error').forEach(input => input.classList.remove('error'));
        } else {
            showNotification(data.message, 'error');
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        showNotification('Sorry, something went wrong. Please try again or call us at +91-9366624545.', 'error');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    });
}

// ============================================
// CONTACT FORM SPECIFIC HANDLER
// ============================================

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;
        const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
        const consentCheckbox = document.getElementById('consent');

        // Clear previous errors
        contactForm.querySelectorAll('.error-message').forEach(msg => {
            msg.textContent = '';
            msg.style.display = 'none';
        });
        contactForm.querySelectorAll('.error').forEach(input => input.classList.remove('error'));

        // Validate all required inputs
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        // Special validation for consent checkbox
        if (consentCheckbox && !consentCheckbox.checked) {
            isValid = false;
            const errorMsg = consentCheckbox.parentElement.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.textContent = 'You must agree to receive communications';
                errorMsg.style.display = 'block';
            }
        }

        if (isValid) {
            submitForm(contactForm);
        } else {
            // Scroll to first error
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });

    // Real-time validation
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });

        // Clear error on input
        input.addEventListener('input', function() {
            const errorMsg = this.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.textContent = '';
                errorMsg.style.display = 'none';
            }
            this.classList.remove('error');
        });
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" aria-label="Close">&times;</button>
    `;

    document.body.appendChild(notification);

    // Add CSS if not exists
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 9999;
                animation: slideInRight 0.3s ease-out;
            }
            .notification-success { border-left: 4px solid #10b981; }
            .notification-error { border-left: 4px solid #ef4444; }
            .notification i { font-size: 1.5rem; }
            .notification-success i { color: #10b981; }
            .notification-error i { color: #ef4444; }
            .notification button {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                opacity: 0.5;
                transition: opacity 0.2s;
            }
            .notification button:hover { opacity: 1; }
            @keyframes slideInRight {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // Auto remove after 5 seconds
    setTimeout(function() {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 5000);
}

// ============================================
// LAZY LOADING IMAGES
// ============================================

function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }

                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }

                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// ============================================
// STATISTICS COUNTER ANIMATION
// ============================================

function initStatisticsCounter() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const speed = 200;

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
}

// ============================================
// ACCORDION FUNCTIONALITY
// ============================================

function initAccordion() {
    // Make toggleAccordion globally available
    window.toggleAccordion = function(header) {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');

        // Close all accordion items
        document.querySelectorAll('.accordion-item').forEach(i => {
            i.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    };
}

// ============================================
// LIGHTBOX GALLERY
// ============================================

function initLightbox() {
    const galleryItems = document.querySelectorAll('[data-lightbox]');

    if (!galleryItems.length) return;

    // Create lightbox HTML
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <button class="lightbox-prev" aria-label="Previous image">&lt;</button>
        <button class="lightbox-next" aria-label="Next image">&gt;</button>
        <div class="lightbox-content">
            <img src="" alt="">
        </div>
    `;
    document.body.appendChild(lightbox);

    // Add CSS
    if (!document.getElementById('lightbox-styles')) {
        const style = document.createElement('style');
        style.id = 'lightbox-styles';
        style.textContent = `
            .lightbox {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                align-items: center;
                justify-content: center;
            }
            .lightbox.active { display: flex; }
            .lightbox-content img {
                max-width: 90vw;
                max-height: 90vh;
                object-fit: contain;
            }
            .lightbox-close, .lightbox-prev, .lightbox-next {
                position: absolute;
                background: rgba(255,255,255,0.1);
                border: 2px solid rgba(255,255,255,0.3);
                color: white;
                font-size: 2rem;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                transition: all 0.3s;
            }
            .lightbox-close { top: 20px; right: 20px; }
            .lightbox-prev { left: 20px; top: 50%; transform: translateY(-50%); }
            .lightbox-next { right: 20px; top: 50%; transform: translateY(-50%); }
            .lightbox-close:hover, .lightbox-prev:hover, .lightbox-next:hover {
                background: rgba(255,255,255,0.2);
            }
        `;
        document.head.appendChild(style);
    }

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => item.dataset.lightbox || item.src);

    function showImage(index) {
        const img = lightbox.querySelector('img');
        img.src = images[index];
        currentIndex = index;
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            lightbox.classList.add('active');
            showImage(index);
            document.body.style.overflow = 'hidden';
        });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    });

    lightbox.querySelector('.lightbox-prev').addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });

    lightbox.querySelector('.lightbox-next').addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        } else if (e.key === 'ArrowLeft') {
            lightbox.querySelector('.lightbox-prev').click();
        } else if (e.key === 'ArrowRight') {
            lightbox.querySelector('.lightbox-next').click();
        }
    });
}

// ============================================
// SCROLL ANIMATIONS
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

// Observe animated elements
document.querySelectorAll('.card, .stat-item, .property-card, .split-layout, .team-card').forEach(el => {
    observer.observe(el);
});

// ============================================
// PERFORMANCE MONITORING
// ============================================

// Log performance metrics (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;

            console.log('%c GUHA Promoters Performance Metrics ', 'background: #1B2A47; color: #C97659; font-size: 14px; padding: 5px;');
            console.table({
                'Page Load Time': `${pageLoadTime}ms`,
                'Server Connect Time': `${connectTime}ms`,
                'Render Time': `${renderTime}ms`
            });
        }, 0);
    });
}

// ============================================
// CONSOLE BRANDING
// ============================================

console.log('%c GUHA Promoters ', 'background: #1B2A47; color: #C97659; font-size: 20px; padding: 10px;');
console.log('%c Oftop Design System v2.0 Loaded Successfully ✓ ', 'background: #C97659; color: white; font-size: 12px; padding: 5px;');
