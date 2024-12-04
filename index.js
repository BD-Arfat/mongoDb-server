const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;

app.use(cors());
app.use(express.json());

// MongoDB URI
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://mongodb-server:yVs9QVwYVe1j7YPC@cluster0.s0vwyit.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Async function to run the MongoDB client
async function run() {
  try {
    await client.connect(); // MongoDB ক্লায়েন্ট সংযোগ স্থাপন
    console.log("Connected to MongoDB");

    const database = client.db("usersDB");
    const userCollection = database.collection("user");

    // reed API :
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // POST API: Insert a new user
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log(newUser);

      try {
        const result = await userCollection.insertOne(newUser);
        res.send(result);
      } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).send({ error: "Failed to insert user" });
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Run the function
run();

// Root API
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
