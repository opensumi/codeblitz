import { MATH_FUNCTIONS_ENUM, FUNCTION_DETAIL, ODPS_FUNCTION_TYPE_ENUM } from './definitions';

export const MATH_FUNCTIONS: Record<MATH_FUNCTIONS_ENUM, FUNCTION_DETAIL> = {
  ABS: {
    name: 'ABS',
    simpleDesc: '计算绝对值。',
    usageCommand: 'abs(<number>)',
    usageDesc: '计算number的绝对值。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。DOUBLE、BIGINT或DECIMAL类型。输入为STRING时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '返回值类型取决于输入参数的类型。返回规则如下：number为DOUBLE、BIGINT或DECIMAL类型时会返回相应的类型。number为STRING类型时，返回DOUBLE类型。 number为NULL，则返回NULL。',
    example: 'select abs(-1);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-i1v-5lm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  ACOS: {
    name: 'ACOS',
    simpleDesc: '计算反余弦值。',
    usageCommand: 'acos(<number>)',
    usageDesc: '计算number的反余弦函数。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。取值范围为[-1,1]。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '返回值类型取决于输入参数的类型。值域在0~π之间。返回规则如下：number为DOUBLE、DECIMAL类型时会返回相应的类型。number为STRING、BIGINT类型时，返回DOUBLE类型。number值不在[-1,1]范围内时，返回NULL。number值为NULL时，返回NULL。',
    example: 'select acos("0.87");',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-cfp-qmm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  ASIN: {
    name: 'ASIN',
    simpleDesc: '计算反正弦值。',
    usageCommand: 'asin(<number>)',
    usageDesc: '计算number的反正弦函数。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。取值范围为[-1,1]。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '返回值类型取决于输入参数的类型。值域在-π/2~π/2之间。返回规则如下：number为DOUBLE、DECIMAL类型时会返回相应的类型。number为STRING、BIGINT类型时，返回DOUBLE类型。number值不在[-1,1]范围内时，返回NULL。number值为NULL时，返回NULL。',
    example: 'select asin(1);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-fau-d9e-7p5',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  ATAN: {
    name: 'ATAN',
    simpleDesc: '计算反正切值。',
    usageCommand: 'atan(<number>)',
    usageDesc: '计算number的反正切函数。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。DOUBLE类型。输入为STRING、BIGINT、DECIMAL类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc: '返回DOUBLE类型。值域在-π/2~π/2之间。number值为NULL时，返回NULL。',
    example: 'select atan(1);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-odw-jnm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  CEIL: {
    name: 'CEIL',
    simpleDesc: '计算向上取整值。',
    usageCommand: 'ceil(<value>)',
    usageDesc: '向上取整，返回不小于输入值value的最小整数。',
    paramDocs: [
      {
        label: 'value',
        desc:
          '必填。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc: '返回BIGINT类型。number值为NULL时，返回NULL。',
    example: 'select ceil(1.1);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-ugm-k4m-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  CONV: {
    name: 'CONV',
    simpleDesc: '计算进制转换值。',
    usageCommand: 'conv(<input>, bigint <from_base>, bigint <to_base>)',
    usageDesc: '该函数为进制转换函数。',
    paramDocs: [
      {
        label: 'input',
        desc: '必填。以STRING表示的要转换的整数值，支持BIGINT和DOUBLE的隐式转换。',
      },
      {
        label: 'from_base',
        desc:
          '必填。以十进制表示的进制值，支持的值为2、8、10和16。支持STRING及DOUBLE类型的隐式转换。',
      },
      {
        label: 'to_base',
        desc:
          '必填。以十进制表示的进制值，支持的值为2、8、10和16。支持STRING及DOUBLE类型的隐式转换。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：input、from_base或to_base值为NULL时，返回NULL。转换过程以64位精度工作，溢出时返回NULL。input如果是负值，即以短划线（-）开头，返回NULL。如果输入的是小数，会转为整数值后进行进制转换，小数部分会被舍弃。',
    example: "select conv('1100', 2, 10);",
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-tkx-q4m-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  COS: {
    name: 'COS',
    simpleDesc: '计算余弦值。',
    usageCommand: 'cos(<number>)',
    usageDesc: '计算number的余弦函数，输入为弧度值。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '返回DOUBLE或DECIMAL类型。返回规则如下：number为DOUBLE、DECIMAL类型时会返回相应的类型。number为STRING、BIGINT类型时，返回DOUBLE类型。number值为NULL时，返回NULL。',
    example: 'select cos(3.1415926/2);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-tpy-z4m-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  COSH: {
    name: 'COSH',
    simpleDesc: '计算双曲余弦值。',
    usageCommand: 'cosh(<number>)',
    usageDesc: '计算number的双曲余弦函数。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '返回DOUBLE或DECIMAL类型。返回规则如下：number为DOUBLE、DECIMAL类型时会返回相应的类型。number为STRING、BIGINT类型时，返回DOUBLE类型。number值为NULL时，返回NULL。',
    example: 'select cosh(3.1415926/2);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-tnp-gpm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  COT: {
    name: 'COT',
    simpleDesc: '计算余切值。',
    usageCommand: 'cot(<number>)',
    usageDesc: '计算number的余切函数，输入为弧度值。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '返回DOUBLE或DECIMAL类型。返回规则如下：number为DOUBLE、DECIMAL类型时会返回相应的类型。number为STRING、BIGINT类型时，返回DOUBLE类型。number值为NULL时，返回NULL。',
    example: 'select cot(3.1415926/2);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-hhz-lpm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  EXP: {
    name: 'EXP',
    simpleDesc: '计算指数值。',
    usageCommand: 'exp(<number>)',
    usageDesc: '计算number的指数函数。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '返回DOUBLE或DECIMAL类型。返回规则如下：number为DOUBLE、DECIMAL类型时会返回相应的类型。number为STRING、BIGINT类型时，返回DOUBLE类型。number值为NULL时，返回NULL。',
    example: 'select exp(3.1415926/2);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-q1n-rpm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  FLOOR: {
    name: 'FLOOR',
    simpleDesc: '计算向下取整值。',
    usageCommand: 'floor(<number>)',
    usageDesc: '向下取整，返回不大于number的最大整数值。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc: '返回BIGINT类型。number值为NULL时，返回NULL。',
    example: 'select floor(1.2);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-yrw-wpm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  LN: {
    name: 'LN',
    simpleDesc: '计算自然对数。',
    usageCommand: 'ln(<number>)',
    usageDesc: '计算number的自然对数。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '返回DOUBLE或DECIMAL类型。返回规则如下：number为DOUBLE、DECIMAL类型时会返回相应的类型。number为STRING、BIGINT类型时，返回DOUBLE类型。number值为负数或0时，返回NULL。number值为NULL时，返回NULL。',
    example: 'select ln(3.1415926);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-pdm-fqm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  LOG: {
    name: 'LOG',
    simpleDesc: '计算log对数值。',
    usageCommand: 'log(<base>, <x>)',
    usageDesc: '计算以base为底的x的对数。',
    paramDocs: [
      {
        label: 'base',
        desc:
          '必填。底数。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
      {
        label: 'x',
        desc:
          '必填。待计算对数的值。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '返回DOUBLE类型。 返回规则如下：base或x为NULL时，返回NULL。base或x为负数或0时，返回NULL。如果base为1（会引发一个除零行为），会返回NULL。',
    example: 'select log(2, 16);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-iwc-4qm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  POW: {
    name: 'POW',
    simpleDesc: '计算幂值。',
    usageCommand: 'pow(<x>, <y>)',
    usageDesc: '计算x的y次方，即x^y。',
    paramDocs: [
      {
        label: 'x',
        desc:
          '必填。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
      {
        label: 'y',
        desc:
          '必填。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '返回DOUBLE或DECIMAL类型。返回规则如下：x或y为DOUBLE、DECIMAL类型时会返回相应的类型。x或y为STRING、BIGINT类型时，返回DOUBLE类型。x或y值为NULL时，返回NULL。',
    example: 'select pow(2, 16);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-gmv-wqm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  RAND: {
    name: 'RAND',
    simpleDesc: '返回随机数。',
    usageCommand: 'rand(bigint <seed>)',
    usageDesc: '返回DOUBLE类型的随机数，返回值区间是 0 ~ 1。',
    paramDocs: [
      {
        label: 'seed',
        desc: '可选。BIGINT类型。随机数种子，决定随机数序列的起始值。',
      },
    ],
    returnDesc: '返回DOUBLE类型。返回值区间是 0 ~ 1。',
    example: 'select rand();',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-qlv-2rm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  ROUND: {
    name: 'ROUND',
    simpleDesc: '返回四舍五入到指定小数点位置的值。',
    usageCommand: 'round(<number>, bigint <decimal_places>)',
    usageDesc: '四舍五入到指定小数点位置。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。DOUBLE类型或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
      {
        label: 'decimal_places',
        desc:
          '可选。BIGINT类型常量，四舍五入计算到小数点后的位置。如果省略表示四舍五入到个位数，默认值为0。',
      },
    ],
    returnDesc:
      '返回DOUBLE类型或DECIMAL类型。返回规则如下：number为DOUBLE、DECIMAL类型时会返回相应的类型。number为STRING、BIGINT类型时，返回DOUBLE类型。decimal_places非BIGINT类型时，返回报错。number或decimal_places值为NULL时，返回NULL。',
    example: 'select round(125.315);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-ocf-jrm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  SIN: {
    name: 'SIN',
    simpleDesc: '计算正弦值。',
    usageCommand: 'sin(<number>)',
    usageDesc: '计算number的正弦函数，输入为弧度值。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '返回DOUBLE或DECIMAL类型。返回规则如下：number为DOUBLE、DECIMAL类型时会返回相应的类型。number为STRING、BIGINT类型时，返回DOUBLE类型。number值为NULL时，返回NULL。',
    example: 'select sin(60);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-tky-gvm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  SINH: {
    name: 'SINH',
    simpleDesc: '计算双曲正弦值。',
    usageCommand: 'sinh(<number>)',
    usageDesc: '计算number的双曲正弦函数。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '返回DOUBLE或DECIMAL类型。返回规则如下：number为DOUBLE、DECIMAL类型时会返回相应的类型。number为STRING、BIGINT类型时，返回DOUBLE类型。number值为NULL时，返回NULL。',
    example: 'select sinh(30);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-ccf-gym-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  SQRT: {
    name: 'SQRT',
    simpleDesc: '计算平方根。',
    usageCommand: 'sqrt(<number>)',
    usageDesc: '计算number的平方根。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。DOUBLE或DECIMAL类型，必须大于0，小于0时返回NULL。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '返回DOUBLE或DECIMAL类型。返回规则如下：number为DOUBLE、DECIMAL类型时会返回相应的类型。number为STRING、BIGINT类型时，返回DOUBLE类型。number值为NULL时，返回NULL。',
    example: 'select sqrt(4);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-nns-lym-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  TAN: {
    name: 'TAN',
    simpleDesc: '计算正切值。',
    usageCommand: 'tan(<number>)',
    usageDesc: '计算number的正切函数，输入为弧度值。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。DOUBLE或DECIMAL类型，输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '返回DOUBLE或DECIMAL类型。返回规则如下：number为DOUBLE、DECIMAL类型时会返回相应的类型。number为STRING、BIGINT类型时，返回DOUBLE类型。number值为NULL时，返回NULL。',
    example: 'select tan(30);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-ibd-rym-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  TANH: {
    name: 'TANH',
    simpleDesc: '计算双曲正切值。',
    usageCommand: 'tanh(<number>)',
    usageDesc: '计算number的双曲正切函数。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。DOUBLE或DECIMAL类型，输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '返回DOUBLE或DECIMAL类型。返回规则如下：number为DOUBLE、DECIMAL类型时会返回相应的类型。number为STRING、BIGINT类型时，返回DOUBLE类型。number值为NULL时，返回NULL。',
    example: 'select tanh(30);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-pfh-wym-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  TRUNC: {
    name: 'TRUNC',
    simpleDesc: '返回截取到指定小数点位置的值。',
    usageCommand: 'trunc(<number>[, bigint <decimal_places>])',
    usageDesc: '将输入值number截取到指定小数点位置。',
    paramDocs: [
      {
        label: 'number',
        desc:
          '必填。DOUBLE或DECIMAL类型。输入为STRING、BIGINT类型时，会隐式转换为DOUBLE类型后参与运算。',
      },
      {
        label: 'decimal_places',
        desc:
          '可选。BIGINT类型常量，要截取到的小数点位置。省略此参数时默认截取到个位数。decimal_places可以是负数，负数会从小数点向左开始截取，并且不保留小数部分。如果decimal_places超过了整数部分长度，则返回0。',
      },
    ],
    returnDesc:
      '返回DOUBLE或DECIMAL类型。返回规则如下：number为DOUBLE、DECIMAL类型时会返回相应的类型。number为STRING、BIGINT类型时，返回DOUBLE类型。decimal_places非BIGINT类型时，返回报错。number或decimal_places值为NULL时，返回NULL。',
    example: 'select trunc(125.815,0);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-yly-1zm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  BIN: {
    name: 'BIN',
    simpleDesc: '计算二进制代码值。',
    usageCommand: 'bin(<number>)',
    usageDesc: '返回number的二进制代码表示。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'number',
        desc: '必填。BIGINT、INT、SMALLINT、TINYINT类型。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：number非BIGINT、INT、SMALLINT、TINYINT类型时，返回报错。number值为0时，返回0。number值为NULL时，返回NULL。',
    example: 'select bin(0);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-two-s20-2sa',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  CBRT: {
    name: 'CBRT',
    simpleDesc: '计算立方根值。',
    usageCommand: 'cbrt(<number>)',
    usageDesc: '计算number的立方根。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'number',
        desc: '必填。BIGINT、INT、SMALLINT、TINYINT、DOUBLE、FLOAT、STRING类型数据。',
      },
    ],
    returnDesc:
      '返回DOUBLE类型。返回规则如下：number非BIGINT、INT、SMALLINT、TINYINT、DOUBLE、FLOAT、STRING类型时，返回报错。number值为NULL时，返回NULL。',
    example: 'select cbrt(8);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-h19-2d4-2us',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  DEGREES: {
    name: 'DEGREES',
    simpleDesc: '将弧度转换为角度。',
    usageCommand: 'degrees(<number>)',
    usageDesc: '将弧度转换为角度。',
    paramDocs: [
      {
        label: 'number',
        desc: '必填。DOUBLE、BIGINT、INT、SMALLINT、TINYINT、FLOAT、DECIMAL、STRING类型。',
      },
    ],
    returnDesc: '返回DOUBLE类型。number值为NULL时，返回NULL。',
    example: 'select degrees(1.5707963267948966);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-42j-2cu-qig',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  E: {
    name: 'E',
    simpleDesc: '返回e的值。',
    usageCommand: 'e()',
    usageDesc: '返回e的值。此函数为MaxCompute 2.0扩展函数。',
    returnDesc: '返回DOUBLE类型。',
    example: 'select e();',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-2yd-sed-m22',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  FACTORIAL: {
    name: 'FACTORIAL',
    simpleDesc: '计算阶乘值。',
    usageCommand: 'factorial(<number>)',
    usageDesc: '返回number的阶乘。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'number',
        desc: '必填。BIGINT、INT、SMALLINT、TINYINT类型，且在[0,20]之间。',
      },
    ],
    returnDesc:
      '返回BIGINT类型。返回规则如下：number值为0时，返回1。number值为NULL或[0,20]之外的值，返回NULL。',
    example: 'select factorial(5);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-wri-hoq-ld9',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  FORMAT_NUMBER: {
    name: 'FORMAT_NUMBER',
    simpleDesc: '将数字转化为指定格式的字符串。',
    usageCommand: 'format_number(float|double|decimal <expr1>, <expr2>)',
    usageDesc: '将数字转化为指定格式的字符串。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'expr1',
        desc:
          '必填。需要格式化的数据。DOUBLE、BIGINT、INT、SMALLINT、TINYINT、FLOAT、DECIMAL、STRING类型。',
      },
      {
        label: 'expr2',
        desc: '必填。需要转化的目标格式。指定需要保留小数位数。也可以为类似#,###,###.##格式描述。',
      },
    ],
    returnDesc:
      '返回STRING类型数据。返回规则如下：如果expr2>0，则四舍五入到小数点后指定位数。如果expr2=0，则没有小数点或小数部分。如果expr2<0，或者expr2>340，则返回报错。expr1或expr2值为NULL时，返回NULL。',
    example: 'select format_number(5.230134523424545456,3);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-i5w-ohk-2sp',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  HEX: {
    name: 'HEX',
    simpleDesc: '返回整数或字符串的十六进制格式。',
    usageCommand: 'hex(<number>)',
    usageDesc: '将数值或字符串转换为十六进制格式。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'number',
        desc: '必填。DOUBLE、BIGINT、INT、SMALLINT、TINYINT、FLOAT、DECIMAL、STRING类型。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：number值非0或非NULL时，返回STRING类型。number值为0时，返回0。number值为NULL时，返回NULL。',
    example: 'select hex(0);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-xbh-3di-611',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  LOG2: {
    name: 'LOG2',
    simpleDesc: '计算以2为底的对数。',
    usageCommand: 'log2(<number>)',
    usageDesc: '返回以2为底，number的对数。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'number',
        desc: '必填。DOUBLE、BIGINT、INT、SMALLINT、TINYINT、FLOAT、DECIMAL、STRING类型。',
      },
    ],
    returnDesc: '返回DOUBLE类型。number值为0、负数或NULL时，返回NULL。',
    example: 'select log2(8);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-dh3-tzm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  LOG10: {
    name: 'LOG10',
    simpleDesc: '计算以10为底的对数。',
    usageCommand: 'log10(<number>)',
    usageDesc: '返回以10为底，number的对数。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'number',
        desc: '必填。DOUBLE、BIGINT、INT、SMALLINT、TINYINT、FLOAT、DECIMAL、STRING类型。',
      },
    ],
    returnDesc: '返回DOUBLE类型。number值为0、负数或NULL时，返回NULL。',
    example: 'select log10(8);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-bjc-zzm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  PI: {
    name: 'PI',
    simpleDesc: '返回π的值。',
    usageCommand: 'pi()',
    usageDesc: '返回π的值。此函数为MaxCompute 2.0扩展函数。',
    returnDesc: '返回DOUBLE类型。',
    example: 'select pi();',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-amf-eus-u0v',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  RADIANS: {
    name: 'RADIANS',
    simpleDesc: '将角度转换为弧度。',
    usageCommand: 'radians(<number>)',
    usageDesc: '将角度转换为弧度。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'number',
        desc: '必填。DOUBLE、BIGINT、INT、SMALLINT、TINYINT、FLOAT、DECIMAL、STRING类型。',
      },
    ],
    returnDesc: '返回DOUBLE类型。number值为NULL时，返回NULL。',
    example: 'select radians(90);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-uw5-75c-nvn',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  SIGN: {
    name: 'SIGN',
    simpleDesc: '返回输入参数的符号。',
    usageCommand: 'sign(<number>)',
    usageDesc: '获取输入参数的符号。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'number',
        desc: '必填。DOUBLE、BIGINT、INT、SMALLINT、TINYINT、FLOAT、DECIMAL、STRING类型。',
      },
    ],
    returnDesc:
      '返回DOUBLE类型。返回规则如下：number值为正数时，返回1.0。number值为负数时，返回-1.0。number值为0时，返回0.0。number值为NULL时，返回NULL。',
    example: 'select sign(-2.5);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-gq5-lbn-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  CORR: {
    name: 'CORR',
    simpleDesc: '计算皮尔逊系数。',
    usageCommand: 'corr(<col1>, <col2>)',
    usageDesc:
      '计算两列数据的皮尔逊系数(Pearson Correlation Coefficien)。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'col1',
        desc:
          '必填。待计算皮尔逊系数的表的两个列名称。DOUBLE、BIGINT、INT、SMALLINT、TINYINT、FLOAT、DECIMAL类型。col1和col2的数据类型可以不相同。',
      },
      {
        label: 'col2',
        desc:
          '必填。待计算皮尔逊系数的表的两个列名称。DOUBLE、BIGINT、INT、SMALLINT、TINYINT、FLOAT、DECIMAL类型。col1和col2的数据类型可以不相同。',
      },
    ],
    returnDesc: '返回DOUBLE类型。如果某一输入列的某一行存在NULL值，该行不参与计算。',
    example: 'select corr(double_data,float_data) from mf_math_fun_t;',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-fvu-d56-xf2',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  SHIFTLEFT: {
    name: 'SHIFTLEFT',
    simpleDesc: '计算按位左移值。',
    usageCommand: 'shiftleft(tinyint|smallint|int|bigint <number1>, int <number2>)',
    usageDesc: '按位左移 (<<)。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'number1',
        desc: '必填。TINYINT、SMALLINT、INT或BIGINT整型数据。',
      },
      {
        label: 'number2',
        desc: '必填。INT整型数据。',
      },
    ],
    returnDesc:
      '返回INT或BIGINT类型。返回规则如下,number1非TINYINT、SMALLINT、INT或BIGINT类型时，返回报错。number2非INT类型时，返回报错。number1或number2值为NULL时，返回NULL。',
    example: 'select corr(double_data,float_data) from mf_math_fun_t;',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-k4z-pcn-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  SHIFTRIGHT: {
    name: 'SHIFTRIGHT',
    simpleDesc: '计算按位右移值。',
    usageCommand: 'shiftright(tinyint|smallint|int|bigint <number1>, int <number2>)',
    usageDesc: '按位右移 (>>)。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'number1',
        desc: '必填。TINYINT、SMALLINT、INT或BIGINT整型数据。',
      },
      {
        label: 'number2',
        desc: '必填。INT整型数据。',
      },
    ],
    returnDesc:
      '返回INT或BIGINT类型。返回规则如下：number1非TINYINT、SMALLINT、INT或BIGINT类型时，返回报错。number2非INT类型时，返回报错。number1或number2值为NULL时，返回NULL。',
    example: 'select shiftright(4,2);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-iyl-vcn-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  SHIFTRIGHTUNSIGNED: {
    name: 'SHIFTRIGHTUNSIGNED',
    simpleDesc: '计算无符号按位右移值。',
    usageCommand: 'shiftrightunsigned(tinyint|smallint|int|bigint <number1>, int <number2>)',
    usageDesc: '无符号按位右移 (>>>)。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'number1',
        desc: '必填。TINYINT、SMALLINT、INT或BIGINT整型数据。',
      },
      {
        label: 'number2',
        desc: '必填。INT整型数据。',
      },
    ],
    returnDesc:
      '返回INT或BIGINT类型。返回规则如下：number1非TINYINT、SMALLINT、INT或BIGINT类型时，返回报错。number2非INT类型时，返回报错。number1或number2值为NULL时，返回NULL。',
    example: 'select shiftrightunsigned(8,2);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-h2f-1dn-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  UNHEX: {
    name: 'UNHEX',
    simpleDesc: '返回十六进制字符串所代表的字符串。',
    usageCommand: 'unhex(string <number>)',
    usageDesc: '返回十六进制字符串所代表的字符串。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'number',
        desc: '必填。为十六进制字符串。',
      },
    ],
    returnDesc:
      '返回BINARY类型。返回规则如下：number值为0时，返回报错。number值为NULL时，返回NULL。',
    example: "select unhex('616263');",
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-4n3-yv8-1ab',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
  WIDTH_BUCKET: {
    name: 'WIDTH_BUCKET',
    simpleDesc: '返回指定字段值落入的分组编号。',
    usageCommand:
      'width_bucket(numeric <expr>, numeric <min_value>, numeric <max_value>, int <num_buckets>)',
    usageDesc:
      '设定分组范围的最小值、最大值和分组个数，构建指定个数的大小相同的分组，返回指定字段值落入的分组编号。支持的数据类型为BIGINT、INT、FLOAT、DOUBLE、DECIMAL以及数据类型2.0的DECIMAL(precision,scale)，详情请参见2.0数据类型版本。此函数为MaxCompute 2.0扩展函数',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。需要判断分组编号的字段。',
      },
      {
        label: 'min_value',
        desc: '必填。分组范围最小值。',
      },
      {
        label: 'max_value',
        desc: '必填。分组范围最大值，最大值必须比最小值大。',
      },
      {
        label: 'num_buckets',
        desc: '必填。分组个数，必须大于0。',
      },
    ],
    returnDesc:
      '返回值为BIGINT类型，范围为0到设定的分组个数+1。返回规则如下：expr值小于min_value时，返回0。expr大于max_value时，返回设定的分组个数+1。expr值为NULL时，分组编号返回值也为NULL。其他情况返回字段值落入的分组编号。字段值对应的分组编号取值规则为floor( num_buckets * (expr - min_value)/(max_value - min_value) + 1)。min_value、max_value或num_buckets值为NULL时，返回NULL。',
    example:
      'select key,value,width_bucket(value,100,500,5) as value_groupfrom values (1,99),(2,100),(3,199),(4,200),(5,499),(6,500),(7,501),(8,NULL)as t(key,value);',
    docUrl: 'https://help.aliyun.com/document_detail/27864.html#section-pn8-ilh-3ll',
    functionType: ODPS_FUNCTION_TYPE_ENUM.MATH,
    functionInHive: true,
  },
};
