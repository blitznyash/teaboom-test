document.addEventListener('DOMContentLoaded', () => {
    const variantsContainer = document.getElementById('variants-container');

    // --- Кнопка "В корзину" ---
    const cartButtons = variantsContainer.querySelectorAll('.btn-add-to-cart');
    cartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const variant = btn.closest('.variant-item');
            console.log('Добавлено в корзину:', {
                id: variant.dataset.id,
                sku: variant.dataset.sku,
                weight: variant.querySelector('.variant-weight').textContent,
                price: variant.dataset.price
            });
        });
    });

    // --- Модальное окно с изображением ---
    const modal = document.getElementById('imageModal');
    const openBtn = document.getElementById('openImageModal');
    const closeBtn = document.getElementById('closeImageModal');

    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // --- Слайдер похожих товаров ---
const slider = document.getElementById('relatedSlider');
const prevBtn = document.querySelector('.related-prev');
const nextBtn = document.querySelector('.related-next');

if (slider && prevBtn && nextBtn) {
    const scrollStep = () => {
        const card = slider.querySelector('.related-card');
        if (!card) return 300;
        const styles = getComputedStyle(slider);
        const gap = parseInt(styles.gap) || 15;
        return card.offsetWidth + gap;
    };

    prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: scrollStep(), behavior: 'smooth' });
    });

    // Визуальное отключение стрелок, когда скроллить некуда
    const updateArrows = () => {
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        prevBtn.disabled = slider.scrollLeft <= 1;
        nextBtn.disabled = slider.scrollLeft >= maxScroll - 1;
    };

    slider.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    updateArrows();

    // --- Автопрокрутка ---
    let autoplayTimer = null;
    const AUTOPLAY_DELAY = 3000; // 3 секунды

    const nextSlide = () => {
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        const step = scrollStep();

        if (slider.scrollLeft >= maxScroll - 1) {
            // Дошли до конца — плавно возвращаемся в начало
            slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            slider.scrollBy({ left: step, behavior: 'smooth' });
        }
    };

    const startAutoplay = () => {
        stopAutoplay(); // защита от двойного запуска
        autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
    };

    const stopAutoplay = () => {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    };

    // Пауза при наведении мыши
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // Остановка при клике на стрелки (чтобы не мешала пользователю)
    prevBtn.addEventListener('click', stopAutoplay);
    nextBtn.addEventListener('click', stopAutoplay);

    // Запускаем автопрокрутку
    startAutoplay();
}

    // --- Табы ---
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            link.classList.add('active');
            const target = document.getElementById(link.dataset.tab);
            if (target) target.classList.add('active');
        });
    });
});