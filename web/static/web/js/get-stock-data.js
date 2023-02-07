console.log(stockData);
var isFirstUpdate = true;

async function getStockData(tickerField) {
  const params = new URLSearchParams();
  params.set('ticker', tickerField.value);
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

  const tickerField = document.querySelector('#ticker');
  const volatilityField = document.querySelector('#volatility');
  const priceField = document.querySelector('#price');

  if (!validateTicker(tickerField)) {
    return;
  }

  tickerField.value = tickerField.value.toUpperCase();
  var ticker = tickerField.value

  let cachedStockData = stockData.find(object => object.ticker == ticker);
  if (cachedStockData) {
    var data = cachedStockData.pricing_history;
    console.log('is in!')
    const parentDiv = tickerField.parentNode;
    const targetDiv = parentDiv.querySelector('div');
    tickerField.className = 'form-control is-valid';
    targetDiv.innerHTML = '<a href="#stockModal" data-bs-toggle="modal">Click here for stock information (note: not great on mobile!)</a>'
    console.log('called from cache');
  } else {
    var data = await getStockData(tickerField);
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
  let priceHistory = data.price_history;
  let dailyPercentChanges = data.daily_percent_changes;
  let dates = data.dates;

  stockChart.updatePriceData(dates=dates,priceHistory=priceHistory,dailyPercentChanges=dailyPercentChanges);

  stockData[ticker] = {};
  stockData[ticker]['price'] = data.price;
  stockData[ticker]['volatility'] = volatility / 100.0;
  stockData[ticker]['price_history'] = priceHistory;
  stockData[ticker]['daily_percent_changes'] = dailyPercentChanges;
  stockData[ticker]['dates'] = dates;
};