from django.db import models

class StockData(models.Model):
    date_added = models.DateField(auto_now_add=True)
    ticker = models.CharField(max_length=5)
    pricing_history = models.JSONField()

    class Meta:
        unique_together = [['ticker', 'date_added']]

    def __str__(self):
        return str(self.date_added) + ' ' + self.ticker
