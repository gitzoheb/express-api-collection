import axios from 'axios';

const API_BASE_URL = process.env.EXCHANGE_API_URL || 'https://api.exchangerate-api.com/v4/latest';

export const getRates = async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/USD`);
    res.json({ success: true, rates: response.data.rates });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch exchange rates' });
  }
};

export const convertCurrency = async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res.status(400).json({ success: false, message: 'from, to, and amount parameters are required' });
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/USD`);
    const rates = response.data.rates;
    const fromRate = rates[from.toUpperCase()];
    const toRate = rates[to.toUpperCase()];

    if (!fromRate || !toRate) {
      return res.status(400).json({ success: false, message: 'Invalid currency code' });
    }

    const rate = toRate / fromRate;
    const converted = numAmount * rate;
    res.json({
      success: true,
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      amount: numAmount,
      converted,
      rate
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Currency conversion failed' });
  }
};