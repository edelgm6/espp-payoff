const buy_calls = document.getElementById('buy-calls-example');
const buy_calls_example = new Chart(buy_calls, {
  type: 'line',
  data: {
    labels: example_labels,
    datasets: [buy_shares_dataset, payoff_dataset, sell_calls_dataset, buy_calls_dataset]
  },
  options: base_options
});
