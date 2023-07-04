/**
 * @description 用于monaco对token进行分类
 */

// import { ODPSTokens, config as ODPSConfig } from './ODPS';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';


export var MonarchTokens = {
  builtinFunctions: [
      'AVG',
      'CHECKSUM_AGG',
      'COUNT',
      'COUNT_BIG',
      'GROUPING',
      'GROUPING_ID',
      'MAX',
      'MIN',
      'STDEV',
      'STDEVP',
      'VAR',
      'VARP',
      'CUME_DIST',
      'FIRST_VALUE',
      'LAG',
      'LAST_VALUE',
      'LEAD',
      'PERCENTILE_CONT',
      'PERCENTILE_DISC',
      'PERCENT_RANK',
      'COLLATE',
      'COLLATIONPROPERTY',
      'TERTIARY_WEIGHTS',
      'FEDERATION_FILTERING_VALUE',
      'CAST',
      'CONVERT',
      'PARSE',
      'TRY_CAST',
      'TRY_CONVERT',
      'TRY_PARSE',
      'ASYMKEY_ID',
      'ASYMKEYPROPERTY',
      'CERTPROPERTY',
      'CERT_ID',
      'CRYPT_GEN_RANDOM',
      'DECRYPTBYASYMKEY',
      'DECRYPTBYCERT',
      'DECRYPTBYKEY',
      'DECRYPTBYKEYAUTOASYMKEY',
      'DECRYPTBYKEYAUTOCERT',
      'DECRYPTBYPASSPHRASE',
      'ENCRYPTBYASYMKEY',
      'ENCRYPTBYCERT',
      'ENCRYPTBYKEY',
      'ENCRYPTBYPASSPHRASE',
      'HASHBYTES',
      'IS_OBJECTSIGNED',
      'KEY_GUID',
      'KEY_ID',
      'KEY_NAME',
      'SIGNBYASYMKEY',
      'SIGNBYCERT',
      'SYMKEYPROPERTY',
      'VERIFYSIGNEDBYCERT',
      'VERIFYSIGNEDBYASYMKEY',
      'CURSOR_STATUS',
      'DATALENGTH',
      'IDENT_CURRENT',
      'IDENT_INCR',
      'IDENT_SEED',
      'IDENTITY',
      'SQL_VARIANT_PROPERTY',
      'CURRENT_TIMESTAMP',
      'DATEADD',
      'DATEDIFF',
      'DATEFROMPARTS',
      'DATENAME',
      'DATEPART',
      'DATETIME2FROMPARTS',
      'DATETIMEFROMPARTS',
      'DATETIMEOFFSETFROMPARTS',
      'DAY',
      'EOMONTH',
      'GETDATE',
      'GETUTCDATE',
      'ISDATE',
      'MONTH',
      'SMALLDATETIMEFROMPARTS',
      'SWITCHOFFSET',
      'SYSDATETIME',
      'SYSDATETIMEOFFSET',
      'SYSUTCDATETIME',
      'TIMEFROMPARTS',
      'TODATETIMEOFFSET',
      'YEAR',
      'CHOOSE',
      'COALESCE',
      'IIF',
      'NULLIF',
      'ABS',
      'ACOS',
      'ASIN',
      'ATAN',
      'ATN2',
      'CEILING',
      'COS',
      'COT',
      'DEGREES',
      'EXP',
      'FLOOR',
      'LOG',
      'LOG10',
      'PI',
      'POWER',
      'RADIANS',
      'RAND',
      'ROUND',
      'SQUARE',
      'TAN',
      'APPLOCK_MODE',
      'APPLOCK_TEST',
      'ASSEMBLYPROPERTY',
      'COL_LENGTH',
      'COL_NAME',
      'COLUMNPROPERTY',
      'DATABASE_PRINCIPAL_ID',
      'DATABASEPROPERTYEX',
      'DB_ID',
      'DB_NAME',
      'FILE_ID',
      'FILE_IDEX',
      'FILE_NAME',
      'FILEGROUP_ID',
      'FILEGROUP_NAME',
      'FILEGROUPPROPERTY',
      'FILEPROPERTY',
      'FULLTEXTCATALOGPROPERTY',
      'FULLTEXTSERVICEPROPERTY',
      'INDEX_COL',
      'INDEXKEY_PROPERTY',
      'INDEXPROPERTY',
      'OBJECT_DEFINITION',
      'OBJECT_ID',
      'OBJECT_NAME',
      'OBJECT_SCHEMA_NAME',
      'OBJECTPROPERTY',
      'OBJECTPROPERTYEX',
      'ORIGINAL_DB_NAME',
      'PARSENAME',
      'SCHEMA_ID',
      'SCHEMA_NAME',
      'SCOPE_IDENTITY',
      'SERVERPROPERTY',
      'STATS_DATE',
      'TO_CHAR',
      'TO_DATE',
      'TYPE_ID',
      'TYPE_NAME',
      'TYPEPROPERTY',
      'DENSE_RANK',
      'NTILE',
      'RANK',
      'ROW_NUMBER',
      'PUBLISHINGSERVERNAME',
      'OPENDATASOURCE',
      'OPENQUERY',
      'OPENROWSET',
      'OPENXML',
      'CERTENCODED',
      'CERTPRIVATEKEY',
      'CURRENT_USER',
      'HAS_DBACCESS',
      'HAS_PERMS_BY_NAME',
      'IS_MEMBER',
      'IS_ROLEMEMBER',
      'IS_SRVROLEMEMBER',
      'LOGINPROPERTY',
      'ORIGINAL_LOGIN',
      'PERMISSIONS',
      'PWDENCRYPT',
      'PWDCOMPARE',
      'SESSION_USER',
      'SESSIONPROPERTY',
      'SUSER_ID',
      'SUSER_NAME',
      'SUSER_SID',
      'SUSER_SNAME',
      'SYSTEM_USER',
      'USER',
      'ASCII',
      'CHAR',
      'CHARINDEX',
      'CONCAT',
      'DIFFERENCE',
      'FORMAT',
      'LEN',
      'LOWER',
      'LTRIM',
      'NCHAR',
      'PATINDEX',
      'QUOTENAME',
      'REPLACE',
      'REPLICATE',
      'REVERSE',
      'RTRIM',
      'SPACE',
      'STR',
      'STUFF',
      'SUBSTR',
      'SUBSTRING',
      'UNICODE',
      'UPPER',
      'BINARY_CHECKSUM',
      'CHECKSUM',
      'CONNECTIONPROPERTY',
      'CONTEXT_INFO',
      'CURRENT_REQUEST_ID',
      'ERROR_LINE',
      'ERROR_NUMBER',
      'ERROR_MESSAGE',
      'ERROR_PROCEDURE',
      'ERROR_SEVERITY',
      'ERROR_STATE',
      'FORMATMESSAGE',
      'GETANSINULL',
      'GET_FILESTREAM_TRANSACTION_CONTEXT',
      'HOST_ID',
      'HOST_NAME',
      'ISNULL',
      'ISNUMERIC',
      'MIN_ACTIVE_ROWVERSION',
      'NEWID',
      'NEWSEQUENTIALID',
      'ROWCOUNT_BIG',
      'XACT_STATE',
      'TEXTPTR',
      'TEXTVALID',
      'COLUMNS_UPDATED',
      'EVENTDATA',
      'TRIGGER_NESTLEVEL',
      'UPDATE',
      'CHANGETABLE',
      'CHANGE_TRACKING_CONTEXT',
      'CHANGE_TRACKING_CURRENT_VERSION',
      'CHANGE_TRACKING_IS_COLUMN_IN_MASK',
      'CHANGE_TRACKING_MIN_VALID_VERSION',
      'CONTAINSTABLE',
      'FREETEXTTABLE',
      'SEMANTICKEYPHRASETABLE',
      'SEMANTICSIMILARITYDETAILSTABLE',
      'SEMANTICSIMILARITYTABLE',
      'FILETABLEROOTPATH',
      'GETFILENAMESPACEPATH',
      'GETPATHLOCATOR',
      'PATHNAME',
      'GET_TRANSMISSION_STATUS',
      'SEC_TO_TIME',
      'SHA',
      'SHA1',
      'SHA2',
      'SLEEP',
      'SQL_THREAD_WAIT_AFTER_GTIDS',
      'SIGN',
      'SIN',
      'SOUNDEX',
      'SQRT',
      'SRID',
      'STARTPOINT',
      'STRCMP',
      'STR_TO_DATE',
      'ST_AREA',
      'ST_ASBINARY',
      'ST_ASTEXT',
      'ST_ASWKB',
      'ST_ASWKT',
      'ST_BUFFER',
      'ST_CENTROID',
      'ST_CONTAINS',
      'ST_CROSSES',
      'ST_DIFFERENCE',
      'ST_DIMENSION',
      'SUM',
      'ST_DISJOINT',
      'ST_DISTANCE',
      'ST_ENDPOINT',
      'ST_ENVELOPE',
      'ST_EQUALS',
      'ST_EXTERIORRING',
      'ST_GEOMCOLLFROMTEXT',
      'ST_GEOMCOLLFROMTXT',
      'ST_GEOMCOLLFROMWKB',
      'ST_GEOMETRYCOLLECTIONFROMTEXT',
      'ST_GEOMETRYCOLLECTIONFROMWKB',
      'ST_GEOMETRYFROMTEXT',
      'ST_GEOMETRYFROMWKB',
      'ST_GEOMETRYN',
      'ST_GEOMETRYTYPE',
      'ST_GEOMFROMTEXT',
      'ST_GEOMFROMWKB',
      'ST_INTERIORRINGN',
      'ST_INTERSECTION',
      'ST_INTERSECTS',
      'ST_ISCLOSED',
      'ST_ISEMPTY',
      'ST_ISSIMPLE',
      'ST_LINEFROMTEXT',
      'ST_LINEFROMWKB',
      'ST_LINESTRINGFROMTEXT',
      'ST_LINESTRINGFROMWKB',
      'ST_NUMGEOMETRIES',
      'ST_NUMINTERIORRING',
      'ST_NUMINTERIORRINGS',
      'ST_NUMPOINTS',
      'ST_OVERLAPS',
      'ST_POINTFROMTEXT',
      'ST_POINTFROMWKB',
      'ST_POINTN',
      'ST_POLYFROMTEXT',
      'ST_POLYFROMWKB',
      'ST_POLYGONFROMTEXT',
      'ST_POLYGONFROMWKB',
      'ST_SRID',
      'ST_STARTPOINT',
      'ST_SYMDIFFERENCE',
      'ST_TOUCHES',
      'ST_UNION',
      'ST_WITHIN',
      'ST_X',
      'ST_Y',
      'SUBDATE',
      'SUBSTRING_INDEX',
      'SUBTIME',
      'TIMEDIFF',
      'TIMESTAMPADD',
      'TIMESTAMPDIFF',
      'TIME_FORMAT',
      'TIME_TO_SEC',
      'TOUCHES',
      'TO_BASE64',
      'TO_DAYS',
      'TO_SECONDS',
      'UCASE',
      'UNCOMPRESS',
      'UNCOMPRESSED_LENGTH',
      'UNHEX',
      'UNIX_TIMESTAMP',
      'UPDATEXML',
      'UUID',
      'UUID_SHORT',
      'VALIDATE_PASSWORD_STRENGTH',
      'VERSION',
      'WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS',
      'WEEKDAY',
      'WEEKOFYEAR',
      'WITHIN',
      'YEARWEEK',
      'ADDDATE',
      'ADDTIME',
      'AES_DECRYPT',
      'AES_ENCRYPT',
      'AREA',
      'ASBINARY',
      'ASTEXT',
      'ASWKB',
      'ASWKT',
      'ASYMMETRIC_DECRYPT',
      'ASYMMETRIC_DERIVE',
      'ASYMMETRIC_ENCRYPT',
      'ASYMMETRIC_SIGN',
      'ASYMMETRIC_VERIFY',
      'ATAN2',
      'BENCHMARK',
      'BIN',
      'BIT_COUNT',
      'BIT_LENGTH',
      'BUFFER',
      'CEIL',
      'CENTROID',
      'CHARACTER_LENGTH',
      'CHARSET',
      'CHAR_LENGTH',
      'COERCIBILITY',
      'COLLATION',
      'COMPRESS',
      'CONCAT_WS',
      'CONNECTION_ID',
      'CONV',
      'CONVERT_TZ',
      'CRC32',
      'CREATE_ASYMMETRIC_PRIV_KEY',
      'CREATE_ASYMMETRIC_PUB_KEY',
      'CREATE_DH_PARAMETERS',
      'CREATE_DIGEST',
      'CROSSES',
      'DATE',
      'DATE_FORMAT',
      'DAYNAME',
      'DAYOFMONTH',
      'DAYOFWEEK',
      'DAYOFYEAR',
      'DECODE',
      'DES_DECRYPT',
      'DES_ENCRYPT',
      'DIMENSION',
      'DISJOINT',
      'ELT',
      'ENCODE',
      'ENCRYPT',
      'ENDPOINT',
      'ENVELOPE',
      'EQUALS',
      'EXPORT_SET',
      'EXTERIORRING',
      'EXTRACTVALUE',
      'FIELD',
      'FIND_IN_SET',
      'FOUND_ROWS',
      'FROM_BASE64',
      'FROM_DAYS',
      'FROM_UNIXTIME',
      'GEOMCOLLFROMTEXT',
      'GEOMCOLLFROMWKB',
      'GEOMETRYCOLLECTION',
      'GEOMETRYCOLLECTIONFROMTEXT',
      'GEOMETRYCOLLECTIONFROMWKB',
      'GEOMETRYFROMTEXT',
      'GEOMETRYFROMWKB',
      'GEOMETRYN',
      'GEOMETRYTYPE',
      'GEOMFROMTEXT',
      'GEOMFROMWKB',
      'GET_FORMAT',
      'GET_LOCK',
      'GLENGTH',
      'GREATEST',
      'GTID_SUBSET',
      'GTID_SUBTRACT',
      'HEX',
      'HOUR',
      'IFNULL',
      'INET6_ATON',
      'INET6_NTOA',
      'INET_ATON',
      'INET_NTOA',
      'INSTR',
      'INTERIORRINGN',
      'INTERSECT',
      'ISCLOSED',
      'ISEMPTY',
      'ISSIMPLE',
      'IS_FREE_LOCK',
      'IS_IPV4',
      'IS_IPV4_COMPAT',
      'IS_IPV4_MAPPED',
      'IS_IPV6',
      'IS_USED_LOCK',
      'LAST_INSERT_ID',
      'LCASE',
      'LEAST',
      'LEFT',
      'LENGTH',
      'LINEFROMTEXT',
      'LINEFROMWKB',
      'LINESTRING',
      'LINESTRINGFROMTEXT',
      'LINESTRINGFROMWKB',
      'LN',
      'LOAD_FILE',
      'LOCATE',
      'LOG2',
      'LPAD',
      'MAKEDATE',
      'MAKETIME',
      'MAKE_SET',
      'MASTER_POS_WAIT',
      'MBRCONTAINS',
      'MBRDISJOINT',
      'MBREQUAL',
      'MBRINTERSECTS',
      'MBROVERLAPS',
      'MBRTOUCHES',
      'MBRWITHIN',
      'MD5',
      'MICROSECOND',
      'MINUTE',
      'MLINEFROMTEXT',
      'MLINEFROMWKB',
      'MONTHNAME',
      'MPOINTFROMTEXT',
      'MPOINTFROMWKB',
      'MPOLYFROMTEXT',
      'MPOLYFROMWKB',
      'MULTILINESTRING',
      'MULTILINESTRINGFROMTEXT',
      'MULTILINESTRINGFROMWKB',
      'MULTIPOINT',
      'MULTIPOINTFROMTEXT',
      'MULTIPOINTFROMWKB',
      'MULTIPOLYGON',
      'MULTIPOLYGONFROMTEXT',
      'MULTIPOLYGONFROMWKB',
      'NAME_CONST',
      'NUMGEOMETRIES',
      'NUMINTERIORRINGS',
      'NUMPOINTS',
      'OCT',
      'OCTET_LENGTH',
      'ORD',
      'OVERLAPS',
      'PERIOD_ADD',
      'PERIOD_DIFF',
      'POINT',
      'POINTFROMTEXT',
      'POINTFROMWKB',
      'POINTN',
      'POLYFROMTEXT',
      'POLYFROMWKB',
      'POLYGON',
      'POLYGONFROMTEXT',
      'POLYGONFROMWKB',
      'POSITION',
      'POW',
      'QUARTER',
      'QUOTE',
      'RANDOM_BYTES',
      'RELEASE_LOCK',
      'RIGHT',
      'ROW_COUNT',
      'RPAD',
      'SECOND',
      'Y_FUNCTION',
      'X_FUNCTION',
  ]
};

export var TokenEnum;
(function (TokenEnum) {
    TokenEnum["UNDERLINE"] = "UNDERLINE";
    TokenEnum["ESCAPE"] = "ESCAPE";
    TokenEnum["HintStart"] = "HintStart";
    TokenEnum["STRING_LITERAL"] = "STRING_LITERAL";
    TokenEnum["ASSIGN"] = "ASSIGN";
    TokenEnum["CONCATENATE"] = "CONCATENATE";
    TokenEnum["TILDE"] = "TILDE";
    TokenEnum["STAR"] = "STAR";
    TokenEnum["LOGICAL_SYMBOL"] = "LOGICAL_SYMBOL";
    TokenEnum["RCURLY"] = "RCURLY";
    TokenEnum["LCURLY"] = "LCURLY";
    TokenEnum["RSQUARE"] = "RSQUARE";
    TokenEnum["LSQUARE"] = "LSQUARE";
    TokenEnum["RPAREN"] = "RPAREN";
    TokenEnum["LPAREN"] = "LPAREN";
    TokenEnum["SEMICOLON"] = "SEMICOLON";
    TokenEnum["COMMA"] = "COMMA";
    TokenEnum["COLON"] = "COLON";
    TokenEnum["DOT"] = "DOT";
    TokenEnum["DIV"] = "DIV";
    TokenEnum["HUBTABLE"] = "HUBTABLE";
    TokenEnum["HUBLIFECYCLE"] = "HUBLIFECYCLE";
    TokenEnum["SHARDS"] = "SHARDS";
    TokenEnum["CLONE"] = "CLONE";
    TokenEnum["CONSTRAINT"] = "CONSTRAINT";
    TokenEnum["NATURAL"] = "NATURAL";
    TokenEnum["ANY"] = "ANY";
    TokenEnum["DEFAULT"] = "DEFAULT";
    TokenEnum["SELECTIVITY"] = "SELECTIVITY";
    TokenEnum["VARIABLES"] = "VARIABLES";
    TokenEnum["CACHEPROPERTIES"] = "CACHEPROPERTIES";
    TokenEnum["CACHE"] = "CACHE";
    TokenEnum["PRIVILEGEPROPERTIES"] = "PRIVILEGEPROPERTIES";
    TokenEnum["RECYCLEBIN"] = "RECYCLEBIN";
    TokenEnum["CHANGEOWNER"] = "CHANGEOWNER";
    TokenEnum["REDO"] = "REDO";
    TokenEnum["CHANGELOGS"] = "CHANGELOGS";
    TokenEnum["EXSTORE"] = "EXSTORE";
    TokenEnum["PARTITIONPROPERTIES"] = "PARTITIONPROPERTIES";
    TokenEnum["SMALLFILES"] = "SMALLFILES";
    TokenEnum["MERGE"] = "MERGE";
    TokenEnum["SETPROJECT"] = "SETPROJECT";
    TokenEnum["STATUS"] = "STATUS";
    TokenEnum["KILL"] = "KILL";
    TokenEnum["PY"] = "PY";
    TokenEnum["OFFLINEMODEL"] = "OFFLINEMODEL";
    TokenEnum["VOLUMEARCHIVE"] = "VOLUMEARCHIVE";
    TokenEnum["VOLUMEFILE"] = "VOLUMEFILE";
    TokenEnum["SUPER"] = "SUPER";
    TokenEnum["EXPIRED"] = "EXPIRED";
    TokenEnum["CLEAR"] = "CLEAR";
    TokenEnum["EXCEPTION"] = "EXCEPTION";
    TokenEnum["EXCEPT"] = "EXCEPT";
    TokenEnum["PROJECTPROTECTION"] = "PROJECTPROTECTION";
    TokenEnum["POLICY"] = "POLICY";
    TokenEnum["GET"] = "GET";
    TokenEnum["STATISTIC_LIST"] = "STATISTIC_LIST";
    TokenEnum["FLAGS"] = "FLAGS";
    TokenEnum["RESOURCES"] = "RESOURCES";
    TokenEnum["RESOURCE"] = "RESOURCE";
    TokenEnum["ACCOUNTPROVIDERS"] = "ACCOUNTPROVIDERS";
    TokenEnum["ACCOUNTPROVIDER"] = "ACCOUNTPROVIDER";
    TokenEnum["COUNT"] = "COUNT";
    TokenEnum["JOBS"] = "JOBS";
    TokenEnum["JOB"] = "JOB";
    TokenEnum["UNINSTALL"] = "UNINSTALL";
    TokenEnum["INSTALL"] = "INSTALL";
    TokenEnum["PACKAGES"] = "PACKAGES";
    TokenEnum["PACKAGE"] = "PACKAGE";
    TokenEnum["DISALLOW"] = "DISALLOW";
    TokenEnum["ALLOW"] = "ALLOW";
    TokenEnum["LABEL"] = "LABEL";
    TokenEnum["PRIVILEGES"] = "PRIVILEGES";
    TokenEnum["SECURITYCONFIGURATION"] = "SECURITYCONFIGURATION";
    TokenEnum["TRUSTEDPROJECTS"] = "TRUSTEDPROJECTS";
    TokenEnum["PROJECTS"] = "PROJECTS";
    TokenEnum["TRUSTEDPROJECT"] = "TRUSTEDPROJECT";
    TokenEnum["PROJECT"] = "PROJECT";
    TokenEnum["WHOAMI"] = "WHOAMI";
    TokenEnum["USERS"] = "USERS";
    TokenEnum["LIST"] = "LIST";
    TokenEnum["ACL"] = "ACL";
    TokenEnum["GRANTS"] = "GRANTS";
    TokenEnum["REMOVE"] = "REMOVE";
    TokenEnum["LIFECYCLE"] = "LIFECYCLE";
    TokenEnum["NEW"] = "NEW";
    TokenEnum["LOOP"] = "LOOP";
    TokenEnum["RETURNS"] = "RETURNS";
    TokenEnum["BEGIN"] = "BEGIN";
    TokenEnum["UDFPROPERTIES"] = "UDFPROPERTIES";
    TokenEnum["SECOND"] = "SECOND";
    TokenEnum["MINUTE"] = "MINUTE";
    TokenEnum["HOUR"] = "HOUR";
    TokenEnum["DAY"] = "DAY";
    TokenEnum["MONTH"] = "MONTH";
    TokenEnum["YEAR"] = "YEAR";
    TokenEnum["RELOAD"] = "RELOAD";
    TokenEnum["VALUES"] = "VALUES";
    TokenEnum["CONF"] = "CONF";
    TokenEnum["AUTHORIZATION"] = "AUTHORIZATION";
    TokenEnum["REWRITE"] = "REWRITE";
    TokenEnum["TRANSACTIONS"] = "TRANSACTIONS";
    TokenEnum["COMPACTIONS"] = "COMPACTIONS";
    TokenEnum["COMPACT"] = "COMPACT";
    TokenEnum["PRINCIPALS"] = "PRINCIPALS";
    TokenEnum["OWNER"] = "OWNER";
    TokenEnum["ADMIN"] = "ADMIN";
    TokenEnum["URI"] = "URI";
    TokenEnum["EXCHANGE"] = "EXCHANGE";
    TokenEnum["INNER"] = "INNER";
    TokenEnum["ROLES"] = "ROLES";
    TokenEnum["ROLE"] = "ROLE";
    TokenEnum["USER"] = "USER";
    TokenEnum["PARTIALSCAN"] = "PARTIALSCAN";
    TokenEnum["NOSCAN"] = "NOSCAN";
    TokenEnum["TRUNCATE"] = "TRUNCATE";
    TokenEnum["SETS"] = "SETS";
    TokenEnum["GROUPING"] = "GROUPING";
    TokenEnum["CURRENT_TIMESTAMP"] = "CURRENT_TIMESTAMP";
    TokenEnum["CURRENT_DATE"] = "CURRENT_DATE";
    TokenEnum["LOCALTIMESTAMP"] = "LOCALTIMESTAMP";
    TokenEnum["CURRENT"] = "CURRENT";
    TokenEnum["FOLLOWING"] = "FOLLOWING";
    TokenEnum["PRECEDING"] = "PRECEDING";
    TokenEnum["UNBOUNDED"] = "UNBOUNDED";
    TokenEnum["WINDOW"] = "WINDOW";
    TokenEnum["DIRECTORIES"] = "DIRECTORIES";
    TokenEnum["CUBE"] = "CUBE";
    TokenEnum["ROLLUP"] = "ROLLUP";
    TokenEnum["SKEWED"] = "SKEWED";
    TokenEnum["CASCADE"] = "CASCADE";
    TokenEnum["RESTRICT"] = "RESTRICT";
    TokenEnum["UPDATE"] = "UPDATE";
    TokenEnum["OPTION"] = "OPTION";
    TokenEnum["USE"] = "USE";
    TokenEnum["EXPRESSION_CONDITION"] = "EXPRESSION_CONDITION";
    TokenEnum["COLUMN_MIN"] = "COLUMN_MIN";
    TokenEnum["COLUMN_MAX"] = "COLUMN_MAX";
    TokenEnum["COLUMN_SUM"] = "COLUMN_SUM";
    TokenEnum["TABLE_COUNT"] = "TABLE_COUNT";
    TokenEnum["DISTINCT_VALUE"] = "DISTINCT_VALUE";
    TokenEnum["NULL_VALUE"] = "NULL_VALUE";
    TokenEnum["STATISTICS"] = "STATISTICS";
    TokenEnum["STATISTIC"] = "STATISTIC";
    TokenEnum["COMPUTE"] = "COMPUTE";
    TokenEnum["UNARCHIVE"] = "UNARCHIVE";
    TokenEnum["ARCHIVE"] = "ARCHIVE";
    TokenEnum["TOUCH"] = "TOUCH";
    TokenEnum["LATERAL"] = "LATERAL";
    TokenEnum["ANTI"] = "ANTI";
    TokenEnum["SEMI"] = "SEMI";
    TokenEnum["RECORDWRITER"] = "RECORDWRITER";
    TokenEnum["RECORDREADER"] = "RECORDREADER";
    TokenEnum["TRIGGER"] = "TRIGGER";
    TokenEnum["CURSOR"] = "CURSOR";
    TokenEnum["CROSS"] = "CROSS";
    TokenEnum["BINARY"] = "BINARY";
    TokenEnum["BOTH"] = "BOTH";
    TokenEnum["BETWEEN"] = "BETWEEN";
    TokenEnum["ANALYZE"] = "ANALYZE";
    TokenEnum["RANGE"] = "RANGE";
    TokenEnum["PURGE"] = "PURGE";
    TokenEnum["READS"] = "READS";
    TokenEnum["WHILE"] = "WHILE";
    TokenEnum["UNSIGNED"] = "UNSIGNED";
    TokenEnum["PROCEDURE"] = "PROCEDURE";
    TokenEnum["EXCLUSIVE"] = "EXCLUSIVE";
    TokenEnum["SHARED"] = "SHARED";
    TokenEnum["UNLOCK"] = "UNLOCK";
    TokenEnum["LOCKS"] = "LOCKS";
    TokenEnum["LOCK"] = "LOCK";
    TokenEnum["UNDO"] = "UNDO";
    TokenEnum["SSL"] = "SSL";
    TokenEnum["REVOKE"] = "REVOKE";
    TokenEnum["GRANT"] = "GRANT";
    TokenEnum["SCHEMAS"] = "SCHEMAS";
    TokenEnum["SCHEMA"] = "SCHEMA";
    TokenEnum["DATABASES"] = "DATABASES";
    TokenEnum["DATABASE"] = "DATABASE";
    TokenEnum["VIEW"] = "VIEW";
    TokenEnum["INTERSECT"] = "INTERSECT";
    TokenEnum["FETCH"] = "FETCH";
    TokenEnum["DELETE"] = "DELETE";
    TokenEnum["LONG"] = "LONG";
    TokenEnum["UTCTIMESTAMP"] = "UTCTIMESTAMP";
    TokenEnum["UTC"] = "UTC";
    TokenEnum["HOLD_DDLTIME"] = "HOLD_DDLTIME";
    TokenEnum["STREAMTABLE"] = "STREAMTABLE";
    TokenEnum["DYNAMICFILTER"] = "DYNAMICFILTER";
    TokenEnum["MAPJOIN"] = "MAPJOIN";
    TokenEnum["ELSE"] = "ELSE";
    TokenEnum["THEN"] = "THEN";
    TokenEnum["WHEN"] = "WHEN";
    TokenEnum["CASE"] = "CASE";
    TokenEnum["DEFINED"] = "DEFINED";
    TokenEnum["IDXPROPERTIES"] = "IDXPROPERTIES";
    TokenEnum["TBLPROPERTIES"] = "TBLPROPERTIES";
    TokenEnum["UNSET"] = "UNSET";
    TokenEnum["OFFSET"] = "OFFSET";
    TokenEnum["SET"] = "SET";
    TokenEnum["DBPROPERTIES"] = "DBPROPERTIES";
    TokenEnum["SERDEPROPERTIES"] = "SERDEPROPERTIES";
    TokenEnum["DEFERRED"] = "DEFERRED";
    TokenEnum["WITH"] = "WITH";
    TokenEnum["SERDE"] = "SERDE";
    TokenEnum["LOGICAL"] = "LOGICAL";
    TokenEnum["DEPENDENCY"] = "DEPENDENCY";
    TokenEnum["PRETTY"] = "PRETTY";
    TokenEnum["FORMATTED"] = "FORMATTED";
    TokenEnum["EXTENDED"] = "EXTENDED";
    TokenEnum["END"] = "END";
    TokenEnum["EXPLAIN"] = "EXPLAIN";
    TokenEnum["JAR"] = "JAR";
    TokenEnum["MACRO"] = "MACRO";
    TokenEnum["TEMPORARY"] = "TEMPORARY";
    TokenEnum["REGEXP"] = "REGEXP";
    TokenEnum["RLIKE"] = "RLIKE";
    TokenEnum["REPLACE"] = "REPLACE";
    TokenEnum["ADD"] = "ADD";
    TokenEnum["CAST"] = "CAST";
    TokenEnum["PERCENT"] = "PERCENT";
    TokenEnum["TABLESAMPLE"] = "TABLESAMPLE";
    TokenEnum["LOCATION"] = "LOCATION";
    TokenEnum["NO_DROP"] = "NO_DROP";
    TokenEnum["READONLY"] = "READONLY";
    TokenEnum["READ"] = "READ";
    TokenEnum["DISABLE"] = "DISABLE";
    TokenEnum["ENABLE"] = "ENABLE";
    TokenEnum["OFFLINE"] = "OFFLINE";
    TokenEnum["OF"] = "OF";
    TokenEnum["OUTPUTDRIVER"] = "OUTPUTDRIVER";
    TokenEnum["INPUTDRIVER"] = "INPUTDRIVER";
    TokenEnum["OUTPUTFORMAT"] = "OUTPUTFORMAT";
    TokenEnum["INPUTFORMAT"] = "INPUTFORMAT";
    TokenEnum["PUT"] = "PUT";
    TokenEnum["FILEFORMAT"] = "FILEFORMAT";
    TokenEnum["FILE"] = "FILE";
    TokenEnum["STORED"] = "STORED";
    TokenEnum["LINES"] = "LINES";
    TokenEnum["KEYS"] = "KEYS";
    TokenEnum["ITEMS"] = "ITEMS";
    TokenEnum["COLLECTION"] = "COLLECTION";
    TokenEnum["ESCAPED"] = "ESCAPED";
    TokenEnum["TERMINATED"] = "TERMINATED";
    TokenEnum["FIELDS"] = "FIELDS";
    TokenEnum["DELIMITED"] = "DELIMITED";
    TokenEnum["LIMIT"] = "LIMIT";
    TokenEnum["FORMAT"] = "FORMAT";
    TokenEnum["ROWS"] = "ROWS";
    TokenEnum["ROW"] = "ROW";
    TokenEnum["BUCKETS"] = "BUCKETS";
    TokenEnum["BUCKET"] = "BUCKET";
    TokenEnum["INTO"] = "INTO";
    TokenEnum["SORTED"] = "SORTED";
    TokenEnum["CLUSTERED"] = "CLUSTERED";
    TokenEnum["PARTITIONED"] = "PARTITIONED";
    TokenEnum["REDUCE"] = "REDUCE";
    TokenEnum["UNIONTYPE"] = "UNIONTYPE";
    TokenEnum["TYPE"] = "TYPE";
    TokenEnum["MAP"] = "MAP";
    TokenEnum["STRUCT"] = "STRUCT";
    TokenEnum["VIRTUAL"] = "VIRTUAL";
    TokenEnum["ARRAY"] = "ARRAY";
    TokenEnum["VARCHAR"] = "VARCHAR";
    TokenEnum["CHAR"] = "CHAR";
    TokenEnum["STRING"] = "STRING";
    TokenEnum["DECIMAL"] = "DECIMAL";
    TokenEnum["INTERVAL"] = "INTERVAL";
    TokenEnum["TIMESTAMP"] = "TIMESTAMP";
    TokenEnum["DATETIME"] = "DATETIME";
    TokenEnum["DATE"] = "DATE";
    TokenEnum["DOUBLE"] = "DOUBLE";
    TokenEnum["FLOAT"] = "FLOAT";
    TokenEnum["BIGINT"] = "BIGINT";
    TokenEnum["SMALLINT"] = "SMALLINT";
    TokenEnum["TINYINT"] = "TINYINT";
    TokenEnum["INT"] = "INT";
    TokenEnum["BOOLEAN"] = "BOOLEAN";
    TokenEnum["COMMENT"] = "COMMENT";
    TokenEnum["PROTECTION"] = "PROTECTION";
    TokenEnum["IGNORE"] = "IGNORE";
    TokenEnum["RENAME"] = "RENAME";
    TokenEnum["DROP"] = "DROP";
    TokenEnum["DESCRIBE"] = "DESCRIBE";
    TokenEnum["AFTER"] = "AFTER";
    TokenEnum["NULLS"] = "NULLS";
    TokenEnum["LAST"] = "LAST";
    TokenEnum["FIRST"] = "FIRST";
    TokenEnum["CHANGE"] = "CHANGE";
    TokenEnum["ALTER"] = "ALTER";
    TokenEnum["EXTERNAL"] = "EXTERNAL";
    TokenEnum["CREATE"] = "CREATE";
    TokenEnum["NULL"] = "NULL";
    TokenEnum["INPATH"] = "INPATH";
    TokenEnum["METADATA"] = "METADATA";
    TokenEnum["DATA"] = "DATA";
    TokenEnum["REPLICATION"] = "REPLICATION";
    TokenEnum["IMPORT"] = "IMPORT";
    TokenEnum["EXPORT"] = "EXPORT";
    TokenEnum["EXP"] = "EXP";
    TokenEnum["LOAD"] = "LOAD";
    TokenEnum["MINUS"] = "MINUS";
    TokenEnum["UNION"] = "UNION";
    TokenEnum["SORT"] = "SORT";
    TokenEnum["DISTRIBUTE"] = "DISTRIBUTE";
    TokenEnum["CLUSTER"] = "CLUSTER";
    TokenEnum["USING"] = "USING";
    TokenEnum["TRANSFORM"] = "TRANSFORM";
    TokenEnum["FOR"] = "FOR";
    TokenEnum["LOCAL"] = "LOCAL";
    TokenEnum["DIRECTORY"] = "DIRECTORY";
    TokenEnum["TO"] = "TO";
    TokenEnum["REPAIR"] = "REPAIR";
    TokenEnum["MSCK"] = "MSCK";
    TokenEnum["SHOW"] = "SHOW";
    TokenEnum["FUNCTIONS"] = "FUNCTIONS";
    TokenEnum["FUNCTION"] = "FUNCTION";
    TokenEnum["REBUILD"] = "REBUILD";
    TokenEnum["INDEXES"] = "INDEXES";
    TokenEnum["INDEX"] = "INDEX";
    TokenEnum["COLUMNS"] = "COLUMNS";
    TokenEnum["COLUMN"] = "COLUMN";
    TokenEnum["TABLES"] = "TABLES";
    TokenEnum["TABLE"] = "TABLE";
    TokenEnum["PARTITIONS"] = "PARTITIONS";
    TokenEnum["PARTITION"] = "PARTITION";
    TokenEnum["FULL"] = "FULL";
    TokenEnum["RIGHT"] = "RIGHT";
    TokenEnum["LEFT"] = "LEFT";
    TokenEnum["PRESERVE"] = "PRESERVE";
    TokenEnum["UNIQUEJOIN"] = "UNIQUEJOIN";
    TokenEnum["JOIN"] = "JOIN";
    TokenEnum["OUTER"] = "OUTER";
    TokenEnum["OUT"] = "OUT";
    TokenEnum["OVERWRITE"] = "OVERWRITE";
    TokenEnum["OVER"] = "OVER";
    TokenEnum["INSERT"] = "INSERT";
    TokenEnum["DISTINCT"] = "DISTINCT";
    TokenEnum["SELECT"] = "SELECT";
    TokenEnum["FROM"] = "FROM";
    TokenEnum["WHERE"] = "WHERE";
    TokenEnum["HAVING"] = "HAVING";
    TokenEnum["IN"] = "IN";
    TokenEnum["BY"] = "BY";
    TokenEnum["GROUPS"] = "GROUPS";
    TokenEnum["GROUP"] = "GROUP";
    TokenEnum["P"] = "P";
    TokenEnum["ORDER"] = "ORDER";
    TokenEnum["DESC"] = "DESC";
    TokenEnum["ASC"] = "ASC";
    TokenEnum["AS"] = "AS";
    TokenEnum["EXISTS"] = "EXISTS";
    TokenEnum["IS"] = "IS";
    TokenEnum["IF"] = "IF";
    TokenEnum["LIKE"] = "LIKE";
    TokenEnum["NOT"] = "NOT";
    TokenEnum["OR"] = "OR";
    TokenEnum["AND"] = "AND";
    TokenEnum["NONE"] = "NONE";
    TokenEnum["ON"] = "ON";
    TokenEnum["ALL"] = "ALL";
    TokenEnum["FALSE"] = "FALSE";
    TokenEnum["TRUE"] = "TRUE";
    TokenEnum["COMMON_STRING"] = "COMMON_STRING";
    TokenEnum["SKIPCOMMENT"] = "SKIPCOMMENT";
})(TokenEnum || (TokenEnum = {}));


export const ODPSTokens = (customSetting: Record<string, string[]> = {}) => {
  const customKeys = Object.keys(customSetting ?? {}).reduce((res, key) => {
    return {
      ...res,
      [`@${key}`]: key,
    };
  }, {});

  return {
    defaultToken: '',
    tokenPostfix: '.odpssql',
    ignoreCase: true,
    ...customSetting,
    keywords: Object.keys(TokenEnum).concat(
      Object.keys(TokenEnum).map(key => key.toLowerCase()),
    ),
    builtinFunctions: MonarchTokens.builtinFunctions,
    tokenizer: {
      root: [
        { include: '@comments' },
        { include: '@numbers' },
        { include: '@strings' },
        { include: '@operator' },
        { include: '@escapeId' },
        [
          /[\w@#$]+/,
          {
            cases: {
              ...customKeys,
              '@keywords': 'keywords',
              '@builtinFunctions': 'builtinFunctions',
            },
          },
        ],
      ],
      // 屏蔽字段名被识别成关键词时的高亮
      escapeId: [
        [/[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+/, ''],
        [/`[a-zA-Z0-9]+`/, ''],
      ],
      comments: [
        [/--+.*/, 'comment'],
        [/\/\*/, { token: 'comment.quote', next: '@comment' }],
        // [/##+.*/,'commant']
      ],
      comment: [
        [/[^*/]+/, 'comment'],
        // Not supporting nested comments, as nested comments seem to not be standard?
        // i.e. http://stackoverflow.com/questions/728172/are-there-multiline-comment-delimiters-in-sql-that-are-vendor-agnostic
        // [/\/\*/, { token: 'comment.quote', next: '@push' }],    // nested comment not allowed :-(
        [/\*\//, { token: 'comment.quote', next: '@pop' }],
        [/./, 'comment'],
      ],
      numbers: [
        [/0[xX][0-9a-fA-F]*/, 'number'],
        [/[$][+-]*\d*(\.\d*)?/, 'number'],
        [/((\d+(\.\d*)?)|(\.\d+))([eE][\-+]?\d+)?/, 'number'],
      ],
      strings: [
        [/N'/, { token: 'string', next: '@string' }],
        [/'/, { token: 'string', next: '@string' }],
        [/N"/, { token: 'string', next: '@quotedIdentifier' }],
        [/"/, { token: 'string', next: '@quotedIdentifier' }],
      ],
      string: [
        [/(\\.|[^'\\])+/, 'string'],
        [/''/, 'string'],
        [/'/, { token: 'string', next: '@pop' }],
      ],
      quotedIdentifier: [
        [/(\\.|[^"\\])+/, 'string'],
        [/""/, 'string'],
        [/"/, { token: 'string', next: '@pop' }],
      ],
      operator: [[/[>|<|=|>=|<=|%|+|-|/|<>]/, 'operator']],

      // function: [
      // 	[/[a-zA-Z][a-zA-Z1-9_-]*\([a-zA-Z\.]*(,\s*[a-zA-Z\.]*)*\)/, 'function']
      // ]
    },
  } as monaco.languages.IMonarchLanguage;
};
export const config = {
  comments: {
    lineComment: '--',
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['(', ')'],
    ['{', '}'],
    ['[', ']'],
  ],
  // 输入前缀，自动加上后缀
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  // 用于选中文案，输入前缀时自动补全后缀，
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
} as monaco.languages.LanguageConfiguration;

export const globalConfig = {
  ODPSSQL: {
    tokens: ODPSTokens,
    config: config,
  },
  OB: {
    tokens: ODPSTokens,
    config: config,
  }

};
