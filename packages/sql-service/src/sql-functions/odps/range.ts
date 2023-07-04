import { RANGE_FUNCTIONS_ENUM, FUNCTION_DETAIL, ODPS_FUNCTION_TYPE_ENUM } from './definitions';

export const RANGE_FUNCTIONS: Record<RANGE_FUNCTIONS_ENUM, FUNCTION_DETAIL> = {
  ROW_NUMBER: {
    name: 'ROW_NUMBER',
    simpleDesc: '计算行号。从1开始递增。',
    usageCommand: 'row_number() over([partition_clause] [orderby_clause])',
    usageDesc: '计算当前行在分区中的行号，从1开始递增',
    paramDocs: [
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
    ],
    returnDesc: '返回BIGINT类型。',
    example:
      'select deptno, ename, sal, row_number() over (partition by deptno order by sal desc) as nums from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-22b-f5e-tbt',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  RANK: {
    name: 'RANK',
    simpleDesc: '计算排名。排名可能不连续。',
    usageCommand: 'bigint rank() over ([partition_clause] [orderby_clause])',
    usageDesc: '计算当前行在分区中按照 orderby_clause 排序后所处的排名。从 1 开始计数',
    paramDocs: [
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
    ],
    returnDesc:
      '返回BIGINT类型。返回值可能重复、且不连续。具体的返回值为该行数据所在GROUP的第一条数据的ROW_NUMBER()值。未指定orderby_clause时，返回结果全为1。',
    example:
      'select deptno, ename, sal, rank() over (partition by deptno order by sal desc) as nums from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-wz2-0wi-yfc',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  DENSE_RANK: {
    name: 'DENSE_RANK',
    simpleDesc: '计算排名。排名是连续的。',
    usageCommand: 'dense_rank() over ([partition_clause] [orderby_clause])',
    usageDesc:
      '计算当前行在分区中按照 orderby_clause 排序后所处的排名。从 1 开始计数。分区中具有相同 order by 值的行的排名相等。每当 order by 值发生变化时，排名加1',
    paramDocs: [
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
    ],
    returnDesc: '返回BIGINT类型。未指定orderby_clause时，返回结果全为1。',
    example:
      'select deptno, ename, sal, dense_rank() over (partition by deptno order by sal desc) as nums from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-f11-8gm-keq',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  PERCENT_RANK: {
    name: 'PERCENT_RANK',
    simpleDesc: '计算排名。输出百分比格式。',
    usageCommand: 'percent_rank() over([partition_clause] [orderby_clause])',
    usageDesc: '计算当前行在分区中按照 orderby_clause 排序后的百分比排名',
    paramDocs: [
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
    ],
    returnDesc:
      '返回DOUBLE类型，值域为[0.0, 1.0]。具体的返回值等于“(rank - 1) / (partition_row_count - 1)”，其中：rank为该行数据的RANK窗口函数的返回结果，partition_row_count为该行数据所属分区的数据行数。当分区中只有一行数据时，输出结果为0.0。',
    example:
      'select deptno, ename, sal, percent_rank() over (partition by deptno order by sal desc) as sal_new from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-979-76k-p88',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  CUME_DIST: {
    name: 'CUME_DIST',
    simpleDesc: '计算累计分布。',
    usageCommand: 'cume_dist() over([partition_clause] [orderby_clause])',
    usageDesc:
      '求累计分布，相当于求分区中大于等于当前行的数据在分区中的占比。大小关系由 orderby_clause 判定',
    paramDocs: [
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
    ],
    returnDesc:
      '返回DOUBLE类型。具体的返回值等于row_number_of_last_peer / partition_row_count，其中：row_number_of_last_peer指当前行所属GROUP的最后一行数据的ROW_NUMBER窗口函数返回值，partition_row_count为该行数据所属分区的数据行数。',
    example:
      "select deptno, ename, sal, concat(round(cume_dist() over (partition by deptno order by sal desc)*100,2),'%') as cume_dist from emp;",
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-2la-4wn-4b8',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  NTILE: {
    name: 'NTILE',
    simpleDesc: '将数据顺序切分成N等份，返回数据所在等份的编号（从1到N）。',
    usageCommand: 'ntile(bigint <N>) over ([partition_clause] [orderby_clause])',
    usageDesc:
      '用于将分区中的数据按照顺序切分成N等份，并返回数据所在等份的编号。如果分区中的数据不能被均匀地切分成N等份时，最前面的等份（编号较小的）会优先多分配1条数据',
    paramDocs: [
      {
        label: 'N',
        desc: '必填。切片数量。BIGINT类型。',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
    ],
    returnDesc: '返回BIGINT类型。',
    example:
      'select deptno, ename, sal, ntile(3) over (partition by deptno order by sal desc) as nt3 from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-y0h-psg-py3',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  LAG: {
    name: 'LAG',
    simpleDesc: '取当前行往前（朝分区头部方向）第N行数据的值。',
    usageCommand:
      'lag(<expr>[，bigint <offset>[, <default>]]) over([partition_clause] orderby_clause)',
    usageDesc:
      '返回当前行往前（朝分区头部方向）第 offset 行数据对应的表达式expr的值。表达式expr可以是列、列运算或者函数运算等',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。待计算返回结果的表达式。',
      },
      {
        label: 'offset',
        desc:
          '可选。偏移量，BIGINT类型常量，取值大于等于0。值为0时表示当前行，为1时表示前一行，以此类推。默认值为1。输入值为STRING类型、DOUBLE类型则隐式转换为BIGINT类型后进行运算。',
      },
      {
        label: 'default',
        desc:
          '可选。当offset指定的范围越界时的缺省值，常量，默认值为NULL。需要与expr对应的数据类型相同。如果expr非常量，则基于当前行进行求值。',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
    ],
    returnDesc: '返回值类型同expr类型。',
    example:
      'select deptno, ename, sal, lag(sal, 1) over (partition by deptno order by sal) as sal_new from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-aac-ocr-pay',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  LEAD: {
    name: 'LEAD',
    simpleDesc: '取当前行往后（朝分区尾部方向）第N行数据的值。',
    usageCommand:
      'lead(<expr>[, bigint <offset>[, <default>]]) over([partition_clause] orderby_clause)',
    usageDesc:
      '返回当前行往后（朝分区尾部方向）第 offset 行数据对应的表达式expr的值。表达式expr可以是列、列运算或者函数运算等',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。待计算返回结果的表达式。',
      },
      {
        label: 'offset',
        desc:
          '可选。偏移量，BIGINT类型常量，取值大于等于0。值为0时表示当前行，为1时表示前一行，以此类推。默认值为1。输入值为STRING类型、DOUBLE类型则隐式转换为BIGINT类型后进行运算。',
      },
      {
        label: 'default',
        desc:
          '可选。当offset指定的范围越界时的缺省值，常量，默认值为NULL。需要与expr对应的数据类型相同。如果expr非常量，则基于当前行进行求值。',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
    ],
    returnDesc: '返回值类型同expr类型。',
    example:
      'select deptno, ename, sal, lead(sal, 1) over (partition by deptno order by sal) as sal_new from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-kt5-ewl-s1e',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  FIRST_VALUE: {
    name: 'FIRST_VALUE',
    simpleDesc: '取当前行所对应窗口的第一条数据的值。',
    usageCommand:
      'first_value(<expr>[, <ignore_nulls>]) over ([partition_clause] [orderby_clause] [frame_clause])',
    usageDesc: '返回表达式 expr 在窗口的第一条数据上进行运算的结果',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。待计算返回结果的表达式。',
      },
      {
        label: 'ignore_nulls',
        desc:
          '可选。BOOLEAN类型。表示是否忽略NULL值。默认值为False。当参数的值为True时，返回窗口中第一条非NULL的expr值。',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
    ],
    returnDesc: '返回值类型同expr类型。',
    example:
      'select deptno, ename, sal, first_value(sal) over (partition by deptno) as first_value from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-r80-eyd-iq9',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  LAST_VALUE: {
    name: 'LAST_VALUE',
    simpleDesc: '取当前行所对应窗口的最后一条数据的值。',
    usageCommand:
      'last_value(<expr>[, <ignore_nulls>]) over([partition_clause] [orderby_clause] [frame_clause])',
    usageDesc: '返回表达式 expr 在窗口的最后一条数据上进行运算的结果',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。待计算返回结果的表达式。',
      },
      {
        label: 'ignore_nulls',
        desc:
          '可选。BOOLEAN类型。表示是否忽略NULL值。默认值为False。当参数的值为True时，返回窗口中第一条非NULL的expr值。',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
      {
        label: 'frame_clause',
        desc: '可选。指定窗口的范围。',
      },
    ],
    returnDesc: '返回值类型同expr类型。',
    example:
      'select deptno, ename, sal, last_value(sal) over (partition by deptno) as last_value from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-bns-zkp-ile',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  NTH_VALUE: {
    name: 'NTH_VALUE',
    simpleDesc: '取当前行所对应窗口的第N条数据的值。',
    usageCommand:
      'nth_value(<expr>, <number> [, <ignore_nulls>]) ove…artition_clause] [orderby_clause] [frame_clause])',
    usageDesc: '返回表达式 expr 在窗口的第N条数据进行运算的结果',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。待计算返回结果的表达式。',
      },
      {
        label: 'number：',
        desc: '必填。BIGINT类型。大于等于1的整数。值为1时与FIRST_VALUE等价。',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
      {
        label: 'frame_clause',
        desc: '可选。指定窗口的范围。',
      },
    ],
    returnDesc: '返回值类型同expr类型。',
    example:
      'select deptno, ename, sal, nth_value(sal,6) over (partition by deptno) as nth_value from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-0s4-vvp-zlj',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  CLUSTER_SAMPLE: {
    name: 'CLUSTER_SAMPLE',
    simpleDesc: '用户随机抽样。返回True表示该行数据被抽中。',
    usageCommand:
      'cluster_sample(bigint <N>) OVER ([partitio…bigint <N>, bigint <M>) OVER ([partition_clause])',
    usageDesc:
      'cluster_sample(bigint <N>)：表示随机抽取N条数据 。cluster_sample(bigint <N>, bigint <M>)：表示按比例（M/N）随机抽取。即抽取partition_row_count×M / N条数据。partition_row_count指分区中的数据行数',
    paramDocs: [
      {
        label: 'N',
        desc: '必填。BIGINT类型常量。N为NULL时，返回值为NULL',
      },
      {
        label: 'M',
        desc: '可选。BIGINT类型常量。M为NULL时，返回值为NULL',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
    ],
    returnDesc: '返回BOOLEAN类型。',
    example:
      'select deptno, sal from (select deptno, sal, cluster_sample(5, 1) over (partition by deptno) as flag from emp ) sub where flag = true;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-2jj-n50-dzt',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: false,
  },
  COUNT: {
    name: 'COUNT',
    simpleDesc: '计算窗口中的记录数。',
    usageCommand:
      'count(*) over ([partition_clause] [orderby_…artition_clause] [orderby_clause] [frame_clause])',
    usageDesc:
      'count(*)：返回总行数。count([distinct] <expr>[,...])：计算行数时会忽略expr值为NULL的行，如果有多个expr，则任意expr值为NULL都被忽略。此外如果指定了distinct关键字，则计算去重之后的数据行数，任意expr值为NULL的行同样会被忽略',
    paramDocs: [
      {
        label: 'expr',
        desc:
          '必填。待计算计数值的列。可以为任意类型。当值为NULL时，该行不参与计算。当指定DISTINCT关键字时，表示取唯一值的计数值。',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
      {
        label: 'frame_clause',
        desc: '可选。指定窗口的范围。',
      },
    ],
    returnDesc: '返回BIGINT类型。',
    example: 'select sal, count(sal) over (partition by sal) as count from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-q11-32n-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  MIN: {
    name: 'MIN',
    simpleDesc: '计算窗口中的最小值。',
    usageCommand: 'min(<expr>) over([partition_clause] [orderby_clause] [frame_clause])',
    usageDesc: '返回窗口中expr的最小值',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。用于计算最小值的表达式。除BOOLEAN外的任意类型，当值为NULL时，该行不参与计算。',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
      {
        label: 'frame_clause',
        desc: '可选。指定窗口的范围。',
      },
    ],
    returnDesc: '返回值类型同expr类型。',
    example: 'select deptno, sal, min(sal) over (partition by deptno) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-mvt-3xz-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  MAX: {
    name: 'MAX',
    simpleDesc: '计算窗口中的最大值。',
    usageCommand: 'max(<expr>) over([partition_clause] [orderby_clause] [frame_clause])',
    usageDesc: '返回窗口中expr的最大值',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。用于计算最大值的表达式。除BOOLEAN外的任意类型，当值为NULL时，该行不参与计算。',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
      {
        label: 'frame_clause',
        desc: '可选。指定窗口的范围。',
      },
    ],
    returnDesc: '返回值的类型同expr类型。',
    example: 'select deptno, sal, max(sal) over (partition by deptno) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-qkf-ywz-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  AVG: {
    name: 'AVG',
    simpleDesc: '对窗口中的数据求平均值。',
    usageCommand:
      'avg([distinct] double <expr>) over ([partition_clause] [orderby_clause] [frame_clause])',
    usageDesc: '返回窗口中expr之和',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。待计算汇总值的列。DOUBLE类型、DECIMAL类型或BIGINT类型',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
      {
        label: 'frame_clause',
        desc: '可选。指定窗口的范围。',
      },
    ],
    returnDesc:
      '输入值为BIGINT类型时，返回BIGINT类型。输入值为DECIMAL类型时，返回DECIMAL类型。输入值为DOUBLE类型或STRING类型时，返回DOUBLE类型。输入值都为NULL时，返回NULL。',
    example: 'select deptno, sal, sum(sal) over (partition by deptno) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-ggy-vzz-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  SUM: {
    name: 'SUM',
    simpleDesc: '对窗口中的数据求和。',
    usageCommand:
      'avg([distinct] double <expr>) over ([partit…artition_clause] [orderby_clause] [frame_clause])',
    usageDesc: '返回窗口中expr的平均值',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。计算返回结果的表达式。DOUBLE类型或DECIMAL类型',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
      {
        label: 'frame_clause',
        desc: '可选。指定窗口的范围。',
      },
    ],
    returnDesc:
      'expr为DECIMAL类型时，返回DECIMAL类型。其他情况下返回DOUBLE类型。expr的值都为NULL时，返回结果为NULL。',
    example: 'select deptno, sal, avg(sal) over (partition by deptno) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-qb0-1gc-lbs',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: true,
  },
  MEDIAN: {
    name: 'MEDIAN',
    simpleDesc: '计算窗口中的中位数。',
    usageCommand: 'median(<expr>) over ([partition_clause] [orderby_clause] [frame_clause])',
    usageDesc: '计算窗口中expr的中位数',
    paramDocs: [
      {
        label: 'expr',
        desc:
          '必填。待计算中位数的表达式。DOUBLE类型或DECIMAL类型。最多支持输入255个数字，至少要输入1个数字',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
      {
        label: 'frame_clause',
        desc: '可选。指定窗口的范围。',
      },
    ],
    returnDesc: '返回DOUBLE类型或DECIMAL类型。所有expr为NULL时，返回结果为NULL。',
    example: 'select deptno, sal, median(sal) over (partition by deptno) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-0wd-4ug-m6s',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: false,
  },
  STDDEV: {
    name: 'STDDEV',
    simpleDesc: '计算总体标准差。是STDDEV_POP的别名。',
    usageCommand:
      'stddev([distinct] <expr>) over ([partition_clause][orderby_clause] [frame_clause])',
    usageDesc: '计算总体标准差，STDDEV_POP函数的别名',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。待计算总体标准差的表达式。DOUBLE类型或DECIMAL类型',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
      {
        label: 'frame_clause',
        desc: '可选。指定窗口的范围。',
      },
    ],
    returnDesc: '返回值类型同expr类型。所有expr为NULL时，返回结果为NULL。',
    example: 'select deptno, sal, stddev(sal) over (partition by deptno) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-e5h-3yz-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: false,
  },
  STDEVPOP: {
    name: 'STDEVPOP',
    simpleDesc: '计算总体标准差。',
    usageCommand:
      'stddev_pop([distinct] <expr>) over (…artition_clause] [orderby_clause] [frame_clause])',
    usageDesc: '计算总体标准差',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。待计算总体标准差的表达式。DOUBLE类型或DECIMAL类型',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
      {
        label: 'frame_clause',
        desc: '可选。指定窗口的范围。',
      },
    ],
    returnDesc: '返回值类型同expr类型。所有expr为NULL时，返回结果为NULL。',
    example: 'select deptno, sal, stddev_pop(sal) over (partition by deptno) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-e5h-3yz-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: false,
  },
  STDDEV_SAMP: {
    name: 'STDDEV_SAMP',
    simpleDesc: '计算样本标准差。',
    usageCommand:
      'stddev_samp([distinct] <expr>) over([partit…artition_clause] [orderby_clause] [frame_clause])',
    usageDesc: '计算样本标准差',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。待计算样本标准差的表达式。DOUBLE类型或DECIMAL类型',
      },
      {
        label: 'partition_clause',
        desc:
          'partition by <expression> [, ...] 可选。指定分区。分区列的值相同的行被视为在同一个窗口内。',
      },
      {
        label: 'orderby_clause',
        desc:
          'order by <expression> [asc|desc][nulls {first|last}] [, ...] 可选。指定数据在一个窗口内如何排序。',
      },
      {
        label: 'frame_clause',
        desc: '可选。指定窗口的范围。',
      },
    ],
    returnDesc:
      '返回值类型同expr类型。所有expr为NULL时，返回结果为NULL。窗口仅包含1条expr值非NULL的数据时，结果为0。',
    example: 'select deptno, sal, stddev_samp(sal) over (partition by deptno) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/34994.html#section-skf-2zz-vdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.RANGE,
    functionInHive: false,
  },
};
