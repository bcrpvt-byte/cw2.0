import sys

with open('CoachApp/script.js', 'r') as f:
    content = f.read()

# Replace innerHTML = '' with a safer approach for clearing the list
new_content = content.replace("todoListContainer.innerHTML = ''; // clear placeholder", "while (todoListContainer.firstChild) { todoListContainer.removeChild(todoListContainer.firstChild); } // clear placeholder")

with open('CoachApp/script.js', 'w') as f:
    f.write(new_content)

print("Fixed innerHTML violation.")
