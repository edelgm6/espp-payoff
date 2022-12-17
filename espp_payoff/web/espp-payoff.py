from collections import namedtuple
from polygon import RESTClient
from scipy.stats import norm
from django.conf import settings
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
    client = RESTClient(settings.POLYGON_API_KEY)

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

def get_payoff_data(current_price,purchase_discount,maximum_shares_purchased,maximum_investment):

    max_price_model = current_price * 1.5
    min_price_model = 1 #current_price * .5

    modeled_price = min_price_model

    espp_value_tuples = []
    Return = namedtuple(
        'Return',
        'modeled_price shares_purchased purchase_value market_value return_dollars return_percent'
        )

    max_purchase_price = current_price * (1 - purchase_discount)

    while modeled_price <= max_price_model:
        purchase_price = min(modeled_price * (1 - purchase_discount), max_purchase_price)

        shares_purchased = min(maximum_shares_purchased, maximum_investment / purchase_price)

        purchase_value = purchase_price * shares_purchased
        market_value = modeled_price * shares_purchased
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

    return espp_value_tuples

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

def create_chart_page(payoffs):

    labels = [payoff.modeled_price for payoff in payoffs]
    returns = [payoff.return_dollars for payoff in payoffs]
    print(labels)


    template = """
        <div>
        <canvas id="myChart"></canvas>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

        <script>
        const ctx = document.getElementById('myChart');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118],
                datasets: [{
                    label: 'payoff',
                    data: [150.0, 300.0, 450.0, 600.0, 750.0, 900.0, 1050.0, 1200.0, 1350.000000000001, 1500.0, 1650.0, 1800.0, 1950.0000000000018, 2100.0, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411784, 2205.8823529411748, 2205.8823529411784, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411766, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411766, 2205.8823529411784, 2205.8823529411766, 2205.8823529411748, 2205.8823529411766, 2205.8823529411784, 2205.8823529411784, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2392.0327624720794, 2578.1831720029804, 2764.3335815338814, 2950.4839910647825, 3136.6344005956835, 3322.7848101265845, 3508.9352196574855, 3695.0856291883865, 3881.2360387192875, 4067.3864482501886, 4253.536857781088, 4439.687267311991, 4625.83767684289, 4811.988086373793, 4998.138495904692, 5184.288905435595, 5370.439314966494, 5556.589724497397, 5742.740134028296, 5928.890543559199, 6115.040953090098, 6301.191362621001, 6487.3417721519, 6673.492181682803, 6859.642591213702, 7045.793000744605, 7231.943410275504, 7418.093819806407, 7604.244229337306, 7790.394638868209, 7976.545048399108, 8162.695457930011, 8348.84586746091, 8534.996276991813, 8721.146686522712, 8907.297096053615, 9093.447505584514, 9279.597915115417, 9465.748324646316],
                    borderWidth: 1
                }]
                },
                options: {
                scales: {
                    y: {
                    beginAtZero: true
                    }
                }
            }
        });
        </script>
    """
    
    f = open('/Users/garrettedel/Desktop/espp-payoff/test-chart.html', 'w')
    f.write(template)
    f.close()


if __name__ == '__main__':

    TICKER = 'SQ'
    RISK_FREE_RATE = .045
    MAXIMUM_INVESTMENT = 12500
    MAXIMUM_SHARES_PURCHASED = 1000
    PURCHASE_DISCOUNT = .15
    # stock_history = get_stock_history(TICKER)
    # annualized_volatility = get_annualized_volatility(stock_history)
    # current_price = stock_history[-1].close
    current_price = 79
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
    payoff_data = get_payoff_data(current_price=current_price,purchase_discount=PURCHASE_DISCOUNT,maximum_shares_purchased=MAXIMUM_SHARES_PURCHASED,maximum_investment=MAXIMUM_INVESTMENT)
    create_chart_page(payoff_data)

    
