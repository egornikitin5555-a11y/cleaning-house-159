// ========== CONFIGURATION ==========
const CONFIG = {
    headerOffset: 80,
    mobileBreakpoint: 768,
    formSubmitDelay: 15 // минуты до перезвона
};

// ========== UTILITY FUNCTIONS ==========

/**
 * Безопасный querySelector с проверкой на null
 */
function safeQuerySelector(selector, context = document) {
    const element = context.querySelector(selector);
    return element;
}

/**
 * Безопасный querySelectorAll
 */
function safeQuerySelectorAll(selector, context = document) {
    return context.querySelectorAll(selector) || [];
}

/**
 * Проверка на мобильное устройство
 */
function isMobile() {
    return window.innerWidth <= CONFIG.mobileBreakpoint;
}

// ========== SMOOTH SCROLLING ==========

function initSmoothScrolling() {
    safeQuerySelectorAll('a[href^="#"]').forEach(anchor => {
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
            
            const target = safeQuerySelector(href);
            if (target) {
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - CONFIG.headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========== MOBILE MENU ==========

function initMobileMenu() {
    const mobileMenuToggle = safeQuerySelector('#mobileMenuToggle');
    const nav = safeQuerySelector('#nav');
    
    if (!mobileMenuToggle || !nav) return;
    
    mobileMenuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = safeQuerySelectorAll('a', nav);
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
}

// ========== SERVICE FILTERING ==========

function initServiceFiltering() {
    const filterButtons = safeQuerySelectorAll('.filter-btn');
    const serviceCards = safeQuerySelectorAll('.service-card');
    
    if (filterButtons.length === 0) return;
    
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
}

// ========== FORM HANDLING ==========

function initFormSubmission() {
    const orderForm = safeQuerySelector('#orderForm');
    if (!orderForm) return;
    
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
        // TODO: Implement server-side data submission
        
        // Show success message
        alert(`Спасибо за заявку! Мы свяжемся с вами в течение ${CONFIG.formSubmitDelay} минут.`);
        
        // Reset form
        orderForm.reset();
    });
}

// ========== PHONE FORMATTING ==========

function initPhoneFormatting() {
    const phoneInput = safeQuerySelector('#phone');
    if (!phoneInput) return;
    
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

// ========== SCROLL TO FORM ==========

window.scrollToForm = function() {
    const form = safeQuerySelector('#contact');
    if (!form) return;
    
    const elementPosition = form.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - CONFIG.headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// ========== HEADER SCROLL EFFECT ==========

function initHeaderScrollEffect() {
    const header = safeQuerySelector('#header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 4px 12px rgba(0, 170, 181, 0.08)';
        }
        
        lastScroll = currentScroll;
    });
}

// ========== INTERSECTION OBSERVER ==========

function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Единый observer для всех элементов
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Для карточек и элементов добавляем fade-in
                if (entry.target.matches('.service-card, .advantage-card, .promo-card, .step, .team-image')) {
                    entry.target.classList.add('fade-in-up');
                }
                
                // Для секций применяем reveal анимацию
                if (entry.target.tagName === 'SECTION') {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами
    const elementsToAnimate = safeQuerySelectorAll(
        '.service-card, .advantage-card, .promo-card, .step, .team-image'
    );
    elementsToAnimate.forEach(el => observer.observe(el));
    
    // Наблюдаем за секциями
    const sections = safeQuerySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px) scale(0.95)';
        section.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(section);
    });
}

// ========== PRICE CALCULATOR ==========

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

function initPriceCalculator() {
    const areaInput = safeQuerySelector('#area');
    const serviceSelect = safeQuerySelector('#service');
    
    if (!areaInput || !serviceSelect) return;
    
    const updatePriceEstimate = () => {
        const service = serviceSelect.value;
        const area = parseFloat(areaInput.value);
        
        if (service && area && area > 0) {
            const estimate = calculatePrice(service, area);
            // Price calculated silently - could be displayed in UI
        }
    };
    
    areaInput.addEventListener('input', updatePriceEstimate);
    serviceSelect.addEventListener('change', updatePriceEstimate);
}

// ========== 3D & IMMERSIVE EFFECTS ==========

function initParallaxEffect() {
    if (isMobile()) return;
    
    const hero = safeQuerySelector('.hero');
    const heroText = safeQuerySelector('.hero-text');
    const heroImage = safeQuerySelector('.hero-image');
    
    if (!hero || !heroText || !heroImage) return;
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const moveX = (mouseX - 0.5) * 30;
        const moveY = (mouseY - 0.5) * 30;
        
        heroText.style.transform = `translateX(${-moveX}px) translateY(${-moveY}px)`;
        heroImage.style.transform = `translateX(${moveX * 0.5}px) translateY(${moveY * 0.5}px)`;
    });
}

function add3DTiltEffect(selector) {
    const cards = safeQuerySelectorAll(selector);
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
        
        card.addEventListener('mousemove', (e) => {
            if (isMobile()) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // МИНИМАЛЬНЫЙ эффект: делим на 40 вместо 10, уменьшаем подъем и масштаб
            const rotateX = (y - centerY) / 40;
            const rotateY = (centerX - x) / 40;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-3px)
                scale3d(1.01, 1.01, 1.01)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale3d(1, 1, 1)';
        });
    });
}

function init3DTiltEffects() {
    add3DTiltEffect('.service-card');
    add3DTiltEffect('.advantage-card');
    add3DTiltEffect('.promo-card');
}

function initScrollParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = safeQuerySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

function createCursorGlow() {
    if (isMobile()) return;
    
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
}

function initRippleEffect() {
    safeQuerySelectorAll('.btn').forEach(button => {
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
    if (!document.querySelector('#ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function initMagneticButtons() {
    if (isMobile()) return;
    
    safeQuerySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
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
}

function initFloatingAnimation() {
    const features = safeQuerySelectorAll('.hero-feature');
    features.forEach((feature, index) => {
        feature.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
    });
}

// ========== MAIN INITIALIZATION ==========

/**
 * Главная функция инициализации - единая точка входа
 */
function initApp() {
    // Базовая функциональность
    initSmoothScrolling();
    initMobileMenu();
    initServiceFiltering();
    initFormSubmission();
    initPhoneFormatting();
    initHeaderScrollEffect();
    initPriceCalculator();
    
    // Анимации и наблюдатели
    initIntersectionObserver();
    
    // 3D эффекты
    // initParallaxEffect(); // ОТКЛЮЧЕНО: эффект параллакса при движении мыши
    init3DTiltEffects();
    initScrollParallax();
    initRippleEffect();
    initMagneticButtons();
    initFloatingAnimation();
    
    // Cursor glow (только для desktop)
    if (!isMobile()) {
        createCursorGlow();
    }
}

// ========== EVENT LISTENERS ==========

// Единственная точка входа при загрузке DOM
document.addEventListener('DOMContentLoaded', initApp);

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}
