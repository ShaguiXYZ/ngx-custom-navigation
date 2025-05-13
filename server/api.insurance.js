const path = require('path');
const { readJson } = require('./json.lib');

const JSON_FILE_PATH = path.join(__dirname, 'data', 'mock');

async function companies() {
  try {
    return await readJson(JSON_FILE_PATH, 'insurance-companies');
  } catch (error) {
    throw new Error(`Error in companies function: ${error.message}`);
  }
}

function api(app) {
  const handleError = (res, error, status = 500) => {
    res.status(status).json({ error: error.message });
  };

  app.get('/_insurance/companies', async (req, res) => {
    try {
      const data = await companies();

      res.json(data.filter(data => !data.disabled));
    } catch (error) {
      handleError(res, error, 404);
    }
  });
}

module.exports = { api };
