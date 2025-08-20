const express = require("express");
const { MongoClient, MongoError } = require("mongodb");
const dotenv = require("dotenv").config();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

MongoClient.connect(process.env.DB_URL)
  .then(client => {
    const db = client.db("interviewtrainer");
    // const usersCollection = db.collection("usersCollection");
    // app.set("usersCollection", usersCollection);
    console.log("DB connection successful!!");
  })
  .catch(err => console.log("Error in connection of database", err.message));

app.use((err, req, res, next) => {
  res.send({ message: "Error", payload: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));