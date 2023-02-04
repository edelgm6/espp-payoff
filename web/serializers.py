from rest_framework import serializers
from web.espp import Stock, ESPP
from web.models import StockData

class ReplicatingPortfolioValueSerializer(serializers.Serializer):
    buy_shares_count = serializers.FloatField(min_value=0)
    buy_shares_price = serializers.FloatField(min_value=0)
    buy_shares_value = serializers.FloatField(min_value=0)

    sell_call_options_count = serializers.FloatField(min_value=0)
    sell_call_options_price = serializers.FloatField()
    sell_call_options_strike_price = serializers.FloatField()
    sell_call_options_value = serializers.FloatField(max_value=0)

    buy_call_options_count = serializers.FloatField(min_value=0)
    buy_call_options_price = serializers.FloatField(min_value=0)
    buy_call_options_strike_price = serializers.FloatField(min_value=0)
    buy_call_options_value = serializers.FloatField(min_value=0)

    total_value = serializers.FloatField(min_value=0)

class PayoffChartSerializer(serializers.Serializer):
    prices = serializers.ListField(
        child=serializers.FloatField(min_value=0)
    )
    payoffs = serializers.ListField(
        child=serializers.FloatField(min_value=0)
    )

class ReplicatingPortfolioChartSerializer(serializers.Serializer):
    prices = serializers.ListField(
        child=serializers.FloatField(min_value=0)
    )
    shares_series = serializers.ListField(
        child=serializers.FloatField(min_value=0)
    )
    sell_call_options_series = serializers.ListField(
        child=serializers.FloatField()
    )
    buy_call_options_series = serializers.ListField(
        child=serializers.FloatField()
    )

class TotalDataSerializer(serializers.Serializer):
    replicating_portfolio_value_data = ReplicatingPortfolioValueSerializer()
    replicating_portfolio_data = ReplicatingPortfolioChartSerializer()
    payoff_data = PayoffChartSerializer()

class CalculatorInputSerializer(serializers.Serializer):
    price = serializers.FloatField(min_value=.01)
    volatility = serializers.FloatField(min_value=.01)
    shares_cap = serializers.IntegerField(min_value=1)

    def create(self, validated_data):
        stock = Stock(price=validated_data['price'],volatility=validated_data['volatility'])
        espp = ESPP(stock=stock,shares_cap=validated_data['shares_cap'])
        return espp

class StockSerializer(serializers.Serializer):
    ticker = serializers.CharField(min_length=0, required=False)

    def create(self, validated_data):
        return Stock(**validated_data)

class StockChartSerializer(serializers.Serializer):
    price = serializers.FloatField(min_value=0)
    volatility = serializers.FloatField(min_value=.01)
    price_history = serializers.ListField(
        child=serializers.FloatField(min_value=.01)
    )
    daily_percent_changes = serializers.ListField(
        child=serializers.FloatField()
    )
    dates = serializers.ListField(
        child=serializers.DateField()
    )

class StockDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = StockData
        fields = ('ticker', 'pricing_history')
