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

// Scroll to form function
function scrollToForm() {
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

// Intersection Observer for fade-in animations
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
