base_options = {
  maintainAspectRatio: false,
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

base_options_no_legend = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
        display: false
    }
  },
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

example_labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]

shares_cap_payoffs = [0, 150.0, 300.0, 450.0, 600.0, 750.0, 900.0, 1050.0, 1200.0, 1350.000000000001, 1500.0, 1650.0, 1800.0, 1950.0000000000018, 2100.0, 2205.8823529411784]

flat_payoffs = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411784, 2205.8823529411748, 2205.8823529411784, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766, 2205.8823529411784, 2205.8823529411766, 2205.8823529411766, 2205.8823529411766]

upside_payoffs = [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,2205.8823529411766,2731.09243697479, 3256.3025210084033, 3781.5126050420167, 4306.72268907563, 4831.9327731092435, 5357.142857142857]

const primary_color = '#251605'
const secondary_color = '#C57B57'
const tertiary_color = '#F1AB86'
const fourth_color = '#F7DBA7'
const fifth_color = '#9CAFB7'

const highlight_color = '#FDF002'
const primary_gray = '#B4B7B7'
const secondary_gray = '#999E9E'

buy_shares_dataset = {
  label: 'buy 150 shares',
  data: [0, 150.0, 300.0, 450.0, 600.0, 750.0, 900.0, 1050.0, 1200.0, 1350.0, 1500.0, 1650.0, 1800.0, 1950.0, 2100.0, 2250.0,2400.0,2550.0,2700,2850,3000,3150,3300,3450,3600,3750,3900,4050,4200,4350,4500,4650,4800,4950,5100],
  borderWidth: 1,
  borderColor: secondary_color,
  backgroundColor: secondary_color
}

sell_calls_dataset = {
  label: 'sell 150 calls',
  data: [-0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -0.0, -44.11764705882337, -194.11764705882337, -344.11764705882337, -494.11764705882337, -644.1176470588234, -794.1176470588234, -944.1176470588234, -1094.1176470588234, -1244.1176470588234, -1394.1176470588234, -1544.1176470588234, -1694.1176470588234, -1844.1176470588234, -1994.1176470588234, -2144.1176470588234, -2294.1176470588234, -2444.1176470588234, -2594.1176470588234, -2744.1176470588234, -2894.1176470588234],
  borderWidth: 1,
  borderColor: tertiary_color,
  backgroundColor: tertiary_color
}

buy_calls_dataset = {
  label: 'buy 525 calls',
  data: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 525.2100840336134, 1050.4201680672268, 1575.6302521008402, 2100.8403361344535, 2626.050420168067, 3151.2605042016803],
  borderWidth: 1,
  borderColor: fourth_color,
  backgroundColor: fourth_color
}

payoff_dataset = {
  label: 'payoff',
  data: buy_shares_dataset.data.map((val, index) => val + sell_calls_dataset.data[index] + buy_calls_dataset.data[index]),
  borderWidth: 1,
  borderColor: primary_color,
  backgroundColor: primary_color
}