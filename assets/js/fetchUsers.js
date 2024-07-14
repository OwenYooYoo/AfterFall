async function fetchUsers() {
    try {
        const response = await fetch('/admin/users');
        const users = await response.json();
        const tableBody = document.getElementById('user-table-body');
        tableBody.innerHTML = ''; // Clear any existing rows

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td contenteditable="true" data-field="email">${user.email}</td>
                <td contenteditable="true" data-field="password">${user.password}</td>
                <td contenteditable="true" data-field="role">${user.role}</td>
                <td><button onclick="updateUser('${user._id.$oid}', this)">Save</button></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        // Handle error as needed
    }
}

async function updateUser(id, button) {
    const row = button.parentNode.parentNode;
    const email = row.querySelector('[data-field="email"]').textContent;
    const password = row.querySelector('[data-field="password"]').textContent;
    const role = row.querySelector('[data-field="role"]').textContent;

    try {
        const response = await fetch('/admin/users/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, role })
        });

        if (response.ok) {
            alert('User updated successfully');
        } else {
            alert('Error updating user');
        }
    } catch (err) {
        console.error('Error updating user:', err);
        // Handle error as needed
    }
}

export { fetchUsers, updateUser };
