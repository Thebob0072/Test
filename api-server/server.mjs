import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/THB';
const WEATHER_API = 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=62f90aa97354d79064502661951529b2'; // Replace YOUR_API_KEY with your actual API key

app.get('/exchange-rates', async (req, res) => {
  try {
    const response = await fetch(EXCHANGE_RATE_API);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Exchange rates data:', data); // Log data
    const exchangeRates = transformExchangeRates(data);
    res.json(exchangeRates);
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    res.status(500).json({ error: 'Failed to fetch exchange rates', details: error.message });
  }
});

app.get('/weather', async (req, res) => {
  try {
    const response = await fetch(WEATHER_API);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Weather data:', data); // Log data
    res.json(data);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const transformExchangeRates = (data) => {
  if (!data.rates) {
    throw new Error('Invalid exchange rates data');
  }
  const rates = data.rates;
  const exchangeRates = Object.keys(rates).map((key, index) => ({
    id: index,
    country: key,
    value: rates[key]
  }));
  return exchangeRates;
};
