const volatilityCanvas = document.getElementById('volatility-chart');
volatilityChart = new Chart(volatilityCanvas, {
    type: 'line',
    data: {
        labels: [0.0, 0.0808, 0.1616, 0.2424, 0.3232, 0.404, 0.4848, 0.5657, 0.6465, 0.7273, 0.8081, 0.8889, 0.9697, 1.0505, 1.1313, 1.2121, 1.2929, 1.3737, 1.4545, 1.5354, 1.6162, 1.697, 1.7778, 1.8586, 1.9394, 2.0202, 2.101, 2.1818, 2.2626, 2.3434, 2.4242, 2.5051, 2.5859, 2.6667, 2.7475, 2.8283, 2.9091, 2.9899, 3.0707, 3.1515, 3.2323, 3.3131, 3.3939, 3.4747, 3.5556, 3.6364, 3.7172, 3.798, 3.8788, 3.9596, 4.0404, 4.1212, 4.202, 4.2828, 4.3636, 4.4444, 4.5253, 4.6061, 4.6869, 4.7677, 4.8485, 4.9293, 5.0101, 5.0909, 5.1717, 5.2525, 5.3333, 5.4141, 5.4949, 5.5758, 5.6566, 5.7374, 5.8182, 5.899, 5.9798, 6.0606, 6.1414, 6.2222, 6.303, 6.3838, 6.4646, 6.5455, 6.6263, 6.7071, 6.7879, 6.8687, 6.9495, 7.0303, 7.1111, 7.1919, 7.2727, 7.3535, 7.4343, 7.5152, 7.596, 7.6768, 7.7576, 7.8384, 7.9192, 8.0],
        datasets: [
            {
                label: 'distribution',
                data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0001, 0.0001, 0.0002, 0.0002, 0.0004, 0.0006, 0.0009, 0.0013, 0.0019, 0.0028, 0.004, 0.0058, 0.0081, 0.0112, 0.0153, 0.0207, 0.0276, 0.0363, 0.0471, 0.0604, 0.0764, 0.0954, 0.1175, 0.1429, 0.1716, 0.2034, 0.2379, 0.2746, 0.313, 0.352, 0.3908, 0.4282, 0.4631, 0.4943, 0.5208, 0.5416, 0.556, 0.5633, 0.5633, 0.556, 0.5416, 0.5208, 0.4943, 0.4631, 0.4282, 0.3908, 0.352, 0.313, 0.2746, 0.2379, 0.2034, 0.1716, 0.1429, 0.1175, 0.0954, 0.0764, 0.0604, 0.0471, 0.0363, 0.0276, 0.0207, 0.0153, 0.0112, 0.0081, 0.0058, 0.004, 0.0028, 0.0019, 0.0013, 0.0009, 0.0006, 0.0004, 0.0002, 0.0002, 0.0001, 0.0001, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
                borderWidth: 1,
                yAxisID: 'y',
            },
            {
                label: 'payoff',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.0404, 0.1212, 0.202, 0.2828, 0.3636, 0.4444, 0.5253, 0.6061, 0.6869, 0.7677, 0.8485, 0.9293, 1.0101, 1.0909, 1.1717, 1.2525, 1.3333, 1.4141, 1.4949, 1.5758, 1.6566, 1.7374, 1.8182, 1.899, 1.9798, 2.0606, 2.1414, 2.2222, 2.303, 2.3838, 2.4646, 2.5455, 2.6263, 2.7071, 2.7879, 2.8687, 2.9495, 3.0303, 3.1111, 3.1919, 3.2727, 3.3535, 3.4343, 3.5152, 3.596, 3.6768, 3.7576, 3.8384, 3.9192, 4.0],
                borderWidth: 1,
                yAxisID: 'y1',
            },
        ]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Stock price'
                },
                type: 'linear',
                grid: {
                    display: false
                },
                ticks: {
                    callback: function(value,index,ticks) {
                        return '$' + value.toFixed(2).toLocaleString();
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Probability'
                },
                min: 0,
                max: 1.4,
                stepSize: .2
            },
            y1: {
                title: {
                    display: true,
                    text: 'Payoff'
                },
                grid: {
                    display: false
                },
                position: 'right',
                ticks: {
                    callback: function(value,index,ticks) {
                    return '$' + value.toFixed(2).toLocaleString();
                    }
                }
            }
        }
    }
});