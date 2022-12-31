from django.test import TestCase
from web.serializers import StockSerializer
from web.espp import Stock

class StockSerializerTestCase(TestCase):

    def test_create_stock(self):
        data = {
            "ticker": "SQ",
            "volatility": ".01",
            "price": "100"
        }

        serializer = StockSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_create_stock_without_ticker(self):
            data = {
                "volatility": ".01",
                "price": "100"
            }

            serializer = StockSerializer(data=data)
            self.assertTrue(serializer.is_valid())
            stock = serializer.save()
            self.assertEqual(stock.price,100)
            self.assertEqual(stock.volatility,.01)

    def test_validation_error_if_no_ticker_and_missing_other_field(self):
            data = {
                "price": "100"
            }

            serializer = StockSerializer(data=data)
            self.assertFalse(serializer.is_valid())
            self.assertTrue(serializer.errors.get('non_field_errors'))