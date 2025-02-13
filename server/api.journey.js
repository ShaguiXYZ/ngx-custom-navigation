const path = require('path');
const { readJson } = require('./json.lib');

const JSON_FILE_PATH = path.join(__dirname, 'data', 'journey');

/**
 * Retrieves the settings JSON data.
 *
 * @returns
 */
async function settings() {
  try {
    return await readJson(JSON_FILE_PATH, 'settings');
  } catch (error) {
    throw new Error(`Error in settings function: ${error.message}`);
  }
}

/**
 * Retrieves the value associated with the given key from the 'journeys' JSON data.
 *
 * @param {string} key - The key to look up in the JSON data.
 * @returns {Promise<any>} A promise that resolves with the value associated with the key, or rejects with an error if the key is not found or if there is an error reading the JSON data.
 */
async function config(key) {
  try {
    const jsonData = await readJson(JSON_FILE_PATH, 'journeys');
    const value = jsonData[key];

    if (value !== undefined) {
      return value;
    } else {
      throw new Error('Key not found');
    }
  } catch (error) {
    throw new Error(`Error in config function: ${error.message}`);
  }
}

async function randomJourneyKey() {
  const jsonData = await readJson(JSON_FILE_PATH, 'journeys');
  const keys = Object.keys(jsonData).splice(1); // Skip the first key, which is the 'not-journey' key

  return keys[Math.floor(Math.random() * keys.length)];
}

/**
 * Retrieves the journey data associated with the given key.
 *
 * @param {string} key - The key to look up in the JSON data.
 * @returns {Promise<any>} A promise that resolves with the journey data, or rejects with an error if the key is not found or if there is an error reading the JSON data.
 */
async function journey(key) {
  try {
    const jsonData = await config(key);
    const journeyName = jsonData.name;

    return await readJson(JSON_FILE_PATH, journeyName);
  } catch (error) {
    throw new Error(`Error in journey function: ${error.message}`);
  }
}

function api(app) {
  const QUOTE_JOURNEY_DISABLED = 'not-journey';

  const journeyKey = async key => {
    const settingsValue = await settings();
    return settingsValue.commercialExceptions.enableWorkflow ? key : QUOTE_JOURNEY_DISABLED;
  };

  const handleError = (res, error, status = 500) => {
    res.status(status).json({ error: error.message });
  };

  app.get('/journey/setting/values', async (req, res) => {
    try {
      const config = await settings();
      const { commercialExceptions, ...value } = config;
      const params = req.query;

      value.journey = params.journey ?? (await randomJourneyKey());

      res.json(value);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get('/journey/setting/enable-tracking', async (req, res) => {
    try {
      const config = await settings();
      res.json(config.commercialExceptions.enableTracking);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.get('/journey/:key', async (req, res) => {
    try {
      const key = await journeyKey(req.params.key);
      const journeyValue = await journey(key);
      res.json(journeyValue);
    } catch (error) {
      handleError(res, error, 404);
    }
  });

  app.get('/journey/:key/settings', async (req, res) => {
    try {
      const key = await journeyKey(req.params.key);
      const { name, ...value } = await config(key);
      res.json(value);
    } catch (error) {
      handleError(res, error, 404);
    }
  });
}

module.exports = {
  api
};
