const express = require('express')
const router = express.Router()
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var cart,apiRequest;

router.get('/', (req,res,next) => {
	res.send('Hello from router')
})

router.get('/json', (req,res,next) => {
	const data = {
		greeting : "How are you"
	}

	res.json(data)
})

router.get('/home', (req,res,next) => {
	res.render('home',null)
})

router.get('/readCart', (req,res,next) => {

	console.log("Read Cart");

	// Connecting cart
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("qtq");
	  dbo.collection("cart").findOne({}, function(err, result) {
	    if (err) throw err;
	    console.log("result",result);
	    cart = result;	    
	    db.close();
		return res.redirect('/payment');
	  })
	})

})

router.get('/payment', (req,res,next) => {

	console.log("cart",cart);

	var request= require('request');

	var headers = { 'X-Api-Key': 'test_11f6999031ac220a9d8283de47e', 'X-Auth-Token': 'test_704d0f263456e4d325544243963'};
	var payload = {
	  purpose: 'Food',
	  amount: cart.Cart_Total,
	  phone: '9999999999',
	  buyer_name: 'John Doe',
	  email: cart.Customer_ID,
	  redirect_url: 'http://www.example.com/',
	  allow_repeated_payments: false
	};
	console.log(headers);
	console.log(payload);

	request.post('https://test.instamojo.com/api/1.1/payment-requests/', {form: payload,  headers: headers}, function(error, response, body){
	  if(!error && response.statusCode == 201){
	    console.log(body);
	    // res.send(body);
	    apiRequest = body;
	    return res.redirect('/updateOrder');
	  }
	  else{
	  	console.log(response.statusCode);
	  }
	})
})


router.get('/updateOrder', (req,res,next) => {
	console.log("In Update Order");

	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("qtq");
	  var myobj = [
	    { 
	    	Customer_ID: cart.Customer_ID,
	      	Restaurent_ID: cart.Restaurent_ID,
	      	Items_List: cart.Items_List,
	      	Items_Total: cart.Items_Total,
	      	Order_Status: "Vendor to approve",
	      	Payment_Status: "Successful",
	      	Transaction_ID: apiRequest.payment_request.id
	    }
	  ];
	  dbo.collection("order").insertMany(myobj, function(err, res) {
	    if (err) throw err;
	    console.log("Number of object inserted: " + res.insertedCount);
	    db.close();
	  });
	

	  // show cart
	  // dbo.collection("order").find({}).toArray(function(err, result) {
	  //   if (err) throw err;
	  //   console.log("Cart:");
	  //   console.log(result);
	  // });
	});
	console.log("DB close");
	res.send(apiRequest);
})

module.exports = router