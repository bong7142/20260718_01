document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       THEME TOGGLE (LIGHT / DARK)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Check system preference or localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    /* ==========================================================================
       MOBILE NAV DRAWER
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        mobileMenuBtn.classList.toggle('open');
        navMenu.classList.toggle('open');
    };

    const closeMenu = () => {
        mobileMenuBtn.classList.remove('open');
        navMenu.classList.remove('open');
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('open')) {
            closeMenu();
        }
    });

    /* ==========================================================================
       STICKY NAVBAR & ACTIVE NAV LINK ON SCROLL
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Sticky class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset navigation height
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initial scroll check

    /* ==========================================================================
       HERO TYPING ANIMATION
       ========================================================================== */
    const typingSpan = document.getElementById('typingText');
    const roles = ['Creative Developer', 'UI/UX Designer', 'Problem Solver'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeRole = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            typingSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150; // Typing speed
        }

        // Word completed typing
        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000; // Pause at full word
            isDeleting = true;
        } 
        // Word completely deleted
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeRole, typingSpeed);
    };

    // Start typing loop
    setTimeout(typeRole, 1000);

    /* ==========================================================================
       FADE IN ON SCROLL (INTERSECTION OBSERVER)
       ========================================================================== */
    const fadeInElements = document.querySelectorAll('.fade-in-element');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, observerOptions);

        fadeInElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for older browsers
        fadeInElements.forEach(element => {
            element.classList.add('visible');
        });
    }

    /* ==========================================================================
       CONTACT FORM VALIDATION & INTERACTION
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formSuccessOverlay = document.getElementById('formSuccessOverlay');
    const btnResetForm = document.getElementById('btnResetForm');
    
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userMessage = document.getElementById('userMessage');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    // Simple email validator
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateInput = (input, errorElement, condition) => {
        const group = input.parentElement;
        if (condition) {
            group.classList.remove('invalid');
            return true;
        } else {
            group.classList.add('invalid');
            return false;
        }
    };

    // Live validation on blur
    userName.addEventListener('blur', () => {
        validateInput(userName, nameError, userName.value.trim().length > 0);
    });

    userEmail.addEventListener('blur', () => {
        validateInput(userEmail, emailError, isValidEmail(userEmail.value.trim()));
    });

    userMessage.addEventListener('blur', () => {
        validateInput(userMessage, messageError, userMessage.value.trim().length >= 10);
    });

    // Form submit listener
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateInput(userName, nameError, userName.value.trim().length > 0);
        const isEmailValid = validateInput(userEmail, emailError, isValidEmail(userEmail.value.trim()));
        const isMessageValid = validateInput(userMessage, messageError, userMessage.value.trim().length >= 10);

        if (isNameValid && isEmailValid && isMessageValid) {
            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitText = submitBtn.querySelector('span');
            const sendIcon = submitBtn.querySelector('.send-icon');

            // Visual feedback: submitting...
            submitBtn.disabled = true;
            submitText.textContent = '전송 중...';
            sendIcon.style.display = 'none';

            // Simulate form submission
            setTimeout(() => {
                formSuccessOverlay.classList.add('active');
                
                // Reset submit button state
                submitBtn.disabled = false;
                submitText.textContent = '메시지 전송하기';
                sendIcon.style.display = 'inline-block';
            }, 1500);
        }
    });

    // Form reset overlay button
    btnResetForm.addEventListener('click', () => {
        contactForm.reset();
        
        // Clear all error state classes
        userName.parentElement.classList.remove('invalid');
        userEmail.parentElement.classList.remove('invalid');
        userMessage.parentElement.classList.remove('invalid');

        formSuccessOverlay.classList.remove('active');
    });
});
