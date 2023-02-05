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
        this.labels.push('Custom');
        customValue.push(calculatedEspp.value);
        customVolatility.push(calculatedEspp.volatility);
        customPrice.push(calculatedEspp.price);

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

        this.attachChart();
    }

    updateCustomData(calculatedEspp) {
        const dataLength = this.customDataset.data.length;
        this.customDataset.data[dataLength - 1] = calculatedEspp.value;
        this.customDataset.volatilities[dataLength - 1] = calculatedEspp.volatility;
        this.customDataset.prices[dataLength - 1] = calculatedEspp.price;
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
                            label: function(context) {
                                let label = ['Value: $' + context.parsed['y']];
                                label.push('Price: $' + context.dataset.prices[context.dataIndex]);
                                label.push('Volatility: ' + context.dataset.volatilities[context.dataIndex] + '%');
                                return label;
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