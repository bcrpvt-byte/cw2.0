import re

with open("CoachApp/script.js", "r") as f:
    content = f.read()

start_marker = "// [AGENT-3: CHECK-INS - START]"
end_marker = "// [AGENT-3: CHECK-INS - END]"

replacement = """// [AGENT-3: CHECK-INS - START]
// Check-In rendering and review submission logic

const mockCheckins = [
    { id: 'CI-001', date: '2023-10-25', athleteName: 'Max Mustermann', status: 'Pending', answers: { weight: '80kg', energy: 'Good', notes: 'Felt great during workouts.' } },
    { id: 'CI-002', date: '2023-10-24', athleteName: 'Anna Schmidt', status: 'Reviewed', answers: { weight: '65kg', energy: 'Low', notes: 'Slept badly this week.' } }
];

function renderCheckins() {
    const tbody = document.getElementById('checkins-list-body');
    if (!tbody) return;

    tbody.innerHTML = ''; // Clear existing

    mockCheckins.forEach(checkin => {
        const tr = document.createElement('tr');

        const tdDate = document.createElement('td');
        tdDate.textContent = checkin.date;
        tr.appendChild(tdDate);

        const tdAthlete = document.createElement('td');
        tdAthlete.textContent = checkin.athleteName;
        tr.appendChild(tdAthlete);

        const tdStatus = document.createElement('td');
        const statusSpan = document.createElement('span');
        statusSpan.textContent = checkin.status;
        statusSpan.className = checkin.status === 'Pending' ? 'status-pending' : 'status-reviewed';
        tdStatus.appendChild(statusSpan);
        tr.appendChild(tdStatus);

        const tdActions = document.createElement('td');
        const reviewBtn = document.createElement('button');
        reviewBtn.className = 'btn btn-secondary sm';
        reviewBtn.textContent = 'Review';
        reviewBtn.addEventListener('click', () => openCheckinReview(checkin));
        tdActions.appendChild(reviewBtn);
        tr.appendChild(tdActions);

        tbody.appendChild(tr);
    });
}

function openCheckinReview(checkin) {
    const modal = document.getElementById('checkinReviewModal');
    const detailsContent = document.getElementById('checkinDetailsContent');
    const idInput = document.getElementById('reviewCheckinId');
    const feedbackInput = document.getElementById('reviewFeedback');

    if (!modal || !detailsContent) return;

    detailsContent.innerHTML = ''; // Clear existing details

    // Create details using DOM APIs
    const createDetail = (label, value) => {
        const div = document.createElement('div');
        div.className = 'checkin-detail-item';

        const labelEl = document.createElement('span');
        labelEl.className = 'checkin-detail-label';
        labelEl.textContent = label;
        div.appendChild(labelEl);

        const valueEl = document.createElement('span');
        valueEl.className = 'checkin-detail-value';
        valueEl.textContent = value;
        div.appendChild(valueEl);

        return div;
    };

    detailsContent.appendChild(createDetail('Athlete', checkin.athleteName));
    detailsContent.appendChild(createDetail('Date', checkin.date));

    if (checkin.answers) {
        Object.entries(checkin.answers).forEach(([key, value]) => {
            detailsContent.appendChild(createDetail(key.charAt(0).toUpperCase() + key.slice(1), value));
        });
    }

    idInput.value = checkin.id;
    feedbackInput.value = ''; // Reset feedback

    modal.classList.remove('hidden');
}

// Add event listener to view switch to load checkins
document.addEventListener('DOMContentLoaded', () => {
    // Setup modal close
    const closeBtn = document.getElementById('closeCheckinModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('checkinReviewModal').classList.add('hidden');
        });
    }

    // Setup modal overlay click
    const modal = document.getElementById('checkinReviewModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    // Setup submit button
    const markReviewedBtn = document.getElementById('markReviewedBtn');
    if (markReviewedBtn) {
        markReviewedBtn.addEventListener('click', () => {
            const id = document.getElementById('reviewCheckinId').value;
            const feedback = document.getElementById('reviewFeedback').value;

            // Find and update checkin
            const checkin = mockCheckins.find(c => c.id === id);
            if (checkin) {
                checkin.status = 'Reviewed';
                // In a real app, send feedback to backend here
            }

            // Close modal and re-render
            document.getElementById('checkinReviewModal').classList.add('hidden');
            renderCheckins();
            alert('Check-In marked as reviewed!');
        });
    }

    // Override nav button logic specifically for checkins to ensure rendering
    const checkinsNavBtn = document.querySelector('.nav-item[data-view="checkins"]');
    if (checkinsNavBtn) {
        checkinsNavBtn.addEventListener('click', () => {
            renderCheckins();
        });
    }
});
// [AGENT-3: CHECK-INS - END]"""

pattern = re.compile(re.escape(start_marker) + ".*?" + re.escape(end_marker), re.DOTALL)
new_content = pattern.sub(replacement, content)

with open("CoachApp/script.js", "w") as f:
    f.write(new_content)

print("script.js patched")
