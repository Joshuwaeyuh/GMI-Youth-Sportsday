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

adminLoginButton.addEventListener('click', () => {
    const password = prompt('Enter admin password:');
    if (password === 'Iyevbol24') {
        alert('Admin access granted.');
        let adminAction = prompt('To edit a team, enter "edit". To reset teams, enter "reset".');
        if (adminAction === 'edit') {
            let teamName = prompt('Enter team name (red, blue, green, yellow):');
            if (teams[teamName]) {
                let action = prompt(`Editing ${teamName} team. To add a participant, enter "add". To remove, enter "remove".`);
                if (action === 'add') {
                    let participantName = prompt('Enter participant name:');
                    if (participantName) {
                        teams[teamName].push(participantName);
                    } else {
                        alert('Invalid name.');
                    }
                } else if (action === 'remove') {
                    let participantName = prompt('Enter participant name to remove:');
                    if (participantName && teams[teamName].includes(participantName)) {
                        teams[teamName] = teams[teamName].filter(name => name !== participantName);
                    } else {
                        alert('Participant not found.');
                    }
                } else {
                    alert('Invalid action.');
                }
                updateTeamLists();
            } else {
                alert('Invalid team name.');
            }
        } else if (adminAction === 'reset') {
            for (let team in teams) {
                teams[team] = [];
            }
            updateTeamLists();
            alert('All teams have been reset.');
        } else {
            alert('Invalid action.');
        }
    } else {
        alert('Incorrect password.');
    }
});
