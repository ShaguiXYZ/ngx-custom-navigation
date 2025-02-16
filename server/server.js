const express = require('express');
const cors = require('cors');
const { api: journey } = require('./api.journey');
const { api: location } = require('./api.location');
const { api: insurance } = require('./api-insurance');

const app = express();

// Configure CORS
app.use(cors());

// Middleware to parse URL-encoded and JSON requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

journey(app);
location(app);
insurance(app);

// Configure the server to listen on port 3000
app.listen(3000, () => {
  console.log('Servidor está corriendo en el puerto 3000');
});
