from django.shortcuts import render
from django.views import View
from django.http import Http404
from web.serializers import PayoffsSerializer, ReplicatingPortfolioSeriesSerializer, StockDataSerializer
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

        stock_serializer = StockDataSerializer(data=request.query_params)
        if not stock_serializer.is_valid():
            print(stock_serializer.errors)
            return Response(stock_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            data = stock_serializer.data
            stock = Stock(ticker=data['ticker'],price=data['price'],volatility=data['volatility'])
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
        
        ticker = self.request.GET.get('ticker')

        stock = Stock(ticker=ticker)

        price, volatility, price_history, daily_percent_changes, dates = stock.get_price_and_volatility_data()
        
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
        stock_serializer = StockDataSerializer(data=request.query_params)
        if not stock_serializer.is_valid():
            print(stock_serializer.errors)
            return Response(stock_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            data = stock_serializer.data
            print(data)
            stock = Stock(ticker=data['ticker'],price=data['price'],volatility=data['volatility'])
            espp = ESPP(stock=stock)
            charts = Charts(espp=espp)

            portfolio = charts.get_replicating_portfolio_series()
            payoff = charts.get_payoff_series()
            print(payoff)
            portfolio['payoffs'] = payoff['payoffs']
            serializer = ReplicatingPortfolioSeriesSerializer(data=portfolio)
            if serializer.is_valid():
                return Response(serializer.data)
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
