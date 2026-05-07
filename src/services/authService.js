const crypto = require('crypto');

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeRole(role) {
  const value = String(role || '').trim().toLowerCase();
  return ['candidate', 'employer'].includes(value) ? value : '';
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(String(password), salt, 100000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

function sanitizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role || 'candidate',
    isMember: Boolean(user.isMember),
    membershipType: user.isMember ? 'membership' : 'non-membership',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt || user.createdAt
  };
}

module.exports = {
  normalizeEmail,
  normalizeRole,
  hashPassword,
  verifyPassword,
  sanitizeUser
};
