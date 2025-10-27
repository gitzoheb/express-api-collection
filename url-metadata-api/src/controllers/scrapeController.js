import { scrapeMetadata, scrapeWithScreenshot } from '../services/scrapeService.js';

/**
 * Scrape metadata from a URL
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const validateUrl = (url) => {
  if (!url || typeof url !== 'string' || url.length > 2048) return false;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export const getMetadata = async (req, res, next) => {
  try {
    const { url } = req.query;

    if (!validateUrl(url)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL: must be a valid HTTP/HTTPS URL under 2048 characters'
      });
    }

    const validUrl = new URL(url);

    const metadata = await scrapeMetadata(validUrl.href);

    res.json({
      success: true,
      data: metadata,
      url: url
    });

  } catch (error) {
    console.error('Error scraping metadata:', error.message); // Keep for now
    next(error);
  }
};

/**
 * Scrape metadata with screenshot
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export const getMetadataWithScreenshot = async (req, res, next) => {
  try {
    const { url } = req.query;
    const { fullPage = 'false' } = req.query;

    if (!validateUrl(url)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL: must be a valid HTTP/HTTPS URL under 2048 characters'
      });
    }

    const validUrl = new URL(url);
    const fullPageBool = fullPage === 'true';

    const metadata = await scrapeWithScreenshot(validUrl.href, fullPageBool);

    res.json({
      success: true,
      data: metadata,
      url: url
    });

  } catch (error) {
    console.error('Error scraping metadata with screenshot:', error.message); // Keep for now
    next(error);
  }
};

/**
 * Health check endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const healthCheck = (req, res) => {
  res.json({
    success: true,
    message: 'URL Metadata API is running',
    timestamp: new Date().toISOString()
  });
};

