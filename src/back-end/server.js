const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Data API configuration
const MONGO_API_KEY = process.env.MONGO_API_KEY; // Store in .env file
const MONGO_ENDPOINT = 'https://eu-central-1.aws.data.mongodb-api.com/app/data-kvzdxoj/endpoint/data/v1/action';
const MONGO_DB = 'guests';
const MONGO_COLLECTION = 'guests';
const MONGO_DATA_SOURCE = 'Cluster0';

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build'))); // Serve React static files

// API Endpoints
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

// Serve React frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
