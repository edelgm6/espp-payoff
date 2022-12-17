from django.shortcuts import render
from django.views import View
from web.serializers import PayoffsSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class Index(View):
    template = 'index.html'

    def get(self, request, format=None):
        
        return render(request, self.template)

class Payoffs(APIView):

    def get(self, request, format=None):
        data = {
            'prices': [1,2,3,4,5],
            'payoffs': [150,300,450,600,750]
            }
        serializer = PayoffsSerializer(data=data)
        if serializer.is_valid():
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
