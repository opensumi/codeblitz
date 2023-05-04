// // import type { ISQLService, IObjectProxyMirror, ISQLMode } from '@alipay/e2-language-sql-service';
// // import { LRU, hashCode, PredictionMode } from '@alipay/e2-utils-language';
// import type { Token } from 'antlr4';
// import { InputStream, CommonTokenStream } from 'antlr4';
// // import type { Callback, Request } from '../request-cache/request-cache';
// // import { RequestCacheInstance } from '../request-cache/request-cache';
// import { OdpsSqlLexer, OdpsSqlParser } from './odps-parser/index';
// // import type { ProgramContext } from './../../utils';
// // import * as Utils from './../../utils';
// // export { PredictionMode };

// // type Listener = () => void | Promise<void>;
// // const cache = new LRU<string, ProgramContext>({ max: 3 });

// export abstract class Parser<Result = any> {
//   private _vTokens: Token[] | undefined;
//   private _inputTokens: Token[] | undefined;

//   readonly code: string;
//   readonly sqlService: ISQLService | undefined;
//   readonly sqlMode: IObjectProxyMirror<ISQLMode> | undefined;
//   protected readonly results: Result[] = [];
//   readonly listeners: Listener[] = [];

//   get vTokens(): Token[] {
//     if (this._vTokens) return this._vTokens;
//     if (!this._inputTokens) return (this._vTokens = []);
//     return (this._vTokens = this._inputTokens.filter(
//       (_c: { channel: any; type: number }) => !_c.channel && _c.type !== -1,
//     ));
//   }

//   constructor(
//     code: string,
//     sqlService: ISQLService | undefined,
//     sqlMode: IObjectProxyMirror<ISQLMode> | undefined,
//   ) {
//     this.code = code;
//     this.sqlService = sqlService;
//     this.sqlMode = sqlMode;
//   }

//   // abstract inRange(ctx: any): boolean;

//   // compare(str1: string = '', str2: string = '') {
//   //   return Utils.formStr(str1).toLowerCase() === Utils.formStr(str2).toLowerCase();
//   // }

//   // table(text: string): string {
//   //   return Utils.computeTable(text);
//   // }

//   buildParser(predictionMode: PredictionMode, formatMode: boolean) {
//     const chars = new InputStream(this.code);
//     const lexer = new OdpsSqlLexer(chars);
//     // @ts-ignore
//     lexer.removeErrorListeners();
//     // @ts-ignore
//     lexer.__FORMAT_MODE = formatMode;
//     // @ts-ignore
//     const tokens = new CommonTokenStream(lexer);
//     const parser = new OdpsSqlParser(tokens);
//     parser._interp.predictionMode = predictionMode;
//     // @ts-ignore
//     parser.buildParseTrees = true;
//     // @ts-ignore
//     parser.removeErrorListeners();
//     return parser;
//   }

//   // buildParseTree(parse = PredictionMode.SLL, format = false): ProgramContext {
//   //   const hash = `${hashCode(this.code)}-${parse}-${format}`;
//   //   if (!cache.get(hash))
//   //     cache.set(hash, this.buildParser(parse, format).program() as ProgramContext);
//   //   const parser = cache.get(hash)!;
//   //   this._inputTokens = parser.parser._input.tokens;
//   //   return parser;
//   // }

//   // addResults(results: Result[]) {
//   //   this.results.push(...results);
//   // }

//   // addResouces<T>(key: string, request: Request<T>, callbacks: Callback<T>[]) {
//   //   RequestCacheInstance.addResouces(this, key, request, callbacks);
//   // }

//   // async resolveResouces() {
//   //   await RequestCacheInstance.resolveRequests(this);
//   //   await this.onResourcesResolved();
//   // }

//   // addResoucesResolvedListener(cb: Listener) {
//   //   this.listeners.push(cb);
//   // }

//   // async onResourcesResolved() {
//   //   for (let i = 0; i < this.listeners.length; i++) await this.listeners[i]();
//   // }
// }
