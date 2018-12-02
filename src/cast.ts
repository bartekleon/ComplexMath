import Complex from './complex';

type complex = [number, number];

interface Icast {
  (a: complex | Complex | string): Complex;

  add(a: Complex | complex, ...b: (Complex | complex)[]): Complex;
  subtract(a: Complex | complex, ...b: (Complex | complex)[]): Complex;
  multiply(a: Complex | complex, ...b: (Complex | complex)[]): Complex;
  divide(a: Complex | complex, b: Complex | complex): Complex;
  power(a: Complex | complex, b: Complex | complex): Complex;
  root(a: Complex | complex, b: number): Complex;
  ln(a: Complex | complex): Complex;
  log(a: Complex | complex, b: Complex | complex | number): Complex;

  sin(a: Complex | complex): Complex;
  cos(a: Complex | complex): Complex;
  tan(a: Complex | complex): Complex;
  cot(a: Complex | complex): Complex;
  sec(a: Complex | complex): Complex;
  csc(a: Complex | complex): Complex;

  asin(a: Complex | complex): Complex;
  acos(a: Complex | complex): Complex;
  atan(a: Complex | complex): Complex;
  acot(a: Complex | complex): Complex;
  asec(a: Complex | complex): Complex;
  acsc(a: Complex | complex): Complex;

  sinh(a: Complex | complex): Complex;
  cosh(a: Complex | complex): Complex;
  tanh(a: Complex | complex): Complex;
  coth(a: Complex | complex): Complex;
  sech(a: Complex | complex): Complex;
  csch(a: Complex | complex): Complex;

  asinh(a: Complex | complex): Complex;
  acosh(a: Complex | complex): Complex;
  atanh(a: Complex | complex): Complex;
  acoth(a: Complex | complex): Complex;
  asech(a: Complex | complex): Complex;
  acsch(a: Complex | complex): Complex;

  abs(a: Complex | complex): number;
  conjugate(a: Complex | complex): Complex;
  R(a: Complex | complex): number;
  I(a: Complex | complex): number;
  get(a: Complex | complex): complex;
  stringify(a: Complex | complex): string;

  evaluate(a: string): string;

  LOGIE: complex;
  LOGEI: complex;
}

const cast: Icast = (a: complex | Complex | string): Complex => (a instanceof Complex) ? a : new Complex(a);

cast.add = (a: complex | Complex, ...b: (complex | Complex)[]): Complex => cast(a).add(...b);
cast.subtract = (a: complex | Complex, ...b: (complex | Complex)[]): Complex => cast(a).subtract(...b);
cast.multiply = (a: complex | Complex, ...b: (complex | Complex)[]): Complex => cast(a).multiply(...b);
cast.divide = (a: complex | Complex, b: complex | Complex): Complex => cast(a).divide(b);
cast.power = (a: Complex | complex, b: Complex | complex): Complex => cast(a).power(b);
cast.root = (a: Complex | complex, b: number): Complex => cast(a).root(b);
cast.ln = (a: Complex | complex): Complex => cast(a).ln();
cast.log = (a: Complex | complex, b: Complex | complex | number): Complex => cast(a).log(b);

cast.sin = (a: Complex | complex): Complex => cast(a).sin();
cast.cos = (a: Complex | complex): Complex => cast(a).cos();
cast.tan = (a: Complex | complex): Complex => cast(a).tan();
cast.cot = (a: Complex | complex): Complex => cast(a).cot();
cast.sec = (a: Complex | complex): Complex => cast(a).sec();
cast.csc = (a: Complex | complex): Complex => cast(a).csc();

cast.asin = (a: Complex | complex): Complex => cast(a).asin();
cast.acos = (a: Complex | complex): Complex => cast(a).acos();
cast.atan = (a: Complex | complex): Complex => cast(a).atan();
cast.acot = (a: Complex | complex): Complex => cast(a).acot();
cast.asec = (a: Complex | complex): Complex => cast(a).asec();
cast.acsc = (a: Complex | complex): Complex => cast(a).acsc();

cast.sinh = (a: Complex | complex): Complex => cast(a).sinh();
cast.cosh = (a: Complex | complex): Complex => cast(a).cosh();
cast.tanh = (a: Complex | complex): Complex => cast(a).tanh();
cast.coth = (a: Complex | complex): Complex => cast(a).coth();
cast.sech = (a: Complex | complex): Complex => cast(a).sech();
cast.csch = (a: Complex | complex): Complex => cast(a).csch();

cast.asinh = (a: Complex | complex): Complex => cast(a).asinh();
cast.acosh = (a: Complex | complex): Complex => cast(a).acosh();
cast.atanh = (a: Complex | complex): Complex => cast(a).atanh();
cast.acoth = (a: Complex | complex): Complex => cast(a).acoth();
cast.asech = (a: Complex | complex): Complex => cast(a).asech();
cast.acsch = (a: Complex | complex): Complex => cast(a).acsch();

cast.abs = (a: Complex | complex): number => cast(a).abs();
cast.conjugate = (a: Complex | complex): Complex => cast(a).conjugate();
cast.R = (a: Complex | complex): number => cast(a).R();
cast.I = (a: Complex | complex): number => cast(a).I();
cast.get = (a: Complex | complex): complex => cast(a).get();
cast.stringify = (a: Complex | complex): string => cast(a).stringify();

cast.evaluate = (a: string): string => cast(a).stringify();

cast.LOGEI = [0, Math.PI / 2];
cast.LOGIE = [0, -2 / Math.PI];

export default cast;
