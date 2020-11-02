
var mongoose=require('./db');
var fs=require('fs');
var admin=fs.readFileSync(__dirname + '/../../public/administrators.txt','utf8');
var adminArray=admin.split("\n"); 
var bots=fs.readFileSync(__dirname + '/../../public/bots.txt','utf8');
var botsArray=bots.split("\n");
var regular=adminArray.concat(botsArray); 

var revisionSchema = new mongoose.Schema(
	{
		title: {type: String, required: true},
		timestamp: {type: Date, required: true},
		revid: {type: Number, required: true},
		user: {type: String, required: true},
		anon: {type: Boolean, required: false},
		type: {type: String, required: false},
	},
	{
		versionKey: false,
	}
);


//function1:overall analysis 
//overall analysis: top articles with highest and lowest revisions
revisionSchema.statics.revisionNumber=function(order,callback){
    return this.aggregate([
        {$group:{_id:"$title",numOfRevisions:{$sum:1}}},
        {$sort:{numOfRevisions:order}},
        {$limit:2}
    ]).exec(callback)
}


// overall analysis: find the article with largest and smallest registered user number
revisionSchema.statics.revisionGroup=function(orderGroupSize,callback){
    return this.aggregate([
        {$match:{anon:{$exists:false},user:{$nin:regular}}},
        {$group:{_id:{title:"$title",user:"$user"}}},
        {$group:{_id:"$_id.title",numOfUsers:{$sum:1}}},
        {$sort:{numOfUsers:orderGroupSize}}, 
        {$limit:2}
    ]).exec(callback)
}

revisionSchema.statics.revisionHistory = function (orderHistory,callback) {
    return this.aggregate([
    	{$match: {title:{$ne:null}}},
     { $group: { _id: "$title", time: { $min: "$timestamp" } } },
     {$project: {_id: "$_id",time: "$time",dateDifference: {$floor:{$divide: [ { $subtract: [new Date(), { $toDate: "$time" }] }, 1000 * 60 * 60 * 24]}}}},
     { $sort: { time: orderHistory } },
     { $limit: 1 },
    ]).exec(callback)
}

revisionSchema.statics.barChartOverall=function(callback){
    return this.aggregate([
        {$project:{year:{$substr:["$timestamp",0,4]},type:"$type"}},
        {$group:{_id:{type:"$type",year:"$year"},num:{$sum:1}}},
        {$project: {_id: 0, year: "$_id.year",type: "$_id.type",number: "$num"}},
        {$sort:{year:1}}
    ]).exec(callback)
}

revisionSchema.statics.pieChartOverall=function(callback){
    return this.aggregate([
        {$group: {_id: "$type",num:{$sum: 1}}},
        {$project: {_id: 0,type: "$_id",number: "$num"}},
]).exec(callback)
}



//////////////////////////////////////////////////////////////////
//function2: Individual Article Analytics
//title and total revision number
revisionSchema.statics.individualGetTitle = function (callback) {
	return this.aggregate([
		{ $group: { _id: "$title", numOfRevisions: { $sum: 1 } } },
		{ $sort: { numOfRevisions: -1 } },
	]).exec(callback);
};

// get config data for charts, eg. min year , max year
revisionSchema.statics.individualConfiguration = function(callback){
	return this.aggregate([
		{$group : { _id:null,
				maxyear:{'$max':'$timestamp'},
				minyear:{'$min':'$timestamp'}}},
		{$project: {
			maxyear: { $substr: ['$maxyear', 0 , 4]},
			minyear: { $substr: ['$minyear', 0 , 4]}
	}},
	]).exec(callback);
}

//total number of revisions
revisionSchema.statics.individualGetTotalRevisionNumber = function (stringTitle,yearList, callback) {
	return this.aggregate([
		{ $project:{title:'$title',year: { $substr: ["$timestamp", 0, 4] }}},
		{ $match: { title: stringTitle, year:{$in:yearList}} },
		{ $group: { _id: "$title", num: { $sum: 1 } } },
	]).exec(callback);
};

// return last timestamp
revisionSchema.statics.individualGetLastTimestamp = function (stringTitle,callback) {
	return this
		.find({title : stringTitle}) // where ; paras
		.select({'revid': 1,'timestamp': 1,'title':1}) // select ; return
		.sort({timestamp: -1})
		.limit(1)
		.exec(callback);
};


//The top 5 regular users ranked by total revision numbers on this article, and the respective revision numbers
revisionSchema.statics.individualGetTopFiveUsers = function (stringTitle,yearList, callback) {
	return this.aggregate([
		{ $project:{user:'$user',year: { $substr: ["$timestamp", 0, 4] },title:'$title',type:'$type'}},
		{ $match: { type: "registed", title: stringTitle, year:{$in:yearList}} },
		{ $group: { _id: "$user", num: { $sum: 1 } } },
		{ $sort: { num: -1 } },
		{ $limit: 5 },
	]).exec(callback);
};


revisionSchema.statics.individualBarChart3 = function ( title,List,yearList, callback){
	return this.aggregate([
		{$project: {title:'$title',user: '$user',year: { $substr: ["$timestamp", 0, 4] }}},
		{ $match: { title: title,user: { $in: List },year:{$in :yearList} } },
		// {$project: {user: '$user',year: '$year'}},
		{ $group: { _id: {user:'$user',year:'$year'}, num: { $sum: 1 } } },
		// { $project:{_id:'$_id.user','$_id.year':1}},
		{ $sort: { _id: 1 } },
	]).exec(callback);
}


//bar chart of revision number distributed by year and by user type for this article.
revisionSchema.statics.individualBarChart = function (title, yearList,callback) {
	return this.aggregate([
		{ $project: {title:'$title', year: { $substr: ["$timestamp", 0, 4] }, type: "$type",}},
		{ $match: { title: title ,year:{$in :yearList} } },
		// { $project: { year:'$year', type: '$type',}},
		{ $group: { _id: { type: "$type", year: "$year" }, num: { $sum: 1 } } },
		{ $project: {_id: 0, year: "$_id.year", type: "$_id.type", number: "$num",},},
		{ $sort: { year: 1 } },
	]).exec(callback);
};


//A pie chart of revision number distribution based on user type for this article.
revisionSchema.statics.IndividualPieChart = function (title, yearList, callback) {
	return this.aggregate([
		{ $project: {title:'$title', year: { $substr: ["$timestamp", 0, 4] }, type: "$type",}},
		{ $match: { title: title,year:{$in :yearList} } },
		{ $group: { _id: '$type', num: { $sum: 1 } } },
		{ $project: { _id: 0, type: "$_id", number: "$num",}},
	]).exec(callback);
};





//function3
//author analytics
revisionSchema.statics.AuthorGetList=function(callback){
	return this.aggregate([
		{ $match:{ anon:{ $exists:false },user:{$ne:null} } },
		{ $group:{ _id:"$user",num:{ $sum:1 } } },
		{ $sort:{ _id:1 } }
	]).exec(callback)
}

revisionSchema.statics.AuthorGetArticle=function(authorName,callback){
	return this.aggregate([
		{ $match:{ user:authorName } },
		{ $group: { _id: "$title",numOfRevision:{ $sum: 1 } } },
		{ $sort:{ numOfRevision:-1 } }
	]).exec(callback)
}
revisionSchema.statics.AuthorGetArticleAndTitle=function(authorName, title, callback) {
	return this.aggregate([
		{ $match:{ user:authorName, title:title } },
		{ $project:{ _id:0,revid:"$revid",time:"$timestamp" } },
		{ $sort:{ time:-1 } }
	]).exec(callback)
}





//define revision
var Revision = mongoose.model("Revision", revisionSchema, "revisions");


//update admin
Revision.update(
	{ user: { $in: adminArray } },
	{ $set: { type: "admin" } },
	{ upsert: true, multi: true },
	function (err, result) {
		if (err) {
			console.log("update failed");
		} else {
			console.log("update success" + result);
		}
	}
);


//update bots
Revision.update(
	{ user: { $in: botsArray } },
	{ $set: { type: "bots" } },
	{ upsert: true, multi: true },
	function (err, result) {
		if (err) {
			console.log("update failed");
		} else {
			console.log("update success" + result);
		}
	}
);
//update regular users
Revision.update(
	{ anon: { $exists: false }, user: { $nin: regular } },
	{ $set: { type: "registed" } },
	{ upsert: true, multi: true },
	function (err, result) {
		if (err) {
			console.log("update failed");
		} else {
			console.log("update success" + result);
		}
	}
);
//update anon users
Revision.update(
	{ anon: { $exists: true } },
	{ $set: { type: "anon" } },
	{ upsert: true, multi: true },
	function (err, result) {
		if (err) {
			console.log("update failed");
		} else {
			console.log("update success" + result);
		}
	}
);

module.exports = Revision;
