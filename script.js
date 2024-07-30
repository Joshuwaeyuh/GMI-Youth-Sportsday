const teams = {
    red: [],
    blue: [],
    green: [],
    yellow: []
};

const form = document.getElementById('registration-form');
const nameInput = document.getElementById('name');
const adminLoginButton = document.getElementById('admin-login');

const addParticipantToTeam = (name) => {
    const teamNames = Object.keys(teams);
    const smallestTeam = teamNames.reduce((smallest, team) => {
        return teams[team].length < teams[smallest].length ? team : smallest;
    }, teamNames[0]);
    teams[smallestTeam].push(name);
    updateTeamLists();
};

const updateTeamLists = () => {
    for (const team in teams) {
        const teamList = document.getElementById(`${team}-team`).querySelector('ul');
        teamList.innerHTML = '';
        teams[team].forEach(participant => {
            const listItem = document.createElement('li');
            listItem.textContent = participant;
            teamList.appendChild(listItem);
        });
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    if (name) {
        addParticipantToTeam(name);
        nameInput.value = '';
    } else {
        alert('Please enter a valid name.');
    }
});

