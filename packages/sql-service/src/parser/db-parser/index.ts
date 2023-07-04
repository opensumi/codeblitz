/**
 * 必须使用 import * 写法，否则esm打包有问题
 */
import * as lexer from './generated-parser/OB3XParserLexer';
import * as parser from './generated-parser/OB3XParserParser';
import * as listener from './generated-parser/OB3XParserListener';
import * as visitor from './generated-parser/OB3XParserVisitor';

const { OB3XParserLexer } = lexer;
const { OB3XParserParser } = parser;
const { OB3XParserListener } = listener;
const { OB3XParserVisitor } = visitor;

export { OB3XParserLexer, OB3XParserParser, OB3XParserListener, OB3XParserVisitor };
