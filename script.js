// ============================================
// Mobile Navigation Toggle
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    
    if (burger && nav) {
        burger.addEventListener('click', function() {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                burger.classList.remove('active');
                nav.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = nav.contains(event.target);
            const isClickOnBurger = burger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnBurger && nav.classList.contains('active')) {
                burger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }
});

// ============================================
// Smooth Scrolling for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default if it's just "#"
        if (href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Header Shadow on Scroll
// ============================================
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    
    if (window.scrollY > 50) {
        header.style.boxShadow = '0px 4px 16px rgba(0, 87, 255, 0.12)';
    } else {
        header.style.boxShadow = '0px 4px 12px rgba(0, 87, 255, 0.08)';
    }
});

// ============================================
// Animate on Scroll (Simple Fade-In)
// ============================================
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function handleScrollAnimation() {
    const animatedElements = document.querySelectorAll('.service-card, .feature-card, .stat-item');
    
    animatedElements.forEach(element => {
        if (isElementInViewport(element)) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animation on page load
window.addEventListener('load', function() {
    const animatedElements = document.querySelectorAll('.service-card, .feature-card, .stat-item');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    handleScrollAnimation();
});

window.addEventListener('scroll', handleScrollAnimation);

// ============================================
// Counter Animation for Stats
// ============================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60 FPS
    
    const timer = setInterval(() => {
        start += increment;
        
        if (start >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(start));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    }
    return num.toString();
}

// Trigger counter animation when stats section is in view
let statsAnimated = false;

function checkStatsSection() {
    const statsSection = document.querySelector('.stats');
    
    if (!statsAnimated && statsSection && isElementInViewport(statsSection)) {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            const suffix = text.replace(/[0-9]/g, '');
            
            stat.dataset.suffix = suffix;
            
            // Custom animation based on value
            if (number >= 1000) {
                animateCounter(stat, number, 2000);
                stat.textContent += suffix;
            } else {
                animateCounter(stat, number, 1500);
                stat.textContent += suffix;
            }
        });
        
        statsAnimated = true;
    }
}

window.addEventListener('scroll', checkStatsSection);
window.addEventListener('load', checkStatsSection);

// ============================================
// Contact Form Handler (if added later)
// ============================================
function handleFormSubmit(event) {
    event.preventDefault();
    
    // You can add form submission logic here
    alert('Спасибо за обращение! Мы свяжемся с вами в ближайшее время.');
}

// ============================================
// Enhanced Console Message for GitHub Pages
// ============================================
console.log('%c🏠 Чистый Дом 159', 'font-size: 24px; font-weight: bold; color: #0057FF;');
console.log('%c🚀 Сайт размещен на GitHub Pages', 'font-size: 16px; color: #28a745;');
console.log('%c⚙️ Создано с помощью MiniMax Agent', 'font-size: 12px; color: #4A5568;');

// Check if running on GitHub Pages
if (window.location.hostname.includes('github.io')) {
    console.log('%c✅ GitHub Pages: Активен', 'font-size: 14px; color: #28a745; font-weight: bold;');
}