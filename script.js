// Оптимизация для фонового видео
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.querySelector('.hero-video-background video');
    
    if (heroVideo) {
        // Обработка автовоспроизведения
        const playPromise = heroVideo.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video playing successfully');
            }).catch(error => {
                console.log('Autoplay prevented, user interaction required');
                // Можно добавить кнопку "Воспроизвести" если нужно
            });
        }
        
        // Обработка изменения размера окна для оптимального масштабирования
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                // Принудительное обновление стилей видео при изменении размера
                heroVideo.style.transform = 'translate(-50%, -50%)';
                heroVideo.style.objectFit = 'contain';
            }, 250);
        });
        
        // Проверка производительности на мобильных устройствах
        if (window.innerWidth <= 768) {
            // На мобильных можно заменить видео на статичное изображение при необходимости
            heroVideo.addEventListener('loadeddata', function() {
                console.log('Mobile video loaded successfully');
            });
        }
    }
});
