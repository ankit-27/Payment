var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("qtq");
  var myobj = { 
  	name: "Ankit",
  	phone: "9999977777",
  	email: "test@gmail.com",
  	payment_status: "paid",
  	amount: "200",
  	item: "Biryani"
  };
  dbo.collection("order").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("qtq");
  dbo.collection("order").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});