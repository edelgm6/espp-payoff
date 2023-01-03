from django.shortcuts import render
from django.views import View
from web.serializers import StockSerializer, StockChartSerializer, TotalDataSerializer
from web.espp import ESPP
from web.charts import StockChart, TotalData
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class Index(View):
    template = 'index.html'

    def get(self, request, format=None):
        return render(request, self.template)

class Payoffs(APIView):

    def get(self, request, format=None):
        stock_serializer = StockSerializer(data=request.query_params)
        if not stock_serializer.is_valid():
            print(stock_serializer.errors)
            return Response(stock_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        stock = stock_serializer.save()
        espp = ESPP(stock=stock)
        total_data = TotalData(espp)
        total_data_serializer = TotalDataSerializer(total_data)
        return Response(total_data_serializer.data)  

class StockData(APIView):

    def get(self, request, format=None):

        stock_serializer = StockSerializer(data=request.query_params)
        if not stock_serializer.is_valid():
            print(stock_serializer.errors)
            return Response(stock_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        stock = stock_serializer.save()

        stock_chart = StockChart(stock)
        stock_chart_serializer = StockChartSerializer(stock_chart)
        return Response(stock_chart_serializer.data)