const preloader = document.getElementById('preloader');

setTimeout(() => {
    preloader.classList.add('spinner-hidden');
}, 600);

window.addEventListener('load', () => {
    preloader.classList.add('hidden');
});

setTimeout(() => {
    preloader.classList.add('hidden');
}, 4000);

// 3D Parallax mountains
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let scrollProgress = 0;

function updateMountains() {
    const layers = document.querySelectorAll('.parallax-layer');
    const fog1 = document.querySelector('.fog-1');
    const fog2 = document.querySelector('.fog-2');

    layers.forEach(layer => {
        const speed = parseFloat(layer.dataset.speed) || 0;
        const translateY = scrollProgress * speed * 200;
        const rotateX = targetY * speed * 6;
        const rotateY = targetX * speed * 6;
        const translateZ = speed * 30;
        layer.style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
    });

    if (fog1) {
        fog1.style.transform = `translateY(${scrollProgress * 15}px)`;
    }
    if (fog2) {
        fog2.style.transform = `translateY(${scrollProgress * 20}px)`;
    }
}

function animate3D() {
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;
    updateMountains();
    requestAnimationFrame(animate3D);
}

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.classList.toggle('scrolled', window.scrollY > 50);

    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    scrollProgress = Math.min(window.scrollY / maxScroll, 1);
});

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

animate3D();

document.getElementById('nav-toggle').addEventListener('click', () => {
    const nav = document.getElementById('nav-list');
    nav.classList.toggle('active');
    document.body.classList.toggle('nav-open', nav.classList.contains('active'));
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('nav-list').classList.remove('active');
        document.body.classList.remove('nav-open');
    });
});

const sections = document.querySelectorAll('.section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        const bottom = top + section.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bottom) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active-link');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

const scrollUp = document.getElementById('scroll-up');

window.addEventListener('scroll', () => {
    scrollUp.classList.toggle('show', window.scrollY > 400);
});

scrollUp.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.4s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

function animateCounters() {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
        const target = +counter.dataset.target;
        const duration = 1500;
        const start = performance.now();

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.round(progress * target);
            counter.textContent = current < target ? current : target + '+';
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    });
}

function animateSkills() {
    const fills = document.querySelectorAll('.skill-fill');
    fills.forEach(fill => {
        const width = fill.dataset.width;
        fill.style.width = width + '%';
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('about-stats')) {
                animateCounters();
            }
            if (entry.target.classList.contains('about-skills')) {
                animateSkills();
            }
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const stats = document.querySelector('.about-stats');
if (stats) observer.observe(stats);

const skills = document.querySelector('.about-skills');
if (skills) observer.observe(skills);

document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('.btn');
    const original = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
        this.reset();
        setTimeout(() => {
            btn.innerHTML = original;
            btn.disabled = false;
        }, 2000);
    }, 1500);
});

document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

const themeToggle = document.getElementById('theme-toggle');

function setTheme(dark) {
    document.body.classList.toggle('dark-mode', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    setTheme(true);
}

themeToggle.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark-mode'));
});
