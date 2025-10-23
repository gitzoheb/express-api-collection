
const form = document.getElementById('uploadForm');
const responseDiv = document.getElementById('response');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      responseDiv.innerHTML = `
        <p>File uploaded successfully!</p>
        <p>File Name: ${result.fileName}</p>
        <p>File Path: ${result.filePath}</p>
        <p>File Size: ${result.fileSize} bytes</p>
      `;
    } else {
      responseDiv.innerHTML = `<p>Error: ${result.message}</p>`;
    }
  } catch (error) {
    responseDiv.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});
