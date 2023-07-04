import { DATE_FUNCTIONS_ENUM, FUNCTION_DETAIL, ODPS_FUNCTION_TYPE_ENUM } from './definitions';

export const DATE_FUNCTIONS: Record<DATE_FUNCTIONS_ENUM, FUNCTION_DETAIL> = {
  DATEADD: {
    name: 'DATEADD',
    simpleDesc: '按照指定的单位和幅度修改日期值。',
    usageCommand: 'dateadd(date|datetime|timestamp <date>, bigint <delta>, string <datepart>)',
    usageDesc:
      '按照指定的单位datepart和幅度delta修改date的值。如果您需要获取在当前时间基础上指定变动幅度的日期，请结合GETDATE函数使用。',
    paramDocs: [
      {
        label: 'date',
        desc:
          '必填。日期值，DATE、DATETIME或TIMESTAMP类型。如果参数为STRING类型，格式符合DATETIME类型的格式，即yyyy-mm-dd hh:mi:ss，例如2021-08-28 00:00:00，且MaxCompute项目的数据类型版本是1.0，则会隐式转换为DATETIME类型后参与运算。',
      },
      {
        label: 'delta',
        desc:
          '必填。修改幅度，BIGINT类型。如果delta大于0，则增，否则减。如果参数为STRING或DOUBLE类型，则会隐式转换为BIGINT类型后参与运算。',
      },
      {
        label: 'datepart',
        desc:
          '必填。指定修改的单位，STRING类型常量。非常量、不支持的格式或其他类型会返回报错。此字段的取值遵循STRING与DATETIME类型转换的约定，即yyyy表示年，mm表示月，dd表示天。关于类型转换的规则，详情请参见数据类型转换。该字段也支持扩展的日期格式：年-year、月-month或-mon、日-day和小时-hour。',
      },
    ],
    returnDesc:
      '返回DATE或DATETIME类型，格式为yyyy-mm-dd或yyyy-mm-dd hh:mi:ss。返回规则如下：date非DATE、DATETIME或TIMESTAMP类型时，返回报错。date值为NULL时，返回报错。delta或datepart值为NULL时，返回NULL。',
    example: "select dateadd(datetime '2005-02-28 00:00:00', 1, 'dd');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-qjz-lrl-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: false,
  },
  DATE_ADD: {
    name: 'DATE_ADD',
    simpleDesc: '按照指定的幅度增减天数，与 date_sub的增减逻辑相反。',
    usageCommand: 'date_add(date|timestamp|string <startdate>, bigint <delta>)',
    usageDesc:
      '按照delta幅度增减startdate日期的天数。如果您需要获取在当前时间基础上指定变动幅度的日期，请结合GETDATE函数使用，本命令与DATE_SUB的增减逻辑相反。',
    paramDocs: [
      {
        label: 'startdate',
        desc:
          '必填。起始日期值。支持DATE、DATETIME或STRING类型。如果参数为STRING类型，且MaxCompute项目的数据类型版本是1.0，则会隐式转换为DATE类型后参与运算，且STRING参数格式至少要包含"yyyy-mm-dd"。例如"2019-12-27"。',
      },
      {
        label: 'delta',
        desc:
          '必填。修改幅度。BIGINT类型。如果delta大于0，则增；delta小于0，则减；delta等于0，不增不减。',
      },
    ],
    returnDesc:
      '返回DATE类型，格式为yyyy-mm-dd。返回规则如下：startdate非DATE、DATETIME或STRING类型时，返回报错。startdate值为NULL时，返回报错。delta值为NULL时，返回NULL。',
    example: "select date_add(datetime '2005-02-28 00:00:00', 1);",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-aza-roh-gfl',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  DATE_FORMAT: {
    name: 'DATE_FORMAT',
    simpleDesc: '将日期值转换为指定格式的字符串。',
    usageCommand: 'date_format(date|datetime|timestamp|string <date>, string <format>)',
    usageDesc: '将date按照format指定的格式转换为字符串。',
    paramDocs: [
      {
        label: 'date',
        desc:
          "必填。待转换的日期值。支持DATE、DATETIME、TIMESTAMP或STRING类型。如果参数为STRING类型，格式至少要包含'yyyy-MM-dd'。例如'2019-12-27'",
      },
      {
        label: 'format',
        desc:
          '必填。STRING类型常量。format可由如下日期字段组成，例如yyyy-MM-dd hh:mm:ss:SSS或yyyy-MM-dd hh:mi:ss:SSS：',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：date非DATE、DATETIME或TIMESTAMP类型时，返回NULL。date值为NULL时，返回报错。format值为NULL时，返回NULL。',
    example:
      "select date_format(from_utc_timestamp(current_timestamp(), 'UTC'),'yyyy-mm-dd hh:mm:ss.SSS');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-y7n-pzm-v0t',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  DATE_SUB: {
    name: 'DATE_SUB',
    simpleDesc: '按照指定的幅度增减天数，与 date_add 的增减逻辑相反。',
    usageCommand: 'date_sub(date|timestamp|string <startdate>, bigint <delta>)',
    usageDesc:
      '按照delta幅度增减startdate日期的天数。如果您需要获取在当前时间基础上指定变动幅度的日期，请结合GETDATE函数使用。 本命令与DATE_ADD的增减逻辑相反。',
    paramDocs: [
      {
        label: 'startdate',
        desc:
          "必填。起始日期值。支持DATE、DATETIME或STRING类型。如果参数为STRING类型，且MaxCompute项目的数据类型版本是1.0，则会隐式转换为DATE类型后参与运算，且STRING参数格式至少要包含'yyyy-mm-dd'。例如'2019-12-27'。",
      },
      {
        label: 'delta',
        desc:
          '必填。修改幅度。BIGINT类型。如果delta大于0，则减；delta小于0，则增；delta等于0，不增不减。',
      },
    ],
    returnDesc:
      '返回DATE类型，格式为yyyy-mm-dd。返回规则如下：startdate非DATE、DATETIME或STRING类型时，返回报错。startdate值为NULL时，返回报错。delta值为NULL时，返回NULL。',
    example: "select date_sub(datetime '2005-03-01 00:00:00', 1);",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-02m-xan-u6n',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  DATEDIFF: {
    name: 'DATEDIFF',
    simpleDesc: '计算两个日期的差值并按照指定的单位表示。',
    usageCommand:
      'datediff(date|datetime|timestamp <date1>, date|datetime|timestamp <date2>, string <datepart>)',
    usageDesc: '计算两个时间date1、date2的差值，将差值以指定的时间单位datepart表示。',
    paramDocs: [
      {
        label: 'date1',
        desc:
          '必填。DATE、DATETIME或TIMESTAMP类型。被减数和减数。如果输入为STRING类型，且MaxCompute项目的数据类型版本是1.0，则会隐式转换为DATETIME类型后参与运算。',
      },
      {
        label: 'date2',
        desc:
          '必填。DATE、DATETIME或TIMESTAMP类型。被减数和减数。如果输入为STRING类型，且MaxCompute项目的数据类型版本是1.0，则会隐式转换为DATETIME类型后参与运算。',
      },
      {
        label: 'datepart',
        desc: '可选。时间单位，STRING类型常量。',
      },
    ],
    returnDesc:
      '返回BIGINT类型。返回规则如下：date1、date2非DATE、DATETIME或TIMESTAMP类型时，返回报错。如果date1小于date2，返回值为负数。date1或date2值为NULL时，返回NULL。datepart值为NULL时，返回NULL。',
    example: "select datediff(end, start, 'dd');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-xl2-nsl-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  DATEPART: {
    name: 'DATEPART',
    simpleDesc: '提取日期中符合指定时间单位的字段值。',
    usageCommand: 'datepart(date|datetime|timestamp <date>, string <datepart>)',
    usageDesc: '提取日期date中符合指定时间单位datepart的值。',
    paramDocs: [
      {
        label: 'date',
        desc: '必填。DATE、DATETIME或TIMESTAMP类型。',
      },
      {
        label: 'datepart',
        desc: '必填。STRING类型常量，支持扩展的日期格式',
      },
    ],
    returnDesc:
      '返回BIGINT类型。返回规则如下：date非DATE、DATETIME或TIMESTAMP类型时，返回报错。date值为NULL时，返回报错。datepart值为NULL时，返回NULL。',
    example: "select datepart(datetime'2013-06-08 01:10:00', 'yyyy');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-am4-xtl-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: false,
  },
  DATETRUNC: {
    name: 'DATETRUNC',
    simpleDesc: '提取日期按照指定时间单位截取后的值。',
    usageCommand: 'datetrunc (date|datetime|timestamp <date>, string <datepart>)',
    usageDesc: '返回将日期date按照datepart指定的时间单位进行截取后的日期值。',
    paramDocs: [
      {
        label: 'date',
        desc: '必填。DATE、DATETIME或TIMESTAMP类型。',
      },
      {
        label: 'datepart',
        desc: '必填。STRING类型常量，支持扩展的日期格式',
      },
    ],
    returnDesc:
      '返回DATE或DATETIME类型，格式为yyyy-mm-dd或yyyy-mm-dd hh:mi:ss。返回规则如下：date非DATE、DATETIME或TIMESTAMP类型时，返回报错。date值为NULL时，返回报错。datepart值为NULL时，返回NULL。',
    example: "select datetrunc(datetime'2011-12-07 16:28:46', 'yyyy');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-zbr-d5l-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: 'trunc',
  },
  FROM_UNIXTIME: {
    name: 'FROM_UNIXTIME',
    simpleDesc: '将数字型的UNIX值转换为日期值。',
    usageCommand: 'from_unixtime(bigint <unixtime>)',
    usageDesc: '将数字型的UNIX时间日期值unixtime转为日期值。',
    paramDocs: [
      {
        label: 'unixtime',
        desc: '必填。BIGINT类型，秒数，UNIX格式的日期时间值。',
      },
    ],
    returnDesc: '返回DATETIME类型，格式为yyyy-mm-dd hh:mi:ss。unixtime值为NULL时，返回NULL。',
    example: 'select from_unixtime(123456789);',
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-c38-7d4-35t',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  GETDATE: {
    name: 'GETDATE',
    simpleDesc: '获取当前系统时间。',
    usageCommand: 'getdate()',
    usageDesc: '获取当前系统时间。使用东八区时间作为MaxCompute标准时间。',
    returnDesc: '返回当前日期和时间，DATETIME类型。',
    example: 'select getdate()',
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-o4p-45l-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: 'current_date',
  },
  ISDATE: {
    name: 'ISDATE',
    simpleDesc: '判断一个日期字符串能否根据指定的格式串转换为一个日期值。',
    usageCommand: 'isdate(string <date>, string <format>)',
    usageDesc:
      '判断一个日期字符串能否根据指定的格式串转换为一个日期值。如果能转换成功，返回True；否则返回False。',
    paramDocs: [
      {
        label: 'date',
        desc:
          '必填。STRING类型。如果输入为BIGINT、DOUBLE、DECIMAL或DATETIME类型，会隐式转换为STRING类型后参与运算。',
      },
      {
        label: 'format',
        desc:
          '必填。STRING类型常量，不支持日期扩展格式。如果format中出现多余的格式串，则只取第一个格式串对应的日期数值，其余的会被视为分隔符。例如isdate("1234-yyyy", "yyyy-yyyy")，会返回True。',
      },
    ],
    returnDesc: '返回BOOLEAN类型。date或format值为NULL时，返回NULL。',
    example: "select isdate('2021-10-11','yyyy-mm-dd');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-rzl-s5l-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: false,
  },
  LASTDAY: {
    name: 'LASTDAY',
    simpleDesc: '获取日期所在月的最后一天。',
    usageCommand: 'lastday(datetime <date>)',
    usageDesc: '取date所在月的最后一天，截取到天，时分秒部分为00:00:00。',
    paramDocs: [
      {
        label: 'date',
        desc:
          '必填。DATETIME类型日期值，格式为yyyy-mm-dd hh:mi:ss。如果输入为STRING类型，且MaxCompute项目的数据类型版本是1.0，则会隐式转换为DATETIME类型后参与运算。',
      },
    ],
    returnDesc:
      '返回DATETIME类型，格式为yyyy-mm-dd hh:mi:ss。返回规则如下：date非DATETIME或STRING类型，或格式不符合要求时，会返回报错。date值为NULL时，返回NULL。',
    example: "select lastday (datetime '2013-06-08 01:10:00');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-vhk-w2m-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: 'last_day',
  },
  TO_DATE: {
    name: 'TO_DATE',
    simpleDesc: '将指定格式的字符串转换为日期值。',
    usageCommand: 'to_date(string <date>, string <format>)',
    usageDesc: '将date转换成符合format格式的日期值。',
    paramDocs: [
      {
        label: 'date',
        desc:
          '必填。STRING类型，要转换的字符串格式的日期值。如果输入为BIGINT、DOUBLE、DECIMAL或DATETIME类型，则会隐式转换为STRING类型后参与运算。',
      },
      {
        label: 'format',
        desc:
          '必填。STRING类型常量，日期格式。format不支持日期扩展格式，其他字符在解析时当作无用字符忽略。',
      },
    ],
    returnDesc: '返回DATETIME类型，格式为yyyy-mm-dd hh:mi:ss。date或format值为NULL时，返回NULL。',
    example: "select to_date('阿里巴巴2010-12\\*03', '阿里巴巴yyyy-mm\\*dd');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-b3z-1fm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  TO_CHAR: {
    name: 'TO_CHAR',
    simpleDesc: '将日期按照指定格式转换为字符串。',
    usageCommand: 'to_char(datetime <date>, string <format>)',
    usageDesc: '将日期类型date按照format指定的格式转成字符串。',
    paramDocs: [
      {
        label: 'date',
        desc: '必填。DATETIME类型日期值，格式为yyyy-mm-dd hh:mi:ss。',
      },
      {
        label: 'format',
        desc:
          '必填。STRING类型常量。format中的日期格式部分会被替换成相应的数据，其他字符直接输出。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：date非DATETIME或STRING类型时，返回报错。date值为NULL时，返回报错。format值为NULL时，返回NULL。',
    example: "select to_char(datetime'2010-12-03 00:00:00', '阿里金融yyyy-mm*dd');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-a2d-rfm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: false,
  },
  UNIX_TIMESTAMP: {
    name: 'UNIX_TIMESTAMP',
    simpleDesc: '将日期转换为整型的UNIX格式的日期值。',
    usageCommand: 'unix_timestamp(datetime|date|timestamp|string <date>)',
    usageDesc: '将日期date转化为整型的UNIX格式的日期时间值。',
    paramDocs: [
      {
        label: 'date',
        desc:
          '必填。DATETIME、DATE、TIMESTAMP或STRING类型日期值，格式为yyyy-mm-dd、yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。',
      },
    ],
    returnDesc:
      '返回BIGINT类型，表示UNIX格式日期值。返回规则如下：date非DATETIME、DATE、TIMESTAMP或STRING类型，或格式不符合要求时，返回报错。date值为NULL时，返回NULL。',
    example: "select unix_timestamp(datetime'2009-03-20 11:11:00');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-k4r-zfm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  WEEKDAY: {
    name: 'WEEKDAY',
    simpleDesc: '返回日期值是当前周的第几天。',
    usageCommand: 'weekday (datetime <date>)',
    usageDesc: '返回date日期是当前周的第几天。',
    paramDocs: [
      {
        label: 'date',
        desc: '必填。DATETIME类型日期值。格式为yyyy-mm-dd hh:mi:ss。',
      },
    ],
    returnDesc:
      '返回BIGINT类型。返回规则如下：周一作为一周的第一天，返回值为0。其他日期依次递增，周日返回6。date非DATETIME或STRING类型，或格式不符合要求时，返回报错。date值为NULL时，返回NULL。',
    example: "select weekday (datetime '2009-03-20 11:11:00');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-g41-2gm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: false,
  },
  WEEKOFYEAR: {
    name: 'WEEKOFYEAR',
    simpleDesc: '返回日期值位于当年的第几周。',
    usageCommand: 'weekofyear (datetime <date>)',
    usageDesc: '返回日期date位于那一年的第几周。周一作为一周的第一天。',
    paramDocs: [
      {
        label: 'date',
        desc: '必填。DATETIME类型日期值。格式为yyyy-mm-dd hh:mi:ss。',
      },
    ],
    returnDesc:
      '返回BIGINT类型。返回规则如下：date非DATETIME或STRING类型，或格式不符合要求时，返回NULL。date值为NULL时，返回NULL。',
    example: 'select weekofyear(to_date("20141229", "yyyymmdd"));',
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-rjv-hgm-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  ADD_MONTHS: {
    name: 'ADD_MONTHS',
    simpleDesc: '计算日期值增加指定月数后的日期。',
    usageCommand: 'add_months(date|datetime|timestamp|string <startdate>, int <num_months>)',
    usageDesc:
      '返回开始日期startdate增加num_months个月后的日期。此函数为 MaxCompute 2.0 扩展函数。',
    paramDocs: [
      {
        label: 'startdate',
        desc:
          '必填。DATE、DATETIME、TIMESTAMP或STRING类型，格式为yyyy-mm-dd、yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。取值为STRING类型格式时，至少要包含yyyy-mm-dd且不含多余的字符串。',
      },
      {
        label: 'num_months',
        desc: '必填。INT型数值。',
      },
    ],
    returnDesc:
      '返回STRING类型的日期值，格式为yyyy-mm-dd。返回规则如下：startdate非DATE、DATETIME、TIMESTAMP或STRING类型，或格式不符合要求时，返回NULL。startdate值为NULL时，返回报错。num_months值为NULL时，返回NULL。',
    example: "select add_months('2017-02-14',3);",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-pyo-gp3-4mg',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  CURRENT_TIMESTAMP: {
    name: 'CURRENT_TIMESTAMP',
    simpleDesc: '返回当前TIMESTAMP类型的时间戳。',
    usageCommand: 'current_timestamp()',
    usageDesc: '返回当前TIMESTAMP类型的时间戳，值不固定。此函数为 MaxCompute 2.0 扩展函数。',
    returnDesc: '返回TIMESTAMP类型。',
    example: 'select current_timestamp()',
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-pwp-sqq-myk',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  DAY: {
    name: 'DAY',
    simpleDesc: '返回日期值的天。',
    usageCommand: 'day(datetime|timestamp|date|string <date>)',
    usageDesc: '返回一个日期的天。此函数为 MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'date',
        desc:
          '必填。DATE、DATETIME、TIMESTAMP或STRING类型，格式为yyyy-mm-dd、yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。取值为STRING类型格式时，至少要包含yyyy-mm-dd且不含多余的字符串。',
      },
    ],
    returnDesc:
      '返回INT类型。返回规则如下：date非DATETIME、TIMESTAMP、DATE或STRING类型，或格式不符合要求时，返回NULL。date值为NULL时，返回NULL。',
    example: "select day('2014-09-01');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-y8i-7ej-x66',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  DAYOFMONTH: {
    name: 'DAYOFMONTH',
    simpleDesc: '返回日部分的值。',
    usageCommand: 'dayofmonth(datetime|timestamp|date|string <date>)',
    usageDesc: '返回日期日部分的值。此函数为 MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'date',
        desc:
          '必填。DATE、DATETIME、TIMESTAMP或STRING类型，格式为yyyy-mm-dd、yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。取值为STRING类型格式时，至少要包含yyyy-mm-dd且不含多余的字符串。',
      },
    ],
    returnDesc:
      '返回INT类型。返回规则如下：date非DATETIME、TIMESTAMP、DATE或STRING类型，或格式不符合要求时，返回NULL。date值为NULL时，返回NULL。',
    example: "select dayofmonth('2014-09-01');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-11g-r40-z1a',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  EXTRACT: {
    name: 'EXTRACT',
    simpleDesc: '获取日期TIMESTAMP中指定单位的部分。',
    usageCommand: 'extract(<datepart> from date|datetime|timestamp <date>)',
    usageDesc: '提取日期date中指定单位datepart的部分。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'datepart',
        desc: '必填。支持YEAR、MONTH、DAY、HOUR或MINUTE等时间取值',
      },
      {
        label: 'date',
        desc:
          '必填。DATE、DATETIME、TIMESTAMP或STRING类型日期值，格式为yyyy-mm-dd、yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。取值为STRING类型格式时，至少要包含yyyy-mm-dd且不含多余的字符串。',
      },
    ],
    returnDesc:
      '返回INT类型。返回规则如下：datepart非YEAR、MONTH、DAY、HOUR或MINUTE等时间取值时，返回报错。datepart值为NULL时，返回报错。date非DATE、DATETIME、TIMESTAMP或STRING类型或为NULL时，返回NULL。',
    example: "select extract(year from '2019-05-01 11:21:00') year;",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-7os-6iu-7ue',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  FROM_UTC_TIMESTAMP: {
    name: 'FROM_UTC_TIMESTAMP',
    simpleDesc: '将一个UTC时区的时间戳转换为一个指定时区的时间戳。',
    usageCommand: 'from_utc_timestamp(timestamp, string <timezone>)',
    usageDesc:
      '将一个UTC时区的时间戳转换成一个指定时区的时间戳，即将一个UTC时区的时间戳按照指定的时区显示。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'timestamp',
        desc:
          '必填。时间戳，支持TIMESTAMP、DATETIME、TINYINT、SMALLINT、INT或BIGINT数据类型。如果该参数为TINYINT、SMALLINT、INT或BIGINT数据类型，则单位为毫秒。',
      },
      {
        label: 'timezone',
        desc: '必填。指定需要转换的目标时区。',
      },
    ],
    returnDesc:
      '返回DATETIME或TIMESTAMP类型，格式为yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。返回规则如下：{any primitive type}*非TIMESTAMP、DATETIME、TINYINT、SMALLINT、INT或BIGINT时，返回报错。{any primitive type}*值为NULL时，返回报错。timezone值为NULL时，返回NULL。',
    example: "select from_utc_timestamp(1501557840000, 'PST');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-f7q-8tj-y6p',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  HOUR: {
    name: 'HOUR',
    simpleDesc: '返回日期小时部分的值。',
    usageCommand: 'hour(datetime|timestamp|string <date>)',
    usageDesc: '返回日期小时部分的值。',
    paramDocs: [
      {
        label: 'date',
        desc:
          '必填。DATE、DATETIME、TIMESTAMP或STRING类型日期值，格式为yyyy-mm-dd、yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。取值为STRING类型格式时，至少要包含yyyy-mm-dd且不含多余的字符串。',
      },
    ],
    returnDesc:
      '返回INT类型。返回规则如下：date非DATETIME、TIMESTAMP或STRING类型，或格式不符合要求时，返回NULL。date值为NULL时，返回NULL。',
    example: "select hour('2014-09-01 12:00:00');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-0y6-hah-5s3',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  LAST_DAY: {
    name: 'LAST_DAY',
    simpleDesc: '返回日期值所在月份的最后一天日期。',
    usageCommand: 'last_day(date|datetime|timestamp|string <date>)',
    usageDesc: '返回该日期所在月份的最后一天日期。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'date',
        desc:
          '必填。DATE、DATETIME、TIMESTAMP或STRING类型日期值。取值为STRING类型格式时，至少要包含yyyy-mm-dd且不含多余的字符串。',
      },
    ],
    returnDesc:
      '返回STRING类型的日期值，格式为yyyy-mm-dd。返回规则如下：date非DATE、DATETIME、TIMESTAMP或STRING类型，或格式不符合要求时，返回NULL。date值为NULL时，返回报错。',
    example: "select last_day('2017-03-04');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-o8k-xhn-4e3',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  MINUTE: {
    name: 'MINUTE',
    simpleDesc: '返回日期分钟部分的值。',
    usageCommand: 'minute(datetime|timestamp|string <date>)',
    usageDesc: '返回日期分钟部分的值。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'date',
        desc:
          '必填。DATETIME、TIMESTAMP或STRING类型日期值，格式为yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。',
      },
    ],
    returnDesc:
      '返回INT类型。返回规则如下：date非DATETIME、TIMESTAMP或STRING类型，或格式不符合要求时，返回NULL。date值为NULL时，返回NULL。',
    example: "select minute('2014-09-01 12:30:00');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-o49-uhr-tr3',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  MONTH: {
    name: 'MONTH',
    simpleDesc: '返回日期值所属月份。',
    usageCommand: 'month(datetime|timestamp|date|string <date>)',
    usageDesc: '返回一个日期的月份。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'date',
        desc:
          '必填。DATETIME、TIMESTAMP、DATE或STRING类型日期值，格式为yyyy-mm-dd、yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。取值为STRING类型格式时，至少要包含yyyy-mm-dd且不含多余的字符串。',
      },
    ],
    returnDesc:
      '返回INT类型。返回规则如下：date非DATETIME、TIMESTAMP、DATE或STRING类型，或格式不符合要求时，返回NULL。date值为NULL时，返回NULL。',
    example: "select month('2014-09-01');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-opy-lzo-onw',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  MONTHS_BETWEEN: {
    name: 'MONTHS_BETWEEN',
    simpleDesc: '返回指定日期值间的月数。',
    usageCommand:
      'months_between(datetime|timestamp|date|string <date1>, datetime|timestamp|date|string <date2>)',
    usageDesc: '返回日期date1和date2之间的月数。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'date1',
        desc:
          '必填。DATETIME、TIMESTAMP、DATE或STRING类型日期值，格式为yyyy-mm-dd、yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。取值为STRING类型格式时，至少要包含yyyy-mm-dd且不含多余的字符串。',
      },
      {
        label: 'date2',
        desc:
          '必填。DATETIME、TIMESTAMP、DATE或STRING类型日期值，格式为yyyy-mm-dd、yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。取值为STRING类型格式时，至少要包含yyyy-mm-dd且不含多余的字符串。',
      },
    ],
    returnDesc:
      '返回DOUBLE类型。返回规则如下：当date1晚于date2时，返回值为正。当date2晚于date1时，返回值为负。当date1和date2分别对应两个月的最后一天，返回整数月；否则计算方式为date1减去date2的天数除以31天。date1或date2值为NULL时，返回NULL。',
    example: "select months_between('1997-02-28 10:30:00', '1996-10-30');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-s2l-btt-mal',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  NEXT_DAY: {
    name: 'NEXT_DAY',
    simpleDesc: '返回大于日期值且与指定周相匹配的第一个日期。',
    usageCommand: 'next_day(timestamp|date|datetime|string <startdate>, string <week>)',
    usageDesc:
      '返回大于指定日期startdate并且与week相匹配的第一个日期，即下周几的具体日期。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'startdate',
        desc:
          '必填。TIMESTAMP、DATE、DATETIME或STRING类型日期值，格式为yyyy-mm-dd、yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。取值为STRING类型格式时，至少要包含yyyy-mm-dd且不含多余的字符串。',
      },
      {
        label: 'week',
        desc: '必填。STRING类型，一个星期前2个或3个字母，或者一个星期的全名。例如MO、TUE或FRIDAY。',
      },
    ],
    returnDesc:
      '返回STRING类型的日期值，格式为yyyy-mm-dd。返回规则如下：date非TIMESTAMP、DATE、DATETIME或STRING类型，或格式不符合要求时，返回NULL。date值为NULL时，返回报错。week值为NULL时，返回NULL。',
    example: "select next_day('2017-08-01','TU');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-6pi-f0n-a4f',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  QUARTER: {
    name: 'QUARTER',
    simpleDesc: '返回日期值所属季度。',
    usageCommand: 'quarter (datetime|timestamp|date|string <date>)',
    usageDesc: '返回一个日期的季度，范围是1~4。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'date',
        desc:
          '必填。DATETIME、TIMESTAMP、DATE或STRING类型日期值，格式为yyyy-mm-dd、yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。取值为STRING类型格式时，至少要包含yyyy-mm-dd且不含多余的字符串。',
      },
    ],
    returnDesc:
      '返回INT类型。返回规则如下：date非DATETIME、TIMESTAMP、DATE或STRING类型，或格式不符合要求时，返回NULL。date值为NULL时，返回NULL。',
    example: "select quarter('1970-11-12 10:00:00');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-okg-rxb-b5l',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  SECOND: {
    name: 'SECOND',
    simpleDesc: '返回日期秒数部分的值。',
    usageCommand: 'second(datetime|timestamp|string <date>)',
    usageDesc: '返回日期秒数部分的值。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'date',
        desc:
          '必填。DATETIME、TIMESTAMP或STRING类型日期值，格式为yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。取值为STRING类型格式时，至少要包含yyyy-mm-dd hh:mi:ss且不含多余的字符串。',
      },
    ],
    returnDesc:
      '返回INT类型。返回规则如下：date非DATETIME、TIMESTAMP或STRING类型，或格式不符合要求时，返回NULL。date值为NULL时，返回NULL。',
    example: "select second('2014-09-01 12:30:45');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-yxp-zv1-tzb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
  TO_MILLIS: {
    name: 'TO_MILLIS',
    simpleDesc: '将指定日期转换为以毫秒为单位的UNIX时间戳。',
    usageCommand: 'to_millis(datetime|timestamp <date>)',
    usageDesc: '将给定日期date转换为以毫秒为单位的UNIX时间戳。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'date',
        desc:
          '必填。DATETIME或TIMESTAMP类型日期值，格式为yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。',
      },
    ],
    returnDesc:
      '返回BIGINT类型。返回规则如下：date非DATETIME或TIMESTAMP类型时，返回报错。date值为NULL时，返回报错。',
    example: "select to_millis(datetime '2021-03-31 15:15:00');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-i9e-7ww-z54',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: false,
  },
  YEAR: {
    name: 'YEAR',
    simpleDesc: '返回日期值的年。',
    usageCommand: 'year(datetime|timestamp|date|string <date>)',
    usageDesc: '返回日期date的年。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'date',
        desc:
          '必填。DATETIME、TIMESTAMP、DATE或STRING类型日期值，格式为yyyy-mm-dd、yyyy-mm-dd hh:mi:ss或yyyy-mm-dd hh:mi:ss.ff3。取值为STRING类型格式时，至少要包含yyyy-mm-dd且不含多余的字符串。',
      },
    ],
    returnDesc:
      '返回INT类型。返回规则如下：date非DATETIME、TIMESTAMP、DATE或STRING类型，或格式不符合要求时，返回NULL。date值为NULL时，返回NULL',
    example: "select year('1970-01-01 12:30:00');",
    docUrl: 'https://help.aliyun.com/document_detail/48974.html#section-gb4-g3m-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.DATE,
    functionInHive: true,
  },
};
