var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("qtq");
  var myobj = [
    { 
    	Customer_ID: "test@gmail.com",
      Restaurent_ID: 12345,
      Items_List: [
        {
          Item_ID: 111,
          Item_Name: "Biryani",
          Price: 200,
          Quantity: 1,
          Total: 200
        }
      ],
      Items_Total: 200,
      Convenience_Fees: 50,
      Cart_Total: 250
    }
  ];
  // dbo.collection("cart").insertMany(myobj, function(err, res) {
  //   if (err) throw err;
  //   console.log("Number of object inserted: " + res.insertedCount);
  // });

  // show cart
  dbo.collection("cart").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log("Cart:");
    console.log(result);
    db.close();
  });
});