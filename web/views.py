from django.shortcuts import render
from django.views import View
from web.serializers import PayoffsSerializer, ReplicatingPortfolioSeriesSerializer, StockSerializer
from web.espp import ESPP, Stock
from web.charts import Charts
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
        charts = Charts(espp=espp)
        data = charts.get_payoff_series()
        serializer = PayoffsSerializer(data=data)
        if serializer.is_valid():
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StockData(APIView):

    def get(self, request, format=None):

        stock_serializer = StockSerializer(data=request.query_params)
        if not stock_serializer.is_valid():
            print(stock_serializer.errors)
            return Response(stock_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        stock = stock_serializer.save()
        price, volatility, price_history, daily_percent_changes, dates = stock.get_price_and_volatility_data()
        
        # TODO: Change this to a serializer
        return Response(
            {
                'price': price, 
                'volatility': volatility,
                'price_history': price_history,
                'daily_percent_changes': daily_percent_changes,
                'dates': dates
            }
        )

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
