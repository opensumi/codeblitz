grammar OB3XParser;
//基于OBMySqlv_3.2.3版本构建

// start rule: sql_stmt_list

sql_stmt_list
    : sql_stmt+
    ;

sql_stmt
    : DELIMITER
    | stmt EOF
    | stmt DELIMITER EOF?
    ;

stmt
    : select_stmt
    | insert_stmt
    | create_table_stmt
    | create_function_stmt
    | drop_function_stmt
    | create_table_like_stmt
    | create_database_stmt
    | drop_database_stmt
    | alter_database_stmt
    | use_database_stmt
    | update_stmt
    | delete_stmt
    | drop_table_stmt
    | drop_view_stmt
    | explain_stmt
    | create_outline_stmt
    | alter_outline_stmt
    | drop_outline_stmt
    | show_stmt
    | prepare_stmt
    | variable_set_stmt
    | execute_stmt
    | alter_table_stmt
    | alter_system_stmt
    | audit_stmt
    | deallocate_prepare_stmt
    | create_user_stmt
    | drop_user_stmt
    | set_password_stmt
    | rename_user_stmt
    | lock_user_stmt
    | grant_stmt
    | revoke_stmt
    | begin_stmt
    | commit_stmt
    | rollback_stmt
    | create_tablespace_stmt
    | drop_tablespace_stmt
    | alter_tablespace_stmt
    | rotate_master_key_stmt
    | create_index_stmt
    | drop_index_stmt
    | kill_stmt
    | help_stmt
    | create_view_stmt
    | create_tenant_stmt
    | alter_tenant_stmt
    | drop_tenant_stmt
    | create_restore_point_stmt
    | drop_restore_point_stmt
    | create_resource_stmt
    | alter_resource_stmt
    | drop_resource_stmt
    | set_names_stmt
    | set_charset_stmt
    | create_tablegroup_stmt
    | drop_tablegroup_stmt
    | alter_tablegroup_stmt
    | rename_table_stmt
    | truncate_table_stmt
    | set_transaction_stmt
    | create_savepoint_stmt
    | rollback_savepoint_stmt
    | release_savepoint_stmt
    | lock_tables_stmt
    | unlock_tables_stmt
    | flashback_stmt
    | purge_stmt
    | analyze_stmt
    | load_data_stmt
    | create_sequence_stmt
    | alter_sequence_stmt
    | drop_sequence_stmt
    | xa_begin_stmt
    | xa_end_stmt
    | xa_prepare_stmt
    | xa_commit_stmt
    | xa_rollback_stmt
    | switchover_cluster_stmt
    | disconnect_cluster_stmt
    | alter_cluster_stmt
    | optimize_stmt
    | dump_memory_stmt
    | protection_mode_stmt
    ;

expr_list
    : expr (Comma expr)*
    ;

expr_as_list
    : expr_with_opt_alias (Comma expr_with_opt_alias)*
    ;

expr_with_opt_alias
    : expr
    | expr AS? (column_label|STRING_VALUE)
    ;

column_ref
    : column_name
    | (Dot?|relation_name Dot) (relation_name|mysql_reserved_keyword) Dot (column_name|mysql_reserved_keyword|Star)
    ;

complex_string_literal
    : charset_introducer? STRING_VALUE
    | charset_introducer PARSER_SYNTAX_ERROR
    ;

charset_introducer
    : UnderlineUTF8
    | UnderlineUTF8MB4
    | UnderlineBINARY
    | UnderlineGBK
    | UnderlineGB18030
    | UnderlineUTF16
    ;

literal
    : complex_string_literal
    | DATE_VALUE
    | TIMESTAMP_VALUE
    | INTNUM
    | HEX_STRING_VALUE
    | APPROXNUM
    | DECIMAL_VAL
    | BOOL_VALUE
    | NULLX
    | PARSER_SYNTAX_ERROR
    ;

number_literal
    : INTNUM
    | DECIMAL_VAL
    ;

expr_const
    : literal
    | SYSTEM_VARIABLE
    | QUESTIONMARK
    | global_or_session_alias Dot column_name
    ;

conf_const
    : STRING_VALUE
    | DATE_VALUE
    | TIMESTAMP_VALUE
    | Minus? INTNUM
    | APPROXNUM
    | Minus? DECIMAL_VAL
    | BOOL_VALUE
    | NULLX
    | SYSTEM_VARIABLE
    | global_or_session_alias Dot column_name
    ;

global_or_session_alias
    : GLOBAL_ALIAS
    | SESSION_ALIAS
    ;

bool_pri
    : predicate
    | bool_pri (COMP_EQ|COMP_GE|COMP_GT|COMP_LE|COMP_LT|COMP_NE|COMP_NSEQ) predicate
    | bool_pri IS not? NULLX
    | bool_pri (COMP_EQ|COMP_GE|COMP_GT|COMP_LE|COMP_LT|COMP_NE) (ALL|ANY|SOME) LeftParen select_no_parens RightParen
    ;


predicate
    : bit_expr not? IN in_expr
    | bit_expr not? BETWEEN bit_expr AND predicate
    | bit_expr not? LIKE (string_val_list|simple_expr) ((ESCAPE simple_expr)?|ESCAPE string_val_list)
    | bit_expr not? REGEXP (string_val_list|bit_expr)
    | bit_expr MEMBER OF LeftParen simple_expr RightParen
    | bit_expr
    ;

string_val_list
    : STRING_VALUE+
    ;

bit_expr
    : simple_expr
    | bit_expr (And|Caret|DIV|Div|MOD|Minus|Mod|Or|Plus|SHIFT_LEFT|SHIFT_RIGHT|Star) bit_expr
    | bit_expr (Minus|Plus) INTERVAL expr date_unit
    ;

simple_expr
    : simple_expr collation
    | column_ref
    | expr_const
    | simple_expr CNNOP simple_expr
    | (BINARY|Plus|Minus|Tilde|Not|NOT) simple_expr
    | ROW? LeftParen expr_list RightParen
    | EXISTS? select_with_parens
    | MATCH LeftParen column_list RightParen AGAINST LeftParen STRING_VALUE ((IN NATURAL LANGUAGE MODE) | (IN BOOLEAN MODE))? RightParen
    | case_expr
    | func_expr
    | window_function
    | USER_VARIABLE
    | column_definition_ref (JSON_EXTRACT|JSON_EXTRACT_UNQUOTED) complex_string_literal
    ;

expr
    : (NOT|USER_VARIABLE SET_VAR) expr
    | bool_pri (IS not? (BOOL_VALUE|UNKNOWN))?
    | expr (AND|AND_OP|CNNOP|OR|XOR) expr
    ;

not
    : NOT
    ;


//sub_query_flag
//    : ALL
//    | ANY
//    | SOME
//    ;

in_expr
    : select_with_parens
    | LeftParen expr_list RightParen
    ;

case_expr
    : CASE expr? when_clause_list case_default END
    ;

window_function
    : COUNT LeftParen ALL? (Star|expr) RightParen OVER new_generalized_window_clause
    | COUNT LeftParen DISTINCT expr_list RightParen OVER new_generalized_window_clause
    | (APPROX_COUNT_DISTINCT|APPROX_COUNT_DISTINCT_SYNOPSIS|NTILE) LeftParen expr_list RightParen OVER new_generalized_window_clause
    | (SUM|MAX|MIN|AVG|JSON_ARRAYAGG|APPROX_COUNT_DISTINCT_SYNOPSIS_MERGE) LeftParen (ALL | DISTINCT | UNIQUE)? expr RightParen OVER new_generalized_window_clause
    | JSON_OBJECTAGG LeftParen expr Comma expr RightParen OVER new_generalized_window_clause
    | (STD|STDDEV|VARIANCE|STDDEV_POP|STDDEV_SAMP|VAR_POP|VAR_SAMP) LeftParen ALL? expr RightParen OVER new_generalized_window_clause
    | (GROUP_CONCAT|LISTAGG) LeftParen (DISTINCT | UNIQUE)? expr_list order_by? (SEPARATOR STRING_VALUE)? RightParen OVER new_generalized_window_clause
    | (RANK|DENSE_RANK|PERCENT_RANK|ROW_NUMBER|CUME_DIST) LeftParen RightParen OVER new_generalized_window_clause
    | (FIRST_VALUE|LAST_VALUE|LEAD|LAG) win_fun_first_last_params OVER new_generalized_window_clause
    | NTH_VALUE LeftParen expr Comma expr RightParen (FROM first_or_last)? (respect_or_ignore NULLS)? OVER new_generalized_window_clause
    | TOP_K_FRE_HIST LeftParen bit_expr Comma bit_expr Comma bit_expr RightParen OVER new_generalized_window_clause
    | HYBRID_HIST LeftParen bit_expr Comma bit_expr RightParen OVER new_generalized_window_clause
    ;

first_or_last
    : FIRST
    | LAST
    ;

respect_or_ignore
    : RESPECT
    | IGNORE
    ;

win_fun_first_last_params
    : LeftParen expr respect_or_ignore NULLS RightParen
    | LeftParen expr RightParen (respect_or_ignore NULLS)?
    ;


new_generalized_window_clause
    : NAME_OB
    | new_generalized_window_clause_with_blanket
    ;

new_generalized_window_clause_with_blanket
    : LeftParen NAME_OB? generalized_window_clause RightParen
    ;

named_windows
    : named_window (Comma named_window)*
    ;

named_window
    : NAME_OB AS new_generalized_window_clause_with_blanket
    ;

generalized_window_clause
    : (PARTITION BY expr_list)? order_by? win_window?
    ;

win_rows_or_range
    : ROWS
    | RANGE
    ;

win_preceding_or_following
    : PRECEDING
    | FOLLOWING
    ;

win_interval
    : expr
    | INTERVAL expr date_unit
    ;

win_bounding
    : CURRENT ROW
    | win_interval win_preceding_or_following
    ;

win_window
    : win_rows_or_range BETWEEN win_bounding AND win_bounding
    | win_rows_or_range win_bounding
    ;


when_clause_list
    : when_clause+
    ;

when_clause
    : WHEN expr THEN expr
    ;

case_default
    : ELSE expr
    | empty
    ;

func_expr
    : COUNT LeftParen ALL? Star RightParen
    | COUNT LeftParen (DISTINCT|UNIQUE) expr_list RightParen
    | (APPROX_COUNT_DISTINCT|APPROX_COUNT_DISTINCT_SYNOPSIS|CHARACTER) LeftParen expr_list RightParen
    | (SUM|MAX|MIN|AVG|JSON_ARRAYAGG) LeftParen (ALL | DISTINCT | UNIQUE)? expr RightParen
    | (COUNT|STD|STDDEV|VARIANCE|STDDEV_POP|STDDEV_SAMP|VAR_POP|VAR_SAMP|BIT_AND|BIT_OR|BIT_XOR) LeftParen ALL? expr RightParen
    | (GROUPING|ISNULL|DATE|YEAR|TIME|MONTH|WEEK|TIMESTAMP) LeftParen expr RightParen
    | GROUP_CONCAT LeftParen (DISTINCT | UNIQUE)? expr_list order_by? (SEPARATOR STRING_VALUE)? RightParen
    | TOP_K_FRE_HIST LeftParen bit_expr Comma bit_expr Comma bit_expr RightParen
    | HYBRID_HIST LeftParen bit_expr Comma bit_expr RightParen
    | IF LeftParen expr Comma expr Comma expr RightParen
    | cur_timestamp_func
    | sysdate_func
    | cur_time_func
    | cur_date_func
    | utc_timestamp_func
    | utc_time_func
    | utc_date_func
    | CAST LeftParen expr AS cast_data_type RightParen
    | INSERT LeftParen expr Comma expr Comma expr Comma expr RightParen
    | CONVERT LeftParen expr Comma cast_data_type RightParen
    | CONVERT LeftParen expr USING charset_name RightParen
    | POSITION LeftParen bit_expr IN expr RightParen
    | substr_or_substring LeftParen substr_params RightParen
    | TRIM LeftParen parameterized_trim RightParen
    | (ADDDATE|SUBDATE|LEFT|TIMESTAMP|WEEK|LOG|MOD|JSON_OBJECTAGG) LeftParen expr Comma expr RightParen
    | (QUARTER|SECOND|MINUTE|MICROSECOND|HOUR|ASCII|LOG|LN|APPROX_COUNT_DISTINCT_SYNOPSIS_MERGE) LeftParen expr RightParen
    | GET_FORMAT LeftParen get_format_unit Comma expr RightParen
    | (DATE_ADD|DATE_SUB|ADDDATE|SUBDATE) LeftParen date_params RightParen
    | SUBDATE LeftParen expr Comma expr RightParen
    | (TIMESTAMPDIFF|TIMESTAMPADD) LeftParen timestamp_params RightParen
    | EXTRACT LeftParen date_unit FROM expr RightParen
    | (DEFAULT|VALUES) LeftParen column_definition_ref RightParen
    | CHARACTER LeftParen expr_list USING charset_name RightParen
    | function_name LeftParen expr_as_list? RightParen
    | relation_name Dot function_name LeftParen expr_as_list? RightParen
    | sys_interval_func
    | CALC_PARTITION_ID LeftParen bit_expr Comma bit_expr RightParen
    | WEIGHT_STRING LeftParen expr (AS CHARACTER ws_nweights)? (LEVEL ws_level_list_or_range)? RightParen
    | WEIGHT_STRING LeftParen expr AS BINARY ws_nweights RightParen
    | WEIGHT_STRING LeftParen expr Comma INTNUM Comma INTNUM Comma INTNUM Comma INTNUM RightParen
    | json_value_expr
    ;

sys_interval_func
    : INTERVAL LeftParen expr (Comma expr)+ RightParen
    ;

utc_timestamp_func
    : UTC_TIMESTAMP (LeftParen INTNUM? RightParen)?
    ;

utc_time_func
    : UTC_TIME (LeftParen INTNUM? RightParen)?
    ;

utc_date_func
    : UTC_DATE (LeftParen RightParen)?
    ;

sysdate_func
    : SYSDATE LeftParen INTNUM? RightParen
    ;

cur_timestamp_func
    : (now_synonyms_func|NOW) (LeftParen INTNUM? RightParen)?
    ;

now_synonyms_func
    : CURRENT_TIMESTAMP
    | LOCALTIME
    | LOCALTIMESTAMP
    ;

cur_time_func
    : (CURTIME|CURTIME|CURRENT_TIME) LeftParen INTNUM? RightParen
    ;

cur_date_func
    : (CURDATE|CURRENT_DATE) LeftParen RightParen
    | CURRENT_DATE
    ;

substr_or_substring
    : SUBSTR
    | SUBSTRING
    ;

substr_params
    : expr Comma expr (Comma expr)?
    | expr FROM expr (FOR expr)?
    ;

date_params
    : expr Comma INTERVAL expr date_unit
    ;

timestamp_params
    : date_unit Comma expr Comma expr
    ;

ws_level_list_or_range
    : ws_level_list
    | ws_level_range
    ;

ws_level_list
    : ws_level_list_item (Comma ws_level_list_item)*
    ;

ws_level_list_item
    : ws_level_number ws_level_flags
    ;

ws_level_range
    : ws_level_number Minus ws_level_number
    ;

ws_level_number
    : INTNUM
    ;

ws_level_flags
    : empty
    | ws_level_flag_desc ws_level_flag_reverse?
    | ws_level_flag_reverse
    ;

ws_nweights
    : LeftParen INTNUM RightParen
    ;

ws_level_flag_desc
    : ASC
    | DESC
    ;

ws_level_flag_reverse
    : REVERSE
    ;

delete_stmt
    : delete_with_opt_hint FROM tbl_name (WHERE opt_hint_value expr)? order_by? limit_clause?
    | delete_with_opt_hint multi_delete_table (WHERE opt_hint_value expr)?
    ;

multi_delete_table
    : relation_with_star_list FROM table_references
    | FROM relation_with_star_list USING table_references
    ;

update_stmt
    : update_with_opt_hint IGNORE? table_references SET update_asgn_list (WHERE opt_hint_value expr)? order_by? limit_clause?
    ;

update_asgn_list
    : update_asgn_factor (Comma update_asgn_factor)*
    ;

update_asgn_factor
    : column_definition_ref COMP_EQ expr_or_default
    ;

create_resource_stmt
    : CREATE RESOURCE UNIT (IF not EXISTS)? relation_name (resource_unit_option | (opt_resource_unit_option_list Comma resource_unit_option))?
    | CREATE RESOURCE POOL (IF not EXISTS)? relation_name (create_resource_pool_option | (opt_create_resource_pool_option_list Comma create_resource_pool_option))?
    ;

opt_resource_unit_option_list
    : resource_unit_option
    | empty
    | opt_resource_unit_option_list Comma resource_unit_option
    ;

resource_unit_option
    : (MIN_CPU|MIN_IOPS|MIN_MEMORY|MAX_CPU|MAX_MEMORY|MAX_IOPS|MAX_DISK_SIZE|MAX_SESSION_NUM) COMP_EQ? conf_const
    ;

opt_create_resource_pool_option_list
    : create_resource_pool_option
    | empty
    | create_resource_pool_option (Comma create_resource_pool_option)*
    ;

create_resource_pool_option
    : UNIT COMP_EQ? relation_name_or_string
    | UNIT_NUM COMP_EQ? INTNUM
    | ZONE_LIST COMP_EQ? LeftParen zone_list RightParen
    | REPLICA_TYPE COMP_EQ? STRING_VALUE
    ;

alter_resource_pool_option_list
    : alter_resource_pool_option (Comma alter_resource_pool_option)*
    ;

unit_id_list
    : INTNUM (Comma INTNUM)*
    ;

alter_resource_pool_option
    : UNIT COMP_EQ? relation_name_or_string
    | UNIT_NUM COMP_EQ? INTNUM (DELETE UNIT opt_equal_mark LeftParen unit_id_list RightParen)?
    | ZONE_LIST COMP_EQ? LeftParen zone_list RightParen
    ;

alter_resource_stmt
    : ALTER RESOURCE UNIT relation_name (resource_unit_option | (opt_resource_unit_option_list Comma resource_unit_option))?
    | ALTER RESOURCE POOL relation_name alter_resource_pool_option_list
    | ALTER RESOURCE POOL relation_name SPLIT INTO LeftParen resource_pool_list RightParen ON LeftParen zone_list RightParen
    | ALTER RESOURCE POOL MERGE LeftParen resource_pool_list RightParen INTO LeftParen resource_pool_list RightParen
    ;

drop_resource_stmt
    : DROP RESOURCE (UNIT|POOL) (IF EXISTS)? relation_name
    ;

create_tenant_stmt
    : CREATE TENANT (IF not EXISTS)? relation_name (tenant_option | (opt_tenant_option_list Comma tenant_option))? ((SET sys_var_and_val_list) | (SET VARIABLES sys_var_and_val_list) | (VARIABLES sys_var_and_val_list))?
    ;

opt_tenant_option_list
    : tenant_option
    | empty
    | opt_tenant_option_list Comma tenant_option
    ;

tenant_option
    : (LOGONLY_REPLICA_NUM|REPLICA_NUM|REWRITE_MERGE_VERSION|STORAGE_FORMAT_VERSION|STORAGE_FORMAT_WORK_VERSION|PROGRESSIVE_MERGE_NUM) COMP_EQ? INTNUM
    | LOCALITY COMP_EQ? STRING_VALUE FORCE?
    | PRIMARY_ZONE COMP_EQ? primary_zone_name
    | RESOURCE_POOL_LIST COMP_EQ? LeftParen resource_pool_list RightParen
    | ZONE_LIST COMP_EQ? LeftParen zone_list RightParen
    | charset_key COMP_EQ? charset_name
    | COLLATE COMP_EQ? collation_name
    | read_only_or_write
    | COMMENT COMP_EQ? STRING_VALUE
    | default_tablegroup
    ;

zone_list
    : STRING_VALUE (Comma? STRING_VALUE)*
    ;

resource_pool_list
    : STRING_VALUE (Comma STRING_VALUE)*
    ;

alter_tenant_stmt
    : ALTER TENANT relation_name SET? (tenant_option | (opt_tenant_option_list Comma tenant_option))? (VARIABLES sys_var_and_val_list)?
    | ALTER TENANT ALL SET? (tenant_option | (opt_tenant_option_list Comma tenant_option))? (VARIABLES sys_var_and_val_list)?
    | ALTER TENANT relation_name RENAME GLOBAL_NAME TO relation_name
    | ALTER TENANT relation_name lock_spec_mysql57
    ;

drop_tenant_stmt
    : DROP TENANT (IF EXISTS)? relation_name (FORCE | PURGE)?
    ;

create_restore_point_stmt
    : CREATE RESTORE POINT relation_name
    ;

drop_restore_point_stmt
    : DROP RESTORE POINT relation_name
    ;

create_database_stmt
    : CREATE database_key (IF not EXISTS)? database_factor database_option_list?
    ;

database_key
    : DATABASE
    | SCHEMA
    ;

database_factor
    : relation_name
    ;

database_option_list
    : database_option+
    ;

databases_expr
    : DATABASES COMP_EQ? STRING_VALUE
    ;

charset_key
    : CHARSET
    | CHARACTER SET
    ;

database_option
    : DEFAULT? charset_key COMP_EQ? charset_name
    | DEFAULT? COLLATE COMP_EQ? collation_name
    | REPLICA_NUM COMP_EQ? INTNUM
    | PRIMARY_ZONE COMP_EQ? primary_zone_name
    | read_only_or_write
    | default_tablegroup
    | DATABASE_ID COMP_EQ? INTNUM
    ;

read_only_or_write
    : READ ONLY
    | READ WRITE
    ;

drop_database_stmt
    : DROP database_key (IF EXISTS)? database_factor
    ;

alter_database_stmt
    : ALTER database_key NAME_OB? SET? database_option_list
    ;

load_data_stmt
    : load_data_with_opt_hint (LOCAL | REMOTE_OSS)? INFILE STRING_VALUE (IGNORE | REPLACE)? INTO TABLE relation_factor use_partition? (CHARACTER SET charset_name_or_default)? field_opt line_opt ((IGNORE INTNUM lines_or_rows) | (GENERATED INTNUM lines_or_rows))? ((LeftParen RightParen) | (LeftParen field_or_vars_list RightParen))? (SET load_set_list)?
    ;

load_data_with_opt_hint
    : LOAD DATA
    | LOAD_DATA_HINT_BEGIN hint_list_with_end
    ;

lines_or_rows
    : LINES
    | ROWS
    ;

field_or_vars_list
    : field_or_vars (Comma field_or_vars)*
    ;

field_or_vars
    : column_definition_ref
    | USER_VARIABLE
    ;

load_set_list
    : load_set_element (Comma load_set_element)*
    ;

load_set_element
    : column_definition_ref COMP_EQ expr_or_default
    ;

use_database_stmt
    : USE database_factor
    ;

temporary_option
    : TEMPORARY?
    ;

create_table_like_stmt
    : CREATE temporary_option TABLE (IF not EXISTS)? relation_factor LIKE relation_factor
    | CREATE temporary_option TABLE (IF not EXISTS)? relation_factor LeftParen LIKE relation_factor RightParen
    ;

create_table_stmt
    : CREATE temporary_option TABLE (IF not EXISTS)? relation_factor LeftParen table_element_list RightParen table_option_list? opt_partition_option
    | CREATE temporary_option TABLE (IF not EXISTS)? relation_factor LeftParen table_element_list RightParen table_option_list? opt_partition_option AS? select_stmt
    | CREATE temporary_option TABLE (IF not EXISTS)? relation_factor table_option_list opt_partition_option AS? select_stmt
    | CREATE temporary_option TABLE (IF not EXISTS)? relation_factor partition_option AS? select_stmt
    | CREATE temporary_option TABLE (IF not EXISTS)? relation_factor select_stmt
    | CREATE temporary_option TABLE (IF not EXISTS)? relation_factor AS select_stmt
    ;

ret_type
    : STRING
    | INTEGER
    | REAL
    | DECIMAL
    ;

create_function_stmt
    : CREATE AGGREGATE? FUNCTION NAME_OB RETURNS ret_type SONAME STRING_VALUE
    ;

drop_function_stmt
    : DROP FUNCTION (IF EXISTS)? NAME_OB
    ;

table_element_list
    : table_element (Comma table_element)*
    ;

table_element
    : column_definition
    | (CONSTRAINT opt_constraint_name)? PRIMARY KEY index_using_algorithm? LeftParen column_name_list RightParen index_using_algorithm? (COMMENT STRING_VALUE)?
    | key_or_index index_name? index_using_algorithm? LeftParen sort_column_list RightParen opt_index_options?
    | UNIQUE key_or_index? index_name? index_using_algorithm? LeftParen sort_column_list RightParen opt_index_options?
    | CONSTRAINT constraint_name? UNIQUE key_or_index? index_name? index_using_algorithm? LeftParen sort_column_list RightParen opt_index_options?
    | FULLTEXT key_or_index? index_name? index_using_algorithm? LeftParen sort_column_list RightParen opt_index_options?
    | CONSTRAINT constraint_name CHECK LeftParen expr RightParen
    | CHECK LeftParen expr RightParen
    | (CONSTRAINT opt_constraint_name)? FOREIGN KEY index_name? LeftParen column_name_list RightParen REFERENCES relation_factor LeftParen column_name_list RightParen (MATCH match_action)? (opt_reference_option_list reference_option)?
    ;

opt_reference_option_list
    : opt_reference_option_list reference_option
    | empty
    ;

reference_option
    : ON (DELETE|UPDATE) reference_action
    ;

reference_action
    : RESTRICT
    | CASCADE
    | SET NULLX
    | NO ACTION
    | SET DEFAULT
    ;

match_action
    : SIMPLE
    | FULL
    | PARTIAL
    ;

column_definition
    : column_definition_ref data_type (opt_column_attribute_list column_attribute)? (FIRST | (BEFORE column_name) | (AFTER column_name))?
    | column_definition_ref data_type (GENERATED opt_generated_option_list)? AS LeftParen expr RightParen (VIRTUAL | STORED)? (opt_generated_column_attribute_list generated_column_attribute)? (FIRST | (BEFORE column_name) | (AFTER column_name))?
    ;

opt_generated_option_list
    : ALWAYS
    ;

opt_generated_column_attribute_list
    : opt_generated_column_attribute_list generated_column_attribute
    | empty
    ;

generated_column_attribute
    : NOT NULLX
    | NULLX
    | UNIQUE KEY
    | PRIMARY? KEY
    | UNIQUE
    | COMMENT STRING_VALUE
    | ID INTNUM
    | CHECK LeftParen expr RightParen
    ;

column_definition_ref
    : ((relation_name Dot)? relation_name Dot)?  column_name
    ;

column_definition_list
    : column_definition (Comma column_definition)*
    ;

cast_data_type
    : BINARY string_length_i?
    | CHARACTER string_length_i? BINARY?
    | (cast_datetime_type_i|FLOAT) (LeftParen INTNUM RightParen)?
    | (NUMBER|DECIMAL|FIXED) ((LeftParen INTNUM Comma INTNUM RightParen) | (LeftParen INTNUM RightParen))?
    | (SIGNED|UNSIGNED) INTEGER?
    | (DOUBLE|JSON)
    ;

cast_datetime_type_i
    : DATETIME
    | DATE
    | TIME
    | YEAR
    ;

get_format_unit
    : DATETIME
    | TIMESTAMP
    | DATE
    | TIME
    ;

data_type
    : int_type_i (LeftParen INTNUM RightParen)? (UNSIGNED | SIGNED)? ZEROFILL?
    | float_type_i ((LeftParen INTNUM Comma INTNUM RightParen) | (LeftParen INTNUM RightParen) | (LeftParen DECIMAL_VAL RightParen))? (UNSIGNED | SIGNED)? ZEROFILL?
    | NUMBER ((LeftParen INTNUM Comma INTNUM RightParen) | (LeftParen INTNUM RightParen))? (UNSIGNED | SIGNED)? ZEROFILL?
    | DECIMAL ((LeftParen INTNUM Comma INTNUM RightParen) | (LeftParen INTNUM RightParen))? (UNSIGNED | SIGNED)? ZEROFILL?
    | FIXED ((LeftParen INTNUM Comma INTNUM RightParen) | (LeftParen INTNUM RightParen))? (UNSIGNED | SIGNED)? ZEROFILL?
    | BOOL
    | BOOLEAN
    | datetime_type_i (LeftParen INTNUM RightParen)?
    | date_year_type_i
    | CHARACTER string_length_i? BINARY? (charset_key charset_name)? collation?
    | VARCHAR string_length_i BINARY? (charset_key charset_name)? collation?
    | blob_type_i string_length_i?
    | text_type_i string_length_i? BINARY? (charset_key charset_name)? collation?
    | BINARY string_length_i?
    | VARBINARY string_length_i
    | STRING_VALUE
    | BIT (LeftParen INTNUM RightParen)?
    | ENUM LeftParen string_list RightParen BINARY? (charset_key charset_name)? collation?
    | SET LeftParen string_list RightParen BINARY? (charset_key charset_name)? collation?
    | JSON
    ;

string_list
    : text_string (Comma text_string)*
    ;

text_string
    : STRING_VALUE
    | PARSER_SYNTAX_ERROR
    ;

int_type_i
    : TINYINT
    | SMALLINT
    | MEDIUMINT
    | INTEGER
    | BIGINT
    ;

float_type_i
    : FLOAT
    | DOUBLE PRECISION?
    | REAL PRECISION?
    ;

datetime_type_i
    : DATETIME
    | TIMESTAMP
    | TIME
    ;

date_year_type_i
    : DATE
    | YEAR (LeftParen INTNUM RightParen)?
    ;

text_type_i
    : TINYTEXT
    | TEXT
    | MEDIUMTEXT
    | LONGTEXT
    ;

blob_type_i
    : TINYBLOB
    | BLOB
    | MEDIUMBLOB
    | LONGBLOB
    ;

string_length_i
    : LeftParen number_literal RightParen
    ;

collation_name
    : NAME_OB
    | STRING_VALUE
    ;

trans_param_name
    : Quote STRING_VALUE Quote
    ;

trans_param_value
    : Quote STRING_VALUE Quote
    | INTNUM
    ;

charset_name
    : NAME_OB
    | STRING_VALUE
    | BINARY
    ;

charset_name_or_default
    : charset_name
    | DEFAULT
    ;

collation
    : COLLATE collation_name
    ;

opt_column_attribute_list
    : opt_column_attribute_list column_attribute
    | empty
    ;

column_attribute
    : not NULLX
    | NULLX
    | DEFAULT now_or_signed_literal
    | ORIG_DEFAULT now_or_signed_literal
    | AUTO_INCREMENT
    | UNIQUE KEY
    | PRIMARY? KEY
    | UNIQUE
    | COMMENT STRING_VALUE
    | ON UPDATE cur_timestamp_func
    | ID INTNUM
    | CHECK LeftParen expr RightParen
    ;

now_or_signed_literal
    : cur_timestamp_func
    | signed_literal
    ;

signed_literal
    : literal
    | Plus number_literal
    | Minus number_literal
    ;

table_option_list_space_seperated
    : table_option+
    ;

table_option_list
    : table_option_list_space_seperated
    | table_option Comma table_option_list
    ;

primary_zone_name
    : DEFAULT
    | RANDOM
    | USER_VARIABLE
    | relation_name_or_string
    ;

tablespace
    : NAME_OB
    ;

locality_name
    : STRING_VALUE
    | DEFAULT
    ;

table_option
    : SORTKEY LeftParen column_name_list RightParen
    | (TABLE_MODE|DUPLICATE_SCOPE|COMMENT|COMPRESSION) COMP_EQ? STRING_VALUE
    | LOCALITY COMP_EQ? locality_name FORCE?
    | EXPIRE_INFO COMP_EQ? LeftParen expr RightParen
    | (PROGRESSIVE_MERGE_NUM|BLOCK_SIZE|TABLE_ID|REPLICA_NUM
    | STORAGE_FORMAT_VERSION|TABLET_SIZE|PCTFREE|MAX_USED_PART_ID) COMP_EQ? INTNUM
    | ROW_FORMAT COMP_EQ? row_format_option
    | USE_BLOOM_FILTER COMP_EQ? BOOL_VALUE
    | DEFAULT? charset_key COMP_EQ? charset_name
    | DEFAULT? COLLATE COMP_EQ? collation_name
    | PRIMARY_ZONE COMP_EQ? primary_zone_name
    | (TABLEGROUP|ENGINE_) COMP_EQ? relation_name_or_string
    | AUTO_INCREMENT COMP_EQ? int_or_decimal
    | read_only_or_write
    | TABLESPACE tablespace
    | parallel_option
    ;

parallel_option
    : PARALLEL COMP_EQ? INTNUM
    | NOPARALLEL
    ;

relation_name_or_string
    : relation_name
    | STRING_VALUE
    | ALL
    ;

opt_equal_mark
    : COMP_EQ?
    ;

partition_option
    : hash_partition_option
    | key_partition_option
    | range_partition_option
    | list_partition_option
    ;

opt_partition_option
    : partition_option
    | opt_column_partition_option
    | auto_partition_option
    ;

auto_partition_option
    : auto_partition_type PARTITION SIZE partition_size PARTITIONS AUTO
    ;

partition_size
    : conf_const
    | AUTO
    ;

auto_partition_type
    : auto_range_type
    ;

auto_range_type
    : PARTITION BY RANGE LeftParen expr? RightParen
    | PARTITION BY RANGE COLUMNS LeftParen column_name_list RightParen
    ;

hash_partition_option
    : PARTITION BY HASH LeftParen expr RightParen subpartition_option (PARTITIONS INTNUM)? opt_hash_partition_list?
    ;

list_partition_option
    : PARTITION BY BISON_LIST LeftParen expr RightParen subpartition_option (PARTITIONS INTNUM)? opt_list_partition_list
    | PARTITION BY BISON_LIST COLUMNS LeftParen column_name_list RightParen subpartition_option (PARTITIONS INTNUM)? opt_list_partition_list
    ;

key_partition_option
    : PARTITION BY KEY LeftParen column_name_list? RightParen subpartition_option (PARTITIONS INTNUM)?
    ;

range_partition_option
    : PARTITION BY RANGE LeftParen expr RightParen subpartition_option (PARTITIONS INTNUM)? opt_range_partition_list
    | PARTITION BY RANGE COLUMNS LeftParen column_name_list RightParen subpartition_option (PARTITIONS INTNUM)? opt_range_partition_list
    ;

opt_column_partition_option
    : column_partition_option?
    ;

column_partition_option
    : PARTITION BY COLUMN LeftParen vertical_column_name (Comma aux_column_list)? RightParen
    ;

aux_column_list
    : vertical_column_name (Comma vertical_column_name)*
    ;

vertical_column_name
    : column_name
    | LeftParen column_name_list RightParen
    ;

column_name_list
    : column_name (Comma column_name)*
    ;

subpartition_option
    : subpartition_template_option
    | subpartition_individual_option
    ;

subpartition_template_option
    : SUBPARTITION BY RANGE LeftParen expr RightParen SUBPARTITION TEMPLATE opt_range_subpartition_list
    | SUBPARTITION BY (RANGE|BISON_LIST) COLUMNS LeftParen column_name_list RightParen SUBPARTITION TEMPLATE opt_range_subpartition_list
    | SUBPARTITION BY HASH LeftParen expr RightParen SUBPARTITION TEMPLATE opt_hash_subpartition_list
    | SUBPARTITION BY BISON_LIST LeftParen expr RightParen SUBPARTITION TEMPLATE opt_list_subpartition_list
    | SUBPARTITION BY KEY LeftParen column_name_list RightParen SUBPARTITION TEMPLATE opt_hash_subpartition_list
    | empty
    ;

subpartition_individual_option
    : SUBPARTITION BY (RANGE|BISON_LIST) LeftParen expr RightParen
    | SUBPARTITION BY (RANGE|BISON_LIST) COLUMNS LeftParen column_name_list RightParen
    | SUBPARTITION BY HASH LeftParen expr RightParen (SUBPARTITIONS INTNUM)?
    | SUBPARTITION BY KEY LeftParen column_name_list RightParen (SUBPARTITIONS INTNUM)?
    ;

opt_hash_partition_list
    : LeftParen hash_partition_list RightParen
    ;

hash_partition_list
    : hash_partition_element (Comma hash_partition_element)*
    ;

hash_partition_element
    : PARTITION relation_factor (ID INTNUM)? (opt_hash_subpartition_list | opt_range_subpartition_list | opt_list_subpartition_list)?
    ;

opt_range_partition_list
    : LeftParen range_partition_list RightParen
    ;

range_partition_list
    : range_partition_element (Comma range_partition_element)*
    ;

range_partition_element
    : PARTITION relation_factor VALUES LESS THAN range_partition_expr (ID INTNUM)? (opt_hash_subpartition_list | opt_range_subpartition_list | opt_list_subpartition_list)?
    ;

opt_list_partition_list
    : LeftParen list_partition_list RightParen
    ;

list_partition_list
    : list_partition_element (Comma list_partition_element)*
    ;

list_partition_element
    : PARTITION relation_factor VALUES IN list_partition_expr (ID INTNUM)? (opt_hash_subpartition_list | opt_range_subpartition_list | opt_list_subpartition_list)?
    ;

opt_hash_subpartition_list
    : LeftParen hash_subpartition_list RightParen
    ;

hash_subpartition_list
    : hash_subpartition_element (Comma hash_subpartition_element)*
    ;

hash_subpartition_element
    : SUBPARTITION relation_factor (ENGINE_ COMP_EQ INNODB)?
    ;

opt_range_subpartition_list
    : LeftParen range_subpartition_list RightParen
    ;

range_subpartition_list
    : range_subpartition_element (Comma range_subpartition_element)*
    ;

range_subpartition_element
    : SUBPARTITION relation_factor VALUES LESS THAN range_partition_expr
    ;

opt_list_subpartition_list
    : LeftParen list_subpartition_list RightParen
    ;

list_subpartition_list
    : list_subpartition_element (Comma list_subpartition_element)*
    ;

list_subpartition_element
    : SUBPARTITION relation_factor VALUES IN list_partition_expr
    ;

list_partition_expr
    : LeftParen (DEFAULT|list_expr) RightParen
    ;

list_expr
    : expr (Comma expr)*
    ;

range_partition_expr
    : LeftParen range_expr_list RightParen
    | MAXVALUE
    ;

range_expr_list
    : range_expr (Comma range_expr)*
    ;

range_expr
    : expr
    | MAXVALUE
    ;

int_or_decimal
    : INTNUM
    | DECIMAL_VAL
    ;

tg_hash_partition_option
    : PARTITION BY HASH tg_subpartition_option (PARTITIONS INTNUM)?
    ;

tg_key_partition_option
    : PARTITION BY KEY INTNUM tg_subpartition_option (PARTITIONS INTNUM)?
    ;

tg_range_partition_option
    : PARTITION BY RANGE (COLUMNS INTNUM)? tg_subpartition_option (PARTITIONS INTNUM)? opt_range_partition_list
    ;

tg_list_partition_option
    : PARTITION BY BISON_LIST (COLUMNS INTNUM)? tg_subpartition_option (PARTITIONS INTNUM)? opt_list_partition_list
    ;

tg_subpartition_option
    : tg_subpartition_template_option
    | tg_subpartition_individual_option
    ;

tg_subpartition_template_option
    : SUBPARTITION BY RANGE (COLUMNS INTNUM)? SUBPARTITION TEMPLATE opt_range_subpartition_list
    | SUBPARTITION BY BISON_LIST (COLUMNS INTNUM)? SUBPARTITION TEMPLATE opt_list_subpartition_list
    | empty
    ;

tg_subpartition_individual_option
    : SUBPARTITION BY (HASH|KEY INTNUM) (SUBPARTITIONS INTNUM)?
    | SUBPARTITION BY RANGE (COLUMNS INTNUM)?
    | SUBPARTITION BY BISON_LIST (COLUMNS INTNUM)?
    ;

row_format_option
    : REDUNDANT
    | COMPACT
    | DYNAMIC
    | COMPRESSED
    | CONDENSED
    | DEFAULT
    ;

create_tablegroup_stmt
    : CREATE TABLEGROUP (IF not EXISTS)? relation_name tablegroup_option_list? (tg_hash_partition_option | tg_key_partition_option | tg_range_partition_option | tg_list_partition_option)?
    ;

drop_tablegroup_stmt
    : DROP TABLEGROUP (IF EXISTS)? relation_name
    ;

alter_tablegroup_stmt
    : ALTER TABLEGROUP relation_name ADD TABLE? table_list
    | ALTER TABLEGROUP relation_name (alter_tablegroup_actions|alter_tg_partition_option)
    ;

tablegroup_option_list_space_seperated
    : tablegroup_option+
    ;

tablegroup_option_list
    : tablegroup_option_list_space_seperated
    | tablegroup_option Comma tablegroup_option_list
    ;

tablegroup_option
    : LOCALITY COMP_EQ? locality_name FORCE?
    | PRIMARY_ZONE COMP_EQ? primary_zone_name
    | (TABLEGROUP_ID|MAX_USED_PART_ID) COMP_EQ? INTNUM
    | BINDING COMP_EQ? BOOL_VALUE
    ;

alter_tablegroup_actions
    : alter_tablegroup_action (Comma alter_tablegroup_action)*
    ;

alter_tablegroup_action
    : SET? tablegroup_option_list_space_seperated
    ;

default_tablegroup
    : DEFAULT? TABLEGROUP COMP_EQ? (NULLX|relation_name)
    ;

create_view_stmt
    : CREATE (OR REPLACE)? (SQL SECURITY (DEFINER | INVOKER))? MATERIALIZED? VIEW view_name (LeftParen column_name_list RightParen)? (TABLE_ID COMP_EQ INTNUM)? AS view_select_stmt
    | ALTER VIEW view_name (LeftParen column_name_list RightParen)? (TABLE_ID COMP_EQ INTNUM)? AS view_select_stmt
    ;

view_select_stmt
    : select_stmt
    ;

view_name
    : relation_factor
    ;

create_index_stmt
    : CREATE (FULLTEXT | UNIQUE)? INDEX (IF not EXISTS)? normal_relation_factor index_using_algorithm? ON relation_factor LeftParen sort_column_list RightParen opt_index_options? opt_partition_option
    ;

index_name
    : relation_name
    ;

opt_constraint_name
    : constraint_name?
    ;

constraint_name
    : relation_name
    ;

sort_column_list
    : sort_column_key (Comma sort_column_key)*
    ;

sort_column_key
    : column_name (LeftParen INTNUM RightParen)? (ASC | DESC)? (ID INTNUM)?
    ;

opt_index_options
    : index_option+
    ;

index_option
    : GLOBAL
    | LOCAL
    | (BLOCK_SIZE|DATA_TABLE_ID|INDEX_TABLE_ID|VIRTUAL_COLUMN_ID|MAX_USED_PART_ID) COMP_EQ? INTNUM
    | COMMENT STRING_VALUE
    | (STORING|CTXCAT) LeftParen column_name_list RightParen
    | WITH_ROWID
    | WITH PARSER STRING_VALUE
    | index_using_algorithm
    | visibility_option
    | parallel_option
    | TABLESPACE tablespace
    ;

index_using_algorithm
    : USING (BTREE|HASH)
    ;

drop_table_stmt
    : DROP (TEMPORARY | MATERIALIZED)? table_or_tables (IF EXISTS)? table_list (CASCADE | RESTRICT)?
    ;

table_or_tables
    : TABLE
    | TABLES
    ;

drop_view_stmt
    : DROP MATERIALIZED? VIEW (IF EXISTS)? table_list (CASCADE | RESTRICT)?
    ;

table_list
    : relation_factor (Comma relation_factor)*
    ;

drop_index_stmt
    : DROP INDEX relation_name ON relation_factor
    ;

insert_stmt
    : insert_with_opt_hint IGNORE? INTO? single_table_insert (ON DUPLICATE KEY UPDATE update_asgn_list)?
    | replace_with_opt_hint IGNORE? INTO? single_table_insert
    ;

single_table_insert
    : dml_table_name (SET update_asgn_list|values_clause)
    | dml_table_name LeftParen column_list? RightParen values_clause
    ;

values_clause
    : value_or_values insert_vals_list
    | select_stmt
    ;

value_or_values
    : VALUE
    | VALUES
    ;

replace_with_opt_hint
    : REPLACE
    | REPLACE_HINT_BEGIN hint_list_with_end
    ;

insert_with_opt_hint
    : INSERT
    | INSERT_HINT_BEGIN hint_list_with_end
    ;

column_list
    : column_definition_ref (Comma column_definition_ref)*
    ;

insert_vals_list
    : LeftParen insert_vals RightParen
    | insert_vals_list Comma LeftParen insert_vals RightParen
    ;

insert_vals
    : expr_or_default
    | empty
    | insert_vals Comma expr_or_default
    ;

expr_or_default
    : expr
    | DEFAULT
    ;

select_stmt
    : with_clause? (select_no_parens into_clause? |select_with_parens)
    ;


select_with_parens
    : LeftParen with_clause? (select_no_parens |select_with_parens) RightParen
    ;

select_no_parens
    : select_clause (FOR UPDATE opt_for_update_wait)?
    | select_clause_set (FOR UPDATE opt_for_update_wait)?
    | select_clause_set_with_order_and_limit (FOR UPDATE opt_for_update_wait)?
    ;

no_table_select
    : select_with_opt_hint query_expression_option_list? select_expr_list into_opt (FROM DUAL (WHERE opt_hint_value expr)? (GROUP BY groupby_clause)? (HAVING expr)? (WINDOW named_windows)?)?
    ;

select_clause
    : no_table_select_with_order_and_limit
    | simple_select_with_order_and_limit
    | select_with_parens_with_order_and_limit
    ;

select_clause_set_with_order_and_limit
    : select_clause_set order_by
    | select_clause_set order_by? limit_clause
    ;

select_clause_set
    : select_clause_set order_by set_type select_clause_set_right
    | select_clause_set order_by? limit_clause set_type select_clause_set_right
    | select_clause_set_left (set_type select_clause_set_right)+
    ;

select_clause_set_right
    : no_table_select
    | simple_select
    | select_with_parens
    ;

select_clause_set_left
    : no_table_select_with_order_and_limit
    | simple_select_with_order_and_limit
    | select_with_parens
    ;

no_table_select_with_order_and_limit
    : no_table_select order_by? limit_clause?
    ;

//
simple_select_with_order_and_limit
    : simple_select order_by? limit_clause?
    ;

select_with_parens_with_order_and_limit
    : select_with_parens order_by
    | select_with_parens order_by? limit_clause
    ;

select_with_opt_hint
    : SELECT
    | SELECT_HINT_BEGIN hint_list_with_end
    ;

update_with_opt_hint
    : UPDATE
    | UPDATE_HINT_BEGIN hint_list_with_end
    ;

delete_with_opt_hint
    : DELETE
    | DELETE_HINT_BEGIN hint_list_with_end
    ;

simple_select
    : select_with_opt_hint query_expression_option_list? select_expr_list into_opt FROM from_list (WHERE opt_hint_value expr)? (GROUP BY groupby_clause)? (HAVING expr)? (WINDOW named_windows)?
    ;

set_type_union
    : UNION
    ;

set_type_other
    : INTERSECT
    | EXCEPT
    | MINUS
    ;

set_type
    : set_type_union set_expression_option
    | set_type_other
    ;

set_expression_option
    : (ALL | DISTINCT | UNIQUE)?
    ;

opt_hint_value
    : HINT_VALUE?
    ;

limit_clause
    : LIMIT limit_expr ((OFFSET limit_expr)?|Comma limit_expr)
    ;

into_clause
    : INTO OUTFILE STRING_VALUE (charset_key charset_name)? field_opt line_opt
    | INTO DUMPFILE STRING_VALUE
    | INTO into_var_list
    ;

into_opt
    : into_clause?
    ;

into_var_list
    : into_var (Comma into_var)*
    ;

into_var
    : USER_VARIABLE
    | NAME_OB
    | unreserved_keyword_normal
    ;

field_opt
    : columns_or_fields field_term_list
    | empty
    ;

field_term_list
    : field_term+
    ;

field_term
    : ((OPTIONALLY? ENCLOSED|TERMINATED)|ESCAPED) BY STRING_VALUE
    ;

line_opt
    : LINES line_term_list
    | empty
    ;

line_term_list
    : line_term+
    ;

line_term
    : (STARTING|TERMINATED) BY STRING_VALUE
    ;

hint_list_with_end
    : (hint_options | (opt_hint_list Comma hint_options))? HINT_END
    ;

opt_hint_list
    : hint_options
    | empty
    | opt_hint_list Comma hint_options
    ;

hint_options
    : hint_option+
    ;

name_list
    : NAME_OB
    | name_list Comma? NAME_OB
    ;

hint_option
    : (NO_REWRITE|HOTSPOT|ORDERED|USE_HASH_AGGREGATION|NO_USE_HASH_AGGREGATION|NO_USE_JIT|USE_LATE_MATERIALIZATION|USE_LATE_MATERIALIZATION
    | NO_USE_LATE_MATERIALIZATION|TRACE_LOG|USE_PX|NO_USE_PX|NAME_OB|EOF|PARSER_SYNTAX_ERROR
    | ENABLE_PARALLEL_DML| DISABLE_PARALLEL_DML|NO_PARALLEL|MONITOR)
    | READ_CONSISTENCY LeftParen consistency_level RightParen
    | INDEX_HINT LeftParen qb_name_option relation_factor_in_hint NAME_OB RightParen
    | (QUERY_TIMEOUT|FROZEN_VERSION) LeftParen INTNUM RightParen
    | TOPK LeftParen INTNUM INTNUM RightParen
    | LOG_LEVEL LeftParen NAME_OB RightParen
    | LOG_LEVEL LeftParen Quote STRING_VALUE Quote RightParen
    | LEADING_HINT LeftParen qb_name_option relation_factor_in_leading_hint_list_entry RightParen
    | LEADING_HINT LeftParen qb_name_option relation_factor_in_hint_list RightParen
    | (FULL_HINT|PQ_MAP) LeftParen qb_name_option relation_factor_in_hint RightParen
    | USE_PLAN_CACHE LeftParen use_plan_cache_type RightParen
    | (USE_MERGE|NO_USE_MERGE|USE_HASH|NO_USE_HASH|USE_NL|PX_JOIN_FILTER|NO_PX_JOIN_FILTER
    | NO_USE_NL|USE_BNL|NO_USE_BNL|USE_NL_MATERIALIZATION|NO_USE_NL_MATERIALIZATION) LeftParen qb_name_option relation_factor_in_use_join_hint_list RightParen
    | (MERGE_HINT|NO_MERGE_HINT|NO_EXPAND|USE_CONCAT|UNNEST|NO_UNNEST|PLACE_GROUP_BY|NO_PLACE_GROUP_BY|NO_PRED_DEDUCE|INLINE|MATERIALIZE) (LeftParen qb_name_option RightParen)?
    | USE_JIT LeftParen use_jit_type RightParen
    | (STAT|TRACING) LeftParen tracing_num_list RightParen
    | DOP LeftParen INTNUM Comma INTNUM RightParen
    | TRANS_PARAM LeftParen trans_param_name Comma? trans_param_value RightParen
    | FORCE_REFRESH_LOCATION_CACHE
    | QB_NAME LeftParen NAME_OB RightParen
    | (MAX_CONCURRENT|PARALLEL|LOAD_BATCH_SIZE) LeftParen INTNUM RightParen
    | PQ_DISTRIBUTE LeftParen qb_name_option relation_factor_in_pq_hint Comma? distribute_method (Comma? distribute_method)? RightParen
    ;

consistency_level
    : WEAK
    | STRONG
    | FROZEN
    ;

use_plan_cache_type
    : NONE
    | DEFAULT
    ;

use_jit_type
    : AUTO
    | FORCE
    ;

distribute_method
    : NONE
    | PARTITION
    | RANDOM
    | RANDOM_LOCAL
    | HASH
    | BROADCAST
    | LOCAL
    | BC2HOST
    ;

limit_expr
    : INTNUM
    | QUESTIONMARK
    | column_ref
    ;

opt_for_update_wait
    : empty
    | WAIT DECIMAL_VAL
    | WAIT INTNUM
    | NOWAIT
    | NO_WAIT
    ;

parameterized_trim
    : (BOTH FROM)? expr
    | BOTH? expr FROM expr
    | (LEADING|TRAILING) expr? FROM expr
    ;

groupby_clause
    : sort_list_for_group_by (WITH ROLLUP)?
    ;

sort_list_for_group_by
    : sort_key_for_group_by (Comma sort_key_for_group_by)*
    ;

sort_key_for_group_by
    : expr (ASC | DESC)?
    ;

order_by
    : ORDER BY sort_list
    ;

sort_list
    : sort_key (Comma sort_key)*
    ;

sort_key
    : expr (ASC | DESC)?
    ;

query_expression_option_list
    : query_expression_option+
    ;

query_expression_option
    : ALL
    | DISTINCT
    | UNIQUE
    | SQL_CALC_FOUND_ROWS
    | SQL_NO_CACHE
    | SQL_CACHE
    ;

projection
    : expr AS? (column_label|STRING_VALUE)?
    | Star
    ;

select_expr_list
    : projection (Comma projection)*
    ;

from_list
    : table_references
    ;

table_references
    : table_reference (Comma table_reference)*
    ;

table_reference
    : table_factor joined_table*
   // | joined_table
    ;

table_factor
    : tbl_name
    | table_subquery
    | select_with_parens use_flashback?
    | LeftParen table_references RightParen
    ;

tbl_name
    : relation_factor use_partition? (sample_clause seed?|use_flashback?) relation_name?
    | relation_factor use_partition? ((AS? relation_name|sample_clause?)|sample_clause (relation_name|seed relation_name?)) index_hint_list
    | relation_factor use_partition? use_flashback? AS relation_name
    | relation_factor use_partition? sample_clause seed? AS relation_name index_hint_list?
    ;

dml_table_name
    : relation_factor use_partition?
    ;

seed
    : SEED LeftParen INTNUM RightParen
    ;

sample_percent
    : INTNUM
    | DECIMAL_VAL
    ;

sample_clause
    : SAMPLE BLOCK? (ALL | BASE | INCR)? LeftParen sample_percent RightParen
    ;

table_subquery
    : select_with_parens use_flashback? AS? relation_name
    ;

use_partition
    : PARTITION LeftParen name_list RightParen
    ;

use_flashback
    : AS OF SNAPSHOT bit_expr
    ;

index_hint_type
    : FORCE
    | IGNORE
    ;

key_or_index
    : KEY
    | INDEX
    ;

index_hint_scope
    : empty
    | FOR ((JOIN|ORDER BY)|GROUP BY)
    ;

index_element
    : NAME_OB
    | PRIMARY
    ;

index_list
    : index_element (Comma index_element)*
    ;

index_hint_definition
    : USE key_or_index index_hint_scope LeftParen index_list? RightParen
    | index_hint_type key_or_index index_hint_scope LeftParen index_list RightParen
    ;

index_hint_list
    : index_hint_definition+
    ;

relation_factor
    : normal_relation_factor
    | dot_relation_factor
    ;

relation_with_star_list
    : relation_factor_with_star (Comma relation_factor_with_star)*
    ;

relation_factor_with_star
    : relation_name (Dot relation_name)? (Dot Star)?
    ;

normal_relation_factor
    : relation_name ((Dot relation_name)?|Dot mysql_reserved_keyword)
    ;

dot_relation_factor
    : Dot (relation_name|mysql_reserved_keyword)
    ;

relation_factor_in_hint
    : normal_relation_factor qb_name_option
    ;

qb_name_option
    : At NAME_OB
    | empty
    ;

relation_factor_in_hint_list
    : relation_factor_in_hint (relation_sep_option relation_factor_in_hint)*
    ;

relation_sep_option
    : Comma?
    ;

relation_factor_in_pq_hint
    : relation_factor_in_hint
    | LeftParen relation_factor_in_hint_list RightParen
    ;

relation_factor_in_leading_hint
    : LeftParen relation_factor_in_hint_list RightParen
    ;

relation_factor_in_leading_hint_list
    : relation_factor_in_leading_hint
    | LeftParen (relation_factor_in_hint_list relation_sep_option)? relation_factor_in_leading_hint_list RightParen
    | relation_factor_in_leading_hint_list relation_sep_option (relation_factor_in_hint|relation_factor_in_leading_hint)
    | relation_factor_in_leading_hint_list relation_sep_option LeftParen relation_factor_in_hint_list relation_sep_option relation_factor_in_leading_hint_list RightParen
    ;

relation_factor_in_leading_hint_list_entry
    : (relation_factor_in_hint_list relation_sep_option)? relation_factor_in_leading_hint_list
    ;

relation_factor_in_use_join_hint_list
    : relation_factor_in_hint
    | LeftParen relation_factor_in_hint_list RightParen
    | relation_factor_in_use_join_hint_list relation_sep_option relation_factor_in_hint
    | relation_factor_in_use_join_hint_list relation_sep_option LeftParen relation_factor_in_hint_list RightParen
    ;

tracing_num_list
    : INTNUM (relation_sep_option tracing_num_list)?
    ;

join_condition
    : ON expr
    | USING LeftParen column_list RightParen
    ;

joined_table
    : inner_join_type opt_full_table_factor (ON expr)?
    | inner_join_type opt_full_table_factor USING LeftParen column_list RightParen
    | outer_join_type opt_full_table_factor join_condition?
    | (FULL|natural_join_type opt_full_table_factor)
    ;

opt_full_table_factor
    : table_factor FULL?
    ;

natural_join_type
    : NATURAL outer_join_type
    | NATURAL INNER? JOIN
    ;

inner_join_type
    : INNER? JOIN
    | CROSS JOIN
    ;

outer_join_type
    : (FULL|LEFT|RIGHT) OUTER? JOIN
    ;


with_clause
    : WITH RECURSIVE? with_list
    ;

with_list
    : common_table_expr (Comma common_table_expr)*
    ;

common_table_expr
    : relation_name (LeftParen alias_name_list RightParen)? AS LeftParen with_clause? (select_no_parens |select_with_parens) RightParen
    ;

alias_name_list
    : column_alias_name (Comma column_alias_name)*
    ;

column_alias_name
    : column_name
    ;

analyze_stmt
    : ANALYZE TABLE relation_factor UPDATE HISTOGRAM ON column_name_list WITH INTNUM BUCKETS
    | ANALYZE TABLE relation_factor DROP HISTOGRAM ON column_name_list
    | ANALYZE TABLE relation_factor use_partition? analyze_statistics_clause
    ;

analyze_statistics_clause
    : COMPUTE STATISTICS opt_analyze_for_clause_list?
    | ESTIMATE STATISTICS opt_analyze_for_clause_list? (SAMPLE INTNUM sample_option)?
    ;

opt_analyze_for_clause_list
    : opt_analyze_for_clause_element
    ;

opt_analyze_for_clause_element
    : FOR TABLE
    | for_all
    | for_columns
    ;

sample_option
    : ROWS
    | PERCENTAGE
    ;

for_all
    : FOR ALL (INDEXED | HIDDEN_)? COLUMNS size_clause?
    ;

size_clause
    : SIZE (AUTO|REPEAT|SKEWONLY)
    | SIZE INTNUM
    ;

for_columns
    : FOR COLUMNS for_columns_list?
    ;

for_columns_list
    : for_columns_item
    | for_columns_list Comma? for_columns_item
    ;

for_columns_item
    : column_clause size_clause?
    | size_clause
    ;

column_clause
    : column_name
    ;

create_outline_stmt
    : CREATE (OR REPLACE)? OUTLINE relation_name ON explainable_stmt (TO explainable_stmt)?
    | CREATE (OR REPLACE)? OUTLINE relation_name ON STRING_VALUE USING HINT_HINT_BEGIN hint_list_with_end
    ;

alter_outline_stmt
    : ALTER OUTLINE relation_name ADD explainable_stmt (TO explainable_stmt)?
    ;

drop_outline_stmt
    : DROP OUTLINE relation_factor
    ;

explain_stmt
    : explain_or_desc relation_factor (STRING_VALUE | column_name)?
    | explain_or_desc explainable_stmt
    | explain_or_desc (BASIC|OUTLINE|EXTENDED|EXTENDED_NOADDR|PLANREGRESS|PARTITIONS) explainable_stmt
    | explain_or_desc FORMAT COMP_EQ format_name explainable_stmt
    ;

explain_or_desc
    : EXPLAIN
    | DESCRIBE
    | DESC
    ;

explainable_stmt
    : select_stmt
    | delete_stmt
    | insert_stmt
    | update_stmt
    ;

format_name
    : TRADITIONAL
    | JSON
    ;

show_stmt
    : SHOW FULL? TABLES (from_or_in database_factor)? ((LIKE STRING_VALUE) | (LIKE STRING_VALUE ESCAPE STRING_VALUE) | (WHERE expr))?
    | SHOW databases_or_schemas STATUS? ((LIKE STRING_VALUE) | (LIKE STRING_VALUE ESCAPE STRING_VALUE) | (WHERE expr))?
    | SHOW FULL? columns_or_fields from_or_in relation_factor (from_or_in database_factor)? ((LIKE STRING_VALUE) | (LIKE STRING_VALUE ESCAPE STRING_VALUE) | (WHERE expr))?
    | SHOW (TABLE|PROCEDURE|FUNCTION|TRIGGERS) STATUS (from_or_in database_factor)? ((LIKE STRING_VALUE) | (LIKE STRING_VALUE ESCAPE STRING_VALUE) | (WHERE expr))?
    | SHOW SERVER STATUS ((LIKE STRING_VALUE) | (LIKE STRING_VALUE ESCAPE STRING_VALUE) | (WHERE expr))?
    | SHOW (GLOBAL | SESSION | LOCAL)? VARIABLES ((LIKE STRING_VALUE) | (LIKE STRING_VALUE ESCAPE STRING_VALUE) | (WHERE expr))?
    | SHOW SCHEMA
    | SHOW CREATE database_or_schema (IF not EXISTS)? database_factor
    | SHOW CREATE (TABLE|VIEW|PROCEDURE|FUNCTION|TRIGGER) relation_factor
    | SHOW (WARNINGS|ERRORS) ((LIMIT INTNUM Comma INTNUM) | (LIMIT INTNUM))?
    | SHOW COUNT LeftParen Star RightParen (WARNINGS|ERRORS)
    | SHOW GRANTS opt_for_grant_user
    | SHOW charset_key ((LIKE STRING_VALUE) | (LIKE STRING_VALUE ESCAPE STRING_VALUE) | (WHERE expr))?
    | SHOW (TRACE|COLLATION|PARAMETERS|TABLEGROUPS) ((LIKE STRING_VALUE) | (LIKE STRING_VALUE ESCAPE STRING_VALUE) | (WHERE expr))?
    | SHOW index_or_indexes_or_keys from_or_in relation_factor (from_or_in database_factor)? (WHERE opt_hint_value expr)?
    | SHOW FULL? PROCESSLIST
    | SHOW (GLOBAL | SESSION | LOCAL)? STATUS ((LIKE STRING_VALUE) | (LIKE STRING_VALUE ESCAPE STRING_VALUE) | (WHERE expr))?
    | SHOW TENANT STATUS?
    | SHOW CREATE TENANT relation_name
    | SHOW STORAGE? ENGINES
    | SHOW PRIVILEGES
    | SHOW RECYCLEBIN
    | SHOW CREATE TABLEGROUP relation_name
    | SHOW RESTORE PREVIEW
    ;

databases_or_schemas
    : DATABASES
    | SCHEMAS
    ;

opt_for_grant_user
    : opt_for_user
    | FOR CURRENT_USER (LeftParen RightParen)?
    ;

columns_or_fields
    : COLUMNS
    | FIELDS
    ;

database_or_schema
    : DATABASE
    | SCHEMA
    ;

index_or_indexes_or_keys
    : INDEX
    | INDEXES
    | KEYS
    ;

from_or_in
    : FROM
    | IN
    ;

help_stmt
    : HELP STRING_VALUE
    | HELP NAME_OB
    ;

create_tablespace_stmt
    : CREATE TABLESPACE tablespace permanent_tablespace
    ;

permanent_tablespace
    : permanent_tablespace_options?
    ;

permanent_tablespace_option
    : ENCRYPTION COMP_EQ? STRING_VALUE
    ;

drop_tablespace_stmt
    : DROP TABLESPACE tablespace
    ;

alter_tablespace_actions
    : alter_tablespace_action (Comma alter_tablespace_action)?
    ;

alter_tablespace_action
    : SET? permanent_tablespace_option
    ;

alter_tablespace_stmt
    : ALTER TABLESPACE tablespace alter_tablespace_actions
    ;

rotate_master_key_stmt
    : ALTER INSTANCE ROTATE INNODB MASTER KEY
    ;

permanent_tablespace_options
    : permanent_tablespace_option (Comma permanent_tablespace_option)*
    ;

create_user_stmt
    : CREATE USER (IF not EXISTS)? user_specification_list require_specification?
    ;

user_specification_list
    : user_specification (Comma user_specification)*
    ;

user_specification
    : user USER_VARIABLE?
    | user USER_VARIABLE? IDENTIFIED BY password
    | user USER_VARIABLE? IDENTIFIED BY PASSWORD password
    ;

require_specification
    : REQUIRE (NONE|SSL|X509)
    | REQUIRE tls_option_list
    ;

tls_option_list
    : tls_option
    | tls_option_list tls_option
    | tls_option_list AND tls_option
    ;

tls_option
    : (CIPHER|ISSUER|SUBJECT) STRING_VALUE
    ;

user
    : STRING_VALUE
    | NAME_OB
    | unreserved_keyword
    ;

opt_host_name
    : USER_VARIABLE?
    ;

user_with_host_name
    : user USER_VARIABLE?
    ;

password
    : STRING_VALUE
    ;

drop_user_stmt
    : DROP USER user_list
    ;

user_list
    : user_with_host_name (Comma user_with_host_name)*
    ;

set_password_stmt
    : SET PASSWORD (FOR user opt_host_name)? COMP_EQ STRING_VALUE
    | SET PASSWORD (FOR user opt_host_name)? COMP_EQ PASSWORD LeftParen password RightParen
    | ALTER USER user_with_host_name IDENTIFIED BY password
    | ALTER USER user_with_host_name require_specification
    ;

opt_for_user
    : FOR user opt_host_name
    | empty
    ;

rename_user_stmt
    : RENAME USER rename_list
    ;

rename_info
    : user USER_VARIABLE? TO user USER_VARIABLE?
    ;

rename_list
    : rename_info (Comma rename_info)*
    ;

lock_user_stmt
    : ALTER USER user_list ACCOUNT lock_spec_mysql57
    ;

lock_spec_mysql57
    : LOCK_
    | UNLOCK
    ;

lock_tables_stmt
    : LOCK_ table_or_tables lock_table_list
    ;

unlock_tables_stmt
    : UNLOCK TABLES
    ;

lock_table_list
    : lock_table (Comma lock_table)*
    ;

lock_table
    : relation_factor lock_type
    | relation_factor AS? relation_name lock_type
    ;

lock_type
    : READ LOCAL?
    | WRITE
    | LOW_PRIORITY WRITE
    ;

create_sequence_stmt
    : CREATE SEQUENCE relation_factor sequence_option_list?
    ;

sequence_option_list
    : sequence_option+
    ;

sequence_option
    : (INCREMENT BY|MAXVALUE) simple_num
    | (MINVALUE|START WITH) simple_num
    | NOMAXVALUE
    | NOMINVALUE
    | CYCLE
    | NOCYCLE
    | CACHE simple_num
    | NOCACHE
    | ORDER
    | NOORDER
    ;

simple_num
    : (INTNUM|DECIMAL_VAL)
    | (Minus|Plus) (INTNUM|DECIMAL_VAL)
    ;

drop_sequence_stmt
    : DROP SEQUENCE relation_factor
    ;

alter_sequence_stmt
    : ALTER SEQUENCE relation_factor sequence_option_list?
    ;

begin_stmt
    : BEGI WORK?
    | START TRANSACTION ((WITH CONSISTENT SNAPSHOT) | transaction_access_mode | (WITH CONSISTENT SNAPSHOT Comma transaction_access_mode) | (transaction_access_mode Comma WITH CONSISTENT SNAPSHOT))?
    ;

xa_begin_stmt
    : XA (BEGI|START) STRING_VALUE
    ;

xa_end_stmt
    : XA END STRING_VALUE
    ;

xa_prepare_stmt
    : XA PREPARE STRING_VALUE
    ;

xa_commit_stmt
    : XA COMMIT STRING_VALUE
    ;

xa_rollback_stmt
    : XA ROLLBACK STRING_VALUE
    ;

commit_stmt
    : COMMIT WORK?
    ;

rollback_stmt
    : ROLLBACK WORK?
    ;

kill_stmt
    : KILL (CONNECTION?|QUERY) expr
    ;

grant_stmt
    : GRANT grant_privileges ON priv_level TO user_specification_list grant_options
    ;

grant_privileges
    : priv_type_list
    | ALL PRIVILEGES?
    ;

priv_type_list
    : priv_type (Comma priv_type)*
    ;

priv_type
    : ALTER TENANT?
    | CREATE (RESOURCE POOL|USER?)
    | DELETE
    | DROP
    | GRANT OPTION
    | INSERT
    | UPDATE
    | SELECT
    | INDEX
    | CREATE (RESOURCE UNIT|VIEW)
    | SHOW VIEW
    | SHOW DATABASES
    | SUPER
    | PROCESS
    | USAGE
    | FILEX
    | ALTER SYSTEM
    ;

priv_level
    : (Star|relation_name) (Dot Star)?
    | relation_name Dot relation_name
    ;

grant_options
    : WITH GRANT OPTION
    | empty
    ;

revoke_stmt
    : REVOKE grant_privileges ON priv_level FROM user_list
    | REVOKE ALL PRIVILEGES? Comma GRANT OPTION FROM user_list
    ;

prepare_stmt
    : PREPARE stmt_name FROM preparable_stmt
    ;

stmt_name
    : column_label
    ;

preparable_stmt
    : text_string
    | USER_VARIABLE
    ;

variable_set_stmt
    : SET var_and_val_list
    ;

sys_var_and_val_list
    : sys_var_and_val (Comma sys_var_and_val)*
    ;

var_and_val_list
    : var_and_val (Comma var_and_val)*
    ;

set_expr_or_default
    : expr
    | ON
    | BINARY
    | DEFAULT
    ;

var_and_val
    : USER_VARIABLE (SET_VAR|to_or_eq) expr
    | sys_var_and_val
    | (SYSTEM_VARIABLE|scope_or_scope_alias column_name) to_or_eq set_expr_or_default
    ;

sys_var_and_val
    : var_name (SET_VAR|to_or_eq) set_expr_or_default
    ;

scope_or_scope_alias
    : GLOBAL
    | SESSION
    | GLOBAL_ALIAS Dot
    | SESSION_ALIAS Dot
    ;

to_or_eq
    : TO
    | COMP_EQ
    ;

execute_stmt
    : EXECUTE stmt_name (USING argument_list)?
    ;

argument_list
    : argument (Comma argument)*
    ;

argument
    : USER_VARIABLE
    ;

deallocate_prepare_stmt
    : deallocate_or_drop PREPARE stmt_name
    ;

deallocate_or_drop
    : DEALLOCATE
    | DROP
    ;

truncate_table_stmt
    : TRUNCATE TABLE? relation_factor
    ;

audit_stmt
    : audit_or_noaudit audit_clause
    ;

audit_or_noaudit
    : AUDIT
    | NOAUDIT
    ;

audit_clause
    : audit_operation_clause (auditing_by_user_clause|auditing_on_clause?) op_audit_tail_clause
    ;

audit_operation_clause
    : audit_all_shortcut_list
    | ALL STATEMENTS?
    ;

audit_all_shortcut_list
    : audit_all_shortcut (Comma audit_all_shortcut)*
    ;

auditing_on_clause
    : ON normal_relation_factor
    | ON DEFAULT
    ;

audit_user_list
    : audit_user_with_host_name (Comma audit_user_with_host_name)*
    ;

audit_user_with_host_name
    : audit_user USER_VARIABLE?
    ;

audit_user
    : STRING_VALUE
    | NAME_OB
    | unreserved_keyword_normal
    ;

auditing_by_user_clause
    : BY audit_user_list
    ;

op_audit_tail_clause
    : empty
    | audit_by_session_access_option audit_whenever_option?
    | audit_whenever_option
    ;

audit_by_session_access_option
    : BY ACCESS
    ;

audit_whenever_option
    : WHENEVER NOT? SUCCESSFUL
    ;

audit_all_shortcut
    : ALTER SYSTEM?
    | CLUSTER
    | CONTEXT
    | MATERIALIZED? VIEW
    | NOT EXISTS
    | OUTLINE
    | EXECUTE? PROCEDURE
    | PROFILE
    | SESSION
    | SYSTEM? AUDIT
    | SYSTEM? GRANT
    | ALTER? TABLE
    | TABLESPACE
    | TRIGGER
    | GRANT? TYPE
    | USER
    | COMMENT TABLE?
    | DELETE TABLE?
    | GRANT PROCEDURE
    | GRANT TABLE
    | INSERT TABLE?
    | SELECT TABLE?
    | UPDATE TABLE?
    | EXECUTE
    | FLASHBACK
    | INDEX
    | RENAME
    ;

rename_table_stmt
    : RENAME TABLE rename_table_actions
    ;

rename_table_actions
    : rename_table_action (Comma rename_table_action)*
    ;

rename_table_action
    : relation_factor TO relation_factor
    ;

alter_table_stmt
    : ALTER TABLE relation_factor alter_table_actions
    ;

alter_table_actions
    : alter_table_action
    | empty
    | alter_table_actions Comma alter_table_action
    ;

alter_table_action
    : SET? table_option_list_space_seperated
    | alter_column_option
    | alter_tablegroup_option
    | RENAME TO? relation_factor
    | alter_index_option
    | alter_partition_option
    | alter_constraint_option
    | alter_foreign_key_action
    ;

alter_constraint_option
    : DROP CONSTRAINT LeftParen name_list RightParen
    | ADD CONSTRAINT constraint_name CHECK LeftParen expr RightParen
    ;

alter_partition_option
    : DROP (PARTITION|SUBPARTITION) drop_partition_name_list
    | ADD PARTITION opt_partition_range_or_list
    | modify_partition_info
    | REORGANIZE PARTITION name_list INTO opt_partition_range_or_list
    | TRUNCATE (PARTITION|SUBPARTITION) name_list
    ;

opt_partition_range_or_list
    : opt_range_partition_list
    | opt_list_partition_list
    ;

alter_tg_partition_option
    : DROP (PARTITION|SUBPARTITION) drop_partition_name_list
    | ADD PARTITION opt_partition_range_or_list
    | modify_tg_partition_info
    | REORGANIZE PARTITION name_list INTO opt_partition_range_or_list
    | TRUNCATE PARTITION name_list
    ;

drop_partition_name_list
    : name_list
    | LeftParen name_list RightParen
    ;

modify_partition_info
    : hash_partition_option
    | key_partition_option
    | range_partition_option
    | list_partition_option
    ;

modify_tg_partition_info
    : tg_hash_partition_option
    | tg_key_partition_option
    | tg_range_partition_option
    | tg_list_partition_option
    ;

alter_index_option
    : ADD key_or_index index_name? index_using_algorithm? LeftParen sort_column_list RightParen opt_index_options?
    | ADD UNIQUE key_or_index? index_name? index_using_algorithm? LeftParen sort_column_list RightParen opt_index_options?
    | ADD CONSTRAINT constraint_name? UNIQUE key_or_index? index_name? index_using_algorithm? LeftParen sort_column_list RightParen opt_index_options?
    | ADD FULLTEXT key_or_index? index_name? index_using_algorithm? LeftParen sort_column_list RightParen opt_index_options?
    | DROP key_or_index index_name
    | ADD (CONSTRAINT opt_constraint_name)? PRIMARY KEY LeftParen column_name_list RightParen opt_index_options?
    | ALTER INDEX index_name visibility_option
    | RENAME key_or_index index_name TO index_name
    | ALTER INDEX index_name parallel_option
    ;

alter_foreign_key_action
    : DROP FOREIGN KEY index_name
    | ADD (CONSTRAINT opt_constraint_name)? FOREIGN KEY index_name? LeftParen column_name_list RightParen REFERENCES relation_factor LeftParen column_name_list RightParen (MATCH match_action)? (opt_reference_option_list reference_option)?
    ;

visibility_option
    : VISIBLE
    | INVISIBLE
    ;

alter_column_option
    : ADD COLUMN? column_definition
    | ADD COLUMN? LeftParen column_definition_list RightParen
    | DROP column_definition_ref (CASCADE | RESTRICT)?
    | DROP COLUMN column_definition_ref (CASCADE | RESTRICT)?
    | ALTER COLUMN? column_definition_ref alter_column_behavior
    | CHANGE COLUMN? column_definition_ref column_definition
    | MODIFY COLUMN? column_definition
    ;

alter_tablegroup_option
    : DROP TABLEGROUP
    ;

alter_column_behavior
    : SET DEFAULT signed_literal
    | DROP DEFAULT
    ;

flashback_stmt
    : FLASHBACK TABLE relation_factor TO BEFORE DROP (RENAME TO relation_factor)?
    | FLASHBACK database_key database_factor TO BEFORE DROP (RENAME TO database_factor)?
    | FLASHBACK TENANT relation_name TO BEFORE DROP (RENAME TO relation_name)?
    ;

purge_stmt
    : PURGE (((INDEX|TABLE) relation_factor|(RECYCLEBIN|database_key database_factor))|TENANT relation_name)
    ;

optimize_stmt
    : OPTIMIZE TABLE table_list
    | OPTIMIZE TENANT (ALL|relation_name)
    ;

dump_memory_stmt
    : DUMP (CHUNK|ENTITY) ALL
    | DUMP ENTITY P_ENTITY COMP_EQ STRING_VALUE Comma SLOT_IDX COMP_EQ INTNUM
    | DUMP CHUNK TENANT_ID COMP_EQ INTNUM Comma CTX_ID COMP_EQ INTNUM
    | DUMP CHUNK P_CHUNK COMP_EQ STRING_VALUE
    | SET OPTION LEAK_MOD COMP_EQ STRING_VALUE
    | DUMP MEMORY LEAK
    ;

alter_system_stmt
    : ALTER SYSTEM BOOTSTRAP (CLUSTER cluster_role)? server_info_list (PRIMARY_CLUSTER_ID INTNUM PRIMARY_ROOTSERVICE_LIST STRING_VALUE)?
    | ALTER SYSTEM FLUSH cache_type CACHE sql_id_expr? databases_expr? (TENANT COMP_EQ tenant_name_list)? flush_scope
    | ALTER SYSTEM FLUSH SQL cache_type (TENANT COMP_EQ tenant_name_list)? flush_scope
    | ALTER SYSTEM FLUSH KVCACHE tenant_name? cache_name?
    | ALTER SYSTEM FLUSH DAG WARNINGS
    | ALTER SYSTEM FLUSH ILOGCACHE file_id?
    | ALTER SYSTEM ALTER PLAN BASELINE tenant_name? sql_id_expr? baseline_id_expr? SET baseline_asgn_factor
    | ALTER SYSTEM LOAD PLAN BASELINE FROM PLAN CACHE (TENANT COMP_EQ tenant_name_list)? sql_id_expr?
    | ALTER SYSTEM SWITCH REPLICA partition_role partition_id_or_server_or_zone
    | ALTER SYSTEM SWITCH ROOTSERVICE partition_role server_or_zone
    | ALTER SYSTEM alter_or_change_or_modify REPLICA partition_id_desc ip_port alter_or_change_or_modify change_actions FORCE?
    | ALTER SYSTEM DROP REPLICA partition_id_desc ip_port (CREATE_TIMESTAMP opt_equal_mark INTNUM)? zone_desc? FORCE?
    | ALTER SYSTEM migrate_action REPLICA partition_id_desc SOURCE COMP_EQ? STRING_VALUE DESTINATION COMP_EQ? STRING_VALUE FORCE?
    | ALTER SYSTEM REPORT REPLICA server_or_zone?
    | ALTER SYSTEM RECYCLE REPLICA server_or_zone?
    | ALTER SYSTEM START MERGE zone_desc
    | ALTER SYSTEM suspend_or_resume MERGE zone_desc?
    | ALTER SYSTEM suspend_or_resume RECOVERY zone_desc?
    | ALTER SYSTEM CLEAR MERGE ERROR_P
    | ALTER SYSTEM CANCEL cancel_task_type TASK STRING_VALUE
    | ALTER SYSTEM MAJOR FREEZE (IGNORE server_list)?
    | ALTER SYSTEM CHECKPOINT
    | ALTER SYSTEM MINOR FREEZE (tenant_list_tuple | partition_id_desc)? (SERVER opt_equal_mark LeftParen server_list RightParen)? zone_desc?
    | ALTER SYSTEM CLEAR ROOTTABLE tenant_name?
    | ALTER SYSTEM server_action SERVER server_list zone_desc?
    | ALTER SYSTEM ADD ZONE relation_name_or_string add_or_alter_zone_options
    | ALTER SYSTEM zone_action ZONE relation_name_or_string
    | ALTER SYSTEM alter_or_change_or_modify ZONE relation_name_or_string SET? add_or_alter_zone_options
    | ALTER SYSTEM REFRESH SCHEMA server_or_zone?
    | ALTER SYSTEM REFRESH MEMORY STAT server_or_zone?
    | ALTER SYSTEM SET? alter_system_set_parameter_actions
    | ALTER SYSTEM SET_TP alter_system_settp_actions server_or_zone?
    | ALTER SYSTEM CLEAR LOCATION CACHE server_or_zone?
    | ALTER SYSTEM REMOVE BALANCE TASK (TENANT COMP_EQ tenant_name_list)? (ZONE COMP_EQ zone_list)? (TYPE opt_equal_mark balance_task_type)?
    | ALTER SYSTEM RELOAD GTS
    | ALTER SYSTEM RELOAD UNIT
    | ALTER SYSTEM RELOAD SERVER
    | ALTER SYSTEM RELOAD ZONE
    | ALTER SYSTEM MIGRATE UNIT COMP_EQ? INTNUM DESTINATION COMP_EQ? STRING_VALUE
    | ALTER SYSTEM CANCEL MIGRATE UNIT INTNUM
    | ALTER SYSTEM UPGRADE VIRTUAL SCHEMA
    | ALTER SYSTEM RUN JOB STRING_VALUE server_or_zone?
    | ALTER SYSTEM upgrade_action UPGRADE
    | ALTER SYSTEM RUN UPGRADE JOB STRING_VALUE
    | ALTER SYSTEM STOP UPGRADE JOB
    | ALTER SYSTEM upgrade_action ROLLING UPGRADE
    | ALTER SYSTEM REFRESH TIME_ZONE_INFO
    | ALTER SYSTEM ENABLE SQL THROTTLE (FOR PRIORITY COMP_LE INTNUM)? opt_sql_throttle_using_cond
    | ALTER SYSTEM DISABLE SQL THROTTLE
    | ALTER SYSTEM SET DISK VALID ip_port
    | ALTER SYSTEM SET NETWORK BANDWIDTH REGION relation_name_or_string TO relation_name_or_string conf_const
    | ALTER SYSTEM ADD RESTORE SOURCE STRING_VALUE
    | ALTER SYSTEM CLEAR RESTORE SOURCE
    | ALTER SYSTEM RESTORE tenant_name FROM STRING_VALUE
    | ALTER SYSTEM RESTORE table_list FOR relation_name FROM relation_name AT STRING_VALUE UNTIL STRING_VALUE WITH STRING_VALUE
    | ALTER SYSTEM RESTORE relation_name FROM relation_name (AT STRING_VALUE)? (UNTIL STRING_VALUE)? WITH STRING_VALUE PREVIEW?
    | ALTER SYSTEM CHANGE TENANT change_tenant_name_or_tenant_id
    | ALTER SYSTEM DROP TABLES IN SESSION INTNUM
    | ALTER SYSTEM REFRESH TABLES IN SESSION INTNUM
    | ALTER DISKGROUP relation_name ADD DISK STRING_VALUE (NAME opt_equal_mark relation_name_or_string)? ip_port zone_desc?
    | ALTER DISKGROUP relation_name DROP DISK STRING_VALUE ip_port zone_desc?
    | ALTER SYSTEM ARCHIVELOG
    | ALTER SYSTEM NOARCHIVELOG
    | ALTER SYSTEM BACKUP DATABASE
    | ALTER SYSTEM BACKUP INCREMENTAL DATABASE
    | ALTER SYSTEM CANCEL BACKUP
    | ALTER SYSTEM SUSPEND BACKUP
    | ALTER SYSTEM RESUME BACKUP
    | ALTER SYSTEM DELETE EXPIRED BACKUP (COPY INTNUM)?
    | ALTER SYSTEM DELETE BACKUPSET INTNUM (COPY INTNUM)?
    | ALTER SYSTEM VALIDATE DATABASE (COPY INTNUM)?
    | ALTER SYSTEM VALIDATE BACKUPSET INTNUM (COPY INTNUM)?
    | ALTER SYSTEM CANCEL VALIDATE INTNUM (COPY INTNUM)?
    | ALTER SYSTEM DELETE OBSOLETE BACKUP
    | ALTER SYSTEM CANCEL DELETE BACKUP
    | ALTER SYSTEM CANCEL BACKUP BACKUPSET
    | ALTER SYSTEM DELETE BACKUPPIECE INTNUM (COPY INTNUM)?
    | ALTER SYSTEM CANCEL BACKUP BACKUPPIECE
    | ALTER SYSTEM DELETE BACKUPROUND INTNUM (COPY INTNUM)?
    | ALTER SYSTEM CANCEL ALL BACKUP FORCE
    | ALTER SYSTEM BACKUP BACKUPSET ALL ((TENANT_ID opt_equal_mark INTNUM) | (TENANT opt_equal_mark relation_name_or_string))? (BACKUP_BACKUP_DEST opt_equal_mark STRING_VALUE)?
    | ALTER SYSTEM BACKUP BACKUPSET COMP_EQ? INTNUM ((TENANT_ID opt_equal_mark INTNUM) | (TENANT opt_equal_mark relation_name_or_string))? (BACKUP_BACKUP_DEST opt_equal_mark STRING_VALUE)?
    | ALTER SYSTEM BACKUP BACKUPSET ALL NOT BACKED UP INTNUM TIMES ((TENANT_ID opt_equal_mark INTNUM) | (TENANT opt_equal_mark relation_name_or_string))? (BACKUP_BACKUP_DEST opt_equal_mark STRING_VALUE)?
    | ALTER SYSTEM START BACKUP ARCHIVELOG
    | ALTER SYSTEM STOP BACKUP ARCHIVELOG
    | ALTER SYSTEM BACKUP BACKUPPIECE ALL (WITH ACTIVE)? ((TENANT_ID opt_equal_mark INTNUM) | (TENANT opt_equal_mark relation_name_or_string))? (BACKUP_BACKUP_DEST opt_equal_mark STRING_VALUE)?
    | ALTER SYSTEM BACKUP BACKUPPIECE COMP_EQ? INTNUM (WITH ACTIVE)? ((TENANT_ID opt_equal_mark INTNUM) | (TENANT opt_equal_mark relation_name_or_string))? (BACKUP_BACKUP_DEST opt_equal_mark STRING_VALUE)?
    | ALTER SYSTEM BACKUP BACKUPPIECE ALL NOT BACKED UP INTNUM TIMES (WITH ACTIVE)? ((TENANT_ID opt_equal_mark INTNUM) | (TENANT opt_equal_mark relation_name_or_string))? (BACKUP_BACKUP_DEST opt_equal_mark STRING_VALUE)?
    | SET ENCRYPTION ON IDENTIFIED BY STRING_VALUE ONLY
    | SET DECRYPTION IDENTIFIED BY string_list
    | ALTER SYSTEM BACKUP TENANT backup_tenant_name_list TO STRING_VALUE
    ;

opt_sql_throttle_using_cond
    : USING sql_throttle_one_or_more_metrics
    ;

sql_throttle_one_or_more_metrics
    : sql_throttle_metric sql_throttle_one_or_more_metrics?
    ;

sql_throttle_metric
    : ((CPU|RT)|(NETWORK|QUEUE_TIME)) COMP_EQ int_or_decimal
    | (IO|LOGICAL_READS) COMP_EQ INTNUM
    ;

change_tenant_name_or_tenant_id
    : relation_name_or_string
    | TENANT_ID COMP_EQ? INTNUM
    ;

cache_type
    : ALL
    | LOCATION
    | CLOG
    | ILOG
    | COLUMN_STAT
    | BLOCK_INDEX
    | BLOCK
    | ROW
    | BLOOM_FILTER
    | SCHEMA
    | PLAN
    | AUDIT
    | PL
    | PS
    ;

balance_task_type
    : AUTO
    | MANUAL
    | ALL
    ;

tenant_list_tuple
    : TENANT COMP_EQ? LeftParen tenant_name_list RightParen
    ;

tenant_name_list
    : relation_name_or_string (Comma relation_name_or_string)*
    ;

backup_tenant_name_list
    : COMP_EQ? tenant_name_list
    ;

flush_scope
    : GLOBAL?
    ;

server_info_list
    : server_info (Comma server_info)*
    ;

server_info
    : REGION COMP_EQ? relation_name_or_string ZONE COMP_EQ? relation_name_or_string SERVER COMP_EQ? STRING_VALUE
    | ZONE COMP_EQ? relation_name_or_string SERVER COMP_EQ? STRING_VALUE
    ;

server_action
    : ADD
    | CANCEL? DELETE
    | START
    | FORCE? STOP
    | ISOLATE
    ;

server_list
    : STRING_VALUE (Comma STRING_VALUE)*
    ;

zone_action
    : DELETE
    | START
    | FORCE? STOP
    | ISOLATE
    ;

ip_port
    : SERVER COMP_EQ? STRING_VALUE
    ;

zone_desc
    : ZONE COMP_EQ? relation_name_or_string
    ;

server_or_zone
    : ip_port
    | zone_desc
    ;

add_or_alter_zone_option
    : REGION COMP_EQ? relation_name_or_string
    | IDC COMP_EQ? relation_name_or_string
    | ZONE_TYPE COMP_EQ? relation_name_or_string
    ;

add_or_alter_zone_options
    : add_or_alter_zone_option
    | empty
    | add_or_alter_zone_options Comma add_or_alter_zone_option
    ;

alter_or_change_or_modify
    : ALTER
    | CHANGE
    | MODIFY
    ;

partition_id_desc
    : PARTITION_ID COMP_EQ? STRING_VALUE
    ;

partition_id_or_server_or_zone
    : partition_id_desc ip_port
    | ip_port tenant_name?
    | zone_desc tenant_name?
    ;

migrate_action
    : MOVE
    | COPY
    ;

change_actions
    : change_action change_actions?
    ;

change_action
    : replica_type
    | memstore_percent
    ;

replica_type
    : REPLICA_TYPE COMP_EQ? STRING_VALUE
    ;

memstore_percent
    : MEMSTORE_PERCENT COMP_EQ? INTNUM
    ;

suspend_or_resume
    : SUSPEND
    | RESUME
    ;

baseline_id_expr
    : BASELINE_ID COMP_EQ? INTNUM
    ;

sql_id_expr
    : SQL_ID COMP_EQ? STRING_VALUE
    ;

baseline_asgn_factor
    : column_name COMP_EQ literal
    ;

tenant_name
    : TENANT COMP_EQ? relation_name_or_string
    ;

cache_name
    : CACHE COMP_EQ? relation_name_or_string
    ;

file_id
    : FILE_ID COMP_EQ? INTNUM
    ;

cancel_task_type
    : PARTITION MIGRATION
    | empty
    ;

alter_system_set_parameter_actions
    : alter_system_set_parameter_action (Comma alter_system_set_parameter_action)*
    ;

alter_system_set_parameter_action
    : NAME_OB COMP_EQ conf_const (COMMENT STRING_VALUE)? ((SCOPE COMP_EQ MEMORY) | (SCOPE COMP_EQ SPFILE) | (SCOPE COMP_EQ BOTH))? server_or_zone? tenant_name?
    | TABLET_SIZE COMP_EQ conf_const (COMMENT STRING_VALUE)? ((SCOPE COMP_EQ MEMORY) | (SCOPE COMP_EQ SPFILE) | (SCOPE COMP_EQ BOTH))? server_or_zone? tenant_name?
    | CLUSTER_ID COMP_EQ conf_const (COMMENT STRING_VALUE)? ((SCOPE COMP_EQ MEMORY) | (SCOPE COMP_EQ SPFILE) | (SCOPE COMP_EQ BOTH))? server_or_zone? tenant_name?
    | ROOTSERVICE_LIST COMP_EQ STRING_VALUE (COMMENT STRING_VALUE)? ((SCOPE COMP_EQ MEMORY) | (SCOPE COMP_EQ SPFILE) | (SCOPE COMP_EQ BOTH))? server_or_zone? tenant_name?
    | BACKUP_BACKUP_DEST COMP_EQ STRING_VALUE (COMMENT STRING_VALUE)? ((SCOPE COMP_EQ MEMORY) | (SCOPE COMP_EQ SPFILE) | (SCOPE COMP_EQ BOTH))? server_or_zone? tenant_name?
    | OBCONFIG_URL COMP_EQ STRING_VALUE (COMMENT STRING_VALUE)? ((SCOPE COMP_EQ MEMORY) | (SCOPE COMP_EQ SPFILE) | (SCOPE COMP_EQ BOTH))? server_or_zone? tenant_name?
    ;

alter_system_settp_actions
    : settp_option
    | empty
    | alter_system_settp_actions Comma settp_option
    ;

settp_option
    : TP_NO COMP_EQ? INTNUM
    | TP_NAME COMP_EQ? relation_name_or_string
    | OCCUR COMP_EQ? INTNUM
    | FREQUENCY COMP_EQ? INTNUM
    | ERROR_CODE COMP_EQ? INTNUM
    ;

cluster_role
    : PRIMARY
    | STANDBY
    ;

partition_role
    : LEADER
    | FOLLOWER
    ;

upgrade_action
    : BEGI
    | END
    ;

set_names_stmt
    : SET NAMES charset_name_or_default collation?
    ;

set_charset_stmt
    : SET charset_key charset_name_or_default
    ;

set_transaction_stmt
    : SET ((GLOBAL?|SESSION)|LOCAL) TRANSACTION transaction_characteristics
    ;

transaction_characteristics
    : transaction_access_mode
    | (transaction_access_mode Comma)? ISOLATION LEVEL isolation_level
    | ISOLATION LEVEL isolation_level Comma transaction_access_mode
    ;

transaction_access_mode
    : READ ONLY
    | READ WRITE
    ;

isolation_level
    : READ UNCOMMITTED
    | READ COMMITTED
    | REPEATABLE READ
    | SERIALIZABLE
    ;

create_savepoint_stmt
    : SAVEPOINT var_name
    ;

rollback_savepoint_stmt
    : ROLLBACK WORK? TO var_name
    | ROLLBACK TO SAVEPOINT var_name
    ;

release_savepoint_stmt
    : RELEASE SAVEPOINT var_name
    ;

alter_cluster_stmt
    : ALTER SYSTEM cluster_action VERIFY
    | ALTER SYSTEM cluster_action cluster_define FORCE?
    | ALTER SYSTEM alter_or_change_or_modify CLUSTER cluster_define SET? cluster_option_list
    ;

cluster_define
    : cluster_name CLUSTER_ID COMP_EQ? conf_const
    ;

cluster_option_list
    : cluster_option (Comma cluster_option_list)?
    ;

cluster_option
    : ROOTSERVICE_LIST COMP_EQ? STRING_VALUE
    | REDO_TRANSPORT_OPTIONS COMP_EQ? relation_name_or_string
    ;

cluster_action
    : ADD CLUSTER
    | REMOVE CLUSTER
    | (DISABLE|ENABLE) CLUSTER SYNCHRONIZATION
    ;

switchover_cluster_stmt
    : ALTER SYSTEM commit_switchover_clause FORCE?
    ;

commit_switchover_clause
    : COMMIT TO SWITCHOVER TO PRIMARY (WITH SESSION SHUTDOWN)?
    | COMMIT TO SWITCHOVER TO PHYSICAL STANDBY (WITH SESSION SHUTDOWN)?
    | ACTIVATE PHYSICAL STANDBY CLUSTER
    | CONVERT TO PHYSICAL STANDBY
    | FAILOVER TO cluster_define
    ;

protection_mode_stmt
    : ALTER SYSTEM SET STANDBY CLUSTER TO MAXIMIZE protection_mode_option
    ;

protection_mode_option
    : AVAILABILITY
    | PERFORMANCE
    | PROTECTION
    ;

cluster_name
    : relation_name
    | STRING_VALUE
    ;

disconnect_cluster_stmt
    : ALTER SYSTEM DISCONNECT STANDBY CLUSTER cluster_define SET CLUSTER_NAME cluster_name (OBCONFIG_URL STRING_VALUE)? FORCE? VERIFY?
    ;

var_name
    : NAME_OB
    | unreserved_keyword_normal
    | new_or_old_column_ref
    ;

new_or_old
    : NEW
    | OLD
    ;

new_or_old_column_ref
    : new_or_old Dot column_name
    ;

column_name
    : NAME_OB
    | unreserved_keyword
    ;

relation_name
    : NAME_OB
    | unreserved_keyword
    ;

function_name
    : NAME_OB
    | DUMP
    | CHARSET
    | COLLATION
    | KEY_VERSION
    | USER
    | DATABASE
    | SCHEMA
    | COALESCE
    | REPEAT
    | ROW_COUNT
    | REVERSE
    | RIGHT
    | CURRENT_USER
    | SYSTEM_USER
    | SESSION_USER
    | REPLACE
    | TRUNCATE
    | FORMAT
    ;

column_label
    : NAME_OB
    | unreserved_keyword
    ;

date_unit
    : DAY
    | DAY_HOUR
    | DAY_MICROSECOND
    | DAY_MINUTE
    | DAY_SECOND
    | HOUR
    | HOUR_MICROSECOND
    | HOUR_MINUTE
    | HOUR_SECOND
    | MICROSECOND
    | MINUTE
    | MINUTE_MICROSECOND
    | MINUTE_SECOND
    | MONTH
    | QUARTER
    | SECOND
    | SECOND_MICROSECOND
    | WEEK
    | YEAR
    | YEAR_MONTH
    ;

json_value_expr
    : JSON_VALUE LeftParen simple_expr Comma complex_string_literal (RETURNING cast_data_type)? (on_empty | on_error | (on_empty on_error))? RightParen
    ;

on_empty
    : json_on_response ON EMPTY
    ;

on_error
    : json_on_response ON ERROR_P
    ;

json_on_response
    : ERROR_P
    | NULLX
    | DEFAULT signed_literal
    ;

unreserved_keyword
    : unreserved_keyword_normal
    | unreserved_keyword_special
    | unreserved_keyword_extra
    ;

unreserved_keyword_normal
    : ACCOUNT
    | ACTION
    | ACTIVE
    | ADDDATE
    | AFTER
    | AGAINST
    | AGGREGATE
    | ALGORITHM
    | ALWAYS
    | ANALYSE
    | ANY
    | APPROX_COUNT_DISTINCT
    | APPROX_COUNT_DISTINCT_SYNOPSIS
    | APPROX_COUNT_DISTINCT_SYNOPSIS_MERGE
    | ARCHIVELOG
    | ASCII
    | AT
    | AUDIT
    | AUTHORS
    | AUTO
    | AUTOEXTEND_SIZE
    | AUTO_INCREMENT
    | AVG
    | AVG_ROW_LENGTH
    | BACKUP
    | BACKUPSET
    | BASE
    | BASELINE
    | BASELINE_ID
    | BASIC
    | BALANCE
    | BANDWIDTH
    | BEGI
    | BINDING
    | BINLOG
    | BIT
    | BIT_AND
    | BIT_OR
    | BIT_XOR
    | BISON_LIST
    | BLOCK
    | BLOCK_SIZE
    | BLOCK_INDEX
    | BLOOM_FILTER
    | BOOL
    | BOOLEAN
    | BOOTSTRAP
    | BTREE
    | BYTE
    | BREADTH
    | BUCKETS
    | CACHE
    | KVCACHE
    | ILOGCACHE
    | CALC_PARTITION_ID
    | CANCEL
    | CASCADED
    | CAST
    | CATALOG_NAME
    | CHAIN
    | CHANGED
    | CHARSET
    | CHECKSUM
    | CHECKPOINT
    | CHUNK
    | CIPHER
    | CLASS_ORIGIN
    | CLEAN
    | CLEAR
    | CLIENT
    | CLOSE
    | CLOG
    | CLUSTER
    | CLUSTER_ID
    | CLUSTER_NAME
    | COALESCE
    | CODE
    | COLLATION
    | COLUMN_FORMAT
    | COLUMN_NAME
    | COLUMN_STAT
    | COLUMNS
    | COMMENT
    | COMMIT
    | COMMITTED
    | COMPACT
    | COMPLETION
    | COMPRESSED
    | COMPRESSION
    | COMPUTE
    | CONCURRENT
    | CONDENSED
    | CONNECTION
    | CONSISTENT
    | CONSISTENT_MODE
    | CONSTRAINT_CATALOG
    | CONSTRAINT_NAME
    | CONSTRAINT_SCHEMA
    | CONTAINS
    | CONTEXT
    | CONTRIBUTORS
    | COPY
    | COUNT
    | CPU
    | CREATE_TIMESTAMP
    | CTXCAT
    | CTX_ID
    | CUBE
    | CUME_DIST
    | CURDATE
    | CURRENT
    | CURSOR_NAME
    | CURTIME
    | CYCLE
    | DAG
    | DATA
    | DATABASE_ID
    | DATAFILE
    | DATA_TABLE_ID
    | DATE
    | DATE_ADD
    | DATE_SUB
    | DATETIME
    | DAY
    | DEALLOCATE
    | DECRYPTION
    | DEFAULT_AUTH
    | DEFINER
    | DELAY
    | DELAY_KEY_WRITE
    | DENSE_RANK
    | DEPTH
    | DES_KEY_FILE
    | DESTINATION
    | DIAGNOSTICS
    | DIRECTORY
    | DISABLE
    | DISCARD
    | DISK
    | DISKGROUP
    | DISCONNECT
    | DO
    | DUMP
    | DUMPFILE
    | DUPLICATE
    | DUPLICATE_SCOPE
    | DYNAMIC
    | DEFAULT_TABLEGROUP
    | EFFECTIVE
    | EMPTY
    | ENABLE
    | ENCRYPTION
    | END
    | ENDS
    | ENGINE_
    | ENGINES
    | ENUM
    | ENTITY
    | ERROR_CODE
    | ERROR_P
    | ERRORS
    | ESCAPE
    | ESTIMATE
    | EVENT
    | EVENTS
    | EVERY
    | EXCEPT
    | EXCHANGE
    | EXECUTE
    | EXPANSION
    | EXPIRE
    | EXPIRED
    | EXPIRE_INFO
    | EXPORT
    | EXTENDED
    | EXTENDED_NOADDR
    | EXTENT_SIZE
    | FAILOVER
    | EXTRACT
    | FAST
    | FAULTS
    | FLASHBACK
    | FIELDS
    | FILEX
    | FILE_ID
    | FINAL_COUNT
    | FIRST
    | FIRST_VALUE
    | FIXED
    | FLUSH
    | FOLLOWER
    | FOLLOWING
    | FORMAT
    | FROZEN
    | FOUND
    | FREEZE
    | FREQUENCY
    | FUNCTION
    | FULL
    | GENERAL
    | GEOMETRY
    | GEOMETRYCOLLECTION
    | GET_FORMAT
    | GLOBAL
    | GLOBAL_NAME
    | GRANTS
    | GROUPING
    | GROUP_CONCAT
    | GTS
    | HANDLER
    | HASH
    | HELP
    | HISTOGRAM
    | HOST
    | HOSTS
    | HOUR
    | HYBRID_HIST
    | ID
    | IDC
    | IDENTIFIED
    | IGNORE_SERVER_IDS
    | ILOG
    | IMPORT
    | INDEXES
    | INDEX_TABLE_ID
    | INCR
    | INFO
    | INITIAL_SIZE
    | INNODB
    | INSERT_METHOD
    | INSTALL
    | INSTANCE
    | INTERSECT
    | INVOKER
    | INCREMENT
    | INCREMENTAL
    | IO
    | IO_THREAD
    | IPC
    | ISNULL
    | ISOLATION
    | ISOLATE
    | ISSUER
    | JOB
    | JSON
    | JSON_VALUE
    | JSON_ARRAYAGG
    | JSON_OBJECTAGG
    | KEY_BLOCK_SIZE
    | KEY_VERSION
    | LAG
    | LANGUAGE
    | LAST
    | LAST_VALUE
    | LEAD
    | LEADER
    | LEAK
    | LEAK_MOD
    | LEAVES
    | LESS
    | LEVEL
    | LINESTRING
    | LIST_
    | LISTAGG
    | LN
    | LOCAL
    | LOCALITY
    | LOCKED
    | LOCKS
    | LOG
    | LOGFILE
    | LOGONLY_REPLICA_NUM
    | LOGS
    | MAJOR
    | MANUAL
    | MASTER
    | MASTER_AUTO_POSITION
    | MASTER_CONNECT_RETRY
    | MASTER_DELAY
    | MASTER_HEARTBEAT_PERIOD
    | MASTER_HOST
    | MASTER_LOG_FILE
    | MASTER_LOG_POS
    | MASTER_PASSWORD
    | MASTER_PORT
    | MASTER_RETRY_COUNT
    | MASTER_SERVER_ID
    | MASTER_SSL
    | MASTER_SSL_CA
    | MASTER_SSL_CAPATH
    | MASTER_SSL_CERT
    | MASTER_SSL_CIPHER
    | MASTER_SSL_CRL
    | MASTER_SSL_CRLPATH
    | MASTER_SSL_KEY
    | MASTER_USER
    | MAX
    | MAX_CONNECTIONS_PER_HOUR
    | MAX_CPU
    | MAX_DISK_SIZE
    | MAX_IOPS
    | MAX_MEMORY
    | MAX_QUERIES_PER_HOUR
    | MAX_ROWS
    | MAX_SESSION_NUM
    | MAX_SIZE
    | MAX_UPDATES_PER_HOUR
    | MAX_USER_CONNECTIONS
    | MEDIUM
    | MEMBER
    | MEMORY
    | MEMTABLE
    | MERGE
    | MESSAGE_TEXT
    | MEMSTORE_PERCENT
    | META
    | MICROSECOND
    | MIGRATE
    | MIGRATION
    | MIN
    | MINVALUE
    | MIN_CPU
    | MIN_IOPS
    | MIN_MEMORY
    | MINOR
    | MIN_ROWS
    | MINUTE
    | MINUS
    | MODE
    | MODIFY
    | MONTH
    | MOVE
    | MULTILINESTRING
    | MULTIPOINT
    | MULTIPOLYGON
    | MUTEX
    | MYSQL_ERRNO
    | MAX_USED_PART_ID
    | NAME
    | NAMES
    | NATIONAL
    | NCHAR
    | NDB
    | NDBCLUSTER
    | NEW
    | NEXT
    | NO
    | NOARCHIVELOG
    | NOAUDIT
    | NOCACHE
    | NOCYCLE
    | NODEGROUP
    | NOMINVALUE
    | NOMAXVALUE
    | NONE
    | NOORDER
    | NOPARALLEL
    | NORMAL
    | NOW
    | NOWAIT
    | NO_WAIT
    | NTILE
    | NTH_VALUE
    | NUMBER
    | NULLS
    | NVARCHAR
    | OCCUR
    | OF
    | OFF
    | OFFSET
    | OLD
    | OLD_PASSWORD
    | OLD_KEY
    | OVER
    | OBCONFIG_URL
    | ONE
    | ONE_SHOT
    | ONLY
    | OPEN
    | OPTIONS
    | ORIG_DEFAULT
    | REMOTE_OSS
    | OUTLINE
    | OWNER
    | PACK_KEYS
    | PAGE
    | PARALLEL
    | PARAMETERS
    | PARSER
    | PARTIAL
    | PARTITION_ID
    | PARTITIONING
    | PARTITIONS
    | PERCENT_RANK
    | PAUSE
    | PERCENTAGE
    | PHASE
    | PHYSICAL
    | PL
    | PLANREGRESS
    | PLUGIN
    | PLUGIN_DIR
    | PLUGINS
    | POINT
    | POLYGON
    | POOL
    | PORT
    | POSITION
    | PRECEDING
    | PREPARE
    | PRESERVE
    | PREV
    | PRIMARY_CLUSTER_ID
    | PRIMARY_ZONE
    | PRIMARY_ROOTSERVICE_LIST
    | PRIVILEGES
    | PROCESS
    | PROCESSLIST
    | PROFILE
    | PROFILES
    | PROGRESSIVE_MERGE_NUM
    | PROXY
    | PS
    | PUBLIC
    | PCTFREE
    | P_ENTITY
    | P_CHUNK
    | QUARTER
    | QUERY
    | QUEUE_TIME
    | QUICK
    | RANK
    | READ_ONLY
    | REBUILD
    | RECOVER
    | RECOVERY
    | RECURSIVE
    | RECYCLE
    | RECYCLEBIN
    | ROTATE
    | ROW_NUMBER
    | REDO_BUFFER_SIZE
    | REDOFILE
    | REDUNDANT
    | REFRESH
    | REGION
    | RELAY
    | RELAYLOG
    | RELAY_LOG_FILE
    | RELAY_LOG_POS
    | RELAY_THREAD
    | RELOAD
    | REMOVE
    | REORGANIZE
    | REPAIR
    | REPEATABLE
    | REPLICA
    | REPLICA_NUM
    | REPLICA_TYPE
    | REPLICATION
    | REPORT
    | RESET
    | RESOURCE
    | RESOURCE_POOL_LIST
    | RESPECT
    | RESTART
    | RESTORE
    | RESUME
    | RETURNED_SQLSTATE
    | RETURNING
    | RETURNS
    | REVERSE
    | REWRITE_MERGE_VERSION
    | ROLLBACK
    | ROLLING
    | ROLLUP
    | ROOT
    | ROOTSERVICE
    | ROOTSERVICE_LIST
    | ROOTTABLE
    | ROUTINE
    | ROW
    | ROW_COUNT
    | ROW_FORMAT
    | ROWS
    | RTREE
    | RUN
    | SAMPLE
    | SAVEPOINT
    | SCHEDULE
    | SCHEMA_NAME
    | SCOPE
    | SECOND
    | SECURITY
    | SEED
    | SEQUENCE
    | SERIAL
    | SERIALIZABLE
    | SERVER
    | SERVER_IP
    | SERVER_PORT
    | SERVER_TYPE
    | SESSION
    | SESSION_USER
    | SET_MASTER_CLUSTER
    | SET_SLAVE_CLUSTER
    | SET_TP
    | SHARE
    | SHUTDOWN
    | SIGNED
    | SIZE
    | SIMPLE
    | SLAVE
    | SLOW
    | SNAPSHOT
    | SOCKET
    | SOME
    | SONAME
    | SORTKEY
    | SOUNDS
    | SOURCE
    | SPFILE
    | SPLIT
    | SQL_AFTER_GTIDS
    | SQL_AFTER_MTS_GAPS
    | SQL_BEFORE_GTIDS
    | SQL_BUFFER_RESULT
    | SQL_CACHE
    | SQL_ID
    | SQL_NO_CACHE
    | SQL_THREAD
    | SQL_TSI_DAY
    | SQL_TSI_HOUR
    | SQL_TSI_MINUTE
    | SQL_TSI_MONTH
    | SQL_TSI_QUARTER
    | SQL_TSI_SECOND
    | SQL_TSI_WEEK
    | SQL_TSI_YEAR
    | STANDBY
    | START
    | STARTS
    | STAT
    | STATISTICS
    | STATS_AUTO_RECALC
    | STATS_PERSISTENT
    | STATS_SAMPLE_PAGES
    | STATUS
    | STATEMENTS
    | STD
    | STDDEV
    | STDDEV_POP
    | STDDEV_SAMP
    | STOP
    | STORAGE
    | STORAGE_FORMAT_VERSION
    | STORAGE_FORMAT_WORK_VERSION
    | STORING
    | STRONG
    | STRING
    | SUBCLASS_ORIGIN
    | SUBDATE
    | SUBJECT
    | SUBPARTITION
    | SUBPARTITIONS
    | SUBSTR
    | SUBSTRING
    | SUCCESSFUL
    | SUM
    | SUPER
    | SUSPEND
    | SWAPS
    | SWITCH
    | SWITCHES
    | SWITCHOVER
    | SYSTEM
    | SYSTEM_USER
    | SYSDATE
    | TABLE_CHECKSUM
    | TABLE_MODE
    | TABLEGROUPS
    | TABLE_ID
    | TABLE_NAME
    | TABLES
    | TABLESPACE
    | TABLET
    | TABLET_SIZE
    | TABLET_MAX_SIZE
    | TASK
    | TEMPLATE
    | TEMPORARY
    | TEMPTABLE
    | TENANT
    | TENANT_ID
    | SLOT_IDX
    | TEXT
    | THAN
    | TIME
    | TIMESTAMP
    | TIMESTAMPADD
    | TIMESTAMPDIFF
    | TIME_ZONE_INFO
    | TP_NAME
    | TP_NO
    | TRACE
    | TRANSACTION
    | TRADITIONAL
    | TRIGGERS
    | TRIM
    | TRUNCATE
    | TYPE
    | TYPES
    | TABLEGROUP_ID
    | TOP_K_FRE_HIST
    | UNCOMMITTED
    | UNDEFINED
    | UNDO_BUFFER_SIZE
    | UNDOFILE
    | UNICODE
    | UNKNOWN
    | UNINSTALL
    | UNIT
    | UNIT_NUM
    | UNLOCKED
    | UNTIL
    | UNUSUAL
    | UPGRADE
    | USE_BLOOM_FILTER
    | USE_FRM
    | USER
    | USER_RESOURCES
    | UNBOUNDED
    | VALID
    | VALIDATE
    | VALUE
    | VARIANCE
    | VARIABLES
    | VAR_POP
    | VAR_SAMP
    | VERBOSE
    | VIRTUAL_COLUMN_ID
    | MATERIALIZED
    | VIEW
    | VERIFY
    | WAIT
    | WARNINGS
    | WEAK
    | WEEK
    | WEIGHT_STRING
    | WHENEVER
    | WINDOW
    | WORK
    | WRAPPER
    | X509
    | XA
    | XML
    | YEAR
    | ZONE
    | ZONE_LIST
    | ZONE_TYPE
    | LOCATION
    | PLAN
    | VISIBLE
    | INVISIBLE
    | ACTIVATE
    | SYNCHRONIZATION
    | THROTTLE
    | PRIORITY
    | RT
    | NETWORK
    | LOGICAL_READS
    | REDO_TRANSPORT_OPTIONS
    | MAXIMIZE
    | AVAILABILITY
    | PERFORMANCE
    | PROTECTION
    | OBSOLETE
    | HIDDEN_
    | INDEXED
    | SKEWONLY
    | INPUT
    | BACKUPPIECE
    | PREVIEW
    | BACKUP_BACKUP_DEST
    | BACKUPROUND
    | UP
    | TIMES
    | BACKED
    ;

unreserved_keyword_special
    : PASSWORD
    ;

unreserved_keyword_extra
    : ACCESS
    ;

mysql_reserved_keyword
    : ACCESSIBLE
    | ADD
    | ALTER
    | ANALYZE
    | AND
    | AS
    | ASC
    | ASENSITIVE
    | BEFORE
    | BETWEEN
    | BIGINT
    | BINARY
    | BLOB
    | BY
    | CALL
    | CASCADE
    | CASE
    | CHANGE
    | CHAR
    | CHARACTER
    | CHECK
    | COLLATE
    | COLUMN
    | CONDITION
    | CONSTRAINT
    | CONTINUE
    | CONVERT
    | CREATE
    | CROSS
    | CURRENT_DATE
    | CURRENT_TIME
    | CURRENT_TIMESTAMP
    | CURRENT_USER
    | CURSOR
    | DATABASE
    | DATABASES
    | DAY_HOUR
    | DAY_MICROSECOND
    | DAY_MINUTE
    | DAY_SECOND
    | DECLARE
    | DECIMAL
    | DEFAULT
    | DELAYED
    | DELETE
    | DESC
    | DESCRIBE
    | DETERMINISTIC
    | DISTINCTROW
    | DIV
    | DOUBLE
    | DROP
    | DUAL
    | EACH
    | ELSE
    | ELSEIF
    | ENCLOSED
    | ESCAPED
    | EXISTS
    | EXIT
    | EXPLAIN
    | FETCH
    | FLOAT
    | FLOAT4
    | FLOAT8
    | FOR
    | FORCE
    | FOREIGN
    | FULLTEXT
    | GENERATED
    | GET
    | GRANT
    | GROUP
    | HAVING
    | HIGH_PRIORITY
    | HOUR_MICROSECOND
    | HOUR_MINUTE
    | HOUR_SECOND
    | IF
    | IGNORE
    | IN
    | INDEX
    | INFILE
    | INNER
    | INOUT
    | INSENSITIVE
    | INSERT
    | INT
    | INT1
    | INT2
    | INT3
    | INT4
    | INT8
    | INTEGER
    | INTERVAL
    | INTO
    | IO_AFTER_GTIDS
    | IO_BEFORE_GTIDS
    | IS
    | ITERATE
    | JOIN
    | KEY
    | KEYS
    | KILL
    | LEAVE
    | LEFT
    | LIKE
    | LIMIT
    | LINEAR
    | LINES
    | LOAD
    | LOCALTIME
    | LOCALTIMESTAMP
    | LONG
    | LONGBLOB
    | LONGTEXT
    | LOOP
    | LOW_PRIORITY
    | MASTER_BIND
    | MASTER_SSL_VERIFY_SERVER_CERT
    | MATCH
    | MAXVALUE
    | MEDIUMBLOB
    | MEDIUMINT
    | MEDIUMTEXT
    | MIDDLEINT
    | MINUTE_MICROSECOND
    | MINUTE_SECOND
    | MOD
    | MODIFIES
    | NATURAL
    | NOT
    | NO_WRITE_TO_BINLOG
    | ON
    | OPTIMIZE
    | OPTION
    | OPTIONALLY
    | OR
    | ORDER
    | OUT
    | OUTER
    | OUTFILE
    | PARTITION
    | PRECISION
    | PRIMARY
    | PROCEDURE
    | PURGE
    | RANGE
    | READ
    | READS
    | READ_WRITE
    | REAL
    | REFERENCES
    | REGEXP
    | RELEASE
    | RENAME
    | REPEAT
    | REPLACE
    | REQUIRE
    | RESIGNAL
    | RESTRICT
    | RETURN
    | REVOKE
    | RIGHT
    | RLIKE
    | SCHEMA
    | SCHEMAS
    | SECOND_MICROSECOND
    | SENSITIVE
    | SEPARATOR
    | SET
    | SHOW
    | SIGNAL
    | SMALLINT
    | SPATIAL
    | SPECIFIC
    | SQL
    | SQLEXCEPTION
    | SQLSTATE
    | SQLWARNING
    | SQL_BIG_RESULT
    | SQL_SMALL_RESULT
    | SSL
    | STARTING
    | STORED
    | STRAIGHT_JOIN
    | TABLE
    | TERMINATED
    | THEN
    | TINYBLOB
    | TINYINT
    | TINYTEXT
    | TO
    | TRIGGER
    | UNDO
    | UNION
    | UNLOCK
    | UNSIGNED
    | UPDATE
    | USAGE
    | USE
    | USING
    | UTC_DATE
    | UTC_TIME
    | UTC_TIMESTAMP
    | VALUES
    | VARBINARY
    | VARCHAR
    | VARCHARACTER
    | VARYING
    | VIRTUAL
    | WHERE
    | WHILE
    | WITH
    | WRITE
    | XOR
    | YEAR_MONTH
    | ZEROFILL
    ;

empty
    :
    ;

forward_expr
    : expr EOF
    ;

forward_sql_stmt
    : stmt EOF
    ;

ACCESS
    : ( A C C E S S )
    ;

ACCESSIBLE
    : ( A C C E S S I B L E )
    ;

ADD
    : ( A D D )
    ;

AGAINST
    : ( A G A I N S T )
    ;

ALTER
    : ( A L T E R )
    ;

ALWAYS
    : ( A L W A Y S )
    ;

AND
    : ( A N D )
    ;

ANALYZE
    : ( A N A L Y Z E )
    ;

ALL
    : ( A L L )
    ;

AS
    : ( A S )
    ;

ASENSITIVE
    : ( A S E N S I T I V E )
    ;

ASC
    : ( A S C )
    ;

BETWEEN
    : ( B E T W E E N )
    ;

BEFORE
    : ( B E F O R E )
    ;

BIGINT
    : ( B I G I N T )
    ;

BINARY
    : ( B I N A R Y )
    ;

BLOB
    : ( B L O B )
    ;

BOTH
    : ( B O T H )
    ;

BY
    : ( B Y )
    ;

CALL
    : ( C A L L )
    ;

CASCADE
    : ( C A S C A D E )
    ;

CASE
    : ( C A S E )
    ;

CHANGE
    : ( C H A N G E )
    ;

CHARACTER
    : ( C H A R )
    | ( C H A R A C T E R )
    ;

CHECK
    : ( C H E C K )
    ;

CIPHER
    : ( C I P H E R )
    ;

CONDITION
    : ( C O N D I T I O N )
    ;

CONSTRAINT
    : ( C O N S T R A I N T )
    ;

CONTINUE
    : ( C O N T I N U E )
    ;

CONVERT
    : ( C O N V E R T )
    ;

COLLATE
    : ( C O L L A T E )
    ;

COLUMN
    : ( C O L U M N )
    ;

COLUMNS
    : ( C O L U M N S )
    ;

CREATE
    : ( C R E A T E )
    ;

CROSS
    : ( C R O S S )
    ;

CYCLE
    : ( C Y C L E )
    ;

CURRENT_DATE
    : ( C U R R E N T '_' D A T E )
    ;

CURRENT_TIME
    : ( C U R R E N T '_' T I M E )
    ;

CURRENT_TIMESTAMP
    : ( C U R R E N T '_' T I M E S T A M P )
    ;

CURRENT_USER
    : ( C U R R E N T '_' U S E R )
    ;

WITH_ROWID
    : (( W I T H ([ \t\n\r\f]+|('--'[ \t\n\r\f]+(~[\n\r])*)|('#'(~[\n\r])*)) R O W I D ))
    ;

CURSOR
    : ( C U R S O R )
    ;

DAY_HOUR
    : ( D A Y '_' H O U R )
    ;

DAY_MICROSECOND
    : ( D A Y '_' M I C R O S E C O N D )
    ;

DAY_MINUTE
    : ( D A Y '_' M I N U T E )
    ;

DAY_SECOND
    : ( D A Y '_' S E C O N D )
    ;

DATABASE
    : ( D A T A B A S E )
    ;

DATABASES
    : ( D A T A B A S E S )
    ;

NUMBER
    : ( D E C )
    | ( N U M E R I C )
    ;

DECIMAL
    : ( D E C I M A L )
    ;

DECLARE
    : ( D E C L A R E )
    ;

DEFAULT
    : ( D E F A U L T )
    ;

DELAYED
    : ( D E L A Y E D )
    ;

DELETE
    : ( D E L E T E )
    ;

DESC
    : ( D E S C )
    ;

DESCRIBE
    : ( D E S C R I B E )
    ;

DETERMINISTIC
    : ( D E T E R M I N I S T I C )
    ;

DIV
    : ( D I V )
    ;

DISTINCT
    : ( D I S T I N C T )
    ;

DISTINCTROW
    : ( D I S T I N C T R O W )
    ;

DOUBLE
    : ( D O U B L E )
    ;

DROP
    : ( D R O P )
    ;

DUAL
    : ( D U A L )
    ;

EACH
    : ( E A C H )
    ;

ENCLOSED
    : ( E N C L O S E D )
    ;

ELSE
    : ( E L S E )
    ;

ELSEIF
    : ( E L S E I F )
    ;

ESCAPED
    : ( E S C A P E D )
    ;

EXISTS
    : ( E X I S T S )
    ;

EXIT
    : ( E X I T )
    ;

EXPLAIN
    : ( E X P L A I N )
    ;

FETCH
    : ( F E T C H )
    ;

FIELDS
    : ( F I E L D S )
    ;

FOREIGN
    : ( F O R E I G N )
    ;

FLOAT
    : ( F L O A T )
    ;

FLOAT4
    : ( F L O A T '4')
    ;

FLOAT8
    : ( F L O A T '8')
    ;

FOR
    : ( F O R )
    ;

FORCE
    : ( F O R C E )
    ;

FROM
    : ( F R O M )
    ;

FULL
    : ( F U L L )
    ;

FULLTEXT
    : ( F U L L T E X T )
    ;

GET
    : ( G E T )
    ;

GENERATED
    : ( G E N E R A T E D )
    ;

GRANT
    : ( G R A N T )
    ;

GROUP
    : ( G R O U P )
    ;

HAVING
    : ( H A V I N G )
    ;

HIGH_PRIORITY
    : ( H I G H '_' P R I O R I T Y )
    ;

HOUR_MICROSECOND
    : ( H O U R '_' M I C R O S E C O N D )
    ;

HOUR_MINUTE
    : ( H O U R '_' M I N U T E )
    ;

HOUR_SECOND
    : ( H O U R '_' S E C O N D )
    ;

ID
    : ( I D )
    ;

IF
    : ( I F )
    ;

IN
    : ( I N )
    ;

INDEX
    : ( I N D E X )
    ;

INNER
    : ( I N N E R )
    ;

INFILE
    : ( I N F I L E )
    ;

INOUT
    : ( I N O U T )
    ;

INSENSITIVE
    : ( I N S E N S I T I V E )
    ;

INTEGER
    : ( I N T )
    | ( I N T E G E R )
    ;

INT1
    : ( I N T '1')
    ;

INT2
    : ( I N T '2')
    ;

INT3
    : ( I N T '3')
    ;

INT4
    : ( I N T '4')
    ;

INT8
    : ( I N T '8')
    ;

INTERVAL
    : I N T E R V A L
    ;

INSERT
    : ( I N S E R T )
    ;

INTO
    : ( I N T O )
    ;

IO_AFTER_GTIDS
    : ( I O '_' A F T E R '_' G T I D S )
    ;

IO_BEFORE_GTIDS
    : ( I O '_' B E F O R E '_' G T I D S )
    ;

IS
    : ( I S )
    ;

ISSUER
    : ( I S S U E R )
    ;

ITERATE
    : ( I T E R A T E )
    ;

JOIN
    : ( J O I N )
    ;

KEY
    : ( K E Y )
    ;

KEYS
    : ( K E Y S )
    ;

KILL
    : ( K I L L )
    ;

LANGUAGE
    : ( L A N G U A G E )
    ;

LEADING
    : ( L E A D I N G )
    ;

LEAVE
    : ( L E A V E )
    ;

LEFT
    : ( L E F T )
    ;

LIMIT
    : ( L I M I T )
    ;

LIKE
    : ( L I K E )
    ;

LINEAR
    : ( L I N E A R )
    ;

LINES
    : ( L I N E S )
    ;

BISON_LIST
    : ( L I S T )
    ;

LOAD
    : ( L O A D )
    ;

LOCAL
    : ( L O C A L )
    ;

LOCALTIME
    : ( L O C A L T I M E )
    ;

LOCALTIMESTAMP
    : ( L O C A L T I M E S T A M P )
    ;

LOCK_
    : ( L O C K )
    ;

LONG
    : ( L O N G )
    ;

LONGBLOB
    : ( L O N G B L O B )
    ;

LONGTEXT
    : ( L O N G T E X T )
    ;

LOOP
    : ( L O O P )
    ;

LOW_PRIORITY
    : ( L O W '_' P R I O R I T Y )
    ;

MASTER_BIND
    : ( M A S T E R '_' B I N D )
    ;

MASTER_SSL_VERIFY_SERVER_CERT
    : ( M A S T E R '_' S S L '_' V E R I F Y '_' S E R V E R '_' C E R T )
    ;

MATCH
    : ( M A T C H )
    ;

MAXVALUE
    : ( M A X V A L U E )
    ;

MEDIUMBLOB
    : ( M E D I U M B L O B )
    ;

MEDIUMINT
    : ( M E D I U M I N T )
    ;

MERGE
    : ( M E R G E )
    ;

MEDIUMTEXT
    : ( M E D I U M T E X T )
    ;

MIDDLEINT
    : ( M I D D L E I N T )
    ;

MINUTE_MICROSECOND
    : ( M I N U T E '_' M I C R O S E C O N D )
    ;

MINUTE_SECOND
    : ( M I N U T E '_' S E C O N D )
    ;

MOD
    : ( M O D )
    ;

MODE
    : ( M O D E )
    ;

MODIFIES
    : ( M O D I F I E S )
    ;

NATURAL
    : ( N A T U R A L )
    ;

NO_WRITE_TO_BINLOG
    : ( N O '_' W R I T E '_' T O '_' B I N L O G )
    ;

ON
    : ( O N )
    ;

OPTION
    : ( O P T I O N )
    ;

OPTIMIZE
    : ( O P T I M I Z E )
    ;

OPTIONALLY
    : ( O P T I O N A L L Y )
    ;

OR
    : ( O R )
    ;

ORDER
    : ( O R D E R )
    ;

OUT
    : ( O U T )
    ;

OUTER
    : ( O U T E R )
    ;

OUTFILE
    : ( O U T F I L E )
    ;

PARSER
    : ( P A R S E R )
    ;

PROCEDURE
    : ( P R O C E D U R E )
    ;

PURGE
    : ( P U R G E )
    ;

PARTITION
    : ( P A R T I T I O N )
    ;

PRECISION
    : ( P R E C I S I O N )
    ;

PRIMARY
    : ( P R I M A R Y )
    ;

PUBLIC
    : ( P U B L I C )
    ;

RANGE
    : ( R A N G E )
    ;

READ
    : ( R E A D )
    ;

READ_WRITE
    : ( R E A D '_' W R I T E )
    ;

READS
    : ( R E A D S )
    ;

REAL
    : ( R E A L )
    ;

RELEASE
    : ( R E L E A S E )
    ;

REFERENCES
    : ( R E F E R E N C E S )
    ;

REGEXP
    : ( R E G E X P )
    | ( R L I K E )
    ;

RENAME
    : ( R E N A M E )
    ;

REPLACE
    : ( R E P L A C E )
    ;

REPEAT
    : ( R E P E A T )
    ;

REQUIRE
    : ( R E Q U I R E )
    ;

RESIGNAL
    : ( R E S I G N A L )
    ;

RESTRICT
    : ( R E S T R I C T )
    ;

RETURN
    : ( R E T U R N )
    ;

REVOKE
    : ( R E V O K E )
    ;

RIGHT
    : ( R I G H T )
    ;

ROWS
    : ( R O W S )
    ;

SECOND_MICROSECOND
    : ( S E C O N D '_' M I C R O S E C O N D )
    ;

SELECT
    : ( S E L E C T )
    ;

SCHEMA
    : ( S C H E M A )
    ;

SCHEMAS
    : ( S C H E M A S )
    ;

SEPARATOR
    : ( S E P A R A T O R )
    ;

SET
    : ( S E T )
    ;

SENSITIVE
    : ( S E N S I T I V E )
    ;

SHOW
    : ( S H O W )
    ;

SIGNAL
    : ( S I G N A L )
    ;

SMALLINT
    : ( S M A L L I N T )
    ;

SPATIAL
    : ( S P A T I A L )
    ;

SPECIFIC
    : ( S P E C I F I C )
    ;

SQL
    : ( S Q L )
    ;

SQLEXCEPTION
    : ( S Q L E X C E P T I O N )
    ;

SQLSTATE
    : ( S Q L S T A T E )
    ;

SQLWARNING
    : ( S Q L W A R N I N G )
    ;

SQL_BIG_RESULT
    : ( S Q L '_' B I G '_' R E S U L T )
    ;

SQL_CALC_FOUND_ROWS
    : ( S Q L '_' C A L C '_' F O U N D '_' R O W S )
    ;

SQL_SMALL_RESULT
    : ( S Q L '_' S M A L L '_' R E S U L T )
    ;

SSL
    : ( S S L )
    ;

STARTING
    : ( S T A R T I N G )
    ;

STORED
    : ( S T O R E D )
    ;

STRAIGHT_JOIN
    : ( S T R A I G H T '_' J O I N )
    ;

SUBJECT
    : ( S U B J E C T )
    ;

SYSDATE
    : ( S Y S D A T E )
    ;

TERMINATED
    : ( T E R M I N A T E D )
    ;

TEXT
    : ( T E X T )
    ;

TINYBLOB
    : ( T I N Y B L O B )
    ;

TINYINT
    : ( T I N Y I N T )
    ;

TINYTEXT
    : ( T I N Y T E X T )
    ;

TABLE
    : ( T A B L E )
    ;

TABLEGROUP
    : ( T A B L E G R O U P )
    ;

THEN
    : ( T H E N )
    ;

TO
    : ( T O )
    ;

TRAILING
    : ( T R A I L I N G )
    ;

TRIGGER
    : ( T R I G G E R )
    ;

UNDO
    : ( U N D O )
    ;

UNION
    : ( U N I O N )
    ;

UNIQUE
    : ( U N I Q U E )
    ;

UNLOCK
    : ( U N L O C K )
    ;

UNSIGNED
    : ( U N S I G N E D )
    ;

UPDATE
    : ( U P D A T E )
    ;

USAGE
    : ( U S A G E )
    ;

USE
    : ( U S E )
    ;

USING
    : ( U S I N G )
    ;

UTC_DATE
    : ( U T C '_' D A T E )
    ;

UTC_TIME
    : ( U T C '_' T I M E )
    ;

UTC_TIMESTAMP
    : ( U T C '_' T I M E S T A M P )
    ;

VALUES
    : ( V A L U E S )
    ;

VARBINARY
    : ( V A R B I N A R Y )
    ;

VARCHAR
    : ( V A R C H A R )
    | ( V A R C H A R A C T E R )
    ;

VARYING
    : ( V A R Y I N G )
    ;

VIRTUAL
    : ( V I R T U A L )
    ;

WHERE
    : ( W H E R E )
    ;

WHEN
    : ( W H E N )
    ;

WHILE
    : ( W H I L E )
    ;

WINDOW
    : ( W I N D O W )
    ;

WITH
    : ( W I T H )
    ;

WRITE
    : ( W R I T E )
    ;

XOR
    : ( X O R )
    ;

X509
    : ( X '5''0''9')
    ;

YEAR_MONTH
    : ( Y E A R '_' M O N T H )
    ;

ZEROFILL
    : ( Z E R O F I L L )
    ;

GLOBAL_ALIAS
    : ('@''@' G L O B A L )
    ;

SESSION_ALIAS
    : ('@''@' S E S S I O N )
    | ('@''@' L O C A L )
    ;

UnderlineUTF8
    : ('_' U T F '8')
    ;

UnderlineUTF8MB4
    : ('_' U T F '8' M B '4')
    ;

UnderlineGBK
    : ('_' G B K )
    ;

UnderlineGB18030
    : ('_' G B '1''8''0''3''0')
    ;

UnderlineBINARY
    : ('_' B I N A R Y )
    ;

UnderlineUTF16
    : ('_' U T F '1''6')
    ;

STRONG
    : ( S T R O N G )
    ;

WEAK
    : ( W E A K )
    ;

FROZEN
    : ( F R O Z E N )
    ;

EXCEPT
    : ( E X C E P T )
    ;

MINUS
    : ( M I N U S )
    ;

INTERSECT
    : ( I N T E R S E C T )
    ;

ISNULL
    : ( I S N U L L )
    ;

NOT
    : N O T
    ;

NULLX
    : N U L L
    ;

INTNUM
    : [0-9]+
    ;

AUDIT
    : A U D I T
    ;

WARNINGS
    : W A R N I N G S
    ;

FORMAT
    : F O R M A T
    ;

MINVALUE
    : M I N V A L U E
    ;

UNINSTALL
    : U N I N S T A L L
    ;

UNDOFILE
    : U N D O F I L E
    ;

MASTER_SSL_CA
    : M A S T E R '_' S S L '_' C A
    ;

YEAR
    : Y E A R
    ;

DISCONNECT
    : D I S C O N N E C T
    ;

STOP
    : S T O P
    ;

STORAGE_FORMAT_WORK_VERSION
    : S T O R A G E '_' F O R M A T '_' W O R K '_' V E R S I O N
    ;

SIZE
    : S I Z E
    ;

DISABLE_PARALLEL_DML
    : D I S A B L E '_' P A R A L L E L '_' D M L
    ;

AT
    : A T
    ;

RELAY_LOG_POS
    : R E L A Y '_' L O G '_' P O S
    ;

POOL
    : P O O L
    ;

CURDATE
    : C U R D A T E
    ;

JSON_VALUE
    : J S O N '_' V A L U E
    ;

ZONE_TYPE
    : Z O N E '_' T Y P E
    ;

LOCATION
    : L O C A T I O N
    ;

WEIGHT_STRING
    : W E I G H T '_' S T R I N G
    ;

CHANGED
    : C H A N G E D
    ;

MASTER_SSL_CAPATH
    : M A S T E R '_' S S L '_' C A P A T H
    ;

REWRITE_MERGE_VERSION
    : R E W R I T E '_' M E R G E '_' V E R S I O N
    ;

NTH_VALUE
    : N T H '_' V A L U E
    ;

SERIAL
    : S E R I A L
    ;

PROGRESSIVE_MERGE_NUM
    : P R O G R E S S I V E '_' M E R G E '_' N U M
    ;

QUEUE_TIME
    : Q U E U E '_' T I M E
    ;

TABLET_MAX_SIZE
    : T A B L E T '_' M A X '_' S I Z E
    ;

ILOGCACHE
    : I L O G C A C H E
    ;

AUTHORS
    : A U T H O R S
    ;

MIGRATE
    : M I G R A T E
    ;

CONSISTENT
    : C O N S I S T E N T
    ;

SUSPEND
    : S U S P E N D
    ;

REMOTE_OSS
    : R E M O T E '_' O S S
    ;

SECURITY
    : S E C U R I T Y
    ;

SET_SLAVE_CLUSTER
    : S E T '_' S L A V E '_' C L U S T E R
    ;

FAST
    : F A S T
    ;

PREVIEW
    : P R E V I E W
    ;

BANDWIDTH
    : B A N D W I D T H
    ;

TRUNCATE
    : T R U N C A T E
    ;

BACKUP_BACKUP_DEST
    : B A C K U P '_' B A C K U P '_' D E S T
    ;

CONSTRAINT_SCHEMA
    : C O N S T R A I N T '_' S C H E M A
    ;

MASTER_SSL_CERT
    : M A S T E R '_' S S L '_' C E R T
    ;

TABLE_NAME
    : T A B L E '_' N A M E
    ;

PRIORITY
    : P R I O R I T Y
    ;

DO
    : D O
    ;

MASTER_RETRY_COUNT
    : M A S T E R '_' R E T R Y '_' C O U N T
    ;

REPLICA
    : R E P L I C A
    ;

KILL_EXPR
    : K I L L '_' E X P R
    ;

RECOVERY
    : R E C O V E R Y
    ;

OLD_KEY
    : O L D '_' K E Y
    ;

DISABLE
    : D I S A B L E
    ;

PORT
    : P O R T
    ;

REBUILD
    : R E B U I L D
    ;

FOLLOWER
    : F O L L O W E R
    ;

LOWER_OVER
    : L O W E R '_' O V E R
    ;

ROOT
    : R O O T
    ;

REDOFILE
    : R E D O F I L E
    ;

MASTER_SERVER_ID
    : M A S T E R '_' S E R V E R '_' I D
    ;

NCHAR
    : N C H A R
    ;

KEY_BLOCK_SIZE
    : K E Y '_' B L O C K '_' S I Z E
    ;

SEQUENCE
    : S E Q U E N C E
    ;

MIGRATION
    : M I G R A T I O N
    ;

SUBPARTITION
    : S U B P A R T I T I O N
    ;

MYSQL_DRIVER
    : M Y S Q L '_' D R I V E R
    ;

ROW_NUMBER
    : R O W '_' N U M B E R
    ;

COMPRESSION
    : C O M P R E S S I O N
    ;

BIT
    : B I T
    ;

MAX_DISK_SIZE
    : M A X '_' D I S K '_' S I Z E
    ;

SAMPLE
    : S A M P L E
    ;

UNLOCKED
    : U N L O C K E D
    ;

CLASS_ORIGIN
    : C L A S S '_' O R I G I N
    ;

RUDUNDANT
    : R U D U N D A N T
    ;

STATEMENTS
    : S T A T E M E N T S
    ;

ACTION
    : A C T I O N
    ;

REDUNDANT
    : R E D U N D A N T
    ;

UPGRADE
    : U P G R A D E
    ;

VALIDATE
    : V A L I D A T E
    ;

START
    : S T A R T
    ;

TEMPTABLE
    : T E M P T A B L E
    ;

RECYCLEBIN
    : R E C Y C L E B I N
    ;

PROFILES
    : P R O F I L E S
    ;

TIMESTAMP_VALUE
    : T I M E S T A M P '_' V A L U E
    ;

ERRORS
    : E R R O R S
    ;

LEAVES
    : L E A V E S
    ;

UNDEFINED
    : U N D E F I N E D
    ;

EVERY
    : E V E R Y
    ;

BYTE
    : B Y T E
    ;

FLUSH
    : F L U S H
    ;

MIN_ROWS
    : M I N '_' R O W S
    ;

ERROR_P
    : E R R O R '_' P
    ;

MAX_USER_CONNECTIONS
    : M A X '_' U S E R '_' C O N N E C T I O N S
    ;

MAX_CPU
    : M A X '_' C P U
    ;

LOCKED
    : L O C K E D
    ;

DOP
    : D O P
    ;

IO
    : I O
    ;

BTREE
    : B T R E E
    ;

SLOT_IDX
    : S L O T '_' I D X
    ;

APPROXNUM
    : A P P R O X N U M
    ;

HASH
    : H A S H
    ;

ROTATE
    : R O T A T E
    ;

COLLATION
    : C O L L A T I O N
    ;

MASTER
    : M A S T E R
    ;

ENCRYPTION
    : E N C R Y P T I O N
    ;

MAX
    : M A X
    ;

TRANSACTION
    : T R A N S A C T I O N
    ;

SQL_TSI_MONTH
    : S Q L '_' T S I '_' M O N T H
    ;

IGNORE
    : I G N O R E
    ;

MAX_QUERIES_PER_HOUR
    : M A X '_' Q U E R I E S '_' P E R '_' H O U R
    ;

COMMENT
    : C O M M E N T
    ;

CTX_ID
    : C T X '_' I D
    ;

MIN_IOPS
    : M I N '_' I O P S
    ;

NVARCHAR
    : N V A R C H A R
    ;

OFF
    : O F F
    ;

BIT_XOR
    : B I T '_' X O R
    ;

PAUSE
    : P A U S E
    ;

QUICK
    : Q U I C K
    ;

DUPLICATE
    : D U P L I C A T E
    ;

WAIT
    : W A I T
    ;

DES_KEY_FILE
    : D E S '_' K E Y '_' F I L E
    ;

ENGINES
    : E N G I N E S
    ;

RETURNS
    : R E T U R N S
    ;

MASTER_USER
    : M A S T E R '_' U S E R
    ;

SOCKET
    : S O C K E T
    ;

MASTER_DELAY
    : M A S T E R '_' D E L A Y
    ;

FILE_ID
    : F I L E '_' I D
    ;

FIRST
    : F I R S T
    ;

TABLET
    : T A B L E T
    ;

CLIENT
    : C L I E N T
    ;

ENGINE_
    : E N G I N E
    ;

TABLES
    : T A B L E S
    ;

TRADITIONAL
    : T R A D I T I O N A L
    ;

BOOTSTRAP
    : B O O T S T R A P
    ;

STDDEV
    : S T D D E V
    ;

DATAFILE
    : D A T A F I L E
    ;

VARCHARACTER
    : V A R C H A R A C T E R
    ;

INVOKER
    : I N V O K E R
    ;

DEPTH
    : D E P T H
    ;

NORMAL
    : N O R M A L
    ;

LN
    : L N
    ;

COLUMN_NAME
    : C O L U M N '_' N A M E
    ;

TRIGGERS
    : T R I G G E R S
    ;

ENABLE_PARALLEL_DML
    : E N A B L E '_' P A R A L L E L '_' D M L
    ;

RESET
    : R E S E T
    ;

EVENT
    : E V E N T
    ;

COALESCE
    : C O A L E S C E
    ;

RESPECT
    : R E S P E C T
    ;

STATUS
    : S T A T U S
    ;

UNBOUNDED
    : U N B O U N D E D
    ;

WRAPPER
    : W R A P P E R
    ;

TIMESTAMP
    : T I M E S T A M P
    ;

PARTITIONS
    : P A R T I T I O N S
    ;

SUBSTR
    : S U B S T R
    ;

CHUNK
    : C H U N K
    ;

FILEX
    : F I L E X
    ;

BACKUPSET
    : B A C K U P S E T
    ;

PRIMARY_CLUSTER_ID
    : P R I M A R Y '_' C L U S T E R '_' I D
    ;

UNIT
    : U N I T
    ;

PRIVILEGES
    : P R I V I L E G E S
    ;

LOWER_ON
    : L O W E R '_' O N
    ;

BACKUPPIECE
    : B A C K U P P I E C E
    ;

LESS
    : L E S S
    ;

SWITCH
    : S W I T C H
    ;

DIAGNOSTICS
    : D I A G N O S T I C S
    ;

REDO_BUFFER_SIZE
    : R E D O '_' B U F F E R '_' S I Z E
    ;

NO
    : N O
    ;

MAJOR
    : M A J O R
    ;

ACTIVE
    : A C T I V E
    ;

ROUTINE
    : R O U T I N E
    ;

FOLLOWING
    : F O L L O W I N G
    ;

ROLLBACK
    : R O L L B A C K
    ;

READ_ONLY
    : R E A D '_' O N L Y
    ;

MEMBER
    : M E M B E R
    ;

PARTITION_ID
    : P A R T I T I O N '_' I D
    ;

DUMP
    : D U M P
    ;

APPROX_COUNT_DISTINCT_SYNOPSIS
    : A P P R O X '_' C O U N T '_' D I S T I N C T '_' S Y N O P S I S
    ;

GROUPING
    : G R O U P I N G
    ;

OF
    : O F
    ;

ARCHIVELOG
    : A R C H I V E L O G
    ;

MAX_CONNECTIONS_PER_HOUR
    : M A X '_' C O N N E C T I O N S '_' P E R '_' H O U R
    ;

SECOND
    : S E C O N D
    ;

UNKNOWN
    : U N K N O W N
    ;

POINT
    : P O I N T
    ;

PL
    : P L
    ;

MEMSTORE_PERCENT
    : M E M S T O R E '_' P E R C E N T
    ;

STD
    : S T D
    ;

POLYGON
    : P O L Y G O N
    ;

PS
    : P S
    ;

OLD
    : O L D
    ;

TABLE_ID
    : T A B L E '_' I D
    ;

CONTEXT
    : C O N T E X T
    ;

FINAL_COUNT
    : F I N A L '_' C O U N T
    ;

MASTER_CONNECT_RETRY
    : M A S T E R '_' C O N N E C T '_' R E T R Y
    ;

POSITION
    : P O S I T I O N
    ;

DISCARD
    : D I S C A R D
    ;

PREV
    : P R E V
    ;

RECOVER
    : R E C O V E R
    ;

PROCESS
    : P R O C E S S
    ;

DEALLOCATE
    : D E A L L O C A T E
    ;

OLD_PASSWORD
    : O L D '_' P A S S W O R D
    ;

FAILOVER
    : F A I L O V E R
    ;

P_NSEQ
    : P '_' N S E Q
    ;

LISTAGG
    : L I S T A G G
    ;

SLOW
    : S L O W
    ;

NOAUDIT
    : N O A U D I T
    ;

SUM
    : S U M
    ;

OPTIONS
    : O P T I O N S
    ;

MIN
    : M I N
    ;

RT
    : R T
    ;

RELOAD
    : R E L O A D
    ;

ONE
    : O N E
    ;

DELAY_KEY_WRITE
    : D E L A Y '_' K E Y '_' W R I T E
    ;

ORIG_DEFAULT
    : O R I G '_' D E F A U L T
    ;

RLIKE
    : R L I K E
    ;

INDEXED
    : I N D E X E D
    ;

RETURNING
    : R E T U R N I N G
    ;

SQL_TSI_HOUR
    : S Q L '_' T S I '_' H O U R
    ;

TIMESTAMPDIFF
    : T I M E S T A M P D I F F
    ;

RESTORE
    : R E S T O R E
    ;

OFFSET
    : O F F S E T
    ;

TEMPORARY
    : T E M P O R A R Y
    ;

VARIANCE
    : V A R I A N C E
    ;

SNAPSHOT
    : S N A P S H O T
    ;

STATISTICS
    : S T A T I S T I C S
    ;

SERVER_TYPE
    : S E R V E R '_' T Y P E
    ;

COMMITTED
    : C O M M I T T E D
    ;

INDEXES
    : I N D E X E S
    ;

FREEZE
    : F R E E Z E
    ;

SCOPE
    : S C O P E
    ;

IDC
    : I D C
    ;

VIEW
    : V I E W
    ;

ONE_SHOT
    : O N E '_' S H O T
    ;

ACCOUNT
    : A C C O U N T
    ;

LOCALITY
    : L O C A L I T Y
    ;

REVERSE
    : R E V E R S E
    ;

UP
    : U P
    ;

CLUSTER_ID
    : C L U S T E R '_' I D
    ;

NOARCHIVELOG
    : N O A R C H I V E L O G
    ;

MAX_SIZE
    : M A X '_' S I Z E
    ;

PAGE
    : P A G E
    ;

NAME
    : N A M E
    ;

ROW_COUNT
    : R O W '_' C O U N T
    ;

LAST
    : L A S T
    ;

LOGONLY_REPLICA_NUM
    : L O G O N L Y '_' R E P L I C A '_' N U M
    ;

DELAY
    : D E L A Y
    ;

SUBDATE
    : S U B D A T E
    ;

INCREMENTAL
    : I N C R E M E N T A L
    ;

ROLLING
    : R O L L I N G
    ;

VERIFY
    : V E R I F Y
    ;

CONTAINS
    : C O N T A I N S
    ;

GENERAL
    : G E N E R A L
    ;

VISIBLE
    : V I S I B L E
    ;

SIGNED
    : S I G N E D
    ;

SERVER
    : S E R V E R
    ;

NEXT
    : N E X T
    ;

ENDS
    : E N D S
    ;

GLOBAL
    : G L O B A L
    ;

ROOTSERVICE_LIST
    : R O O T S E R V I C E '_' L I S T
    ;

SHUTDOWN
    : S H U T D O W N
    ;

VERBOSE
    : V E R B O S E
    ;

CLUSTER_NAME
    : C L U S T E R '_' N A M E
    ;

MASTER_PORT
    : M A S T E R '_' P O R T
    ;

MYSQL_ERRNO
    : M Y S Q L '_' E R R N O
    ;

LOWER_COMMA
    : L O W E R '_' C O M M A
    ;

XA
    : X A
    ;

TIME
    : T I M E
    ;

DATETIME
    : D A T E T I M E
    ;

NOMINVALUE
    : N O M I N V A L U E
    ;

BOOL
    : B O O L
    ;

DIRECTORY
    : D I R E C T O R Y
    ;

DATA_TABLE_ID
    : D A T A '_' T A B L E '_' I D
    ;

VALID
    : V A L I D
    ;

MASTER_SSL_KEY
    : M A S T E R '_' S S L '_' K E Y
    ;

MASTER_PASSWORD
    : M A S T E R '_' P A S S W O R D
    ;

PLAN
    : P L A N
    ;

SHARE
    : S H A R E
    ;

MULTIPOLYGON
    : M U L T I P O L Y G O N
    ;

STDDEV_SAMP
    : S T D D E V '_' S A M P
    ;

USE_BLOOM_FILTER
    : U S E '_' B L O O M '_' F I L T E R
    ;

CONSTRAINT_CATALOG
    : C O N S T R A I N T '_' C A T A L O G
    ;

CLUSTER
    : C L U S T E R
    ;

EXCHANGE
    : E X C H A N G E
    ;

GRANTS
    : G R A N T S
    ;

CAST
    : C A S T
    ;

SERVER_PORT
    : S E R V E R '_' P O R T
    ;

SQL_CACHE
    : S Q L '_' C A C H E
    ;

MAX_USED_PART_ID
    : M A X '_' U S E D '_' P A R T '_' I D
    ;

HYBRID_HIST
    : H Y B R I D '_' H I S T
    ;

INSTANCE
    : I N S T A N C E
    ;

FUNCTION
    : F U N C T I O N
    ;

NOWAIT
    : N O W A I T
    ;

INVISIBLE
    : I N V I S I B L E
    ;

DENSE_RANK
    : D E N S E '_' R A N K
    ;

COUNT
    : C O U N T
    ;

NAMES
    : N A M E S
    ;

CHAR
    : C H A R
    ;

LOWER_THAN_NEG
    : L O W E R '_' T H A N '_' N E G
    ;

P_ENTITY
    : P '_' E N T I T Y
    ;

ISOLATE
    : I S O L A T E
    ;

MAX_ROWS
    : M A X '_' R O W S
    ;

CTXCAT
    : C T X C A T
    ;

ISOLATION
    : I S O L A T I O N
    ;

REPLICATION
    : R E P L I C A T I O N
    ;

DECRYPTION
    : D E C R Y P T I O N
    ;

REMOVE
    : R E M O V E
    ;

STATS_AUTO_RECALC
    : S T A T S '_' A U T O '_' R E C A L C
    ;

CONSISTENT_MODE
    : C O N S I S T E N T '_' M O D E
    ;

MODIFY
    : M O D I F Y
    ;

UNCOMMITTED
    : U N C O M M I T T E D
    ;

PHYSICAL
    : P H Y S I C A L
    ;

NO_WAIT
    : N O '_' W A I T
    ;

UNIT_NUM
    : U N I T '_' N U M
    ;

PERCENTAGE
    : P E R C E N T A G E
    ;

MAX_IOPS
    : M A X '_' I O P S
    ;

SPFILE
    : S P F I L E
    ;

REPEATABLE
    : R E P E A T A B L E
    ;

COMPLETION
    : C O M P L E T I O N
    ;

CONDENSED
    : C O N D E N S E D
    ;

INPUT
    : I N P U T
    ;

ROOTTABLE
    : R O O T T A B L E
    ;

SUBSTRING
    : S U B S T R I N G
    ;

ZONE
    : Z O N E
    ;

BACKED
    : B A C K E D
    ;

TEMPLATE
    : T E M P L A T E
    ;

DATE_SUB
    : D A T E '_' S U B
    ;

EXPIRE_INFO
    : E X P I R E '_' I N F O
    ;

EXPIRE
    : E X P I R E
    ;

ENABLE
    : E N A B L E
    ;

HOSTS
    : H O S T S
    ;

SCHEMA_NAME
    : S C H E M A '_' N A M E
    ;

EXPANSION
    : E X P A N S I O N
    ;

REORGANIZE
    : R E O R G A N I Z E
    ;

BLOCK_SIZE
    : B L O C K '_' S I Z E
    ;

INNER_PARSE
    : I N N E R '_' P A R S E
    ;

MINOR
    : M I N O R
    ;

RESUME
    : R E S U M E
    ;

INT
    : I N T
    ;

STATS_PERSISTENT
    : S T A T S '_' P E R S I S T E N T
    ;

NODEGROUP
    : N O D E G R O U P
    ;

PARTITIONING
    : P A R T I T I O N I N G
    ;

BIT_AND
    : B I T '_' A N D
    ;

SUPER
    : S U P E R
    ;

TIMES
    : T I M E S
    ;

COMMIT
    : C O M M I T
    ;

SAVEPOINT
    : S A V E P O I N T
    ;

UNTIL
    : U N T I L
    ;

USER
    : U S E R
    ;

MEMTABLE
    : M E M T A B L E
    ;

CHARSET
    : C H A R S E T
    ;

MOVE
    : M O V E
    ;

XML
    : X M L
    ;

IPC
    : I P C
    ;

TRIM
    : T R I M
    ;

PERFORMANCE
    : P E R F O R M A N C E
    ;

RANK
    : R A N K
    ;

VAR_POP
    : V A R '_' P O P
    ;

DEFAULT_AUTH
    : D E F A U L T '_' A U T H
    ;

EXTENT_SIZE
    : E X T E N T '_' S I Z E
    ;

BINLOG
    : B I N L O G
    ;

LEAK_MOD
    : L E A K '_' M O D
    ;

CLOG
    : C L O G
    ;

GEOMETRYCOLLECTION
    : G E O M E T R Y C O L L E C T I O N
    ;

STORAGE
    : S T O R A G E
    ;

MEDIUM
    : M E D I U M
    ;

USE_FRM
    : U S E '_' F R M
    ;

CLIENT_VERSION
    : C L I E N T '_' V E R S I O N
    ;

MASTER_HEARTBEAT_PERIOD
    : M A S T E R '_' H E A R T B E A T '_' P E R I O D
    ;

SUBPARTITIONS
    : S U B P A R T I T I O N S
    ;

CUBE
    : C U B E
    ;

BALANCE
    : B A L A N C E
    ;

QUERY
    : Q U E R Y
    ;

THROTTLE
    : T H R O T T L E
    ;

SQL_TSI_QUARTER
    : S Q L '_' T S I '_' Q U A R T E R
    ;

REPAIR
    : R E P A I R
    ;

MASTER_SSL_CIPHER
    : M A S T E R '_' S S L '_' C I P H E R
    ;

KEY_VERSION
    : K E Y '_' V E R S I O N
    ;

CATALOG_NAME
    : C A T A L O G '_' N A M E
    ;

NDBCLUSTER
    : N D B C L U S T E R
    ;

CONNECTION
    : C O N N E C T I O N
    ;

COMPACT
    : C O M P A C T
    ;

SYNCHRONIZATION
    : S Y N C H R O N I Z A T I O N
    ;

AVAILABILITY
    : A V A I L A B I L I T Y
    ;

INCR
    : I N C R
    ;

CANCEL
    : C A N C E L
    ;

SIMPLE
    : S I M P L E
    ;

BEGI
    : B E G I N
    ;

VARIABLES
    : V A R I A B L E S
    ;

SQL_TSI_WEEK
    : S Q L '_' T S I '_' W E E K
    ;

P_CHUNK
    : P '_' C H U N K
    ;

SYSTEM
    : S Y S T E M
    ;

ROOTSERVICE
    : R O O T S E R V I C E
    ;

PLUGIN_DIR
    : P L U G I N '_' D I R
    ;

ASCII
    : A S C I I
    ;

INFO
    : I N F O
    ;

SQL_THREAD
    : S Q L '_' T H R E A D
    ;

TYPES
    : T Y P E S
    ;

LEADER
    : L E A D E R
    ;

LOWER_KEY
    : L O W E R '_' K E Y
    ;

FOUND
    : F O U N D
    ;

EXTRACT
    : E X T R A C T
    ;

FIXED
    : F I X E D
    ;

CACHE
    : C A C H E
    ;

CURRENT
    : C U R R E N T
    ;

RETURNED_SQLSTATE
    : R E T U R N E D '_' S Q L S T A T E
    ;

END
    : E N D
    ;

PRESERVE
    : P R E S E R V E
    ;

SQL_BUFFER_RESULT
    : S Q L '_' B U F F E R '_' R E S U L T
    ;

JSON
    : J S O N
    ;

SOME
    : S O M E
    ;

INDEX_TABLE_ID
    : I N D E X '_' T A B L E '_' I D
    ;

FREQUENCY
    : F R E Q U E N C Y
    ;

PQ_MAP
    : P Q '_' M A P
    ;

LOCKS
    : L O C K S
    ;

MANUAL
    : M A N U A L
    ;

GEOMETRY
    : G E O M E T R Y
    ;

IDENTIFIED
    : I D E N T I F I E D
    ;

NO_PARALLEL
    : N O '_' P A R A L L E L
    ;

STORAGE_FORMAT_VERSION
    : S T O R A G E '_' F O R M A T '_' V E R S I O N
    ;

OVER
    : O V E R
    ;

MAX_SESSION_NUM
    : M A X '_' S E S S I O N '_' N U M
    ;

USER_RESOURCES
    : U S E R '_' R E S O U R C E S
    ;

BACKUPROUND
    : B A C K U P R O U N D
    ;

DESTINATION
    : D E S T I N A T I O N
    ;

SONAME
    : S O N A M E
    ;

OUTLINE
    : O U T L I N E
    ;

MASTER_LOG_FILE
    : M A S T E R '_' L O G '_' F I L E
    ;

NOMAXVALUE
    : N O M A X V A L U E
    ;

ESTIMATE
    : E S T I M A T E
    ;

SLAVE
    : S L A V E
    ;

GTS
    : G T S
    ;

EXPORT
    : E X P O R T
    ;

AVG_ROW_LENGTH
    : A V G '_' R O W '_' L E N G T H
    ;

FLASHBACK
    : F L A S H B A C K
    ;

SESSION_USER
    : S E S S I O N '_' U S E R
    ;

TABLEGROUPS
    : T A B L E G R O U P S
    ;

CURTIME
    : C U R T I M E
    ;

REPLICA_TYPE
    : R E P L I C A '_' T Y P E
    ;

AGGREGATE
    : A G G R E G A T E
    ;

JSON_ARRAYAGG
    : J S O N '_' A R R A Y A G G
    ;

PERCENT_RANK
    : P E R C E N T '_' R A N K
    ;

ENUM
    : E N U M
    ;

NATIONAL
    : N A T I O N A L
    ;

RECYCLE
    : R E C Y C L E
    ;

REGION
    : R E G I O N
    ;

MATERIALIZE
    : M A T E R I A L I Z E
    ;

MUTEX
    : M U T E X
    ;

NOPARALLEL
    : N O P A R A L L E L
    ;

LOWER_PARENS
    : L O W E R '_' P A R E N S
    ;

MONITOR
    : M O N I T O R
    ;

NDB
    : N D B
    ;

SYSTEM_USER
    : S Y S T E M '_' U S E R
    ;

MAXIMIZE
    : M A X I M I Z E
    ;

MAX_UPDATES_PER_HOUR
    : M A X '_' U P D A T E S '_' P E R '_' H O U R
    ;

CURSOR_NAME
    : C U R S O R '_' N A M E
    ;

CONCURRENT
    : C O N C U R R E N T
    ;

DUMPFILE
    : D U M P F I L E
    ;

COM
    : C O M
    ;

COMPRESSED
    : C O M P R E S S E D
    ;

LINESTRING
    : L I N E S T R I N G
    ;

DYNAMIC
    : D Y N A M I C
    ;

CHAIN
    : C H A I N
    ;

NEG
    : N E G
    ;

INCREMENT
    : I N C R E M E N T
    ;

LAG
    : L A G
    ;

BASELINE_ID
    : B A S E L I N E '_' I D
    ;

NEW
    : N E W
    ;

SQL_TSI_YEAR
    : S Q L '_' T S I '_' Y E A R
    ;

THAN
    : T H A N
    ;

CPU
    : C P U
    ;

HOST
    : H O S T
    ;

VALUE
    : V A L U E
    ;

LOGS
    : L O G S
    ;

SERIALIZABLE
    : S E R I A L I Z A B L E
    ;

AUTO_INCREMENT
    : A U T O '_' I N C R E M E N T
    ;

BACKUP
    : B A C K U P
    ;

LOGFILE
    : L O G F I L E
    ;

ROW_FORMAT
    : R O W '_' F O R M A T
    ;

SET_MASTER_CLUSTER
    : S E T '_' M A S T E R '_' C L U S T E R
    ;

MINUTE
    : M I N U T E
    ;

SWAPS
    : S W A P S
    ;

TASK
    : T A S K
    ;

INNODB
    : I N N O D B
    ;

IO_THREAD
    : I O '_' T H R E A D
    ;

HISTOGRAM
    : H I S T O G R A M
    ;

PCTFREE
    : P C T F R E E
    ;

BC2HOST
    : B C '2' H O S T
    ;

PARAMETERS
    : P A R A M E T E R S
    ;

TABLESPACE
    : T A B L E S P A C E
    ;

OBCONFIG_URL
    : O B C O N F I G '_' U R L
    ;

AUTO
    : A U T O
    ;

PASSWORD
    : P A S S W O R D
    ;

LOWER_THAN_BY_ACCESS_SESSION
    : L O W E R '_' T H A N '_' B Y '_' A C C E S S '_' S E S S I O N
    ;

ROW
    : R O W
    ;

MESSAGE_TEXT
    : M E S S A G E '_' T E X T
    ;

DISK
    : D I S K
    ;

FAULTS
    : F A U L T S
    ;

HOUR
    : H O U R
    ;

REFRESH
    : R E F R E S H
    ;

COLUMN_STAT
    : C O L U M N '_' S T A T
    ;

ANY
    : A N Y
    ;

HIGHER_PARENS
    : H I G H E R '_' P A R E N S
    ;

ERROR_CODE
    : E R R O R '_' C O D E
    ;

PHASE
    : P H A S E
    ;

ENTITY
    : E N T I T Y
    ;

PROFILE
    : P R O F I L E
    ;

LAST_VALUE
    : L A S T '_' V A L U E
    ;

RESTART
    : R E S T A R T
    ;

TRACE
    : T R A C E
    ;

LOGICAL_READS
    : L O G I C A L '_' R E A D S
    ;

DATE_ADD
    : D A T E '_' A D D
    ;

BLOCK_INDEX
    : B L O C K '_' I N D E X
    ;

SERVER_IP
    : S E R V E R '_' I P
    ;

CODE
    : C O D E
    ;

PLUGINS
    : P L U G I N S
    ;

ADDDATE
    : A D D D A T E
    ;

VIRTUAL_COLUMN_ID
    : V I R T U A L '_' C O L U M N '_' I D
    ;

COLUMN_FORMAT
    : C O L U M N '_' F O R M A T
    ;

MAX_MEMORY
    : M A X '_' M E M O R Y
    ;

CLEAN
    : C L E A N
    ;

MASTER_SSL
    : M A S T E R '_' S S L
    ;

CLEAR
    : C L E A R
    ;

SORTKEY
    : S O R T K E Y
    ;

CHECKSUM
    : C H E C K S U M
    ;

INSTALL
    : I N S T A L L
    ;

MONTH
    : M O N T H
    ;

AFTER
    : A F T E R
    ;

CLOSE
    : C L O S E
    ;

JSON_OBJECTAGG
    : J S O N '_' O B J E C T A G G
    ;

SET_TP
    : S E T '_' T P
    ;

OWNER
    : O W N E R
    ;

BLOOM_FILTER
    : B L O O M '_' F I L T E R
    ;

ILOG
    : I L O G
    ;

META
    : M E T A
    ;

STARTS
    : S T A R T S
    ;

PLANREGRESS
    : P L A N R E G R E S S
    ;

AUTOEXTEND_SIZE
    : A U T O E X T E N D '_' S I Z E
    ;

SOURCE
    : S O U R C E
    ;

POW
    : P O W
    ;

IGNORE_SERVER_IDS
    : I G N O R E '_' S E R V E R '_' I D S
    ;

REPLICA_NUM
    : R E P L I C A '_' N U M
    ;

LOWER_THAN_COMP
    : L O W E R '_' T H A N '_' C O M P
    ;

BINDING
    : B I N D I N G
    ;

MICROSECOND
    : M I C R O S E C O N D
    ;

UNDO_BUFFER_SIZE
    : U N D O '_' B U F F E R '_' S I Z E
    ;

SWITCHOVER
    : S W I T C H O V E R
    ;

EXTENDED_NOADDR
    : E X T E N D E D '_' N O A D D R
    ;

GLOBAL_NAME
    : G L O B A L '_' N A M E
    ;

SPLIT
    : S P L I T
    ;

BASELINE
    : B A S E L I N E
    ;

MEMORY
    : M E M O R Y
    ;

SEED
    : S E E D
    ;

RTREE
    : R T R E E
    ;

RESOURCE
    : R E S O U R C E
    ;

STDDEV_POP
    : S T D D E V '_' P O P
    ;

RUN
    : R U N
    ;

OBSOLETE
    : O B S O L E T E
    ;

SQL_AFTER_GTIDS
    : S Q L '_' A F T E R '_' G T I D S
    ;

OPEN
    : O P E N
    ;

SQL_TSI_DAY
    : S Q L '_' T S I '_' D A Y
    ;

STRING
    : S T R I N G
    ;

RELAY_THREAD
    : R E L A Y '_' T H R E A D
    ;

BREADTH
    : B R E A D T H
    ;

NOCACHE
    : N O C A C H E
    ;

PRIMARY_ROOTSERVICE_LIST
    : P R I M A R Y '_' R O O T S E R V I C E '_' L I S T
    ;

UNUSUAL
    : U N U S U A L
    ;

RELAYLOG
    : R E L A Y L O G
    ;

SQL_BEFORE_GTIDS
    : S Q L '_' B E F O R E '_' G T I D S
    ;

PRIMARY_ZONE
    : P R I M A R Y '_' Z O N E
    ;

TABLE_CHECKSUM
    : T A B L E '_' C H E C K S U M
    ;

ZONE_LIST
    : Z O N E '_' L I S T
    ;

DATABASE_ID
    : D A T A B A S E '_' I D
    ;

TP_NO
    : T P '_' N O
    ;

NETWORK
    : N E T W O R K
    ;

PROTECTION
    : P R O T E C T I O N
    ;

HIDDEN_
    : H I D D E N
    ;

BOOLEAN
    : B O O L E A N
    ;

AVG
    : A V G
    ;

MULTILINESTRING
    : M U L T I L I N E S T R I N G
    ;

APPROX_COUNT_DISTINCT_SYNOPSIS_MERGE
    : A P P R O X '_' C O U N T '_' D I S T I N C T '_' S Y N O P S I S '_' M E R G E
    ;

NOW
    : N O W
    ;

BIT_OR
    : B I T '_' O R
    ;

PROXY
    : P R O X Y
    ;

DUPLICATE_SCOPE
    : D U P L I C A T E '_' S C O P E
    ;

STATS_SAMPLE_PAGES
    : S T A T S '_' S A M P L E '_' P A G E S
    ;

TABLET_SIZE
    : T A B L E T '_' S I Z E
    ;

BASE
    : B A S E
    ;

KVCACHE
    : K V C A C H E
    ;

RELAY
    : R E L A Y
    ;

CONTRIBUTORS
    : C O N T R I B U T O R S
    ;

EMPTY
    : E M P T Y
    ;

PARTIAL
    : P A R T I A L
    ;

REPORT
    : R E P O R T
    ;

ESCAPE
    : E S C A P E
    ;

MASTER_AUTO_POSITION
    : M A S T E R '_' A U T O '_' P O S I T I O N
    ;

DISKGROUP
    : D I S K G R O U P
    ;

CALC_PARTITION_ID
    : C A L C '_' P A R T I T I O N '_' I D
    ;

TP_NAME
    : T P '_' N A M E
    ;

ACTIVATE
    : A C T I V A T E
    ;

SQL_AFTER_MTS_GAPS
    : S Q L '_' A F T E R '_' M T S '_' G A P S
    ;

EFFECTIVE
    : E F F E C T I V E
    ;

FIRST_VALUE
    : F I R S T '_' V A L U E
    ;

SQL_TSI_MINUTE
    : S Q L '_' T S I '_' M I N U T E
    ;

UNICODE
    : U N I C O D E
    ;

QUARTER
    : Q U A R T E R
    ;

ANALYSE
    : A N A L Y S E
    ;

DEFINER
    : D E F I N E R
    ;

NONE
    : N O N E
    ;

PROCESSLIST
    : P R O C E S S L I S T
    ;

TYPE
    : T Y P E
    ;

INSERT_METHOD
    : I N S E R T '_' M E T H O D
    ;

EXTENDED
    : E X T E N D E D
    ;

LOG
    : L O G
    ;

WHENEVER
    : W H E N E V E R
    ;

LEVEL
    : L E V E L
    ;

TIME_ZONE_INFO
    : T I M E '_' Z O N E '_' I N F O
    ;

TIMESTAMPADD
    : T I M E S T A M P A D D
    ;

LOWER_INTO
    : L O W E R '_' I N T O
    ;

GET_FORMAT
    : G E T '_' F O R M A T
    ;

PREPARE
    : P R E P A R E
    ;

MATERIALIZED
    : M A T E R I A L I Z E D
    ;

STANDBY
    : S T A N D B Y
    ;

WORK
    : W O R K
    ;

HANDLER
    : H A N D L E R
    ;

CUME_DIST
    : C U M E '_' D I S T
    ;

LEAK
    : L E A K
    ;

INITIAL_SIZE
    : I N I T I A L '_' S I Z E
    ;

RELAY_LOG_FILE
    : R E L A Y '_' L O G '_' F I L E
    ;

STORING
    : S T O R I N G
    ;

IMPORT
    : I M P O R T
    ;

MIN_MEMORY
    : M I N '_' M E M O R Y
    ;

HELP
    : H E L P
    ;

CREATE_TIMESTAMP
    : C R E A T E '_' T I M E S T A M P
    ;

COMPUTE
    : C O M P U T E
    ;

RANDOM
    : R A N D O M
    ;

SOUNDS
    : S O U N D S
    ;

TABLE_MODE
    : T A B L E '_' M O D E
    ;

COPY
    : C O P Y
    ;

SESSION
    : S E S S I O N
    ;

DAG
    : D A G
    ;

NOCYCLE
    : N O C Y C L E
    ;

SQL_NO_CACHE
    : S Q L '_' N O '_' C A C H E
    ;

EXECUTE
    : E X E C U T E
    ;

PRECEDING
    : P R E C E D I N G
    ;

SWITCHES
    : S W I T C H E S
    ;

PACK_KEYS
    : P A C K '_' K E Y S
    ;

SQL_ID
    : S Q L '_' I D
    ;

NOORDER
    : N O O R D E R
    ;

TENANT_ID
    : T E N A N T '_' I D
    ;

CHECKPOINT
    : C H E C K P O I N T
    ;

DAY
    : D A Y
    ;

GROUP_CONCAT
    : G R O U P '_' C O N C A T
    ;

LEAD
    : L E A D
    ;

EVENTS
    : E V E N T S
    ;

RECURSIVE
    : R E C U R S I V E
    ;

ONLY
    : O N L Y
    ;

TABLEGROUP_ID
    : T A B L E G R O U P '_' I D
    ;

TOP_K_FRE_HIST
    : T O P '_' K '_' F R E '_' H I S T
    ;

MASTER_SSL_CRL
    : M A S T E R '_' S S L '_' C R L
    ;

RESOURCE_POOL_LIST
    : R E S O U R C E '_' P O O L '_' L I S T
    ;

TRACING
    : T R A C I N G
    ;

NTILE
    : N T I L E
    ;

BUCKETS
    : B U C K E T S
    ;

SKEWONLY
    : S K E W O N L Y
    ;

IS_TENANT_SYS_POOL
    : I S '_' T E N A N T '_' S Y S '_' P O O L
    ;

INLINE
    : I N L I N E
    ;

SCHEDULE
    : S C H E D U L E
    ;

JOB
    : J O B
    ;

MASTER_LOG_POS
    : M A S T E R '_' L O G '_' P O S
    ;

SUBCLASS_ORIGIN
    : S U B C L A S S '_' O R I G I N
    ;

MULTIPOINT
    : M U L T I P O I N T
    ;

BLOCK
    : B L O C K
    ;

SQL_TSI_SECOND
    : S Q L '_' T S I '_' S E C O N D
    ;

DATE
    : D A T E
    ;

ROLLUP
    : R O L L U P
    ;

MIN_CPU
    : M I N '_' C P U
    ;

OCCUR
    : O C C U R
    ;

DATA
    : D A T A
    ;

SUCCESSFUL
    : S U C C E S S F U L
    ;

REDO_TRANSPORT_OPTIONS
    : R E D O '_' T R A N S P O R T '_' O P T I O N S
    ;

MASTER_HOST
    : M A S T E R '_' H O S T
    ;

VAR_SAMP
    : V A R '_' S A M P
    ;

ALGORITHM
    : A L G O R I T H M
    ;

EXPIRED
    : E X P I R E D
    ;

CONSTRAINT_NAME
    : C O N S T R A I N T '_' N A M E
    ;

APPROX_COUNT_DISTINCT
    : A P P R O X '_' C O U N T '_' D I S T I N C T
    ;

BASIC
    : B A S I C
    ;

DEFAULT_TABLEGROUP
    : D E F A U L T '_' T A B L E G R O U P
    ;

LIST_
    : L I S T
    ;

NO_PX_JOIN_FILTER
    : N O '_' P X '_' J O I N '_' F I L T E R
    ;

WEEK
    : W E E K
    ;

NULLS
    : N U L L S
    ;

MASTER_SSL_CRLPATH
    : M A S T E R '_' S S L '_' C R L P A T H
    ;

CASCADED
    : C A S C A D E D
    ;

PLUGIN
    : P L U G I N
    ;

TENANT
    : T E N A N T
    ;

DECIMAL_VAL
    : ([0-9]+ E [-+]?[0-9]+ | [0-9]+'.'[0-9]* E [-+]?[0-9]+ | '.'[0-9]+ E [-+]?[0-9]+)
    | ([0-9]+'.'[0-9]* | '.'[0-9]+)
    ;

BOOL_VALUE
    : T R U E
    | F A L S E
    ;

At
    : '@'
    ;

Quote
    : '\''
    ;

PARSER_SYNTAX_ERROR
    : X '\''([0-9A-F])*'\''|'0' X ([0-9A-F])+
    ;

HEX_STRING_VALUE
    : B '\''([01])*'\''|'0' B ([01])+
    ;

DATE_VALUE
    : D A T E ([ \t\n\r\f]+|('--'[ \t\n\r\f]+(~[\n\r])*)|('#'(~[\n\r])*))?'\''(~['])*'\''
    | T I M E ([ \t\n\r\f]+|('--'[ \t\n\r\f]+(~[\n\r])*)|('#'(~[\n\r])*))?'\''(~['])*'\''
    | T I M E S T A M P ([ \t\n\r\f]+|('--'[ \t\n\r\f]+(~[\n\r])*)|('#'(~[\n\r])*))?'\''(~['])*'\''
    | D A T E ([ \t\n\r\f]+|('--'[ \t\n\r\f]+(~[\n\r])*)|('#'(~[\n\r])*))?'"'(~["])*'"'
    | T I M E ([ \t\n\r\f]+|('--'[ \t\n\r\f]+(~[\n\r])*)|('#'(~[\n\r])*))?'"'(~["])*'"'
    | T I M E S T A M P ([ \t\n\r\f]+|('--'[ \t\n\r\f]+(~[\n\r])*)|('#'(~[\n\r])*))?'"'(~["])*'"'
    ;

HINT_VALUE
    : '/''*' H I N T '+'(~[*])+'*''/'
    ;

//c_ret
//    : '*''/' -> mode(DEFAULT_MODE)
//    ;

Comma
    : [,]
    ;

Plus
    : [+]
    ;

And
    : [&]
    ;

Or
    : [|]
    ;

Star
    : [*]
    ;

Not
    : [!]
    ;

LeftParen
    : [(]
    ;

Minus
    : [-]
    ;

Div
    : [/]
    ;

Caret
    : [^]
    ;

Colon
    : [:]
    ;

Dot
    : [.]
    ;

Mod
    : [%]
    ;

RightParen
    : [)]
    ;

Tilde
    : [~]
    ;

DELIMITER
    : [;]
    ;

CNNOP
    : '||'
    ;

AND_OP
    : '&&'
    ;

COMP_EQ
    : '='
    ;

SET_VAR
    : ':='
    ;

COMP_NSEQ
    : '<=>'
    ;

COMP_GE
    : '>='
    ;

COMP_GT
    : '>'
    ;

COMP_LE
    : '<='
    ;

COMP_LT
    : '<'
    ;

COMP_NE
    : '!=' | '<>'
    ;

SHIFT_LEFT
    : '<<'
    ;

SHIFT_RIGHT
    : '>>'
    ;

JSON_EXTRACT
    : '->'
    ;

JSON_EXTRACT_UNQUOTED
    : '->>'
    ;

QUESTIONMARK
    : '?'
    | ':'[0-9]+
    | ':'(([A-Za-z0-9$_]|(~[\u0000-\u007F\uD800-\uDBFF]))+)'.'(([A-Za-z0-9$_]|(~[\u0000-\u007F\uD800-\uDBFF]))+)
    ;

SYSTEM_VARIABLE
    : ('@''@'[A-Za-z_][A-Za-z0-9_]*)
    ;

USER_VARIABLE
    : ('@'[A-Za-z0-9_.$]*)|('@'[`'"][`'"A-Za-z0-9_.$/%]*)
    ;

NAME_OB
    : (([A-Za-z0-9$_]|(~[\u0000-\u007F\uD800-\uDBFF]))+)
    | '`' ~[`]* '`'
    ;

STRING_VALUE
    : '\'' (~['\\]|('\'\'')|('\\'.))* '\''
    | '"' (~["\\]|('""')|('\\'.))* '"'

    ;

In_c_comment
    : '/*' .*? '*/'      -> channel(1)
    ;

ANTLR_SKIP
    : '--'[ \t]* .*? '\n'   -> channel(1)
    ;

Blank
    : [ \t\r\n] -> channel(1)    ;



fragment A : [aA];
fragment B : [bB];
fragment C : [cC];
fragment D : [dD];
fragment E : [eE];
fragment F : [fF];
fragment G : [gG];
fragment H : [hH];
fragment I : [iI];
fragment J : [jJ];
fragment K : [kK];
fragment L : [lL];
fragment M : [mM];
fragment N : [nN];
fragment O : [oO];
fragment P : [pP];
fragment Q : [qQ];
fragment R : [rR];
fragment S : [sS];
fragment T : [tT];
fragment U : [uU];
fragment V : [vV];
fragment W : [wW];
fragment X : [xX];
fragment Y : [yY];
fragment Z : [zZ];
