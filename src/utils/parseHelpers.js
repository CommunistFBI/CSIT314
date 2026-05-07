function parseArrayField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean);

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map(item => String(item).trim()).filter(Boolean);
    }
  } catch (error) {
    // Fall back to comma-separated parsing.
  }

  return String(value)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  const normalized = String(value).trim().toLowerCase();
  return ['true', 'yes', '1', 'member', 'membership'].includes(normalized);
}

module.exports = {
  parseArrayField,
  toNumber,
  parseBoolean
};
