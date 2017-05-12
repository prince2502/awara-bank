// call the packages we need
var express    	= require('express');        // call express
var app        	= express();                 // define our app using express
var bodyParser 	= require('body-parser');
var mongoose 	= require('mongoose');
var session 	= require('express-session');
var cookieParser = require('cookie-parser');
var multer 		= require('multer');
var upload 		= multer(); 
var cors 		= require('cors');
// db ...............
var Account 	= require('./model/Account.js');


var config 		= require('./config.js');

mongoose.Promise = global.Promise;

// put to config file ... 

mongoose.connect(config.database);

// middlleware .............     figure out more abuot middleware and how it works and why is it needed?
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
//app.use(upload.array());
app.use(cookieParser());
app.use(session({
	secret: config.secret,
    resave: false,
    saveUninitialized: true
}));

app.use(cors());

var port = 8081;        // set our port

// ROUTES FOR OUR API
var router = express.Router();              // get an instance of the express Router

var auth = function(req, res, next){
	if(req.session.account) {
		next();
	} else {
		res.send({
			success: false,
			reason: "You need to be logged in to perform this action"
		});
	}
};

router.get('/', function(req, res) {
	res.json({ message: 'Awara REST', status:'active', version:'0.1'});   
});

router.post('/login', function(req, res) {   // what if aleady logged in ... 
	

	if(req.session.account) {
		res.send({
			success: true,
		});

		return;
	}

	if(!req.body.username || !req.body.password){    // you would want to test the length also .. 
		
		res.send({
			success: false,
			reason: "Invalid Details"
		});

	} else {

		Account.verify(req.body.username, req.body.password, function(resJSON){

			if(resJSON.success){ 
				Account.getByUsername(req.body.username, function(account){
					req.session.account = account;
					res.send(resJSON);   // a little lausy code
				}); 
			} else {
				res.send(resJSON);
			}
			
		});
    }
});

router.post('/logout', function(req, res) {

	req.session.destroy(function(){
		res.send({
			success: true
		});
	});
});

router.post('/sign-up', function(req, res) {

	if(req.session.account) {
		res.send({   
			success: true,
		});

		return;   // do something else actully ... 
	}

	if(!req.body.username || !req.body.password){    // you would want to test the length also .. 
		res.send({
			success: false,
			reason: "Invalid Details"
		});
	} else {
		Account.addNew(req.body.username, req.body.password, res.send.bind(res));
	}
});

router.get('/user', auth, function(req, res) {
	Account.get(req.session.account._id, res.send.bind(res));
});

router.post('/user/new', auth ,function(req, res) {
	
	if(!req.body.username || !req.body.password){    // you would want to test the length also .. 
		res.send({
			success: false,
			reason: "Invalid Details"
		});
	} else {
		Account.addDependent(req.session.account._id, req.body.username, req.body.password, res.send.bind(res));
	}

});

router.post('/money/debit', auth, function(req, res) {

	if(!req.body.amount){
		res.send({
			success: false,
			reason: "Invalid Details"
		});

		return;
	}

	Account.debit(req.session.account._id, parseInt(req.body.amount), res.send.bind(res));
});

/*
	credit money to the account, 'amount' is expected as a post param
	id is the ID of the account to which to add money, if id is not given money 
	will be credeted to the account user is logged in
*/
router.post('/money/credit/:id', auth, function(req, res) {
	
	if(!req.body.amount){
		res.send({
			success: false,
			reason: "Invalid Details"
		});

		return;
	}
	
	Account.creditTo(req.session.account._id, req.params.id, parseInt(req.body.amount), res.send.bind(res));
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);

console.log('listening on the port ' + port);