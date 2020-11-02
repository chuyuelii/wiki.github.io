
// get express module

var Revision = require("../models/revisions");
var request = require('request');


// via using module exports, route can call this function
module.exports.showForm = function(req,res){
      // console.log(req.session);
    if(!req.session.username){
        res.redirect('/');
    }else{
        res.locals.username = req.session.username;
        res.render('mainPage.ejs');
    }

};

module.exports.showRevisionNumber = function(req,res){
        var outputData = {};
        var order = parseInt(req.query.selection);
    
        console.log("controller order: " + order);

        Revision.revisionNumber(order,function(err, result){
            if (err){
                console.log(err);
                console.log("showRevisionNumber Aggregation Error");
                outputData = result;
                res.json({topRevision: outputData});
            }else{
                outputData = result;
                res.json({topRevision: outputData});
            }
        });
};



module.exports.showGroupSize = function(req,res){
    // if (req.cookies.login){
    var outputData = {};
    var order = parseInt(req.query.edited);
    console.log("controller order: " + order);

    Revision.revisionGroup(order,function(err, result){
        if (err){
            console.log(err);
            console.log("showGroupSize Aggregation Error");
            outputData = result;
            res.json({topEditor: outputData});
        }else{
            outputData = result;
            res.json({topEditor: outputData});
        }
    });
};


module.exports.showHistoryDuration = function(req,res){
    // if (req.cookies.login){
    var outputData = {};
    var order = parseInt(req.query.history);
    console.log("controller order duration: " + order);

    Revision.revisionHistory(order,function(err, result){
        if (err){
            console.log(err);
            console.log("showGroupSize Aggregation Error");
            outputData = result;
            res.json({historyResult: outputData});
        }else{
            outputData = result;
            res.json({historyResult: outputData});
            // console.log('success in revisionHistory')
            // console.log(outputData)
        }
    });

}

module.exports.showGraph = function (req,res) {
    // if (req.cookies.login) {
        //bar chart data
    console.log('showgraph get called');
        Revision.barChartOverall(
            function(err,result){
                if(err){
                    console.log('failed to get overallBarChart. '+err);
                    // return result;
                }else{
                    // console.log('overallBarChart, '+result);
                    res.json(result);
                }
            });
};

module.exports.showPieGraph = function (req,res) {
    // if (req.cookies.login) {
    //bar chart data
    console.log('showPieChart get called');
    Revision.pieChartOverall(
        function(err,result){
            if(err){
                console.log('failed to get overallBarChart. '+err);
                // return result;
            }else{
                // console.log('overallBarChart, '+result);
                res.json(result);
            }
        });
}
  
  
// individual function

module.exports.individualFunction = function(req,res){
    var totalNumber = 0;
    console.log('individualFunction get called')
    // send titles to res
    Revision.individualGetTitle(function(err,result){
        if(err){
            console.log('failed to get getTitle. '+err);
        }else{
            console.log('getTitle, '+result);
            articles = result;
            res.jsonp({articles:result});
        }
    })
}


module.exports.individualConfiguration = function (req,res){
    console.log('individualConfiguration get called')
    // send titles to res
    Revision.individualConfiguration(function(err,result){
        if(err){
            console.log('failed to get individualConfiguration. '+err);
        }else{
            console.log('individualConfiguration, '+result);
            res.jsonp(result);
        }
    })
}


module.exports.individualGetNewsReddit = function (req,res){
    console.log('individualGetNewsReddit get called')

    var givenTitle = req.query.title;

    var wikiEndpoint = "https://www.reddit.com/search.json";
    queryString = 'q='+givenTitle
    var parameters = [
        queryString+'+AND+subreddit:news',
        'sort=top',
        'limit=3'
    ]
    var url = wikiEndpoint + "?" + parameters.join("&");
    console.log("url: " + url);
    var options = {
        url: url,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    request(options, function (err, response, data){
        if (err) {  // app error control
            console.log('Error:', err);
        } else if (res.statusCode !== 200) { //statusCode control
            console.log('Error status code:', res.statusCode);
        } else { // success
            var json = JSON.parse(data);
            res.jsonp(json);
        }
    })
}



// individual
// get timestamp of last revision
module.exports.individualGetLastTimestamp = function(req,res){

    var givenTitle = req.query.title;
    console.log('individualGetLastTimestamp get called with para '+givenTitle);
    // send titles to res
    Revision.individualGetLastTimestamp(givenTitle,function(err,result){
        if(err){
            console.log('failed on individualGetLastTimestamp. '+err);
        }else{
            console.log('individualGetLastTimestamp, '+result);
            res.jsonp(result);
        }
    })
}

module.exports.individualGetNewRevisions = function (req,res){
    console.log('individualGetNewRevisions get called')
    // https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=ids|user|userid|timestamp&rvstart=2019-12-01T00:00:00Z&rvend=2020-05-01T00:00:00Z&rvdir=newer&format=json&titles=cat&rvlimit=max
    var givenTitle = req.query.title;
    var givenTimeStample = req.query.lastTimeStamp;
    var givenCurrentTime = req.query.currentTimeStamp;

    var endpoint = "https://en.wikipedia.org/w/api.php";
    queryString = 'titles='+givenTitle;
    queryStartTime = 'rvstart='+givenTimeStample;
    queryEndTime = 'rvend='+givenCurrentTime;
    var parameters = [
        'action=query',
        'prop=revisions',
        'rvprop=ids|user|userid|timestamp',
        queryStartTime,
        queryEndTime,
        'rvdir=newer',
        'format=json',
        queryString,
        'rvlimit=max'
    ]
    var url = endpoint + "?" + parameters.join("&");
    console.log("url: " + url);
    var options = {
        url: url,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };
    request(options, function (err, response, data){
        if (err) {  // app error control
            console.log('Error:', err);
        } else if (res.statusCode !== 200) { //statusCode control
            console.log('Error status code:', res.statusCode);
        } else { // success
            var json = JSON.parse(data);
            revisionsResult = Object.values(json.query.pages)[0].revisions;
            revisionTitle = Object.values(json.query.pages)[0].title

            // console.log(revisionTitle);
            // console.log(revisionsResult[1]);
            if (revisionsResult){
                for(var i=0;i<revisionsResult.length;i++){
                    var newRevision = new Revision({
                        title: revisionTitle,
                        timestamp: revisionsResult[i].timestamp,
                        user: revisionsResult[i].user,
                        revid: revisionsResult[i].revid,
                    })
                    newRevision.save(function (err){
                        if (err){
                            console.log('error in insertNewRevisions: '+err);
                        }
                    });
                    console.log('update revision. TimeStamp: '+revisionsResult[i].timestamp);
                }
                // res.jsonp(revisionsResult);
                res.json({'length':revisionsResult.length});
            } else {
                res.json({'length':0});
            }

        }
    })
}



module.exports.individualGetTopFiveUsers = function(req,res){
    var givenTitle = req.query.title;
    var yearList = req.query.yearList;
    console.log('individualGetTopFiveUsers get called with para '+givenTitle);
    Revision.individualGetTopFiveUsers(givenTitle,yearList,function(err,result){
        if(err){
            console.log('failed on individualGetTopFiveUsers. '+err);
        }else{
            console.log('individualGetTopFiveUsers, '+result);
            res.jsonp(result);
        }
    })
}


module.exports.individualGetTotalRevisionNumber = function(req,res){
    var givenTitle = req.query.title;
    var yearList = req.query.yearList;

    console.log('individualGetTotalRevisionNumber get called')
    // console.log(yearList)
    Revision.individualGetTotalRevisionNumber(givenTitle,yearList,function(err,result){
        if(err){
            console.log('failed to get individualGetTotalRevisionNumber. '+err);
        }else{
            console.log('individualGetTotalRevisionNumber, '+result);
            res.jsonp(result);
        }
    })
}


module.exports.individualBarChart = function(req,res){
    var title = req.query.title;
    var yearList = req.query.yearList;
    console.log('individualPieChart get called with para title: '+title);
    Revision.individualBarChart(title,yearList,function(err,result){
        if(err){
            console.log('failed to get individualPieChart. '+err);
        }else{
            console.log('individualPieChart, '+result);
            res.jsonp(result);
        }
    })
}

module.exports.individualPieChart = function(req,res){
    var title = req.query.title;
    var yearList = req.query.yearList;
    console.log('individualPieChart get called with para title: '+title);
    Revision.IndividualPieChart(title,yearList,function(err,result){
        if(err){
            console.log('failed to get individualPieChart. '+err);
        }else{
            console.log('individualPieChart, '+result);
            res.jsonp(result);
        }
    })
}


module.exports.individualBarChart3 = function(req,res){
    var userList = req.query.userList;
    var title = req.query.title;
    var yearList = req.query.yearList;

    console.log('individualBarChart3 get called with para title:'+title+'; and userList: '+userList);

    Revision.individualBarChart3(title,userList,yearList,function(err,result){
        if(err){
            console.log('failed to get individualBarChart3. '+err);
        }else{
            console.log('individualBarChart3, '+result);
            res.jsonp(result);
        }
    })
}



module.exports.AuthorGetList=function(req,res){
    console.log('AuthorGetList get called!')
    Revision.AuthorGetList(function(err,result)
    {
        if (err){
            console.log("err in AuthorGetList" + err);
        }else{
            res.json(result);
        }
    })
}

module.exports.AuthorGetArticle=function(req,res){
    var autherName = req.query.chooseAuthor;
    console.log('AuthorGetArticle get called');
    Revision.AuthorGetArticle(autherName,function(err,result){
        if (err){
            console.log("err in AuthorGetArticle");
        } else{
            res.json(result);
        }
    })
}
module.exports.AuthorGetArticleAndTitle=function(req,res){

    var autherName = req.query.chooseAuthor;
    var title = req.query.chooseTitle;

    console.log('AuthorGetArticleAndTitle get called');

    Revision.AuthorGetArticleAndTitle(autherName,title,function(err,result){
        if(err){
            console.log("err in AuthorGetArticleAndTitle");
        }
        else{
            console.log('findArticleByAuthorAndTitle result');
            res.json(result);
        }
    })
}









