const payoffs_chart_html = document.getElementById('payoff-chart');
payoffs_chart = new Chart(payoffs_chart_html, {
    type: 'line',
    data: {
        labels: example_labels,
        datasets: [
            {
                label: 'payoff',
                data: [0, 150.0, 300.0, 450.0, 600.0, 750.0, 900.0, 1050.0, 1200.0, 1350.000000000001, 1500.0, 1650.0, 1800.0, 1950.0000000000018, 2100.0, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411784, 2205.8823529411748, 2205.8823529411784, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411766, 2731.09243697479, 3256.3025210084033, 3781.5126050420167, 4306.72268907563, 4831.9327731092435, 5357.142857142857],
                borderWidth: 1
            }
        ]
    },
    options: base_options_no_legend
});

const portfolio_chart_html = document.getElementById('portfolio-chart');
replicating_portfolio_chart = new Chart(portfolio_chart_html, {
    type: 'line',
    data: {
        labels: example_labels,
        datasets: [buy_shares_dataset, sell_calls_dataset, buy_calls_dataset]
    },
    options: base_options
});

const value_chart_html = document.getElementById('value-chart')
value_chart = new Chart(value_chart_html, {
    type: 'bar',
    data: {
        labels: ['Buy shares','Sell call options', 'Buy call options', 'Total'],
        datasets: [
            {
                label: 'Value',
                data: [4200, -2026.95, 936.92, 3109.97],
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
                }
            },
            y: {
                stacked: true
            }
        }
    }
});