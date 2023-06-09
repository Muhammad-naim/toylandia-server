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
    // await client.connect();
    const toysCollection = client.db('toylandiaDB').collection('toys');
    const photoURLCollection = client.db('toylandiaDB').collection('photoLink')
    const feedbackCollection = client.db('toylandiaDB').collection('feedback')
    const sponsorCollection = client.db('toylandiaDB').collection('sponsors')


    app.get('/all-toys', async (req, res) => {
      const cursor = toysCollection.find()
      const toys = await cursor.toArray()
      res.send(toys)
    })
    app.get('/sponsors', async (req, res) => {
      const cursor = sponsorCollection.find()
      const toys = await cursor.toArray()
      res.send(toys)
    })
    app.get('/get-feedback', async (req, res) => {
      const cursor = feedbackCollection.find()
      const toys = await cursor.toArray()
      res.send(toys)
    })

    app.get('/toys', async (req, res) => {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 20;
      const skip = page * limit;
      const cursor = toysCollection.find().skip(skip).limit(limit)
      const toys = await cursor.toArray()
      res.send(toys)
    })

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.findOne(query)
      res.send(result)
    })

    app.get('/user-toys', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { sellerEmail : req.query.email}
      }
      const result = await toysCollection.find(query).toArray()
      res.send(result)
    })

    app.get('/toysphotos', async (req, res) => {
      const cursor = photoURLCollection.find()
      const toys = await cursor.toArray()
      res.send(toys)
    })

    app.get('/totalToys', async (req, res) => {
      const result = await toysCollection.estimatedDocumentCount();
      res.send({totalToys: result})
    })

    app.get('/sorted-toys', async (req, res) => {
      const value = parseInt(req.query.value);
      const email = req.query.email;
      const query = {sellerEmail: email}
      const sortObj = {'price': value}
      const result = await toysCollection.find(query).sort(sortObj).toArray();
      res.send(result)
    })

    app.post('/search-toy', async (req, res) => {
      const name = req.body.name;
    const query = { name: name}
      const cursor = toysCollection.find(query)
      const result = await cursor.toArray()
      if (result.length > 0) {        
        res.send(result)
      }
      else {
        res.status(200).send([])
      }
    })

    app.post('/new-toy', async (req, res) => {
      const newToy = req.body;
      const result = await toysCollection.insertOne(newToy)
      res.send(result);
    })
    
    app.post('/add-feedback', async (req, res) => {
      const feedbackObj = req.body;
      const result = await feedbackCollection.insertOne(feedbackObj)
      res.send(result);
    })

    app.patch('/update-toy/:id', async (req, res) => {
      const id = req.params.id;
      const updatedToy = req.body;
      const updateDoc = {
        $set: {
          price: updatedToy.price, availableQuantity: updatedToy.availableQuantity, description: updatedToy.description
        },
      };
      const filter = { _id: new ObjectId(id) }
      const result = await toysCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    app.delete('/delete-toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.deleteOne(query)
      res.send(result)
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