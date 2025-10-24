document.getElementById('translateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('text').value;
    const source = document.getElementById('source').value;
    const target = document.getElementById('target').value;
    const resultDiv = document.getElementById('result');

    resultDiv.textContent = 'Translating...';
    resultDiv.style.backgroundColor = '#e8f5e8';

    try {
        const response = await fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, source, target }),
        });

        const data = await response.json();

        if (response.ok) {
            resultDiv.textContent = data.translatedText;
            resultDiv.style.backgroundColor = '#d4edda';
        } else {
            resultDiv.textContent = data.error || 'Translation failed';
            resultDiv.style.backgroundColor = '#f8d7da';
        }
    } catch (error) {
        resultDiv.textContent = 'Error: Could not connect to server';
        resultDiv.style.backgroundColor = '#f8d7da';
    }
});