const { getUsers, saveUsers, generateId } = require('../data/store');
const {
  normalizeEmail,
  hashPassword,
  verifyPassword,
  sanitizeUser,
  normalizeRole
} = require('../services/authService');
const { parseBoolean } = require('../utils/parseHelpers');

function listUsers(req, res) {
  const users = getUsers().map(sanitizeUser);
  res.json({ success: true, count: users.length, data: users });
}

function getUserById(req, res) {
  const user = getUsers().find(item => item.id === req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  res.json({ success: true, data: sanitizeUser(user) });
}

function register(req, res) {
  const users = getUsers();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');
  const role = normalizeRole(req.body.role);
  const isMember = parseBoolean(req.body.isMember, false);

  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Email, password and role are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  }

  const { salt, hash } = hashPassword(password);
  const timestamp = new Date().toISOString();
  const newUser = {
    id: generateId('user'),
    email,
    role,
    passwordSalt: salt,
    passwordHash: hash,
    isMember,
    membershipType: isMember ? 'membership' : 'non-membership',
    createdAt: timestamp,
    updatedAt: timestamp
  };

  saveUsers([newUser, ...users]);

  res.status(201).json({
    success: true,
    message: 'Registration successful.',
    data: sanitizeUser(newUser)
  });
}

function login(req, res) {
  const users = getUsers();
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = users.find(item => item.email === email);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const isValid = verifyPassword(password, user.passwordSalt, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  user.updatedAt = new Date().toISOString();
  saveUsers(users);

  res.json({
    success: true,
    message: 'Login successful.',
    data: sanitizeUser(user)
  });
}

module.exports = {
  listUsers,
  getUserById,
  register,
  login
};
