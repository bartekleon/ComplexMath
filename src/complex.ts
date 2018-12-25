import Parser from './parser';

type extract<Type> = Type;
type complex = [number, number];
type T = extract<Complex | complex | number | string>;

class Complex {
  private readonly numbers: complex[] = [];
  constructor(a: T) {
    // number
    if (typeof a === 'number') {
      this.numbers[0] = [a, 0];
    // Complex
    } else if (a instanceof Complex) {
      this.numbers[0] = [...a.numbers[0]] as complex;
    // string
    } else if (typeof a === 'string') {
      this.numbers[0] = new Complex(Parser().evaluate(a)).get();
    // complex
    } else {
      this.numbers[0] = [...a] as complex;
    }
  }

  public abs(): number {
    return Math.hypot(...this.get());
  }
  public acos(): Complex {
    return new Complex([Math.PI / 2, 0]).subtract(new Complex(this.numbers[0]).asin());
  }
  public acosh(): Complex {
    const [x, y] = this.get();

    return new Complex([x ** 2 - y ** 2 - 1,  x * y * 2]).power([0.5, 0]).add([x, y]).ln();
  }
  public acot(): Complex {
    return this.conjugate().divide([this.numbers[0][0] ** 2 + this.numbers[0][1] ** 2, 0]).atan();
  }
  public acoth(): Complex {
    return this.conjugate().divide([this.numbers[0][0] ** 2 + this.numbers[0][1] ** 2, 0]).atanh();
  }
  public acsc(): Complex {
    return this.conjugate().divide([this.numbers[0][0] ** 2 + this.numbers[0][1] ** 2, 0]).asin();
  }
  public acsch(): Complex {
    return this.conjugate().divide([this.numbers[0][0] ** 2 + this.numbers[0][1] ** 2, 0]).asinh();
  }
  public add(...a: T[]): Complex {
    const result = this.get();
    for (const x of a) {
      const c = new Complex(x).get();
      result[0] += c[0];
      result[1] += c[1];
    }
    this.numbers[0] = result;

    return this;
  }
  public asec(): Complex {
    return this.conjugate().divide([this.numbers[0][0] ** 2 + this.numbers[0][1] ** 2, 0]).acos();
  }
  public asech(): Complex {
    return this.conjugate().divide([this.numbers[0][0] ** 2 + this.numbers[0][1] ** 2, 0]).acosh();
  }
  public asin(): Complex {
    const [x, y] = this.get();

    return new Complex([(y ** 2) - (x ** 2) + 1, x * y * -2]).power([0.5, 0]).add([-y, x]).ln().divide([0, 1]);
  }
  public asinh(): Complex {
    const [x, y] = this.get();

    return new Complex([x, y]).multiply([x, y]).add([1, 0]).power([0.5, 0]).add([x, y]).ln();
  }
  public atan(): Complex {
    const [x, y] = this.get();

    return new Complex([0, 0.5]).multiply(new Complex([y + 1, -x]).ln().subtract(new Complex([-y + 1, x]).ln()));
  }
  public atanh(): Complex {
    const [x, y] = this.get();

    return new Complex([x + 1, y]).ln().subtract(new Complex([1 - x, -y]).ln()).multiply([0.5, 0]);
  }
  public conjugate(): Complex {
    this.numbers[0][1] = -this.numbers[0][1];

    return this;
  }
  public cos(): Complex {
    const [x, y] = this.get();

    return new Complex([Math.cos(x) * Math.cosh(y), -Math.sin(x) * Math.sinh(y)]);
  }
  public cosh(): Complex {
    const [x, y] = this.get();

    return new Complex([Math.cos(y) * Math.cosh(x), Math.sin(y) * Math.sinh(x)]);
  }
  public cot(): Complex {
    return new Complex(this.numbers[0]).cos().divide(new Complex(this.numbers[0]).sin());
  }
  public coth(): Complex {
    return new Complex(this.numbers[0]).cosh().divide(new Complex(this.numbers[0]).sinh());
  }
  public csc(): Complex {
    return new Complex([1, 0]).divide(this.sin());
  }
  public csch(): Complex {
    return new Complex([1, 0]).divide(this.sinh());
  }
  public divide(a: T): Complex {
    const c = new Complex(a).get();
    const [x, y] = this.get();

    const r1 = Math.hypot(x, y);
    const r2 = Math.hypot(...c);
    if (r2 === 0) { throw new Error('You cannot devide by 0'); }
    const theta = Math.atan2(y, x) - Math.atan2(c[1], c[0]);
    const r = r1 / r2;

    return new Complex([r * Math.cos(theta), r * Math.sin(theta)]);
  }
  public equal(n: T): boolean {
    n = new Complex(n).get();
    const [x, y] = this.get();

    return n[0] === x && n[1] === y;
  }
  public get(): complex {
    return this.numbers[0];
  }
  public I(): number {
    return this.numbers[0][1];
  }
  public ln(): Complex {
    return new Complex([Math.log(this.abs()), Math.atan2(this.numbers[0][1], this.numbers[0][0])]);
  }
  public log(a: T = Math.E): Complex {
    const x = new Complex(a).get();
    if (x[1] === 0) {
      if (x[0] === Math.E) {
        return this.ln();
      }

      return this.ln().divide([Math.log(x[0]), 0]);
    }

    return this.ln().divide(new Complex(x).ln());
  }
  public multiply(...a: T[]): Complex {
    for (const c of a) {
      const [x, y] = this.get();
      const f = new Complex(c).get();
      this.numbers[0] = [
        x * f[0] - y * f[1],
        x * f[1] + y * f[0]
      ];
    }

    return this;
  }
  public power(a: T): Complex {
    const [x, y] = this.get();
    const [i, j] = new Complex(a).get();

    if (j === 0) {
      if (y === 0) {
        if (x === 0 && i === 0) {
          throw new Error('You cannot rise 0 to the power of 0');
        }

        return new Complex([x ** i, 0]);
      } else {
        return new Complex([Math.cos(Math.atan2(y, x) * i), Math.sin(Math.atan2(y, x) * i)]).multiply([Math.hypot(x, y) ** i, 0]);
      }
    }

    const one = (Math.E ** (-j * Math.atan2(y, x))) * Math.hypot(x, y) ** i;
    const two = j * Math.log(Math.hypot(x, y)) + Math.atan2(y, x) * i;

    return new Complex([one * Math.cos(two), one * Math.sin(two)]);
  }
  public R(): number {
    return this.numbers[0][0];
  }
  public root(a: T = 2): Complex {
    a = new Complex(a).get();
    if (a[1] !== 0) {
      throw new TypeError('Complex number cannot have imaginary part. Use `power` instead');
    }
    a = a[0];
    const r = this.abs();
    const x = this.get();
    if (!Number.isInteger(a) || a < 2) { throw new TypeError(`The parameter has to be a integer bigger than 1. Got '${a}' instead.`); }
    if (x[0] === 0 && x[1] === 0) {
      throw new RangeError('Complex number can\'t be zero');
    }
    const angle = Math.atan2(x[1], x[0]);
    const com = new Complex([0, 0]);

    const R = Math.pow(r, 1 / a);
    for (let k = 0; k <= a - 1; k++) {
      const theta = (angle + k * Math.PI * 2) / a;
      com.numbers.push([R * Math.cos(theta), R * Math.sin(theta)]);
    }

    com.numbers.shift();

    return com;
  }
  public sec(): Complex {
    return new Complex([1, 0]).divide(this.cos());
  }
  public sech(): Complex {
    return new Complex([1, 0]).divide(this.cosh());
  }
  public sin(): Complex {
    const [x, y] = this.get();

    return new Complex([Math.sin(x) * Math.cosh(y), Math.cos(x) * Math.sinh(y)]);
  }
  public sinh(): Complex {
    const [x, y] = this.get();

    return new Complex([Math.cos(y) * Math.sinh(x), Math.sin(y) * Math.cosh(x)]);
  }
  public stringify(): string {
    const x = this.get();
    if (x[1] === 0) {
      return String(x[0]);
    }
    if (x[0] === 0) {
      return `${x[1] === 1 ? '' : x[1] === -1 ? '-' : String(x[1])}i`;
    }
    if (x[1] === 1 || x[1] === -1) {
      return `${x[0]}${x[1] > 0 ? '+' : '-'}i`;
    }

    return `${x.join(x[1] > 0 ? '+' : '')}i`;
  }
  public subtract(...a: T[]): Complex {
    const result = this.get();
    for (const x of a) {
      const c = new Complex(x).get();
      result[0] -= c[0];
      result[1] -= c[1];
    }
    this.numbers[0] = result;

    return this;
  }
  public tan(): Complex {
    const [x, y] = this.get();
    const sin = new Complex([x, y]).sin().get();
    const cos = new Complex([x, y]).cos().get();

    return new Complex(sin).divide(cos);
  }
  public tanh(): Complex {
    return new Complex(this.numbers[0]).sinh().divide(new Complex(this.numbers[0]).cosh());
  }
}

export default Complex;
