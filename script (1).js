// ========== CONFIGURATION ==========
const CONFIG = {
    headerOffset: 80,
    mobileBreakpoint: 768,
    formSubmitDelay: 15 // минуты до перезвона
};

// ========== STORAGE FOR EVENT LISTENERS ==========
const eventListeners = {
    mousemove: [],
    mouseleave: [],
    scroll: [],
    domcontentloaded: []
};

// ========== PERFORMANCE UTILITIES ==========

/**
 * Throttle function to limit function calls
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/**
 * Debounce function to delay function execution
 */
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const args = arguments;
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    }
}

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

/**
 * Безопасное добавление event listener с отслеживанием
 */
function safeAddEventListener(target, event, handler) {
    target.addEventListener(event, handler);
    
    // Store for cleanup
    if (!eventListeners[event]) {
        eventListeners[event] = [];
    }
    eventListeners[event].push({ target, handler });
    
    return handler;
}

/**
 * Очистка всех event listeners
 */
function cleanupEventListeners() {
    Object.keys(eventListeners).forEach(eventType => {
        eventListeners[eventType].forEach(({ target, handler }) => {
            target.removeEventListener(eventType, handler);
        });
        eventListeners[eventType] = [];
    });
}

// ========== SMOOTH SCROLLING ==========

function initSmoothScrolling() {
    const anchors = safeQuerySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        const handler = function (e) {
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
        };
        
        safeAddEventListener(anchor, 'click', handler);
    });
}

// ========== MOBILE MENU ==========

function initMobileMenu() {
    const mobileMenuToggle = safeQuerySelector('#mobileMenuToggle');
    const nav = safeQuerySelector('#nav');
    
    if (!mobileMenuToggle || !nav) return;
    
    const menuClickHandler = () => {
        nav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        // Update aria-expanded
        const isExpanded = nav.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    };
    
    safeAddEventListener(mobileMenuToggle, 'click', menuClickHandler);
    
    // Close mobile menu when clicking on a link
    const navLinks = safeQuerySelectorAll('a', nav);
    navLinks.forEach(link => {
        const linkClickHandler = () => {
            nav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        };
        safeAddEventListener(link, 'click', linkClickHandler);
    });
}

// ========== SERVICE FILTERING ==========

function initServiceFiltering() {
    const filterButtons = safeQuerySelectorAll('.filter-btn');
    const serviceCards = safeQuerySelectorAll('.service-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        const buttonClickHandler = () => {
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
        };
        
        safeAddEventListener(button, 'click', buttonClickHandler);
    });
}

// ========== FORM HANDLING ==========

function initFormSubmission() {
    const orderForm = safeQuerySelector('#orderForm');
    if (!orderForm) return;
    
    const formSubmitHandler = (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(orderForm);
        const data = Object.fromEntries(formData);
        
        // Enhanced validation
        if (!data.name || data.name.trim().length < 2) {
            alert('Пожалуйста, введите корректное имя (минимум 2 символа)');
            return;
        }
        
        if (!data.phone || !/^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/.test(data.phone)) {
            alert('Пожалуйста, введите корректный номер телефона в формате +7 (XXX) XXX-XX-XX');
            return;
        }
        
        // Validate email if provided
        if (data.email && data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
            alert('Пожалуйста, введите корректный email адрес');
            return;
        }
        
        if (!data.service) {
            alert('Пожалуйста, выберите услугу');
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
    };
    
    safeAddEventListener(orderForm, 'submit', formSubmitHandler);
}

// ========== PHONE FORMATTING ==========

function initPhoneFormatting() {
    const phoneInput = safeQuerySelector('#phone');
    if (!phoneInput) return;
    
    const phoneInputHandler = (e) => {
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
    };
    
    safeAddEventListener(phoneInput, 'input', phoneInputHandler);
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

let lastScroll = 0;

function initHeaderScrollEffect() {
    const header = safeQuerySelector('#header');
    if (!header) return;
    
    const scrollHandler = throttle(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 4px 12px rgba(0, 170, 181, 0.08)';
        }
        
        lastScroll = currentScroll;
    }, 16); // Throttle to ~60fps
    
    safeAddEventListener(window, 'scroll', scrollHandler);
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
                    entry.target.classList.add('section-visible');
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
    sections.forEach((section, index) => {
        // Добавляем класс для анимации
        section.classList.add('section-reveal');
        
        // Первые две секции (hero и advantages) видимы сразу
        if (index < 2) {
            section.classList.add('section-visible');
        } else {
            observer.observe(section);
        }
    });
    
    // Добавляем CSS для анимации секций если еще не добавлен
    if (!document.querySelector('#section-reveal-styles')) {
        const style = document.createElement('style');
        style.id = 'section-reveal-styles';
        style.textContent = `
            .section-reveal {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
                transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .section-reveal.section-visible {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            /* Убираем анимацию для очень маленьких экранов для производительности */
            @media (max-width: 480px) {
                .section-reveal {
                    opacity: 1;
                    transform: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
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
    
    const areaInputHandler = () => updatePriceEstimate();
    const serviceSelectHandler = () => updatePriceEstimate();
    
    safeAddEventListener(areaInput, 'input', areaInputHandler);
    safeAddEventListener(serviceSelect, 'change', serviceSelectHandler);
}

// ========== 3D & IMMERSIVE EFFECTS ==========

function initParallaxEffect() {
    if (isMobile()) return;
    
    const hero = safeQuerySelector('.hero');
    const heroText = safeQuerySelector('.hero-text');
    const heroVideo = safeQuerySelector('.hero video');
    
    if (!hero || !heroText || !heroVideo) return;
    
    const mousemoveHandler = throttle((e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const moveX = (mouseX - 0.5) * 30;
        const moveY = (mouseY - 0.5) * 30;
        
        heroText.style.transform = `translateX(${-moveX}px) translateY(${-moveY}px)`;
        heroVideo.style.transform = `translateX(${moveX * 0.5}px) translateY(${moveY * 0.5}px)`;
    }, 16); // Throttle to ~60fps
    
    safeAddEventListener(document, 'mousemove', mousemoveHandler);
}

function add3DTiltEffect(selector) {
    const cards = safeQuerySelectorAll(selector);
    
    cards.forEach(card => {
        const mouseenterHandler = () => {
            card.style.transition = 'none';
        };
        
        const mousemoveHandler = (e) => {
            if (isMobile()) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Разное движение для разных типов карточек
            let divisor, translateY, scale;
            
            if (card.classList.contains('service-card')) {
                // Для карточек услуг - ОЧЕНЬ МИНИМАЛЬНОЕ движение (как в advantage-card)
                divisor = 100;
                translateY = -2;
                scale = 1.005;
            } else {
                // Для остальных карточек - минимальное движение
                divisor = 40;
                translateY = -3;
                scale = 1.01;
            }
            
            const rotateX = (y - centerY) / divisor;
            const rotateY = (centerX - x) / divisor;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(${translateY}px)
                scale3d(${scale}, ${scale}, ${scale})
            `;
        };
        
        const mouseleaveHandler = () => {
            card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale3d(1, 1, 1)';
        };
        
        safeAddEventListener(card, 'mouseenter', mouseenterHandler);
        safeAddEventListener(card, 'mousemove', mousemoveHandler);
        safeAddEventListener(card, 'mouseleave', mouseleaveHandler);
    });
}

function init3DTiltEffects() {
    add3DTiltEffect('.service-card');
    add3DTiltEffect('.advantage-card');
    add3DTiltEffect('.promo-card');
}

let scrollAnimationFrame = null;

function initScrollParallax() {
    const scrollHandler = () => {
        if (scrollAnimationFrame) {
            cancelAnimationFrame(scrollAnimationFrame);
        }
        
        scrollAnimationFrame = requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const parallaxElements = safeQuerySelectorAll('[data-parallax]');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    };
    
    safeAddEventListener(window, 'scroll', scrollHandler);
}

// ========== CURSOR GLOW WITH PROPER CLEANUP ==========

let cursorGlowElement = null;
let cursorAnimationId = null;
let cursorMouseX = 0, cursorMouseY = 0;
let cursorGlowX = 0, cursorGlowY = 0;

function createCursorGlow() {
    if (isMobile()) return;
    
    // Remove existing glow if any
    removeCursorGlow();
    
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
    cursorGlowElement = glow;
    
    const mousemoveHandler = (e) => {
        cursorMouseX = e.clientX;
        cursorMouseY = e.clientY;
        glow.style.opacity = '1';
    };
    
    const mouseleaveHandler = () => {
        glow.style.opacity = '0';
    };
    
    safeAddEventListener(document, 'mousemove', mousemoveHandler);
    safeAddEventListener(document, 'mouseleave', mouseleaveHandler);
    
    // Smooth follow animation with cleanup
    function animateGlow() {
        cursorGlowX += (cursorMouseX - cursorGlowX) * 0.1;
        cursorGlowY += (cursorMouseY - cursorGlowY) * 0.1;
        
        if (cursorGlowElement) {
            cursorGlowElement.style.left = `${cursorGlowX - 150}px`;
            cursorGlowElement.style.top = `${cursorGlowY - 150}px`;
        }
        
        cursorAnimationId = requestAnimationFrame(animateGlow);
    }
    
    animateGlow();
}

function removeCursorGlow() {
    if (cursorAnimationId) {
        cancelAnimationFrame(cursorAnimationId);
        cursorAnimationId = null;
    }
    
    if (cursorGlowElement && cursorGlowElement.parentNode) {
        cursorGlowElement.parentNode.removeChild(cursorGlowElement);
        cursorGlowElement = null;
    }
}

// ========== RIPPLE EFFECT ==========

function initRippleEffect() {
    const buttons = safeQuerySelectorAll('.btn');
    
    buttons.forEach(button => {
        const buttonClickHandler = function(e) {
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
        };
        
        safeAddEventListener(button, 'click', buttonClickHandler);
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
    
    const buttons = safeQuerySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        const mousemoveHandler = (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
        };
        
        const mouseleaveHandler = () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        };
        
        safeAddEventListener(button, 'mousemove', mousemoveHandler);
        safeAddEventListener(button, 'mouseleave', mouseleaveHandler);
    });
}

function initFloatingAnimation() {
    const features = safeQuerySelectorAll('.hero-feature');
    features.forEach((feature, index) => {
        feature.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`;
    });
}

// ========== ONCLICK TO EVENTLISTENER CONVERSION ==========

function initOnclickToEventListener() {
    // Находим все кнопки с onclick="scrollToForm()"
    const buttonsWithOnclick = document.querySelectorAll('button[onclick]');
    
    buttonsWithOnclick.forEach(button => {
        const onclickValue = button.getAttribute('onclick');
        
        // Извлекаем функцию из onclick
        if (onclickValue && onclickValue.includes('scrollToForm')) {
            // Удаляем onclick атрибут
            button.removeAttribute('onclick');
            
            // Добавляем через addEventListener
            const clickHandler = () => {
                window.scrollToForm();
            };
            safeAddEventListener(button, 'click', clickHandler);
        }
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
    init3DTiltEffects();
    initScrollParallax();
    initRippleEffect();
    initMagneticButtons();
    
    // Convert inline onclick to addEventListener
    initOnclickToEventListener();
    
    // Cursor glow (только для desktop)
    if (!isMobile()) {
        createCursorGlow();
    }
}

// ========== CLEANUP ON PAGE UNLOAD ==========

function cleanup() {
    cleanupEventListeners();
    removeCursorGlow();
    
    if (scrollAnimationFrame) {
        cancelAnimationFrame(scrollAnimationFrame);
        scrollAnimationFrame = null;
    }
}

// ========== EVENT LISTENERS ==========

// Единственная точка входа при загрузке DOM
safeAddEventListener(document, 'DOMContentLoaded', initApp);

// Cleanup on page unload
safeAddEventListener(window, 'beforeunload', cleanup);

// Prevent form resubmission on page refresh
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}