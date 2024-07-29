const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express();
const port=process.env.PORT || 5000; 

//middle ware
app.use(cors());
app.use(express.json());


//pEHkUlWEGi1S5dao

const uri="mongodb://localhost:27017";

// const uri = "mongodb+srv://touristSpotDatas:pEHkUlWEGi1S5dao@cluster0.vffugey.mongodb.net/?appName=Cluster0";

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
 
    const touristSpotCollection = client.db('touristDB').collection('tourist');
    const countryUserCollection = client.db('touristDB').collection('user');

    app.get('/tourists', async (req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })
   
  app.get('/tourists/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = { _id: new ObjectId(id) };
    const result = await touristSpotCollection.findOne(query);
    console.log(result);
    res.send(result);
})
  


    app.post('/tourists', async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await touristSpotCollection.insertOne(newSpot);
      res.send(result);
  })

  app.put('/tourists/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: new ObjectId(id)}
    const options = { upsert: true };
    const updatedSpot = req.body;

  

    const spot = {
        $set: {
          spotName: updatedSpot.spotName, 
          countryName: updatedSpot.countryName, 
          location: updatedSpot.location, 
          averageCost: updatedSpot.averageCost, 
          seasonality: updatedSpot.seasonality, 
          travelTime: updatedSpot.travelTime, 
          totalVisitorsPerYear:updatedSpot.totalVisitorsPerYear,
          shortDescription:updatedSpot.shortDescription,
            photo: updatedSpot.photo
        }
    }

    const result = await touristSpotCollection.updateOne(filter,spot, options);
    res.send(result);
    console.log(result)
})


  app.delete('/tourists/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await touristSpotCollection.deleteOne(query);
    res.send(result);
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




app.get('/',(req,res)=>{
    res.send('tourist page server is running');
})


app.listen(port,()=>{
    console.log(`tourist server is running on port : ${port}`);
})
