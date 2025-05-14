document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    let currentInput = '';
    let lastInput = '';
    let resetNext = false;

    function isOperator(char) {
        return ['+', '-', '*', '/'].includes(char);
    }

    function updateDisplay() {
        display.value = currentInput;
    }

    function clear() {
        currentInput = '';
        lastInput = '';
        resetNext = false;
        updateDisplay();
    }

    function backspace() {
        if (resetNext) {
            clear();
            return;
        }
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    }

    function appendDigit(digit) {
        if (resetNext) {
            currentInput = digit;
            resetNext = false;
        } else {
            currentInput += digit;
        }
        updateDisplay();
    }

    function appendOperator(operator) {
        if (resetNext) {
            resetNext = false;
        }
        if (currentInput === '') {
            if (operator === '-') {
                currentInput = operator;
            }
            updateDisplay();
            return;
        }
        if (isOperator(currentInput.slice(-1))) {
            currentInput = currentInput.slice(0, -1) + operator;
        } else {
            currentInput += operator;
        }
        updateDisplay();
    }

    function calculate() {
        try {
            // Evaluate expression respecting order of operations using Function constructor
            // Replace division and multiplication symbols for eval safety
            let expression = currentInput;
            // Prevent unsafe characters
            if (/[^0-9+\-*/.]/.test(expression)) {
                throw new Error('Invalid characters in expression');
            }
            // Evaluate expression
            let result = Function('"use strict";return (' + expression + ')')();
            if (result === Infinity || result === -Infinity) {
                throw new Error('Division by zero');
            }
            currentInput = result.toString();
            resetNext = true;
            updateDisplay();
        } catch (e) {
            currentInput = 'Error';
            resetNext = true;
            updateDisplay();
        }
    }

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            const value = button.getAttribute('data-value');

            switch (action) {
                case 'digit':
                    appendDigit(value);
                    break;
                case 'operator':
                    appendOperator(value);
                    break;
                case 'clear':
                    clear();
                    break;
                case 'backspace':
                    backspace();
                    break;
                case 'equals':
                    calculate();
                    break;
            }
        });
    });

    clear();
});
