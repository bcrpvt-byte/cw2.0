import re

with open('CoachApp/index.html', 'r') as f:
    content = f.read()

# Add IDs to welcome banner
content = re.sub(
    r'<h1>Guten Morgen, Michael!</h1>',
    r'<h1 id="welcome-title">Guten Morgen, Michael!</h1>',
    content
)
content = re.sub(
    r'<p>Du hast heute 3 anstehende Calls und 5 offene Check-Ins.</p>',
    r'<p id="welcome-subtitle">Du hast heute 3 anstehende Calls und 5 offene Check-Ins.</p>',
    content
)

# Replace To-Do section
search_pattern = r'<div class="card-header-simple">\s*<h3>Heutige To-Dos</h3>\s*<span class="count-badge">2</span>\s*</div>\s*<div class="list-container">\s*<div class="todo-item" onclick="document.getElementById\(\'openModalBtn\'\).click\(\)">\s*<div class="todo-info">\s*<span class="todo-name">Anna Müller</span>\s*<span class="todo-meta">Erstgespräch • 17:30</span>\s*</div>\s*<span class="tag tag-call">CALL</span>\s*</div>\s*<div class="todo-item">\s*<div class="todo-info">\s*<span class="todo-name">Lukas Schmidt</span>\s*<span class="todo-meta">Onboarding • 18:45</span>\s*</div>\s*<span class="tag tag-onboard">ONBOARD</span>\s*</div>\s*</div>'

replacement = r'''<div class="card-header-simple">
                                <h3>Heutige To-Dos</h3>
                                <span id="todo-count-badge" class="count-badge">0</span>
                            </div>
                            <div id="todo-list-container" class="list-container">
                                <!-- Dynamically populated by JS -->
                            </div>'''

content = re.sub(search_pattern, replacement, content)

with open('CoachApp/index.html', 'w') as f:
    f.write(content)
