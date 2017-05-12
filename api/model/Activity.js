var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var actSchema = new Schema({
	accountId: Schema.Types.ObjectId,
	actor: String,
	date: {
		type : Date,
		default: new Date()
	},
	action: Number,			// enum
	actionInfo: Schema.Types.Mixed,
});


actSchema.statics.saveAct = function(accountId, actor, action, actionInfo){
	
	var activity = Activity({
		accountId: accountId,
		actor: actor,
		action: action,
		actionInfo: actionInfo
	});

	return activity.save();
}

var Activity = mongoose.model('Activity', actSchema);
module.exports = Activity;