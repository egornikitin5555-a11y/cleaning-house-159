/**
 * Оптимизация видео фона для всех устройств и браузеров
 * Улучшает производительность и совместимость видео фона
 */

(function() {
    'use strict';

    // Функция для определения типа устройства
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Функция для проверки поддержки видео форматов
    function checkVideoSupport() {
        const video = document.createElement('video');
        const canPlayMp4 = video.canPlayType('video/mp4');
        const canPlayWebm = video.canPlayType('video/webm');
        return {
            mp4: canPlayMp4 !== '',
            webm: canPlayWebm !== ''
        };
    }

    // Инициализация видео оптимизации
    function initVideoOptimization() {
        const heroVideo = document.getElementById('heroVideo');
        
        if (!heroVideo) {
            console.warn('Hero video not found');
            return;
        }

        const support = checkVideoSupport();
        const isMobile = isMobileDevice();

        // Настройка для мобильных устройств
        if (isMobile) {
            // Отключаем автопроигрывание на мобильных для экономии батареи
            heroVideo.removeAttribute('autoplay');
            
            // Устанавливаем более низкое качество для мобильных
            heroVideo.setAttribute('playsinline', 'true');
            heroVideo.setAttribute('webkit-playsinline', 'true');
            
            // Предварительная загрузка только метаданных
            heroVideo.setAttribute('preload', 'metadata');
        }

        // Обработка ошибок загрузки видео
        heroVideo.addEventListener('error', function(e) {
            console.error('Video loading error:', e);
            handleVideoFallback();
        });

        // Обработка успешной загрузки видео
        heroVideo.addEventListener('loadeddata', function() {
            console.log('Video loaded successfully');
            // Добавляем класс для анимации появления
            heroVideo.classList.add('video-loaded');
        });

        // Улучшение производительности - пауза видео вне видимости
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (heroVideo.paused && !isMobile) {
                            heroVideo.play().catch(console.warn);
                        }
                    } else {
                        if (!heroVideo.paused) {
                            heroVideo.pause();
                        }
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(heroVideo);
        }

        // Принудительное воспроизведение для совместимости
        function forcePlay() {
            heroVideo.play().catch(error => {
                console.warn('Auto-play prevented:', error);
                // Показываем кнопку воспроизведения для пользователя
                showPlayButton();
            });
        }

        // Попытка запуска видео через 1 секунду
        setTimeout(forcePlay, 1000);

        // Обработка видимости страницы для экономии ресурсов
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                heroVideo.pause();
            } else if (!isMobile) {
                forcePlay();
            }
        });
    }

    // Функция показа кнопки воспроизведения
    function showPlayButton() {
        const heroVideo = document.getElementById('heroVideo');
        if (heroVideo && !document.querySelector('.video-play-button')) {
            const playButton = document.createElement('button');
            playButton.className = 'video-play-button';
            playButton.innerHTML = '▶';
            playButton.setAttribute('aria-label', 'Воспроизвести видео');
            playButton.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 170, 181, 0.9);
                color: white;
                border: none;
                border-radius: 50%;
                width: 80px;
                height: 80px;
                font-size: 24px;
                cursor: pointer;
                z-index: 100;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 170, 181, 0.3);
            `;
            
            playButton.addEventListener('click', function() {
                heroVideo.play().then(() => {
                    playButton.remove();
                }).catch(console.warn);
            });

            heroVideo.parentElement.style.position = 'relative';
            heroVideo.parentElement.appendChild(playButton);
        }
    }

    // Функция обработки фоллбэка при ошибке видео
    function handleVideoFallback() {
        const heroVideo = document.getElementById('heroVideo');
        const heroSection = document.querySelector('.hero-video-enabled');
        
        if (heroSection) {
            // Добавляем класс для статичного фона
            heroSection.classList.add('video-fallback-mode');
            
            // Скрываем видео элемент
            if (heroVideo) {
                heroVideo.style.display = 'none';
            }
        }
    }

    // Оптимизация размеров видео при изменении размера окна
    function optimizeVideoSize() {
        const heroVideo = document.getElementById('heroVideo');
        if (!heroVideo) return;

        const resize = debounce(() => {
            // Обеспечиваем корректное позиционирование видео
            const rect = heroVideo.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;

            // Корректировка размеров для разных экранов
            if (windowWidth <= 768) {
                // Мобильные устройства
                heroVideo.style.objectPosition = 'center center';
            } else if (windowWidth <= 1024) {
                // Планшеты
                heroVideo.style.objectPosition = 'center center';
            } else {
                // Десктоп
                heroVideo.style.objectPosition = 'center center';
            }
        }, 250);

        window.addEventListener('resize', resize);
    }

    // Функция debounce для оптимизации производительности
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        initVideoOptimization();
        optimizeVideoSize();
    });

    // Дополнительная инициализация для старых браузеров
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVideoOptimization);
    } else {
        initVideoOptimization();
    }

})();