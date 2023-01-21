class PayoffChart {
    primaryColor = '#251605'
    secondaryColor = '#C57B57'
    tertiaryColor = '#F1AB86'
    fourthColor = '#F7DBA7'
    fifthColor = '#9CAFB7'
    
    highlightColor = '#FDF002'
    primaryGray = '#B4B7B7'
    secondaryGray = '#999E9E'

    buySharesDataset = {
        label: 'buy 150 shares',
        data: [0, 150.0, 300.0, 450.0, 600.0, 750.0, 900.0, 1050.0, 1200.0, 1350.0, 1500.0, 1650.0, 1800.0, 1950.0, 2100.0, 2250.0,2400.0,2550.0,2700,2850,3000,3150,3300,3450,3600,3750,3900,4050,4200,4350,4500,4650,4800,4950,5100],
        borderWidth: 1,
        borderColor: secondary_color,
        backgroundColor: secondary_color
    }
    
    sellCallsDataset = {
        label: 'sell 150 calls',
        data: [-0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -44.11764705882337, -194.11764705882337, -344.11764705882337, -494.11764705882337, -644.1176470588234, -794.1176470588234, -944.1176470588234, -1094.1176470588234, -1244.1176470588234, -1394.1176470588234, -1544.1176470588234, -1694.1176470588234, -1844.1176470588234, -1994.1176470588234, -2144.1176470588234, -2294.1176470588234, -2444.1176470588234, -2594.1176470588234, -2744.1176470588234, -2894.1176470588234],
        borderWidth: 1,
        borderColor: tertiary_color,
        backgroundColor: tertiary_color
    }
    
    buyCallsDataset = {
        label: 'buy 525 calls',
        data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 525.2100840336134, 1050.4201680672268, 1575.6302521008402, 2100.8403361344535, 2626.050420168067, 3151.2605042016803],
        borderWidth: 1,
        borderColor: fourth_color,
        backgroundColor: fourth_color
    }
    
    payoffDataset = {
        label: 'payoff',
        data: buy_shares_dataset.data.map((val, index) => val + sell_calls_dataset.data[index] + buy_calls_dataset.data[index]),
        borderWidth: 1,
        borderColor: primary_color,
        backgroundColor: primary_color
    }

    prices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]

    options = {
        plugins: {
            legend: {
                display: true
            }
        },
        maintainAspectRatio: false,
        scales: {
            x: {
            title: {
                display: true,
                text: 'Stock price'
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
    
    constructor(includePayoff, includeBuyShares, includeSellCalls, includeBuyCalls, canvasId, hideLegend=false) {
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
            this.options['plugins']['legend']['display'] = false;
        }
        
        const canvas = document.getElementById(canvasId);
        this.chart = new Chart(canvas, {
          type: 'line',
          data: {
            labels: this.prices,
            datasets: this.datasets
          },
          options: this.options
        });
    }

    updateChart() {
        this.chart.update();
    }

    updateDatasetData(prices=null, payoffData=null, buySharesData=null, sellCallsData=null, buyCallsData=null) {
        
        this.prices = prices || this.prices;
        this.chart.data.labels = this.prices;

        this.payoffDataset.data = payoffData || this.payoffDataset.data;
        this.buySharesDataset.data = buySharesData || this.buySharesDataset.data;
        this.sellCallsDataset.data = sellCallsData || this.sellCallsDataset.data;
        this.buyCallsDataset.data = buyCallsData || this.buyCallsDataset.data;
        
        this.updateChart();
    }

    toggleDatasetHidden(dataset) {
        let datasets = {
            'buyStock': this.buySharesDataset,
            'sellCalls': this.sellCallsDataset,
            'buyCalls': this.buyCallsDataset
        }

        const toggledSeries = datasets[dataset];
        toggledSeries['hidden'] = !toggledSeries['hidden'];

        let allSeriesHidden = true;
        for (let key in datasets) {
            if (!datasets[key].hidden) {
                allSeriesHidden = false;
                break;
            }
        }
        
        //Need this top function to correct for slight variances from zero when all are subtracted out
        var payoffDatasetData = this.payoffDataset.data;
        if (allSeriesHidden) {
            payoffDatasetData = payoffDatasetData.map((val, index) => 0);
        } else if (toggledSeries['hidden']) {
            console.log('hide');
            payoffDatasetData = payoffDatasetData.map((val, index) => val - toggledSeries.data[index]);
        } else {
            console.log('unhide');
            payoffDatasetData = payoffDatasetData.map((val, index) => val + toggledSeries.data[index]);
        };

        this.payoffDataset.data = payoffDatasetData;    
        this.updateChart();
    }
}