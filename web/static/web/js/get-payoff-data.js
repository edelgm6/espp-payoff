function getPayoffData(event) {
    event.preventDefault();

    var price_field_valid = validateVolatilityAndPrice(priceField);
    var volatility_field_valid = validateVolatilityAndPrice(volatilityField);
    if (!price_field_valid || !volatility_field_valid) {
        return;
    }

    const params = new URLSearchParams();
    const decimal_volatility = (parseFloat(volatilityField.value) / 100.0).toString();

    params.set('price', priceField.value);
    params.set('volatility', decimal_volatility);
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
        const buySharesValue = replicatingPortfolioValueData.buy_shares_value;
        const sellCallOptionsValue = replicatingPortfolioValueData.sell_call_options_value;
        const buyCallOptionsValue = replicatingPortfolioValueData.buy_call_options_value;
        const totalValue = replicatingPortfolioValueData.total_value;

        calculatedPayoffsChart.updateDatasetData(
            newPrices, 
            payoffs, 
            undefined, 
            undefined, 
            undefined
        );
        calculatedPortfolioChart.updateDatasetData(
            newPrices,
            undefined,
            sharesSeries,
            sellCallOptionsSeries,
            buyCallOptionsSeries
        );

        value_chart['data']['datasets'][0]['data'][0] = buySharesValue;
        value_chart['data']['datasets'][0]['data'][1] = sellCallOptionsValue;
        value_chart['data']['datasets'][0]['data'][2] = buyCallOptionsValue;
        value_chart['data']['datasets'][0]['data'][3] = totalValue;
        value_chart.update();
    });
}