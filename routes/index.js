const express = require('express')
const router = express.Router()

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

router.get('/payment', (req,res,next) => {
	console.log("In Payment");

	var request= require('request');

	var headers = { 'X-Api-Key': 'test_11f6999031ac220a9d8283de47e', 'X-Auth-Token': 'test_704d0f263456e4d325544243963'};
	var payload = {
	  purpose: 'FIFA 16',
	  amount: '2500',
	  phone: '9999999999',
	  buyer_name: 'John Doe',
	  email: 'foo@example.com',
	  redirect_url: 'http://www.example.com/',
	  allow_repeated_payments: false
	};
	console.log(headers);
	console.log(payload);

	request.post('https://test.instamojo.com/api/1.1/payment-requests/', {form: payload,  headers: headers}, function(error, response, body){
	  if(!error && response.statusCode == 201){
	    console.log(body);
	    res.send(body);
	  }
	  else{
	  	console.log(response.statusCode);
	  }
	})
})

module.exports = router