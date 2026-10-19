document.addEventListener('DOMContentLoaded', () => {
    const variantsContainer = document.getElementById('variants-container');

  
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

    
    const variants = variantsContainer.querySelectorAll('.variant-item');
    
    
    const mainSku = document.getElementById('main-sku') || document.querySelector('.main-price-info .variant-sku');
    const mainCurrentPrice = document.getElementById('main-current-price') || document.querySelector('.main-price-block .current-price');
    const mainOldPrice = document.getElementById('main-old-price') || document.querySelector('.main-price-block .old-price');

    
    const updateMainData = (variant) => {
        if (!variant) return;


        const sku = variant.dataset.sku || '';
        const price = variant.dataset.price || '0';
        const oldPrice = variant.dataset.oldPrice || ''; 

  
        if (mainSku) {
            mainSku.textContent = 'арт: ' + sku;
        }

        if (mainCurrentPrice) {
            mainCurrentPrice.textContent = price.replace('.', ',') + ' ₽';
        }

        if (mainOldPrice) {
            if (oldPrice && oldPrice !== '0') {
                mainOldPrice.textContent = oldPrice.replace('.', ',') + ' ₽';
                mainOldPrice.style.display = 'block';
            } else {
                mainOldPrice.style.display = 'none';  
            }
        }
    };

 
    if (variants.length > 0) {
        variants[0].classList.add('active');
        updateMainData(variants[0]); 
    }


    variants.forEach(variant => {
        variant.addEventListener('click', (e) => {
            
            if (e.target.closest('.btn-add-to-cart')) return;

            
            variants.forEach(v => v.classList.remove('active'));
            
            
            variant.classList.add('active');
            
            
            updateMainData(variant);
        });
    });

    // --- Модальное окно с изображением ---
    const modal = document.getElementById('imageModal');
    const openBtn = document.getElementById('openImageModal');
    const closeBtn = document.getElementById('closeImageModal');

    if (modal && openBtn && closeBtn) {
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
    }


    // ---  Слайдер ---
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

    
        const updateArrows = () => {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            prevBtn.disabled = slider.scrollLeft <= 1;
            nextBtn.disabled = slider.scrollLeft >= maxScroll - 1;
        };

        slider.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        updateArrows();


        let autoplayTimer = null;
        const AUTOPLAY_DELAY = 3000;

        const nextSlide = () => {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            const step = scrollStep();

            if (slider.scrollLeft >= maxScroll - 1) {
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: step, behavior: 'smooth' });
            }
        };

        const startAutoplay = () => {
            stopAutoplay();
            autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
        };

        const stopAutoplay = () => {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        };

        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
        prevBtn.addEventListener('click', stopAutoplay);
        nextBtn.addEventListener('click', stopAutoplay);

        startAutoplay();
    }


    // --- Табы ---
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    if (tabLinks.length && tabPanes.length) {
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
    }
    // --- Меню ---
    const sidebar = document.querySelector('.sidebar');
    const mobileBtn = document.getElementById('mobileSidebarBtn');

    if (sidebar && mobileBtn) {
      
        mobileBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            

            if (sidebar.classList.contains('open')) {
                mobileBtn.textContent = 'Закрыть категории';
            } else {
                mobileBtn.textContent = 'Категории';
            }
        });


        const sidebarLinks = sidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('open');
                mobileBtn.textContent = 'Категории';
            });
        });
    }
});

// ---  Корзина и выбор фасовки ---
    const variantsContainer = document.getElementById('variants-container');
    const cartTotalBlock = document.getElementById('cartTotalBlock');
    const cartTotalPrice = document.getElementById('cartTotalPrice');
    
    const mainCurrentPrice = document.querySelector('.main-price-block .current-price') || document.querySelector('.current-price');

    const cart = {}; // Хранилище корзины

    if (variantsContainer) {
        const variants = variantsContainer.querySelectorAll('.variant-item');

        // пересчет и вывод общей суммы
        const updateTotalSum = () => {
            let totalSum = 0;
            for (let key in cart) {
                totalSum += cart[key].qty * cart[key].price;
            }

            if (totalSum > 0) {
                cartTotalBlock.style.display = 'flex';
                cartTotalPrice.textContent = totalSum.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₽';
            } else {
                cartTotalBlock.style.display = 'none';
            }
        };

        //  бейджик и кнопка минус
        const updateVariantState = (id, wrapper, btn) => {
            let badge = wrapper.querySelector('.cart-badge');
            let minusBtn = wrapper.querySelector('.cart-minus-btn');

            if (cart[id] && cart[id].qty > 0) {
                
                wrapper.classList.add('has-items');

                
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'cart-badge';
                    btn.appendChild(badge);
                }
                badge.textContent = cart[id].qty;

                // Создаем кнопку минус, если ее нет
                if (!minusBtn) {
                    minusBtn = document.createElement('button');
                    minusBtn.className = 'cart-minus-btn';
                    minusBtn.innerHTML = '&minus;'; // Символ минуса
                    minusBtn.title = 'Убрать 1 шт.';
                    wrapper.appendChild(minusBtn);

                    // Обработчик клика по минусу
                    minusBtn.addEventListener('click', (e) => {
                        e.stopPropagation(); // Не кликаем по строке
                        
                        cart[id].qty -= 1;
                        
                        // Если стало 0, удаление
                        if (cart[id].qty === 0) {
                            delete cart[id];
                        }

                        // обновление бейджика
                        if (!cart[id] || cart[id].qty === 0) {
                            wrapper.classList.remove('has-items');
                            if (badge) badge.remove();
                            if (minusBtn) minusBtn.remove();
                        } else {
                            badge.textContent = cart[id].qty;
                        }

                        //  сумма перерасчитана
                        updateTotalSum();
                        
                        // обновленние сумм
                        let totalSum = 0;
                        for (let key in cart) {
                            totalSum += cart[key].qty * cart[key].price;
                        }
                        if (totalSum > 0) {
                            mainCurrentPrice.textContent = totalSum.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₽';
                        } else {
                            // Если корзина пуста, возвращение цены выбранной строки
                            const activeVariant = variantsContainer.querySelector('.variant-item.active');
                            if (activeVariant) {
                                const activePrice = parseFloat(activeVariant.dataset.price);
                                mainCurrentPrice.textContent = activePrice.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₽';
                            }
                        }
                    });
                }
            } else {
                // если товара нет, убираем всё
                wrapper.classList.remove('has-items');
                if (badge) badge.remove();
                if (minusBtn) minusBtn.remove();
            }
        };

        variants.forEach(variant => {
            const btn = variant.querySelector('.btn-add-to-cart');
            const wrapper = variant.querySelector('.variant-cart-wrapper');
            const price = parseFloat(variant.dataset.price);
            const id = variant.dataset.id;

            // КЛИК ПО СТРОКЕ (переключение фасовки)
            variant.addEventListener('click', (e) => {
                if (e.target.closest('.variant-cart-wrapper')) return;

                variants.forEach(v => v.classList.remove('active'));
                variant.classList.add('active');

                if (mainCurrentPrice) {
                    mainCurrentPrice.textContent = price.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₽';
                }
            });

            // Клики по корзине (добавление +1)
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();

                    if (!cart[id]) {
                        cart[id] = { qty: 0, price: price };
                    }
                    cart[id].qty += 1;

                    
                    updateVariantState(id, wrapper, btn);
                    
                    
                    updateTotalSum();
                    
                    // обновление цены
                    let totalSum = 0;
                    for (let key in cart) {
                        totalSum += cart[key].qty * cart[key].price;
                    }
                    mainCurrentPrice.textContent = totalSum.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₽';
                });
            }
        });
    }