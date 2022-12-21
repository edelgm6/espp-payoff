from django.shortcuts import render
from django.views import View
from django.http import Http404
from web.serializers import PayoffsSerializer, ReplicatingPortfolioSeriesSerializer
from web.espp import ESPP
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
        print(data)
        serializer = PayoffsSerializer(data=data)
        if serializer.is_valid():
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReplicatingPortfolio(APIView):

    def get(self, request, format=None):
        
        espp = ESPP()
        
        data = espp.get_replication_portfolio_series()
        print(data)
        serializer = ReplicatingPortfolioSeriesSerializer(data=data)
        if serializer.is_valid():
            
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
