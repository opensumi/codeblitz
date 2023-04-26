import { COMPLEX_FUNCTIONS_ENUM, FUNCTION_DETAIL, ODPS_FUNCTION_TYPE_ENUM } from './definitions';

export const COMPLEX_FUNCTIONS: Record<COMPLEX_FUNCTIONS_ENUM, FUNCTION_DETAIL> = {
  ALL_MATCH: {
    name: 'ALL_MATCH',
    simpleDesc: '判断ARRAY数组中是否所有元素都满足指定条件。',
    usageCommand: 'all_match(array<T> <list>, function<T, boolean> <predicate>)',
    usageDesc: '判断ARRAY数组a中是否所有元素都满足predicate条件。',
    paramDocs: [
      {
        label: 'list',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。',
      },
      {
        label: 'predicate',
        desc:
          '必填。用于对ARRAY数组list中的元素进行判断的函数（内建函数或自定义函数）或表达式。输入参数的数据类型必须与ARRAY数组list中元素的数据类型一致。',
      },
    ],
    returnDesc:
      '返回BOOLEAN类型。返回规则如下：如果ARRAY数组list中所有的元素满足predicate条件或ARRAY数组为空，返回结果为True。如果ARRAY数组a中存在元素不满足predicate条件，返回结果为False。如果ARRAY数组list中存在元素为NULL，且其他元素都满足predicate条件，返回结果为NULL。',
    example: 'select all_match(array(4, 5, 6), x -> x>3);',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-qv9-71e-4gw',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ANY_MATCH: {
    name: 'ANY_MATCH',
    simpleDesc: '判断ARRAY数组中是否存在满足指定条件的元素。',
    usageCommand: 'any_match(array<T> <q>, function<T, boolean> <predicate>)',
    usageDesc: '判断ARRAY数组a中是否存在元素满足predicate条件。',
    paramDocs: [
      {
        label: 'q',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。',
      },
      {
        label: 'predicate',
        desc:
          '必填。用于对ARRAY数组a中的元素进行判断的函数（内建函数或自定义函数）或表达式。输入参数的数据类型必须与ARRAY数组a中元素的数据类型一致。',
      },
    ],
    returnDesc:
      '返回BOOLEAN类型。返回规则如下：如果ARRAY数组a中存在一个或多个元素满足predicate条件，返回结果为True。如果ARRAY数组a中没有元素满足predicate条件或ARRAY数组为空，返回结果为False。如果ARRAY数组a中存在元素为NULL，且其他元素都不满足predicate条件，返回结果为NULL。',
    example: 'select any_match(array(1, 2, -10, 100, -30), x-> x > 3);',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-6xi-q8m-llc',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ARRAY: {
    name: 'ARRAY',
    simpleDesc: '使用给定的值构造ARRAY。',
    usageCommand: 'array(<value>,<value>[, ...])',
    usageDesc: '使用指定的值构造ARRAY数组。',
    paramDocs: [
      {
        label: 'value',
        desc: '必填。可以为任意类型。所有value的数据类型必须一致。',
      },
    ],
    returnDesc: '返回ARRAY类型。',
    example: 'select array(c2,c4,c3,c5) from t_table;',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-zln-uwi-ar5',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: true,
  },
  ARRAY_CONTAINS: {
    name: 'ARRAY_CONTAINS',
    simpleDesc: '检测指定的ARRAY中是否包含指定的值。',
    usageCommand: 'array_contains(array<T> <list>, value <item>)',
    usageDesc: '判断ARRAY数组a中是否存在元素v。',
    paramDocs: [
      {
        label: 'list',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型',
      },
      {
        label: 'item',
        desc: '必填。待判断的元素。必须与ARRAY数组a中元素的数据类型一致。',
      },
    ],
    returnDesc: '返回BOOLEAN类型。',
    example: "select c1, array_contains(t_array,'1') from t_table_array;",
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-nul-93z-vzx',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: true,
  },
  ARRAY_DISTINCT: {
    name: 'ARRAY_DISTINCT',
    simpleDesc: '去除ARRAY数组中的重复元素。',
    usageCommand: 'array_distinct(array<T> <list>)',
    usageDesc: '去除ARRAY数组a中的重复元素。',
    paramDocs: [
      {
        label: 'list',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型',
      }
    ],
    returnDesc:
      '返回ARRAY类型。返回规则如下：新ARRAY数组无重复元素且元素顺序与a中的元素顺序保持一致。ARRAY数组a中存在元素为NULL时，NULL值会参与运算。输入数组为空时，返回空数组。',
    example: 'select array_distinct(array(10, 20, 30, 30, 20, 10));',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-2aw-7ah-jqx',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ARRAY_EXCEPT: {
    name: 'ARRAY_EXCEPT',
    simpleDesc: '找出在ARRAY A中，但不在ARRAY B中的元素，并去掉重复的元素后，以ARRAY形式返回结果。',
    usageCommand: 'array_except(array<T> <listA>, array<T> <listB>)',
    usageDesc:
      '找出在ARRAY数组a中，但不在ARRAY数组b中的元素，并去掉重复的元素后，返回新的ARRAY数组。',
    paramDocs: [
      {
        label: 'listA',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。a和b的数据类型必须保持一致。',
      },
      {
        label: 'listB',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。a和b的数据类型必须保持一致。',
      },
    ],
    returnDesc:
      '返回ARRAY类型。返回规则如下：新ARRAY数组无重复元素且元素顺序与a中的元素顺序保持一致。ARRAY数组中存在元素为NULL时，NULL值会参与运算。任一输入数组为空时，返回对非空数组去重后的新ARRAY数组。输入数组全部为空时，返回空数组。',
    example: 'select array_except(array(1, 1, 3, 3, 5, 5), array(1, 1, 2, 2, 3, 3));',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-e0m-o6l-r0k',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ARRAY_INTERSECT: {
    name: 'ARRAY_INTERSECT',
    simpleDesc: '计算两个ARRAY数组的交集。',
    usageCommand: 'array_intersect(array<T> <listA>, array<T> <listB>)',
    usageDesc: '计算ARRAY数组a和b的交集，并去掉重复元素。',
    paramDocs: [
      {
        label: 'listA',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。a和b的数据类型必须保持一致。',
      },
      {
        label: 'listB',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。a和b的数据类型必须保持一致。',
      },
    ],
    returnDesc:
      '返回ARRAY类型。返回规则如下：ARRAY数组中存在元素为NULL时，NULL值会参与运算。新ARRAY数组无重复元素且元素顺序与a中的元素顺序保持一致。如果ARRAY数组a或b为NULL，返回NULL。',
    example: 'select array_intersect(array(1, 2, 3), array(1, 3, 5));',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-ac3-qy7-702',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ARRAY_JOIN: {
    name: 'ARRAY_JOIN',
    simpleDesc: '将ARRAY数组中的元素按照指定字符串进行拼接。',
    usageCommand: 'array_join(array<T> <listA>, <delimiter>[, <nullreplacement>])',
    usageDesc:
      '将ARRAY数组a中的元素使用delimiter拼接为字符串。当数组中元素为NULL时，用nullreplacement替代，没有设置nullreplacement时，会忽略NULL元素。',
    paramDocs: [
      {
        label: 'listA',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型。当ARRAY数组中的元素非STRING类型时，MaxCompute会将非STRING类型元素转换为STRING类型。',
      },
      {
        label: 'delimiter',
        desc: '必填。STRING类型。连接ARRAY数组a中元素的字符串',
      },
      {
        label: 'nullreplacement',
        desc: '可选。替代NULL元素的字符串',
      },
    ],
    returnDesc: '返回STRING类型。',
    example: 'select array_join(array(10, 20, 20, null, null, 30), ",");',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-pc4-90e-0rl',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ARRAY_MAX: {
    name: 'ARRAY_MAX',
    simpleDesc: '计算ARRAY数组中的最大值。',
    usageCommand: 'array_max(array<T> <list>)',
    usageDesc: '计算ARRAY数组a中的最大元素。',
    paramDocs: [
      {
        label: 'list',
        desc: '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型。',
      },
    ],
    returnDesc:
      '返回ARRAY数组a中的最大元素。返回规则如下：如果ARRAY数组a为NULL，返回NULL。如果ARRAY数组a中存在元素为NULL，NULL值不参与运算。',
    example: 'select array_max(array(1, 20, null, 3));',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-v0b-tse-4qr',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ARRAY_MIN: {
    name: 'ARRAY_MIN',
    simpleDesc: '计算ARRAY数组中的最小值。',
    usageCommand: 'array_min(array<T> <list>)',
    usageDesc: '计算ARRAY数组a中的最小元素。',
    paramDocs: [
      {
        label: 'list',
        desc: '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型。',
      },
    ],
    returnDesc:
      '返回ARRAY数组a中的最小元素。返回规则如下：如果ARRAY数组a为NULL，返回NULL。如果ARRAY数组a中存在元素为NULL时，NULL值不参与运算。',
    example: 'select array_min(array(1, 20, null, 3));',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-lvi-hpj-dth',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ARRAY_POSITION: {
    name: 'ARRAY_POSITION',
    simpleDesc: '计算指定元素在ARRAY数组中第一次出现的位置。',
    usageCommand: 'array_position(array<T> <list>, T <element>)',
    usageDesc:
      '计算元素element在ARRAY数组a中第一次出现的位置。ARRAY数组元素位置编号自左往右，从1开始计数。',
    paramDocs: [
      {
        label: 'list',
        desc: '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型。',
      },
      {
        label: 'element',
        desc: '必填。待查询的元素，数据类型必须与a中元素的数据类型相同。',
      },
    ],
    returnDesc:
      '返回BIGINT类型。返回规则如下：如果ARRAY数组a或element为NULL，返回NULL。未找到元素时返回0。',
    example: 'select array_position(array(3, 2, 1), 1);',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-l8p-gj6-p2t',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ARRAY_REDUCE: {
    name: 'ARRAY_REDUCE',
    simpleDesc: '将ARRAY数组的元素进行聚合。',
    usageCommand:
      'array_reduce(array<T> <list>, buf <init>, function<buf, T, buf> <merge>, function<buf, R> <final>)',
    usageDesc: '对ARRAY数组a中的元素进行聚合',
    paramDocs: [
      {
        label: 'list',
        desc: '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型。',
      },
      {
        label: 'init',
        desc: '必填。用于聚合的中间结果的初始值。',
      },
      {
        label: 'merge',
        desc:
          '必填。将ARRAY数组a中的每一个元素与中间结果进行运算的函数（内建函数或自定义函数）或表达式。它的两个输入参数为ARRAY数组a的元素和init。',
      },
      {
        label: 'final',
        desc:
          '必填。将中间结果转换为最终结果的函数（内建函数或自定义函数）或表达式。它的输入参数为merge运行结果，R指代输出结果的数据类型。',
      },
    ],
    returnDesc: '返回结果类型与final函数定义的输出结果类型一致。',
    example: 'select array_reduce(array(1, 2, 3), 0, (buf, e)->buf + e, buf->buf);',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-mlm-mla-j4k',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ARRAY_REMOVE: {
    name: 'ARRAY_REMOVE',
    simpleDesc: '在ARRAY数组中删除指定元素。',
    usageCommand: 'array_remove(array<T> <list>, T <element>)',
    usageDesc: '在ARRAY数组a中删除与element相等的元素。',
    paramDocs: [
      {
        label: 'list',
        desc: '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型。',
      },
      {
        label: 'element',
        desc: '必填。待删除的元素，数据类型必须与a中元素的数据类型相同。',
      },
    ],
    returnDesc:
      '返回ARRAY类型。返回规则如下：如果ARRAY数组a中存在元素为NULL时，NULL值不参与运算。如果ARRAY数组a或element为NULL，返回NULL。ARRAY数组a中不存在element时返回原ARRAY数组a。',
    example: 'select array_remove(array(3, 2, 1), 1);',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-yzp-slx-wef',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ARRAY_REPEAT: {
    name: 'ARRAY_REPEAT',
    simpleDesc: '返回将指定元素重复指定次数后的ARRAY数组。',
    usageCommand: 'array_repeat(T <element>, int <count>)',
    usageDesc: '返回将元素t重复count次后新生成的ARRAY数组。',
    paramDocs: [
      {
        label: 'element',
        desc: '必填。待重复的元素。',
      },
      {
        label: 'count',
        desc: '必填。重复的次数，INT类型。必须大于等于0。',
      },
    ],
    returnDesc:
      '返回ARRAY类型。返回规则如下：如果count为NULL，返回NULL。如果count小于0，返回空数组。',
    example: "select array_repeat('123', 2);",
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-vfr-5rb-q6x',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ARRAY_SORT: {
    name: 'ARRAY_SORT',
    simpleDesc: '将ARRAY数组的元素进行排序。',
    usageCommand: 'array_sort(array<T> <list>, function<T, T, bigint> <comparator>)',
    usageDesc: '将ARRAY数组a中的元素根据comparator进行排序。',
    paramDocs: [
      {
        label: 'list',
        desc: '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型。',
      },
      {
        label: 'comparator',
        desc:
          '必填。用于比较ARRAY数组中2个元素大小的函数（内建函数或自定义函数）或表达式。comparator(a, b)的处理逻辑为：当a等于b时，返回0。当a小于b时，返回负整数。当a大于b时，返回正整数。如果comparator(a, b)返回NULL，则返回报错。',
      },
    ],
    returnDesc: '返回ARRAY类型。',
    example:
      'SELECT array_sort(array(5, 6, 1),(left, right) -> CASE WHEN left < right THEN -1L WHEN left > right THEN 1L ELSE 0L END);',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-g67-jxi-rnk',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ARRAY_UNION: {
    name: 'ARRAY_UNION',
    simpleDesc: '计算两个ARRAY数组的并集并去掉重复元素。',
    usageCommand: 'array_union(array<T> <listA>, array<T> <listB>)',
    usageDesc: '计算ARRAY数组a和b的并集，并去掉重复元素。',
    paramDocs: [
      {
        label: 'listA',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。a和b中元素的数据类型必须一致。',
      },
      {
        label: 'listB',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。a和b中元素的数据类型必须一致。',
      },
    ],
    returnDesc: '返回ARRAY类型。如果a或b为NULL，返回NULL。',
    example: 'select array_union(array(1, 2, 3), array(1, 3, 5));',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-jb0-17b-27j',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ARRAYS_OVERLAP: {
    name: 'ARRAYS_OVERLAP',
    simpleDesc: '判断两个ARRAY数组中是否包含相同元素。',
    usageCommand: 'arrays_overlap(array<T> <listA>, array<T> <listB>)',
    usageDesc: '判断ARRAY数组a和b是否存在相同元素。',
    paramDocs: [
      {
        label: 'listA',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。a和b中元素的数据类型必须一致。',
      },
      {
        label: 'listB',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。a和b中元素的数据类型必须一致。',
      },
    ],
    returnDesc:
      '返回BOOLEAN类型。返回规则如下：如果ARRAY数组a中至少包含ARRAY数组b中的一个非NULL元素，返回结果为True。如果ARRAY数组a和b中没有公共元素、都非空，且其中任意一个数组中包含NULL元素，返回结果为NULL。如果ARRAY数组a和b中没有公共元素、都非空，且其中任意一个数组中都不包含NULL元素，返回结果为False。',
    example: 'select arrays_overlap(array(1, 2, 3), array(3, 4, 5));',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-5jo-vf6-4rk',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ARRAYS_ZIP: {
    name: 'ARRAYS_ZIP',
    simpleDesc: '合并多个ARRAY数组。',
    usageCommand: 'arrays_zip(array<T> <listA>, array<U> <listB>[, ...])',
    usageDesc: '合并多个给定数组并返回一个结构数组，其中第N个结构包含输入数组的所有第N个值。',
    paramDocs: [
      {
        label: 'listA',
        desc:
          '必填。ARRAY数组。array<T>及array<U>中的T和U指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。',
      },
      {
        label: 'listB',
        desc:
          '必填。ARRAY数组。array<T>及array<U>中的T和U指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。',
      },
    ],
    returnDesc:
      '返回ARRAY类型。返回规则如下：生成的结构数组中第N个结构包含输入数组的所有第N个值, 不足N的元素以NULL填充。如果输入ARRAY数组中任意一个为NULL，返回结果为NULL。',
    example: 'select arrays_zip(array(1, 2, 3), array(2, 3, 4));',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-1ul-sbs-1wu',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  CONCAT: {
    name: 'CONCAT',
    simpleDesc: '将字符串或ARRAY数组连接在一起。',
    usageCommand: 'concat(array<T> | string <listA>, array<T> | string <listB>[,...]))',
    usageDesc:
      '输入为字符串：将多个字符串连接在一起，生成一个新的字符串。 输入为ARRAY数组：将多个ARRAY数组中的所有元素连接在一起，生成一个新的ARRAY数组。 ',
    paramDocs: [
      {
        label: 'listA',
        desc:
          '必填，当为STRING类型时，输入参数为BIGINT、DOUBLE、DECIMAL或DATETIME类型，则会隐式转换为STRING类型后参与运算，其他类型会返回报错。当为 ARRAY数组 时 array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。a和b中元素的数据类型必须一致。数组中的元素为NULL值时会参与运算',
      },
      {
        label: 'listB',
        desc:
          '必填，当为STRING类型时，输入参数为BIGINT、DOUBLE、DECIMAL或DATETIME类型，则会隐式转换为STRING类型后参与运算，其他类型会返回报错。当为 ARRAY数组 时 array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。a和b中元素的数据类型必须一致。数组中的元素为NULL值时会参与运算',
      },
    ],
    returnDesc:
      '输入 STRING 类型，则返回STRING类型。如果没有参数或任一参数为NULL，返回结果为NULL。 输入为 ARRAY 类型。返回ARRAY类型。如果任一输入ARRAY数组为NULL，返回结果为NULL。',
    example: 'select concat(array(10, 20), array(20, -20));',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-ioq-7gu-ywe',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: true,
  },
  EXPLODE: {
    name: 'EXPLODE',
    simpleDesc: '将一行数据转为多行的UDTF。',
    usageCommand: 'explode (<var>)',
    usageDesc:
      '将一行数据转为多行的UDTF。如果参数是array<T>类型，则将列中存储的ARRAY转为多行。如果参数是map<K, V>类型，则将列中存储的MAP的每个Key-Value对转换为包含两列的行，其中一列存储Key，另一列存储Value。',
    paramDocs: [
      {
        label: 'var',
        desc: '必填。array<T>类型或map<K, V>类型。',
      },
    ],
    returnDesc: '返回转换后的行。',
    example: 'select explode(t_map) from t_table_map;',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-7rk-9a6-0la',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: true,
  },
  FILTER: {
    name: 'FILTER',
    simpleDesc: '将ARRAY数组中的元素进行过滤。',
    usageCommand: 'filter(array<T> <list>, function<T,boolean> <func>)',
    usageDesc: '将ARRAY数组a中的元素利用func进行过滤，返回一个新的ARRAY数组。',
    paramDocs: [
      {
        label: 'list',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。',
      },
      {
        label: 'func',
        desc:
          '必填。用于对a中元素进行过滤的函数（内置函数或自定义函数）或表达式，其输入参数类型必须与a中元素的数据类型一致，其输出结果数据类型为BOOLEAN。',
      },
    ],
    returnDesc: '返回ARRAY类型。',
    example: 'select filter(array(1, 2, 3), x -> x > 1);',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-ehc-9gp-hpq',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  INDEX: {
    name: 'INDEX',
    simpleDesc: '返回ARRAY数组指定位置的元素值。',
    usageCommand: 'index(<var1>[<var2>])',
    usageDesc:
      '如果var1是array<T>类型，获取var1的第var2个元素。ARRAY数组元素编号自左往右，从0开始计数。如果 var1 是map<K, V>类型，获取var1中Key为var2的Value。',
    paramDocs: [
      {
        label: 'var1',
        desc:
          '必填。array<T>类型或map<K, V>类型。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。map<K, V>中的K、V指代MAP对象的Key、Value。',
      },
      {
        label: 'var2',
        desc:
          '必填。如果var1是array<T>类型，则var2为BIGINT类型且大于等于0。如果var1是map<K, V>类型，则var2与K的类型保持一致。',
      },
    ],
    returnDesc:
      '如果var1是array<T>类型，函数返回T类型。返回规则如下：如果var2超出var1的元素数目范围，返回结果为NULL。如果var1为NULL，返回结果为NULL。如果var1是map<K, V>类型，函数返回V类型。返回规则如下：如果map<K, V>中不存在Key为var2的情况，返回结果为NULL。如果var1为NULL，返回结果为NULL。',
    example: "select array('a','b','c')[2];",
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-t0k-akb-62x',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: '[]运算符',
  },
  POSEXPLODE: {
    name: 'POSEXPLODE',
    simpleDesc: '将指定的ARRAY展开，每个Value一行，每行两列分别对应数组从0开始的下标和数组元素。',
    usageCommand: 'posexplode(array<T> <list>)',
    usageDesc: '将ARRAY数组a展开，每个Value一行，每行两列分别对应数组从0开始的下标和数组元素。',
    paramDocs: [
      {
        label: 'list',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型',
      },
    ],
    returnDesc: '返回表。',
    example: "select posexplode(array('a','c','f','b'));",
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-2yc-ymd-p11',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: true,
  },
  SIZE: {
    name: 'SIZE',
    simpleDesc: '返回指定ARRAY中的元素数目。',
    usageCommand: 'size(array<T> | map<K, V> <data>)',
    usageDesc:
      '输入为ARRAY数组：计算ARRAY数组a中的元素数目。 输入为MAP对象：计算MAP对象b中的Key-Value对数。',
    paramDocs: [
      {
        label: 'data',
        desc:
          '必填。array<T>类型或map<K, V>类型。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。',
      }
    ],
    returnDesc: '返回INT类型',
    example: "select size(array('a','b'));",
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-muq-ppd-2xl',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: true,
  },
  SLICE: {
    name: 'SLICE',
    simpleDesc: '对ARRAY数据切片，返回从指定位置开始、指定长度的数组。',
    usageCommand: 'slice(array<T> <list>, <start>, <length>)',
    usageDesc: '对ARRAY数组切片，截取从start位置开始长度为length的元素组成新的ARRAY数组。',
    paramDocs: [
      {
        label: 'list',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。',
      },
      {
        label: 'start',
        desc:
          'start：必填。切片起点，从1开始，表示从数组的首个元素开始向右切片。start可以为负数，表示从数组的末尾元素开始向右切片。',
      },
      {
        label: 'length',
        desc:
          '必填。切片长度，必须大于或等于0。切片长度如果大于ARRAY数组长度时，会返回从start位置开始到末尾元素组成的ARRAY数组。',
      },
    ],
    returnDesc: '返回ARRAY类型。',
    example: 'select slice(array(10, 20, 20, null, null, 30), 1, 3);',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-uii-ken-off',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  SORT_ARRAY: {
    name: 'SORT_ARRAY',
    simpleDesc: '为指定的数组中的元素排序。',
    usageCommand: 'sort_array(array<T> <list>[, <isasc>])',
    usageDesc: '对ARRAY数组中的元素进行排序。',
    paramDocs: [
      {
        label: 'list',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。',
      },
      {
        label: 'isasc',
        desc: '可选。用于设置排序规则。取值为True（升序）或False（降序）。默认为升序。',
      },
    ],
    returnDesc: '返回ARRAY类型。NULL值为最小值。',
    example: 'select sort_array(c1),sort_array(c2),sort_array(c3) from t_array;',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-hjt-i1k-6qh',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: true,
  },
  TRANSFORM: {
    name: 'TRANSFORM',
    simpleDesc: '将ARRAY数组中的元素进行转换。',
    usageCommand: 'transform(array<T> <list>, function<T, R> <func>)',
    usageDesc: '将ARRAY数组a的元素利用func进行转换，返回一个新的ARRAY数组。',
    paramDocs: [
      {
        label: 'list',
        desc:
          '必填。ARRAY数组。array<T>中的T指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。',
      },
      {
        label: 'func',
        desc:
          '必填。用于对a中元素进行转换的函数（内建函数或自定义函数）或表达式，其输入类型应与a中的元素类型一致。R指代输出结果的数据类型。',
      },
    ],
    returnDesc: '返回ARRAY类型。',
    example: 'select transform(array(1, 2, 3), x -> x + 1);',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-ieh-8c6-6pv',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  ZIP_WITH: {
    name: 'ZIP_WITH',
    simpleDesc: '将2个ARRAY数组按照位置进行元素级别的合并。',
    usageCommand: 'zip_with(array<T> <listA>, array<S> <listB>, function<T, S, R> <combiner>)',
    usageDesc:
      '将ARRAY数组a和b的元素按照位置，使用combiner进行元素级别的合并，返回一个新的ARRAY数组。',
    paramDocs: [
      {
        label: 'listA',
        desc:
          '必填。ARRAY数组。array<T>、array<S>中的T、S指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。',
      },
      {
        label: 'listB',
        desc:
          '必填。ARRAY数组。array<T>、array<S>中的T、S指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。',
      },
    ],
    returnDesc:
      '返回ARRAY类型。返回规则如下：新生成的ARRAY数组中元素位置与a、b中相应元素的位置相同。如果ARRAY数组a和b的长度不一致，会将长度较短的ARRAY数组使用NULL值进行填充，然后进行合并。',
    example: 'select zip_with(array(1,2,3), array(1,2,3,4), (x,y) -> x + y);',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-3iq-jds-c09',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  MAP: {
    name: 'MAP',
    simpleDesc: '使用指定的Key-Value对建立MAP。',
    usageCommand: 'map(K <key1>, V <value1>, K <key2>, V <value2>[, ...])',
    usageDesc: '使用给定的Key-Value对生成MAP。',
    paramDocs: [
      {
        label: 'key',
        desc: '必填。所有key类型一致（包括隐式转换后类型一致），必须是基本类型。',
      },
      {
        label: 'value',
        desc: '必填。所有value类型一致（包括隐式转换后类型一致），可为任意类型。',
      },
    ],
    returnDesc: '返回MAP类型。',
    example: 'select map(c2,c4,c3,c5) from t_table;',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-1uq-s39-4zh',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: true,
  },
  MAP_CONCAT: {
    name: 'MAP_CONCAT',
    simpleDesc: '返回多个MAP的并集。',
    usageCommand: 'map_concat([string <mapDupKeyPolicy>,] map<K, V> <dataA>, map<K, V> <dataB>[,...])',
    usageDesc: '计算多个MAP对象的并集。',
    paramDocs: [
      {
        label: 'mapDupKeyPolicy',
        desc:
          '可选。STRING类型。指定出现重复Key时的处理方式。取值范围如下：exception：如果出现重复的Key，返回报错。last_win：如果出现重复的Key，后边的值将覆盖前边的值。',
      },
      {
        label: 'dataA',
        desc:
          '必填。MAP对象。多个MAP对象的参数数据类型必须一致。map<K, V>中的K、V指代MAP对象的Key、Value。',
      },
      {
        label: 'dataB',
        desc:
          '必填。MAP对象。多个MAP对象的参数数据类型必须一致。map<K, V>中的K、V指代MAP对象的Key、Value。',
      },
    ],
    returnDesc:
      '返回MAP类型。返回规则如下：某个MAP对象为NULL或某个MAP对象的Key为NULL时，返回报错。多个MAP对象的数据类型不一致时，返回报错。',
    example: "select map_concat(map(1, 'a', 2, 'b'), map(3, 'c'));",
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-cyp-vio-ve0',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  MAP_ENTRIES: {
    name: 'MAP_ENTRIES',
    simpleDesc: '将MAP中的Key、Value键值映射转换为STRUCT结构数组。',
    usageCommand: 'map_entries(map<K, V> <data>):',
    usageDesc: '将MAP对象a的K、Value映射转换为STRUCT结构数组。',
    paramDocs: [
      {
        label: 'data',
        desc: '必填。MAP对象。map<K, V>中的K、V指代MAP对象的Key、Value。',
      },
    ],
    returnDesc: '返回STRUCT结构数组。如果输入为NULL，返回结果为NULL。',
    example: "select map_entries(map(1, 'a', 2, 'b'));",
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-gn1-mah-d8o',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  MAP_FILTER: {
    name: 'MAP_FILTER',
    simpleDesc: '将MAP中的元素进行过滤。',
    usageCommand: 'map_filter(map<K, V> <input>, function <K, V, boolean> <predicate>)',
    usageDesc: '将MAP对象input的元素进行过滤，只保留满足predicate条件的元素。',
    paramDocs: [
      {
        label: 'input',
        desc: '必填。MAP对象。map<K, V>中的K、V指代MAP对象的Key、Value。',
      },
      {
        label: 'predicate',
        desc:
          '必填。用于对输入MAP对象中的元素进行过滤的函数（内建函数或自定义函数）或表达式。它的两个输入参数，分别对应input中的Key和Value，输出结果为BOOLEAN类型',
      },
    ],
    returnDesc: '返回MAP类型。',
    example: 'select map_filter(map(10, -20, 20, 50, -30, 100, 21, null), (k, v) -> (k+v) > 10);',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-si5-t2f-qkn',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  MAP_FROM_ARRAYS: {
    name: 'MAP_FROM_ARRAYS',
    simpleDesc: '通过给定的ARRAY数组构造MAP。',
    usageCommand: 'map_from_arrays([string <mapDupKeyPolicy>,] array<K> <listA>, array<V> <listB>))',
    usageDesc: '将ARRAY数组a和b组合成一个MAP对象。',
    paramDocs: [
      {
        label: 'mapDupKeyPolicy',
        desc:
          '可选。STRING类型。指定出现重复Key时的处理方式。取值范围如下：exception：如果出现重复的Key，返回报错。last_win：如果出现重复的Key，后边的值将覆盖前边的值。',
      },
      {
        label: 'listA',
        desc:
          '必填。ARRAY数组。对应生成MAP的Key值。array<K>中的K指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。',
      },
      {
        label: 'listB',
        desc:
          '必填。ARRAY数组。对应生成MAP的Value值。array<V>中的V指代ARRAY数组元素的数据类型，数组中的元素可以为任意类型。',
      },
    ],
    returnDesc:
      '返回MAP类型。返回规则如下：如果a或b为NULL，返回结果为NULL。如果a中元素包含NULL值或两个数组长度不相等，会返回报错。',
    example: "select map_from_arrays(array(1.0, 3.0), array('2', '4'));",
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-7ue-e91-m0s',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  MAP_FROM_ENTRIES: {
    name: 'MAP_FROM_ENTRIES',
    simpleDesc: '通过给定的结构体数组构造MAP。',
    usageCommand:
      'map_from_entries([string <mapDupKeyPolicy>,] array <struct<K, V> , struct<K, V>[,...]>)',
    usageDesc: '将多个结构数组组合成一个MAP对象。',
    paramDocs: [
      {
        label: 'mapDupKeyPolicy',
        desc:
          '可选。STRING类型。指定出现重复Key时的处理方式。取值范围如下：exception：如果出现重复的Key，返回报错。last_win：如果出现重复的Key，后边的值将覆盖前边的值。',
      },
      {
        label: 'struct<K, V>',
        desc:
          '输入为STRUCT类型的数据。其中：K对应生成MAP的Key值，V对应生成MAP的Value值。struct<K, V>中的K、V指代STRUCT的Key、Value。',
      },
    ],
    returnDesc:
      '返回MAP类型。返回规则如下：如果结构体数组为NULL，返回结果为NULL。如果结构体的Field数量不是2或K包含NULL值，会返回报错。',
    example: "select map_from_entries(array(struct(1, 'a'), struct(2, 'b')));",
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-ao9-yc4-71a',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  MAP_KEYS: {
    name: 'MAP_KEYS',
    simpleDesc: '将参数MAP中的所有Key作为数组返回。',
    usageCommand: 'map_keys(map<K, V> <data>)',
    usageDesc: '将MAP对象a中的所有Key生成ARRAY数组。',
    paramDocs: [
      {
        label: 'data',
        desc: '必填。MAP对象。map<K, V>中的K、V指代MAP对象的Key、Value。',
      },
    ],
    returnDesc: '返回ARRAY类型。输入MAP对象为NULL时，返回结果为NULL。',
    example: 'select c1, map_keys(t_map) from t_table_map;',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-oaa-81e-cjj',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  MAP_VALUES: {
    name: 'MAP_VALUES',
    simpleDesc: '将参数MAP中的所有Value作为数组返回。',
    usageCommand: 'map_values(map<K, V> <data>)',
    usageDesc: '将MAP对象a中的所有Value生成ARRAY数组。',
    paramDocs: [
      {
        label: 'data',
        desc: '必填。MAP对象。map<K, V>中的K、V指代MAP对象的Key、Value。',
      },
    ],
    returnDesc: '返回ARRAY类型。输入MAP对象为NULL时，返回结果为NULL。',
    example: 'select c1,map_values(t_map) from t_table_map;',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-0dq-ltn-r7e',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  MAP_ZIP_WITH: {
    name: 'MAP_ZIP_WITH',
    simpleDesc: '对输入的两个MAP进行合并得到一个新MAP。',
    usageCommand: 'map_zip_with(map<K, V1>…<K, V2> <input2>, function<K, V1, V2, V3> <func>)',
    usageDesc:
      '对输入的两个MAP对象input1和input2进行合并得到一个新MAP对象。新MAP的Key是两个…每一个Key，通过func来计算它的Value。',
    paramDocs: [
      {
        label: 'input1',
        desc:
          '必填。MAP对象。map<K, V>中的K、V指代MAP对象的Key、Value。 input1、input2：必填。MAP对象。map<K, V>中的K、V指代MAP对象的Key、Value。',
      },
      {
        label: 'input2',
        desc:
          '必填。MAP对象。map<K, V>中的K、V指代MAP对象的Key、Value。 input1、input2：必填。MAP对象。map<K, V>中的K、V指代MAP对象的Key、Value。',
      },
      {
        label: 'func',
        desc:
          'func有三个输入参数，分别对应MAP的Key、Key相对应的input1以及input2的Value。如果Key在input1或者input2中不存在，func对应参数补充为NULL。',
      },
    ],
    returnDesc: '返回func定义的类型。',
    example:
      'select map_zip_with(map(1, 1, 2, 2, 3, null), map(1, 4, 2, 5, 4, 7), (k, v1, v2) -> array(k, v1, v2));',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-oin-kzh-1ic',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  TRANSFORM_KEYS: {
    name: 'TRANSFORM_KEYS',
    simpleDesc: '对MAP进行变换，保持Value不变，根据指定函数计算新的Key。',
    usageCommand:
      'transform_keys([string <mapDupKeyPolicy…] map<K1, V> <input>, function<K1, V, K2> <func>)',
    usageDesc: '对MAP对象input进行变换，保持Value不变，通过func计算新的Key值。',
    paramDocs: [
      {
        label: 'mapDupKeyPolicy',
        desc:
          '可选。STRING类型。指定出现重复Key时的处理方式。取值范围如下：exception：如果出现重复的Key，返回报错。last_win：如果出现重复的Key，后边的值将覆盖前边的值。',
      },
      {
        label: 'input',
        desc: '必填。MAP对象。map<K1, V>中的K1、V指代MAP对象的Key、Value。',
      },
      {
        label: 'func',
        desc:
          '必填。变换的函数（内建函数或自定义函数）或表达式。它的两个输入参数分别对应input的Key和Value，K2指代新MAP的Key类型。',
      },
    ],
    returnDesc: '返回MAP类型。如果计算的新Key为NULL，会返回报错。',
    example: 'select transform_keys(map(10, -20, 20, 50, -30, 101), (k, v) -> k + v);',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-dyt-zgf-3jf',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  TRANSFORM_VALUES: {
    name: 'TRANSFORM_VALUES',
    simpleDesc: '对MAP进行变换，保持Key不变，根据指定函数计算新的Value。',
    usageCommand: 'transform_values(map<K, V1> <input>, function<K, V1, V2> <func>)',
    usageDesc: '对输入 MAP 对象 input 进行变换，保持 Key 不变，通过 func 计算新的 Value 值。',
    paramDocs: [
      {
        label: 'input',
        desc: '必填。MAP对象。map<K, V1>中的K、V1指代MAP对象的Key、Value。',
      },
      {
        label: 'func',
        desc:
          '必填。变换的函数（内建函数或自定义函数）或表达式。它的两个输入参数分别对应input的Key和Value，V2指代新MAP的Value类型。',
      },
    ],
    returnDesc: '返回MAP类型。',
    example: 'select transform_values(map(10, -20, 20, null, -30, 101), (k, v) -> k + v);',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-pmk-9wz-mtt',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  FIELD: {
    name: 'FIELD',
    simpleDesc: '获取STRUCT中的成员变量的取值。',
    usageCommand: 'field(struct <s>, string <fieldName>)',
    usageDesc: '获取 STRUCT 对象中成员变量的取值。',
    paramDocs: [
      {
        label: 's',
        desc:
          '必填。STRUCT类型对象。STRUCT的结构为{f1:T1, f2:T2[, ...]}，f1、f2代表成员变量，T1、T2分别代表成员变量f1、f2的取值',
      },
      {
        label: 'fieldName',
        desc: '必填。STRING类型。STRUCT类型对象的成员变量。',
      },
    ],
    returnDesc: '返回STRUCT类型对象的成员变量的取值。',
    example: "select field(named_struct('f1', 'hello', 'f2', 3), 'f1');",
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-eip-iz6-vsy',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: '.运算符',
  },
  INLINE: {
    name: 'INLINE',
    simpleDesc: '将指定的STRUCT数组展开。每个数组元素对应一行，每行每个STRUCT元素对应一列。',
    usageCommand: 'inline(array<struct<f1:T1, f2:T2[, ...]>>)',
    usageDesc: '将给定的 STRUCT 数组展开。每个数组元素对应一行，每行每个 STRUCT 元素对应一列。',
    paramDocs: [
      {
        label: 'struct',
        desc:
          'f1:T1、f2:T2：必填。可以为任意类型。f1、f2代表成员变量，T1、T2分别代表成员变量f1、f2的取值。',
      },
    ],
    returnDesc: '返回STRUCT数组展开的数据。',
    example: 'select inline(array(t_struct)) from t_table;',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-brn-bso-uyw',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: true,
  },
  STRUCT: {
    name: 'STRUCT',
    simpleDesc: '使用给定Value列表建立STRUCT。',
    usageCommand: 'struct struct(<value1>,<value2>[, ...])',
    usageDesc: '使用指定value列表建立 STRUCT。',
    paramDocs: [
      {
        label: 'value',
        desc: '必填。可以为任意类型。',
      },
    ],
    returnDesc: '返回STRUCT类型。Field的名称依次为col1，col2，…。',
    example: "select struct('a',123,'true',56.90);",
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-5gq-p2j-h0f',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: true,
  },
  NAMED_STRUCT: {
    name: 'NAMED_STRUCT',
    simpleDesc: '使用给定的Name、Value列表建立STRUCT。',
    usageCommand: 'named_struct(string <name1>, T1 <value1>, string <name2>, T2 <value2>[, ...])',
    usageDesc: '使用指定的name、value列表建立 STRUCT。',
    paramDocs: [
      {
        label: 'value',
        desc: '必填。可以为任意类型',
      },
      {
        label: 'name',
        desc: '必填。指定STRING类型的Field名称。此参数为常量。',
      },
    ],
    returnDesc: '返回STRUCT类型。Field的名称依次为name1，name2',
    example:
      "select named_struct('user_id',10001,'user_name','LiLei','married','F','weight',63.50);",
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-y2r-o40-itj',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  FROM_JSON: {
    name: 'FROM_JSON',
    simpleDesc: '根据给定的JSON字符串和输出格式信息，返回ARRAY、MAP或STRUCT类型。',
    usageCommand: 'from_json(<jsonStr>, <schema>)',
    usageDesc: '根据JSON字符串jsonStr和schema信息，返回ARRAY、MAP或STRUCT类型',
    paramDocs: [
      {
        label: 'jsonStr',
        desc: '必填。输入的JSON字符串。',
      },
      {
        label: 'schema',
        desc:
          '必填。写法与建表语句的类型一致。例如array<bigint>、map<string, array<string>>或struct<a:int, b:double, `C`:map<string,string>>。',
      },
    ],
    returnDesc: '返回ARRAY、MAP或STRUCT类型。',
    example: 'select from_json(\'{"a":1, "b":0.8}\', \'a int, b double\');',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-4at-wo3-wll',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
  GET_JSON_OBJECT: {
    name: 'GET_JSON_OBJECT',
    simpleDesc: '在一个标准JSON字符串中，按照指定方式抽取指定的字符串。',
    usageCommand: 'get_json_object(string <json>, string <path>)',
    usageDesc:
      '在一个标准JSON字符串中，按照path抽取指定的字符串。每次调用该函数时，都会读一次原始数据，因此…te内建函数及UDTF转换JSON格式日志数据。',
    paramDocs: [
      {
        label: 'json',
        desc:
          '必填。STRING类型。标准的JSON格式对象，格式为{Key:Value, Key:Value,...}。如果遇到英文双引号（"），需要用两个反斜杠（\\\\）进行转义。如果遇到英文单引号（\'），需要用一个反斜杠（\\）进行转义。',
      },
      {
        label: 'path',
        desc: '必填。STRING类型。表示在json中的path，以$开头。',
      },
    ],
    returnDesc:
      '如果json为空或非法的json格式，返回NULL。如果json合法，path也存在，则返回对应字符串。',
    example: 'select get_json_object(\'{"a":"1","a":"2"}\', \'$.a\');',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-un5-mvg-on2',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: true,
  },
  JSON_TUPLE: {
    name: 'JSON_TUPLE',
    simpleDesc: '在一个标准的JSON字符串中，按照输入的一组键抽取各个键指定的字符串。',
    usageCommand: 'json_tuple(string <json>, string <key1>, string <key2>,...)',
    usageDesc:
      '用于一个标准的JSON字符串中，按照输入的一组键(key1,key2,...)抽取各个键指定的字符串。',
    paramDocs: [
      {
        label: 'json',
        desc: '必填。STRING类型，标准的JSON格式字符串。',
      },
      {
        label: 'key1',
        desc:
          "必填。STRING类型，用于描述在JSON中的path，一次可输入多个，不能以美元符号（$）开头。MaxCompute支持用.或['']这两种字符解析JSON，当JSON的Key本身包含.时，可以用['']来替代。",
      },
    ],
    returnDesc: '返回STRING类型。',
    example: 'select json_tuple(school.json,"SchoolRank","Class1") as (item0, item1) from school;',
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-5zh-fyi-nr0',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: true,
  },
  TO_JSON: {
    name: 'TO_JSON',
    simpleDesc: '将指定的复杂类型输出为JSON字符串。',
    usageCommand: 'to_json(<expr>)',
    usageDesc: '将给定的复杂类型expr，以JSON字符串格式输出。',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。ARRAY、MAP、STRUCT复杂类型。',
      },
    ],
    returnDesc: '返回 JSON 字符串。',
    example: "select to_json(named_struct('a', 1, 'b', 2));",
    docUrl: 'https://help.aliyun.com/document_detail/293597.html#section-7nq-0gr-t4n',
    functionType: ODPS_FUNCTION_TYPE_ENUM.COMPLEX,
    functionInHive: false,
  },
};
