// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const openMenu = document.getElementById('openMenu');
    const closeMenu = document.getElementById('closeMenu');
    const navLinks = document.getElementById('navLinks');

    if (openMenu && closeMenu && navLinks) {
        openMenu.addEventListener('click', function() {
            navLinks.classList.add('active');
        });

        closeMenu.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    }

    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.nav-links ul li a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });

    // Simple testimonial slider (can be enhanced with actual sliding functionality)
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    
    if (testimonials.length > 1) {
        // Hide all testimonials except the first one on mobile
        if (window.innerWidth < 768) {
            testimonials.forEach((testimonial, index) => {
                if (index !== 0) {
                    testimonial.style.display = 'none';
                }
            });

            // Set interval to switch testimonials
            setInterval(() => {
                testimonials[currentTestimonial].style.display = 'none';
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                testimonials[currentTestimonial].style.display = 'block';
            }, 5000);
        }
    }

    // Highlight active nav item based on current page
    const currentPage = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-links ul li a');
    
    navItems.forEach(item => {
        // Get the href attribute and extract the path
        const href = item.getAttribute('href');
        
        // Check if the current page URL contains the href value
        if (currentPage.includes(href) && href !== 'index.html') {
            item.classList.add('active');
        } else if (currentPage.endsWith('/') || currentPage.endsWith('index.html')) {
            // If we're on the home page
            if (href === 'index.html') {
                item.classList.add('active');
            }
        }
    });

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple scroll animation for elements
    const fadeElements = document.querySelectorAll('.feature-card, .testimonial');
    
    const fadeInOnScroll = () => {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in');
            }
        });
    };

    // Add the fade-in class to style.css
    const style = document.createElement('style');
    style.innerHTML = `
        .feature-card, .testimonial {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .fade-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', fadeInOnScroll);
    fadeInOnScroll(); // Check on initial load
}); 