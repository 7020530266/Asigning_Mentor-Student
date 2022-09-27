const {request} = require('express');
var express = require('express');
var router = express.Router();
const {dbUrl,dbName,mongodb,MongoClient} =require("../Config")
const client = new MongoClient(dbUrl);

/* GET all-students. */
router.get('/all-students',  async function(req, res) {
  
  await client.connect();
  try {
    const  db =await client.db(dbName);
    const user = await db.collection("student").find().toArray();
    res.send({
      statusCode : 200,
      data : user
    })
  } catch (error) {
    console.log(error);
    res.send({message:"Error"})
  }
  finally{client.close()}
});
  //get allmentor

  router.get('/all-mentor',  async function(req, res) {
  
    await client.connect();
    try {
      const  db = await client.db(dbName);
      const user = await db.collection("mentor").find().toArray();
      res.send({
        statusCode : 200,
        data : user
      })
    } catch (error) {
      console.log(error);
      res.json({message:"Error"})
    }
    finally{client.close()}
  });

  //add mentor
  router.post('/add-mentor',async(req,res)=>{
    await client.connect();
      try{
        const  db = await client.db(dbName);
        const user =  await db.collection("mentor").insertOne(req.body);//creating mentor in mentor collection
        if(req.body.mentorStudents){//if mentor exist we have to update the mentor db
            req.body.mentorStudents.map(async(e)=>{
                const stud = await db.collection("student").updateOne({"studentName":e},{$set:{"studentMentor":req.body.mentorName}});
     
            })
        }
        res.send({
          statusCode : 200,
          message:"Mentor Added Successfully!",
          data : user,
        })
      }
      catch(err){
        console.log(err);
        res.status(500).json(err);
      }
  })


  //add student
  router.post('/add-student',async(req,res)=>{
    await client.connect();
      try{
        const  db = await client.db(dbName);
        const user =  await db.collection("student").insertOne(req.body);//insert student in student collection
      if(req.body.studentMentor){//if mentor exist we have to update the mentor db
        const men = await db.collection("mentor").findOne({"mentorName":req.body.studentMentor});//adding the student to the mentor
        men.mentorStudents.push(req.body.studentName);//pushing the new student to mentor array
        //console.log(men);
        const update = await db.collection("mentor").updateOne({"mentorName":req.body.studentMentor},{$set:{"mentorStudents":men.mentorStudents}});
      }
      res.send({
        statusCode : 200,
        message:"Student Added Successfully",
        data : user
      })

      }
      catch(err){
        console.log(err);
        res.status(500).json(err);
      }
  })


module.exports = router;
