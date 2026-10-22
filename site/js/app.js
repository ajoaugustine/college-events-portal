// Wires the form to the validation functions. Nothing is submitted or stored.
import { isValidName, isValidEmail } from "./validation.js";

const form = document.getElementById("register-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const confirmation = document.getElementById("confirmation");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameOk = isValidName(nameInput.value);
  const emailOk = isValidEmail(emailInput.value);

  nameError.textContent = nameOk ? "" : "Please enter your name (at least 2 letters).";
  emailError.textContent = emailOk ? "" : "Please enter a valid email, like you@college.edu.";

  if (nameOk && emailOk) {
    confirmation.textContent = `Thanks, ${nameInput.value.trim()}! We'll keep you posted. 🎉`;
    confirmation.hidden = false;
    form.reset();
  } else {
    confirmation.hidden = true;
  }
});
