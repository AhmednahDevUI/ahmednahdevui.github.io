//-- ================= JS MENU ================= -->
// Cambia el fondo del menú al hacer scroll.

const menu = document.querySelector('.menu');

function actualizarMenu() {
    if (window.scrollY < 10) {
        menu.classList.remove('menu--overlay');
        menu.classList.add('menu--top');
    } else {
        menu.classList.remove('menu--top');
        menu.classList.add('menu--overlay');
    }
}

window.addEventListener('scroll', actualizarMenu, { passive: true });
actualizarMenu();


//-- ================= JS MENÚ MÓVIL ================= -->

const botonMenu = document.querySelector('.menu-toggle');
const enlacesMenu = document.querySelectorAll('#nav-links a');

function abrirMenu(abrir) {
    menu.classList.toggle('abierto', abrir);
    document.body.classList.toggle('menu-abierto', abrir);
    botonMenu.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    const idioma = document.documentElement.lang;
    const textos = { es: ['Abrir menú', 'Cerrar menú'], en: ['Open menu', 'Close menu'] };
    botonMenu.setAttribute('aria-label', textos[idioma][abrir ? 1 : 0]);
}

botonMenu.addEventListener('click', () => {
    abrirMenu(!menu.classList.contains('abierto'));
});

enlacesMenu.forEach((enlace) => {
    enlace.addEventListener('click', () => abrirMenu(false));
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('abierto')) {
        abrirMenu(false);
        botonMenu.focus();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 900) abrirMenu(false);
});


//-- ================= JS DARK MODE ================= -->

const toggle = document.getElementById('btn-dark-mode');
const body = document.body;

function marcarTema() {
    const oscuro = body.classList.contains('dark-mode');
    toggle.setAttribute('aria-pressed', oscuro ? 'true' : 'false');
}

toggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    marcarTema();
    try {
        localStorage.setItem('tema', body.classList.contains('dark-mode') ? 'oscuro' : 'claro');
    } catch (e) { }
});

marcarTema();


//-- ================= JS IDIOMA (ES / EN) ================= -->
// Los textos están en el HTML (lang="es" / lang="en").
// Aquí solo se cambian los atributos: data-es-alt, data-en-aria-label, etc.

const botonIdioma = document.getElementById('btn-idioma');

function aplicarIdioma(idioma) {
    document.documentElement.lang = idioma;

    document.querySelectorAll('*').forEach((el) => {
        for (const attr of el.attributes) {
            if (!attr.name.startsWith('data-' + idioma + '-')) continue;
            const destino = attr.name.replace('data-' + idioma + '-', '');
            if (destino === 'text') {
                el.textContent = attr.value;
            } else {
                el.setAttribute(destino, attr.value);
            }
        }
    });

    try { localStorage.setItem('idioma', idioma); } catch (e) { }
}

botonIdioma.addEventListener('click', () => {
    aplicarIdioma(document.documentElement.lang === 'es' ? 'en' : 'es');
});

aplicarIdioma(document.documentElement.lang === 'en' ? 'en' : 'es');


//================== JS ANIMACIONES ==================
// Las secciones aparecen suavemente al entrar en pantalla.

const elementosReveal = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
    const observadorReveal = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('is-visible');
                observadorReveal.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elementosReveal.forEach((el) => observadorReveal.observe(el));
} else {
    elementosReveal.forEach((el) => el.classList.add('is-visible'));
}


//================== JS ENLACE ACTIVO EN EL MENÚ ==================

const secciones = ['about', 'project', 'experience', 'education', 'contact']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

if ('IntersectionObserver' in window) {
    const observadorMenu = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;
            enlacesMenu.forEach((a) => {
                a.classList.toggle('activo', a.getAttribute('href') === '#' + entrada.target.id);
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    secciones.forEach((s) => observadorMenu.observe(s));
}


//================== JS VÍDEOS (DigitalZyra y RutinaPro) ==================
// Los vídeos con la clase "video-auto" no se descargan hasta llegar a pantalla
// (preload="none"). Se reproducen en silencio al verse y se pausan al salir.
// Los botones usan data-video="id-del-video" y data-accion="play" o "sonido".

const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('video.video-auto').forEach((video) => {
    const botones = document.querySelectorAll('.boton-video[data-video="' + video.id + '"]');
    let pausadoPorUsuario = false;

    function marcarBotones() {
        botones.forEach((b) => {
            if (b.dataset.accion === 'play') b.classList.toggle('activo', !video.paused);
            if (b.dataset.accion === 'sonido') b.classList.toggle('activo', !video.muted);
        });
    }

    botones.forEach((boton) => {
        boton.addEventListener('click', () => {
            if (boton.dataset.accion === 'play') {
                if (video.paused) {
                    pausadoPorUsuario = false;
                    video.play().catch(() => { });
                } else {
                    pausadoPorUsuario = true;
                    video.pause();
                }
            } else {
                video.muted = !video.muted;
                if (!video.muted && video.paused) video.play().catch(() => { });
            }
        });
    });

    video.addEventListener('play', marcarBotones);
    video.addEventListener('pause', marcarBotones);
    video.addEventListener('volumechange', marcarBotones);

    if ('IntersectionObserver' in window && !reducirMovimiento) {
        new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting && !pausadoPorUsuario) {
                    video.play().catch(() => { });
                } else if (!entrada.isIntersecting) {
                    video.pause();
                }
            });
        }, { threshold: 0.4 }).observe(video);
    }
});


//================== JS COPIAR EMAIL ==================

const botonCopiar = document.getElementById('btn-copiar');

if (botonCopiar) {
    botonCopiar.addEventListener('click', async () => {
        const email = botonCopiar.dataset.email;
        try {
            await navigator.clipboard.writeText(email);
        } catch (e) {
            window.location.href = 'mailto:' + email;
            return;
        }
        botonCopiar.classList.add('copiado');
        setTimeout(() => botonCopiar.classList.remove('copiado'), 2000);
    });
}
