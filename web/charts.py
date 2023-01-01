
class StockChart:
    
    def __init__(self, stock):
        price, volatility, price_history, daily_percent_changes, dates = stock.get_price_and_volatility_data()
        self.price = price
        self.volatility = volatility
        self.price_history = price_history
        self.daily_percent_changes = daily_percent_changes
        self.dates = dates

class ESPPChart:

    def __init__(self, espp):
        self.prices = self.get_price_series(espp)

    def get_price_series(self, espp):
        # TODO: What if returns kink and share price is already in the prices list?

        max_price_model = max(round(espp.stock.price * 1.25),20)
        MIN_PRICE_MODEL = 1
        prices = [price for price in range(MIN_PRICE_MODEL, max_price_model)]
        prices.insert(0,0)

        return prices

class PayoffChart(ESPPChart):

    def __init__(self, espp):
        super().__init__(espp)
        self.payoffs = self.get_payoff_series(espp, self.prices)

    def get_payoff_series(self, espp, prices):

        payoffs = [espp.get_payoff(price) for price in prices if price > 0]
        payoffs.insert(0,0)

        return payoffs

class ReplicatingPortfolioChart(ESPPChart):

    def __init__(self, espp):
        super().__init__(espp)
        self.shares_series, self.sell_call_options_series, self.buy_call_options_series = self.get_replicating_portfolio_series(espp, self.prices)


    def get_replicating_portfolio_series(self, espp, prices):
        replicating_portfolio = espp.get_replicating_portfolio()

        shares_series = [
            price * replicating_portfolio.buy_shares_position.count for price in prices
            ]
        sell_call_options_series = [
            replicating_portfolio.sell_call_options_position.security.get_payoff(price) *
                replicating_portfolio.sell_call_options_position.count for price in prices
            ]
        buy_call_options_series = [
            replicating_portfolio.buy_call_options_position.security.get_payoff(price) *
                replicating_portfolio.buy_call_options_position.count for price in prices
            ]

        for series_list in [prices,shares_series,sell_call_options_series,buy_call_options_series]:
            series_list.insert(0,0)

        return shares_series, sell_call_options_series, buy_call_options_series
