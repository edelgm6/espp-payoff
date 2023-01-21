var calculatedPayoffsChart = new PayoffChart(
    includePayoff=true, 
    includeBuyShares=false, 
    includeSellCalls=false, 
    includeBuyCalls=false, 
    canvasId='payoff-chart',
    hideLegend=true
)

var calculatedPortfolioChart = new PayoffChart(
    includePayoff=false, 
    includeBuyShares=true, 
    includeSellCalls=true, 
    includeBuyCalls=true, 
    canvasId='portfolio-chart'
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

var buyCallsChart = new PayoffChart(
    includePayoff=true, 
    includeBuyShares=false, 
    includeSellCalls=false, 
    includeBuyCalls=true, 
    canvasId='buy-calls-example'
)

const value_chart_html = document.getElementById('value-chart')
value_chart = new Chart(value_chart_html, {
    type: 'bar',
    data: {
        labels: ['Buy shares','Sell call options', 'Buy call options', 'Total'],
        datasets: [
            {
                label: 'Value',
                data: [4200, -2026.95, 936.92, 3109.97],
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
                }
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