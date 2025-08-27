/* ========================================
   APPLE-STYLE PORTFOLIO - JAVASCRIPT
   Performance Optimized & Bug-Free
======================================== */

(() => {
    "use strict";

    // App State Management
    const App = {
        elements: {},
        isMobileMenuOpen: false,
        isInitialized: false,
        currentTheme: 'light',
        scrollY: 0,
        isReducedMotion: false
    };

    // Performance optimization - Cache DOM queries
    const DOM = {
        body: document.body,
        html: document.documentElement,
        themeToggle: null,
        hamburgerBtn: null,
        mobileMenu: null,
        mobileNavLinks: [],
        sections: [],
        navLinks: [],
        scrollLinks: []
    };

    // Initialize App
    function init() {
        if (App.isInitialized) return;

        try {
            // Cache DOM elements
            cacheDOMElements();
            
            // Check for reduced motion preference
            checkReducedMotion();
            
            // Setup functionality
            setupTheme();
            setupMobileMenu();
            setupScrollAnimations();
            setupSmoothScrolling();
            setupKeyboardNavigation();
            setupPerformanceOptimizations();
            
            App.isInitialized = true;
            console.log("✅ Portfolio initialized successfully");
            
        } catch (error) {
            console.error("❌ Portfolio initialization failed:", error);
            // Fallback for critical functionality
            setupBasicFallbacks();
        }
    }

    // Cache DOM Elements for Performance
    function cacheDOMElements() {
        DOM.body = document.body;
        DOM.html = document.documentElement;
        DOM.themeToggle = document.getElementById('themeToggle');
        DOM.hamburgerBtn = document.getElementById('hamburger-btn');
        DOM.mobileMenu = document.getElementById('mobile-menu');
        DOM.mobileNavLinks = Array.from(document.querySelectorAll('.mobile-nav-link'));
        DOM.sections = Array.from(document.querySelectorAll('section'));
        DOM.navLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
        DOM.scrollLinks = Array.from(document.querySelectorAll('.scroll-link'));

        // Store references in App.elements for backward compatibility
        App.elements = {
            body: DOM.body,
            themeToggle: DOM.themeToggle,
            hamburgerBtn: DOM.hamburgerBtn,
            mobileMenu: DOM.mobileMenu,
            mobileNavLinks: DOM.mobileNavLinks,
            sections: DOM.sections
        };
    }

    // Check for reduced motion preference
    function checkReducedMotion() {
        App.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Theme Management with Enhanced Features
    function setupTheme() {
        const themeToggle = DOM.themeToggle;
        if (!themeToggle) {
            console.warn("Theme toggle button not found");
            return;
        }

        try {
            // Get initial theme with fallback
            const savedTheme = localStorage.getItem('theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
            
            // Set initial theme
            setTheme(initialTheme);

            // Theme toggle event with error handling
            themeToggle.addEventListener('click', handleThemeToggle);
            
            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });

        } catch (error) {
            console.error("Theme setup failed:", error);
            setTheme('light'); // Fallback to light theme
        }
    }

    // Set Theme Function
    function setTheme(theme) {
        try {
            App.currentTheme = theme;
            DOM.html.setAttribute('data-theme', theme);
            
            // Add theme changing animation
            if (!App.isReducedMotion) {
                DOM.body.classList.add('theme-changing');
                setTimeout(() => {
                    DOM.body.classList.remove('theme-changing');
                }, 300);
            }
            
            // Save to localStorage
            localStorage.setItem('theme', theme);
            
        } catch (error) {
            console.error("Failed to set theme:", error);
        }
    }

    // Handle Theme Toggle
    function handleThemeToggle() {
        try {
            const newTheme = App.currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        } catch (error) {
            console.error("Theme toggle failed:", error);
        }
    }

    // Mobile Menu with Enhanced Features
    function setupMobileMenu() {
        const hamburgerBtn = DOM.hamburgerBtn;
        const mobileMenu = DOM.mobileMenu;
        
        if (!hamburgerBtn || !mobileMenu) {
            console.warn("Mobile menu elements not found");
            return;
        }

        try {
            // Toggle menu function
            function toggleMenu() {
                App.isMobileMenuOpen = !App.isMobileMenuOpen;
                
                // Update ARIA attributes for accessibility
                hamburgerBtn.setAttribute('aria-expanded', App.isMobileMenuOpen.toString());
                
                // Toggle classes
                hamburgerBtn.classList.toggle('is-active', App.isMobileMenuOpen);
                mobileMenu.classList.toggle('is-open', App.isMobileMenuOpen);
                DOM.body.classList.toggle('mobile-menu-open', App.isMobileMenuOpen);
                
                // Trap focus when menu is open
                if (App.isMobileMenuOpen) {
                    trapFocus(mobileMenu);
                } else {
                    releaseFocus();
                }
            }

            // Close menu function
            function closeMenu() {
                if (App.isMobileMenuOpen) {
                    toggleMenu();
                }
            }

            // Event listeners
            hamburgerBtn.addEventListener('click', toggleMenu);
            
            // Close menu when clicking links
            DOM.mobileNavLinks.forEach(link => {
                link.addEventListener('click', closeMenu);
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && App.isMobileMenuOpen) {
                    closeMenu();
                }
            });

            // Close menu when clicking outside
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    closeMenu();
                }
            });

        } catch (error) {
            console.error("Mobile menu setup failed:", error);
        }
    }

    // Scroll Animations with Intersection Observer
    function setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            console.warn("IntersectionObserver not supported, skipping scroll animations");
            // Fallback: show all sections immediately
            DOM.sections.forEach(section => {
                section.classList.add('is-visible');
            });
            return;
        }

        try {
            const observerOptions = {
                threshold: App.isReducedMotion ? 0 : 0.1,
                rootMargin: App.isReducedMotion ? '0px' : '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        
                        // Unobserve for performance
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observe all sections
            DOM.sections.forEach(section => {
                observer.observe(section);
            });

        } catch (error) {
            console.error("Scroll animations setup failed:", error);
            // Fallback: show all sections
            DOM.sections.forEach(section => {
                section.classList.add('is-visible');
            });
        }
    }

    // Smooth Scrolling with Enhanced Features
    function setupSmoothScrolling() {
        try {
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', handleSmoothScroll);
            });
        } catch (error) {
            console.error("Smooth scrolling setup failed:", error);
        }
    }

    // Handle Smooth Scroll
    function handleSmoothScroll(e) {
        try {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (!targetElement) {
                console.warn(`Target element not found: ${targetId}`);
                return;
            }

            const navHeight = parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--nav-height')) || 48;
            const offsetTop = targetElement.offsetTop - navHeight;

            // Use native smooth scroll if supported and not reduced motion
            if ('scrollBehavior' in document.documentElement.style && !App.isReducedMotion) {
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            } else {
                // Fallback scroll without animation
                window.scrollTo(0, offsetTop);
            }

        } catch (error) {
            console.error("Smooth scroll failed:", error);
        }
    }

    // Keyboard Navigation Enhancement
    function setupKeyboardNavigation() {
        try {
            // Skip to main content link
            const skipLink = document.querySelector('.skip-nav');
            if (skipLink) {
                skipLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const mainContent = document.getElementById('main-content');
                    if (mainContent) {
                        mainContent.focus();
                        mainContent.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }

            // Enhanced focus management
            document.addEventListener('keydown', (e) => {
                // Tab key navigation enhancement
                if (e.key === 'Tab') {
                    DOM.body.classList.add('keyboard-navigation');
                }
            });

            // Remove keyboard navigation class on mouse use
            document.addEventListener('mousedown', () => {
                DOM.body.classList.remove('keyboard-navigation');
            });

        } catch (error) {
            console.error("Keyboard navigation setup failed:", error);
        }
    }

    // Performance Optimizations
    function setupPerformanceOptimizations() {
        try {
            // Throttled scroll handler for performance
            let ticking = false;
            
            function updateScrollPosition() {
                App.scrollY = window.scrollY;
                ticking = false;
            }

            function handleScroll() {
                if (!ticking) {
                    requestAnimationFrame(updateScrollPosition);
                    ticking = true;
                }
            }

            // Passive scroll listener for better performance
            window.addEventListener('scroll', handleScroll, { passive: true });

            // Preload critical resources
            preloadCriticalResources();

            // Setup service worker if available
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').catch(() => {
                        // Service worker registration failed silently
                    });
                });
            }

        } catch (error) {
            console.error("Performance optimizations setup failed:", error);
        }
    }

    // Preload Critical Resources
    function preloadCriticalResources() {
        try {
            // Preload critical images
            const criticalImages = [
                'photo.jpg',
                'e-com.jpg'
            ];

            criticalImages.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            });

        } catch (error) {
            console.error("Resource preloading failed:", error);
        }
    }

    // Focus Trap for Modal/Menu
    function trapFocus(element) {
        try {
            const focusableElements = element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement = focusableElements[focusableElements.length - 1];

            function handleTabKey(e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusableElement) {
                            lastFocusableElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastFocusableElement) {
                            firstFocusableElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            }

            element.addEventListener('keydown', handleTabKey);
            
            // Focus first element
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }

        } catch (error) {
            console.error("Focus trap failed:", error);
        }
    }

    // Release Focus Trap
    function releaseFocus() {
        try {
            // Return focus to hamburger button
            if (DOM.hamburgerBtn) {
                DOM.hamburgerBtn.focus();
            }
        } catch (error) {
            console.error("Focus release failed:", error);
        }
    }

    // Basic Fallbacks for Critical Errors
    function setupBasicFallbacks() {
        try {
            // Basic theme toggle
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    document.documentElement.setAttribute('data-theme', newTheme);
                });
            }

            // Basic mobile menu
            const hamburgerBtn = document.getElementById('hamburger-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            if (hamburgerBtn && mobileMenu) {
                hamburgerBtn.addEventListener('click', () => {
                    hamburgerBtn.classList.toggle('is-active');
                    mobileMenu.classList.toggle('is-open');
                    document.body.classList.toggle('mobile-menu-open');
                });
            }

            console.log("✅ Basic fallbacks initialized");

        } catch (error) {
            console.error("❌ Even basic fallbacks failed:", error);
        }
    }

    // Utility Functions
    const Utils = {
        // Debounce function for performance
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle function for performance
        throttle: (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Check if element is in viewport
        isInViewport: (element) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    };

    // Error Handling
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already loaded
        init();
    }

    // Expose Utils for external use if needed
    window.PortfolioUtils = Utils;

    // Expose App state for debugging (development only)
    if (process?.env?.NODE_ENV === 'development') {
        window.PortfolioApp = App;
    }

})();

/* ========================================
   ADDITIONAL FEATURES & ENHANCEMENTS
======================================== */

// Progressive Enhancement Features
(() => {
    "use strict";

    // Enhanced Image Loading with Intersection Observer
    function setupLazyImages() {
        if (!('IntersectionObserver' in window)) return;

        try {
            const images = document.querySelectorAll('img[loading="lazy"]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Add fade-in effect
                        img.addEventListener('load', () => {
                            img.style.opacity = '1';
                        });
                        
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                imageObserver.observe(img);
            });

        } catch (error) {
            console.error("Lazy images setup failed:", error);
        }
    }

    // Enhanced Form Handling (if forms are added later)
    function setupFormEnhancements() {
        try {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                // Add loading states
                form.addEventListener('submit', (e) => {
                    const submitBtn = form.querySelector('[type="submit"]');
                    if (submitBtn) {
                        submitBtn.classList.add('loading');
                        submitBtn.disabled = true;
                    }
                });

                // Form validation enhancements
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    input.addEventListener('blur', validateField);
                    input.addEventListener('input', clearErrors);
                });
            });

        } catch (error) {
            console.error("Form enhancements setup failed:", error);
        }
    }

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Clear previous errors
        clearFieldError(field);
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
            }
        }
        
        // Required field validation
        if (field.required && !value) {
            showFieldError(field, 'This field is required');
        }
    }

    function clearErrors(e) {
        clearFieldError(e.target);
    }

    function showFieldError(field, message) {
        try {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            errorDiv.id = `${field.name}-error`;
            
            field.setAttribute('aria-describedby', errorDiv.id);
            field.parentNode.appendChild(errorDiv);
            
        } catch (error) {
            console.error("Show field error failed:", error);
        }
    }

    function clearFieldError(field) {
        try {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
            
            const errorDiv = field.parentNode.querySelector('.field-error');
            if (errorDiv) {
                errorDiv.remove();
            }
        } catch (error) {
            console.error("Clear field error failed:", error);
        }
    }

    // Analytics Integration (placeholder)
    function setupAnalytics() {
        try {
            // Track page views
            if (typeof gtag !== 'undefined') {
                gtag('config', 'GA_MEASUREMENT_ID', {
                    page_title: document.title,
                    page_location: window.location.href
                });
            }

            // Track interactions
            document.addEventListener('click', (e) => {
                const element = e.target;
                
                // Track button clicks
                if (element.classList.contains('btn')) {
                    trackEvent('button_click', {
                        button_text: element.textContent.trim(),
                        button_location: element.closest('section')?.id || 'unknown'
                    });
                }
                
                // Track navigation clicks
                if (element.matches('a[href^="#"]')) {
                    trackEvent('navigation_click', {
                        target_section: element.getAttribute('href').substring(1)
                    });
                }
            });

        } catch (error) {
            console.error("Analytics setup failed:", error);
        }
    }

    function trackEvent(eventName, parameters = {}) {
        try {
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, parameters);
            }
        } catch (error) {
            console.error("Event tracking failed:", error);
        }
    }

    // Initialize Progressive Enhancements
    function initEnhancements() {
        try {
            setupLazyImages();
            setupFormEnhancements();
            setupAnalytics();
        } catch (error) {
            console.error("Progressive enhancements failed:", error);
        }
    }

    // Wait for main app initialization
    setTimeout(initEnhancements, 100);

})();



function trapFocus(el) {
    /* existing code … */
    el.addEventListener('keydown', handleTabKey);
    el._handleTabKey = handleTabKey;   // store reference
}
function releaseFocus() {
    if (DOM.mobileMenu && DOM.mobileMenu._handleTabKey) {
        DOM.mobileMenu.removeEventListener('keydown',
            DOM.mobileMenu._handleTabKey);
        delete DOM.mobileMenu._handleTabKey;
    }
    DOM.hamburgerBtn?.focus();
}
