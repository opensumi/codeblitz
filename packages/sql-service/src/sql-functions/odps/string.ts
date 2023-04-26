import { STRING_FUNCTIONS_ENUM, FUNCTION_DETAIL, ODPS_FUNCTION_TYPE_ENUM } from './definitions';

export const STRING_FUNCTIONS: Record<STRING_FUNCTIONS_ENUM, FUNCTION_DETAIL> = {
  ASCII: {
    name: 'ASCII',
    simpleDesc: '返回字符串的第一个字符的ASCII码。',
    usageCommand: 'ascii(string <str>)',
    usageDesc: '返回字符串str第一个字符的ASCII码',
    paramDocs: [
      {
        label: 'str',
        desc:
          '必填。STRING类型。如果输入为BIGINT、DOUBLE、DECIMAL或DATETIME类型，则会隐式转换为STRING类型后参与运算。',
      },
    ],
    returnDesc:
      '返回BIGINT类型。返回规则如下：str非STRING、BIGINT、DOUBLE、DECIMAL或DATETIME类型时，返回报错。str值为NULL时，返回NULL。',
    example: "select ascii('abcde');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-i8s-84b-fux',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  CHAR_MATCHCOUNT: {
    name: 'CHAR_MATCHCOUNT',
    simpleDesc: '计算A字符串出现在B字符串中的字符个数。',
    usageCommand: 'char_matchcount(string <str1>, string <str2>)',
    usageDesc: '计算str1中有多少个字符出现在str2中',
    paramDocs: [
      {
        label: 'str1',
        desc:
          '必填。STRING类型，必须为有效的UTF-8字符串。如果对比过程中发现有无效字符（非UNICODE编码），则返回负值。',
      },
      {
        label: 'str2',
        desc:
          '必填。STRING类型，必须为有效的UTF-8字符串。如果对比过程中发现有无效字符（非UNICODE编码），则返回负值。',
      },
    ],
    returnDesc: '返回BIGINT类型。str1或str2值为NULL时，返回NULL。',
    example: "select char_matchcount('aabc','abcde');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-mnd-gvz-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: false,
  },
  CHR: {
    name: 'CHR',
    simpleDesc: '将指定ASCII码转换成字符。',
    usageCommand: 'chr(bigint <ascii>)',
    usageDesc: '将指定ASCII码转换为字符',
    paramDocs: [
      {
        label: 'ascii',
        desc:
          '必填。BIGINT类型的ASCII值。取值范围为0~128。如果输入为STRING、DOUBLE或DECIMAL类型，则会隐式转换为BIGINT类型后参与运算。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：ascii值不在取值范围内时，返回报错。ascii非BIGINT、STRING、DOUBLE或DECIMAL类型时，返回报错。ascii值为NULL时，返回NULL。',
    example: 'select chr(100);',
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-s5r-lwz-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  CONCAT: {
    name: 'CONCAT',
    simpleDesc: '将字符串连接在一起。',
    usageCommand: 'concat(array<T> <first>, array<T> <other>[,...])',
    usageDesc:
      '输入为ARRAY数组：将多个ARRAY数组中的所有元素连接在一起，生成一个新的ARRAY数组。 输入为字符串：将多个字符串连接在一起，生成一个新的字符串',
    paramDocs: [
      {
        label: 'first',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。a和b中元素的数据类型必须一致。数组中的元素为NULL值时会参与运算。',
      },
      {
        label: 'other',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。a和b中元素的数据类型必须一致。数组中的元素为NULL值时会参与运算。',
      },
    ],
    returnDesc:
      '返回ARRAY类型。如果任一输入ARRAY数组为NULL，返回结果为NULL。返回STRING类型。如果没有参数或任一参数为NULL，返回结果为NULL。',
    example: 'select concat(array(10, 20), array(20, -20));',
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-szv-n0t-3an',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  CONCAT_WS: {
    name: 'CONCAT_WS',
    simpleDesc: '将参数中的所有字符串按照指定的分隔符连接在一起。',
    usageCommand: 'string concat_ws(string <separator>, string <str1>, string <str2>[,...])',
    usageDesc:
      '返回将参数中的所有字符串或ARRAY数组中的元素按照指定的分隔符连接在一起的结果。此函数为MaxCompute 2.0扩展函数',
    paramDocs: [
      {
        label: 'separator',
        desc: '必填。STRING类型的分隔符。',
      },
      {
        label: 'str1',
        desc:
          '至少要指定2个字符串。STRING类型。如果输入为BIGINT、DECIMAL、DOUBLE或DATETIME类型，则会隐式转换为STRING类型后参与运算。',
      },
      {
        label: 'str2',
        desc:
          '至少要指定2个字符串。STRING类型。如果输入为BIGINT、DECIMAL、DOUBLE或DATETIME类型，则会隐式转换为STRING类型后参与运算。',
      },
    ],
    returnDesc:
      '返回STRING类型或STRUCT类型。返回规则如下：str1或str2非STRING、BIGINT、DECIMAL、DOUBLE或DATETIME类型时，返回报错。如果没有输入参数或任一输入参数值为NULL，返回NULL。',
    example: "select concat_ws(':','name','hanmeimei');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-xnf-sj1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  ENCODE: {
    name: 'ENCODE',
    simpleDesc: '将字符串按照指定编码格式编码。',
    usageCommand: 'encode(string <str>, string <charset>)',
    usageDesc: '将str按照charset格式进行编码',
    paramDocs: [
      {
        label: 'str',
        desc: '必填。STRING类型。待重新编码的字符串。',
      },
      {
        label: 'charset',
        desc:
          '必填。STRING类型。编码格式。取值范围为：UTF-8、UTF-16、UTF-16LE、UTF-16BE、ISO-8859-1、US-ASCII',
      },
    ],
    returnDesc: '返回BINARY类型。str或charset值为NULL时，返回NULL。',
    example: 'select encode("abc", "UTF-8");',
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-1lr-sd9-05c',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  FIND_IN_SET: {
    name: 'FIND_IN_SET',
    simpleDesc: '在以逗号分隔的字符串中查找指定字符串的位置。',
    usageCommand: 'find_in_set(string <str1>, string <str2>)',
    usageDesc: '查找字符串str1在以逗号（,）分隔的字符串str2中的位置，从1开始计数',
    paramDocs: [
      {
        label: 'str1',
        desc: '必填。STRING类型。待查找的字符串。',
      },
      {
        label: 'str2',
        desc: '必填。STRING类型。以逗号（,）分隔的字符串。',
      },
    ],
    returnDesc:
      '返回BIGINT类型。返回规则如下：当str2中无法匹配到str1或str1中包含逗号（,）时，返回0。当str1或str2值为NULL时，返回NULL。',
    example: "select find_in_set('ab', 'abc,hello,ab,c');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-lb5-wjy-vtt',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  FORMAT_NUMBER: {
    name: 'FORMAT_NUMBER',
    simpleDesc: '将数字转化为指定格式的字符串。',
    usageCommand: 'format_number(float|double|decimal <expr1>, int <expr2>)',
    usageDesc: '将expr1转化为满足expr2格式的字符串',
    paramDocs: [
      {
        label: 'expr1',
        desc: '必填。FLOAT、DOUBLE、DECIMAL类型。需要格式化的数据。',
      },
      {
        label: 'expr2',
        desc:
          '必填。INT类型，取值范围为0~340。指代需要保留的小数位数。也可以为类似#,###,###.##格式的描述。不同取值返回的小数位数不同。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：当0<expr2≤340时，四舍五入到小数点后指定位数。当expr2=0时，只保留整数，无小数点或小数部分。当expr2<0或expr2>340时，会返回报错。expr1或expr2值为空或NULL时，返回NULL。',
    example: 'select format_number(5.230134523424545456,3);',
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-hia-g4n-z7l',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  FROM_JSON: {
    name: 'FROM_JSON',
    simpleDesc: '根据给定的JSON字符串和输出格式信息，返回ARRAY、MAP或STRUCT类型。',
    usageCommand: 'from_json(<jsonStr>, <schema>)',
    usageDesc: '根据JSON字符串jsonStr和schema信息，返回ARRAY、MAP或STRUCT类型',
    paramDocs: [
      {
        label: 'jsonStr',
        desc: '必填。STRING类型。待解析的JSON字符串。',
      },
      {
        label: 'schema',
        desc:
          '必填。写法与建表语句的类型一致。例如array<bigint>、map<string, array<string>>或struct<a:int, b:double, `C`:map<string,string>>。',
      },
    ],
    returnDesc: '返回ARRAY、MAP或STRUCT类型。',
    example: `select from_json('{"a":1, "b":0.8}', 'a int, b double');`,
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-143-hgq-bc6',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: false,
  },
  GET_JSON_OBJECT: {
    name: 'GET_JSON_OBJECT',
    simpleDesc: '在一个标准JSON字符串中，按照指定方式抽取指定的字符串。',
    usageCommand: 'get_json_object(string <json>, string <path>)',
    usageDesc:
      '在一个标准JSON字符串中，按照path抽取指定的字符串。每次调用该函数时，都会读一次原始数据，因此反复调用可能影响性能和产生费用。您可以通过get_json_object，结合UDTF，轻松转换JSON格式日志数据，避免多次调用函数，详情请参见利用MaxCompute内建函数及UDTF转换JSON格式日志数据',
    paramDocs: [
      {
        label: 'json',
        desc: `必填。STRING类型。标准的JSON格式对象，格式为{Key:Value, Key:Value,...}。如果遇到英文双引号（"），需要用两个反斜杠（\\\\）进行转义。如果遇到英文单引号（'），需要用一个反斜杠（\\）进行转义。`,
      },
      {
        label: 'path',
        desc: '必填。STRING类型。表示在json中的path，以$开头。',
      },
    ],
    returnDesc:
      '如果json为空或非法的json格式，返回NULL。如果json合法，path也存在，则返回对应字符串。',
    example: `select get_json_object('{"b":"1","a":"2"}', '$');`,
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-mqf-tp0-h7s',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  INSTR: {
    name: 'INSTR',
    simpleDesc: '计算A字符串在B字符串中的位置。',
    usageCommand:
      'instr(string <str1>, string <str2>[, bigint <start_position>[, bigint <nth_appearance>]])',
    usageDesc: '计算子串str2在字符串str1中的位置',
    paramDocs: [
      {
        label: 'str1',
        desc:
          '必填。STRING类型。待搜索的目标字符串。如果输入为BIGINT、DOUBLE、DECIMAL或DATETIME类型，则会隐式转换为STRING类型后参与运算，其他类型会返回报错。',
      },
      {
        label: 'str2',
        desc:
          '必填。STRING类型。待匹配的子串。如果输入为BIGINT、DOUBLE、DECIMAL或DATETIME类型，则会隐式转换为STRING类型后参与运算，其他类型会返回报错。',
      },
      {
        label: 'start_position',
        desc:
          '可选。BIGINT类型，其他类型会返回报错。表示从str1的第几个字符开始搜索，默认起始位置是第一个字符位置1。当start_position为负数时表示开始位置是从字符串的结尾往前倒数，最后一个字符是-1，依次往前倒数。',
      },
      {
        label: 'nth_appearance',
        desc:
          '可选。BIGINT类型，大于0。表示str2在str1中第nth_appearance次匹配的位置。如果nth_appearance为其他类型或小于等于0，则返回报错。',
      },
    ],
    returnDesc: `返回BIGINT类型。返回规则如下：如果在str1中未找到str2，则返回0。如果str2为空串，则总能匹配成功，例如select instr('abc','');会返回1。str1、str2、start_position或nth_appearance值为NULL时，返回NULL。`,
    example: "select instr('Tech on the net', 'e');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-vft-yxz-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  IS_ENCODING: {
    name: 'IS_ENCODING',
    simpleDesc: '判断字符串是否可以从指定的A字符集转换为B字符集。',
    usageCommand: 'is_encoding(string <str>, string <from_encoding>, string <to_encoding>)',
    usageDesc:
      '判断输入的字符串str是否可以从指定的一个字符集from_encoding转为另一个字符集to_en…为UTF-8，to_encoding设为GBK',
    paramDocs: [
      {
        label: 'str',
        desc: '必填。STRING类型。空字符串可以被认为属于任何字符集。',
      },
      {
        label: 'from_encoding',
        desc: '必填。STRING类型，源字符集。',
      },
      {
        label: 'to_encoding',
        desc: '必填。STRING类型，目标字符集。',
      },
    ],
    returnDesc:
      '返回BOOLEAN类型。返回规则如下：如果str能够成功转换，则返回True，否则返回False。str、from_encoding或to_encoding值为NULL时，返回NULL。',
    example: "select is_encoding('测试', 'utf-8', 'gbk');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-qdj-kyz-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: false,
  },
  KEYVALUE: {
    name: 'KEYVALUE',
    simpleDesc: '将字符串拆分为Key-Value对，并将Key-Value对分开，返回Key对应的Value。',
    usageCommand: 'keyvalue(string <str>,[string <split1>,string <split2>,] string <key>)',
    usageDesc:
      '将字符串str按照split1分成Key-Value对，并按split2将Key-Value对分开，返回key所对应的Value',
    paramDocs: [
      {
        label: 'str',
        desc: '必填。STRING类型。待拆分的字符串。',
      },
      {
        label: 'split1',
        desc:
          '可选。STRING类型。用于作为分隔符的字符串，按照指定的两个分隔符拆分源字符串。如果表达式中没有指定这两项，默认split1为";"，split2为":"。当某个被split1拆分后的字符串中有多个split2时，返回结果未定义。',
      },
      {
        label: 'split2',
        desc:
          '可选。STRING类型。用于作为分隔符的字符串，按照指定的两个分隔符拆分源字符串。如果表达式中没有指定这两项，默认split1为";"，split2为":"。当某个被split1拆分后的字符串中有多个split2时，返回结果未定义。',
      },
      {
        label: 'key',
        desc: '必填。STRING类型。将字符串按照split1和split2拆分后，返回key值对应的Value。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：split1或split2值为NULL时，返回NULL。str或key值为NULL或没有匹配的key时，返回NULL。如果有多个Key-Value匹配，返回第一个匹配上的key对应的Value',
    example: `select keyvalue('0:1\;1:2', 1);`,
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-lnq-tyz-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: false,
  },
  KEYVALUE_TUPLE: {
    name: 'KEYVALUE_TUPLE',
    simpleDesc: '将字符串拆分为多个Key-Value对，并将Key-Value对分开，返回多个Key对应的Value。',
    usageCommand: 'KEYVALUE_TUPLE(str, split1, split2, key1, key2, ..., keyN)',
    usageDesc:
      '将字符串str按照split1分成Key-Value对，并按split2将Key-Value对分开，返回多个key所对应的Value',
    paramDocs: [
      {
        label: 'str',
        desc: '必填。STRING类型。待拆分的字符串。',
      },
      {
        label: 'split1',
        desc:
          '必填。STRING类型。用于作为分隔符的字符串，按照指定的两个分隔符拆分源字符串。当某个被split1拆分后的字符串中有多个split2时，返回结果未定义。',
      },
      {
        label: 'split2',
        desc:
          '必填。STRING类型。用于作为分隔符的字符串，按照指定的两个分隔符拆分源字符串。当某个被split1拆分后的字符串中有多个split2时，返回结果未定义。',
      },
      {
        label: 'key',
        desc: '必填。STRING类型。将字符串按照split1和split2拆分后，返回key值对应的Value。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：split1或split2值为NULL时，返回NULL。str或key值为NULL或没有匹配的key时，返回NULL。',
    example: `SELECT user_id,age,genda,address FROM mf_user LATERAL VIEW KEYVALUE_TUPLE(user_info,';', ':','age','genda','address') ui AS age,genda,address;`,
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-cwa-5c1-642',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  LENGTH: {
    name: 'LENGTH',
    simpleDesc: '计算字符串的长度。',
    usageCommand: 'length(string <str>)',
    usageDesc: '计算字符串str的长度',
    paramDocs: [
      {
        label: 'str',
        desc:
          '必填。STRING类型。如果输入为BIGINT、DOUBLE、DECIMAL或DATETIME类型，则会隐式转换为STRING类型后参与运算。',
      },
    ],
    returnDesc:
      '返回BIGINT类型。返回规则如下：str非STRING、BIGINT、DOUBLE、DECIMAL或DATETIME类型时，返回报错。str值为NULL时，返回NULL。str为非UTF-8编码格式时，返回-1。',
    example: "select length('Tech on the net');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-ewt-jzz-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  LENGTHB: {
    name: 'LENGTHB',
    simpleDesc: '计算字符串以字节为单位的长度。',
    usageCommand: 'lengthb(string <str>)',
    usageDesc: '计算字符串str以字节为单位的长度',
    paramDocs: [
      {
        label: 'str',
        desc:
          '必填。STRING类型。如果输入为BIGINT、DOUBLE、DECIMAL或DATETIME类型，则会隐式转换为STRING类型后参与运算。',
      },
    ],
    returnDesc:
      '返回BIGINT类型。返回规则如下：str非STRING、BIGINT、DOUBLE、DECIMAL或DATETIME类型时，返回报错。str值为NULL时，返回NULL。',
    example: "select lengthb('Tech on the net');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-o3y-pzz-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  LOCATE: {
    name: 'LOCATE',
    simpleDesc: '在字符串中查找另一指定字符串的位置。',
    usageCommand: 'locate(string <substr>, string <str>[, bigint <start_pos>])',
    usageDesc: '在str中查找substr的位置。您可以通过start_pos指定开始查找的位置，从1开始计数',
    paramDocs: [
      {
        label: 'substr',
        desc: '必填。STRING类型。待查找的字符串。',
      },
      {
        label: 'str',
        desc: '必填。STRING类型。待匹配的字符串。',
      },
      {
        label: 'start_pos',
        desc: '可选。BIGINT类型。指定查找的起始位置。',
      },
    ],
    returnDesc:
      '返回为BIGINT类型。返回规则如下：str中无法匹配到substr时，返回0。str或substr值为NULL时，返回NULL。start_pos值为NULL时，返回0。',
    example: "select locate('ab', 'abchelloabc');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-8r9-nzm-7ry',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  LTRIM: {
    name: 'LTRIM',
    simpleDesc: '去除字符串的左端字符。',
    usageCommand: 'ltrim(string <str>[, <trimChars>])',
    usageDesc:
      '从str的左端去除字符：如果未指定trimChars，则默认去除空格字符。如果指定了trimChars，则以trimChars中包含的字符作为一个集合，从str的左端去除尽可能长的所有字符都在集合trimChars中的子串',
    paramDocs: [
      {
        label: 'str',
        desc:
          '必填。STRING类型。待去除左端字符的字符串。如果输入为BIGINT、DECIMAL、DOUBLE或DATETIME类型，则会隐式转换为STRING类型后参与运算。',
      },
      {
        label: 'trimChars',
        desc: '可选。String类型。待去除的字符。',
      },
    ],
    returnDesc:
      '返回为STRING类型。返回规则如下：str非STRING、BIGINT、DOUBLE、DECIMAL或DATETIME类型时，返回报错。str或trimChars值为NULL时，返回NULL。',
    example: "select ltrim(' yxTxyomxx ');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-ete-j9a-onl',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  MD5: {
    name: 'MD5',
    simpleDesc: '计算字符串的MD5值。',
    usageCommand: 'md5(string <str>)',
    usageDesc: '计算字符串str的MD5值',
    paramDocs: [
      {
        label: 'str',
        desc:
          '必填。STRING类型。如果输入为BIGINT、DOUBLE、DECIMAL或DATETIME类型，则会隐式转换为STRING类型参与运算。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：str非STRING、BIGINT、DOUBLE、DECIMAL或DATETIME类型时，返回报错。str值为NULL时，返回NULL。',
    example: "select md5('Tech on the net');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-hbw-xzz-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  PARSE_URL: {
    name: 'PARSE_URL',
    simpleDesc: '对URL进行解析返回指定部分的信息。',
    usageCommand: 'parse_url(string <url>, string <part>[, string <key>])',
    usageDesc: '对url解析后，按照part提取信息',
    paramDocs: [
      {
        label: 'url',
        desc: '必填。STRING类型。URL链接。无效URL链接会返回报错。',
      },
      {
        label: 'part',
        desc:
          '必填。STRING类型。取值包含：HOST、PATH、QUERY、REF、PROTOCOL、AUTHORITY、FILE和USERINFO，不区分大小写。',
      },
      {
        label: 'key',
        desc: '可选。当part取值为QUERY时，根据key值取出对应的Value值。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：url、part或key值为NULL时，返回NULL。part取值不符合要求时，返回报错。',
    example:
      "select parse_url('file://username:password@example.com:8042/over/there/index.dtb?type=animal&name=narwhal#nose', 'HOST');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-x6p-fbt-3ep',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  PARSE_URL_TUPLE: {
    name: 'PARSE_URL_TUPLE',
    simpleDesc: '对URL进行解析返回多个部分的信息。',
    usageCommand: 'parse_url_tuple(string <url>, string <key1>, string <key2>,...)',
    usageDesc:
      '对url解析后，按照输入的一组键key1、key2等抽取各个键指定的字符串。该功能与PARSE_UR…，但它可以同时提取多个键对应的字符串，性能更优',
    paramDocs: [
      {
        label: 'url',
        desc: '必填。STRING类型。URL链接。无效URL链接会返回报错。',
      },
      {
        label: 'key1',
        desc: '必填。STRING类型。指定要抽取的键。',
      },
      {
        label: 'key2',
        desc: '必填。STRING类型。指定要抽取的键。',
      },
    ],
    returnDesc: '返回STRING类型。url或key值为NULL时，返回报错。',
    example:
      "select parse_url_tuple('file://username:password@example.com:8042/over/there/index.dtb?type=animal&name=narwhal#nose', 'HOST', 'PATH', 'QUERY', 'REF', 'PROTOCOL', 'AUTHORITY', 'FILE', 'USERINFO', 'QUERY:type', 'QUERY:name') as (item0, item1, item2, item3, item4, item5, item6, item7, item8, item9);",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-y37-hco-z7r',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  REGEXP_COUNT: {
    name: 'REGEXP_COUNT',
    simpleDesc: '计算字符串从指定位置开始，匹配指定规则的子串数。',
    usageCommand: 'regexp_count(string <source>, string <pattern>[, bigint <start_position>])',
    usageDesc: '计算source中从start_position位置开始，匹配指定pattern的子串数',
    paramDocs: [
      {
        label: 'source',
        desc: '必填。STRING类型。待搜索的字符串，其他类型会返回报错。',
      },
      {
        label: 'pattern',
        desc:
          '必填。STRING类型常量或正则表达式。待匹配的模型。更多正则表达式编写规范，请参见正则表达式规范。pattern为空串或其他类型时返回报错。',
      },
      {
        label: 'start_position',
        desc:
          '可选。BIGINT类型常量，必须大于0。其他类型或值小于等于0时返回报错。不指定时默认为1，表示从source的第一个字符开始匹配。',
      },
    ],
    returnDesc:
      '返回BIGINT类型。返回规则如下：如果没有匹配成功，返回0。source、pattern或start_position值为NULL时，返回NULL。',
    example: "select regexp_count('abababc', 'a.c');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-ctz-0l2-qyd',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: false,
  },
  REGEXP_EXTRACT: {
    name: 'REGEXP_EXTRACT',
    simpleDesc: '将字符串按照指定规则拆分为组后，返回指定组的字符串。',
    usageCommand: 'regexp_extract(string <source>, string <pattern>[, bigint <groupid>])',
    usageDesc:
      '将字符串source按照pattern的分组规则进行字符串匹配，返回第groupid个组匹配到的字符串内容',
    paramDocs: [
      {
        label: 'source',
        desc: '必填。STRING类型，待拆分的字符串。',
      },
      {
        label: 'pattern',
        desc:
          '必填。STRING类型常量或正则表达式。待匹配的模型。更多正则表达式编写规范，请参见正则表达式规范。',
      },
      {
        label: 'groupid',
        desc: '可选。BIGINT类型常量，必须大于等于0。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下： 如果pattern为空串或pattern中没有分组，返回报错。 groupid非BIGINT类型或小于0时，返回报错。不指定时默认为1，表示返回第一个组。如果groupid等于0，则返回满足整个pattern的子串。 source、pattern或groupid值为NULL时，返回NULL。',
    example: "select regexp_extract('foothebar', 'foo(.*?)(bar)');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-ms1-lc1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  REGEXP_INSTR: {
    name: 'REGEXP_INSTR',
    simpleDesc: '返回字符串从指定位置开始，与指定规则匹配指定次数的子串的起始或结束位置。',
    usageCommand:
      'regexp_instr(string <source>, string <patte… bigint <occurrence>[, bigint <return_option>]]])',
    usageDesc:
      '计算字符串source从start_position开始，与pattern第occurrence次匹配的子串的起始或结束位置',
    paramDocs: [
      {
        label: 'source',
        desc: '必填。STRING类型。源字符串。',
      },
      {
        label: 'pattern',
        desc:
          '必填。STRING类型常量或正则表达式。待匹配的模型。更多正则表达式编写规范，请参见正则表达式规范。pattern为空串时返回报错。',
      },
      {
        label: 'start_position',
        desc: '可选。BIGINT类型常量。搜索的开始位置。不指定时默认值为1。',
      },
      {
        label: 'occurrence',
        desc: '可选。BIGINT类型常量。指定匹配次数，不指定时默认值为1，表示搜索第一次出现的位置。',
      },
      {
        label: 'return_option',
        desc:
          '可选。BIGINT类型常量。指定返回的位置。值为0或1，不指定时默认值为0，其他类型或不允许的值会返回报错。0表示返回匹配的开始位置，1表示返回匹配的结束位置。',
      },
    ],
    returnDesc:
      '返回BIGINT类型。return_option指定匹配的子串在source中的开始或结束位置。返回规则如下：如果pattern为空串，返回报错。start_position或occurrence非BIGINT类型或小于等于0时，返回报错。source、pattern、start_position、occurrence或return_option值为NULL时，返回NULL。',
    example: "select regexp_instr('i love www.taobao.com', 'o[[:alpha:]]{1}', 3, 2);",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-jpn-5c1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: false,
  },
  REGEXP_REPLACE: {
    name: 'REGEXP_REPLACE',
    simpleDesc: '将字符串中，与指定规则在指定次数匹配的子串替换为另一字符串。',
    usageCommand:
      'regexp_replace(string <source>, string <pat…, string <replace_string>[, bigint <occurrence>])',
    usageDesc:
      '将source字符串中第occurrence次匹配pattern的子串替换成指定字符串replace_string后返回结果字符串',
    paramDocs: [
      {
        label: 'source',
        desc: '必填。STRING类型。源字符串。',
      },
      {
        label: 'pattern',
        desc:
          '必填。STRING类型常量或正则表达式。待匹配的模型。更多正则表达式编写规范，请参见正则表达式规范。pattern为空串时返回报错。',
      },
      {
        label: 'replace_string',
        desc: '必填。STRING类型常量。替换字符串。',
      },
      {
        label: 'occurrence',
        desc: '可选。BIGINT类型常量。指定匹配次数，不指定时默认值为1，表示搜索第一次出现的位置。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：当引用不存在的组时，不进行替换。如果replace_string值为NULL且pattern有匹配，返回NULL。如果replace_string值为NULL但pattern不匹配，返回原字符串。source、pattern或occurrence值为NULL时，返回NULL。',
    example: "select regexp_replace('abcd', '(.)', '\\\\1 ', 0);",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-k2w-2d1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  REGEXP_SUBSTR: {
    name: 'REGEXP_SUBSTR',
    simpleDesc: '返回字符串中，从指定位置开始，与指定规则匹配指定次数的子串。',
    usageCommand:
      'regexp_substr(string <source>, string <patt… bigint <start_position>[, bigint <occurrence>]])',
    usageDesc: '返回从start_position位置开始，source中第occurrence次匹配指定pattern的子串',
    paramDocs: [
      {
        label: 'source',
        desc: '必填。STRING类型。源字符串。',
      },
      {
        label: 'pattern',
        desc:
          '必填。STRING类型常量或正则表达式。待匹配的模型。更多正则表达式编写规范，请参见正则表达式规范。pattern为空串时返回报错。',
      },
      {
        label: 'start_position',
        desc:
          '可选。其他BIGINT常量，必须大于0。不指定时默认为1，表示从source的第一个字符开始匹配。',
      },
      {
        label: 'occurrence',
        desc: '可选。BIGINT类型常量。指定匹配次数，不指定时默认值为1，表示搜索第一次出现的位置。',
      },
    ],
    returnDesc: `返回STRING类型。返回规则如下：如果pattern为空串，返回报错。没有匹配时，返回NULL。start_position或occurrence非BIGINT类型或小于等于0时，返回报错。source、pattern、start_position、occurrence或return_option值为NULL时，返回NULL。`,
    example: "select regexp_substr('I love aliyun very much', 'a[[:alpha:]]{5}');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-k5b-qd1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: false,
  },
  REPEAT: {
    name: 'REPEAT',
    simpleDesc: '返回将字符串重复指定次数后的结果。',
    usageCommand: 'repeat(string <str>, bigint <n>)',
    usageDesc: '返回将str重复n次后的字符串',
    paramDocs: [
      {
        label: 'str',
        desc:
          '必填。STRING类型。如果输入为BIGINT、DOUBLE、DECIMAL或DATETIME类型，则会隐式转换为STRING类型后参与运算。',
      },
      {
        label: 'n',
        desc: '必填。BIGINT类型。长度不超过2 MB。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：str非STRING、BIGINT、DOUBLE、DECIMAL或DATETIME类型时，返回报错。n为空时，返回报错。str或n值为NULL时，返回NULL。',
    example: "select repeat('abc', null);",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-dyt-hgm-1z7',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  REVERSE: {
    name: 'REVERSE',
    simpleDesc: '返回倒序字符串。',
    usageCommand: 'reverse(string <str>)',
    usageDesc: '返回倒序字符串',
    paramDocs: [
      {
        label: 'str',
        desc:
          '必填。STRING类型。如果输入为BIGINT、DOUBLE、DECIMAL或DATETIME类型，则会隐式转换为STRING类型后参与运算。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：str非STRING、BIGINT、DOUBLE、DECIMAL或DATETIME类型时，返回报错。str值为NULL时，返回NULL。',
    example: "select reverse('I love aliyun very much');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-9yy-9kb-94l',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  RTRIM: {
    name: 'RTRIM',
    simpleDesc: '去除字符串的右端字符。',
    usageCommand: 'rtrim(string <str>[, <trimChars>])',
    usageDesc:
      '从str的右端去除字符：如果未指定trimChars，则默认去除空格字符。如果指定了trimChars，则以trimChars中包含的字符作为一个集合，从str的右端去除尽可能长的所有字符都在集合trimChars中的子串',
    paramDocs: [
      {
        label: 'str',
        desc:
          '必填。STRING类型。待去除右端字符的字符串。如果输入为BIGINT、DECIMAL、DOUBLE或DATETIME类型，则会隐式转换为STRING类型后参与运算。',
      },
      {
        label: 'trimChars',
        desc: '可选。String类型。待去除的字符。',
      },
    ],
    returnDesc:
      '返回为STRING类型。返回规则如下：str非STRING、BIGINT、DOUBLE、DECIMAL或DATETIME类型时，返回报错。str或trimChars值为NULL时，返回NULL。',
    example: "select rtrim(' yxTxyomxx ');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-imh-j3t-whc',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  SPACE: {
    name: 'SPACE',
    simpleDesc: '生成空格字符串。',
    usageCommand: 'space(bigint <n>)',
    usageDesc: '生成空格字符串，长度为n',
    paramDocs: [
      {
        label: 'n',
        desc: '必填。BIGINT类型。长度不超过2 MB。',
      },
    ],
    returnDesc: '返回STRING类型。返回规则如下：n为空时，返回报错。n值为NULL时，返回NULL。',
    example: 'select length(space(10));',
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-899-dqw-ffv',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  SPLIT_PART: {
    name: 'SPLIT_PART',
    simpleDesc: '按照分隔符拆分字符串，返回指定部分的子串。',
    usageCommand: 'split_part(string <str>, string <separator>, bigint <start>[, bigint <end>])',
    usageDesc: '依照分隔符separator拆分字符串str，返回从start部分到end部分的子串（闭区间）',
    paramDocs: [
      {
        label: 'str',
        desc:
          '必填。STRING类型。待拆分的字符串。如果是BIGINT、DOUBLE、DECIMAL或DATETIME类型，则会隐式转换为STRING类型后参与运算。',
      },
      {
        label: 'separator',
        desc: '必填。STRING类型常量。拆分用的分隔符，可以是一个字符，也可以是一个字符串。',
      },
      {
        label: 'start',
        desc: '必填。BIGINT类型常量，必须大于0。表示返回段的开始编号（从1开始）。',
      },
      {
        label: 'end',
        desc:
          'BIGINT类型常量，大于等于start。表示返回段的截止编号，可省略，缺省时表示和start取值相等，返回start指定的段。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：如果start的值大于切分后实际的分段数，例如字符串拆分完有6个片段，start大于6，返回空串。如果separator不存在于str中，且start指定为1，返回整个str。如果str为空串，则输出空串。如果separator为空串，则返回原字符串str。如果end大于片段个数，返回从start开始的子串。str非STRING、BIGINT、DOUBLE、DECIMAL或DATETIME类型时，返回报错。separator非STRING类型常量时，返回报错。start或end非BIGINT类型常量时，返回报错。除separator外，如果任一参数值为NULL，返回NULL。',
    example: "select split_part('a,b,c,d', ',', 1);",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-ecy-k21-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: false,
  },
  SUBSTR: {
    name: 'SUBSTR',
    simpleDesc: '返回STRING类型字符串从指定位置开始，指定长度的子串。',
    usageCommand: 'substr(string <str>, bigint <start_position>[, bigint <length>])',
    usageDesc: '返回字符串str从start_position开始，长度为length的子串',
    paramDocs: [
      {
        label: 'str',
        desc:
          '必填。STRING类型。如果输入为BIGINT、DECIMAL、DOUBLE或DATETIME类型，则会隐式转换为STRING类型后参与运算。',
      },
      {
        label: 'start_position',
        desc: '必填。BIGINT类型，默认起始位置为1。',
      },
      {
        label: 'length',
        desc: '可选。BIGINT类型，表示子串的长度值。值必须大于0。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：str非STRING、BIGINT、DECIMAL、DOUBLE或DATETIME类型时，返回报错。length非BIGINT类型或值小于等于0时，返回报错。当length被省略时，返回到str结尾的子串。str、start_position或length值为NULL时，返回NULL。',
    example: "select substr('abc', 2);",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-nkj-1f1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  SUBSTRING: {
    name: 'SUBSTRING',
    simpleDesc: '返回STRING或BINARY类型字符串从指定位置开始，指定长度的子串。',
    usageCommand: 'substring(string|binary <str>, int <start_position>[, int <length>])',
    usageDesc: '返回字符串str从start_position开始，长度为length的子串',
    paramDocs: [
      {
        label: 'str',
        desc: '必填。STRING或BINARY类型。',
      },
      {
        label: 'start_position',
        desc:
          '必填。INT类型，起始位置为1。当start_position为0时，返回空串。当start_position为负数时，表示开始位置是从字符串的结尾往前倒数，最后一个字符是-1，依次往前倒数。',
      },
      {
        label: 'length',
        desc: '可选。BIGINT类型，表示子串的长度值。值必须大于0。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：str非STRING或BINARY类型时，返回报错。length非BIGINT类型或值小于等于0时，返回报错。当length被省略时，返回到str结尾的子串。str、start_position或length值为NULL时，返回NULL。',
    example: "select substring('abc', 2);",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-s1h-3f1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  TO_CHAR: {
    name: 'TO_CHAR',
    simpleDesc: '将BOOLEAN、BIGINT、DECIMAL或DOUBLE类型值转为对应的STRING类型表示。',
    usageCommand: 'to_char(boolean | bigint | decimal | double <value>)',
    usageDesc: '将BOOLEAN、BIGINT、DECIMAL或DOUBLE类型值转换为对应的STRING类型表示',
    paramDocs: [
      {
        label: 'value',
        desc: '必填。BOOLEAN、BIGINT、DECIMAL或DOUBLE类型。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：value非BOOLEAN、BIGINT、DECIMAL或DOUBLE类型时，返回报错。value值为NULL时，返回NULL。',
    example: 'select to_char(123);',
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-mdh-lbk-ggy',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: false,
  },
  TO_JSON: {
    name: 'TO_JSON',
    simpleDesc: '将指定的复杂类型输出为JSON字符串。',
    usageCommand: 'to_json(<expr>)',
    usageDesc: '将给定的复杂类型expr，以JSON字符串格式输出',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。ARRAY、MAP、STRUCT复杂类型。',
      },
    ],
    returnDesc: '返回 JSON 字符串。',
    example: "select to_json(named_struct('a', 1, 'b', 2));",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-vs9-tlq-6e3',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: false,
  },
  TOLOWER: {
    name: 'TOLOWER',
    simpleDesc: '将字符串中的英文字符转换为小写形式。',
    usageCommand: 'tolower(string <source>)',
    usageDesc: '将字符串source中的大写字符转换为对应的小写字符',
    paramDocs: [
      {
        label: 'source',
        desc:
          '必填。STRING类型。如果输入为BIGINT、DOUBLE、DECIMAL或DATETIME类型，则会隐式转换为STRING类型后参与运算。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：source非STRING、BIGINT、DOUBLE、DECIMAL或DATETIME类型时，返回报错。source值为NULL时，返回NULL。',
    example: "select tolower('aBcd');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-nzz-lg1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  TOUPPER: {
    name: 'TOUPPER',
    simpleDesc: '将字符串中的英文字符转换为大写形式。',
    usageCommand: 'toupper(string <source>)',
    usageDesc: '将字符串source中的小写字符转换为对应的大写字符',
    paramDocs: [
      {
        label: 'source',
        desc:
          '必填。STRING类型。如果输入为BIGINT、DOUBLE、DECIMAL或DATETIME类型，则会隐式转换为STRING类型后参与运算。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：source非STRING、BIGINT、DOUBLE、DECIMAL或DATETIME类型时，返回报错。source值为NULL时，返回NULL。',
    example: "select toupper('aBcd');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-qvg-sg1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  TRIM: {
    name: 'TRIM',
    simpleDesc: '去除字符串的左右两端字符。',
    usageCommand: 'trim(string <str>[,<trimChars>])',
    usageDesc:
      '从str的左右两端去除字符：如果未指定trimChars，则默认去除空格字符。如果指定了trimChars，则以trimChars中包含的字符作为一个集合，从str的左右两端去除尽可能长的所有字符都在集合trimChars中的子串',
    paramDocs: [
      {
        label: 'str',
        desc:
          '必填。STRING类型。待去除左右两端字符的字符串。如果输入为BIGINT、DECIMAL、DOUBLE或DATETIME类型，则会隐式转换为STRING类型后参与运算。',
      },
      {
        label: 'trimChars',
        desc: '可选。String类型。待去除的字符。',
      },
    ],
    returnDesc:
      '返回为STRING类型。返回规则如下：str非STRING、BIGINT、DOUBLE、DECIMAL或DATETIME类型时，返回报错。str或trimChars值为NULL时，返回NULL',
    example: "select trim(' yxTxyomxx ');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-mf1-3h1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  URL_DECODE: {
    name: 'URL_DECODE',
    simpleDesc: '将字符串从 MIME 格式转为常规字符。',
    usageCommand: 'url_decode(string <input>[, string <encoding>])',
    usageDesc:
      '将输入字符串从application/x-www-form-urlencoded MIME格式转为常规字符串，是url_encode的逆过程。编码规则如下： a~z、A~Z保持不变。 英文句点（.）、短划线（-）、星号（*）和下划线（_）保持不变。  加号（+）转为空格。  %xy格式的序列转为对应的字节值，连续的字节值根据输入的encoding名称解码为对应的字符串。 其余的字符保持不变',
    paramDocs: [
      {
        label: 'input',
        desc: '必填。STRING类型。要输入的字符串。',
      },
      {
        label: 'encoding',
        desc: '可选。指定编码格式，支持GBK或UTF-8等标准编码格式，不输入默认为UTF-8。',
      },
    ],
    returnDesc: '返回STRING类型UTF-8编码的字符串。input或encoding值为NULL时，返回NULL。',
    example: "select url_decode('%E7%A4%BA%E4%BE%8Bfor+url_decode%3A%2F%2F+%28fdsf%29');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-hor-9cn-ovu',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: false,
  },
  URL_ENCODE: {
    name: 'URL_ENCODE',
    simpleDesc: '将字符串编码为 MIME 格式。',
    usageCommand: 'url_encode(string <input>[, string <encoding>])',
    usageDesc:
      '将输入字符串编码为application/x-www-form-urlencoded MIME格式。编码格式如下： a~z、A~Z保持不变。 英文句点（.）、短划线（-）、星号（*）和下划线（_）保持不变。 空格转为加号（+）。 其余字符根据指定的encoding转为字节值，然后将每个字节值表示为%xy的格式，xy是该字符的十六进制表示方式',
    paramDocs: [
      {
        label: 'input',
        desc: '必填。STRING类型。要输入的字符串。',
      },
      {
        label: 'encoding',
        desc: '可选。指定编码格式，支持GBK或UTF-8等标准编码格式，不输入默认为UTF-8。',
      },
    ],
    returnDesc: '返回STRING类型。input或encoding值为NULL时，返回NULL。',
    example: "select url_encode('示例for url_encode:// (fdsf)');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-57t-23k-068',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: false,
  },
  JSON_TUPLE: {
    name: 'JSON_TUPLE',
    simpleDesc: '在一个标准的JSON字符串中，按照输入的一组键抽取各个键指定的字符串。',
    usageCommand: 'json_tuple(string <json>, string <key1>, string <key2>,...)',
    usageDesc: '用于一个标准的JSON字符串中，按照输入的一组键(key1,key2,...)抽取各个键指定的字符串',
    paramDocs: [
      {
        label: 'json',
        desc: '必填。STRING类型，标准的JSON格式字符串。',
      },
      {
        label: 'key',
        desc:
          "必填。STRING类型，用于描述在JSON中的path，一次可输入多个，不能以美元符号（$）开头。MaxCompute支持用.或['']这两种字符解析JSON，当JSON的Key本身包含.时，可以用['']来替代。",
      },
    ],
    returnDesc: '返回STRING类型。',
    example: 'select json_tuple(school.json,"SchoolRank","Class1") as (item0, item1) from school;',
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-x7u-vq2-w7w',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  LPAD: {
    name: 'LPAD',
    simpleDesc: '将字符串向左补足到指定位数。',
    usageCommand: 'lpad(string <str1>, int <length>, string <str2>)',
    usageDesc: '用字符串str2将字符串str1向左补足到length位。此函数为MaxCompute 2.0扩展函数',
    paramDocs: [
      {
        label: 'str1',
        desc: '必填。STRING类型。待向左补位的字符串。',
      },
      {
        label: 'length',
        desc: '必填。INT类型。向左补位位数。',
      },
      {
        label: 'str2',
        desc: '必填。用于补位的字符串。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：如果length小于str1的位数，则返回str1从左开始截取length位的字符串。如果length为0，则返回空串。如果没有输入参数或任一输入参数值为NULL，返回NULL。',
    example: "select lpad('abcdefgh', 10, '12');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-mcj-zj1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  RPAD: {
    name: 'RPAD',
    simpleDesc: '将字符串向右补足到指定位数。',
    usageCommand: 'rpad(string <str1>, int <length>, string <str2>)',
    usageDesc: '用字符串str2将字符串str1向右补足到length位。此函数为MaxCompute 2.0扩展函数',
    paramDocs: [
      {
        label: 'str1',
        desc: '必填。STRING类型。待向右补位的字符串。',
      },
      {
        label: 'length',
        desc: '必填。INT类型。向右补位位数。',
      },
      {
        label: 'str2',
        desc: '必填。用于补位的字符串。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：如果length小于str1的位数，则返回str1从左开始截取length位的字符串。如果length为0，则返回空串。如果没有输入参数或任一输入参数值为NULL，返回NULL。',
    example: "select rpad('abcdefgh', 10, '12');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-k1f-3k1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  REPLACE: {
    name: 'REPLACE',
    simpleDesc: '将字符串中与指定字符串匹配的子串替换为另一字符串。',
    usageCommand: 'replace(string <str>, string <old>, string <new>)',
    usageDesc:
      '用new字符串替换str字符串中与old字符串完全重合的部分并返回替换后的str。如果没有重合的字符…。此函数为MaxCompute 2.0扩展函数',
    paramDocs: [
      {
        label: 'str',
        desc: '必填。STRING类型。待替换的字符串。',
      },
      {
        label: 'old',
        desc: '必填。STRING类型。待比较的字符串。',
      },
      {
        label: 'new',
        desc: '必填。STRING类型。替换后的字符串。',
      },
    ],
    returnDesc: '返回STRING类型。如果任一输入参数值为NULL，返回NULL。',
    example: "select replace('ababab','abab','12');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-ln3-5k1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  SOUNDEX: {
    name: 'SOUNDEX',
    simpleDesc: '将普通字符串替换为SOUNDEX字符串。',
    usageCommand: 'soundex(string <str>)',
    usageDesc: '将普通字符串转换为SOUNDEX字符串',
    paramDocs: [
      {
        label: 'str',
        desc: '必填。STRING类型。待转换的字符串。',
      },
    ],
    returnDesc: '返回STRING类型。str值为NULL时，返回NULL。',
    example: "select soundex('hello');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-z2z-1l1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  SUBSTRING_INDEX: {
    name: 'SUBSTRING_INDEX',
    simpleDesc: '截取字符串指定分隔符前的字符串。',
    usageCommand: 'substring_index(string <str>, string <separator>, int <count>)',
    usageDesc:
      '截取字符串str第count个分隔符之前的字符串。如果count为正，则从左边开始截取。如果count为负，则从右边开始截取。此函数为MaxCompute 2.0扩展函数',
    paramDocs: [
      {
        label: 'str',
        desc: '必填。STRING类型。待截取的字符串。',
      },
      {
        label: 'separator',
        desc: '必填。STRING类型的分隔符。',
      },
      {
        label: 'count',
        desc: '必填。INT类型。指定分隔符位置。',
      },
    ],
    returnDesc: '返回STRING类型。如果任一输入参数值为NULL，返回NULL。',
    example: "select substring_index('https://help.aliyun.com', '.', 2);",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-uw3-hl1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  TRANSLATE: {
    name: 'TRANSLATE',
    simpleDesc: '将A出现在B中的字符串替换为C字符串。',
    usageCommand: 'translate(string|varchar <str1>, string|varchar <str2>, string|varchar <str3>)',
    usageDesc:
      '将str1出现在str2中的每个字符替换成str3中相对应的字符。无匹配则不替换。此函数为 MaxCompute 2.0扩展函数',
    paramDocs: [
      {
        label: 'str1',
        desc: '必填，STRING 类型',
      },
      {
        label: 'str2',
        desc: '必填，STRING 类型',
      },
      {
        label: 'str3',
        desc: '必填，STRING 类型',
      },
    ],
    returnDesc: '返回STRING类型。如果任一输入参数值为NULL，返回NULL。',
    example: "select translate('ababab','abab','cdefg');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-bk1-nl1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
  REGEXP_EXTRACT_ALL: {
    name: 'REGEXP_EXTRACT_ALL',
    simpleDesc:
      '在字符串中查找所有出现的正则表达式匹配的子字符串，并把找到的字符串以数组形式返回。',
    usageCommand: 'regexp_extract_all(string <source>, string <pattern>[,bigint <group_id>])',
    usageDesc: '在字符串中查找所有出现的正则表达式匹配模式的子字符串，并把找到的字符串以数组返回',
    paramDocs: [
      {
        label: 'source',
        desc: '必填。STRING类型。待分析的字符串。',
      },
      {
        label: 'pattern',
        desc: '必填。STRING类型。待匹配的模型，可以是STRING类型常量或正则表达式。',
      },
      {
        label: 'group_id',
        desc:
          '可选。BIGINT类型。返回指定组的所有匹配结果，必须大于等于0。如果不指定该值， 默认返回group_id为1的所有匹配结果；如果等于0，pattern将被当作一个整体进行匹配。',
      },
    ],
    returnDesc:
      '返回ARRAY类型。如果指定group_id, 返回该group_id匹配的所有结果组成的数组；如果不指定group_id， 则返回group_id为1的所有匹配结果组成的数组。',
    example: "SELECT regexp_extract_all('100-200, 300-400', '(\\\\d+)-(\\\\d+)');",
    docUrl: 'https://help.aliyun.com/document_detail/48973.html#section-9ar-8ix-qow',
    functionType: ODPS_FUNCTION_TYPE_ENUM.STRING,
    functionInHive: true,
  },
};
