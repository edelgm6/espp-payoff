from django.test import TestCase
from web.views import Payoffs
from rest_framework.test import APIRequestFactory
import json

class PayoffsTestCase(TestCase):

    def test_get_payoffs(self):
        factory = APIRequestFactory()
        request = factory.get('/payoffs/')

        response = Payoffs.as_view()(request)

        self.assertTrue(response.data)

# Create your tests here.
