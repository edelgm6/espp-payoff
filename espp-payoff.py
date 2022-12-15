from polygon import RESTClient
from scipy.stats import norm
import KEYS
import statistics
import math
import numpy as np


def black_scholes_call(
    current_price,
    strike_price,
    expiration_years,
    risk_free_rate,
    annualized_volatility):

    N = norm.cdf

    d1 = (np.log(current_price/strike_price) + (risk_free_rate + annualized_volatility**2/2)*expiration_years) / (annualized_volatility*np.sqrt(expiration_years))
    d2 = d1 - annualized_volatility * np.sqrt(expiration_years)
    return current_price * N(d1) - strike_price * np.exp(-risk_free_rate*expiration_years)* N(d2)

if __name__ == '__main__':
    client = RESTClient(KEYS.POLYGON_API_KEY)

    response = client.get_aggs(
        ticker='SQ',
        multiplier=1,
        timespan='day',
        from_='2021-12-15',
        to='2022-12-14',
        adjusted=True,
        sort='asc'
    )

    closing_prices = [agg.close for agg in response]

    daily_pct_changes = []
    for day in range(1,len(closing_prices)):
        daily_pct_change = closing_prices[day] / closing_prices[day - 1] - 1
        daily_pct_changes.append(daily_pct_change)

    daily_volatility = statistics.pstdev(daily_pct_changes)
    annualized_volatility = daily_volatility * math.sqrt(252)

    print(daily_volatility)
    print(annualized_volatility)

    call_price = black_scholes_call(79,15,.5,.03,annualized_volatility)
    print(call_price)
