(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __require = (x) => {
    if (typeof require !== "undefined")
      return require(x);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  };
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // <define:process>
  var env, define_process_default;
  var init_define_process = __esm({
    "<define:process>"() {
      env = {};
      define_process_default = { env };
    }
  });

  // server/node_modules/has-symbols/shams.js
  var require_shams = __commonJS({
    "server/node_modules/has-symbols/shams.js"(exports, module) {
      init_define_process();
      "use strict";
      module.exports = function hasSymbols() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj = {};
        var sym = Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj[sym] = symVal;
        for (sym in obj) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
          if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
          }
        }
        return true;
      };
    }
  });

  // server/node_modules/has-tostringtag/shams.js
  var require_shams2 = __commonJS({
    "server/node_modules/has-tostringtag/shams.js"(exports, module) {
      init_define_process();
      "use strict";
      var hasSymbols = require_shams();
      module.exports = function hasToStringTagShams() {
        return hasSymbols() && !!Symbol.toStringTag;
      };
    }
  });

  // server/node_modules/has-symbols/index.js
  var require_has_symbols = __commonJS({
    "server/node_modules/has-symbols/index.js"(exports, module) {
      init_define_process();
      "use strict";
      var origSymbol = typeof Symbol !== "undefined" && Symbol;
      var hasSymbolSham = require_shams();
      module.exports = function hasNativeSymbols() {
        if (typeof origSymbol !== "function") {
          return false;
        }
        if (typeof Symbol !== "function") {
          return false;
        }
        if (typeof origSymbol("foo") !== "symbol") {
          return false;
        }
        if (typeof Symbol("bar") !== "symbol") {
          return false;
        }
        return hasSymbolSham();
      };
    }
  });

  // server/node_modules/function-bind/implementation.js
  var require_implementation = __commonJS({
    "server/node_modules/function-bind/implementation.js"(exports, module) {
      init_define_process();
      "use strict";
      var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
      var slice = Array.prototype.slice;
      var toStr = Object.prototype.toString;
      var funcType = "[object Function]";
      module.exports = function bind(that) {
        var target = this;
        if (typeof target !== "function" || toStr.call(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slice.call(arguments, 1);
        var bound;
        var binder = function() {
          if (this instanceof bound) {
            var result = target.apply(this, args.concat(slice.call(arguments)));
            if (Object(result) === result) {
              return result;
            }
            return this;
          } else {
            return target.apply(that, args.concat(slice.call(arguments)));
          }
        };
        var boundLength = Math.max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
          boundArgs.push("$" + i);
        }
        bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this,arguments); }")(binder);
        if (target.prototype) {
          var Empty = function Empty2() {
          };
          Empty.prototype = target.prototype;
          bound.prototype = new Empty();
          Empty.prototype = null;
        }
        return bound;
      };
    }
  });

  // server/node_modules/function-bind/index.js
  var require_function_bind = __commonJS({
    "server/node_modules/function-bind/index.js"(exports, module) {
      init_define_process();
      "use strict";
      var implementation = require_implementation();
      module.exports = Function.prototype.bind || implementation;
    }
  });

  // server/node_modules/has/src/index.js
  var require_src = __commonJS({
    "server/node_modules/has/src/index.js"(exports, module) {
      init_define_process();
      "use strict";
      var bind = require_function_bind();
      module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
    }
  });

  // server/node_modules/get-intrinsic/index.js
  var require_get_intrinsic = __commonJS({
    "server/node_modules/get-intrinsic/index.js"(exports, module) {
      init_define_process();
      "use strict";
      var undefined2;
      var $SyntaxError = SyntaxError;
      var $Function = Function;
      var $TypeError = TypeError;
      var getEvalledConstructor = function(expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
        } catch (e) {
        }
      };
      var $gOPD = Object.getOwnPropertyDescriptor;
      if ($gOPD) {
        try {
          $gOPD({}, "");
        } catch (e) {
          $gOPD = null;
        }
      }
      var throwTypeError = function() {
        throw new $TypeError();
      };
      var ThrowTypeError = $gOPD ? function() {
        try {
          arguments.callee;
          return throwTypeError;
        } catch (calleeThrows) {
          try {
            return $gOPD(arguments, "callee").get;
          } catch (gOPDthrows) {
            return throwTypeError;
          }
        }
      }() : throwTypeError;
      var hasSymbols = require_has_symbols()();
      var getProto = Object.getPrototypeOf || function(x) {
        return x.__proto__;
      };
      var needsEval = {};
      var TypedArray = typeof Uint8Array === "undefined" ? undefined2 : getProto(Uint8Array);
      var INTRINSICS = {
        "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
        "%Array%": Array,
        "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
        "%ArrayIteratorPrototype%": hasSymbols ? getProto([][Symbol.iterator]()) : undefined2,
        "%AsyncFromSyncIteratorPrototype%": undefined2,
        "%AsyncFunction%": needsEval,
        "%AsyncGenerator%": needsEval,
        "%AsyncGeneratorFunction%": needsEval,
        "%AsyncIteratorPrototype%": needsEval,
        "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
        "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
        "%Boolean%": Boolean,
        "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": Error,
        "%eval%": eval,
        "%EvalError%": EvalError,
        "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
        "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
        "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
        "%Function%": $Function,
        "%GeneratorFunction%": needsEval,
        "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
        "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
        "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined2,
        "%JSON%": typeof JSON === "object" ? JSON : undefined2,
        "%Map%": typeof Map === "undefined" ? undefined2 : Map,
        "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols ? undefined2 : getProto(new Map()[Symbol.iterator]()),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": Object,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
        "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
        "%RangeError%": RangeError,
        "%ReferenceError%": ReferenceError,
        "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
        "%RegExp%": RegExp,
        "%Set%": typeof Set === "undefined" ? undefined2 : Set,
        "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols ? undefined2 : getProto(new Set()[Symbol.iterator]()),
        "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
        "%String%": String,
        "%StringIteratorPrototype%": hasSymbols ? getProto(""[Symbol.iterator]()) : undefined2,
        "%Symbol%": hasSymbols ? Symbol : undefined2,
        "%SyntaxError%": $SyntaxError,
        "%ThrowTypeError%": ThrowTypeError,
        "%TypedArray%": TypedArray,
        "%TypeError%": $TypeError,
        "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
        "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
        "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
        "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
        "%URIError%": URIError,
        "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
        "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
        "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet
      };
      var doEval = function doEval2(name) {
        var value;
        if (name === "%AsyncFunction%") {
          value = getEvalledConstructor("async function () {}");
        } else if (name === "%GeneratorFunction%") {
          value = getEvalledConstructor("function* () {}");
        } else if (name === "%AsyncGeneratorFunction%") {
          value = getEvalledConstructor("async function* () {}");
        } else if (name === "%AsyncGenerator%") {
          var fn = doEval2("%AsyncGeneratorFunction%");
          if (fn) {
            value = fn.prototype;
          }
        } else if (name === "%AsyncIteratorPrototype%") {
          var gen = doEval2("%AsyncGenerator%");
          if (gen) {
            value = getProto(gen.prototype);
          }
        }
        INTRINSICS[name] = value;
        return value;
      };
      var LEGACY_ALIASES = {
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var bind = require_function_bind();
      var hasOwn = require_src();
      var $concat = bind.call(Function.call, Array.prototype.concat);
      var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
      var $replace = bind.call(Function.call, String.prototype.replace);
      var $strSlice = bind.call(Function.call, String.prototype.slice);
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = function stringToPath2(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === "%" && last !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
        } else if (last === "%" && first !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
        }
        var result = [];
        $replace(string, rePropName, function(match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
        });
        return result;
      };
      var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
        var intrinsicName = name;
        var alias;
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName];
          intrinsicName = "%" + alias[0] + "%";
        }
        if (hasOwn(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName];
          if (value === needsEval) {
            value = doEval(intrinsicName);
          }
          if (typeof value === "undefined" && !allowMissing) {
            throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
          }
          return {
            alias,
            name: intrinsicName,
            value
          };
        }
        throw new $SyntaxError("intrinsic " + name + " does not exist!");
      };
      module.exports = function GetIntrinsic(name, allowMissing) {
        if (typeof name !== "string" || name.length === 0) {
          throw new $TypeError("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof allowMissing !== "boolean") {
          throw new $TypeError('"allowMissing" argument must be a boolean');
        }
        var parts = stringToPath(name);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
        var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
        var alias = intrinsic.alias;
        if (alias) {
          intrinsicBaseName = alias[0];
          $spliceApply(parts, $concat([0, 1], alias));
        }
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i];
          var first = $strSlice(part, 0, 1);
          var last = $strSlice(part, -1);
          if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
            throw new $SyntaxError("property names with quotes must have matching quotes");
          }
          if (part === "constructor" || !isOwn) {
            skipFurtherCaching = true;
          }
          intrinsicBaseName += "." + part;
          intrinsicRealName = "%" + intrinsicBaseName + "%";
          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
              }
              return void 0;
            }
            if ($gOPD && i + 1 >= parts.length) {
              var desc = $gOPD(value, part);
              isOwn = !!desc;
              if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                value = desc.get;
              } else {
                value = value[part];
              }
            } else {
              isOwn = hasOwn(value, part);
              value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value;
            }
          }
        }
        return value;
      };
    }
  });

  // server/node_modules/call-bind/index.js
  var require_call_bind = __commonJS({
    "server/node_modules/call-bind/index.js"(exports, module) {
      init_define_process();
      "use strict";
      var bind = require_function_bind();
      var GetIntrinsic = require_get_intrinsic();
      var $apply = GetIntrinsic("%Function.prototype.apply%");
      var $call = GetIntrinsic("%Function.prototype.call%");
      var $reflectApply = GetIntrinsic("%Reflect.apply%", true) || bind.call($call, $apply);
      var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%", true);
      var $defineProperty = GetIntrinsic("%Object.defineProperty%", true);
      var $max = GetIntrinsic("%Math.max%");
      if ($defineProperty) {
        try {
          $defineProperty({}, "a", { value: 1 });
        } catch (e) {
          $defineProperty = null;
        }
      }
      module.exports = function callBind(originalFunction) {
        var func = $reflectApply(bind, $call, arguments);
        if ($gOPD && $defineProperty) {
          var desc = $gOPD(func, "length");
          if (desc.configurable) {
            $defineProperty(func, "length", { value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) });
          }
        }
        return func;
      };
      var applyBind = function applyBind2() {
        return $reflectApply(bind, $apply, arguments);
      };
      if ($defineProperty) {
        $defineProperty(module.exports, "apply", { value: applyBind });
      } else {
        module.exports.apply = applyBind;
      }
    }
  });

  // server/node_modules/call-bind/callBound.js
  var require_callBound = __commonJS({
    "server/node_modules/call-bind/callBound.js"(exports, module) {
      init_define_process();
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBind = require_call_bind();
      var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));
      module.exports = function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = GetIntrinsic(name, !!allowMissing);
        if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
          return callBind(intrinsic);
        }
        return intrinsic;
      };
    }
  });

  // server/node_modules/is-arguments/index.js
  var require_is_arguments = __commonJS({
    "server/node_modules/is-arguments/index.js"(exports, module) {
      init_define_process();
      "use strict";
      var hasToStringTag = require_shams2()();
      var callBound = require_callBound();
      var $toString = callBound("Object.prototype.toString");
      var isStandardArguments = function isArguments(value) {
        if (hasToStringTag && value && typeof value === "object" && Symbol.toStringTag in value) {
          return false;
        }
        return $toString(value) === "[object Arguments]";
      };
      var isLegacyArguments = function isArguments(value) {
        if (isStandardArguments(value)) {
          return true;
        }
        return value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && $toString(value) !== "[object Array]" && $toString(value.callee) === "[object Function]";
      };
      var supportsStandardArguments = function() {
        return isStandardArguments(arguments);
      }();
      isStandardArguments.isLegacyArguments = isLegacyArguments;
      module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;
    }
  });

  // server/node_modules/is-generator-function/index.js
  var require_is_generator_function = __commonJS({
    "server/node_modules/is-generator-function/index.js"(exports, module) {
      init_define_process();
      "use strict";
      var toStr = Object.prototype.toString;
      var fnToStr = Function.prototype.toString;
      var isFnRegex = /^\s*(?:function)?\*/;
      var hasToStringTag = require_shams2()();
      var getProto = Object.getPrototypeOf;
      var getGeneratorFunc = function() {
        if (!hasToStringTag) {
          return false;
        }
        try {
          return Function("return function*() {}")();
        } catch (e) {
        }
      };
      var GeneratorFunction;
      module.exports = function isGeneratorFunction(fn) {
        if (typeof fn !== "function") {
          return false;
        }
        if (isFnRegex.test(fnToStr.call(fn))) {
          return true;
        }
        if (!hasToStringTag) {
          var str = toStr.call(fn);
          return str === "[object GeneratorFunction]";
        }
        if (!getProto) {
          return false;
        }
        if (typeof GeneratorFunction === "undefined") {
          var generatorFunc = getGeneratorFunc();
          GeneratorFunction = generatorFunc ? getProto(generatorFunc) : false;
        }
        return getProto(fn) === GeneratorFunction;
      };
    }
  });

  // server/node_modules/foreach/index.js
  var require_foreach = __commonJS({
    "server/node_modules/foreach/index.js"(exports, module) {
      init_define_process();
      var hasOwn = Object.prototype.hasOwnProperty;
      var toString = Object.prototype.toString;
      module.exports = function forEach(obj, fn, ctx) {
        if (toString.call(fn) !== "[object Function]") {
          throw new TypeError("iterator must be a function");
        }
        var l = obj.length;
        if (l === +l) {
          for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
          }
        } else {
          for (var k in obj) {
            if (hasOwn.call(obj, k)) {
              fn.call(ctx, obj[k], k, obj);
            }
          }
        }
      };
    }
  });

  // server/node_modules/available-typed-arrays/index.js
  var require_available_typed_arrays = __commonJS({
    "server/node_modules/available-typed-arrays/index.js"(exports, module) {
      init_define_process();
      "use strict";
      var possibleNames = [
        "BigInt64Array",
        "BigUint64Array",
        "Float32Array",
        "Float64Array",
        "Int16Array",
        "Int32Array",
        "Int8Array",
        "Uint16Array",
        "Uint32Array",
        "Uint8Array",
        "Uint8ClampedArray"
      ];
      var g = typeof globalThis === "undefined" ? global : globalThis;
      module.exports = function availableTypedArrays() {
        var out = [];
        for (var i = 0; i < possibleNames.length; i++) {
          if (typeof g[possibleNames[i]] === "function") {
            out[out.length] = possibleNames[i];
          }
        }
        return out;
      };
    }
  });

  // server/node_modules/es-abstract/helpers/getOwnPropertyDescriptor.js
  var require_getOwnPropertyDescriptor = __commonJS({
    "server/node_modules/es-abstract/helpers/getOwnPropertyDescriptor.js"(exports, module) {
      init_define_process();
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%");
      if ($gOPD) {
        try {
          $gOPD([], "length");
        } catch (e) {
          $gOPD = null;
        }
      }
      module.exports = $gOPD;
    }
  });

  // server/node_modules/is-typed-array/index.js
  var require_is_typed_array = __commonJS({
    "server/node_modules/is-typed-array/index.js"(exports, module) {
      init_define_process();
      "use strict";
      var forEach = require_foreach();
      var availableTypedArrays = require_available_typed_arrays();
      var callBound = require_callBound();
      var $toString = callBound("Object.prototype.toString");
      var hasToStringTag = require_shams2()();
      var g = typeof globalThis === "undefined" ? global : globalThis;
      var typedArrays = availableTypedArrays();
      var $indexOf = callBound("Array.prototype.indexOf", true) || function indexOf(array, value) {
        for (var i = 0; i < array.length; i += 1) {
          if (array[i] === value) {
            return i;
          }
        }
        return -1;
      };
      var $slice = callBound("String.prototype.slice");
      var toStrTags = {};
      var gOPD = require_getOwnPropertyDescriptor();
      var getPrototypeOf = Object.getPrototypeOf;
      if (hasToStringTag && gOPD && getPrototypeOf) {
        forEach(typedArrays, function(typedArray) {
          var arr = new g[typedArray]();
          if (Symbol.toStringTag in arr) {
            var proto = getPrototypeOf(arr);
            var descriptor = gOPD(proto, Symbol.toStringTag);
            if (!descriptor) {
              var superProto = getPrototypeOf(proto);
              descriptor = gOPD(superProto, Symbol.toStringTag);
            }
            toStrTags[typedArray] = descriptor.get;
          }
        });
      }
      var tryTypedArrays = function tryAllTypedArrays(value) {
        var anyTrue = false;
        forEach(toStrTags, function(getter, typedArray) {
          if (!anyTrue) {
            try {
              anyTrue = getter.call(value) === typedArray;
            } catch (e) {
            }
          }
        });
        return anyTrue;
      };
      module.exports = function isTypedArray(value) {
        if (!value || typeof value !== "object") {
          return false;
        }
        if (!hasToStringTag || !(Symbol.toStringTag in value)) {
          var tag = $slice($toString(value), 8, -1);
          return $indexOf(typedArrays, tag) > -1;
        }
        if (!gOPD) {
          return false;
        }
        return tryTypedArrays(value);
      };
    }
  });

  // server/node_modules/which-typed-array/index.js
  var require_which_typed_array = __commonJS({
    "server/node_modules/which-typed-array/index.js"(exports, module) {
      init_define_process();
      "use strict";
      var forEach = require_foreach();
      var availableTypedArrays = require_available_typed_arrays();
      var callBound = require_callBound();
      var $toString = callBound("Object.prototype.toString");
      var hasToStringTag = require_shams2()();
      var g = typeof globalThis === "undefined" ? global : globalThis;
      var typedArrays = availableTypedArrays();
      var $slice = callBound("String.prototype.slice");
      var toStrTags = {};
      var gOPD = require_getOwnPropertyDescriptor();
      var getPrototypeOf = Object.getPrototypeOf;
      if (hasToStringTag && gOPD && getPrototypeOf) {
        forEach(typedArrays, function(typedArray) {
          if (typeof g[typedArray] === "function") {
            var arr = new g[typedArray]();
            if (Symbol.toStringTag in arr) {
              var proto = getPrototypeOf(arr);
              var descriptor = gOPD(proto, Symbol.toStringTag);
              if (!descriptor) {
                var superProto = getPrototypeOf(proto);
                descriptor = gOPD(superProto, Symbol.toStringTag);
              }
              toStrTags[typedArray] = descriptor.get;
            }
          }
        });
      }
      var tryTypedArrays = function tryAllTypedArrays(value) {
        var foundName = false;
        forEach(toStrTags, function(getter, typedArray) {
          if (!foundName) {
            try {
              var name = getter.call(value);
              if (name === typedArray) {
                foundName = name;
              }
            } catch (e) {
            }
          }
        });
        return foundName;
      };
      var isTypedArray = require_is_typed_array();
      module.exports = function whichTypedArray(value) {
        if (!isTypedArray(value)) {
          return false;
        }
        if (!hasToStringTag || !(Symbol.toStringTag in value)) {
          return $slice($toString(value), 8, -1);
        }
        return tryTypedArrays(value);
      };
    }
  });

  // server/node_modules/util/support/types.js
  var require_types = __commonJS({
    "server/node_modules/util/support/types.js"(exports) {
      init_define_process();
      "use strict";
      var isArgumentsObject = require_is_arguments();
      var isGeneratorFunction = require_is_generator_function();
      var whichTypedArray = require_which_typed_array();
      var isTypedArray = require_is_typed_array();
      function uncurryThis(f) {
        return f.call.bind(f);
      }
      var BigIntSupported = typeof BigInt !== "undefined";
      var SymbolSupported = typeof Symbol !== "undefined";
      var ObjectToString = uncurryThis(Object.prototype.toString);
      var numberValue = uncurryThis(Number.prototype.valueOf);
      var stringValue = uncurryThis(String.prototype.valueOf);
      var booleanValue = uncurryThis(Boolean.prototype.valueOf);
      if (BigIntSupported) {
        bigIntValue = uncurryThis(BigInt.prototype.valueOf);
      }
      var bigIntValue;
      if (SymbolSupported) {
        symbolValue = uncurryThis(Symbol.prototype.valueOf);
      }
      var symbolValue;
      function checkBoxedPrimitive(value, prototypeValueOf) {
        if (typeof value !== "object") {
          return false;
        }
        try {
          prototypeValueOf(value);
          return true;
        } catch (e) {
          return false;
        }
      }
      exports.isArgumentsObject = isArgumentsObject;
      exports.isGeneratorFunction = isGeneratorFunction;
      exports.isTypedArray = isTypedArray;
      function isPromise(input) {
        return typeof Promise !== "undefined" && input instanceof Promise || input !== null && typeof input === "object" && typeof input.then === "function" && typeof input.catch === "function";
      }
      exports.isPromise = isPromise;
      function isArrayBufferView(value) {
        if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
          return ArrayBuffer.isView(value);
        }
        return isTypedArray(value) || isDataView(value);
      }
      exports.isArrayBufferView = isArrayBufferView;
      function isUint8Array(value) {
        return whichTypedArray(value) === "Uint8Array";
      }
      exports.isUint8Array = isUint8Array;
      function isUint8ClampedArray(value) {
        return whichTypedArray(value) === "Uint8ClampedArray";
      }
      exports.isUint8ClampedArray = isUint8ClampedArray;
      function isUint16Array(value) {
        return whichTypedArray(value) === "Uint16Array";
      }
      exports.isUint16Array = isUint16Array;
      function isUint32Array(value) {
        return whichTypedArray(value) === "Uint32Array";
      }
      exports.isUint32Array = isUint32Array;
      function isInt8Array(value) {
        return whichTypedArray(value) === "Int8Array";
      }
      exports.isInt8Array = isInt8Array;
      function isInt16Array(value) {
        return whichTypedArray(value) === "Int16Array";
      }
      exports.isInt16Array = isInt16Array;
      function isInt32Array(value) {
        return whichTypedArray(value) === "Int32Array";
      }
      exports.isInt32Array = isInt32Array;
      function isFloat32Array(value) {
        return whichTypedArray(value) === "Float32Array";
      }
      exports.isFloat32Array = isFloat32Array;
      function isFloat64Array(value) {
        return whichTypedArray(value) === "Float64Array";
      }
      exports.isFloat64Array = isFloat64Array;
      function isBigInt64Array(value) {
        return whichTypedArray(value) === "BigInt64Array";
      }
      exports.isBigInt64Array = isBigInt64Array;
      function isBigUint64Array(value) {
        return whichTypedArray(value) === "BigUint64Array";
      }
      exports.isBigUint64Array = isBigUint64Array;
      function isMapToString(value) {
        return ObjectToString(value) === "[object Map]";
      }
      isMapToString.working = typeof Map !== "undefined" && isMapToString(new Map());
      function isMap(value) {
        if (typeof Map === "undefined") {
          return false;
        }
        return isMapToString.working ? isMapToString(value) : value instanceof Map;
      }
      exports.isMap = isMap;
      function isSetToString(value) {
        return ObjectToString(value) === "[object Set]";
      }
      isSetToString.working = typeof Set !== "undefined" && isSetToString(new Set());
      function isSet(value) {
        if (typeof Set === "undefined") {
          return false;
        }
        return isSetToString.working ? isSetToString(value) : value instanceof Set;
      }
      exports.isSet = isSet;
      function isWeakMapToString(value) {
        return ObjectToString(value) === "[object WeakMap]";
      }
      isWeakMapToString.working = typeof WeakMap !== "undefined" && isWeakMapToString(new WeakMap());
      function isWeakMap(value) {
        if (typeof WeakMap === "undefined") {
          return false;
        }
        return isWeakMapToString.working ? isWeakMapToString(value) : value instanceof WeakMap;
      }
      exports.isWeakMap = isWeakMap;
      function isWeakSetToString(value) {
        return ObjectToString(value) === "[object WeakSet]";
      }
      isWeakSetToString.working = typeof WeakSet !== "undefined" && isWeakSetToString(new WeakSet());
      function isWeakSet(value) {
        return isWeakSetToString(value);
      }
      exports.isWeakSet = isWeakSet;
      function isArrayBufferToString(value) {
        return ObjectToString(value) === "[object ArrayBuffer]";
      }
      isArrayBufferToString.working = typeof ArrayBuffer !== "undefined" && isArrayBufferToString(new ArrayBuffer());
      function isArrayBuffer(value) {
        if (typeof ArrayBuffer === "undefined") {
          return false;
        }
        return isArrayBufferToString.working ? isArrayBufferToString(value) : value instanceof ArrayBuffer;
      }
      exports.isArrayBuffer = isArrayBuffer;
      function isDataViewToString(value) {
        return ObjectToString(value) === "[object DataView]";
      }
      isDataViewToString.working = typeof ArrayBuffer !== "undefined" && typeof DataView !== "undefined" && isDataViewToString(new DataView(new ArrayBuffer(1), 0, 1));
      function isDataView(value) {
        if (typeof DataView === "undefined") {
          return false;
        }
        return isDataViewToString.working ? isDataViewToString(value) : value instanceof DataView;
      }
      exports.isDataView = isDataView;
      var SharedArrayBufferCopy = typeof SharedArrayBuffer !== "undefined" ? SharedArrayBuffer : void 0;
      function isSharedArrayBufferToString(value) {
        return ObjectToString(value) === "[object SharedArrayBuffer]";
      }
      function isSharedArrayBuffer(value) {
        if (typeof SharedArrayBufferCopy === "undefined") {
          return false;
        }
        if (typeof isSharedArrayBufferToString.working === "undefined") {
          isSharedArrayBufferToString.working = isSharedArrayBufferToString(new SharedArrayBufferCopy());
        }
        return isSharedArrayBufferToString.working ? isSharedArrayBufferToString(value) : value instanceof SharedArrayBufferCopy;
      }
      exports.isSharedArrayBuffer = isSharedArrayBuffer;
      function isAsyncFunction(value) {
        return ObjectToString(value) === "[object AsyncFunction]";
      }
      exports.isAsyncFunction = isAsyncFunction;
      function isMapIterator(value) {
        return ObjectToString(value) === "[object Map Iterator]";
      }
      exports.isMapIterator = isMapIterator;
      function isSetIterator(value) {
        return ObjectToString(value) === "[object Set Iterator]";
      }
      exports.isSetIterator = isSetIterator;
      function isGeneratorObject(value) {
        return ObjectToString(value) === "[object Generator]";
      }
      exports.isGeneratorObject = isGeneratorObject;
      function isWebAssemblyCompiledModule(value) {
        return ObjectToString(value) === "[object WebAssembly.Module]";
      }
      exports.isWebAssemblyCompiledModule = isWebAssemblyCompiledModule;
      function isNumberObject(value) {
        return checkBoxedPrimitive(value, numberValue);
      }
      exports.isNumberObject = isNumberObject;
      function isStringObject(value) {
        return checkBoxedPrimitive(value, stringValue);
      }
      exports.isStringObject = isStringObject;
      function isBooleanObject(value) {
        return checkBoxedPrimitive(value, booleanValue);
      }
      exports.isBooleanObject = isBooleanObject;
      function isBigIntObject(value) {
        return BigIntSupported && checkBoxedPrimitive(value, bigIntValue);
      }
      exports.isBigIntObject = isBigIntObject;
      function isSymbolObject(value) {
        return SymbolSupported && checkBoxedPrimitive(value, symbolValue);
      }
      exports.isSymbolObject = isSymbolObject;
      function isBoxedPrimitive(value) {
        return isNumberObject(value) || isStringObject(value) || isBooleanObject(value) || isBigIntObject(value) || isSymbolObject(value);
      }
      exports.isBoxedPrimitive = isBoxedPrimitive;
      function isAnyArrayBuffer(value) {
        return typeof Uint8Array !== "undefined" && (isArrayBuffer(value) || isSharedArrayBuffer(value));
      }
      exports.isAnyArrayBuffer = isAnyArrayBuffer;
      ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(method) {
        Object.defineProperty(exports, method, {
          enumerable: false,
          value: function() {
            throw new Error(method + " is not supported in userland");
          }
        });
      });
    }
  });

  // server/node_modules/util/support/isBufferBrowser.js
  var require_isBufferBrowser = __commonJS({
    "server/node_modules/util/support/isBufferBrowser.js"(exports, module) {
      init_define_process();
      module.exports = function isBuffer(arg) {
        return arg && typeof arg === "object" && typeof arg.copy === "function" && typeof arg.fill === "function" && typeof arg.readUInt8 === "function";
      };
    }
  });

  // server/node_modules/inherits/inherits_browser.js
  var require_inherits_browser = __commonJS({
    "server/node_modules/inherits/inherits_browser.js"(exports, module) {
      init_define_process();
      if (typeof Object.create === "function") {
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
              constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
              }
            });
          }
        };
      } else {
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function() {
            };
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
          }
        };
      }
    }
  });

  // server/node_modules/util/util.js
  var require_util = __commonJS({
    "server/node_modules/util/util.js"(exports) {
      init_define_process();
      var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function getOwnPropertyDescriptors2(obj) {
        var keys = Object.keys(obj);
        var descriptors = {};
        for (var i = 0; i < keys.length; i++) {
          descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
        }
        return descriptors;
      };
      var formatRegExp = /%[sdj%]/g;
      exports.format = function(f) {
        if (!isString(f)) {
          var objects = [];
          for (var i = 0; i < arguments.length; i++) {
            objects.push(inspect(arguments[i]));
          }
          return objects.join(" ");
        }
        var i = 1;
        var args = arguments;
        var len = args.length;
        var str = String(f).replace(formatRegExp, function(x2) {
          if (x2 === "%%")
            return "%";
          if (i >= len)
            return x2;
          switch (x2) {
            case "%s":
              return String(args[i++]);
            case "%d":
              return Number(args[i++]);
            case "%j":
              try {
                return JSON.stringify(args[i++]);
              } catch (_) {
                return "[Circular]";
              }
            default:
              return x2;
          }
        });
        for (var x = args[i]; i < len; x = args[++i]) {
          if (isNull(x) || !isObject(x)) {
            str += " " + x;
          } else {
            str += " " + inspect(x);
          }
        }
        return str;
      };
      exports.deprecate = function(fn, msg) {
        if (typeof define_process_default !== "undefined" && define_process_default.noDeprecation === true) {
          return fn;
        }
        if (typeof define_process_default === "undefined") {
          return function() {
            return exports.deprecate(fn, msg).apply(this, arguments);
          };
        }
        var warned = false;
        function deprecated() {
          if (!warned) {
            if (define_process_default.throwDeprecation) {
              throw new Error(msg);
            } else if (define_process_default.traceDeprecation) {
              console.trace(msg);
            } else {
              console.error(msg);
            }
            warned = true;
          }
          return fn.apply(this, arguments);
        }
        return deprecated;
      };
      var debugs = {};
      var debugEnvRegex = /^$/;
      if (define_process_default.env.NODE_DEBUG) {
        debugEnv = define_process_default.env.NODE_DEBUG;
        debugEnv = debugEnv.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase();
        debugEnvRegex = new RegExp("^" + debugEnv + "$", "i");
      }
      var debugEnv;
      exports.debuglog = function(set) {
        set = set.toUpperCase();
        if (!debugs[set]) {
          if (debugEnvRegex.test(set)) {
            var pid = define_process_default.pid;
            debugs[set] = function() {
              var msg = exports.format.apply(exports, arguments);
              console.error("%s %d: %s", set, pid, msg);
            };
          } else {
            debugs[set] = function() {
            };
          }
        }
        return debugs[set];
      };
      function inspect(obj, opts) {
        var ctx = {
          seen: [],
          stylize: stylizeNoColor
        };
        if (arguments.length >= 3)
          ctx.depth = arguments[2];
        if (arguments.length >= 4)
          ctx.colors = arguments[3];
        if (isBoolean(opts)) {
          ctx.showHidden = opts;
        } else if (opts) {
          exports._extend(ctx, opts);
        }
        if (isUndefined(ctx.showHidden))
          ctx.showHidden = false;
        if (isUndefined(ctx.depth))
          ctx.depth = 2;
        if (isUndefined(ctx.colors))
          ctx.colors = false;
        if (isUndefined(ctx.customInspect))
          ctx.customInspect = true;
        if (ctx.colors)
          ctx.stylize = stylizeWithColor;
        return formatValue(ctx, obj, ctx.depth);
      }
      exports.inspect = inspect;
      inspect.colors = {
        "bold": [1, 22],
        "italic": [3, 23],
        "underline": [4, 24],
        "inverse": [7, 27],
        "white": [37, 39],
        "grey": [90, 39],
        "black": [30, 39],
        "blue": [34, 39],
        "cyan": [36, 39],
        "green": [32, 39],
        "magenta": [35, 39],
        "red": [31, 39],
        "yellow": [33, 39]
      };
      inspect.styles = {
        "special": "cyan",
        "number": "yellow",
        "boolean": "yellow",
        "undefined": "grey",
        "null": "bold",
        "string": "green",
        "date": "magenta",
        "regexp": "red"
      };
      function stylizeWithColor(str, styleType) {
        var style = inspect.styles[styleType];
        if (style) {
          return "[" + inspect.colors[style][0] + "m" + str + "[" + inspect.colors[style][1] + "m";
        } else {
          return str;
        }
      }
      function stylizeNoColor(str, styleType) {
        return str;
      }
      function arrayToHash(array) {
        var hash = {};
        array.forEach(function(val, idx) {
          hash[val] = true;
        });
        return hash;
      }
      function formatValue(ctx, value, recurseTimes) {
        if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
          var ret = value.inspect(recurseTimes, ctx);
          if (!isString(ret)) {
            ret = formatValue(ctx, ret, recurseTimes);
          }
          return ret;
        }
        var primitive = formatPrimitive(ctx, value);
        if (primitive) {
          return primitive;
        }
        var keys = Object.keys(value);
        var visibleKeys = arrayToHash(keys);
        if (ctx.showHidden) {
          keys = Object.getOwnPropertyNames(value);
        }
        if (isError(value) && (keys.indexOf("message") >= 0 || keys.indexOf("description") >= 0)) {
          return formatError(value);
        }
        if (keys.length === 0) {
          if (isFunction(value)) {
            var name = value.name ? ": " + value.name : "";
            return ctx.stylize("[Function" + name + "]", "special");
          }
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
          }
          if (isDate(value)) {
            return ctx.stylize(Date.prototype.toString.call(value), "date");
          }
          if (isError(value)) {
            return formatError(value);
          }
        }
        var base = "", array = false, braces = ["{", "}"];
        if (isArray(value)) {
          array = true;
          braces = ["[", "]"];
        }
        if (isFunction(value)) {
          var n = value.name ? ": " + value.name : "";
          base = " [Function" + n + "]";
        }
        if (isRegExp(value)) {
          base = " " + RegExp.prototype.toString.call(value);
        }
        if (isDate(value)) {
          base = " " + Date.prototype.toUTCString.call(value);
        }
        if (isError(value)) {
          base = " " + formatError(value);
        }
        if (keys.length === 0 && (!array || value.length == 0)) {
          return braces[0] + base + braces[1];
        }
        if (recurseTimes < 0) {
          if (isRegExp(value)) {
            return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
          } else {
            return ctx.stylize("[Object]", "special");
          }
        }
        ctx.seen.push(value);
        var output;
        if (array) {
          output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
        } else {
          output = keys.map(function(key) {
            return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
          });
        }
        ctx.seen.pop();
        return reduceToSingleString(output, base, braces);
      }
      function formatPrimitive(ctx, value) {
        if (isUndefined(value))
          return ctx.stylize("undefined", "undefined");
        if (isString(value)) {
          var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
          return ctx.stylize(simple, "string");
        }
        if (isNumber(value))
          return ctx.stylize("" + value, "number");
        if (isBoolean(value))
          return ctx.stylize("" + value, "boolean");
        if (isNull(value))
          return ctx.stylize("null", "null");
      }
      function formatError(value) {
        return "[" + Error.prototype.toString.call(value) + "]";
      }
      function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
        var output = [];
        for (var i = 0, l = value.length; i < l; ++i) {
          if (hasOwnProperty(value, String(i))) {
            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
          } else {
            output.push("");
          }
        }
        keys.forEach(function(key) {
          if (!key.match(/^\d+$/)) {
            output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
          }
        });
        return output;
      }
      function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
        var name, str, desc;
        desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
        if (desc.get) {
          if (desc.set) {
            str = ctx.stylize("[Getter/Setter]", "special");
          } else {
            str = ctx.stylize("[Getter]", "special");
          }
        } else {
          if (desc.set) {
            str = ctx.stylize("[Setter]", "special");
          }
        }
        if (!hasOwnProperty(visibleKeys, key)) {
          name = "[" + key + "]";
        }
        if (!str) {
          if (ctx.seen.indexOf(desc.value) < 0) {
            if (isNull(recurseTimes)) {
              str = formatValue(ctx, desc.value, null);
            } else {
              str = formatValue(ctx, desc.value, recurseTimes - 1);
            }
            if (str.indexOf("\n") > -1) {
              if (array) {
                str = str.split("\n").map(function(line) {
                  return "  " + line;
                }).join("\n").substr(2);
              } else {
                str = "\n" + str.split("\n").map(function(line) {
                  return "   " + line;
                }).join("\n");
              }
            }
          } else {
            str = ctx.stylize("[Circular]", "special");
          }
        }
        if (isUndefined(name)) {
          if (array && key.match(/^\d+$/)) {
            return str;
          }
          name = JSON.stringify("" + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.substr(1, name.length - 2);
            name = ctx.stylize(name, "name");
          } else {
            name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
            name = ctx.stylize(name, "string");
          }
        }
        return name + ": " + str;
      }
      function reduceToSingleString(output, base, braces) {
        var numLinesEst = 0;
        var length = output.reduce(function(prev, cur) {
          numLinesEst++;
          if (cur.indexOf("\n") >= 0)
            numLinesEst++;
          return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
        }, 0);
        if (length > 60) {
          return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
        }
        return braces[0] + base + " " + output.join(", ") + " " + braces[1];
      }
      exports.types = require_types();
      function isArray(ar) {
        return Array.isArray(ar);
      }
      exports.isArray = isArray;
      function isBoolean(arg) {
        return typeof arg === "boolean";
      }
      exports.isBoolean = isBoolean;
      function isNull(arg) {
        return arg === null;
      }
      exports.isNull = isNull;
      function isNullOrUndefined(arg) {
        return arg == null;
      }
      exports.isNullOrUndefined = isNullOrUndefined;
      function isNumber(arg) {
        return typeof arg === "number";
      }
      exports.isNumber = isNumber;
      function isString(arg) {
        return typeof arg === "string";
      }
      exports.isString = isString;
      function isSymbol(arg) {
        return typeof arg === "symbol";
      }
      exports.isSymbol = isSymbol;
      function isUndefined(arg) {
        return arg === void 0;
      }
      exports.isUndefined = isUndefined;
      function isRegExp(re) {
        return isObject(re) && objectToString(re) === "[object RegExp]";
      }
      exports.isRegExp = isRegExp;
      exports.types.isRegExp = isRegExp;
      function isObject(arg) {
        return typeof arg === "object" && arg !== null;
      }
      exports.isObject = isObject;
      function isDate(d) {
        return isObject(d) && objectToString(d) === "[object Date]";
      }
      exports.isDate = isDate;
      exports.types.isDate = isDate;
      function isError(e) {
        return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
      }
      exports.isError = isError;
      exports.types.isNativeError = isError;
      function isFunction(arg) {
        return typeof arg === "function";
      }
      exports.isFunction = isFunction;
      function isPrimitive(arg) {
        return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
      }
      exports.isPrimitive = isPrimitive;
      exports.isBuffer = require_isBufferBrowser();
      function objectToString(o) {
        return Object.prototype.toString.call(o);
      }
      function pad(n) {
        return n < 10 ? "0" + n.toString(10) : n.toString(10);
      }
      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];
      function timestamp() {
        var d = new Date();
        var time = [
          pad(d.getHours()),
          pad(d.getMinutes()),
          pad(d.getSeconds())
        ].join(":");
        return [d.getDate(), months[d.getMonth()], time].join(" ");
      }
      exports.log = function() {
        console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments));
      };
      exports.inherits = require_inherits_browser();
      exports._extend = function(origin, add) {
        if (!add || !isObject(add))
          return origin;
        var keys = Object.keys(add);
        var i = keys.length;
        while (i--) {
          origin[keys[i]] = add[keys[i]];
        }
        return origin;
      };
      function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      }
      var kCustomPromisifiedSymbol = typeof Symbol !== "undefined" ? Symbol("util.promisify.custom") : void 0;
      exports.promisify = function promisify(original) {
        if (typeof original !== "function")
          throw new TypeError('The "original" argument must be of type Function');
        if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
          var fn = original[kCustomPromisifiedSymbol];
          if (typeof fn !== "function") {
            throw new TypeError('The "util.promisify.custom" argument must be of type Function');
          }
          Object.defineProperty(fn, kCustomPromisifiedSymbol, {
            value: fn,
            enumerable: false,
            writable: false,
            configurable: true
          });
          return fn;
        }
        function fn() {
          var promiseResolve, promiseReject;
          var promise = new Promise(function(resolve, reject) {
            promiseResolve = resolve;
            promiseReject = reject;
          });
          var args = [];
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
          }
          args.push(function(err, value) {
            if (err) {
              promiseReject(err);
            } else {
              promiseResolve(value);
            }
          });
          try {
            original.apply(this, args);
          } catch (err) {
            promiseReject(err);
          }
          return promise;
        }
        Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
        if (kCustomPromisifiedSymbol)
          Object.defineProperty(fn, kCustomPromisifiedSymbol, {
            value: fn,
            enumerable: false,
            writable: false,
            configurable: true
          });
        return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
      };
      exports.promisify.custom = kCustomPromisifiedSymbol;
      function callbackifyOnRejected(reason, cb) {
        if (!reason) {
          var newReason = new Error("Promise was rejected with a falsy value");
          newReason.reason = reason;
          reason = newReason;
        }
        return cb(reason);
      }
      function callbackify(original) {
        if (typeof original !== "function") {
          throw new TypeError('The "original" argument must be of type Function');
        }
        function callbackified() {
          var args = [];
          for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
          }
          var maybeCb = args.pop();
          if (typeof maybeCb !== "function") {
            throw new TypeError("The last argument must be of type Function");
          }
          var self2 = this;
          var cb = function() {
            return maybeCb.apply(self2, arguments);
          };
          original.apply(this, args).then(function(ret) {
            define_process_default.nextTick(cb.bind(null, null, ret));
          }, function(rej) {
            define_process_default.nextTick(callbackifyOnRejected.bind(null, rej, cb));
          });
        }
        Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
        Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
        return callbackified;
      }
      exports.callbackify = callbackify;
    }
  });

  // server/node_modules/assert/build/internal/errors.js
  var require_errors = __commonJS({
    "server/node_modules/assert/build/internal/errors.js"(exports, module) {
      init_define_process();
      "use strict";
      function _typeof(obj) {
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof2(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function _typeof2(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _possibleConstructorReturn(self2, call) {
        if (call && (_typeof(call) === "object" || typeof call === "function")) {
          return call;
        }
        return _assertThisInitialized(self2);
      }
      function _assertThisInitialized(self2) {
        if (self2 === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return self2;
      }
      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
          return o2.__proto__ || Object.getPrototypeOf(o2);
        };
        return _getPrototypeOf(o);
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
        if (superClass)
          _setPrototypeOf(subClass, superClass);
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
          o2.__proto__ = p2;
          return o2;
        };
        return _setPrototypeOf(o, p);
      }
      var codes = {};
      var assert4;
      var util;
      function createErrorType(code, message, Base) {
        if (!Base) {
          Base = Error;
        }
        function getMessage(arg1, arg2, arg3) {
          if (typeof message === "string") {
            return message;
          } else {
            return message(arg1, arg2, arg3);
          }
        }
        var NodeError = /* @__PURE__ */ function(_Base) {
          _inherits(NodeError2, _Base);
          function NodeError2(arg1, arg2, arg3) {
            var _this;
            _classCallCheck(this, NodeError2);
            _this = _possibleConstructorReturn(this, _getPrototypeOf(NodeError2).call(this, getMessage(arg1, arg2, arg3)));
            _this.code = code;
            return _this;
          }
          return NodeError2;
        }(Base);
        codes[code] = NodeError;
      }
      function oneOf(expected, thing) {
        if (Array.isArray(expected)) {
          var len = expected.length;
          expected = expected.map(function(i) {
            return String(i);
          });
          if (len > 2) {
            return "one of ".concat(thing, " ").concat(expected.slice(0, len - 1).join(", "), ", or ") + expected[len - 1];
          } else if (len === 2) {
            return "one of ".concat(thing, " ").concat(expected[0], " or ").concat(expected[1]);
          } else {
            return "of ".concat(thing, " ").concat(expected[0]);
          }
        } else {
          return "of ".concat(thing, " ").concat(String(expected));
        }
      }
      function startsWith(str, search, pos) {
        return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
      }
      function endsWith(str, search, this_len) {
        if (this_len === void 0 || this_len > str.length) {
          this_len = str.length;
        }
        return str.substring(this_len - search.length, this_len) === search;
      }
      function includes(str, search, start) {
        if (typeof start !== "number") {
          start = 0;
        }
        if (start + search.length > str.length) {
          return false;
        } else {
          return str.indexOf(search, start) !== -1;
        }
      }
      createErrorType("ERR_AMBIGUOUS_ARGUMENT", 'The "%s" argument is ambiguous. %s', TypeError);
      createErrorType("ERR_INVALID_ARG_TYPE", function(name, expected, actual) {
        if (assert4 === void 0)
          assert4 = require_assert();
        assert4(typeof name === "string", "'name' must be a string");
        var determiner;
        if (typeof expected === "string" && startsWith(expected, "not ")) {
          determiner = "must not be";
          expected = expected.replace(/^not /, "");
        } else {
          determiner = "must be";
        }
        var msg;
        if (endsWith(name, " argument")) {
          msg = "The ".concat(name, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
        } else {
          var type = includes(name, ".") ? "property" : "argument";
          msg = 'The "'.concat(name, '" ').concat(type, " ").concat(determiner, " ").concat(oneOf(expected, "type"));
        }
        msg += ". Received type ".concat(_typeof(actual));
        return msg;
      }, TypeError);
      createErrorType("ERR_INVALID_ARG_VALUE", function(name, value) {
        var reason = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "is invalid";
        if (util === void 0)
          util = require_util();
        var inspected = util.inspect(value);
        if (inspected.length > 128) {
          inspected = "".concat(inspected.slice(0, 128), "...");
        }
        return "The argument '".concat(name, "' ").concat(reason, ". Received ").concat(inspected);
      }, TypeError, RangeError);
      createErrorType("ERR_INVALID_RETURN_VALUE", function(input, name, value) {
        var type;
        if (value && value.constructor && value.constructor.name) {
          type = "instance of ".concat(value.constructor.name);
        } else {
          type = "type ".concat(_typeof(value));
        }
        return "Expected ".concat(input, ' to be returned from the "').concat(name, '"') + " function but got ".concat(type, ".");
      }, TypeError);
      createErrorType("ERR_MISSING_ARGS", function() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        if (assert4 === void 0)
          assert4 = require_assert();
        assert4(args.length > 0, "At least one arg needs to be specified");
        var msg = "The ";
        var len = args.length;
        args = args.map(function(a) {
          return '"'.concat(a, '"');
        });
        switch (len) {
          case 1:
            msg += "".concat(args[0], " argument");
            break;
          case 2:
            msg += "".concat(args[0], " and ").concat(args[1], " arguments");
            break;
          default:
            msg += args.slice(0, len - 1).join(", ");
            msg += ", and ".concat(args[len - 1], " arguments");
            break;
        }
        return "".concat(msg, " must be specified");
      }, TypeError);
      module.exports.codes = codes;
    }
  });

  // server/node_modules/assert/build/internal/assert/assertion_error.js
  var require_assertion_error = __commonJS({
    "server/node_modules/assert/build/internal/assert/assertion_error.js"(exports, module) {
      init_define_process();
      "use strict";
      function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
              return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
          }
          ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
          });
        }
        return target;
      }
      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
        } else {
          obj[key] = value;
        }
        return obj;
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }
      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps)
          _defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          _defineProperties(Constructor, staticProps);
        return Constructor;
      }
      function _possibleConstructorReturn(self2, call) {
        if (call && (_typeof(call) === "object" || typeof call === "function")) {
          return call;
        }
        return _assertThisInitialized(self2);
      }
      function _assertThisInitialized(self2) {
        if (self2 === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
        return self2;
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
        if (superClass)
          _setPrototypeOf(subClass, superClass);
      }
      function _wrapNativeSuper(Class) {
        var _cache = typeof Map === "function" ? new Map() : void 0;
        _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
          if (Class2 === null || !_isNativeFunction(Class2))
            return Class2;
          if (typeof Class2 !== "function") {
            throw new TypeError("Super expression must either be null or a function");
          }
          if (typeof _cache !== "undefined") {
            if (_cache.has(Class2))
              return _cache.get(Class2);
            _cache.set(Class2, Wrapper);
          }
          function Wrapper() {
            return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
          }
          Wrapper.prototype = Object.create(Class2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } });
          return _setPrototypeOf(Wrapper, Class2);
        };
        return _wrapNativeSuper(Class);
      }
      function isNativeReflectConstruct() {
        if (typeof Reflect === "undefined" || !Reflect.construct)
          return false;
        if (Reflect.construct.sham)
          return false;
        if (typeof Proxy === "function")
          return true;
        try {
          Date.prototype.toString.call(Reflect.construct(Date, [], function() {
          }));
          return true;
        } catch (e) {
          return false;
        }
      }
      function _construct(Parent, args, Class) {
        if (isNativeReflectConstruct()) {
          _construct = Reflect.construct;
        } else {
          _construct = function _construct2(Parent2, args2, Class2) {
            var a = [null];
            a.push.apply(a, args2);
            var Constructor = Function.bind.apply(Parent2, a);
            var instance = new Constructor();
            if (Class2)
              _setPrototypeOf(instance, Class2.prototype);
            return instance;
          };
        }
        return _construct.apply(null, arguments);
      }
      function _isNativeFunction(fn) {
        return Function.toString.call(fn).indexOf("[native code]") !== -1;
      }
      function _setPrototypeOf(o, p) {
        _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
          o2.__proto__ = p2;
          return o2;
        };
        return _setPrototypeOf(o, p);
      }
      function _getPrototypeOf(o) {
        _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
          return o2.__proto__ || Object.getPrototypeOf(o2);
        };
        return _getPrototypeOf(o);
      }
      function _typeof(obj) {
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof2(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function _typeof2(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      var _require = require_util();
      var inspect = _require.inspect;
      var _require2 = require_errors();
      var ERR_INVALID_ARG_TYPE = _require2.codes.ERR_INVALID_ARG_TYPE;
      function endsWith(str, search, this_len) {
        if (this_len === void 0 || this_len > str.length) {
          this_len = str.length;
        }
        return str.substring(this_len - search.length, this_len) === search;
      }
      function repeat(str, count) {
        count = Math.floor(count);
        if (str.length == 0 || count == 0)
          return "";
        var maxCount = str.length * count;
        count = Math.floor(Math.log(count) / Math.log(2));
        while (count) {
          str += str;
          count--;
        }
        str += str.substring(0, maxCount - str.length);
        return str;
      }
      var blue = "";
      var green = "";
      var red = "";
      var white = "";
      var kReadableOperator = {
        deepStrictEqual: "Expected values to be strictly deep-equal:",
        strictEqual: "Expected values to be strictly equal:",
        strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
        deepEqual: "Expected values to be loosely deep-equal:",
        equal: "Expected values to be loosely equal:",
        notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
        notStrictEqual: 'Expected "actual" to be strictly unequal to:',
        notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
        notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
        notEqual: 'Expected "actual" to be loosely unequal to:',
        notIdentical: "Values identical but not reference-equal:"
      };
      var kMaxShortLength = 10;
      function copyError(source) {
        var keys = Object.keys(source);
        var target = Object.create(Object.getPrototypeOf(source));
        keys.forEach(function(key) {
          target[key] = source[key];
        });
        Object.defineProperty(target, "message", {
          value: source.message
        });
        return target;
      }
      function inspectValue(val) {
        return inspect(val, {
          compact: false,
          customInspect: false,
          depth: 1e3,
          maxArrayLength: Infinity,
          showHidden: false,
          breakLength: Infinity,
          showProxy: false,
          sorted: true,
          getters: true
        });
      }
      function createErrDiff(actual, expected, operator) {
        var other = "";
        var res = "";
        var lastPos = 0;
        var end = "";
        var skipped = false;
        var actualInspected = inspectValue(actual);
        var actualLines = actualInspected.split("\n");
        var expectedLines = inspectValue(expected).split("\n");
        var i = 0;
        var indicator = "";
        if (operator === "strictEqual" && _typeof(actual) === "object" && _typeof(expected) === "object" && actual !== null && expected !== null) {
          operator = "strictEqualObject";
        }
        if (actualLines.length === 1 && expectedLines.length === 1 && actualLines[0] !== expectedLines[0]) {
          var inputLength = actualLines[0].length + expectedLines[0].length;
          if (inputLength <= kMaxShortLength) {
            if ((_typeof(actual) !== "object" || actual === null) && (_typeof(expected) !== "object" || expected === null) && (actual !== 0 || expected !== 0)) {
              return "".concat(kReadableOperator[operator], "\n\n") + "".concat(actualLines[0], " !== ").concat(expectedLines[0], "\n");
            }
          } else if (operator !== "strictEqualObject") {
            var maxLength = define_process_default.stderr && define_process_default.stderr.isTTY ? define_process_default.stderr.columns : 80;
            if (inputLength < maxLength) {
              while (actualLines[0][i] === expectedLines[0][i]) {
                i++;
              }
              if (i > 2) {
                indicator = "\n  ".concat(repeat(" ", i), "^");
                i = 0;
              }
            }
          }
        }
        var a = actualLines[actualLines.length - 1];
        var b = expectedLines[expectedLines.length - 1];
        while (a === b) {
          if (i++ < 2) {
            end = "\n  ".concat(a).concat(end);
          } else {
            other = a;
          }
          actualLines.pop();
          expectedLines.pop();
          if (actualLines.length === 0 || expectedLines.length === 0)
            break;
          a = actualLines[actualLines.length - 1];
          b = expectedLines[expectedLines.length - 1];
        }
        var maxLines = Math.max(actualLines.length, expectedLines.length);
        if (maxLines === 0) {
          var _actualLines = actualInspected.split("\n");
          if (_actualLines.length > 30) {
            _actualLines[26] = "".concat(blue, "...").concat(white);
            while (_actualLines.length > 27) {
              _actualLines.pop();
            }
          }
          return "".concat(kReadableOperator.notIdentical, "\n\n").concat(_actualLines.join("\n"), "\n");
        }
        if (i > 3) {
          end = "\n".concat(blue, "...").concat(white).concat(end);
          skipped = true;
        }
        if (other !== "") {
          end = "\n  ".concat(other).concat(end);
          other = "";
        }
        var printedLines = 0;
        var msg = kReadableOperator[operator] + "\n".concat(green, "+ actual").concat(white, " ").concat(red, "- expected").concat(white);
        var skippedMsg = " ".concat(blue, "...").concat(white, " Lines skipped");
        for (i = 0; i < maxLines; i++) {
          var cur = i - lastPos;
          if (actualLines.length < i + 1) {
            if (cur > 1 && i > 2) {
              if (cur > 4) {
                res += "\n".concat(blue, "...").concat(white);
                skipped = true;
              } else if (cur > 3) {
                res += "\n  ".concat(expectedLines[i - 2]);
                printedLines++;
              }
              res += "\n  ".concat(expectedLines[i - 1]);
              printedLines++;
            }
            lastPos = i;
            other += "\n".concat(red, "-").concat(white, " ").concat(expectedLines[i]);
            printedLines++;
          } else if (expectedLines.length < i + 1) {
            if (cur > 1 && i > 2) {
              if (cur > 4) {
                res += "\n".concat(blue, "...").concat(white);
                skipped = true;
              } else if (cur > 3) {
                res += "\n  ".concat(actualLines[i - 2]);
                printedLines++;
              }
              res += "\n  ".concat(actualLines[i - 1]);
              printedLines++;
            }
            lastPos = i;
            res += "\n".concat(green, "+").concat(white, " ").concat(actualLines[i]);
            printedLines++;
          } else {
            var expectedLine = expectedLines[i];
            var actualLine = actualLines[i];
            var divergingLines = actualLine !== expectedLine && (!endsWith(actualLine, ",") || actualLine.slice(0, -1) !== expectedLine);
            if (divergingLines && endsWith(expectedLine, ",") && expectedLine.slice(0, -1) === actualLine) {
              divergingLines = false;
              actualLine += ",";
            }
            if (divergingLines) {
              if (cur > 1 && i > 2) {
                if (cur > 4) {
                  res += "\n".concat(blue, "...").concat(white);
                  skipped = true;
                } else if (cur > 3) {
                  res += "\n  ".concat(actualLines[i - 2]);
                  printedLines++;
                }
                res += "\n  ".concat(actualLines[i - 1]);
                printedLines++;
              }
              lastPos = i;
              res += "\n".concat(green, "+").concat(white, " ").concat(actualLine);
              other += "\n".concat(red, "-").concat(white, " ").concat(expectedLine);
              printedLines += 2;
            } else {
              res += other;
              other = "";
              if (cur === 1 || i === 0) {
                res += "\n  ".concat(actualLine);
                printedLines++;
              }
            }
          }
          if (printedLines > 20 && i < maxLines - 2) {
            return "".concat(msg).concat(skippedMsg, "\n").concat(res, "\n").concat(blue, "...").concat(white).concat(other, "\n") + "".concat(blue, "...").concat(white);
          }
        }
        return "".concat(msg).concat(skipped ? skippedMsg : "", "\n").concat(res).concat(other).concat(end).concat(indicator);
      }
      var AssertionError = /* @__PURE__ */ function(_Error) {
        _inherits(AssertionError2, _Error);
        function AssertionError2(options) {
          var _this;
          _classCallCheck(this, AssertionError2);
          if (_typeof(options) !== "object" || options === null) {
            throw new ERR_INVALID_ARG_TYPE("options", "Object", options);
          }
          var message = options.message, operator = options.operator, stackStartFn = options.stackStartFn;
          var actual = options.actual, expected = options.expected;
          var limit = Error.stackTraceLimit;
          Error.stackTraceLimit = 0;
          if (message != null) {
            _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError2).call(this, String(message)));
          } else {
            if (define_process_default.stderr && define_process_default.stderr.isTTY) {
              if (define_process_default.stderr && define_process_default.stderr.getColorDepth && define_process_default.stderr.getColorDepth() !== 1) {
                blue = "[34m";
                green = "[32m";
                white = "[39m";
                red = "[31m";
              } else {
                blue = "";
                green = "";
                white = "";
                red = "";
              }
            }
            if (_typeof(actual) === "object" && actual !== null && _typeof(expected) === "object" && expected !== null && "stack" in actual && actual instanceof Error && "stack" in expected && expected instanceof Error) {
              actual = copyError(actual);
              expected = copyError(expected);
            }
            if (operator === "deepStrictEqual" || operator === "strictEqual") {
              _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError2).call(this, createErrDiff(actual, expected, operator)));
            } else if (operator === "notDeepStrictEqual" || operator === "notStrictEqual") {
              var base = kReadableOperator[operator];
              var res = inspectValue(actual).split("\n");
              if (operator === "notStrictEqual" && _typeof(actual) === "object" && actual !== null) {
                base = kReadableOperator.notStrictEqualObject;
              }
              if (res.length > 30) {
                res[26] = "".concat(blue, "...").concat(white);
                while (res.length > 27) {
                  res.pop();
                }
              }
              if (res.length === 1) {
                _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError2).call(this, "".concat(base, " ").concat(res[0])));
              } else {
                _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError2).call(this, "".concat(base, "\n\n").concat(res.join("\n"), "\n")));
              }
            } else {
              var _res = inspectValue(actual);
              var other = "";
              var knownOperators = kReadableOperator[operator];
              if (operator === "notDeepEqual" || operator === "notEqual") {
                _res = "".concat(kReadableOperator[operator], "\n\n").concat(_res);
                if (_res.length > 1024) {
                  _res = "".concat(_res.slice(0, 1021), "...");
                }
              } else {
                other = "".concat(inspectValue(expected));
                if (_res.length > 512) {
                  _res = "".concat(_res.slice(0, 509), "...");
                }
                if (other.length > 512) {
                  other = "".concat(other.slice(0, 509), "...");
                }
                if (operator === "deepEqual" || operator === "equal") {
                  _res = "".concat(knownOperators, "\n\n").concat(_res, "\n\nshould equal\n\n");
                } else {
                  other = " ".concat(operator, " ").concat(other);
                }
              }
              _this = _possibleConstructorReturn(this, _getPrototypeOf(AssertionError2).call(this, "".concat(_res).concat(other)));
            }
          }
          Error.stackTraceLimit = limit;
          _this.generatedMessage = !message;
          Object.defineProperty(_assertThisInitialized(_this), "name", {
            value: "AssertionError [ERR_ASSERTION]",
            enumerable: false,
            writable: true,
            configurable: true
          });
          _this.code = "ERR_ASSERTION";
          _this.actual = actual;
          _this.expected = expected;
          _this.operator = operator;
          if (Error.captureStackTrace) {
            Error.captureStackTrace(_assertThisInitialized(_this), stackStartFn);
          }
          _this.stack;
          _this.name = "AssertionError";
          return _possibleConstructorReturn(_this);
        }
        _createClass(AssertionError2, [{
          key: "toString",
          value: function toString() {
            return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
          }
        }, {
          key: inspect.custom,
          value: function value(recurseTimes, ctx) {
            return inspect(this, _objectSpread({}, ctx, {
              customInspect: false,
              depth: 0
            }));
          }
        }]);
        return AssertionError2;
      }(_wrapNativeSuper(Error));
      module.exports = AssertionError;
    }
  });

  // server/node_modules/es6-object-assign/index.js
  var require_es6_object_assign = __commonJS({
    "server/node_modules/es6-object-assign/index.js"(exports, module) {
      init_define_process();
      "use strict";
      function assign(target, firstSource) {
        if (target === void 0 || target === null) {
          throw new TypeError("Cannot convert first argument to object");
        }
        var to = Object(target);
        for (var i = 1; i < arguments.length; i++) {
          var nextSource = arguments[i];
          if (nextSource === void 0 || nextSource === null) {
            continue;
          }
          var keysArray = Object.keys(Object(nextSource));
          for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
            var nextKey = keysArray[nextIndex];
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
            if (desc !== void 0 && desc.enumerable) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
        return to;
      }
      function polyfill() {
        if (!Object.assign) {
          Object.defineProperty(Object, "assign", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: assign
          });
        }
      }
      module.exports = {
        assign,
        polyfill
      };
    }
  });

  // server/node_modules/object-keys/isArguments.js
  var require_isArguments = __commonJS({
    "server/node_modules/object-keys/isArguments.js"(exports, module) {
      init_define_process();
      "use strict";
      var toStr = Object.prototype.toString;
      module.exports = function isArguments(value) {
        var str = toStr.call(value);
        var isArgs = str === "[object Arguments]";
        if (!isArgs) {
          isArgs = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toStr.call(value.callee) === "[object Function]";
        }
        return isArgs;
      };
    }
  });

  // server/node_modules/object-keys/implementation.js
  var require_implementation2 = __commonJS({
    "server/node_modules/object-keys/implementation.js"(exports, module) {
      init_define_process();
      "use strict";
      var keysShim;
      if (!Object.keys) {
        has = Object.prototype.hasOwnProperty;
        toStr = Object.prototype.toString;
        isArgs = require_isArguments();
        isEnumerable = Object.prototype.propertyIsEnumerable;
        hasDontEnumBug = !isEnumerable.call({ toString: null }, "toString");
        hasProtoEnumBug = isEnumerable.call(function() {
        }, "prototype");
        dontEnums = [
          "toString",
          "toLocaleString",
          "valueOf",
          "hasOwnProperty",
          "isPrototypeOf",
          "propertyIsEnumerable",
          "constructor"
        ];
        equalsConstructorPrototype = function(o) {
          var ctor = o.constructor;
          return ctor && ctor.prototype === o;
        };
        excludedKeys = {
          $applicationCache: true,
          $console: true,
          $external: true,
          $frame: true,
          $frameElement: true,
          $frames: true,
          $innerHeight: true,
          $innerWidth: true,
          $onmozfullscreenchange: true,
          $onmozfullscreenerror: true,
          $outerHeight: true,
          $outerWidth: true,
          $pageXOffset: true,
          $pageYOffset: true,
          $parent: true,
          $scrollLeft: true,
          $scrollTop: true,
          $scrollX: true,
          $scrollY: true,
          $self: true,
          $webkitIndexedDB: true,
          $webkitStorageInfo: true,
          $window: true
        };
        hasAutomationEqualityBug = function() {
          if (typeof window === "undefined") {
            return false;
          }
          for (var k in window) {
            try {
              if (!excludedKeys["$" + k] && has.call(window, k) && window[k] !== null && typeof window[k] === "object") {
                try {
                  equalsConstructorPrototype(window[k]);
                } catch (e) {
                  return true;
                }
              }
            } catch (e) {
              return true;
            }
          }
          return false;
        }();
        equalsConstructorPrototypeIfNotBuggy = function(o) {
          if (typeof window === "undefined" || !hasAutomationEqualityBug) {
            return equalsConstructorPrototype(o);
          }
          try {
            return equalsConstructorPrototype(o);
          } catch (e) {
            return false;
          }
        };
        keysShim = function keys(object) {
          var isObject = object !== null && typeof object === "object";
          var isFunction = toStr.call(object) === "[object Function]";
          var isArguments = isArgs(object);
          var isString = isObject && toStr.call(object) === "[object String]";
          var theKeys = [];
          if (!isObject && !isFunction && !isArguments) {
            throw new TypeError("Object.keys called on a non-object");
          }
          var skipProto = hasProtoEnumBug && isFunction;
          if (isString && object.length > 0 && !has.call(object, 0)) {
            for (var i = 0; i < object.length; ++i) {
              theKeys.push(String(i));
            }
          }
          if (isArguments && object.length > 0) {
            for (var j = 0; j < object.length; ++j) {
              theKeys.push(String(j));
            }
          } else {
            for (var name in object) {
              if (!(skipProto && name === "prototype") && has.call(object, name)) {
                theKeys.push(String(name));
              }
            }
          }
          if (hasDontEnumBug) {
            var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
            for (var k = 0; k < dontEnums.length; ++k) {
              if (!(skipConstructor && dontEnums[k] === "constructor") && has.call(object, dontEnums[k])) {
                theKeys.push(dontEnums[k]);
              }
            }
          }
          return theKeys;
        };
      }
      var has;
      var toStr;
      var isArgs;
      var isEnumerable;
      var hasDontEnumBug;
      var hasProtoEnumBug;
      var dontEnums;
      var equalsConstructorPrototype;
      var excludedKeys;
      var hasAutomationEqualityBug;
      var equalsConstructorPrototypeIfNotBuggy;
      module.exports = keysShim;
    }
  });

  // server/node_modules/object-keys/index.js
  var require_object_keys = __commonJS({
    "server/node_modules/object-keys/index.js"(exports, module) {
      init_define_process();
      "use strict";
      var slice = Array.prototype.slice;
      var isArgs = require_isArguments();
      var origKeys = Object.keys;
      var keysShim = origKeys ? function keys(o) {
        return origKeys(o);
      } : require_implementation2();
      var originalKeys = Object.keys;
      keysShim.shim = function shimObjectKeys() {
        if (Object.keys) {
          var keysWorksWithArguments = function() {
            var args = Object.keys(arguments);
            return args && args.length === arguments.length;
          }(1, 2);
          if (!keysWorksWithArguments) {
            Object.keys = function keys(object) {
              if (isArgs(object)) {
                return originalKeys(slice.call(object));
              }
              return originalKeys(object);
            };
          }
        } else {
          Object.keys = keysShim;
        }
        return Object.keys || keysShim;
      };
      module.exports = keysShim;
    }
  });

  // server/node_modules/define-properties/index.js
  var require_define_properties = __commonJS({
    "server/node_modules/define-properties/index.js"(exports, module) {
      init_define_process();
      "use strict";
      var keys = require_object_keys();
      var hasSymbols = typeof Symbol === "function" && typeof Symbol("foo") === "symbol";
      var toStr = Object.prototype.toString;
      var concat = Array.prototype.concat;
      var origDefineProperty = Object.defineProperty;
      var isFunction = function(fn) {
        return typeof fn === "function" && toStr.call(fn) === "[object Function]";
      };
      var arePropertyDescriptorsSupported = function() {
        var obj = {};
        try {
          origDefineProperty(obj, "x", { enumerable: false, value: obj });
          for (var _ in obj) {
            return false;
          }
          return obj.x === obj;
        } catch (e) {
          return false;
        }
      };
      var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();
      var defineProperty = function(object, name, value, predicate) {
        if (name in object && (!isFunction(predicate) || !predicate())) {
          return;
        }
        if (supportsDescriptors) {
          origDefineProperty(object, name, {
            configurable: true,
            enumerable: false,
            value,
            writable: true
          });
        } else {
          object[name] = value;
        }
      };
      var defineProperties = function(object, map) {
        var predicates = arguments.length > 2 ? arguments[2] : {};
        var props = keys(map);
        if (hasSymbols) {
          props = concat.call(props, Object.getOwnPropertySymbols(map));
        }
        for (var i = 0; i < props.length; i += 1) {
          defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
        }
      };
      defineProperties.supportsDescriptors = !!supportsDescriptors;
      module.exports = defineProperties;
    }
  });

  // server/node_modules/object-is/implementation.js
  var require_implementation3 = __commonJS({
    "server/node_modules/object-is/implementation.js"(exports, module) {
      init_define_process();
      "use strict";
      var numberIsNaN = function(value) {
        return value !== value;
      };
      module.exports = function is(a, b) {
        if (a === 0 && b === 0) {
          return 1 / a === 1 / b;
        }
        if (a === b) {
          return true;
        }
        if (numberIsNaN(a) && numberIsNaN(b)) {
          return true;
        }
        return false;
      };
    }
  });

  // server/node_modules/object-is/polyfill.js
  var require_polyfill = __commonJS({
    "server/node_modules/object-is/polyfill.js"(exports, module) {
      init_define_process();
      "use strict";
      var implementation = require_implementation3();
      module.exports = function getPolyfill() {
        return typeof Object.is === "function" ? Object.is : implementation;
      };
    }
  });

  // server/node_modules/object-is/shim.js
  var require_shim = __commonJS({
    "server/node_modules/object-is/shim.js"(exports, module) {
      init_define_process();
      "use strict";
      var getPolyfill = require_polyfill();
      var define2 = require_define_properties();
      module.exports = function shimObjectIs() {
        var polyfill = getPolyfill();
        define2(Object, { is: polyfill }, {
          is: function testObjectIs() {
            return Object.is !== polyfill;
          }
        });
        return polyfill;
      };
    }
  });

  // server/node_modules/object-is/index.js
  var require_object_is = __commonJS({
    "server/node_modules/object-is/index.js"(exports, module) {
      init_define_process();
      "use strict";
      var define2 = require_define_properties();
      var callBind = require_call_bind();
      var implementation = require_implementation3();
      var getPolyfill = require_polyfill();
      var shim = require_shim();
      var polyfill = callBind(getPolyfill(), Object);
      define2(polyfill, {
        getPolyfill,
        implementation,
        shim
      });
      module.exports = polyfill;
    }
  });

  // server/node_modules/is-nan/implementation.js
  var require_implementation4 = __commonJS({
    "server/node_modules/is-nan/implementation.js"(exports, module) {
      init_define_process();
      "use strict";
      module.exports = function isNaN2(value) {
        return value !== value;
      };
    }
  });

  // server/node_modules/is-nan/polyfill.js
  var require_polyfill2 = __commonJS({
    "server/node_modules/is-nan/polyfill.js"(exports, module) {
      init_define_process();
      "use strict";
      var implementation = require_implementation4();
      module.exports = function getPolyfill() {
        if (Number.isNaN && Number.isNaN(NaN) && !Number.isNaN("a")) {
          return Number.isNaN;
        }
        return implementation;
      };
    }
  });

  // server/node_modules/is-nan/shim.js
  var require_shim2 = __commonJS({
    "server/node_modules/is-nan/shim.js"(exports, module) {
      init_define_process();
      "use strict";
      var define2 = require_define_properties();
      var getPolyfill = require_polyfill2();
      module.exports = function shimNumberIsNaN() {
        var polyfill = getPolyfill();
        define2(Number, { isNaN: polyfill }, {
          isNaN: function testIsNaN() {
            return Number.isNaN !== polyfill;
          }
        });
        return polyfill;
      };
    }
  });

  // server/node_modules/is-nan/index.js
  var require_is_nan = __commonJS({
    "server/node_modules/is-nan/index.js"(exports, module) {
      init_define_process();
      "use strict";
      var callBind = require_call_bind();
      var define2 = require_define_properties();
      var implementation = require_implementation4();
      var getPolyfill = require_polyfill2();
      var shim = require_shim2();
      var polyfill = callBind(getPolyfill(), Number);
      define2(polyfill, {
        getPolyfill,
        implementation,
        shim
      });
      module.exports = polyfill;
    }
  });

  // server/node_modules/assert/build/internal/util/comparisons.js
  var require_comparisons = __commonJS({
    "server/node_modules/assert/build/internal/util/comparisons.js"(exports, module) {
      init_define_process();
      "use strict";
      function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
      function _iterableToArrayLimit(arr, i) {
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = void 0;
        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i)
              break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i["return"] != null)
              _i["return"]();
          } finally {
            if (_d)
              throw _e;
          }
        }
        return _arr;
      }
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr))
          return arr;
      }
      function _typeof(obj) {
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof2(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function _typeof2(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      var regexFlagsSupported = /a/g.flags !== void 0;
      var arrayFromSet = function arrayFromSet2(set) {
        var array = [];
        set.forEach(function(value) {
          return array.push(value);
        });
        return array;
      };
      var arrayFromMap = function arrayFromMap2(map) {
        var array = [];
        map.forEach(function(value, key) {
          return array.push([key, value]);
        });
        return array;
      };
      var objectIs = Object.is ? Object.is : require_object_is();
      var objectGetOwnPropertySymbols = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
        return [];
      };
      var numberIsNaN = Number.isNaN ? Number.isNaN : require_is_nan();
      function uncurryThis(f) {
        return f.call.bind(f);
      }
      var hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
      var propertyIsEnumerable = uncurryThis(Object.prototype.propertyIsEnumerable);
      var objectToString = uncurryThis(Object.prototype.toString);
      var _require$types = require_util().types;
      var isAnyArrayBuffer = _require$types.isAnyArrayBuffer;
      var isArrayBufferView = _require$types.isArrayBufferView;
      var isDate = _require$types.isDate;
      var isMap = _require$types.isMap;
      var isRegExp = _require$types.isRegExp;
      var isSet = _require$types.isSet;
      var isNativeError = _require$types.isNativeError;
      var isBoxedPrimitive = _require$types.isBoxedPrimitive;
      var isNumberObject = _require$types.isNumberObject;
      var isStringObject = _require$types.isStringObject;
      var isBooleanObject = _require$types.isBooleanObject;
      var isBigIntObject = _require$types.isBigIntObject;
      var isSymbolObject = _require$types.isSymbolObject;
      var isFloat32Array = _require$types.isFloat32Array;
      var isFloat64Array = _require$types.isFloat64Array;
      function isNonIndex(key) {
        if (key.length === 0 || key.length > 10)
          return true;
        for (var i = 0; i < key.length; i++) {
          var code = key.charCodeAt(i);
          if (code < 48 || code > 57)
            return true;
        }
        return key.length === 10 && key >= Math.pow(2, 32);
      }
      function getOwnNonIndexProperties(value) {
        return Object.keys(value).filter(isNonIndex).concat(objectGetOwnPropertySymbols(value).filter(Object.prototype.propertyIsEnumerable.bind(value)));
      }
      function compare(a, b) {
        if (a === b) {
          return 0;
        }
        var x = a.length;
        var y = b.length;
        for (var i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y) {
          return -1;
        }
        if (y < x) {
          return 1;
        }
        return 0;
      }
      var ONLY_ENUMERABLE = void 0;
      var kStrict = true;
      var kLoose = false;
      var kNoIterator = 0;
      var kIsArray = 1;
      var kIsSet = 2;
      var kIsMap = 3;
      function areSimilarRegExps(a, b) {
        return regexFlagsSupported ? a.source === b.source && a.flags === b.flags : RegExp.prototype.toString.call(a) === RegExp.prototype.toString.call(b);
      }
      function areSimilarFloatArrays(a, b) {
        if (a.byteLength !== b.byteLength) {
          return false;
        }
        for (var offset = 0; offset < a.byteLength; offset++) {
          if (a[offset] !== b[offset]) {
            return false;
          }
        }
        return true;
      }
      function areSimilarTypedArrays(a, b) {
        if (a.byteLength !== b.byteLength) {
          return false;
        }
        return compare(new Uint8Array(a.buffer, a.byteOffset, a.byteLength), new Uint8Array(b.buffer, b.byteOffset, b.byteLength)) === 0;
      }
      function areEqualArrayBuffers(buf1, buf2) {
        return buf1.byteLength === buf2.byteLength && compare(new Uint8Array(buf1), new Uint8Array(buf2)) === 0;
      }
      function isEqualBoxedPrimitive(val1, val2) {
        if (isNumberObject(val1)) {
          return isNumberObject(val2) && objectIs(Number.prototype.valueOf.call(val1), Number.prototype.valueOf.call(val2));
        }
        if (isStringObject(val1)) {
          return isStringObject(val2) && String.prototype.valueOf.call(val1) === String.prototype.valueOf.call(val2);
        }
        if (isBooleanObject(val1)) {
          return isBooleanObject(val2) && Boolean.prototype.valueOf.call(val1) === Boolean.prototype.valueOf.call(val2);
        }
        if (isBigIntObject(val1)) {
          return isBigIntObject(val2) && BigInt.prototype.valueOf.call(val1) === BigInt.prototype.valueOf.call(val2);
        }
        return isSymbolObject(val2) && Symbol.prototype.valueOf.call(val1) === Symbol.prototype.valueOf.call(val2);
      }
      function innerDeepEqual(val1, val2, strict, memos) {
        if (val1 === val2) {
          if (val1 !== 0)
            return true;
          return strict ? objectIs(val1, val2) : true;
        }
        if (strict) {
          if (_typeof(val1) !== "object") {
            return typeof val1 === "number" && numberIsNaN(val1) && numberIsNaN(val2);
          }
          if (_typeof(val2) !== "object" || val1 === null || val2 === null) {
            return false;
          }
          if (Object.getPrototypeOf(val1) !== Object.getPrototypeOf(val2)) {
            return false;
          }
        } else {
          if (val1 === null || _typeof(val1) !== "object") {
            if (val2 === null || _typeof(val2) !== "object") {
              return val1 == val2;
            }
            return false;
          }
          if (val2 === null || _typeof(val2) !== "object") {
            return false;
          }
        }
        var val1Tag = objectToString(val1);
        var val2Tag = objectToString(val2);
        if (val1Tag !== val2Tag) {
          return false;
        }
        if (Array.isArray(val1)) {
          if (val1.length !== val2.length) {
            return false;
          }
          var keys1 = getOwnNonIndexProperties(val1, ONLY_ENUMERABLE);
          var keys2 = getOwnNonIndexProperties(val2, ONLY_ENUMERABLE);
          if (keys1.length !== keys2.length) {
            return false;
          }
          return keyCheck(val1, val2, strict, memos, kIsArray, keys1);
        }
        if (val1Tag === "[object Object]") {
          if (!isMap(val1) && isMap(val2) || !isSet(val1) && isSet(val2)) {
            return false;
          }
        }
        if (isDate(val1)) {
          if (!isDate(val2) || Date.prototype.getTime.call(val1) !== Date.prototype.getTime.call(val2)) {
            return false;
          }
        } else if (isRegExp(val1)) {
          if (!isRegExp(val2) || !areSimilarRegExps(val1, val2)) {
            return false;
          }
        } else if (isNativeError(val1) || val1 instanceof Error) {
          if (val1.message !== val2.message || val1.name !== val2.name) {
            return false;
          }
        } else if (isArrayBufferView(val1)) {
          if (!strict && (isFloat32Array(val1) || isFloat64Array(val1))) {
            if (!areSimilarFloatArrays(val1, val2)) {
              return false;
            }
          } else if (!areSimilarTypedArrays(val1, val2)) {
            return false;
          }
          var _keys = getOwnNonIndexProperties(val1, ONLY_ENUMERABLE);
          var _keys2 = getOwnNonIndexProperties(val2, ONLY_ENUMERABLE);
          if (_keys.length !== _keys2.length) {
            return false;
          }
          return keyCheck(val1, val2, strict, memos, kNoIterator, _keys);
        } else if (isSet(val1)) {
          if (!isSet(val2) || val1.size !== val2.size) {
            return false;
          }
          return keyCheck(val1, val2, strict, memos, kIsSet);
        } else if (isMap(val1)) {
          if (!isMap(val2) || val1.size !== val2.size) {
            return false;
          }
          return keyCheck(val1, val2, strict, memos, kIsMap);
        } else if (isAnyArrayBuffer(val1)) {
          if (!areEqualArrayBuffers(val1, val2)) {
            return false;
          }
        } else if (isBoxedPrimitive(val1) && !isEqualBoxedPrimitive(val1, val2)) {
          return false;
        }
        return keyCheck(val1, val2, strict, memos, kNoIterator);
      }
      function getEnumerables(val, keys) {
        return keys.filter(function(k) {
          return propertyIsEnumerable(val, k);
        });
      }
      function keyCheck(val1, val2, strict, memos, iterationType, aKeys) {
        if (arguments.length === 5) {
          aKeys = Object.keys(val1);
          var bKeys = Object.keys(val2);
          if (aKeys.length !== bKeys.length) {
            return false;
          }
        }
        var i = 0;
        for (; i < aKeys.length; i++) {
          if (!hasOwnProperty(val2, aKeys[i])) {
            return false;
          }
        }
        if (strict && arguments.length === 5) {
          var symbolKeysA = objectGetOwnPropertySymbols(val1);
          if (symbolKeysA.length !== 0) {
            var count = 0;
            for (i = 0; i < symbolKeysA.length; i++) {
              var key = symbolKeysA[i];
              if (propertyIsEnumerable(val1, key)) {
                if (!propertyIsEnumerable(val2, key)) {
                  return false;
                }
                aKeys.push(key);
                count++;
              } else if (propertyIsEnumerable(val2, key)) {
                return false;
              }
            }
            var symbolKeysB = objectGetOwnPropertySymbols(val2);
            if (symbolKeysA.length !== symbolKeysB.length && getEnumerables(val2, symbolKeysB).length !== count) {
              return false;
            }
          } else {
            var _symbolKeysB = objectGetOwnPropertySymbols(val2);
            if (_symbolKeysB.length !== 0 && getEnumerables(val2, _symbolKeysB).length !== 0) {
              return false;
            }
          }
        }
        if (aKeys.length === 0 && (iterationType === kNoIterator || iterationType === kIsArray && val1.length === 0 || val1.size === 0)) {
          return true;
        }
        if (memos === void 0) {
          memos = {
            val1: new Map(),
            val2: new Map(),
            position: 0
          };
        } else {
          var val2MemoA = memos.val1.get(val1);
          if (val2MemoA !== void 0) {
            var val2MemoB = memos.val2.get(val2);
            if (val2MemoB !== void 0) {
              return val2MemoA === val2MemoB;
            }
          }
          memos.position++;
        }
        memos.val1.set(val1, memos.position);
        memos.val2.set(val2, memos.position);
        var areEq = objEquiv(val1, val2, strict, aKeys, memos, iterationType);
        memos.val1.delete(val1);
        memos.val2.delete(val2);
        return areEq;
      }
      function setHasEqualElement(set, val1, strict, memo) {
        var setValues = arrayFromSet(set);
        for (var i = 0; i < setValues.length; i++) {
          var val2 = setValues[i];
          if (innerDeepEqual(val1, val2, strict, memo)) {
            set.delete(val2);
            return true;
          }
        }
        return false;
      }
      function findLooseMatchingPrimitives(prim) {
        switch (_typeof(prim)) {
          case "undefined":
            return null;
          case "object":
            return void 0;
          case "symbol":
            return false;
          case "string":
            prim = +prim;
          case "number":
            if (numberIsNaN(prim)) {
              return false;
            }
        }
        return true;
      }
      function setMightHaveLoosePrim(a, b, prim) {
        var altValue = findLooseMatchingPrimitives(prim);
        if (altValue != null)
          return altValue;
        return b.has(altValue) && !a.has(altValue);
      }
      function mapMightHaveLoosePrim(a, b, prim, item, memo) {
        var altValue = findLooseMatchingPrimitives(prim);
        if (altValue != null) {
          return altValue;
        }
        var curB = b.get(altValue);
        if (curB === void 0 && !b.has(altValue) || !innerDeepEqual(item, curB, false, memo)) {
          return false;
        }
        return !a.has(altValue) && innerDeepEqual(item, curB, false, memo);
      }
      function setEquiv(a, b, strict, memo) {
        var set = null;
        var aValues = arrayFromSet(a);
        for (var i = 0; i < aValues.length; i++) {
          var val = aValues[i];
          if (_typeof(val) === "object" && val !== null) {
            if (set === null) {
              set = new Set();
            }
            set.add(val);
          } else if (!b.has(val)) {
            if (strict)
              return false;
            if (!setMightHaveLoosePrim(a, b, val)) {
              return false;
            }
            if (set === null) {
              set = new Set();
            }
            set.add(val);
          }
        }
        if (set !== null) {
          var bValues = arrayFromSet(b);
          for (var _i = 0; _i < bValues.length; _i++) {
            var _val = bValues[_i];
            if (_typeof(_val) === "object" && _val !== null) {
              if (!setHasEqualElement(set, _val, strict, memo))
                return false;
            } else if (!strict && !a.has(_val) && !setHasEqualElement(set, _val, strict, memo)) {
              return false;
            }
          }
          return set.size === 0;
        }
        return true;
      }
      function mapHasEqualEntry(set, map, key1, item1, strict, memo) {
        var setValues = arrayFromSet(set);
        for (var i = 0; i < setValues.length; i++) {
          var key2 = setValues[i];
          if (innerDeepEqual(key1, key2, strict, memo) && innerDeepEqual(item1, map.get(key2), strict, memo)) {
            set.delete(key2);
            return true;
          }
        }
        return false;
      }
      function mapEquiv(a, b, strict, memo) {
        var set = null;
        var aEntries = arrayFromMap(a);
        for (var i = 0; i < aEntries.length; i++) {
          var _aEntries$i = _slicedToArray(aEntries[i], 2), key = _aEntries$i[0], item1 = _aEntries$i[1];
          if (_typeof(key) === "object" && key !== null) {
            if (set === null) {
              set = new Set();
            }
            set.add(key);
          } else {
            var item2 = b.get(key);
            if (item2 === void 0 && !b.has(key) || !innerDeepEqual(item1, item2, strict, memo)) {
              if (strict)
                return false;
              if (!mapMightHaveLoosePrim(a, b, key, item1, memo))
                return false;
              if (set === null) {
                set = new Set();
              }
              set.add(key);
            }
          }
        }
        if (set !== null) {
          var bEntries = arrayFromMap(b);
          for (var _i2 = 0; _i2 < bEntries.length; _i2++) {
            var _bEntries$_i = _slicedToArray(bEntries[_i2], 2), key = _bEntries$_i[0], item = _bEntries$_i[1];
            if (_typeof(key) === "object" && key !== null) {
              if (!mapHasEqualEntry(set, a, key, item, strict, memo))
                return false;
            } else if (!strict && (!a.has(key) || !innerDeepEqual(a.get(key), item, false, memo)) && !mapHasEqualEntry(set, a, key, item, false, memo)) {
              return false;
            }
          }
          return set.size === 0;
        }
        return true;
      }
      function objEquiv(a, b, strict, keys, memos, iterationType) {
        var i = 0;
        if (iterationType === kIsSet) {
          if (!setEquiv(a, b, strict, memos)) {
            return false;
          }
        } else if (iterationType === kIsMap) {
          if (!mapEquiv(a, b, strict, memos)) {
            return false;
          }
        } else if (iterationType === kIsArray) {
          for (; i < a.length; i++) {
            if (hasOwnProperty(a, i)) {
              if (!hasOwnProperty(b, i) || !innerDeepEqual(a[i], b[i], strict, memos)) {
                return false;
              }
            } else if (hasOwnProperty(b, i)) {
              return false;
            } else {
              var keysA = Object.keys(a);
              for (; i < keysA.length; i++) {
                var key = keysA[i];
                if (!hasOwnProperty(b, key) || !innerDeepEqual(a[key], b[key], strict, memos)) {
                  return false;
                }
              }
              if (keysA.length !== Object.keys(b).length) {
                return false;
              }
              return true;
            }
          }
        }
        for (i = 0; i < keys.length; i++) {
          var _key = keys[i];
          if (!innerDeepEqual(a[_key], b[_key], strict, memos)) {
            return false;
          }
        }
        return true;
      }
      function isDeepEqual(val1, val2) {
        return innerDeepEqual(val1, val2, kLoose);
      }
      function isDeepStrictEqual(val1, val2) {
        return innerDeepEqual(val1, val2, kStrict);
      }
      module.exports = {
        isDeepEqual,
        isDeepStrictEqual
      };
    }
  });

  // server/node_modules/assert/build/assert.js
  var require_assert = __commonJS({
    "server/node_modules/assert/build/assert.js"(exports, module) {
      init_define_process();
      "use strict";
      function _typeof(obj) {
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof2(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function _typeof2(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      var _require = require_errors();
      var _require$codes = _require.codes;
      var ERR_AMBIGUOUS_ARGUMENT = _require$codes.ERR_AMBIGUOUS_ARGUMENT;
      var ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE;
      var ERR_INVALID_ARG_VALUE = _require$codes.ERR_INVALID_ARG_VALUE;
      var ERR_INVALID_RETURN_VALUE = _require$codes.ERR_INVALID_RETURN_VALUE;
      var ERR_MISSING_ARGS = _require$codes.ERR_MISSING_ARGS;
      var AssertionError = require_assertion_error();
      var _require2 = require_util();
      var inspect = _require2.inspect;
      var _require$types = require_util().types;
      var isPromise = _require$types.isPromise;
      var isRegExp = _require$types.isRegExp;
      var objectAssign = Object.assign ? Object.assign : require_es6_object_assign().assign;
      var objectIs = Object.is ? Object.is : require_object_is();
      var errorCache = new Map();
      var isDeepEqual;
      var isDeepStrictEqual;
      function lazyLoadComparison() {
        var comparison = require_comparisons();
        isDeepEqual = comparison.isDeepEqual;
        isDeepStrictEqual = comparison.isDeepStrictEqual;
      }
      var warned = false;
      var assert4 = module.exports = ok;
      var NO_EXCEPTION_SENTINEL = {};
      function innerFail(obj) {
        if (obj.message instanceof Error)
          throw obj.message;
        throw new AssertionError(obj);
      }
      function fail(actual, expected, message, operator, stackStartFn) {
        var argsLen = arguments.length;
        var internalMessage;
        if (argsLen === 0) {
          internalMessage = "Failed";
        } else if (argsLen === 1) {
          message = actual;
          actual = void 0;
        } else {
          if (warned === false) {
            warned = true;
            var warn = define_process_default.emitWarning ? define_process_default.emitWarning : console.warn.bind(console);
            warn("assert.fail() with more than one argument is deprecated. Please use assert.strictEqual() instead or only pass a message.", "DeprecationWarning", "DEP0094");
          }
          if (argsLen === 2)
            operator = "!=";
        }
        if (message instanceof Error)
          throw message;
        var errArgs = {
          actual,
          expected,
          operator: operator === void 0 ? "fail" : operator,
          stackStartFn: stackStartFn || fail
        };
        if (message !== void 0) {
          errArgs.message = message;
        }
        var err = new AssertionError(errArgs);
        if (internalMessage) {
          err.message = internalMessage;
          err.generatedMessage = true;
        }
        throw err;
      }
      assert4.fail = fail;
      assert4.AssertionError = AssertionError;
      function innerOk(fn, argLen, value, message) {
        if (!value) {
          var generatedMessage = false;
          if (argLen === 0) {
            generatedMessage = true;
            message = "No value argument passed to `assert.ok()`";
          } else if (message instanceof Error) {
            throw message;
          }
          var err = new AssertionError({
            actual: value,
            expected: true,
            message,
            operator: "==",
            stackStartFn: fn
          });
          err.generatedMessage = generatedMessage;
          throw err;
        }
      }
      function ok() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        innerOk.apply(void 0, [ok, args.length].concat(args));
      }
      assert4.ok = ok;
      assert4.equal = function equal(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (actual != expected) {
          innerFail({
            actual,
            expected,
            message,
            operator: "==",
            stackStartFn: equal
          });
        }
      };
      assert4.notEqual = function notEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (actual == expected) {
          innerFail({
            actual,
            expected,
            message,
            operator: "!=",
            stackStartFn: notEqual
          });
        }
      };
      assert4.deepEqual = function deepEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (isDeepEqual === void 0)
          lazyLoadComparison();
        if (!isDeepEqual(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "deepEqual",
            stackStartFn: deepEqual
          });
        }
      };
      assert4.notDeepEqual = function notDeepEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (isDeepEqual === void 0)
          lazyLoadComparison();
        if (isDeepEqual(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "notDeepEqual",
            stackStartFn: notDeepEqual
          });
        }
      };
      assert4.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (isDeepEqual === void 0)
          lazyLoadComparison();
        if (!isDeepStrictEqual(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "deepStrictEqual",
            stackStartFn: deepStrictEqual
          });
        }
      };
      assert4.notDeepStrictEqual = notDeepStrictEqual;
      function notDeepStrictEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (isDeepEqual === void 0)
          lazyLoadComparison();
        if (isDeepStrictEqual(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "notDeepStrictEqual",
            stackStartFn: notDeepStrictEqual
          });
        }
      }
      assert4.strictEqual = function strictEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (!objectIs(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "strictEqual",
            stackStartFn: strictEqual
          });
        }
      };
      assert4.notStrictEqual = function notStrictEqual(actual, expected, message) {
        if (arguments.length < 2) {
          throw new ERR_MISSING_ARGS("actual", "expected");
        }
        if (objectIs(actual, expected)) {
          innerFail({
            actual,
            expected,
            message,
            operator: "notStrictEqual",
            stackStartFn: notStrictEqual
          });
        }
      };
      var Comparison = function Comparison2(obj, keys, actual) {
        var _this = this;
        _classCallCheck(this, Comparison2);
        keys.forEach(function(key) {
          if (key in obj) {
            if (actual !== void 0 && typeof actual[key] === "string" && isRegExp(obj[key]) && obj[key].test(actual[key])) {
              _this[key] = actual[key];
            } else {
              _this[key] = obj[key];
            }
          }
        });
      };
      function compareExceptionKey(actual, expected, key, message, keys, fn) {
        if (!(key in actual) || !isDeepStrictEqual(actual[key], expected[key])) {
          if (!message) {
            var a = new Comparison(actual, keys);
            var b = new Comparison(expected, keys, actual);
            var err = new AssertionError({
              actual: a,
              expected: b,
              operator: "deepStrictEqual",
              stackStartFn: fn
            });
            err.actual = actual;
            err.expected = expected;
            err.operator = fn.name;
            throw err;
          }
          innerFail({
            actual,
            expected,
            message,
            operator: fn.name,
            stackStartFn: fn
          });
        }
      }
      function expectedException(actual, expected, msg, fn) {
        if (typeof expected !== "function") {
          if (isRegExp(expected))
            return expected.test(actual);
          if (arguments.length === 2) {
            throw new ERR_INVALID_ARG_TYPE("expected", ["Function", "RegExp"], expected);
          }
          if (_typeof(actual) !== "object" || actual === null) {
            var err = new AssertionError({
              actual,
              expected,
              message: msg,
              operator: "deepStrictEqual",
              stackStartFn: fn
            });
            err.operator = fn.name;
            throw err;
          }
          var keys = Object.keys(expected);
          if (expected instanceof Error) {
            keys.push("name", "message");
          } else if (keys.length === 0) {
            throw new ERR_INVALID_ARG_VALUE("error", expected, "may not be an empty object");
          }
          if (isDeepEqual === void 0)
            lazyLoadComparison();
          keys.forEach(function(key) {
            if (typeof actual[key] === "string" && isRegExp(expected[key]) && expected[key].test(actual[key])) {
              return;
            }
            compareExceptionKey(actual, expected, key, msg, keys, fn);
          });
          return true;
        }
        if (expected.prototype !== void 0 && actual instanceof expected) {
          return true;
        }
        if (Error.isPrototypeOf(expected)) {
          return false;
        }
        return expected.call({}, actual) === true;
      }
      function getActual(fn) {
        if (typeof fn !== "function") {
          throw new ERR_INVALID_ARG_TYPE("fn", "Function", fn);
        }
        try {
          fn();
        } catch (e) {
          return e;
        }
        return NO_EXCEPTION_SENTINEL;
      }
      function checkIsPromise(obj) {
        return isPromise(obj) || obj !== null && _typeof(obj) === "object" && typeof obj.then === "function" && typeof obj.catch === "function";
      }
      function waitForActual(promiseFn) {
        return Promise.resolve().then(function() {
          var resultPromise;
          if (typeof promiseFn === "function") {
            resultPromise = promiseFn();
            if (!checkIsPromise(resultPromise)) {
              throw new ERR_INVALID_RETURN_VALUE("instance of Promise", "promiseFn", resultPromise);
            }
          } else if (checkIsPromise(promiseFn)) {
            resultPromise = promiseFn;
          } else {
            throw new ERR_INVALID_ARG_TYPE("promiseFn", ["Function", "Promise"], promiseFn);
          }
          return Promise.resolve().then(function() {
            return resultPromise;
          }).then(function() {
            return NO_EXCEPTION_SENTINEL;
          }).catch(function(e) {
            return e;
          });
        });
      }
      function expectsError(stackStartFn, actual, error, message) {
        if (typeof error === "string") {
          if (arguments.length === 4) {
            throw new ERR_INVALID_ARG_TYPE("error", ["Object", "Error", "Function", "RegExp"], error);
          }
          if (_typeof(actual) === "object" && actual !== null) {
            if (actual.message === error) {
              throw new ERR_AMBIGUOUS_ARGUMENT("error/message", 'The error message "'.concat(actual.message, '" is identical to the message.'));
            }
          } else if (actual === error) {
            throw new ERR_AMBIGUOUS_ARGUMENT("error/message", 'The error "'.concat(actual, '" is identical to the message.'));
          }
          message = error;
          error = void 0;
        } else if (error != null && _typeof(error) !== "object" && typeof error !== "function") {
          throw new ERR_INVALID_ARG_TYPE("error", ["Object", "Error", "Function", "RegExp"], error);
        }
        if (actual === NO_EXCEPTION_SENTINEL) {
          var details = "";
          if (error && error.name) {
            details += " (".concat(error.name, ")");
          }
          details += message ? ": ".concat(message) : ".";
          var fnType = stackStartFn.name === "rejects" ? "rejection" : "exception";
          innerFail({
            actual: void 0,
            expected: error,
            operator: stackStartFn.name,
            message: "Missing expected ".concat(fnType).concat(details),
            stackStartFn
          });
        }
        if (error && !expectedException(actual, error, message, stackStartFn)) {
          throw actual;
        }
      }
      function expectsNoError(stackStartFn, actual, error, message) {
        if (actual === NO_EXCEPTION_SENTINEL)
          return;
        if (typeof error === "string") {
          message = error;
          error = void 0;
        }
        if (!error || expectedException(actual, error)) {
          var details = message ? ": ".concat(message) : ".";
          var fnType = stackStartFn.name === "doesNotReject" ? "rejection" : "exception";
          innerFail({
            actual,
            expected: error,
            operator: stackStartFn.name,
            message: "Got unwanted ".concat(fnType).concat(details, "\n") + 'Actual message: "'.concat(actual && actual.message, '"'),
            stackStartFn
          });
        }
        throw actual;
      }
      assert4.throws = function throws(promiseFn) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        expectsError.apply(void 0, [throws, getActual(promiseFn)].concat(args));
      };
      assert4.rejects = function rejects(promiseFn) {
        for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }
        return waitForActual(promiseFn).then(function(result) {
          return expectsError.apply(void 0, [rejects, result].concat(args));
        });
      };
      assert4.doesNotThrow = function doesNotThrow(fn) {
        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }
        expectsNoError.apply(void 0, [doesNotThrow, getActual(fn)].concat(args));
      };
      assert4.doesNotReject = function doesNotReject(fn) {
        for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
          args[_key5 - 1] = arguments[_key5];
        }
        return waitForActual(fn).then(function(result) {
          return expectsNoError.apply(void 0, [doesNotReject, result].concat(args));
        });
      };
      assert4.ifError = function ifError(err) {
        if (err !== null && err !== void 0) {
          var message = "ifError got unwanted exception: ";
          if (_typeof(err) === "object" && typeof err.message === "string") {
            if (err.message.length === 0 && err.constructor) {
              message += err.constructor.name;
            } else {
              message += err.message;
            }
          } else {
            message += inspect(err);
          }
          var newErr = new AssertionError({
            actual: err,
            expected: null,
            operator: "ifError",
            message,
            stackStartFn: ifError
          });
          var origStack = err.stack;
          if (typeof origStack === "string") {
            var tmp2 = origStack.split("\n");
            tmp2.shift();
            var tmp1 = newErr.stack.split("\n");
            for (var i = 0; i < tmp2.length; i++) {
              var pos = tmp1.indexOf(tmp2[i]);
              if (pos !== -1) {
                tmp1 = tmp1.slice(0, pos);
                break;
              }
            }
            newErr.stack = "".concat(tmp1.join("\n"), "\n").concat(tmp2.join("\n"));
          }
          throw newErr;
        }
      };
      function strict() {
        for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          args[_key6] = arguments[_key6];
        }
        innerOk.apply(void 0, [strict, args.length].concat(args));
      }
      assert4.strict = objectAssign(strict, assert4, {
        equal: assert4.strictEqual,
        deepEqual: assert4.deepStrictEqual,
        notEqual: assert4.notStrictEqual,
        notDeepEqual: assert4.notDeepStrictEqual
      });
      assert4.strict.strict = assert4.strict;
    }
  });

  // server/node_modules/vscode-jsonrpc/lib/common/ral.js
  var require_ral = __commonJS({
    "server/node_modules/vscode-jsonrpc/lib/common/ral.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var _ral;
      function RAL() {
        if (_ral === void 0) {
          throw new Error(`No runtime abstraction layer installed`);
        }
        return _ral;
      }
      (function(RAL2) {
        function install(ral) {
          if (ral === void 0) {
            throw new Error(`No runtime abstraction layer provided`);
          }
          _ral = ral;
        }
        RAL2.install = install;
      })(RAL || (RAL = {}));
      exports.default = RAL;
    }
  });

  // server/node_modules/vscode-jsonrpc/lib/common/disposable.js
  var require_disposable = __commonJS({
    "server/node_modules/vscode-jsonrpc/lib/common/disposable.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Disposable = void 0;
      var Disposable;
      (function(Disposable2) {
        function create(func) {
          return {
            dispose: func
          };
        }
        Disposable2.create = create;
      })(Disposable = exports.Disposable || (exports.Disposable = {}));
    }
  });

  // server/node_modules/vscode-jsonrpc/lib/common/events.js
  var require_events = __commonJS({
    "server/node_modules/vscode-jsonrpc/lib/common/events.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Emitter = exports.Event = void 0;
      var ral_1 = require_ral();
      var Event;
      (function(Event2) {
        const _disposable = { dispose() {
        } };
        Event2.None = function() {
          return _disposable;
        };
      })(Event = exports.Event || (exports.Event = {}));
      var CallbackList = class {
        add(callback, context = null, bucket) {
          if (!this._callbacks) {
            this._callbacks = [];
            this._contexts = [];
          }
          this._callbacks.push(callback);
          this._contexts.push(context);
          if (Array.isArray(bucket)) {
            bucket.push({ dispose: () => this.remove(callback, context) });
          }
        }
        remove(callback, context = null) {
          if (!this._callbacks) {
            return;
          }
          let foundCallbackWithDifferentContext = false;
          for (let i = 0, len = this._callbacks.length; i < len; i++) {
            if (this._callbacks[i] === callback) {
              if (this._contexts[i] === context) {
                this._callbacks.splice(i, 1);
                this._contexts.splice(i, 1);
                return;
              } else {
                foundCallbackWithDifferentContext = true;
              }
            }
          }
          if (foundCallbackWithDifferentContext) {
            throw new Error("When adding a listener with a context, you should remove it with the same context");
          }
        }
        invoke(...args) {
          if (!this._callbacks) {
            return [];
          }
          const ret = [], callbacks = this._callbacks.slice(0), contexts = this._contexts.slice(0);
          for (let i = 0, len = callbacks.length; i < len; i++) {
            try {
              ret.push(callbacks[i].apply(contexts[i], args));
            } catch (e) {
              (0, ral_1.default)().console.error(e);
            }
          }
          return ret;
        }
        isEmpty() {
          return !this._callbacks || this._callbacks.length === 0;
        }
        dispose() {
          this._callbacks = void 0;
          this._contexts = void 0;
        }
      };
      var Emitter2 = class {
        constructor(_options) {
          this._options = _options;
        }
        get event() {
          if (!this._event) {
            this._event = (listener, thisArgs, disposables) => {
              if (!this._callbacks) {
                this._callbacks = new CallbackList();
              }
              if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) {
                this._options.onFirstListenerAdd(this);
              }
              this._callbacks.add(listener, thisArgs);
              const result = {
                dispose: () => {
                  if (!this._callbacks) {
                    return;
                  }
                  this._callbacks.remove(listener, thisArgs);
                  result.dispose = Emitter2._noop;
                  if (this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty()) {
                    this._options.onLastListenerRemove(this);
                  }
                }
              };
              if (Array.isArray(disposables)) {
                disposables.push(result);
              }
              return result;
            };
          }
          return this._event;
        }
        fire(event) {
          if (this._callbacks) {
            this._callbacks.invoke.call(this._callbacks, event);
          }
        }
        dispose() {
          if (this._callbacks) {
            this._callbacks.dispose();
            this._callbacks = void 0;
          }
        }
      };
      exports.Emitter = Emitter2;
      Emitter2._noop = function() {
      };
    }
  });

  // server/node_modules/vscode-jsonrpc/lib/common/messageBuffer.js
  var require_messageBuffer = __commonJS({
    "server/node_modules/vscode-jsonrpc/lib/common/messageBuffer.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.AbstractMessageBuffer = void 0;
      var CR = 13;
      var LF = 10;
      var CRLF = "\r\n";
      var AbstractMessageBuffer = class {
        constructor(encoding = "utf-8") {
          this._encoding = encoding;
          this._chunks = [];
          this._totalLength = 0;
        }
        get encoding() {
          return this._encoding;
        }
        append(chunk) {
          const toAppend = typeof chunk === "string" ? this.fromString(chunk, this._encoding) : chunk;
          this._chunks.push(toAppend);
          this._totalLength += toAppend.byteLength;
        }
        tryReadHeaders() {
          if (this._chunks.length === 0) {
            return void 0;
          }
          let state = 0;
          let chunkIndex = 0;
          let offset = 0;
          let chunkBytesRead = 0;
          row:
            while (chunkIndex < this._chunks.length) {
              const chunk = this._chunks[chunkIndex];
              offset = 0;
              column:
                while (offset < chunk.length) {
                  const value = chunk[offset];
                  switch (value) {
                    case CR:
                      switch (state) {
                        case 0:
                          state = 1;
                          break;
                        case 2:
                          state = 3;
                          break;
                        default:
                          state = 0;
                      }
                      break;
                    case LF:
                      switch (state) {
                        case 1:
                          state = 2;
                          break;
                        case 3:
                          state = 4;
                          offset++;
                          break row;
                        default:
                          state = 0;
                      }
                      break;
                    default:
                      state = 0;
                  }
                  offset++;
                }
              chunkBytesRead += chunk.byteLength;
              chunkIndex++;
            }
          if (state !== 4) {
            return void 0;
          }
          const buffer = this._read(chunkBytesRead + offset);
          const result = new Map();
          const headers = this.toString(buffer, "ascii").split(CRLF);
          if (headers.length < 2) {
            return result;
          }
          for (let i = 0; i < headers.length - 2; i++) {
            const header = headers[i];
            const index = header.indexOf(":");
            if (index === -1) {
              throw new Error("Message header must separate key and value using :");
            }
            const key = header.substr(0, index);
            const value = header.substr(index + 1).trim();
            result.set(key, value);
          }
          return result;
        }
        tryReadBody(length) {
          if (this._totalLength < length) {
            return void 0;
          }
          return this._read(length);
        }
        get numberOfBytes() {
          return this._totalLength;
        }
        _read(byteCount) {
          if (byteCount === 0) {
            return this.emptyBuffer();
          }
          if (byteCount > this._totalLength) {
            throw new Error(`Cannot read so many bytes!`);
          }
          if (this._chunks[0].byteLength === byteCount) {
            const chunk = this._chunks[0];
            this._chunks.shift();
            this._totalLength -= byteCount;
            return this.asNative(chunk);
          }
          if (this._chunks[0].byteLength > byteCount) {
            const chunk = this._chunks[0];
            const result2 = this.asNative(chunk, byteCount);
            this._chunks[0] = chunk.slice(byteCount);
            this._totalLength -= byteCount;
            return result2;
          }
          const result = this.allocNative(byteCount);
          let resultOffset = 0;
          let chunkIndex = 0;
          while (byteCount > 0) {
            const chunk = this._chunks[chunkIndex];
            if (chunk.byteLength > byteCount) {
              const chunkPart = chunk.slice(0, byteCount);
              result.set(chunkPart, resultOffset);
              resultOffset += byteCount;
              this._chunks[chunkIndex] = chunk.slice(byteCount);
              this._totalLength -= byteCount;
              byteCount -= byteCount;
            } else {
              result.set(chunk, resultOffset);
              resultOffset += chunk.byteLength;
              this._chunks.shift();
              this._totalLength -= chunk.byteLength;
              byteCount -= chunk.byteLength;
            }
          }
          return result;
        }
      };
      exports.AbstractMessageBuffer = AbstractMessageBuffer;
    }
  });

  // server/node_modules/vscode-jsonrpc/lib/browser/ril.js
  var require_ril = __commonJS({
    "server/node_modules/vscode-jsonrpc/lib/browser/ril.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      var ral_1 = require_ral();
      var disposable_1 = require_disposable();
      var events_1 = require_events();
      var messageBuffer_1 = require_messageBuffer();
      var MessageBuffer = class extends messageBuffer_1.AbstractMessageBuffer {
        constructor(encoding = "utf-8") {
          super(encoding);
          this.asciiDecoder = new TextDecoder("ascii");
        }
        emptyBuffer() {
          return MessageBuffer.emptyBuffer;
        }
        fromString(value, _encoding) {
          return new TextEncoder().encode(value);
        }
        toString(value, encoding) {
          if (encoding === "ascii") {
            return this.asciiDecoder.decode(value);
          } else {
            return new TextDecoder(encoding).decode(value);
          }
        }
        asNative(buffer, length) {
          if (length === void 0) {
            return buffer;
          } else {
            return buffer.slice(0, length);
          }
        }
        allocNative(length) {
          return new Uint8Array(length);
        }
      };
      MessageBuffer.emptyBuffer = new Uint8Array(0);
      var ReadableStreamWrapper = class {
        constructor(socket) {
          this.socket = socket;
          this._onData = new events_1.Emitter();
          this._messageListener = (event) => {
            const blob = event.data;
            blob.arrayBuffer().then((buffer) => {
              this._onData.fire(new Uint8Array(buffer));
            }, () => {
              (0, ral_1.default)().console.error(`Converting blob to array buffer failed.`);
            });
          };
          this.socket.addEventListener("message", this._messageListener);
        }
        onClose(listener) {
          this.socket.addEventListener("close", listener);
          return disposable_1.Disposable.create(() => this.socket.removeEventListener("close", listener));
        }
        onError(listener) {
          this.socket.addEventListener("error", listener);
          return disposable_1.Disposable.create(() => this.socket.removeEventListener("error", listener));
        }
        onEnd(listener) {
          this.socket.addEventListener("end", listener);
          return disposable_1.Disposable.create(() => this.socket.removeEventListener("end", listener));
        }
        onData(listener) {
          return this._onData.event(listener);
        }
      };
      var WritableStreamWrapper = class {
        constructor(socket) {
          this.socket = socket;
        }
        onClose(listener) {
          this.socket.addEventListener("close", listener);
          return disposable_1.Disposable.create(() => this.socket.removeEventListener("close", listener));
        }
        onError(listener) {
          this.socket.addEventListener("error", listener);
          return disposable_1.Disposable.create(() => this.socket.removeEventListener("error", listener));
        }
        onEnd(listener) {
          this.socket.addEventListener("end", listener);
          return disposable_1.Disposable.create(() => this.socket.removeEventListener("end", listener));
        }
        write(data, encoding) {
          if (typeof data === "string") {
            if (encoding !== void 0 && encoding !== "utf-8") {
              throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${encoding}`);
            }
            this.socket.send(data);
          } else {
            this.socket.send(data);
          }
          return Promise.resolve();
        }
        end() {
          this.socket.close();
        }
      };
      var _textEncoder = new TextEncoder();
      var _ril = Object.freeze({
        messageBuffer: Object.freeze({
          create: (encoding) => new MessageBuffer(encoding)
        }),
        applicationJson: Object.freeze({
          encoder: Object.freeze({
            name: "application/json",
            encode: (msg, options) => {
              if (options.charset !== "utf-8") {
                throw new Error(`In a Browser environments only utf-8 text encoding is supported. But got encoding: ${options.charset}`);
              }
              return Promise.resolve(_textEncoder.encode(JSON.stringify(msg, void 0, 0)));
            }
          }),
          decoder: Object.freeze({
            name: "application/json",
            decode: (buffer, options) => {
              if (!(buffer instanceof Uint8Array)) {
                throw new Error(`In a Browser environments only Uint8Arrays are supported.`);
              }
              return Promise.resolve(JSON.parse(new TextDecoder(options.charset).decode(buffer)));
            }
          })
        }),
        stream: Object.freeze({
          asReadableStream: (socket) => new ReadableStreamWrapper(socket),
          asWritableStream: (socket) => new WritableStreamWrapper(socket)
        }),
        console,
        timer: Object.freeze({
          setTimeout(callback, ms, ...args) {
            const handle = setTimeout(callback, ms, ...args);
            return { dispose: () => clearTimeout(handle) };
          },
          setImmediate(callback, ...args) {
            const handle = setTimeout(callback, 0, ...args);
            return { dispose: () => clearTimeout(handle) };
          },
          setInterval(callback, ms, ...args) {
            const handle = setInterval(callback, ms, ...args);
            return { dispose: () => clearInterval(handle) };
          }
        })
      });
      function RIL() {
        return _ril;
      }
      (function(RIL2) {
        function install() {
          ral_1.default.install(_ril);
        }
        RIL2.install = install;
      })(RIL || (RIL = {}));
      exports.default = RIL;
    }
  });

  // server/node_modules/vscode-jsonrpc/lib/common/is.js
  var require_is = __commonJS({
    "server/node_modules/vscode-jsonrpc/lib/common/is.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.stringArray = exports.array = exports.func = exports.error = exports.number = exports.string = exports.boolean = void 0;
      function boolean(value) {
        return value === true || value === false;
      }
      exports.boolean = boolean;
      function string(value) {
        return typeof value === "string" || value instanceof String;
      }
      exports.string = string;
      function number(value) {
        return typeof value === "number" || value instanceof Number;
      }
      exports.number = number;
      function error(value) {
        return value instanceof Error;
      }
      exports.error = error;
      function func(value) {
        return typeof value === "function";
      }
      exports.func = func;
      function array(value) {
        return Array.isArray(value);
      }
      exports.array = array;
      function stringArray(value) {
        return array(value) && value.every((elem) => string(elem));
      }
      exports.stringArray = stringArray;
    }
  });

  // server/node_modules/vscode-jsonrpc/lib/common/messages.js
  var require_messages = __commonJS({
    "server/node_modules/vscode-jsonrpc/lib/common/messages.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Message = exports.NotificationType9 = exports.NotificationType8 = exports.NotificationType7 = exports.NotificationType6 = exports.NotificationType5 = exports.NotificationType4 = exports.NotificationType3 = exports.NotificationType2 = exports.NotificationType1 = exports.NotificationType0 = exports.NotificationType = exports.RequestType9 = exports.RequestType8 = exports.RequestType7 = exports.RequestType6 = exports.RequestType5 = exports.RequestType4 = exports.RequestType3 = exports.RequestType2 = exports.RequestType1 = exports.RequestType = exports.RequestType0 = exports.AbstractMessageSignature = exports.ParameterStructures = exports.ResponseError = exports.ErrorCodes = void 0;
      var is = require_is();
      var ErrorCodes;
      (function(ErrorCodes2) {
        ErrorCodes2.ParseError = -32700;
        ErrorCodes2.InvalidRequest = -32600;
        ErrorCodes2.MethodNotFound = -32601;
        ErrorCodes2.InvalidParams = -32602;
        ErrorCodes2.InternalError = -32603;
        ErrorCodes2.jsonrpcReservedErrorRangeStart = -32099;
        ErrorCodes2.serverErrorStart = ErrorCodes2.jsonrpcReservedErrorRangeStart;
        ErrorCodes2.MessageWriteError = -32099;
        ErrorCodes2.MessageReadError = -32098;
        ErrorCodes2.ServerNotInitialized = -32002;
        ErrorCodes2.UnknownErrorCode = -32001;
        ErrorCodes2.jsonrpcReservedErrorRangeEnd = -32e3;
        ErrorCodes2.serverErrorEnd = ErrorCodes2.jsonrpcReservedErrorRangeEnd;
      })(ErrorCodes = exports.ErrorCodes || (exports.ErrorCodes = {}));
      var ResponseError = class extends Error {
        constructor(code, message, data) {
          super(message);
          this.code = is.number(code) ? code : ErrorCodes.UnknownErrorCode;
          this.data = data;
          Object.setPrototypeOf(this, ResponseError.prototype);
        }
        toJson() {
          const result = {
            code: this.code,
            message: this.message
          };
          if (this.data !== void 0) {
            result.data = this.data;
          }
          return result;
        }
      };
      exports.ResponseError = ResponseError;
      var ParameterStructures = class {
        constructor(kind) {
          this.kind = kind;
        }
        static is(value) {
          return value === ParameterStructures.auto || value === ParameterStructures.byName || value === ParameterStructures.byPosition;
        }
        toString() {
          return this.kind;
        }
      };
      exports.ParameterStructures = ParameterStructures;
      ParameterStructures.auto = new ParameterStructures("auto");
      ParameterStructures.byPosition = new ParameterStructures("byPosition");
      ParameterStructures.byName = new ParameterStructures("byName");
      var AbstractMessageSignature = class {
        constructor(method, numberOfParams) {
          this.method = method;
          this.numberOfParams = numberOfParams;
        }
        get parameterStructures() {
          return ParameterStructures.auto;
        }
      };
      exports.AbstractMessageSignature = AbstractMessageSignature;
      var RequestType0 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 0);
        }
      };
      exports.RequestType0 = RequestType0;
      var RequestType = class extends AbstractMessageSignature {
        constructor(method, _parameterStructures = ParameterStructures.auto) {
          super(method, 1);
          this._parameterStructures = _parameterStructures;
        }
        get parameterStructures() {
          return this._parameterStructures;
        }
      };
      exports.RequestType = RequestType;
      var RequestType1 = class extends AbstractMessageSignature {
        constructor(method, _parameterStructures = ParameterStructures.auto) {
          super(method, 1);
          this._parameterStructures = _parameterStructures;
        }
        get parameterStructures() {
          return this._parameterStructures;
        }
      };
      exports.RequestType1 = RequestType1;
      var RequestType2 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 2);
        }
      };
      exports.RequestType2 = RequestType2;
      var RequestType3 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 3);
        }
      };
      exports.RequestType3 = RequestType3;
      var RequestType4 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 4);
        }
      };
      exports.RequestType4 = RequestType4;
      var RequestType5 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 5);
        }
      };
      exports.RequestType5 = RequestType5;
      var RequestType6 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 6);
        }
      };
      exports.RequestType6 = RequestType6;
      var RequestType7 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 7);
        }
      };
      exports.RequestType7 = RequestType7;
      var RequestType8 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 8);
        }
      };
      exports.RequestType8 = RequestType8;
      var RequestType9 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 9);
        }
      };
      exports.RequestType9 = RequestType9;
      var NotificationType = class extends AbstractMessageSignature {
        constructor(method, _parameterStructures = ParameterStructures.auto) {
          super(method, 1);
          this._parameterStructures = _parameterStructures;
        }
        get parameterStructures() {
          return this._parameterStructures;
        }
      };
      exports.NotificationType = NotificationType;
      var NotificationType0 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 0);
        }
      };
      exports.NotificationType0 = NotificationType0;
      var NotificationType1 = class extends AbstractMessageSignature {
        constructor(method, _parameterStructures = ParameterStructures.auto) {
          super(method, 1);
          this._parameterStructures = _parameterStructures;
        }
        get parameterStructures() {
          return this._parameterStructures;
        }
      };
      exports.NotificationType1 = NotificationType1;
      var NotificationType2 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 2);
        }
      };
      exports.NotificationType2 = NotificationType2;
      var NotificationType3 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 3);
        }
      };
      exports.NotificationType3 = NotificationType3;
      var NotificationType4 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 4);
        }
      };
      exports.NotificationType4 = NotificationType4;
      var NotificationType5 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 5);
        }
      };
      exports.NotificationType5 = NotificationType5;
      var NotificationType6 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 6);
        }
      };
      exports.NotificationType6 = NotificationType6;
      var NotificationType7 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 7);
        }
      };
      exports.NotificationType7 = NotificationType7;
      var NotificationType8 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 8);
        }
      };
      exports.NotificationType8 = NotificationType8;
      var NotificationType9 = class extends AbstractMessageSignature {
        constructor(method) {
          super(method, 9);
        }
      };
      exports.NotificationType9 = NotificationType9;
      var Message;
      (function(Message2) {
        function isRequest(message) {
          const candidate = message;
          return candidate && is.string(candidate.method) && (is.string(candidate.id) || is.number(candidate.id));
        }
        Message2.isRequest = isRequest;
        function isNotification(message) {
          const candidate = message;
          return candidate && is.string(candidate.method) && message.id === void 0;
        }
        Message2.isNotification = isNotification;
        function isResponse(message) {
          const candidate = message;
          return candidate && (candidate.result !== void 0 || !!candidate.error) && (is.string(candidate.id) || is.number(candidate.id) || candidate.id === null);
        }
        Message2.isResponse = isResponse;
      })(Message = exports.Message || (exports.Message = {}));
    }
  });

  // server/node_modules/vscode-jsonrpc/lib/common/linkedMap.js
  var require_linkedMap = __commonJS({
    "server/node_modules/vscode-jsonrpc/lib/common/linkedMap.js"(exports) {
      init_define_process();
      "use strict";
      var _a;
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LRUCache = exports.LinkedMap = exports.Touch = void 0;
      var Touch;
      (function(Touch2) {
        Touch2.None = 0;
        Touch2.First = 1;
        Touch2.AsOld = Touch2.First;
        Touch2.Last = 2;
        Touch2.AsNew = Touch2.Last;
      })(Touch = exports.Touch || (exports.Touch = {}));
      var LinkedMap = class {
        constructor() {
          this[_a] = "LinkedMap";
          this._map = new Map();
          this._head = void 0;
          this._tail = void 0;
          this._size = 0;
          this._state = 0;
        }
        clear() {
          this._map.clear();
          this._head = void 0;
          this._tail = void 0;
          this._size = 0;
          this._state++;
        }
        isEmpty() {
          return !this._head && !this._tail;
        }
        get size() {
          return this._size;
        }
        get first() {
          return this._head?.value;
        }
        get last() {
          return this._tail?.value;
        }
        has(key) {
          return this._map.has(key);
        }
        get(key, touch = Touch.None) {
          const item = this._map.get(key);
          if (!item) {
            return void 0;
          }
          if (touch !== Touch.None) {
            this.touch(item, touch);
          }
          return item.value;
        }
        set(key, value, touch = Touch.None) {
          let item = this._map.get(key);
          if (item) {
            item.value = value;
            if (touch !== Touch.None) {
              this.touch(item, touch);
            }
          } else {
            item = { key, value, next: void 0, previous: void 0 };
            switch (touch) {
              case Touch.None:
                this.addItemLast(item);
                break;
              case Touch.First:
                this.addItemFirst(item);
                break;
              case Touch.Last:
                this.addItemLast(item);
                break;
              default:
                this.addItemLast(item);
                break;
            }
            this._map.set(key, item);
            this._size++;
          }
          return this;
        }
        delete(key) {
          return !!this.remove(key);
        }
        remove(key) {
          const item = this._map.get(key);
          if (!item) {
            return void 0;
          }
          this._map.delete(key);
          this.removeItem(item);
          this._size--;
          return item.value;
        }
        shift() {
          if (!this._head && !this._tail) {
            return void 0;
          }
          if (!this._head || !this._tail) {
            throw new Error("Invalid list");
          }
          const item = this._head;
          this._map.delete(item.key);
          this.removeItem(item);
          this._size--;
          return item.value;
        }
        forEach(callbackfn, thisArg) {
          const state = this._state;
          let current = this._head;
          while (current) {
            if (thisArg) {
              callbackfn.bind(thisArg)(current.value, current.key, this);
            } else {
              callbackfn(current.value, current.key, this);
            }
            if (this._state !== state) {
              throw new Error(`LinkedMap got modified during iteration.`);
            }
            current = current.next;
          }
        }
        keys() {
          const state = this._state;
          let current = this._head;
          const iterator = {
            [Symbol.iterator]: () => {
              return iterator;
            },
            next: () => {
              if (this._state !== state) {
                throw new Error(`LinkedMap got modified during iteration.`);
              }
              if (current) {
                const result = { value: current.key, done: false };
                current = current.next;
                return result;
              } else {
                return { value: void 0, done: true };
              }
            }
          };
          return iterator;
        }
        values() {
          const state = this._state;
          let current = this._head;
          const iterator = {
            [Symbol.iterator]: () => {
              return iterator;
            },
            next: () => {
              if (this._state !== state) {
                throw new Error(`LinkedMap got modified during iteration.`);
              }
              if (current) {
                const result = { value: current.value, done: false };
                current = current.next;
                return result;
              } else {
                return { value: void 0, done: true };
              }
            }
          };
          return iterator;
        }
        entries() {
          const state = this._state;
          let current = this._head;
          const iterator = {
            [Symbol.iterator]: () => {
              return iterator;
            },
            next: () => {
              if (this._state !== state) {
                throw new Error(`LinkedMap got modified during iteration.`);
              }
              if (current) {
                const result = { value: [current.key, current.value], done: false };
                current = current.next;
                return result;
              } else {
                return { value: void 0, done: true };
              }
            }
          };
          return iterator;
        }
        [(_a = Symbol.toStringTag, Symbol.iterator)]() {
          return this.entries();
        }
        trimOld(newSize) {
          if (newSize >= this.size) {
            return;
          }
          if (newSize === 0) {
            this.clear();
            return;
          }
          let current = this._head;
          let currentSize = this.size;
          while (current && currentSize > newSize) {
            this._map.delete(current.key);
            current = current.next;
            currentSize--;
          }
          this._head = current;
          this._size = currentSize;
          if (current) {
            current.previous = void 0;
          }
          this._state++;
        }
        addItemFirst(item) {
          if (!this._head && !this._tail) {
            this._tail = item;
          } else if (!this._head) {
            throw new Error("Invalid list");
          } else {
            item.next = this._head;
            this._head.previous = item;
          }
          this._head = item;
          this._state++;
        }
        addItemLast(item) {
          if (!this._head && !this._tail) {
            this._head = item;
          } else if (!this._tail) {
            throw new Error("Invalid list");
          } else {
            item.previous = this._tail;
            this._tail.next = item;
          }
          this._tail = item;
          this._state++;
        }
        removeItem(item) {
          if (item === this._head && item === this._tail) {
            this._head = void 0;
            this._tail = void 0;
          } else if (item === this._head) {
            if (!item.next) {
              throw new Error("Invalid list");
            }
            item.next.previous = void 0;
            this._head = item.next;
          } else if (item === this._tail) {
            if (!item.previous) {
              throw new Error("Invalid list");
            }
            item.previous.next = void 0;
            this._tail = item.previous;
          } else {
            const next = item.next;
            const previous = item.previous;
            if (!next || !previous) {
              throw new Error("Invalid list");
            }
            next.previous = previous;
            previous.next = next;
          }
          item.next = void 0;
          item.previous = void 0;
          this._state++;
        }
        touch(item, touch) {
          if (!this._head || !this._tail) {
            throw new Error("Invalid list");
          }
          if (touch !== Touch.First && touch !== Touch.Last) {
            return;
          }
          if (touch === Touch.First) {
            if (item === this._head) {
              return;
            }
            const next = item.next;
            const previous = item.previous;
            if (item === this._tail) {
              previous.next = void 0;
              this._tail = previous;
            } else {
              next.previous = previous;
              previous.next = next;
            }
            item.previous = void 0;
            item.next = this._head;
            this._head.previous = item;
            this._head = item;
            this._state++;
          } else if (touch === Touch.Last) {
            if (item === this._tail) {
              return;
            }
            const next = item.next;
            const previous = item.previous;
            if (item === this._head) {
              next.previous = void 0;
              this._head = next;
            } else {
              next.previous = previous;
              previous.next = next;
            }
            item.next = void 0;
            item.previous = this._tail;
            this._tail.next = item;
            this._tail = item;
            this._state++;
          }
        }
        toJSON() {
          const data = [];
          this.forEach((value, key) => {
            data.push([key, value]);
          });
          return data;
        }
        fromJSON(data) {
          this.clear();
          for (const [key, value] of data) {
            this.set(key, value);
          }
        }
      };
      exports.LinkedMap = LinkedMap;
      var LRUCache = class extends LinkedMap {
        constructor(limit, ratio = 1) {
          super();
          this._limit = limit;
          this._ratio = Math.min(Math.max(0, ratio), 1);
        }
        get limit() {
          return this._limit;
        }
        set limit(limit) {
          this._limit = limit;
          this.checkTrim();
        }
        get ratio() {
          return this._ratio;
        }
        set ratio(ratio) {
          this._ratio = Math.min(Math.max(0, ratio), 1);
          this.checkTrim();
        }
        get(key, touch = Touch.AsNew) {
          return super.get(key, touch);
        }
        peek(key) {
          return super.get(key, Touch.None);
        }
        set(key, value) {
          super.set(key, value, Touch.Last);
          this.checkTrim();
          return this;
        }
        checkTrim() {
          if (this.size > this._limit) {
            this.trimOld(Math.round(this._limit * this._ratio));
          }
        }
      };
      exports.LRUCache = LRUCache;
    }
  });

  // server/node_modules/vscode-jsonrpc/lib/common/cancellation.js
  var require_cancellation = __commonJS({
    "server/node_modules/vscode-jsonrpc/lib/common/cancellation.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CancellationTokenSource = exports.CancellationToken = void 0;
      var ral_1 = require_ral();
      var Is = require_is();
      var events_1 = require_events();
      var CancellationToken;
      (function(CancellationToken2) {
        CancellationToken2.None = Object.freeze({
          isCancellationRequested: false,
          onCancellationRequested: events_1.Event.None
        });
        CancellationToken2.Cancelled = Object.freeze({
          isCancellationRequested: true,
          onCancellationRequested: events_1.Event.None
        });
        function is(value) {
          const candidate = value;
          return candidate && (candidate === CancellationToken2.None || candidate === CancellationToken2.Cancelled || Is.boolean(candidate.isCancellationRequested) && !!candidate.onCancellationRequested);
        }
        CancellationToken2.is = is;
      })(CancellationToken = exports.CancellationToken || (exports.CancellationToken = {}));
      var shortcutEvent = Object.freeze(function(callback, context) {
        const handle = (0, ral_1.default)().timer.setTimeout(callback.bind(context), 0);
        return { dispose() {
          handle.dispose();
        } };
      });
      var MutableToken = class {
        constructor() {
          this._isCancelled = false;
        }
        cancel() {
          if (!this._isCancelled) {
            this._isCancelled = true;
            if (this._emitter) {
              this._emitter.fire(void 0);
              this.dispose();
            }
          }
        }
        get isCancellationRequested() {
          return this._isCancelled;
        }
        get onCancellationRequested() {
          if (this._isCancelled) {
            return shortcutEvent;
          }
          if (!this._emitter) {
            this._emitter = new events_1.Emitter();
          }
          return this._emitter.event;
        }
        dispose() {
          if (this._emitter) {
            this._emitter.dispose();
            this._emitter = void 0;
          }
        }
      };
      var CancellationTokenSource = class {
        get token() {
          if (!this._token) {
            this._token = new MutableToken();
          }
          return this._token;
        }
        cancel() {
          if (!this._token) {
            this._token = CancellationToken.Cancelled;
          } else {
            this._token.cancel();
          }
        }
        dispose() {
          if (!this._token) {
            this._token = CancellationToken.None;
          } else if (this._token instanceof MutableToken) {
            this._token.dispose();
          }
        }
      };
      exports.CancellationTokenSource = CancellationTokenSource;
    }
  });

  // server/node_modules/vscode-jsonrpc/lib/common/messageReader.js
  var require_messageReader = __commonJS({
    "server/node_modules/vscode-jsonrpc/lib/common/messageReader.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReadableStreamMessageReader = exports.AbstractMessageReader = exports.MessageReader = void 0;
      var ral_1 = require_ral();
      var Is = require_is();
      var events_1 = require_events();
      var MessageReader;
      (function(MessageReader2) {
        function is(value) {
          let candidate = value;
          return candidate && Is.func(candidate.listen) && Is.func(candidate.dispose) && Is.func(candidate.onError) && Is.func(candidate.onClose) && Is.func(candidate.onPartialMessage);
        }
        MessageReader2.is = is;
      })(MessageReader = exports.MessageReader || (exports.MessageReader = {}));
      var AbstractMessageReader = class {
        constructor() {
          this.errorEmitter = new events_1.Emitter();
          this.closeEmitter = new events_1.Emitter();
          this.partialMessageEmitter = new events_1.Emitter();
        }
        dispose() {
          this.errorEmitter.dispose();
          this.closeEmitter.dispose();
        }
        get onError() {
          return this.errorEmitter.event;
        }
        fireError(error) {
          this.errorEmitter.fire(this.asError(error));
        }
        get onClose() {
          return this.closeEmitter.event;
        }
        fireClose() {
          this.closeEmitter.fire(void 0);
        }
        get onPartialMessage() {
          return this.partialMessageEmitter.event;
        }
        firePartialMessage(info) {
          this.partialMessageEmitter.fire(info);
        }
        asError(error) {
          if (error instanceof Error) {
            return error;
          } else {
            return new Error(`Reader received error. Reason: ${Is.string(error.message) ? error.message : "unknown"}`);
          }
        }
      };
      exports.AbstractMessageReader = AbstractMessageReader;
      var ResolvedMessageReaderOptions;
      (function(ResolvedMessageReaderOptions2) {
        function fromOptions(options) {
          let charset;
          let result;
          let contentDecoder;
          const contentDecoders = new Map();
          let contentTypeDecoder;
          const contentTypeDecoders = new Map();
          if (options === void 0 || typeof options === "string") {
            charset = options ?? "utf-8";
          } else {
            charset = options.charset ?? "utf-8";
            if (options.contentDecoder !== void 0) {
              contentDecoder = options.contentDecoder;
              contentDecoders.set(contentDecoder.name, contentDecoder);
            }
            if (options.contentDecoders !== void 0) {
              for (const decoder of options.contentDecoders) {
                contentDecoders.set(decoder.name, decoder);
              }
            }
            if (options.contentTypeDecoder !== void 0) {
              contentTypeDecoder = options.contentTypeDecoder;
              contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
            }
            if (options.contentTypeDecoders !== void 0) {
              for (const decoder of options.contentTypeDecoders) {
                contentTypeDecoders.set(decoder.name, decoder);
              }
            }
          }
          if (contentTypeDecoder === void 0) {
            contentTypeDecoder = (0, ral_1.default)().applicationJson.decoder;
            contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
          }
          return { charset, contentDecoder, contentDecoders, contentTypeDecoder, contentTypeDecoders };
        }
        ResolvedMessageReaderOptions2.fromOptions = fromOptions;
      })(ResolvedMessageReaderOptions || (ResolvedMessageReaderOptions = {}));
      var ReadableStreamMessageReader = class extends AbstractMessageReader {
        constructor(readable, options) {
          super();
          this.readable = readable;
          this.options = ResolvedMessageReaderOptions.fromOptions(options);
          this.buffer = (0, ral_1.default)().messageBuffer.create(this.options.charset);
          this._partialMessageTimeout = 1e4;
          this.nextMessageLength = -1;
          this.messageToken = 0;
        }
        set partialMessageTimeout(timeout) {
          this._partialMessageTimeout = timeout;
        }
        get partialMessageTimeout() {
          return this._partialMessageTimeout;
        }
        listen(callback) {
          this.nextMessageLength = -1;
          this.messageToken = 0;
          this.partialMessageTimer = void 0;
          this.callback = callback;
          const result = this.readable.onData((data) => {
            this.onData(data);
          });
          this.readable.onError((error) => this.fireError(error));
          this.readable.onClose(() => this.fireClose());
          return result;
        }
        onData(data) {
          this.buffer.append(data);
          while (true) {
            if (this.nextMessageLength === -1) {
              const headers = this.buffer.tryReadHeaders();
              if (!headers) {
                return;
              }
              const contentLength = headers.get("Content-Length");
              if (!contentLength) {
                throw new Error("Header must provide a Content-Length property.");
              }
              const length = parseInt(contentLength);
              if (isNaN(length)) {
                throw new Error("Content-Length value must be a number.");
              }
              this.nextMessageLength = length;
            }
            const body = this.buffer.tryReadBody(this.nextMessageLength);
            if (body === void 0) {
              this.setPartialMessageTimer();
              return;
            }
            this.clearPartialMessageTimer();
            this.nextMessageLength = -1;
            let p;
            if (this.options.contentDecoder !== void 0) {
              p = this.options.contentDecoder.decode(body);
            } else {
              p = Promise.resolve(body);
            }
            p.then((value) => {
              this.options.contentTypeDecoder.decode(value, this.options).then((msg) => {
                this.callback(msg);
              }, (error) => {
                this.fireError(error);
              });
            }, (error) => {
              this.fireError(error);
            });
          }
        }
        clearPartialMessageTimer() {
          if (this.partialMessageTimer) {
            this.partialMessageTimer.dispose();
            this.partialMessageTimer = void 0;
          }
        }
        setPartialMessageTimer() {
          this.clearPartialMessageTimer();
          if (this._partialMessageTimeout <= 0) {
            return;
          }
          this.partialMessageTimer = (0, ral_1.default)().timer.setTimeout((token, timeout) => {
            this.partialMessageTimer = void 0;
            if (token === this.messageToken) {
              this.firePartialMessage({ messageToken: token, waitingTime: timeout });
              this.setPartialMessageTimer();
            }
          }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout);
        }
      };
      exports.ReadableStreamMessageReader = ReadableStreamMessageReader;
    }
  });

  // server/node_modules/vscode-jsonrpc/lib/common/semaphore.js
  var require_semaphore = __commonJS({
    "server/node_modules/vscode-jsonrpc/lib/common/semaphore.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Semaphore = void 0;
      var ral_1 = require_ral();
      var Semaphore = class {
        constructor(capacity = 1) {
          if (capacity <= 0) {
            throw new Error("Capacity must be greater than 0");
          }
          this._capacity = capacity;
          this._active = 0;
          this._waiting = [];
        }
        lock(thunk) {
          return new Promise((resolve, reject) => {
            this._waiting.push({ thunk, resolve, reject });
            this.runNext();
          });
        }
        get active() {
          return this._active;
        }
        runNext() {
          if (this._waiting.length === 0 || this._active === this._capacity) {
            return;
          }
          (0, ral_1.default)().timer.setImmediate(() => this.doRunNext());
        }
        doRunNext() {
          if (this._waiting.length === 0 || this._active === this._capacity) {
            return;
          }
          const next = this._waiting.shift();
          this._active++;
          if (this._active > this._capacity) {
            throw new Error(`To many thunks active`);
          }
          try {
            const result = next.thunk();
            if (result instanceof Promise) {
              result.then((value) => {
                this._active--;
                next.resolve(value);
                this.runNext();
              }, (err) => {
                this._active--;
                next.reject(err);
                this.runNext();
              });
            } else {
              this._active--;
              next.resolve(result);
              this.runNext();
            }
          } catch (err) {
            this._active--;
            next.reject(err);
            this.runNext();
          }
        }
      };
      exports.Semaphore = Semaphore;
    }
  });

  // server/node_modules/vscode-jsonrpc/lib/common/messageWriter.js
  var require_messageWriter = __commonJS({
    "server/node_modules/vscode-jsonrpc/lib/common/messageWriter.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WriteableStreamMessageWriter = exports.AbstractMessageWriter = exports.MessageWriter = void 0;
      var ral_1 = require_ral();
      var Is = require_is();
      var semaphore_1 = require_semaphore();
      var events_1 = require_events();
      var ContentLength = "Content-Length: ";
      var CRLF = "\r\n";
      var MessageWriter;
      (function(MessageWriter2) {
        function is(value) {
          let candidate = value;
          return candidate && Is.func(candidate.dispose) && Is.func(candidate.onClose) && Is.func(candidate.onError) && Is.func(candidate.write);
        }
        MessageWriter2.is = is;
      })(MessageWriter = exports.MessageWriter || (exports.MessageWriter = {}));
      var AbstractMessageWriter = class {
        constructor() {
          this.errorEmitter = new events_1.Emitter();
          this.closeEmitter = new events_1.Emitter();
        }
        dispose() {
          this.errorEmitter.dispose();
          this.closeEmitter.dispose();
        }
        get onError() {
          return this.errorEmitter.event;
        }
        fireError(error, message, count) {
          this.errorEmitter.fire([this.asError(error), message, count]);
        }
        get onClose() {
          return this.closeEmitter.event;
        }
        fireClose() {
          this.closeEmitter.fire(void 0);
        }
        asError(error) {
          if (error instanceof Error) {
            return error;
          } else {
            return new Error(`Writer received error. Reason: ${Is.string(error.message) ? error.message : "unknown"}`);
          }
        }
      };
      exports.AbstractMessageWriter = AbstractMessageWriter;
      var ResolvedMessageWriterOptions;
      (function(ResolvedMessageWriterOptions2) {
        function fromOptions(options) {
          if (options === void 0 || typeof options === "string") {
            return { charset: options ?? "utf-8", contentTypeEncoder: (0, ral_1.default)().applicationJson.encoder };
          } else {
            return { charset: options.charset ?? "utf-8", contentEncoder: options.contentEncoder, contentTypeEncoder: options.contentTypeEncoder ?? (0, ral_1.default)().applicationJson.encoder };
          }
        }
        ResolvedMessageWriterOptions2.fromOptions = fromOptions;
      })(ResolvedMessageWriterOptions || (ResolvedMessageWriterOptions = {}));
      var WriteableStreamMessageWriter = class extends AbstractMessageWriter {
        constructor(writable, options) {
          super();
          this.writable = writable;
          this.options = ResolvedMessageWriterOptions.fromOptions(options);
          this.errorCount = 0;
          this.writeSemaphore = new semaphore_1.Semaphore(1);
          this.writable.onError((error) => this.fireError(error));
          this.writable.onClose(() => this.fireClose());
        }
        async write(msg) {
          return this.writeSemaphore.lock(async () => {
            const payload = this.options.contentTypeEncoder.encode(msg, this.options).then((buffer) => {
              if (this.options.contentEncoder !== void 0) {
                return this.options.contentEncoder.encode(buffer);
              } else {
                return buffer;
              }
            });
            return payload.then((buffer) => {
              const headers = [];
              headers.push(ContentLength, buffer.byteLength.toString(), CRLF);
              headers.push(CRLF);
              return this.doWrite(msg, headers, buffer);
            }, (error) => {
              this.fireError(error);
              throw error;
            });
          });
        }
        async doWrite(msg, headers, data) {
          try {
            await this.writable.write(headers.join(""), "ascii");
            return this.writable.write(data);
          } catch (error) {
            this.handleError(error, msg);
            return Promise.reject(error);
          }
        }
        handleError(error, msg) {
          this.errorCount++;
          this.fireError(error, msg, this.errorCount);
        }
        end() {
          this.writable.end();
        }
      };
      exports.WriteableStreamMessageWriter = WriteableStreamMessageWriter;
    }
  });

  // server/node_modules/vscode-jsonrpc/lib/common/connection.js
  var require_connection = __commonJS({
    "server/node_modules/vscode-jsonrpc/lib/common/connection.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createMessageConnection = exports.ConnectionOptions = exports.CancellationStrategy = exports.CancellationSenderStrategy = exports.CancellationReceiverStrategy = exports.ConnectionStrategy = exports.ConnectionError = exports.ConnectionErrors = exports.LogTraceNotification = exports.SetTraceNotification = exports.TraceFormat = exports.Trace = exports.NullLogger = exports.ProgressType = exports.ProgressToken = void 0;
      var ral_1 = require_ral();
      var Is = require_is();
      var messages_1 = require_messages();
      var linkedMap_1 = require_linkedMap();
      var events_1 = require_events();
      var cancellation_1 = require_cancellation();
      var CancelNotification;
      (function(CancelNotification2) {
        CancelNotification2.type = new messages_1.NotificationType("$/cancelRequest");
      })(CancelNotification || (CancelNotification = {}));
      var ProgressToken;
      (function(ProgressToken2) {
        function is(value) {
          return typeof value === "string" || typeof value === "number";
        }
        ProgressToken2.is = is;
      })(ProgressToken = exports.ProgressToken || (exports.ProgressToken = {}));
      var ProgressNotification;
      (function(ProgressNotification2) {
        ProgressNotification2.type = new messages_1.NotificationType("$/progress");
      })(ProgressNotification || (ProgressNotification = {}));
      var ProgressType = class {
        constructor() {
        }
      };
      exports.ProgressType = ProgressType;
      var StarRequestHandler;
      (function(StarRequestHandler2) {
        function is(value) {
          return Is.func(value);
        }
        StarRequestHandler2.is = is;
      })(StarRequestHandler || (StarRequestHandler = {}));
      exports.NullLogger = Object.freeze({
        error: () => {
        },
        warn: () => {
        },
        info: () => {
        },
        log: () => {
        }
      });
      var Trace;
      (function(Trace2) {
        Trace2[Trace2["Off"] = 0] = "Off";
        Trace2[Trace2["Messages"] = 1] = "Messages";
        Trace2[Trace2["Compact"] = 2] = "Compact";
        Trace2[Trace2["Verbose"] = 3] = "Verbose";
      })(Trace = exports.Trace || (exports.Trace = {}));
      (function(Trace2) {
        function fromString(value) {
          if (!Is.string(value)) {
            return Trace2.Off;
          }
          value = value.toLowerCase();
          switch (value) {
            case "off":
              return Trace2.Off;
            case "messages":
              return Trace2.Messages;
            case "compact":
              return Trace2.Compact;
            case "verbose":
              return Trace2.Verbose;
            default:
              return Trace2.Off;
          }
        }
        Trace2.fromString = fromString;
        function toString(value) {
          switch (value) {
            case Trace2.Off:
              return "off";
            case Trace2.Messages:
              return "messages";
            case Trace2.Compact:
              return "compact";
            case Trace2.Verbose:
              return "verbose";
            default:
              return "off";
          }
        }
        Trace2.toString = toString;
      })(Trace = exports.Trace || (exports.Trace = {}));
      var TraceFormat;
      (function(TraceFormat2) {
        TraceFormat2["Text"] = "text";
        TraceFormat2["JSON"] = "json";
      })(TraceFormat = exports.TraceFormat || (exports.TraceFormat = {}));
      (function(TraceFormat2) {
        function fromString(value) {
          if (!Is.string(value)) {
            return TraceFormat2.Text;
          }
          value = value.toLowerCase();
          if (value === "json") {
            return TraceFormat2.JSON;
          } else {
            return TraceFormat2.Text;
          }
        }
        TraceFormat2.fromString = fromString;
      })(TraceFormat = exports.TraceFormat || (exports.TraceFormat = {}));
      var SetTraceNotification;
      (function(SetTraceNotification2) {
        SetTraceNotification2.type = new messages_1.NotificationType("$/setTrace");
      })(SetTraceNotification = exports.SetTraceNotification || (exports.SetTraceNotification = {}));
      var LogTraceNotification;
      (function(LogTraceNotification2) {
        LogTraceNotification2.type = new messages_1.NotificationType("$/logTrace");
      })(LogTraceNotification = exports.LogTraceNotification || (exports.LogTraceNotification = {}));
      var ConnectionErrors;
      (function(ConnectionErrors2) {
        ConnectionErrors2[ConnectionErrors2["Closed"] = 1] = "Closed";
        ConnectionErrors2[ConnectionErrors2["Disposed"] = 2] = "Disposed";
        ConnectionErrors2[ConnectionErrors2["AlreadyListening"] = 3] = "AlreadyListening";
      })(ConnectionErrors = exports.ConnectionErrors || (exports.ConnectionErrors = {}));
      var ConnectionError = class extends Error {
        constructor(code, message) {
          super(message);
          this.code = code;
          Object.setPrototypeOf(this, ConnectionError.prototype);
        }
      };
      exports.ConnectionError = ConnectionError;
      var ConnectionStrategy;
      (function(ConnectionStrategy2) {
        function is(value) {
          const candidate = value;
          return candidate && Is.func(candidate.cancelUndispatched);
        }
        ConnectionStrategy2.is = is;
      })(ConnectionStrategy = exports.ConnectionStrategy || (exports.ConnectionStrategy = {}));
      var CancellationReceiverStrategy;
      (function(CancellationReceiverStrategy2) {
        CancellationReceiverStrategy2.Message = Object.freeze({
          createCancellationTokenSource(_) {
            return new cancellation_1.CancellationTokenSource();
          }
        });
        function is(value) {
          const candidate = value;
          return candidate && Is.func(candidate.createCancellationTokenSource);
        }
        CancellationReceiverStrategy2.is = is;
      })(CancellationReceiverStrategy = exports.CancellationReceiverStrategy || (exports.CancellationReceiverStrategy = {}));
      var CancellationSenderStrategy;
      (function(CancellationSenderStrategy2) {
        CancellationSenderStrategy2.Message = Object.freeze({
          sendCancellation(conn, id) {
            return conn.sendNotification(CancelNotification.type, { id });
          },
          cleanup(_) {
          }
        });
        function is(value) {
          const candidate = value;
          return candidate && Is.func(candidate.sendCancellation) && Is.func(candidate.cleanup);
        }
        CancellationSenderStrategy2.is = is;
      })(CancellationSenderStrategy = exports.CancellationSenderStrategy || (exports.CancellationSenderStrategy = {}));
      var CancellationStrategy;
      (function(CancellationStrategy2) {
        CancellationStrategy2.Message = Object.freeze({
          receiver: CancellationReceiverStrategy.Message,
          sender: CancellationSenderStrategy.Message
        });
        function is(value) {
          const candidate = value;
          return candidate && CancellationReceiverStrategy.is(candidate.receiver) && CancellationSenderStrategy.is(candidate.sender);
        }
        CancellationStrategy2.is = is;
      })(CancellationStrategy = exports.CancellationStrategy || (exports.CancellationStrategy = {}));
      var ConnectionOptions;
      (function(ConnectionOptions2) {
        function is(value) {
          const candidate = value;
          return candidate && (CancellationStrategy.is(candidate.cancellationStrategy) || ConnectionStrategy.is(candidate.connectionStrategy));
        }
        ConnectionOptions2.is = is;
      })(ConnectionOptions = exports.ConnectionOptions || (exports.ConnectionOptions = {}));
      var ConnectionState;
      (function(ConnectionState2) {
        ConnectionState2[ConnectionState2["New"] = 1] = "New";
        ConnectionState2[ConnectionState2["Listening"] = 2] = "Listening";
        ConnectionState2[ConnectionState2["Closed"] = 3] = "Closed";
        ConnectionState2[ConnectionState2["Disposed"] = 4] = "Disposed";
      })(ConnectionState || (ConnectionState = {}));
      function createMessageConnection(messageReader, messageWriter, _logger, options) {
        const logger = _logger !== void 0 ? _logger : exports.NullLogger;
        let sequenceNumber = 0;
        let notificationSequenceNumber = 0;
        let unknownResponseSequenceNumber = 0;
        const version = "2.0";
        let starRequestHandler = void 0;
        const requestHandlers = Object.create(null);
        let starNotificationHandler = void 0;
        const notificationHandlers = Object.create(null);
        const progressHandlers = new Map();
        let timer;
        let messageQueue = new linkedMap_1.LinkedMap();
        let responsePromises = Object.create(null);
        let knownCanceledRequests = new Set();
        let requestTokens = Object.create(null);
        let trace = Trace.Off;
        let traceFormat = TraceFormat.Text;
        let tracer;
        let state = ConnectionState.New;
        const errorEmitter = new events_1.Emitter();
        const closeEmitter = new events_1.Emitter();
        const unhandledNotificationEmitter = new events_1.Emitter();
        const unhandledProgressEmitter = new events_1.Emitter();
        const disposeEmitter = new events_1.Emitter();
        const cancellationStrategy = options && options.cancellationStrategy ? options.cancellationStrategy : CancellationStrategy.Message;
        function createRequestQueueKey(id) {
          if (id === null) {
            throw new Error(`Can't send requests with id null since the response can't be correlated.`);
          }
          return "req-" + id.toString();
        }
        function createResponseQueueKey(id) {
          if (id === null) {
            return "res-unknown-" + (++unknownResponseSequenceNumber).toString();
          } else {
            return "res-" + id.toString();
          }
        }
        function createNotificationQueueKey() {
          return "not-" + (++notificationSequenceNumber).toString();
        }
        function addMessageToQueue(queue, message) {
          if (messages_1.Message.isRequest(message)) {
            queue.set(createRequestQueueKey(message.id), message);
          } else if (messages_1.Message.isResponse(message)) {
            queue.set(createResponseQueueKey(message.id), message);
          } else {
            queue.set(createNotificationQueueKey(), message);
          }
        }
        function cancelUndispatched(_message) {
          return void 0;
        }
        function isListening() {
          return state === ConnectionState.Listening;
        }
        function isClosed() {
          return state === ConnectionState.Closed;
        }
        function isDisposed() {
          return state === ConnectionState.Disposed;
        }
        function closeHandler() {
          if (state === ConnectionState.New || state === ConnectionState.Listening) {
            state = ConnectionState.Closed;
            closeEmitter.fire(void 0);
          }
        }
        function readErrorHandler(error) {
          errorEmitter.fire([error, void 0, void 0]);
        }
        function writeErrorHandler(data) {
          errorEmitter.fire(data);
        }
        messageReader.onClose(closeHandler);
        messageReader.onError(readErrorHandler);
        messageWriter.onClose(closeHandler);
        messageWriter.onError(writeErrorHandler);
        function triggerMessageQueue() {
          if (timer || messageQueue.size === 0) {
            return;
          }
          timer = (0, ral_1.default)().timer.setImmediate(() => {
            timer = void 0;
            processMessageQueue();
          });
        }
        function processMessageQueue() {
          if (messageQueue.size === 0) {
            return;
          }
          const message = messageQueue.shift();
          try {
            if (messages_1.Message.isRequest(message)) {
              handleRequest(message);
            } else if (messages_1.Message.isNotification(message)) {
              handleNotification(message);
            } else if (messages_1.Message.isResponse(message)) {
              handleResponse(message);
            } else {
              handleInvalidMessage(message);
            }
          } finally {
            triggerMessageQueue();
          }
        }
        const callback = (message) => {
          try {
            if (messages_1.Message.isNotification(message) && message.method === CancelNotification.type.method) {
              const cancelId = message.params.id;
              const key = createRequestQueueKey(cancelId);
              const toCancel = messageQueue.get(key);
              if (messages_1.Message.isRequest(toCancel)) {
                const strategy = options?.connectionStrategy;
                const response = strategy && strategy.cancelUndispatched ? strategy.cancelUndispatched(toCancel, cancelUndispatched) : cancelUndispatched(toCancel);
                if (response && (response.error !== void 0 || response.result !== void 0)) {
                  messageQueue.delete(key);
                  response.id = toCancel.id;
                  traceSendingResponse(response, message.method, Date.now());
                  messageWriter.write(response).catch(() => logger.error(`Sending response for canceled message failed.`));
                  return;
                }
              }
              const tokenKey = String(cancelId);
              const cancellationToken = requestTokens[tokenKey];
              if (cancellationToken !== void 0) {
                cancellationToken.cancel();
                traceReceivedNotification(message);
                return;
              } else {
                knownCanceledRequests.add(cancelId);
              }
            }
            addMessageToQueue(messageQueue, message);
          } finally {
            triggerMessageQueue();
          }
        };
        function handleRequest(requestMessage) {
          if (isDisposed()) {
            return;
          }
          function reply(resultOrError, method, startTime2) {
            const message = {
              jsonrpc: version,
              id: requestMessage.id
            };
            if (resultOrError instanceof messages_1.ResponseError) {
              message.error = resultOrError.toJson();
            } else {
              message.result = resultOrError === void 0 ? null : resultOrError;
            }
            traceSendingResponse(message, method, startTime2);
            messageWriter.write(message).catch(() => logger.error(`Sending response failed.`));
          }
          function replyError(error, method, startTime2) {
            const message = {
              jsonrpc: version,
              id: requestMessage.id,
              error: error.toJson()
            };
            traceSendingResponse(message, method, startTime2);
            messageWriter.write(message).catch(() => logger.error(`Sending response failed.`));
          }
          function replySuccess(result, method, startTime2) {
            if (result === void 0) {
              result = null;
            }
            const message = {
              jsonrpc: version,
              id: requestMessage.id,
              result
            };
            traceSendingResponse(message, method, startTime2);
            messageWriter.write(message).catch(() => logger.error(`Sending response failed.`));
          }
          traceReceivedRequest(requestMessage);
          const element = requestHandlers[requestMessage.method];
          let type;
          let requestHandler;
          if (element) {
            type = element.type;
            requestHandler = element.handler;
          }
          const startTime = Date.now();
          if (requestHandler || starRequestHandler) {
            const tokenKey = String(requestMessage.id);
            const cancellationSource = cancellationStrategy.receiver.createCancellationTokenSource(tokenKey);
            if (requestMessage.id !== null && knownCanceledRequests.has(requestMessage.id)) {
              cancellationSource.cancel();
            }
            requestTokens[tokenKey] = cancellationSource;
            try {
              let handlerResult;
              if (requestHandler) {
                if (requestMessage.params === void 0) {
                  if (type !== void 0 && type.numberOfParams !== 0) {
                    replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines ${type.numberOfParams} params but received none.`), requestMessage.method, startTime);
                    return;
                  }
                  handlerResult = requestHandler(cancellationSource.token);
                } else if (Array.isArray(requestMessage.params)) {
                  if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byName) {
                    replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by name but received parameters by position`), requestMessage.method, startTime);
                    return;
                  }
                  handlerResult = requestHandler(...requestMessage.params, cancellationSource.token);
                } else {
                  if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byPosition) {
                    replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by position but received parameters by name`), requestMessage.method, startTime);
                    return;
                  }
                  handlerResult = requestHandler(requestMessage.params, cancellationSource.token);
                }
              } else if (starRequestHandler) {
                handlerResult = starRequestHandler(requestMessage.method, requestMessage.params, cancellationSource.token);
              }
              const promise = handlerResult;
              if (!handlerResult) {
                delete requestTokens[tokenKey];
                replySuccess(handlerResult, requestMessage.method, startTime);
              } else if (promise.then) {
                promise.then((resultOrError) => {
                  delete requestTokens[tokenKey];
                  reply(resultOrError, requestMessage.method, startTime);
                }, (error) => {
                  delete requestTokens[tokenKey];
                  if (error instanceof messages_1.ResponseError) {
                    replyError(error, requestMessage.method, startTime);
                  } else if (error && Is.string(error.message)) {
                    replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
                  } else {
                    replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
                  }
                });
              } else {
                delete requestTokens[tokenKey];
                reply(handlerResult, requestMessage.method, startTime);
              }
            } catch (error) {
              delete requestTokens[tokenKey];
              if (error instanceof messages_1.ResponseError) {
                reply(error, requestMessage.method, startTime);
              } else if (error && Is.string(error.message)) {
                replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
              } else {
                replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
              }
            }
          } else {
            replyError(new messages_1.ResponseError(messages_1.ErrorCodes.MethodNotFound, `Unhandled method ${requestMessage.method}`), requestMessage.method, startTime);
          }
        }
        function handleResponse(responseMessage) {
          if (isDisposed()) {
            return;
          }
          if (responseMessage.id === null) {
            if (responseMessage.error) {
              logger.error(`Received response message without id: Error is: 
${JSON.stringify(responseMessage.error, void 0, 4)}`);
            } else {
              logger.error(`Received response message without id. No further error information provided.`);
            }
          } else {
            const key = String(responseMessage.id);
            const responsePromise = responsePromises[key];
            traceReceivedResponse(responseMessage, responsePromise);
            if (responsePromise) {
              delete responsePromises[key];
              try {
                if (responseMessage.error) {
                  const error = responseMessage.error;
                  responsePromise.reject(new messages_1.ResponseError(error.code, error.message, error.data));
                } else if (responseMessage.result !== void 0) {
                  responsePromise.resolve(responseMessage.result);
                } else {
                  throw new Error("Should never happen.");
                }
              } catch (error) {
                if (error.message) {
                  logger.error(`Response handler '${responsePromise.method}' failed with message: ${error.message}`);
                } else {
                  logger.error(`Response handler '${responsePromise.method}' failed unexpectedly.`);
                }
              }
            }
          }
        }
        function handleNotification(message) {
          if (isDisposed()) {
            return;
          }
          let type = void 0;
          let notificationHandler;
          if (message.method === CancelNotification.type.method) {
            const cancelId = message.params.id;
            knownCanceledRequests.delete(cancelId);
            traceReceivedNotification(message);
            return;
          } else {
            const element = notificationHandlers[message.method];
            if (element) {
              notificationHandler = element.handler;
              type = element.type;
            }
          }
          if (notificationHandler || starNotificationHandler) {
            try {
              traceReceivedNotification(message);
              if (notificationHandler) {
                if (message.params === void 0) {
                  if (type !== void 0) {
                    if (type.numberOfParams !== 0 && type.parameterStructures !== messages_1.ParameterStructures.byName) {
                      logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but received none.`);
                    }
                  }
                  notificationHandler();
                } else if (Array.isArray(message.params)) {
                  const params = message.params;
                  if (message.method === ProgressNotification.type.method && params.length === 2 && ProgressToken.is(params[0])) {
                    notificationHandler({ token: params[0], value: params[1] });
                  } else {
                    if (type !== void 0) {
                      if (type.parameterStructures === messages_1.ParameterStructures.byName) {
                        logger.error(`Notification ${message.method} defines parameters by name but received parameters by position`);
                      }
                      if (type.numberOfParams !== message.params.length) {
                        logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but received ${params.length} arguments`);
                      }
                    }
                    notificationHandler(...params);
                  }
                } else {
                  if (type !== void 0 && type.parameterStructures === messages_1.ParameterStructures.byPosition) {
                    logger.error(`Notification ${message.method} defines parameters by position but received parameters by name`);
                  }
                  notificationHandler(message.params);
                }
              } else if (starNotificationHandler) {
                starNotificationHandler(message.method, message.params);
              }
            } catch (error) {
              if (error.message) {
                logger.error(`Notification handler '${message.method}' failed with message: ${error.message}`);
              } else {
                logger.error(`Notification handler '${message.method}' failed unexpectedly.`);
              }
            }
          } else {
            unhandledNotificationEmitter.fire(message);
          }
        }
        function handleInvalidMessage(message) {
          if (!message) {
            logger.error("Received empty message.");
            return;
          }
          logger.error(`Received message which is neither a response nor a notification message:
${JSON.stringify(message, null, 4)}`);
          const responseMessage = message;
          if (Is.string(responseMessage.id) || Is.number(responseMessage.id)) {
            const key = String(responseMessage.id);
            const responseHandler = responsePromises[key];
            if (responseHandler) {
              responseHandler.reject(new Error("The received response has neither a result nor an error property."));
            }
          }
        }
        function stringifyTrace(params) {
          if (params === void 0 || params === null) {
            return void 0;
          }
          switch (trace) {
            case Trace.Verbose:
              return JSON.stringify(params, null, 4);
            case Trace.Compact:
              return JSON.stringify(params);
            default:
              return void 0;
          }
        }
        function traceSendingRequest(message) {
          if (trace === Trace.Off || !tracer) {
            return;
          }
          if (traceFormat === TraceFormat.Text) {
            let data = void 0;
            if ((trace === Trace.Verbose || trace === Trace.Compact) && message.params) {
              data = `Params: ${stringifyTrace(message.params)}

`;
            }
            tracer.log(`Sending request '${message.method} - (${message.id})'.`, data);
          } else {
            logLSPMessage("send-request", message);
          }
        }
        function traceSendingNotification(message) {
          if (trace === Trace.Off || !tracer) {
            return;
          }
          if (traceFormat === TraceFormat.Text) {
            let data = void 0;
            if (trace === Trace.Verbose || trace === Trace.Compact) {
              if (message.params) {
                data = `Params: ${stringifyTrace(message.params)}

`;
              } else {
                data = "No parameters provided.\n\n";
              }
            }
            tracer.log(`Sending notification '${message.method}'.`, data);
          } else {
            logLSPMessage("send-notification", message);
          }
        }
        function traceSendingResponse(message, method, startTime) {
          if (trace === Trace.Off || !tracer) {
            return;
          }
          if (traceFormat === TraceFormat.Text) {
            let data = void 0;
            if (trace === Trace.Verbose || trace === Trace.Compact) {
              if (message.error && message.error.data) {
                data = `Error data: ${stringifyTrace(message.error.data)}

`;
              } else {
                if (message.result) {
                  data = `Result: ${stringifyTrace(message.result)}

`;
                } else if (message.error === void 0) {
                  data = "No result returned.\n\n";
                }
              }
            }
            tracer.log(`Sending response '${method} - (${message.id})'. Processing request took ${Date.now() - startTime}ms`, data);
          } else {
            logLSPMessage("send-response", message);
          }
        }
        function traceReceivedRequest(message) {
          if (trace === Trace.Off || !tracer) {
            return;
          }
          if (traceFormat === TraceFormat.Text) {
            let data = void 0;
            if ((trace === Trace.Verbose || trace === Trace.Compact) && message.params) {
              data = `Params: ${stringifyTrace(message.params)}

`;
            }
            tracer.log(`Received request '${message.method} - (${message.id})'.`, data);
          } else {
            logLSPMessage("receive-request", message);
          }
        }
        function traceReceivedNotification(message) {
          if (trace === Trace.Off || !tracer || message.method === LogTraceNotification.type.method) {
            return;
          }
          if (traceFormat === TraceFormat.Text) {
            let data = void 0;
            if (trace === Trace.Verbose || trace === Trace.Compact) {
              if (message.params) {
                data = `Params: ${stringifyTrace(message.params)}

`;
              } else {
                data = "No parameters provided.\n\n";
              }
            }
            tracer.log(`Received notification '${message.method}'.`, data);
          } else {
            logLSPMessage("receive-notification", message);
          }
        }
        function traceReceivedResponse(message, responsePromise) {
          if (trace === Trace.Off || !tracer) {
            return;
          }
          if (traceFormat === TraceFormat.Text) {
            let data = void 0;
            if (trace === Trace.Verbose || trace === Trace.Compact) {
              if (message.error && message.error.data) {
                data = `Error data: ${stringifyTrace(message.error.data)}

`;
              } else {
                if (message.result) {
                  data = `Result: ${stringifyTrace(message.result)}

`;
                } else if (message.error === void 0) {
                  data = "No result returned.\n\n";
                }
              }
            }
            if (responsePromise) {
              const error = message.error ? ` Request failed: ${message.error.message} (${message.error.code}).` : "";
              tracer.log(`Received response '${responsePromise.method} - (${message.id})' in ${Date.now() - responsePromise.timerStart}ms.${error}`, data);
            } else {
              tracer.log(`Received response ${message.id} without active response promise.`, data);
            }
          } else {
            logLSPMessage("receive-response", message);
          }
        }
        function logLSPMessage(type, message) {
          if (!tracer || trace === Trace.Off) {
            return;
          }
          const lspMessage = {
            isLSPMessage: true,
            type,
            message,
            timestamp: Date.now()
          };
          tracer.log(lspMessage);
        }
        function throwIfClosedOrDisposed() {
          if (isClosed()) {
            throw new ConnectionError(ConnectionErrors.Closed, "Connection is closed.");
          }
          if (isDisposed()) {
            throw new ConnectionError(ConnectionErrors.Disposed, "Connection is disposed.");
          }
        }
        function throwIfListening() {
          if (isListening()) {
            throw new ConnectionError(ConnectionErrors.AlreadyListening, "Connection is already listening");
          }
        }
        function throwIfNotListening() {
          if (!isListening()) {
            throw new Error("Call listen() first.");
          }
        }
        function undefinedToNull(param) {
          if (param === void 0) {
            return null;
          } else {
            return param;
          }
        }
        function nullToUndefined(param) {
          if (param === null) {
            return void 0;
          } else {
            return param;
          }
        }
        function isNamedParam(param) {
          return param !== void 0 && param !== null && !Array.isArray(param) && typeof param === "object";
        }
        function computeSingleParam(parameterStructures, param) {
          switch (parameterStructures) {
            case messages_1.ParameterStructures.auto:
              if (isNamedParam(param)) {
                return nullToUndefined(param);
              } else {
                return [undefinedToNull(param)];
              }
            case messages_1.ParameterStructures.byName:
              if (!isNamedParam(param)) {
                throw new Error(`Received parameters by name but param is not an object literal.`);
              }
              return nullToUndefined(param);
            case messages_1.ParameterStructures.byPosition:
              return [undefinedToNull(param)];
            default:
              throw new Error(`Unknown parameter structure ${parameterStructures.toString()}`);
          }
        }
        function computeMessageParams(type, params) {
          let result;
          const numberOfParams = type.numberOfParams;
          switch (numberOfParams) {
            case 0:
              result = void 0;
              break;
            case 1:
              result = computeSingleParam(type.parameterStructures, params[0]);
              break;
            default:
              result = [];
              for (let i = 0; i < params.length && i < numberOfParams; i++) {
                result.push(undefinedToNull(params[i]));
              }
              if (params.length < numberOfParams) {
                for (let i = params.length; i < numberOfParams; i++) {
                  result.push(null);
                }
              }
              break;
          }
          return result;
        }
        const connection = {
          sendNotification: (type, ...args) => {
            throwIfClosedOrDisposed();
            let method;
            let messageParams;
            if (Is.string(type)) {
              method = type;
              const first = args[0];
              let paramStart = 0;
              let parameterStructures = messages_1.ParameterStructures.auto;
              if (messages_1.ParameterStructures.is(first)) {
                paramStart = 1;
                parameterStructures = first;
              }
              let paramEnd = args.length;
              const numberOfParams = paramEnd - paramStart;
              switch (numberOfParams) {
                case 0:
                  messageParams = void 0;
                  break;
                case 1:
                  messageParams = computeSingleParam(parameterStructures, args[paramStart]);
                  break;
                default:
                  if (parameterStructures === messages_1.ParameterStructures.byName) {
                    throw new Error(`Received ${numberOfParams} parameters for 'by Name' notification parameter structure.`);
                  }
                  messageParams = args.slice(paramStart, paramEnd).map((value) => undefinedToNull(value));
                  break;
              }
            } else {
              const params = args;
              method = type.method;
              messageParams = computeMessageParams(type, params);
            }
            const notificationMessage = {
              jsonrpc: version,
              method,
              params: messageParams
            };
            traceSendingNotification(notificationMessage);
            return messageWriter.write(notificationMessage).catch(() => logger.error(`Sending notification failed.`));
          },
          onNotification: (type, handler) => {
            throwIfClosedOrDisposed();
            let method;
            if (Is.func(type)) {
              starNotificationHandler = type;
            } else if (handler) {
              if (Is.string(type)) {
                method = type;
                notificationHandlers[type] = { type: void 0, handler };
              } else {
                method = type.method;
                notificationHandlers[type.method] = { type, handler };
              }
            }
            return {
              dispose: () => {
                if (method !== void 0) {
                  delete notificationHandlers[method];
                } else {
                  starNotificationHandler = void 0;
                }
              }
            };
          },
          onProgress: (_type, token, handler) => {
            if (progressHandlers.has(token)) {
              throw new Error(`Progress handler for token ${token} already registered`);
            }
            progressHandlers.set(token, handler);
            return {
              dispose: () => {
                progressHandlers.delete(token);
              }
            };
          },
          sendProgress: (_type, token, value) => {
            return connection.sendNotification(ProgressNotification.type, { token, value });
          },
          onUnhandledProgress: unhandledProgressEmitter.event,
          sendRequest: (type, ...args) => {
            throwIfClosedOrDisposed();
            throwIfNotListening();
            let method;
            let messageParams;
            let token = void 0;
            if (Is.string(type)) {
              method = type;
              const first = args[0];
              const last = args[args.length - 1];
              let paramStart = 0;
              let parameterStructures = messages_1.ParameterStructures.auto;
              if (messages_1.ParameterStructures.is(first)) {
                paramStart = 1;
                parameterStructures = first;
              }
              let paramEnd = args.length;
              if (cancellation_1.CancellationToken.is(last)) {
                paramEnd = paramEnd - 1;
                token = last;
              }
              const numberOfParams = paramEnd - paramStart;
              switch (numberOfParams) {
                case 0:
                  messageParams = void 0;
                  break;
                case 1:
                  messageParams = computeSingleParam(parameterStructures, args[paramStart]);
                  break;
                default:
                  if (parameterStructures === messages_1.ParameterStructures.byName) {
                    throw new Error(`Received ${numberOfParams} parameters for 'by Name' request parameter structure.`);
                  }
                  messageParams = args.slice(paramStart, paramEnd).map((value) => undefinedToNull(value));
                  break;
              }
            } else {
              const params = args;
              method = type.method;
              messageParams = computeMessageParams(type, params);
              const numberOfParams = type.numberOfParams;
              token = cancellation_1.CancellationToken.is(params[numberOfParams]) ? params[numberOfParams] : void 0;
            }
            const id = sequenceNumber++;
            let disposable;
            if (token) {
              disposable = token.onCancellationRequested(() => {
                const p = cancellationStrategy.sender.sendCancellation(connection, id);
                if (p === void 0) {
                  logger.log(`Received no promise from cancellation strategy when cancelling id ${id}`);
                  return Promise.resolve();
                } else {
                  return p.catch(() => {
                    logger.log(`Sending cancellation messages for id ${id} failed`);
                  });
                }
              });
            }
            const result = new Promise((resolve, reject) => {
              const requestMessage = {
                jsonrpc: version,
                id,
                method,
                params: messageParams
              };
              const resolveWithCleanup = (r) => {
                resolve(r);
                cancellationStrategy.sender.cleanup(id);
                disposable?.dispose();
              };
              const rejectWithCleanup = (r) => {
                reject(r);
                cancellationStrategy.sender.cleanup(id);
                disposable?.dispose();
              };
              let responsePromise = { method, timerStart: Date.now(), resolve: resolveWithCleanup, reject: rejectWithCleanup };
              traceSendingRequest(requestMessage);
              try {
                messageWriter.write(requestMessage).catch(() => logger.error(`Sending request failed.`));
              } catch (e) {
                responsePromise.reject(new messages_1.ResponseError(messages_1.ErrorCodes.MessageWriteError, e.message ? e.message : "Unknown reason"));
                responsePromise = null;
              }
              if (responsePromise) {
                responsePromises[String(id)] = responsePromise;
              }
            });
            return result;
          },
          onRequest: (type, handler) => {
            throwIfClosedOrDisposed();
            let method = null;
            if (StarRequestHandler.is(type)) {
              method = void 0;
              starRequestHandler = type;
            } else if (Is.string(type)) {
              method = null;
              if (handler !== void 0) {
                method = type;
                requestHandlers[type] = { handler, type: void 0 };
              }
            } else {
              if (handler !== void 0) {
                method = type.method;
                requestHandlers[type.method] = { type, handler };
              }
            }
            return {
              dispose: () => {
                if (method === null) {
                  return;
                }
                if (method !== void 0) {
                  delete requestHandlers[method];
                } else {
                  starRequestHandler = void 0;
                }
              }
            };
          },
          trace: (_value, _tracer, sendNotificationOrTraceOptions) => {
            let _sendNotification = false;
            let _traceFormat = TraceFormat.Text;
            if (sendNotificationOrTraceOptions !== void 0) {
              if (Is.boolean(sendNotificationOrTraceOptions)) {
                _sendNotification = sendNotificationOrTraceOptions;
              } else {
                _sendNotification = sendNotificationOrTraceOptions.sendNotification || false;
                _traceFormat = sendNotificationOrTraceOptions.traceFormat || TraceFormat.Text;
              }
            }
            trace = _value;
            traceFormat = _traceFormat;
            if (trace === Trace.Off) {
              tracer = void 0;
            } else {
              tracer = _tracer;
            }
            if (_sendNotification && !isClosed() && !isDisposed()) {
              connection.sendNotification(SetTraceNotification.type, { value: Trace.toString(_value) }).catch(() => {
                logger.error(`Sending trace notification failed`);
              });
            }
          },
          onError: errorEmitter.event,
          onClose: closeEmitter.event,
          onUnhandledNotification: unhandledNotificationEmitter.event,
          onDispose: disposeEmitter.event,
          end: () => {
            messageWriter.end();
          },
          dispose: () => {
            if (isDisposed()) {
              return;
            }
            state = ConnectionState.Disposed;
            disposeEmitter.fire(void 0);
            const error = new Error("Connection got disposed.");
            Object.keys(responsePromises).forEach((key) => {
              responsePromises[key].reject(error);
            });
            responsePromises = Object.create(null);
            requestTokens = Object.create(null);
            knownCanceledRequests = new Set();
            messageQueue = new linkedMap_1.LinkedMap();
            if (Is.func(messageWriter.dispose)) {
              messageWriter.dispose();
            }
            if (Is.func(messageReader.dispose)) {
              messageReader.dispose();
            }
          },
          listen: () => {
            throwIfClosedOrDisposed();
            throwIfListening();
            state = ConnectionState.Listening;
            messageReader.listen(callback);
          },
          inspect: () => {
            (0, ral_1.default)().console.log("inspect");
          }
        };
        connection.onNotification(LogTraceNotification.type, (params) => {
          if (trace === Trace.Off || !tracer) {
            return;
          }
          const verbose = trace === Trace.Verbose || trace === Trace.Compact;
          tracer.log(params.message, verbose ? params.verbose : void 0);
        });
        connection.onNotification(ProgressNotification.type, (params) => {
          const handler = progressHandlers.get(params.token);
          if (handler) {
            handler(params.value);
          } else {
            unhandledProgressEmitter.fire(params);
          }
        });
        return connection;
      }
      exports.createMessageConnection = createMessageConnection;
    }
  });

  // server/node_modules/vscode-jsonrpc/lib/common/api.js
  var require_api = __commonJS({
    "server/node_modules/vscode-jsonrpc/lib/common/api.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SetTraceNotification = exports.TraceFormat = exports.Trace = exports.ProgressType = exports.ProgressToken = exports.createMessageConnection = exports.NullLogger = exports.ConnectionOptions = exports.ConnectionStrategy = exports.WriteableStreamMessageWriter = exports.AbstractMessageWriter = exports.MessageWriter = exports.ReadableStreamMessageReader = exports.AbstractMessageReader = exports.MessageReader = exports.CancellationToken = exports.CancellationTokenSource = exports.Emitter = exports.Event = exports.Disposable = exports.LRUCache = exports.Touch = exports.LinkedMap = exports.ParameterStructures = exports.NotificationType9 = exports.NotificationType8 = exports.NotificationType7 = exports.NotificationType6 = exports.NotificationType5 = exports.NotificationType4 = exports.NotificationType3 = exports.NotificationType2 = exports.NotificationType1 = exports.NotificationType0 = exports.NotificationType = exports.ErrorCodes = exports.ResponseError = exports.RequestType9 = exports.RequestType8 = exports.RequestType7 = exports.RequestType6 = exports.RequestType5 = exports.RequestType4 = exports.RequestType3 = exports.RequestType2 = exports.RequestType1 = exports.RequestType0 = exports.RequestType = exports.Message = exports.RAL = void 0;
      exports.CancellationStrategy = exports.CancellationSenderStrategy = exports.CancellationReceiverStrategy = exports.ConnectionError = exports.ConnectionErrors = exports.LogTraceNotification = void 0;
      var messages_1 = require_messages();
      Object.defineProperty(exports, "Message", { enumerable: true, get: function() {
        return messages_1.Message;
      } });
      Object.defineProperty(exports, "RequestType", { enumerable: true, get: function() {
        return messages_1.RequestType;
      } });
      Object.defineProperty(exports, "RequestType0", { enumerable: true, get: function() {
        return messages_1.RequestType0;
      } });
      Object.defineProperty(exports, "RequestType1", { enumerable: true, get: function() {
        return messages_1.RequestType1;
      } });
      Object.defineProperty(exports, "RequestType2", { enumerable: true, get: function() {
        return messages_1.RequestType2;
      } });
      Object.defineProperty(exports, "RequestType3", { enumerable: true, get: function() {
        return messages_1.RequestType3;
      } });
      Object.defineProperty(exports, "RequestType4", { enumerable: true, get: function() {
        return messages_1.RequestType4;
      } });
      Object.defineProperty(exports, "RequestType5", { enumerable: true, get: function() {
        return messages_1.RequestType5;
      } });
      Object.defineProperty(exports, "RequestType6", { enumerable: true, get: function() {
        return messages_1.RequestType6;
      } });
      Object.defineProperty(exports, "RequestType7", { enumerable: true, get: function() {
        return messages_1.RequestType7;
      } });
      Object.defineProperty(exports, "RequestType8", { enumerable: true, get: function() {
        return messages_1.RequestType8;
      } });
      Object.defineProperty(exports, "RequestType9", { enumerable: true, get: function() {
        return messages_1.RequestType9;
      } });
      Object.defineProperty(exports, "ResponseError", { enumerable: true, get: function() {
        return messages_1.ResponseError;
      } });
      Object.defineProperty(exports, "ErrorCodes", { enumerable: true, get: function() {
        return messages_1.ErrorCodes;
      } });
      Object.defineProperty(exports, "NotificationType", { enumerable: true, get: function() {
        return messages_1.NotificationType;
      } });
      Object.defineProperty(exports, "NotificationType0", { enumerable: true, get: function() {
        return messages_1.NotificationType0;
      } });
      Object.defineProperty(exports, "NotificationType1", { enumerable: true, get: function() {
        return messages_1.NotificationType1;
      } });
      Object.defineProperty(exports, "NotificationType2", { enumerable: true, get: function() {
        return messages_1.NotificationType2;
      } });
      Object.defineProperty(exports, "NotificationType3", { enumerable: true, get: function() {
        return messages_1.NotificationType3;
      } });
      Object.defineProperty(exports, "NotificationType4", { enumerable: true, get: function() {
        return messages_1.NotificationType4;
      } });
      Object.defineProperty(exports, "NotificationType5", { enumerable: true, get: function() {
        return messages_1.NotificationType5;
      } });
      Object.defineProperty(exports, "NotificationType6", { enumerable: true, get: function() {
        return messages_1.NotificationType6;
      } });
      Object.defineProperty(exports, "NotificationType7", { enumerable: true, get: function() {
        return messages_1.NotificationType7;
      } });
      Object.defineProperty(exports, "NotificationType8", { enumerable: true, get: function() {
        return messages_1.NotificationType8;
      } });
      Object.defineProperty(exports, "NotificationType9", { enumerable: true, get: function() {
        return messages_1.NotificationType9;
      } });
      Object.defineProperty(exports, "ParameterStructures", { enumerable: true, get: function() {
        return messages_1.ParameterStructures;
      } });
      var linkedMap_1 = require_linkedMap();
      Object.defineProperty(exports, "LinkedMap", { enumerable: true, get: function() {
        return linkedMap_1.LinkedMap;
      } });
      Object.defineProperty(exports, "LRUCache", { enumerable: true, get: function() {
        return linkedMap_1.LRUCache;
      } });
      Object.defineProperty(exports, "Touch", { enumerable: true, get: function() {
        return linkedMap_1.Touch;
      } });
      var disposable_1 = require_disposable();
      Object.defineProperty(exports, "Disposable", { enumerable: true, get: function() {
        return disposable_1.Disposable;
      } });
      var events_1 = require_events();
      Object.defineProperty(exports, "Event", { enumerable: true, get: function() {
        return events_1.Event;
      } });
      Object.defineProperty(exports, "Emitter", { enumerable: true, get: function() {
        return events_1.Emitter;
      } });
      var cancellation_1 = require_cancellation();
      Object.defineProperty(exports, "CancellationTokenSource", { enumerable: true, get: function() {
        return cancellation_1.CancellationTokenSource;
      } });
      Object.defineProperty(exports, "CancellationToken", { enumerable: true, get: function() {
        return cancellation_1.CancellationToken;
      } });
      var messageReader_1 = require_messageReader();
      Object.defineProperty(exports, "MessageReader", { enumerable: true, get: function() {
        return messageReader_1.MessageReader;
      } });
      Object.defineProperty(exports, "AbstractMessageReader", { enumerable: true, get: function() {
        return messageReader_1.AbstractMessageReader;
      } });
      Object.defineProperty(exports, "ReadableStreamMessageReader", { enumerable: true, get: function() {
        return messageReader_1.ReadableStreamMessageReader;
      } });
      var messageWriter_1 = require_messageWriter();
      Object.defineProperty(exports, "MessageWriter", { enumerable: true, get: function() {
        return messageWriter_1.MessageWriter;
      } });
      Object.defineProperty(exports, "AbstractMessageWriter", { enumerable: true, get: function() {
        return messageWriter_1.AbstractMessageWriter;
      } });
      Object.defineProperty(exports, "WriteableStreamMessageWriter", { enumerable: true, get: function() {
        return messageWriter_1.WriteableStreamMessageWriter;
      } });
      var connection_1 = require_connection();
      Object.defineProperty(exports, "ConnectionStrategy", { enumerable: true, get: function() {
        return connection_1.ConnectionStrategy;
      } });
      Object.defineProperty(exports, "ConnectionOptions", { enumerable: true, get: function() {
        return connection_1.ConnectionOptions;
      } });
      Object.defineProperty(exports, "NullLogger", { enumerable: true, get: function() {
        return connection_1.NullLogger;
      } });
      Object.defineProperty(exports, "createMessageConnection", { enumerable: true, get: function() {
        return connection_1.createMessageConnection;
      } });
      Object.defineProperty(exports, "ProgressToken", { enumerable: true, get: function() {
        return connection_1.ProgressToken;
      } });
      Object.defineProperty(exports, "ProgressType", { enumerable: true, get: function() {
        return connection_1.ProgressType;
      } });
      Object.defineProperty(exports, "Trace", { enumerable: true, get: function() {
        return connection_1.Trace;
      } });
      Object.defineProperty(exports, "TraceFormat", { enumerable: true, get: function() {
        return connection_1.TraceFormat;
      } });
      Object.defineProperty(exports, "SetTraceNotification", { enumerable: true, get: function() {
        return connection_1.SetTraceNotification;
      } });
      Object.defineProperty(exports, "LogTraceNotification", { enumerable: true, get: function() {
        return connection_1.LogTraceNotification;
      } });
      Object.defineProperty(exports, "ConnectionErrors", { enumerable: true, get: function() {
        return connection_1.ConnectionErrors;
      } });
      Object.defineProperty(exports, "ConnectionError", { enumerable: true, get: function() {
        return connection_1.ConnectionError;
      } });
      Object.defineProperty(exports, "CancellationReceiverStrategy", { enumerable: true, get: function() {
        return connection_1.CancellationReceiverStrategy;
      } });
      Object.defineProperty(exports, "CancellationSenderStrategy", { enumerable: true, get: function() {
        return connection_1.CancellationSenderStrategy;
      } });
      Object.defineProperty(exports, "CancellationStrategy", { enumerable: true, get: function() {
        return connection_1.CancellationStrategy;
      } });
      var ral_1 = require_ral();
      exports.RAL = ral_1.default;
    }
  });

  // server/node_modules/vscode-jsonrpc/lib/browser/main.js
  var require_main = __commonJS({
    "server/node_modules/vscode-jsonrpc/lib/browser/main.js"(exports) {
      init_define_process();
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createMessageConnection = exports.BrowserMessageWriter = exports.BrowserMessageReader = void 0;
      var ril_1 = require_ril();
      ril_1.default.install();
      var api_1 = require_api();
      __exportStar(require_api(), exports);
      var BrowserMessageReader = class extends api_1.AbstractMessageReader {
        constructor(context) {
          super();
          this._onData = new api_1.Emitter();
          this._messageListener = (event) => {
            this._onData.fire(event.data);
          };
          context.addEventListener("error", (event) => this.fireError(event));
          context.onmessage = this._messageListener;
        }
        listen(callback) {
          return this._onData.event(callback);
        }
      };
      exports.BrowserMessageReader = BrowserMessageReader;
      var BrowserMessageWriter = class extends api_1.AbstractMessageWriter {
        constructor(context) {
          super();
          this.context = context;
          this.errorCount = 0;
          context.addEventListener("error", (event) => this.fireError(event));
        }
        write(msg) {
          try {
            this.context.postMessage(msg);
            return Promise.resolve();
          } catch (error) {
            this.handleError(error, msg);
            return Promise.reject(error);
          }
        }
        handleError(error, msg) {
          this.errorCount++;
          this.fireError(error, msg, this.errorCount);
        }
        end() {
        }
      };
      exports.BrowserMessageWriter = BrowserMessageWriter;
      function createMessageConnection(reader, writer, logger, options) {
        if (logger === void 0) {
          logger = api_1.NullLogger;
        }
        if (api_1.ConnectionStrategy.is(options)) {
          options = { connectionStrategy: options };
        }
        return (0, api_1.createMessageConnection)(reader, writer, logger, options);
      }
      exports.createMessageConnection = createMessageConnection;
    }
  });

  // server/node_modules/vscode-jsonrpc/browser.js
  var require_browser = __commonJS({
    "server/node_modules/vscode-jsonrpc/browser.js"(exports, module) {
      init_define_process();
      "use strict";
      module.exports = require_main();
    }
  });

  // server/node_modules/vscode-languageserver-types/lib/umd/main.js
  var require_main2 = __commonJS({
    "server/node_modules/vscode-languageserver-types/lib/umd/main.js"(exports, module) {
      init_define_process();
      (function(factory) {
        if (typeof module === "object" && typeof module.exports === "object") {
          var v = factory(__require, exports);
          if (v !== void 0)
            module.exports = v;
        } else if (typeof define === "function" && define.amd) {
          define(["require", "exports"], factory);
        }
      })(function(require2, exports2) {
        "use strict";
        Object.defineProperty(exports2, "__esModule", { value: true });
        exports2.TextDocument = exports2.EOL = exports2.InlineValuesContext = exports2.InlineValueEvaluatableExpression = exports2.InlineValueVariableLookup = exports2.InlineValueText = exports2.SemanticTokens = exports2.SemanticTokenModifiers = exports2.SemanticTokenTypes = exports2.SelectionRange = exports2.DocumentLink = exports2.FormattingOptions = exports2.CodeLens = exports2.CodeAction = exports2.CodeActionContext = exports2.CodeActionTriggerKind = exports2.CodeActionKind = exports2.DocumentSymbol = exports2.WorkspaceSymbol = exports2.SymbolInformation = exports2.SymbolTag = exports2.SymbolKind = exports2.DocumentHighlight = exports2.DocumentHighlightKind = exports2.SignatureInformation = exports2.ParameterInformation = exports2.Hover = exports2.MarkedString = exports2.CompletionList = exports2.CompletionItem = exports2.CompletionItemLabelDetails = exports2.InsertTextMode = exports2.InsertReplaceEdit = exports2.CompletionItemTag = exports2.InsertTextFormat = exports2.CompletionItemKind = exports2.MarkupContent = exports2.MarkupKind = exports2.TextDocumentItem = exports2.OptionalVersionedTextDocumentIdentifier = exports2.VersionedTextDocumentIdentifier = exports2.TextDocumentIdentifier = exports2.WorkspaceChange = exports2.WorkspaceEdit = exports2.DeleteFile = exports2.RenameFile = exports2.CreateFile = exports2.TextDocumentEdit = exports2.AnnotatedTextEdit = exports2.ChangeAnnotationIdentifier = exports2.ChangeAnnotation = exports2.TextEdit = exports2.Command = exports2.Diagnostic = exports2.CodeDescription = exports2.DiagnosticTag = exports2.DiagnosticSeverity = exports2.DiagnosticRelatedInformation = exports2.FoldingRange = exports2.FoldingRangeKind = exports2.ColorPresentation = exports2.ColorInformation = exports2.Color = exports2.LocationLink = exports2.Location = exports2.Range = exports2.Position = exports2.uinteger = exports2.integer = void 0;
        var integer;
        (function(integer2) {
          integer2.MIN_VALUE = -2147483648;
          integer2.MAX_VALUE = 2147483647;
        })(integer = exports2.integer || (exports2.integer = {}));
        var uinteger;
        (function(uinteger2) {
          uinteger2.MIN_VALUE = 0;
          uinteger2.MAX_VALUE = 2147483647;
        })(uinteger = exports2.uinteger || (exports2.uinteger = {}));
        var Position;
        (function(Position2) {
          function create(line, character) {
            if (line === Number.MAX_VALUE) {
              line = uinteger.MAX_VALUE;
            }
            if (character === Number.MAX_VALUE) {
              character = uinteger.MAX_VALUE;
            }
            return { line, character };
          }
          Position2.create = create;
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Is.uinteger(candidate.line) && Is.uinteger(candidate.character);
          }
          Position2.is = is;
        })(Position = exports2.Position || (exports2.Position = {}));
        var Range3;
        (function(Range4) {
          function create(one, two, three, four) {
            if (Is.uinteger(one) && Is.uinteger(two) && Is.uinteger(three) && Is.uinteger(four)) {
              return { start: Position.create(one, two), end: Position.create(three, four) };
            } else if (Position.is(one) && Position.is(two)) {
              return { start: one, end: two };
            } else {
              throw new Error("Range#create called with invalid arguments[".concat(one, ", ").concat(two, ", ").concat(three, ", ").concat(four, "]"));
            }
          }
          Range4.create = create;
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Position.is(candidate.start) && Position.is(candidate.end);
          }
          Range4.is = is;
        })(Range3 = exports2.Range || (exports2.Range = {}));
        var Location;
        (function(Location2) {
          function create(uri, range) {
            return { uri, range };
          }
          Location2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range3.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
          }
          Location2.is = is;
        })(Location = exports2.Location || (exports2.Location = {}));
        var LocationLink;
        (function(LocationLink2) {
          function create(targetUri, targetRange, targetSelectionRange, originSelectionRange) {
            return { targetUri, targetRange, targetSelectionRange, originSelectionRange };
          }
          LocationLink2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range3.is(candidate.targetRange) && Is.string(candidate.targetUri) && Range3.is(candidate.targetSelectionRange) && (Range3.is(candidate.originSelectionRange) || Is.undefined(candidate.originSelectionRange));
          }
          LocationLink2.is = is;
        })(LocationLink = exports2.LocationLink || (exports2.LocationLink = {}));
        var Color;
        (function(Color2) {
          function create(red, green, blue, alpha) {
            return {
              red,
              green,
              blue,
              alpha
            };
          }
          Color2.create = create;
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Is.numberRange(candidate.red, 0, 1) && Is.numberRange(candidate.green, 0, 1) && Is.numberRange(candidate.blue, 0, 1) && Is.numberRange(candidate.alpha, 0, 1);
          }
          Color2.is = is;
        })(Color = exports2.Color || (exports2.Color = {}));
        var ColorInformation;
        (function(ColorInformation2) {
          function create(range, color) {
            return {
              range,
              color
            };
          }
          ColorInformation2.create = create;
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Range3.is(candidate.range) && Color.is(candidate.color);
          }
          ColorInformation2.is = is;
        })(ColorInformation = exports2.ColorInformation || (exports2.ColorInformation = {}));
        var ColorPresentation;
        (function(ColorPresentation2) {
          function create(label, textEdit, additionalTextEdits) {
            return {
              label,
              textEdit,
              additionalTextEdits
            };
          }
          ColorPresentation2.create = create;
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.undefined(candidate.textEdit) || TextEdit.is(candidate)) && (Is.undefined(candidate.additionalTextEdits) || Is.typedArray(candidate.additionalTextEdits, TextEdit.is));
          }
          ColorPresentation2.is = is;
        })(ColorPresentation = exports2.ColorPresentation || (exports2.ColorPresentation = {}));
        var FoldingRangeKind;
        (function(FoldingRangeKind2) {
          FoldingRangeKind2["Comment"] = "comment";
          FoldingRangeKind2["Imports"] = "imports";
          FoldingRangeKind2["Region"] = "region";
        })(FoldingRangeKind = exports2.FoldingRangeKind || (exports2.FoldingRangeKind = {}));
        var FoldingRange;
        (function(FoldingRange2) {
          function create(startLine, endLine, startCharacter, endCharacter, kind) {
            var result = {
              startLine,
              endLine
            };
            if (Is.defined(startCharacter)) {
              result.startCharacter = startCharacter;
            }
            if (Is.defined(endCharacter)) {
              result.endCharacter = endCharacter;
            }
            if (Is.defined(kind)) {
              result.kind = kind;
            }
            return result;
          }
          FoldingRange2.create = create;
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Is.uinteger(candidate.startLine) && Is.uinteger(candidate.startLine) && (Is.undefined(candidate.startCharacter) || Is.uinteger(candidate.startCharacter)) && (Is.undefined(candidate.endCharacter) || Is.uinteger(candidate.endCharacter)) && (Is.undefined(candidate.kind) || Is.string(candidate.kind));
          }
          FoldingRange2.is = is;
        })(FoldingRange = exports2.FoldingRange || (exports2.FoldingRange = {}));
        var DiagnosticRelatedInformation;
        (function(DiagnosticRelatedInformation2) {
          function create(location, message) {
            return {
              location,
              message
            };
          }
          DiagnosticRelatedInformation2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Location.is(candidate.location) && Is.string(candidate.message);
          }
          DiagnosticRelatedInformation2.is = is;
        })(DiagnosticRelatedInformation = exports2.DiagnosticRelatedInformation || (exports2.DiagnosticRelatedInformation = {}));
        var DiagnosticSeverity;
        (function(DiagnosticSeverity2) {
          DiagnosticSeverity2.Error = 1;
          DiagnosticSeverity2.Warning = 2;
          DiagnosticSeverity2.Information = 3;
          DiagnosticSeverity2.Hint = 4;
        })(DiagnosticSeverity = exports2.DiagnosticSeverity || (exports2.DiagnosticSeverity = {}));
        var DiagnosticTag;
        (function(DiagnosticTag2) {
          DiagnosticTag2.Unnecessary = 1;
          DiagnosticTag2.Deprecated = 2;
        })(DiagnosticTag = exports2.DiagnosticTag || (exports2.DiagnosticTag = {}));
        var CodeDescription;
        (function(CodeDescription2) {
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Is.string(candidate.href);
          }
          CodeDescription2.is = is;
        })(CodeDescription = exports2.CodeDescription || (exports2.CodeDescription = {}));
        var Diagnostic;
        (function(Diagnostic2) {
          function create(range, message, severity, code, source, relatedInformation) {
            var result = { range, message };
            if (Is.defined(severity)) {
              result.severity = severity;
            }
            if (Is.defined(code)) {
              result.code = code;
            }
            if (Is.defined(source)) {
              result.source = source;
            }
            if (Is.defined(relatedInformation)) {
              result.relatedInformation = relatedInformation;
            }
            return result;
          }
          Diagnostic2.create = create;
          function is(value) {
            var _a;
            var candidate = value;
            return Is.defined(candidate) && Range3.is(candidate.range) && Is.string(candidate.message) && (Is.number(candidate.severity) || Is.undefined(candidate.severity)) && (Is.integer(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code)) && (Is.undefined(candidate.codeDescription) || Is.string((_a = candidate.codeDescription) === null || _a === void 0 ? void 0 : _a.href)) && (Is.string(candidate.source) || Is.undefined(candidate.source)) && (Is.undefined(candidate.relatedInformation) || Is.typedArray(candidate.relatedInformation, DiagnosticRelatedInformation.is));
          }
          Diagnostic2.is = is;
        })(Diagnostic = exports2.Diagnostic || (exports2.Diagnostic = {}));
        var Command;
        (function(Command2) {
          function create(title, command) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
              args[_i - 2] = arguments[_i];
            }
            var result = { title, command };
            if (Is.defined(args) && args.length > 0) {
              result.arguments = args;
            }
            return result;
          }
          Command2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.command);
          }
          Command2.is = is;
        })(Command = exports2.Command || (exports2.Command = {}));
        var TextEdit;
        (function(TextEdit2) {
          function replace(range, newText) {
            return { range, newText };
          }
          TextEdit2.replace = replace;
          function insert(position, newText) {
            return { range: { start: position, end: position }, newText };
          }
          TextEdit2.insert = insert;
          function del(range) {
            return { range, newText: "" };
          }
          TextEdit2.del = del;
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Is.string(candidate.newText) && Range3.is(candidate.range);
          }
          TextEdit2.is = is;
        })(TextEdit = exports2.TextEdit || (exports2.TextEdit = {}));
        var ChangeAnnotation;
        (function(ChangeAnnotation2) {
          function create(label, needsConfirmation, description) {
            var result = { label };
            if (needsConfirmation !== void 0) {
              result.needsConfirmation = needsConfirmation;
            }
            if (description !== void 0) {
              result.description = description;
            }
            return result;
          }
          ChangeAnnotation2.create = create;
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.boolean(candidate.needsConfirmation) || candidate.needsConfirmation === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
          }
          ChangeAnnotation2.is = is;
        })(ChangeAnnotation = exports2.ChangeAnnotation || (exports2.ChangeAnnotation = {}));
        var ChangeAnnotationIdentifier;
        (function(ChangeAnnotationIdentifier2) {
          function is(value) {
            var candidate = value;
            return Is.string(candidate);
          }
          ChangeAnnotationIdentifier2.is = is;
        })(ChangeAnnotationIdentifier = exports2.ChangeAnnotationIdentifier || (exports2.ChangeAnnotationIdentifier = {}));
        var AnnotatedTextEdit;
        (function(AnnotatedTextEdit2) {
          function replace(range, newText, annotation) {
            return { range, newText, annotationId: annotation };
          }
          AnnotatedTextEdit2.replace = replace;
          function insert(position, newText, annotation) {
            return { range: { start: position, end: position }, newText, annotationId: annotation };
          }
          AnnotatedTextEdit2.insert = insert;
          function del(range, annotation) {
            return { range, newText: "", annotationId: annotation };
          }
          AnnotatedTextEdit2.del = del;
          function is(value) {
            var candidate = value;
            return TextEdit.is(candidate) && (ChangeAnnotation.is(candidate.annotationId) || ChangeAnnotationIdentifier.is(candidate.annotationId));
          }
          AnnotatedTextEdit2.is = is;
        })(AnnotatedTextEdit = exports2.AnnotatedTextEdit || (exports2.AnnotatedTextEdit = {}));
        var TextDocumentEdit;
        (function(TextDocumentEdit2) {
          function create(textDocument, edits) {
            return { textDocument, edits };
          }
          TextDocumentEdit2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && OptionalVersionedTextDocumentIdentifier.is(candidate.textDocument) && Array.isArray(candidate.edits);
          }
          TextDocumentEdit2.is = is;
        })(TextDocumentEdit = exports2.TextDocumentEdit || (exports2.TextDocumentEdit = {}));
        var CreateFile;
        (function(CreateFile2) {
          function create(uri, options, annotation) {
            var result = {
              kind: "create",
              uri
            };
            if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
              result.options = options;
            }
            if (annotation !== void 0) {
              result.annotationId = annotation;
            }
            return result;
          }
          CreateFile2.create = create;
          function is(value) {
            var candidate = value;
            return candidate && candidate.kind === "create" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
          }
          CreateFile2.is = is;
        })(CreateFile = exports2.CreateFile || (exports2.CreateFile = {}));
        var RenameFile;
        (function(RenameFile2) {
          function create(oldUri, newUri, options, annotation) {
            var result = {
              kind: "rename",
              oldUri,
              newUri
            };
            if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
              result.options = options;
            }
            if (annotation !== void 0) {
              result.annotationId = annotation;
            }
            return result;
          }
          RenameFile2.create = create;
          function is(value) {
            var candidate = value;
            return candidate && candidate.kind === "rename" && Is.string(candidate.oldUri) && Is.string(candidate.newUri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
          }
          RenameFile2.is = is;
        })(RenameFile = exports2.RenameFile || (exports2.RenameFile = {}));
        var DeleteFile;
        (function(DeleteFile2) {
          function create(uri, options, annotation) {
            var result = {
              kind: "delete",
              uri
            };
            if (options !== void 0 && (options.recursive !== void 0 || options.ignoreIfNotExists !== void 0)) {
              result.options = options;
            }
            if (annotation !== void 0) {
              result.annotationId = annotation;
            }
            return result;
          }
          DeleteFile2.create = create;
          function is(value) {
            var candidate = value;
            return candidate && candidate.kind === "delete" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.recursive === void 0 || Is.boolean(candidate.options.recursive)) && (candidate.options.ignoreIfNotExists === void 0 || Is.boolean(candidate.options.ignoreIfNotExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
          }
          DeleteFile2.is = is;
        })(DeleteFile = exports2.DeleteFile || (exports2.DeleteFile = {}));
        var WorkspaceEdit;
        (function(WorkspaceEdit2) {
          function is(value) {
            var candidate = value;
            return candidate && (candidate.changes !== void 0 || candidate.documentChanges !== void 0) && (candidate.documentChanges === void 0 || candidate.documentChanges.every(function(change) {
              if (Is.string(change.kind)) {
                return CreateFile.is(change) || RenameFile.is(change) || DeleteFile.is(change);
              } else {
                return TextDocumentEdit.is(change);
              }
            }));
          }
          WorkspaceEdit2.is = is;
        })(WorkspaceEdit = exports2.WorkspaceEdit || (exports2.WorkspaceEdit = {}));
        var TextEditChangeImpl = function() {
          function TextEditChangeImpl2(edits, changeAnnotations) {
            this.edits = edits;
            this.changeAnnotations = changeAnnotations;
          }
          TextEditChangeImpl2.prototype.insert = function(position, newText, annotation) {
            var edit;
            var id;
            if (annotation === void 0) {
              edit = TextEdit.insert(position, newText);
            } else if (ChangeAnnotationIdentifier.is(annotation)) {
              id = annotation;
              edit = AnnotatedTextEdit.insert(position, newText, annotation);
            } else {
              this.assertChangeAnnotations(this.changeAnnotations);
              id = this.changeAnnotations.manage(annotation);
              edit = AnnotatedTextEdit.insert(position, newText, id);
            }
            this.edits.push(edit);
            if (id !== void 0) {
              return id;
            }
          };
          TextEditChangeImpl2.prototype.replace = function(range, newText, annotation) {
            var edit;
            var id;
            if (annotation === void 0) {
              edit = TextEdit.replace(range, newText);
            } else if (ChangeAnnotationIdentifier.is(annotation)) {
              id = annotation;
              edit = AnnotatedTextEdit.replace(range, newText, annotation);
            } else {
              this.assertChangeAnnotations(this.changeAnnotations);
              id = this.changeAnnotations.manage(annotation);
              edit = AnnotatedTextEdit.replace(range, newText, id);
            }
            this.edits.push(edit);
            if (id !== void 0) {
              return id;
            }
          };
          TextEditChangeImpl2.prototype.delete = function(range, annotation) {
            var edit;
            var id;
            if (annotation === void 0) {
              edit = TextEdit.del(range);
            } else if (ChangeAnnotationIdentifier.is(annotation)) {
              id = annotation;
              edit = AnnotatedTextEdit.del(range, annotation);
            } else {
              this.assertChangeAnnotations(this.changeAnnotations);
              id = this.changeAnnotations.manage(annotation);
              edit = AnnotatedTextEdit.del(range, id);
            }
            this.edits.push(edit);
            if (id !== void 0) {
              return id;
            }
          };
          TextEditChangeImpl2.prototype.add = function(edit) {
            this.edits.push(edit);
          };
          TextEditChangeImpl2.prototype.all = function() {
            return this.edits;
          };
          TextEditChangeImpl2.prototype.clear = function() {
            this.edits.splice(0, this.edits.length);
          };
          TextEditChangeImpl2.prototype.assertChangeAnnotations = function(value) {
            if (value === void 0) {
              throw new Error("Text edit change is not configured to manage change annotations.");
            }
          };
          return TextEditChangeImpl2;
        }();
        var ChangeAnnotations = function() {
          function ChangeAnnotations2(annotations) {
            this._annotations = annotations === void 0 ? Object.create(null) : annotations;
            this._counter = 0;
            this._size = 0;
          }
          ChangeAnnotations2.prototype.all = function() {
            return this._annotations;
          };
          Object.defineProperty(ChangeAnnotations2.prototype, "size", {
            get: function() {
              return this._size;
            },
            enumerable: false,
            configurable: true
          });
          ChangeAnnotations2.prototype.manage = function(idOrAnnotation, annotation) {
            var id;
            if (ChangeAnnotationIdentifier.is(idOrAnnotation)) {
              id = idOrAnnotation;
            } else {
              id = this.nextId();
              annotation = idOrAnnotation;
            }
            if (this._annotations[id] !== void 0) {
              throw new Error("Id ".concat(id, " is already in use."));
            }
            if (annotation === void 0) {
              throw new Error("No annotation provided for id ".concat(id));
            }
            this._annotations[id] = annotation;
            this._size++;
            return id;
          };
          ChangeAnnotations2.prototype.nextId = function() {
            this._counter++;
            return this._counter.toString();
          };
          return ChangeAnnotations2;
        }();
        var WorkspaceChange = function() {
          function WorkspaceChange2(workspaceEdit) {
            var _this = this;
            this._textEditChanges = Object.create(null);
            if (workspaceEdit !== void 0) {
              this._workspaceEdit = workspaceEdit;
              if (workspaceEdit.documentChanges) {
                this._changeAnnotations = new ChangeAnnotations(workspaceEdit.changeAnnotations);
                workspaceEdit.changeAnnotations = this._changeAnnotations.all();
                workspaceEdit.documentChanges.forEach(function(change) {
                  if (TextDocumentEdit.is(change)) {
                    var textEditChange = new TextEditChangeImpl(change.edits, _this._changeAnnotations);
                    _this._textEditChanges[change.textDocument.uri] = textEditChange;
                  }
                });
              } else if (workspaceEdit.changes) {
                Object.keys(workspaceEdit.changes).forEach(function(key) {
                  var textEditChange = new TextEditChangeImpl(workspaceEdit.changes[key]);
                  _this._textEditChanges[key] = textEditChange;
                });
              }
            } else {
              this._workspaceEdit = {};
            }
          }
          Object.defineProperty(WorkspaceChange2.prototype, "edit", {
            get: function() {
              this.initDocumentChanges();
              if (this._changeAnnotations !== void 0) {
                if (this._changeAnnotations.size === 0) {
                  this._workspaceEdit.changeAnnotations = void 0;
                } else {
                  this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
                }
              }
              return this._workspaceEdit;
            },
            enumerable: false,
            configurable: true
          });
          WorkspaceChange2.prototype.getTextEditChange = function(key) {
            if (OptionalVersionedTextDocumentIdentifier.is(key)) {
              this.initDocumentChanges();
              if (this._workspaceEdit.documentChanges === void 0) {
                throw new Error("Workspace edit is not configured for document changes.");
              }
              var textDocument = { uri: key.uri, version: key.version };
              var result = this._textEditChanges[textDocument.uri];
              if (!result) {
                var edits = [];
                var textDocumentEdit = {
                  textDocument,
                  edits
                };
                this._workspaceEdit.documentChanges.push(textDocumentEdit);
                result = new TextEditChangeImpl(edits, this._changeAnnotations);
                this._textEditChanges[textDocument.uri] = result;
              }
              return result;
            } else {
              this.initChanges();
              if (this._workspaceEdit.changes === void 0) {
                throw new Error("Workspace edit is not configured for normal text edit changes.");
              }
              var result = this._textEditChanges[key];
              if (!result) {
                var edits = [];
                this._workspaceEdit.changes[key] = edits;
                result = new TextEditChangeImpl(edits);
                this._textEditChanges[key] = result;
              }
              return result;
            }
          };
          WorkspaceChange2.prototype.initDocumentChanges = function() {
            if (this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0) {
              this._changeAnnotations = new ChangeAnnotations();
              this._workspaceEdit.documentChanges = [];
              this._workspaceEdit.changeAnnotations = this._changeAnnotations.all();
            }
          };
          WorkspaceChange2.prototype.initChanges = function() {
            if (this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0) {
              this._workspaceEdit.changes = Object.create(null);
            }
          };
          WorkspaceChange2.prototype.createFile = function(uri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === void 0) {
              throw new Error("Workspace edit is not configured for document changes.");
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
              annotation = optionsOrAnnotation;
            } else {
              options = optionsOrAnnotation;
            }
            var operation;
            var id;
            if (annotation === void 0) {
              operation = CreateFile.create(uri, options);
            } else {
              id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
              operation = CreateFile.create(uri, options, id);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id !== void 0) {
              return id;
            }
          };
          WorkspaceChange2.prototype.renameFile = function(oldUri, newUri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === void 0) {
              throw new Error("Workspace edit is not configured for document changes.");
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
              annotation = optionsOrAnnotation;
            } else {
              options = optionsOrAnnotation;
            }
            var operation;
            var id;
            if (annotation === void 0) {
              operation = RenameFile.create(oldUri, newUri, options);
            } else {
              id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
              operation = RenameFile.create(oldUri, newUri, options, id);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id !== void 0) {
              return id;
            }
          };
          WorkspaceChange2.prototype.deleteFile = function(uri, optionsOrAnnotation, options) {
            this.initDocumentChanges();
            if (this._workspaceEdit.documentChanges === void 0) {
              throw new Error("Workspace edit is not configured for document changes.");
            }
            var annotation;
            if (ChangeAnnotation.is(optionsOrAnnotation) || ChangeAnnotationIdentifier.is(optionsOrAnnotation)) {
              annotation = optionsOrAnnotation;
            } else {
              options = optionsOrAnnotation;
            }
            var operation;
            var id;
            if (annotation === void 0) {
              operation = DeleteFile.create(uri, options);
            } else {
              id = ChangeAnnotationIdentifier.is(annotation) ? annotation : this._changeAnnotations.manage(annotation);
              operation = DeleteFile.create(uri, options, id);
            }
            this._workspaceEdit.documentChanges.push(operation);
            if (id !== void 0) {
              return id;
            }
          };
          return WorkspaceChange2;
        }();
        exports2.WorkspaceChange = WorkspaceChange;
        var TextDocumentIdentifier;
        (function(TextDocumentIdentifier2) {
          function create(uri) {
            return { uri };
          }
          TextDocumentIdentifier2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri);
          }
          TextDocumentIdentifier2.is = is;
        })(TextDocumentIdentifier = exports2.TextDocumentIdentifier || (exports2.TextDocumentIdentifier = {}));
        var VersionedTextDocumentIdentifier;
        (function(VersionedTextDocumentIdentifier2) {
          function create(uri, version) {
            return { uri, version };
          }
          VersionedTextDocumentIdentifier2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && Is.integer(candidate.version);
          }
          VersionedTextDocumentIdentifier2.is = is;
        })(VersionedTextDocumentIdentifier = exports2.VersionedTextDocumentIdentifier || (exports2.VersionedTextDocumentIdentifier = {}));
        var OptionalVersionedTextDocumentIdentifier;
        (function(OptionalVersionedTextDocumentIdentifier2) {
          function create(uri, version) {
            return { uri, version };
          }
          OptionalVersionedTextDocumentIdentifier2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && (candidate.version === null || Is.integer(candidate.version));
          }
          OptionalVersionedTextDocumentIdentifier2.is = is;
        })(OptionalVersionedTextDocumentIdentifier = exports2.OptionalVersionedTextDocumentIdentifier || (exports2.OptionalVersionedTextDocumentIdentifier = {}));
        var TextDocumentItem;
        (function(TextDocumentItem2) {
          function create(uri, languageId, version, text) {
            return { uri, languageId, version, text };
          }
          TextDocumentItem2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.integer(candidate.version) && Is.string(candidate.text);
          }
          TextDocumentItem2.is = is;
        })(TextDocumentItem = exports2.TextDocumentItem || (exports2.TextDocumentItem = {}));
        var MarkupKind;
        (function(MarkupKind2) {
          MarkupKind2.PlainText = "plaintext";
          MarkupKind2.Markdown = "markdown";
        })(MarkupKind = exports2.MarkupKind || (exports2.MarkupKind = {}));
        (function(MarkupKind2) {
          function is(value) {
            var candidate = value;
            return candidate === MarkupKind2.PlainText || candidate === MarkupKind2.Markdown;
          }
          MarkupKind2.is = is;
        })(MarkupKind = exports2.MarkupKind || (exports2.MarkupKind = {}));
        var MarkupContent;
        (function(MarkupContent2) {
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(value) && MarkupKind.is(candidate.kind) && Is.string(candidate.value);
          }
          MarkupContent2.is = is;
        })(MarkupContent = exports2.MarkupContent || (exports2.MarkupContent = {}));
        var CompletionItemKind;
        (function(CompletionItemKind2) {
          CompletionItemKind2.Text = 1;
          CompletionItemKind2.Method = 2;
          CompletionItemKind2.Function = 3;
          CompletionItemKind2.Constructor = 4;
          CompletionItemKind2.Field = 5;
          CompletionItemKind2.Variable = 6;
          CompletionItemKind2.Class = 7;
          CompletionItemKind2.Interface = 8;
          CompletionItemKind2.Module = 9;
          CompletionItemKind2.Property = 10;
          CompletionItemKind2.Unit = 11;
          CompletionItemKind2.Value = 12;
          CompletionItemKind2.Enum = 13;
          CompletionItemKind2.Keyword = 14;
          CompletionItemKind2.Snippet = 15;
          CompletionItemKind2.Color = 16;
          CompletionItemKind2.File = 17;
          CompletionItemKind2.Reference = 18;
          CompletionItemKind2.Folder = 19;
          CompletionItemKind2.EnumMember = 20;
          CompletionItemKind2.Constant = 21;
          CompletionItemKind2.Struct = 22;
          CompletionItemKind2.Event = 23;
          CompletionItemKind2.Operator = 24;
          CompletionItemKind2.TypeParameter = 25;
        })(CompletionItemKind = exports2.CompletionItemKind || (exports2.CompletionItemKind = {}));
        var InsertTextFormat;
        (function(InsertTextFormat2) {
          InsertTextFormat2.PlainText = 1;
          InsertTextFormat2.Snippet = 2;
        })(InsertTextFormat = exports2.InsertTextFormat || (exports2.InsertTextFormat = {}));
        var CompletionItemTag;
        (function(CompletionItemTag2) {
          CompletionItemTag2.Deprecated = 1;
        })(CompletionItemTag = exports2.CompletionItemTag || (exports2.CompletionItemTag = {}));
        var InsertReplaceEdit;
        (function(InsertReplaceEdit2) {
          function create(newText, insert, replace) {
            return { newText, insert, replace };
          }
          InsertReplaceEdit2.create = create;
          function is(value) {
            var candidate = value;
            return candidate && Is.string(candidate.newText) && Range3.is(candidate.insert) && Range3.is(candidate.replace);
          }
          InsertReplaceEdit2.is = is;
        })(InsertReplaceEdit = exports2.InsertReplaceEdit || (exports2.InsertReplaceEdit = {}));
        var InsertTextMode;
        (function(InsertTextMode2) {
          InsertTextMode2.asIs = 1;
          InsertTextMode2.adjustIndentation = 2;
        })(InsertTextMode = exports2.InsertTextMode || (exports2.InsertTextMode = {}));
        var CompletionItemLabelDetails;
        (function(CompletionItemLabelDetails2) {
          function is(value) {
            var candidate = value;
            return candidate && (Is.string(candidate.detail) || candidate.detail === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
          }
          CompletionItemLabelDetails2.is = is;
        })(CompletionItemLabelDetails = exports2.CompletionItemLabelDetails || (exports2.CompletionItemLabelDetails = {}));
        var CompletionItem;
        (function(CompletionItem2) {
          function create(label) {
            return { label };
          }
          CompletionItem2.create = create;
        })(CompletionItem = exports2.CompletionItem || (exports2.CompletionItem = {}));
        var CompletionList;
        (function(CompletionList2) {
          function create(items, isIncomplete) {
            return { items: items ? items : [], isIncomplete: !!isIncomplete };
          }
          CompletionList2.create = create;
        })(CompletionList = exports2.CompletionList || (exports2.CompletionList = {}));
        var MarkedString;
        (function(MarkedString2) {
          function fromPlainText(plainText) {
            return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
          }
          MarkedString2.fromPlainText = fromPlainText;
          function is(value) {
            var candidate = value;
            return Is.string(candidate) || Is.objectLiteral(candidate) && Is.string(candidate.language) && Is.string(candidate.value);
          }
          MarkedString2.is = is;
        })(MarkedString = exports2.MarkedString || (exports2.MarkedString = {}));
        var Hover;
        (function(Hover2) {
          function is(value) {
            var candidate = value;
            return !!candidate && Is.objectLiteral(candidate) && (MarkupContent.is(candidate.contents) || MarkedString.is(candidate.contents) || Is.typedArray(candidate.contents, MarkedString.is)) && (value.range === void 0 || Range3.is(value.range));
          }
          Hover2.is = is;
        })(Hover = exports2.Hover || (exports2.Hover = {}));
        var ParameterInformation;
        (function(ParameterInformation2) {
          function create(label, documentation) {
            return documentation ? { label, documentation } : { label };
          }
          ParameterInformation2.create = create;
        })(ParameterInformation = exports2.ParameterInformation || (exports2.ParameterInformation = {}));
        var SignatureInformation;
        (function(SignatureInformation2) {
          function create(label, documentation) {
            var parameters = [];
            for (var _i = 2; _i < arguments.length; _i++) {
              parameters[_i - 2] = arguments[_i];
            }
            var result = { label };
            if (Is.defined(documentation)) {
              result.documentation = documentation;
            }
            if (Is.defined(parameters)) {
              result.parameters = parameters;
            } else {
              result.parameters = [];
            }
            return result;
          }
          SignatureInformation2.create = create;
        })(SignatureInformation = exports2.SignatureInformation || (exports2.SignatureInformation = {}));
        var DocumentHighlightKind2;
        (function(DocumentHighlightKind3) {
          DocumentHighlightKind3.Text = 1;
          DocumentHighlightKind3.Read = 2;
          DocumentHighlightKind3.Write = 3;
        })(DocumentHighlightKind2 = exports2.DocumentHighlightKind || (exports2.DocumentHighlightKind = {}));
        var DocumentHighlight2;
        (function(DocumentHighlight3) {
          function create(range, kind) {
            var result = { range };
            if (Is.number(kind)) {
              result.kind = kind;
            }
            return result;
          }
          DocumentHighlight3.create = create;
        })(DocumentHighlight2 = exports2.DocumentHighlight || (exports2.DocumentHighlight = {}));
        var SymbolKind2;
        (function(SymbolKind3) {
          SymbolKind3.File = 1;
          SymbolKind3.Module = 2;
          SymbolKind3.Namespace = 3;
          SymbolKind3.Package = 4;
          SymbolKind3.Class = 5;
          SymbolKind3.Method = 6;
          SymbolKind3.Property = 7;
          SymbolKind3.Field = 8;
          SymbolKind3.Constructor = 9;
          SymbolKind3.Enum = 10;
          SymbolKind3.Interface = 11;
          SymbolKind3.Function = 12;
          SymbolKind3.Variable = 13;
          SymbolKind3.Constant = 14;
          SymbolKind3.String = 15;
          SymbolKind3.Number = 16;
          SymbolKind3.Boolean = 17;
          SymbolKind3.Array = 18;
          SymbolKind3.Object = 19;
          SymbolKind3.Key = 20;
          SymbolKind3.Null = 21;
          SymbolKind3.EnumMember = 22;
          SymbolKind3.Struct = 23;
          SymbolKind3.Event = 24;
          SymbolKind3.Operator = 25;
          SymbolKind3.TypeParameter = 26;
        })(SymbolKind2 = exports2.SymbolKind || (exports2.SymbolKind = {}));
        var SymbolTag;
        (function(SymbolTag2) {
          SymbolTag2.Deprecated = 1;
        })(SymbolTag = exports2.SymbolTag || (exports2.SymbolTag = {}));
        var SymbolInformation;
        (function(SymbolInformation2) {
          function create(name, kind, range, uri, containerName) {
            var result = {
              name,
              kind,
              location: { uri, range }
            };
            if (containerName) {
              result.containerName = containerName;
            }
            return result;
          }
          SymbolInformation2.create = create;
        })(SymbolInformation = exports2.SymbolInformation || (exports2.SymbolInformation = {}));
        var WorkspaceSymbol;
        (function(WorkspaceSymbol2) {
          function create(name, kind, uri, range) {
            return range !== void 0 ? { name, kind, location: { uri, range } } : { name, kind, location: { uri } };
          }
          WorkspaceSymbol2.create = create;
        })(WorkspaceSymbol = exports2.WorkspaceSymbol || (exports2.WorkspaceSymbol = {}));
        var DocumentSymbol2;
        (function(DocumentSymbol3) {
          function create(name, detail, kind, range, selectionRange, children) {
            var result = {
              name,
              detail,
              kind,
              range,
              selectionRange
            };
            if (children !== void 0) {
              result.children = children;
            }
            return result;
          }
          DocumentSymbol3.create = create;
          function is(value) {
            var candidate = value;
            return candidate && Is.string(candidate.name) && Is.number(candidate.kind) && Range3.is(candidate.range) && Range3.is(candidate.selectionRange) && (candidate.detail === void 0 || Is.string(candidate.detail)) && (candidate.deprecated === void 0 || Is.boolean(candidate.deprecated)) && (candidate.children === void 0 || Array.isArray(candidate.children)) && (candidate.tags === void 0 || Array.isArray(candidate.tags));
          }
          DocumentSymbol3.is = is;
        })(DocumentSymbol2 = exports2.DocumentSymbol || (exports2.DocumentSymbol = {}));
        var CodeActionKind;
        (function(CodeActionKind2) {
          CodeActionKind2.Empty = "";
          CodeActionKind2.QuickFix = "quickfix";
          CodeActionKind2.Refactor = "refactor";
          CodeActionKind2.RefactorExtract = "refactor.extract";
          CodeActionKind2.RefactorInline = "refactor.inline";
          CodeActionKind2.RefactorRewrite = "refactor.rewrite";
          CodeActionKind2.Source = "source";
          CodeActionKind2.SourceOrganizeImports = "source.organizeImports";
          CodeActionKind2.SourceFixAll = "source.fixAll";
        })(CodeActionKind = exports2.CodeActionKind || (exports2.CodeActionKind = {}));
        var CodeActionTriggerKind;
        (function(CodeActionTriggerKind2) {
          CodeActionTriggerKind2.Invoked = 1;
          CodeActionTriggerKind2.Automatic = 2;
        })(CodeActionTriggerKind = exports2.CodeActionTriggerKind || (exports2.CodeActionTriggerKind = {}));
        var CodeActionContext;
        (function(CodeActionContext2) {
          function create(diagnostics, only, triggerKind) {
            var result = { diagnostics };
            if (only !== void 0 && only !== null) {
              result.only = only;
            }
            if (triggerKind !== void 0 && triggerKind !== null) {
              result.triggerKind = triggerKind;
            }
            return result;
          }
          CodeActionContext2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic.is) && (candidate.only === void 0 || Is.typedArray(candidate.only, Is.string)) && (candidate.triggerKind === void 0 || candidate.triggerKind === CodeActionTriggerKind.Invoked || candidate.triggerKind === CodeActionTriggerKind.Automatic);
          }
          CodeActionContext2.is = is;
        })(CodeActionContext = exports2.CodeActionContext || (exports2.CodeActionContext = {}));
        var CodeAction;
        (function(CodeAction2) {
          function create(title, kindOrCommandOrEdit, kind) {
            var result = { title };
            var checkKind = true;
            if (typeof kindOrCommandOrEdit === "string") {
              checkKind = false;
              result.kind = kindOrCommandOrEdit;
            } else if (Command.is(kindOrCommandOrEdit)) {
              result.command = kindOrCommandOrEdit;
            } else {
              result.edit = kindOrCommandOrEdit;
            }
            if (checkKind && kind !== void 0) {
              result.kind = kind;
            }
            return result;
          }
          CodeAction2.create = create;
          function is(value) {
            var candidate = value;
            return candidate && Is.string(candidate.title) && (candidate.diagnostics === void 0 || Is.typedArray(candidate.diagnostics, Diagnostic.is)) && (candidate.kind === void 0 || Is.string(candidate.kind)) && (candidate.edit !== void 0 || candidate.command !== void 0) && (candidate.command === void 0 || Command.is(candidate.command)) && (candidate.isPreferred === void 0 || Is.boolean(candidate.isPreferred)) && (candidate.edit === void 0 || WorkspaceEdit.is(candidate.edit));
          }
          CodeAction2.is = is;
        })(CodeAction = exports2.CodeAction || (exports2.CodeAction = {}));
        var CodeLens;
        (function(CodeLens2) {
          function create(range, data) {
            var result = { range };
            if (Is.defined(data)) {
              result.data = data;
            }
            return result;
          }
          CodeLens2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range3.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
          }
          CodeLens2.is = is;
        })(CodeLens = exports2.CodeLens || (exports2.CodeLens = {}));
        var FormattingOptions;
        (function(FormattingOptions2) {
          function create(tabSize, insertSpaces) {
            return { tabSize, insertSpaces };
          }
          FormattingOptions2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.uinteger(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
          }
          FormattingOptions2.is = is;
        })(FormattingOptions = exports2.FormattingOptions || (exports2.FormattingOptions = {}));
        var DocumentLink;
        (function(DocumentLink2) {
          function create(range, target, data) {
            return { range, target, data };
          }
          DocumentLink2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range3.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
          }
          DocumentLink2.is = is;
        })(DocumentLink = exports2.DocumentLink || (exports2.DocumentLink = {}));
        var SelectionRange;
        (function(SelectionRange2) {
          function create(range, parent) {
            return { range, parent };
          }
          SelectionRange2.create = create;
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && Range3.is(candidate.range) && (candidate.parent === void 0 || SelectionRange2.is(candidate.parent));
          }
          SelectionRange2.is = is;
        })(SelectionRange = exports2.SelectionRange || (exports2.SelectionRange = {}));
        var SemanticTokenTypes;
        (function(SemanticTokenTypes2) {
          SemanticTokenTypes2["namespace"] = "namespace";
          SemanticTokenTypes2["type"] = "type";
          SemanticTokenTypes2["class"] = "class";
          SemanticTokenTypes2["enum"] = "enum";
          SemanticTokenTypes2["interface"] = "interface";
          SemanticTokenTypes2["struct"] = "struct";
          SemanticTokenTypes2["typeParameter"] = "typeParameter";
          SemanticTokenTypes2["parameter"] = "parameter";
          SemanticTokenTypes2["variable"] = "variable";
          SemanticTokenTypes2["property"] = "property";
          SemanticTokenTypes2["enumMember"] = "enumMember";
          SemanticTokenTypes2["event"] = "event";
          SemanticTokenTypes2["function"] = "function";
          SemanticTokenTypes2["method"] = "method";
          SemanticTokenTypes2["macro"] = "macro";
          SemanticTokenTypes2["keyword"] = "keyword";
          SemanticTokenTypes2["modifier"] = "modifier";
          SemanticTokenTypes2["comment"] = "comment";
          SemanticTokenTypes2["string"] = "string";
          SemanticTokenTypes2["number"] = "number";
          SemanticTokenTypes2["regexp"] = "regexp";
          SemanticTokenTypes2["operator"] = "operator";
          SemanticTokenTypes2["decorator"] = "decorator";
        })(SemanticTokenTypes = exports2.SemanticTokenTypes || (exports2.SemanticTokenTypes = {}));
        var SemanticTokenModifiers;
        (function(SemanticTokenModifiers2) {
          SemanticTokenModifiers2["declaration"] = "declaration";
          SemanticTokenModifiers2["definition"] = "definition";
          SemanticTokenModifiers2["readonly"] = "readonly";
          SemanticTokenModifiers2["static"] = "static";
          SemanticTokenModifiers2["deprecated"] = "deprecated";
          SemanticTokenModifiers2["abstract"] = "abstract";
          SemanticTokenModifiers2["async"] = "async";
          SemanticTokenModifiers2["modification"] = "modification";
          SemanticTokenModifiers2["documentation"] = "documentation";
          SemanticTokenModifiers2["defaultLibrary"] = "defaultLibrary";
        })(SemanticTokenModifiers = exports2.SemanticTokenModifiers || (exports2.SemanticTokenModifiers = {}));
        var SemanticTokens;
        (function(SemanticTokens2) {
          function is(value) {
            var candidate = value;
            return Is.objectLiteral(candidate) && (candidate.resultId === void 0 || typeof candidate.resultId === "string") && Array.isArray(candidate.data) && (candidate.data.length === 0 || typeof candidate.data[0] === "number");
          }
          SemanticTokens2.is = is;
        })(SemanticTokens = exports2.SemanticTokens || (exports2.SemanticTokens = {}));
        var InlineValueText;
        (function(InlineValueText2) {
          function create(range, text) {
            return { range, text };
          }
          InlineValueText2.create = create;
          function is(value) {
            var candidate = value;
            return candidate !== void 0 && candidate !== null && Range3.is(candidate.range) && Is.string(candidate.text);
          }
          InlineValueText2.is = is;
        })(InlineValueText = exports2.InlineValueText || (exports2.InlineValueText = {}));
        var InlineValueVariableLookup;
        (function(InlineValueVariableLookup2) {
          function create(range, variableName, caseSensitiveLookup) {
            return { range, variableName, caseSensitiveLookup };
          }
          InlineValueVariableLookup2.create = create;
          function is(value) {
            var candidate = value;
            return candidate !== void 0 && candidate !== null && Range3.is(candidate.range) && Is.boolean(candidate.caseSensitiveLookup) && (Is.string(candidate.variableName) || candidate.variableName === void 0);
          }
          InlineValueVariableLookup2.is = is;
        })(InlineValueVariableLookup = exports2.InlineValueVariableLookup || (exports2.InlineValueVariableLookup = {}));
        var InlineValueEvaluatableExpression;
        (function(InlineValueEvaluatableExpression2) {
          function create(range, expression) {
            return { range, expression };
          }
          InlineValueEvaluatableExpression2.create = create;
          function is(value) {
            var candidate = value;
            return candidate !== void 0 && candidate !== null && Range3.is(candidate.range) && (Is.string(candidate.expression) || candidate.expression === void 0);
          }
          InlineValueEvaluatableExpression2.is = is;
        })(InlineValueEvaluatableExpression = exports2.InlineValueEvaluatableExpression || (exports2.InlineValueEvaluatableExpression = {}));
        var InlineValuesContext;
        (function(InlineValuesContext2) {
          function create(stoppedLocation) {
            return { stoppedLocation };
          }
          InlineValuesContext2.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Range3.is(value.stoppedLocation);
          }
          InlineValuesContext2.is = is;
        })(InlineValuesContext = exports2.InlineValuesContext || (exports2.InlineValuesContext = {}));
        exports2.EOL = ["\n", "\r\n", "\r"];
        var TextDocument2;
        (function(TextDocument3) {
          function create(uri, languageId, version, content) {
            return new FullTextDocument2(uri, languageId, version, content);
          }
          TextDocument3.create = create;
          function is(value) {
            var candidate = value;
            return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.uinteger(candidate.lineCount) && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
          }
          TextDocument3.is = is;
          function applyEdits(document, edits) {
            var text = document.getText();
            var sortedEdits = mergeSort2(edits, function(a, b) {
              var diff = a.range.start.line - b.range.start.line;
              if (diff === 0) {
                return a.range.start.character - b.range.start.character;
              }
              return diff;
            });
            var lastModifiedOffset = text.length;
            for (var i = sortedEdits.length - 1; i >= 0; i--) {
              var e = sortedEdits[i];
              var startOffset = document.offsetAt(e.range.start);
              var endOffset = document.offsetAt(e.range.end);
              if (endOffset <= lastModifiedOffset) {
                text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
              } else {
                throw new Error("Overlapping edit");
              }
              lastModifiedOffset = startOffset;
            }
            return text;
          }
          TextDocument3.applyEdits = applyEdits;
          function mergeSort2(data, compare) {
            if (data.length <= 1) {
              return data;
            }
            var p = data.length / 2 | 0;
            var left = data.slice(0, p);
            var right = data.slice(p);
            mergeSort2(left, compare);
            mergeSort2(right, compare);
            var leftIdx = 0;
            var rightIdx = 0;
            var i = 0;
            while (leftIdx < left.length && rightIdx < right.length) {
              var ret = compare(left[leftIdx], right[rightIdx]);
              if (ret <= 0) {
                data[i++] = left[leftIdx++];
              } else {
                data[i++] = right[rightIdx++];
              }
            }
            while (leftIdx < left.length) {
              data[i++] = left[leftIdx++];
            }
            while (rightIdx < right.length) {
              data[i++] = right[rightIdx++];
            }
            return data;
          }
        })(TextDocument2 = exports2.TextDocument || (exports2.TextDocument = {}));
        var FullTextDocument2 = function() {
          function FullTextDocument3(uri, languageId, version, content) {
            this._uri = uri;
            this._languageId = languageId;
            this._version = version;
            this._content = content;
            this._lineOffsets = void 0;
          }
          Object.defineProperty(FullTextDocument3.prototype, "uri", {
            get: function() {
              return this._uri;
            },
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(FullTextDocument3.prototype, "languageId", {
            get: function() {
              return this._languageId;
            },
            enumerable: false,
            configurable: true
          });
          Object.defineProperty(FullTextDocument3.prototype, "version", {
            get: function() {
              return this._version;
            },
            enumerable: false,
            configurable: true
          });
          FullTextDocument3.prototype.getText = function(range) {
            if (range) {
              var start = this.offsetAt(range.start);
              var end = this.offsetAt(range.end);
              return this._content.substring(start, end);
            }
            return this._content;
          };
          FullTextDocument3.prototype.update = function(event, version) {
            this._content = event.text;
            this._version = version;
            this._lineOffsets = void 0;
          };
          FullTextDocument3.prototype.getLineOffsets = function() {
            if (this._lineOffsets === void 0) {
              var lineOffsets = [];
              var text = this._content;
              var isLineStart = true;
              for (var i = 0; i < text.length; i++) {
                if (isLineStart) {
                  lineOffsets.push(i);
                  isLineStart = false;
                }
                var ch = text.charAt(i);
                isLineStart = ch === "\r" || ch === "\n";
                if (ch === "\r" && i + 1 < text.length && text.charAt(i + 1) === "\n") {
                  i++;
                }
              }
              if (isLineStart && text.length > 0) {
                lineOffsets.push(text.length);
              }
              this._lineOffsets = lineOffsets;
            }
            return this._lineOffsets;
          };
          FullTextDocument3.prototype.positionAt = function(offset) {
            offset = Math.max(Math.min(offset, this._content.length), 0);
            var lineOffsets = this.getLineOffsets();
            var low = 0, high = lineOffsets.length;
            if (high === 0) {
              return Position.create(0, offset);
            }
            while (low < high) {
              var mid = Math.floor((low + high) / 2);
              if (lineOffsets[mid] > offset) {
                high = mid;
              } else {
                low = mid + 1;
              }
            }
            var line = low - 1;
            return Position.create(line, offset - lineOffsets[line]);
          };
          FullTextDocument3.prototype.offsetAt = function(position) {
            var lineOffsets = this.getLineOffsets();
            if (position.line >= lineOffsets.length) {
              return this._content.length;
            } else if (position.line < 0) {
              return 0;
            }
            var lineOffset = lineOffsets[position.line];
            var nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
            return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
          };
          Object.defineProperty(FullTextDocument3.prototype, "lineCount", {
            get: function() {
              return this.getLineOffsets().length;
            },
            enumerable: false,
            configurable: true
          });
          return FullTextDocument3;
        }();
        var Is;
        (function(Is2) {
          var toString = Object.prototype.toString;
          function defined(value) {
            return typeof value !== "undefined";
          }
          Is2.defined = defined;
          function undefined2(value) {
            return typeof value === "undefined";
          }
          Is2.undefined = undefined2;
          function boolean(value) {
            return value === true || value === false;
          }
          Is2.boolean = boolean;
          function string(value) {
            return toString.call(value) === "[object String]";
          }
          Is2.string = string;
          function number(value) {
            return toString.call(value) === "[object Number]";
          }
          Is2.number = number;
          function numberRange(value, min, max) {
            return toString.call(value) === "[object Number]" && min <= value && value <= max;
          }
          Is2.numberRange = numberRange;
          function integer2(value) {
            return toString.call(value) === "[object Number]" && -2147483648 <= value && value <= 2147483647;
          }
          Is2.integer = integer2;
          function uinteger2(value) {
            return toString.call(value) === "[object Number]" && 0 <= value && value <= 2147483647;
          }
          Is2.uinteger = uinteger2;
          function func(value) {
            return toString.call(value) === "[object Function]";
          }
          Is2.func = func;
          function objectLiteral(value) {
            return value !== null && typeof value === "object";
          }
          Is2.objectLiteral = objectLiteral;
          function typedArray(value, check) {
            return Array.isArray(value) && value.every(check);
          }
          Is2.typedArray = typedArray;
        })(Is || (Is = {}));
      });
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/messages.js
  var require_messages2 = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/messages.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ProtocolNotificationType = exports.ProtocolNotificationType0 = exports.ProtocolRequestType = exports.ProtocolRequestType0 = exports.RegistrationType = void 0;
      var vscode_jsonrpc_1 = require_main();
      var RegistrationType = class {
        constructor(method) {
          this.method = method;
        }
      };
      exports.RegistrationType = RegistrationType;
      var ProtocolRequestType0 = class extends vscode_jsonrpc_1.RequestType0 {
        constructor(method) {
          super(method);
        }
      };
      exports.ProtocolRequestType0 = ProtocolRequestType0;
      var ProtocolRequestType = class extends vscode_jsonrpc_1.RequestType {
        constructor(method) {
          super(method, vscode_jsonrpc_1.ParameterStructures.byName);
        }
      };
      exports.ProtocolRequestType = ProtocolRequestType;
      var ProtocolNotificationType0 = class extends vscode_jsonrpc_1.NotificationType0 {
        constructor(method) {
          super(method);
        }
      };
      exports.ProtocolNotificationType0 = ProtocolNotificationType0;
      var ProtocolNotificationType = class extends vscode_jsonrpc_1.NotificationType {
        constructor(method) {
          super(method, vscode_jsonrpc_1.ParameterStructures.byName);
        }
      };
      exports.ProtocolNotificationType = ProtocolNotificationType;
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/utils/is.js
  var require_is2 = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/utils/is.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.objectLiteral = exports.typedArray = exports.stringArray = exports.array = exports.func = exports.error = exports.number = exports.string = exports.boolean = void 0;
      function boolean(value) {
        return value === true || value === false;
      }
      exports.boolean = boolean;
      function string(value) {
        return typeof value === "string" || value instanceof String;
      }
      exports.string = string;
      function number(value) {
        return typeof value === "number" || value instanceof Number;
      }
      exports.number = number;
      function error(value) {
        return value instanceof Error;
      }
      exports.error = error;
      function func(value) {
        return typeof value === "function";
      }
      exports.func = func;
      function array(value) {
        return Array.isArray(value);
      }
      exports.array = array;
      function stringArray(value) {
        return array(value) && value.every((elem) => string(elem));
      }
      exports.stringArray = stringArray;
      function typedArray(value, check) {
        return Array.isArray(value) && value.every(check);
      }
      exports.typedArray = typedArray;
      function objectLiteral(value) {
        return value !== null && typeof value === "object";
      }
      exports.objectLiteral = objectLiteral;
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.implementation.js
  var require_protocol_implementation = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.implementation.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ImplementationRequest = void 0;
      var messages_1 = require_messages2();
      var ImplementationRequest;
      (function(ImplementationRequest2) {
        ImplementationRequest2.method = "textDocument/implementation";
        ImplementationRequest2.type = new messages_1.ProtocolRequestType(ImplementationRequest2.method);
      })(ImplementationRequest = exports.ImplementationRequest || (exports.ImplementationRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.typeDefinition.js
  var require_protocol_typeDefinition = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.typeDefinition.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TypeDefinitionRequest = void 0;
      var messages_1 = require_messages2();
      var TypeDefinitionRequest;
      (function(TypeDefinitionRequest2) {
        TypeDefinitionRequest2.method = "textDocument/typeDefinition";
        TypeDefinitionRequest2.type = new messages_1.ProtocolRequestType(TypeDefinitionRequest2.method);
      })(TypeDefinitionRequest = exports.TypeDefinitionRequest || (exports.TypeDefinitionRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.workspaceFolders.js
  var require_protocol_workspaceFolders = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.workspaceFolders.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DidChangeWorkspaceFoldersNotification = exports.WorkspaceFoldersRequest = void 0;
      var messages_1 = require_messages2();
      var WorkspaceFoldersRequest;
      (function(WorkspaceFoldersRequest2) {
        WorkspaceFoldersRequest2.type = new messages_1.ProtocolRequestType0("workspace/workspaceFolders");
      })(WorkspaceFoldersRequest = exports.WorkspaceFoldersRequest || (exports.WorkspaceFoldersRequest = {}));
      var DidChangeWorkspaceFoldersNotification;
      (function(DidChangeWorkspaceFoldersNotification2) {
        DidChangeWorkspaceFoldersNotification2.type = new messages_1.ProtocolNotificationType("workspace/didChangeWorkspaceFolders");
      })(DidChangeWorkspaceFoldersNotification = exports.DidChangeWorkspaceFoldersNotification || (exports.DidChangeWorkspaceFoldersNotification = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.configuration.js
  var require_protocol_configuration = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.configuration.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ConfigurationRequest = void 0;
      var messages_1 = require_messages2();
      var ConfigurationRequest;
      (function(ConfigurationRequest2) {
        ConfigurationRequest2.type = new messages_1.ProtocolRequestType("workspace/configuration");
      })(ConfigurationRequest = exports.ConfigurationRequest || (exports.ConfigurationRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.js
  var require_protocol_colorProvider = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ColorPresentationRequest = exports.DocumentColorRequest = void 0;
      var messages_1 = require_messages2();
      var DocumentColorRequest;
      (function(DocumentColorRequest2) {
        DocumentColorRequest2.method = "textDocument/documentColor";
        DocumentColorRequest2.type = new messages_1.ProtocolRequestType(DocumentColorRequest2.method);
      })(DocumentColorRequest = exports.DocumentColorRequest || (exports.DocumentColorRequest = {}));
      var ColorPresentationRequest;
      (function(ColorPresentationRequest2) {
        ColorPresentationRequest2.type = new messages_1.ProtocolRequestType("textDocument/colorPresentation");
      })(ColorPresentationRequest = exports.ColorPresentationRequest || (exports.ColorPresentationRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.js
  var require_protocol_foldingRange = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.foldingRange.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FoldingRangeRequest = exports.FoldingRangeKind = void 0;
      var messages_1 = require_messages2();
      var FoldingRangeKind;
      (function(FoldingRangeKind2) {
        FoldingRangeKind2["Comment"] = "comment";
        FoldingRangeKind2["Imports"] = "imports";
        FoldingRangeKind2["Region"] = "region";
      })(FoldingRangeKind = exports.FoldingRangeKind || (exports.FoldingRangeKind = {}));
      var FoldingRangeRequest;
      (function(FoldingRangeRequest2) {
        FoldingRangeRequest2.method = "textDocument/foldingRange";
        FoldingRangeRequest2.type = new messages_1.ProtocolRequestType(FoldingRangeRequest2.method);
      })(FoldingRangeRequest = exports.FoldingRangeRequest || (exports.FoldingRangeRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.declaration.js
  var require_protocol_declaration = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.declaration.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DeclarationRequest = void 0;
      var messages_1 = require_messages2();
      var DeclarationRequest;
      (function(DeclarationRequest2) {
        DeclarationRequest2.method = "textDocument/declaration";
        DeclarationRequest2.type = new messages_1.ProtocolRequestType(DeclarationRequest2.method);
      })(DeclarationRequest = exports.DeclarationRequest || (exports.DeclarationRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.selectionRange.js
  var require_protocol_selectionRange = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.selectionRange.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SelectionRangeRequest = void 0;
      var messages_1 = require_messages2();
      var SelectionRangeRequest;
      (function(SelectionRangeRequest2) {
        SelectionRangeRequest2.method = "textDocument/selectionRange";
        SelectionRangeRequest2.type = new messages_1.ProtocolRequestType(SelectionRangeRequest2.method);
      })(SelectionRangeRequest = exports.SelectionRangeRequest || (exports.SelectionRangeRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.progress.js
  var require_protocol_progress = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.progress.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WorkDoneProgressCancelNotification = exports.WorkDoneProgressCreateRequest = exports.WorkDoneProgress = void 0;
      var vscode_jsonrpc_1 = require_main();
      var messages_1 = require_messages2();
      var WorkDoneProgress;
      (function(WorkDoneProgress2) {
        WorkDoneProgress2.type = new vscode_jsonrpc_1.ProgressType();
        function is(value) {
          return value === WorkDoneProgress2.type;
        }
        WorkDoneProgress2.is = is;
      })(WorkDoneProgress = exports.WorkDoneProgress || (exports.WorkDoneProgress = {}));
      var WorkDoneProgressCreateRequest;
      (function(WorkDoneProgressCreateRequest2) {
        WorkDoneProgressCreateRequest2.type = new messages_1.ProtocolRequestType("window/workDoneProgress/create");
      })(WorkDoneProgressCreateRequest = exports.WorkDoneProgressCreateRequest || (exports.WorkDoneProgressCreateRequest = {}));
      var WorkDoneProgressCancelNotification;
      (function(WorkDoneProgressCancelNotification2) {
        WorkDoneProgressCancelNotification2.type = new messages_1.ProtocolNotificationType("window/workDoneProgress/cancel");
      })(WorkDoneProgressCancelNotification = exports.WorkDoneProgressCancelNotification || (exports.WorkDoneProgressCancelNotification = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.callHierarchy.js
  var require_protocol_callHierarchy = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.callHierarchy.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CallHierarchyOutgoingCallsRequest = exports.CallHierarchyIncomingCallsRequest = exports.CallHierarchyPrepareRequest = void 0;
      var messages_1 = require_messages2();
      var CallHierarchyPrepareRequest;
      (function(CallHierarchyPrepareRequest2) {
        CallHierarchyPrepareRequest2.method = "textDocument/prepareCallHierarchy";
        CallHierarchyPrepareRequest2.type = new messages_1.ProtocolRequestType(CallHierarchyPrepareRequest2.method);
      })(CallHierarchyPrepareRequest = exports.CallHierarchyPrepareRequest || (exports.CallHierarchyPrepareRequest = {}));
      var CallHierarchyIncomingCallsRequest;
      (function(CallHierarchyIncomingCallsRequest2) {
        CallHierarchyIncomingCallsRequest2.method = "callHierarchy/incomingCalls";
        CallHierarchyIncomingCallsRequest2.type = new messages_1.ProtocolRequestType(CallHierarchyIncomingCallsRequest2.method);
      })(CallHierarchyIncomingCallsRequest = exports.CallHierarchyIncomingCallsRequest || (exports.CallHierarchyIncomingCallsRequest = {}));
      var CallHierarchyOutgoingCallsRequest;
      (function(CallHierarchyOutgoingCallsRequest2) {
        CallHierarchyOutgoingCallsRequest2.method = "callHierarchy/outgoingCalls";
        CallHierarchyOutgoingCallsRequest2.type = new messages_1.ProtocolRequestType(CallHierarchyOutgoingCallsRequest2.method);
      })(CallHierarchyOutgoingCallsRequest = exports.CallHierarchyOutgoingCallsRequest || (exports.CallHierarchyOutgoingCallsRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.js
  var require_protocol_semanticTokens = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SemanticTokensRefreshRequest = exports.SemanticTokensRangeRequest = exports.SemanticTokensDeltaRequest = exports.SemanticTokensRequest = exports.SemanticTokensRegistrationType = exports.TokenFormat = void 0;
      var messages_1 = require_messages2();
      var TokenFormat;
      (function(TokenFormat2) {
        TokenFormat2.Relative = "relative";
      })(TokenFormat = exports.TokenFormat || (exports.TokenFormat = {}));
      var SemanticTokensRegistrationType;
      (function(SemanticTokensRegistrationType2) {
        SemanticTokensRegistrationType2.method = "textDocument/semanticTokens";
        SemanticTokensRegistrationType2.type = new messages_1.RegistrationType(SemanticTokensRegistrationType2.method);
      })(SemanticTokensRegistrationType = exports.SemanticTokensRegistrationType || (exports.SemanticTokensRegistrationType = {}));
      var SemanticTokensRequest;
      (function(SemanticTokensRequest2) {
        SemanticTokensRequest2.method = "textDocument/semanticTokens/full";
        SemanticTokensRequest2.type = new messages_1.ProtocolRequestType(SemanticTokensRequest2.method);
      })(SemanticTokensRequest = exports.SemanticTokensRequest || (exports.SemanticTokensRequest = {}));
      var SemanticTokensDeltaRequest;
      (function(SemanticTokensDeltaRequest2) {
        SemanticTokensDeltaRequest2.method = "textDocument/semanticTokens/full/delta";
        SemanticTokensDeltaRequest2.type = new messages_1.ProtocolRequestType(SemanticTokensDeltaRequest2.method);
      })(SemanticTokensDeltaRequest = exports.SemanticTokensDeltaRequest || (exports.SemanticTokensDeltaRequest = {}));
      var SemanticTokensRangeRequest;
      (function(SemanticTokensRangeRequest2) {
        SemanticTokensRangeRequest2.method = "textDocument/semanticTokens/range";
        SemanticTokensRangeRequest2.type = new messages_1.ProtocolRequestType(SemanticTokensRangeRequest2.method);
      })(SemanticTokensRangeRequest = exports.SemanticTokensRangeRequest || (exports.SemanticTokensRangeRequest = {}));
      var SemanticTokensRefreshRequest;
      (function(SemanticTokensRefreshRequest2) {
        SemanticTokensRefreshRequest2.method = `workspace/semanticTokens/refresh`;
        SemanticTokensRefreshRequest2.type = new messages_1.ProtocolRequestType0(SemanticTokensRefreshRequest2.method);
      })(SemanticTokensRefreshRequest = exports.SemanticTokensRefreshRequest || (exports.SemanticTokensRefreshRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.showDocument.js
  var require_protocol_showDocument = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.showDocument.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ShowDocumentRequest = void 0;
      var messages_1 = require_messages2();
      var ShowDocumentRequest;
      (function(ShowDocumentRequest2) {
        ShowDocumentRequest2.method = "window/showDocument";
        ShowDocumentRequest2.type = new messages_1.ProtocolRequestType(ShowDocumentRequest2.method);
      })(ShowDocumentRequest = exports.ShowDocumentRequest || (exports.ShowDocumentRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.linkedEditingRange.js
  var require_protocol_linkedEditingRange = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.linkedEditingRange.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LinkedEditingRangeRequest = void 0;
      var messages_1 = require_messages2();
      var LinkedEditingRangeRequest;
      (function(LinkedEditingRangeRequest2) {
        LinkedEditingRangeRequest2.method = "textDocument/linkedEditingRange";
        LinkedEditingRangeRequest2.type = new messages_1.ProtocolRequestType(LinkedEditingRangeRequest2.method);
      })(LinkedEditingRangeRequest = exports.LinkedEditingRangeRequest || (exports.LinkedEditingRangeRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.js
  var require_protocol_fileOperations = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.fileOperations.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WillDeleteFilesRequest = exports.DidDeleteFilesNotification = exports.DidRenameFilesNotification = exports.WillRenameFilesRequest = exports.DidCreateFilesNotification = exports.WillCreateFilesRequest = exports.FileOperationPatternKind = void 0;
      var messages_1 = require_messages2();
      var FileOperationPatternKind;
      (function(FileOperationPatternKind2) {
        FileOperationPatternKind2.file = "file";
        FileOperationPatternKind2.folder = "folder";
      })(FileOperationPatternKind = exports.FileOperationPatternKind || (exports.FileOperationPatternKind = {}));
      var WillCreateFilesRequest;
      (function(WillCreateFilesRequest2) {
        WillCreateFilesRequest2.method = "workspace/willCreateFiles";
        WillCreateFilesRequest2.type = new messages_1.ProtocolRequestType(WillCreateFilesRequest2.method);
      })(WillCreateFilesRequest = exports.WillCreateFilesRequest || (exports.WillCreateFilesRequest = {}));
      var DidCreateFilesNotification;
      (function(DidCreateFilesNotification2) {
        DidCreateFilesNotification2.method = "workspace/didCreateFiles";
        DidCreateFilesNotification2.type = new messages_1.ProtocolNotificationType(DidCreateFilesNotification2.method);
      })(DidCreateFilesNotification = exports.DidCreateFilesNotification || (exports.DidCreateFilesNotification = {}));
      var WillRenameFilesRequest;
      (function(WillRenameFilesRequest2) {
        WillRenameFilesRequest2.method = "workspace/willRenameFiles";
        WillRenameFilesRequest2.type = new messages_1.ProtocolRequestType(WillRenameFilesRequest2.method);
      })(WillRenameFilesRequest = exports.WillRenameFilesRequest || (exports.WillRenameFilesRequest = {}));
      var DidRenameFilesNotification;
      (function(DidRenameFilesNotification2) {
        DidRenameFilesNotification2.method = "workspace/didRenameFiles";
        DidRenameFilesNotification2.type = new messages_1.ProtocolNotificationType(DidRenameFilesNotification2.method);
      })(DidRenameFilesNotification = exports.DidRenameFilesNotification || (exports.DidRenameFilesNotification = {}));
      var DidDeleteFilesNotification;
      (function(DidDeleteFilesNotification2) {
        DidDeleteFilesNotification2.method = "workspace/didDeleteFiles";
        DidDeleteFilesNotification2.type = new messages_1.ProtocolNotificationType(DidDeleteFilesNotification2.method);
      })(DidDeleteFilesNotification = exports.DidDeleteFilesNotification || (exports.DidDeleteFilesNotification = {}));
      var WillDeleteFilesRequest;
      (function(WillDeleteFilesRequest2) {
        WillDeleteFilesRequest2.method = "workspace/willDeleteFiles";
        WillDeleteFilesRequest2.type = new messages_1.ProtocolRequestType(WillDeleteFilesRequest2.method);
      })(WillDeleteFilesRequest = exports.WillDeleteFilesRequest || (exports.WillDeleteFilesRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.js
  var require_protocol_moniker = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.MonikerRequest = exports.MonikerKind = exports.UniquenessLevel = void 0;
      var messages_1 = require_messages2();
      var UniquenessLevel;
      (function(UniquenessLevel2) {
        UniquenessLevel2["document"] = "document";
        UniquenessLevel2["project"] = "project";
        UniquenessLevel2["group"] = "group";
        UniquenessLevel2["scheme"] = "scheme";
        UniquenessLevel2["global"] = "global";
      })(UniquenessLevel = exports.UniquenessLevel || (exports.UniquenessLevel = {}));
      var MonikerKind;
      (function(MonikerKind2) {
        MonikerKind2["import"] = "import";
        MonikerKind2["export"] = "export";
        MonikerKind2["local"] = "local";
      })(MonikerKind = exports.MonikerKind || (exports.MonikerKind = {}));
      var MonikerRequest;
      (function(MonikerRequest2) {
        MonikerRequest2.method = "textDocument/moniker";
        MonikerRequest2.type = new messages_1.ProtocolRequestType(MonikerRequest2.method);
      })(MonikerRequest = exports.MonikerRequest || (exports.MonikerRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/protocol.js
  var require_protocol = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/protocol.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CodeLensRefreshRequest = exports.CodeLensResolveRequest = exports.CodeLensRequest = exports.WorkspaceSymbolResolveRequest = exports.WorkspaceSymbolRequest = exports.CodeActionResolveRequest = exports.CodeActionRequest = exports.DocumentSymbolRequest = exports.DocumentHighlightRequest = exports.ReferencesRequest = exports.DefinitionRequest = exports.SignatureHelpRequest = exports.SignatureHelpTriggerKind = exports.HoverRequest = exports.CompletionResolveRequest = exports.CompletionRequest = exports.CompletionTriggerKind = exports.PublishDiagnosticsNotification = exports.WatchKind = exports.FileChangeType = exports.DidChangeWatchedFilesNotification = exports.WillSaveTextDocumentWaitUntilRequest = exports.WillSaveTextDocumentNotification = exports.TextDocumentSaveReason = exports.DidSaveTextDocumentNotification = exports.DidCloseTextDocumentNotification = exports.DidChangeTextDocumentNotification = exports.TextDocumentContentChangeEvent = exports.DidOpenTextDocumentNotification = exports.TextDocumentSyncKind = exports.TelemetryEventNotification = exports.LogMessageNotification = exports.ShowMessageRequest = exports.ShowMessageNotification = exports.MessageType = exports.DidChangeConfigurationNotification = exports.ExitNotification = exports.ShutdownRequest = exports.InitializedNotification = exports.InitializeError = exports.InitializeRequest = exports.WorkDoneProgressOptions = exports.TextDocumentRegistrationOptions = exports.StaticRegistrationOptions = exports.FailureHandlingKind = exports.ResourceOperationKind = exports.UnregistrationRequest = exports.RegistrationRequest = exports.DocumentSelector = exports.DocumentFilter = void 0;
      exports.MonikerRequest = exports.MonikerKind = exports.UniquenessLevel = exports.WillDeleteFilesRequest = exports.DidDeleteFilesNotification = exports.WillRenameFilesRequest = exports.DidRenameFilesNotification = exports.WillCreateFilesRequest = exports.DidCreateFilesNotification = exports.FileOperationPatternKind = exports.LinkedEditingRangeRequest = exports.ShowDocumentRequest = exports.SemanticTokensRegistrationType = exports.SemanticTokensRefreshRequest = exports.SemanticTokensRangeRequest = exports.SemanticTokensDeltaRequest = exports.SemanticTokensRequest = exports.TokenFormat = exports.CallHierarchyPrepareRequest = exports.CallHierarchyOutgoingCallsRequest = exports.CallHierarchyIncomingCallsRequest = exports.WorkDoneProgressCancelNotification = exports.WorkDoneProgressCreateRequest = exports.WorkDoneProgress = exports.SelectionRangeRequest = exports.DeclarationRequest = exports.FoldingRangeRequest = exports.ColorPresentationRequest = exports.DocumentColorRequest = exports.ConfigurationRequest = exports.DidChangeWorkspaceFoldersNotification = exports.WorkspaceFoldersRequest = exports.TypeDefinitionRequest = exports.ImplementationRequest = exports.ApplyWorkspaceEditRequest = exports.ExecuteCommandRequest = exports.PrepareRenameRequest = exports.RenameRequest = exports.PrepareSupportDefaultBehavior = exports.DocumentOnTypeFormattingRequest = exports.DocumentRangeFormattingRequest = exports.DocumentFormattingRequest = exports.DocumentLinkResolveRequest = exports.DocumentLinkRequest = void 0;
      var messages_1 = require_messages2();
      var Is = require_is2();
      var protocol_implementation_1 = require_protocol_implementation();
      Object.defineProperty(exports, "ImplementationRequest", { enumerable: true, get: function() {
        return protocol_implementation_1.ImplementationRequest;
      } });
      var protocol_typeDefinition_1 = require_protocol_typeDefinition();
      Object.defineProperty(exports, "TypeDefinitionRequest", { enumerable: true, get: function() {
        return protocol_typeDefinition_1.TypeDefinitionRequest;
      } });
      var protocol_workspaceFolders_1 = require_protocol_workspaceFolders();
      Object.defineProperty(exports, "WorkspaceFoldersRequest", { enumerable: true, get: function() {
        return protocol_workspaceFolders_1.WorkspaceFoldersRequest;
      } });
      Object.defineProperty(exports, "DidChangeWorkspaceFoldersNotification", { enumerable: true, get: function() {
        return protocol_workspaceFolders_1.DidChangeWorkspaceFoldersNotification;
      } });
      var protocol_configuration_1 = require_protocol_configuration();
      Object.defineProperty(exports, "ConfigurationRequest", { enumerable: true, get: function() {
        return protocol_configuration_1.ConfigurationRequest;
      } });
      var protocol_colorProvider_1 = require_protocol_colorProvider();
      Object.defineProperty(exports, "DocumentColorRequest", { enumerable: true, get: function() {
        return protocol_colorProvider_1.DocumentColorRequest;
      } });
      Object.defineProperty(exports, "ColorPresentationRequest", { enumerable: true, get: function() {
        return protocol_colorProvider_1.ColorPresentationRequest;
      } });
      var protocol_foldingRange_1 = require_protocol_foldingRange();
      Object.defineProperty(exports, "FoldingRangeRequest", { enumerable: true, get: function() {
        return protocol_foldingRange_1.FoldingRangeRequest;
      } });
      var protocol_declaration_1 = require_protocol_declaration();
      Object.defineProperty(exports, "DeclarationRequest", { enumerable: true, get: function() {
        return protocol_declaration_1.DeclarationRequest;
      } });
      var protocol_selectionRange_1 = require_protocol_selectionRange();
      Object.defineProperty(exports, "SelectionRangeRequest", { enumerable: true, get: function() {
        return protocol_selectionRange_1.SelectionRangeRequest;
      } });
      var protocol_progress_1 = require_protocol_progress();
      Object.defineProperty(exports, "WorkDoneProgress", { enumerable: true, get: function() {
        return protocol_progress_1.WorkDoneProgress;
      } });
      Object.defineProperty(exports, "WorkDoneProgressCreateRequest", { enumerable: true, get: function() {
        return protocol_progress_1.WorkDoneProgressCreateRequest;
      } });
      Object.defineProperty(exports, "WorkDoneProgressCancelNotification", { enumerable: true, get: function() {
        return protocol_progress_1.WorkDoneProgressCancelNotification;
      } });
      var protocol_callHierarchy_1 = require_protocol_callHierarchy();
      Object.defineProperty(exports, "CallHierarchyIncomingCallsRequest", { enumerable: true, get: function() {
        return protocol_callHierarchy_1.CallHierarchyIncomingCallsRequest;
      } });
      Object.defineProperty(exports, "CallHierarchyOutgoingCallsRequest", { enumerable: true, get: function() {
        return protocol_callHierarchy_1.CallHierarchyOutgoingCallsRequest;
      } });
      Object.defineProperty(exports, "CallHierarchyPrepareRequest", { enumerable: true, get: function() {
        return protocol_callHierarchy_1.CallHierarchyPrepareRequest;
      } });
      var protocol_semanticTokens_1 = require_protocol_semanticTokens();
      Object.defineProperty(exports, "TokenFormat", { enumerable: true, get: function() {
        return protocol_semanticTokens_1.TokenFormat;
      } });
      Object.defineProperty(exports, "SemanticTokensRequest", { enumerable: true, get: function() {
        return protocol_semanticTokens_1.SemanticTokensRequest;
      } });
      Object.defineProperty(exports, "SemanticTokensDeltaRequest", { enumerable: true, get: function() {
        return protocol_semanticTokens_1.SemanticTokensDeltaRequest;
      } });
      Object.defineProperty(exports, "SemanticTokensRangeRequest", { enumerable: true, get: function() {
        return protocol_semanticTokens_1.SemanticTokensRangeRequest;
      } });
      Object.defineProperty(exports, "SemanticTokensRefreshRequest", { enumerable: true, get: function() {
        return protocol_semanticTokens_1.SemanticTokensRefreshRequest;
      } });
      Object.defineProperty(exports, "SemanticTokensRegistrationType", { enumerable: true, get: function() {
        return protocol_semanticTokens_1.SemanticTokensRegistrationType;
      } });
      var protocol_showDocument_1 = require_protocol_showDocument();
      Object.defineProperty(exports, "ShowDocumentRequest", { enumerable: true, get: function() {
        return protocol_showDocument_1.ShowDocumentRequest;
      } });
      var protocol_linkedEditingRange_1 = require_protocol_linkedEditingRange();
      Object.defineProperty(exports, "LinkedEditingRangeRequest", { enumerable: true, get: function() {
        return protocol_linkedEditingRange_1.LinkedEditingRangeRequest;
      } });
      var protocol_fileOperations_1 = require_protocol_fileOperations();
      Object.defineProperty(exports, "FileOperationPatternKind", { enumerable: true, get: function() {
        return protocol_fileOperations_1.FileOperationPatternKind;
      } });
      Object.defineProperty(exports, "DidCreateFilesNotification", { enumerable: true, get: function() {
        return protocol_fileOperations_1.DidCreateFilesNotification;
      } });
      Object.defineProperty(exports, "WillCreateFilesRequest", { enumerable: true, get: function() {
        return protocol_fileOperations_1.WillCreateFilesRequest;
      } });
      Object.defineProperty(exports, "DidRenameFilesNotification", { enumerable: true, get: function() {
        return protocol_fileOperations_1.DidRenameFilesNotification;
      } });
      Object.defineProperty(exports, "WillRenameFilesRequest", { enumerable: true, get: function() {
        return protocol_fileOperations_1.WillRenameFilesRequest;
      } });
      Object.defineProperty(exports, "DidDeleteFilesNotification", { enumerable: true, get: function() {
        return protocol_fileOperations_1.DidDeleteFilesNotification;
      } });
      Object.defineProperty(exports, "WillDeleteFilesRequest", { enumerable: true, get: function() {
        return protocol_fileOperations_1.WillDeleteFilesRequest;
      } });
      var protocol_moniker_1 = require_protocol_moniker();
      Object.defineProperty(exports, "UniquenessLevel", { enumerable: true, get: function() {
        return protocol_moniker_1.UniquenessLevel;
      } });
      Object.defineProperty(exports, "MonikerKind", { enumerable: true, get: function() {
        return protocol_moniker_1.MonikerKind;
      } });
      Object.defineProperty(exports, "MonikerRequest", { enumerable: true, get: function() {
        return protocol_moniker_1.MonikerRequest;
      } });
      var DocumentFilter;
      (function(DocumentFilter2) {
        function is(value) {
          const candidate = value;
          return Is.string(candidate.language) || Is.string(candidate.scheme) || Is.string(candidate.pattern);
        }
        DocumentFilter2.is = is;
      })(DocumentFilter = exports.DocumentFilter || (exports.DocumentFilter = {}));
      var DocumentSelector;
      (function(DocumentSelector2) {
        function is(value) {
          if (!Array.isArray(value)) {
            return false;
          }
          for (let elem of value) {
            if (!Is.string(elem) && !DocumentFilter.is(elem)) {
              return false;
            }
          }
          return true;
        }
        DocumentSelector2.is = is;
      })(DocumentSelector = exports.DocumentSelector || (exports.DocumentSelector = {}));
      var RegistrationRequest;
      (function(RegistrationRequest2) {
        RegistrationRequest2.type = new messages_1.ProtocolRequestType("client/registerCapability");
      })(RegistrationRequest = exports.RegistrationRequest || (exports.RegistrationRequest = {}));
      var UnregistrationRequest;
      (function(UnregistrationRequest2) {
        UnregistrationRequest2.type = new messages_1.ProtocolRequestType("client/unregisterCapability");
      })(UnregistrationRequest = exports.UnregistrationRequest || (exports.UnregistrationRequest = {}));
      var ResourceOperationKind;
      (function(ResourceOperationKind2) {
        ResourceOperationKind2.Create = "create";
        ResourceOperationKind2.Rename = "rename";
        ResourceOperationKind2.Delete = "delete";
      })(ResourceOperationKind = exports.ResourceOperationKind || (exports.ResourceOperationKind = {}));
      var FailureHandlingKind;
      (function(FailureHandlingKind2) {
        FailureHandlingKind2.Abort = "abort";
        FailureHandlingKind2.Transactional = "transactional";
        FailureHandlingKind2.TextOnlyTransactional = "textOnlyTransactional";
        FailureHandlingKind2.Undo = "undo";
      })(FailureHandlingKind = exports.FailureHandlingKind || (exports.FailureHandlingKind = {}));
      var StaticRegistrationOptions;
      (function(StaticRegistrationOptions2) {
        function hasId(value) {
          const candidate = value;
          return candidate && Is.string(candidate.id) && candidate.id.length > 0;
        }
        StaticRegistrationOptions2.hasId = hasId;
      })(StaticRegistrationOptions = exports.StaticRegistrationOptions || (exports.StaticRegistrationOptions = {}));
      var TextDocumentRegistrationOptions;
      (function(TextDocumentRegistrationOptions2) {
        function is(value) {
          const candidate = value;
          return candidate && (candidate.documentSelector === null || DocumentSelector.is(candidate.documentSelector));
        }
        TextDocumentRegistrationOptions2.is = is;
      })(TextDocumentRegistrationOptions = exports.TextDocumentRegistrationOptions || (exports.TextDocumentRegistrationOptions = {}));
      var WorkDoneProgressOptions;
      (function(WorkDoneProgressOptions2) {
        function is(value) {
          const candidate = value;
          return Is.objectLiteral(candidate) && (candidate.workDoneProgress === void 0 || Is.boolean(candidate.workDoneProgress));
        }
        WorkDoneProgressOptions2.is = is;
        function hasWorkDoneProgress(value) {
          const candidate = value;
          return candidate && Is.boolean(candidate.workDoneProgress);
        }
        WorkDoneProgressOptions2.hasWorkDoneProgress = hasWorkDoneProgress;
      })(WorkDoneProgressOptions = exports.WorkDoneProgressOptions || (exports.WorkDoneProgressOptions = {}));
      var InitializeRequest;
      (function(InitializeRequest2) {
        InitializeRequest2.type = new messages_1.ProtocolRequestType("initialize");
      })(InitializeRequest = exports.InitializeRequest || (exports.InitializeRequest = {}));
      var InitializeError;
      (function(InitializeError2) {
        InitializeError2.unknownProtocolVersion = 1;
      })(InitializeError = exports.InitializeError || (exports.InitializeError = {}));
      var InitializedNotification;
      (function(InitializedNotification2) {
        InitializedNotification2.type = new messages_1.ProtocolNotificationType("initialized");
      })(InitializedNotification = exports.InitializedNotification || (exports.InitializedNotification = {}));
      var ShutdownRequest;
      (function(ShutdownRequest2) {
        ShutdownRequest2.type = new messages_1.ProtocolRequestType0("shutdown");
      })(ShutdownRequest = exports.ShutdownRequest || (exports.ShutdownRequest = {}));
      var ExitNotification;
      (function(ExitNotification2) {
        ExitNotification2.type = new messages_1.ProtocolNotificationType0("exit");
      })(ExitNotification = exports.ExitNotification || (exports.ExitNotification = {}));
      var DidChangeConfigurationNotification;
      (function(DidChangeConfigurationNotification2) {
        DidChangeConfigurationNotification2.type = new messages_1.ProtocolNotificationType("workspace/didChangeConfiguration");
      })(DidChangeConfigurationNotification = exports.DidChangeConfigurationNotification || (exports.DidChangeConfigurationNotification = {}));
      var MessageType;
      (function(MessageType2) {
        MessageType2.Error = 1;
        MessageType2.Warning = 2;
        MessageType2.Info = 3;
        MessageType2.Log = 4;
      })(MessageType = exports.MessageType || (exports.MessageType = {}));
      var ShowMessageNotification;
      (function(ShowMessageNotification2) {
        ShowMessageNotification2.type = new messages_1.ProtocolNotificationType("window/showMessage");
      })(ShowMessageNotification = exports.ShowMessageNotification || (exports.ShowMessageNotification = {}));
      var ShowMessageRequest;
      (function(ShowMessageRequest2) {
        ShowMessageRequest2.type = new messages_1.ProtocolRequestType("window/showMessageRequest");
      })(ShowMessageRequest = exports.ShowMessageRequest || (exports.ShowMessageRequest = {}));
      var LogMessageNotification;
      (function(LogMessageNotification2) {
        LogMessageNotification2.type = new messages_1.ProtocolNotificationType("window/logMessage");
      })(LogMessageNotification = exports.LogMessageNotification || (exports.LogMessageNotification = {}));
      var TelemetryEventNotification;
      (function(TelemetryEventNotification2) {
        TelemetryEventNotification2.type = new messages_1.ProtocolNotificationType("telemetry/event");
      })(TelemetryEventNotification = exports.TelemetryEventNotification || (exports.TelemetryEventNotification = {}));
      var TextDocumentSyncKind;
      (function(TextDocumentSyncKind2) {
        TextDocumentSyncKind2.None = 0;
        TextDocumentSyncKind2.Full = 1;
        TextDocumentSyncKind2.Incremental = 2;
      })(TextDocumentSyncKind = exports.TextDocumentSyncKind || (exports.TextDocumentSyncKind = {}));
      var DidOpenTextDocumentNotification;
      (function(DidOpenTextDocumentNotification2) {
        DidOpenTextDocumentNotification2.method = "textDocument/didOpen";
        DidOpenTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidOpenTextDocumentNotification2.method);
      })(DidOpenTextDocumentNotification = exports.DidOpenTextDocumentNotification || (exports.DidOpenTextDocumentNotification = {}));
      var TextDocumentContentChangeEvent2;
      (function(TextDocumentContentChangeEvent3) {
        function isIncremental(event) {
          let candidate = event;
          return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range !== void 0 && (candidate.rangeLength === void 0 || typeof candidate.rangeLength === "number");
        }
        TextDocumentContentChangeEvent3.isIncremental = isIncremental;
        function isFull(event) {
          let candidate = event;
          return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range === void 0 && candidate.rangeLength === void 0;
        }
        TextDocumentContentChangeEvent3.isFull = isFull;
      })(TextDocumentContentChangeEvent2 = exports.TextDocumentContentChangeEvent || (exports.TextDocumentContentChangeEvent = {}));
      var DidChangeTextDocumentNotification;
      (function(DidChangeTextDocumentNotification2) {
        DidChangeTextDocumentNotification2.method = "textDocument/didChange";
        DidChangeTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidChangeTextDocumentNotification2.method);
      })(DidChangeTextDocumentNotification = exports.DidChangeTextDocumentNotification || (exports.DidChangeTextDocumentNotification = {}));
      var DidCloseTextDocumentNotification;
      (function(DidCloseTextDocumentNotification2) {
        DidCloseTextDocumentNotification2.method = "textDocument/didClose";
        DidCloseTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidCloseTextDocumentNotification2.method);
      })(DidCloseTextDocumentNotification = exports.DidCloseTextDocumentNotification || (exports.DidCloseTextDocumentNotification = {}));
      var DidSaveTextDocumentNotification;
      (function(DidSaveTextDocumentNotification2) {
        DidSaveTextDocumentNotification2.method = "textDocument/didSave";
        DidSaveTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(DidSaveTextDocumentNotification2.method);
      })(DidSaveTextDocumentNotification = exports.DidSaveTextDocumentNotification || (exports.DidSaveTextDocumentNotification = {}));
      var TextDocumentSaveReason;
      (function(TextDocumentSaveReason2) {
        TextDocumentSaveReason2.Manual = 1;
        TextDocumentSaveReason2.AfterDelay = 2;
        TextDocumentSaveReason2.FocusOut = 3;
      })(TextDocumentSaveReason = exports.TextDocumentSaveReason || (exports.TextDocumentSaveReason = {}));
      var WillSaveTextDocumentNotification;
      (function(WillSaveTextDocumentNotification2) {
        WillSaveTextDocumentNotification2.method = "textDocument/willSave";
        WillSaveTextDocumentNotification2.type = new messages_1.ProtocolNotificationType(WillSaveTextDocumentNotification2.method);
      })(WillSaveTextDocumentNotification = exports.WillSaveTextDocumentNotification || (exports.WillSaveTextDocumentNotification = {}));
      var WillSaveTextDocumentWaitUntilRequest;
      (function(WillSaveTextDocumentWaitUntilRequest2) {
        WillSaveTextDocumentWaitUntilRequest2.method = "textDocument/willSaveWaitUntil";
        WillSaveTextDocumentWaitUntilRequest2.type = new messages_1.ProtocolRequestType(WillSaveTextDocumentWaitUntilRequest2.method);
      })(WillSaveTextDocumentWaitUntilRequest = exports.WillSaveTextDocumentWaitUntilRequest || (exports.WillSaveTextDocumentWaitUntilRequest = {}));
      var DidChangeWatchedFilesNotification;
      (function(DidChangeWatchedFilesNotification2) {
        DidChangeWatchedFilesNotification2.type = new messages_1.ProtocolNotificationType("workspace/didChangeWatchedFiles");
      })(DidChangeWatchedFilesNotification = exports.DidChangeWatchedFilesNotification || (exports.DidChangeWatchedFilesNotification = {}));
      var FileChangeType;
      (function(FileChangeType2) {
        FileChangeType2.Created = 1;
        FileChangeType2.Changed = 2;
        FileChangeType2.Deleted = 3;
      })(FileChangeType = exports.FileChangeType || (exports.FileChangeType = {}));
      var WatchKind;
      (function(WatchKind2) {
        WatchKind2.Create = 1;
        WatchKind2.Change = 2;
        WatchKind2.Delete = 4;
      })(WatchKind = exports.WatchKind || (exports.WatchKind = {}));
      var PublishDiagnosticsNotification;
      (function(PublishDiagnosticsNotification2) {
        PublishDiagnosticsNotification2.type = new messages_1.ProtocolNotificationType("textDocument/publishDiagnostics");
      })(PublishDiagnosticsNotification = exports.PublishDiagnosticsNotification || (exports.PublishDiagnosticsNotification = {}));
      var CompletionTriggerKind;
      (function(CompletionTriggerKind2) {
        CompletionTriggerKind2.Invoked = 1;
        CompletionTriggerKind2.TriggerCharacter = 2;
        CompletionTriggerKind2.TriggerForIncompleteCompletions = 3;
      })(CompletionTriggerKind = exports.CompletionTriggerKind || (exports.CompletionTriggerKind = {}));
      var CompletionRequest;
      (function(CompletionRequest2) {
        CompletionRequest2.method = "textDocument/completion";
        CompletionRequest2.type = new messages_1.ProtocolRequestType(CompletionRequest2.method);
      })(CompletionRequest = exports.CompletionRequest || (exports.CompletionRequest = {}));
      var CompletionResolveRequest;
      (function(CompletionResolveRequest2) {
        CompletionResolveRequest2.method = "completionItem/resolve";
        CompletionResolveRequest2.type = new messages_1.ProtocolRequestType(CompletionResolveRequest2.method);
      })(CompletionResolveRequest = exports.CompletionResolveRequest || (exports.CompletionResolveRequest = {}));
      var HoverRequest;
      (function(HoverRequest2) {
        HoverRequest2.method = "textDocument/hover";
        HoverRequest2.type = new messages_1.ProtocolRequestType(HoverRequest2.method);
      })(HoverRequest = exports.HoverRequest || (exports.HoverRequest = {}));
      var SignatureHelpTriggerKind;
      (function(SignatureHelpTriggerKind2) {
        SignatureHelpTriggerKind2.Invoked = 1;
        SignatureHelpTriggerKind2.TriggerCharacter = 2;
        SignatureHelpTriggerKind2.ContentChange = 3;
      })(SignatureHelpTriggerKind = exports.SignatureHelpTriggerKind || (exports.SignatureHelpTriggerKind = {}));
      var SignatureHelpRequest;
      (function(SignatureHelpRequest2) {
        SignatureHelpRequest2.method = "textDocument/signatureHelp";
        SignatureHelpRequest2.type = new messages_1.ProtocolRequestType(SignatureHelpRequest2.method);
      })(SignatureHelpRequest = exports.SignatureHelpRequest || (exports.SignatureHelpRequest = {}));
      var DefinitionRequest;
      (function(DefinitionRequest2) {
        DefinitionRequest2.method = "textDocument/definition";
        DefinitionRequest2.type = new messages_1.ProtocolRequestType(DefinitionRequest2.method);
      })(DefinitionRequest = exports.DefinitionRequest || (exports.DefinitionRequest = {}));
      var ReferencesRequest;
      (function(ReferencesRequest2) {
        ReferencesRequest2.method = "textDocument/references";
        ReferencesRequest2.type = new messages_1.ProtocolRequestType(ReferencesRequest2.method);
      })(ReferencesRequest = exports.ReferencesRequest || (exports.ReferencesRequest = {}));
      var DocumentHighlightRequest2;
      (function(DocumentHighlightRequest3) {
        DocumentHighlightRequest3.method = "textDocument/documentHighlight";
        DocumentHighlightRequest3.type = new messages_1.ProtocolRequestType(DocumentHighlightRequest3.method);
      })(DocumentHighlightRequest2 = exports.DocumentHighlightRequest || (exports.DocumentHighlightRequest = {}));
      var DocumentSymbolRequest2;
      (function(DocumentSymbolRequest3) {
        DocumentSymbolRequest3.method = "textDocument/documentSymbol";
        DocumentSymbolRequest3.type = new messages_1.ProtocolRequestType(DocumentSymbolRequest3.method);
      })(DocumentSymbolRequest2 = exports.DocumentSymbolRequest || (exports.DocumentSymbolRequest = {}));
      var CodeActionRequest;
      (function(CodeActionRequest2) {
        CodeActionRequest2.method = "textDocument/codeAction";
        CodeActionRequest2.type = new messages_1.ProtocolRequestType(CodeActionRequest2.method);
      })(CodeActionRequest = exports.CodeActionRequest || (exports.CodeActionRequest = {}));
      var CodeActionResolveRequest;
      (function(CodeActionResolveRequest2) {
        CodeActionResolveRequest2.method = "codeAction/resolve";
        CodeActionResolveRequest2.type = new messages_1.ProtocolRequestType(CodeActionResolveRequest2.method);
      })(CodeActionResolveRequest = exports.CodeActionResolveRequest || (exports.CodeActionResolveRequest = {}));
      var WorkspaceSymbolRequest;
      (function(WorkspaceSymbolRequest2) {
        WorkspaceSymbolRequest2.method = "workspace/symbol";
        WorkspaceSymbolRequest2.type = new messages_1.ProtocolRequestType(WorkspaceSymbolRequest2.method);
      })(WorkspaceSymbolRequest = exports.WorkspaceSymbolRequest || (exports.WorkspaceSymbolRequest = {}));
      var WorkspaceSymbolResolveRequest;
      (function(WorkspaceSymbolResolveRequest2) {
        WorkspaceSymbolResolveRequest2.method = "workspaceSymbol/resolve";
        WorkspaceSymbolResolveRequest2.type = new messages_1.ProtocolRequestType(WorkspaceSymbolResolveRequest2.method);
      })(WorkspaceSymbolResolveRequest = exports.WorkspaceSymbolResolveRequest || (exports.WorkspaceSymbolResolveRequest = {}));
      var CodeLensRequest;
      (function(CodeLensRequest2) {
        CodeLensRequest2.method = "textDocument/codeLens";
        CodeLensRequest2.type = new messages_1.ProtocolRequestType(CodeLensRequest2.method);
      })(CodeLensRequest = exports.CodeLensRequest || (exports.CodeLensRequest = {}));
      var CodeLensResolveRequest;
      (function(CodeLensResolveRequest2) {
        CodeLensResolveRequest2.method = "codeLens/resolve";
        CodeLensResolveRequest2.type = new messages_1.ProtocolRequestType(CodeLensResolveRequest2.method);
      })(CodeLensResolveRequest = exports.CodeLensResolveRequest || (exports.CodeLensResolveRequest = {}));
      var CodeLensRefreshRequest;
      (function(CodeLensRefreshRequest2) {
        CodeLensRefreshRequest2.method = `workspace/codeLens/refresh`;
        CodeLensRefreshRequest2.type = new messages_1.ProtocolRequestType0(CodeLensRefreshRequest2.method);
      })(CodeLensRefreshRequest = exports.CodeLensRefreshRequest || (exports.CodeLensRefreshRequest = {}));
      var DocumentLinkRequest;
      (function(DocumentLinkRequest2) {
        DocumentLinkRequest2.method = "textDocument/documentLink";
        DocumentLinkRequest2.type = new messages_1.ProtocolRequestType(DocumentLinkRequest2.method);
      })(DocumentLinkRequest = exports.DocumentLinkRequest || (exports.DocumentLinkRequest = {}));
      var DocumentLinkResolveRequest;
      (function(DocumentLinkResolveRequest2) {
        DocumentLinkResolveRequest2.method = "documentLink/resolve";
        DocumentLinkResolveRequest2.type = new messages_1.ProtocolRequestType(DocumentLinkResolveRequest2.method);
      })(DocumentLinkResolveRequest = exports.DocumentLinkResolveRequest || (exports.DocumentLinkResolveRequest = {}));
      var DocumentFormattingRequest;
      (function(DocumentFormattingRequest2) {
        DocumentFormattingRequest2.method = "textDocument/formatting";
        DocumentFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentFormattingRequest2.method);
      })(DocumentFormattingRequest = exports.DocumentFormattingRequest || (exports.DocumentFormattingRequest = {}));
      var DocumentRangeFormattingRequest;
      (function(DocumentRangeFormattingRequest2) {
        DocumentRangeFormattingRequest2.method = "textDocument/rangeFormatting";
        DocumentRangeFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentRangeFormattingRequest2.method);
      })(DocumentRangeFormattingRequest = exports.DocumentRangeFormattingRequest || (exports.DocumentRangeFormattingRequest = {}));
      var DocumentOnTypeFormattingRequest;
      (function(DocumentOnTypeFormattingRequest2) {
        DocumentOnTypeFormattingRequest2.method = "textDocument/onTypeFormatting";
        DocumentOnTypeFormattingRequest2.type = new messages_1.ProtocolRequestType(DocumentOnTypeFormattingRequest2.method);
      })(DocumentOnTypeFormattingRequest = exports.DocumentOnTypeFormattingRequest || (exports.DocumentOnTypeFormattingRequest = {}));
      var PrepareSupportDefaultBehavior;
      (function(PrepareSupportDefaultBehavior2) {
        PrepareSupportDefaultBehavior2.Identifier = 1;
      })(PrepareSupportDefaultBehavior = exports.PrepareSupportDefaultBehavior || (exports.PrepareSupportDefaultBehavior = {}));
      var RenameRequest;
      (function(RenameRequest2) {
        RenameRequest2.method = "textDocument/rename";
        RenameRequest2.type = new messages_1.ProtocolRequestType(RenameRequest2.method);
      })(RenameRequest = exports.RenameRequest || (exports.RenameRequest = {}));
      var PrepareRenameRequest;
      (function(PrepareRenameRequest2) {
        PrepareRenameRequest2.method = "textDocument/prepareRename";
        PrepareRenameRequest2.type = new messages_1.ProtocolRequestType(PrepareRenameRequest2.method);
      })(PrepareRenameRequest = exports.PrepareRenameRequest || (exports.PrepareRenameRequest = {}));
      var ExecuteCommandRequest;
      (function(ExecuteCommandRequest2) {
        ExecuteCommandRequest2.type = new messages_1.ProtocolRequestType("workspace/executeCommand");
      })(ExecuteCommandRequest = exports.ExecuteCommandRequest || (exports.ExecuteCommandRequest = {}));
      var ApplyWorkspaceEditRequest;
      (function(ApplyWorkspaceEditRequest2) {
        ApplyWorkspaceEditRequest2.type = new messages_1.ProtocolRequestType("workspace/applyEdit");
      })(ApplyWorkspaceEditRequest = exports.ApplyWorkspaceEditRequest || (exports.ApplyWorkspaceEditRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/connection.js
  var require_connection2 = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/connection.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createProtocolConnection = void 0;
      var vscode_jsonrpc_1 = require_main();
      function createProtocolConnection(input, output, logger, options) {
        if (vscode_jsonrpc_1.ConnectionStrategy.is(options)) {
          options = { connectionStrategy: options };
        }
        return (0, vscode_jsonrpc_1.createMessageConnection)(input, output, logger, options);
      }
      exports.createProtocolConnection = createProtocolConnection;
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/proposed.diagnostic.js
  var require_proposed_diagnostic = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/proposed.diagnostic.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DiagnosticRefreshRequest = exports.WorkspaceDiagnosticRequest = exports.DocumentDiagnosticRequest = exports.DocumentDiagnosticReportKind = exports.DiagnosticServerCancellationData = void 0;
      var vscode_jsonrpc_1 = require_main();
      var Is = require_is2();
      var messages_1 = require_messages2();
      var DiagnosticServerCancellationData;
      (function(DiagnosticServerCancellationData2) {
        function is(value) {
          const candidate = value;
          return candidate && Is.boolean(candidate.retriggerRequest);
        }
        DiagnosticServerCancellationData2.is = is;
      })(DiagnosticServerCancellationData = exports.DiagnosticServerCancellationData || (exports.DiagnosticServerCancellationData = {}));
      var DocumentDiagnosticReportKind;
      (function(DocumentDiagnosticReportKind2) {
        DocumentDiagnosticReportKind2["full"] = "full";
        DocumentDiagnosticReportKind2["unChanged"] = "unChanged";
      })(DocumentDiagnosticReportKind = exports.DocumentDiagnosticReportKind || (exports.DocumentDiagnosticReportKind = {}));
      var DocumentDiagnosticRequest;
      (function(DocumentDiagnosticRequest2) {
        DocumentDiagnosticRequest2.method = "textDocument/diagnostic";
        DocumentDiagnosticRequest2.type = new messages_1.ProtocolRequestType(DocumentDiagnosticRequest2.method);
        DocumentDiagnosticRequest2.partialResult = new vscode_jsonrpc_1.ProgressType();
      })(DocumentDiagnosticRequest = exports.DocumentDiagnosticRequest || (exports.DocumentDiagnosticRequest = {}));
      var WorkspaceDiagnosticRequest;
      (function(WorkspaceDiagnosticRequest2) {
        WorkspaceDiagnosticRequest2.method = "workspace/diagnostic";
        WorkspaceDiagnosticRequest2.type = new messages_1.ProtocolRequestType(WorkspaceDiagnosticRequest2.method);
        WorkspaceDiagnosticRequest2.partialResult = new vscode_jsonrpc_1.ProgressType();
      })(WorkspaceDiagnosticRequest = exports.WorkspaceDiagnosticRequest || (exports.WorkspaceDiagnosticRequest = {}));
      var DiagnosticRefreshRequest;
      (function(DiagnosticRefreshRequest2) {
        DiagnosticRefreshRequest2.method = `workspace/diagnostic/refresh`;
        DiagnosticRefreshRequest2.type = new messages_1.ProtocolRequestType0(DiagnosticRefreshRequest2.method);
      })(DiagnosticRefreshRequest = exports.DiagnosticRefreshRequest || (exports.DiagnosticRefreshRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/proposed.typeHierarchy.js
  var require_proposed_typeHierarchy = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/proposed.typeHierarchy.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TypeHierarchySubtypesRequest = exports.TypeHierarchySupertypesRequest = exports.TypeHierarchyPrepareRequest = void 0;
      var messages_1 = require_messages2();
      var TypeHierarchyPrepareRequest;
      (function(TypeHierarchyPrepareRequest2) {
        TypeHierarchyPrepareRequest2.method = "textDocument/prepareTypeHierarchy";
        TypeHierarchyPrepareRequest2.type = new messages_1.ProtocolRequestType(TypeHierarchyPrepareRequest2.method);
      })(TypeHierarchyPrepareRequest = exports.TypeHierarchyPrepareRequest || (exports.TypeHierarchyPrepareRequest = {}));
      var TypeHierarchySupertypesRequest;
      (function(TypeHierarchySupertypesRequest2) {
        TypeHierarchySupertypesRequest2.method = "typeHierarchy/supertypes";
        TypeHierarchySupertypesRequest2.type = new messages_1.ProtocolRequestType(TypeHierarchySupertypesRequest2.method);
      })(TypeHierarchySupertypesRequest = exports.TypeHierarchySupertypesRequest || (exports.TypeHierarchySupertypesRequest = {}));
      var TypeHierarchySubtypesRequest;
      (function(TypeHierarchySubtypesRequest2) {
        TypeHierarchySubtypesRequest2.method = "typeHierarchy/subtypes";
        TypeHierarchySubtypesRequest2.type = new messages_1.ProtocolRequestType(TypeHierarchySubtypesRequest2.method);
      })(TypeHierarchySubtypesRequest = exports.TypeHierarchySubtypesRequest || (exports.TypeHierarchySubtypesRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/proposed.inlineValue.js
  var require_proposed_inlineValue = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/proposed.inlineValue.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.InlineValuesRefreshRequest = exports.InlineValuesRequest = void 0;
      var messages_1 = require_messages2();
      var InlineValuesRequest;
      (function(InlineValuesRequest2) {
        InlineValuesRequest2.method = "textDocument/inlineValues";
        InlineValuesRequest2.type = new messages_1.ProtocolRequestType(InlineValuesRequest2.method);
      })(InlineValuesRequest = exports.InlineValuesRequest || (exports.InlineValuesRequest = {}));
      var InlineValuesRefreshRequest;
      (function(InlineValuesRefreshRequest2) {
        InlineValuesRefreshRequest2.method = `workspace/inlineValues/refresh`;
        InlineValuesRefreshRequest2.type = new messages_1.ProtocolRequestType0(InlineValuesRefreshRequest2.method);
      })(InlineValuesRefreshRequest = exports.InlineValuesRefreshRequest || (exports.InlineValuesRefreshRequest = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/common/api.js
  var require_api2 = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/common/api.js"(exports) {
      init_define_process();
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Proposed = exports.LSPErrorCodes = exports.createProtocolConnection = void 0;
      __exportStar(require_main(), exports);
      __exportStar(require_main2(), exports);
      __exportStar(require_messages2(), exports);
      __exportStar(require_protocol(), exports);
      var connection_1 = require_connection2();
      Object.defineProperty(exports, "createProtocolConnection", { enumerable: true, get: function() {
        return connection_1.createProtocolConnection;
      } });
      var LSPErrorCodes;
      (function(LSPErrorCodes2) {
        LSPErrorCodes2.lspReservedErrorRangeStart = -32899;
        LSPErrorCodes2.RequestFailed = -32803;
        LSPErrorCodes2.ServerCancelled = -32802;
        LSPErrorCodes2.ContentModified = -32801;
        LSPErrorCodes2.RequestCancelled = -32800;
        LSPErrorCodes2.lspReservedErrorRangeEnd = -32800;
      })(LSPErrorCodes = exports.LSPErrorCodes || (exports.LSPErrorCodes = {}));
      var diag = require_proposed_diagnostic();
      var typeh = require_proposed_typeHierarchy();
      var iv = require_proposed_inlineValue();
      var Proposed;
      (function(Proposed2) {
        Proposed2.DiagnosticServerCancellationData = diag.DiagnosticServerCancellationData;
        Proposed2.DocumentDiagnosticReportKind = diag.DocumentDiagnosticReportKind;
        Proposed2.DocumentDiagnosticRequest = diag.DocumentDiagnosticRequest;
        Proposed2.WorkspaceDiagnosticRequest = diag.WorkspaceDiagnosticRequest;
        Proposed2.DiagnosticRefreshRequest = diag.DiagnosticRefreshRequest;
        Proposed2.TypeHierarchyPrepareRequest = typeh.TypeHierarchyPrepareRequest;
        Proposed2.TypeHierarchySupertypesRequest = typeh.TypeHierarchySupertypesRequest;
        Proposed2.TypeHierarchySubtypesRequest = typeh.TypeHierarchySubtypesRequest;
        Proposed2.InlineValuesRequest = iv.InlineValuesRequest;
        Proposed2.InlineValuesRefreshRequest = iv.InlineValuesRefreshRequest;
      })(Proposed = exports.Proposed || (exports.Proposed = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/lib/browser/main.js
  var require_main3 = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/lib/browser/main.js"(exports) {
      init_define_process();
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createProtocolConnection = void 0;
      var browser_1 = require_browser();
      __exportStar(require_browser(), exports);
      __exportStar(require_api2(), exports);
      function createProtocolConnection(reader, writer, logger, options) {
        return (0, browser_1.createMessageConnection)(reader, writer, logger, options);
      }
      exports.createProtocolConnection = createProtocolConnection;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/utils/is.js
  var require_is3 = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/utils/is.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.thenable = exports.typedArray = exports.stringArray = exports.array = exports.func = exports.error = exports.number = exports.string = exports.boolean = void 0;
      function boolean(value) {
        return value === true || value === false;
      }
      exports.boolean = boolean;
      function string(value) {
        return typeof value === "string" || value instanceof String;
      }
      exports.string = string;
      function number(value) {
        return typeof value === "number" || value instanceof Number;
      }
      exports.number = number;
      function error(value) {
        return value instanceof Error;
      }
      exports.error = error;
      function func(value) {
        return typeof value === "function";
      }
      exports.func = func;
      function array(value) {
        return Array.isArray(value);
      }
      exports.array = array;
      function stringArray(value) {
        return array(value) && value.every((elem) => string(elem));
      }
      exports.stringArray = stringArray;
      function typedArray(value, check) {
        return Array.isArray(value) && value.every(check);
      }
      exports.typedArray = typedArray;
      function thenable(value) {
        return value && func(value.then);
      }
      exports.thenable = thenable;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/utils/uuid.js
  var require_uuid = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/utils/uuid.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.generateUuid = exports.parse = exports.isUUID = exports.v4 = exports.empty = void 0;
      var ValueUUID = class {
        constructor(_value) {
          this._value = _value;
        }
        asHex() {
          return this._value;
        }
        equals(other) {
          return this.asHex() === other.asHex();
        }
      };
      var V4UUID = class extends ValueUUID {
        constructor() {
          super([
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            "-",
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            "-",
            "4",
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            "-",
            V4UUID._oneOf(V4UUID._timeHighBits),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            "-",
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex(),
            V4UUID._randomHex()
          ].join(""));
        }
        static _oneOf(array) {
          return array[Math.floor(array.length * Math.random())];
        }
        static _randomHex() {
          return V4UUID._oneOf(V4UUID._chars);
        }
      };
      V4UUID._chars = ["0", "1", "2", "3", "4", "5", "6", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
      V4UUID._timeHighBits = ["8", "9", "a", "b"];
      exports.empty = new ValueUUID("00000000-0000-0000-0000-000000000000");
      function v4() {
        return new V4UUID();
      }
      exports.v4 = v4;
      var _UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      function isUUID(value) {
        return _UUIDPattern.test(value);
      }
      exports.isUUID = isUUID;
      function parse(value) {
        if (!isUUID(value)) {
          throw new Error("invalid uuid");
        }
        return new ValueUUID(value);
      }
      exports.parse = parse;
      function generateUuid() {
        return v4().asHex();
      }
      exports.generateUuid = generateUuid;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/progress.js
  var require_progress = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/progress.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.attachPartialResult = exports.ProgressFeature = exports.attachWorkDone = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var uuid_1 = require_uuid();
      var WorkDoneProgressReporterImpl = class {
        constructor(_connection, _token) {
          this._connection = _connection;
          this._token = _token;
          WorkDoneProgressReporterImpl.Instances.set(this._token, this);
        }
        begin(title, percentage, message, cancellable) {
          let param = {
            kind: "begin",
            title,
            percentage,
            message,
            cancellable
          };
          this._connection.sendProgress(vscode_languageserver_protocol_1.WorkDoneProgress.type, this._token, param);
        }
        report(arg0, arg1) {
          let param = {
            kind: "report"
          };
          if (typeof arg0 === "number") {
            param.percentage = arg0;
            if (arg1 !== void 0) {
              param.message = arg1;
            }
          } else {
            param.message = arg0;
          }
          this._connection.sendProgress(vscode_languageserver_protocol_1.WorkDoneProgress.type, this._token, param);
        }
        done() {
          WorkDoneProgressReporterImpl.Instances.delete(this._token);
          this._connection.sendProgress(vscode_languageserver_protocol_1.WorkDoneProgress.type, this._token, { kind: "end" });
        }
      };
      WorkDoneProgressReporterImpl.Instances = new Map();
      var WorkDoneProgressServerReporterImpl = class extends WorkDoneProgressReporterImpl {
        constructor(connection, token) {
          super(connection, token);
          this._source = new vscode_languageserver_protocol_1.CancellationTokenSource();
        }
        get token() {
          return this._source.token;
        }
        done() {
          this._source.dispose();
          super.done();
        }
        cancel() {
          this._source.cancel();
        }
      };
      var NullProgressReporter = class {
        constructor() {
        }
        begin() {
        }
        report() {
        }
        done() {
        }
      };
      var NullProgressServerReporter = class extends NullProgressReporter {
        constructor() {
          super();
          this._source = new vscode_languageserver_protocol_1.CancellationTokenSource();
        }
        get token() {
          return this._source.token;
        }
        done() {
          this._source.dispose();
        }
        cancel() {
          this._source.cancel();
        }
      };
      function attachWorkDone(connection, params) {
        if (params === void 0 || params.workDoneToken === void 0) {
          return new NullProgressReporter();
        }
        const token = params.workDoneToken;
        delete params.workDoneToken;
        return new WorkDoneProgressReporterImpl(connection, token);
      }
      exports.attachWorkDone = attachWorkDone;
      var ProgressFeature = (Base) => {
        return class extends Base {
          constructor() {
            super();
            this._progressSupported = false;
          }
          initialize(capabilities) {
            super.initialize(capabilities);
            if (capabilities?.window?.workDoneProgress === true) {
              this._progressSupported = true;
              this.connection.onNotification(vscode_languageserver_protocol_1.WorkDoneProgressCancelNotification.type, (params) => {
                let progress = WorkDoneProgressReporterImpl.Instances.get(params.token);
                if (progress instanceof WorkDoneProgressServerReporterImpl || progress instanceof NullProgressServerReporter) {
                  progress.cancel();
                }
              });
            }
          }
          attachWorkDoneProgress(token) {
            if (token === void 0) {
              return new NullProgressReporter();
            } else {
              return new WorkDoneProgressReporterImpl(this.connection, token);
            }
          }
          createWorkDoneProgress() {
            if (this._progressSupported) {
              const token = (0, uuid_1.generateUuid)();
              return this.connection.sendRequest(vscode_languageserver_protocol_1.WorkDoneProgressCreateRequest.type, { token }).then(() => {
                const result = new WorkDoneProgressServerReporterImpl(this.connection, token);
                return result;
              });
            } else {
              return Promise.resolve(new NullProgressServerReporter());
            }
          }
        };
      };
      exports.ProgressFeature = ProgressFeature;
      var ResultProgress;
      (function(ResultProgress2) {
        ResultProgress2.type = new vscode_languageserver_protocol_1.ProgressType();
      })(ResultProgress || (ResultProgress = {}));
      var ResultProgressReporterImpl = class {
        constructor(_connection, _token) {
          this._connection = _connection;
          this._token = _token;
        }
        report(data) {
          this._connection.sendProgress(ResultProgress.type, this._token, data);
        }
      };
      function attachPartialResult(connection, params) {
        if (params === void 0 || params.partialResultToken === void 0) {
          return void 0;
        }
        const token = params.partialResultToken;
        delete params.partialResultToken;
        return new ResultProgressReporterImpl(connection, token);
      }
      exports.attachPartialResult = attachPartialResult;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/configuration.js
  var require_configuration = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/configuration.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ConfigurationFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var Is = require_is3();
      var ConfigurationFeature = (Base) => {
        return class extends Base {
          getConfiguration(arg) {
            if (!arg) {
              return this._getConfiguration({});
            } else if (Is.string(arg)) {
              return this._getConfiguration({ section: arg });
            } else {
              return this._getConfiguration(arg);
            }
          }
          _getConfiguration(arg) {
            let params = {
              items: Array.isArray(arg) ? arg : [arg]
            };
            return this.connection.sendRequest(vscode_languageserver_protocol_1.ConfigurationRequest.type, params).then((result) => {
              if (Array.isArray(result)) {
                return Array.isArray(arg) ? result : result[0];
              } else {
                return Array.isArray(arg) ? [] : null;
              }
            });
          }
        };
      };
      exports.ConfigurationFeature = ConfigurationFeature;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/workspaceFolders.js
  var require_workspaceFolders = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/workspaceFolders.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.WorkspaceFoldersFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var WorkspaceFoldersFeature = (Base) => {
        return class extends Base {
          constructor() {
            super();
            this._notificationIsAutoRegistered = false;
          }
          initialize(capabilities) {
            super.initialize(capabilities);
            let workspaceCapabilities = capabilities.workspace;
            if (workspaceCapabilities && workspaceCapabilities.workspaceFolders) {
              this._onDidChangeWorkspaceFolders = new vscode_languageserver_protocol_1.Emitter();
              this.connection.onNotification(vscode_languageserver_protocol_1.DidChangeWorkspaceFoldersNotification.type, (params) => {
                this._onDidChangeWorkspaceFolders.fire(params.event);
              });
            }
          }
          fillServerCapabilities(capabilities) {
            super.fillServerCapabilities(capabilities);
            const changeNotifications = capabilities.workspace?.workspaceFolders?.changeNotifications;
            this._notificationIsAutoRegistered = changeNotifications === true || typeof changeNotifications === "string";
          }
          getWorkspaceFolders() {
            return this.connection.sendRequest(vscode_languageserver_protocol_1.WorkspaceFoldersRequest.type);
          }
          get onDidChangeWorkspaceFolders() {
            if (!this._onDidChangeWorkspaceFolders) {
              throw new Error("Client doesn't support sending workspace folder change events.");
            }
            if (!this._notificationIsAutoRegistered && !this._unregistration) {
              this._unregistration = this.connection.client.register(vscode_languageserver_protocol_1.DidChangeWorkspaceFoldersNotification.type);
            }
            return this._onDidChangeWorkspaceFolders.event;
          }
        };
      };
      exports.WorkspaceFoldersFeature = WorkspaceFoldersFeature;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/callHierarchy.js
  var require_callHierarchy = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/callHierarchy.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.CallHierarchyFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var CallHierarchyFeature = (Base) => {
        return class extends Base {
          get callHierarchy() {
            return {
              onPrepare: (handler) => {
                this.connection.onRequest(vscode_languageserver_protocol_1.CallHierarchyPrepareRequest.type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), void 0);
                });
              },
              onIncomingCalls: (handler) => {
                const type = vscode_languageserver_protocol_1.CallHierarchyIncomingCallsRequest.type;
                this.connection.onRequest(type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
                });
              },
              onOutgoingCalls: (handler) => {
                const type = vscode_languageserver_protocol_1.CallHierarchyOutgoingCallsRequest.type;
                this.connection.onRequest(type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
                });
              }
            };
          }
        };
      };
      exports.CallHierarchyFeature = CallHierarchyFeature;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/semanticTokens.js
  var require_semanticTokens = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/semanticTokens.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SemanticTokensBuilder = exports.SemanticTokensDiff = exports.SemanticTokensFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var SemanticTokensFeature = (Base) => {
        return class extends Base {
          get semanticTokens() {
            return {
              refresh: () => {
                return this.connection.sendRequest(vscode_languageserver_protocol_1.SemanticTokensRefreshRequest.type);
              },
              on: (handler) => {
                const type = vscode_languageserver_protocol_1.SemanticTokensRequest.type;
                this.connection.onRequest(type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
                });
              },
              onDelta: (handler) => {
                const type = vscode_languageserver_protocol_1.SemanticTokensDeltaRequest.type;
                this.connection.onRequest(type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
                });
              },
              onRange: (handler) => {
                const type = vscode_languageserver_protocol_1.SemanticTokensRangeRequest.type;
                this.connection.onRequest(type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
                });
              }
            };
          }
        };
      };
      exports.SemanticTokensFeature = SemanticTokensFeature;
      var SemanticTokensDiff = class {
        constructor(originalSequence, modifiedSequence) {
          this.originalSequence = originalSequence;
          this.modifiedSequence = modifiedSequence;
        }
        computeDiff() {
          const originalLength = this.originalSequence.length;
          const modifiedLength = this.modifiedSequence.length;
          let startIndex = 0;
          while (startIndex < modifiedLength && startIndex < originalLength && this.originalSequence[startIndex] === this.modifiedSequence[startIndex]) {
            startIndex++;
          }
          if (startIndex < modifiedLength && startIndex < originalLength) {
            let originalEndIndex = originalLength - 1;
            let modifiedEndIndex = modifiedLength - 1;
            while (originalEndIndex >= startIndex && modifiedEndIndex >= startIndex && this.originalSequence[originalEndIndex] === this.modifiedSequence[modifiedEndIndex]) {
              originalEndIndex--;
              modifiedEndIndex--;
            }
            if (originalEndIndex < startIndex || modifiedEndIndex < startIndex) {
              originalEndIndex++;
              modifiedEndIndex++;
            }
            const deleteCount = originalEndIndex - startIndex + 1;
            const newData = this.modifiedSequence.slice(startIndex, modifiedEndIndex + 1);
            if (newData.length === 1 && newData[0] === this.originalSequence[originalEndIndex]) {
              return [
                { start: startIndex, deleteCount: deleteCount - 1 }
              ];
            } else {
              return [
                { start: startIndex, deleteCount, data: newData }
              ];
            }
          } else if (startIndex < modifiedLength) {
            return [
              { start: startIndex, deleteCount: 0, data: this.modifiedSequence.slice(startIndex) }
            ];
          } else if (startIndex < originalLength) {
            return [
              { start: startIndex, deleteCount: originalLength - startIndex }
            ];
          } else {
            return [];
          }
        }
      };
      exports.SemanticTokensDiff = SemanticTokensDiff;
      var SemanticTokensBuilder = class {
        constructor() {
          this._prevData = void 0;
          this.initialize();
        }
        initialize() {
          this._id = Date.now();
          this._prevLine = 0;
          this._prevChar = 0;
          this._data = [];
          this._dataLen = 0;
        }
        push(line, char, length, tokenType, tokenModifiers) {
          let pushLine = line;
          let pushChar = char;
          if (this._dataLen > 0) {
            pushLine -= this._prevLine;
            if (pushLine === 0) {
              pushChar -= this._prevChar;
            }
          }
          this._data[this._dataLen++] = pushLine;
          this._data[this._dataLen++] = pushChar;
          this._data[this._dataLen++] = length;
          this._data[this._dataLen++] = tokenType;
          this._data[this._dataLen++] = tokenModifiers;
          this._prevLine = line;
          this._prevChar = char;
        }
        get id() {
          return this._id.toString();
        }
        previousResult(id) {
          if (this.id === id) {
            this._prevData = this._data;
          }
          this.initialize();
        }
        build() {
          this._prevData = void 0;
          return {
            resultId: this.id,
            data: this._data
          };
        }
        canBuildEdits() {
          return this._prevData !== void 0;
        }
        buildEdits() {
          if (this._prevData !== void 0) {
            return {
              resultId: this.id,
              edits: new SemanticTokensDiff(this._prevData, this._data).computeDiff()
            };
          } else {
            return this.build();
          }
        }
      };
      exports.SemanticTokensBuilder = SemanticTokensBuilder;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/showDocument.js
  var require_showDocument = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/showDocument.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ShowDocumentFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var ShowDocumentFeature = (Base) => {
        return class extends Base {
          showDocument(params) {
            return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowDocumentRequest.type, params);
          }
        };
      };
      exports.ShowDocumentFeature = ShowDocumentFeature;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/fileOperations.js
  var require_fileOperations = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/fileOperations.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FileOperationsFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var FileOperationsFeature = (Base) => {
        return class extends Base {
          onDidCreateFiles(handler) {
            this.connection.onNotification(vscode_languageserver_protocol_1.DidCreateFilesNotification.type, (params) => {
              handler(params);
            });
          }
          onDidRenameFiles(handler) {
            this.connection.onNotification(vscode_languageserver_protocol_1.DidRenameFilesNotification.type, (params) => {
              handler(params);
            });
          }
          onDidDeleteFiles(handler) {
            this.connection.onNotification(vscode_languageserver_protocol_1.DidDeleteFilesNotification.type, (params) => {
              handler(params);
            });
          }
          onWillCreateFiles(handler) {
            return this.connection.onRequest(vscode_languageserver_protocol_1.WillCreateFilesRequest.type, (params, cancel) => {
              return handler(params, cancel);
            });
          }
          onWillRenameFiles(handler) {
            return this.connection.onRequest(vscode_languageserver_protocol_1.WillRenameFilesRequest.type, (params, cancel) => {
              return handler(params, cancel);
            });
          }
          onWillDeleteFiles(handler) {
            return this.connection.onRequest(vscode_languageserver_protocol_1.WillDeleteFilesRequest.type, (params, cancel) => {
              return handler(params, cancel);
            });
          }
        };
      };
      exports.FileOperationsFeature = FileOperationsFeature;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/linkedEditingRange.js
  var require_linkedEditingRange = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/linkedEditingRange.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LinkedEditingRangeFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var LinkedEditingRangeFeature = (Base) => {
        return class extends Base {
          onLinkedEditingRange(handler) {
            this.connection.onRequest(vscode_languageserver_protocol_1.LinkedEditingRangeRequest.type, (params, cancel) => {
              return handler(params, cancel, this.attachWorkDoneProgress(params), void 0);
            });
          }
        };
      };
      exports.LinkedEditingRangeFeature = LinkedEditingRangeFeature;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/moniker.js
  var require_moniker = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/moniker.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.MonikerFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var MonikerFeature = (Base) => {
        return class extends Base {
          get moniker() {
            return {
              on: (handler) => {
                const type = vscode_languageserver_protocol_1.MonikerRequest.type;
                this.connection.onRequest(type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
                });
              }
            };
          }
        };
      };
      exports.MonikerFeature = MonikerFeature;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/server.js
  var require_server = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/server.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createConnection = exports.combineFeatures = exports.combineLanguagesFeatures = exports.combineWorkspaceFeatures = exports.combineWindowFeatures = exports.combineClientFeatures = exports.combineTracerFeatures = exports.combineTelemetryFeatures = exports.combineConsoleFeatures = exports._LanguagesImpl = exports.BulkUnregistration = exports.BulkRegistration = exports.ErrorMessageTracker = exports.TextDocuments = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var Is = require_is3();
      var UUID = require_uuid();
      var progress_1 = require_progress();
      var configuration_1 = require_configuration();
      var workspaceFolders_1 = require_workspaceFolders();
      var callHierarchy_1 = require_callHierarchy();
      var semanticTokens_1 = require_semanticTokens();
      var showDocument_1 = require_showDocument();
      var fileOperations_1 = require_fileOperations();
      var linkedEditingRange_1 = require_linkedEditingRange();
      var moniker_1 = require_moniker();
      function null2Undefined(value) {
        if (value === null) {
          return void 0;
        }
        return value;
      }
      var TextDocuments2 = class {
        constructor(configuration) {
          this._documents = Object.create(null);
          this._configuration = configuration;
          this._onDidChangeContent = new vscode_languageserver_protocol_1.Emitter();
          this._onDidOpen = new vscode_languageserver_protocol_1.Emitter();
          this._onDidClose = new vscode_languageserver_protocol_1.Emitter();
          this._onDidSave = new vscode_languageserver_protocol_1.Emitter();
          this._onWillSave = new vscode_languageserver_protocol_1.Emitter();
        }
        get onDidChangeContent() {
          return this._onDidChangeContent.event;
        }
        get onDidOpen() {
          return this._onDidOpen.event;
        }
        get onWillSave() {
          return this._onWillSave.event;
        }
        onWillSaveWaitUntil(handler) {
          this._willSaveWaitUntil = handler;
        }
        get onDidSave() {
          return this._onDidSave.event;
        }
        get onDidClose() {
          return this._onDidClose.event;
        }
        get(uri) {
          return this._documents[uri];
        }
        all() {
          return Object.keys(this._documents).map((key) => this._documents[key]);
        }
        keys() {
          return Object.keys(this._documents);
        }
        listen(connection) {
          connection.__textDocumentSync = vscode_languageserver_protocol_1.TextDocumentSyncKind.Full;
          connection.onDidOpenTextDocument((event) => {
            let td = event.textDocument;
            let document = this._configuration.create(td.uri, td.languageId, td.version, td.text);
            this._documents[td.uri] = document;
            let toFire = Object.freeze({ document });
            this._onDidOpen.fire(toFire);
            this._onDidChangeContent.fire(toFire);
          });
          connection.onDidChangeTextDocument((event) => {
            let td = event.textDocument;
            let changes = event.contentChanges;
            if (changes.length === 0) {
              return;
            }
            let document = this._documents[td.uri];
            const { version } = td;
            if (version === null || version === void 0) {
              throw new Error(`Received document change event for ${td.uri} without valid version identifier`);
            }
            document = this._configuration.update(document, changes, version);
            this._documents[td.uri] = document;
            this._onDidChangeContent.fire(Object.freeze({ document }));
          });
          connection.onDidCloseTextDocument((event) => {
            let document = this._documents[event.textDocument.uri];
            if (document) {
              delete this._documents[event.textDocument.uri];
              this._onDidClose.fire(Object.freeze({ document }));
            }
          });
          connection.onWillSaveTextDocument((event) => {
            let document = this._documents[event.textDocument.uri];
            if (document) {
              this._onWillSave.fire(Object.freeze({ document, reason: event.reason }));
            }
          });
          connection.onWillSaveTextDocumentWaitUntil((event, token) => {
            let document = this._documents[event.textDocument.uri];
            if (document && this._willSaveWaitUntil) {
              return this._willSaveWaitUntil(Object.freeze({ document, reason: event.reason }), token);
            } else {
              return [];
            }
          });
          connection.onDidSaveTextDocument((event) => {
            let document = this._documents[event.textDocument.uri];
            if (document) {
              this._onDidSave.fire(Object.freeze({ document }));
            }
          });
        }
      };
      exports.TextDocuments = TextDocuments2;
      var ErrorMessageTracker = class {
        constructor() {
          this._messages = Object.create(null);
        }
        add(message) {
          let count = this._messages[message];
          if (!count) {
            count = 0;
          }
          count++;
          this._messages[message] = count;
        }
        sendErrors(connection) {
          Object.keys(this._messages).forEach((message) => {
            connection.window.showErrorMessage(message);
          });
        }
      };
      exports.ErrorMessageTracker = ErrorMessageTracker;
      var RemoteConsoleImpl = class {
        constructor() {
        }
        rawAttach(connection) {
          this._rawConnection = connection;
        }
        attach(connection) {
          this._connection = connection;
        }
        get connection() {
          if (!this._connection) {
            throw new Error("Remote is not attached to a connection yet.");
          }
          return this._connection;
        }
        fillServerCapabilities(_capabilities) {
        }
        initialize(_capabilities) {
        }
        error(message) {
          this.send(vscode_languageserver_protocol_1.MessageType.Error, message);
        }
        warn(message) {
          this.send(vscode_languageserver_protocol_1.MessageType.Warning, message);
        }
        info(message) {
          this.send(vscode_languageserver_protocol_1.MessageType.Info, message);
        }
        log(message) {
          this.send(vscode_languageserver_protocol_1.MessageType.Log, message);
        }
        send(type, message) {
          if (this._rawConnection) {
            this._rawConnection.sendNotification(vscode_languageserver_protocol_1.LogMessageNotification.type, { type, message }).catch(() => {
              (0, vscode_languageserver_protocol_1.RAL)().console.error(`Sending log message failed`);
            });
          }
        }
      };
      var _RemoteWindowImpl = class {
        constructor() {
        }
        attach(connection) {
          this._connection = connection;
        }
        get connection() {
          if (!this._connection) {
            throw new Error("Remote is not attached to a connection yet.");
          }
          return this._connection;
        }
        initialize(_capabilities) {
        }
        fillServerCapabilities(_capabilities) {
        }
        showErrorMessage(message, ...actions) {
          let params = { type: vscode_languageserver_protocol_1.MessageType.Error, message, actions };
          return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, params).then(null2Undefined);
        }
        showWarningMessage(message, ...actions) {
          let params = { type: vscode_languageserver_protocol_1.MessageType.Warning, message, actions };
          return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, params).then(null2Undefined);
        }
        showInformationMessage(message, ...actions) {
          let params = { type: vscode_languageserver_protocol_1.MessageType.Info, message, actions };
          return this.connection.sendRequest(vscode_languageserver_protocol_1.ShowMessageRequest.type, params).then(null2Undefined);
        }
      };
      var RemoteWindowImpl = (0, showDocument_1.ShowDocumentFeature)((0, progress_1.ProgressFeature)(_RemoteWindowImpl));
      var BulkRegistration;
      (function(BulkRegistration2) {
        function create() {
          return new BulkRegistrationImpl();
        }
        BulkRegistration2.create = create;
      })(BulkRegistration = exports.BulkRegistration || (exports.BulkRegistration = {}));
      var BulkRegistrationImpl = class {
        constructor() {
          this._registrations = [];
          this._registered = new Set();
        }
        add(type, registerOptions) {
          const method = Is.string(type) ? type : type.method;
          if (this._registered.has(method)) {
            throw new Error(`${method} is already added to this registration`);
          }
          const id = UUID.generateUuid();
          this._registrations.push({
            id,
            method,
            registerOptions: registerOptions || {}
          });
          this._registered.add(method);
        }
        asRegistrationParams() {
          return {
            registrations: this._registrations
          };
        }
      };
      var BulkUnregistration;
      (function(BulkUnregistration2) {
        function create() {
          return new BulkUnregistrationImpl(void 0, []);
        }
        BulkUnregistration2.create = create;
      })(BulkUnregistration = exports.BulkUnregistration || (exports.BulkUnregistration = {}));
      var BulkUnregistrationImpl = class {
        constructor(_connection, unregistrations) {
          this._connection = _connection;
          this._unregistrations = new Map();
          unregistrations.forEach((unregistration) => {
            this._unregistrations.set(unregistration.method, unregistration);
          });
        }
        get isAttached() {
          return !!this._connection;
        }
        attach(connection) {
          this._connection = connection;
        }
        add(unregistration) {
          this._unregistrations.set(unregistration.method, unregistration);
        }
        dispose() {
          let unregistrations = [];
          for (let unregistration of this._unregistrations.values()) {
            unregistrations.push(unregistration);
          }
          let params = {
            unregisterations: unregistrations
          };
          this._connection.sendRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params).catch(() => {
            this._connection.console.info(`Bulk unregistration failed.`);
          });
        }
        disposeSingle(arg) {
          const method = Is.string(arg) ? arg : arg.method;
          const unregistration = this._unregistrations.get(method);
          if (!unregistration) {
            return false;
          }
          let params = {
            unregisterations: [unregistration]
          };
          this._connection.sendRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params).then(() => {
            this._unregistrations.delete(method);
          }, (_error) => {
            this._connection.console.info(`Un-registering request handler for ${unregistration.id} failed.`);
          });
          return true;
        }
      };
      var RemoteClientImpl = class {
        attach(connection) {
          this._connection = connection;
        }
        get connection() {
          if (!this._connection) {
            throw new Error("Remote is not attached to a connection yet.");
          }
          return this._connection;
        }
        initialize(_capabilities) {
        }
        fillServerCapabilities(_capabilities) {
        }
        register(typeOrRegistrations, registerOptionsOrType, registerOptions) {
          if (typeOrRegistrations instanceof BulkRegistrationImpl) {
            return this.registerMany(typeOrRegistrations);
          } else if (typeOrRegistrations instanceof BulkUnregistrationImpl) {
            return this.registerSingle1(typeOrRegistrations, registerOptionsOrType, registerOptions);
          } else {
            return this.registerSingle2(typeOrRegistrations, registerOptionsOrType);
          }
        }
        registerSingle1(unregistration, type, registerOptions) {
          const method = Is.string(type) ? type : type.method;
          const id = UUID.generateUuid();
          let params = {
            registrations: [{ id, method, registerOptions: registerOptions || {} }]
          };
          if (!unregistration.isAttached) {
            unregistration.attach(this.connection);
          }
          return this.connection.sendRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params).then((_result) => {
            unregistration.add({ id, method });
            return unregistration;
          }, (_error) => {
            this.connection.console.info(`Registering request handler for ${method} failed.`);
            return Promise.reject(_error);
          });
        }
        registerSingle2(type, registerOptions) {
          const method = Is.string(type) ? type : type.method;
          const id = UUID.generateUuid();
          let params = {
            registrations: [{ id, method, registerOptions: registerOptions || {} }]
          };
          return this.connection.sendRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params).then((_result) => {
            return vscode_languageserver_protocol_1.Disposable.create(() => {
              this.unregisterSingle(id, method).catch(() => {
                this.connection.console.info(`Un-registering capability with id ${id} failed.`);
              });
            });
          }, (_error) => {
            this.connection.console.info(`Registering request handler for ${method} failed.`);
            return Promise.reject(_error);
          });
        }
        unregisterSingle(id, method) {
          let params = {
            unregisterations: [{ id, method }]
          };
          return this.connection.sendRequest(vscode_languageserver_protocol_1.UnregistrationRequest.type, params).catch(() => {
            this.connection.console.info(`Un-registering request handler for ${id} failed.`);
          });
        }
        registerMany(registrations) {
          let params = registrations.asRegistrationParams();
          return this.connection.sendRequest(vscode_languageserver_protocol_1.RegistrationRequest.type, params).then(() => {
            return new BulkUnregistrationImpl(this._connection, params.registrations.map((registration) => {
              return { id: registration.id, method: registration.method };
            }));
          }, (_error) => {
            this.connection.console.info(`Bulk registration failed.`);
            return Promise.reject(_error);
          });
        }
      };
      var _RemoteWorkspaceImpl = class {
        constructor() {
        }
        attach(connection) {
          this._connection = connection;
        }
        get connection() {
          if (!this._connection) {
            throw new Error("Remote is not attached to a connection yet.");
          }
          return this._connection;
        }
        initialize(_capabilities) {
        }
        fillServerCapabilities(_capabilities) {
        }
        applyEdit(paramOrEdit) {
          function isApplyWorkspaceEditParams(value) {
            return value && !!value.edit;
          }
          let params = isApplyWorkspaceEditParams(paramOrEdit) ? paramOrEdit : { edit: paramOrEdit };
          return this.connection.sendRequest(vscode_languageserver_protocol_1.ApplyWorkspaceEditRequest.type, params);
        }
      };
      var RemoteWorkspaceImpl = (0, fileOperations_1.FileOperationsFeature)((0, workspaceFolders_1.WorkspaceFoldersFeature)((0, configuration_1.ConfigurationFeature)(_RemoteWorkspaceImpl)));
      var TracerImpl = class {
        constructor() {
          this._trace = vscode_languageserver_protocol_1.Trace.Off;
        }
        attach(connection) {
          this._connection = connection;
        }
        get connection() {
          if (!this._connection) {
            throw new Error("Remote is not attached to a connection yet.");
          }
          return this._connection;
        }
        initialize(_capabilities) {
        }
        fillServerCapabilities(_capabilities) {
        }
        set trace(value) {
          this._trace = value;
        }
        log(message, verbose) {
          if (this._trace === vscode_languageserver_protocol_1.Trace.Off) {
            return;
          }
          this.connection.sendNotification(vscode_languageserver_protocol_1.LogTraceNotification.type, {
            message,
            verbose: this._trace === vscode_languageserver_protocol_1.Trace.Verbose ? verbose : void 0
          });
        }
      };
      var TelemetryImpl = class {
        constructor() {
        }
        attach(connection) {
          this._connection = connection;
        }
        get connection() {
          if (!this._connection) {
            throw new Error("Remote is not attached to a connection yet.");
          }
          return this._connection;
        }
        initialize(_capabilities) {
        }
        fillServerCapabilities(_capabilities) {
        }
        logEvent(data) {
          this.connection.sendNotification(vscode_languageserver_protocol_1.TelemetryEventNotification.type, data);
        }
      };
      var _LanguagesImpl = class {
        constructor() {
        }
        attach(connection) {
          this._connection = connection;
        }
        get connection() {
          if (!this._connection) {
            throw new Error("Remote is not attached to a connection yet.");
          }
          return this._connection;
        }
        initialize(_capabilities) {
        }
        fillServerCapabilities(_capabilities) {
        }
        attachWorkDoneProgress(params) {
          return (0, progress_1.attachWorkDone)(this.connection, params);
        }
        attachPartialResultProgress(_type, params) {
          return (0, progress_1.attachPartialResult)(this.connection, params);
        }
      };
      exports._LanguagesImpl = _LanguagesImpl;
      var LanguagesImpl = (0, moniker_1.MonikerFeature)((0, linkedEditingRange_1.LinkedEditingRangeFeature)((0, semanticTokens_1.SemanticTokensFeature)((0, callHierarchy_1.CallHierarchyFeature)(_LanguagesImpl))));
      function combineConsoleFeatures(one, two) {
        return function(Base) {
          return two(one(Base));
        };
      }
      exports.combineConsoleFeatures = combineConsoleFeatures;
      function combineTelemetryFeatures(one, two) {
        return function(Base) {
          return two(one(Base));
        };
      }
      exports.combineTelemetryFeatures = combineTelemetryFeatures;
      function combineTracerFeatures(one, two) {
        return function(Base) {
          return two(one(Base));
        };
      }
      exports.combineTracerFeatures = combineTracerFeatures;
      function combineClientFeatures(one, two) {
        return function(Base) {
          return two(one(Base));
        };
      }
      exports.combineClientFeatures = combineClientFeatures;
      function combineWindowFeatures(one, two) {
        return function(Base) {
          return two(one(Base));
        };
      }
      exports.combineWindowFeatures = combineWindowFeatures;
      function combineWorkspaceFeatures(one, two) {
        return function(Base) {
          return two(one(Base));
        };
      }
      exports.combineWorkspaceFeatures = combineWorkspaceFeatures;
      function combineLanguagesFeatures(one, two) {
        return function(Base) {
          return two(one(Base));
        };
      }
      exports.combineLanguagesFeatures = combineLanguagesFeatures;
      function combineFeatures(one, two) {
        function combine(one2, two2, func) {
          if (one2 && two2) {
            return func(one2, two2);
          } else if (one2) {
            return one2;
          } else {
            return two2;
          }
        }
        let result = {
          __brand: "features",
          console: combine(one.console, two.console, combineConsoleFeatures),
          tracer: combine(one.tracer, two.tracer, combineTracerFeatures),
          telemetry: combine(one.telemetry, two.telemetry, combineTelemetryFeatures),
          client: combine(one.client, two.client, combineClientFeatures),
          window: combine(one.window, two.window, combineWindowFeatures),
          workspace: combine(one.workspace, two.workspace, combineWorkspaceFeatures)
        };
        return result;
      }
      exports.combineFeatures = combineFeatures;
      function createConnection(connectionFactory, watchDog, factories) {
        const logger = factories && factories.console ? new (factories.console(RemoteConsoleImpl))() : new RemoteConsoleImpl();
        const connection = connectionFactory(logger);
        logger.rawAttach(connection);
        const tracer = factories && factories.tracer ? new (factories.tracer(TracerImpl))() : new TracerImpl();
        const telemetry = factories && factories.telemetry ? new (factories.telemetry(TelemetryImpl))() : new TelemetryImpl();
        const client = factories && factories.client ? new (factories.client(RemoteClientImpl))() : new RemoteClientImpl();
        const remoteWindow = factories && factories.window ? new (factories.window(RemoteWindowImpl))() : new RemoteWindowImpl();
        const workspace = factories && factories.workspace ? new (factories.workspace(RemoteWorkspaceImpl))() : new RemoteWorkspaceImpl();
        const languages = factories && factories.languages ? new (factories.languages(LanguagesImpl))() : new LanguagesImpl();
        const allRemotes = [logger, tracer, telemetry, client, remoteWindow, workspace, languages];
        function asPromise(value) {
          if (value instanceof Promise) {
            return value;
          } else if (Is.thenable(value)) {
            return new Promise((resolve, reject) => {
              value.then((resolved) => resolve(resolved), (error) => reject(error));
            });
          } else {
            return Promise.resolve(value);
          }
        }
        let shutdownHandler = void 0;
        let initializeHandler = void 0;
        let exitHandler = void 0;
        let protocolConnection = {
          listen: () => connection.listen(),
          sendRequest: (type, ...params) => connection.sendRequest(Is.string(type) ? type : type.method, ...params),
          onRequest: (type, handler) => connection.onRequest(type, handler),
          sendNotification: (type, param) => {
            const method = Is.string(type) ? type : type.method;
            if (arguments.length === 1) {
              return connection.sendNotification(method);
            } else {
              return connection.sendNotification(method, param);
            }
          },
          onNotification: (type, handler) => connection.onNotification(type, handler),
          onProgress: connection.onProgress,
          sendProgress: connection.sendProgress,
          onInitialize: (handler) => initializeHandler = handler,
          onInitialized: (handler) => connection.onNotification(vscode_languageserver_protocol_1.InitializedNotification.type, handler),
          onShutdown: (handler) => shutdownHandler = handler,
          onExit: (handler) => exitHandler = handler,
          get console() {
            return logger;
          },
          get telemetry() {
            return telemetry;
          },
          get tracer() {
            return tracer;
          },
          get client() {
            return client;
          },
          get window() {
            return remoteWindow;
          },
          get workspace() {
            return workspace;
          },
          get languages() {
            return languages;
          },
          onDidChangeConfiguration: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidChangeConfigurationNotification.type, handler),
          onDidChangeWatchedFiles: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidChangeWatchedFilesNotification.type, handler),
          __textDocumentSync: void 0,
          onDidOpenTextDocument: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidOpenTextDocumentNotification.type, handler),
          onDidChangeTextDocument: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidChangeTextDocumentNotification.type, handler),
          onDidCloseTextDocument: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidCloseTextDocumentNotification.type, handler),
          onWillSaveTextDocument: (handler) => connection.onNotification(vscode_languageserver_protocol_1.WillSaveTextDocumentNotification.type, handler),
          onWillSaveTextDocumentWaitUntil: (handler) => connection.onRequest(vscode_languageserver_protocol_1.WillSaveTextDocumentWaitUntilRequest.type, handler),
          onDidSaveTextDocument: (handler) => connection.onNotification(vscode_languageserver_protocol_1.DidSaveTextDocumentNotification.type, handler),
          sendDiagnostics: (params) => connection.sendNotification(vscode_languageserver_protocol_1.PublishDiagnosticsNotification.type, params),
          onHover: (handler) => connection.onRequest(vscode_languageserver_protocol_1.HoverRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), void 0);
          }),
          onCompletion: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CompletionRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onCompletionResolve: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CompletionResolveRequest.type, handler),
          onSignatureHelp: (handler) => connection.onRequest(vscode_languageserver_protocol_1.SignatureHelpRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), void 0);
          }),
          onDeclaration: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DeclarationRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onDefinition: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DefinitionRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onTypeDefinition: (handler) => connection.onRequest(vscode_languageserver_protocol_1.TypeDefinitionRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onImplementation: (handler) => connection.onRequest(vscode_languageserver_protocol_1.ImplementationRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onReferences: (handler) => connection.onRequest(vscode_languageserver_protocol_1.ReferencesRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onDocumentHighlight: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentHighlightRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onDocumentSymbol: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentSymbolRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onWorkspaceSymbol: (handler) => connection.onRequest(vscode_languageserver_protocol_1.WorkspaceSymbolRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onWorkspaceSymbolResolve: (handler) => connection.onRequest(vscode_languageserver_protocol_1.WorkspaceSymbolResolveRequest.type, handler),
          onCodeAction: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CodeActionRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onCodeActionResolve: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CodeActionResolveRequest.type, (params, cancel) => {
            return handler(params, cancel);
          }),
          onCodeLens: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CodeLensRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onCodeLensResolve: (handler) => connection.onRequest(vscode_languageserver_protocol_1.CodeLensResolveRequest.type, (params, cancel) => {
            return handler(params, cancel);
          }),
          onDocumentFormatting: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentFormattingRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), void 0);
          }),
          onDocumentRangeFormatting: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentRangeFormattingRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), void 0);
          }),
          onDocumentOnTypeFormatting: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentOnTypeFormattingRequest.type, (params, cancel) => {
            return handler(params, cancel);
          }),
          onRenameRequest: (handler) => connection.onRequest(vscode_languageserver_protocol_1.RenameRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), void 0);
          }),
          onPrepareRename: (handler) => connection.onRequest(vscode_languageserver_protocol_1.PrepareRenameRequest.type, (params, cancel) => {
            return handler(params, cancel);
          }),
          onDocumentLinks: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentLinkRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onDocumentLinkResolve: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentLinkResolveRequest.type, (params, cancel) => {
            return handler(params, cancel);
          }),
          onDocumentColor: (handler) => connection.onRequest(vscode_languageserver_protocol_1.DocumentColorRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onColorPresentation: (handler) => connection.onRequest(vscode_languageserver_protocol_1.ColorPresentationRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onFoldingRanges: (handler) => connection.onRequest(vscode_languageserver_protocol_1.FoldingRangeRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onSelectionRanges: (handler) => connection.onRequest(vscode_languageserver_protocol_1.SelectionRangeRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), (0, progress_1.attachPartialResult)(connection, params));
          }),
          onExecuteCommand: (handler) => connection.onRequest(vscode_languageserver_protocol_1.ExecuteCommandRequest.type, (params, cancel) => {
            return handler(params, cancel, (0, progress_1.attachWorkDone)(connection, params), void 0);
          }),
          dispose: () => connection.dispose()
        };
        for (let remote of allRemotes) {
          remote.attach(protocolConnection);
        }
        connection.onRequest(vscode_languageserver_protocol_1.InitializeRequest.type, (params) => {
          watchDog.initialize(params);
          if (Is.string(params.trace)) {
            tracer.trace = vscode_languageserver_protocol_1.Trace.fromString(params.trace);
          }
          for (let remote of allRemotes) {
            remote.initialize(params.capabilities);
          }
          if (initializeHandler) {
            let result = initializeHandler(params, new vscode_languageserver_protocol_1.CancellationTokenSource().token, (0, progress_1.attachWorkDone)(connection, params), void 0);
            return asPromise(result).then((value) => {
              if (value instanceof vscode_languageserver_protocol_1.ResponseError) {
                return value;
              }
              let result2 = value;
              if (!result2) {
                result2 = { capabilities: {} };
              }
              let capabilities = result2.capabilities;
              if (!capabilities) {
                capabilities = {};
                result2.capabilities = capabilities;
              }
              if (capabilities.textDocumentSync === void 0 || capabilities.textDocumentSync === null) {
                capabilities.textDocumentSync = Is.number(protocolConnection.__textDocumentSync) ? protocolConnection.__textDocumentSync : vscode_languageserver_protocol_1.TextDocumentSyncKind.None;
              } else if (!Is.number(capabilities.textDocumentSync) && !Is.number(capabilities.textDocumentSync.change)) {
                capabilities.textDocumentSync.change = Is.number(protocolConnection.__textDocumentSync) ? protocolConnection.__textDocumentSync : vscode_languageserver_protocol_1.TextDocumentSyncKind.None;
              }
              for (let remote of allRemotes) {
                remote.fillServerCapabilities(capabilities);
              }
              return result2;
            });
          } else {
            let result = { capabilities: { textDocumentSync: vscode_languageserver_protocol_1.TextDocumentSyncKind.None } };
            for (let remote of allRemotes) {
              remote.fillServerCapabilities(result.capabilities);
            }
            return result;
          }
        });
        connection.onRequest(vscode_languageserver_protocol_1.ShutdownRequest.type, () => {
          watchDog.shutdownReceived = true;
          if (shutdownHandler) {
            return shutdownHandler(new vscode_languageserver_protocol_1.CancellationTokenSource().token);
          } else {
            return void 0;
          }
        });
        connection.onNotification(vscode_languageserver_protocol_1.ExitNotification.type, () => {
          try {
            if (exitHandler) {
              exitHandler();
            }
          } finally {
            if (watchDog.shutdownReceived) {
              watchDog.exit(0);
            } else {
              watchDog.exit(1);
            }
          }
        });
        connection.onNotification(vscode_languageserver_protocol_1.SetTraceNotification.type, (params) => {
          tracer.trace = vscode_languageserver_protocol_1.Trace.fromString(params.value);
        });
        return protocolConnection;
      }
      exports.createConnection = createConnection;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/proposed.diagnostic.js
  var require_proposed_diagnostic2 = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/proposed.diagnostic.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DiagnosticFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var DiagnosticFeature = (Base) => {
        return class extends Base {
          get diagnostics() {
            return {
              refresh: () => {
                return this.connection.sendRequest(vscode_languageserver_protocol_1.Proposed.DiagnosticRefreshRequest.type);
              },
              on: (handler) => {
                this.connection.onRequest(vscode_languageserver_protocol_1.Proposed.DocumentDiagnosticRequest.type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(vscode_languageserver_protocol_1.Proposed.DocumentDiagnosticRequest.partialResult, params));
                });
              },
              onWorkspace: (handler) => {
                this.connection.onRequest(vscode_languageserver_protocol_1.Proposed.WorkspaceDiagnosticRequest.type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(vscode_languageserver_protocol_1.Proposed.WorkspaceDiagnosticRequest.partialResult, params));
                });
              }
            };
          }
        };
      };
      exports.DiagnosticFeature = DiagnosticFeature;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/proposed.typeHierarchy.js
  var require_proposed_typeHierarchy2 = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/proposed.typeHierarchy.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.TypeHierarchyFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var TypeHierarchyFeature = (Base) => {
        return class extends Base {
          get typeHierarchy() {
            return {
              onPrepare: (handler) => {
                this.connection.onRequest(vscode_languageserver_protocol_1.Proposed.TypeHierarchyPrepareRequest.type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), void 0);
                });
              },
              onSupertypes: (handler) => {
                const type = vscode_languageserver_protocol_1.Proposed.TypeHierarchySupertypesRequest.type;
                this.connection.onRequest(type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
                });
              },
              onSubtypes: (handler) => {
                const type = vscode_languageserver_protocol_1.Proposed.TypeHierarchySubtypesRequest.type;
                this.connection.onRequest(type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params), this.attachPartialResultProgress(type, params));
                });
              }
            };
          }
        };
      };
      exports.TypeHierarchyFeature = TypeHierarchyFeature;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/proposed.inlineValues.js
  var require_proposed_inlineValues = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/proposed.inlineValues.js"(exports) {
      init_define_process();
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.InlineValuesFeature = void 0;
      var vscode_languageserver_protocol_1 = require_main3();
      var InlineValuesFeature = (Base) => {
        return class extends Base {
          get inlineValues() {
            return {
              on: (handler) => {
                this.connection.onRequest(vscode_languageserver_protocol_1.Proposed.InlineValuesRequest.type, (params, cancel) => {
                  return handler(params, cancel, this.attachWorkDoneProgress(params));
                });
              }
            };
          }
        };
      };
      exports.InlineValuesFeature = InlineValuesFeature;
    }
  });

  // server/node_modules/vscode-languageserver/lib/common/api.js
  var require_api3 = __commonJS({
    "server/node_modules/vscode-languageserver/lib/common/api.js"(exports) {
      init_define_process();
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ProposedFeatures = exports.SemanticTokensBuilder = void 0;
      var server_1 = require_server();
      var semanticTokens_1 = require_semanticTokens();
      Object.defineProperty(exports, "SemanticTokensBuilder", { enumerable: true, get: function() {
        return semanticTokens_1.SemanticTokensBuilder;
      } });
      __exportStar(require_main3(), exports);
      __exportStar(require_server(), exports);
      var proposed_diagnostic_1 = require_proposed_diagnostic2();
      var proposed_typeHierarchy_1 = require_proposed_typeHierarchy2();
      var proposed_inlineValues_1 = require_proposed_inlineValues();
      var ProposedFeatures;
      (function(ProposedFeatures2) {
        ProposedFeatures2.all = {
          __brand: "features",
          languages: (0, server_1.combineLanguagesFeatures)(proposed_inlineValues_1.InlineValuesFeature, (0, server_1.combineLanguagesFeatures)(proposed_typeHierarchy_1.TypeHierarchyFeature, proposed_diagnostic_1.DiagnosticFeature))
        };
      })(ProposedFeatures = exports.ProposedFeatures || (exports.ProposedFeatures = {}));
    }
  });

  // server/node_modules/vscode-languageserver-protocol/browser.js
  var require_browser2 = __commonJS({
    "server/node_modules/vscode-languageserver-protocol/browser.js"(exports, module) {
      init_define_process();
      "use strict";
      module.exports = require_main3();
    }
  });

  // server/node_modules/vscode-languageserver/lib/browser/main.js
  var require_main4 = __commonJS({
    "server/node_modules/vscode-languageserver/lib/browser/main.js"(exports) {
      init_define_process();
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() {
          return m[k];
        } });
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.createConnection = void 0;
      var api_1 = require_api3();
      __exportStar(require_browser2(), exports);
      __exportStar(require_api3(), exports);
      var _shutdownReceived = false;
      var watchDog = {
        initialize: (_params) => {
        },
        get shutdownReceived() {
          return _shutdownReceived;
        },
        set shutdownReceived(value) {
          _shutdownReceived = value;
        },
        exit: (_code) => {
        }
      };
      function createConnection(arg1, arg2, arg3, arg4) {
        let factories;
        let reader;
        let writer;
        let options;
        if (arg1 !== void 0 && arg1.__brand === "features") {
          factories = arg1;
          arg1 = arg2;
          arg2 = arg3;
          arg3 = arg4;
        }
        if (api_1.ConnectionStrategy.is(arg1) || api_1.ConnectionOptions.is(arg1)) {
          options = arg1;
        } else {
          reader = arg1;
          writer = arg2;
          options = arg3;
        }
        const connectionFactory = (logger) => {
          return (0, api_1.createProtocolConnection)(reader, writer, logger, options);
        };
        return (0, api_1.createConnection)(connectionFactory, watchDog, factories);
      }
      exports.createConnection = createConnection;
    }
  });

  // server/node_modules/web-tree-sitter/tree-sitter.js
  var require_tree_sitter = __commonJS({
    "server/node_modules/web-tree-sitter/tree-sitter.js"(exports, module) {
      init_define_process();
      var Module = Module !== void 0 ? Module : {};
      var TreeSitter = function() {
        var e, t = typeof window == "object" ? { currentScript: window.document.currentScript } : null;
        class Parser4 {
          constructor() {
            this.initialize();
          }
          initialize() {
            throw new Error("cannot construct a Parser before calling `init()`");
          }
          static init(r) {
            return e || (Module = Object.assign({}, Module, r), e = new Promise((e2) => {
              var r2, n = {};
              for (r2 in Module)
                Module.hasOwnProperty(r2) && (n[r2] = Module[r2]);
              var s, o, _ = [], a = "./this.program", u = function(e3, t2) {
                throw t2;
              }, i = false, l = false;
              i = typeof window == "object", l = typeof importScripts == "function", s = typeof define_process_default == "object" && typeof define_process_default.versions == "object" && typeof define_process_default.versions.node == "string", o = !i && !s && !l;
              var d, c, m, f, p, h = "";
              s ? (h = l ? __require("path").dirname(h) + "/" : __dirname + "/", d = function(e3, t2) {
                return f || (f = __require("fs")), p || (p = __require("path")), e3 = p.normalize(e3), f.readFileSync(e3, t2 ? null : "utf8");
              }, m = function(e3) {
                var t2 = d(e3, true);
                return t2.buffer || (t2 = new Uint8Array(t2)), k(t2.buffer), t2;
              }, define_process_default.argv.length > 1 && (a = define_process_default.argv[1].replace(/\\/g, "/")), _ = define_process_default.argv.slice(2), typeof module != "undefined" && (module.exports = Module), u = function(e3) {
                define_process_default.exit(e3);
              }, Module.inspect = function() {
                return "[Emscripten Module object]";
              }) : o ? (typeof read != "undefined" && (d = function(e3) {
                return read(e3);
              }), m = function(e3) {
                var t2;
                return typeof readbuffer == "function" ? new Uint8Array(readbuffer(e3)) : (k(typeof (t2 = read(e3, "binary")) == "object"), t2);
              }, typeof scriptArgs != "undefined" ? _ = scriptArgs : arguments !== void 0 && (_ = arguments), typeof quit == "function" && (u = function(e3) {
                quit(e3);
              }), typeof print != "undefined" && (typeof console == "undefined" && (console = {}), console.log = print, console.warn = console.error = typeof printErr != "undefined" ? printErr : print)) : (i || l) && (l ? h = self.location.href : t !== void 0 && t.currentScript && (h = t.currentScript.src), h = h.indexOf("blob:") !== 0 ? h.substr(0, h.lastIndexOf("/") + 1) : "", d = function(e3) {
                var t2 = new XMLHttpRequest();
                return t2.open("GET", e3, false), t2.send(null), t2.responseText;
              }, l && (m = function(e3) {
                var t2 = new XMLHttpRequest();
                return t2.open("GET", e3, false), t2.responseType = "arraybuffer", t2.send(null), new Uint8Array(t2.response);
              }), c = function(e3, t2, r3) {
                var n2 = new XMLHttpRequest();
                n2.open("GET", e3, true), n2.responseType = "arraybuffer", n2.onload = function() {
                  n2.status == 200 || n2.status == 0 && n2.response ? t2(n2.response) : r3();
                }, n2.onerror = r3, n2.send(null);
              });
              Module.print || console.log.bind(console);
              var g = Module.printErr || console.warn.bind(console);
              for (r2 in n)
                n.hasOwnProperty(r2) && (Module[r2] = n[r2]);
              n = null, Module.arguments && (_ = Module.arguments), Module.thisProgram && (a = Module.thisProgram), Module.quit && (u = Module.quit);
              var w = 16;
              var y, M = [];
              function b(e3, t2) {
                if (!y) {
                  y = new WeakMap();
                  for (var r3 = 0; r3 < K.length; r3++) {
                    var n2 = K.get(r3);
                    n2 && y.set(n2, r3);
                  }
                }
                if (y.has(e3))
                  return y.get(e3);
                var s2 = function() {
                  if (M.length)
                    return M.pop();
                  try {
                    K.grow(1);
                  } catch (e4) {
                    if (!(e4 instanceof RangeError))
                      throw e4;
                    throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
                  }
                  return K.length - 1;
                }();
                try {
                  K.set(s2, e3);
                } catch (r4) {
                  if (!(r4 instanceof TypeError))
                    throw r4;
                  var o2 = function(e4, t3) {
                    if (typeof WebAssembly.Function == "function") {
                      for (var r5 = { i: "i32", j: "i64", f: "f32", d: "f64" }, n3 = { parameters: [], results: t3[0] == "v" ? [] : [r5[t3[0]]] }, s3 = 1; s3 < t3.length; ++s3)
                        n3.parameters.push(r5[t3[s3]]);
                      return new WebAssembly.Function(n3, e4);
                    }
                    var o3 = [1, 0, 1, 96], _2 = t3.slice(0, 1), a2 = t3.slice(1), u2 = { i: 127, j: 126, f: 125, d: 124 };
                    for (o3.push(a2.length), s3 = 0; s3 < a2.length; ++s3)
                      o3.push(u2[a2[s3]]);
                    _2 == "v" ? o3.push(0) : o3 = o3.concat([1, u2[_2]]), o3[1] = o3.length - 2;
                    var i2 = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(o3, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0])), l2 = new WebAssembly.Module(i2);
                    return new WebAssembly.Instance(l2, { e: { f: e4 } }).exports.f;
                  }(e3, t2);
                  K.set(s2, o2);
                }
                return y.set(e3, s2), s2;
              }
              var v, E = function(e3) {
                e3;
              }, I = Module.dynamicLibraries || [];
              Module.wasmBinary && (v = Module.wasmBinary);
              var A, S = Module.noExitRuntime || true;
              function x(e3, t2, r3, n2) {
                switch ((r3 = r3 || "i8").charAt(r3.length - 1) === "*" && (r3 = "i32"), r3) {
                  case "i1":
                  case "i8":
                    R[e3 >> 0] = t2;
                    break;
                  case "i16":
                    L[e3 >> 1] = t2;
                    break;
                  case "i32":
                    W[e3 >> 2] = t2;
                    break;
                  case "i64":
                    ue = [t2 >>> 0, (ae = t2, +Math.abs(ae) >= 1 ? ae > 0 ? (0 | Math.min(+Math.floor(ae / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((ae - +(~~ae >>> 0)) / 4294967296) >>> 0 : 0)], W[e3 >> 2] = ue[0], W[e3 + 4 >> 2] = ue[1];
                    break;
                  case "float":
                    O[e3 >> 2] = t2;
                    break;
                  case "double":
                    Z[e3 >> 3] = t2;
                    break;
                  default:
                    oe("invalid type for setValue: " + r3);
                }
              }
              function N(e3, t2, r3) {
                switch ((t2 = t2 || "i8").charAt(t2.length - 1) === "*" && (t2 = "i32"), t2) {
                  case "i1":
                  case "i8":
                    return R[e3 >> 0];
                  case "i16":
                    return L[e3 >> 1];
                  case "i32":
                  case "i64":
                    return W[e3 >> 2];
                  case "float":
                    return O[e3 >> 2];
                  case "double":
                    return Z[e3 >> 3];
                  default:
                    oe("invalid type for getValue: " + t2);
                }
                return null;
              }
              typeof WebAssembly != "object" && oe("no native wasm support detected");
              var P = false;
              function k(e3, t2) {
                e3 || oe("Assertion failed: " + t2);
              }
              var C = 1;
              var q, R, T, L, W, O, Z, F = typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : void 0;
              function $(e3, t2, r3) {
                for (var n2 = t2 + r3, s2 = t2; e3[s2] && !(s2 >= n2); )
                  ++s2;
                if (s2 - t2 > 16 && e3.subarray && F)
                  return F.decode(e3.subarray(t2, s2));
                for (var o2 = ""; t2 < s2; ) {
                  var _2 = e3[t2++];
                  if (128 & _2) {
                    var a2 = 63 & e3[t2++];
                    if ((224 & _2) != 192) {
                      var u2 = 63 & e3[t2++];
                      if ((_2 = (240 & _2) == 224 ? (15 & _2) << 12 | a2 << 6 | u2 : (7 & _2) << 18 | a2 << 12 | u2 << 6 | 63 & e3[t2++]) < 65536)
                        o2 += String.fromCharCode(_2);
                      else {
                        var i2 = _2 - 65536;
                        o2 += String.fromCharCode(55296 | i2 >> 10, 56320 | 1023 & i2);
                      }
                    } else
                      o2 += String.fromCharCode((31 & _2) << 6 | a2);
                  } else
                    o2 += String.fromCharCode(_2);
                }
                return o2;
              }
              function j(e3, t2) {
                return e3 ? $(T, e3, t2) : "";
              }
              function U(e3, t2, r3, n2) {
                if (!(n2 > 0))
                  return 0;
                for (var s2 = r3, o2 = r3 + n2 - 1, _2 = 0; _2 < e3.length; ++_2) {
                  var a2 = e3.charCodeAt(_2);
                  if (a2 >= 55296 && a2 <= 57343)
                    a2 = 65536 + ((1023 & a2) << 10) | 1023 & e3.charCodeAt(++_2);
                  if (a2 <= 127) {
                    if (r3 >= o2)
                      break;
                    t2[r3++] = a2;
                  } else if (a2 <= 2047) {
                    if (r3 + 1 >= o2)
                      break;
                    t2[r3++] = 192 | a2 >> 6, t2[r3++] = 128 | 63 & a2;
                  } else if (a2 <= 65535) {
                    if (r3 + 2 >= o2)
                      break;
                    t2[r3++] = 224 | a2 >> 12, t2[r3++] = 128 | a2 >> 6 & 63, t2[r3++] = 128 | 63 & a2;
                  } else {
                    if (r3 + 3 >= o2)
                      break;
                    t2[r3++] = 240 | a2 >> 18, t2[r3++] = 128 | a2 >> 12 & 63, t2[r3++] = 128 | a2 >> 6 & 63, t2[r3++] = 128 | 63 & a2;
                  }
                }
                return t2[r3] = 0, r3 - s2;
              }
              function D(e3, t2, r3) {
                return U(e3, T, t2, r3);
              }
              function z(e3) {
                for (var t2 = 0, r3 = 0; r3 < e3.length; ++r3) {
                  var n2 = e3.charCodeAt(r3);
                  n2 >= 55296 && n2 <= 57343 && (n2 = 65536 + ((1023 & n2) << 10) | 1023 & e3.charCodeAt(++r3)), n2 <= 127 ? ++t2 : t2 += n2 <= 2047 ? 2 : n2 <= 65535 ? 3 : 4;
                }
                return t2;
              }
              function G(e3) {
                var t2 = z(e3) + 1, r3 = ze(t2);
                return U(e3, R, r3, t2), r3;
              }
              function H(e3) {
                q = e3, Module.HEAP8 = R = new Int8Array(e3), Module.HEAP16 = L = new Int16Array(e3), Module.HEAP32 = W = new Int32Array(e3), Module.HEAPU8 = T = new Uint8Array(e3), Module.HEAPU16 = new Uint16Array(e3), Module.HEAPU32 = new Uint32Array(e3), Module.HEAPF32 = O = new Float32Array(e3), Module.HEAPF64 = Z = new Float64Array(e3);
              }
              var B = Module.INITIAL_MEMORY || 33554432;
              (A = Module.wasmMemory ? Module.wasmMemory : new WebAssembly.Memory({ initial: B / 65536, maximum: 32768 })) && (q = A.buffer), B = q.byteLength, H(q);
              var K = new WebAssembly.Table({ initial: 17, element: "anyfunc" }), V = [], X = [], Q = [], J = [], Y = false;
              var ee = 0, te = null, re = null;
              function ne(e3) {
                ee++, Module.monitorRunDependencies && Module.monitorRunDependencies(ee);
              }
              function se(e3) {
                if (ee--, Module.monitorRunDependencies && Module.monitorRunDependencies(ee), ee == 0 && (te !== null && (clearInterval(te), te = null), re)) {
                  var t2 = re;
                  re = null, t2();
                }
              }
              function oe(e3) {
                throw Module.onAbort && Module.onAbort(e3), g(e3 += ""), P = true, 1, e3 = "abort(" + e3 + "). Build with -s ASSERTIONS=1 for more info.", new WebAssembly.RuntimeError(e3);
              }
              Module.preloadedImages = {}, Module.preloadedAudios = {}, Module.preloadedWasm = {};
              var _e, ae, ue, ie = "data:application/octet-stream;base64,";
              function le(e3) {
                return e3.startsWith(ie);
              }
              function de(e3) {
                return e3.startsWith("file://");
              }
              function ce(e3) {
                try {
                  if (e3 == _e && v)
                    return new Uint8Array(v);
                  if (m)
                    return m(e3);
                  throw "both async and sync fetching of the wasm failed";
                } catch (e4) {
                  oe(e4);
                }
              }
              le(_e = "tree-sitter.wasm") || (_e = function(e3) {
                return Module.locateFile ? Module.locateFile(e3, h) : h + e3;
              }(_e));
              var me = {}, fe = { get: function(e3, t2) {
                return me[t2] || (me[t2] = new WebAssembly.Global({ value: "i32", mutable: true })), me[t2];
              } };
              function pe(e3) {
                for (; e3.length > 0; ) {
                  var t2 = e3.shift();
                  if (typeof t2 != "function") {
                    var r3 = t2.func;
                    typeof r3 == "number" ? t2.arg === void 0 ? K.get(r3)() : K.get(r3)(t2.arg) : r3(t2.arg === void 0 ? null : t2.arg);
                  } else
                    t2(Module);
                }
              }
              function he(e3) {
                var t2 = 0;
                function r3() {
                  for (var r4 = 0, n3 = 1; ; ) {
                    var s3 = e3[t2++];
                    if (r4 += (127 & s3) * n3, n3 *= 128, !(128 & s3))
                      break;
                  }
                  return r4;
                }
                if (e3 instanceof WebAssembly.Module) {
                  var n2 = WebAssembly.Module.customSections(e3, "dylink");
                  k(n2.length != 0, "need dylink section"), e3 = new Int8Array(n2[0]);
                } else {
                  k(new Uint32Array(new Uint8Array(e3.subarray(0, 24)).buffer)[0] == 1836278016, "need to see wasm magic number"), k(e3[8] === 0, "need the dylink section to be first"), t2 = 9, r3(), k(e3[t2] === 6), k(e3[++t2] === "d".charCodeAt(0)), k(e3[++t2] === "y".charCodeAt(0)), k(e3[++t2] === "l".charCodeAt(0)), k(e3[++t2] === "i".charCodeAt(0)), k(e3[++t2] === "n".charCodeAt(0)), k(e3[++t2] === "k".charCodeAt(0)), t2++;
                }
                var s2 = {};
                s2.memorySize = r3(), s2.memoryAlign = r3(), s2.tableSize = r3(), s2.tableAlign = r3();
                var o2 = r3();
                s2.neededDynlibs = [];
                for (var _2 = 0; _2 < o2; ++_2) {
                  var a2 = r3(), u2 = e3.subarray(t2, t2 + a2);
                  t2 += a2;
                  var i2 = $(u2, 0);
                  s2.neededDynlibs.push(i2);
                }
                return s2;
              }
              var ge = 0;
              function we() {
                return S || ge > 0;
              }
              function ye(e3) {
                return e3.indexOf("dynCall_") == 0 || ["stackAlloc", "stackSave", "stackRestore"].includes(e3) ? e3 : "_" + e3;
              }
              function Me(e3, t2) {
                for (var r3 in e3)
                  if (e3.hasOwnProperty(r3)) {
                    Fe.hasOwnProperty(r3) || (Fe[r3] = e3[r3]);
                    var n2 = ye(r3);
                    Module.hasOwnProperty(n2) || (Module[n2] = e3[r3]);
                  }
              }
              var be = { nextHandle: 1, loadedLibs: {}, loadedLibNames: {} };
              function ve(e3, t2, r3) {
                return e3.includes("j") ? function(e4, t3, r4) {
                  var n2 = Module["dynCall_" + e4];
                  return r4 && r4.length ? n2.apply(null, [t3].concat(r4)) : n2.call(null, t3);
                }(e3, t2, r3) : K.get(t2).apply(null, r3);
              }
              var Ee = 5250880;
              function Ie(e3) {
                return ["__cpp_exception", "__wasm_apply_data_relocs", "__dso_handle", "__set_stack_limits"].includes(e3);
              }
              function Ae(e3, t2) {
                var r3 = {};
                for (var n2 in e3) {
                  var s2 = e3[n2];
                  typeof s2 == "object" && (s2 = s2.value), typeof s2 == "number" && (s2 += t2), r3[n2] = s2;
                }
                return function(e4) {
                  for (var t3 in e4)
                    if (!Ie(t3)) {
                      var r4 = false, n3 = e4[t3];
                      t3.startsWith("orig$") && (t3 = t3.split("$")[1], r4 = true), me[t3] || (me[t3] = new WebAssembly.Global({ value: "i32", mutable: true })), (r4 || me[t3].value == 0) && (typeof n3 == "function" ? me[t3].value = b(n3) : typeof n3 == "number" ? me[t3].value = n3 : g("unhandled export type for `" + t3 + "`: " + typeof n3));
                    }
                }(r3), r3;
              }
              function Se(e3, t2) {
                var r3, n2;
                return t2 && (r3 = Fe["orig$" + e3]), r3 || (r3 = Fe[e3]), r3 || (r3 = Module[ye(e3)]), !r3 && e3.startsWith("invoke_") && (n2 = e3.split("_")[1], r3 = function() {
                  var e4 = Ue();
                  try {
                    return ve(n2, arguments[0], Array.prototype.slice.call(arguments, 1));
                  } catch (t3) {
                    if (De(e4), t3 !== t3 + 0 && t3 !== "longjmp")
                      throw t3;
                    Ge(1, 0);
                  }
                }), r3;
              }
              function xe(e3, t2) {
                var r3 = he(e3);
                function n2() {
                  var n3 = Math.pow(2, r3.memoryAlign);
                  n3 = Math.max(n3, w);
                  var s2, o2, _2, a2 = (s2 = function(e4) {
                    if (Y)
                      return $e(e4);
                    var t3 = Ee, r4 = t3 + e4 + 15 & -16;
                    return Ee = r4, me.__heap_base.value = r4, t3;
                  }(r3.memorySize + n3), (o2 = n3) || (o2 = w), Math.ceil(s2 / o2) * o2), u2 = K.length;
                  K.grow(r3.tableSize);
                  for (var i2 = a2; i2 < a2 + r3.memorySize; i2++)
                    R[i2] = 0;
                  for (i2 = u2; i2 < u2 + r3.tableSize; i2++)
                    K.set(i2, null);
                  var l2 = new Proxy({}, { get: function(e4, t3) {
                    switch (t3) {
                      case "__memory_base":
                        return a2;
                      case "__table_base":
                        return u2;
                    }
                    if (t3 in Fe)
                      return Fe[t3];
                    var r4;
                    t3 in e4 || (e4[t3] = function() {
                      return r4 || (r4 = function(e5) {
                        var t4 = Se(e5, false);
                        return t4 || (t4 = _2[e5]), t4;
                      }(t3)), r4.apply(null, arguments);
                    });
                    return e4[t3];
                  } }), d2 = { "GOT.mem": new Proxy({}, fe), "GOT.func": new Proxy({}, fe), env: l2, wasi_snapshot_preview1: l2 };
                  function c2(e4) {
                    for (var n4 = 0; n4 < r3.tableSize; n4++) {
                      var s3 = K.get(u2 + n4);
                      s3 && y.set(s3, u2 + n4);
                    }
                    _2 = Ae(e4.exports, a2), t2.allowUndefined || Pe();
                    var o3 = _2.__wasm_call_ctors;
                    return o3 || (o3 = _2.__post_instantiate), o3 && (Y ? o3() : X.push(o3)), _2;
                  }
                  if (t2.loadAsync) {
                    if (e3 instanceof WebAssembly.Module) {
                      var m2 = new WebAssembly.Instance(e3, d2);
                      return Promise.resolve(c2(m2));
                    }
                    return WebAssembly.instantiate(e3, d2).then(function(e4) {
                      return c2(e4.instance);
                    });
                  }
                  var f2 = e3 instanceof WebAssembly.Module ? e3 : new WebAssembly.Module(e3);
                  return c2(m2 = new WebAssembly.Instance(f2, d2));
                }
                return t2.loadAsync ? r3.neededDynlibs.reduce(function(e4, r4) {
                  return e4.then(function() {
                    return Ne(r4, t2);
                  });
                }, Promise.resolve()).then(function() {
                  return n2();
                }) : (r3.neededDynlibs.forEach(function(e4) {
                  Ne(e4, t2);
                }), n2());
              }
              function Ne(e3, t2) {
                e3 != "__main__" || be.loadedLibNames[e3] || (be.loadedLibs[-1] = { refcount: 1 / 0, name: "__main__", module: Module.asm, global: true }, be.loadedLibNames.__main__ = -1), t2 = t2 || { global: true, nodelete: true };
                var r3, n2 = be.loadedLibNames[e3];
                if (n2)
                  return r3 = be.loadedLibs[n2], t2.global && !r3.global && (r3.global = true, r3.module !== "loading" && Me(r3.module)), t2.nodelete && r3.refcount !== 1 / 0 && (r3.refcount = 1 / 0), r3.refcount++, t2.loadAsync ? Promise.resolve(n2) : n2;
                function s2(e4) {
                  if (t2.fs) {
                    var r4 = t2.fs.readFile(e4, { encoding: "binary" });
                    return r4 instanceof Uint8Array || (r4 = new Uint8Array(r4)), t2.loadAsync ? Promise.resolve(r4) : r4;
                  }
                  return t2.loadAsync ? (n3 = e4, fetch(n3, { credentials: "same-origin" }).then(function(e5) {
                    if (!e5.ok)
                      throw "failed to load binary file at '" + n3 + "'";
                    return e5.arrayBuffer();
                  }).then(function(e5) {
                    return new Uint8Array(e5);
                  })) : m(e4);
                  var n3;
                }
                function o2() {
                  if (Module.preloadedWasm !== void 0 && Module.preloadedWasm[e3] !== void 0) {
                    var r4 = Module.preloadedWasm[e3];
                    return t2.loadAsync ? Promise.resolve(r4) : r4;
                  }
                  return t2.loadAsync ? s2(e3).then(function(e4) {
                    return xe(e4, t2);
                  }) : xe(s2(e3), t2);
                }
                function _2(e4) {
                  r3.global && Me(e4), r3.module = e4;
                }
                return n2 = be.nextHandle++, r3 = { refcount: t2.nodelete ? 1 / 0 : 1, name: e3, module: "loading", global: t2.global }, be.loadedLibNames[e3] = n2, be.loadedLibs[n2] = r3, t2.loadAsync ? o2().then(function(e4) {
                  return _2(e4), n2;
                }) : (_2(o2()), n2);
              }
              function Pe() {
                for (var e3 in me)
                  if (me[e3].value == 0) {
                    var t2 = Se(e3, true);
                    typeof t2 == "function" ? me[e3].value = b(t2, t2.sig) : typeof t2 == "number" ? me[e3].value = t2 : k(false, "bad export type for `" + e3 + "`: " + typeof t2);
                  }
              }
              Module.___heap_base = Ee;
              var ke, Ce = new WebAssembly.Global({ value: "i32", mutable: true }, 5250880);
              function qe() {
                oe();
              }
              Module._abort = qe, qe.sig = "v", ke = s ? function() {
                var e3 = define_process_default.hrtime();
                return 1e3 * e3[0] + e3[1] / 1e6;
              } : typeof dateNow != "undefined" ? dateNow : function() {
                return performance.now();
              };
              var Re = true;
              function Te(e3, t2) {
                var r3, n2;
                if (e3 === 0)
                  r3 = Date.now();
                else {
                  if (e3 !== 1 && e3 !== 4 || !Re)
                    return n2 = 28, W[je() >> 2] = n2, -1;
                  r3 = ke();
                }
                return W[t2 >> 2] = r3 / 1e3 | 0, W[t2 + 4 >> 2] = r3 % 1e3 * 1e3 * 1e3 | 0, 0;
              }
              function Le(e3) {
                try {
                  return A.grow(e3 - q.byteLength + 65535 >>> 16), H(A.buffer), 1;
                } catch (e4) {
                }
              }
              function We(e3) {
                Ve(e3);
              }
              function Oe(e3) {
                E(e3);
              }
              Te.sig = "iii", We.sig = "vi", Oe.sig = "vi";
              var Ze, Fe = { __heap_base: Ee, __indirect_function_table: K, __memory_base: 1024, __stack_pointer: Ce, __table_base: 1, abort: qe, clock_gettime: Te, emscripten_memcpy_big: function(e3, t2, r3) {
                T.copyWithin(e3, t2, t2 + r3);
              }, emscripten_resize_heap: function(e3) {
                var t2, r3, n2 = T.length;
                if ((e3 >>>= 0) > 2147483648)
                  return false;
                for (var s2 = 1; s2 <= 4; s2 *= 2) {
                  var o2 = n2 * (1 + 0.2 / s2);
                  if (o2 = Math.min(o2, e3 + 100663296), Le(Math.min(2147483648, ((t2 = Math.max(e3, o2)) % (r3 = 65536) > 0 && (t2 += r3 - t2 % r3), t2))))
                    return true;
                }
                return false;
              }, exit: We, memory: A, setTempRet0: Oe, tree_sitter_log_callback: function(e3, t2) {
                if (ct) {
                  const r3 = j(t2);
                  ct(r3, e3 !== 0);
                }
              }, tree_sitter_parse_callback: function(e3, t2, r3, n2, s2) {
                var o2 = dt(t2, { row: r3, column: n2 });
                typeof o2 == "string" ? (x(s2, o2.length, "i32"), function(e4, t3, r4) {
                  if (r4 === void 0 && (r4 = 2147483647), r4 < 2)
                    return 0;
                  for (var n3 = (r4 -= 2) < 2 * e4.length ? r4 / 2 : e4.length, s3 = 0; s3 < n3; ++s3) {
                    var o3 = e4.charCodeAt(s3);
                    L[t3 >> 1] = o3, t3 += 2;
                  }
                  L[t3 >> 1] = 0;
                }(o2, e3, 10240)) : x(s2, 0, "i32");
              } }, $e = (function() {
                var e3 = { env: Fe, wasi_snapshot_preview1: Fe, "GOT.mem": new Proxy(Fe, fe), "GOT.func": new Proxy(Fe, fe) };
                function t2(e4, t3) {
                  var r4 = e4.exports;
                  r4 = Ae(r4, 1024), Module.asm = r4;
                  var n3, s2 = he(t3);
                  s2.neededDynlibs && (I = s2.neededDynlibs.concat(I)), Me(r4), n3 = Module.asm.__wasm_call_ctors, X.unshift(n3), se();
                }
                function r3(e4) {
                  t2(e4.instance, e4.module);
                }
                function n2(t3) {
                  return function() {
                    if (!v && (i || l)) {
                      if (typeof fetch == "function" && !de(_e))
                        return fetch(_e, { credentials: "same-origin" }).then(function(e4) {
                          if (!e4.ok)
                            throw "failed to load wasm binary file at '" + _e + "'";
                          return e4.arrayBuffer();
                        }).catch(function() {
                          return ce(_e);
                        });
                      if (c)
                        return new Promise(function(e4, t4) {
                          c(_e, function(t5) {
                            e4(new Uint8Array(t5));
                          }, t4);
                        });
                    }
                    return Promise.resolve().then(function() {
                      return ce(_e);
                    });
                  }().then(function(t4) {
                    return WebAssembly.instantiate(t4, e3);
                  }).then(t3, function(e4) {
                    g("failed to asynchronously prepare wasm: " + e4), oe(e4);
                  });
                }
                if (ne(), Module.instantiateWasm)
                  try {
                    return Module.instantiateWasm(e3, t2);
                  } catch (e4) {
                    return g("Module.instantiateWasm callback failed with error: " + e4), false;
                  }
                v || typeof WebAssembly.instantiateStreaming != "function" || le(_e) || de(_e) || typeof fetch != "function" ? n2(r3) : fetch(_e, { credentials: "same-origin" }).then(function(t3) {
                  return WebAssembly.instantiateStreaming(t3, e3).then(r3, function(e4) {
                    return g("wasm streaming compile failed: " + e4), g("falling back to ArrayBuffer instantiation"), n2(r3);
                  });
                });
              }(), Module.___wasm_call_ctors = function() {
                return (Module.___wasm_call_ctors = Module.asm.__wasm_call_ctors).apply(null, arguments);
              }, Module._malloc = function() {
                return ($e = Module._malloc = Module.asm.malloc).apply(null, arguments);
              }), je = (Module._calloc = function() {
                return (Module._calloc = Module.asm.calloc).apply(null, arguments);
              }, Module._realloc = function() {
                return (Module._realloc = Module.asm.realloc).apply(null, arguments);
              }, Module._free = function() {
                return (Module._free = Module.asm.free).apply(null, arguments);
              }, Module._ts_language_symbol_count = function() {
                return (Module._ts_language_symbol_count = Module.asm.ts_language_symbol_count).apply(null, arguments);
              }, Module._ts_language_version = function() {
                return (Module._ts_language_version = Module.asm.ts_language_version).apply(null, arguments);
              }, Module._ts_language_field_count = function() {
                return (Module._ts_language_field_count = Module.asm.ts_language_field_count).apply(null, arguments);
              }, Module._ts_language_symbol_name = function() {
                return (Module._ts_language_symbol_name = Module.asm.ts_language_symbol_name).apply(null, arguments);
              }, Module._ts_language_symbol_for_name = function() {
                return (Module._ts_language_symbol_for_name = Module.asm.ts_language_symbol_for_name).apply(null, arguments);
              }, Module._ts_language_symbol_type = function() {
                return (Module._ts_language_symbol_type = Module.asm.ts_language_symbol_type).apply(null, arguments);
              }, Module._ts_language_field_name_for_id = function() {
                return (Module._ts_language_field_name_for_id = Module.asm.ts_language_field_name_for_id).apply(null, arguments);
              }, Module._memcpy = function() {
                return (Module._memcpy = Module.asm.memcpy).apply(null, arguments);
              }, Module._ts_parser_delete = function() {
                return (Module._ts_parser_delete = Module.asm.ts_parser_delete).apply(null, arguments);
              }, Module._ts_parser_reset = function() {
                return (Module._ts_parser_reset = Module.asm.ts_parser_reset).apply(null, arguments);
              }, Module._ts_parser_set_language = function() {
                return (Module._ts_parser_set_language = Module.asm.ts_parser_set_language).apply(null, arguments);
              }, Module._ts_parser_timeout_micros = function() {
                return (Module._ts_parser_timeout_micros = Module.asm.ts_parser_timeout_micros).apply(null, arguments);
              }, Module._ts_parser_set_timeout_micros = function() {
                return (Module._ts_parser_set_timeout_micros = Module.asm.ts_parser_set_timeout_micros).apply(null, arguments);
              }, Module._memmove = function() {
                return (Module._memmove = Module.asm.memmove).apply(null, arguments);
              }, Module._memcmp = function() {
                return (Module._memcmp = Module.asm.memcmp).apply(null, arguments);
              }, Module._ts_query_new = function() {
                return (Module._ts_query_new = Module.asm.ts_query_new).apply(null, arguments);
              }, Module._ts_query_delete = function() {
                return (Module._ts_query_delete = Module.asm.ts_query_delete).apply(null, arguments);
              }, Module._iswspace = function() {
                return (Module._iswspace = Module.asm.iswspace).apply(null, arguments);
              }, Module._iswalnum = function() {
                return (Module._iswalnum = Module.asm.iswalnum).apply(null, arguments);
              }, Module._ts_query_pattern_count = function() {
                return (Module._ts_query_pattern_count = Module.asm.ts_query_pattern_count).apply(null, arguments);
              }, Module._ts_query_capture_count = function() {
                return (Module._ts_query_capture_count = Module.asm.ts_query_capture_count).apply(null, arguments);
              }, Module._ts_query_string_count = function() {
                return (Module._ts_query_string_count = Module.asm.ts_query_string_count).apply(null, arguments);
              }, Module._ts_query_capture_name_for_id = function() {
                return (Module._ts_query_capture_name_for_id = Module.asm.ts_query_capture_name_for_id).apply(null, arguments);
              }, Module._ts_query_string_value_for_id = function() {
                return (Module._ts_query_string_value_for_id = Module.asm.ts_query_string_value_for_id).apply(null, arguments);
              }, Module._ts_query_predicates_for_pattern = function() {
                return (Module._ts_query_predicates_for_pattern = Module.asm.ts_query_predicates_for_pattern).apply(null, arguments);
              }, Module._ts_tree_copy = function() {
                return (Module._ts_tree_copy = Module.asm.ts_tree_copy).apply(null, arguments);
              }, Module._ts_tree_delete = function() {
                return (Module._ts_tree_delete = Module.asm.ts_tree_delete).apply(null, arguments);
              }, Module._ts_init = function() {
                return (Module._ts_init = Module.asm.ts_init).apply(null, arguments);
              }, Module._ts_parser_new_wasm = function() {
                return (Module._ts_parser_new_wasm = Module.asm.ts_parser_new_wasm).apply(null, arguments);
              }, Module._ts_parser_enable_logger_wasm = function() {
                return (Module._ts_parser_enable_logger_wasm = Module.asm.ts_parser_enable_logger_wasm).apply(null, arguments);
              }, Module._ts_parser_parse_wasm = function() {
                return (Module._ts_parser_parse_wasm = Module.asm.ts_parser_parse_wasm).apply(null, arguments);
              }, Module._ts_language_type_is_named_wasm = function() {
                return (Module._ts_language_type_is_named_wasm = Module.asm.ts_language_type_is_named_wasm).apply(null, arguments);
              }, Module._ts_language_type_is_visible_wasm = function() {
                return (Module._ts_language_type_is_visible_wasm = Module.asm.ts_language_type_is_visible_wasm).apply(null, arguments);
              }, Module._ts_tree_root_node_wasm = function() {
                return (Module._ts_tree_root_node_wasm = Module.asm.ts_tree_root_node_wasm).apply(null, arguments);
              }, Module._ts_tree_edit_wasm = function() {
                return (Module._ts_tree_edit_wasm = Module.asm.ts_tree_edit_wasm).apply(null, arguments);
              }, Module._ts_tree_get_changed_ranges_wasm = function() {
                return (Module._ts_tree_get_changed_ranges_wasm = Module.asm.ts_tree_get_changed_ranges_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_new_wasm = function() {
                return (Module._ts_tree_cursor_new_wasm = Module.asm.ts_tree_cursor_new_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_delete_wasm = function() {
                return (Module._ts_tree_cursor_delete_wasm = Module.asm.ts_tree_cursor_delete_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_reset_wasm = function() {
                return (Module._ts_tree_cursor_reset_wasm = Module.asm.ts_tree_cursor_reset_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_goto_first_child_wasm = function() {
                return (Module._ts_tree_cursor_goto_first_child_wasm = Module.asm.ts_tree_cursor_goto_first_child_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_goto_next_sibling_wasm = function() {
                return (Module._ts_tree_cursor_goto_next_sibling_wasm = Module.asm.ts_tree_cursor_goto_next_sibling_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_goto_parent_wasm = function() {
                return (Module._ts_tree_cursor_goto_parent_wasm = Module.asm.ts_tree_cursor_goto_parent_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_current_node_type_id_wasm = function() {
                return (Module._ts_tree_cursor_current_node_type_id_wasm = Module.asm.ts_tree_cursor_current_node_type_id_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_current_node_is_named_wasm = function() {
                return (Module._ts_tree_cursor_current_node_is_named_wasm = Module.asm.ts_tree_cursor_current_node_is_named_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_current_node_is_missing_wasm = function() {
                return (Module._ts_tree_cursor_current_node_is_missing_wasm = Module.asm.ts_tree_cursor_current_node_is_missing_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_current_node_id_wasm = function() {
                return (Module._ts_tree_cursor_current_node_id_wasm = Module.asm.ts_tree_cursor_current_node_id_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_start_position_wasm = function() {
                return (Module._ts_tree_cursor_start_position_wasm = Module.asm.ts_tree_cursor_start_position_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_end_position_wasm = function() {
                return (Module._ts_tree_cursor_end_position_wasm = Module.asm.ts_tree_cursor_end_position_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_start_index_wasm = function() {
                return (Module._ts_tree_cursor_start_index_wasm = Module.asm.ts_tree_cursor_start_index_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_end_index_wasm = function() {
                return (Module._ts_tree_cursor_end_index_wasm = Module.asm.ts_tree_cursor_end_index_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_current_field_id_wasm = function() {
                return (Module._ts_tree_cursor_current_field_id_wasm = Module.asm.ts_tree_cursor_current_field_id_wasm).apply(null, arguments);
              }, Module._ts_tree_cursor_current_node_wasm = function() {
                return (Module._ts_tree_cursor_current_node_wasm = Module.asm.ts_tree_cursor_current_node_wasm).apply(null, arguments);
              }, Module._ts_node_symbol_wasm = function() {
                return (Module._ts_node_symbol_wasm = Module.asm.ts_node_symbol_wasm).apply(null, arguments);
              }, Module._ts_node_child_count_wasm = function() {
                return (Module._ts_node_child_count_wasm = Module.asm.ts_node_child_count_wasm).apply(null, arguments);
              }, Module._ts_node_named_child_count_wasm = function() {
                return (Module._ts_node_named_child_count_wasm = Module.asm.ts_node_named_child_count_wasm).apply(null, arguments);
              }, Module._ts_node_child_wasm = function() {
                return (Module._ts_node_child_wasm = Module.asm.ts_node_child_wasm).apply(null, arguments);
              }, Module._ts_node_named_child_wasm = function() {
                return (Module._ts_node_named_child_wasm = Module.asm.ts_node_named_child_wasm).apply(null, arguments);
              }, Module._ts_node_child_by_field_id_wasm = function() {
                return (Module._ts_node_child_by_field_id_wasm = Module.asm.ts_node_child_by_field_id_wasm).apply(null, arguments);
              }, Module._ts_node_next_sibling_wasm = function() {
                return (Module._ts_node_next_sibling_wasm = Module.asm.ts_node_next_sibling_wasm).apply(null, arguments);
              }, Module._ts_node_prev_sibling_wasm = function() {
                return (Module._ts_node_prev_sibling_wasm = Module.asm.ts_node_prev_sibling_wasm).apply(null, arguments);
              }, Module._ts_node_next_named_sibling_wasm = function() {
                return (Module._ts_node_next_named_sibling_wasm = Module.asm.ts_node_next_named_sibling_wasm).apply(null, arguments);
              }, Module._ts_node_prev_named_sibling_wasm = function() {
                return (Module._ts_node_prev_named_sibling_wasm = Module.asm.ts_node_prev_named_sibling_wasm).apply(null, arguments);
              }, Module._ts_node_parent_wasm = function() {
                return (Module._ts_node_parent_wasm = Module.asm.ts_node_parent_wasm).apply(null, arguments);
              }, Module._ts_node_descendant_for_index_wasm = function() {
                return (Module._ts_node_descendant_for_index_wasm = Module.asm.ts_node_descendant_for_index_wasm).apply(null, arguments);
              }, Module._ts_node_named_descendant_for_index_wasm = function() {
                return (Module._ts_node_named_descendant_for_index_wasm = Module.asm.ts_node_named_descendant_for_index_wasm).apply(null, arguments);
              }, Module._ts_node_descendant_for_position_wasm = function() {
                return (Module._ts_node_descendant_for_position_wasm = Module.asm.ts_node_descendant_for_position_wasm).apply(null, arguments);
              }, Module._ts_node_named_descendant_for_position_wasm = function() {
                return (Module._ts_node_named_descendant_for_position_wasm = Module.asm.ts_node_named_descendant_for_position_wasm).apply(null, arguments);
              }, Module._ts_node_start_point_wasm = function() {
                return (Module._ts_node_start_point_wasm = Module.asm.ts_node_start_point_wasm).apply(null, arguments);
              }, Module._ts_node_end_point_wasm = function() {
                return (Module._ts_node_end_point_wasm = Module.asm.ts_node_end_point_wasm).apply(null, arguments);
              }, Module._ts_node_start_index_wasm = function() {
                return (Module._ts_node_start_index_wasm = Module.asm.ts_node_start_index_wasm).apply(null, arguments);
              }, Module._ts_node_end_index_wasm = function() {
                return (Module._ts_node_end_index_wasm = Module.asm.ts_node_end_index_wasm).apply(null, arguments);
              }, Module._ts_node_to_string_wasm = function() {
                return (Module._ts_node_to_string_wasm = Module.asm.ts_node_to_string_wasm).apply(null, arguments);
              }, Module._ts_node_children_wasm = function() {
                return (Module._ts_node_children_wasm = Module.asm.ts_node_children_wasm).apply(null, arguments);
              }, Module._ts_node_named_children_wasm = function() {
                return (Module._ts_node_named_children_wasm = Module.asm.ts_node_named_children_wasm).apply(null, arguments);
              }, Module._ts_node_descendants_of_type_wasm = function() {
                return (Module._ts_node_descendants_of_type_wasm = Module.asm.ts_node_descendants_of_type_wasm).apply(null, arguments);
              }, Module._ts_node_is_named_wasm = function() {
                return (Module._ts_node_is_named_wasm = Module.asm.ts_node_is_named_wasm).apply(null, arguments);
              }, Module._ts_node_has_changes_wasm = function() {
                return (Module._ts_node_has_changes_wasm = Module.asm.ts_node_has_changes_wasm).apply(null, arguments);
              }, Module._ts_node_has_error_wasm = function() {
                return (Module._ts_node_has_error_wasm = Module.asm.ts_node_has_error_wasm).apply(null, arguments);
              }, Module._ts_node_is_missing_wasm = function() {
                return (Module._ts_node_is_missing_wasm = Module.asm.ts_node_is_missing_wasm).apply(null, arguments);
              }, Module._ts_query_matches_wasm = function() {
                return (Module._ts_query_matches_wasm = Module.asm.ts_query_matches_wasm).apply(null, arguments);
              }, Module._ts_query_captures_wasm = function() {
                return (Module._ts_query_captures_wasm = Module.asm.ts_query_captures_wasm).apply(null, arguments);
              }, Module._iswdigit = function() {
                return (Module._iswdigit = Module.asm.iswdigit).apply(null, arguments);
              }, Module._iswalpha = function() {
                return (Module._iswalpha = Module.asm.iswalpha).apply(null, arguments);
              }, Module._iswlower = function() {
                return (Module._iswlower = Module.asm.iswlower).apply(null, arguments);
              }, Module._towupper = function() {
                return (Module._towupper = Module.asm.towupper).apply(null, arguments);
              }, Module.___errno_location = function() {
                return (je = Module.___errno_location = Module.asm.__errno_location).apply(null, arguments);
              }), Ue = (Module._memchr = function() {
                return (Module._memchr = Module.asm.memchr).apply(null, arguments);
              }, Module._strlen = function() {
                return (Module._strlen = Module.asm.strlen).apply(null, arguments);
              }, Module.stackSave = function() {
                return (Ue = Module.stackSave = Module.asm.stackSave).apply(null, arguments);
              }), De = Module.stackRestore = function() {
                return (De = Module.stackRestore = Module.asm.stackRestore).apply(null, arguments);
              }, ze = Module.stackAlloc = function() {
                return (ze = Module.stackAlloc = Module.asm.stackAlloc).apply(null, arguments);
              }, Ge = Module._setThrew = function() {
                return (Ge = Module._setThrew = Module.asm.setThrew).apply(null, arguments);
              };
              Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = function() {
                return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev).apply(null, arguments);
              }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = function() {
                return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm).apply(null, arguments);
              }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = function() {
                return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm).apply(null, arguments);
              }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = function() {
                return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm).apply(null, arguments);
              }, Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = function() {
                return (Module.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = Module.asm._ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm).apply(null, arguments);
              }, Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = function() {
                return (Module.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = Module.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc).apply(null, arguments);
              }, Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = function() {
                return (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev).apply(null, arguments);
              }, Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = function() {
                return (Module.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = Module.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw).apply(null, arguments);
              }, Module.__Znwm = function() {
                return (Module.__Znwm = Module.asm._Znwm).apply(null, arguments);
              }, Module.__ZdlPv = function() {
                return (Module.__ZdlPv = Module.asm._ZdlPv).apply(null, arguments);
              }, Module.__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv = function() {
                return (Module.__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv = Module.asm._ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv).apply(null, arguments);
              }, Module._orig$ts_parser_timeout_micros = function() {
                return (Module._orig$ts_parser_timeout_micros = Module.asm.orig$ts_parser_timeout_micros).apply(null, arguments);
              }, Module._orig$ts_parser_set_timeout_micros = function() {
                return (Module._orig$ts_parser_set_timeout_micros = Module.asm.orig$ts_parser_set_timeout_micros).apply(null, arguments);
              };
              function He(e3) {
                this.name = "ExitStatus", this.message = "Program terminated with exit(" + e3 + ")", this.status = e3;
              }
              Module.allocate = function(e3, t2) {
                var r3;
                return r3 = t2 == C ? ze(e3.length) : $e(e3.length), e3.subarray || e3.slice ? T.set(e3, r3) : T.set(new Uint8Array(e3), r3), r3;
              };
              re = function e3() {
                Ze || Ke(), Ze || (re = e3);
              };
              var Be = false;
              function Ke(e3) {
                function t2() {
                  Ze || (Ze = true, Module.calledRun = true, P || (Y = true, pe(X), pe(Q), Module.onRuntimeInitialized && Module.onRuntimeInitialized(), Xe && function(e4) {
                    var t3 = Module._main;
                    if (t3) {
                      var r3 = (e4 = e4 || []).length + 1, n2 = ze(4 * (r3 + 1));
                      W[n2 >> 2] = G(a);
                      for (var s2 = 1; s2 < r3; s2++)
                        W[(n2 >> 2) + s2] = G(e4[s2 - 1]);
                      W[(n2 >> 2) + r3] = 0;
                      try {
                        Ve(t3(r3, n2), true);
                      } catch (e5) {
                        if (e5 instanceof He)
                          return;
                        if (e5 == "unwind")
                          return;
                        var o2 = e5;
                        e5 && typeof e5 == "object" && e5.stack && (o2 = [e5, e5.stack]), g("exception thrown: " + o2), u(1, e5);
                      } finally {
                        true;
                      }
                    }
                  }(e3), function() {
                    if (Module.postRun)
                      for (typeof Module.postRun == "function" && (Module.postRun = [Module.postRun]); Module.postRun.length; )
                        e4 = Module.postRun.shift(), J.unshift(e4);
                    var e4;
                    pe(J);
                  }()));
                }
                e3 = e3 || _, ee > 0 || !Be && (function() {
                  if (I.length) {
                    if (!m)
                      return ne(), void I.reduce(function(e4, t3) {
                        return e4.then(function() {
                          return Ne(t3, { loadAsync: true, global: true, nodelete: true, allowUndefined: true });
                        });
                      }, Promise.resolve()).then(function() {
                        se(), Pe();
                      });
                    I.forEach(function(e4) {
                      Ne(e4, { global: true, nodelete: true, allowUndefined: true });
                    }), Pe();
                  } else
                    Pe();
                }(), Be = true, ee > 0) || (!function() {
                  if (Module.preRun)
                    for (typeof Module.preRun == "function" && (Module.preRun = [Module.preRun]); Module.preRun.length; )
                      e4 = Module.preRun.shift(), V.unshift(e4);
                  var e4;
                  pe(V);
                }(), ee > 0 || (Module.setStatus ? (Module.setStatus("Running..."), setTimeout(function() {
                  setTimeout(function() {
                    Module.setStatus("");
                  }, 1), t2();
                }, 1)) : t2()));
              }
              function Ve(e3, t2) {
                e3, t2 && we() && e3 === 0 || (we() || (true, Module.onExit && Module.onExit(e3), P = true), u(e3, new He(e3)));
              }
              if (Module.run = Ke, Module.preInit)
                for (typeof Module.preInit == "function" && (Module.preInit = [Module.preInit]); Module.preInit.length > 0; )
                  Module.preInit.pop()();
              var Xe = true;
              Module.noInitialRun && (Xe = false), Ke();
              const Qe = Module, Je = {}, Ye = 4, et = 5 * Ye, tt = 2 * Ye, rt = 2 * Ye + 2 * tt, nt = { row: 0, column: 0 }, st = /[\w-.]*/g, ot = 1, _t = 2, at = /^_?tree_sitter_\w+/;
              var ut, it, lt, dt, ct;
              class ParserImpl {
                static init() {
                  lt = Qe._ts_init(), ut = N(lt, "i32"), it = N(lt + Ye, "i32");
                }
                initialize() {
                  Qe._ts_parser_new_wasm(), this[0] = N(lt, "i32"), this[1] = N(lt + Ye, "i32");
                }
                delete() {
                  Qe._ts_parser_delete(this[0]), Qe._free(this[1]), this[0] = 0, this[1] = 0;
                }
                setLanguage(e3) {
                  let t2;
                  if (e3) {
                    if (e3.constructor !== Language)
                      throw new Error("Argument must be a Language");
                    {
                      t2 = e3[0];
                      const r3 = Qe._ts_language_version(t2);
                      if (r3 < it || ut < r3)
                        throw new Error(`Incompatible language version ${r3}. Compatibility range ${it} through ${ut}.`);
                    }
                  } else
                    t2 = 0, e3 = null;
                  return this.language = e3, Qe._ts_parser_set_language(this[0], t2), this;
                }
                getLanguage() {
                  return this.language;
                }
                parse(e3, t2, r3) {
                  if (typeof e3 == "string")
                    dt = (t3, r4, n3) => e3.slice(t3, n3);
                  else {
                    if (typeof e3 != "function")
                      throw new Error("Argument must be a string or a function");
                    dt = e3;
                  }
                  this.logCallback ? (ct = this.logCallback, Qe._ts_parser_enable_logger_wasm(this[0], 1)) : (ct = null, Qe._ts_parser_enable_logger_wasm(this[0], 0));
                  let n2 = 0, s2 = 0;
                  if (r3 && r3.includedRanges) {
                    n2 = r3.includedRanges.length;
                    let e4 = s2 = Qe._calloc(n2, rt);
                    for (let t3 = 0; t3 < n2; t3++)
                      Et(e4, r3.includedRanges[t3]), e4 += rt;
                  }
                  const o2 = Qe._ts_parser_parse_wasm(this[0], this[1], t2 ? t2[0] : 0, s2, n2);
                  if (!o2)
                    throw dt = null, ct = null, new Error("Parsing failed");
                  const _2 = new Tree(Je, o2, this.language, dt);
                  return dt = null, ct = null, _2;
                }
                reset() {
                  Qe._ts_parser_reset(this[0]);
                }
                setTimeoutMicros(e3) {
                  Qe._ts_parser_set_timeout_micros(this[0], e3);
                }
                getTimeoutMicros() {
                  return Qe._ts_parser_timeout_micros(this[0]);
                }
                setLogger(e3) {
                  if (e3) {
                    if (typeof e3 != "function")
                      throw new Error("Logger callback must be a function");
                  } else
                    e3 = null;
                  return this.logCallback = e3, this;
                }
                getLogger() {
                  return this.logCallback;
                }
              }
              class Tree {
                constructor(e3, t2, r3, n2) {
                  pt(e3), this[0] = t2, this.language = r3, this.textCallback = n2;
                }
                copy() {
                  const e3 = Qe._ts_tree_copy(this[0]);
                  return new Tree(Je, e3, this.language, this.textCallback);
                }
                delete() {
                  Qe._ts_tree_delete(this[0]), this[0] = 0;
                }
                edit(e3) {
                  !function(e4) {
                    let t2 = lt;
                    bt(t2, e4.startPosition), bt(t2 += tt, e4.oldEndPosition), bt(t2 += tt, e4.newEndPosition), x(t2 += tt, e4.startIndex, "i32"), x(t2 += Ye, e4.oldEndIndex, "i32"), x(t2 += Ye, e4.newEndIndex, "i32"), t2 += Ye;
                  }(e3), Qe._ts_tree_edit_wasm(this[0]);
                }
                get rootNode() {
                  return Qe._ts_tree_root_node_wasm(this[0]), wt(this);
                }
                getLanguage() {
                  return this.language;
                }
                walk() {
                  return this.rootNode.walk();
                }
                getChangedRanges(e3) {
                  if (e3.constructor !== Tree)
                    throw new TypeError("Argument must be a Tree");
                  Qe._ts_tree_get_changed_ranges_wasm(this[0], e3[0]);
                  const t2 = N(lt, "i32"), r3 = N(lt + Ye, "i32"), n2 = new Array(t2);
                  if (t2 > 0) {
                    let e4 = r3;
                    for (let r4 = 0; r4 < t2; r4++)
                      n2[r4] = It(e4), e4 += rt;
                    Qe._free(r3);
                  }
                  return n2;
                }
              }
              class Node2 {
                constructor(e3, t2) {
                  pt(e3), this.tree = t2;
                }
                get typeId() {
                  return gt(this), Qe._ts_node_symbol_wasm(this.tree[0]);
                }
                get type() {
                  return this.tree.language.types[this.typeId] || "ERROR";
                }
                get endPosition() {
                  return gt(this), Qe._ts_node_end_point_wasm(this.tree[0]), vt(lt);
                }
                get endIndex() {
                  return gt(this), Qe._ts_node_end_index_wasm(this.tree[0]);
                }
                get text() {
                  return mt(this.tree, this.startIndex, this.endIndex);
                }
                isNamed() {
                  return gt(this), Qe._ts_node_is_named_wasm(this.tree[0]) === 1;
                }
                hasError() {
                  return gt(this), Qe._ts_node_has_error_wasm(this.tree[0]) === 1;
                }
                hasChanges() {
                  return gt(this), Qe._ts_node_has_changes_wasm(this.tree[0]) === 1;
                }
                isMissing() {
                  return gt(this), Qe._ts_node_is_missing_wasm(this.tree[0]) === 1;
                }
                equals(e3) {
                  return this.id === e3.id;
                }
                child(e3) {
                  return gt(this), Qe._ts_node_child_wasm(this.tree[0], e3), wt(this.tree);
                }
                namedChild(e3) {
                  return gt(this), Qe._ts_node_named_child_wasm(this.tree[0], e3), wt(this.tree);
                }
                childForFieldId(e3) {
                  return gt(this), Qe._ts_node_child_by_field_id_wasm(this.tree[0], e3), wt(this.tree);
                }
                childForFieldName(e3) {
                  const t2 = this.tree.language.fields.indexOf(e3);
                  if (t2 !== -1)
                    return this.childForFieldId(t2);
                }
                get childCount() {
                  return gt(this), Qe._ts_node_child_count_wasm(this.tree[0]);
                }
                get namedChildCount() {
                  return gt(this), Qe._ts_node_named_child_count_wasm(this.tree[0]);
                }
                get firstChild() {
                  return this.child(0);
                }
                get firstNamedChild() {
                  return this.namedChild(0);
                }
                get lastChild() {
                  return this.child(this.childCount - 1);
                }
                get lastNamedChild() {
                  return this.namedChild(this.namedChildCount - 1);
                }
                get children() {
                  if (!this._children) {
                    gt(this), Qe._ts_node_children_wasm(this.tree[0]);
                    const e3 = N(lt, "i32"), t2 = N(lt + Ye, "i32");
                    if (this._children = new Array(e3), e3 > 0) {
                      let r3 = t2;
                      for (let t3 = 0; t3 < e3; t3++)
                        this._children[t3] = wt(this.tree, r3), r3 += et;
                      Qe._free(t2);
                    }
                  }
                  return this._children;
                }
                get namedChildren() {
                  if (!this._namedChildren) {
                    gt(this), Qe._ts_node_named_children_wasm(this.tree[0]);
                    const e3 = N(lt, "i32"), t2 = N(lt + Ye, "i32");
                    if (this._namedChildren = new Array(e3), e3 > 0) {
                      let r3 = t2;
                      for (let t3 = 0; t3 < e3; t3++)
                        this._namedChildren[t3] = wt(this.tree, r3), r3 += et;
                      Qe._free(t2);
                    }
                  }
                  return this._namedChildren;
                }
                descendantsOfType(e3, t2, r3) {
                  Array.isArray(e3) || (e3 = [e3]), t2 || (t2 = nt), r3 || (r3 = nt);
                  const n2 = [], s2 = this.tree.language.types;
                  for (let t3 = 0, r4 = s2.length; t3 < r4; t3++)
                    e3.includes(s2[t3]) && n2.push(t3);
                  const o2 = Qe._malloc(Ye * n2.length);
                  for (let e4 = 0, t3 = n2.length; e4 < t3; e4++)
                    x(o2 + e4 * Ye, n2[e4], "i32");
                  gt(this), Qe._ts_node_descendants_of_type_wasm(this.tree[0], o2, n2.length, t2.row, t2.column, r3.row, r3.column);
                  const _2 = N(lt, "i32"), a2 = N(lt + Ye, "i32"), u2 = new Array(_2);
                  if (_2 > 0) {
                    let e4 = a2;
                    for (let t3 = 0; t3 < _2; t3++)
                      u2[t3] = wt(this.tree, e4), e4 += et;
                  }
                  return Qe._free(a2), Qe._free(o2), u2;
                }
                get nextSibling() {
                  return gt(this), Qe._ts_node_next_sibling_wasm(this.tree[0]), wt(this.tree);
                }
                get previousSibling() {
                  return gt(this), Qe._ts_node_prev_sibling_wasm(this.tree[0]), wt(this.tree);
                }
                get nextNamedSibling() {
                  return gt(this), Qe._ts_node_next_named_sibling_wasm(this.tree[0]), wt(this.tree);
                }
                get previousNamedSibling() {
                  return gt(this), Qe._ts_node_prev_named_sibling_wasm(this.tree[0]), wt(this.tree);
                }
                get parent() {
                  return gt(this), Qe._ts_node_parent_wasm(this.tree[0]), wt(this.tree);
                }
                descendantForIndex(e3, t2 = e3) {
                  if (typeof e3 != "number" || typeof t2 != "number")
                    throw new Error("Arguments must be numbers");
                  gt(this);
                  let r3 = lt + et;
                  return x(r3, e3, "i32"), x(r3 + Ye, t2, "i32"), Qe._ts_node_descendant_for_index_wasm(this.tree[0]), wt(this.tree);
                }
                namedDescendantForIndex(e3, t2 = e3) {
                  if (typeof e3 != "number" || typeof t2 != "number")
                    throw new Error("Arguments must be numbers");
                  gt(this);
                  let r3 = lt + et;
                  return x(r3, e3, "i32"), x(r3 + Ye, t2, "i32"), Qe._ts_node_named_descendant_for_index_wasm(this.tree[0]), wt(this.tree);
                }
                descendantForPosition(e3, t2 = e3) {
                  if (!ht(e3) || !ht(t2))
                    throw new Error("Arguments must be {row, column} objects");
                  gt(this);
                  let r3 = lt + et;
                  return bt(r3, e3), bt(r3 + tt, t2), Qe._ts_node_descendant_for_position_wasm(this.tree[0]), wt(this.tree);
                }
                namedDescendantForPosition(e3, t2 = e3) {
                  if (!ht(e3) || !ht(t2))
                    throw new Error("Arguments must be {row, column} objects");
                  gt(this);
                  let r3 = lt + et;
                  return bt(r3, e3), bt(r3 + tt, t2), Qe._ts_node_named_descendant_for_position_wasm(this.tree[0]), wt(this.tree);
                }
                walk() {
                  return gt(this), Qe._ts_tree_cursor_new_wasm(this.tree[0]), new TreeCursor(Je, this.tree);
                }
                toString() {
                  gt(this);
                  const e3 = Qe._ts_node_to_string_wasm(this.tree[0]), t2 = function(e4) {
                    for (var t3 = ""; ; ) {
                      var r3 = T[e4++ >> 0];
                      if (!r3)
                        return t3;
                      t3 += String.fromCharCode(r3);
                    }
                  }(e3);
                  return Qe._free(e3), t2;
                }
              }
              class TreeCursor {
                constructor(e3, t2) {
                  pt(e3), this.tree = t2, Mt(this);
                }
                delete() {
                  yt(this), Qe._ts_tree_cursor_delete_wasm(this.tree[0]), this[0] = this[1] = this[2] = 0;
                }
                reset(e3) {
                  gt(e3), yt(this, lt + et), Qe._ts_tree_cursor_reset_wasm(this.tree[0]), Mt(this);
                }
                get nodeType() {
                  return this.tree.language.types[this.nodeTypeId] || "ERROR";
                }
                get nodeTypeId() {
                  return yt(this), Qe._ts_tree_cursor_current_node_type_id_wasm(this.tree[0]);
                }
                get nodeId() {
                  return yt(this), Qe._ts_tree_cursor_current_node_id_wasm(this.tree[0]);
                }
                get nodeIsNamed() {
                  return yt(this), Qe._ts_tree_cursor_current_node_is_named_wasm(this.tree[0]) === 1;
                }
                get nodeIsMissing() {
                  return yt(this), Qe._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0]) === 1;
                }
                get nodeText() {
                  yt(this);
                  const e3 = Qe._ts_tree_cursor_start_index_wasm(this.tree[0]), t2 = Qe._ts_tree_cursor_end_index_wasm(this.tree[0]);
                  return mt(this.tree, e3, t2);
                }
                get startPosition() {
                  return yt(this), Qe._ts_tree_cursor_start_position_wasm(this.tree[0]), vt(lt);
                }
                get endPosition() {
                  return yt(this), Qe._ts_tree_cursor_end_position_wasm(this.tree[0]), vt(lt);
                }
                get startIndex() {
                  return yt(this), Qe._ts_tree_cursor_start_index_wasm(this.tree[0]);
                }
                get endIndex() {
                  return yt(this), Qe._ts_tree_cursor_end_index_wasm(this.tree[0]);
                }
                currentNode() {
                  return yt(this), Qe._ts_tree_cursor_current_node_wasm(this.tree[0]), wt(this.tree);
                }
                currentFieldId() {
                  return yt(this), Qe._ts_tree_cursor_current_field_id_wasm(this.tree[0]);
                }
                currentFieldName() {
                  return this.tree.language.fields[this.currentFieldId()];
                }
                gotoFirstChild() {
                  yt(this);
                  const e3 = Qe._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
                  return Mt(this), e3 === 1;
                }
                gotoNextSibling() {
                  yt(this);
                  const e3 = Qe._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
                  return Mt(this), e3 === 1;
                }
                gotoParent() {
                  yt(this);
                  const e3 = Qe._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
                  return Mt(this), e3 === 1;
                }
              }
              class Language {
                constructor(e3, t2) {
                  pt(e3), this[0] = t2, this.types = new Array(Qe._ts_language_symbol_count(this[0]));
                  for (let e4 = 0, t3 = this.types.length; e4 < t3; e4++)
                    Qe._ts_language_symbol_type(this[0], e4) < 2 && (this.types[e4] = j(Qe._ts_language_symbol_name(this[0], e4)));
                  this.fields = new Array(Qe._ts_language_field_count(this[0]) + 1);
                  for (let e4 = 0, t3 = this.fields.length; e4 < t3; e4++) {
                    const t4 = Qe._ts_language_field_name_for_id(this[0], e4);
                    this.fields[e4] = t4 !== 0 ? j(t4) : null;
                  }
                }
                get version() {
                  return Qe._ts_language_version(this[0]);
                }
                get fieldCount() {
                  return this.fields.length - 1;
                }
                fieldIdForName(e3) {
                  const t2 = this.fields.indexOf(e3);
                  return t2 !== -1 ? t2 : null;
                }
                fieldNameForId(e3) {
                  return this.fields[e3] || null;
                }
                idForNodeType(e3, t2) {
                  const r3 = z(e3), n2 = Qe._malloc(r3 + 1);
                  D(e3, n2, r3 + 1);
                  const s2 = Qe._ts_language_symbol_for_name(this[0], n2, r3, t2);
                  return Qe._free(n2), s2 || null;
                }
                get nodeTypeCount() {
                  return Qe._ts_language_symbol_count(this[0]);
                }
                nodeTypeForId(e3) {
                  const t2 = Qe._ts_language_symbol_name(this[0], e3);
                  return t2 ? j(t2) : null;
                }
                nodeTypeIsNamed(e3) {
                  return !!Qe._ts_language_type_is_named_wasm(this[0], e3);
                }
                nodeTypeIsVisible(e3) {
                  return !!Qe._ts_language_type_is_visible_wasm(this[0], e3);
                }
                query(e3) {
                  const t2 = z(e3), r3 = Qe._malloc(t2 + 1);
                  D(e3, r3, t2 + 1);
                  const n2 = Qe._ts_query_new(this[0], r3, t2, lt, lt + Ye);
                  if (!n2) {
                    const t3 = N(lt + Ye, "i32"), n3 = j(r3, N(lt, "i32")).length, s3 = e3.substr(n3, 100).split("\n")[0];
                    let o3, _3 = s3.match(st)[0];
                    switch (t3) {
                      case 2:
                        o3 = new RangeError(`Bad node name '${_3}'`);
                        break;
                      case 3:
                        o3 = new RangeError(`Bad field name '${_3}'`);
                        break;
                      case 4:
                        o3 = new RangeError(`Bad capture name @${_3}`);
                        break;
                      case 5:
                        o3 = new TypeError(`Bad pattern structure at offset ${n3}: '${s3}'...`), _3 = "";
                        break;
                      default:
                        o3 = new SyntaxError(`Bad syntax at offset ${n3}: '${s3}'...`), _3 = "";
                    }
                    throw o3.index = n3, o3.length = _3.length, Qe._free(r3), o3;
                  }
                  const s2 = Qe._ts_query_string_count(n2), o2 = Qe._ts_query_capture_count(n2), _2 = Qe._ts_query_pattern_count(n2), a2 = new Array(o2), u2 = new Array(s2);
                  for (let e4 = 0; e4 < o2; e4++) {
                    const t3 = Qe._ts_query_capture_name_for_id(n2, e4, lt), r4 = N(lt, "i32");
                    a2[e4] = j(t3, r4);
                  }
                  for (let e4 = 0; e4 < s2; e4++) {
                    const t3 = Qe._ts_query_string_value_for_id(n2, e4, lt), r4 = N(lt, "i32");
                    u2[e4] = j(t3, r4);
                  }
                  const i2 = new Array(_2), l2 = new Array(_2), d2 = new Array(_2), c2 = new Array(_2), m2 = new Array(_2);
                  for (let e4 = 0; e4 < _2; e4++) {
                    const t3 = Qe._ts_query_predicates_for_pattern(n2, e4, lt), r4 = N(lt, "i32");
                    c2[e4] = [], m2[e4] = [];
                    const s3 = [];
                    let o3 = t3;
                    for (let t4 = 0; t4 < r4; t4++) {
                      const t5 = N(o3, "i32"), r5 = N(o3 += Ye, "i32");
                      if (o3 += Ye, t5 === ot)
                        s3.push({ type: "capture", name: a2[r5] });
                      else if (t5 === _t)
                        s3.push({ type: "string", value: u2[r5] });
                      else if (s3.length > 0) {
                        if (s3[0].type !== "string")
                          throw new Error("Predicates must begin with a literal value");
                        const t6 = s3[0].value;
                        let r6 = true;
                        switch (t6) {
                          case "not-eq?":
                            r6 = false;
                          case "eq?":
                            if (s3.length !== 3)
                              throw new Error(`Wrong number of arguments to \`#eq?\` predicate. Expected 2, got ${s3.length - 1}`);
                            if (s3[1].type !== "capture")
                              throw new Error(`First argument of \`#eq?\` predicate must be a capture. Got "${s3[1].value}"`);
                            if (s3[2].type === "capture") {
                              const t7 = s3[1].name, n4 = s3[2].name;
                              m2[e4].push(function(e5) {
                                let s4, o5;
                                for (const r7 of e5)
                                  r7.name === t7 && (s4 = r7.node), r7.name === n4 && (o5 = r7.node);
                                return s4 === void 0 || o5 === void 0 || s4.text === o5.text === r6;
                              });
                            } else {
                              const t7 = s3[1].name, n4 = s3[2].value;
                              m2[e4].push(function(e5) {
                                for (const s4 of e5)
                                  if (s4.name === t7)
                                    return s4.node.text === n4 === r6;
                                return true;
                              });
                            }
                            break;
                          case "not-match?":
                            r6 = false;
                          case "match?":
                            if (s3.length !== 3)
                              throw new Error(`Wrong number of arguments to \`#match?\` predicate. Expected 2, got ${s3.length - 1}.`);
                            if (s3[1].type !== "capture")
                              throw new Error(`First argument of \`#match?\` predicate must be a capture. Got "${s3[1].value}".`);
                            if (s3[2].type !== "string")
                              throw new Error(`Second argument of \`#match?\` predicate must be a string. Got @${s3[2].value}.`);
                            const n3 = s3[1].name, o4 = new RegExp(s3[2].value);
                            m2[e4].push(function(e5) {
                              for (const t7 of e5)
                                if (t7.name === n3)
                                  return o4.test(t7.node.text) === r6;
                              return true;
                            });
                            break;
                          case "set!":
                            if (s3.length < 2 || s3.length > 3)
                              throw new Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${s3.length - 1}.`);
                            if (s3.some((e5) => e5.type !== "string"))
                              throw new Error('Arguments to `#set!` predicate must be a strings.".');
                            i2[e4] || (i2[e4] = {}), i2[e4][s3[1].value] = s3[2] ? s3[2].value : null;
                            break;
                          case "is?":
                          case "is-not?":
                            if (s3.length < 2 || s3.length > 3)
                              throw new Error(`Wrong number of arguments to \`#${t6}\` predicate. Expected 1 or 2. Got ${s3.length - 1}.`);
                            if (s3.some((e5) => e5.type !== "string"))
                              throw new Error(`Arguments to \`#${t6}\` predicate must be a strings.".`);
                            const _3 = t6 === "is?" ? l2 : d2;
                            _3[e4] || (_3[e4] = {}), _3[e4][s3[1].value] = s3[2] ? s3[2].value : null;
                            break;
                          default:
                            c2[e4].push({ operator: t6, operands: s3.slice(1) });
                        }
                        s3.length = 0;
                      }
                    }
                    Object.freeze(i2[e4]), Object.freeze(l2[e4]), Object.freeze(d2[e4]);
                  }
                  return Qe._free(r3), new Query(Je, n2, a2, m2, c2, Object.freeze(i2), Object.freeze(l2), Object.freeze(d2));
                }
                static load(e3) {
                  let t2;
                  if (e3 instanceof Uint8Array)
                    t2 = Promise.resolve(e3);
                  else {
                    const r4 = e3;
                    if (typeof define_process_default != "undefined" && define_process_default.versions && define_process_default.versions.node) {
                      const e4 = __require("fs");
                      t2 = Promise.resolve(e4.readFileSync(r4));
                    } else
                      t2 = fetch(r4).then((e4) => e4.arrayBuffer().then((t3) => {
                        if (e4.ok)
                          return new Uint8Array(t3);
                        {
                          const r5 = new TextDecoder("utf-8").decode(t3);
                          throw new Error(`Language.load failed with status ${e4.status}.

${r5}`);
                        }
                      }));
                  }
                  const r3 = typeof loadSideModule == "function" ? loadSideModule : xe;
                  return t2.then((e4) => r3(e4, { loadAsync: true })).then((e4) => {
                    const t3 = Object.keys(e4), r4 = t3.find((e5) => at.test(e5) && !e5.includes("external_scanner_"));
                    r4 || console.log(`Couldn't find language function in WASM file. Symbols:
${JSON.stringify(t3, null, 2)}`);
                    const n2 = e4[r4]();
                    return new Language(Je, n2);
                  });
                }
              }
              class Query {
                constructor(e3, t2, r3, n2, s2, o2, _2, a2) {
                  pt(e3), this[0] = t2, this.captureNames = r3, this.textPredicates = n2, this.predicates = s2, this.setProperties = o2, this.assertedProperties = _2, this.refutedProperties = a2, this.exceededMatchLimit = false;
                }
                delete() {
                  Qe._ts_query_delete(this[0]), this[0] = 0;
                }
                matches(e3, t2, r3, n2) {
                  t2 || (t2 = nt), r3 || (r3 = nt), n2 || (n2 = {});
                  let s2 = n2.matchLimit;
                  if (s2 === void 0)
                    s2 = 0;
                  else if (typeof s2 != "number")
                    throw new Error("Arguments must be numbers");
                  gt(e3), Qe._ts_query_matches_wasm(this[0], e3.tree[0], t2.row, t2.column, r3.row, r3.column, s2);
                  const o2 = N(lt, "i32"), _2 = N(lt + Ye, "i32"), a2 = N(lt + 2 * Ye, "i32"), u2 = new Array(o2);
                  this.exceededMatchLimit = !!a2;
                  let i2 = 0, l2 = _2;
                  for (let t3 = 0; t3 < o2; t3++) {
                    const r4 = N(l2, "i32"), n3 = N(l2 += Ye, "i32");
                    l2 += Ye;
                    const s3 = new Array(n3);
                    if (l2 = ft(this, e3.tree, l2, s3), this.textPredicates[r4].every((e4) => e4(s3))) {
                      u2[i2++] = { pattern: r4, captures: s3 };
                      const e4 = this.setProperties[r4];
                      e4 && (u2[t3].setProperties = e4);
                      const n4 = this.assertedProperties[r4];
                      n4 && (u2[t3].assertedProperties = n4);
                      const o3 = this.refutedProperties[r4];
                      o3 && (u2[t3].refutedProperties = o3);
                    }
                  }
                  return u2.length = i2, Qe._free(_2), u2;
                }
                captures(e3, t2, r3, n2) {
                  t2 || (t2 = nt), r3 || (r3 = nt), n2 || (n2 = {});
                  let s2 = n2.matchLimit;
                  if (s2 === void 0)
                    s2 = 0;
                  else if (typeof s2 != "number")
                    throw new Error("Arguments must be numbers");
                  gt(e3), Qe._ts_query_captures_wasm(this[0], e3.tree[0], t2.row, t2.column, r3.row, r3.column, s2);
                  const o2 = N(lt, "i32"), _2 = N(lt + Ye, "i32"), a2 = N(lt + 2 * Ye, "i32"), u2 = [];
                  this.exceededMatchLimit = !!a2;
                  const i2 = [];
                  let l2 = _2;
                  for (let t3 = 0; t3 < o2; t3++) {
                    const t4 = N(l2, "i32"), r4 = N(l2 += Ye, "i32"), n3 = N(l2 += Ye, "i32");
                    if (l2 += Ye, i2.length = r4, l2 = ft(this, e3.tree, l2, i2), this.textPredicates[t4].every((e4) => e4(i2))) {
                      const e4 = i2[n3], r5 = this.setProperties[t4];
                      r5 && (e4.setProperties = r5);
                      const s3 = this.assertedProperties[t4];
                      s3 && (e4.assertedProperties = s3);
                      const o3 = this.refutedProperties[t4];
                      o3 && (e4.refutedProperties = o3), u2.push(e4);
                    }
                  }
                  return Qe._free(_2), u2;
                }
                predicatesForPattern(e3) {
                  return this.predicates[e3];
                }
                didExceedMatchLimit() {
                  return this.exceededMatchLimit;
                }
              }
              function mt(e3, t2, r3) {
                const n2 = r3 - t2;
                let s2 = e3.textCallback(t2, null, r3);
                for (t2 += s2.length; t2 < r3; ) {
                  const n3 = e3.textCallback(t2, null, r3);
                  if (!(n3 && n3.length > 0))
                    break;
                  t2 += n3.length, s2 += n3;
                }
                return t2 > r3 && (s2 = s2.slice(0, n2)), s2;
              }
              function ft(e3, t2, r3, n2) {
                for (let s2 = 0, o2 = n2.length; s2 < o2; s2++) {
                  const o3 = N(r3, "i32"), _2 = wt(t2, r3 += Ye);
                  r3 += et, n2[s2] = { name: e3.captureNames[o3], node: _2 };
                }
                return r3;
              }
              function pt(e3) {
                if (e3 !== Je)
                  throw new Error("Illegal constructor");
              }
              function ht(e3) {
                return e3 && typeof e3.row == "number" && typeof e3.column == "number";
              }
              function gt(e3) {
                let t2 = lt;
                x(t2, e3.id, "i32"), x(t2 += Ye, e3.startIndex, "i32"), x(t2 += Ye, e3.startPosition.row, "i32"), x(t2 += Ye, e3.startPosition.column, "i32"), x(t2 += Ye, e3[0], "i32");
              }
              function wt(e3, t2 = lt) {
                const r3 = N(t2, "i32");
                if (r3 === 0)
                  return null;
                const n2 = N(t2 += Ye, "i32"), s2 = N(t2 += Ye, "i32"), o2 = N(t2 += Ye, "i32"), _2 = N(t2 += Ye, "i32"), a2 = new Node2(Je, e3);
                return a2.id = r3, a2.startIndex = n2, a2.startPosition = { row: s2, column: o2 }, a2[0] = _2, a2;
              }
              function yt(e3, t2 = lt) {
                x(t2 + 0 * Ye, e3[0], "i32"), x(t2 + 1 * Ye, e3[1], "i32"), x(t2 + 2 * Ye, e3[2], "i32");
              }
              function Mt(e3) {
                e3[0] = N(lt + 0 * Ye, "i32"), e3[1] = N(lt + 1 * Ye, "i32"), e3[2] = N(lt + 2 * Ye, "i32");
              }
              function bt(e3, t2) {
                x(e3, t2.row, "i32"), x(e3 + Ye, t2.column, "i32");
              }
              function vt(e3) {
                return { row: N(e3, "i32"), column: N(e3 + Ye, "i32") };
              }
              function Et(e3, t2) {
                bt(e3, t2.startPosition), bt(e3 += tt, t2.endPosition), x(e3 += tt, t2.startIndex, "i32"), x(e3 += Ye, t2.endIndex, "i32"), e3 += Ye;
              }
              function It(e3) {
                const t2 = {};
                return t2.startPosition = vt(e3), e3 += tt, t2.endPosition = vt(e3), e3 += tt, t2.startIndex = N(e3, "i32"), e3 += Ye, t2.endIndex = N(e3, "i32"), t2;
              }
              for (const e3 of Object.getOwnPropertyNames(ParserImpl.prototype))
                Object.defineProperty(Parser4.prototype, e3, { value: ParserImpl.prototype[e3], enumerable: false, writable: false });
              Parser4.Language = Language, Module.onRuntimeInitialized = () => {
                ParserImpl.init(), e2();
              };
            }));
          }
        }
        return Parser4;
      }();
      typeof exports == "object" && (module.exports = TreeSitter);
    }
  });

  // server/src/common/test-fixture/client/test.all.ts
  init_define_process();

  // server/src/common/test-fixture/client/documentHighlights.test.ts
  init_define_process();
  var import_assert = __toModule(require_assert());

  // server/src/common/common.ts
  init_define_process();
  var lsp = __toModule(require_main4());
  var symbolMapping = new class {
    constructor() {
      this._symbolKindMapping = new Map([
        ["file", lsp.SymbolKind.File],
        ["module", lsp.SymbolKind.Module],
        ["namespace", lsp.SymbolKind.Namespace],
        ["package", lsp.SymbolKind.Package],
        ["class", lsp.SymbolKind.Class],
        ["method", lsp.SymbolKind.Method],
        ["property", lsp.SymbolKind.Property],
        ["field", lsp.SymbolKind.Field],
        ["constructor", lsp.SymbolKind.Constructor],
        ["enum", lsp.SymbolKind.Enum],
        ["interface", lsp.SymbolKind.Interface],
        ["function", lsp.SymbolKind.Function],
        ["variable", lsp.SymbolKind.Variable],
        ["constant", lsp.SymbolKind.Constant],
        ["string", lsp.SymbolKind.String],
        ["number", lsp.SymbolKind.Number],
        ["boolean", lsp.SymbolKind.Boolean],
        ["array", lsp.SymbolKind.Array],
        ["object", lsp.SymbolKind.Object],
        ["key", lsp.SymbolKind.Key],
        ["null", lsp.SymbolKind.Null],
        ["enumMember", lsp.SymbolKind.EnumMember],
        ["struct", lsp.SymbolKind.Struct],
        ["event", lsp.SymbolKind.Event],
        ["operator", lsp.SymbolKind.Operator],
        ["typeParameter", lsp.SymbolKind.TypeParameter]
      ]);
    }
    getSymbolKind(symbolKind, strict) {
      const res = this._symbolKindMapping.get(symbolKind);
      if (!res && strict) {
        return void 0;
      }
      return res ?? lsp.SymbolKind.Variable;
    }
  }();
  function asLspRange(node) {
    return lsp.Range.create(node.startPosition.row, node.startPosition.column, node.endPosition.row, node.endPosition.column);
  }
  function identifierAtPosition(identQuery, node, position) {
    let candidate = nodeAtPosition(node, position, false);
    let capture = identQuery.captures(candidate);
    if (capture.length === 1) {
      return candidate;
    }
    candidate = nodeAtPosition(node, position, true);
    capture = identQuery.captures(candidate);
    if (capture.length === 1) {
      return candidate;
    }
    return void 0;
  }
  function nodeAtPosition(node, position, leftBias = false) {
    for (const child of node.children) {
      const range = asLspRange(child);
      if (isBeforeOrEqual(range.start, position)) {
        if (isBefore(position, range.end)) {
          return nodeAtPosition(child, position, leftBias);
        }
        if (leftBias && isBeforeOrEqual(position, range.end)) {
          return nodeAtPosition(child, position, leftBias);
        }
      }
    }
    return node;
  }
  function isBeforeOrEqual(a, b) {
    if (a.line < b.line) {
      return true;
    }
    if (b.line < a.line) {
      return false;
    }
    return a.character <= b.character;
  }
  function isBefore(a, b) {
    if (a.line < b.line) {
      return true;
    }
    if (b.line < a.line) {
      return false;
    }
    return a.character < b.character;
  }
  function compareRangeByStart(a, b) {
    if (isBefore(a.start, b.start)) {
      return -1;
    } else if (isBefore(b.start, a.start)) {
      return 1;
    }
    if (isBefore(a.end, b.end)) {
      return -1;
    } else if (isBefore(b.end, a.end)) {
      return 1;
    }
    return 0;
  }
  function containsPosition(range, position) {
    return isBeforeOrEqual(range.start, position) && isBeforeOrEqual(position, range.end);
  }
  function containsRange(range, other) {
    return containsPosition(range, other.start) && containsPosition(range, other.end);
  }

  // server/src/common/features/documentHighlights.ts
  init_define_process();
  var lsp3 = __toModule(require_main4());

  // server/src/common/features/locals.ts
  init_define_process();
  var lsp2 = __toModule(require_main4());

  // server/src/common/languages.ts
  init_define_process();
  var import_web_tree_sitter = __toModule(require_tree_sitter());
  var _queryModules = new Map([]);
  var Languages = class {
    static async init(langConfiguration) {
      this._langConfiguration = langConfiguration;
      for (const [entry, config] of langConfiguration) {
        const lang = await import_web_tree_sitter.default.Language.load(entry.wasmUri);
        this._languageInstances.set(entry.languageId, lang);
        this._configurations.set(entry.languageId, config);
        if (entry.queries) {
          _queryModules.set(entry.languageId, entry.queries);
        }
      }
    }
    static getLanguage(languageId) {
      let result = this._languageInstances.get(languageId);
      if (!result) {
        console.warn(`UNKNOWN languages: '${languageId}'`);
        return void 0;
      }
      return result;
    }
    static allAsSelector() {
      return [...this._languageInstances.keys()];
    }
    static getQuery(languageId, type, strict = false) {
      const module = _queryModules.get(languageId);
      if (!module) {
        return this.getLanguage(languageId).query("");
      }
      const source = module[type] ?? "";
      const key = `${languageId}/${type}`;
      let query = this._queryInstances.get(key);
      if (!query) {
        try {
          query = this.getLanguage(languageId).query(source);
        } catch (e) {
          query = this.getLanguage(languageId).query("");
          console.error(languageId, e);
          if (strict) {
            throw e;
          }
        }
        this._queryInstances.set(key, query);
      }
      return query;
    }
    static getSupportedLanguages(feature, types) {
      const result = [];
      for (let languageId of this._languageInstances.keys()) {
        const module = _queryModules.get(languageId);
        if (!module) {
          console.warn(`${languageId} NOT supported by queries`);
          continue;
        }
        for (let type of types) {
          if (module[type] && this._configurations.get(languageId)?.[feature]) {
            result.push(languageId);
            break;
          }
        }
      }
      return result;
    }
    static getLanguageIdByUri(uri) {
      let end = uri.lastIndexOf("?");
      if (end < 0) {
        end = uri.lastIndexOf("#");
      }
      if (end > 0) {
        uri = uri.substring(0, end);
      }
      const start = uri.lastIndexOf(".");
      const suffix = uri.substring(start + 1);
      for (let [info] of this._langConfiguration) {
        for (let candidate of info.suffixes) {
          if (candidate === suffix) {
            return info.languageId;
          }
        }
      }
      return `unknown/${uri}`;
    }
  };
  Languages._languageInstances = new Map();
  Languages._queryInstances = new Map();
  Languages._configurations = new Map();

  // server/src/common/features/locals.ts
  var Locals = class {
    constructor(document, root) {
      this.document = document;
      this.root = root;
    }
    static create(document, trees) {
      const root = new Scope(lsp2.Range.create(0, 0, document.lineCount, 0), true);
      const tree = trees.getParseTree(document);
      if (!tree) {
        return new Locals(document, root);
      }
      const all = [];
      const query = Languages.getQuery(document.languageId, "locals");
      const captures = query.captures(tree.rootNode).sort(this._compareCaptures);
      const scopeCaptures = captures.filter((capture) => capture.name.startsWith("scope"));
      for (let i = 0; i < scopeCaptures.length; i++) {
        const capture = scopeCaptures[i];
        const range = asLspRange(capture.node);
        all.push(new Scope(range, capture.name.endsWith(".exports")));
      }
      this._fillInDefinitionsAndUsages(all, captures);
      this._constructTree(root, all);
      const info = new Locals(document, root);
      return info;
    }
    static _fillInDefinitionsAndUsages(bucket, captures) {
      for (const capture of captures) {
        if (capture.name.startsWith("local")) {
          bucket.push(new Definition(capture.node.text, asLspRange(capture.node), capture.name.endsWith(".escape")));
        } else if (capture.name.startsWith("usage")) {
          bucket.push(new Usage(capture.node.text, asLspRange(capture.node), capture.name.endsWith(".void")));
        }
      }
    }
    static _constructTree(root, nodes) {
      const stack = [];
      for (const thing of nodes.sort(this._compareByRange)) {
        while (true) {
          let parent = stack.pop() ?? root;
          if (containsRange(parent.range, thing.range)) {
            if (thing instanceof Definition && thing.escapeToParent) {
              (stack[stack.length - 1] ?? root).appendChild(thing);
            } else {
              parent.appendChild(thing);
            }
            stack.push(parent);
            stack.push(thing);
            break;
          }
          if (parent === root) {
            break;
          }
        }
      }
      stack.length = 0;
      stack.push(root);
      while (stack.length > 0) {
        let n = stack.pop();
        if (n instanceof Usage && n.isHelper) {
          n.remove();
        } else {
          stack.push(...n.children());
        }
      }
    }
    static _compareCaptures(a, b) {
      return a.node.startIndex - b.node.startIndex;
    }
    static _compareByRange(a, b) {
      return compareRangeByStart(a.range, b.range);
    }
    debugPrint() {
      console.log(this.root.toString());
    }
  };
  var NodeType;
  (function(NodeType2) {
    NodeType2[NodeType2["Scope"] = 0] = "Scope";
    NodeType2[NodeType2["Definition"] = 1] = "Definition";
    NodeType2[NodeType2["Usage"] = 2] = "Usage";
  })(NodeType || (NodeType = {}));
  var Node = class {
    constructor(range, type) {
      this.range = range;
      this.type = type;
      this._children = [];
    }
    children() {
      return this._children;
    }
    remove() {
      if (!this._parent) {
        return false;
      }
      const idx = this._parent._children.indexOf(this);
      if (idx < 0) {
        return false;
      }
      this._parent._children.splice(idx, 1);
      return true;
    }
    appendChild(node) {
      this._children.push(node);
      node._parent = this;
    }
    toString() {
      return `${this.type}@${this.range.start.line},${this.range.start.character}-${this.range.end.line},${this.range.end.character}`;
    }
  };
  var Usage = class extends Node {
    constructor(name, range, isHelper) {
      super(range, 2);
      this.name = name;
      this.range = range;
      this.isHelper = isHelper;
    }
    appendChild(_node) {
    }
    toString() {
      return `use:${this.name}`;
    }
    get scope() {
      return this._parent;
    }
  };
  var Definition = class extends Node {
    constructor(name, range, escapeToParent) {
      super(range, 1);
      this.name = name;
      this.range = range;
      this.escapeToParent = escapeToParent;
    }
    appendChild(_node) {
    }
    toString() {
      return `def:${this.name}`;
    }
    get scope() {
      return this._parent;
    }
  };
  var Scope = class extends Node {
    constructor(range, likelyExports) {
      super(range, 0);
      this.likelyExports = likelyExports;
    }
    *definitions() {
      for (let item of this._children) {
        if (item instanceof Definition) {
          yield item;
        }
      }
    }
    *usages() {
      for (let item of this._children) {
        if (item instanceof Usage) {
          yield item;
        }
      }
    }
    *scopes() {
      for (let item of this._children) {
        if (item instanceof Scope) {
          yield item;
        }
      }
    }
    _findScope(position) {
      for (let scope of this.scopes()) {
        if (containsPosition(scope.range, position)) {
          return scope._findScope(position);
        }
      }
      return this;
    }
    findDefinitionOrUsage(position) {
      let scope = this._findScope(position);
      while (true) {
        for (let child of scope._children) {
          if ((child instanceof Definition || child instanceof Usage) && containsPosition(child.range, position)) {
            return child;
          }
        }
        if (scope._parent instanceof Scope) {
          scope = scope._parent;
        } else {
          break;
        }
      }
    }
    findDefinitions(text) {
      const result = [];
      for (let child of this.definitions()) {
        if (child.name === text) {
          result.push(child);
        }
      }
      if (result.length > 0) {
        return result;
      }
      if (!(this._parent instanceof Scope)) {
        return [];
      }
      return this._parent.findDefinitions(text);
    }
    findUsages(text) {
      const bucket = [];
      let scope = this;
      while (!scope._defines(text)) {
        if (scope._parent instanceof Scope) {
          scope = scope._parent;
        } else {
          break;
        }
      }
      scope._findUsagesDown(text, bucket);
      return bucket.flat();
    }
    _findUsagesDown(text, bucket) {
      const result = [];
      for (let child of this.usages()) {
        if (child.name === text) {
          result.push(child);
        }
      }
      bucket.push(result);
      for (let child of this.scopes()) {
        if (!child._defines(text)) {
          child._findUsagesDown(text, bucket);
        }
      }
    }
    _defines(text) {
      for (let child of this.definitions()) {
        if (child.name === text) {
          return true;
        }
      }
      return false;
    }
    toString(depth = 0) {
      let scopes = [];
      let parts = [];
      this._children.slice(0).forEach((child) => {
        if (child instanceof Scope) {
          scopes.push(child.toString(depth + 2));
        } else {
          parts.push(child.toString());
        }
      });
      let indent = " ".repeat(depth);
      let res = `${indent}Scope@${this.range.start.line},${this.range.start.character}-${this.range.end.line},${this.range.end.character}`;
      res += `
${indent + indent}${parts.join(`, `)}`;
      res += `
${indent}${scopes.join(`
${indent}`)}`;
      return res;
    }
  };

  // server/src/common/features/documentHighlights.ts
  var DocumentHighlightsProvider = class {
    constructor(_documents, _trees) {
      this._documents = _documents;
      this._trees = _trees;
    }
    register(connection) {
      connection.client.register(lsp3.DocumentHighlightRequest.type, { documentSelector: Languages.getSupportedLanguages("highlights", ["locals", "identifiers"]) });
      connection.onRequest(lsp3.DocumentHighlightRequest.type, this.provideDocumentHighlights.bind(this));
    }
    async provideDocumentHighlights(params) {
      const document = await this._documents.retrieve(params.textDocument.uri);
      const info = Locals.create(document, this._trees);
      const anchor = info.root.findDefinitionOrUsage(params.position);
      if (!anchor) {
        return this._identifierBasedHighlights(document, params.position);
      }
      const result = [];
      for (let def of anchor.scope.findDefinitions(anchor.name)) {
        result.push(lsp3.DocumentHighlight.create(def.range, lsp3.DocumentHighlightKind.Write));
      }
      if (result.length === 0) {
        return this._identifierBasedHighlights(document, params.position);
      }
      for (let usage of anchor.scope.findUsages(anchor.name)) {
        result.push(lsp3.DocumentHighlight.create(usage.range, lsp3.DocumentHighlightKind.Read));
      }
      return result;
    }
    _identifierBasedHighlights(document, position) {
      const result = [];
      const tree = this._trees.getParseTree(document);
      if (!tree) {
        return result;
      }
      const query = Languages.getQuery(document.languageId, "identifiers");
      const candidate = identifierAtPosition(query, tree.rootNode, position);
      if (!candidate) {
        return result;
      }
      for (let capture of query.captures(tree.rootNode)) {
        if (capture.node.text === candidate.text) {
          result.push(lsp3.DocumentHighlight.create(asLspRange(capture.node), lsp3.DocumentHighlightKind.Text));
        }
      }
      return result;
    }
  };

  // server/src/common/trees.ts
  init_define_process();

  // server/src/common/util/lruMap.ts
  init_define_process();
  var LRUMap = class extends Map {
    constructor(_options) {
      super();
      this._options = _options;
    }
    set(key, value) {
      super.set(key, value);
      this._checkSize();
      return this;
    }
    get(key) {
      if (!this.has(key)) {
        return void 0;
      }
      const result = super.get(key);
      this.delete(key);
      this.set(key, result);
      return result;
    }
    _checkSize() {
      setTimeout(() => {
        const slack = Math.ceil(this._options.size * 0.3);
        if (this.size < this._options.size + slack) {
          return;
        }
        const result = Array.from(this.entries()).slice(0, slack);
        for (let [key] of result) {
          this.delete(key);
        }
        this._options.dispose(result);
      }, 0);
    }
  };

  // server/src/common/trees.ts
  var import_web_tree_sitter2 = __toModule(require_tree_sitter());
  var Entry = class {
    constructor(version, tree, edits) {
      this.version = version;
      this.tree = tree;
      this.edits = edits;
    }
  };
  var Trees = class {
    constructor(_documents) {
      this._documents = _documents;
      this._cache = new LRUMap({
        size: 100,
        dispose(entries) {
          for (let [, value] of entries) {
            value.tree.delete();
          }
        }
      });
      this._listener = [];
      this._parser = new import_web_tree_sitter2.default();
      this._listener.push(_documents.onDidChangeContent2((e) => {
        const info = this._cache.get(e.document.uri);
        if (info) {
          info.edits.push(Trees._asEdits(e));
        }
      }));
    }
    dispose() {
      this._parser.delete();
      for (let item of this._cache.values()) {
        item.tree.delete();
      }
      for (let item of this._listener) {
        item.dispose();
      }
    }
    getParseTree(documentOrUri) {
      if (typeof documentOrUri === "string") {
        return this._documents.retrieve(documentOrUri).then((doc) => this._parse(doc));
      } else {
        return this._parse(documentOrUri);
      }
    }
    _parse(documentOrUri) {
      let info = this._cache.get(documentOrUri.uri);
      if (info?.version === documentOrUri.version) {
        return info.tree;
      }
      const language = Languages.getLanguage(documentOrUri.languageId);
      if (!language) {
        return void 0;
      }
      this._parser.setLanguage(language);
      this._parser.setTimeoutMicros(1e3 * 1e3);
      try {
        const version = documentOrUri.version;
        const text = documentOrUri.getText();
        if (!info) {
          const tree = this._parser.parse(text);
          info = new Entry(version, tree, []);
          this._cache.set(documentOrUri.uri, info);
        } else {
          const oldTree = info.tree;
          const deltas = info.edits.flat();
          deltas.forEach((delta) => oldTree.edit(delta));
          info.edits.length = 0;
          info.tree = this._parser.parse(text, oldTree);
          info.version = version;
          oldTree.delete();
        }
        return info.tree;
      } catch (e) {
        this._cache.delete(documentOrUri.uri);
        return void 0;
      }
    }
    static _asEdits(event) {
      return event.changes.map((change) => ({
        startPosition: this._asTsPoint(change.range.start),
        oldEndPosition: this._asTsPoint(change.range.end),
        newEndPosition: this._asTsPoint(event.document.positionAt(change.rangeOffset + change.text.length)),
        startIndex: change.rangeOffset,
        oldEndIndex: change.rangeOffset + change.rangeLength,
        newEndIndex: change.rangeOffset + change.text.length
      }));
    }
    static _asTsPoint(position) {
      const { line: row, character: column } = position;
      return { row, column };
    }
  };

  // server/src/common/test-fixture/client/utils.ts
  init_define_process();

  // server/src/common/documentStore.ts
  init_define_process();
  var lsp4 = __toModule(require_main4());
  var import_vscode_languageserver = __toModule(require_main4());

  // server/node_modules/vscode-languageserver-textdocument/lib/esm/main.js
  init_define_process();
  "use strict";
  var FullTextDocument = class {
    constructor(uri, languageId, version, content) {
      this._uri = uri;
      this._languageId = languageId;
      this._version = version;
      this._content = content;
      this._lineOffsets = void 0;
    }
    get uri() {
      return this._uri;
    }
    get languageId() {
      return this._languageId;
    }
    get version() {
      return this._version;
    }
    getText(range) {
      if (range) {
        const start = this.offsetAt(range.start);
        const end = this.offsetAt(range.end);
        return this._content.substring(start, end);
      }
      return this._content;
    }
    update(changes, version) {
      for (let change of changes) {
        if (FullTextDocument.isIncremental(change)) {
          const range = getWellformedRange(change.range);
          const startOffset = this.offsetAt(range.start);
          const endOffset = this.offsetAt(range.end);
          this._content = this._content.substring(0, startOffset) + change.text + this._content.substring(endOffset, this._content.length);
          const startLine = Math.max(range.start.line, 0);
          const endLine = Math.max(range.end.line, 0);
          let lineOffsets = this._lineOffsets;
          const addedLineOffsets = computeLineOffsets(change.text, false, startOffset);
          if (endLine - startLine === addedLineOffsets.length) {
            for (let i = 0, len = addedLineOffsets.length; i < len; i++) {
              lineOffsets[i + startLine + 1] = addedLineOffsets[i];
            }
          } else {
            if (addedLineOffsets.length < 1e4) {
              lineOffsets.splice(startLine + 1, endLine - startLine, ...addedLineOffsets);
            } else {
              this._lineOffsets = lineOffsets = lineOffsets.slice(0, startLine + 1).concat(addedLineOffsets, lineOffsets.slice(endLine + 1));
            }
          }
          const diff = change.text.length - (endOffset - startOffset);
          if (diff !== 0) {
            for (let i = startLine + 1 + addedLineOffsets.length, len = lineOffsets.length; i < len; i++) {
              lineOffsets[i] = lineOffsets[i] + diff;
            }
          }
        } else if (FullTextDocument.isFull(change)) {
          this._content = change.text;
          this._lineOffsets = void 0;
        } else {
          throw new Error("Unknown change event received");
        }
      }
      this._version = version;
    }
    getLineOffsets() {
      if (this._lineOffsets === void 0) {
        this._lineOffsets = computeLineOffsets(this._content, true);
      }
      return this._lineOffsets;
    }
    positionAt(offset) {
      offset = Math.max(Math.min(offset, this._content.length), 0);
      let lineOffsets = this.getLineOffsets();
      let low = 0, high = lineOffsets.length;
      if (high === 0) {
        return { line: 0, character: offset };
      }
      while (low < high) {
        let mid = Math.floor((low + high) / 2);
        if (lineOffsets[mid] > offset) {
          high = mid;
        } else {
          low = mid + 1;
        }
      }
      let line = low - 1;
      return { line, character: offset - lineOffsets[line] };
    }
    offsetAt(position) {
      let lineOffsets = this.getLineOffsets();
      if (position.line >= lineOffsets.length) {
        return this._content.length;
      } else if (position.line < 0) {
        return 0;
      }
      let lineOffset = lineOffsets[position.line];
      let nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
      return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
    }
    get lineCount() {
      return this.getLineOffsets().length;
    }
    static isIncremental(event) {
      let candidate = event;
      return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range !== void 0 && (candidate.rangeLength === void 0 || typeof candidate.rangeLength === "number");
    }
    static isFull(event) {
      let candidate = event;
      return candidate !== void 0 && candidate !== null && typeof candidate.text === "string" && candidate.range === void 0 && candidate.rangeLength === void 0;
    }
  };
  var TextDocument;
  (function(TextDocument2) {
    function create(uri, languageId, version, content) {
      return new FullTextDocument(uri, languageId, version, content);
    }
    TextDocument2.create = create;
    function update(document, changes, version) {
      if (document instanceof FullTextDocument) {
        document.update(changes, version);
        return document;
      } else {
        throw new Error("TextDocument.update: document must be created by TextDocument.create");
      }
    }
    TextDocument2.update = update;
    function applyEdits(document, edits) {
      let text = document.getText();
      let sortedEdits = mergeSort(edits.map(getWellformedEdit), (a, b) => {
        let diff = a.range.start.line - b.range.start.line;
        if (diff === 0) {
          return a.range.start.character - b.range.start.character;
        }
        return diff;
      });
      let lastModifiedOffset = 0;
      const spans = [];
      for (const e of sortedEdits) {
        let startOffset = document.offsetAt(e.range.start);
        if (startOffset < lastModifiedOffset) {
          throw new Error("Overlapping edit");
        } else if (startOffset > lastModifiedOffset) {
          spans.push(text.substring(lastModifiedOffset, startOffset));
        }
        if (e.newText.length) {
          spans.push(e.newText);
        }
        lastModifiedOffset = document.offsetAt(e.range.end);
      }
      spans.push(text.substr(lastModifiedOffset));
      return spans.join("");
    }
    TextDocument2.applyEdits = applyEdits;
  })(TextDocument || (TextDocument = {}));
  function mergeSort(data, compare) {
    if (data.length <= 1) {
      return data;
    }
    const p = data.length / 2 | 0;
    const left = data.slice(0, p);
    const right = data.slice(p);
    mergeSort(left, compare);
    mergeSort(right, compare);
    let leftIdx = 0;
    let rightIdx = 0;
    let i = 0;
    while (leftIdx < left.length && rightIdx < right.length) {
      let ret = compare(left[leftIdx], right[rightIdx]);
      if (ret <= 0) {
        data[i++] = left[leftIdx++];
      } else {
        data[i++] = right[rightIdx++];
      }
    }
    while (leftIdx < left.length) {
      data[i++] = left[leftIdx++];
    }
    while (rightIdx < right.length) {
      data[i++] = right[rightIdx++];
    }
    return data;
  }
  function computeLineOffsets(text, isAtLineStart, textOffset = 0) {
    const result = isAtLineStart ? [textOffset] : [];
    for (let i = 0; i < text.length; i++) {
      let ch = text.charCodeAt(i);
      if (ch === 13 || ch === 10) {
        if (ch === 13 && i + 1 < text.length && text.charCodeAt(i + 1) === 10) {
          i++;
        }
        result.push(textOffset + i + 1);
      }
    }
    return result;
  }
  function getWellformedRange(range) {
    const start = range.start;
    const end = range.end;
    if (start.line > end.line || start.line === end.line && start.character > end.character) {
      return { start: end, end: start };
    }
    return range;
  }
  function getWellformedEdit(textEdit) {
    const range = getWellformedRange(textEdit.range);
    if (range !== textEdit.range) {
      return { newText: textEdit.newText, range };
    }
    return textEdit;
  }

  // shared/common/messages.ts
  init_define_process();
  var CustomMessages;
  (function(CustomMessages2) {
    CustomMessages2["QueueInit"] = "queue/init";
    CustomMessages2["QueueUnleash"] = "queue/unleash";
    CustomMessages2["FileRead"] = "file/read";
  })(CustomMessages || (CustomMessages = {}));

  // server/src/common/documentStore.ts
  var DocumentStore = class extends import_vscode_languageserver.TextDocuments {
    constructor(_connection) {
      super({
        create: TextDocument.create,
        update: (doc, changes, version) => {
          let result;
          let incremental = true;
          let event = { document: doc, changes: [] };
          for (const change of changes) {
            if (!lsp4.TextDocumentContentChangeEvent.isIncremental(change)) {
              incremental = false;
              break;
            }
            const rangeOffset = doc.offsetAt(change.range.start);
            event.changes.push({
              text: change.text,
              range: change.range,
              rangeOffset,
              rangeLength: change.rangeLength ?? doc.offsetAt(change.range.end) - rangeOffset
            });
          }
          result = TextDocument.update(doc, changes, version);
          if (incremental) {
            this._onDidChangeContent2.fire(event);
          }
          return result;
        }
      });
      this._connection = _connection;
      this._onDidChangeContent2 = new lsp4.Emitter();
      this.onDidChangeContent2 = this._onDidChangeContent2.event;
      this._decoder = new TextDecoder();
      this._fileDocuments = new LRUMap({
        size: 200,
        dispose: (_entries) => {
        }
      });
      super.listen(_connection);
    }
    async retrieve(uri) {
      let result = this.get(uri);
      if (result) {
        return result;
      }
      let promise = this._fileDocuments.get(uri);
      if (!promise) {
        promise = this._requestDocument(uri);
        this._fileDocuments.set(uri, promise);
      }
      return promise;
    }
    async _requestDocument(uri) {
      const reply = await this._connection.sendRequest(CustomMessages.FileRead, uri);
      const bytes = new Uint8Array(reply);
      return TextDocument.create(uri, Languages.getLanguageIdByUri(uri), 1, this._decoder.decode(bytes));
    }
    removeFile(uri) {
      return this._fileDocuments.delete(uri);
    }
  };

  // server/src/common/test-fixture/client/utils.ts
  function mock() {
    return function() {
    };
  }
  var TestDocumentStore = class extends DocumentStore {
    constructor(...docs) {
      super(new class extends mock() {
        onDidOpenTextDocument(handler) {
          for (let doc of docs) {
            handler({
              textDocument: {
                languageId: doc.languageId,
                uri: doc.uri,
                text: doc.getText(),
                version: doc.version
              }
            });
          }
        }
        onDidChangeTextDocument() {
        }
        onDidCloseTextDocument() {
        }
        onWillSaveTextDocument() {
        }
        onWillSaveTextDocumentWaitUntil() {
        }
        onDidSaveTextDocument() {
        }
        onNotification() {
        }
      }());
    }
  };
  var FixtureMarks = class {
    constructor(start, text) {
      this.start = start;
      this.text = text;
    }
  };
  FixtureMarks.pattern = /\[\[[^\]]+\]\]/g;
  var Fixture = class {
    constructor(name, document, marks) {
      this.name = name;
      this.document = document;
      this.marks = marks;
    }
    static async parse(uri, languageId) {
      const res = await fetch(uri);
      const text = await res.text();
      const r = /.+###.*/gu;
      const names = text.match(r);
      const documents = text.split(r).filter(Boolean).map((value, i) => TextDocument.create(`${uri}#${i}`, languageId, 1, value));
      const store = new TestDocumentStore(...documents);
      const trees = new Trees(store);
      const query = Languages.getQuery(languageId, "comments", true);
      const fixtures = [];
      for (const doc of documents) {
        const tree = trees.getParseTree(doc);
        if (!tree) {
          throw new Error();
        }
        const name = names?.shift()?.replace(/^.+###/, "").trim() ?? doc.uri;
        if (name.includes("/SKIP/")) {
          continue;
        }
        const marks = [];
        const captures = query.captures(tree.rootNode);
        for (const capture of captures) {
          const start = capture.node.text.indexOf("^");
          if (start < 0) {
            continue;
          }
          const end = capture.node.text.lastIndexOf("^");
          for (let row = capture.node.startPosition.row - 1; row >= 0; row--) {
            let node = tree.rootNode.descendantForPosition({ row, column: start }, { row, column: end });
            if (query.captures(node).length > 0) {
              continue;
            }
            marks.push(new FixtureMarks(node.startIndex, node.text));
            break;
          }
        }
        fixtures.push(new Fixture(name, doc, marks));
      }
      trees.dispose();
      return fixtures;
    }
  };

  // server/src/common/test-fixture/client/documentHighlights.test.ts
  async function init(fixture, langId) {
    const fixtures = await Fixture.parse(fixture, langId);
    suite(`DocumentHighlights - Fixtures: ${langId}`, function() {
      const store = new TestDocumentStore(...fixtures.map((f) => f.document));
      for (let item of fixtures) {
        test(item.name, async function() {
          const trees = new Trees(store);
          const symbols = new DocumentHighlightsProvider(store, trees);
          const result = await symbols.provideDocumentHighlights({
            textDocument: { uri: item.document.uri },
            position: item.document.positionAt(item.marks[0].start)
          });
          assertDocumentHighlights(item, result);
          trees.dispose();
        });
      }
    });
  }
  function assertDocumentHighlights(fixture, actual) {
    actual.sort((a, b) => compareRangeByStart(a.range, b.range));
    if (actual.length === 0) {
      import_assert.default.fail("NO symbols found: " + fixture.name);
    }
    for (let highlight of actual) {
      const e = fixture.marks.shift();
      import_assert.default.ok(e);
      import_assert.default.strictEqual(fixture.document.offsetAt(highlight.range.start), e.start, fixture.name);
    }
    if (fixture.marks.length > 0) {
      import_assert.default.fail("not ALL MARKS seen: " + fixture.name);
    }
  }

  // server/src/common/test-fixture/client/documentSymbols.test.ts
  init_define_process();
  var import_assert2 = __toModule(require_assert());

  // server/src/common/features/documentSymbols.ts
  init_define_process();
  var lsp5 = __toModule(require_main4());
  var DocumentSymbols = class {
    constructor(_documents, _trees) {
      this._documents = _documents;
      this._trees = _trees;
    }
    register(connection) {
      connection.client.register(lsp5.DocumentSymbolRequest.type, { documentSelector: Languages.getSupportedLanguages("outline", ["outline"]) });
      connection.onRequest(lsp5.DocumentSymbolRequest.type, this.provideDocumentSymbols.bind(this));
    }
    async provideDocumentSymbols(params) {
      const document = await this._documents.retrieve(params.textDocument.uri);
      return getDocumentSymbols(document, this._trees, false);
    }
  };
  function getDocumentSymbols(document, trees, flat) {
    class Node2 {
      constructor(capture) {
        this.capture = capture;
        this.children = [];
        this.range = asLspRange(capture.node);
      }
    }
    const tree = trees.getParseTree(document);
    if (!tree) {
      return [];
    }
    const query = Languages.getQuery(document.languageId, "outline");
    const captures = query.captures(tree.rootNode);
    const roots = [];
    const stack = [];
    for (const capture of captures) {
      const node = new Node2(capture);
      let parent = stack.pop();
      while (true) {
        if (!parent) {
          roots.push(node);
          stack.push(node);
          break;
        }
        if (containsRange(parent.range, node.range)) {
          parent.children.push(node);
          stack.push(parent);
          stack.push(node);
          break;
        }
        parent = stack.pop();
      }
    }
    function build(node, bucket) {
      let children = [];
      let nameNode;
      for (let child of node.children) {
        if (!nameNode && child.capture.name.endsWith(".name") && child.capture.name.startsWith(node.capture.name)) {
          nameNode = child;
        } else {
          build(child, children);
        }
      }
      if (!nameNode) {
        nameNode = node;
      }
      const symbol = lsp5.DocumentSymbol.create(nameNode.capture.node.text, "", symbolMapping.getSymbolKind(node.capture.name), node.range, nameNode.range);
      symbol.children = children;
      bucket.push(symbol);
    }
    const result = [];
    for (let node of roots) {
      build(node, result);
    }
    if (!flat) {
      return result;
    }
    const flatResult = [];
    (function flatten(all) {
      for (let item of all) {
        flatResult.push(item);
        if (item.children) {
          flatten(item.children);
        }
      }
    })(result);
    return flatResult;
  }

  // server/src/common/test-fixture/client/documentSymbols.test.ts
  async function init2(fixture, langId) {
    const fixtures = await Fixture.parse(fixture, langId);
    suite(`DocumentSymbols - Fixtures: ${langId}`, function() {
      const store = new TestDocumentStore(...fixtures.map((f) => f.document));
      for (let item of fixtures) {
        test(item.name, async function() {
          const trees = new Trees(store);
          const symbols = new DocumentSymbols(store, trees);
          const result = await symbols.provideDocumentSymbols({ textDocument: { uri: item.document.uri } });
          assertDocumentSymbols(item, result);
          trees.dispose();
        });
      }
    });
  }
  function assertDocumentSymbols(fixture, actual) {
    if (actual.length === 0) {
      import_assert2.default.fail("NO symbols found");
    }
    (function walk(symbols) {
      for (let symbol of symbols) {
        const expected = fixture.marks.shift();
        import_assert2.default.ok(expected, `symbol NOT expected: ${symbol.name}@${symbol.range.start.line},${symbol.range.start.character}`);
        import_assert2.default.strictEqual(symbol.name, expected.text);
        import_assert2.default.strictEqual(fixture.document.offsetAt(symbol.selectionRange.start), expected.start);
        if (symbol.children) {
          walk(symbol.children);
        }
      }
    })(actual);
    if (fixture.marks.length > 0) {
      import_assert2.default.fail(`also EXPECTED ${fixture.marks.map((e) => e.text)}`);
    }
  }

  // server/src/common/test-fixture/client/queries.test.ts
  init_define_process();
  var import_assert3 = __toModule(require_assert());
  function init3(info) {
    if (!info.queries) {
      return;
    }
    suite(`Queries ${info.languageId}`, function() {
      const types = ["comments", "folding", "identifiers", "locals", "outline", "references"];
      for (let type of types) {
        test(type, function() {
          if (!info.queries[type]) {
            this.skip();
          }
          try {
            const q = Languages.getQuery(info.languageId, type, true);
            import_assert3.default.ok(q);
          } catch (err) {
            import_assert3.default.fail(`INVALID ${info.languageId} -> ${err}`);
          }
        });
      }
    });
  }

  // server/src/common/test-fixture/client/test.all.ts
  var import_web_tree_sitter3 = __toModule(require_tree_sitter());
  (async function() {
    try {
      await import_web_tree_sitter3.default.init({
        locateFile() {
          return "/anycode/server/node_modules/web-tree-sitter/tree-sitter.wasm";
        }
      });
      const config = [];
      const target = new URL(window.location);
      const langInfo = JSON.parse(target.searchParams.get("languages") ?? "");
      for (let info of langInfo) {
        config.push([info, {}]);
        init3(info);
      }
      await Languages.init(config);
      const outline = target.searchParams.get("outline");
      if (outline) {
        const langId = Languages.getLanguageIdByUri(outline);
        await init2(outline, langId);
      }
      const highlights = target.searchParams.get("highlights");
      if (highlights) {
        const langId = Languages.getLanguageIdByUri(highlights);
        await init(highlights, langId);
      }
      run();
    } catch (err) {
      window.report_mocha_done(err);
      console.error(err);
    }
  })();
})();
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
