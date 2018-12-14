import cast from '../src/cast';
import Complex from '../src/complex';
import { expect } from 'chai';

describe('parser', () => {
  it('1', () => {
    expect(cast.evaluate('4+5i')).to.be.equal('4+5i');
  });
  it('2', () => {
    expect(cast.evaluate('3+i-2i*2')).to.be.equal('3-3i');
  });
  it('3', () => {
    expect(cast.evaluate('2.3 + i')).to.be.equal('2.3+i');
  });
  it('4', () => {
    expect(cast.evaluate('sin(PI / 4) * root(2)')).to.be.equal('1');
  });
  it('5', () => {
    expect(cast.evaluate('(3 + i) ^ 2')).to.be.equal('8.000000000000002+6.000000000000001i');
  });
  it('6', () => {
    expect(() => cast.evaluate('3,')).to.throw(SyntaxError, 'Unexpected token ,');
  });
  it('7', () => {
    expect(() => cast.evaluate('3..')).to.throw(SyntaxError, 'Expecting decimal digits after the dot sign');
  });
  it('8', () => {
    expect(() => cast.evaluate('3i4')).to.throw(SyntaxError, 'Unexpected numbers after imaginary part');
  });
  it('9', () => {
    expect(cast.evaluate('3e5 * i')).to.be.equal('300000i');
  });
  it('10', () => {
    expect(cast.evaluate('-3 + -10')).to.be.equal('-13');
  });
  it('11', () => {
    expect(() => cast.evaluate('sin2')).to.throw(SyntaxError, 'Unknown identifier');
  });
  it('12', () => {
    expect(() => cast.evaluate('sin(2')).to.throw(SyntaxError, 'Expecting ) in a function call "sin"');
  });
  it('13', () => {
    expect(() => cast.evaluate('sin(')).to.throw(SyntaxError, 'Unexpected termination of expression');
  });
  it('14', () => {
    expect(() => cast.evaluate('sin2(3)')).to.throw(SyntaxError, 'Unknown function sin2');
  });
  it('15', () => {
    expect(cast.evaluate('3 + +2')).to.be.equal('5');
  });
  it('16', () => {
    expect(() => cast.evaluate('3 + *2')).to.throw(SyntaxError, 'Parse error, can not process token *');
  });
  it('17', () => {
    expect(() => cast.evaluate('3e')).to.throw(SyntaxError, 'Unexpected <end> after the exponent sign');
  });
  it('18', () => {
    expect(() => cast.evaluate('3ei')).to.throw(SyntaxError, 'Unexpected character i after the exponent sign');
  });
  it('18', () => {
    expect(cast.evaluate('3e10')).to.be.equal('30000000000');
  });
  it('19', () => {
    expect(cast.evaluate('log(2, 4)')).to.be.equal('2');
  });
  it('20', () => {
    expect(() => cast.evaluate('(3 + 2i) * (3 + 2i')).to.throw(SyntaxError, 'Expecting )');
  });
  it('21', () => {
    expect(cast.evaluate('log(2, (3 - i))')).to.be.equal('1.6609640474436813-0.4641879292313103i');
  });
  it('22', () => {
    expect(cast.evaluate('E')).to.be.equal(String(Math.E));
  });
});

describe('stringify', () => {
  it('should stringify both positive number', () => {
    expect(cast([1, 2]).stringify()).to.be.equal('1+2i');
  });
  it('should stringify left positive number', () => {
    expect(cast([1, -2]).stringify()).to.be.equal('1-2i');
    expect(cast([1, 0]).stringify()).to.be.equal('1');
  });
  it('should stringify right positive number', () => {
    expect(cast([-1, 2]).stringify()).to.be.equal('-1+2i');
    expect(cast([0, 2]).stringify()).to.be.equal('2i');
  });
  it('should stringify both zero number', () => {
    expect(cast([0, 0]).stringify()).to.be.equal('0');
  });
  it('should stringify -1i as -i', () => {
    expect(cast([0, -1]).stringify()).to.be.equal('-i');
  });
  it('should stringify 1i as i', () => {
    expect(cast([0, 1]).stringify()).to.be.equal('i');
  });
  it('should stringify 4-1i as 4-i', () => {
    expect(cast([4, -1]).stringify()).to.be.equal('4-i');
  });
});

describe('add', () => {
  it('1', () => {
    expect(cast.add([1, 2], [4, 5]).stringify()).to.be.equal('5+7i');
  });
  it('2', () => {
    expect(cast.add([1, 2], [-4, 5]).stringify()).to.be.equal('-3+7i');
    expect(cast.add([1, 2], [4, -2]).stringify()).to.be.equal('5');
  });
  it('3', () => {
    expect(cast.add([-1, 2], [4, -2], [2, 3]).stringify()).to.be.equal('5+3i');
  });
  it('4', () => {
    expect(cast.add([2, 3], cast([-2, -3])).stringify()).to.be.equal('0');
  });
  it('4', () => {
    expect(cast.add([2, 3], cast([-2, 3])).stringify()).to.be.equal('6i');
  });
});

describe('subtract', () => {
  it('1', () => {
    expect(cast.subtract([1, 2], [4, 5]).stringify()).to.be.equal('-3-3i');
  });
  it('2', () => {
    expect(cast.subtract([1, 2], [-4, 5]).stringify()).to.be.equal('5-3i');
    expect(cast([1, 2]).subtract([4, 2]).stringify()).to.be.equal('-3');
  });
  it('3', () => {
    expect(cast([-1, 2]).subtract([4, -2], [2, 3]).stringify()).to.be.equal('-7+i');
  });
  it('4', () => {
    expect(cast([2, 3]).subtract(cast([2, 3])).stringify()).to.be.equal('0');
  });
  it('5', () => {
    expect(cast([2, 3]).subtract(cast([2, -3])).stringify()).to.be.equal('6i');
  });
});

describe('multiply', () => {
  it('1', () => {
    expect(cast.multiply([1, 2], [4, 5]).stringify()).to.be.equal('-6+13i');
  });
  it('2', () => {
    expect(cast([1, 2]).multiply([-4, 5]).stringify()).to.be.equal('-14-3i');
    expect(cast([1, 2]).multiply([4, 2]).stringify()).to.be.equal('10i');
  });
  it('3', () => {
    expect(cast([-1, 2]).multiply([4, -2], [2, 3]).stringify()).to.be.equal('-30+20i');
  });
  it('4', () => {
    expect(cast([2, 3]).multiply(cast([2, 3])).stringify()).to.be.equal('-5+12i');
  });
  it('5', () => {
    expect(cast([2, 3]).multiply(cast([2, -3])).stringify()).to.be.equal('13');
  });
  it('6', () => {
    expect(cast(new Complex([2, 3])).multiply(cast([0, 0])).stringify()).to.be.equal('0');
  });
});

describe('divide', () => {
  it('1', () => {
    expect(() => cast('3 / 0').stringify()).to.throw(Error, 'You cannot devide by 0');
  });
  it('2', () => {
    expect(cast.divide([4, 5], [2, 0]).stringify()).to.be.equal('2+2.4999999999999996i');
  });
  it('3', () => {
    expect(cast([4, 5]).divide([2, 1]).stringify()).to.be.equal('2.6+1.2i');
  });
  it('4', () => {
    expect(cast([1.233, 32.43]).divide([12.14, 2.343]).stringify()).to.be.equal('0.594966682933073+2.5565068420006427i');
  });
});

describe('root', () => {
  it('1', () => {
    expect(() => cast('root(.5, 3)').stringify()).to.throw(TypeError, 'The parameter has to be a integer bigger than 1. Got \'0.5\' instead.');
  });
  it('2', () => {
    expect(() => cast('root(1, 3)').stringify()).to.throw(TypeError, 'The parameter has to be a integer bigger than 1. Got \'1\' instead.');
  });
  it('3', () => {
    expect(() => cast.root([0, 0], 4).stringify()).to.throw(RangeError, 'Complex number can\'t be zero');
  });
  it('4', () => {
    expect(() => cast('root(3+i, 2)').stringify()).to.throw(TypeError, 'Complex number cannot have imaginary part. Use `power` instead');
  });
  it('5', () => {
    expect(cast('root(4)').stringify()).to.be.equal('2');
  });
});

describe('ln', () => {
  it('1', () => {
    expect(cast.ln([1, 0]).stringify()).to.be.equal('0');
  });
});

describe('log', () => {
  it('1', () => {
    expect(cast.log([4, 0], 2).stringify()).to.be.equal('2');
  });
  it('2', () => {
    expect(cast([1, 0]).log().stringify()).to.be.equal('0');
  });
});

describe('power', () => {
  it('1', () => {
    expect(cast([2, 1]).power([0, 0.5]).stringify()).to.be.equal('0.7297497015314675+0.3105648680121105i');
  });
  it('2', () => {
    expect(() => cast('0 ^ 0').stringify()).to.throw(Error, 'You cannot rise 0 to the power of 0');
  });
  it('3', () => {
    expect(cast.power([4, 0], [2, 0]).stringify()).to.be.equal('16');
  });
});

describe('trigonometric functions', () => {
  it('sin', () => {
    expect(cast.sin([2, 1]).stringify()).to.be.equal('1.4031192506220405-0.4890562590412937i');
  });
  it('cos', () => {
    expect(cast.cos([2, 1]).stringify()).to.be.equal('-0.64214812471552-1.0686074213827783i');
  });
  it('tan', () => {
    expect(cast.tan([2, 1]).stringify()).to.be.equal('-0.24345820118572514+1.16673625724092i');
  });
  it('cot', () => {
    expect(cast.cot([2, 1]).stringify()).to.be.equal('-0.17138361290918494-0.8213297974938517i');
  });
  it('sec', () => {
    expect(cast.sec([2, 1]).stringify()).to.be.equal('-0.41314934426694+0.687527438655479i');
  });
  it('csc', () => {
    expect(cast.csc([2, 1]).stringify()).to.be.equal('0.6354937992539+0.22150093085050945i');
  });
});

describe('inverse trigonometric functions', () => {
  it('1', () => {
    expect(cast.asin([2, 1]).stringify()).to.be.equal('1.0634400235777526+1.4693517443681845i');
  });
  it('2', () => {
    expect(cast.acos([2, 1]).stringify()).to.be.equal('0.507356303217144-1.4693517443681845i');
  });
  it('3', () => {
    expect(cast.atan([2, 1]).stringify()).to.be.equal('1.1780972450961724+0.1732867951399864i');
  });
  it('4', () => {
    expect(cast.acot([2, 1]).stringify()).to.be.equal('0.39269908169872414-0.1732867951399863i');
  });
  it('5', () => {
    expect(cast.asec([2, 1]).stringify()).to.be.equal('1.1692099351270904+0.2156124185558298i');
  });
  it('6', () => {
    expect(cast.acsc([2, 1]).stringify()).to.be.equal('0.40158639166780613-0.2156124185558298i');
  });
});

describe('hiperbolic functions', () => {
  it('1', () => {
    expect(cast.sinh([2, 1]).stringify()).to.be.equal('1.9596010414216063+3.165778513216168i');
  });
  it('2', () => {
    expect(cast.cosh([2, 1]).stringify()).to.be.equal('2.0327230070196656+3.0518977991518i');
  });
  it('3', () => {
    expect(cast.tanh([2, 1]).stringify()).to.be.equal('1.0147936161466338+0.033812826079896635i');
  });
  it('4', () => {
    expect(cast.coth([2, 1]).stringify()).to.be.equal('0.9843292264581909-0.032797755533752526i');
  });
  it('5', () => {
    expect(cast.sech([2, 1]).stringify()).to.be.equal('0.15117629826557724-0.22697367539372157i');
  });
  it('6', () => {
    expect(cast.csch([2, 1]).stringify()).to.be.equal('0.1413630216124078-0.22837506559968654i');
  });
});

describe('inverse hiperbolic functions', () => {
  it('1', () => {
    expect(cast.asinh([2, 1]).stringify()).to.be.equal('1.528570919480998+0.42707858639247614i');
  });
  it('2', () => {
    expect(cast.acosh([2, 1]).stringify()).to.be.equal('1.4693517443681852+0.5073563032171445i');
  });
  it('3', () => {
    expect(cast.atanh([2, 1]).stringify()).to.be.equal('0.4023594781085251+1.3389725222944935i');
  });
  it('4', () => {
    expect(cast.acoth([2, 1]).stringify()).to.be.equal('0.4023594781085251-0.23182380450040307i');
  });
  it('5', () => {
    expect(cast.asech([2, 1]).stringify()).to.be.equal('0.2156124185558298-1.1692099351270906i');
  });
  it('6', () => {
    expect(cast.acsch([2, 1]).stringify()).to.be.equal('0.3965682301123289-0.18631805410781554i');
  });
});

describe('getters', () => {
  it('R', () => {
    expect(cast.R([2, 1])).to.be.equal(2);
  });
  it('I', () => {
    expect(cast.I([2, 1])).to.be.equal(1);
  });
  it('get', () => {
    expect(cast.get([2, 1])).to.deep.equal([2, 1]);
  });
  it('stringify', () => {
    expect(cast.stringify([2, 1])).to.be.equal('2+i');
  });
  it('abs', () => {
    expect(cast.abs([3, 4])).to.be.equal(5);
  });
  it('conjugate', () => {
    expect(cast.conjugate([3, 4]).get()).to.deep.equal([3, -4]);
  });
});

describe('equal', () => {
  it('1', () => {
    expect(cast.equal('acsch(2+i)', '0.3965682301123289-0.18631805410781554i')).to.be.true;
  });
});
