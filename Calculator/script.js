const display = document.getElementById('display');

function appendToDisplay(input){
    display.value += input;
}

function clearDisplay(){
    display.value = '';
}

function backspace(){
    let displayValue = display.value;
    let newValue = displayValue.slice(0, -1);
    display.value = newValue;}

function equals() {
    try {
        let result = eval(display.value);
        let roundedResult = parseFloat(result.toFixed(5));
        display.value = roundedResult;
    } catch (e) {
        display.value = 'Error';
    }
}function squareRoot() {
    try {
        let result = Math.sqrt(parseFloat(display.value));
        let roundedResult = parseFloat(result.toFixed(5));
        display.value = roundedResult;
    } catch (e) {
        display.value = 'Error';
    }
}
