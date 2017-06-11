var senzorGraf = function(canvas){
	Chart.defaults.global.tooltips.enabled = false;



    var zeros = [ 
        {x: 0, y: 0},
        {x: 6.2, y: 0},
        {x: 6.40, y: 0},
        {x: 6.6, y: 0},
        {x: 6.9, y: 0},
        {x: 7.1, y: 0},
        {x: 7.3, y: 0},
        {x: 14, y: 0},
    ]

    var fe = [ 
        {x: 0, y: 0},
        {x: 6.2, y: 0},
        {x: 6.40, y: 290},
        {x: 6.6, y: 0},
        {x: 6.9, y: 0},
        {x: 7.1, y: 110},
        {x: 7.3, y: 0},
        {x: 14, y: 0},
    ];

    var other = [ 
        {x: 0, y: 0},
        {x: 8.3, y: 0},
        {x: 8.5, y: 560},
        {x: 8.7, y: 0},
        {x: 8.9, y: 120},
        {x: 9.1, y: 0},
        {x: 25, y: 0},
        {x: 25.27, y: 400},
        {x: 25.5, y: 0},
        {x: 27.8, y: 0},
        {x: 28, y: 160},
        {x: 28.2, y: 0},
    ];
 
    var sampleChartData = {
            datasets: [{
                fill: false,
                lineTension: 0.01,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 0,
                pointHitRadius: 10,
                data: zeros
            }]
        }

    var testChartData = {
            datasets: [{
                label: '',
                fill: false,
                lineTension: 0.01,
                borderColor: "#910148",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBorderWidth: 2,
                pointRadius: 0,
                pointHitRadius: 10,
                data: fe
            },
            {
                label: '',
                fill: false,
                lineTension: 0.01,
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBorderWidth: 2,
                pointRadius: 0,
                pointHitRadius: 10,
                data: other
            }]
        }


    var mychart = canvas;
    var scatterChart = {}

    scatterChart.initSample = function() {
        document.l10n.formatValues('scene3-graph-x', 'scene3-graph-y').then(function(labels){

            scatterChart.chart = new Chart.Line(mychart, {
                //type: 'line',
                data : sampleChartData,
                options : {
                    legend: {
                        display:
                         false
                    },
                    tooltips : {
                    	enabled : false
                    },
                    responsive :true,
                    scales :  {
                        xAxes: [{
                            type: 'linear',
                            position: 'bottom',
                            ticks: {
                                min: 5,
                                max: 8,
                                stepSize: 0.2
                            },
                            scaleLabel: {
                                display: true,
                                fontSize: 20,
                                labelString: labels[0]
                            }
                        }],
                        yAxes: [{
                            type: 'linear',
                            ticks: {
                                min: 0,
                                max: 300
                            },
                            scaleLabel: {
                                display: true,
                                fontSize: 20,
                                labelString: labels[1]
                            }
                        }]
                    }
                }
            });
        })


    }

    scatterChart.initTest = function() {
        scatterChart.chart = new Chart.Line(mychart, {
            //type: 'line',
            data: testChartData,
            options : {
                animation:{
                    onComplete : function(){
                        var ctx2 = mychart.getContext("2d");
                        ctx2.textAlign = "center";
                        ctx2.textBaseline = "bottom";
                        ctx2.font="20px Arial";
                        ctx2.fillStyle = 'black';
                        var count = 0;
                        var datasetIndex = 0;
                        indexes = [[2,5],[2,4,7,10]];
                        var wordIndex = 0;
                        var words = ["Kα","Kβ"]
                        scatterChart.chart.data.datasets.forEach(function (dataset){
                            dataset._meta[0].data.forEach(function (pair) {
                                console.log(datasetIndex);
                                if($.inArray(count, indexes[datasetIndex]) > -1){
                                    console.log("HIT");
                                    ctx2.fillText(words[wordIndex % 2], pair._model.x, pair._model.y - 10);
                                    wordIndex += 1;
                                } else {
                                    $(this).addClass("wrong");
                                }
                                count += 1;
                            })
                            datasetIndex += 1;
                            count = 0;
                        })
                        
                    }
                },
                 legend: {
                    display: false
                 },
                responsive :true,
                 tooltips : {
                    	enabled : false
                    },
                scales :  {
                    xAxes: [{
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                            min: 6,
                            max: 29,
                            stepSize: 1
                        }
                    }],
                    yAxes: [{
                        type: 'linear',
                        ticks: {
                            min: 0,
                            max: 600
                        }
                    }]
                }
            }
        });

    }


    scatterChart.hit1 = function (){
        scatterChart.chart.data.datasets[0].data[2].y = 290;
        scatterChart.chart.update();
    }

    scatterChart.hit2 = function (){
        scatterChart.chart.data.datasets[0].data[5].y = 110;
        scatterChart.chart.update();
    }

    return scatterChart;

}