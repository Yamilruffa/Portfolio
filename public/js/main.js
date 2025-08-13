document.addEventListener('DOMContentLoaded', function () {

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (!target) return;

            const start = window.scrollY;
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const end = target.getBoundingClientRect().top + start - navbarHeight;

            const duration = 1000;
            const startTime = performance.now();

            function scrollStep(currentTime) {
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeInOutCubic(progress);

                window.scrollTo(0, start + (end - start) * ease);

                if (timeElapsed < duration) {
                    requestAnimationFrame(scrollStep);
                }
            }

            function easeInOutCubic(t) {
                return t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }

            requestAnimationFrame(scrollStep);
        });
    });

    // --- Cambio de Idioma ---
    const langToggle = document.getElementById('lang-toggle');
    const langEsElements = document.querySelectorAll('.lang-es');
    const langEnElements = document.querySelectorAll('.lang-en');

    if (langToggle) {
        langToggle.addEventListener('click', function () {
            const isCurrentlySpanish = langToggle.textContent.includes('English');

            langEsElements.forEach(el => el.style.display = isCurrentlySpanish ? 'none' : '');
            langEnElements.forEach(el => el.style.display = isCurrentlySpanish ? '' : 'none');

            langToggle.textContent = isCurrentlySpanish ? 'Español' : 'English';
            document.title = isCurrentlySpanish ? 'Home | Fullstack Developer' : 'Inicio | Fullstack Developer';
        });
    }

    // --- Mostrar y Ocultar Formulario de Contacto ---
    function setupFormToggle(gmailIconId, emailFormId, cancelBtnId) {
        const gmailIcon = document.getElementById(gmailIconId);
        const emailForm = document.getElementById(emailFormId);
        const cancelBtn = document.getElementById(cancelBtnId);

        if (gmailIcon && emailForm && cancelBtn) {
            gmailIcon.addEventListener('click', function(event) {
                event.preventDefault();

                emailForm.style.display = emailForm.style.display === 'flex' ? 'none' : 'flex';
            });

            cancelBtn.addEventListener('click', function() {
                emailForm.style.display = 'none';
            });
        }
    }

    setupFormToggle('gmail-icon-es', 'email-form-es', 'cancel-btn-es');
    setupFormToggle('gmail-icon-en', 'email-form-en', 'cancel-btn-en');


    // --- Modal de Imágenes de Proyectos ---
    const modal = document.getElementById('image-modal');
    const modalImagesContainer = document.getElementById('modal-images');
    const modalClose = document.getElementById('modal-close');

    if (modal && modalImagesContainer && modalClose) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            modalImagesContainer.innerHTML = '';
        });

        window.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                modalImagesContainer.innerHTML = '';
            }
        });

        modalImagesContainer.addEventListener('click', function(event) {
            const target = event.target;
            if (target.tagName === 'IMG') {
                target.classList.toggle('agrandada');
            }
        });

        window.addEventListener('click', function(event) {
            const imagenAgrandada = document.querySelector('.modal-images-container img.agrandada');
            if (imagenAgrandada && event.target !== imagenAgrandada) {
                imagenAgrandada.classList.remove('agrandada');
            }
        });

        document.querySelectorAll('.mostrar-imagenes').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                const proyecto = this.dataset.proyecto;
                modalImagesContainer.innerHTML = '';

                if (proyecto) {
                    const imageCount = 20;
                    const baseDir = `/portfolio/public/images/${proyecto}/`;
                    let imagesLoaded = 0;

                    for (let i = 1; i <= imageCount; i++) {
                        const src = `${baseDir}img${i}.jpg`;
                        const img = new Image();

                        img.onload = function() {
                            const imgElement = document.createElement('img');
                            imgElement.src = src;
                            imgElement.alt = `Imagen de ${proyecto}`;
                            modalImagesContainer.appendChild(imgElement);
                            imagesLoaded++;

                            if (imagesLoaded === 1) {
                                modal.style.display = 'flex';
                            }
                        };

                        img.onerror = function() {
                            console.log(`Imagen no encontrada: ${src}`);
                        };

                        img.src = src;
                    }
                } else {
                    console.warn(`El atributo data-proyecto no está definido para este enlace.`);
                }
            });
        });
    }
});