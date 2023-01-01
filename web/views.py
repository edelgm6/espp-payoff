from django.shortcuts import render
from django.views import View
from web.serializers import PayoffsSerializer, PayoffChartSerializer, ReplicatingPortfolioSeriesSerializer, StockSerializer, StockChartSerializer
from web.espp import ESPP
from web.charts import Charts, StockChart, PayoffChart
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class Index(View):
    template = 'index.html'

    def get(self, request, format=None):
        return render(request, self.template)

class Payoffs(APIView):

    #TODO: Turn into a chart object and serialize back out
    def get(self, request, format=None):

        stock_serializer = StockSerializer(data=request.query_params)
        if not stock_serializer.is_valid():
            print(stock_serializer.errors)
            return Response(stock_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        stock = stock_serializer.save()
        espp = ESPP(stock=stock)
        payoff_chart = PayoffChart(espp=espp)
        payoff_chart_serializer = PayoffChartSerializer(payoff_chart)
        return Response(payoff_chart_serializer.data)

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

class ReplicatingPortfolio(APIView):

    def get(self, request, format=None):
        stock_serializer = StockSerializer(data=request.query_params)
        if not stock_serializer.is_valid():
            print(stock_serializer.errors)
            return Response(stock_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        stock = stock_serializer.save()
        espp = ESPP(stock=stock)
        charts = Charts(espp=espp)

        portfolio = charts.get_replicating_portfolio_series()
        payoff = charts.get_payoff_series()
        portfolio['payoffs'] = payoff['payoffs']
        serializer = ReplicatingPortfolioSeriesSerializer(data=portfolio)
        if serializer.is_valid():
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
