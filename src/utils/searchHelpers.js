function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s.+#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const SYNONYM_GROUPS = [
  ['software engineer', 'software developer', 'programmer', 'coder', 'developer'],
  ['data analyst', 'data analytics', 'business analyst', 'analytics'],
  ['remote', 'work from home', 'wfh'],
  ['on-site', 'onsite', 'office'],
  ['hybrid', 'mixed'],
  ['javascript', 'js'],
  ['node.js', 'nodejs', 'node'],
  ['machine learning', 'ml'],
  ['cybersecurity', 'cyber security', 'security']
];

function expandQueryTerms(query) {
  const cleaned = normalizeText(query);
  if (!cleaned) return [];

  const terms = new Set([cleaned, ...cleaned.split(' ').filter(Boolean)]);

  SYNONYM_GROUPS.forEach(group => {
    const groupMatches = group.some(term => {
      const normalizedTerm = normalizeText(term);
      return cleaned.includes(normalizedTerm) ||
        normalizedTerm.includes(cleaned) ||
        isCloseMatch(cleaned, normalizedTerm) ||
        cleaned.split(' ').some(queryWord =>
          normalizedTerm.split(' ').some(termWord => isCloseMatch(queryWord, termWord))
        );
    });

    if (groupMatches) {
      group.forEach(term => terms.add(normalizeText(term)));
    }
  });

  return Array.from(terms).filter(Boolean);
}

function levenshteinDistance(a, b) {
  const left = normalizeText(a);
  const right = normalizeText(b);

  if (!left) return right.length;
  if (!right) return left.length;

  const matrix = Array.from({ length: left.length + 1 }, () => []);

  for (let i = 0; i <= left.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= right.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[left.length][right.length];
}

function isCloseMatch(term, word) {
  const cleanTerm = normalizeText(term);
  const cleanWord = normalizeText(word);

  if (!cleanTerm || !cleanWord) return false;
  if (cleanTerm.length < 4 || cleanWord.length < 4) return false;

  const distance = levenshteinDistance(cleanTerm, cleanWord);
  const maxLength = Math.max(cleanTerm.length, cleanWord.length);

  return distance <= 2 || distance / maxLength <= 0.28;
}

function fuzzyIncludes(haystack, query) {
  const cleanHaystack = normalizeText(haystack);
  const cleanQuery = normalizeText(query);

  if (!cleanQuery) return true;
  if (!cleanHaystack) return false;

  const terms = expandQueryTerms(cleanQuery);
  if (terms.some(term => cleanHaystack.includes(term))) return true;

  const haystackWords = cleanHaystack.split(' ').filter(Boolean);
  const queryWords = cleanQuery.split(' ').filter(Boolean);

  return queryWords.every(queryWord =>
    haystackWords.some(word => isCloseMatch(queryWord, word))
  );
}

function objectToSearchText(item, fields) {
  return fields
    .map(field => {
      const value = item[field];
      if (Array.isArray(value)) return value.join(' ');
      return value || '';
    })
    .join(' ');
}

module.exports = {
  normalizeText,
  fuzzyIncludes,
  objectToSearchText
};
