// Run with: npm test
// Each test checks ONE thing: "given this input, I expect this answer".
import test from "node:test";
import assert from "node:assert";
import { isValidName, isValidEmail } from "./site/validation.js";

// ---- Email ----

test("a normal email is valid", () => {
  assert.equal(isValidEmail("priya@college.edu"), true);
});

test("an empty email is invalid", () => {
  assert.equal(isValidEmail(""), false);
});

test("an email without @ is invalid", () => {
  assert.equal(isValidEmail("priya.college.edu"), false);
});

// ---- Name ----

test("a normal name is valid", () => {
  assert.equal(isValidName("Rahul"), true);
});

test("an empty name is invalid", () => {
  assert.equal(isValidName(""), false);
});
