import { AGGR_FUNCTIONS_ENUM, FUNCTION_DETAIL, ODPS_FUNCTION_TYPE_ENUM } from './definitions';

export const AGGR_FUNCTIONS: Record<AGGR_FUNCTIONS_ENUM, FUNCTION_DETAIL> = {
  AVG: {
    name: 'AVG',
    simpleDesc: '计算平均值。',
    usageCommand: 'avg(<colname>)',
    usageDesc: '  计算平均值。',
    paramDocs: [
      {
        label: 'colname',
        desc: '必填。列值支持所有数据类型，可以转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '如果colname值为NULL时，该行不参与计算。若输入为 DECIMAL则返回类型为DECIMAL，否则返回 DOUBLE',
    example: 'select avg(sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-o4c-4j6-uct',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  COUNT: {
    name: 'COUNT',
    simpleDesc: '计算记录数。',
    usageCommand: 'count([distinct | all] <colname>)',
    usageDesc: '  计算记录数。',
    paramDocs: [
      {
        label: 'colname',
        desc: '必填。列值可以为任意类型。colname可以为`*`，即count(*)，返回所有行数',
      },
    ],
    returnDesc: '返回BIGINT类型。colname值为NULL时，该行不参与计算。',
    example: 'select count(*) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-x1k-xq1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  COUNT_IF: {
    name: 'COUNT_IF',
    simpleDesc: '计算指定表达式为True的记录数。',
    usageCommand: 'count_if(boolean <expr>)',
    usageDesc: '  计算expr值为True的记录数。',
    paramDocs: [
      {
        label: 'expr',
        desc: '必填。BOOLEAN类型表达式。',
      },
    ],
    returnDesc: '返回BIGINT类型。expr值为False或expr中指定的列的值为NULL时，该行不参与计算。',
    example: 'select count_if(sal > 1000), count_if(sal <=1000) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-lgm-gjq-07p',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: false,
  },
  MAX: {
    name: 'MAX',
    simpleDesc: '计算最大值。',
    usageCommand: 'max(<colname>)',
    usageDesc: '计算最大值。',
    paramDocs: [
      {
        label: 'colname',
        desc: '必填。列值可以为除BOOLEAN外的任意类型。',
      },
    ],
    returnDesc: 'colname值为NULL时，该行不参与计算。colname为BOOLEAN类型时，不允许参与运算。',
    example: 'select max(sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-rys-tr1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  MIN: {
    name: 'MIN',
    simpleDesc: '计算最小值。',
    usageCommand: 'min(<colname>)',
    usageDesc: '计算最小值。',
    paramDocs: [
      {
        label: 'colname',
        desc: '必填。列值可以为除BOOLEAN外的任意类型。',
      },
    ],
    returnDesc: 'colname值为NULL时，该行不参与计算。colname为BOOLEAN类型时，不允许参与运算。',
    example: 'select min(sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-mll-yr1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  MEDIAN: {
    name: 'MEDIAN',
    simpleDesc: '计算中位数。',
    usageCommand: 'median(double | decimal <colname>)',
    usageDesc: '计算中位数。',
    paramDocs: [
      {
        label: 'colname',
        desc:
          '必填。列值可以为DOUBLE或DECIMAL类型。如果输入为STRING或BIGINT类型，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '如果colname值为NULL时，该行不参与计算。其他类型返回规则如下：若输入为 DECIMAL则返回类型为DECIMAL，否则返回 DOUBLE',
    example: 'select median(sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-m5y-cs1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: false,
  },
  STDDEV: {
    name: 'STDDEV',
    simpleDesc: '计算总体标准差。',
    usageCommand: 'stddev(double | decimal <colname>)',
    usageDesc: '计算总体标准差。',
    paramDocs: [
      {
        label: 'colname',
        desc:
          '必填。DOUBLE或DECIMAL类型。如果输入为STRING或BIGINT类型，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '如果colname值为NULL时，该行不参与计算。其他类型返回规则如下：若输入为 DECIMAL则返回类型为DECIMAL，否则返回 DOUBLE',
    example: 'select stddev(sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-gg5-dv1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  STDDEV_SAMP: {
    name: 'STDDEV_SAMP',
    simpleDesc: '计算样本标准差。',
    usageCommand: 'stddev_samp(double | decimal <colname>)',
    usageDesc: '计算样本标准差。',
    paramDocs: [
      {
        label: 'colname',
        desc:
          '必填。列值可以为DOUBLE或DECIMAL类型。如果输入为STRING或BIGINT类型，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '如果colname值为NULL时，该行不参与计算。其他类型返回规则如下：若输入为 DECIMAL则返回类型为DECIMAL，否则返回 DOUBLE',
    example: 'select stddev_samp(sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-sgk-jv1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  SUM: {
    name: 'SUM',
    simpleDesc: '计算汇总值。',
    usageCommand: 'sum(<colname>)',
    usageDesc: '计算汇总值。',
    paramDocs: [
      {
        label: 'colname',
        desc:
          '必填。列值支持所有数据类型，可以转换为DOUBLE类型后参与运算。列值可以为DOUBLE、DECIMAL或BIGINT类型。如果输入为STRING类型，会隐式转换为DOUBLE类型后参与运算。',
      },
    ],
    returnDesc:
      '如果colname值为NULL时，该行不参与计算。其他类型返回规则如下：TINYINT、SMALLINT、INT、BIGINT 的输入返回 BIGINT，FLOAT、DOUBLE 的输入返回 DOUBLE、DECIMAL 的输入返回 DECIMAL',
    example: 'select sum(sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-okf-4v1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  WM_CONCAT: {
    name: 'WM_CONCAT',
    simpleDesc: '用指定的分隔符连接字符串。',
    usageCommand: 'wm_concat(string <separator>, string <colname>)',
    usageDesc: '用指定的separator做分隔符，连接colname中的值。',
    paramDocs: [
      {
        label: 'separator',
        desc: '必填。STRING类型常量，分隔符。',
      },
      {
        label: 'colname',
        desc:
          '必填。STRING类型。如果输入为 BIGINT、DOUBLE 或 DATETIME 类型，会隐式转换为STRING类型后参与运算。',
      },
    ],
    returnDesc:
      '返回STRING类型。返回规则如下：separator非STRING类型常量时，返回报错。colname非STRING、BIGINT、DOUBLE或DATETIME类型时，返回报错。colname值为NULL时，该行不会参与计算。',
    example: "select wm_concat(',', ename) from emp;",
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-ddm-tv1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: false,
  },
  ANY_VALUE: {
    name: 'ANY_VALUE',
    simpleDesc: '在指定范围内任选一个值返回。',
    usageCommand: 'any_value(<colname>)',
    usageDesc: '在指定范围内任选一个值返回。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'colname',
        desc: '必填。需要统计去重的列。',
      },
    ],
    returnDesc: '返回值类型同colname对应值类型。colname值为NULL时，该行不参与计算。',
    example: 'select any_value(ename) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-gq4-i9o-wlo',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: false,
  },
  APPROX_DISTINCT: {
    name: 'APPROX_DISTINCT',
    simpleDesc: '返回输入的非重复值的近似数目。',
    usageCommand: 'approx_distinct(<colname>)',
    usageDesc: '计算指定列的非重复值的近似数目',
    paramDocs: [
      {
        label: 'colname',
        desc: '必填。需要统计去重的列。',
      },
    ],
    returnDesc: '返回BIGINT类型。此函数会产生5%的标准误差。colname值为NULL时，该行不参与计算。',
    example: 'select approx_distinct(sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-70u-fei-oad',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: false,
  },
  ARG_MAX: {
    name: 'ARG_MAX',
    simpleDesc: '返回指定列的最大值对应行的列值。',
    usageCommand: 'arg_max(<valueToMaximize>, <valueToReturn>)',
    usageDesc: '返回valueToMaximize最大值对应行的valueToReturn。',
    paramDocs: [
      {
        label: 'valueToMaximize',
        desc: '必填。可以为任意类型。',
      },
      {
        label: 'valueToReturn',
        desc: '必填。可以为任意类型。',
      },
    ],
    returnDesc:
      '返回值类型和valueToReturn类型相同，如果存在多行最大值时，随机返回最大值中的一行对应的值。valueToMaximize值为NULL时，该行不参与计算。',
    example: 'select arg_max(sal, ename) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-d1y-y37-885',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: false,
  },
  ARG_MIN: {
    name: 'ARG_MIN',
    simpleDesc: '返回指定列的最小值对应行的列值。',
    usageCommand: 'arg_min(<valueToMinimize>, <valueToReturn>)',
    usageDesc: '返回valueToMinimize最小值对应行的valueToReturn。',
    paramDocs: [
      {
        label: 'valueToMinimize',
        desc: '必填。可以为任意类型。',
      },
      {
        label: 'valueToReturn',
        desc: '必填。可以为任意类型。',
      },
    ],
    returnDesc:
      '返回值类型和valueToReturn类型相同，如果存在多行最小值时，随机返回最小值其中的一行对应的值。valueToMinimize值为NULL时，该行不参与计算。',
    example: 'select arg_min(sal, ename) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-wpd-rcy-ips',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: false,
  },
  MAX_BY: {
    name: 'MAX_BY',
    simpleDesc: '返回指定列的最大值对应行的列值。',
    usageCommand: 'max_by(<valueToReturn>, <valueToMaximize>)',
    usageDesc: '返回valueToMaximize最大值对应行的valueToReturn。',
    paramDocs: [
      {
        label: 'valueToMaximize',
        desc: '必填。可以为任意类型。',
      },
      {
        label: 'valueToReturn',
        desc: '必填。可以为任意类型。',
      },
    ],
    returnDesc:
      '返回值类型和valueToReturn类型相同，如果存在多行最大值时，随机返回最大值其中的一行对应的值。valueToMaximize值为NULL时，该行不参与计算。',
    example: 'select max_by(ename,sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-xx2-5jf-jek',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  MIN_BY: {
    name: 'MIN_BY',
    simpleDesc: '返回指定列的最小值对应行的列值。',
    usageCommand: 'min_by(<valueToReturn>, <valueToMinimize>)',
    usageDesc: '返回 valueToMinimize 最小值对应行的 valueToReturn。',
    paramDocs: [
      {
        label: 'valueToMinimize',
        desc: '必填。可以为任意类型。',
      },
      {
        label: 'valueToReturn',
        desc: '必填。可以为任意类型。',
      },
    ],
    returnDesc:
      '返回值类型和 valueToReturn 类型相同，如果存在多行最小值时，随机返回最小值其中的一行对应的值。valueToMinimize 值为  NULL时，该行不参与计算。',
    example: 'select min_by(ename,sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-8re-ac2-nuw',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  COLLECT_LIST: {
    name: 'COLLECT_LIST',
    simpleDesc: '将指定的列聚合为一个数组。',
    usageCommand: 'collect_list(colname)',
    usageDesc: '将colname指定的列值聚合为一个数组。',
    paramDocs: [
      {
        label: 'colname',
        desc: '必填。表的列名称，可以为任意类型。',
      },
    ],
    returnDesc: '返回ARRAY类型。colname值为NULL时，该行不参与计算。',
    example: 'select collect_list(sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-fth-1w1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  COLLECT_SET: {
    name: 'COLLECT_SET',
    simpleDesc: '将指定的列聚合为一个无重复元素的数组。',
    usageCommand: 'collect_set(<colname>)',
    usageDesc: '将 colname 指定的列值聚合为一个无重复元素的数组。',
    paramDocs: [
      {
        label: 'colname',
        desc: '必填。表的列名称，可以为任意类型。',
      },
    ],
    returnDesc: '返回ARRAY类型。colname值为NULL时，该行不参与计算。',
    example: 'select collect_set(sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-skl-fw1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  COVAR_POP: {
    name: 'COVAR_POP',
    simpleDesc: '计算指定两个数值列的总体协方差。',
    usageCommand: 'covar_pop(<colname1>, <colname2>)',
    usageDesc: '计算指定两个数值列的总体协方差。',
    paramDocs: [
      {
        label: 'colname1',
        desc: '必填。数据类型为数值类型的列。',
      },
      {
        label: 'colname2',
        desc: '必填。数据类型为数值类型的列。',
      },
    ],
    returnDesc: '返回 DOUBLE 类型，若输入类型不是数值类型，返回 NULL',
    example: 'select covar_pop(sal, sal_new) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-sal-3e0-zpf',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  COVAR_SAMP: {
    name: 'COVAR_SAMP',
    simpleDesc: '计算指定两个数值列的样本协方差。',
    usageCommand: 'covar_samp(<colname1>, <colname2>)',
    usageDesc: '计算指定两个数值列的样本协方差。',
    paramDocs: [
      {
        label: 'colname1',
        desc: '必填。数据类型为数值类型的列。',
      },
      {
        label: 'colname2',
        desc: '必填。数据类型为数值类型的列。',
      },
    ],
    returnDesc: '返回 DOUBLE 类型，若输入类型不是数值类型，返回 NULL',
    example: 'select covar_samp(sal, sal_new) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-7cp-io7-oy4',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  NUMERIC_HISTOGRAM: {
    name: 'NUMERIC_HISTOGRAM',
    simpleDesc: '统计指定列的近似直方图。',
    usageCommand: 'numeric_histogram(bigint <buckets>, double <colname>)',
    usageDesc: '统计指定列的近似直方图。此函数为MaxCompute 2.0扩展函数。',
    paramDocs: [
      {
        label: 'buckets',
        desc: 'BIGINT类型，表示返回的近似直方图列的最大个数。',
      },
      {
        label: 'colname',
        desc: '必填。DOUBLE类型，需要统计近似直方图的列。',
      },
    ],
    returnDesc:
      'map<double key, double value> 类型，返回值中 key 是近似直方图的X轴坐标点，value 是近似直方图的 Y 轴的近似高度。返回规则如下：buckets值为NULL时，返回NULL。colname值为NULL时，该行不参与计算。',
    example: 'select numeric_histogram(5, sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-ywu-uag-f4d',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  PERCENTILE: {
    name: 'PERCENTILE',
    simpleDesc: '计算精确百分位数，适用于小数据量。',
    usageCommand: 'percentile(bigint <colname>, <p>)',
    usageDesc:
      '计算精确百分位数，适用于小数据量。先对指定列升序排列，然后取精确的第p位百分数。p必须在0和1之间。',
    paramDocs: [
      {
        label: 'colname',
        desc: '必填。值为BIGINT类型的列',
      },
      {
        label: 'p',
        desc: '必填。需要精确的百分位数。取值为[0.0,1.0]',
      },
    ],
    returnDesc: '返回DOUBLE或ARRAY类型。',
    example: 'select percentile(sal, 0.3) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-zbp-2r7-qxf',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  PERCENTILE_APPROX: {
    name: 'PERCENTILE_APPROX',
    simpleDesc: '计算近似百分位数，适用于大数据量。',
    usageCommand: 'percentile_approx (double <colname>, <p>, <B>)',
    usageDesc:
      '计算近似百分位数，适用于大数据量。先对指定列升序排列，然后取第p位百分数对应的值。percentile_approx 是从编号1开始计算，例如某列数据为 100、200、300，列数据的编号顺序为1、2、3，计算该列的0.6百分位点，percentile_approx结果是3×0.6=1.8，即值位于编号1和2之间，结果为100+(200-100)×0.8=180。',
    paramDocs: [
      {
        label: 'colname',
        desc: '必填。值为DOUBLE类型的列',
      },
      {
        label: 'p',
        desc: '必填。需要近似的百分位数。取值为[0.0, 1.0]',
      },
      {
        label: 'B',
        desc: '可选，精度参数。精度越高产生的近似值误差越小。如果不设置该参数，默认值为 10000',
      },
    ],
    returnDesc:
      '返回DOUBLE或ARRAY类型。返回规则如下：colname值为NULL时，该行不参与计算。p或B值为NULL时，返回报错。',
    example: 'select percentile_approx(sal, 0.3) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-do0-b0t-s3q',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  VARIANCE: {
    name: 'VARIANCE',
    simpleDesc: '计算指定数值列的方差。',
    usageCommand: 'variance(<colname>)',
    usageDesc: '计算指定数值列的方差。',
    paramDocs: [
      {
        label: 'colname',
        desc: '必填。数据类型为数值的列。参数为其他类型的列返回NULL',
      },
    ],
    returnDesc: '返回DOUBLE类型。',
    example: 'select variance(sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-emm-lw1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  VAR_POP: {
    name: 'VAR_POP',
    simpleDesc: '计算指定数值列的方差。',
    usageCommand: 'var_pop(<colname>)',
    usageDesc: '计算指定数值列的方差。',
    paramDocs: [
      {
        label: 'colname',
        desc: '必填。数据类型为数值的列。参数为其他类型的列返回NULL。',
      },
    ],
    returnDesc: '返回DOUBLE类型。',
    example: 'select var_samp(sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-emm-lw1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  VAR_SAMP: {
    name: 'VAR_SAMP',
    simpleDesc: '计算指定数值列的样本方差。',
    usageCommand: 'var_samp(<colname>)',
    usageDesc: '计算指定数值列的样本方差。',
    paramDocs: [
      {
        label: 'colname',
        desc: '必填。数据类型为数值的列。其他类型返回NULL。',
      },
    ],
    returnDesc: '返回DOUBLE类型。',
    example: 'select var_samp(sal) from emp;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-dt5-tw1-wdb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  BITWISE_OR_AGG: {
    name: 'BITWISE_OR_AGG',
    simpleDesc: '计算输入Value的bit OR聚合值。',
    usageCommand: 'bitwise_or_agg(bigint <value>)',
    usageDesc: '对于输入的value，按照bit OR操作计算聚合值。',
    paramDocs: [
      {
        label: 'value',
        desc: '必填。BIGINT类型的值，NULL值不参与计算。',
      },
    ],
    returnDesc: '返回BIGINT类型。',
    example:
      'select id, bitwise_or_agg(v) from values (1L, 2L), (1L, 1L), (2L, null), (1L, null) t(id, v) group by id;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-13v-0il-281',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  BITWISE_AND_AGG: {
    name: 'BITWISE_AND_AGG',
    simpleDesc: '计算输入Value的bit AND聚合值。',
    usageCommand: 'bitwise_and_agg(bigint <value>)',
    usageDesc: '对于输入的value，按照bit AND操作计算聚合值。',
    paramDocs: [
      {
        label: 'value',
        desc: '必填。BIGINT类型的值，NULL值不参与计算。',
      },
    ],
    returnDesc: '返回BIGINT类型。',
    example:
      'select id, bitwise_and_agg(v) from values (1L, 2L), (1L, 1L), (2L, null), (1L, null) t(id, v) group by id;',
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-630-ibi-ssv',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  MAP_AGG: {
    name: 'MAP_AGG',
    simpleDesc: '构造两个输入字段的Map。',
    usageCommand: 'map_agg(K <key>, V <value>);',
    usageDesc:
      '使用输入的两个字段分别作为Key和Value来构造Map，以第一个字段作为Map的Key，以第二个字段作为Map的Value。如果key为NULL，则被忽略。如果Key的取值有重复，则会随机只保留其中的一个。',
    paramDocs: [
      {
        label: 'key',
        desc: '输入字段，将作为Map的Key。',
      },
      {
        label: 'value',
        desc: '输入字段，将作为Map的value。',
      },
    ],
    returnDesc: '返回构造的Map。',
    example:
      "select map_agg(a, b) from values (1L, 'apple'), (2L, 'hi'), (null, 'good'), (1L, 'pie') t(a, b);",
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-994-qgc-qhm',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  MULTIMAP_AGG: {
    name: 'MULTIMAP_AGG',
    simpleDesc: '构造两个输入字段的Map，第一个字段作为Map的Key，第二个字段构造数组作为Map的Value。',
    usageCommand: 'multimap_agg(K <key>, V <value>);',
    usageDesc:
      '使用输入的两个字段分别作为Key和Value来构造Map，以第一个字段作为Map的Key，以第二个字段构造数组来作为Map的Value。如果key为NULL，则被忽略。',
    paramDocs: [
      {
        label: 'key',
        desc: '输入字段，将作为Map的Key。',
      },
      {
        label: 'value',
        desc: '输入字段，相同Key的字段被放到同一个数组中作为Map的value。',
      },
    ],
    returnDesc: '返回构造的Map。',
    example:
      "select multimap_agg(a, b) from values (1L, 'apple'), (2L, 'hi'), (null, 'good'), (1L, 'pie') t(a, b);",
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-622-n30-anb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  MAP_UNION: {
    name: 'MAP_UNION',
    simpleDesc: '对输入Map进行Union操作来构造输出Map。',
    usageCommand: 'map_union(map<K, V> <input>)',
    usageDesc:
      '对输入Map进行Union操作构造输出Map，如果某一个Key在多个输入Map中都存在，则会随机只保留其中的一个。',
    paramDocs: [
      {
        label: 'input',
        desc: '输入Map。',
      },
    ],
    returnDesc: '返回构造的Map。',
    example:
      "select map_union(a) from values(map(1L, 'hi', 2L, 'apple', 3L, 'pie')), (map(1L, 'good', 4L, 'this')), (null) t(a);",
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-b4g-g6g-vjb',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  MAP_UNION_SUM: {
    name: 'MAP_UNION_SUM',
    simpleDesc: '对输入Map进行Union操作并对相同Key的Value求和来构造输出Map。',
    usageCommand: 'map_union_sum(map<K, V> <input>)',
    usageDesc:
      '对输入Map进行Union并对同一个Key的Value进行求和操作构造输出Map，如果某一个Key对应的 Value 为 NULL，则将其转换为0。',
    paramDocs: [
      {
        label: 'input',
        desc: '输入Map。',
      },
    ],
    returnDesc: '返回构造的Map。 输出Map的Value类型是BIGINT、DOUBLE、DECIMAL。',
    example:
      "select map_union_sum(a) from values(map('hi', 2L, 'apple', 3L, 'pie', 1L)), (map('apple', null, 'hi', 4L)), (null) t(a);",
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-2xl-t32-shn',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
  HISTOGRAM: {
    name: 'HISTOGRAM',
    simpleDesc: '构造输入Map的Key值出现次数的Map。',
    usageCommand: 'histogram(<input>)',
    usageDesc:
      '返回一个Map，Map的Key是输入input值，Map的Value是input值出现的次数。NULL 值将被忽略。',
    paramDocs: [
      {
        label: 'input',
        desc: '输入字段，将作为Map的Key。',
      },
    ],
    returnDesc: '返回构造的Map，描述每个input值出现的次数。',
    example: "select histogram(a) from values('hi'), (null), ('apple'), ('pie'), ('apple') t(a);",
    docUrl: 'https://help.aliyun.com/document_detail/48975.html#section-vyw-mw0-g5v',
    functionType: ODPS_FUNCTION_TYPE_ENUM.AGGR,
    functionInHive: true,
  },
};
