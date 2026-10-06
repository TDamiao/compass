const form = document.querySelector('.cc-form');
const input = document.querySelector('#invite-email');
const hint = document.querySelector('#invite-email-hint');
const error = document.querySelector('#invite-email-error');
const result = document.querySelector('.cc-form__result');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const invalid = !input.validity.valid;
  input.setAttribute('aria-invalid', String(invalid));
  if (invalid) {
    error.textContent = input.value ? 'Enter a valid email address.' : 'Enter an email address.';
    error.hidden = false;
    input.setAttribute('aria-describedby', `${hint.id} ${error.id}`);
    result.textContent = 'Review the highlighted field.';
    input.focus();
    return;
  }
  error.hidden = true;
  input.setAttribute('aria-describedby', hint.id);
  result.textContent = 'Example only: connect this form to the invitation service before showing success.';
});

input?.addEventListener('input', () => {
  if (input.validity.valid) {
    input.setAttribute('aria-invalid', 'false');
    error.hidden = true;
    input.setAttribute('aria-describedby', hint.id);
  }
});
