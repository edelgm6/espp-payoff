var calculatedPayoffsChart = new PayoffChart(
    includePayoff=true, 
    includeBuyShares=true, 
    includeSellCalls=true, 
    includeBuyCalls=true, 
    canvasId='payoff-chart',
    undefined,
    undefined
)

const staticPayoffChart = new PayoffChart(
    includePayoff=true, 
    includeBuyShares=false, 
    includeSellCalls=false, 
    includeBuyCalls=false, 
    canvasId='payoff-example',
    hideLegend=true 
)

const buyStockChart = new PayoffChart(
    includePayoff=true, 
    includeBuyShares=true, 
    includeSellCalls=false, 
    includeBuyCalls=false, 
    canvasId='buy-stock-example'
)

const sellCallsChart = new PayoffChart(
    includePayoff=true, 
    includeBuyShares=false, 
    includeSellCalls=true, 
    includeBuyCalls=false, 
    canvasId='sell-calls-example'
)

var toggleChart = new PayoffChart(
    includePayoff=true, 
    includeBuyShares=true, 
    includeSellCalls=true, 
    includeBuyCalls=true, 
    canvasId='toggle-chart'
)

var buyCallsChart = new PayoffChart(
    includePayoff=true, 
    includeBuyShares=false, 
    includeSellCalls=false, 
    includeBuyCalls=true, 
    canvasId='buy-calls-example'
)

var sharesCapChart = new PayoffChart(
    includePayoff=true, 
    includeBuyShares=false, 
    includeSellCalls=false, 
    includeBuyCalls=false, 
    canvasId='shares-cap-example',
    undefined,
    attachChartOnCreate=false
  )
sharesCapChart.highLightPayoffSegment('buyStock', 'Shares cap');
sharesCapChart.attachChart();

var flatPayoffChart = new PayoffChart(
    includePayoff=true, 
    includeBuyShares=false, 
    includeSellCalls=false, 
    includeBuyCalls=false, 
    canvasId='middle-example',
    undefined,
    attachChartOnCreate=false
  )
flatPayoffChart.highLightPayoffSegment('sellCalls', 'Flat payoff');
flatPayoffChart.attachChart();

var upsidePayoffChart = new PayoffChart(
    includePayoff=true, 
    includeBuyShares=false, 
    includeSellCalls=false, 
    includeBuyCalls=false, 
    canvasId='upside-example',
    undefined,
    attachChartOnCreate=false
  )
upsidePayoffChart.highLightPayoffSegment('buyCalls', 'Upside outcome');
upsidePayoffChart.attachChart();

const valueCompareCanvas = document.getElementById('value-compare')
valueCompareChart = new Chart(valueCompareCanvas, {
    type: 'bar',
    data: {
        labels: ['Apple','Tesla','ExxonMobil','P&G','Custom'],
        datasets: [
            {
                label: 'Value',
                data: [3758, 5015, 3714, 3196, null],
                borderColor: primaryGray,
                backgroundColor: primaryGray
            },
            {
                label: 'Value',
                data: [null,null,null,null,3109],
                borderColor: fourthColor,
                backgroundColor: fourthColor
            },
        ]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false
                }
            },
            y: {
                stacked: true,
                ticks: {
                    callback: function(value,index,ticks) {
                        return '$' + value.toLocaleString();
                    }
                }
            }
        }
    }
});

const valueChartCanvas = document.getElementById('value-chart')
valueChart = new Chart(valueChartCanvas, {
    type: 'bar',
    data: {
        labels: ['Buy shares','Sell call options', 'Buy call options', 'Total'],
        datasets: [
            {
                label: 'Value',
                data: [4200,-2039,2159,null],
                borderColor: primaryGray,
                backgroundColor: primaryGray
            },
            {
                label: 'Value',
                data: [null,null,null,4320],
                borderColor: fourthColor,
                backgroundColor: fourthColor
            },
        ]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        },
        indexAxis: 'y',
        scales: {
            x: {
                stacked: true,
                ticks: {
                    callback: function(value,index,ticks) {
                        return '$' + value.toLocaleString();
                    }
                },
                min: -3000,
                max: 7000,
                stepSize: 1000
            },
            y: {
                stacked: true,
                grid: {
                    display: false
                }
            }
        }
    }
});