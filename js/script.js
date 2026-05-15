document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Sticky Navbar
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Trigger initial hero animations
    const fadeElements = document.querySelectorAll('.fade-in-up');
    
    // Slight delay for smooth initial load
    setTimeout(() => {
        fadeElements.forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // 3. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Offset for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Number Counter Animation using IntersectionObserver
    const counters = document.querySelectorAll('.counter-number');
    const speed = 200; // The lower the slower

    const animateCounters = (counter, target) => {
        const updateCount = () => {
            const current = +counter.innerText;
            const inc = target / speed;

            if (current < target) {
                counter.innerText = Math.ceil(current + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target + (target > 50 ? '+' : ''); // Add '+' to large numbers
            }
        };
        updateCount();
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                animateCounters(entry.target, target);
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 5. Lightweight Parallax Effect for Showcase Section
    // Using vanilla JS for smooth parallax without heavy libraries
    const showcaseSection = document.querySelector('.parallax');
    
    if (showcaseSection) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            // Adjust background position based on scroll
            // Limited to prevent buggy transitions
            showcaseSection.style.backgroundPositionY = `${scrollPosition * 0.4}px`;
        });
    }

});
