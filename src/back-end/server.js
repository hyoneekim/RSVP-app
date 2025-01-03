const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 3001;

const corsOptions = {
  origin: ['https://guestlist-app.onrender.com', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

// MongoDB Data API configuration
const MONGO_API_KEY = process.env.MONGO_API_KEY; // Store in .env file
const MONGO_ENDPOINT = 'https://eu-central-1.aws.data.mongodb-api.com/app/data-kvzdxoj/endpoint/data/v1/action';
const MONGO_DB = 'guests';
const MONGO_COLLECTION = 'guests';
const MONGO_DATA_SOURCE = 'Cluster0';

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

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});