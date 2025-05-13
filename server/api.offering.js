const path = require('path');
const { readJson } = require('./json.lib');

const JSON_FILE_PATH = path.join(__dirname, 'data', 'mock');

async function offering() {
  try {
    return await readJson(JSON_FILE_PATH, 'offering');
  } catch (error) {
    throw new Error(`Error in offering function: ${error.message}`);
  }
}

function api(app) {
  const handleError = (res, error, status = 500) => {
    res.status(status).json({ error: error.message });
  };

  app.post('/offering/get', async (req, res) => {
    try {
      console.log(req.body);

      // @howto Add a 5-second delay
      await new Promise(resolve => setTimeout(resolve, 5000));

      res.json(await offering());
    } catch (error) {
      handleError(res, error, 404);
    }
  });
}

module.exports = { api };
