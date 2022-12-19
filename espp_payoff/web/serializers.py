from rest_framework import serializers

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