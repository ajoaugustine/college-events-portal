// Pure validation functions: no DOM access, so they are easy to unit test.

// A name needs at least 2 letters after trimming spaces.
export function isValidName(name) {
  if (typeof name !== "string") return false;
  return name.trim().length >= 2;
}

// Simple, readable email check: something@something.something, no spaces.
export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
