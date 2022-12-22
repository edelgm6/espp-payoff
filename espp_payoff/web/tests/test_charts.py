from django.test import TestCase
from web.views import Payoffs
from web.espp import Stock, CallOption, ESPP
from web.charts import Charts
from rest_framework.test import APIRequestFactory
import json

class ESPPTestCase(TestCase):

    def test_get_payoff_series(self):
        espp = ESPP()
        charts = Charts(espp=espp)

        print(charts.get_payoff_series())

    def test_get_replicating_portfolio_series(self):
        espp = ESPP()
        charts = Charts(espp=espp)

        print(charts.get_replicating_portfolio_series())