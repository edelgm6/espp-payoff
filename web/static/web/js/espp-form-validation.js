//TODO: Think we don't need to declare a new ticker_input variable
//as we should already have in the form-fields.js file

function validateTicker() {
    const parentDiv = tickerField.parentNode;
    const validationDiv = parentDiv.querySelector('div');
    var ticker_value = tickerField.value;

    if (ticker_value.length == 0 || ticker_value.length > 5) {
        validationDiv.innerHTML = 'Invalid ticker'
        tickerField.className = 'form-control is-invalid';
        return false;
    }

    let regex = /[^a-z]/i;
    if (regex.test(ticker_value)) {
        validationDiv.innerHTML = 'Invalid ticker'
        tickerField.className = 'form-control is-invalid';
        return false;
    }

    tickerField.className = 'form-control';
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