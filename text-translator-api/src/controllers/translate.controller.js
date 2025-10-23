import { translate } from '../utils/translator.js';

export const translateText = async (req, res) => {
  const { text, source, target } = req.body;

  if (!text || !source || !target) {
    return res.status(400).json({ error: 'Text, source language, and target language are required' });
  }

  try {
    const translatedText = await translate(text, source, target);
    res.json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed. Please try again later.' });
  }
};