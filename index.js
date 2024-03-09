const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mostakinahamed.fo1obhn.mongodb.net/?retryWrites=true&w=majority&appName=MostakinAhamed`;

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

    const database = client.db("Boro-Bazar").collection("Items");
    const myCartDB = client.db("Boro-Bazar").collection("CartItems");

    // Sell Items - Add Item
    app.post('/addItem', async (req, res) => {
      try {
        const newItem = req.body;
        const result = await database.insertOne(newItem);
        res.send(result);
      } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).send('Internal Server Error');
      }
    });


    // get methods
    app.get('/items', async (req, res) => {
      try {
        const result = await database.find().toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching items(/items ):', error);
        res.status(500).send('Internal Server Error');
      }
    });


    // get method for specific item by id
    app.get('/item/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await database.findOne(query);
        if (!result) {
          return res.status(404).send('Item not found');
        }
        res.send(result);
      } catch (error) {
        console.error('Error fetching item by id:', error);
        res.status(500).send('Internal Server Error');
      }
    });


    // Add to Cart
    app.post('/addToCart', async (req, res) => {
      try {
        const cartItem = req.body;
        const result = await myCartDB.insertOne(cartItem);
        res.send(result);
      } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    // Get My Cart Info
    app.get('/carts', async (req, res) => {
      try {
        const result = await myCartDB.find().toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching items from cart:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    //  delete 
    app.delete('/carts/delete/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await myCartDB.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.log("'error on app.delete('/carts/:id'", error)
      }
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('BoroBazar is running')
})

app.listen(port, () => {
  console.log(`BoroBazar is running on port ${port}`);
})
