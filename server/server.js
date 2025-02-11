const express = require('express');
const { config, journey, settings } = require('./json.lib');
const app = express();

const QUOTE_JOURNEY_DISALED = 'not-journey';

const journeyKey = async key => {
  const settingsValue = await settings();
  return settingsValue.commercialExceptions.enableWorkflow ? key : QUOTE_JOURNEY_DISALED;
};

app.use(express.json());

app.get('/journey/setting/values', async (req, res) => {
  try {
    const config = await settings();
    const { commercialExceptions, ...value } = config;

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
    const value = await config(key);

    res.json(value);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Configurar el servidor para escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor está corriendo en el puerto 3000');
});
