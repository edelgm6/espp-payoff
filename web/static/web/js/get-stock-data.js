//TODO: Put common variables in a single JS file

const form = document.querySelector('form');
const tickerField = document.querySelector('#ticker');
const volatilityField = document.querySelector('#volatility');
const priceField = document.querySelector('#price');
var is_first_update = true;
var price_history_chart = {};

function getStockData(event) {
  event.preventDefault();

  const params = new URLSearchParams();
  params.set('ticker', tickerField.value);
  const queryString = params.toString();

  fetch(`/stock-data?${queryString}`)
    .then(response => response.json())
    .then(data => {
      volatilityField.value = data.volatility;
      priceField.value = data.price;
      const price_history = data.price_history;
      const daily_percent_changes = data.daily_percent_changes;
      const dates = data.dates;

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
              position: 'left'
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
              y1: {
                grid: {
                  display: false
                },
                position: 'right',
                ticks: {
                  callback: function(value,index,ticks) {
                    return (value * 100).toFixed(2) + '%';
                  }
                },
                min: -.3,
                max: .3
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
});
};