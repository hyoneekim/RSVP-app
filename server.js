const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'https://rsvp-app-e7za.onrender.com/',
  credentials: true
}));
app.use(bodyParser.json());

// MongoDB Data API Configuration
const MONGO_ENDPOINT = 'https://eu-central-1.aws.data.mongodb-api.com/app/data-kvzdxoj/endpoint/data/v1';
const MONGO_DB = 'guests';
const MONGO_COLLECTION = 'guests';
const MONGO_DATA_SOURCE = 'Cluster0';

// API Routes
app.get('/api/guests', async (req, res) => {
  try {
    const response = await axios.post(`${MONGO_ENDPOINT}/action/findOne`, {
      collection: MONGO_COLLECTION,
      database: MONGO_DB,
      dataSource: MONGO_DATA_SOURCE,
      filter: {},
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MONGO_API_KEY,
      }
    });
    res.status(200).json(response.data.documents);
  } catch (error) {
    console.error('Error fetching guests:', error);
    res.status(500).json({ message: 'Failed to fetch guests' });
  }
});

app.post('/api/guests', async (req, res) => {
  const guestData = req.body;
  console.log('Received guest data:', guestData);

  try {
    const response = await axios.post(`${MONGO_ENDPOINT}/action/insertOne`, {
      collection: MONGO_COLLECTION,
      database: MONGO_DB,
      dataSource: MONGO_DATA_SOURCE,
      document: guestData,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MONGO_API_KEY,
      }
    });
    res.status(201).json({ message: 'Guest added successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Failed to save data' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});