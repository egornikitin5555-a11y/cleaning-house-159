// Чистый дом 159 - Script.js
// Версия 2.0 - Исправленная

'use strict';

// ============================================
// ГЛОБАЛЬНЫЕ ФУНКЦИИ (доступны для onclick)
// ============================================

/**
 * Прокрутка к форме заказа
 * Используется в кнопках onclick="scrollToForm()"
 */
function scrollToForm() {
    const form = document.getElementById('contact');
    if (form) {
        form.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    } else {
        console.warn('scrollToForm: Элемент #contact не найден');
    }
}

/**
 * Прокрутка к секции цен
 */
function scrollToPrices() {
    const prices = document.getElementById('prices');
    if (prices) {
        prices.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

/**
 * Прокрутка к секции услуг
 */
function scrollToServices() {
    const services = document.getElementById('services');
    if (services) {
        services.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ ПОСЛЕ ЗАГРУЗКИ DOM
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // -------------------------------------------
    // 1. МОБИЛЬНОЕ МЕНЮ
    // -------------------------------------------
    initMobileMenu();
    
    // -------------------------------------------
    // 2. ФИЛЬТРЫ УСЛУГ
    // -------------------------------------------
    initServiceFilters();
    
    // -------------------------------------------
    // 3. ФОРМА ЗАКАЗА
    // -------------------------------------------
    initOrderForm();
    
    // -------------------------------------------
    // 4. ЭФФЕКТ ПРОКРУТКИ HEADER
    // -------------------------------------------
    initHeaderScroll();
    
    // -------------------------------------------
    // 5. ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРНЫХ ССЫЛОК
    // -------------------------------------------
    initSmoothScroll();
    
    // -------------------------------------------
    // 6. МАСКА ТЕЛЕФОНА
    // -------------------------------------------
    initPhoneMask();
    
    // -------------------------------------------
    // 7. АНИМАЦИИ ПРИ ПРОКРУТКЕ
    // -------------------------------------------
    initScrollAnimations();
    
    // -------------------------------------------
    // 8. HERO КНОПКИ (резервный обработчик)
    // -------------------------------------------
    initHeroButtons();
});

// ============================================
// ФУНКЦИИ ИНИЦИАЛИЗАЦИИ
// ============================================

/**
 * Инициализация мобильного меню
 */
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('nav');
    
    if (!mobileMenuToggle || !nav) return;
    
    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Закрытие меню при клике на ссылку
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });
}

/**
 * Инициализация фильтров услуг
 * ИСПРАВЛЕНО: Устранена race condition с использованием debounce и уникальных ID
 */
let filterTimeoutId = null;
let currentFilterId = 0;

function initServiceFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (filterBtns.length === 0 || serviceCards.length === 0) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Отменяем предыдущий таймаут (исправление race condition)
            if (filterTimeoutId) {
                clearTimeout(filterTimeoutId);
            }
            currentFilterId++;
            const thisFilterId = currentFilterId;
            
            // Обновление активной кнопки
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Фильтрация карточек с анимацией
            serviceCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.classList.remove('hidden');
                    card.style.display = '';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.classList.add('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    
                    // Сохраняем ID для проверки актуальности
                    filterTimeoutId = setTimeout(() => {
                        // Проверяем, что это всё ещё актуальный фильтр
                        if (thisFilterId === currentFilterId && card.classList.contains('hidden')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

/**
 * Инициализация формы заказа
 */
function initOrderForm() {
    const orderForm = document.getElementById('orderForm');
    
    if (!orderForm) return;
    
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получение данных формы
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Валидация
        if (!data.name || !data.phone) {
            showNotification('Пожалуйста, заполните обязательные поля', 'error');
            return;
        }
        
        if (!data.privacy) {
            showNotification('Необходимо согласие с политикой обработки данных', 'error');
            return;
        }
        
        // Показ успешного сообщения
        showNotification('Спасибо за заявку! Мы перезвоним вам в течение 15 минут.', 'success');
        this.reset();
    });
}

/**
 * Эффект прокрутки для header
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    if (!header) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                
                if (currentScroll > 100) {
                    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                    header.classList.add('header-scrolled');
                } else {
                    header.style.boxShadow = '';
                    header.classList.remove('header-scrolled');
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // Добавлено passive для производительности
}

/**
 * Плавная прокрутка для якорных ссылок
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропускаем пустые ссылки
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
}

/**
 * Маска для ввода телефона
 */
function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            // Замена 8 на 7 в начале
            if (value[0] === '8') {
                value = '7' + value.slice(1);
            }
            
            // Форматирование номера
            let formatted = '+7';
            if (value.length > 1) {
                formatted += ' (' + value.slice(1, 4);
            }
            if (value.length > 4) {
                formatted += ') ' + value.slice(4, 7);
            }
            if (value.length > 7) {
                formatted += '-' + value.slice(7, 9);
            }
            if (value.length > 9) {
                formatted += '-' + value.slice(9, 11);
            }
            
            e.target.value = formatted;
        }
    });
    
    // Фокус - установка начального значения
    phoneInput.addEventListener('focus', function() {
        if (!this.value) {
            this.value = '+7 ';
        }
    });
}

/**
 * Анимации при прокрутке (Intersection Observer)
 */
function initScrollAnimations() {
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
    
    // Наблюдение за элементами
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .advantage-card, .promo-card, .step, .team-image, .price-table'
    );
    
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Резервный обработчик для кнопок Hero секции
 */
function initHeroButtons() {
    // Находим кнопки в hero секции
    const heroButtons = document.querySelectorAll('.btn-hero-primary, .btn-hero-secondary');
    
    heroButtons.forEach(button => {
        // Добавляем дополнительный обработчик через addEventListener
        button.addEventListener('click', function(e) {
            scrollToForm();
        });
    });
    
    // Также обрабатываем все кнопки с onclick="scrollToForm()"
    document.querySelectorAll('[onclick*="scrollToForm"]').forEach(button => {
        button.style.cursor = 'pointer';
        button.style.pointerEvents = 'auto';
    });
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

/**
 * Показ уведомления
 * ОПТИМИЗИРОВАНО: Стили перенесены в CSS файл
 */
function showNotification(message, type = 'info') {
    // Удаляем предыдущее уведомление если есть
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Удаление через 4 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// ============================================
// ОТЛАДКА (для разработки)
// ============================================


