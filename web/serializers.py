from rest_framework import serializers
from web.espp import Stock

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

class StockSerializer(serializers.Serializer):
    ticker = serializers.CharField(min_length=0, required=False)
    price = serializers.FloatField(min_value=.01, required=False)
    volatility = serializers.FloatField(min_value=.01, required=False)

    def create(self, validated_data):
        return Stock(**validated_data)

    def validate(self, data):
        if data.get('ticker') is None and (not data.get('price') or not data.get('volatility')):
            raise serializers.ValidationError(
                "if ticker is None, must have both price and volatility"
                )
        return data