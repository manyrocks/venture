// Placeholder substitution + recursive template copy.
// Placeholders use the form <<TOKEN_NAME>> (double-angle, screaming snake).

// Match the strict form only: <<TOKEN>> with no internal whitespace,
// uppercase letters / digits / underscore.
const PLACEHOLDER_RE = /<<([A-Z][A-Z0-9_]*)>>/g;

export function substitute(text, values) {
  return text.replace(PLACEHOLDER_RE, (match, token) => {
    if (Object.prototype.hasOwnProperty.call(values, token)) {
      // String replace's $-special handling does not affect this branch
      // because we return the raw string from the callback.
      return String(values[token]);
    }
    return match;
  });
}
