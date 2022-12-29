const form = document.querySelector('form');
const tickerField = document.querySelector('#ticker');
const volatilityField = document.querySelector('#volatility');
const priceField = document.querySelector('#price');

form.addEventListener('submit', event => {
  event.preventDefault();

  const params = new URLSearchParams();
  params.set('ticker', tickerField.value);
  const queryString = params.toString();

  fetch(`/stock-data?${queryString}`)
    .then(response => response.json())
    .then(data => {
      volatilityField.value = data.volatility;
      priceField.value = data.price;
    });
});
