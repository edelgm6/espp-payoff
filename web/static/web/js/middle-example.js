const middle_example = document.getElementById('middle-example');
const middle_example_chart = new Chart(middle_example, {
  type: 'line',
  data: {
    labels: example_labels,
    datasets: [
        {
            label: '1000 shares cap',
            data: shares_cap_payoffs,
            borderWidth: 1,
            borderColor: primary_gray,
            backgroundColor: primary_gray,

        },
        {
            label: 'flat return',
            data: flat_payoffs,
            borderWidth: 1,
            borderColor: highlight_color,
            backgroundColor: highlight_color,
        },
        {
            label: 'price above starting price',
            data: upside_payoffs,
            borderWidth: 1,
            borderColor: secondary_gray,
            backgroundColor: secondary_gray,
        }
    ]
  },
  options: base_options
});
