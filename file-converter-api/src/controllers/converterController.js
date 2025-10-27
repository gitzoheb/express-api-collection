import fs from 'fs';
import path from 'path';
import pdf2pic from 'pdf2pic';
import mammoth from 'mammoth';

export const convertPdfToImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    const outputPath = path.join('uploads', `${Date.now()}_output.png`);

    const convert = pdf2pic.fromPath(inputPath, {
      density: 100,
      saveFilename: path.basename(outputPath, '.png'),
      savePath: path.dirname(outputPath),
      format: 'png',
      width: 600,
      height: 800
    });

    const result = await convert(1); // Convert first page

    // Clean up input file
    fs.unlinkSync(inputPath);

    res.json({
      success: true,
      message: 'PDF converted to image successfully',
      downloadUrl: `/${result.path}`
    });
  } catch (error) {
    console.error('PDF to Image conversion error:', error);
    res.status(500).json({ success: false, message: 'Conversion failed' });
  }
};

export const convertDocxToPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const inputPath = req.file.path;

    // Convert DOCX to HTML using mammoth
    const result = await mammoth.convertToHtml({ path: inputPath });
    const htmlContent = result.value;

    // For now, return HTML. In a full implementation, convert HTML to PDF using puppeteer
    const outputPath = path.join('uploads', `${Date.now()}_output.html`);
    fs.writeFileSync(outputPath, htmlContent);

    // Clean up input file
    fs.unlinkSync(inputPath);

    res.json({
      success: true,
      message: 'DOCX converted to HTML successfully (PDF conversion requires additional setup)',
      downloadUrl: `/${outputPath}`
    });
  } catch (error) {
    console.error('DOCX to PDF conversion error:', error);
    res.status(500).json({ success: false, message: 'Conversion failed' });
  }
};