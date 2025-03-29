require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@surer-tori.rjlduxb.mongodb.net/?retryWrites=true&w=majority&appName=Surer-Tori`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("surerDB");
    const feedbackCollection = db.collection("feedback");

    /**************************
     * Feedback Related API
     **************************/
    app.post("/feedback", async (req, res) => {
      const feed = req.body;
      const result = await feedbackCollection.insertOne(feed);
      console.log(result);
      res.send(result);
    });

    app.get("/feedback", async (req, res) => {
      const result = await feedbackCollection.find().toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Surer Tori server is running");
});
app.listen(port, () => {
  console.log(`Surer Tori running on port: ${port}`);
});
