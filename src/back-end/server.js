const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ 
  origin: 'https://guestlist-app.onrender.com',
  credentials: true
}));

app.use(bodyParser.json());

// MongoDB Data API Configuration
//const MONGO_API_KEY = process.env.MONGO_API_KEY;
const MONGO_ENDPOINT = 'https://eu-central-1.aws.data.mongodb-api.com/app/data-kvzdxoj/endpoint/data/v1';
const MONGO_DB = 'guests';
const MONGO_COLLECTION = 'guests';
const MONGO_DATA_SOURCE = 'Cluster0';

app.get('/api/guests', async (req, res) => {
  try {
    const response = await axios.post(`${MONGO_ENDPOINT}/action/findOne`, {
      collection: MONGO_COLLECTION,
      database: MONGO_DB,
      dataSource: MONGO_DATA_SOURCE,
      filter: {}, // Fetch all documents; add filters as needed
    }, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': 'rkBY0yA5YTakNILMInSFgAEGsFcGvSaQNLW4AtLSjbAmxgoNuyj12CfuMcpZGuHa',
      }
    });

    res.status(200).json(response.data.documents);
  } catch (error) {
    console.error('Error fetching guests from MongoDB:', error.response ? error.response.data : error);
    res.status(500).json({ message: 'Failed to fetch guests from MongoDB' });
  }
});

// Save Guest Data (POST)
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
        'api-key': 'rkBY0yA5YTakNILMInSFgAEGsFcGvSaQNLW4AtLSjbAmxgoNuyj12CfuMcpZGuHa',
      }
    });

    res.status(201).json({ message: 'Guest added successfully', id: response.data.insertedId });
  } catch (error) {
    console.error('Error saving data to MongoDB:', error.response ? error.response.data : error);
    res.status(500).json({ message: 'Failed to save data to MongoDB' });
  }
});

// Serve React App in Production
if (process.env.NODE_ENV === 'production') {
  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
