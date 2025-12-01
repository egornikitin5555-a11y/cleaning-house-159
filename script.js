// ИСПРАВЛЕНИЕ: Оптимизация для фонового видео
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.querySelector('.hero-video-background video');
    
    if (heroVideo) {
        // Улучшенная обработка автовоспроизведения
        const setupVideo = () => {
            // Устанавливаем правильные атрибуты для видео
            heroVideo.setAttribute('muted', '');
            heroVideo.setAttribute('autoplay', '');
            heroVideo.setAttribute('loop', '');
            heroVideo.setAttribute('playsinline', '');
            
            // Обработка автовоспроизведения
            const playPromise = heroVideo.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Video playing successfully');
                }).catch(error => {
                    console.log('Autoplay prevented:', error.message);
                    // Добавляем обработку ошибок
                    heroVideo.style.opacity = '0.5';
                });
            }
        };
        
        // Запускаем настройку видео
        setupVideo();
        
        // Улучшенная обработка изменения размера окна
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                // Принудительное обновление стилей видео при изменении размера
                heroVideo.style.transform = 'translate(-50%, -50%)';
                heroVideo.style.objectFit = 'cover';
                console.log('Video resized for viewport');
            }, 250);
        });
        
        // Улучшенная обработка для мобильных устройств
        if (window.innerWidth <= 768) {
            console.log('Mobile device detected, optimizing video');
            
            // Дополнительная проверка загрузки видео
            heroVideo.addEventListener('loadeddata', function() {
                console.log('Mobile video loaded successfully');
                heroVideo.style.display = 'block';
            });
            
            heroVideo.addEventListener('error', function() {
                console.error('Video loading error on mobile');
                // Можно добавить fallback изображение здесь
            });
        }
        
        // Обработка ошибок видео
        heroVideo.addEventListener('error', function(e) {
            console.error('Video error:', e);
            heroVideo.style.opacity = '0.7';
        });
        
        // Проверяем размеры видео после загрузки
        heroVideo.addEventListener('loadedmetadata', function() {
            console.log('Video metadata loaded:', {
                width: heroVideo.videoWidth,
                height: heroVideo.videoHeight
            });
        });
    }
});