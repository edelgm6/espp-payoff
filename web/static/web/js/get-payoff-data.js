function getPayoffData(event) {
    event.preventDefault();

    const volatilityField = document.querySelector('#volatility');
    const priceField = document.querySelector('#price');
    const sharesCapField = document.querySelector('#shares-cap');

    const priceFieldValid = validateVolatilityAndPriceAndSharesCap(priceField);
    const volatilityFieldValid = validateVolatilityAndPriceAndSharesCap(volatilityField);
    const sharesCapFieldValid = validateVolatilityAndPriceAndSharesCap(sharesCapField);
    if (!priceFieldValid || !volatilityFieldValid || !sharesCapFieldValid) {
        return;
    }

    const params = new URLSearchParams();
    const decimalVolatility = (parseFloat(volatilityField.value) / 100.0).toString();

    params.set('price', priceField.value);
    params.set('volatility', decimalVolatility);
    params.set('shares_cap', sharesCapField.value);
    const queryString = params.toString();

    fetch(`/payoffs/?${queryString}`)
    .then(response => response.json())
    .then(data => {

        const payoffData = data.payoff_data
        const newPrices = payoffData.prices;
        const payoffs = payoffData.payoffs;

        const replicatingPortfolioData = data.replicating_portfolio_data;
        const sharesSeries = replicatingPortfolioData.shares_series;
        const sellCallOptionsSeries = replicatingPortfolioData.sell_call_options_series;
        const buyCallOptionsSeries = replicatingPortfolioData.buy_call_options_series;

        const replicatingPortfolioValueData = data.replicating_portfolio_value_data;
        const totalValue = replicatingPortfolioValueData.total_value;

        calculatedPayoffsChart.updateDatasetData(
            newPrices,
            payoffs,
            sharesSeries,
            sellCallOptionsSeries,
            buyCallOptionsSeries
        );

        valueCompareChart.updateCustomData(
            {
                value: totalValue,
                volatility: volatilityField.value,
                price: priceField.value
            }
        )
    });
}