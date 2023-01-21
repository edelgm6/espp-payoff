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

        const payoff_data = data.payoff_data
        const newPrices = payoff_data.prices;
        const payoffs = payoff_data.payoffs;

        const replicating_portfolio_data = data.replicating_portfolio_data;
        const shares_series = replicating_portfolio_data.shares_series;
        const sell_call_options_series = replicating_portfolio_data.sell_call_options_series;
        const buy_call_options_series = replicating_portfolio_data.buy_call_options_series;

        const replicating_portfolio_value_data = data.replicating_portfolio_value_data;
        const buy_shares_value = replicating_portfolio_value_data.buy_shares_value;
        const sell_call_options_value = replicating_portfolio_value_data.sell_call_options_value;
        const buy_call_options_value = replicating_portfolio_value_data.buy_call_options_value;
        const total_value = replicating_portfolio_value_data.total_value;

        calculatedPayoffsChart.updateDatasetData(newPrices, payoffs, undefined, undefined, undefined);
        calculatedPortfolioChart.updateDatasetData(
            newPrices,
            undefined,
            shares_series,
            sell_call_options_series,
            buy_call_options_series
        );
        
        // payoffs_chart['data']['labels'] = prices;
        // payoffs_chart['data']['datasets'][0]['data'] = payoffs;
        // payoffs_chart.update();

        // replicating_portfolio_chart['data']['labels'] = prices;
        // replicating_portfolio_chart['data']['datasets'][0]['data'] = shares_series;
        // replicating_portfolio_chart['data']['datasets'][1]['data'] = sell_call_options_series;
        // replicating_portfolio_chart['data']['datasets'][2]['data'] = buy_call_options_series;
        // replicating_portfolio_chart.update();

        value_chart['data']['datasets'][0]['data'][0] = buy_shares_value;
        value_chart['data']['datasets'][0]['data'][1] = sell_call_options_value;
        value_chart['data']['datasets'][0]['data'][2] = buy_call_options_value;
        value_chart['data']['datasets'][0]['data'][3] = total_value;
        value_chart.update();
    });
}