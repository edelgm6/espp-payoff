
class Charts:

    def __init__(self, espp):
        self.espp = espp

    def get_price_series(self):
        # TODO: What if returns kink and share price is already in the prices list?
        
        max_price_model = round(self.stock.price * 1.25)
        MIN_PRICE_MODEL = 1
        prices = [price for price in range(MIN_PRICE_MODEL, max_price_model)]
        # prices.append(self.returns_kink)
        # prices.append(self.stock.price)
        # prices.sort()

        return prices

    def get_payoff_series(self):

        payoffs = self.get_payoff_data()

        prices = [payoff.modeled_price for payoff in payoffs]
        payoffs = [payoff.return_dollars for payoff in payoffs]

        return {'prices': prices,'payoffs': payoffs}

    def get_replication_portfolio_series(self):
        prices = self.get_price_series()
        replicating_portfolio = self.get_replicating_portfolio()

        shares_series = [price * replicating_portfolio['buy_shares_count'] for price in prices]
        sell_call_options_series = ([0 for price in prices if price < replicating_portfolio['sell_call_options_strike_price']] + 
            [(price - replicating_portfolio['sell_call_options_strike_price']) * replicating_portfolio['sell_call_options_count'] for i, price in enumerate(prices) if price >= replicating_portfolio['sell_call_options_strike_price']])
        buy_call_options_series = ([0 for price in prices if price < replicating_portfolio['buy_call_options_strike_price']] + 
            [(price - replicating_portfolio['buy_call_options_strike_price']) * replicating_portfolio['buy_call_options_count'] for i, price in enumerate(prices) if price >= replicating_portfolio['buy_call_options_strike_price']])

        replicating_portfolio_series = {
            'prices': prices,
            'shares_series': shares_series,
            'sell_call_options_series': sell_call_options_series,
            'buy_call_options_series': buy_call_options_series
        }

        return replicating_portfolio_series