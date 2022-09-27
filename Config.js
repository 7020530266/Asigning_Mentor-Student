const mongodb =require('mongodb')
const MongoClient =mongodb.MongoClient
const dbName = 'student-mentor'
const dbUrl =`mongodb+srv://Shubham:Shubham1999@shubham.d1qasaw.mongodb.net/${dbName}?retryWrites=true&w=majority`;
module.exports={dbUrl,dbName,mongodb,MongoClient}