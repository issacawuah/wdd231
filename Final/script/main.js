 document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value.trim()
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                alert('Please fill out all required fields.');
                return;
            }

            // Store form data in localStorage
            localStorage.setItem('contactFormData', JSON.stringify(formData));

            // Redirect to form-action.html
            window.location.href = 'form-action.html';
        });
    }

    // Placeholder: Directory Search and Filters
    const searchInput = document.getElementById('searchInput');
    const cuisineFilter = document.getElementById('cuisineFilter');
    const locationFilter = document.getElementById('locationFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const trucksContainer = document.getElementById('trucksContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    if (searchInput && cuisineFilter && locationFilter && ratingFilter && trucksContainer && loadMoreBtn) {
        // Example truck data (replace with actual data source)
        const trucks = [
            // Add truck data here if needed for dynamic loading
        ];

        function renderTrucks() {
            // Placeholder: Implement search/filter logic
            trucksContainer.innerHTML = ''; // Clear existing content
            // Add logic to filter and render trucks
        }

        searchInput.addEventListener('input', renderTrucks);
        cuisineFilter.addEventListener('change', renderTrucks);
        locationFilter.addEventListener('change', renderTrucks);
        ratingFilter.addEventListener('change', renderTrucks);
        loadMoreBtn.addEventListener('click', function() {
            // Placeholder: Load more trucks
        });

        // Initial render
        renderTrucks();
    }

    // Placeholder: FAQ Toggle (for contact.html)
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('active');
        });
    });
});