class ValueCompareChart {

    constructor(comparisonEsppList,calculatedEspp,canvas='value-compare') {
        // this.comparisonEsppList = comparisonEsppList;
        // this.calculatedEspp = calculatedEspp;

        let comparisonValues = [];
        let customValue = [];
        this.labels = [];
        let comparisonVolatilities = [];
        let customVolatility = [];
        for (let index in comparisonEsppList) {
            let espp = comparisonEsppList[index];
            console.log(espp);
            comparisonValues.push(espp.value);
            comparisonVolatilities.push(espp.volatility);
            customValue.push(null);
            customVolatility.push(null);
            this.labels.push(espp.label);
        };
        comparisonEsppList.push(null);
        this.labels.push('Custom');
        customValue.push(calculatedEspp.value);
        customVolatility.push(calculatedEspp.volatility);

        this.comparisonDataset = {
            label: 'Value',
            data: comparisonValues,
            borderColor: primaryGray,
            backgroundColor: primaryGray,
            volatilities: comparisonVolatilities
        }

        this.customDataset = {
            label: 'Value',
            data: customValue,
            borderColor: fourthColor,
            backgroundColor: fourthColor,
            volatilities: customVolatility
        }

        this.canvas = canvas;
        this.attachChart();
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
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                console.log(context);
                                let label = ['Value: $' + context.parsed['y']];
                                label.push('Price: $28.00');
                                label.push('Volatility: ' + context.dataset.volatilities[context.dataIndex]);
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