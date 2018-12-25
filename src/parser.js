"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const complex_1 = require("./complex");
const Parser = {};
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
    const peekNextChar = () => {
        const idx = index;
        return ((idx < length) ? expression.charAt(idx) : '\x00');
    };
    const getNextChar = () => {
        let ch = '\x00';
        const idx = index;
        if (idx < length) {
            ch = expression.charAt(idx);
            index += 1;
        }
        return ch;
    };
    const isWhiteSpace = (ch) => (ch === '\u0009') || (ch === ' ') || (ch === '\u00A0');
    const isLetter = (ch) => (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
    const isDecimalDigit = (ch) => (ch >= '0') && (ch <= '9');
    const createToken = (type, value) => {
        return {
            end: index - 1,
            start: marker,
            type,
            value
        };
    };
    const skipSpaces = () => {
        let ch;
        while (index < length) {
            ch = peekNextChar();
            if (!isWhiteSpace(ch)) {
                break;
            }
            getNextChar();
        }
    };
    const scanOperator = () => {
        const ch = peekNextChar();
        if ('+-*/()^,'.indexOf(ch) >= 0) {
            return createToken(T.Operator, getNextChar());
        }
        return undefined;
    };
    const isIdentifierStart = (ch) => ((ch === '_') || isLetter(ch));
    const isIdentifierPart = (ch) => (isIdentifierStart(ch) || isDecimalDigit(ch));
    const scanIdentifier = () => {
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
    };
    const scanNumber = () => {
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
            }
            else {
                ch = (index >= length) ? '<end>' : `character ${ch}`;
                throw new SyntaxError(`Unexpected ${ch} after the exponent sign`);
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
    };
    const reset = (str) => {
        expression = str;
        length = str.length;
        index = 0;
    };
    const next = () => {
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
        throw new SyntaxError(`Unknown token from character ${peekNextChar()}`);
    };
    const peek = () => {
        let token;
        let idx;
        idx = index;
        token = next();
        if (token === undefined) {
            return undefined;
        }
        else {
            delete token.start;
            delete token.end;
        }
        index = idx;
        return token;
    };
    return {
        next,
        peek,
        reset
    };
};
Parser.Parser = () => {
    const lexer = Parser.Lexer();
    const T = Parser.Names;
    const matchOp = (token, op) => {
        return (typeof token !== 'undefined') &&
            token.type === T.Operator &&
            token.value === op;
    };
    const parseArgumentList = () => {
        let token;
        let expr;
        const args = [];
        while (true) {
            expr = parseExpression();
            args.push(expr);
            token = lexer.peek();
            if (!matchOp(token, ',')) {
                break;
            }
            lexer.next();
        }
        return args;
    };
    const parseFunctionCall = (name) => {
        let token;
        let args = [];
        token = lexer.next();
        token = lexer.peek();
        if (!matchOp(token, ')')) {
            args = parseArgumentList();
        }
        token = lexer.next();
        if (!matchOp(token, ')')) {
            throw new SyntaxError(`Expecting ) in a function call "${name}"`);
        }
        return {
            FunctionCall: {
                args,
                name
            }
        };
    };
    const parsePrimary = () => {
        let token;
        let expr;
        token = lexer.peek();
        if (typeof token === 'undefined') {
            throw new SyntaxError('Unexpected termination of expression');
        }
        if (token.type === T.Identifier) {
            token = lexer.next();
            if (matchOp(lexer.peek(), '(')) {
                return parseFunctionCall(token.value);
            }
            else {
                return {
                    Identifier: token.value
                };
            }
        }
        if (token.type === T.Number) {
            token = lexer.next();
            return {
                Number: token.value
            };
        }
        if (token.type === T.Complex) {
            token = lexer.next();
            return {
                Complex: token.value
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
        throw new SyntaxError(`Parse error, can not process token ${token.value}`);
    };
    const parseUnary = () => {
        let token;
        let expr;
        token = lexer.peek();
        if (matchOp(token, '-') || matchOp(token, '+')) {
            token = lexer.next();
            expr = parseUnary();
            return {
                Unary: {
                    expression: expr,
                    operator: token.value
                }
            };
        }
        return parsePrimary();
    };
    const parseMultiplicative = () => {
        let expr;
        let token;
        expr = parseUnary();
        token = lexer.peek();
        while (matchOp(token, '*') || matchOp(token, '/') || matchOp(token, '^')) {
            token = lexer.next();
            expr = {
                Binary: {
                    left: expr,
                    operator: token.value,
                    right: parseUnary()
                }
            };
            token = lexer.peek();
        }
        return expr;
    };
    const parseExpression = () => {
        let expr;
        let token;
        expr = parseMultiplicative();
        token = lexer.peek();
        while (matchOp(token, '+') || matchOp(token, '-')) {
            token = lexer.next();
            expr = {
                Binary: {
                    left: expr,
                    operator: token.value,
                    right: parseMultiplicative()
                }
            };
            token = lexer.peek();
        }
        return expr;
    };
    const parse = (expression) => {
        let expr;
        let token;
        lexer.reset(expression);
        expr = parseExpression();
        token = lexer.next();
        if (typeof token !== 'undefined') {
            throw new SyntaxError(`Unexpected token ${token.value}`);
        }
        return {
            Expression: expr
        };
    };
    return {
        parse
    };
};
Parser.Context = () => {
    const Constants = {
        E: [Math.E, 0],
        LOGEI: [0, Math.PI / 2],
        LOGIE: [0, -2 / Math.PI],
        pi: [Math.PI, 0],
        Pi: [Math.PI, 0],
        PI: [Math.PI, 0]
    };
    const Functions = [
        'abs',
        'acos',
        'acosh',
        'acot',
        'acoth',
        'acsc',
        'acsch',
        'asec',
        'asech',
        'asin',
        'asinh',
        'atan',
        'atanh',
        'cos',
        'coh',
        'cot',
        'coth',
        'csc',
        'csch',
        'log',
        'ln',
        'root',
        'sec',
        'sech',
        'sin',
        'sinh',
        'tan',
        'tanh'
    ];
    return {
        Constants,
        Functions
    };
};
Parser.Evaluator = () => {
    const parser = Parser.Parser();
    const context = Parser.Context();
    const exec = (node) => {
        let left;
        let right;
        let i;
        if (node.Expression !== undefined) {
            return exec(node.Expression);
        }
        if (node.Number !== undefined) {
            return new complex_1.default([parseFloat(node.Number), 0]);
        }
        if (node.Complex !== undefined) {
            return new complex_1.default([0, parseFloat(node.Complex === 'i' ? '1' : node.Complex)]);
        }
        if (node.Binary !== undefined) {
            left = exec(node.Binary.left);
            right = exec(node.Binary.right);
            if (typeof left === 'number') {
                left = new complex_1.default(left);
            }
            switch (node.Binary.operator) {
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
                    throw new SyntaxError(`Unknown operator ${node.Binary.operator}`);
            }
        }
        if (node.Unary !== undefined) {
            const expr = new complex_1.default(exec(node.Unary.expression));
            switch (node.Unary.operator) {
                case '+':
                    return expr;
                case '-':
                    return new complex_1.default([-expr.get()[0], -expr.get()[1]]);
                default:
                    throw new SyntaxError(`Unknown operator ${node.Unary.operator}`);
            }
        }
        if (node.Identifier !== undefined) {
            if (context.Constants[node.Identifier] !== undefined) {
                return new complex_1.default(context.Constants[node.Identifier]);
            }
            throw new SyntaxError('Unknown identifier');
        }
        if (node.FunctionCall !== undefined) {
            const expr = node.FunctionCall;
            if (context.Functions.indexOf(expr.name) > -1) {
                const args = [];
                for (i = 0; i < expr.args.length; i += 1) {
                    args.push(new complex_1.default(exec(expr.args[i])));
                }
                const arg = args.shift();
                if (args.length > 0) {
                    if (expr.name !== 'log' && expr.name !== 'root') {
                        throw new SyntaxError(`${expr.name} function can have only one parameter`);
                    }
                    return ((args[0])[expr.name])(arg);
                }
                if (expr.name === 'log') {
                    throw new SyntaxError(`${expr.name} function must have two parameters`);
                }
                return (arg[expr.name])();
            }
            throw new SyntaxError(`Unknown function ${expr.name}`);
        }
        throw new SyntaxError('Unknown syntax node');
    };
    const evaluate = (expr) => {
        const tree = parser.parse(expr);
        return exec(tree);
    };
    return {
        evaluate
    };
};
exports.default = Parser.Evaluator;
//# sourceMappingURL=parser.js.map