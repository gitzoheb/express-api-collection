import QRCode from 'qrcode';

export const generateQR = async (req, res) => {
  const { text, size = 256, format = 'png' } = req.query;

  if (!text) {
    return res.status(400).json({ error: 'Text parameter is required' });
  }

  if (text.length > 1000) {
    return res.status(400).json({ error: 'Text is too long (max 1000 characters)' });
  }

  try {
    const options = {
      width: parseInt(size) || 256,
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 1
    };

    if (format === 'svg') {
      const qrSvg = await QRCode.toString(text, { ...options, type: 'svg' });
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(qrSvg);
    } else {
      const qrDataURL = await QRCode.toDataURL(text, options);
      res.json({
        success: true,
        qr: qrDataURL,
        text: text,
        size: options.width
      });
    }
  } catch (error) {
    console.error('QR Code generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

export const downloadQR = async (req, res) => {
  const { text, size = 256 } = req.query;

  if (!text) {
    return res.status(400).json({ error: 'Text parameter is required' });
  }

  try {
    const options = {
      width: parseInt(size) || 256,
      errorCorrectionLevel: 'M',
      type: 'image/png',
      margin: 1
    };

    const qrBuffer = await QRCode.toBuffer(text, options);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="qrcode.png"');
    res.send(qrBuffer);
  } catch (error) {
    console.error('QR Code download error:', error);
    res.status(500).json({ error: 'Failed to generate QR code for download' });
  }
};