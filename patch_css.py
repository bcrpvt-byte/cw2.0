import re

with open("CoachApp/styles.css", "r") as f:
    content = f.read()

start_marker = "/* [AGENT-3: CHECK-INS - START] */"
end_marker = "/* [AGENT-3: CHECK-INS - END] */"

replacement = """/* [AGENT-3: CHECK-INS - START] */
/* Add Check-In View specific styling here */
#checkins-table {
    width: 100%;
}
.checkin-details {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border);
    padding: 1.5rem;
    border-radius: var(--radius-md);
    margin-bottom: 1.5rem;
}
.checkin-detail-item {
    margin-bottom: 0.75rem;
}
.checkin-detail-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
    display: block;
    margin-bottom: 0.25rem;
}
.checkin-detail-value {
    font-size: 0.95rem;
    color: var(--text-primary);
}
.status-pending {
    color: var(--orange);
}
.status-reviewed {
    color: var(--teal);
}
/* [AGENT-3: CHECK-INS - END] */"""

pattern = re.compile(re.escape(start_marker) + ".*?" + re.escape(end_marker), re.DOTALL)
new_content = pattern.sub(replacement, content)

with open("CoachApp/styles.css", "w") as f:
    f.write(new_content)

print("styles.css patched")
