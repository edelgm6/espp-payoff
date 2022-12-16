from collections import namedtuple
from polygon import RESTClient
from scipy.stats import norm
import KEYS
import statistics
import math
import numpy as np

def get_options_price(current_price,
    strike_price,
    expiration_years,
    risk_free_rate,
    annualized_volatility):

    N = norm.cdf

    d1 = (np.log(current_price/strike_price) +
        (risk_free_rate + annualized_volatility**2/2) *
        expiration_years) / (annualized_volatility*np.sqrt(expiration_years))

    d2 = d1 - annualized_volatility * np.sqrt(expiration_years)

    return current_price * N(d1) - strike_price * np.exp(-risk_free_rate*expiration_years) * N(d2)

def get_stock_history(ticker):
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

def get_annualized_volatility(stock_history):

    closing_prices = [agg.close for agg in stock_history]

    daily_pct_changes = []
    for day in range(1,len(closing_prices)):
        daily_pct_change = closing_prices[day] / closing_prices[day - 1] - 1
        daily_pct_changes.append(daily_pct_change)

    daily_volatility = statistics.pstdev(daily_pct_changes)
    annualized_volatility = daily_volatility * math.sqrt(252)

    return annualized_volatility

def get_payoff_data():

    max_price_model = current_price * 1.5
    min_price_model = current_price * .5

    modeled_price = min_price_model

    espp_value_tuples = []
    Return = namedtuple(
        'Return',
        'modeled_price shares_purchased purchase_value market_value return_dollars return_percent'
        )

    while modeled_price <= max_price_model:
        purchase_price = modeled_price * (1 - PURCHASE_DISCOUNT)
        shares_purchased = min(MAXIMUM_SHARES_PURCHASED, MAXIMUM_INVESTMENT / purchase_price) // 1

        purchase_value = purchase_price * shares_purchased
        market_value = shares_purchased * modeled_price
        return_dollars = market_value - purchase_value
        return_percent = return_dollars / purchase_value - 1

        espp_value_tuples.append(
            Return(
                modeled_price,
                shares_purchased,
                purchase_value,
                market_value,
                return_dollars,
                return_percent
                )
            )

        modeled_price += 1

def get_replicating_portfolio(maximum_shares_purchased,maximum_investment,purchase_discount,annualized_volatility,risk_free_rate):
    ### Logic
    
    ### Replicating portfolio
    ### Shares purchased

    replicating_shares = .15 * MAXIMUM_SHARES_PURCHASED
    replicating_shares_value = replicating_shares * current_price

    print(replicating_shares_value)

    ### Sell 150 call options @ strike of the kink

    returns_kink = min(maximum_investment / maximum_shares_purchased / (1 - purchase_discount),current_price)

    sell_call_option_value = get_options_price(
        current_price=current_price,
        strike_price=returns_kink,
        expiration_years=.5,
        risk_free_rate=.03,
        annualized_volatility=annualized_volatility)

    sell_call_options_value = sell_call_option_value * -replicating_shares

    print(sell_call_option_value)
    print(sell_call_options_value)

    ### Buy 185 call options @ current_price strike

    buy_call_option_value = get_options_price(
        current_price=current_price,
        strike_price=current_price,
        expiration_years=.5,
        risk_free_rate=risk_free_rate,
        annualized_volatility=annualized_volatility)

    buy_replicating_options = (1 / maximum_share_price) * MAXIMUM_INVESTMENT

    buy_call_options_value = buy_call_option_value * buy_replicating_options

    print(buy_call_option_value)
    print(buy_call_options_value)
    total_value = replicating_shares_value + sell_call_options_value + buy_call_options_value

    ReplicatingPortfolio = namedtuple('ReplicatingPortfolio', 'shares_value sell_call_options_value buy_call_options_value total_value')
    replicating_portfolio = ReplicatingPortfolio(replicating_shares_value,sell_call_options_value,buy_call_options_value,total_value)

    return replicating_portfolio

if __name__ == '__main__':

    TICKER = 'SQ'
    RISK_FREE_RATE = .045
    MAXIMUM_INVESTMENT = 12500
    MAXIMUM_SHARES_PURCHASED = 1000
    PURCHASE_DISCOUNT = .15
    # stock_history = get_stock_history(TICKER)
    # annualized_volatility = get_annualized_volatility(stock_history)
    # current_price = stock_history[-1].close
    current_price = 5
    annualized_volatility = .891
    maximum_share_price = current_price * (1 - PURCHASE_DISCOUNT)
    minimum_shares_purchased = MAXIMUM_INVESTMENT / maximum_share_price


    replicating_portfolio = get_replicating_portfolio(
        maximum_shares_purchased=MAXIMUM_SHARES_PURCHASED,
        maximum_investment=MAXIMUM_INVESTMENT,
        purchase_discount=PURCHASE_DISCOUNT,
        annualized_volatility=annualized_volatility,
        risk_free_rate=RISK_FREE_RATE
        )
    
    print(replicating_portfolio)

    
