// API base URL
const API_BASE = '/api';

// DOM elements
let passwordForm, lengthInput, uppercaseCheck, lowercaseCheck, numbersCheck, symbolsCheck, passwordDisplay;
let validatePasswordInput, validateBtn, strengthResult, messageDiv;

document.addEventListener('DOMContentLoaded', () => {
  passwordForm = document.getElementById('password-form');
  lengthInput = document.getElementById('length');
  uppercaseCheck = document.getElementById('uppercase');
  lowercaseCheck = document.getElementById('lowercase');
  numbersCheck = document.getElementById('numbers');
  symbolsCheck = document.getElementById('symbols');
  passwordDisplay = document.getElementById('password-display');

  validatePasswordInput = document.getElementById('validate-password');
  validateBtn = document.getElementById('validate-btn');
  strengthResult = document.getElementById('strength-result');
  messageDiv = document.getElementById('message');

  passwordForm.addEventListener('submit', handleGenerate);
  validateBtn.addEventListener('click', handleValidate);
});

// Generate password
async function handleGenerate(e) {
  e.preventDefault();

  const options = {
    length: parseInt(lengthInput.value),
    uppercase: uppercaseCheck.checked,
    lowercase: lowercaseCheck.checked,
    numbers: numbersCheck.checked,
    symbols: symbolsCheck.checked
  };

  try {
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    });
    const result = await response.json();

    if (result.success) {
      const passwordDiv = document.createElement('div');
      passwordDiv.className = 'password';
      passwordDiv.textContent = result.password;

      const copyButton = document.createElement('button');
      copyButton.className = 'btn btn-secondary copy-btn';
      copyButton.textContent = 'Copy';
      copyButton.onclick = () => copyToClipboard(result.password);

      passwordDisplay.innerHTML = ''; // Clear previous content
      passwordDisplay.appendChild(passwordDiv);
      passwordDisplay.appendChild(copyButton);
      showMessage('Password generated successfully', 'success');
    } else {
      showMessage(result.message, 'error');
    }
  } catch (error) {
    showMessage('Error generating password', 'error');
    console.error('Error:', error);
  }
}

// Validate password strength
async function handleValidate() {
  const password = validatePasswordInput.value;

  if (!password) {
    showMessage('Please enter a password to validate', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const result = await response.json();

    if (result.success) {
      const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
      const colors = ['#d32f2f', '#f57c00', '#fbc02d', '#388e3c', '#1976d2'];

      strengthResult.innerHTML = `
        <div class="strength-bar">
          <div class="strength-fill" style="width: ${(result.score + 1) * 20}%; background-color: ${colors[result.score]}"></div>
        </div>
        <p class="strength-text" style="color: ${colors[result.score]}">${strengthLevels[result.score]}</p>
        <p>Estimated crack time: ${result.crackTime}</p>
        ${result.feedback.warning ? `<p class="warning">${result.feedback.warning}</p>` : ''}
        ${result.feedback.suggestions.length ? `<ul>${result.feedback.suggestions.map(s => `<li>${s}</li>`).join('')}</ul>` : ''}
      `;
      showMessage('Password validated', 'success');
    } else {
      showMessage(result.message, 'error');
    }
  } catch (error) {
    showMessage('Error validating password', 'error');
    console.error('Error:', error);
  }
}

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showMessage('Password copied to clipboard', 'success');
  }).catch(() => {
    showMessage('Failed to copy password', 'error');
  });
}

// Utility functions
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;
  messageDiv.style.opacity = '1';

  setTimeout(() => {
    messageDiv.style.opacity = '0';
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = 'message';
    }, 400); // Wait for transition
  }, 3000);
}