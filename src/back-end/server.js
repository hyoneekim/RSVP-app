const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');  // Ensure 'path' is imported
require('dotenv').config();

const app = express();
const PORT = 3001;

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// MongoDB Data API configuration
const MONGO_API_KEY = process.env.REACT_APP_MONGO_API_KEY; // Store in .env file
const MONGO_ENDPOINT = 'https://eu-central-1.aws.data.mongodb-api.com/app/data-kvzdxoj/endpoint/data/v1';
const MONGO_DB = 'guests';
const MONGO_COLLECTION = 'guests';
const MONGO_DATA_SOURCE = 'Cluster0';

// API Endpoints

// Test GET request to check if API is working
app.get('/api/guests', (req, res) => {
  res.json({ message: 'API is working correctly!' });
});

// Save Guest Data (POST)
app.post('/api/guests', async (req, res) => {
  const guestData = req.body;
  console.log('Received guest data:', guestData);  // Log received data

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

    res.status(201).json({ message: 'Guest added successfully', id: response.data.insertedId });
  } catch (error) {
    console.error('Error saving data to API:', error);
    res.status(500).json({ message: 'Failed to save data to API' });
  }
});

// Serve the React build folder in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  // All other requests will return the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
