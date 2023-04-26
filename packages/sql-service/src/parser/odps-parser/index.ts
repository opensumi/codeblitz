/**
 * 必须使用 import * 写法，否则esm打包有问题
 */
import * as lexer from './generated-parser/OdpsSqlLexer';
import * as parser from './generated-parser/OdpsSqlParser';
import * as listener from './generated-parser/OdpsSqlListener';
import * as visitor from './generated-parser/OdpsSqlVisitor';

const { OdpsSqlLexer } = lexer;
const { OdpsSqlParser } = parser;
const { OdpsSqlListener } = listener;
const { OdpsSqlVisitor } = visitor;

export { OdpsSqlLexer, OdpsSqlParser, OdpsSqlListener, OdpsSqlVisitor };
