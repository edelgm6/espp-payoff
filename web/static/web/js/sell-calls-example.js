const sell_calls = document.getElementById('sell-calls-example');
const sell_calls_example = new Chart(sell_calls, {
  type: 'line',
  data: {
    labels: example_labels,
    datasets: [buy_shares_dataset, payoff_dataset, sell_calls_dataset]
  },
  options: base_options
});
