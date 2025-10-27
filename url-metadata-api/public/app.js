const API_BASE = '/api/v1';

const urlInput = document.getElementById('url');
const screenshotCheckbox = document.getElementById('screenshot');
const scrapeBtn = document.getElementById('scrapeBtn');
const loadingDiv = document.getElementById('loading');
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const copyBtn = document.getElementById('copyBtn');
const retryBtn = document.getElementById('retryBtn');
const progressFill = document.getElementById('progressFill');
const loadingText = document.getElementById('loadingText');

let currentResult = null;



// Scrape button click handler
scrapeBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();

  if (!url) {
    showError('Please enter a URL');
    return;
  }

  try {
    new URL(url);
  } catch (e) {
    showError('Please enter a valid URL');
    return;
  }

  await scrapeUrl(url);
});

// Retry button
retryBtn.addEventListener('click', () => {
  const url = urlInput.value.trim();
  if (url) {
    scrapeUrl(url);
  }
});

// Set dark mode by default
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('dark');
});

// Enter key handler
urlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    scrapeBtn.click();
  }
});

// Scrape URL
async function scrapeUrl(url) {
  showLoading();
  hideResult();
  hideError();

  try {
    updateProgress(10, 'Validating URL...');
    const includeScreenshot = screenshotCheckbox.checked;

    let endpoint = `${API_BASE}/metadata`;
    if (includeScreenshot) {
      endpoint += '/screenshot';
    }

    updateProgress(30, 'Preparing request...');
    const params = new URLSearchParams({
      url: url
    });

    updateProgress(50, 'Fetching metadata...');
    const response = await fetch(`${endpoint}?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to scrape metadata');
    }

    updateProgress(90, 'Processing results...');
    displayResult(data);
    updateProgress(100, 'Complete!');
    setTimeout(() => hideLoading(), 500);
  } catch (error) {
    console.error('Error:', error);
    showError(error.message);
    hideLoading();
  }
}

// Display results
function displayResult(data) {
  currentResult = data;
  const metadata = data.data;

  // Basic info
  const basicInfo = document.getElementById('basicInfo');
  basicInfo.innerHTML = createMetadataItems([
    { key: 'Title', value: metadata.title || 'N/A' },
    { key: 'Description', value: metadata.description || 'N/A' },
    { key: 'Image', value: metadata.image || 'N/A', isImage: true },
    { key: 'Author', value: metadata.author || 'N/A' },
    { key: 'Type', value: metadata.type || 'N/A' },
    { key: 'Site Name', value: metadata.siteName || 'N/A' }
  ]);

  // Screenshot
  if (metadata.screenshot) {
    const screenshotCard = document.getElementById('screenshotCard');
    const screenshotContainer = document.getElementById('screenshotContainer');
    screenshotCard.style.display = 'block';
    screenshotContainer.innerHTML = `<img src="${metadata.screenshot.image}" alt="Screenshot" style="max-width: 100%; border-radius: 8px;" />`;
  } else {
    document.getElementById('screenshotCard').style.display = 'none';
  }

  // Open Graph tags
  const ogTags = document.getElementById('ogTags');
  if (Object.keys(metadata.ogTags).length > 0) {
    ogTags.innerHTML = createMetadataItems(Object.entries(metadata.ogTags));
  } else {
    ogTags.innerHTML = '<p class="empty-state">No Open Graph tags found</p>';
  }

  // Twitter tags
  const twitterTags = document.getElementById('twitterTags');
  if (Object.keys(metadata.twitterTags).length > 0) {
    twitterTags.innerHTML = createMetadataItems(Object.entries(metadata.twitterTags));
  } else {
    twitterTags.innerHTML = '<p class="empty-state">No Twitter tags found</p>';
  }

  // Other tags
  const otherTags = document.getElementById('otherTags');
  if (Object.keys(metadata.metaTags).length > 0) {
    otherTags.innerHTML = createMetadataItems(Object.entries(metadata.metaTags));
  } else {
    otherTags.innerHTML = '<p class="empty-state">No other meta tags found</p>';
  }

  // Structured data
  const structuredData = document.getElementById('structuredData');
  const structured = metadata.structuredData;
  let structuredHTML = '';

  if (structured.jsonLd.length > 0) {
    structuredHTML += '<h4>JSON-LD</h4>';
    structured.jsonLd.forEach((item, i) => {
      structuredHTML += `<pre>${JSON.stringify(item, null, 2)}</pre>`;
    });
  }

  if (structured.microdata.length > 0) {
    structuredHTML += '<h4>Microdata</h4>';
    structured.microdata.forEach((item, i) => {
      structuredHTML += `<pre>${JSON.stringify(item, null, 2)}</pre>`;
    });
  }

  if (structured.rdfa.length > 0) {
    structuredHTML += '<h4>RDFa</h4>';
    structured.rdfa.forEach((item, i) => {
      structuredHTML += `<pre>${JSON.stringify(item, null, 2)}</pre>`;
    });
  }

  if (structuredHTML) {
    structuredData.innerHTML = structuredHTML;
  } else {
    structuredData.innerHTML = '<p class="empty-state">No structured data found</p>';
  }

  // Raw JSON
  document.getElementById('rawJson').textContent = JSON.stringify(data, null, 2);

  showResult();
}

function showResult() {
  resultDiv.classList.remove('hidden');
}

// Create metadata items HTML
function createMetadataItems(items) {
  if (items.length === 0) {
    return '<p class="empty-state">No data available</p>';
  }

  return items.map(item => {
    const key = item[0] || item.key;
    const value = item[1] || item.value;
    const isImage = item.isImage;

    let valueHTML = value;
    
    if (isImage && value !== 'N/A') {
      valueHTML = `<img src="${value}" alt="Preview" style="max-width: 300px; margin-top: 10px;" />`;
    } else if (value.startsWith('http')) {
      valueHTML = `<a href="${value}" target="_blank">${value}</a>`;
    }

    return `
      <div class="metadata-item">
        <span class="metadata-key">${key}:</span>
        <span class="metadata-value">${valueHTML}</span>
      </div>
    `;
  }).join('');
}

// Copy JSON to clipboard
copyBtn.addEventListener('click', async () => {
  if (!currentResult) return;

  try {
    await navigator.clipboard.writeText(JSON.stringify(currentResult, null, 2));
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = 'Copy JSON';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
});

// Export to PDF
document.getElementById('exportPdfBtn').addEventListener('click', () => {
  if (!currentResult) return;

  if (!window.jspdf) {
    alert('jsPDF library not loaded. Please refresh the page.');
    return;
  }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Helper function to add text with wrapping
    function addText(text, x, y, maxWidth = 170) {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach(line => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, x, y);
        y += 10;
      });
      return y;
    }

    doc.setFontSize(20);
    doc.text('URL Metadata Report', 20, 20);

    doc.setFontSize(12);
    let y = addText(`URL: ${currentResult.url}`, 20, 40);

    y += 10;
    const metadata = currentResult.data;

    y = addText(`Title: ${metadata.title || 'N/A'}`, 20, y);
    y = addText(`Description: ${metadata.description || 'N/A'}`, 20, y);
    y = addText(`Author: ${metadata.author || 'N/A'}`, 20, y);
    y = addText(`Type: ${metadata.type || 'N/A'}`, 20, y);
    y = addText(`Site Name: ${metadata.siteName || 'N/A'}`, 20, y);

    if (metadata.ogTags && Object.keys(metadata.ogTags).length > 0) {
      y += 10;
      y = addText('Open Graph Tags:', 20, y);
      Object.entries(metadata.ogTags).forEach(([key, value]) => {
        y = addText(`${key}: ${value}`, 20, y);
      });
    }

    doc.save('metadata-report.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Check console for details.');
  }
});

// Export to CSV
document.getElementById('exportCsvBtn').addEventListener('click', () => {
  if (!currentResult) return;

  const metadata = currentResult.data;
  const csvData = [
    ['Field', 'Value'],
    ['URL', currentResult.url],
    ['Title', metadata.title || ''],
    ['Description', metadata.description || ''],
    ['Image', metadata.image || ''],
    ['Author', metadata.author || ''],
    ['Type', metadata.type || ''],
    ['Site Name', metadata.siteName || '']
  ];

  // Add Open Graph tags
  if (metadata.ogTags) {
    Object.entries(metadata.ogTags).forEach(([key, value]) => {
      csvData.push([`OG ${key}`, value]);
    });
  }

  // Add Twitter tags
  if (metadata.twitterTags) {
    Object.entries(metadata.twitterTags).forEach(([key, value]) => {
      csvData.push([`Twitter ${key}`, value]);
    });
  }

  // Add meta tags
  if (metadata.metaTags) {
    Object.entries(metadata.metaTags).forEach(([key, value]) => {
      csvData.push([`Meta ${key}`, value]);
    });
  }

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'metadata-report.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
});

// Progress bar
function updateProgress(percent, text) {
  progressFill.style.width = percent + '%';
  loadingText.textContent = text;
}

// Show/hide functions
function showLoading() {
  loadingDiv.classList.remove('hidden');
  progressFill.style.width = '0%';
  loadingText.textContent = 'Fetching metadata...';
}

function hideLoading() {
  loadingDiv.classList.add('hidden');
}



function hideResult() {
  resultDiv.classList.add('hidden');
}

function showError(message) {
  errorDiv.classList.remove('hidden');
  document.getElementById('errorMessage').textContent = message;
}

function hideError() {
  errorDiv.classList.add('hidden');
}

