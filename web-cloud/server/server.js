const express = require('express');
const { MongoClient, MongoError } = require('mongodb');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const connectToDb = async () => {
  try {
    const client = await MongoClient.connect(process.env.DB_URL);
    const db = client.db("interviewtrainer");
    return db;
  } catch (err) {
    console.error("Error in connection of database:", err.message);
    throw err;
  }
};

const paymentRoutes = require('./Models/Payments');

app.use(paymentRoutes);

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server Error", payload: err.message });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
