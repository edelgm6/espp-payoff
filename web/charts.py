
class Charts:

    def __init__(self, espp):
        self.espp = espp

    def get_price_series(self):
        # TODO: What if returns kink and share price is already in the prices list?

        max_price_model = round(self.espp.stock.price * 1.25)
        MIN_PRICE_MODEL = 1
        prices = [price for price in range(MIN_PRICE_MODEL, max_price_model)]
        # prices.append(self.espp.shares_cap_transition)
        # prices.append(self.stock.price)
        prices.sort()

        return prices

    def get_payoff_series(self):

        prices = self.get_price_series()
        payoffs = [self.espp.get_payoff(price) for price in prices]

        return {'prices': prices,'payoffs': payoffs}

    def get_replicating_portfolio_series(self):
        prices = self.get_price_series()
        replicating_portfolio = self.espp.get_replicating_portfolio()

        shares_series = [price * replicating_portfolio.buy_shares_position.count for price in prices]
        sell_call_options_series = [replicating_portfolio.sell_call_options_position.security.get_payoff(price) * replicating_portfolio.sell_call_options_position.count for price in prices]
        buy_call_options_series = [replicating_portfolio.buy_call_options_position.security.get_payoff(price) * replicating_portfolio.buy_call_options_position.count for price in prices]

        replicating_portfolio_series = {
            'prices': prices,
            'shares_series': shares_series,
            'sell_call_options_series': sell_call_options_series,
            'buy_call_options_series': buy_call_options_series
        }

        print(buy_call_options_series)

        return replicating_portfolio_series
