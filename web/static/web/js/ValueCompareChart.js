class ValueCompareChart extends EsppChart {

    constructor(comparisonEsppList,calculatedEspp,canvas='value-compare') {
        super();
        let comparisonValues = [];
        let customValue = [];
        this.labels = [];
        let comparisonVolatilities = [];
        let customVolatility = [];
        let comparisonPrices = [];
        let customPrice = [];
        for (let index in comparisonEsppList) {
            let espp = comparisonEsppList[index];
            comparisonValues.push(espp.value);
            comparisonVolatilities.push(espp.volatility);
            comparisonPrices.push(espp.price);
            customValue.push(null);
            customVolatility.push(null);
            customPrice.push(null);
            this.labels.push(espp.label);
        };
        comparisonEsppList.push(null);
        this.labels.push(calculatedEspp.label);
        customValue.push(calculatedEspp.value);

        this.comparisonDataset = {
            label: 'Value',
            data: comparisonValues,
            borderColor: this.primaryGray,
            backgroundColor: this.primaryGray,
            volatilities: comparisonVolatilities,
            prices: comparisonPrices
        }

        this.customDataset = {
            label: 'Value',
            data: customValue,
            borderColor: this.fourthColor,
            backgroundColor: this.fourthColor,
            volatilities: customVolatility,
            prices: customPrice
        }

        this.canvas = canvas;
        console.log(this.comparisonDataset.data);
        this.attachChart();
    }

    updateCustomData(calculatedEspp) {

        console.log(this.comparisonDataset.data);

        const customDataLength = this.customDataset.data.length;
        const comparisonDataLength = this.comparisonDataset.data.length;
        const labelsLength = this.labels.length;
        //Bump current custom to next over
        this.comparisonDataset.data[comparisonDataLength - 2] = this.comparisonDataset.data[comparisonDataLength - 1]
        this.labels[labelsLength - 3] = this.labels[labelsLength - 2]
        this.comparisonDataset.data[comparisonDataLength - 1] = this.customDataset.data[customDataLength - 1]
        this.labels[labelsLength - 2] = this.labels[labelsLength - 1]

        this.customDataset.data[customDataLength - 1] = calculatedEspp.value;
        this.labels[labelsLength - 1] = [
            'price: $' + Number(calculatedEspp.price).toFixed(2).toLocaleString(),
            'volatility: ' + calculatedEspp.volatility + '%',
            'shares cap: ' + calculatedEspp.shares_cap,
        ]
        this.updateChart();
    }

    attachChart() {
        this.chart = new Chart(this.canvas, {
            type: 'bar',
            data: {
                labels: this.labels,
                datasets: [this.comparisonDataset,this.customDataset]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'ESPP value comparison'
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return null;
                            },
                            label: function(context) {
                                return 'Value: $' + context.parsed['y']
                            }
                        }
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
    };
}