//TODO: Think we don't need to declare a new ticker_input variable
//as we should already have in the form-fields.js file

function validateTicker() {
    const parentDiv = tickerField.parentNode;
    const validationDiv = parentDiv.querySelector('div');
    var tickerValue = tickerField.value;

    if (tickerValue.length == 0 || tickerValue.length > 5) {
        validationDiv.innerHTML = 'Invalid ticker'
        tickerField.className = 'form-control is-invalid';
        return false;
    }

    let regex = /[^a-z]/i;
    if (regex.test(tickerValue)) {
        validationDiv.innerHTML = 'Invalid ticker'
        tickerField.className = 'form-control is-invalid';
        return false;
    }

    tickerField.className = 'form-control';
    return true;
}

function validateVolatilityAndPriceAndSharesCap(input) {
    var inputValue = Number(input.value);

    if (isNaN(inputValue) || inputValue <= 0) {
        input.className = 'form-control is-invalid';
        return false;
    }
    input.className = 'form-control';
    return true;
}