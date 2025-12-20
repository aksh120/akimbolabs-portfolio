console.log('✨ Akimbo Labs Portfolio - Initializing...');

const initContactSystem = () => {
    const form = document.getElementById('contactForm');
    if (form) {
        form.setAttribute('method', 'POST');

        form.onsubmit = async (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            const btn = form.querySelector('.submit-btn');
            if (btn.classList.contains('loading')) return false;

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);

            delete object.redirect;

            btn.classList.add('loading');

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(object)
                });
                const result = await response.json();

                btn.classList.remove('loading');
                if (response.status === 200) {
                    const modal = document.getElementById('contactModal');
                    if (modal) modal.classList.add('active');
                    form.reset();
                    form.querySelectorAll('.form-group').forEach(g => g.classList.remove('focused'));
                } else {
                    alert('Submission error: ' + (result.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Fetch error:', error);
                btn.classList.remove('loading');
                if (window.location.protocol === 'file:') {
                    alert('SECURITY NOTICE: Browser blocks form submission on local files. To fix this, right-click index.html and select "Open with Live Server" in VS Code, or upload to a web host.');
                } else {
                    alert('Connection error. Please try again.');
                }
            }
            return false;
        };

        form.querySelectorAll('input,textarea,select').forEach(i => {
            i.setAttribute('placeholder', ' ');
            const up = () => {
                const g = i.closest('.form-group');
                if (!g) return;
                if (i.value || document.activeElement === i) g.classList.add('focused');
                else g.classList.remove('focused');
            };
            i.addEventListener('focus', up);
            i.addEventListener('blur', up);
            i.addEventListener('input', up);
            up();
        });

        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.addEventListener('click', (ev) => {
                if (ev.target === modal || ev.target.closest('.modal-close-btn')) {
                    modal.classList.remove('active');
                }
            });
        }
    }

    document.querySelectorAll('.protected-link').forEach(link => {
        const u = link.dataset.u,
            d = link.dataset.d;
        if (u && d) {
            const email = `${u}@${d}`;
            link.href = `mailto:${email}`;
            const span = link.querySelector('.cta-address, span, i + span');
            if (span && span.textContent.includes('Reveal')) span.textContent = email;
        }
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactSystem);
} else {
    initContactSystem();
}


function parseDelayMs(el) {
    const raw = getComputedStyle(el).getPropertyValue('--delay').trim();
    if (!raw) return 0;
    if (raw.endsWith('ms')) return Number.parseFloat(raw) || 0;
    if (raw.endsWith('s')) return (Number.parseFloat(raw) || 0) * 1000;
    return Number.parseFloat(raw) || 0;
}

function animateStatNumbers(container) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const numbers = container.querySelectorAll('.stat-number');
    numbers.forEach((el) => {
        if (!el.dataset.originalValue) el.dataset.originalValue = el.textContent?.trim() ?? '';
        const original = el.dataset.originalValue;
        const match = original.match(/(\d+(?:\.\d+)?)(.*)/);
        if (!match) return;

        const target = Number.parseFloat(match[1]);
        const suffix = match[2] ?? '';
        const duration = 1500;
        const start = performance.now();

        const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 4);
            const current = target * eased;
            const display = Number.isInteger(target) ? Math.round(current) : Math.round(current * 10) / 10;
            el.textContent = `${display}${suffix}`;
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = original;
        };

        el.textContent = `0${suffix}`;
        requestAnimationFrame(tick);
    });
}

function playRevealAnimation(el) {
    const delay = parseDelayMs(el);

    let keyframes = [{
        opacity: 0,
        transform: 'translate3d(0, 50px, 0) rotateX(10deg) scale(0.95)',
        filter: 'blur(8px)'
    },
    {
        opacity: 1,
        transform: 'translate3d(0, 0, 0) rotateX(0deg) scale(1)',
        filter: 'blur(0px)'
    }
    ];

    let duration = 900;
    let easing = 'cubic-bezier(0.25, 1, 0.5, 1)';

    if (el.classList.contains('service-card')) {
        keyframes = [{
            opacity: 0,
            transform: 'translate3d(0, 100px, 0) rotateX(15deg) rotateY(-5deg) scale(0.9)',
            filter: 'blur(10px)'
        },
        {
            opacity: 1,
            transform: 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1)',
            filter: 'blur(0px)'
        }
        ];
        duration = 1100;
    } else if (el.classList.contains('work-card-experimental')) {
        keyframes = [{
            opacity: 0,
            transform: 'translate3d(0, 80px, 0) rotateX(15deg) scale(0.95)',
            filter: 'blur(12px)'
        },
        {
            opacity: 1,
            transform: 'translate3d(0, 0, 0) rotateX(0deg) scale(1)',
            filter: 'blur(0px)'
        }
        ];
        duration = 1200;
    } else if (el.classList.contains('skill-tag')) {
        keyframes = [{
            opacity: 0,
            transform: 'translate3d(0, 20px, 0) scale(0.5)',
            filter: 'blur(5px)'
        },
        {
            opacity: 1,
            transform: 'translate3d(0, 0, 0) scale(1)',
            filter: 'blur(0px)'
        }
        ];
        duration = 600;
        easing = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    try {
        el.animate(keyframes, {
            duration,
            delay,
            easing,
            fill: 'both'
        });

        el.classList.add('shock');
        setTimeout(() => el.classList.remove('shock'), duration);
    } catch (e) {
        el.style.opacity = 1;
        el.style.transform = 'none';
        el.style.filter = 'none';
    }

    if (el.classList.contains('stats-grid')) {
        animateStatNumbers(el);
    }
}

window.addEventListener('load', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 2500);
});

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        particle.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 20}s;
            animation-duration: ${Math.random() * 20 + 20}s;
            opacity: ${Math.random() * 0.3 + 0.1};
        `;
        particlesContainer.appendChild(particle);
    }
}
createParticles();

const cursorDot = document.querySelector('.cursor-dot');
const cursorCircle = document.querySelector('.cursor-circle');
let mouseX = 0,
    mouseY = 0;
let cursorX = 0,
    cursorY = 0,
    dotX = 0,
    dotY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    dotX += (mouseX - dotX) * 0.2;
    dotY += (mouseY - dotY) * 0.2;
    cursorX += (mouseX - cursorX) * 0.08;
    cursorY += (mouseY - cursorY) * 0.08;

    if (cursorDot) {
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
    }
    if (cursorCircle) {
        cursorCircle.style.left = cursorX + 'px';
        cursorCircle.style.top = cursorY + 'px';
    }
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.addEventListener('mousedown', () => cursorDot?.classList.add('clicking'));
document.addEventListener('mouseup', () => cursorDot?.classList.remove('clicking'));

document.querySelectorAll('.tile, button, a, .social-icon, .cta-email-box, .work-card, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

const tiles = document.querySelectorAll('.tile');
tiles.forEach(tile => {
    tile.addEventListener('mousemove', (e) => {
        const rect = tile.getBoundingClientRect();
        tile.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        tile.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    });

    tile.addEventListener('click', () => {
        const targetId = tile.getAttribute('data-target');
        if (!targetId) return;
        const overlay = document.getElementById(`${targetId}-overlay`);
        if (overlay) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => initScrollReveal(overlay), 50);
        }
    });

    let tiltX = 0,
        tiltY = 0,
        targetTiltX = 0,
        targetTiltY = 0;
    tile.addEventListener('mousemove', (e) => {
        const rect = tile.getBoundingClientRect();
        targetTiltX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -5;
        targetTiltY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 5;
    });
    tile.addEventListener('mouseleave', () => {
        targetTiltX = 0;
        targetTiltY = 0;
    });

    function animateTilt() {
        tiltX += (targetTiltX - tiltX) * 0.1;
        tiltY += (targetTiltY - tiltY) * 0.1;
        const isHovered = tile.matches(':hover');
        tile.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(${isHovered ? -8 : 0}px) scale(${isHovered ? 1.02 : 1})`;
        requestAnimationFrame(animateTilt);
    }
    animateTilt();
});

function initScrollReveal(overlay) {
    const scrollContainer = overlay.querySelector('.scroll-container');
    const revealItems = overlay.querySelectorAll('.reveal-item');
    if (!scrollContainer) return;

    if (overlay._revealObserver) overlay._revealObserver.disconnect();

    revealItems.forEach(item => {
        item.classList.remove('visible');
        item.classList.remove('shock');
        item.dataset.revealed = '0';
        item.style.opacity = '0';
    });

    scrollContainer.scrollTop = 0;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                if (el.dataset.revealed === '1') return;
                el.dataset.revealed = '1';
                el.classList.add('visible');
                playRevealAnimation(el);
                observer.unobserve(el);
            }
        });
    }, {
        root: scrollContainer,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    overlay._revealObserver = observer;
    revealItems.forEach(item => observer.observe(item));

    let lastY = 0;
    let rafId = null;
    const onScroll = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            const y = scrollContainer.scrollTop;
            overlay.style.setProperty('--overlay-parallax-y', `${-y * 0.1}px`);
            overlay.style.setProperty('--overlay-parallax-rot', `${Math.min(Math.max((y - lastY) * 0.1, -5), 5)}deg`);
            lastY = y;
            rafId = null;
        });
    };
    scrollContainer.addEventListener('scroll', onScroll, {
        passive: true
    });
}

const closeBtns = document.querySelectorAll('.close-btn');
const overlays = document.querySelectorAll('.overlay-wrapper');

function closeOverlay(overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

closeBtns.forEach(btn => btn.addEventListener('click', () => closeOverlay(btn.closest('.overlay-wrapper'))));
overlays.forEach(overlay => overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay(overlay);
}));
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') overlays.forEach(o => o.classList.contains('active') && closeOverlay(o));
});

document.querySelectorAll('.social-icon').forEach(icon => {
    let x = 0,
        y = 0,
        tx = 0,
        ty = 0;
    icon.addEventListener('mousemove', (e) => {
        const rect = icon.getBoundingClientRect();
        tx = (e.clientX - rect.left - rect.width / 2) * 0.4;
        ty = (e.clientY - rect.top - rect.height / 2) * 0.4;
    });
    icon.addEventListener('mouseleave', () => {
        tx = 0;
        ty = 0;
    });

    function loop() {
        x += (tx - x) * 0.15;
        y += (ty - y) * 0.15;
        icon.style.transform = `translate(${x}px, ${y}px) scale(${icon.matches(':hover') ? 1.15 : 1})`;
        requestAnimationFrame(loop);
    }
    loop();
});

const textElement = document.getElementById('cyber-fader');
const phrases = [
    "Constructing the unseen", "Built to stand out", "Crafted with intent",
    "Clean. Fast. Modern.", "Designed to feel", "Simple but sharp",
    "Code with personality", "Smooth by design", "Crafted for impact",
    "Modern at the core", "Made to flow"
];

class ScrambleText {
    constructor(el, phrases) {
        this.el = el;
        this.phrases = phrases;
        this.queue = [];
        this.frame = 0;
        this.phraseIdx = 0;
        this.update = this.update.bind(this);
        this.setText(this.phrases[0]);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({
                from,
                to,
                start,
                end
            });
        }
        cancelAnimationFrame(this.raf);
        this.frame = 0;
        this.update();
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let {
                from,
                to,
                start,
                end,
                char
            } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = '!<>-_\\/[]{}—=+*^?#________'[Math.floor(Math.random() * 26)];
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            setTimeout(() => this.next(), 2000);
        } else {
            this.raf = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    next() {
        this.phraseIdx = (this.phraseIdx + 1) % this.phrases.length;
        this.setText(this.phrases[this.phraseIdx]);
    }
}
if (textElement) setTimeout(() => new ScrambleText(textElement, phrases), 2000);

const artifactContainer = document.getElementById('canvas-container');
if (artifactContainer && window.THREE && window.innerWidth > 900) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setSize(350, 350);
    artifactContainer.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.4, 0);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffc160,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const coreGeometry = new THREE.IcosahedronGeometry(1.0, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xff8844,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });

    const cube = new THREE.Mesh(geometry, material);
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(cube);
    scene.add(core);
    camera.position.z = 3.5;

    let targetX = 0,
        targetY = 0;
    const animateArtifact = () => {
        requestAnimationFrame(animateArtifact);
        targetX = (mouseX - window.innerWidth / 2) * 0.005;
        targetY = (mouseY - window.innerHeight / 2) * 0.005;
        cube.rotation.y += 0.08 * (targetX - cube.rotation.y);
        cube.rotation.x += 0.08 * (targetY - cube.rotation.x);
        cube.rotation.z += 0.002;
        core.rotation.y -= 0.08 * (targetX - core.rotation.y);
        core.rotation.x -= 0.08 * (targetY - core.rotation.x);
        core.rotation.z -= 0.005;
        const s = 1 + Math.sin(Date.now() * 0.002) * 0.05;
        cube.scale.set(s, s, s);
        renderer.render(scene, camera);
    };
    animateArtifact();
}

const canvas = document.getElementById('fluid-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, points = [];
    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.ox = x;
            this.oy = y;
            this.vx = 0;
            this.vy = 0;
        }
        update() {
            const dx = mouseX - this.x,
                dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                const f = (200 - dist) / 200;
                this.vx -= (dx / dist) * f * 2;
                this.vy -= (dy / dist) * f * 2;
            }
            this.vx += (this.ox - this.x) * 0.1;
            this.vy += (this.oy - this.y) * 0.1;
            this.vx *= 0.94;
            this.vy *= 0.94;
            this.x += this.vx;
            this.y += this.vy;
        }
    }
    const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        points = [];
        for (let x = 0; x <= width; x += 40)
            for (let y = 0; y <= height; y += 40) points.push(new Point(x, y));
    };
    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        for (let p of points) {
            p.update();
            if (points[0] === p) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
        requestAnimationFrame(animate);
    };
    window.addEventListener('resize', resize);
    resize();
    animate();
}

const blobs = document.querySelectorAll('.gradient-blob');
let bx = 0,
    by = 0;

function animateBlobs() {
    bx += ((mouseX / window.innerWidth - 0.5) * 40 - bx) * 0.03;
    by += ((mouseY / window.innerHeight - 0.5) * 40 - by) * 0.03;
    blobs.forEach((b, i) => b.style.transform = `translate(calc(-50% + ${bx * (i == 0 ? 1 : -0.5)}px), calc(-50% + ${by * (i == 0 ? 1 : -0.5)}px))`);
    requestAnimationFrame(animateBlobs);
}
animateBlobs();