// ====================================================
// Navigation & Smooth Scrolling
// ====================================================
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        // Close navigation drawer if open on mobile
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger-toggle');
        if (navMenu && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            if (hamburger) {
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }

        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: id === 'home' ? 0 : offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Hamburger Menu Toggle & Keyboard Accessibility
const hamburger = document.getElementById('hamburger-toggle');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// Escape key listener for closing mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (navMenu && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            if (hamburger) {
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    }
});

// ====================================================
// Scroll Progress, Header Scroll, & Back to Top
// ====================================================
const header = document.getElementById('header');
const scrollProgress = document.getElementById('scroll-progress');
const backToTop = document.getElementById('back-to-top');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            const scrollPos = window.scrollY;

            // Scroll progress bar
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0 && scrollProgress) {
                const progress = (scrollPos / totalHeight) * 100;
                scrollProgress.style.width = `${progress}%`;
            }

            // Header background blur & shadow
            if (header) {
                if (scrollPos > 40) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }

            // Back to top floating button
            if (backToTop) {
                if (scrollPos > 400) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            }

            // Scrollspy active navbar links
            let currentSection = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 160;
                if (scrollPos >= sectionTop) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && currentSection && href.includes(currentSection)) {
                    link.classList.add('active');
                }
            });

            isScrolling = false;
        });
        isScrolling = true;
    }
});

// Entrance Animations with IntersectionObserver
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

sections.forEach(section => observer.observe(section));

// ====================================================
// TypeWriter Animation
// ====================================================
class TypeWriter {
    constructor(txtElement, words, wait = 2500) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 75;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 400;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ====================================================
// Project Category Filtering
// ====================================================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const filterValue = btn.getAttribute('data-filter');

            // Filter project cards
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.96)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'none';
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });
}

// ====================================================
// Toast Notification & Copy to Clipboard
// ====================================================
let toastTimeout;

function showToast(message, icon = 'fa-check-circle') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    const iconEl = toast.querySelector('.toast-icon');
    if (iconEl) {
        iconEl.className = `fas ${icon} toast-icon`;
    }

    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

function copyEmailToClipboard() {
    const email = 'mukeshsanivada.7@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
            showToast('Copied email: ' + email + ' 📋', 'fa-copy');
        }).catch(() => {
            fallbackCopy(email);
        });
    } else {
        fallbackCopy(email);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast('Copied email: ' + text + ' 📋', 'fa-copy');
    } catch (err) {
        showToast('Email: ' + text, 'fa-envelope');
    }
    document.body.removeChild(textarea);
}

// ====================================================
// Animated Stat Counter (Count-up effect)
// ====================================================
let statsAnimated = false;

function initStatCounter() {
    const statsContainer = document.getElementById('about-stats');
    if (!statsContainer) return;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateStatNumbers();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    statsObserver.observe(statsContainer);
}

function animateStatNumbers() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        if (isNaN(target)) return;

        const duration = 1600; // ms
        const startTime = performance.now();

        function updateCount(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic physics
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOutProgress * target);

            counter.textContent = `${current}+`;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                counter.textContent = `${target}+`;
            }
        }

        requestAnimationFrame(updateCount);
    });
}

// ====================================================
// Initialization on DOM Ready
// ====================================================
document.addEventListener('DOMContentLoaded', () => {
    const txtElement = document.querySelector('.typewriter-text');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-text'));
        new TypeWriter(txtElement, words, 2200);
    }

    initStatCounter();
});
