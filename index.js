
const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port=process.env.PORT || 5000;
const app=express()

// middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.User_Name}:${process.env.password}@cluster0.onkli.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
const CoffeesCollection=client.db('CoffeesDB').collection('coffee')

// for user 
const userCollection=client.db('CoffeesDB').collection('users')
// coffeesDB & coffee issamoto deoya jai


//display show all coffees json data (step2) 
app.get('/coffees',async(req,res)=>{

  const {searchParams}=req.query;
  let option={}
  if(searchParams){

    option={name:{$regex:searchParams,$options:'i'}}
  }
    const cursor=CoffeesCollection.find(option);
    const result=await cursor.toArray()
    res.send(result)
})

// display show coffee json by one id (step-3)
app.get('/coffees/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId(id)}
  const result=await CoffeesCollection.findOne(query)
  res.send(result)
})

// create json data in server (step-1)
app.post('/coffees',async(req,res)=>{
  const newCoffees=req.body
  console.log(newCoffees)
  const result=await CoffeesCollection.insertOne(newCoffees)
  res.send(result)
})

// Update coffee by id
app.put('/coffees/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId(id)}
  const options = { upsert: true };
  const updateCoffee=req.body
  const updateDoc={
    $set:{
      name:updateCoffee.name,
      chef:updateCoffee.chef,
       photo:updateCoffee.photo,
       supplier:updateCoffee.supplier,
       taste:updateCoffee.taste,
        category:updateCoffee.category,
        details:updateCoffee.details,
        price:updateCoffee.price,
    }
  }
  const result=await CoffeesCollection.updateOne(query,updateDoc,options);
  res.send(result)
})


//  delete coffee by id (step-4/2)
app.delete('/coffees/:id',async(req,res)=>{
const id=req.params.id
const  query={_id: new ObjectId(id)}
const result=await CoffeesCollection.deleteOne(query)
res.send(result)
})

// user activity
app.post('/users',async(req,res)=>{
 const newUser=req.body
  console.log(newUser)
  const result=await userCollection.insertOne(newUser)
  res.send(result)
})

app.get('/users',async(req,res)=>{


const cursor=userCollection.find();
const result=await cursor.toArray()
res.send(result)

})

app.get('/users/:id',async(req,res)=>{
  const id=req.params.id;
const filter={_id: new ObjectId(id)};
const result=await userCollection.findOne(filter);
res.send(result)
})

app.patch('/users/:email',async(req,res)=>{
  const email=req.params.email
  const query={email}
  const userLastSignInTime={
    $set:{
      lastSignInTime:req.body?.lastSignInTime
    }
  }
  const result=await userCollection.updateOne(query,userLastSignInTime)
  res.send(result)
})



app.delete('/users/:id',async(req,res)=>{
const id=req.params.id;
const query={_id: new ObjectId(id)}
const result=await userCollection.deleteOne(query);
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



app.get('/',(req,res)=>{
 res.send('server is running')
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})