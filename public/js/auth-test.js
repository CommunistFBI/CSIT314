const API = 'http://localhost:5000/api/auth';

async function sendJson(url, method, payload) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// Register
document.getElementById('registerForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const output = document.getElementById('authOutput');
  const formData = new FormData(event.target);
  try {
    const result = await sendJson(`${API}/register`, 'POST', {
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role'),
      isMember: formData.get('isMember') === 'true',
    });
    output.textContent = JSON.stringify(result, null, 2);
    event.target.reset();
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const output = document.getElementById('authOutput');
  const formData = new FormData(event.target);
  try {
    const result = await sendJson(`${API}/login`, 'POST', {
      email: formData.get('email'),
      password: formData.get('password'),
    });
    output.textContent = JSON.stringify(result, null, 2);
    event.target.reset();
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});

// Membership management
document.getElementById('membershipForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const output = document.getElementById('membershipOutput');
  const formData = new FormData(event.target);
  const userId = formData.get('userId');
  try {
    const result = await sendJson(`${API}/users/${userId}`, 'PATCH', {
      isMember: formData.get('isMember') === 'true',
    });
    output.textContent = JSON.stringify(result, null, 2);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});

// Load all users
document.getElementById('loadUsersBtn').addEventListener('click', async () => {
  const output = document.getElementById('authOutput');
  try {
    const res = await fetch(`${API}/users`);
    output.textContent = JSON.stringify(await res.json(), null, 2);
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
});
