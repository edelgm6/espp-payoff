class ValueChart extends EsppChart {

    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.attachChart();
    }

    toggleVolatility(volatility) {
        const valueSeriesMap = {
            10: [
                [4200,-2027,530,null],
                [null,null,null,2703]
            ],
            25: [
                [4200,-2026,1141,null],
                [null,null,null,3314]
            ],
            50: [
                [4200,-2039,2159,null],
                [null,null,null,4320]
            ],
            75: [
                [4200,-2107,3163,null],
                [null,null,null,5255]
            ],
            100: [
                [4200,-2221,4144,null],
                [null,null,null,6123]
            ],
        }

        this.chart.data.datasets[0].data = valueSeriesMap[volatility][0];
        this.chart.data.datasets[1].data = valueSeriesMap[volatility][1];
        this.updateChart();
    }

    attachChart() {
        this.chart = new Chart(this.canvas, {
            type: 'bar',
            data: {
                labels: ['Buy shares','Sell call options', 'Buy call options', 'Total'],
                datasets: [
                    {
                        label: 'Value',
                        data: [4200,-2039,2159,null],
                        borderColor: this.primaryGray,
                        backgroundColor: this.primaryGray
                    },
                    {
                        label: 'Value',
                        data: [null,null,null,4320],
                        borderColor: this.fourthColor,
                        backgroundColor: this.fourthColor
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
        })
    }
}