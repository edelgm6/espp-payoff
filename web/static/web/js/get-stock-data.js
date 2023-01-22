var stockData = {};
var ticker;
var isFirstUpdate = true;
var priceHistoryChart = {};

async function getStockData(ticker) {
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
    return data;
  } catch (response) {
    if (response.status == 429) {
      targetDiv.innerHTML = 'Too many requests, try again in a minute!'
    } else {
      targetDiv.innerHTML = 'Ticker not found'
    }
    tickerField.className = 'form-control is-invalid';
    return false;
  }
}

async function populateStockChart(event) {
  event.preventDefault();

  if (!validateTicker()) {
    return;
  }

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  
  today = mm + '-' + dd + '-' + yyyy;
  tickerField.value = tickerField.value.toUpperCase();
  ticker = tickerField.value

  var data = {};
  var calledApi = true;
  if (today in stockData) {
    if (ticker in stockData[today]) {
      data = stockData[today][ticker];
      const parentDiv = tickerField.parentNode;
      const targetDiv = parentDiv.querySelector('div');
      tickerField.className = 'form-control is-valid';
      targetDiv.innerHTML = '<a href="#stockModal" data-bs-toggle="modal">Click here for stock information</a>'
      calledApi = false;
    } else {
      data = await getStockData(ticker);
      console.log(data);
      if (!data) {
        console.log('error found, cancel operation')
        return;
      }
    }
  } else {
    stockData[today] = {};
    data = await getStockData(ticker);
    console.log(data);
    if (!data) {
      console.log('error found, cancel operation')
      return;
    }
  }

  var volatility = data.volatility;
  if (calledApi) {
    volatility = (data.volatility * 100.0).toFixed(2);
  }

  volatilityField.value = volatility;
  priceField.value = data.price.toFixed(2);
  const priceHistory = data.price_history;
  const dailyPercentChanges = data.daily_percent_changes;
  const dates = data.dates;

  //Set the local variable so we don't call the API each time
  stockData[today][ticker] = {};
  stockData[today][ticker]['price'] = data.price;
  stockData[today][ticker]['volatility'] = volatility;
  stockData[today][ticker]['price_history'] = priceHistory;
  stockData[today][ticker]['daily_percent_changes'] = dailyPercentChanges;
  stockData[today][ticker]['dates'] = dates;

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