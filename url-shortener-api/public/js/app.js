const shortenForm = document.getElementById("shorten-form");
const originalUrlInput = document.getElementById("original-url");
const resultDiv = document.getElementById("result");
const shortUrlLink = document.getElementById("short-url");

shortenForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const originalUrl = originalUrlInput.value;

  try {
    const response = await fetch("/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ originalUrl }),
    });

    if (!response.ok) {
      throw new Error("Failed to shorten URL");
    }

    const data = await response.json();

    shortUrlLink.href = data.shortUrl;
    shortUrlLink.textContent = data.shortUrl;
    resultDiv.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});
