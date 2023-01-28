function getPayoffData(event) {
    event.preventDefault();

    const priceFieldValid = validateVolatilityAndPrice(priceField);
    const volatilityFieldValid = validateVolatilityAndPrice(volatilityField);
    if (!priceFieldValid || !volatilityFieldValid) {
        return;
    }

    const params = new URLSearchParams();
    const decimalVolatility = (parseFloat(volatilityField.value) / 100.0).toString();

    params.set('price', priceField.value);
    params.set('volatility', decimalVolatility);
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
        // const buySharesValue = replicatingPortfolioValueData.buy_shares_value;
        // const sellCallOptionsValue = replicatingPortfolioValueData.sell_call_options_value;
        // const buyCallOptionsValue = replicatingPortfolioValueData.buy_call_options_value;
        const totalValue = replicatingPortfolioValueData.total_value;

        calculatedPayoffsChart.updateDatasetData(
            newPrices,
            payoffs,
            sharesSeries,
            sellCallOptionsSeries,
            buyCallOptionsSeries
        );

        // console.log(buySharesValue)
        // console.log(sellCallOptionsValue)
        // console.log(buyCallOptionsValue)

        // valueChart['data']['datasets'][0]['data'][0] = buySharesValue;
        // valueChart['data']['datasets'][0]['data'][1] = sellCallOptionsValue;
        // valueChart['data']['datasets'][0]['data'][2] = buyCallOptionsValue;
        // valueChart['data']['datasets'][0]['data'][3] = totalValue;
        // valueChart.update();

        console.log(totalValue);
        valueCompareChart['data']['datasets'][1]['data'][4] = totalValue;
        valueCompareChart.update();
    });
}