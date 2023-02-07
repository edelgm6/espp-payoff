class PriceHistoryChart extends EsppChart {

    priceHistoryDataset = {
        label: 'daily prices',
        data: [],
        borderWidth: 1,
        yAxisID: 'y',
        borderColor: this.fourthColor,
        backgroundColor: this.fourthColor
    }

    dailyPercentChangesDataset = {
        label: 'daily percent change',
        data: [],
        borderWidth: 1,
        yAxisID: 'y1',
        borderColor: this.fifthColor,
        backgroundColor: this.fifthColor
      }

    constructor(canvasId) {
        super();
        this.canvas = document.getElementById(canvasId);
        this.attachChart();
    }

    updatePriceData(dates, priceHistory, dailyPercentChanges) {
        this.chart.data.labels = dates;
        this.priceHistoryDataset.data = priceHistory;
        this.dailyPercentChangesDataset.data = dailyPercentChanges;
        this.updateChart();
    }

    attachChart() {
        this.chart = new Chart(this.canvas, {
            type: 'line',
            data: {
                labels: this.dates,
                datasets: [this.priceHistoryDataset, this.dailyPercentChangesDataset]
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                },
            },
            options: {
                response: true,
                plugins: {
                    tooltip: {
                            callbacks: {
                                label: function(context) {
                                    if (context.datasetIndex == 1) {
                                        return (context.raw * 100).toFixed(2) + '%';
                                    }
                                    return '$' + context.raw.toLocaleString();
                                }
                            }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Stock price'
                        },
                        ticks: {
                            callback: function(value,index,ticks) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    },
                    y1: {
                        title: {
                            display: true,
                            text: 'Daily percent change'
                        },
                        grid: {
                            display: false
                        },
                        position: 'right',
                        ticks: {
                            callback: function(value,index,ticks) {
                                return (value * 100).toFixed(2) + '%';
                            }
                        },
                        min: -.2,
                        max: .2
                    }
                }
            }
        });
    }
}