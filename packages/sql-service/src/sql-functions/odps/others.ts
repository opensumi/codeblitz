import { OTHER_FUNCTIONS_ENUM, FUNCTION_DETAIL, ODPS_FUNCTION_TYPE_ENUM } from './definitions';

export const OTHER_FUNCTIONS: Record<OTHER_FUNCTIONS_ENUM, FUNCTION_DETAIL> = {
  BASE64: {
    name: 'BASE64',
    simpleDesc: '将二进制表示值转换为BASE64编码格式字符串。',
    usageCommand: 'base64(binary <value>)',
    usageDesc: '将value从二进制转换为BASE64编码格式字符串。',
    paramDocs: [
      {
        label: 'value',
        desc: '必填。BINARY类型。待转换参数值。',
      },
    ],
    returnDesc: '返回STRING类型。输入参数为NULL时，返回结果为NULL。',
    example: "select base64(cast ('alibaba' as binary));",
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-fz3-uxp-zzf',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  CAST: {
    name: 'CAST',
    simpleDesc: '将表达式的结果转换为目标数据类型。',
    usageCommand: 'cast(<expr> as <type>)',
    usageDesc: '将expr的结果转换成目标数据类型type',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。待转换数据源。',
      },
      {
        label: 'type',
        desc: '必填。目标数据类型。',
      },
    ],
    returnDesc: '返回值为转换后的目标数据类型。',
    example: "select cast('1' as bigint);",
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-bpc-dy1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  COALESCE: {
    name: 'COALESCE',
    simpleDesc: '返回参数列表中第一个非 NULL 的值。',
    usageCommand: 'coalesce(<expr1>, <expr2>, ...)',
    usageDesc: '返回<expr1>, <expr2>, ... 中第一个非NULL的值',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。待验证的值。',
      },
    ],
    returnDesc: '返回值类型和参数数据类型相同。',
    example: 'select coalesce(null,null,1,null,3,5,7);',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-dts-3y1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  COMPRESS: {
    name: 'COMPRESS',
    simpleDesc: '对 STRING 或 BINARY 类型输入参数按照 GZIP 算法进行压缩。',
    usageCommand: 'compress(string | binary <str>)',
    usageDesc: '将str或bin按照GZIP算法进行压缩',
    paramDocs: [
      {
        label: 'str',
        desc: '必填。STRING类型。',
      },
      {
        label: 'bin',
        desc: '必填。BINARY类型。',
      },
    ],
    returnDesc: '返回BINARY类型。输入参数为NULL时，返回结果为NULL。',
    example: "select compress('hello');",
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-ylm-jlf-0jp',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: false,
  },
  CRC32: {
    name: 'CRC32',
    simpleDesc: '计算字符串或二进制数据的循环冗余校验值。',
    usageCommand: 'crc32(string|binary <expr>)',
    usageDesc: '计算字符串或二进制类型的expr的循环冗余校验值',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。STRING或BINARY类型。',
      },
    ],
    returnDesc:
      '返回BIGINT类型。返回规则如下：输入参数为NULL时，返回结果为NULL。输入参数为空时，返回0。',
    example: "select crc32('ABC');",
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-yt2-qa5-pnq',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  DECODE: {
    name: 'DECODE',
    simpleDesc: '实现 then-else 分支选择的功能。',
    usageCommand: 'decode(<expression>, <search>, <result>[, <search>, <result>]...[, <default>])',
    usageDesc: '实现if-then-else分支选择的功能',
    paramDocs: [
      {
        label: 'expression',
        desc: '必填。要比较的表达式。',
      },
      {
        label: 'search',
        desc: '必填。与expression进行比较的搜索项。',
      },
      {
        label: 'result',
        desc: '必填。search和expression的值匹配时的返回值。',
      },
      {
        label: 'default',
        desc: '可选。如果所有的搜索项都不匹配，则返回default值，如果未指定，则返回NULL。',
      },
    ],
    returnDesc:
      '如果匹配，返回result。如果没有匹配，返回default。如果没有指定default，返回NULL。如果search选项有重复且匹配时，会返回第一个值。通常，MaxCompute SQL在计算NULL=NULL时返回NULL，但在该函数中，NULL与NULL的值是相等的。',
    example: `select decode(customer_id, 'c1', 'Taobao','c2', 'Alipay','c3', 'Aliyun',Null, 'N/A','Others') as result from sale_detail;`,
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-ygq-4y1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  DECOMPRESS: {
    name: 'DECOMPRESS',
    simpleDesc: '对BINARY类型输入参数按照GZIP算法进行解压。',
    usageCommand: 'decompress(binary <bin>)',
    usageDesc: '将bin按照GZIP算法进行解压',
    paramDocs: [
      {
        label: 'bin',
        desc: '必填。BINARY类型。',
      },
    ],
    returnDesc: '返回BINARY类型。输入参数为NULL时，返回结果为NULL。',
    example: "select cast(decompress(compress('hello, world')) as string);",
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-buw-wn5-i1j',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: false,
  },
  GET_IDCARD_AGE: {
    name: 'GET_IDCARD_AGE',
    simpleDesc: '根据身份证号码返回当前的年龄。',
    usageCommand: 'get_idcard_age(<idcardno>)',
    usageDesc: '根据身份证号码返回当前的年龄，即当前年份减去身份证号码中标识的出生年份的差值',
    paramDocs: [
      {
        label: 'idcardno',
        desc:
          '必填。STRING类型，15位或18位身份证号码。在计算时会根据省份代码以及最后一位校验码检查身份证的合法性。如果校验不通过会返回NULL。',
      },
    ],
    returnDesc: '返回BIGINT类型。输入为NULL时，返回NULL。',
    example: 'get_idcard_age(<idcardno>)',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-j2q-1z1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: false,
  },
  GET_IDCARD_BIRTHDAY: {
    name: 'GET_IDCARD_BIRTHDAY',
    simpleDesc: '根据身份证号码返回出生日期。',
    usageCommand: 'get_idcard_birthday(<idcardno>)',
    usageDesc: '根据身份证号码返回出生日期',
    paramDocs: [
      {
        label: 'idcardno',
        desc:
          '必填。STRING类型，15位或18位身份证号码。在计算时会根据省份代码以及最后一位校验码检查身份证的合法性。如果校验不通过会返回NULL。',
      },
    ],
    returnDesc: '返回DATETIME类型。输入为NULL时，返回NULL。',
    example: 'get_idcard_birthday(<idcardno>)',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-tfq-dz1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: false,
  },
  GET_IDCARD_SEX: {
    name: 'GET_IDCARD_SEX',
    simpleDesc: '根据身份证号码返回性别。',
    usageCommand: 'get_idcard_sex(<idcardno>)',
    usageDesc: '根据身份证号码返回性别，值为M（男）或F（女）',
    paramDocs: [
      {
        label: 'idcardno',
        desc:
          '必填。STRING类型，15位或18位身份证号码。在计算时会根据省份代码以及最后一位校验码检查身份证的合法性。如果校验不通过会返回NULL。',
      },
    ],
    returnDesc: '返回STRING类型。输入为NULL时，返回NULL。',
    example: 'get_idcard_sex(<idcardno>)',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-akt-gz1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: false,
  },
  GET_USER_ID: {
    name: 'GET_USER_ID',
    simpleDesc: '获取当前账号的账号 ID。',
    usageCommand: 'get_user_id()',
    usageDesc: '获取当前账号的账号ID，即用户ID或UID',
    returnDesc: '返回当前账号的账号ID。',
    example: 'select get_user_id();',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-2zc-j25-j1e',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: 'current_user',
  },
  GREATEST: {
    name: 'GREATEST',
    simpleDesc: '返回输入参数中最大的值。',
    usageCommand: 'greatest(<value1>, <value2>[,...])',
    usageDesc: '返回输入参数中最大的值',
    paramDocs: [
      {
        label: 'value1',
        desc: '必填。BIGINT、DOUBLE、DECIMAL、DATETIME或STRING类型。',
      },
      {
        label: 'value2',
        desc: '必填。BIGINT、DOUBLE、DECIMAL、DATETIME或STRING类型。',
      },
    ],
    returnDesc:
      '返回输入参数中的最大值。当不存在隐式转换时，返回值同输入参数数据类型。NULL为最小值。当输入参数数据类型不相同时，DOUBLE、BIGINT、DECIMAL、STRING之间的比较会转换为DOUBLE类型；STRING、DATETIME的比较会转换为DATETIME类型。不允许其他的隐式转换。当set odps.sql.hive.compatible=true;时，任意参数输入为NULL，返回结果为NULL。',
    example: 'select greatest(3, 5, 8.8, 9.6)',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-n1g-kz1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  HASH: {
    name: 'HASH',
    simpleDesc: '根据输入参数计算 Hash 值。',
    usageCommand: 'hash(<value1>, <value2>[, ...])',
    usageDesc: '对value1、value2进行散列运算得到一个Hash值',
    paramDocs: [
      {
        label: 'value1',
        desc: '必填。待计算Hash值的参数，各参数的类型可以不相同。',
      },
      {
        label: 'value2',
        desc: '必填。待计算Hash值的参数，各参数的类型可以不相同。',
      },
    ],
    returnDesc: '返回INT或BIGINT类型。当输入参数为空或NULL时，返回结果为0。',
    example: 'select hash(0, 2, 4);',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-ff9-6g0-lqc',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  IF: {
    name: 'IF',
    simpleDesc: '判断指定的条件是否为真。',
    usageCommand: 'if(<testCondition>, <valueTrue>, <valueFalseOrNull>)',
    usageDesc:
      '判断testCondition是否为真。如果为真，返回valueTrue的值，否则返回valueFalseOrNull的值',
    paramDocs: [
      {
        label: 'testCondition',
        desc: '必填。要判断的表达式，BOOLEAN类型。',
      },
      {
        label: 'valueTrue',
        desc: '必填。表达式testCondition为True时，返回的值。',
      },
      {
        label: 'valueFalseOrNull',
        desc: '表达式testCondition为False时，返回的值，可以设为NULL。',
      },
    ],
    returnDesc: '返回值类型和参数valueTrue或valueFalseOrNull的数据类型一致。',
    example: 'select if(1=2, 100, 200);',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-7fo-xfg-nhg',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  LEAST: {
    name: 'LEAST',
    simpleDesc: '返回输入参数中最小的值。',
    usageCommand: 'least(<var1>, <var2>[,...])',
    usageDesc: '返回输入参数中的最小值',
    paramDocs: [
      {
        label: 'var',
        desc: '必填。BIGINT、DOUBLE、DECIMAL、DATETIME或STRING类型。',
      },
    ],
    returnDesc:
      '输入参数中的最小值。当不存在隐式转换时，返回值同输入参数类型。当有类型转换时，DOUBLE、BIGINT、STRING之间的转换返回DOUBLE类型；STRING、DATETIME之间的转换返回DATETIME类型；DECIMAL、DOUBLE、BIGINT和STRING之间的转换返回DECIMAL类型。不允许其他的隐式类型转换。NULL为最小值。如果所有参数值都为NULL，返回结果为NULL。',
    example: 'select least(5, 2, 7);',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-hlz-grk-bb9',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  MAX_PT: {
    name: 'MAX_PT',
    simpleDesc: '返回分区表的一级分区的最大值。',
    usageCommand: 'max_pt(<table_full_name>)',
    usageDesc:
      '返回分区表的一级分区中有数据的分区的最大值，按字母排序，且读取该分区下对应的数据。max_pt函数也可以使用标准SQL实现，select * from table where pt = max_pt("table"); 可以改写为select * from table where pt = (select max(pt) from table);',
    paramDocs: [
      {
        label: 'table_full_name',
        desc: 'table_full_name：必填。STRING类型。指定表名。必须对表有读权限。',
      },
    ],
    returnDesc: '返回最大的一级分区的值。',
    example: "select * from tbl where pt=max_pt('myproject.tbl');",
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-16z-4vq-iys',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  NULLIF: {
    name: 'NULLIF',
    simpleDesc: '比较两个入参是否相等。',
    usageCommand: 'nullif(T <expr1>, T <expr2>)',
    usageDesc: '比较 expr1 和 expr2 的值，二者相等时返回 NULL，否则返回 expr1',
    paramDocs: [
      {
        label: 'expr1',
        desc: '必填。任意类型的表达式。T指代输入数据类型，可以是MaxCompute支持的所有数据类型。',
      },
      {
        label: 'expr2',
        desc: '必填。任意类型的表达式。T指代输入数据类型，可以是MaxCompute支持的所有数据类型。',
      },
    ],
    returnDesc: '返回NULL或expr1。',
    example: 'select nullif(2, 3);',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-cth-bm8-bip',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  NVL: {
    name: 'NVL',
    simpleDesc: '指定值为 NULL 的参数的返回结果。',
    usageCommand: 'nvl(T <value>, T <default_value>)',
    usageDesc: '如果value值为 NULL，返回 default_value，否则返回 value。两个参数的数据类型必须一致',
    paramDocs: [
      {
        label: 'value',
        desc: '必填。输入参数。T指代输入数据类型，可以是MaxCompute支持的所有数据类型。',
      },
      {
        label: 'default_value',
        desc: '必填。替换后的值。必须与value的数据类型保持一致。',
      },
    ],
    returnDesc: '如果value值为NULL，返回default_value，否则返回value。两个参数的数据类型必须一致。',
    example: "select nvl(c1,'00000'),nvl(c2,0),nvl(c3,'-') from nvl_test;",
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-oau-ajn-osy',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  ORDINAL: {
    name: 'ORDINAL',
    simpleDesc: '将输入变量按从小到大排序后，返回指定位置的值。',
    usageCommand: 'ordinal(bigint <nth>, <var1>, <var2>[,...])',
    usageDesc: '将输入变量按从小到大排序后，返回 nth 指定位置的值',
    paramDocs: [
      {
        label: 'nth',
        desc: '必填。BIGINT类型。指定要返回的位置值为NULL时，返回NULL。',
      },
      {
        label: 'var',
        desc: '必填。BIGINT、DOUBLE、DATETIME或STRING类型。待排序的值。',
      },
    ],
    returnDesc:
      '排在第nth位的值，当不存在隐式转换时返回值同输入参数数据类型。当有类型转换时，DOUBLE、BIGINT、STRING之间的转换返回DOUBLE类型；STRING、DATETIME之间的转换返回DATETIME类型。不允许其他的隐式转换。NULL为最小值。',
    example: 'select ordinal(3, 1, 3, 2, 5, 2, 4, 6);',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-pcj-pz1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: false,
  },
  PARTITION_EXISTS: {
    name: 'PARTITION_EXISTS',
    simpleDesc: '查询指定的分区是否存在。',
    usageCommand: 'partition_exists(string <table_name>， string... <partitions>)',
    usageDesc: '查询指定的分区是否存在',
    paramDocs: [
      {
        label: 'table_name',
        desc:
          '必填。表名称，STRING类型。表名称中可以指定项目空间名称，例如my_proj.my_table。如果不指定项目空间名称则默认为当前项目空间',
      },
      {
        label: 'partitions',
        desc:
          '必填。分区名称，STRING类型。按照表分区列的顺序依次写出分区值，分区值数目必须与分区列数目一致。',
      },
    ],
    returnDesc: '返回BOOLEAN类型。如果指定的分区存在返回True，否则返回False。',
    example: "select partition_exists('foo', '20190101', '1');",
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-gy2-h1b-kb1',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: false,
  },
  SAMPLE: {
    name: 'SAMPLE',
    simpleDesc: '对所有读入的列值，采样并过滤掉不满足采样条件的行。',
    usageCommand: 'sample(<x>, <y>, [<column_name1>, <column_name2>[,...]])',
    usageDesc:
      '基于所有读入的 column_name 的值，系统根据 x、y 的设置做采样，并过滤掉不满足采样条件的行',
    paramDocs: [
      {
        label: 'x',
        desc: '必填。BIGINT类型，取值范围为大0的整型常量。表示哈希为x份，取第y份。',
      },
      {
        label: 'y',
        desc: '可选，省略时默认取第一份。如果省略参数中的y，则必须同时省略column_name。',
      },
    ],
    returnDesc: '返回BOOLEAN类型。',
    example: 'select * from tbla where sample (4, 2);',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-cm0-whl-xbc',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: false,
  },
  SHA: {
    name: 'SHA',
    simpleDesc: '计算字符串或二进制数据的 SHA-1 哈希值。',
    usageCommand: 'sha(string|binary <expr>)',
    usageDesc: '计算字符串或者二进制类型的 expr 的 SHA-1 哈希值，并以十六进制字符串格式返回',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。STRING或BINARY类型。',
      },
    ],
    returnDesc: '返回STRING类型。输入参数为NULL时，返回结果为NULL。',
    example: "select sha('ABC');",
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-6zq-k20-82q',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  SHA1: {
    name: 'SHA1',
    simpleDesc: '计算字符串或二进制数据的 SHA-1 哈希值。',
    usageCommand: 'sha1(string|binary <expr>)',
    usageDesc: '计算字符串或者二进制类型的 expr 的 SHA-1 哈希值，并以十六进制字符串格式返回',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。STRING或BINARY类型。',
      },
    ],
    returnDesc: '返回STRING类型。输入参数为NULL时，返回结果为NULL。',
    example: "select sha1('ABC');",
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-6so-1tl-okq',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  SHA2: {
    name: 'SHA2',
    simpleDesc: '计算字符串或二进制数据的 SHA-2 哈希值。',
    usageCommand: 'sha2(string|binary <expr>, bigint <number>)',
    usageDesc: '计算字符串或者二进制类型的 expr 的 SHA-2 哈希值，以指定的 number 格式返回',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。STRING或BINARY类型。',
      },
      {
        label: 'number',
        desc: '必填。BIGINT类型。哈希位长，取值必须是224、256、384、512、0（同256）。',
      },
    ],
    returnDesc: '返回STRING类型。输入参数为NULL时，返回结果为NULL。',
    example: "select sha2('ABC', 256);",
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-15y-7je-tmo',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  SIGN: {
    name: 'SIGN',
    simpleDesc: '判断正负值属性。',
    usageCommand: 'sign(<x>)',
    usageDesc: '用于判断x的正负值属性',
    paramDocs: [
      {
        label: 'x',
        desc: '必填。DOUBLE类型或者DECIMAL类型。可以为常量、函数或表达式。',
      },
    ],
    returnDesc:
      '当x为正值时，返回1.0。当x为负值时，返回-1.0。当x为0时，返回0.0。当x为空时，返回报错。',
    example: 'select sign(5-13);',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-ehj-ian-ogk',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  SPLIT: {
    name: 'SPLIT',
    simpleDesc: '将字符串按照指定的分隔符分割后返回数组。',
    usageCommand: 'split(<str>, <pat>)',
    usageDesc: '通过 pat 将 str 分割后返回数组',
    paramDocs: [
      {
        label: 'str',
        desc: '必填。STRING类型。指被分割的字符串。',
      },
      {
        label: 'pat',
        desc: '必填。STRING类型的分隔符。支持正则表达式。',
      },
    ],
    returnDesc: '返回ARRAY数组。数组中的元素为STRING类型。',
    example: 'select split("a, b, c", ",");',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-omq-nbb-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  STACK: {
    name: 'STACK',
    simpleDesc: '将指定的参数组分割为指定的行数。',
    usageCommand: 'stack(n, expr1, ..., exprk)',
    usageDesc:
      '将 expr1, ..., exprk 分割为n行，除非另有说明，否则输出结果使用默认的列名 col0、col1...',
    paramDocs: [
      {
        label: 'n',
        desc: '必填。分割的行数。',
      },
      {
        label: 'expr',
        desc:
          '必填。待分割的参数。expr1, ..., exprk必须是整型，且参数数目必须是n的整数倍，需要能分割为完整的n行，否则返回报错。',
      },
    ],
    returnDesc: '返回n行，列数为参数数量除以n的商的数据集。',
    example: 'select stack(3, 1, 2, 3, 4, 5, 6);',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-85x-l33-h2m',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  STR_TO_MAP: {
    name: 'STR_TO_MAP',
    simpleDesc: '将字符串按照指定的分隔符分割得到 Key 和 Value。',
    usageCommand:
      'str_to_map([string <mapDupKeyPolicy>,] <text> [, <delimiter1> [, <delimiter2>]])',
    usageDesc:
      '使用 delimiter1 将 text 分割成 Key-Value 对，然后使用delimiter2分割每个 Key-Value 对的 Key 和 Value',
    paramDocs: [
      {
        label: 'mapDupKeyPolicy',
        desc:
          '可选。STRING类型。指定出现重复Key时的处理方式。取值范围如下：exception：如果出现重复的Key，返回报错。last_win：如果出现重复的Key，后边的值将覆盖前边的值。',
      },
      {
        label: 'text',
        desc: '必填。STRING类型，指被分割的字符串。',
      },
      {
        label: 'delimiter1',
        desc: '可选。STRING类型，分隔符，不指定时默认为英文逗号（,）。',
      },
      {
        label: 'delimiter2',
        desc: '可选。STRING类型，分隔符，不指定时默认为等于号（=）。',
      },
    ],
    returnDesc:
      '返回值类型为map<string, string>。返回值是text被delimiter1和delimiter2分割后的结果。',
    example: "select str_to_map('test1&1-test2&2','-','&');",
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-p1z-xrj-dfb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  TABLE_EXISTS: {
    name: 'TABLE_EXISTS',
    simpleDesc: '查询指定的表是否存在。',
    usageCommand: 'table_exists(string <table_name>)',
    usageDesc: '查询指定的表是否存在',
    paramDocs: [
      {
        label: 'table_name',
        desc:
          '必填。表名称。STRING类型。表名称中可以指定项目名称（例如my_proj.my_table）。如果不指定项目名称则默认为当前项目。',
      },
    ],
    returnDesc: '返回BOOLEAN类型。如果指定的表存在返回True，否则返回False。',
    example: "select if(table_exists('abd'), col1, col2) from src;",
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-ky9-3so-zof',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: false,
  },
  TRANS_ARRAY: {
    name: 'TRANS_ARRAY',
    simpleDesc: '将一行数据转为多行的 UDTF，将列中存储的以固定分隔符格式分隔的数组转为多行。',
    usageCommand:
      'trans_array (<num_keys>, <separator>, <key1>,<key2…l2>,<col3>) as (<key1>,<key2>,...,<col1>, <col2>)',
    usageDesc: '将一行数据转为多行的 UDTF，将列中存储的以固定分隔符格式分隔的数组转为多行',
    paramDocs: [
      {
        label: 'num_keys',
        desc: '必填。 BIGINT类型常量，值必须>=0。在转为多行时作为转置key的列的个数。',
      },
      {
        label: 'separator',
        desc: '必填。STRING类型常量，用于将字符串拆分成多个元素的分隔符。为空时返回报错。',
      },
      {
        label: 'keys',
        desc:
          '必填。转置时作为key的列， 个数由num_keys指定。如果num_keys指定所有的列都作为key（即num_keys等于所有列的个数），则只返回一行。',
      },
      {
        label: 'cols',
        desc:
          '必填。要转为行的数组，keys之后的所有列视为要转置的数组，必须为STRING类型，存储的内容是字符串格式的数组，例如Hangzhou;Beijing;shanghai，是以分号（;）分隔的数组。',
      },
    ],
    returnDesc:
      '返回转置后的行，新的列名由as指定。作为key的列类型保持不变，其余所有的列是STRING类型。拆分成的行数以个数多的数组为准，不足的补NULL。',
    example:
      'select trans_array(1, ",", login_id, login_ip, login_time) as (login_id,login_ip,login_time) from t_table;',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-y21-vnb-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: false,
  },
  TRANS_COLS: {
    name: 'TRANS_COLS',
    simpleDesc: '将一行数据转为多行数据的 UDTF，将不同的列拆分为不同的行。',
    usageCommand:
      'trans_cols (<num_keys>, <key1>,<key2>,…,<col1>, <col2>,<col3>) as (<idx>, <key1>,<key2>,…,<col1>, <col2>)',
    usageDesc: '将一行数据转为多行数据的 UDTF，将不同的列拆分为不同的行',
    paramDocs: [
      {
        label: 'num_keys',
        desc: '必填。BIGINT类型常量，值必须>=0。在转为多行时作为转置key的列的个数。',
      },
      {
        label: 'keys',
        desc:
          '必填。转置时作为key的列， 个数由num_keys指定。如果num_keys指定所有的列都作为key（即num_keys等于所有列的个数），则只返回一行。',
      },
      {
        label: 'idx',
        desc: '必填。转换后的行号。',
      },
      {
        label: 'cols',
        desc: '必填。 要转为行的列。',
      },
    ],
    returnDesc:
      '返回转置后的行，新的列名由as指定。输出的第一列是转置的下标，下标从1开始。作为key的列类型保持不变，其余所有的列与原来的数据类型一致。',
    example:
      'select trans_cols(1, login_id, login_ip1, login_ip2) as (idx, login_id, login_ip) from t_table;',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-vxw-9dg-ypz',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: false,
  },
  UNBASE64: {
    name: 'UNBASE64',
    simpleDesc: '将 BASE64 编码格式字符串转换为二进制表示值。',
    usageCommand: 'unbase64(string <str>)',
    usageDesc: '将BASE64编码格式字符串str转换为二进制表示格式',
    paramDocs: [
      {
        label: 'str',
        desc: '必填。STRING类型。待转换BASE64编码格式字符串',
      },
    ],
    returnDesc: '返回BINARY类型。输入参数为NULL时，返回结果为NULL。',
    example: "select unbase64('YWxpYmFiYQ==');",
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-ywn-zlz-ckc',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  UNIQUE_ID: {
    name: 'UNIQUE_ID',
    simpleDesc: '返回一个随机 ID，运行效率高于 UUID 函数。',
    usageCommand: 'unique_id()',
    usageDesc:
      '返回一个随机的唯一 ID，格式示例为 29347a88-1e57-41ae-bb68-a9edbdd9* 该函数的运行效率高于UUID，且返回的ID较长，相较于UUID多一个下划线（_）和一个数字编号，例如_1',
    returnDesc: '返回一个随机的全局 ID',
    example: 'select unique_id()',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-x4q-g5f-rav',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
  UUID: {
    name: 'UUID',
    simpleDesc: '返回一个随机 ID。',
    usageCommand: 'uuid()',
    usageDesc: '返回一个随机ID，格式示例为29347a88-1e57-41ae-bb68-a9edbdd9xxxx',
    returnDesc: '返回一个随机的全局 ID',
    example: 'select uuid()',
    docUrl: 'https://help.aliyun.com/document_detail/48976.html#section-9c2-6h7-cbg',
    functionType: ODPS_FUNCTION_TYPE_ENUM.OTHER,
    functionInHive: true,
  },
};
