function toggleMenu() {
    document.getElementById('nav-links').classList.toggle('show');
}


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (!target) return;

        const start = window.scrollY;
        const end = target.getBoundingClientRect().top + start;
        const duration = 1000; // duración en milisegundos (1000ms = 1s)
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

        // Función de easing para suavidad
        function easeInOutCubic(t) {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        requestAnimationFrame(scrollStep);
    });
});


function copyEmailAndOpenGmail(event) {
    event.preventDefault();
    const email = "devruffa@gmail.com";

    // Copiar al portapapeles
    navigator.clipboard.writeText(email).then(() => {
        alert("Correo copiado al portapapeles. c:");

        // Abrir Gmail en una nueva pestaña
        window.open("https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(email), "_blank");
    }).catch(err => {
        alert("No se pudo copiar el correo: u.u " + err);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('image-modal');
    const modalImages = document.getElementById('modal-images');
    const modalClose = document.getElementById('modal-close');

    // Abrir modal al hacer click en "Imágenes"
    document.querySelectorAll('.open-images').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const folder = this.dataset.folder;

            fetch(`/images/list?folder=${encodeURIComponent(folder)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert(data.error);
                        return;
                    }
                    modalImages.innerHTML = ''; // limpiar contenido previo

                    data.images.forEach(src => {
                        const img = document.createElement('img');
                        img.src = src;
                        img.alt = 'Proyecto imagen';
                        modalImages.appendChild(img);
                    });

                    modal.style.display = 'flex';
                })
                .catch(err => {
                    alert('Error cargando las imágenes');
                    console.error(err);
                });
        });
    });

    // Cerrar modal
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
        modalImages.innerHTML = '';
    });

    // Cerrar modal clickeando fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            modalImages.innerHTML = '';
        }
    });
});
