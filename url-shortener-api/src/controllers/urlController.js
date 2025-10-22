import Url from "../models/Url.js";
import generateShortId from "../utils/generateShortId.js";

const shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;
  const base = `http://localhost:${process.env.PORT || 5000}`;

  try {
    let url = await Url.findOne({ originalUrl });

    if (url) {
      return res.status(200).json(url);
    }

    const shortId = generateShortId();
    const shortUrl = `${base}/${shortId}`;

    url = new Url({
      originalUrl,
      shortUrl,
      shortId,
    });

    await url.save();
    res.status(201).json(url);
  } catch (error) {
    console.error(`Error shortening URL: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const redirectToOriginalUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });

    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.originalUrl);
    }

    res.status(404).json({ message: "No URL found" });
  } catch (error) {
    console.error(`Error redirecting to original URL: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

export { shortenUrl, redirectToOriginalUrl };
