from django.test import TestCase
from web.views import Payoffs
from web.espp import Stock, CallOption, ESPP
from web.charts import ReplicatingPortfolioValueChart
from rest_framework.test import APIRequestFactory
import json

class ReplicatingPortfolioChartTestCase(TestCase):

    def test_replicating_portfolio_chart(self):
        stock = Stock(price=100,volatility=.1)
        espp = ESPP(stock=stock)

        replicating_portfolio_value_chart = ReplicatingPortfolioValueChart(espp=espp)
        print(replicating_portfolio_value_chart.buy_call_options_count)

# class ESPPTestCase(TestCase):

#     def test_get_payoff_series(self):
#         espp = ESPP()
#         charts = Charts(espp=espp)

#         print(charts.get_payoff_series())

#     def test_get_replicating_portfolio_series(self):
#         espp = ESPP()
#         charts = Charts(espp=espp)

#         print(charts.get_replicating_portfolio_series())