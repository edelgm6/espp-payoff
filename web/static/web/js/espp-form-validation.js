document.getElementById('price').addEventListener('input', function() {
    toggleGetStockDataButton();
});
document.getElementById('volatility').addEventListener('input', function() {
    toggleGetStockDataButton();
});

function toggleGetStockDataButton(turnButtonOff=null) {
    const volatilityField = document.querySelector('#volatility');
    const priceField = document.querySelector('#price');
    const stockButton = document.querySelector('#stock-button');

    if (turnButtonOff) {
        stockButton.className = 'btn btn-sm btn-outline-success';
        return;
    }

    if (volatilityField.value == '' || priceField.value == '') {
        stockButton.className = 'btn btn-sm btn-success';
    } else {
        stockButton.className = 'btn btn-sm btn-outline-success';
    }
}



function validateTicker(tickerField) {
    const parentDiv = tickerField.parentNode;
    const validationDiv = parentDiv.querySelector('div');
    var tickerValue = tickerField.value;

    tickerField.className = 'form-control is-valid';
    validationDiv.className = 'valid-feedback';

    if (tickerValue.length == 0 || tickerValue.length > 5) {
        console.log('zero length');
        validationDiv.innerHTML = 'Invalid ticker';
        tickerField.className = 'form-control is-invalid';
        validationDiv.className = 'invalid-feedback';
        return false;
    }

    let regex = /[^a-z]/i;
    if (regex.test(tickerValue)) {
        validationDiv.innerHTML = 'Invalid ticker';
        tickerField.className = 'form-control is-invalid';
        validationDiv.className = 'invalid-feedback';
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