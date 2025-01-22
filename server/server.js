const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const app = express();

app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://localhost:4200',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader('Origin', '*');
    },
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
    }
  })
);

app.get('/', (req, res) => {
  res.send('Proxy server is running');
});

// call https://carapi.app/api/makes and it will proxy to https://localhost:4200/api/makes
app.get('/makes', (req, res) => {
  axios
    .get('https://carapi.app/api/makes')
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).send('Error fetching data');
    });
});

app.get('/models', (req, res) => {
  const params = req.query;

  axios
    .get('https://carapi.app/api/models', { params })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).send('Error fetching data');
    });
});

app.listen(3000, () => {
  console.log('Proxy server is running on port 3000');
});
