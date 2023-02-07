var calculatedPayoffsChart = new PayoffChart(
    includePayoff=true,
    includeBuyShares=true,
    includeSellCalls=true,
    includeBuyCalls=true,
    canvasId='payoff-chart',
    hideLegend=false,
    attachChartOnCreate=true,
    addHighlightDataset=false,
    title='ESPP payoff and replicating portfolio'
)

const staticPayoffChart = new PayoffChart(
    includePayoff=true,
    includeBuyShares=false,
    includeSellCalls=false,
    includeBuyCalls=false,
    canvasId='payoff-example',
    hideLegend=true,
    undefined,
    addHighlightDataset=true,
    title='ESPP payoff'
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
    canvasId='toggle-chart',
    hideLegend=false,
    attachChartOnCreate=true,
    addHighlightDataset=false
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
            value: 3926,
            label: [
                'price: $50.00',
                'volatility: 40%',
                'shares cap: 2000',
            ]
        },
        {
            value: 4059,
            label: [
                'price: $15.00',
                'volatility: 50%',
                'shares cap: 1000',
            ]
        },
        {
            value: 2506,
            label: [
                'price: $100.00',
                'volatility: 5%',
                'shares cap: 500',
            ]
        }
    ],
    calculatedEspp = {
        value: 3109,
        label: [
            'price: $28.00',
            'volatility: 20.0%',
            'shares cap: 1000',
        ]
    }
)

var valueChart = new ValueChart('value-chart');
var volatilityChart = new VolatilityChart('volatility-chart');
var stockChart = new PriceHistoryChart(canvasId='price-history');