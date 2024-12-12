const API_URL = "https://api-football-v1.p.rapidapi.com/v3/fixtures?next=20&timezone=Asia/Saigon";
const HEADERS = {
  "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
  "x-rapidapi-key": "6c4362965bmshc7357b4fd26115cp136a72jsnbea643c8c40d"
};

const loadingSection = document.getElementById('loading-section');
const errorSection = document.getElementById('error-section');
const matchListContainer = document.getElementById('match-list');
const filterBtn = document.getElementById('filter-btn');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');

let allMatches = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchMatches();
});

filterBtn.addEventListener('click', () => {
  applyFilter();
});

async function fetchMatches() {
  showLoading();
  clearError();
  clearMatches();

  try {
    const response = await fetch(API_URL, { headers: HEADERS });
    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }
    const data = await response.json();
    allMatches = data.response || [];
    renderMatches(allMatches);
  } catch (err) {
    showError('Failed to load match data. Please try again later.');
  } finally {
    hideLoading();
  }
}

function renderMatches(matches) {
  clearMatches();

  if (!matches || matches.length === 0) {
    const noMatchesEl = document.createElement('div');
    noMatchesEl.className = 'no-matches';
    noMatchesEl.textContent = "No matches are currently scheduled.";
    matchListContainer.appendChild(noMatchesEl);
    return;
  }

  matches.forEach(matchData => {
    const { fixture, teams } = matchData;
    const dateObj = new Date(fixture.date);
    const dateStr = dateObj.toLocaleDateString();
    const timeStr = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    const matchCard = document.createElement('div');
    matchCard.className = 'match-card';

    // Date & Time Section
    const dateTimeEl = document.createElement('div');
    dateTimeEl.className = 'match-info';
    dateTimeEl.textContent = `${dateStr} ${timeStr}`;

    // Teams Section with logos
    const teamsEl = document.createElement('div');
    teamsEl.className = 'match-info match-teams';

    const homeLogo = document.createElement('img');
    homeLogo.src = teams.home.logo;
    homeLogo.alt = teams.home.name;
    homeLogo.className = 'team-logo';

    const awayLogo = document.createElement('img');
    awayLogo.src = teams.away.logo;
    awayLogo.alt = teams.away.name;
    awayLogo.className = 'team-logo';

    teamsEl.appendChild(homeLogo);
    const homeName = document.createElement('span');
    homeName.textContent = teams.home.name;
    teamsEl.appendChild(homeName);

    const vsSeparator = document.createElement('span');
    vsSeparator.textContent = ' vs ';
    teamsEl.appendChild(vsSeparator);

    const awayName = document.createElement('span');
    awayName.textContent = teams.away.name;
    teamsEl.appendChild(awayName);
    teamsEl.appendChild(awayLogo);

    // Venue Section
    const venueEl = document.createElement('div');
    venueEl.className = 'match-info';
    const venueName = fixture.venue && fixture.venue.name ? fixture.venue.name : "Unknown Venue";
    const venueCity = fixture.venue && fixture.venue.city ? fixture.venue.city : "Unknown City";
    venueEl.textContent = `${venueName}, ${venueCity}`;

    // Append all info to matchCard
    matchCard.appendChild(dateTimeEl);
    matchCard.appendChild(teamsEl);
    matchCard.appendChild(venueEl);

    matchListContainer.appendChild(matchCard);
  });
}

function applyFilter() {
  const start = startDateInput.value ? new Date(startDateInput.value) : null;
  const end = endDateInput.value ? new Date(endDateInput.value) : null;

  let filteredMatches = allMatches;
  if (start) {
    filteredMatches = filteredMatches.filter(m => {
      const matchDate = new Date(m.fixture.date);
      return matchDate >= start;
    });
  }

  if (end) {
    filteredMatches = filteredMatches.filter(m => {
      const matchDate = new Date(m.fixture.date);
      return matchDate <= end;
    });
  }

  renderMatches(filteredMatches);
}

function showLoading() {
  loadingSection.style.display = 'block';
}

function hideLoading() {
  loadingSection.style.display = 'none';
}

function showError(msg) {
  errorSection.textContent = msg;
}

function clearError() {
  errorSection.textContent = '';
}

function clearMatches() {
  matchListContainer.innerHTML = '';
}
