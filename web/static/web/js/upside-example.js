const upside_example = document.getElementById('upside-example');
const upside_example_chart = new Chart(upside_example, {
  type: 'line',
  data: {
    labels: example_labels,
    datasets: [
        {
            label: '1000 shares cap',
            data: shares_cap_payoffs,
            borderWidth: 1,
            borderColor: primary_color,
            backgroundColor: primary_color,

        },
        {
            label: 'flat return',
            data: flat_payoffs,
            borderWidth: 1,
            borderColor: secondary_color,
            backgroundColor: secondary_color,
        },
        {
            label: 'price above starting price',
            data: upside_payoffs,
            borderWidth: 1,
            borderColor: tertiary_color,
            backgroundColor: tertiary_color,
        }
    ]
  },
  options: base_options
});
