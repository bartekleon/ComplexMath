import Complex from './complex';

type extract<T> = T;
type complex = [number, number];
type T = extract<Complex | complex | number | string>;

interface Icast {
  (a: T): Complex;

  add(a: T, ...b: T[]): Complex;
  subtract(a: T, ...b: T[]): Complex;
  multiply(a: T, ...b: T[]): Complex;
  divide(a: T, b: T): Complex;
  power(a: T, b: T): Complex;
  root(a: T, b: number): Complex;
  ln(a: T): Complex;
  log(a: T, b: T): Complex;

  sin(a: T): Complex;
  cos(a: T): Complex;
  tan(a: T): Complex;
  cot(a: T): Complex;
  sec(a: T): Complex;
  csc(a: T): Complex;

  asin(a: T): Complex;
  acos(a: T): Complex;
  atan(a: T): Complex;
  acot(a: T): Complex;
  asec(a: T): Complex;
  acsc(a: T): Complex;

  sinh(a: T): Complex;
  cosh(a: T): Complex;
  tanh(a: T): Complex;
  coth(a: T): Complex;
  sech(a: T): Complex;
  csch(a: T): Complex;

  asinh(a: T): Complex;
  acosh(a: T): Complex;
  atanh(a: T): Complex;
  acoth(a: T): Complex;
  asech(a: T): Complex;
  acsch(a: T): Complex;

  abs(a: T): number;
  conjugate(a: T): Complex;
  R(a: T): number;
  I(a: T): number;
  get(a: T): complex;
  stringify(a: T): string;

  equal(a: T, b: T): boolean;

  evaluate(a: string): string;

  LOGIE: complex;
  LOGEI: complex;
}

const cast: Icast = (a: T): Complex => new Complex(a);

cast.add = (a: T, ...b: T[]): Complex => cast(a).add(...b);
cast.subtract = (a: T, ...b: T[]): Complex => cast(a).subtract(...b);
cast.multiply = (a: T, ...b: T[]): Complex => cast(a).multiply(...b);
cast.divide = (a: T, b: T): Complex => cast(a).divide(b);
cast.power = (a: T, b: T): Complex => cast(a).power(b);
cast.root = (a: T, b: T): Complex => cast(a).root(b);
cast.ln = (a: T): Complex => cast(a).ln();
cast.log = (a: T, b: T): Complex => cast(a).log(b);

cast.sin = (a: T): Complex => cast(a).sin();
cast.cos = (a: T): Complex => cast(a).cos();
cast.tan = (a: T): Complex => cast(a).tan();
cast.cot = (a: T): Complex => cast(a).cot();
cast.sec = (a: T): Complex => cast(a).sec();
cast.csc = (a: T): Complex => cast(a).csc();

cast.asin = (a: T): Complex => cast(a).asin();
cast.acos = (a: T): Complex => cast(a).acos();
cast.atan = (a: T): Complex => cast(a).atan();
cast.acot = (a: T): Complex => cast(a).acot();
cast.asec = (a: T): Complex => cast(a).asec();
cast.acsc = (a: T): Complex => cast(a).acsc();

cast.sinh = (a: T): Complex => cast(a).sinh();
cast.cosh = (a: T): Complex => cast(a).cosh();
cast.tanh = (a: T): Complex => cast(a).tanh();
cast.coth = (a: T): Complex => cast(a).coth();
cast.sech = (a: T): Complex => cast(a).sech();
cast.csch = (a: T): Complex => cast(a).csch();

cast.asinh = (a: T): Complex => cast(a).asinh();
cast.acosh = (a: T): Complex => cast(a).acosh();
cast.atanh = (a: T): Complex => cast(a).atanh();
cast.acoth = (a: T): Complex => cast(a).acoth();
cast.asech = (a: T): Complex => cast(a).asech();
cast.acsch = (a: T): Complex => cast(a).acsch();

cast.abs = (a: T): number => cast(a).abs();
cast.conjugate = (a: T): Complex => cast(a).conjugate();
cast.R = (a: T): number => cast(a).R();
cast.I = (a: T): number => cast(a).I();
cast.get = (a: T): complex => cast(a).get();
cast.stringify = (a: T): string => cast(a).stringify();

cast.equal = (a: T, b: T): boolean => cast(a).equal(b);

cast.evaluate = (a: string): string => cast(a).stringify();

cast.LOGEI = [0, Math.PI / 2];
cast.LOGIE = [0, -2 / Math.PI];

export default cast;
