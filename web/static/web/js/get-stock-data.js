var stock_data = {};
var ticker;
var is_first_update = true;
var price_history_chart = {};

async function getStockData(ticker) {
  const params = new URLSearchParams();
  params.set('ticker', ticker);
  const queryString = params.toString();

  try {
    const response = await fetch(`/stock-data?${queryString}`);
    if (!response.ok) {
      throw response;
    }
    const data = await response.json();
    return data;
  } catch (response) {
    const parentDiv = tickerField.parentNode;
    const targetDiv = parentDiv.querySelector('div');

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
  var called_api = true;
  if (today in stock_data) {
    if (ticker in stock_data[today]) {
      data = stock_data[today][ticker];
      called_api = false;
    } else {
      data = await getStockData(ticker);
      console.log(data);
      if (!data) {
        console.log('error found, cancel operation')
        return;
      }
    }
  } else {
    stock_data[today] = {};
    data = await getStockData(ticker);
    console.log(data);
    if (!data) {
      console.log('error found, cancel operation')
      return;
    }
  }

  var volatility = data.volatility;
  if (called_api) {
    volatility = (data.volatility * 100.0).toFixed(2);
  }

  volatilityField.value = volatility;
  priceField.value = data.price.toFixed(2);
  const price_history = data.price_history;
  const daily_percent_changes = data.daily_percent_changes;
  const dates = data.dates;

  //Set the local variable so we don't call the API each time
  stock_data[today][ticker] = {};
  stock_data[today][ticker]['price'] = data.price;
  stock_data[today][ticker]['volatility'] = volatility;
  stock_data[today][ticker]['price_history'] = price_history;
  stock_data[today][ticker]['daily_percent_changes'] = daily_percent_changes;
  stock_data[today][ticker]['dates'] = dates;

  if (is_first_update) {
    const price_history_canvas = document.getElementById('price-history');
    price_history_chart = new Chart(price_history_canvas, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
              label: 'daily prices',
              data: price_history,
              borderWidth: 1,
              yAxisID: 'y',
          },
          {
            label: 'daily percent change',
            data: daily_percent_changes,
            borderWidth: 1,
            yAxisID: 'y1',
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
  is_first_update = false;
  } else {
    price_history_chart['data']['datasets'][0]['data'] = price_history;
    price_history_chart['data']['datasets'][1]['data'] = daily_percent_changes;
    price_history_chart['data']['labels'] = dates;
    price_history_chart.update();
  };
  validateVolatilityAndPrice(priceField);
  validateVolatilityAndPrice(volatilityField);
};