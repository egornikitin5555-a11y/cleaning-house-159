// DOM Elements
const header = document.getElementById('header');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.getElementById('nav');
const filterBtns = document.querySelectorAll('.filter-btn');
const serviceCards = document.querySelectorAll('.service-card');

// Smooth scroll to form function
function scrollToForm() {
    const formSection = document.querySelector('.contact-form');
    if (formSection) {
        const headerHeight = 80;
        const targetPosition = formSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    nav.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                entry.target.style.transitionDelay = `${delay}ms`;
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with scroll-animate class
    document.querySelectorAll('.scroll-animate').forEach(element => {
        observer.observe(element);
    });

    // Add animation classes to different elements
    document.querySelectorAll('.advantage-card').forEach((card, index) => {
        card.classList.add('scroll-animate');
        if (index % 2 === 0) {
            card.classList.add('slide-left');
        } else {
            card.classList.add('slide-right');
        }
    });

    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.classList.add('scroll-animate');
        if (index % 3 === 0) {
            card.classList.add('slide-left');
        } else if (index % 3 === 1) {
            card.classList.add('slide-right');
        }
    });

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('scroll-animate');
        observer.observe(section);
    });
}

// Theme management
function initThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.setAttribute('aria-label', 'Переключить тему');
    document.body.appendChild(themeToggle);

    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.innerHTML = '☀️';
    }

    // Theme toggle function
    function toggleTheme() {
        const body = document.body;
        const isDark = body.classList.contains('dark');
        
        if (isDark) {
            body.classList.remove('dark');
            themeToggle.innerHTML = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark');
            themeToggle.innerHTML = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    }

    themeToggle.addEventListener('click', toggleTheme);
}

// Header scroll effects
function initHeaderScrollEffects() {
    let lastScrollTop = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolled
        if (scrollTop > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'var(--shadow-md)';
        }

        // Hide/show header on scroll (optional enhancement)
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Enhanced button interactions
function initButtonEnhancements() {
    // Add ripple effect to all buttons
    const buttons = document.querySelectorAll('.btn, .filter-btn, .advantage-card, .service-card');
    
    buttons.forEach(button => {
        // Add loading state simulation
        button.addEventListener('click', function(e) {
            // Add visual feedback for form submission buttons
            if (this.textContent.includes('Заказать') || this.textContent.includes('Отправить')) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });

        // Enhanced hover effects
        button.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    });
}

// Progress indicator for form
function initFormProgress() {
    const form = document.querySelector('form');
    if (!form) return;

    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'form-progress';
    progressBar.innerHTML = '<div class="form-progress-fill"></div>';
    
    const formContainer = form.parentNode;
    formContainer.insertBefore(progressBar, form);

    const inputs = form.querySelectorAll('input, select, textarea');
    const progressFill = progressBar.querySelector('.form-progress-fill');

    function updateProgress() {
        const filledInputs = Array.from(inputs).filter(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                return input.checked;
            }
            return input.value.trim() !== '';
        });

        const progress = (filledInputs.length / inputs.length) * 100;
        progressFill.style.width = `${progress}%`;
    }

    inputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
    });
}

// Service filtering with animations
function initServiceFiltering() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            
            // Animate card filtering
            serviceCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Floating labels for form
function initFloatingLabels() {
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    
    formInputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        // Create floating label
        const label = document.createElement('label');
        label.className = 'floating-label';
        label.textContent = input.getAttribute('placeholder') || input.name;
        input.setAttribute('placeholder', '');
        formGroup.appendChild(label);

        // Handle focus/blur events
        function handleFocus() {
            formGroup.classList.add('focused');
        }

        function handleBlur() {
            if (!input.value) {
                formGroup.classList.remove('focused');
            }
        }

        input.addEventListener('focus', handleFocus);
        input.addEventListener('blur', handleBlur);

        // Check initial state
        if (input.value) {
            formGroup.classList.add('focused');
        }
    });
}

// Add smooth reveal animation for images
function initImageReveal() {
    const images = document.querySelectorAll('img, video');
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.9)';
        img.style.transition = 'all 0.6s ease';
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                    imageObserver.unobserve(entry.target);
                }
            });
        });
        
        imageObserver.observe(img);
    });
}

// Add typing effect for hero text (optional enhancement)
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-text h1');
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--primary-500)';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 1000);
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
}

// Add scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
    document.body.appendChild(progressBar);

    const progressFill = progressBar.querySelector('.scroll-progress-fill');

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / windowHeight) * 100;
        progressFill.style.width = `${progress}%`;
    });
}

// Initialize all enhancements when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation to body
    document.body.classList.add('loaded');
    
    // Initialize all features
    initScrollAnimations();
    initThemeToggle();
    initHeaderScrollEffects();
    initButtonEnhancements();
    initFormProgress();
    initServiceFiltering();
    initFloatingLabels();
    initImageReveal();
    initScrollProgress();
    
    // Optional: Uncomment to enable typing effect
    // initTypingEffect();
    
    // Add fade-in animation to main sections
    setTimeout(() => {
        document.querySelectorAll('.hero, .advantages, .services').forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 100);
});

// Enhanced mobile menu with animations
function initMobileMenu() {
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on nav links
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target)) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
}

// Call mobile menu initialization
initMobileMenu();

// Add parallax effect to hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Initialize parallax effect
initParallaxEffect();

// Enhanced error handling for better UX
function initErrorHandling() {
    // Handle failed image loads
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Failed to load image:', this.src);
        });
    });

    // Handle failed video loads
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Failed to load video:', this.src);
        });
    });
}

// Initialize error handling
initErrorHandling();

// Performance optimization: lazy load heavy content
function initLazyLoading() {
    // Lazy load videos
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.load();
                    videoObserver.unobserve(video);
                }
            });
        });
        videoObserver.observe(video);
    });
}

// Initialize lazy loading
initLazyLoading();