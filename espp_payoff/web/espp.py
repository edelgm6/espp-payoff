from polygon import RESTClient
from scipy.stats import norm
from django.conf import settings
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
    def __init__(self, ticker, price, annualized_volatility):
        self.ticker = ticker
        self.price = price
        self.annualized_volatility = annualized_volatility
        if annualized_volatility:
            self.annualizized_volatility = annualized_volatility
        else:
            self.annualizized_volatility = self.get_annualized_volatility()

    def get_price(self):
        return self.price
    
    def get_history(self):
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

    def get_annualized_volatility(self):

        closing_prices = [agg.close for agg in self.stock_history]

        daily_pct_changes = []
        for day in range(1,len(closing_prices)):
            daily_pct_change = closing_prices[day] / closing_prices[day - 1] - 1
            daily_pct_changes.append(daily_pct_change)

        daily_volatility = statistics.pstdev(daily_pct_changes)
        annualized_volatility = daily_volatility * math.sqrt(252)

        return annualized_volatility

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
        self.risk_free_rate = .045
        self.maximum_investment = 12500
        self.maximum_shares_purchased = 1000
        self.purchase_discount = .15
        # self.stock_history = get_stock_history(TICKER)
        # self.annualized_volatility = get_annualized_volatility(stock_history)
        # self.current_price = stock_history[-1].close
        current_price = 79
        annualized_volatility = .891
        self.stock = Stock(self.ticker,current_price,annualized_volatility)

        self.maximum_purchase_price = self.stock.price * (1 - self.purchase_discount)
        self.minimum_shares_purchased = self.maximum_investment / self.maximum_purchase_price
        self.expiration_years = .5

    def get_payoff(self, price):

        purchase_price = min(price * (1 - self.purchase_discount), self.maximum_purchase_price)
        shares_purchased = min(self.maximum_shares_purchased, self.maximum_investment / purchase_price)

        purchase_value = purchase_price * shares_purchased
        market_value = price * shares_purchased
        
        return market_value - purchase_value
        

    def get_replicating_portfolio(self):
        
        ### Replicating portfolio
        ### Shares purchased

        buy_shares_count = self.purchase_discount * self.maximum_shares_purchased
        buy_shares_position = Position(security=self.stock,count=buy_shares_count)
        # replicating_shares_value = replicating_shares * self.stock.price

        ### Sell 150 call options @ strike of the kink
        sell_call_option_strike_price = min(self.maximum_investment / self.maximum_shares_purchased / (1 - self.purchase_discount),self.stock.price)
        sell_call_option = CallOption(strike_price=sell_call_option_strike_price,expiration_years=self.expiration_years,stock=self.stock)
        sell_call_options_position = Position(security=sell_call_option,count=-buy_shares_count)
        # sell_call_option_value = sell_call_option.get_price(self.stock.price,self.risk_free_rate,self.stock.annualizized_volatility,self.expiration_years)
        # sell_call_options_value = sell_call_option_value * -replicating_shares

        ### Buy 185 call options @ current_price strike

        buy_call_option = CallOption(strike_price=self.stock.price,expiration_years=self.expiration_years,stock=self.stock)
        buy_call_options_count = (1 / self.maximum_purchase_price) * self.maximum_investment
        buy_call_options_position = Position(security=buy_call_option,count=buy_call_options_count)
        
        # buy_call_option_value = buy_call_option.get_price()
        # buy_call_options_value = buy_call_option_value * buy_replicating_options
        # total_value = replicating_shares_value + sell_call_opstions_value + buy_call_options_value

        replicating_portfolio = {
            'buy_shares_position': buy_shares_position,
            'sell_call_options_position': sell_call_options_position,
            'buy_call_options_position': buy_call_options_position
        }
            # 'buy_shares_count': replicating_shares,
            # 'buy_shares_value': replicating_shares_value,
            # 'sell_call_options_count': -replicating_shares,
            # 'sell_call_options_strike_price': sell_call_option_strike_price,
            # 'sell_call_options_value': sell_call_options_value,
            # 'buy_call_options_count': buy_replicating_options,
            # 'buy_call_options_strike_price': self.stock.price,
            # 'buy_call_options_value': buy_call_options_value,
            # 'total_value': total_value
        

        return replicating_portfolio