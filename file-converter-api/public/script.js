// PDF to Image conversion
document.getElementById('pdfForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('file', document.getElementById('pdfFile').files[0]);

  const resultDiv = document.getElementById('pdfResult');
  resultDiv.innerHTML = 'Converting...';

  try {
    const response = await fetch('/api/convert/pdf-to-image', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      resultDiv.innerHTML = `<div class="success">${data.message}<br><a href="${data.downloadUrl}" download>Download Image</a></div>`;
    } else {
      resultDiv.innerHTML = `<div class="error">${data.message}</div>`;
    }
  } catch (error) {
    resultDiv.innerHTML = '<div class="error">An error occurred during conversion.</div>';
  }
});

// DOCX to PDF conversion
document.getElementById('docxForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('file', document.getElementById('docxFile').files[0]);

  const resultDiv = document.getElementById('docxResult');
  resultDiv.innerHTML = 'Converting...';

  try {
    const response = await fetch('/api/convert/docx-to-pdf', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      resultDiv.innerHTML = `<div class="success">${data.message}<br><a href="${data.downloadUrl}" download>Download File</a></div>`;
    } else {
      resultDiv.innerHTML = `<div class="error">${data.message}</div>`;
    }
  } catch (error) {
    resultDiv.innerHTML = '<div class="error">An error occurred during conversion.</div>';
  }
});