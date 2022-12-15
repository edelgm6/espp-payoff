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

def get_options_price(ticker, risk_free_rate):
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

if __name__ == '__main__':

    TICKER = 'SQ'
    RISK_FREE_RATE = .03
    MAXIMUM_INVESTMENT = 12500
    MAXIMUM_SHARES_PURCHASED = 1000
    CURRENT_PRICE = 79
    PURCHASE_DISCOUNT = .15

    max_price_model = CURRENT_PRICE * 1.5
    min_price_model = CURRENT_PRICE * .5

    modeled_price = min_price_model

    espp_value_tuples = []
    while modeled_price <= max_price_model:
        print(modeled_price)
        purchase_price = modeled_price * (1 - PURCHASE_DISCOUNT)
        shares_purchased = min(MAXIMUM_SHARES_PURCHASED, MAXIMUM_INVESTMENT / purchase_price) // 1

        purchase_value = purchase_price * shares_purchased
        market_value = shares_purchased * modeled_price
        return_dollars = market_value - purchase_value
        return_percent = return_dollars / purchase_value - 1
        # espp_value_tuples.append(modeled_price,shares_purchased,purchase_value,market_value,return_dollars,return_percent)

        # print(shares_purchased)
        # print(purchase_value)
        # print(market_value)
        # print(market_value / purchase_value - 1)

        modeled_price += 1
