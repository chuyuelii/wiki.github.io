
google.charts.load('current', {packages: ['corechart']});

var optionsforPie= {'title':" The Pie chart for user type distribution ",
    'width':1200,
    'height':900,
    slices: {  0: {offset: 0.2},
        1: {offset: 0.3},
        2: {offset: 0.4},
        4: {offset: 0.5},
    },
};


var optionsforBar = {
    title: "The bar chart for revison distribution ",
    width: 1200,
    height: 900,
    hAxis: {
        title: 'years'
    }
};


var userTypeTotal = 0.0;
var mostPercentage = 0.0;
var secondPercentage = 0.0;
var thirdPercentage = 0.0;
var fourthPercentage = 0.0;
var mostPercentageLabel;
var secondPercentageLabel;
var thirdPercentageLabel;
var fourthPercentageLabel;




function  ParseOverallRevisionData(jsonData) {
    var dict = {};
    jsonData.forEach(function (row){
        // extract data
        dataYear = row.year;
        dataType = row.type;
        dataNumber = row.number;
        if(!dict[dataYear]){
            dict[dataYear]={}
        }
        dict[dataYear][dataType] = dataNumber
    });

    //assignment the numeric value to the empty data
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
    //console.log(dict)
    return dict;
}


function DrawOveralBarChart(rowBarChartData){

    // console.log("Overal Bar Chart");

    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'Year');
    graphData.addColumn('number', 'admin');
    graphData.addColumn('number', 'registed');
    graphData.addColumn('number', 'bots');
    graphData.addColumn('number', 'anon');

    $.each(rowBarChartData, function(row) {
        anonData = rowBarChartData[row].anon;
        adminData = rowBarChartData[row].admin;
        botsData = rowBarChartData[row].bots;
        registedData = rowBarChartData[row].registed;
        graphData.addRow([row, adminData,registedData,botsData,anonData]);
    });

    // console.log(graphData);
    var chart = new google.visualization.ColumnChart($("#myChart")[0]);
    chart.draw(graphData, optionsforBar);
}

function DrawOverallLineChart(rowBarChartData){

    // console.log("Overal Line Chart");

    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'Year');
    graphData.addColumn('number', 'admin');
    graphData.addColumn('number', 'registed');
    graphData.addColumn('number', 'bots');
    graphData.addColumn('number', 'anon');

    $.each(rowBarChartData, function(row) {
        anonData = rowBarChartData[row].anon;
        adminData = rowBarChartData[row].admin;
        botsData = rowBarChartData[row].bots;
        registedData = rowBarChartData[row].registed;
        graphData.addRow([row, adminData,registedData,botsData,anonData]);
    });

    // console.log(graphData);
    var chart = new google.visualization.LineChart($("#myChart")[0]);
    chart.draw(graphData, optionsforBar);
}



function ParseOverallPieData(jsonData){
    var dict = {};
    var typePercentage = {};

    jsonData.forEach(function (row){
        // extract data
        dataType = row.type;
        dataNumber = row.number;
        userTypeTotal = userTypeTotal + dataNumber;
        if(!dict[dataType]){
            dict[dataType]={}
        }
        dict[dataType] = dataNumber;
    });

    //Handling parse the percentage data
    //Sort the dictionary:
    for(var type in dict){
        dataPercentage = (100 *(dict[type]/userTypeTotal)).toFixed(4);
        console.log(type);
        typePercentage[dataPercentage] = type;
    }
    // console.log(typePercentage);
    var res = Object.keys(typePercentage).sort();
    mostPercentage = res[3];
    secondPercentage = res[2];
    thirdPercentage = res[1];
    fourthPercentage = res[0];
    //Print the label out:
    mostPercentageLabel =  printOutLabel(res[3],typePercentage);
    secondPercentageLabel = printOutLabel(res[2],typePercentage);
    thirdPercentageLabel = printOutLabel(res[1],typePercentage);
    fourthPercentageLabel = printOutLabel(res[0],typePercentage);

    // console.log(dict);
    // console.log(res);
    return dict;
}

function printOutLabel(i,typePercentage) {
    for(var percentage in typePercentage){
        if(i == percentage){
            percentageLabel = typePercentage[percentage];
        }
    }
    return percentageLabel;
}

function DrawOverallPieChart(rowPieChartData){
    graphData = new google.visualization.DataTable();
    graphData.addColumn('string', 'type');
    graphData.addColumn('number', 'number');

    $.each(rowPieChartData, function(type, number) {
        graphData.addRow([type, number]);
    });
    console.log(graphData);
    var chart = new google.visualization.PieChart($("#myPieChart")[0]);
    chart.draw(graphData, optionsforPie);
}


function putPieDescriptionText(){
    var pieText = $("<br><p>The graph shows the revision number distribution by user type," +
        " in which <b><label id = totalNumer></label></b> users are taken into consideration for this analysis. " +
        " From the pie chart, it is clear that the revisions were made mostly by <b><label id = mostPercentageLabel></label></b> users that cover for <b ><label id='mostPercentage'></label></b> percent, followed by <b><label id = secondPercentageLabel></label></b> users with <label id='secondPercentage'></label> percent. " +
        " The <b><label id = thirdPercentageLabel></label></b> users stands at <b><label id='thirdPercentage'></label></b> percent, which is larger than  revisions made by <b><label id = fourthPercentageLabel></label></b> users around <b><label id='fourthPercentage'></label> </b> percent.</p>)"
    );

    //Number
    $('#pieIDText').append(pieText);
    $('#totalNumer').html(userTypeTotal);
    $('#mostPercentage').html(mostPercentage);
    $('#secondPercentage').html(secondPercentage);
    $('#thirdPercentage').html(thirdPercentage);
    $('#fourthPercentage').html(fourthPercentage);

    //Tag
    $('#mostPercentageLabel').html(mostPercentageLabel);
    $('#secondPercentageLabel').html(secondPercentageLabel);
    $('#thirdPercentageLabel').html(thirdPercentageLabel);
    $('#fourthPercentageLabel').html(fourthPercentageLabel);


}

$(document).ready(function() {

    console.log("it is called");
    // For the bar data:
    $("#barChart").click(function(event){
        var barChartOverallAnalysis =$.get('/main/drawBarGraph');
        barChartOverallAnalysis.done(function (result) {
            // console.log(result);
            var rowBarChartData = ParseOverallRevisionData(result);
            DrawOveralBarChart(rowBarChartData);
        });
        barChartOverallAnalysis.fail(function (result) {
            $('#myChart').html("res status: " + barChartOverallAnalysis.status);
            console.log('err in barChartOverallAnalysis');
        });

    });

    $("#lineChart").click(function(event){
        var lineChartOverallAnalysis =$.get('/main/drawBarGraph');
        lineChartOverallAnalysis.done(function (result) {
            // console.log(result);
            var rowBarChartData = ParseOverallRevisionData(result);
            DrawOverallLineChart(rowBarChartData);
        });
        lineChartOverallAnalysis.fail(function (result) {
            $('#myChart').html("res status: " + lineChartOverallAnalysis.status);
            console.log('err in lineChartOverallAnalysis');
        });
    });

    $("#pieChart").click(function(event){
        // console.log("pieChart is called");
        var pieChartOverallAnalysis =$.get('/main/drawPieGraph');
        pieChartOverallAnalysis.done(function (result) {
            // console.log(result);
            var rowPieChartData = ParseOverallPieData(result);
            DrawOverallPieChart(rowPieChartData);
            //put the numeber into the tag:
            putPieDescriptionText();



        });
        pieChartOverallAnalysis.fail(function (result) {
            $('#pieChart').html("res status: " + pieChartOverallAnalysis.status);
            $('#totalNumber').html("res status: " + pieChartOverallAnalysis.status);
            console.log('err in pieChartOverallAnalysis');
        });
    });




});