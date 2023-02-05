class EsppChart {
    primaryColor = '#251605'
    secondaryColor = '#C57B57'
    tertiaryColor = '#F1AB86'
    fourthColor = '#F7DBA7'
    fifthColor = '#9CAFB7'

    highlightColor = '#FFD166'
    primaryGray = '#B4B7B7'
    secondaryGray = '#999E9E'

    constructor(canvasId,title=null) {

        this.canvas = document.getElementById(canvasId);
        this.title = title;
    }

    updateChart() {
        this.chart.update();
    }
}