const store = require('../data/store');
const { normalizeEmail, sanitizeUser, normalizeRole } = require('../services/authService');
const { parseBoolean } = require('../utils/parseHelpers');

async function listUsers(req, res) {
  const users = await store.getUsers();
  res.json({ success: true, count: users.length, data: users.map(sanitizeUser) });
}

async function getUserById(req, res) {
  const user = await store.findUserById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, data: sanitizeUser(user) });
}

async function register(req, res) {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');
  const role = normalizeRole(req.body.role);
  const isMember = parseBoolean(req.body.isMember, false);

  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Email, password and role are required.' });
  }

  const existingUser = await store.findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
  }

  const timestamp = new Date().toISOString();
  const created = await store.insertUser({
    id: store.generateId('user'),
    email,
    role,
    passwordSalt: null,
    passwordHash: password,
    isMember,
    membershipType: isMember ? 'membership' : 'non-membership',
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  res.status(201).json({ success: true, message: 'Registration successful.', data: sanitizeUser(created) });
}

async function login(req, res) {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const user = await store.findUserByEmail(email);
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  res.json({ success: true, message: 'Login successful.', data: sanitizeUser(user) });
}

async function updateMembership(req, res) {
  const user = await store.findUserById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  const raw = req.body.isMember;
  if (raw === undefined || raw === null) {
    return res.status(400).json({ success: false, message: 'isMember (true or false) is required.' });
  }

  const isMember = raw === true || raw === 'true';
  const membershipType = isMember ? 'membership' : 'non-membership';

  // Update User row
  const updated = await store.updateUserById(req.params.id, { isMember, membershipType });

  // Sync the ismember columns on Candidate and JobPosting
  await store.syncMembershipByUserId(req.params.id, isMember, membershipType);

  res.json({
    success: true,
    message: `Membership ${isMember ? 'activated — unlimited recommendations unlocked' : 'cancelled — Top 10 limit applies'}.`,
    data: sanitizeUser(updated),
  });
}

module.exports = { listUsers, getUserById, register, login, updateMembership };