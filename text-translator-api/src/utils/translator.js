import axios from 'axios';

const LINGVA_URL = 'https://lingva.ml/api/v1';

export const translate = async (text, source, target) => {
  try {
    const response = await axios.get(`${LINGVA_URL}/${source}/${target}/${encodeURIComponent(text)}`);
    return response.data.translation;
  } catch (error) {
    throw new Error('Failed to translate text');
  }
};