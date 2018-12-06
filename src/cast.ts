import Complex from './complex';

type complex = [number, number];

interface Icast {
  (a: Complex | complex | number | string): Complex;

  add(a: Complex | complex | number | string, ...b: (Complex | complex | number | string)[]): Complex;
  subtract(a: Complex | complex | number | string, ...b: (Complex | complex | number | string)[]): Complex;
  multiply(a: Complex | complex | number | string, ...b: (Complex | complex | number | string)[]): Complex;
  divide(a: Complex | complex | number | string, b: Complex | complex | number | string): Complex;
  power(a: Complex | complex | number | string, b: Complex | complex | number | string): Complex;
  root(a: Complex | complex | number | string, b: number): Complex;
  ln(a: Complex | complex | number | string): Complex;
  log(a: Complex | complex | number | string, b: Complex | complex | number | string): Complex;

  sin(a: Complex | complex | number | string): Complex;
  cos(a: Complex | complex | number | string): Complex;
  tan(a: Complex | complex | number | string): Complex;
  cot(a: Complex | complex | number | string): Complex;
  sec(a: Complex | complex | number | string): Complex;
  csc(a: Complex | complex | number | string): Complex;

  asin(a: Complex | complex | number | string): Complex;
  acos(a: Complex | complex | number | string): Complex;
  atan(a: Complex | complex | number | string): Complex;
  acot(a: Complex | complex | number | string): Complex;
  asec(a: Complex | complex | number | string): Complex;
  acsc(a: Complex | complex | number | string): Complex;

  sinh(a: Complex | complex | number | string): Complex;
  cosh(a: Complex | complex | number | string): Complex;
  tanh(a: Complex | complex | number | string): Complex;
  coth(a: Complex | complex | number | string): Complex;
  sech(a: Complex | complex | number | string): Complex;
  csch(a: Complex | complex | number | string): Complex;

  asinh(a: Complex | complex | number | string): Complex;
  acosh(a: Complex | complex | number | string): Complex;
  atanh(a: Complex | complex | number | string): Complex;
  acoth(a: Complex | complex | number | string): Complex;
  asech(a: Complex | complex | number | string): Complex;
  acsch(a: Complex | complex | number | string): Complex;

  abs(a: Complex | complex | number | string): number;
  conjugate(a: Complex | complex | number | string): Complex;
  R(a: Complex | complex | number | string): number;
  I(a: Complex | complex | number | string): number;
  get(a: Complex | complex | number | string): complex;
  stringify(a: Complex | complex | number | string): string;

  evaluate(a: string): string;

  LOGIE: complex;
  LOGEI: complex;
}

const cast: Icast = (a: Complex | complex | number | string): Complex => new Complex(a);

cast.add = (a: Complex | complex | number | string, ...b: (Complex | complex | number | string)[]): Complex => cast(a).add(...b);
cast.subtract = (a: Complex | complex | number | string, ...b: (Complex | complex | number | string)[]): Complex => cast(a).subtract(...b);
cast.multiply = (a: Complex | complex | number | string, ...b: (Complex | complex | number | string)[]): Complex => cast(a).multiply(...b);
cast.divide = (a: Complex | complex | number | string, b: Complex | complex | number | string): Complex => cast(a).divide(b);
cast.power = (a: Complex | complex | number | string, b: Complex | complex | number | string): Complex => cast(a).power(b);
cast.root = (a: Complex | complex | number | string, b: Complex | complex | number | string): Complex => cast(a).root(b);
cast.ln = (a: Complex | complex | number | string): Complex => cast(a).ln();
cast.log = (a: Complex | complex | number | string, b: Complex | complex | number | string): Complex => cast(a).log(b);

cast.sin = (a: Complex | complex | number | string): Complex => cast(a).sin();
cast.cos = (a: Complex | complex | number | string): Complex => cast(a).cos();
cast.tan = (a: Complex | complex | number | string): Complex => cast(a).tan();
cast.cot = (a: Complex | complex | number | string): Complex => cast(a).cot();
cast.sec = (a: Complex | complex | number | string): Complex => cast(a).sec();
cast.csc = (a: Complex | complex | number | string): Complex => cast(a).csc();

cast.asin = (a: Complex | complex | number | string): Complex => cast(a).asin();
cast.acos = (a: Complex | complex | number | string): Complex => cast(a).acos();
cast.atan = (a: Complex | complex | number | string): Complex => cast(a).atan();
cast.acot = (a: Complex | complex | number | string): Complex => cast(a).acot();
cast.asec = (a: Complex | complex | number | string): Complex => cast(a).asec();
cast.acsc = (a: Complex | complex | number | string): Complex => cast(a).acsc();

cast.sinh = (a: Complex | complex | number | string): Complex => cast(a).sinh();
cast.cosh = (a: Complex | complex | number | string): Complex => cast(a).cosh();
cast.tanh = (a: Complex | complex | number | string): Complex => cast(a).tanh();
cast.coth = (a: Complex | complex | number | string): Complex => cast(a).coth();
cast.sech = (a: Complex | complex | number | string): Complex => cast(a).sech();
cast.csch = (a: Complex | complex | number | string): Complex => cast(a).csch();

cast.asinh = (a: Complex | complex | number | string): Complex => cast(a).asinh();
cast.acosh = (a: Complex | complex | number | string): Complex => cast(a).acosh();
cast.atanh = (a: Complex | complex | number | string): Complex => cast(a).atanh();
cast.acoth = (a: Complex | complex | number | string): Complex => cast(a).acoth();
cast.asech = (a: Complex | complex | number | string): Complex => cast(a).asech();
cast.acsch = (a: Complex | complex | number | string): Complex => cast(a).acsch();

cast.abs = (a: Complex | complex | number | string): number => cast(a).abs();
cast.conjugate = (a: Complex | complex | number | string): Complex => cast(a).conjugate();
cast.R = (a: Complex | complex | number | string): number => cast(a).R();
cast.I = (a: Complex | complex | number | string): number => cast(a).I();
cast.get = (a: Complex | complex | number | string): complex => cast(a).get();
cast.stringify = (a: Complex | complex | number | string): string => cast(a).stringify();

cast.evaluate = (a: string): string => cast(a).stringify();

cast.LOGEI = [0, Math.PI / 2];
cast.LOGIE = [0, -2 / Math.PI];

export default cast;
