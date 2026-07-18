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

    // 2. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. Trigger initial hero animations
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

    // 6. Cinematic Hero Video Background Sequencer (No Scroll Parallax)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        const videos = [
            document.getElementById('hero-video-1'),
            document.getElementById('hero-video-2'),
            document.getElementById('hero-video-3')
        ];
        
        if (videos[0] && videos[1] && videos[2]) {
            // Progressive background loading to prevent network choking on page load
            videos[0].addEventListener('playing', () => {
                videos[1].preload = "auto";
                videos[1].load();
            }, { once: true });

            videos[1].addEventListener('playing', () => {
                videos[2].preload = "auto";
                videos[2].load();
            }, { once: true });

            videos[2].addEventListener('playing', () => {
                videos[0].preload = "auto";
                videos[0].load();
            }, { once: true });

            const transitionTo = (nextIdx, currentIdx) => {
                const video = videos[currentIdx];
                const nextVideo = videos[nextIdx];
                
                // Prevent duplicate trigger transitions
                if (nextVideo.classList.contains('active')) return;
                
                nextVideo.currentTime = 0;
                nextVideo.play().then(() => {
                    nextVideo.classList.add('active');
                    video.classList.remove('active');
                }).catch(err => {
                    console.warn('Failed to play next video in loop sequence:', err);
                    nextVideo.classList.add('active');
                    video.classList.remove('active');
                });
            };

            // Set up ended event listeners for sequential loop
            videos.forEach((video, idx) => {
                const nextIdx = (idx + 1) % videos.length;
                
                video.addEventListener('ended', () => {
                    transitionTo(nextIdx, idx);
                });

                // Specific cut logic for Video 3 (idx === 2) - cut last 3 seconds
                if (idx === 2) {
                    let cutTriggered = false;
                    video.addEventListener('play', () => {
                        cutTriggered = false;
                    });
                    video.addEventListener('timeupdate', () => {
                        if (!cutTriggered && video.duration && video.currentTime >= video.duration - 3) {
                            cutTriggered = true;
                            transitionTo(nextIdx, idx);
                        }
                    });
                }
            });

            // Ensure first video starts playing immediately
            videos[0].play().catch(err => {
                console.log('First video autoplay was blocked or failed:', err);
            });
        }
    }

    // 7. Request a Quote via WhatsApp
    const quoteForm = document.querySelector('.contact-form');
    const submitWhatsappBtn = document.getElementById('btn-submit-whatsapp');
    
    if (quoteForm && submitWhatsappBtn) {
        submitWhatsappBtn.addEventListener('click', () => {
            if (quoteForm.reportValidity()) {
                const name = document.getElementById('form-name').value;
                const email = document.getElementById('form-email').value;
                const phone = document.getElementById('form-phone').value;
                const serviceSelect = document.getElementById('form-service');
                const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
                const message = document.getElementById('form-message').value;
                
                const formattedMessage = `*Rahul Road Lines - Quote Request*\n` +
                                         `------------------------------------\n` +
                                         `*Name:* ${name}\n` +
                                         `*Phone:* ${phone}\n` +
                                         `*Email:* ${email}\n` +
                                         `*Service:* ${serviceText}\n` +
                                         `*Message:* ${message}`;
                
                const whatsappUrl = `https://api.whatsapp.com/send?phone=918966055996&text=${encodeURIComponent(formattedMessage)}`;
                window.open(whatsappUrl, '_blank');
            }
        });
    }

});

// 6. Loading Screen Fade-out
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
});
