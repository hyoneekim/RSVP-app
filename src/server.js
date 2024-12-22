const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Data API configuration
const MONGO_API_KEY = process.env.MONGO_API_KEY; // Store in .env file
const MONGO_ENDPOINT = 'https://eu-central-1.aws.data.mongodb-api.com/app/data-kvzdxoj/endpoint/data/v1/action';
const MONGO_DB = 'guests';
const MONGO_COLLECTION = 'guests';
const MONGO_DATA_SOURCE = 'Cluster0';

// API Endpoints

// Fetch Guest Data (GET)
app.get('/api/guests', async (req, res) => {
  try {
    const response = await axios.post(`${MONGO_ENDPOINT}/find`, {
      collection: MONGO_COLLECTION,
      database: MONGO_DB,
      dataSource: MONGO_DATA_SOURCE,
      projection: {
        name: 1,
        age: 1,
        allergies: 1,
        aftercheck: 1,
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': MONGO_API_KEY,
      }
    });

    res.json(response.data.documents);
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.status(500).json({ message: 'Failed to fetch data from API' });
  }
});

// Save Guest Data (POST)
app.post('/api/guests', async (req, res) => {
  const guestData = req.body;

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

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
