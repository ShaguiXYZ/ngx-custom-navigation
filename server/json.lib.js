const fs = require('fs');
const path = require('path');

const JSON_FILE_PATH = path.join(__dirname, 'data', 'journey');

async function settings() {
  try {
    const jsonData = await readJson('settings');
    return jsonData;
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
    const jsonData = await readJson('journeys');
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
    return await readJson(journeyName);
  } catch (error) {
    throw new Error(`Error in journey function: ${error.message}`);
  }
}

/**
 * Reads a JSON file and parses its content.
 *
 * @param {string} json - The name of the JSON file (without extension) to read.
 * @returns {Promise<any>} A promise that resolves with the parsed JSON data, or rejects with an error if there is an error reading or parsing the JSON file.
 */
function readJson(json) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(JSON_FILE_PATH, `${json}.json`), 'utf8', (err, data) => {
      if (err) {
        return reject(new Error('Error reading JSON file'));
      }

      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseError) {
        reject(new Error('Error parsing JSON file'));
      }
    });
  });
}

module.exports = {
  config,
  journey,
  settings
};
