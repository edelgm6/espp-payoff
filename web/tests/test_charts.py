from django.test import TestCase
from web.espp import Stock, ESPP
from web.charts import ReplicatingPortfolioValueChart, ReplicatingPortfolioChart, VarianceChart

class VarianceChartTestCase(TestCase):
    
    def test_create_variance_chart(self):
        stock = Stock(price=4,volatility=1)
        variance_chart = VarianceChart(stock)


class ReplicatingPortfolioValueChartTestCase(TestCase):

    def test_replicating_portfolio_chart(self):
        stock = Stock(price=100,volatility=.1)
        espp = ESPP(stock=stock)

        replicating_portfolio_value_chart = ReplicatingPortfolioValueChart(espp=espp)
        print(replicating_portfolio_value_chart.buy_call_options_count)

class ReplicatingPortfolioChartTestCase(TestCase):

    def test_replicating_portfolio_chart(self):
        stock = Stock(price=100,volatility=.1)
        espp = ESPP(stock=stock)

        replicating_portfolio_chart = ReplicatingPortfolioChart(espp=espp)

# class ESPPTestCase(TestCase):

#     def test_get_payoff_series(self):
#         espp = ESPP()
#         charts = Charts(espp=espp)

#         print(charts.get_payoff_series())

#     def test_get_replicating_portfolio_series(self):
#         espp = ESPP()
#         charts = Charts(espp=espp)

#         print(charts.get_replicating_portfolio_series())