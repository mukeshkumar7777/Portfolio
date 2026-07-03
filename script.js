// Scrolling target behavior
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        // Close navigation drawer if open on mobile
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger-toggle');
        if (navMenu && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            hamburger.classList.remove('open');
        }

        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Play pronunciation using browser SpeechSynthesis API
function playPronunciation() {
    if ('speechSynthesis' in window) {
        // Cancel any current speech output
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance("mukeshfy");
        utterance.lang = "en-US";
        utterance.rate = 0.85; // slightly slower for clear articulation
        utterance.pitch = 1.0;
        
        window.speechSynthesis.speak(utterance);
    } else {
        // Fallback for browsers that don't support SpeechSynthesis
        alert("Pronounced as: mu-kesh-fy");
    }
}

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger-toggle');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navMenu.classList.toggle('open');
    });
}

// Scrollspy navbar highlighting & header blur adjustment & Scroll Progress
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.getElementById('header');
const scrollProgress = document.getElementById('scroll-progress');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Scroll progress update
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
        const progress = (scrollPos / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    }

    // Header resize / border scroll update
    if (scrollPos > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Back to top indicator
    if (scrollPos > 400) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }

    // Scrollspy active tag updates
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 180; // offset adjustment
        if (scrollPos >= sectionTop) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const onclickAttr = link.getAttribute('onclick');
        if (onclickAttr && currentSection && onclickAttr.includes(currentSection)) {
            link.classList.add('active');
        }
    });
});

// Entrance animation on viewport intercept
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });
sections.forEach(section => observer.observe(section));

// Form handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Your message has been sent successfully!');
        contactForm.reset();
    });
}

// TypeWriter Script
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
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

        let typeSpeed = 80;

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

document.addEventListener('DOMContentLoaded', () => {
    const txtElement = document.querySelector('.typewriter-text');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-text'));
        new TypeWriter(txtElement, words, 2000);
    }
});
