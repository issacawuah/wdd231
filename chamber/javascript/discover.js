// Load and display the activities data
async function loadActivities() {
    try {
        const response = await fetch('data/ghana_activities.json');
        const data = await response.json();
        displayActivities(data.ghana_activities);
    } catch (error) {
        console.error('Error loading activities:', error);
        // Fallback to static data if JSON fails to load
        const fallbackData = [
            {
                id: 1,
                name: "Cape Coast Castle",
                description: "A UNESCO World Heritage site and former slave trading post built by the Portuguese in the 15th century.",
                photo_url: "images/cape-coast-castle.webp",
                address: "Cape Coast, Central Region, Ghana"
            },
            {
                id: 2,
                name: "Kakum National Park Canopy Walkway",
                description: "Experience the rainforest from above on this thrilling 350-meter canopy walkway suspended 40 meters above the forest floor.",
                photo_url: "images/kakum-canopy-walkway.webp",
                address: "Kakum National Park, Central Region, Ghana"
            },
            {
                id: 3,
                name: "Mole National Park",
                description: "Ghana's largest wildlife park featuring elephants, antelopes, baboons, and over 300 bird species.",
                photo_url: "images/mole-national-park.webp",
                address: "Mole National Park, Savannah Region, Ghana"
            },
            {
                id: 4,
                name: "Kwame Nkrumah Memorial Park",
                description: "A memorial dedicated to Ghana's first president and independence leader.",
                photo_url: "images/nkrumah-memorial-park.webp",
                address: "High Street, Accra, Greater Accra Region, Ghana"
            },
            {
                id: 5,
                name: "Kumasi Central Market (Kejetia)",
                description: "The largest open-air market in West Africa, offering everything from traditional crafts and textiles to fresh produce and spices.",
                photo_url: "images/kumasi-central-market.webp",
                address: "Kejetia, Kumasi, Ashanti Region, Ghana"
            },
            {
                id: 6,
                name: "Boti Falls",
                description: "A stunning twin waterfall located in the Eastern Region. The falls consist of two side-by-side waterfalls that create a beautiful natural spectacle.",
                photo_url: "images/boti-falls.webp",
                address: "Boti, Eastern Region, Ghana"
            },
            {
                id: 7,
                name: "Labadi Beach",
                description: "One of Accra's most popular beaches, known for its golden sand and vibrant atmosphere.",
                photo_url: "images/labadi-beach.webp",
                address: "Labadi, Accra, Greater Accra Region, Ghana"
            },
            {
                id: 8,
                name: "Manhyia Palace Museum",
                description: "The official residence of the Asantehene (King of Ashanti) and a museum showcasing Ashanti history and culture.",
                photo_url: "images/manhyia-palace.webp",
                address: "Manhyia, Kumasi, Ashanti Region, Ghana"
            }
        ];
        displayActivities(fallbackData);
    }
}

// Display activities as cards
function displayActivities(activities) {
    const cardsContainer = document.getElementById('discover-cards');
    
    activities.forEach((activity, index) => {
        const card = document.createElement('article');
        card.className = 'activity-card';
        card.style.gridArea = `card${index + 1}`;
        
        card.innerHTML = `
            <h2>${activity.name}</h2>
            <figure>
                <img src="${activity.photo_url}" alt="${activity.name}" loading="lazy">
            </figure>
            <address>${activity.address}</address>
            <p>${activity.description}</p>
            <button class="learn-more-btn">Learn More</button>
        `;
        
        cardsContainer.appendChild(card);
    });
}

// Handle visitor message with localStorage
function handleVisitorMessage() {
    const visitorMessageElement = document.getElementById('visitor-message');
    const currentTime = Date.now();
    const lastVisit = localStorage.getItem('lastVisit');
    
    let message = '';
    
    if (!lastVisit) {
        // First visit
        message = "Welcome! Let us know if you have any questions.";
    } else {
        const timeDiff = currentTime - parseInt(lastVisit);
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        if (daysDiff < 1) {
            // Less than a day
            message = "Back so soon! Awesome!";
        } else {
            // More than a day
            const dayText = daysDiff === 1 ? 'day' : 'days';
            message = `You last visited ${daysDiff} ${dayText} ago.`;
        }
    }
    
    // Create visitor message card
    const visitorCard = document.createElement('div');
    visitorCard.className = 'visitor-card';
    visitorCard.innerHTML = `
        <h3>Welcome Back!</h3>
        <p>${message}</p>
    `;
    
    visitorMessageElement.appendChild(visitorCard);
    
    // Store current visit time
    localStorage.setItem('lastVisit', currentTime.toString());
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadActivities();
    handleVisitorMessage();
}); 