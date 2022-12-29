from polygon import RESTClient
from scipy.stats import norm
from django.conf import settings
from collections import namedtuple
import statistics
import math
import numpy as np

class Position:
    def __init__(self, security, count):
        self.security = security
        self.count = count

    def get_value(self):
        return self.security.price * self.count

# TODO: Security has a price
class Security:
    pass

class Stock(Security):
    # Implement a get_payoff function here for consistency
    def __init__(self, ticker, **kwargs):
        self.ticker = ticker
        print(kwargs)

        if 'price' not in kwargs or 'volatility' not in kwargs:
            price, volatility = self.get_price_and_volatility()

        if 'price' in kwargs:
            print('has price')
            self.price = kwargs['price']
        else:
            self.price = price

        if 'volatility' in kwargs:
            print('has volatility')
            self.volatility = kwargs['volatility']
        else:
            self.volatility = volatility

    def get_price_and_volatility(self):
        history = self._get_history()
        price = self._get_price(history)
        volatility = self._get_annualized_volatility(history)

        return price, volatility

    def _get_history(self):
        ### TODO: Figure out how to save this if it's called
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

    def _get_price(self, history):
        price = history[-1].close
        return price

    def _get_annualized_volatility(self, history):

        closing_prices = [agg.close for agg in history]

        daily_pct_changes = []
        for day in range(1,len(closing_prices)):
            daily_pct_change = closing_prices[day] / closing_prices[day - 1] - 1
            daily_pct_changes.append(daily_pct_change)

        daily_volatility = statistics.pstdev(daily_pct_changes)
        annualized_volatility = daily_volatility * math.sqrt(252)

        return round(annualized_volatility,2)

class CallOption(Security):
    def __init__(self, strike_price, expiration_years, stock):
        self.strike_price = strike_price
        self.expiration_years = expiration_years
        self.stock = stock

    def get_payoff(self, price):
        return max(0, price - self.strike_price)

    def get_price(self, risk_free_rate):

        annualized_volatility = self.stock.annualized_volatility
        stock_price = self.stock.price

        N = norm.cdf

        d1 = (np.log(stock_price/self.strike_price) +
            (risk_free_rate + annualized_volatility**2/2) *
            self.expiration_years) / (annualized_volatility*np.sqrt(self.expiration_years))

        d2 = d1 - annualized_volatility * np.sqrt(self.expiration_years)

        return stock_price * N(d1) - self.strike_price * np.exp(-risk_free_rate*self.expiration_years) * N(d2)

class ESPP:
    def __init__(self):
        self.ticker = 'SQ'
        self.risk_free_rate = .03
        self.maximum_investment = 12500
        self.maximum_shares_purchased = 1000
        self.purchase_discount = .15
        # self.stock_history = get_stock_history(TICKER)
        # self.annualized_volatility = get_annualized_volatility(stock_history)
        # self.current_price = stock_history[-1].close
        current_price = 28
        annualized_volatility = .2
        self.stock = Stock(self.ticker,current_price,annualized_volatility)

        self.maximum_purchase_price = self.stock.price * (1 - self.purchase_discount)
        self.minimum_shares_purchased = self.maximum_investment / self.maximum_purchase_price
        self.expiration_years = .5
        self.shares_cap_transition = self.maximum_investment / self.maximum_shares_purchased / (1 - self.purchase_discount)

    def get_payoff(self, price):

        purchase_price = min(price * (1 - self.purchase_discount), self.maximum_purchase_price)
        shares_purchased = min(self.maximum_shares_purchased, self.maximum_investment / purchase_price)

        purchase_value = purchase_price * shares_purchased
        market_value = price * shares_purchased

        return market_value - purchase_value


    def get_replicating_portfolio(self):

        buy_shares_count = self.purchase_discount * self.maximum_shares_purchased
        buy_shares_position = Position(security=self.stock,count=buy_shares_count)

        sell_call_option_strike_price = self.shares_cap_transition
        sell_call_option = CallOption(strike_price=sell_call_option_strike_price,expiration_years=self.expiration_years,stock=self.stock)
        sell_call_options_position = Position(security=sell_call_option,count=-buy_shares_count)

        buy_call_option = CallOption(strike_price=self.stock.price,expiration_years=self.expiration_years,stock=self.stock)
        buy_call_options_count = (1 / self.maximum_purchase_price) * self.maximum_investment
        buy_call_options_position = Position(security=buy_call_option,count=buy_call_options_count)

        ReplicatingPortfolio = namedtuple('ReplicatingPortoflio', ['buy_shares_position','sell_call_options_position','buy_call_options_position'])

        replicating_portfolio = ReplicatingPortfolio(
            buy_shares_position=buy_shares_position,
            sell_call_options_position=sell_call_options_position,
            buy_call_options_position=buy_call_options_position
            )

        return replicating_portfolio
