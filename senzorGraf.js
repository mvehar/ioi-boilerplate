var senzorGraf = function(){
    var zeros = [ 
        {x: 0, y: 0},
        {x: 3, y: 0},
        {x: 19, y: 0},
        {x: 20, y: 0},
        {x: 23, y: 0},
        {x: 25, y: 0}
    ]
    var points = [{x: 0, y: 0},
                        {x: 3, y: 0},
                        {x: 19, y: 100},
                        {x: 20, y: 500},
                        {x: 23,y: 0},
                        {x: 25, y: 0}]

    var mychart = document.getElementById("senzorCanvas");
    var chartData = {
            datasets: [{
                label: 'Senzor',
                fill: false,
                lineTension: 0.1,
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
                pointRadius: 3,
                pointHitRadius: 10,
                data: zeros
            }]
        }
    var scatterChart = new Chart.Line(mychart, {
        //type: 'line',
        data: chartData,
        options: {
            responsive:true,
            //maintainAspecRatio: true,
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                }],
                yAxes: [{
                    type: 'linear',
                    ticks: {
                        max: 1500,
                        min: 0,
                    }
                }]
               
            }
        }
    });

    scatterChart.hit = function hit(){
        scatterChart.data.datasets[0].data = points;
        scatterChart.update();
    }

    return scatterChart;

}