var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Activity 	= require('./Activity.js');

var accSchema = new Schema({
	username: {
		type: String,
		require: true,
		unique: true
	},
	password: {
		type: String,
		require: true,
	},
	money: {
		type: Number,
		require: true,
	},
	isBase: {
		type: Boolean,
		require: true,
	},
	linkedAcc: [Schema.Types.ObjectId]
});

var ACTION_TYPE = {
	debit : 0,
	credit : 1, 
	newAcc : 2
}


/**
awfull implementation ... 
do it using promises and send only required data, and also try to do it using toJSON options and transformations
*/
accSchema.statics.get = function(accountId, callback){
	
	var that = this;

	this.findOne({_id: accountId}).lean().exec(function(err, account){

		if(account){
			
			delete account.password;
			//delete account.isBase;

			that.find({_id: account.linkedAcc}).lean().exec(function(err2, linkedAccounts){
				account.linked = linkedAccounts;

				Activity.find({accountId:account._id}).lean().exec(function(err3, activities){
					account.activities = activities;

					callback(account);
				});
			});

		} else {
			callback({
				success: false,
				reason: "Internal Error"
			});
		}
	});
};

accSchema.statics.debit = function(accountId, amount, callback){
	
	var that = this;

	this.findOne({_id: accountId}, function(err, data){

		if(!data) {
			callback({
				success: false,
				reason: "Internal Error"
			});
		} else {

			that.find({_id: data.linkedAcc}, function(err2, data2){
				
				data = [data];
				var accounts = data.concat(data2);

				accounts.sort(function(acc1, acc2){
					return acc1.money - acc2.money;
				});

				var debits = [];
				var remainingAmount = amount;

				decider:
				for (var i = 0 ; i < accounts.length ; i = i+1){

					var chunk = remainingAmount / (accounts.length - i);

					if(chunk <= accounts[i].money){ 

						for (var j = i ; j < accounts.length ; j = j+1){
							debits[j] = chunk;
							remainingAmount = 0; 
						}

						break decider;

					} else {
						debits[i] = accounts[i].money;
						remainingAmount = remainingAmount - accounts[i].money;
					}
				}

				if(remainingAmount > 0){   // not enough money in the account
					callback({
						success: false,
						reason: "Not enough money in the account"
					});
				} else {

					promiseArr = [];

					for (var i = 0 ; i < accounts.length ; i= i + 1){
						accounts[i].money = accounts[i].money - debits[i];
						promiseArr.push(accounts[i].save());
						promiseArr.push(Activity.saveAct(accounts[i]._id, data.username, ACTION_TYPE.debit, debits[i]));
					}

					Promise.all(promiseArr).then(function(){
						callback({
							success: true
						});
					});
				}
			});
		}
	});
};


/**
	credit desired amount of money to the either of the accounts. If accountID is 0 add money to the
	account specified by the currentId otherwise test if accountId(account) is likned to currentID(account)
	and add the amount to accountId (account).
*/
accSchema.statics.creditTo = function(currentId, accountId, amount, callback){
	
	var that = this;

	if(accountId !== '0'){   // add to dependent account
		this.findOne({_id: currentId, linkedAcc: accountId}, function(err, data){
			if(!data) callback({
				success: false,
				reason: "This account is not linked to the current account"	// actually there can be many more reasons
			});
			
			else {
				that.creditMoney(accountId, amount, function(resJSON){
					Activity.saveAct(accountId, data.username, ACTION_TYPE.credit, amount).then(function(){
						callback(resJSON);
					});
				});
			}
		});
	} else {
		that.creditMoney(currentId, amount, function(resJSON){
			Activity.saveAct(currentId, "", ACTION_TYPE.credit, amount).then(function(){
				callback(resJSON);
			});
		});
	} 
};

/**
	utility function to add money to an account
*/
accSchema.statics.creditMoney = function(id, amount, callback){
	this.findOne({_id: id}, function(err, data){	

		if (!data) {
			callback({
				success: false,
				reason: "Internal Error"
			});
		} else {

			data.money = data.money + amount;
			data.save().then(function(){
				callback({
					success : true
				});
			});
		}
	});
};

/**
	add new account. 
*/
accSchema.statics.addNew = function(username, password, callback){
	this.makeNewAcc(username, password, true, callback);
};

/**
	add dependent account. The account specified by the currentId must exist already.
*/
accSchema.statics.addDependent = function(currentId, username, password, callback){
	
	var that = this;

	this.findOne({_id: currentId}, function(err, data){
		
		if(!data) {
			callback({
				success: false,
				reason: "Internal Error"
			});
			return;
		}

		if(!data.isBase) {
			callback({
				success: false,
				reason: "This feature is not avialable on your account"
			});
			return;
		}

		that.makeNewAcc(username, password, false, function(res){
			that.findOne({username:username}, function(err2, data2){
				// deal err ... 

				var promiseArr = [];
				data.linkedAcc.push(data2._id);		// link new account to the old account
				
				promiseArr.push(data.save());
				promiseArr.push(Activity.saveAct(data._id, data.username, ACTION_TYPE.newAcc, username));
				
				Promise.all(promiseArr).then(function(){
					callback(res);
				});
			});
		});
	});
};


/**
	utility function to add create new account object
*/
accSchema.statics.makeNewAcc = function(username, password, isBase, callback){
	

	this.findOne({username: username}, function(err, data){

		if(data) {
			callback({
				success: false,
				reason: "Username already in use, please try again"
			});

		} else {

			var defaultMoney = 0;
			if(isBase) defaultMoney = 1000;

			var newAcc = Account({
				username: username,
				password: password,
				money: defaultMoney, 		// default amount of money, put it in a better place
				isBase: isBase,
				linkedAcc: []
			});
		
			newAcc.save().then(function(){
				callback({
					success: true
				}); 
			});
		}
	});
}

/**
	verify if there is an account in the system with given username and password
*/
accSchema.statics.verify = function(username, password, callback){

	this.findOne({username: username, password: password}, function(err, data){
		
		if (data) callback({
			success: true
		});
		else callback({
			success: false,
			reason: "Username and password does not match"
		});
	})

};

/**
	find account by given username, will return null if not found
*/
accSchema.statics.getByUsername = function(username, callback){
	this.findOne({username: username}, function(err, data){
		callback(data);
	});
};


var Account = mongoose.model('Account', accSchema);
module.exports = Account;