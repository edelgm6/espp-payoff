console.log(stockData);
var ticker;
var isFirstUpdate = true;
var priceHistoryChart = {};

async function getStockData(ticker) {
  const tickerField = document.querySelector('#ticker');
  const params = new URLSearchParams();
  params.set('ticker', ticker);
  const queryString = params.toString();
  const parentDiv = tickerField.parentNode;
  const targetDiv = parentDiv.querySelector('div');


  try {
    const response = await fetch(`/stock-data/?${queryString}`);
    if (!response.ok) {
      throw response;
    }
    const data = await response.json();
    tickerField.className = 'form-control is-valid';
    targetDiv.innerHTML = '<a href="#stockModal" data-bs-toggle="modal">Click here for stock information</a>'
    targetDiv.className = 'valid-feedback'
    return data;
  } catch (response) {
    console.log('caught response');
    if (response.status == 429) {
      targetDiv.innerHTML = 'Too many requests, try again in a minute!'
    } else {
      targetDiv.innerHTML = 'Ticker not found'
    }
    console.log('invalid form control');
    console.log(targetDiv.innerHTML);
    tickerField.className = 'form-control is-invalid';
    targetDiv.className = 'invalid-feedback'
    return false;
  }
}

async function populateStockChart(event) {
  event.preventDefault();

  if (!validateTicker()) {
    return;
  }

  tickerField.value = tickerField.value.toUpperCase();
  ticker = tickerField.value

  let cachedStockData = stockData.find(object => object.ticker == ticker);
  if (cachedStockData) {
    var data = cachedStockData.pricing_history;
    console.log('is in!')
    const parentDiv = tickerField.parentNode;
    const targetDiv = parentDiv.querySelector('div');
    tickerField.className = 'form-control is-valid';
    targetDiv.innerHTML = '<a href="#stockModal" data-bs-toggle="modal">Click here for stock information</a>'
    console.log('called from cache');
  } else {
    var data = await getStockData(ticker);
    console.log(data);
    if (!data) {
      console.log('error found, cancel operation')
      return;
    }
    console.log('called api');
  }


  var volatility = (data.volatility * 100.0).toFixed(2);
  volatilityField.value = volatility;
  priceField.value = data.price.toFixed(2);
  const priceHistory = data.price_history;
  const dailyPercentChanges = data.daily_percent_changes;
  const dates = data.dates;

  //Set the local variable so we don't call the API each time
  //TODO: THink I need to refactor the StockData model to use lists
  //instead of a json field for each of dates and daily_percent_changes
  stockData[ticker] = {};
  stockData[ticker]['price'] = data.price;
  stockData[ticker]['volatility'] = volatility / 100.0;
  stockData[ticker]['price_history'] = priceHistory;
  stockData[ticker]['daily_percent_changes'] = dailyPercentChanges;
  stockData[ticker]['dates'] = dates;

  if (isFirstUpdate) {
    const priceHistoryCanvas = document.getElementById('price-history');
    priceHistoryChart = new Chart(priceHistoryCanvas, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
              label: 'daily prices',
              data: priceHistory,
              borderWidth: 1,
              yAxisID: 'y',
              borderColor: fourthColor,
              backgroundColor: fourthColor
          },
          {
            label: 'daily percent change',
            data: dailyPercentChanges,
            borderWidth: 1,
            yAxisID: 'y1',
            borderColor: fifthColor,
            backgroundColor: fifthColor
          },
        ]
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
        },
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false
            },
          },
          y: {
            title: {
              display: true,
              text: 'Stock price'
            },
            ticks: {
              callback: function(value,index,ticks) {
                return '$' + value.toLocaleString();
              }
            }
          },
          y1: {
            title: {
              display: true,
              text: 'Daily percent change'
            },
            grid: {
              display: false
            },
            position: 'right',
            ticks: {
              callback: function(value,index,ticks) {
                return (value * 100).toFixed(2) + '%';
              }
            },
            min: -.2,
            max: .2
          }
        }
      }
    });
  isFirstUpdate = false;
  } else {
    console.log('updated modal');
    priceHistoryChart['data']['datasets'][0]['data'] = priceHistory;
    priceHistoryChart['data']['datasets'][1]['data'] = dailyPercentChanges;
    priceHistoryChart['data']['labels'] = dates;
    priceHistoryChart.update();
  };
  validateVolatilityAndPrice(priceField);
  validateVolatilityAndPrice(volatilityField);
};