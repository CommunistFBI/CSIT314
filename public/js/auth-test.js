const API = 'http://localhost:5000/api/auth';

const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const loadUsersBtn = document.getElementById('loadUsersBtn');
const authOutput = document.getElementById('authOutput');

function renderResult(result) {
  authOutput.textContent = JSON.stringify(result, null, 2);
}

async function sendJson(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json();
}

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  const result = await sendJson(`${API}/register`, {
    email: formData.get('email'),
    password: formData.get('password'),
    role: formData.get('role'),
    isMember: formData.get('isMember') === 'true'
  });
  renderResult(result);
  registerForm.reset();
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const result = await sendJson(`${API}/login`, {
    email: formData.get('email'),
    password: formData.get('password')
  });
  renderResult(result);
  loginForm.reset();
});

loadUsersBtn.addEventListener('click', async () => {
  const response = await fetch(`${API}/users`);
  const result = await response.json();
  renderResult(result);
});
