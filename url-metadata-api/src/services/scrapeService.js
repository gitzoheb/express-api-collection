import axios from 'axios';
import * as cheerio from 'cheerio';
import NodeCache from 'node-cache';
import winston from 'winston';
import { takeScreenshot } from '../utils/screenshot.js';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL) || 600, checkperiod: 120 }); // TTL from env, check every 2 min

/**
 * Extract metadata from HTML content
 * @param {string} html - HTML content
 * @param {string} url - Source URL
 * @returns {Object} Extracted metadata
 */
const extractMetadata = (html, url) => {
  const $ = cheerio.load(html);
  const metadata = {
    url: url,
    title: '',
    description: '',
    image: '',
    author: '',
    type: '',
    siteName: '',
    ogTags: {},
    twitterTags: {},
    metaTags: {},
    structuredData: {
      jsonLd: [],
      microdata: [],
      rdfa: []
    }
  };

  // Extract title
  metadata.title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
  
  // Extract description
  metadata.description = $('meta[name="description"]').attr('content') || 
                        $('meta[property="og:description"]').attr('content') || '';
  
  // Extract image
  metadata.image = $('meta[property="og:image"]').attr('content') || 
                   $('meta[name="twitter:image"]').attr('content') || '';
  
  // Extract author
  metadata.author = $('meta[name="author"]').attr('content') || 
                    $('meta[property="og:article:author"]').attr('content') || '';
  
  // Extract type
  metadata.type = $('meta[property="og:type"]').attr('content') || '';
  
  // Extract site name
  metadata.siteName = $('meta[property="og:site_name"]').attr('content') || '';

  // Extract all Open Graph tags
  $('meta[property^="og:"]').each((i, elem) => {
    const property = $(elem).attr('property');
    const content = $(elem).attr('content');
    if (property && content) {
      metadata.ogTags[property] = content;
    }
  });

  // Extract all Twitter Card tags
  $('meta[name^="twitter:"]').each((i, elem) => {
    const name = $(elem).attr('name');
    const content = $(elem).attr('content');
    if (name && content) {
      metadata.twitterTags[name] = content;
    }
  });

  // Extract other meta tags
  $('meta').each((i, elem) => {
    const name = $(elem).attr('name');
    const property = $(elem).attr('property');
    const content = $(elem).attr('content');
    
    if ((name && !name.startsWith('twitter:')) || property) {
      const key = name || property;
      if (key && content && !key.startsWith('og:')) {
        metadata.metaTags[key] = content;
      }
    }
  });

  // Extract JSON-LD structured data
  $('script[type="application/ld+json"]').each((i, elem) => {
    try {
      const json = JSON.parse($(elem).html().trim());
      metadata.structuredData.jsonLd.push(json);
    } catch (e) {
      // Invalid JSON, skip
    }
  });

  // Extract Schema.org microdata (basic)
  $('[itemscope]').each((i, elem) => {
    const item = {};
    const type = $(elem).attr('itemtype');
    if (type) item['@type'] = type;
    $(elem).find('[itemprop]').each((j, prop) => {
      const propName = $(prop).attr('itemprop');
      const propValue = $(prop).attr('content') || $(prop).text().trim();
      if (propName) item[propName] = propValue;
    });
    if (Object.keys(item).length > 0) {
      metadata.structuredData.microdata.push(item);
    }
  });

  // Extract RDFa structured data (basic)
  $('[typeof]').each((i, elem) => {
    const item = {};
    const type = $(elem).attr('typeof');
    if (type) item['@type'] = type;
    $(elem).find('[property]').each((j, prop) => {
      const propName = $(prop).attr('property');
      const propValue = $(prop).attr('content') || $(prop).text().trim();
      if (propName) item[propName] = propValue;
    });
    if (Object.keys(item).length > 0) {
      metadata.structuredData.rdfa.push(item);
    }
  });

  // Resolve relative URLs to absolute URLs
  if (metadata.image && !metadata.image.startsWith('http')) {
    try {
      metadata.image = new URL(metadata.image, url).href;
    } catch (e) {
      // Invalid URL, keep as is
    }
  }

  return metadata;
};

/**
 * Scrape metadata from a URL using axios and cheerio
 * @param {string} url - URL to scrape
 * @returns {Object} Extracted metadata
 */
export const scrapeMetadata = async (url) => {
  try {
    // Check cache first
    const cached = cache.get(url);
    if (cached) {
      logger.info(`Cache hit for: ${url}`);
      return cached;
    }

    // Fetch the URL with a timeout
    const response = await axios.get(url, {
      timeout: parseInt(process.env.AXIOS_TIMEOUT) || 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Extract metadata from HTML
    const metadata = extractMetadata(response.data, url);

    // Cache the result
    cache.set(url, metadata);
    logger.info(`Cached metadata for: ${url}`);

    return metadata;
  } catch (error) {
    logger.error('Error in scrapeMetadata:', { url, error: error.message });
    throw new Error(`Failed to scrape URL: ${error.message}`);
  }
};

/**
 * Scrape metadata with screenshot using Puppeteer
 * @param {string} url - URL to scrape
 * @param {boolean} fullPage - Whether to take full page screenshot
 * @returns {Object} Extracted metadata with screenshot
 */
export const scrapeWithScreenshot = async (url, fullPage = false) => {
  try {
    // First get the metadata using cheerio for quick extraction
    const metadata = await scrapeMetadata(url);
    
    // Take a screenshot using Puppeteer
    const screenshot = await takeScreenshot(url, fullPage);
    
    return {
      ...metadata,
      screenshot
    };
  } catch (error) {
    logger.error('Error in scrapeWithScreenshot:', { url, error: error.message });
    throw new Error(`Failed to scrape with screenshot: ${error.message}`);
  }
};

