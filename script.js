// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        
        // Если ссылка на начало страницы
        if (href === '#' || href === '#top') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const nav = document.getElementById('nav');

if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
}

// Service filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const serviceCards = document.querySelectorAll('.service-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter services
        const category = button.getAttribute('data-category');
        
        serviceCards.forEach(card => {
            if (category === 'all') {
                card.classList.remove('hidden');
            } else {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            }
        });
    });
});

// Form submission
const orderForm = document.getElementById('orderForm');

if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(orderForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.phone || !data.service) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        if (!data.privacy) {
            alert('Необходимо согласие с политикой обработки персональных данных');
            return;
        }
        
        // Here you would normally send data to server
        console.log('Form data:', data);
        
        // Show success message
        alert('Спасибо за заявку! Мы свяжемся с вами в течение 15 минут.');
        
        // Reset form
        orderForm.reset();
    });
}

// Phone number formatting
const phoneInput = document.getElementById('phone');

if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value[0] === '8' || value[0] === '7') {
                value = '7' + value.substring(1);
            }
            
            let formatted = '+7';
            if (value.length > 1) {
                formatted += ' (' + value.substring(1, 4);
            }
            if (value.length >= 5) {
                formatted += ') ' + value.substring(4, 7);
            }
            if (value.length >= 8) {
                formatted += '-' + value.substring(7, 9);
            }
            if (value.length >= 10) {
                formatted += '-' + value.substring(9, 11);
            }
            
            e.target.value = formatted;
        }
    });
}

// Scroll to form function (делаем глобальной для использования в onclick)
window.scrollToForm = function() {
    const form = document.getElementById('contact');
    if (form) {
        const headerOffset = 80;
        const elementPosition = form.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Header scroll effect
let lastScroll = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 4px 12px rgba(0, 170, 181, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations - DISABLED for better performance
/*
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

// Observe service cards, advantage cards, etc.
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .advantage-card, .promo-card, .step, .team-image'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
});
*/

// Price calculator (optional enhancement)
function calculatePrice(service, area) {
    const prices = {
        'supporting': 80,
        'general': 120,
        'complex': 150,
        'after-repair': 120,
        'windows': 400,
        'office': 60,
        'construction': 30
    };
    
    const pricePerSqm = prices[service] || 100;
    const basePrice = pricePerSqm * area;
    const minPrice = 3000;
    
    return Math.max(basePrice, minPrice);
}

// Area input enhancement
const areaInput = document.getElementById('area');
const serviceSelect = document.getElementById('service');

if (areaInput && serviceSelect) {
    const updatePriceEstimate = () => {
        const service = serviceSelect.value;
        const area = parseFloat(areaInput.value);
        
        if (service && area && area > 0) {
            const estimate = calculatePrice(service, area);
            console.log(`Estimated price: ${estimate} ₽`);
            // You could display this estimate in the UI
        }
    };
    
    areaInput.addEventListener('input', updatePriceEstimate);
    serviceSelect.addEventListener('change', updatePriceEstimate);
}

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}


// ========== 3D & IMMERSIVE EFFECTS ==========

// Parallax effect for hero section
const hero = document.querySelector('.hero');
const heroText = document.querySelector('.hero-text');
const heroImage = document.querySelector('.hero-image');

if (hero && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const moveX = (mouseX - 0.5) * 30;
        const moveY = (mouseY - 0.5) * 30;
        
        if (heroText) {
            heroText.style.transform = `translateX(${-moveX}px) translateY(${-moveY}px)`;
        }
        
        if (heroImage) {
            heroImage.style.transform = `translateX(${moveX * 0.5}px) translateY(${moveY * 0.5}px)`;
        }
    });
}

// 3D tilt effect for cards on mouse move
function add3DTiltEffect(selector) {
    const cards = document.querySelectorAll(selector);
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
        
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return; // Skip on mobile
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-8px)
                scale3d(1.02, 1.02, 1.02)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale3d(1, 1, 1)';
        });
    });
}

// Apply 3D tilt to all cards
document.addEventListener('DOMContentLoaded', () => {
    add3DTiltEffect('.service-card');
    add3DTiltEffect('.advantage-card');
    add3DTiltEffect('.promo-card');
});

// Smooth parallax scroll for sections
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.parallax || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Enhanced reveal animations with 3D effects - DISABLED for better performance
/*
const enhancedObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Observe sections for reveal
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px) scale(0.95)';
        section.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        enhancedObserver.observe(section);
    });
});
*/

// Cursor glow effect for interactive elements
const createCursorGlow = () => {
    if (window.innerWidth <= 768) return; // Skip on mobile
    
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 170, 181, 0.1) 0%, transparent 70%);
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        mix-blend-mode: screen;
    `;
    document.body.appendChild(glow);
    
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        glow.style.opacity = '1';
    });
    
    // Smooth follow animation
    function animateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        
        glow.style.left = `${glowX - 150}px`;
        glow.style.top = `${glowY - 150}px`;
        
        requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
    
    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });
};

// Initialize cursor glow
if (window.innerWidth > 768) {
    createCursorGlow();
}

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Magnetic effect for buttons
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    if (window.innerWidth <= 768) return; // Skip on mobile
    
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0) scale(1)';
    });
});

// Floating animation for hero features
document.addEventListener('DOMContentLoaded', () => {
    const features = document.querySelectorAll('.hero-feature');
    features.forEach((feature, index) => {
        feature.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
    });
});

console.log('🎨 3D & Immersive effects loaded successfully!');
