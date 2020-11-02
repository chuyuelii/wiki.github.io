

// individual bar chart 1
// google.charts.load('current', {'packages':['bar']});
// google.charts.setOnLoadCallback(DrawIndividualBarChart1);
// individual pie chart 2
google.charts.load('current', {packages: ['corechart']});

var DataIndividualBar = [];
//Individual Pie chart function
var DataIndividualPie2 = [];
// global var for invididual bar chart 3
var DataIndividualBar3 = {};
var ConfigIndividualBar3 =[];

function ParseIndividualBar1Data(jsonData){
    // data sample :
    // 0: {year: "2001", type: "registed", number: 1}
    var dict = {}
    // console.log(jsonData);
    jsonData.forEach(function (row){
        // extract data
        var dataYear = row.year;
        var dataType = row.type;
        var dataNumber = row.number;
        if(!dict[dataYear]){
            dict[dataYear]={}
        }
        dict[dataYear][dataType] = dataNumber
    })

    for(var row in dict){
        if(!dict[row].admin){
            dict[row].admin=0
        }
        if(!dict[row].registed){
            dict[row].registed=0
        }
        if(!dict[row].anon){
            dict[row].anon=0
        }
        if(!dict[row].bots){
            dict[row].bots=0
        }
    }
    // console.log(dict)
    return dict;
}

// use global variable min and max year as para
function yearFilterFunction(inputData){
    // console.log(curMinYear);
    // console.log(curMaxYear);

    var finalData = {}

    for(var i = 0;i<curMaxYear - curMinYear + 1;i++){
        finalData[curMinYear+i]=inputData[curMinYear+i]
    }
    // console.log('finalData')
    // console.log(finalData)
    return finalData
}

function DrawIndividualBarChart1(inputData){
    // sample data
    // 2004: {anon: 100, admin: 21, bots: 3, registed: 184}
    // console.log('individual bar');
    // console.log('inputData')
    // console.log(inputData)

    // inputData = yearFilterFunction(inputData)

    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'Year');
    graphData.addColumn('number', 'admin');
    graphData.addColumn('number', 'registed');
    graphData.addColumn('number', 'bots');
    graphData.addColumn('number', 'anon');

    $.each(inputData, function(row) {
        var anonData = inputData[row].anon;
        var adminData = inputData[row].admin;
        var botsData = inputData[row].bots;
        var registedData = inputData[row].registed;
        graphData.addRow([row, adminData,registedData,botsData,anonData]);
    });

    // console.log(graphData);
    var chart = new google.visualization.ColumnChart($("#individualBarChart1")[0]);

    var options = {'title':"Bar Chart ",
        'width':1200,
        'height':900
    };
    chart.draw(graphData, options);
}



//Individual Pie chart function
function DrawIndividualPieChart2(inputData){

    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'UserType');
    graphData.addColumn('number', 'RevisionsNumber');
    //console.log(DataIndividualPie2);
    $.each(inputData, function(i,dataRow) {
        // console.log(dataRow);
        key = dataRow.type
        val = dataRow.number
        graphData.addRow([key, val]);
    });
    // console.log(graphData);
    var chart = new google.visualization.PieChart($("#individualPieChart2")[0]);

    var options = {'title':"Pie Chart2 ",
        'width':1200,
        'height':900
    };

    chart.draw(graphData, options);
}

function ParseIndividualBar3Data(jsonData){
    // console.log(jsonData)
    var dict={};

    jsonData.forEach(function (row){

        var id = row._id;
        var dataUser = id.user;
        var dataYear = id.year;
        var dataNum = row.num;
        if(!dict[dataUser]){
            dict[dataUser]={}
        }
        dict[dataUser][dataYear] = dataNum
    })

    ConfigIndividualBar3 = []
    for (var i = 0; i < curMaxYear - curMinYear + 1; i++) {
        ConfigIndividualBar3.push(Number(curMinYear + i));
    }

    for(var row in dict) {
        ConfigIndividualBar3.forEach(function (ele){
                if(!dict[row][ele]){
                    dict[row][ele] = 0;
                }
        })
    }
    // console.log(dict);
    return dict;
}

function DrawIndividualBarChart3(element){
    // sample data
    // UberCryxic: {2001: 0, 2002: 0, 2003: 0, 2004: 0, 2005: 0, 2006: 17, 2007: 609, 2008: 4, ... }
    // {2001: 0, 2002: 0, 2003: 0, 2004: 0, 2005: 0, 2006: 17, 2007: 609, 2008: 4, ... }


    var inputData = DataIndividualBar3[element]
    // inputData = yearFilterFunction(inputData)
    // console.log('DrawIndividualBarChart3')
    // console.log(inputData)


    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'Year');
    graphData.addColumn('number', 'Revisions');

    $.each(inputData, function(key,val) {
        // console.log(key,val);
        // registedData = inputData[row].registed;
        graphData.addRow([key,val]);
    });


    // console.log(graphData);
    var chart = new google.visualization.ColumnChart($("#individualBarChart3")[0]);

    var options = {'title':"Bar 3 Chart "+element,
        'width':1200,
        'height':900
    };
    chart.draw(graphData, options);
}



$(document).ready(function () {


    //Log out
    $('#Logout').on('click', function (e) {
        window.location.replace("/logOut");
    });

    // global variables
    var ListIndividualTopFiveUsers = [];

    var yearList = [];

    // set default value
    curMinYear = 2001
    curMaxYear = 2020


    $("#revisionNumber").on('click', function (e) {
        // var parameter = {"selection": $('#selection').val(),"range": $('#range').val()};
        var parameter = {"selection": $('#selection').val()};
        var revisionNumber = $.get('/main/revisionNumber', parameter);

        revisionNumber.done(function (result) {
            // console.log("result = ");
            // console.log(result.topRevision);

            var output = "";
            for(let i=0; i<2; i++){
                j = i + 1;
                output = output + j + ".“TITLE”: " + result.topRevision[i]._id +"<br>"+"“VOLUME”:" + result.topRevision[i].numOfRevisions + "<br>";

            }
            $('#revisionNumberResult').html('the result of query is:\n' + '<br>' +
                output);
        });
      
      revisionNumber.fail(function (result) {
            $('#revisionNumberResult').html("res status: " + revisionNumber.status);
            console.log('err in revisionNumber '+result);
        });
    });

    $("#editorGroup").on('click', function (e) {
        // var parameter = {"selection": $('#selection').val(),"range": $('#range').val()};
        var parameter = {"edited": $('#edited').val()};
        //

        var groupSize = $.get('/main/groupSize', parameter);

        groupSize.done(function (result) {
            var output = "";
            for(let i=0; i<2; i++){
                j = i + 1;
                output = output + j + ".“TITLE”: " + result.topEditor[i]._id +"<br>"+"“GROUPSIZE”:" + result.topEditor[i].numOfUsers + "<br>";
            }
            $('#editedResult').html('the result of query is:\n' + '<br>' +
                output);
        });

        groupSize.fail(function (result) {
            $('#editedResult').html("res status: " + groupSize.status);
            console.log('err in groupSize '+result);
        });
    });


    $("#duration").on('click', function (e) {
        // var parameter = {"selection": $('#selection').val(),"range": $('#range').val()};
        var parameter = {"history": $('#history').val()};
        //

        var historyDuration = $.get('/main/historyDuration', parameter);

        historyDuration.done(function (result) {
            var output = "";

            output = output + "“TITLE”: " + result.historyResult[0]._id +"<br>"+"“TIME”:" + result.historyResult[0].time + "<br>";
            // console.log(output);

            $('#periodReturn').html('the result of query is:\n' + '<br>' +
                output);
        });

        historyDuration.fail(function (result) {
            $('#periodReturn').html("res status: " + historyDuration.status);
            console.log('err in historyDuration '+result);
        });
    });

    //////////////////////////////////////////////////
    //Individual
    //////////////////////////////////////////////////


    ////////////////////////////////////////////////////////
    //rewrite
    ////////////////////////////////////////////////////////
    //show total number of revision


    // get them disappear
    $('#ButtonIndividualBar1Chart').css('display', 'none');
    $('#ButtonIndividualPie2Chart').css('display', 'none');
    $('#ButtonIndividualBar3Chart').css('display', 'none');
    // once we change the drop down menu,
    // previous analysis should be disappear
    $('#individualBarChart1').html('');
    $('#individualPieChart2').html('');
    $('#individualBarChartButtons').html('');
    $('#individualBarChart3').html('');

    // push request
    var GETindividual = $.get('/main/individual');
    GETindividual.done(function (result) {
        var articles = result.articles;
        for (var i = 0; i < articles.length; i++) {
            stringTitle = articles[i]._id + '  ||  ' + 'Total Revisions: ' + articles[i].numOfRevisions;
            $('#DropdownArticles').append($('<option>', {
                label: stringTitle,
                value: articles[i]._id
            }));
        }
    });
    //error control
    GETindividual.fail(function (result) {
        console.log('error in ButtonIndividualFunction' + result);
    });


    // push request
    var GETindividualConfiguration = $.get('/main/individualConfiguration');
    // get some data to config the charts, eg. min year , max year
    GETindividualConfiguration.done(function (result) {
        maxYear = Number(result[0].maxyear)
        minYear = Number(result[0].minyear)

        curMinYear = minYear
        curMaxYear = maxYear

        // once we have the min and max year
        // apply them on the year filter
        $('#yearStart').attr('min', minYear).attr('max', maxYear).attr('value', minYear).on('change',function(){
            curMinYear = Number($('#yearStart').val())
            curMaxYear = Number($('#yearEnd').val())
            if(curMinYear>curMaxYear){
                $('#yearStart').val(curMinYear - 1)
                curMinYear = Number($('#yearStart').val())
            }
        });
        // $('#yearStart')
        $('#yearEnd').attr('min', minYear).attr('max', maxYear).attr('value', maxYear).on('change',function(){
            curMinYear = Number($('#yearStart').val())
            curMaxYear = Number($('#yearEnd').val())
            if(curMinYear>curMaxYear){
                $('#yearEnd').val(curMaxYear + 1)
                curMaxYear = Number($('#yearEnd').val())
            }
        });
        // $('#yearEnd');
        // console.log(curMinYear);
        // console.log(curMaxYear);
    });
    //error control
    GETindividualConfiguration.fail(function (result) {
        console.log('error in individualConfiguration');
    });

    // below function only require data for chart 1 and 2
    var ArticlesAnalysis = function(){

        // console.log('ArticlesAnalysis')

        $('#ButtonIndividualBar1Chart').css('display','inline');
        $('#ButtonIndividualPie2Chart').css('display','inline');
        $('#ButtonIndividualBar3Chart').css('display','inline');

        var title = $('#individualArticleTitle').html();
        // console.log(title);
        var parameter = {
            'title': title,
            'userList': ListIndividualTopFiveUsers,
            'yearList': yearList
        };
        // console.log(parameter)

        /////////////////////////////////////////////////
        // bar chart
        // sample result: 0: {type: "admin", number: 923}
        var GETindividualBarChart = $.get('/main/individualBarChart',parameter);
        GETindividualBarChart.done(function (result) {
            // console.log('individualBarChart result,'+result);
            DataIndividualBar = ParseIndividualBar1Data(result);

        });
        //error control
        GETindividualBarChart.fail(function (result) {
            console.log('error in individualBarChart');
        });

        /////////////////////////////////////////////////
        // pie chart
        // sample result: 0: {type: "admin", number: 923}
        var GETindividualPieChart = $.get('/main/individualPieChart',parameter);
        GETindividualPieChart.done(function (result) {
            DataIndividualPie2 = result;
        });
        //error control
        GETindividualPieChart.fail(function (result) {
            console.log('error in individualPieChart');
        });

    }



    var summaryInformation = function(){
        $('#tips0').html('Tips: To avoid large volumn of data, after using the year filter function above, you may manually reload the information by clicking Refresh')
        // console.log('summaryInformation')

        $('#ButtonIndividualBar1Chart').css('display','none');
        $('#ButtonIndividualPie2Chart').css('display','none');
        $('#ButtonIndividualBar3Chart').css('display','none');
        // once we change the drop down menu,
        // previous analysis should be disappear
        $('#individualBarChart1').html('');
        $('#individualPieChart2').html('');
        $('#individualBarChartButtons').html('');
        $('#individualBarChart3').html('');

        //var givenTitle = $(this).children('option:selected').val();
        var givenTitle = $('#DropdownArticles').val();
        // console.log(givenTitle)
        yearList = []
        for(var i = 0; i<curMaxYear-curMinYear+1;i++){
            yearList.push(Number(curMinYear+i))
        }

        var parameter = {
            "title": givenTitle,
            "yearList": yearList
        };

        var now = new Date().getTime();
        var latestTimeStamp = 0;
        var newTimeStamp = 1;
        var nowISO = new Date().toISOString();

        var GETindividualGetLastTimestamp = $.get('/main/individualGetLastTimestamp',parameter);
        GETindividualGetLastTimestamp.done(function (result) {

            latestTimeStamp = result[0].timestamp;
            var datefromAPITimeStamp = (new Date(latestTimeStamp)).getTime();
            // console.log(now);
            var dayDifference = (now - datefromAPITimeStamp)/(1000*60*60*24);
            // console.log(dayDifference);
            // console.log(latestTimeStamp);
            if (dayDifference>1){
                $('#updateStatus').html('last update: '+latestTimeStamp+' is not up to date. But there is no more revisions')
                // to do
                // search update info and store in database
                toSendTimeStamp = new Date(datefromAPITimeStamp+1000).toISOString()
                // console.log('toSendTimeStamp '+toSendTimeStamp)
                parametersTimeStamp = {
                    'currentTimeStamp' : nowISO,
                    'lastTimeStamp': toSendTimeStamp,
                    "title": givenTitle,
                }

                var GETindividualGetNewRevisions = $.get('/main/individualGetNewRevisions',parametersTimeStamp);
                GETindividualGetNewRevisions.done(function (result) {
                    // result : should be a number indicates how many new revisions
                    // console.log('GETindividualGetNewRevisions result : ');
                    // console.log(result)
                    var GETindividualGetLastTimestampAgain = $.get('/main/individualGetLastTimestamp',parameter);
                    GETindividualGetLastTimestampAgain.done(function (result1) {
                        newTimeStamp = result1[0].timestamp;
                        $('#updateStatus').html('last update: '+newTimeStamp+'. Number of new revisions pull into database: '+result.length)
                    })
                    GETindividualGetLastTimestampAgain.fail(function (result1){
                        console.log('error in GETindividualGetLastTimestampAgain: '+result1);
                    })
                })
                //error control
                GETindividualGetNewRevisions.fail(function (result) {
                    console.log('error in GETindividualGetNewRevisions ');
                    // console.log(result);
                });
            }else{
                $('#updateStatus').html('last update: '+latestTimeStamp+' is already up to date')
            }
        })
        //error control
        GETindividualGetLastTimestamp.fail(function (result) {
            $('#updateStatus').html('error when checking the status');
            console.log('error in GETindividualGetLastTimestamp');
        })


        var GETindividualGetNewsReddit = $.get('/main/individualGetNewsReddit',parameter);
        GETindividualGetNewsReddit.done(function (result) {
            // console.log('GETTop3NewsReddit');
            // console.log(result);
            var redditNewsList = [];
            // hard code 3 here due to the requirement
            for(var i = 0; i < 3;i++){
                // console.log(result.data.children.length)
                if(i + 1 <= result.data.children.length){
                    redditNewsList.push($('<a>', {href: result.data.children[i].data.url,html:result.data.children[i].data.title }));
                } else {
                    redditNewsList.push('Not available');
                }
            }
            $('#individualRedditNews').html('');
            $('#individualRedditNews').append($('<table>'));
            $('#individualRedditNews').append($('<th>',{
                html : 'Top 3 Relevant News'
            }));
            $('#individualRedditNews').append($('<tr>',{
                html : redditNewsList.shift()
            }));
            $('#individualRedditNews').append($('<tr>',{
                html : redditNewsList.shift()
            }));
            $('#individualRedditNews').append($('<tr>',{
                html : redditNewsList.shift()
            }));


        });
        //error control
        GETindividualGetNewsReddit.fail(function (result) {
                console.log('error in DropdownArticles');
            }
        );

        /////////////////////////////////////////////////////////////////////////
        // During the same function, show specific info of one article
        // query based on given title

        var GETindividualGetTopFiveUsers = $.get('/main/individualGetTopFiveUsers',parameter);
        $('#individualArticleTitle').html(givenTitle);
        GETindividualGetTopFiveUsers.done(function (result) {
            // console.log(result);
            var topFiveUsers = '';
            // remove all element in the global var
            ListIndividualTopFiveUsers = [];
            for (var i = 0;i<result.length;i++){
                topFiveUsers += result[i]._id+', '
                //push top five users into the list
                ListIndividualTopFiveUsers.push(result[i]._id);
            }
            // console.log('topFiveUsers');
            // console.log(topFiveUsers);
            $('#individualTopFiveUsers').html(topFiveUsers);

            // while success, require bar chart 3 data immediately
            // this is because para of bar chart 3 depends on this section.
            //
            /////////////////////////////////////////////////
            // bar chart
            // var parameter = {
            //     'title': title,
            //     'userList': ListIndividualTopFiveUsers,
            //     'yearList': yearList
            // };

            parameter['userList']=ListIndividualTopFiveUsers;
            // console.log(parameter)
            var GETindividualBarChart3 = $.get('/main/individualBarChart3',parameter);
            GETindividualBarChart3.done(function (result) {
                // console.log('individualBarChart3 result,');
                // console.log(result)
                DataIndividualBar3 = ParseIndividualBar3Data(result);
                $("#individualBarChartButtons").html('');
            });
            //error control
            GETindividualBarChart3.fail(function (result) {
                console.log('error in ButtonIndividualFunction');
            });



        });
        //error control
        GETindividualGetTopFiveUsers.fail(function (result) {
            console.log('error in individualGetTopFiveUsers');
        });

        /////////////////////////////////////////////////////////////////////////

        var GETindividualGetTotalRevisionNumber = $.get('/main/individualGetTotalRevisionNumber',parameter);
        GETindividualGetTotalRevisionNumber.done(function (result) {
            // console.log(result);
            var totalNumber = result[0].num;
            $('#individualArticleTotalNumberRevisions').html(totalNumber);
        });
        //error control
        GETindividualGetTotalRevisionNumber.fail(function (result) {
            $('#updateStatus').html('error when checking the status');
            console.log('error in individualGetTotalRevisionNumber');
        });

        // below function only require data for chart 1 and 2
        ArticlesAnalysis();

    }


    $("#DropdownArticles").on('change', summaryInformation);

    ///////////////////////////////////////////
    var summaryInformationByClicking = function () {
        var selectedOption = $('#DropdownArticles').children("option:selected").val()
        // console.log(selectedOption)
        if(selectedOption != -1){
            summaryInformation()
        } else {
            $('#tips0').html('Tips: Please select a specific article from the below dropdown list')
        }
    }

    $("#ButtonIndividualRefresh").on('click', summaryInformationByClicking);


    $('#ButtonIndividualBar1Chart').on('click', function(){
        $('#individualPieChart2').html('');
        $("#individualBarChartButtons").html('');
        $("#individualBarChart3").css('display','none');
        DrawIndividualBarChart1(DataIndividualBar);
    });

    $('#ButtonIndividualPie2Chart').on('click', function(){
        $('#individualBarChart1').html('');
        $("#individualBarChartButtons").html('');
        $("#individualBarChart3").css('display','none');
        DrawIndividualPieChart2(DataIndividualPie2);
    });

    $('#ButtonIndividualBar3Chart').on('click', function(){
        $("#individualBarChartButtons").html('');
        $('#individualBarChart1').html('');
        $('#individualPieChart2').html('');
        $("#individualBarChart3").css('display','inline');
        for(var i = 0;i<ListIndividualTopFiveUsers.length;i++){
            // need to remove all buttons b4 append
            $("#individualBarChartButtons").append($('<button>', {
                value: ListIndividualTopFiveUsers[i],
                class: "individualBarChartButton",
                text: ListIndividualTopFiveUsers[i],
            }));
        }

        $(".individualBarChartButton").on('click', function(){
            // console.log('test');
            // console.log(this.value);
            DrawIndividualBarChart3(this.value)
        })
    });



    // Function 3 //////////////////////
    //author analysis
    $("#authorAnalysis").on('click',function(e){
        var AuthorGetList=$.get('/main/AuthorGetList');
        AuthorGetList.done(function(result){

            $('#userlist').html('');

            for(var i =0;i<result.length;i++){
                $('#userlist').append($('<option>', {
                        value: result[i]._id,
                    })
                )}
            // console.log($('#userlist').html())
            $('#authorName').on('input',function(){
                var len = $('#authorName').val().length
                if (len>2){
                    $('#authorName').attr('list',"userlist")
                } else {
                    $('#authorName').attr('list',null)
                }
            })

        });
        AuthorGetList.fail(function(result){
            console.log('error in AuthorGetList');
        });

    });



    $("#userButton").on('click',function(e){
        var chooseAuthor=$('#authorName').val();

        var name={"chooseAuthor":chooseAuthor};
        var AuthorGetArticle=$.get('/main/AuthorGetArticle',name);

        AuthorGetArticle.done(function(result){
            // console.log('result author ');
            // console.log(result);

            $("#articleByThisAuthor").html('');

            var table = $('<table></table>')
            var headerRow = $('<tr></tr>').append($('<th>',{html : 'Article title'})).append($('<th>',{html : 'number of revisions'})).append($('<th>',{html : 'choose'}));
            table.append(headerRow);

            // each row has 3 data
            for (var i = 0;i<result.length;i++){
                var newRow = $('<tr></tr>');
                var data1 = $('<td></td>').text(result[i]._id)
                var data2 = $('<td></td>').text(result[i].numOfRevision)
                var data3 = $('<td></td>').html('<input type=\"radio\" name=\"chooseAuthor\" id=\"chooseAuthor\" value=\"'+result[i]._id+'\"/>')
                newRow.append(data1).append(data2).append(data3)
                table.append(newRow)
            }
            $("#articleByThisAuthor").append(table)
        });
        AuthorGetArticle.fail(function(result){
            console.log('error in AuthorGetArticle');
        });
    });

    $("#checkMoreInfo").on('click',function(e){

        var chooseAuthor=$('#authorName').val();
        var chooseTitle=$('#chooseAuthor:checked').val();

        var par={
            "chooseAuthor":chooseAuthor,
            "chooseTitle":chooseTitle
        };
        var AuthorGetArticleAndTitle=$.get('/main/AuthorGetArticleAndTitle',par);

        AuthorGetArticleAndTitle.done(function(result){
            // console.log(result);


            $('#articleByTitleAndName').html('');

            const arr = result;
            arr.forEach((val, idx) => {
                $("#articleByTitleAndName").append(
                    `${idx === 0 ? '<div>' : ''}
                    <p id="${val.revid}" name="article-options" value="${val.revid}"></p>
                    <label for="${val.revid}">Revision ID: ${val.revid}  Time: ${val.time}</label>
                ${idx === arr.length - 1 ? '</div>' : '<br>'}`
                );
            });
        })
        AuthorGetArticleAndTitle.fail(function(result){
            console.log('error in AuthorGetArticleAndTitle');
        })
    })
});