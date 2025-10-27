console.log('script.js loaded');

// API base URL
const API_BASE = '/api';

// DOM elements
let amountInput, fromSelect, toSelect, resultDiv, loadRatesBtn, ratesContainer, messageDiv;

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
  amountInput = document.getElementById('amount');
  fromSelect = document.getElementById('from');
  toSelect = document.getElementById('to');
  resultDiv = document.getElementById('result');
  loadRatesBtn = document.getElementById('load-rates');
  ratesContainer = document.getElementById('rates-container');
  messageDiv = document.getElementById('message');

  console.log('DOM elements:', { amountInput, fromSelect, toSelect });

  // Event listeners for automatic conversion
  amountInput.addEventListener('input', instantConvert);
  fromSelect.addEventListener('change', () => { console.log('From currency changed'); instantConvert(); });
  toSelect.addEventListener('change', () => { console.log('To currency changed'); instantConvert(); });

  // Swap currencies
  document.querySelector('.swap-icon').addEventListener('click', () => {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    instantConvert();
  });

  loadRatesBtn.addEventListener('click', loadRates);

  // Initial conversion if amount is present
  if (amountInput.value) {
    instantConvert();
  }
});
function instantConvert() {
  console.log('instantConvert triggered');
  const amount = amountInput.value;
  const from = fromSelect.value;
  const to = toSelect.value;

  if (amount && from && to) {
    handleConvert();
  } else {
    resultDiv.innerHTML = '';
  }
}

// Convert currency
async function handleConvert() {
  const amount = amountInput.value;
  const from = fromSelect.value;
  const to = toSelect.value;
  console.log('handleConvert - Amount:', amount, 'From:', from, 'To:', to);

  try {
    const response = await fetch(`${API_BASE}/convert?from=${from}&to=${to}&amount=${amount}`);
    const result = await response.json();

    if (result.success) {
      resultDiv.innerHTML = `
        <p><strong>${result.amount} ${result.from}</strong> = <strong>${result.converted.toFixed(2)} ${result.to}</strong></p>
        <p>Exchange Rate: 1 ${result.from} = ${result.rate.toFixed(4)} ${result.to}</p>
      `;
      // No message for automatic conversion
    } else {
      resultDiv.innerHTML = '';
      showMessage(result.message, 'error');
    }
  } catch (error) {
    resultDiv.innerHTML = '';
    showMessage('Error converting currency', 'error');
    console.error('Error:', error);
  }
}

// Load exchange rates
async function loadRates() {
  try {
    const response = await fetch(`${API_BASE}/rates`);
    const result = await response.json();

    if (result.success) {
      renderRates(result.rates);
      showMessage('Rates loaded successfully', 'success');
    } else {
      showMessage('Failed to load rates', 'error');
    }
  } catch (error) {
    showMessage('Error loading rates', 'error');
    console.error('Error:', error);
  }
}

// Render rates
function renderRates(rates) {
  const currencies = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR'];

  const ratesHtml = currencies.map(currency => {
    const rate = rates[currency];
    if (rate) {
      return `
        <div class="rate-item">
          <div class="currency">${currency}</div>
          <div class="value">${rate.toFixed(4)}</div>
        </div>
      `;
    }
    return '';
  }).join('');

  ratesContainer.innerHTML = `<div class="rates-grid">${ratesHtml}</div>`;
}

// Utility functions
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type}`;

  // Auto-hide after 3 seconds
  setTimeout(() => {
    messageDiv.textContent = '';
    messageDiv.className = 'message';
  }, 3000);
}