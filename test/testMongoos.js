var mongoose = require('mongoose');
var Account = require('./model/Account.js');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/AwaraDB');

var newAcc = Account({
	username: "prince2502",
	password: "12345678",
	money: 2400,
	isBase: false,
	linkedAcc: []
});

newAcc.save(function(err){
	if (err) throw err;
	console.log("saved new account");

	Account.getByUsername("prince", function(data){
		console.log(data);
	});
});


/*Account.find({}, function(err, data){
	if (err) throw err;
	
	if(!data[0]) return;
	data[0].debit(1000);
	console.log(data[0]);
});*/

