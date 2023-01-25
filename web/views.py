from django.shortcuts import render
from django.views import View
from web.serializers import StockSerializer, StockChartSerializer, TotalDataSerializer, StockDataSerializer
from web.espp import ESPP
from web.charts import StockChart, TotalData
from web.models import StockData
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
import datetime
import json

class Index(View):
    template = 'index.html'

    def get(self, request, format=None):

        stock_datas = StockData.objects.filter(date_added=datetime.datetime.today())
        stock_datas_serializer = StockDataSerializer(stock_datas, many=True)

        # Need to explicitly render the json since we're including in a template
        for stock_data in stock_datas_serializer.data:
            stock_data['pricing_history'] = json.loads(stock_data['pricing_history'])
        
        stock_datas_json = json.dumps(stock_datas_serializer.data)
        return render(request, self.template, {'stock_data': stock_datas_json})

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

class StockChartView(APIView):

    def get(self, request, format=None):

        stock_serializer = StockSerializer(data=request.query_params)
        if not stock_serializer.is_valid():
            print(stock_serializer.errors)
            return Response(stock_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        stock = stock_serializer.save()
        stock_chart = StockChart(stock)
        stock_chart_serializer = StockChartSerializer(stock_chart)
        return Response(stock_chart_serializer.data)