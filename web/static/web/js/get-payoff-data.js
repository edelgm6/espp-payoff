var is_first_payoffs_update = true;
var is_first_portfolio_update = true;
var is_first_value_update = true;
var payoffs_chart = {};
var replicating_portfolio_chart = {};

function getPayoffData(event) {
    event.preventDefault();

    const params = new URLSearchParams();
    const decimal_volatility = (parseFloat(volatilityField.value) / 100.0).toString();

    params.set('ticker', tickerField.value);
    params.set('price', priceField.value);
    params.set('volatility', decimal_volatility);
    const queryString = params.toString();

    fetch(`/payoffs?${queryString}`)
    .then(response => response.json())
    .then(data => {
        const prices = data.prices;
        const payoffs = data.payoffs;

        if (is_first_payoffs_update) {
            const ctx = document.getElementById('payoff-chart');
            payoffs_chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: prices,
                datasets: [
                    {
                        label: 'payoff',
                        data: payoffs,
                        borderWidth: 1
                    }
                ]
            },
            options: base_options
            });
            is_first_payoffs_update = false;
        } else {
            payoffs_chart['data']['labels'] = prices;
            payoffs_chart['data']['datasets'][0]['data'] = payoffs;
            payoffs_chart.update();
        }
        
    });

    fetch(`/replicating-portfolio-series?${queryString}`)
    .then(response => response.json())
    .then(data => {
        const prices = data.prices;
        const shares_series = data.shares_series;
        const sell_call_options_series = data.sell_call_options_series;
        const buy_call_options_series = data.buy_call_options_series;

        if (is_first_portfolio_update) {
            const ctx = document.getElementById('portfolio-chart');
            replicating_portfolio_chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: prices,
                datasets: [
                    {
                        label: 'shares',
                        data: shares_series,
                        borderWidth: 1
                    },
                    {
                        label: 'sell call options',
                        data: sell_call_options_series,
                        borderWidth: 1
                    },
                    {
                        label: 'buy call options',
                        data: buy_call_options_series,
                        borderWidth: 1
                    },
                ]
            },
            options: base_options
            });
            is_first_portfolio_update = false;
        } else {
            replicating_portfolio_chart['data']['labels'] = prices;
            replicating_portfolio_chart['data']['datasets'][0]['data'] = shares_series;
            replicating_portfolio_chart['data']['datasets'][1]['data'] = sell_call_options_series;
            replicating_portfolio_chart['data']['datasets'][2]['data'] = buy_call_options_series;
            replicating_portfolio_chart.update();
        }
    });

    fetch(`/replicating-portfolio-value?${queryString}`)
    .then(response => response.json())
    .then(data => {

    
        var ctx = document.getElementById('value-chart')
        var value_chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                    {
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                    },
                    {
                        label: '# of Votes2',
                        data: [12, 19, 3, 5, 2, 3],
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true
                    }
                }
            }
        });

    
    });
}