console.log('QR Code Generator script loaded');

// API base URL
const API_BASE = '/api';

// DOM elements
let textInput, sizeSelect, formatSelect, generateBtn, qrResult, messageDiv;

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired');
  textInput = document.getElementById('text');
  sizeSelect = document.getElementById('size');
  formatSelect = document.getElementById('format');
  generateBtn = document.getElementById('generate-btn');
  qrResult = document.getElementById('qr-result');
  messageDiv = document.getElementById('message');

  console.log('DOM elements initialized');

  // Event listener for generate button
  generateBtn.addEventListener('click', generateQR);

  // Allow Enter key to generate
  textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      generateQR();
    }
  });
});

async function generateQR() {
  console.log('generateQR triggered');
  const text = textInput.value.trim();
  const size = sizeSelect.value;
  const format = formatSelect.value;

  if (!text) {
    showMessage('Please enter text or URL to encode', 'error');
    return;
  }

  // Clear previous results
  qrResult.innerHTML = '';
  showMessage('Generating QR code...', '');

  try {
    let url, response, data;

    if (format === 'svg') {
      url = `${API_BASE}/generate?text=${encodeURIComponent(text)}&size=${size}&format=svg`;
      response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate QR code');
      }
      const svgText = await response.text();
      qrResult.innerHTML = `<div>${svgText}</div><br><button class="btn btn-secondary" onclick="downloadSVG('${text}', ${size})">Download SVG</button>`;
      showMessage('QR Code generated successfully!', 'success');
    } else {
      url = `${API_BASE}/generate?text=${encodeURIComponent(text)}&size=${size}&format=png`;
      response = await fetch(url);
      data = await response.json();

      if (data.success) {
        qrResult.innerHTML = `<img src="${data.qr}" alt="QR Code"><br><a href="${API_BASE}/download?text=${encodeURIComponent(text)}&size=${size}" class="btn btn-secondary" download>Download PNG</a>`;
        showMessage('QR Code generated successfully!', 'success');
      } else {
        throw new Error(data.error);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage(error.message || 'Error generating QR code', 'error');
  }
}

function downloadSVG(text, size) {
  const url = `${API_BASE}/generate?text=${encodeURIComponent(text)}&size=${size}&format=svg`;
  fetch(url)
    .then(response => response.text())
    .then(svg => {
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'qrcode.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    })
    .catch(err => showMessage('Error downloading SVG', 'error'));
}

function showMessage(msg, type) {
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = msg;
  if (type) {
    setTimeout(() => {
      messageDiv.textContent = '';
      messageDiv.className = 'message';
    }, 5000);
  }
}