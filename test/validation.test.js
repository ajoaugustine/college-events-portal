// Run with: npm test   (uses Node's built-in test runner, no extra packages)
import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidName, isValidEmail } from "../site/js/validation.js";

test("accepts a normal email address", () => {
  assert.equal(isValidEmail("priya@college.edu"), true);
});

test("rejects an empty email", () => {
  assert.equal(isValidEmail(""), false);
});

test("rejects emails missing @ or domain", () => {
  assert.equal(isValidEmail("priya.college.edu"), false);
  assert.equal(isValidEmail("priya@"), false);
  assert.equal(isValidEmail("priya@college"), false);
});

test("accepts a real name", () => {
  assert.equal(isValidName("Rahul"), true);
});

test("rejects a blank or one-letter name", () => {
  assert.equal(isValidName("   "), false);
  assert.equal(isValidName("R"), false);
});
