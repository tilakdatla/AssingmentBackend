import express from "express"
import pg from "pg"; 
import env from "dotenv";
import bodyParser from "body-parser";
import cors from "cors"

env.config();
const app = express()
const port = 3000;

const db=new pg.Client
({
  user:process.env.DB_USER,
  host:"localhost",
  database:process.env.DB_NAME,
  password:process.env.DB_PASSWORD,
  port:process.env.DB_PORT,
});
  
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

app.post('/data', async(req, res) => 
{
  try
  {
    var expense=req.body.expense;
    var amount=req.body.amount;
    
    try
    {
      const response=await db.query("INSERT INTO data (expense, amount) VALUES ($1, $2)",[expense,amount]);
      res.status(200).json({success:true});
    }
    catch(err)
    {
      console.log(err);
      res.status(200).json({success:false});
    }
   
  }
  catch(err)
  {
    console.log(err);
    res.status(200).json({success:false});
  }
});

app.get('/getData', async(req, res) => {
  
 try
 {
   const response=await db.query("SELECT * from data");
   if(response.rows.length>0)
   {

    res.status(200).json({success:true,data:response.rows});
   }
   else
   {
    res.status(200).json({success:false});
   }
 }
 catch(err)
 {
  res.status(200).json({success:false});
 }

})

app.post("/deleteItem/:id",async(req, res) => {
   
  var id=req.params.id;
  
  try{
    const response = await db.query("DELETE FROM data WHERE id = $1", [id]);
    res.status(200).json({success:true});
  }
  catch(err)
  {
    res.status(200).json({success:false});
  }
})


app.post("/updateItem/:id",async(req, res) => {
   
  var id=req.params.id;
  
  try{
    const response = await db.query(
      "UPDATE data SET expense = $1, amount = $2 WHERE id = $3",
      [req.body.expense, req.body.amount, id]
    );
    
    res.status(200).json({success:true});
  }
  catch(err)
  {
    res.status(200).json({success:false});
  }
})

app.listen(port, () => {
  console.log(`Localhost is running on port ${port}`)
})