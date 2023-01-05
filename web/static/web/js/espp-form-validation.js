function validateTicker() {
    const ticker_input = document.querySelector('#ticker');
    var ticker_value = ticker_input.value;

    if (ticker_value.length == 0 || ticker_value.length > 5) {
        ticker_input.className = 'form-control is-invalid';
        return false;
    }

    let regex = /[^a-z]/i;
    if (regex.test(ticker_value)) {
        ticker_input.className = 'form-control is-invalid';
        return false;
    }

    ticker_input.className = 'form-control';
    return true;
}

function validateVolatilityAndPrice(input) {
    var input_value = Number(input.value);

    if (isNaN(input_value) || input_value <= 0) {
        input.className = 'form-control is-invalid';
        return false;
    }
    input.className = 'form-control';
    return true;
}