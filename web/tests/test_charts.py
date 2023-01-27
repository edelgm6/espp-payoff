from django.test import TestCase
from web.espp import Stock, ESPP
from web.charts import ReplicatingPortfolioValueChart, ReplicatingPortfolioChart, VarianceChart

class VarianceChartTestCase(TestCase):

    def test_create_variance_chart(self):
        for vol in [.1,.25,.5,.75,1]:
            print(vol)
            stock = Stock(price=28,volatility=vol)
            variance_chart = VarianceChart(stock)
            print(variance_chart.y)


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
