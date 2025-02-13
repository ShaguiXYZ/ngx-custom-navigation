const fs = require('fs');
const path = require('path');

/**
 * Reads a JSON file and parses its content.
 *
 * @param {string} json - The name of the JSON file (without extension) to read.
 * @returns {Promise<any>} A promise that resolves with the parsed JSON data, or rejects with an error if there is an error reading or parsing the JSON file.
 */
function readJson(jsonPath, json) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(jsonPath, `${json}.json`), 'utf8', (err, data) => {
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
  readJson
};
