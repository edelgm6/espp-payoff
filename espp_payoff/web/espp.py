from collections import namedtuple
from polygon import RESTClient
from scipy.stats import norm
from django.conf import settings
import statistics
import math
import numpy as np

class ESPP:
    def __init__(self):
        self.ticker = 'SQ'
        self.risk_free_rate = .045
        self.maximum_investment = 12500
        self.maximum_shares_purchased = 1000
        self.purchase_discount = .15
        # self.stock_history = get_stock_history(TICKER)
        # self.annualized_volatility = get_annualized_volatility(stock_history)
        # self.current_price = stock_history[-1].close
        self.current_price = 79
        self.annualized_volatility = .891
        self.maximum_share_price = self.current_price * (1 - self.purchase_discount)
        self.minimum_shares_purchased = self.maximum_investment / self.maximum_share_price
        self.expiration_years = .5
        self.returns_kink = min(self.maximum_investment / self.maximum_shares_purchased / (1 - self.purchase_discount),self.current_price)

    def get_payoff_series(self):

        payoffs = self.get_payoff_data()

        prices = [payoff.modeled_price for payoff in payoffs]
        payoffs = [payoff.return_dollars for payoff in payoffs]

        return {'prices': prices,'payoffs': payoffs}

    def get_price_series(self):
        # TODO: What if returns kink and share price is already in the prices list?
        
        max_price_model = round(self.current_price * 1.5)
        MIN_PRICE_MODEL = 1
        prices = [price for price in range(MIN_PRICE_MODEL, max_price_model)]
        # prices.append(self.returns_kink)
        # prices.append(self.current_price)
        prices.sort()

        return prices

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

    def get_options_price(self,strike_price):

        N = norm.cdf

        d1 = (np.log(self.current_price/strike_price) +
            (self.risk_free_rate + self.annualized_volatility**2/2) *
            self.expiration_years) / (self.annualized_volatility*np.sqrt(self.expiration_years))

        d2 = d1 - self.annualized_volatility * np.sqrt(self.expiration_years)

        return self.current_price * N(d1) - strike_price * np.exp(-self.risk_free_rate*self.expiration_years) * N(d2)

    def get_stock_history(self):
        client = RESTClient(settings.POLYGON_API_KEY)

        response = client.get_aggs(
            ticker=self.ticker,
            multiplier=1,
            timespan='day',
            from_='2021-12-15',
            to='2022-12-14',
            adjusted=True,
            sort='asc'
        )

        return response

    def get_annualized_volatility(self):

        closing_prices = [agg.close for agg in self.stock_history]

        daily_pct_changes = []
        for day in range(1,len(closing_prices)):
            daily_pct_change = closing_prices[day] / closing_prices[day - 1] - 1
            daily_pct_changes.append(daily_pct_change)

        daily_volatility = statistics.pstdev(daily_pct_changes)
        annualized_volatility = daily_volatility * math.sqrt(252)

        return annualized_volatility

    def get_payoff_data(self):

        espp_value_tuples = []
        Return = namedtuple(
            'Return',
            'modeled_price shares_purchased purchase_value market_value return_dollars return_percent'
            )

        max_purchase_price = self.current_price * (1 - self.purchase_discount)

        prices = self.get_price_series()
        for modeled_price in prices:
            purchase_price = min(modeled_price * (1 - self.purchase_discount), max_purchase_price)
            shares_purchased = min(self.maximum_shares_purchased, self.maximum_investment / purchase_price)

            purchase_value = purchase_price * shares_purchased
            market_value = modeled_price * shares_purchased
            return_dollars = market_value - purchase_value
            return_percent = return_dollars / purchase_value - 1

            espp_value_tuples.append(
                Return(
                    modeled_price,
                    shares_purchased,
                    purchase_value,
                    market_value,
                    return_dollars,
                    return_percent
                    )
                )

            modeled_price += 1

        return espp_value_tuples

    def get_replicating_portfolio(self):
        ### Logic
        
        ### Replicating portfolio
        ### Shares purchased

        replicating_shares = .15 * self.maximum_shares_purchased
        replicating_shares_value = replicating_shares * self.current_price

        ### Sell 150 call options @ strike of the kink

        sell_call_option_value = self.get_options_price(strike_price=self.returns_kink)

        sell_call_options_value = sell_call_option_value * -replicating_shares

        ### Buy 185 call options @ current_price strike

        buy_call_option_value = self.get_options_price(strike_price=self.current_price)

        buy_replicating_options = (1 / self.maximum_share_price) * self.maximum_investment
        buy_call_options_value = buy_call_option_value * buy_replicating_options
        total_value = replicating_shares_value + sell_call_options_value + buy_call_options_value

        ReplicatingPortfolio = namedtuple('ReplicatingPortfolio', 'shares_value sell_call_options_value buy_call_options_value total_value')
        replicating_portfolio = ReplicatingPortfolio(replicating_shares_value,sell_call_options_value,buy_call_options_value,total_value)

        replicating_portfolio = {
            'buy_shares_count': replicating_shares,
            'buy_shares_value': replicating_shares_value,
            'sell_call_options_count': -replicating_shares,
            'sell_call_options_strike_price': self.returns_kink,
            'sell_call_options_value': sell_call_options_value,
            'buy_call_options_count': buy_replicating_options,
            'buy_call_options_strike_price': self.current_price,
            'buy_call_options_value': buy_call_options_value
        }

        return replicating_portfolio