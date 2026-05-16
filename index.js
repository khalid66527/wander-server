const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors');

dotenv.config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
   
    await client.connect();
    const db = client.db('wanderlust')
    const destinationCollection = db.collection("destinations")

    // data base theke api bananor jonno
    app.get('/destination', async(req, res)=>{
      const result = await destinationCollection.find().toArray()
      res.json( result)
    })
      //  api theke data dekanor jonno?
    app.get('/destination/:id',async(req , res)=>{
      const id = req.params;
      const result = await destinationCollection.findOne({_id: new ObjectId(id)})
      res.json(result)
    })
    // api ta edit korae jonno 
    app.patch('/destination/:id' ,  async(req, res)=>{
      const {id}= req.params;
      const updatedData = req.body;
      const result = await destinationCollection.updateOne(
        {_id: new ObjectId(id)},
        {$set: updatedData}
      )
      res.json(result)
    })

    // api delete kora 
    app.delete("/destination/:id" , async(req, res)=>{
      const id = req.params;
      const result =  await destinationCollection.deleteOne({_id: new ObjectId(id)})
      res.json(result)
    })

      // api add  korar jonno
    app.post('/destination', async(req, res)=>{
      const destinationData = req.body;
    console.log('destination data pawa gese ', destinationData);
      const result = await destinationCollection.insertOne(destinationData) 
      res.json(result)

      // console.log('object,', result);
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   //adfadf
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('This is a Home Page')
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})


