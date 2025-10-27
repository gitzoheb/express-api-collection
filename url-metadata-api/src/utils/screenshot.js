import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

/**
 * Take a screenshot of a webpage using Puppeteer
 * @param {string} url - URL to screenshot
 * @param {boolean} fullPage - Whether to take full page screenshot
 * @returns {Object} Screenshot data with base64 image
 */
export const takeScreenshot = async (url, fullPage = false) => {
  let browser;

  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--memory-pressure-off',
        '--js-flags="--max-old-space-size=512"'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport size
    await page.setViewport({
      width: 1280,
      height: 720
    });

    // Navigate to URL with timeout
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: parseInt(process.env.PUPPETEER_TIMEOUT) || 30000
    });

    // Wait a bit for dynamic content
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Take screenshot
    const screenshot = await page.screenshot({
      fullPage: fullPage,
      encoding: 'base64',
      type: 'png'
    });

    await browser.close();

    return {
      image: `data:image/png;base64,${screenshot}`,
      format: 'png',
      timestamp: new Date().toISOString(),
      fullPage: fullPage
    };

  } catch (error) {
    if (browser) {
      await browser.close();
    }
    console.error('Error taking screenshot:', error.message); // Keep for now
    throw new Error(`Failed to take screenshot: ${error.message}`);
  }
};

/**
 * Take a screenshot and save it to file
 * @param {string} url - URL to screenshot
 * @param {string} savePath - Path to save screenshot
 * @param {boolean} fullPage - Whether to take full page screenshot
 * @returns {string} Path to saved screenshot
 */
export const takeScreenshotToFile = async (url, savePath, fullPage = false) => {
  let browser;

  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--memory-pressure-off',
        '--js-flags="--max-old-space-size=512"'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport size
    await page.setViewport({
      width: 1280,
      height: 720
    });

    // Navigate to URL with timeout
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: parseInt(process.env.PUPPETEER_TIMEOUT) || 30000
    });

    // Wait a bit for dynamic content
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Take screenshot and save to file
    await page.screenshot({
      path: savePath,
      fullPage: fullPage,
      type: 'png'
    });

    await browser.close();

    return savePath;

  } catch (error) {
    if (browser) {
      await browser.close();
    }
    console.error('Error taking screenshot to file:', error.message); // Keep for now
    throw new Error(`Failed to take screenshot: ${error.message}`);
  }
};

