from django.test import TestCase
from web.views import Payoffs
from web.espp import Stock, CallOption, ESPP
from rest_framework.test import APIRequestFactory
import json

class ESPPTestCase(TestCase):

    def test_create_espp(self):
        espp = ESPP()

    def test_get_payoffs(self):
        espp = ESPP()

        payoff = espp.get_payoff(100)
        self.assertEqual(round(payoff),6115)

    def test_get_replicating_portfolio(self):
        espp = ESPP()

        replicating_portfolio = espp.get_replicating_portfolio()
        print(replicating_portfolio)
        self.assertEqual(replicating_portfolio['buy_shares_position'].count,espp.maximum_shares_purchased * espp.purchase_discount)
        self.assertEqual(replicating_portfolio['sell_call_options_position'].count,-espp.maximum_shares_purchased * espp.purchase_discount)
        self.assertEqual(replicating_portfolio['buy_call_options_position'].count,(1 / espp.maximum_purchase_price) * espp.maximum_investment)
        
        


class StockTestCase(TestCase):

    def test_create_stock_with_vol_present(self):
        stock = Stock(ticker='SQ',price=100,annualized_volatility=.1)

    def test_get_price(self):
        stock = Stock(ticker='SQ',price=100,annualized_volatility=.1)
        self.assertEqual(stock.get_price(),stock.price)

class CallOptionTestCase(TestCase):

    def test_create_call_option(self):
        stock = Stock(ticker='SQ',price=100,annualized_volatility=.1)
        call = CallOption(strike_price=10,expiration_years=1,stock=stock)

    def test_get_payoff(self):
        stock = Stock(ticker='SQ',price=100,annualized_volatility=.1)
        call = CallOption(strike_price=10,expiration_years=1,stock=stock)
        payoff = call.get_payoff(110)
        self.assertEqual(payoff,100)

    def test_get_price(self):
        stock = Stock(ticker='SQ',price=100,annualized_volatility=.1)
        call = CallOption(strike_price=10,expiration_years=1,stock=stock)
        payoff = call.get_price(risk_free_rate=.04)

        #https://goodcalculators.com/black-scholes-calculator/
        self.assertEqual(round(payoff,2),90.39)



