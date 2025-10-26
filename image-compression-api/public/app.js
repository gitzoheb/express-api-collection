const API_BASE = '/api/images';

document.addEventListener('DOMContentLoaded', () => {
    const singleForm = document.getElementById('singleForm');
    const batchForm = document.getElementById('batchForm');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');

    singleForm.addEventListener('submit', handleSingleCompress);
    batchForm.addEventListener('submit', handleBatchCompress);

    async function handleSingleCompress(e) {
        e.preventDefault();
        const formData = new FormData(singleForm);
        await compressImage(formData, `${API_BASE}/compress`);
    }

    async function handleBatchCompress(e) {
        e.preventDefault();
        const formData = new FormData(batchForm);
        await compressImage(formData, `${API_BASE}/compress/batch`);
    }

    async function compressImage(formData, endpoint) {
        showLoading();

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                if (endpoint.includes('/batch')) {
                    await handleBatchResponse(response);
                } else {
                    await handleSingleResponse(response, formData.get('uploadToStorage') === 'true');
                }
            } else {
                const errorData = await response.json();
                showError(errorData.message || 'Compression failed');
            }
        } catch (error) {
            showError('Network error: ' + error.message);
        } finally {
            hideLoading();
        }
    }

    async function handleSingleResponse(response, isStorage) {
        if (isStorage) {
            const data = await response.json();
            displayResult(`<p>Image compressed and uploaded!</p><a href="${data.data.downloadUrl}" target="_blank">Download Compressed Image</a>`);
        } else {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            displayResult(`<p>Image compressed successfully!</p><img src="${url}" alt="Compressed image"><br><a href="${url}" download="compressed.${getFormatFromResponse(response)}">Download</a>`);
        }
    }

    async function handleBatchResponse(response) {
        const data = await response.json();
        let html = `<p>Batch compression completed for ${data.data.length} images!</p>`;
        data.data.forEach((item) => {
            html += `<div class="result-item">
                <h3>Image ${item.index}/${item.total}: ${item.originalName}</h3>
                <p>Format: ${item.format.toUpperCase()}</p>
                <a href="${item.downloadUrl}" target="_blank" class="download-btn">Download Compressed Image</a>
            </div>`;
        });
        displayResult(html);
    }

    function getFormatFromResponse(response) {
        const contentType = response.headers.get('content-type');
        if (contentType.includes('jpeg')) return 'jpg';
        if (contentType.includes('png')) return 'png';
        if (contentType.includes('webp')) return 'webp';
        if (contentType.includes('avif')) return 'avif';
        return 'jpg';
    }

    function displayResult(html) {
        resultsDiv.innerHTML = `<div class="result-item">${html}</div>` + resultsDiv.innerHTML;
    }

    function showError(message) {
        resultsDiv.innerHTML = `<div class="error">${message}</div>` + resultsDiv.innerHTML;
    }

    function showLoading() {
        loadingDiv.style.display = 'block';
        document.getElementById('compressBtn').disabled = true;
        document.getElementById('batchCompressBtn').disabled = true;
    }

    function hideLoading() {
        loadingDiv.style.display = 'none';
        document.getElementById('compressBtn').disabled = false;
        document.getElementById('batchCompressBtn').disabled = false;
    }

    // Client-side file validation
    document.getElementById('singleImage').addEventListener('change', validateFile);
    document.getElementById('batchImages').addEventListener('change', validateFiles);

    function validateFile(e) {
        const file = e.target.files[0];
        if (file && file.size > 10 * 1024 * 1024) { // 10MB
            alert('File size must be less than 10MB');
            e.target.value = '';
        }
    }

    function validateFiles(e) {
        const files = e.target.files;
        if (files.length > 10) {
            alert('Maximum 10 files allowed');
            e.target.value = '';
            return;
        }
        for (let file of files) {
            if (file.size > 10 * 1024 * 1024) {
                alert(`File ${file.name} is larger than 10MB`);
                e.target.value = '';
                return;
            }
        }
    }
});