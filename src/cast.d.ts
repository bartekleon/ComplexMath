import Complex from './complex';
declare type extract<Type> = Type;
declare type complex = [number, number];
declare type T = extract<Complex | complex | number | string>;
interface Icast {
    (a: T): Complex;
    LOGEI: complex;
    LOGIE: complex;
    abs(a: T): number;
    acos(a: T): Complex;
    acosh(a: T): Complex;
    acot(a: T): Complex;
    acoth(a: T): Complex;
    acsc(a: T): Complex;
    acsch(a: T): Complex;
    add(a: T, ...b: T[]): Complex;
    asec(a: T): Complex;
    asech(a: T): Complex;
    asin(a: T): Complex;
    asinh(a: T): Complex;
    atan(a: T): Complex;
    atanh(a: T): Complex;
    conjugate(a: T): Complex;
    cos(a: T): Complex;
    cosh(a: T): Complex;
    cot(a: T): Complex;
    coth(a: T): Complex;
    csc(a: T): Complex;
    csch(a: T): Complex;
    divide(a: T, b: T): Complex;
    equal(a: T, b: T): boolean;
    evaluate(a: string): string;
    get(a: T): complex;
    I(a: T): number;
    ln(a: T): Complex;
    log(a: T, b: T): Complex;
    multiply(a: T, ...b: T[]): Complex;
    power(a: T, b: T): Complex;
    R(a: T): number;
    root(a: T, b: number): Complex;
    sec(a: T): Complex;
    sech(a: T): Complex;
    sin(a: T): Complex;
    sinh(a: T): Complex;
    stringify(a: T): string;
    subtract(a: T, ...b: T[]): Complex;
    tan(a: T): Complex;
    tanh(a: T): Complex;
}
declare const cast: Icast;
export default cast;
