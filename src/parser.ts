import Complex from './complex';

interface Names {
  Operator: string;
  Identifier: string;
  Number: string;
  Complex: string;
}

interface IParser {
  Names: Names;
  Lexer(): ILexer;
  Parser(): {
    parse(expression: string): {
      Expression: any;
    }
  };
  Context(): any;
  Evaluator(): {
    evaluate(expr: string): any
  };
}

interface ILexer {
  next(): {
    end: number;
    start: number;
    type: string;
    value: string;
  } | undefined;
  peek(): {
    end: number;
    start: number;
    type: string;
    value: string;
  } | undefined;
  reset(str: string): void;
}

const Parser: IParser = {} as IParser;

Parser.Names = {
  Complex: 'Complex',
  Identifier: 'Identifier',
  Number: 'Number',
  Operator: 'Operator'
};

Parser.Lexer = () => {
  let expression = '';
  let length = 0;
  let index = 0;
  let marker = 0;
  const T = Parser.Names;

  function peekNextChar() {
    const idx = index;
    return ((idx < length) ? expression.charAt(idx) : '\x00');
  }

  function getNextChar() {
    let ch = '\x00';
    const idx = index;
    if (idx < length) {
      ch = expression.charAt(idx);
      index += 1;
    }
    return ch;
  }

  function isWhiteSpace(ch: string) {
    return (ch === '\u0009') || (ch === ' ') || (ch === '\u00A0');
  }

  function isLetter(ch: string) {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
  }

  function isDecimalDigit(ch: string) {
    return (ch >= '0') && (ch <= '9');
  }

  function createToken(type: any, value: string) {
    return {
      end: index - 1,
      start: marker,
      type,
      value
    };
  }

  function skipSpaces() {
    let ch;

    while (index < length) {
      ch = peekNextChar();
      if (!isWhiteSpace(ch)) {
        break;
      }
      getNextChar();
    }
  }

  function scanOperator() {
    const ch = peekNextChar();
    if ('+-*/()^,'.indexOf(ch) >= 0) {
      return createToken(T.Operator, getNextChar());
    }
    return undefined;
  }

  function isIdentifierStart(ch: string) {
    return (ch === '_') || isLetter(ch);
  }

  function isIdentifierPart(ch: string) {
    return isIdentifierStart(ch) || isDecimalDigit(ch);
  }

  function scanIdentifier() {
    let ch;
    let id;

    ch = peekNextChar();
    if (!isIdentifierStart(ch)) {
      return undefined;
    }

    id = getNextChar();
    while (true) {
      ch = peekNextChar();
      if (!isIdentifierPart(ch)) {
        break;
      }
      id += getNextChar();
    }

    return createToken(T.Identifier, id);
  }

  function scanNumber() {
    let ch;
    let num;

    ch = peekNextChar();
    if (!isDecimalDigit(ch) && (ch !== '.') && ch !== 'i') {
      return undefined;
    }

    num = '';
    if (ch !== '.') {
      num = getNextChar();
      while (true) {
        ch = peekNextChar();
        if (!isDecimalDigit(ch) && ch !== 'i') {
          break;
        }
        num += getNextChar();
      }
    }

    if (ch === '.') {
      num += getNextChar();
      while (true) {
        ch = peekNextChar();
        if (!isDecimalDigit(ch) && ch !== 'i') {
          break;
        }
        num += getNextChar();
      }
    }

    if (ch === 'e') {
      num += getNextChar();
      ch = peekNextChar();
      if (ch === '+' || ch === '-' || isDecimalDigit(ch)) {
        num += getNextChar();
        while (true) {
          ch = peekNextChar();
          if (!isDecimalDigit(ch)) {
            break;
          }
          num += getNextChar();
        }
      } else {
        ch = 'character ' + ch;
        if (index >= length) {
          ch = '<end>';
        }
        throw new SyntaxError('Unexpected ' + ch + ' after the exponent sign');
      }
    }

    if (num === '.') {
      throw new SyntaxError('Expecting decimal digits after the dot sign');
    }

    if (num.indexOf('i') > -1) {
      if (num.indexOf('i') !== num.length - 1) {
        throw new SyntaxError('Unexpected numbers after imaginary part');
      }
      return createToken(T.Complex, num);
    }
    return createToken(T.Number, num);
  }

  function reset(str: string) {
    expression = str;
    length = str.length;
    index = 0;
  }

  function next() {
    let token;

    skipSpaces();
    if (index >= length) {
      return undefined;
    }

    marker = index;

    token = scanNumber();
    if (typeof token !== 'undefined') {
      return token;
    }

    token = scanOperator();
    if (typeof token !== 'undefined') {
      return token;
    }

    token = scanIdentifier();
    if (typeof token !== 'undefined') {
      return token;
    }

    throw new SyntaxError('Unknown token from character ' + peekNextChar());
  }

  function peek() {
    let token;
    let idx;

    idx = index;

    token = next();
    if (token === undefined) {
      return undefined;
    } else {
      delete token.start;
      delete token.end;
    }
    index = idx;

    return token;
  }

  return {
    next,
    peek,
    reset
  };
};

Parser.Parser = () => {

  const lexer = Parser.Lexer();
  const T = Parser.Names;

  function matchOp(token: any, op: string) {
    return (typeof token !== 'undefined') &&
      token.type === T.Operator &&
      token.value === op;
  }

  // ArgumentList := Expression |
  //                 Expression ',' ArgumentList
  function parseArgumentList(): string[] {
    let token;
    let expr;
    const args = [];

    while (true) {
      expr = parseExpression();
      if (typeof expr === 'undefined') {
        break;
      }
      args.push(expr);
      token = lexer.peek();
      if (!matchOp(token, ',')) {
        break;
      }
      lexer.next();
    }

    return args;
  }

  // FunctionCall ::= Identifier '(' ')' ||
  //                  Identifier '(' ArgumentList ')'
  function parseFunctionCall(name: string) {
    let token;
    let args: string[] = [];

    token = lexer.next();

    token = lexer.peek();
    if (!matchOp(token, ')')) {
      args = parseArgumentList();
    }

    token = lexer.next();
    if (!matchOp(token, ')')) {
      throw new SyntaxError('Expecting ) in a function call "' + name + '"');
    }

    return {
      FunctionCall : {
        args,
        name
      }
    };
  }

  // Primary ::= Identifier |
  //             Number |
  //             '(' Assignment ')' |
  //             FunctionCall
  function parsePrimary(): any {
    let token;
    let expr;

    token = lexer.peek();

    if (typeof token === 'undefined') {
      throw new SyntaxError('Unexpected termination of expression');
    }

    if (token.type === T.Identifier) {
      token = lexer.next();
      if (matchOp(lexer.peek(), '(')) {
        return parseFunctionCall((token as any).value);
      } else {
        return {
          Identifier: (token as any).value
        };
      }
    }

    if (token.type === T.Number) {
      token = lexer.next();
      return {
        Number: (token as any).value
      };
    }

    if (token.type === T.Complex) {
      token = lexer.next();
      return {
        Complex: (token as any).value
      };
    }

    if (matchOp(token, '(')) {
      lexer.next();
      expr = parseExpression();
      token = lexer.next();
      if (!matchOp(token, ')')) {
        throw new SyntaxError('Expecting )');
      }
      return {
        Expression: expr
      };
    }

    throw new SyntaxError('Parse error, can not process token ' + token.value);
  }

  // Unary ::= Primary |
  //           '-' Unary
  function parseUnary(): any {
    let token;
    let expr;

    token = lexer.peek();
    if (matchOp(token, '-') || matchOp(token, '+')) {
      token = lexer.next();
      expr = parseUnary();
      return {
        Unary: {
          expression: expr,
          operator: (token as any).value
        }
      };
    }

    return parsePrimary();
  }

  // Multiplicative ::= Unary |
  //                    Multiplicative '*' Unary |
  //                    Multiplicative '/' Unary
  function parseMultiplicative() {
    let expr;
    let token;

    expr = parseUnary();
    token = lexer.peek();
    while (matchOp(token, '*') || matchOp(token, '/') || matchOp(token, '^')) {
      token = lexer.next();
      expr = {
        Binary: {
          left: expr,
          operator: (token as any).value,
          right: parseUnary()
        }
      };
      token = lexer.peek();
    }
    return expr;
  }

  // Additive ::= Multiplicative |
  //              Additive '+' Multiplicative |
  //              Additive '-' Multiplicative
  function parseAdditive() {
    let expr;
    let token;

    expr = parseMultiplicative();
    token = lexer.peek();
    while (matchOp(token, '+') || matchOp(token, '-')) {
      token = lexer.next();
      expr = {
        Binary: {
          left: expr,
          operator: (token as any).value,
          right: parseMultiplicative()
        }
      };
      token = lexer.peek();
    }
    return expr;
  }

  // Expression ::= Assignment
  function parseExpression() {
    return parseAdditive();
  }

  function parse(expression: string) {
    let expr;
    let token;

    lexer.reset(expression);
    expr = parseExpression();

    token = lexer.next();
    if (typeof token !== 'undefined') {
      throw new SyntaxError('Unexpected token ' + token.value);
    }

    return {
      Expression: expr
    };
  }

  return {
    parse
  };
};

Parser.Context = () => {

  const Constants = {
    pi: [Math.PI, 0],
    Pi: [Math.PI, 0],
    PI: [Math.PI, 0]
  };

  const Functions = ['abs', 'acos', 'asin', 'atan', 'cos', 'ln', 'log', 'root', 'sin', 'tan'];

  return {
    Constants,
    Functions
  };
};

Parser.Evaluator = () => {

  const parser = Parser.Parser();
  const context = Parser.Context();

  function exec(node: any): Complex {
    let left;
    let right;
    let expr;
    let args;
    let i;

    if (node.hasOwnProperty('Expression')) {
      return exec(node.Expression);
    }

    if (node.hasOwnProperty('Number')) {
      return new Complex([parseFloat(node.Number), 0]);
    }

    if (node.hasOwnProperty('Complex')) {
      return new Complex([0, parseFloat(node.Complex === 'i' ? 1 : node.Complex)]);
    }

    if (node.hasOwnProperty('Binary')) {
      node = node.Binary;
      left = exec(node.left);
      right = exec(node.right);
      switch (node.operator) {
        case '+':
          return left.add(right);
        case '-':
          return left.subtract(right);
        case '*':
          return left.multiply(right);
        case '/':
          return left.divide(right);
        case '^':
          return left.power(right);
        default:
          throw new SyntaxError('Unknown operator ' + node.operator);
      }
    }

    if (node.hasOwnProperty('Unary')) {
      node = node.Unary;
      expr = exec(node.expression);
      switch (node.operator) {
        case '+':
          return expr;
        case '-':
          return new Complex([-expr.get()[0], -expr.get()[1]]);
        default:
          throw new SyntaxError('Unknown operator ' + node.operator);
      }
    }

    if (node.hasOwnProperty('Identifier')) {
      if (context.Constants.hasOwnProperty(node.Identifier)) {
        return new Complex(context.Constants[node.Identifier]);
      }
      throw new SyntaxError('Unknown identifier');
    }

    if (node.hasOwnProperty('FunctionCall')) {
      expr = node.FunctionCall;
      if (context.Functions.indexOf(expr.name) > -1) {
        args = [];
        for (i = 0; i < expr.args.length; i += 1) {
          args.push(exec(expr.args[i]));
        }
        const arg = args.shift();
        if (args.length > 0) {
          return ((args[0] as any)[expr.name])(arg);
        }
        return ((arg as any)[expr.name])();
      }
      throw new SyntaxError('Unknown function ' + expr.name);
    }

    throw new SyntaxError('Unknown syntax node');
  }

  function evaluate(expr: string) {
    const tree = parser.parse(expr);
    return exec(tree);
  }

  return {
    evaluate
  };
};

export default Parser.Evaluator;
