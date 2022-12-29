from django.shortcuts import render
from django.views import View
from django.http import Http404
from web.serializers import PayoffsSerializer, ReplicatingPortfolioSeriesSerializer
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
        
        espp = ESPP()
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

        # volatility = stock.get_annualized_volatility()
        
        return Response({'volatility': .1, 'price': 105.33})

        # espp = ESPP()
        # charts = Charts(espp=espp)
        # portfolio = charts.get_replicating_portfolio_series()
        # payoff = charts.get_payoff_series()
        # portfolio['payoffs'] = payoff['payoffs']
        # serializer = ReplicatingPortfolioSeriesSerializer(data=portfolio)
        # if serializer.is_valid():
        #     return Response(serializer.data)
        # print(serializer.errors)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReplicatingPortfolio(APIView):

    def get(self, request, format=None):
        
        espp = ESPP()
        charts = Charts(espp=espp)
        portfolio = charts.get_replicating_portfolio_series()
        payoff = charts.get_payoff_series()
        portfolio['payoffs'] = payoff['payoffs']
        serializer = ReplicatingPortfolioSeriesSerializer(data=portfolio)
        if serializer.is_valid():
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
