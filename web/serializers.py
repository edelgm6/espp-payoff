from rest_framework import serializers
from web.espp import Stock

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

class PayoffsSerializer(serializers.Serializer):
    prices = serializers.ListField(
        child=serializers.FloatField(min_value=0)
    )
    payoffs = serializers.ListField(
        child=serializers.FloatField(min_value=0)
    )

class ReplicatingPortfolioSeriesSerializer(serializers.Serializer):
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
    payoffs = serializers.ListField(
        child=serializers.FloatField(min_value=0)
    )
    