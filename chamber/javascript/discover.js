 // Mobile menu toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Region filter buttons
const regionBtns = document.querySelectorAll('.region-btn');
regionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        regionBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Visitor counter functionality
function updateVisitorCounter() {
    // Get last visit date from localStorage
    const lastVisit = localStorage.getItem('lastVisit');
    const now = new Date();
    
    if (lastVisit) {
        const lastVisitDate = new Date(parseInt(lastVisit));
        const daysSince = Math.floor((now - lastVisitDate) / (1000 * 60 * 60 * 24));
        document.querySelectorAll('.counter')[1].textContent = `${daysSince === 0 ? 'Today' : daysSince + ' days ago'}`;
    } else {
        document.querySelectorAll('.counter')[1].textContent = 'Never';
    }
    
    // Update visit count
    let visitCount = localStorage.getItem('visitCount') || 0;
    visitCount = parseInt(visitCount) + 1;
    localStorage.setItem('visitCount', visitCount);
    document.querySelectorAll('.counter')[0].textContent = `${visitCount}${visitCount === 1 ? 'st' : visitCount === 2 ? 'nd' : visitCount === 3 ? 'rd' : 'th'}`;
    
    // Store current visit time
    localStorage.setItem('lastVisit', now.getTime());
}

// Initialize visitor counter
updateVisitorCounter();

// Animation for cards on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animated').forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    observer.observe(card);
});