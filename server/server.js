const express = require('express');
const { config, journey, settings } = require('./json.lib');
const app = express();

app.use(express.json());

app.get('/journey', (req, res) => {
  res.send('Hello World!');
});

app.get('/journey/setting/values', (req, res) => {
  settings().then(value => {
    res.json(value);
  });
});

app.get('/journey/:key', (req, res) => {
  const key = req.params.key;

  journey(key)
    .then(value => {
      res.json(value);
    })
    .catch(error => {
      res.status(404).json({ error: error.message });
    });
});

app.get('/journey/:key/settings', (req, res) => {
  const key = req.params.key;

  config(key)
    .then(value => {
      res.json(value);
    })
    .catch(error => {
      res.status(404).json({ error: error.message });
    });
});

// Configurar el servidor para escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor está corriendo en el puerto 3000');
});
