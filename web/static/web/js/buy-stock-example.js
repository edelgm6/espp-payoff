const buy_stock = document.getElementById('buy-stock-example');
const buy_stock_example = new Chart(buy_stock, {
  type: 'line',
  data: {
    labels: example_labels,
    datasets: [buy_shares_dataset, payoff_dataset]
  },
  options: base_options
});
