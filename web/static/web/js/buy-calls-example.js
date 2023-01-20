const buy_calls = document.getElementById('buy-calls-example');
const buy_calls_example = new Chart(buy_calls, {
  type: 'line',
  data: {
    labels: example_labels,
    datasets: [payoff_dataset, buy_shares_dataset, sell_calls_dataset, buy_calls_dataset]
  },
  options: base_options
});

function togglePayoffChart(toggle) {

  volatilitySeriesMap = {
      'buy_stock': buy_shares_dataset,
      'sell_calls': sell_calls_dataset,
      'buy_calls': buy_calls_dataset
  };

  const toggledSeries = volatilitySeriesMap[toggle];
  toggledSeries['hidden'] = !toggledSeries['hidden'];

  var allSeriesHidden = true;
  for (key in volatilitySeriesMap) {
    if (!volatilitySeriesMap[key].hidden) {
      allSeriesHidden = false;
      break;
    }
  }
  
  //Need this top function to correct for slight variances from zero when all are subtracted out
  if (allSeriesHidden) {
    payoff_dataset.data = payoff_dataset.data.map((val, index) => 0);
  } else if (toggledSeries['hidden']) {
    payoff_dataset.data = payoff_dataset.data.map((val, index) => val - toggledSeries.data[index]);
  } else {
    payoff_dataset.data = payoff_dataset.data.map((val, index) => val + toggledSeries.data[index]);
  };
    
  buy_calls_example.update();
}
