const path = require('path');
const { readJson } = require('./json.lib');

const JSON_FILE_PATH = path.join(__dirname, 'data', 'mock');

async function provinces() {
  try {
    return await readJson(JSON_FILE_PATH, 'provinces');
  } catch (error) {
    throw new Error(`Error in settings function: ${error.message}`);
  }
}

async function locations() {
  try {
    return await readJson(JSON_FILE_PATH, 'locations');
  } catch (error) {
    throw new Error(`Error in settings function: ${error.message}`);
  }
}

function api(app) {
  const handleError = (res, error, status = 500) => {
    res.status(status).json({ error: error.message });
  };

  const province = async key => {
    const values = await provinces();

    return values[key];
  };

  const location = async (provinceCode, locationCode) => {
    const values = await locations();

    return values.find(data => data.province === provinceCode && data.code === locationCode);
  };

  app.get('/location/province/:key', async (req, res) => {
    try {
      const key = req.params.key;

      res.json(await province(key));
    } catch (error) {
      handleError(res, error, 404);
    }
  });

  app.get('/location/address/:key', async (req, res) => {
    try {
      const postalCode = req.params.key;

      if (!/^\d{5}$/.test(postalCode)) {
        return res.json(undefined);
      }

      const [provinceCode, locationCode] = [postalCode.slice(0, 2), postalCode.slice(2)];
      const p = await province(provinceCode);

      if (!p) {
        return handleError(res, new Error('Province not found'), 404);
      }

      const l = await location(provinceCode, locationCode);

      if (!l) {
        return handleError(res, new Error('Location not found'), 404);
      }

      res.json({ ...l, province: p });
    } catch (error) {
      handleError(res, error, 500);
    }
  });
}

module.exports = {
  api
};
