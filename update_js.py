import re

with open('CoachApp/script.js', 'r') as f:
    content = f.read()

# Insert the new code into the DASHBOARD section
agent1_start = r'// \[AGENT-1: DASHBOARD - START\]\n// Dashboard initialization and event listeners\n'
new_dashboard_code = r'''
const dashboardContext = {
    userName: 'Michael',
    openCheckIns: 5
};

const athleteData = [
    { id: 'a-1', name: 'Anna Müller', type: 'Erstgespräch', time: '17:30', tag: 'CALL', tagClass: 'tag-call' },
    { id: 'a-2', name: 'Lukas Schmidt', type: 'Onboarding', time: '18:45', tag: 'ONBOARD', tagClass: 'tag-onboard' },
    { id: 'a-3', name: 'Tom Bauer', type: 'Review Call', time: '19:30', tag: 'CALL', tagClass: 'tag-call' }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Upgrade Welcome Banner securely
    const welcomeTitle = document.getElementById('welcome-title');
    const welcomeSubtitle = document.getElementById('welcome-subtitle');

    if (welcomeTitle) {
        welcomeTitle.textContent = `Guten Morgen, ${dashboardContext.userName}!`;
    }
    if (welcomeSubtitle) {
        welcomeSubtitle.textContent = `Du hast heute ${athleteData.length} anstehende Calls und ${dashboardContext.openCheckIns} offene Check-Ins.`;
    }

    // 2. Implement "Today's To-Dos" list securely (no innerHTML for data)
    const todoListContainer = document.getElementById('todo-list-container');
    const todoCountBadge = document.getElementById('todo-count-badge');
    const openModalBtn = document.getElementById('openModalBtn');

    if (todoCountBadge) {
        todoCountBadge.textContent = athleteData.length.toString();
    }

    if (todoListContainer) {
        todoListContainer.innerHTML = ''; // clear placeholder

        athleteData.forEach(athlete => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'todo-item';

            const infoDiv = document.createElement('div');
            infoDiv.className = 'todo-info';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'todo-name';
            nameSpan.textContent = athlete.name;

            const metaSpan = document.createElement('span');
            metaSpan.className = 'todo-meta';
            metaSpan.textContent = `${athlete.type} • ${athlete.time}`;

            infoDiv.appendChild(nameSpan);
            infoDiv.appendChild(metaSpan);

            const tagSpan = document.createElement('span');
            tagSpan.className = `tag ${athlete.tagClass}`;
            tagSpan.textContent = athlete.tag;

            itemDiv.appendChild(infoDiv);
            itemDiv.appendChild(tagSpan);

            // Connect to modal logic
            itemDiv.addEventListener('click', () => {
                const athleteNameEl = document.getElementById('athleteName');
                if (athleteNameEl) athleteNameEl.textContent = athlete.name;
                currentAthlete = { id: athlete.id, name: athlete.name, email: athlete.name.toLowerCase().split(' ')[0] + '@example.com' };
                if (openModalBtn) openModalBtn.click();
            });

            todoListContainer.appendChild(itemDiv);
        });
    }

    // 3. Connect "Start Next Call" button securely
    if (openModalBtn && athleteData.length > 0) {
        openModalBtn.addEventListener('click', (e) => {
            // If the user clicks the button directly without clicking a specific todo item,
            // we default to the first athlete in the list
            const athleteNameEl = document.getElementById('athleteName');
            // Check if it's currently showing default or empty, or just always set it to the next call if this button is clicked
            if (athleteNameEl && e.isTrusted) { // e.isTrusted is true if user clicked directly, false if triggered programmatically
                 athleteNameEl.textContent = athleteData[0].name;
                 currentAthlete = { id: athleteData[0].id, name: athleteData[0].name, email: athleteData[0].name.toLowerCase().split(' ')[0] + '@example.com' };
            }
        });
    }
});
'''

content = re.sub(agent1_start, agent1_start + new_dashboard_code, content)

with open('CoachApp/script.js', 'w') as f:
    f.write(content)
