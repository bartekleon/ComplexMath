import Complex from '../src/complex';
import { expect } from 'chai';

describe('parser', () => {
  it('1', () => {
    expect(new Complex('4+5i').stringify()).to.be.equal('4+5i');
  });
  it('2', () => {
    expect(new Complex('3+i-2i*2').stringify()).to.be.equal('3-3i');
  });
  it('3', () => {
    expect(new Complex('2.3 + i').stringify()).to.be.equal('2.3+i');
  });
  it('4', () => {
    expect(new Complex('sin(PI / 4) * root(2)').stringify()).to.be.equal('1');
  });
  it('5', () => {
    expect(new Complex('(3 + i) ^ 2').stringify()).to.be.equal('8.000000000000002+6.000000000000001i');
  });
  it('6', () => {
    expect(() => new Complex('3,').stringify()).to.throw(SyntaxError, 'Unexpected token ,');
  });
  it('7', () => {
    expect(() => new Complex('3..').stringify()).to.throw(SyntaxError, 'Expecting decimal digits after the dot sign');
  });
  it('8', () => {
    expect(() => new Complex('3i4').stringify()).to.throw(SyntaxError, 'Unexpected numbers after imaginary part');
  });
  it('9', () => {
    expect(new Complex('3e5 * i').stringify()).to.be.equal('300000i');
  });
  it('10', () => {
    expect(new Complex('-3 + -10').stringify()).to.be.equal('-13');
  });
  it('11', () => {
    expect(() => new Complex('sin2').stringify()).to.throw(SyntaxError, 'Unknown identifier');
  });
  it('12', () => {
    expect(() => new Complex('sin(2').stringify()).to.throw(SyntaxError, 'Expecting ) in a function call "sin"');
  });
  it('13', () => {
    expect(() => new Complex('sin(').stringify()).to.throw(SyntaxError, 'Unexpected termination of expression');
  });
  it('14', () => {
    expect(() => new Complex('sin2(3)').stringify()).to.throw(SyntaxError, 'Unknown function sin2');
  });
  it('15', () => {
    expect(new Complex('3 + +2').stringify()).to.be.equal('5');
  });
  it('16', () => {
    expect(() => new Complex('3 + *2').stringify()).to.throw(SyntaxError, 'Parse error, can not process token *');
  });
  it('17', () => {
    expect(() => new Complex('3e').stringify()).to.throw(SyntaxError, 'Unexpected <end> after the exponent sign');
  });
  it('18', () => {
    expect(() => new Complex('3ei').stringify()).to.throw(SyntaxError, 'Unexpected character i after the exponent sign');
  });
  it('18', () => {
    expect(new Complex('3e10').stringify()).to.be.equal('30000000000');
  });
  it('19', () => {
    expect(new Complex('log(2, 4)').stringify()).to.be.equal('2');
  });
  it('20', () => {
    expect(() => new Complex('(3 + 2i) * (3 + 2i').stringify()).to.throw(SyntaxError, 'Expecting )');
  });
  it('21', () => {
    expect(new Complex('log(2, (3 - i))').stringify()).to.be.equal('1.6609640474436813-0.4641879292313103i');
  });
});

describe('stringify', () => {
  it('should stringify both positive number', () => {
    expect(new Complex([1, 2]).stringify()).to.be.equal('1+2i');
  });
  it('should stringify left positive number', () => {
    expect(new Complex([1, -2]).stringify()).to.be.equal('1-2i');
    expect(new Complex([1, 0]).stringify()).to.be.equal('1');
  });
  it('should stringify right positive number', () => {
    expect(new Complex([-1, 2]).stringify()).to.be.equal('-1+2i');
    expect(new Complex([0, 2]).stringify()).to.be.equal('2i');
  });
  it('should stringify both zero number', () => {
    expect(new Complex([0, 0]).stringify()).to.be.equal('0');
  });
  it('should stringify -1i as -i', () => {
    expect(new Complex([0, -1]).stringify()).to.be.equal('-i');
  });
  it('should stringify 1i as i', () => {
    expect(new Complex([0, 1]).stringify()).to.be.equal('i');
  });
  it('should stringify 4-1i as 4-i', () => {
    expect(new Complex([4, -1]).stringify()).to.be.equal('4-i');
  });
});

describe('add', () => {
  it('1', () => {
    expect(new Complex([1, 2]).add([4, 5]).stringify()).to.be.equal('5+7i');
  });
  it('2', () => {
    expect(new Complex([1, 2]).add([-4, 5]).stringify()).to.be.equal('-3+7i');
    expect(new Complex([1, 2]).add([4, -2]).stringify()).to.be.equal('5');
  });
  it('3', () => {
    expect(new Complex([-1, 2]).add([4, -2], [2, 3]).stringify()).to.be.equal('5+3i');
  });
  it('4', () => {
    expect(new Complex([2, 3]).add(new Complex([-2, -3])).stringify()).to.be.equal('0');
  });
  it('4', () => {
    expect(new Complex([2, 3]).add(new Complex([-2, 3])).stringify()).to.be.equal('6i');
  });
});

describe('subtract', () => {
  it('1', () => {
    expect(new Complex([1, 2]).subtract([4, 5]).stringify()).to.be.equal('-3-3i');
  });
  it('2', () => {
    expect(new Complex([1, 2]).subtract([-4, 5]).stringify()).to.be.equal('5-3i');
    expect(new Complex([1, 2]).subtract([4, 2]).stringify()).to.be.equal('-3');
  });
  it('3', () => {
    expect(new Complex([-1, 2]).subtract([4, -2], [2, 3]).stringify()).to.be.equal('-7+i');
  });
  it('4', () => {
    expect(new Complex([2, 3]).subtract(new Complex([2, 3])).stringify()).to.be.equal('0');
  });
  it('5', () => {
    expect(new Complex([2, 3]).subtract(new Complex([2, -3])).stringify()).to.be.equal('6i');
  });
});

describe('multiply', () => {
  it('1', () => {
    expect(new Complex([1, 2]).multiply([4, 5]).stringify()).to.be.equal('-6+13i');
  });
  it('2', () => {
    expect(new Complex([1, 2]).multiply([-4, 5]).stringify()).to.be.equal('-14-3i');
    expect(new Complex([1, 2]).multiply([4, 2]).stringify()).to.be.equal('10i');
  });
  it('3', () => {
    expect(new Complex([-1, 2]).multiply([4, -2], [2, 3]).stringify()).to.be.equal('-30+20i');
  });
  it('4', () => {
    expect(new Complex([2, 3]).multiply(new Complex([2, 3])).stringify()).to.be.equal('-5+12i');
  });
  it('5', () => {
    expect(new Complex([2, 3]).multiply(new Complex([2, -3])).stringify()).to.be.equal('13');
  });
  it('6', () => {
    expect(new Complex([2, 3]).multiply(new Complex([0, 0])).stringify()).to.be.equal('0');
  });
});

describe('divide', () => {
  it('1', () => {
    expect(() => new Complex('3 / 0').stringify()).to.throw(Error, 'You cannot devide by 0');
  });
  it('2', () => {
    expect(new Complex([4, 5]).divide([2, 0]).stringify()).to.be.equal('2+2.4999999999999996i');
  });
  it('3', () => {
    expect(new Complex([4, 5]).divide([2, 1]).stringify()).to.be.equal('2.6+1.2i');
  });
  it('4', () => {
    expect(new Complex([1.233, 32.43]).divide([12.14, 2.343]).stringify()).to.be.equal('0.594966682933073+2.5565068420006427i');
  });
});

describe('root', () => {
  it('1', () => {
    expect(() => new Complex('root(.5, 3)').stringify()).to.throw(TypeError, 'The parameter has to be a integer bigger than 1. Got \'0.5\' instead.');
  });
  it('2', () => {
    expect(() => new Complex('root(1, 3)').stringify()).to.throw(TypeError, 'The parameter has to be a integer bigger than 1. Got \'1\' instead.');
  });
  it('3', () => {
    expect(() => new Complex('root(4, 0)').stringify()).to.throw(RangeError, 'Complex number can\'t be zero');
  });
  it('4', () => {
    expect(() => new Complex('root(3+i, 2)').stringify()).to.throw(TypeError, 'Complex number cannot have imaginary part. Use `power` instead');
  });
  it('5', () => {
    expect(new Complex([4, 0]).root().stringify()).to.be.equal('2');
  });
});

describe('ln', () => {
  it('1', () => {
    expect(new Complex([1, 0]).ln().stringify()).to.be.equal('0');
  });
});

describe('log', () => {
  it('1', () => {
    expect(new Complex([4, 0]).log(2).stringify()).to.be.equal('2');
  });
  it('2', () => {
    expect(new Complex([1, 0]).log().stringify()).to.be.equal('0');
  });
  it('2', () => {
    expect(new Complex([1, 0]).log(new Complex([3, 1])).stringify()).to.be.equal('0');
  });
});

describe('power', () => {
  it('1', () => {
    expect(new Complex([2, 1]).power([0, 0.5]).stringify()).to.be.equal('0.7297497015314675+0.3105648680121105i');
  });
  it('2', () => {
    expect(() => new Complex('0 ^ 0').stringify()).to.throw(Error, 'You cannot rise 0 to the power of 0');
  });
  it('3', () => {
    expect(new Complex([4, 0]).power([2, 0]).stringify()).to.be.equal('16');
  });
});

describe('trigonometric functions', () => {
  it('sin', () => {
    expect(new Complex([2, 1]).sin().stringify()).to.be.equal('1.4031192506220405-0.4890562590412937i');
  });
  it('cos', () => {
    expect(new Complex([2, 1]).cos().stringify()).to.be.equal('-0.64214812471552-1.0686074213827783i');
  });
  it('tan', () => {
    expect(new Complex([2, 1]).tan().stringify()).to.be.equal('-0.24345820118572514+1.16673625724092i');
  });
  it('cot', () => {
    expect(new Complex([2, 1]).cot().stringify()).to.be.equal('-0.17138361290918494-0.8213297974938517i');
  });
  it('sec', () => {
    expect(new Complex([2, 1]).sec().stringify()).to.be.equal('-0.41314934426694+0.687527438655479i');
  });
  it('csc', () => {
    expect(new Complex([2, 1]).csc().stringify()).to.be.equal('0.6354937992539+0.22150093085050945i');
  });
});

describe('inverse trigonometric functions', () => {
  it('1', () => {
    expect(new Complex([2, 1]).asin().stringify()).to.be.equal('1.0634400235777526+1.4693517443681845i');
  });
  it('2', () => {
    expect(new Complex([2, 1]).acos().stringify()).to.be.equal('0.507356303217144-1.4693517443681845i');
  });
  it('3', () => {
    expect(new Complex([2, 1]).atan().stringify()).to.be.equal('1.1780972450961724+0.1732867951399864i');
  });
  it('4', () => {
    expect(new Complex([2, 1]).acot().stringify()).to.be.equal('0.39269908169872414-0.1732867951399863i');
  });
  it('5', () => {
    expect(new Complex([2, 1]).asec().stringify()).to.be.equal('1.1692099351270904+0.2156124185558298i');
  });
  it('6', () => {
    expect(new Complex([2, 1]).acsc().stringify()).to.be.equal('0.40158639166780613-0.2156124185558298i');
  });
});

describe('hiperbolic functions', () => {
  it('1', () => {
    expect(new Complex([2, 1]).sinh().stringify()).to.be.equal('1.9596010414216063+3.165778513216168i');
  });
  it('2', () => {
    expect(new Complex([2, 1]).cosh().stringify()).to.be.equal('2.0327230070196656+3.0518977991518i');
  });
  it('3', () => {
    expect(new Complex([2, 1]).tanh().stringify()).to.be.equal('1.0147936161466338+0.033812826079896635i');
  });
  it('4', () => {
    expect(new Complex([2, 1]).coth().stringify()).to.be.equal('0.9843292264581909-0.032797755533752526i');
  });
  it('5', () => {
    expect(new Complex([2, 1]).sech().stringify()).to.be.equal('0.15117629826557724-0.22697367539372157i');
  });
  it('6', () => {
    expect(new Complex([2, 1]).csch().stringify()).to.be.equal('0.1413630216124078-0.22837506559968654i');
  });
});

describe('inverse hiperbolic functions', () => {
  it('1', () => {
    expect(new Complex([2, 1]).asinh().stringify()).to.be.equal('1.528570919480998+0.42707858639247614i');
  });
  it('2', () => {
    expect(new Complex([2, 1]).acosh().stringify()).to.be.equal('1.4693517443681852+0.5073563032171445i');
  });
  it('3', () => {
    expect(new Complex([2, 1]).atanh().stringify()).to.be.equal('0.4023594781085251+1.3389725222944935i');
  });
  it('4', () => {
    expect(new Complex([2, 1]).acoth().stringify()).to.be.equal('0.4023594781085251-0.23182380450040307i');
  });
  it('5', () => {
    expect(new Complex([2, 1]).asech().stringify()).to.be.equal('0.2156124185558298-1.1692099351270906i');
  });
  it('6', () => {
    expect(new Complex([2, 1]).acsch().stringify()).to.be.equal('0.3965682301123289-0.18631805410781554i');
  });
});

describe('getters', () => {
  it('R', () => {
    expect(new Complex([2, 1]).R()).to.be.equal(2);
  });
  it('I', () => {
    expect(new Complex([2, 1]).I()).to.be.equal(1);
  });
});

describe('equal', () => {
  it('1', () => {
    expect(new Complex([2, 1]).acsch().equal('0.3965682301123289-0.18631805410781554i')).to.be.true;
  });
});
