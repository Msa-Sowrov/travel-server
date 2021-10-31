const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(cors())
app.use(express.json())

//tripIt
// kLtCv9RWnpoNXUAH
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.6bdcv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        const database = client.db('TripIt');
        const tripsCollection =  database.collection('Trips');
        const orderCollection = database.collection('booked')
        //get api
        app.get('/trips', async (req,res)=>{
            const cursor = tripsCollection.find({});
            const trips = await cursor.toArray()
            res.send(trips) 

        })
        //Cancel trip
        app.delete('/bookedTri/:id', async (req, res)=>{
            const id = req.params.id;
            const _id = id;
            const result = await orderCollection.deleteOne({_id:_id})
            res.json(result)
        })
     //add trip
     app.post('/trips' , async (req,res)=>{
        const data = req.body;
        const result = await tripsCollection.insertOne(data)
        res.json(result)
     })
        //get api for bookedtrip
        app.get('/bookedTrip', async (req,res)=>{
            const cursor = orderCollection.find({});
            const bookedTrips = await cursor.toArray()
            res.json(bookedTrips)
        })
        //post api to saved booked trip
        app.post('/booked', async(req, res)=>{
            const data = req.body;
            const result = await orderCollection.insertOne(data)
            res.json(result)
        } )

          //update api
      app.put('/bookedTrip:id', async (req, res)=>{
        const id = req.params.id;
        const updated = req.body;
        const _id = id
        const filter = {_id:_id}
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            name:updated.name,
            img:updated.img,
            email:updated.email,
            return:updated.return,
            desf:updated.desf,
            status:updated.status
          },  
        };

        const result = await orderCollection.updateOne(filter, updateDoc, options);
        console.log(result)
        res.json(result)
    })

        
       
    }
    finally{
            // await client.close()

    }
}
run().catch(console.dir())
app.get('/', (req, res)=>{
    res.send('Running tripIt Server')
})



app.listen(port, ()=>{
    console.log('listening to port:', port)
})