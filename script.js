const teams = {
    red: [],
    blue: [],
    green: [],
    yellow: []
};

const form = document.getElementById('registration-form');
const nameInput = document.getElementById('name');
const adminLoginButton = document.getElementById('admin-login');

const API_URL = 'http://localhost:3000';

// Load participants from server
const loadTeamsFromServer = async () => {
    try {
        const response = await fetch(`${API_URL}/participants`);
        const data = await response.json();
        Object.keys(data).forEach(team => {
            teams[team] = data[team];
        });
        updateTeamLists();
    } catch (error) {
        console.error('Error loading teams from server:', error);
    }
};

// Save participants to server
const saveParticipantToServer = async (name) => {
    try {
        const response = await fetch(`${API_URL}/participants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        const data = await response.json();
        Object.keys(data).forEach(team => {
            teams[team] = data[team];
        });
        updateTeamLists();
    } catch (error) {
        console.error('Error saving participant to server:', error);
    }
};

// Add participant to team
const addParticipantToTeam = (name) => {
    saveParticipantToServer(name);
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

adminLoginButton.addEventListener('click', async () => {
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
                        saveParticipantToServer(participantName);
                    } else {
                        alert('Invalid name.');
                    }
                } else if (action === 'remove') {
                    let participantName = prompt('Enter participant name to remove:');
                    if (participantName && teams[teamName].includes(participantName)) {
                        teams[teamName] = teams[teamName].filter(name => name !== participantName);
                        saveParticipantToServer(participantName); // This part needs proper server handling for removing
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
            try {
                const response = await fetch(`${API_URL}/reset`, {
                    method: 'POST'
                });
                const data = await response.json();
                Object.keys(data).forEach(team => {
                    teams[team] = data[team];
                });
                updateTeamLists();
                alert('All teams have been reset.');
            } catch (error) {
                console.error('Error resetting teams:', error);
            }
        } else {
            alert('Invalid action.');
        }
    } else {
        alert('Incorrect password.');
    }
});

// Initialize teams from server on page load
document.addEventListener('DOMContentLoaded', loadTeamsFromServer);
