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
    hideLegend=true,
    undefined,
    addHighlightDataset=true
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

var valueCompareChart = new ValueCompareChart(
    comparisonEsppList = [
        {
            value: 1000,
            label: 'Tesla',
            volatility: '10',
            price: '100.15'
        },
        {
            value: 2000,
            label: 'Apple',
            volatility: '20',
            price: '200.10'
        }
    ],
    calculatedEspp = {
        value: 3109.96,
        label: 'Custom',
        volatility: '20',
        price: '28.00'
    }
)

var valueChart = new ValueChart('value-chart');
var volatilityChart = new VolatilityChart('volatility-chart');
var stockChart = new PriceHistoryChart(canvasId='price-history');