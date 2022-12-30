// const form = document.querySelector('form');
// const tickerField = document.querySelector('#ticker');
// const volatilityField = document.querySelector('#volatility');
// const priceField = document.querySelector('#price');
var is_first_payoffs_update = true;

function getPayoffData(event) {
    event.preventDefault();

    const params = new URLSearchParams();
    params.set('ticker', tickerField.value);
    params.set('price', priceField.value);
    params.set('volatility', volatilityField.value);
    const queryString = params.toString();

    fetch(`/payoffs?${queryString}`)
    .then(response => response.json())
    .then(data => {
        const prices = data.prices;
        const payoffs = data.payoffs;

        const ctx = document.getElementById('payoff-chart');
        const chart = new Chart(ctx, {
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
    });

    fetch(`/replicating-portfolio-series?${queryString}`)
    .then(response => response.json())
    .then(data => {
        const prices = data.prices;
        const shares_series = data.shares_series;
        const sell_call_options_series = data.sell_call_options_series;
        const buy_call_options_series = data.buy_call_options_series;
        const payoffs = data.payoffs;

        const ctx = document.getElementById('portfolio-chart');
        const chart = new Chart(ctx, {
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
                {
                    label: 'espp',
                    data: payoffs,
                    borderWidth: 1
                }
            ]
        },
        options: base_options
        });
    is_first_payoffs_update = false;
    });
}