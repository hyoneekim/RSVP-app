const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Data API configuration
const MONGO_API_KEY = process.env.REACT_APP_MONGO_API_KEY;
const MONGO_ENDPOINT = 'https://eu-central-1.aws.data.mongodb-api.com/app/data-kvzdxoj/endpoint/data/v1/action';
const MONGO_DB = 'guests';
const MONGO_COLLECTION = 'guests';
const MONGO_DATA_SOURCE = 'Cluster0';

const cors = require('cors');
app.use(cors({
  origin: 'https://guestlist-app.onrender.com',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build'))); // Serve React static files

// API Endpoints
// Save Guest Data (POST)
app.post('/api/guests', async (req, res) => {
  const guestData = req.body;
  console.log('1. Making request to MongoDB Data API');
  console.log('2. Request data:', {
    endpoint: MONGO_ENDPOINT,
    collection: MONGO_COLLECTION,
    database: MONGO_DB,
    dataSource: MONGO_DATA_SOURCE,
    apiKeyExists: !!MONGO_API_KEY,
    data: guestData
  });

  try {
    const response = await axios.post(`${MONGO_ENDPOINT}/insertOne`, {
      collection: MONGO_COLLECTION,
      database: MONGO_DB,
      dataSource: MONGO_DATA_SOURCE,
      document: guestData,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': MONGO_API_KEY,
      }
    });
    console.log('3. MongoDB Response:', response.data);
    res.status(201).json(response.data);
  } catch (error) {
    console.error('4. Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    res.status(500).json(error.response?.data || error.message);
  }
});

// Serve React frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
