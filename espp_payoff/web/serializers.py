from rest_framework import serializers

class PayoffsSerializer(serializers.Serializer):
    prices = serializers.ListField(
        child=serializers.FloatField(min_value=0)
    )