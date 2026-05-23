function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeRole(role) {
  const value = String(role || '').trim().toLowerCase();
  return ['candidate', 'employer'].includes(value) ? value : '';
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
    updatedAt: user.updatedAt || user.createdAt,
  };
}

module.exports = { normalizeEmail, normalizeRole, sanitizeUser };
