const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.TOYLANDIA_USER}:${process.env.TOYLANDIA_PASS}@cluster0.ilp6hsx.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const toysCollection = client.db('toylandiaDB').collection('toys');
    const photoURLCollection = client.db('toylandiaDB').collection('photoLink')


    app.get('/toys', async (req, res) => {
      const cursor = toysCollection.find()
      const toys = await cursor.toArray()
      res.send(toys)
    })

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.findOne(query)
      console.log(result);
      res.send(result)
    })

    app.

    app.get('/toysphotos', async (req, res) => {
      const cursor = photoURLCollection.find()
      const toys = await cursor.toArray()
      res.send(toys)
    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('server is running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})