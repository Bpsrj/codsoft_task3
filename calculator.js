window.onload = function () {
    const display = document.querySelector('.display');
    let currentInput = "";

    
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            const type = button.getAttribute('data-type');

            if (type === "c1" || type === "a1" || value === "π") {
                handleTap(value);
            } else if (type === "b1") {
                handleAction(value);
            }
        });
    });

    function handleTap(char) {
        if (display.textContent === "0") {
            currentInput = char;
        } else {
            if (char === 'π' && /[0-9π)]$/.test(currentInput)) {
                currentInput += '*π';
            } else {
                currentInput += char;
            }
        }
        display.textContent = currentInput;
    }

    function handleAction(b1) {
        if (b1 === "AC") {
            currentInput = "";
            display.textContent = "0";
        } else if (b1 === "DEL") {
            currentInput = currentInput.slice(0, -1);
            display.textContent = currentInput || "0";
        } else if (b1 === "=") {
            calculate();
        }
    }

    function replacePi(expr) {
        return expr
            .replace(/([π])([π])/g, 'Math.PI*Math.PI')
            .replace(/([0-9.])π/g, '$1*' + Math.PI.toFixed(4))
            .replace(/π([0-9.])/g, Math.PI.toFixed(4) + '*$1')
            .replace(/π/g, Math.PI.toFixed(4));
    }

    function calculate() {
        try {
            let expr = currentInput.trim().replace(/[\+\-\*\/%\.]+$/, "");
            if (!expr || !/[\dπ]/.test(expr)) {
                display.textContent = "0";
                currentInput = "";
                return;
            }

            const finalExpr = replacePi(expr);
            const operators = /[+\-*/%]/g;
            const parts = finalExpr.split(operators).map(Number);
            const ops = finalExpr.match(operators);

            if (!ops || parts.length !== ops.length + 1) {
                display.textContent = parts[0].toString();
                currentInput = parts[0].toString();
                return;
            }

            let result = parts[0];
            for (let i = 1; i < parts.length; i++) {
                switch (ops[i - 1]) {
                    case '+': result += parts[i]; break;
                    case '-': result -= parts[i]; break;
                    case '*': result *= parts[i]; break;
                    case '/': result /= parts[i]; break;
                    case '%': result %= parts[i]; break;
                }
            }

            currentInput = result.toString();
            display.textContent = currentInput;
        } catch (error) {
            display.textContent = "Error";
            currentInput = "";
        }
    }
};
