base_options = {
  scales: {
    x: {
      title: {
        display: true,
        text: 'Stock price'
      },
      ticks: {
        callback: function(value,index,ticks) {
          return '$' + value.toFixed(2).toLocaleString();
        }
      },
      grid: {
        display: false
      }
    },
    y: {
      title: {
        display: true,
        text: 'Payoff'
      },
      ticks: {
        callback: function(value,index,ticks) {
          return '$' + value.toLocaleString();
        }
      }
    }
  }
}

example_labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]

shares_cap_payoffs = [150.0, 300.0, 450.0, 600.0, 750.0, 900.0, 1050.0, 1200.0, 1350.000000000001, 1500.0, 1650.0, 1800.0, 1950.0000000000018, 2100.0, 2205.8823529411784]

flat_payoffs = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411784, 2205.8823529411748, 2205.8823529411784, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766]

upside_payoffs = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,2205.8823529411766,2731.09243697479, 3256.3025210084033, 3781.5126050420167, 4306.72268907563, 4831.9327731092435, 5357.142857142857]

primary_color = '#36BCC9'
secondary_color = '#3673C9'
tertiary_color = '#36C98C'

highlight_color = '#FDF002'
primary_gray = '#B4B7B7'
secondary_gray = '#999E9E'
