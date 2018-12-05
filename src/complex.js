"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
class Complex {
    constructor(a) {
        this.numbers = [];
        if (typeof a === 'string') {
            this.numbers[0] = parser_1.default().evaluate(a).get();
        }
        else {
            this.numbers[0] = [a[0], a[1]];
        }
    }
    stringify() {
        const x = this.numbers[0];
        if (x[1] === 0)
            return String(x[0]);
        if (x[0] === 0)
            return (x[1] === 1 ? '' : x[1] === -1 ? '-' : String(x[1])) + 'i';
        if (x[1] === 1 || x[1] === -1) {
            return x[0] + (x[1] > 0 ? '+' : '-') + 'i';
        }
        return x.join(x[1] > 0 ? '+' : '') + 'i';
    }
    add(...a) {
        const result = this.numbers[0];
        for (const x of a) {
            if (x instanceof Complex) {
                result[0] += x.numbers[0][0];
                result[1] += x.numbers[0][1];
            }
            else {
                result[0] += x[0];
                result[1] += x[1];
            }
        }
        this.numbers[0] = result;
        return this;
    }
    subtract(...a) {
        const result = this.numbers[0];
        for (const x of a) {
            if (x instanceof Complex) {
                result[0] -= x.numbers[0][0];
                result[1] -= x.numbers[0][1];
            }
            else {
                result[0] -= x[0];
                result[1] -= x[1];
            }
        }
        this.numbers[0] = result;
        return this;
    }
    multiply(...a) {
        for (const x of a) {
            const b = this.numbers[0];
            if (x instanceof Complex) {
                this.numbers[0] = [
                    this.numbers[0][0] * x.numbers[0][0] - b[1] * x.numbers[0][1],
                    this.numbers[0][0] * x.numbers[0][1] + b[1] * x.numbers[0][0]
                ];
            }
            else {
                this.numbers[0] = [
                    b[0] * x[0] - b[1] * x[1],
                    b[0] * x[1] + b[1] * x[0]
                ];
            }
        }
        return this;
    }
    divide(a) {
        const c = (a instanceof Complex) ? a.get() : a;
        const x = this.numbers[0][0];
        const y = this.numbers[0][1];
        const r1 = Math.hypot(x, y);
        const r2 = Math.hypot(c[0], c[1]);
        if (r2 === 0)
            throw new Error('You cannot devide by 0');
        const theta1 = Math.atan2(y, x);
        const theta2 = Math.atan2(c[1], c[0]);
        const r = r1 / r2;
        const theta = theta1 - theta2;
        return new Complex([r * Math.cos(theta), r * Math.sin(theta)]);
    }
    power(a) {
        const x = this.numbers[0][0];
        const y = this.numbers[0][1];
        const i = (a instanceof Complex) ? a.numbers[0][0] : a[0];
        const j = (a instanceof Complex) ? a.numbers[0][1] : a[1];
        if (j === 0) {
            if (y === 0) {
                if (x === 0 && i === 0) {
                    throw new Error('You cannot rise 0 to the power of 0');
                }
                return new Complex([x ** i, 0]);
            }
            else {
                return new Complex([Math.cos(Math.atan2(y, x) * i), Math.sin(Math.atan2(y, x) * i)]).multiply([Math.hypot(x, y) ** i, 0]);
            }
        }
        const one = (Math.E ** (-j * Math.atan2(y, x))) * Math.hypot(x, y) ** i;
        const two = j * Math.log(Math.hypot(x, y));
        return new Complex([one * Math.cos(two + Math.atan2(y, x) * i), one * Math.sin(two + Math.atan2(y, x) * i)]);
    }
    root(a = 2) {
        if (a instanceof Complex) {
            if (a.numbers[0][1] !== 0) {
                throw new TypeError('Complex number cannot have imaginary part. Use `power` instead');
            }
            a = a.numbers[0][0];
        }
        const r = this.abs();
        const x = this.numbers[0];
        if (!Number.isInteger(a) || a < 2)
            throw new TypeError(`The parameter has to be a integer bigger than 1. Got '${a}' instead.`);
        if (x[0] === 0 && x[1] === 0) {
            throw new RangeError('Complex number can\'t be zero');
        }
        const angle = Math.atan2(x[1], x[0]);
        const com = new Complex([0, 0]);
        const R = Math.pow(r, 1 / a);
        for (let k = 0; k <= a - 1; k++) {
            com.numbers.push([R * Math.cos((angle + 2 * k * Math.PI) / a), R * Math.sin((angle + 2 * k * Math.PI) / a)]);
        }
        com.numbers.shift();
        return com;
    }
    ln() {
        return new Complex([Math.log(this.abs()), Math.atan2(this.numbers[0][1], this.numbers[0][0])]);
    }
    log(a = Math.E) {
        const x = (a instanceof Complex) ? a.numbers[0] : (typeof a === 'number') ? [a, 0] : [a[0], a[1]];
        if (x[1] === 0) {
            if (x[0] === Math.E) {
                return this.ln();
            }
            return this.ln().divide([Math.log(x[0]), 0]);
        }
        return this.ln().divide(new Complex(x).ln());
    }
    sin() {
        return new Complex([
            Math.sin(this.numbers[0][0]) * Math.cosh(this.numbers[0][1]),
            Math.cos(this.numbers[0][0]) * Math.sinh(this.numbers[0][1])
        ]);
    }
    cos() {
        return new Complex([
            Math.cos(this.numbers[0][0]) * Math.cosh(this.numbers[0][1]),
            -Math.sin(this.numbers[0][0]) * Math.sinh(this.numbers[0][1])
        ]);
    }
    tan() {
        const x = this.numbers[0][0];
        const y = this.numbers[0][1];
        const sin = new Complex([x, y]).sin().get();
        const cos = new Complex([x, y]).cos().get();
        return new Complex(sin).divide(cos);
    }
    cot() {
        return new Complex(this.numbers[0]).cos().divide(new Complex(this.numbers[0]).sin());
    }
    sec() {
        return new Complex([1, 0]).divide(this.cos());
    }
    csc() {
        return new Complex([1, 0]).divide(this.sin());
    }
    asin() {
        const x = this.numbers[0][0];
        const y = this.numbers[0][1];
        return new Complex([(y ** 2) - (x ** 2) + 1, -2 * x * y]).power([.5, 0]).add([-y, x]).ln().divide([0, 1]);
    }
    acos() {
        return new Complex([Math.PI / 2, 0]).subtract(new Complex(this.numbers[0]).asin());
    }
    atan() {
        const x = this.numbers[0][0];
        const y = this.numbers[0][1];
        return new Complex([0, .5])
            .multiply(new Complex([y + 1, -x]).ln().subtract(new Complex([-y + 1, x]).ln()));
    }
    acot() {
        return this.conjugate().divide([this.numbers[0][0] ** 2 + this.numbers[0][1] ** 2, 0]).atan();
    }
    asec() {
        return this.conjugate().divide([this.numbers[0][0] ** 2 + this.numbers[0][1] ** 2, 0]).acos();
    }
    acsc() {
        return this.conjugate().divide([this.numbers[0][0] ** 2 + this.numbers[0][1] ** 2, 0]).asin();
    }
    sinh() {
        return new Complex([
            Math.cos(this.numbers[0][1]) * Math.sinh(this.numbers[0][0]),
            Math.sin(this.numbers[0][1]) * Math.cosh(this.numbers[0][0])
        ]);
    }
    cosh() {
        return new Complex([
            Math.cos(this.numbers[0][1]) * Math.cosh(this.numbers[0][0]),
            Math.sin(this.numbers[0][1]) * Math.sinh(this.numbers[0][0])
        ]);
    }
    tanh() {
        return new Complex(this.numbers[0]).sinh().divide(new Complex(this.numbers[0]).cosh());
    }
    coth() {
        return new Complex(this.numbers[0]).cosh().divide(new Complex(this.numbers[0]).sinh());
    }
    sech() {
        return new Complex([1, 0]).divide(this.cosh());
    }
    csch() {
        return new Complex([1, 0]).divide(this.sinh());
    }
    asinh() {
        const x = this.numbers[0][0];
        const y = this.numbers[0][1];
        return new Complex([x, y]).multiply([x, y]).add([1, 0]).power([0.5, 0]).add([x, y]).ln();
    }
    acosh() {
        const x = this.numbers[0][0];
        const y = this.numbers[0][1];
        return new Complex([x ** 2 - y ** 2 - 1, 2 * x * y]).power([0.5, 0]).add([x, y]).ln();
    }
    atanh() {
        const x = this.numbers[0][0];
        const y = this.numbers[0][1];
        return new Complex([x + 1, y]).ln().subtract(new Complex([1 - x, -y]).ln()).multiply([.5, 0]);
    }
    acoth() {
        return this.conjugate().divide([this.numbers[0][0] ** 2 + this.numbers[0][1] ** 2, 0]).atanh();
    }
    asech() {
        return this.conjugate().divide([this.numbers[0][0] ** 2 + this.numbers[0][1] ** 2, 0]).acosh();
    }
    acsch() {
        return this.conjugate().divide([this.numbers[0][0] ** 2 + this.numbers[0][1] ** 2, 0]).asinh();
    }
    abs() {
        return Math.hypot(this.numbers[0][0], this.numbers[0][1]);
    }
    conjugate() {
        this.numbers[0][1] = -this.numbers[0][1];
        return this;
    }
    R() {
        return this.numbers[0][0];
    }
    I() {
        return this.numbers[0][1];
    }
    get() {
        return this.numbers[0];
    }
}
exports.default = Complex;
//# sourceMappingURL=complex.js.map