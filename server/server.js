const express = require('express');
const cors = require('cors');
const { config, journey, settings, randomJourneyKey } = require('./json.lib');

const QUOTE_JOURNEY_DISALED = 'not-journey';
const app = express();

const journeyKey = async key => {
  const settingsValue = await settings();
  return settingsValue.commercialExceptions.enableWorkflow ? key : QUOTE_JOURNEY_DISALED;
};

// Configure CORS
app.use(cors());

// Middleware to parse URL-encoded and JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/journey/setting/values', async (req, res) => {
  try {
    const config = await settings();
    const { commercialExceptions, ...value } = config;
    const params = req.query;

    value.journey = params.journey ?? (await randomJourneyKey());

    res.json(value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/journey/setting/enable-tracking', async (req, res) => {
  try {
    const config = await settings();

    res.json(config.commercialExceptions.enableTracking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/journey/:key', async (req, res) => {
  try {
    const key = await journeyKey(req.params.key);
    const journeyValue = await journey(key);

    res.json(journeyValue);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/journey/:key/settings', async (req, res) => {
  try {
    const key = await journeyKey(req.params.key);
    const { name, ...value } = await config(key);

    res.json(value);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Configure the server to listen on port 3000
app.listen(3000, () => {
  console.log('Servidor está corriendo en el puerto 3000');
});
