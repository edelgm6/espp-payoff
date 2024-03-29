class PayoffChart extends EsppChart {

    buySharesDataset = {
        label: 'buy 150 shares',
        data: [0, 150.0, 300.0, 450.0, 600.0, 750.0, 900.0, 1050.0, 1200.0, 1350.0, 1500.0, 1650.0, 1800.0, 1950.0, 2100.0, 2250.0,2400.0,2550.0,2700,2850,3000,3150,3300,3450,3600,3750,3900,4050,4200,4350,4500,4650,4800,4950,5100],
        borderWidth: 1,
        borderColor: this.secondaryColor,
        backgroundColor: this.secondaryColor
    }

    sellCallsDataset = {
        label: 'sell 150 calls',
        data: [-0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -44.11, -194.11, -344.11, -494.11, -644.11, -794.11, -944.11, -1094.11, -1244.11, -1394.11, -1544.11, -1694.11, -1844.11, -1994.11, -2144.11, -2294.11, -2444.11, -2594.11, -2744.11, -2894.11],
        borderWidth: 1,
        borderColor: this.tertiaryColor,
        backgroundColor: this.tertiaryColor
    }

    buyCallsDataset = {
        label: 'buy 525 calls',
        data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 525.21, 1050.42, 1575.63, 2100.84, 2626.05, 3151.26],
        borderWidth: 1,
        borderColor: this.fourthColor,
        backgroundColor: this.fourthColor
    }

    payoffDataset = {
        label: 'payoff',
        data: this.buySharesDataset.data.map((val, index) => val + this.sellCallsDataset.data[index] + this.buyCallsDataset.data[index]),
        borderWidth: 1,
        borderColor: this.primaryColor,
        backgroundColor: this.primaryColor
    }

    highlightDataDataset = {
        label: 'highlight',
        data: [null,null,null,null,null,null,null,null,1200,null,null,null,null,null,null,2205.89,null,null,null,null,null,2205.89,null,null,null,null,null,null,2205.89,null,null,null,4306.73,null,null],
        borderWidth: 4,
        borderColor: this.highlightColor,
        backgroundColor: this.highlightColor
    }

    datasetSelector = {
        'buyStock': this.buySharesDataset,
        'sellCalls': this.sellCallsDataset,
        'buyCalls': this.buyCallsDataset
    }

    payoffSegments = {
        'buyStock': [0,15],
        'sellCalls': [15,27],
        'buyCalls': [28,37]
    }

    prices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]

    highlightTooltipConfig = {
        8: {
            title: 'Shares cap section',
            beforeLabel: [
                'Here, the payoff is limited by the 1000 shares cap — i.e.,',
                'irrespective of the stock price you buy 1000 shares. Here, the ',
                'payoff increases by $150 (i.e., 15% * 1000) for each dollar ',
                'increase in the stock price. At $1, you buy 1000 shares for ',
                'a 15% discount ($0.85) so the payoff is $150 ($1000 - $850). ',
                'At $2, you buy 1000 shares for a 15% discount ($1.70) so ',
                'the payoff is $300 ($2000 - $1700) and so forth.'
            ]
        },
        15: {
            title: 'Shares cap to value cap transition',
            beforeLabel: [
                'Here, the payoff transitions from being limited by the ',
                'shares cap to being limited by the dollar cap (i.e., $12,500). ',
                'For a 1000 shares cap, this will occur at about $14.70 ',
                '(i.e., the price where the 15% discount will equal $12.50).'
            ]
        },
        21: {
            title: 'Ending price below starting price',
            beforeLabel: [
                'The flat payoff represents the end of period stock prices ',
                'between the shares cap transition and the beginning of period ',
                'stock price. Here you can spend the full $12,500 and the payoff ',
                'is ~$2200 (e.g., if the stock price is $20.00, the purchase ',
                'price is $17.00. $12,500 / $17.00 == ~735 shares. 735 * $20.00 == ',
                '$14,700. $14,700 - $12,500 == $2200).'
            ]
        },
        28: {
            title: 'Starting price',
            beforeLabel: [
                'This kink represents the price of the stock at the ',
                'beginning of the purchase period. Below this price, ',
                'the purchase price is the end of period stock price ',
                'less the discount. Beyond it, the purchase price is',
                'the beginning of period stock price less the discount.'
            ]
        },
        32: {
            title: [
                'End of period price greater than beginning of ',
                'period price'
            ],
            beforeLabel: [
                'Now we are realy making money. In this segment ',
                'the purchase price is fixed at 85% of the star-',
                'ting price. Each dollar increase in the stock ',
                'price increases the payoff by $525 (i.e. $12,500 ',
                ' / (85% * $28.00) == 525 shares).'
            ]
        }
    }

    highlightTooltip = {
        displayColors: false,
        filter: function(context) {
            return context.datasetIndex === 0;
        },
        callbacks: {
            title: (context) => {
                try {
                    var highlightIndex = context[0].dataIndex;
                } catch(err) {
                    return;
                }
                return this.highlightTooltipConfig[highlightIndex].title;
            },
            beforeLabel: (context) => {
                var highlightIndex = context.dataIndex;
                return this.highlightTooltipConfig[highlightIndex].beforeLabel;
            },
            label: function(context) {
                return '$' + context.raw.toFixed(2).toLocaleString();
            }
        }
    }

    defaultTooltip = {
        callbacks: {
            title: function(context) {
                try {
                    var title = context[0].label;
                } catch(context) {
                    var title = context.label;
                }
                return '$' + title + '.00';
            },
            label: function(context) {
                return '$' + context.raw.toFixed(2).toLocaleString();
            }
        }
    }

    options = {
        responsive: true,
        plugins: {
            legend: {
                display: true
            },
            tooltip: this.defaultTooltip,
            title: {
                display: false,
                text: null
            }
        },
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'End of period stock price'
                },
                ticks: {
                    callback: function(value,index,ticks) {
                        return '$' + value.toFixed(2).toLocaleString();
                    }
                },
                grid: {
                    display: false
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Payoff'
                },
                ticks: {
                    callback: function(value,index,ticks) {
                        return '$' + value.toLocaleString();
                    }
                }
            }
        }
    }

    constructor(
        includePayoff,
        includeBuyShares,
        includeSellCalls,
        includeBuyCalls,
        canvasId,
        hideLegend=false,
        attachChartOnCreate=true,
        addHighlightDataset=false,
        title=null) {

        super();
        this.datasets = [];
        if (includePayoff) {
            this.datasets.push(this.payoffDataset);
        }
        if (includeBuyShares) {
            this.datasets.push(this.buySharesDataset);
        }
        if (includeSellCalls) {
            this.datasets.push(this.sellCallsDataset);
        }
        if (includeBuyCalls) {
            this.datasets.push(this.buyCallsDataset);
        }
        if (hideLegend) {
            this.options.plugins.legend.display = false;
        }
        if (addHighlightDataset) {
            this.datasets.unshift(this.highlightDataDataset);
            this.options.plugins.tooltip = this.highlightTooltip;
        }

        this.title = title;
        this.canvas = document.getElementById(canvasId);
        this.options.plugins.title.display = (this.title === null) ? false : true;
        this.options.plugins.title.text = this.title;

        this.chart = null;

        if (attachChartOnCreate) {
            this.attachChart();
        }
    }

    attachChart() {
        this.chart = new Chart(this.canvas, {
            type: 'line',
            data: {
              labels: this.prices,
              datasets: this.datasets
            },
            options: this.options
          });
    }

    highLightPayoffSegment(segment, name) {
        // Build index of values to excise from payoff dataset
        const segmentBoundaries = this.payoffSegments[segment];
        let highlightIndices = []
        for(let i = segmentBoundaries[0]; i <= segmentBoundaries[1]; i++) {
            highlightIndices.push(i);
        }

        // Loop through payoff data — if i is in the highlight indices, set to null
        // and put value into a new dataset, else leave it
        let highlightData = []
        for(let i = 0; i <= this.payoffDataset.data.length; i++) {
            if (highlightIndices.includes(i)) {
                highlightData.push(this.payoffDataset.data[i]);
                this.payoffDataset.data[i] = null;
            } else {
                highlightData.push(null);
            }
        }

        const highlightDataset = {
            label: name,
            data: highlightData,
            borderWidth: 1,
            borderColor: this.fourthColor,
            backgroundColor: this.fourthColor,
        }
        this.datasets.push(highlightDataset);
    }

    updateDatasetData(prices=null, payoffData=null, buySharesData=null, sellCallsData=null, buyCallsData=null) {

        this.prices = prices || this.prices;
        this.chart.data.labels = this.prices;

        this.payoffDataset.data = payoffData || this.payoffDataset.data;
        this.buySharesDataset.data = buySharesData || this.buySharesDataset.data;
        this.sellCallsDataset.data = sellCallsData || this.sellCallsDataset.data;
        this.buyCallsDataset.data = buyCallsData || this.buyCallsDataset.data;

        const buySharesCount = this.payoffDataset.data[1] - this.payoffDataset.data[0]
        this.buySharesDataset.label = 'buy ' + buySharesCount.toFixed(0) + ' shares';
        this.sellCallsDataset.label = 'sell ' + buySharesCount.toFixed(0) + ' calls';

        const buyCallsCount = this.buyCallsDataset.data[this.buyCallsDataset.data.length - 1] - this.buyCallsDataset.data[this.buyCallsDataset.data.length - 2]
        this.buyCallsDataset.label = 'buy ' + buyCallsCount.toFixed(0) + ' calls';

        this.updateChart();
    }

    toggleDatasetHidden(dataset) {

        const toggledSeries = this.datasetSelector[dataset];
        toggledSeries['hidden'] = !toggledSeries['hidden'];

        let allSeriesHidden = true;
        for (let key in this.datasetSelector) {
            if (!this.datasetSelector[key].hidden) {
                allSeriesHidden = false;
                break;
            }
        }

        //Need this top function to correct for slight variances from zero when all are subtracted out
        var payoffDatasetData = this.payoffDataset.data;
        if (allSeriesHidden) {
            payoffDatasetData = payoffDatasetData.map((val, index) => 0);
        } else if (toggledSeries['hidden']) {
            payoffDatasetData = payoffDatasetData.map((val, index) => val - toggledSeries.data[index]);
        } else {
            payoffDatasetData = payoffDatasetData.map((val, index) => val + toggledSeries.data[index]);
        };

        this.payoffDataset.data = payoffDatasetData;
        this.updateChart();
    }
}