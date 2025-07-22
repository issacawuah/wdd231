const directory = document.getElementById('directory');
const gridBtn = document.getElementById('grid-view');
const listBtn = document.getElementById('list-view');

async function getMembers() {
  const response = await fetch('data/member.json'); 
  const members = await response.json();
  displayMembers(members);
}

function displayMembers(members) {
  directory.innerHTML = members.map((member, idx) => `
    <div class="member-card" data-idx="${idx}">
      <img src="images/${member.image}" alt="${member.name}">
      <h4>${member.name}</h4>
      <button class="toggle-details">Show Details</button>
      <div class="member-details" style="display:none;">
        <p>${member.address}</p>
        <p>${member.phone}</p>
        <a href="${member.website}" target="_blank">${member.website}</a>
        <span class="membership level${member.membership}">Level: ${member.membership}</span>
      </div>
    </div>
  `).join('');

  // Add event listeners for toggling details
  document.querySelectorAll('.toggle-details').forEach((btn, i) => {
    btn.addEventListener('click', function() {
      const details = this.parentElement.querySelector('.member-details');
      if (details.style.display === 'none') {
        details.style.display = 'block';
        this.textContent = 'Hide Details';
      } else {
        details.style.display = 'none';
        this.textContent = 'Show Details';
      }
    });
  });
}

gridBtn.addEventListener('click', () => {
  directory.classList.add('grid');
  directory.classList.remove('list');
  gridBtn.classList.add('active');
  listBtn.classList.remove('active');
});

listBtn.addEventListener('click', () => {
  directory.classList.add('list');
  directory.classList.remove('grid');
  listBtn.classList.add('active');
  gridBtn.classList.remove('active');
});

getMembers();

// Weather display for Timbuktu using Open-Meteo API
async function displayWeather() {
  const weatherPanel = document.querySelector('.panel.weather');
  weatherPanel.innerHTML = '<h3>Current Weather</h3><p>Loading...</p>';
  try {
    // Timbuktu coordinates: 16.7666, -3.0026
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=16.7666&longitude=-3.0026&current_weather=true&temperature_unit=fahrenheit';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather fetch failed');
    const data = await response.json();
    const w = data.current_weather;
    weatherPanel.innerHTML = `
      <h3>Current Weather</h3>
      <p><strong>${w.temperature}&deg;F</strong><br>
      Wind: ${w.windspeed} mph<br>
      Weather Code: ${w.weathercode}</p>
    `;
  } catch (err) {
    weatherPanel.innerHTML = '<h3>Current Weather</h3><p>Unable to load weather data.</p>';
  }
}

displayWeather();

document.getElementById('last-modified').textContent =
  `Last Modification: ${document.lastModified}`;

// 1. Keynote Tickets Modal
function setupKeynoteModal() {
  const ctaBtn = document.querySelector('.cta');
  let modal = document.getElementById('keynote-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'keynote-modal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.5)';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.innerHTML = `<div style="background:#fff;padding:2rem;border-radius:8px;max-width:90vw;max-height:90vh;position:relative;text-align:center;">
      <h2>Keynote Tickets</h2>
      <p>Tickets will be available soon! Stay tuned for updates.</p>
      <button id="close-modal">Close</button>
    </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => {
      if (e.target === modal || e.target.id === 'close-modal') modal.style.display = 'none';
    });
  }
  ctaBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });
}

// 2. Show/Hide Events Panel
function setupEventsPanel() {
  const eventsPanel = document.querySelector('.panel.events');
  eventsPanel.innerHTML = `<h3>Events</h3><button id="toggle-events">Show Events</button><div id="events-list" style="display:none;"></div>`;
  const events = [
    { title: 'Desert Business Expo', date: '2024-06-15' },
    { title: 'Solar Tech Summit', date: '2024-07-10' },
    { title: 'Annual Chamber Gala', date: '2024-08-05' }
  ];
  const eventsList = events.map(ev => `<div><strong>${ev.title}</strong> - ${ev.date}</div>`).join('');
  document.getElementById('toggle-events').addEventListener('click', function() {
    const el = document.getElementById('events-list');
    if (el.style.display === 'none') {
      el.style.display = 'block';
      el.innerHTML = eventsList;
      this.textContent = 'Hide Events';
    } else {
      el.style.display = 'none';
      this.textContent = 'Show Events';
    }
  });
}

// 3. Weather Forecast (3-day)
async function displayForecast() {
  const forecastPanel = document.querySelector('.panel.forecast');
  forecastPanel.innerHTML = '<h3>Weather Forecast</h3><p>Loading...</p>';
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=16.7666&longitude=-3.0026&daily=temperature_2m_max,temperature_2m_min&forecast_days=3&temperature_unit=fahrenheit&timezone=auto';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Forecast fetch failed');
    const data = await response.json();
    const days = data.daily;
    let html = '';
    for (let i = 0; i < 3; i++) {
      const date = new Date(days.time[i]);
      const day = date.toLocaleDateString(undefined, { weekday: 'long' });
      html += `<div><strong>${day}:</strong> ${days.temperature_2m_max[i]}°F / ${days.temperature_2m_min[i]}°F</div>`;
    }
    forecastPanel.innerHTML = `<h3>Weather Forecast</h3>${html}`;
  } catch (err) {
    forecastPanel.innerHTML = '<h3>Weather Forecast</h3><p>Unable to load forecast.</p>';
  }
}

// 4. Dark Mode Toggle
function setupDarkMode() {
  const btn = document.getElementById('dark-mode-toggle');
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  });
}

// 5. Social Links open in new tab
function setupSocialLinks() {
  document.querySelectorAll('.social-links a').forEach(a => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });
}

// 6. Placeholder images for missing business images
function setupImageFallbacks() {
  directory.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
      e.target.src = 'https://placehold.co/80x80?text=No+Image';
    }
  }, true);
}

// Call all setup functions after DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  setupKeynoteModal();
  setupEventsPanel();
  displayForecast();
  setupDarkMode();
  setupSocialLinks();
  setupImageFallbacks();
}); 