export type SqlServiceConfig = {};

// import { TableAuthResponse } from './tools/validationRules/TableAuth';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
export declare type DiagnosticSeverity = 1 | 2 | 3 | 4;

export interface Diagnostic {
  /**
   * The range at which the message applies
   */
  range: Range;
  /**
   * The diagnostic's severity. Can be omitted. If omitted it is up to the
   * client to interpret diagnostics as error, warning, info or hint.
   */
  severity?: DiagnosticSeverity;
  /**
   * The diagnostic's code, which might appear in the user interface.
   */
  code?: number | string;
  /**
   * A human-readable string describing the source of this
   * diagnostic, e.g. 'typescript' or 'super lint'.
   */
  source?: string;
  /**
   * The diagnostic's message.
   */
  message: string;
}
export enum supportLanguage {
  SQL = 'ODPSSQL',
  ODPSSQL = 'ODPSSQL',
  DB = 'DBSQL',
}

export const languageRegister = {
  ODPSSQL: {
    id: 'ODPSSQL',
    aliases: ['SQL', 'ODPS', 'ODPSSQL'],
    extensions: ['.sql', '.odps', '.odpssql'],
    resolvedConfiguration: {
      comments: { lineComment: '--', blockComment: ['/*', '*/'] },
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
      ],
      autoClosingPairs: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
        { open: '"', close: '"', notIn: ['string'] },
        { open: "N'", close: "'", notIn: ['string', 'comment'] },
        { open: "'", close: "'", notIn: ['string', 'comment'] },
      ],
      surroundingPairs: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
        ['"', '"'],
        ["'", "'"],
        ['`', '`'],
      ],
    },
  },
};

export const languageGrammer = {
  ODPSSQL: {
    scopeName: 'source.odpssql',
    language: 'ODPSSQL',
    resolvedConfiguration: {
      information_for_contributors: [
        'This file has been converted from https://github.com/microsoft/vscode-mssql/blob/master/syntaxes/SQL.plist',
        'If you want to provide a fix or improvement, please create a pull request against the original repository.',
        'Once accepted there, we are happy to receive an update request.',
      ],
      version:
        'https://github.com/microsoft/vscode-mssql/commit/61ae0eb21ac53883a23e09913a5ae77a59126ff9',
      name: 'ODPSSQL',
      scopeName: 'source.odpssql',
      patterns: [
        {
          match: '((?<!@)@)\\b(\\w+)\\b',
          name: 'text.variable',
        },
        {
          match: '(\\[)[^\\]]*(\\])',
          name: 'text.bracketed',
        },
        {
          match:
            '\\b(?i)(abort|abort_after_wait|absent|absolute|accent_sensitivity|acceptable_cursopt|acp|action|activation|address|admin|aes_128|aes_192|aes_256|affinity|after|aggregate|algorithm|all_constraints|all_errormsgs|all_indexes|all_levels|all_results|allow_connections|allow_dup_row|allow_encrypted_value_modifications|allow_page_locks|allow_row_locks|allow_snapshot_isolation|alter|altercolumn|always|anonymous|ansi_defaults|ansi_null_default|ansi_null_dflt_off|ansi_null_dflt_on|ansi_nulls|ansi_padding|ansi_warnings|appdomain|append|application|apply|arithabort|arithignore|assembly|asymmetric|asynchronous_commit|at|atan2|atomic|attach|attach_force_rebuild_log|attach_rebuild_log|audit|auth_realm|authentication|auto|auto_cleanup|auto_close|auto_create_statistics|auto_shrink|auto_update_statistics|auto_update_statistics_async|automated_backup_preference|automatic|autopilot|availability|availability_mode|backup_priority|base64|basic|batches|batchsize|before|between|bigint|binary|binding|bit|block|blocksize|bmk|break|broker|broker_instance|bucket_count|buffer|buffercount|bulk_logged|by|call|caller|card|case|cast|catalog|catch|cert|certificate|change_retention|change_tracking|change_tracking_context|changes|char|character|character_set|check_expiration|check_policy|checkconstraints|checkindex|checkpoint|cleanup_policy|clear|clear_port|close|codepage|collection|column_encryption_key|column_master_key|columnstore|columnstore_archive|colv_80_to_100|colv_100_to_80|commit_differential_base|committed|compatibility_level|compress_all_row_groups|compression|compression_delay|concat_null_yields_null|concatenate|configuration|connect|continue|continue_after_error|contract|contract_name|control|conversation|conversation_group_id|conversation_handle|copy|copy_only|count_rows|counter|create(\\s+or\\s+alter)?|credential|cross|cryptographic|cryptographic_provider|cube|cursor_close_on_commit|cursor_default|data|data_compression|data_flush_interval_seconds|data_mirroring|data_purity|data_source|database|database_name|database_snapshot|datafiletype|date_correlation_optimization|date|datefirst|dateformat|date_format|datetime|datetime2|datetimeoffset|days|db_chaining|dbid|dbidexec|dbo_only|deadlock_priority|deallocate|dec|decimal|declare(\\s+cursor)?|decrypt|decrypt_a|decryption|default_database|default_language|default_logon_domain|default_schema|definition|delay|delayed_durability|delimitedtext|density_vector|dependent|des|description|desired_state|desx|differential|digest|disable|disable_broker|disable_def_cnst_chk|disabled|disk|distinct|distributed|distribution|drop|drop_existing|dts_buffers|dump|durability|dynamic|edition|elements|else|emergency|empty|enable|enable_broker|enabled|encoding|encrypted|encrypted_value|encryption|encryption_type|end|endpoint|endpoint_url|enhancedintegrity|entry|error_broker_conversations|errorfile|estimateonly|event|except|exec|executable|execute|exists|expand|expiredate|expiry_date|explicit|external|external_access|failover|failover_mode|failure_condition_level|fast|fast_forward|fastfirstrow|federated_service_account|fetch|field_terminator|fieldterminator|file|filelistonly|filegroup|filename|filestream|filestream_log|filestream_on|filetable|file_format|filter|first_row|fips_flagger|fire_triggers|first|firstrow|float|flush_interval_seconds|fmtonly|following|force|force_failover_allow_data_loss|force_service_allow_data_loss|forced|forceplan|formatfile|format_options|format_type|formsof|forward_only|free_cursors|free_exec_context|fullscan|fulltext|fulltextall|fulltextkey|function|generated|get|geography|geometry|global|go|goto|governor|guid|hadoop|hardening|hash|hashed|header_limit|headeronly|health_check_timeout|hidden|hierarchyid|histogram|histogram_steps|hits_cursors|hits_exec_context|hours|http|identity|identity_value|if|ifnull|ignore_constraints|ignore_dup_key|ignore_dup_row|ignore_triggers|image|immediate|implicit_transactions|include|include_null_values|inflectional|init|initiator|insensitive|insert|instead|int|integer|integrated|intersect|intermediate|interval_length_minutes|into|inuse_cursors|inuse_exec_context|io|is|isabout|iso_week|isolation|job_tracker_location|json|keep|keep_nulls|keep_replication|keepdefaults|keepfixed|keepidentity|keepnulls|kerberos|key|key_path|key_source|key_store_provider_name|keyset|kill|kilobytes_per_batch|labelonly|langid|language|last|lastrow|legacy_cardinality_estimation|length|level|lifetime|lineage_80_to_100|lineage_100_to_80|listener_ip|listener_port|load|loadhistory|lob_compaction|local|local_service_name|locate|location|lock_escalation|lock_timeout|lockres|login|login_type|loop|manual|mark_in_use_for_removal|masked|master|max_queue_readers|max_duration|max_outstanding_io_per_volume|maxdop|maxerrors|maxlength|maxtransfersize|max_plans_per_query|max_storage_size_mb|mediadescription|medianame|mediapassword|memogroup|memory_optimized|merge|message|message_forward_size|message_forwarding|microsecond|millisecond|minutes|mirror_address|misses_cursors|misses_exec_context|mixed|modify|money|move|multi_user|must_change|name|namespace|nanosecond|native|native_compilation|nchar|ncharacter|never|new_account|new_broker|newname|next|no|no_browsetable|no_checksum|no_compression|no_infomsgs|no_triggers|no_truncate|nocount|noexec|noexpand|noformat|noinit|nolock|nonatomic|nondurable|none|norecompute|norecovery|noreset|norewind|noskip|not|notification|nounload|now|nowait|ntext|ntlm|numeric|numeric_roundabort|nvarchar|object|objid|oem|offline|old_account|online|operation_mode|open|openjson|optimistic|option|orc|out|outer|output|over|override|owner|ownership|pad_index|page|page_checksum|page_verify|pagecount|paglock|param|parameter_sniffing|parameter_type_expansion|parameterization|parquet|parseonly|partial|partition|partner|password|path|pause|percentage|permission_set|persisted|period|physical_only|plan_forcing_mode|policy|pool|population|ports|preceding|precision|predicate|presume_abort|primary|primary_role|print|prior|priority |priority_level|private|proc(edure)?|procedure_name|profile|provider|query_capture_mode|query_governor_cost_limit|query_optimizer_hotfixes|query_store|queue|quoted_identifier|raiserror|range|raw|rcfile|rc2|rc4|rc4_128|rdbms|read_committed_snapshot|read|read_only|read_write|readcommitted|readcommittedlock|readonly|readpast|readuncommitted|readwrite|real|rebuild|receive|recmodel_70backcomp|recompile|reconfigure|recovery|recursive|recursive_triggers|redo_queue|reject_sample_value|reject_type|reject_value|relative|remote|remote_data_archive|remote_proc_transactions|remote_service_name|remove|removed_cursors|removed_exec_context|reorganize|repeat|repeatable|repeatableread|replica|replicated|replnick_100_to_80|replnickarray_80_to_100|replnickarray_100_to_80|required|required_cursopt|resample|reset|resource|resource_manager_location|restart|restore|restricted_user|resume|retaindays|retention|return|revert|rewind|rewindonly|returns|robust|role|rollup|root|round_robin|route|row|rowdump|rowguidcol|rowlock|row_terminator|rows|rows_per_batch|rowsets_only|rowterminator|rowversion|rsa_1024|rsa_2048|rsa_3072|rsa_4096|rsa_512|safe|safety|sample|save|schema|schemabinding|scoped|scroll|scroll_locks|sddl|secexpr|secondary|secondary_only|secondary_role|secret|security|securityaudit|selective|self|send|sent|sequence|serde_method|serializable|server|service|service_broker|service_name|service_objective|session_timeout|session|sessions|seterror|setopts|sets|shard_map_manager|shard_map_name|sharded|shared_memory|show_statistics|showplan_all|showplan_text|showplan_xml|showplan_xml_with_recompile|shrinkdb|shutdown|sid|signature|simple|single_blob|single_clob|single_nclob|single_user|singleton|site|size_based_cleanup_mode|skip|smalldatetime|smallint|smallmoney|snapshot|snapshot_import|snapshotrestorephase|soap|softnuma|sort_in_tempdb|sorted_data|sorted_data_reorg|spatial|sql|sql_bigint|sql_binary|sql_bit|sql_char|sql_date|sql_decimal|sql_double|sql_float|sql_guid|sql_handle|sql_longvarbinary|sql_longvarchar|sql_numeric|sql_real|sql_smallint|sql_time|sql_timestamp|sql_tinyint|sql_tsi_day|sql_tsi_frac_second|sql_tsi_hour|sql_tsi_minute|sql_tsi_month|sql_tsi_quarter|sql_tsi_second|sql_tsi_week|sql_tsi_year|sql_type_date|sql_type_time|sql_type_timestamp|sql_varbinary|sql_varchar|sql_variant|sql_wchar|sql_wlongvarchar|ssl|ssl_port|standard|standby|start|start_date|started|stat_header|state|statement|static|statistics|statistics_incremental|statistics_norecompute|statistics_only|statman|stats_stream|status|stop|stop_on_error|stopat|stopatmark|stopbeforemark|stoplist|stopped|string_delimiter|subject|supplemental_logging|supported|suspend|symmetric|synchronous_commit|synonym|sysname|system|system_time|system_versioning|table|tableresults|tablock|tablockx|take|tape|target|target_index|target_partition|tcp|temporal_history_retention|text|textimage_on|then|thesaurus|throw|time|timeout|timestamp|tinyint|to|top|torn_page_detection|track_columns_updated|tran|transaction|transfer|triple_des|triple_des_3key|truncate|trustworthy|try|tsql|type|type_desc|type_warning|tzoffset|uid|unbounded|uncommitted|uniqueidentifier|unlimited|unload|unlock|unsafe|updlock|url|use|useplan|useroptions|use_type_default|using|utcdatetime|valid_xml|validation|value|values|varbinary|varchar|verbose|verifyonly|version|view_metadata|virtual_device|visiblity|waitfor|webmethod|weekday|weight|well_formed_xml|when|while|widechar|widechar_ansi|widenative|windows|with|within|witness|without|without_array_wrapper|workload|wsdl|xact_abort|xlock|xml|xmlschema|xquery|xsinil|zone)\\b',
          name: 'keyword.other.sql',
        },
        {
          include: '#comments',
        },
        {
          captures: {
            '1': {
              name: 'keyword.other.create.sql',
            },
            '2': {
              name: 'keyword.other.sql',
            },
            '5': {
              name: 'entity.name.function.sql',
            },
          },
          match:
            '(?i:^\\s*(create(?:\\s+or\\s+replace)?)\\s+(aggregate|conversion|database|domain|function|group|(unique\\s+)?index|language|operator class|operator|rule|schema|sequence|table|tablespace|trigger|type|user|view)\\s+)([\'"`]?)(\\w+)\\4',
          name: 'meta.create.sql',
        },
        {
          captures: {
            '1': {
              name: 'keyword.other.create.sql',
            },
            '2': {
              name: 'keyword.other.sql',
            },
          },
          match:
            '(?i:^\\s*(drop)\\s+(aggregate|conversion|database|domain|function|group|index|language|operator class|operator|rule|schema|sequence|table|tablespace|trigger|type|user|view))',
          name: 'meta.drop.sql',
        },
        {
          captures: {
            '1': {
              name: 'keyword.other.create.sql',
            },
            '2': {
              name: 'keyword.other.table.sql',
            },
            '3': {
              name: 'entity.name.function.sql',
            },
            '4': {
              name: 'keyword.other.cascade.sql',
            },
          },
          match: '(?i:\\s*(drop)\\s+(table)\\s+(\\w+)(\\s+cascade)?\\b)',
          name: 'meta.drop.sql',
        },
        {
          captures: {
            '1': {
              name: 'keyword.other.create.sql',
            },
            '2': {
              name: 'keyword.other.table.sql',
            },
          },
          match:
            '(?i:^\\s*(alter)\\s+(aggregate|conversion|database|domain|function|group|index|language|operator class|operator|proc(edure)?|rule|schema|sequence|table|tablespace|trigger|type|user|view)\\s+)',
          name: 'meta.alter.sql',
        },
        {
          captures: {
            '1': {
              name: 'storage.type.sql',
            },
            '2': {
              name: 'storage.type.sql',
            },
            '3': {
              name: 'constant.numeric.sql',
            },
            '4': {
              name: 'storage.type.sql',
            },
            '5': {
              name: 'constant.numeric.sql',
            },
            '6': {
              name: 'storage.type.sql',
            },
            '7': {
              name: 'constant.numeric.sql',
            },
            '8': {
              name: 'constant.numeric.sql',
            },
            '9': {
              name: 'storage.type.sql',
            },
            '10': {
              name: 'constant.numeric.sql',
            },
            '11': {
              name: 'storage.type.sql',
            },
            '12': {
              name: 'storage.type.sql',
            },
            '13': {
              name: 'storage.type.sql',
            },
            '14': {
              name: 'constant.numeric.sql',
            },
            '15': {
              name: 'storage.type.sql',
            },
          },
          match:
            '(?xi)\n\n\t\t\t\t# normal stuff, capture 1\n\t\t\t\t \\b(bigint|bigserial|bit|boolean|box|bytea|cidr|circle|date|double\\sprecision|inet|int|integer|line|lseg|macaddr|money|oid|path|point|polygon|real|serial|smallint|sysdate|text)\\b\n\n\t\t\t\t# numeric suffix, capture 2 + 3i\n\t\t\t\t|\\b(bit\\svarying|character\\s(?:varying)?|tinyint|var\\schar|float|interval)\\((\\d+)\\)\n\n\t\t\t\t# optional numeric suffix, capture 4 + 5i\n\t\t\t\t|\\b(char|number|varchar\\d?)\\b(?:\\((\\d+)\\))?\n\n\t\t\t\t# special case, capture 6 + 7i + 8i\n\t\t\t\t|\\b(numeric|decimal)\\b(?:\\((\\d+),(\\d+)\\))?\n\n\t\t\t\t# special case, captures 9, 10i, 11\n\t\t\t\t|\\b(times?)\\b(?:\\((\\d+)\\))?(\\swith(?:out)?\\stime\\szone\\b)?\n\n\t\t\t\t# special case, captures 12, 13, 14i, 15\n\t\t\t\t|\\b(timestamp)(?:(s|tz))?\\b(?:\\((\\d+)\\))?(\\s(with|without)\\stime\\szone\\b)?\n\n\t\t\t',
        },
        {
          match:
            '(?i:\\b((?:primary|foreign)\\s+key|references|on\\sdelete(\\s+cascade)?|check|constraint)\\b)',
          name: 'storage.modifier.sql',
        },
        {
          match: '\\b\\d+\\b',
          name: 'constant.numeric.sql',
        },
        {
          match:
            '(?i:\\b(select(\\s+distinct)?|insert\\s+(ignore\\s+)?into|update|delete|from|set|where|group\\sby|or|like|and|union(\\s+all)?|having|order\\sby|limit|(inner|cross)\\s+join|join|straight_join|full\\s+outer\\s+join|(left|right)(\\s+outer)?\\s+join|natural(\\s+(left|right)(\\s+outer)?)?\\s+join)\\b)',
          name: 'keyword.other.DML.sql',
        },
        {
          match: '(?i:\\b(on|off|((is\\s+)?not\\s+)?null)\\b)',
          name: 'keyword.other.DDL.create.II.sql',
        },
        {
          match: '(?i:\\bvalues\\b)',
          name: 'keyword.other.DML.II.sql',
        },
        {
          match:
            '(?i:\\b(begin(\\s+work)?|start\\s+transaction|commit(\\s+work)?|rollback(\\s+work)?)\\b)',
          name: 'keyword.other.LUW.sql',
        },
        {
          match: '(?i:\\b(grant(\\swith\\sgrant\\soption)?|revoke)\\b)',
          name: 'keyword.other.authorization.sql',
        },
        {
          match: '(?i:\\bin\\b)',
          name: 'keyword.other.data-integrity.sql',
        },
        {
          match:
            '(?i:^\\s*(comment\\s+on\\s+(table|column|aggregate|constraint|database|domain|function|index|operator|rule|schema|sequence|trigger|type|view))\\s+.*?\\s+(is)\\s+)',
          name: 'keyword.other.object-comments.sql',
        },
        {
          match: '(?i)\\bAS\\b',
          name: 'keyword.other.alias.sql',
        },
        {
          match: '(?i)\\b(DESC|ASC)\\b',
          name: 'keyword.other.order.sql',
        },
        {
          match: '\\*',
          name: 'keyword.operator.star.sql',
        },
        {
          match: '[!<>]?=|<>|<|>',
          name: 'keyword.operator.comparison.sql',
        },
        {
          match: '-|\\+|/',
          name: 'keyword.operator.math.sql',
        },
        {
          match: '\\|\\|',
          name: 'keyword.operator.concatenator.sql',
        },
        {
          match:
            '(?i)\\b(avg|checksum_agg|count|count_big|grouping|grouping_id|max|min|sum|stdev|stdevp|var|varp)\\b',
          name: 'support.function.aggregate.sql',
        },
        {
          match: '(?i)\\b(cast|convert|parse|try_cast|try_convert|try_parse)\\b',
          name: 'support.function.conversion.sql',
        },
        {
          match: '(?i)\\b(cursor_status)\\b',
          name: 'support.function.cursor.sql',
        },
        {
          match:
            '(?i)\\b(sysdatetime|sysdatetimeoffset|sysutcdatetime|current_time(stamp)?|getdate|getutcdate|datename|datepart|day|month|year|datefromparts|datetime2fromparts|datetimefromparts|datetimeoffsetfromparts|smalldatetimefromparts|timefromparts|datediff|dateadd|eomonth|switchoffset|todatetimeoffset|isdate)\\b',
          name: 'support.function.datetime.sql',
        },
        {
          match: '(?i)\\b(coalesce|nullif)\\b',
          name: 'support.function.expression.sql',
        },
        {
          match:
            '(?<!@)@@(?i)\\b(cursor_rows|connections|cpu_busy|datefirst|dbts|error|fetch_status|identity|idle|io_busy|langid|language|lock_timeout|max_connections|max_precision|nestlevel|options|packet_errors|pack_received|pack_sent|procid|remserver|rowcount|servername|servicename|spid|textsize|timeticks|total_errors|total_read|total_write|trancount|version)\\b',
          name: 'support.function.globalvar.sql',
        },
        {
          match: '(?i)\\b(choose|iif)\\b',
          name: 'support.function.logical.sql',
        },
        {
          match:
            '(?i)\\b(abs|acos|asin|atan|atn2|ceiling|cos|cot|degrees|exp|floor|log|log10|pi|power|radians|rand|round|sign|sin|sqrt|square|tan)\\b',
          name: 'support.function.mathematical.sql',
        },
        {
          match:
            '(?i)\\b(app_name|applock_mode|applock_test|assemblyproperty|col_length|col_name|columnproperty|database_principal_id|databasepropertyex|db_id|db_name|file_id|file_idex|file_name|filegroup_id|filegroup_name|filegroupproperty|fileproperty|fulltextcatalogproperty|fulltextserviceproperty|index_col|indexkey_property|indexproperty|object_definition|object_id|object_name|object_schema_name|objectproperty|objectpropertyex|original_db_name|parsename|schema_id|schema_name|scope_identity|serverproperty|stats_date|type_id|type_name|typeproperty)\\b',
          name: 'support.function.metadata.sql',
        },
        {
          match: '(?i)\\b(rank|dense_rank|ntile|row_number)\\b',
          name: 'support.function.ranking.sql',
        },
        {
          match: '(?i)\\b(opendatasource|openrowset|openquery|openxml)\\b',
          name: 'support.function.rowset.sql',
        },
        {
          match:
            '(?i)\\b(certencoded|certprivatekey|current_user|database_principal_id|has_perms_by_name|is_member|is_rolemember|is_srvrolemember|original_login|permissions|pwdcompare|pwdencrypt|schema_id|schema_name|session_user|suser_id|suser_sid|suser_sname|system_user|suser_name|user_id|user_name)\\b',
          name: 'support.function.security.sql',
        },
        {
          match:
            '(?i)\\b(ascii|char|charindex|concat|difference|format|left|len|lower|ltrim|nchar|patindex|quotename|replace|replicate|reverse|rtrim|soundex|space|str|string_agg|string_escape|string_split|stuff|substring|translate|trim|unicode|upper)\\b',
          name: 'support.function.string.sql',
        },
        {
          match:
            '(?i)\\b(binary_checksum|checksum|compress|connectionproperty|context_info|current_request_id|current_transaction_id|decompress|error_line|error_message|error_number|error_procedure|error_severity|error_state|formatmessage|get_filestream_transaction_context|getansinull|host_id|host_name|isnull|isnumeric|min_active_rowversion|newid|newsequentialid|rowcount_big|session_context|session_id|xact_state)\\b',
          name: 'support.function.system.sql',
        },
        {
          match: '(?i)\\b(patindex|textptr|textvalid)\\b',
          name: 'support.function.textimage.sql',
        },
        {
          captures: {
            '1': {
              name: 'constant.other.database-name.sql',
            },
            '2': {
              name: 'constant.other.table-name.sql',
            },
          },
          match: '(\\w+?)\\.(\\w+)',
        },
        {
          include: '#strings',
        },
        {
          include: '#regexps',
        },
        {
          captures: {
            '1': {
              name: 'punctuation.section.scope.begin.sql',
            },
            '2': {
              name: 'punctuation.section.scope.end.sql',
            },
          },
          comment: 'Allow for special ↩ behavior',
          match: '(\\()(\\))',
          name: 'meta.block.sql',
        },
      ],
      repository: {
        comments: {
          patterns: [
            {
              begin: '(^[ \\t]+)?(?=--)',
              beginCaptures: {
                '1': {
                  name: 'punctuation.whitespace.comment.leading.sql',
                },
              },
              end: '(?!\\G)',
              patterns: [
                {
                  begin: '--',
                  beginCaptures: {
                    '0': {
                      name: 'punctuation.definition.comment.sql',
                    },
                  },
                  end: '\\n',
                  name: 'comment.line.double-dash.sql',
                },
              ],
            },
            {
              begin: '(^[ \\t]+)?(?=#)',
              beginCaptures: {
                '1': {
                  name: 'punctuation.whitespace.comment.leading.sql',
                },
              },
              end: '(?!\\G)',
              patterns: [],
            },
            {
              begin: '/\\*',
              captures: {
                '0': {
                  name: 'punctuation.definition.comment.sql',
                },
              },
              end: '\\*/',
              name: 'comment.block.c',
            },
          ],
        },
        regexps: {
          patterns: [
            {
              begin: '/(?=\\S.*/)',
              beginCaptures: {
                '0': {
                  name: 'punctuation.definition.string.begin.sql',
                },
              },
              end: '/',
              endCaptures: {
                '0': {
                  name: 'punctuation.definition.string.end.sql',
                },
              },
              name: 'string.regexp.sql',
              patterns: [
                {
                  include: '#string_interpolation',
                },
                {
                  match: '\\\\/',
                  name: 'constant.character.escape.slash.sql',
                },
              ],
            },
            {
              begin: '%r\\{',
              beginCaptures: {
                '0': {
                  name: 'punctuation.definition.string.begin.sql',
                },
              },
              comment: 'We should probably handle nested bracket pairs!?! -- Allan',
              end: '\\}',
              endCaptures: {
                '0': {
                  name: 'punctuation.definition.string.end.sql',
                },
              },
              name: 'string.regexp.modr.sql',
              patterns: [
                {
                  include: '#string_interpolation',
                },
              ],
            },
          ],
        },
        string_escape: {
          match: '\\\\.',
          name: 'constant.character.escape.sql',
        },
        string_interpolation: {
          captures: {
            '1': {
              name: 'punctuation.definition.string.begin.sql',
            },
            '3': {
              name: 'punctuation.definition.string.end.sql',
            },
          },
          match: '(#\\{)([^\\}]*)(\\})',
          name: 'string.interpolated.sql',
        },
        strings: {
          patterns: [
            {
              captures: {
                '1': {
                  name: 'punctuation.definition.string.begin.sql',
                },
                '2': {
                  name: 'punctuation.definition.string.end.sql',
                },
              },
              comment:
                'this is faster than the next begin/end rule since sub-pattern will match till end-of-line and SQL files tend to have very long lines.',
              match: "(N)?(')[^']*(')",
              name: 'string.quoted.single.sql',
            },
            {
              begin: "'",
              beginCaptures: {
                '0': {
                  name: 'punctuation.definition.string.begin.sql',
                },
              },
              end: "'",
              endCaptures: {
                '0': {
                  name: 'punctuation.definition.string.end.sql',
                },
              },
              name: 'string.quoted.single.sql',
              patterns: [
                {
                  include: '#string_escape',
                },
              ],
            },
            {
              captures: {
                '1': {
                  name: 'punctuation.definition.string.begin.sql',
                },
                '2': {
                  name: 'punctuation.definition.string.end.sql',
                },
              },
              comment:
                'this is faster than the next begin/end rule since sub-pattern will match till end-of-line and SQL files tend to have very long lines.',
              match: '(`)[^`\\\\]*(`)',
              name: 'string.quoted.other.backtick.sql',
            },
            {
              begin: '`',
              beginCaptures: {
                '0': {
                  name: 'punctuation.definition.string.begin.sql',
                },
              },
              end: '`',
              endCaptures: {
                '0': {
                  name: 'punctuation.definition.string.end.sql',
                },
              },
              name: 'string.quoted.other.backtick.sql',
              patterns: [
                {
                  include: '#string_escape',
                },
              ],
            },
            {
              captures: {
                '1': {
                  name: 'punctuation.definition.string.begin.sql',
                },
                '2': {
                  name: 'punctuation.definition.string.end.sql',
                },
              },
              comment:
                'this is faster than the next begin/end rule since sub-pattern will match till end-of-line and SQL files tend to have very long lines.',
              match: '(")[^"#]*(")',
              name: 'string.quoted.double.sql',
            },
            {
              begin: '"',
              beginCaptures: {
                '0': {
                  name: 'punctuation.definition.string.begin.sql',
                },
              },
              end: '"',
              endCaptures: {
                '0': {
                  name: 'punctuation.definition.string.end.sql',
                },
              },
              name: 'string.quoted.double.sql',
              patterns: [
                {
                  include: '#string_interpolation',
                },
              ],
            },
            {
              begin: '%\\{',
              beginCaptures: {
                '0': {
                  name: 'punctuation.definition.string.begin.sql',
                },
              },
              end: '\\}',
              endCaptures: {
                '0': {
                  name: 'punctuation.definition.string.end.sql',
                },
              },
              name: 'string.other.quoted.brackets.sql',
              patterns: [
                {
                  include: '#string_interpolation',
                },
              ],
            },
          ],
        },
      },
    },
  },
};

export enum ErrorType {
  /**
   * 没有可选项
   */
  NoViableAltException = 'NoViableAltException',
  /**
   * 缺少必填项
   */
  MismatchedTokenException = 'MismatchedTokenException',
  /**
   * 解析完成，存在多余token
   */
  NotAllInputParsedException = 'NotAllInputParsedException',
  /**
   * 至少重复一次token，但是没有了
   */
  EarlyExitException = 'EarlyExitException',
}

export const ErrorTypeMap = [
  {
    type: 'NoViableAltException',
    message: 'Unspported Gramma',
    pattern: /\[(.*?)\]/g,
  },
  {
    type: 'MismatchedTokenException',
    message: 'Variable token expected.',
    pattern: /Expecting token of type --> (.*) <-- but found --> '.*' <--/,
  },
  {
    type: 'NotAllInputParsedException',
    message: 'Unspported Gramma.',
    pattern: /Redundant input, expecting EOF but found: (.*)/,
  },
  {
    type: 'EarlyExitException',
    message: 'missed token.',
    pattern: /\[.*?\]/g,
  },
];

export interface ICreateData {
  languageId: string;
  languageTokens: object;
  // languageSettings: sqlService.LanguageSettings;
}

export enum LinuxTokenEnum {
  //linux
  TOUCH = 'TOUCH',
  CHMOD = 'CHMOD',
  CHOWN = 'CHOWN',
  CAT = 'CAT',
  EXIT = 'EXIT',
  SLEEP = 'SLEEP',
  ECHO = 'ECHO',
  PYTHON = 'PYTHON',
  PIP = 'PIP',
}

/** 提示时需要转译的label */
export enum translateLabel {
  'DOT' = '.',
  'LOCAL_ID' = '@',
  'STAR' = '*',
  'EQUAL_SYMBOL' = '=',
  'LR_BRACKET' = '(',
  'RR_BRACKET' = ')',
  'BIT_OR_OP' = '||',
  'SEMI' = ';',
  'BIT_AND_OP' = '&&',
  'COMMA' = ',',
  'NULL_LITERAL' = 'NULL',
  'NULL_SPEC_LITERAL' = 'N',
  'GREATER_SYMBOL' = '>',
  'LESS_SYMBOL' = '<',
  'EXCLAMATION_SYMBOL' = '!',
  'LESSTHANOREQUALTO' = '<=',
  'GREATERTHANOREQUALTO' = '>=',
}

export enum TokenLabel {
  /** 常规字符 */
  'DOT_ID' = 'DOT_ID',
  'EXISTS' = 'EXISTS',
  'FROM' = 'FROM',
  'REVERSE_QUOTE_ID' = 'REVERSE_QUOTE_ID',
  'SET' = 'SET',
  'AND' = 'AND',
  'XOR' = 'XOR',
  'OR' = 'OR',
  'SELECT' = 'SELECT',
  'UPDATE' = 'UPDATE',
  'CREATE' = 'CREATE',
  'DROP' = 'DROP',
  'INSERT' = 'INSERT',
  'DELETE' = 'DELETE',
  'SUM' = 'SUM',
  'AS' = 'AS',
  'ORDER' = 'ORDER BY',
  'PARTITION' = 'PARTITION',
  'PARTITIONED' = 'PARTITIONED',
  'LIFECYCLE' = 'LIFECYCLE',
  'STRING' = 'STRING',
  'INTO' = 'INTO',
  'OVERWRITE' = 'OVERWRITE',
  'DUMPFILE' = 'DUMPFILE',
  'OUTFILE' = 'OUTFILE',
  'CHARACTER' = 'CHARACTER',
  'LINES' = 'LINES',
  'FIELDS' = 'FIELDS',
  'COLUMNS' = 'COLUMNS',
  'WHERE' = 'WHERE',
  'GROUP' = 'GROUP BY',
  'HAVING' = 'HAVING',
  'ENGINE' = 'ENGINE',
  'AUTO_INCREMENT' = 'AUTO_INCREMENT',
  'AVG_ROW_LENGTH' = 'AVG_ROW_LENGTH',
  'DEFAULT' = 'DEFAULT',
  'CHARSET' = 'CHARSET',
  'CHECKSUM' = 'CHECKSUM',
  'COMMENT' = 'COMMENT',
  'COMPRESSION' = 'COMPRESSION',
  'CONNECTION' = 'CONNECTION',
  'DATA' = 'DATA DIRECTORY',
  'DELAY_KEY_WRITE' = 'DELAY_KEY_WRITE',
  'ENCRYPTION' = 'ENCRYPTION',
  'INDEX' = 'INDEX DIRECTORY',
  'INSERT_METHOD' = 'INSERT_METHOD',
  'NO' = 'NO',
  'FIRST' = 'FIRST',
  'LAST' = 'LAST',
  'KEY_BLOCK_SIZE' = 'KEY_BLOCK_SIZE',
  'MAX_ROWS' = 'MAX_ROWS',
  'MIN_ROWS' = 'MIN_ROWS',
  'PACK_KEYS' = 'PACK_KEYS',
  'PASSWORD' = 'PASSWORD',
  'ROW_FORMAT' = 'ROW_FORMAT',
  'DYNAMIC' = 'DYNAMIC',
  'FIXED' = 'FIXED',
  'COMPRESSED' = 'COMPRESSED',
  'REDUNDANT' = 'REDUNDANT',
  'COMPACT' = 'COMPACT',
  'STATS_AUTO_RECALC' = 'STATS_AUTO_RECALC',
  'STATS_PERSISTENT' = 'STATS_PERSISTENT',
  'TABLESPACE' = 'TABLESPACE',
  'UNION' = 'UNION',
  'STORAGE' = 'STORAGE',
  'DISK' = 'DISK',
  'MEMORY' = 'MEMORY',
  'PRIMARY' = 'PRIMARY KEY',
  'UNIQUE' = 'UNIQUE KEY',
  'COLUMN_FORMAT' = 'COLUMN_FORMAT',
  'BLACKHOLE' = 'BLACKHOLE',
  'CSV' = 'CSV',
  'FEDERATED' = 'FEDERATED',
  'INNODB' = 'INNODB',
  'MRG_MYISAM' = 'MRG_MYISAM',
  'MYISAM' = 'MYISAM',
  'NDB' = 'NDB',
  'NDBCLUSTER' = 'NDBCLUSTER',
  'PERFOMANCE_SCHEMA' = 'PERFOMANCE_SCHEMA',
  'ON' = 'ON',
  'LOCALTIMESTAMP' = 'LOCALTIMESTAMP',
  'CHAR' = 'CHAR',
  'VARCHAR' = 'VARCHAR',
  'TINYTEXT' = 'TINYTEXT',
  'TEXT' = 'TEXT',
  'MEDIUMTEXT' = 'MEDIUMTEXT',
  'LONGTEXT' = 'LONGTEXT',
  'BINARY' = 'BINARY',
  /** 定序规则，会影响排序规则，区分大小写，半圆角 */
  'COLLATE' = 'COLLATE',
  'TINYINT' = 'TINYINT',
  'SMALLINT' = 'SMALLINT',
  'MEDIUMINT' = 'MEDIUMINT',
  'INT' = 'INT',
  'INTEGER' = 'INTEGER',
  'BIGINT' = 'BIGINT',
  'UNSIGNED' = 'UNSIGNED',
  'ZEROFILL' = 'ZEROFILL',
  'REAL' = 'REAL',
  'DOUBLE' = 'DOUBLE',
  'FLOAT' = 'FLOAT',
  'DECIMAL' = 'DECIMAL',
  'NUMERIC' = 'NUMERIC',
  'DATE' = 'DATE',
  'TINYBLOB' = 'TINYBLOB',
  'BLOB' = 'BLOB',
  'MEDIUMBLOB' = 'MEDIUMBLOB',
  'LONGBLOB' = 'LONGBLOB',
  'BOOL' = 'BOOL',
  'BOOLEAN' = 'BOOLEAN',
  'BIT' = 'BIT',
  'TIME' = 'TIME',
  'TIMESTAMP' = 'TIMESTAMP',
  'DATETIME' = 'DATETIME',
  'VARBINARY' = 'VARBINARY',
  'YEAR' = 'YEAR',
  'ENUM' = 'ENUM',
  'GEOMETRYCOLLECTION' = 'GEOMETRYCOLLECTION',
  'LINESTRING' = 'LINESTRING',
  'MULTILINESTRING' = 'MULTILINESTRING',
  'MULTIPOINT' = 'MULTIPOINT',
  'MULTIPOLYGON' = 'MULTIPOLYGON',
  'POINT' = 'POINT',
  'POLYGON' = 'POLYGON',
  'ALL' = 'ALL',
  'DISTINCT' = 'DISTINCT',
  'DISTINCTROW' = 'DISTINCTROW',
  'HIGH_PRIORITY' = 'HIGH_PRIORITY',
  'STRAIGHT_JOIN' = 'STRAIGHT_JOIN',
  'SQL_SMALL_RESULT' = 'SQL_SMALL_RESULT',
  'SQL_BIG_RESULT' = 'SQL_BIG_RESULT',
  'SQL_BUFFER_RESULT' = 'SQL_BUFFER_RESULT',
  'SQL_CACHE' = 'SQL_CACHE',
  'SQL_NO_CACHE' = 'SQL_NO_CACHE',
  'SQL_CALC_FOUND_ROWS' = 'SQL_CALC_FOUND_ROWS',
  'ASC' = 'ASC',
  'DESC' = 'DESC',
  'LIMIT' = 'LIMIT',
  'OFFSET' = 'OFFSET',
  'WITH' = 'WITH',
  /** 对所有group字段求和 */
  'ROLLUP' = 'ROLLUP',
  /** 将结果集写入file是，设置line，fields之后的终止符 */
  'TERMINATED' = 'TERMINATED BY',
  'OPTIONALLY' = 'OPTIONALLY',
  'ENCLOSED' = 'ENCLOSED BY',
  'ESCAPED' = 'ESCAPED BY',
  'STARTING' = 'STARTING BY',
  'ALTER' = 'ALTER',

  /** 特殊字符 */
  'DOT' = '.',
  'LOCAL_ID' = '@',
  'STAR' = '*',
  'EQUAL_SYMBOL' = '=',
  'LR_BRACKET' = '(',
  'RR_BRACKET' = ')',
  'BIT_OR_OP' = '||',
  'SEMI' = ';',
  'BIT_AND_OP' = '&&',
  'COMMA' = ',',
  'LEFT' = 'LEFT',
  'RIGHT' = 'RIGHT',
  'OUTER' = 'OUTER',
  'JOIN' = 'JOIN',
  'TRUE' = 'TRUE',
  'FALSE' = 'FALSE',
  'NOT' = 'NOT',
  'NULL_LITERAL' = 'NULL',
  'NULL_SPEC_LITERAL' = 'N',
  'GREATER_SYMBOL' = '>',
  'LESS_SYMBOL' = '<',
  'EXCLAMATION_SYMBOL' = '!',
  'LESSTHANOREQUALTO' = '<=',
  'GREATERTHANOREQUALTO' = '>=',

  /** 需要识别语义提供提示 */
  'ID' = 'ID',
  /** 编码类型枚举 */
  'CHARSET_NAME_L' = 'CHARSET_NAME_L',
  /** `${CHARSET_NAME}` */
  'CHARSET_REVERSE_QOUTE_STRING' = 'CHARSET_REVERSE_QOUTE_STRING',
  /** _${CHARSET_NAME} */
  'STRING_CHARSET_NAME' = 'STRING_CHARSET_NAME',

  /** snippets */
  'sel' = 'sel',
  'cre' = 'cre',
}

// odps内置函数
export const ODPSFunction = [
  'dateadd',
  'datediff',
  'datepart',
  'datetrunc',
  'from_unixtime',
  'getdate',
  'year',
  'isdate',
  'lastday',
  'to_date',
  'to_char',
  'unix_timestamp',
  'weekday',
  'weekofyear',
  'month',
  'inline',
  'nvl',
  'uniform',
  'udf_normalize',
  'segment',
  'synonym',
  'quarter',
  'day',
  'size',
  'array_contains',
  'sort_array',
  'posexplode',
  'named_struct',
  'dayofmonth',
  'sign',
  'map',
  'map_keys',
  'map_values',
  'array',
  'struct',
  'hour',
  'str_to_map',
  'trans_array',
  'trans_cols',
  'UNIQUE_ID',
  'uuid',
  'minute',
  'greatest',
  'max_pt',
  'ordinal',
  'least',
  'sample',
  'split',
  'second',
  'translate',
  'get_idcard_age',
  'get_idcard_birthday',
  'get_idcard_sex',
  'current_timestamp',
  'lpad',
  'rpad',
  'replace',
  'soundex',
  'substring_index',
  'add_months',
  'URL_DECODE',
  'REVERSE',
  'SPACE',
  'REPEAT',
  'ASCII',
  'concat_ws',
  'last_day',
  'tolower',
  'toupper',
  'to_char',
  'trim',
  'ltrim',
  'rtrim',
  'URL_ENCODE',
  'next_day',
  'regexp_substr',
  'regexp_count',
  'split_part',
  'substr',
  'substring',
  'months_between',
  'PARSE_URL',
  'regexp_extract',
  'regexp_instr',
  'regexp_replace',
  'abs',
  'instr',
  'is_encoding',
  'ip2region',
  'KEYVALUE',
  'length',
  'lengthb',
  'md5',
  'acos',
  'covar_samp',
  'percentile',
  'char_matchcount',
  'chr',
  'concat',
  'GET_JSON_OBJECT',
  'asin',
  'collect_list',
  'COLLECT_SET',
  'variance',
  'var_pop',
  'var_samp',
  'covar_pop',
  'atan',
  'ntile',
  'nth_value',
  'cume_dist',
  'first_value',
  'last_value',
  'wm_concat',
  'ceil',
  'dense_rank',
  'rank',
  'lag',
  'lead',
  'percent_rank',
  'row_number',
  'cluster_sample',
  'conv',
  'bround',
  'count',
  'avg',
  'max',
  'min',
  'median',
  'stddev',
  'stddev_samp',
  'sum',
  'cos',
  'sign',
  'e',
  'pi',
  'factorial',
  'cbrt',
  'shiftleft',
  'shiftright',
  'shiftrightunsigned',
  'cosh',
  'tanh',
  'trunc',
  'log2',
  'log10',
  'bin',
  'hex',
  'unhex',
  'radians',
  'degrees',
  'cot',
  'exp',
  'floor',
  'ln',
  'log',
  'pow',
  'rand',
  'round',
  'sin',
  'sinh',
  'sqrt',
  'tan',
];
export enum DefaultFunc {
  'COUNT' = 'COUNT',
  'CURRENT_DATE' = 'CURRENT_DATE',
  'CURRENT_TIME' = 'CURRENT_TIME',
  'CURRENT_TIMESTAMP' = 'CURRENT_TIMESTAMP',
  'CURRENT_USER' = 'CURRENT_USER',
  'LOCALTIME' = 'LOCALTIME',
  'CONVERT' = 'CONVERT',
  'CAST' = 'CAST',
  'VALUES' = 'VALUES',
  'CHAR' = 'CHAR',
  'CASE' = 'CASE',
  'POSITION' = 'POSITION',
  'TRIM' = 'TRIM',
  'WEIGHT_STRING' = 'WEIGHT_STRING',
  'EXTRACT' = 'EXTRACT',
  'GET_FORMAT' = 'GET_FORMAT',
  'CURDATE' = 'CURDATE',
  'CURTIME' = 'CURTIME',
  'DATE_ADD' = 'DATE_ADD',
  'DATE_SUB' = 'DATE_SUB',
  'SUBSTR' = 'SUBSTR',
  'SUBSTRING' = 'SUBSTRING',
  'SYSDATE' = 'SYSDATE',
  'LOCALTIMESTAMP' = 'LOCALTIMESTAMP',
  'NOW' = 'NOW',
}

export const SnippetMap = {
  TUMBLE: {
    text: 'TUMBLE',
    // 'testing(${1:condition})'
    insertText: 'TUMBLE(${1:<time-attr>}, ${2:<size-interval>})',
  },
  HOP: {
    text: 'HOP',
    insertText: 'HOP(${1:<time-attr>}, ${2:<size-interval>})',
  },
  SESSION: {
    text: 'SESSION',
    insertText: 'SESSION(${1:<time-attr>}, ${2:<size-interval>})',
  },
  WATERMARK: {
    text: 'WATERMARK',
    insertText:
      '` WATERMARK ${1:<watermarkName>} FOR ${2:<rowtime_field>} AS withOffset(${2:<rowtime_field>}, ${3:<offset>}) `',
  },
  MATCH_RECOGNIZE: {
    text: 'MATCH_RECOGNIZE',
    insertText: [
      'SELECT (ALL | DISTINCT) {* | projectItem [, projectItem]* } FROM tableExpression',
      '  [ MATCH_RECOGNIZE (',
      '      [ PARTITION BY {partitionItem [, partitionItem]*} ]',
      '      ORDER BY { orderItem [, orderItem ]* }',
      '      [ MEASURES {measureItem AS col [, measureItem AS col]*} ]',
      '      [ ONE ROW PER MATCH ]',
      '      [ AFTER MATCH SKIP ]',
      '      PATTERN ( patternVariable[quantifier] [patternVariable[quantifier]]*) WITHIN INTERVAL intervalExpression',
      '      DEFINE patternVariable AS patternDefinitionExpression [, patternVariable AS patternDefinitionExpression ]*',
      '    )',
      '  ];',
    ].join('\n'),
  },
  EMIT: {
    text: 'EMIT',
    insertText: [
      '${1:INSERT INTO} tableName',
      ' query',
      ' EMIT strategy [, stragety]*',
      ' strategy ::= {WITH DELAY timeInterval | WITHOUT DELAY}',
      '   [BEFORE WATERMAKER | AFTER WATERMAKER]',
      ' timeInterval ::= "string" timeUnit',
    ].join('\n'),
  },
  IF: {
    text: 'IF',
    insertText: 'IF(BOOLEAN testCondition, T valueTrue, T valueFalseOrNull)',
  },
  COMPUTEDCOLUMN: {
    text: 'COMPUTEDCOLUMN',
    insertText: '`<ColumnName> AS <ColumnExpression>`',
  },
};

export const ODPSSnippetsMap = {
  CREATE: {
    text: 'CREATE_TABLE',
    insertText: [
      'CREATE TABLE IF NOT EXISTS ${1:TABLE }',
      '(',
      "${2: FIELD1 } STRING COMMENT '',",
      "${3: FIELD2 } STRING COMMENT ''",
      ')',
      "COMMENT ${4: 'TABLE COMMENT' }",
      'PARTITIONED BY ${5:(ds STRING)}',
      'LIFECYCLE ${6:7 };',
    ].join('\n'),
  },
  SELECT: {
    text: 'SELECT_CASE',
    insertText: [
      'SELECT',
      'CASE WHEN ${1:CONDITION1} THEN ${2:VAR1} ELSE ${3:VAR2} END AS ${4:FIELD1},',
      'CASE WHEN ${5:CONDITION2} THEN ${6:VAR3} ELSE ${5:VAR4} END AS ${6:FIELD2}',
      'FROM ${7: TABLE1};',
    ].join('\n'),
  },
  SHOW: {
    text: 'SHOW_CREATE',
    insertText: 'SHOW CREATE TABLE ${1:TABLE1};',
  },
  INSERT: [
    {
      text: 'INSERT_OVERWRITE_TABLE',
      insertText: [
        'INSERT OVERWRITE TABLE ${1:TABLE1} PARTITION(${2:CONDITION1})',
        'SELECT *',
        'FROM',
        '${3:TABLE2}',
        'WHERE ${4:TABLE2};',
      ].join('\n'),
    },
    {
      text: 'INSERT_VALUES',
      insertText: [
        'INSERT OVERWRITE TABLE ${1:TABLE1} PARTITION (${2:CONDITION1})',
        'VALUES (${3:CON1_VAL},${4:CON2_VAL}),(${5:CON1_VAL},${6:CON2_VAL})',
      ].join('\n'),
    },
  ],
  DESC: {
    text: 'DESC_TABLE',
    insertText: 'DESC ${1:TABLE1} PARTITION(${2:CONDITION1});',
  },
  DROP: {
    text: 'DROP_TABLE',
    insertText: 'DROP TABLE IF EXISTS ${1:TABLE1};',
  },
  ALTER: [
    {
      text: 'ALTER_TABLE_LIFECYCLE',
      insertText: 'ALTER TABLE ${TABLE1} SET LIFECYCLE ${2:90};',
    },
    {
      text: 'ALTER_TABLE_DROP_PARTITION',
      insertText: 'ALTER TABLE ${1:TABLE1} DROP IF EXISTS PARTITION (${2:CONDITION1});',
    },
  ],
  WITH: {
    text: 'WITH_CTE',
    insertText: [
      'WITH',
      '${1:A} AS (SELECT * FROM ${2:TABLE1} WHERE ${3:CONDITION1}),',
      '${4:B} AS (SELECT * FROM ${5:TABLE2} WHERE ${6:CONDITION2}),',
      '${7:C} AS (SELECT ${8:A.KEY},${9:B.VALUE} FROM ${10:A} JOIN ${11:B} ON ${12:A.KEY=B.KEY})',
    ].join('\n'),
  },
  ADD: {
    text: 'ADD_FUNCTION',
    insertText: 'ADD FUNCTION ${1:FUNCTION1} TO PACKAGE ${2:PACKAGE1};',
  },
};

export enum selectSpec {
  'ALL' = 'ALL',
  'DISTINCT' = 'DISTINCT',
  'DISTINCTROW' = 'DISTINCTROW',
  'HIGH_PRIORITY' = 'HIGH_PRIORITY',
  'STRAIGHT_JOIN' = 'STRAIGHT_JOIN',
  'SQL_SMALL_RESULT' = 'SQL_SMALL_RESULT',
  'SQL_BIG_RESULT' = 'SQL_BIG_RESULT',
  'SQL_BUFFER_RESULT' = 'SQL_BUFFER_RESULT',
  'SQL_CACHE' = 'SQL_CACHE',
  'SQL_NO_CACHE' = 'SQL_NO_CACHE',
  'SQL_CALC_FOUND_ROWS' = 'SQL_CALC_FOUND_ROWS',
}

/** ignore场景，正则提示方案有待支持 */
export enum IgnoreLabel {
  /** ODPSSQL */
  /** '0X' HEX_DIGIT+ */
  'HEXADECIMAL_LITERAL' = 'HEXADECIMAL_LITERAL',
  /** [0-9]+ (K|M|G|T) */
  'FILESIZE_LITERAL' = 'FILESIZE_LITERAL',
  /** [0-9]+ */
  'DECIMAL_LITERAL' = 'DECIMAL_LITERAL',
  /** DQUOTA_STRING | SQUOTA_STRING */
  'STRING_LITERAL' = 'STRING_LITERAL',
  /** N SQUOTA_STRING */
  'START_NATIONAL_STRING_LITERAL' = 'START_NATIONAL_STRING_LITERAL',
  'HintStart' = 'HintStart',
  /** 实数正则 */
  'REAL_LITERAL' = 'REAL_LITERAL',
  /** 二进制字符串'B' '\'' [01]+ '\''; */
  'BIT_STRING' = 'BIT_STRING',
  /** @[A-Za-z0-9._$]+ */
  'LOCAL_ID' = 'LOCAL_ID',
  'ID' = 'ID',
  'COMMON_STRING' = 'COMMON_STRING',
  'DOT_ID' = 'DOT_ID',
  /** 符号 */
  'DOT' = 'DOT',
  'LOGICAL_SYMBOL' = 'LOGICAL_SYMBOL',

  /** HiveSQL */
  'Number' = 'Number',
  'DATE' = 'DATE',
  'BigintLiteral' = 'BigintLiteral',
  'SmallintLiteral' = 'SmallintLiteral',
  'TinyintLiteral' = 'TinyintLiteral',
  'DecimalLiteral' = 'DecimalLiteral',
  'CharSetName' = 'CharSetName',

  /** Shell */
  'DIGIT' = 'DIGIT',
  'LEFT_VALUE' = 'LEFT_VALUE',
  /** 文件目录结构正则('./' | '../' | '/' | [A - Za - z0 - 9$_ -])(.)* */
  'FILEPATH' = 'FILEPATH',
  /** shell变量，以$开头 */
  'VARIABLE' = 'VARIABLE',
}

/** 去除对标点符号的提示，包括，.;()*/
export enum EscapeLabel {
  'DOT' = '.',
  'LR_BRACKET' = '(',
  'RR_BRACKET' = ')',
  'SEMI' = ';',
  'SEMICOLON' = ';',
  'NULL_SPEC_LITERAL' = 'N',
  'COMMA' = ',',
  /** 冷僻关键词，多为hints */
  'REVERSE_QUOTE_ID' = 'REVERSE_QUOTE_ID',
  'LPAREN' = '(',
  'RPAREN' = ')',
  'LSQUARE' = '[',
  'RSQUARE' = ']',
  'LCURLY' = '{',
  'RCURLY' = '}',
  'EQUAL_SYMBOL' = '=',
  'REVERSE_QUOTE_SYMB' = '`',

  /** shell */
  'LINE_FEED' = '\n',
  'RIGHT_BRACKET' = ')',
  'RIGHT_BRACE' = '}',
  'LEFT_BRACKET' = '(',
  'LEFT_BRACE' = '{',
}

export enum Charset {
  'ARMSCII8' = 'ARMSCII8',
  'ASCII' = 'ASCII',
  'BIG5' = 'BIG5',
  'BINARY' = 'BINARY',
  'CP1250' = 'CP1250',
  'CP1251' = 'CP1251',
  'CP1256' = 'CP1256',
  'CP1257' = 'CP1257',
  'CP850' = 'CP850',
  'CP852' = 'CP852',
  'CP866' = 'CP866',
  'CP932' = 'CP932',
  'DEC8' = 'DEC8',
  'EUCJPMS' = 'EUCJPMS',
  'EUCKR' = 'EUCKR',
  'GB2312' = 'GB2312',
  'GBK' = 'GBK',
  'GEOSTD8' = 'GEOSTD8',
  'GREEK' = 'GREEK',
  'HEBREW' = 'HEBREW',
  'HP8' = 'HP8',
  'KEYBCS2' = 'KEYBCS2',
  'KOI8R' = 'KOI8R',
  'KOI8U' = 'KOI8U',
  'LATIN1' = 'LATIN1',
  'LATIN2' = 'LATIN2',
  'LATIN5' = 'LATIN5',
  'LATIN7' = 'LATIN7',
  'MACCE' = 'MACCE',
  'MACROMAN' = 'MACROMAN',
  'SJIS' = 'SJIS',
  'SWE7' = 'SWE7',
  'TIS620' = 'TIS620',
  'UCS2' = 'UCS2',
  'UJIS' = 'UJIS',
  'UTF16' = 'UTF16',
  'UTF16LE' = 'UTF16LE',
  'UTF32' = 'UTF32',
  'UTF8' = 'UTF8',
  'UTF8MB3' = 'UTF8MB3',
  'UTF8MB4' = 'UTF8MB4',
}

export enum Snippet {
  'sel' = 'sel',
  'cre' = 'cre',
}

export const CommonToken = ['SELECT', 'AS'];

export interface Color {
  red: number;
  blue: number;
  green: number;
  alpha: number;
}

export interface ColorInformation {
  range: Range;
  color: Color;
}

export interface ColorPresentation {
  /**
   * The label of this color presentation. It will be shown on the color
   * picker header. By default this is also the text that is inserted when selecting
   * this color presentation.
   */
  label: string;
  /**
   * An [edit](#TextEdit) which is applied to a document when selecting
   * this presentation for the color.  When `falsy` the [label](#ColorPresentation.label)
   * is used.
   */
  textEdit?: monaco.languages.TextEdit;
  /**
   * An optional array of additional [text edits](#TextEdit) that are applied when
   * selecting this color presentation. Edits must not overlap with the main [edit](#ColorPresentation.textEdit) nor with themselves.
   */
  additionalTextEdits?: monaco.languages.TextEdit[];
}

export interface HSLA {
  h: number;
  s: number;
  l: number;
  a: number;
}

export enum SyntaxKind {
  createDefinitions = 'createDefinitions',
  createTable = 'createTable',
  tableSources = 'tableSources',
  tableSourceItem = 'tableSourceItem',
  fromClause = 'fromClause',
  functionArg = 'functionArg',
  whereClause = 'whereClause',
  groupClause = 'groupClause',
  havingClause = 'havingClause',
  tableName = 'tableName',
  fullColumnName = 'fullColumnName',
  tableSource = 'tableSource',
  fromSource = 'fromSource',
  sqlStatements = 'sqlStatements',
  sqlStatement = 'sqlStatement',
  joinPart = 'joinPart',
  uniqueJoinSource = 'uniqueJoinSource',
  partitionInsertDefinitions = 'partitionInsertDefinitions',
  partitionDefinitions = 'partitionDefinitions',
  insertStatement = 'insertStatement',
  selectElements = 'selectElements',
  selectStatement = 'selectStatement',
  dmlStatement = 'dmlStatement',
  dqlStatement = 'dqlStatement',
  ddlStatement = 'ddlStatement',
  functionCall = 'functionCall',
  fullId = 'fullId',
  customFunction = 'customFunction',
  scalarFunction = 'scalarFunction',
  specificFunction = 'specificFunction',
  uid = 'uid',
  expression = 'expression',
  expressionAtom = 'expressionAtom',
  comparisonOperator = 'comparisonOperator',
  expressionRecursionPart = 'expressionRecursionPart',
  /** Shell */
  linuxCommand = 'linuxCommand',
  cliOpt = 'cliOpt',
  cliMode = 'cliMode',
}

export enum CompletionItemKind {
  Method = 0,
  Function = 1,
  Constructor = 2,
  Field = 3,
  Variable = 4,
  Class = 5,
  Struct = 6,
  Interface = 7,
  Module = 8,
  Property = 9,
  Event = 10,
  Operator = 11,
  Unit = 12,
  Value = 13,
  Constant = 14,
  Enum = 15,
  EnumMember = 16,
  Keyword = 17,
  Text = 18,
  Color = 19,
  File = 20,
  Reference = 21,
  Customcolor = 22,
  Folder = 23,
  TypeParameter = 24,
  Snippet = 25,
}

export interface IHotWords {
  visited: number;
  text: string;
}

export interface ILastKeyWord {
  input: string;
  tokens: object[];
  range: {
    line: number;
    startPos: number;
    endPos: number;
  };
}

export enum SQLType {
  DQL = 'DQL', // 查询
  DDL = 'DDL', // 建表
  DML = 'DML', // 插入
  DCL = 'DCL', // 命令
  SET = 'SET', // set语句
}

export enum requestFiledType {
  table = 'table',
  field = 'field',
}

export interface IQuery {
  url: string;
  params?: object;
  /** 接口查询关键词，默认为”keyword“ */
  keyword?: string;
}

export enum IType {
  FUNCTION = 'FUNCTION',
  TABLE = 'TABLE',
  FIELD = 'FIELD',
}

interface SkewData {
  table: string;
  column: string;
  value: string | number;
  minPartition: string | number;
  maxPartition: string | number;
  partitionName: string;
}

export interface completionTypeStruct {
  text: string;
  /** monaco内置类型，区分补全提示菜单icon */
  kind: CompletionItemKind;
}

export enum builtInCompletionType {
  'KEYWORD' = 'KEYWORD',
  'CONSTS' = 'CONSTS',
  'FUNCTION' = 'FUNCTION',
  'TABLE' = 'TABLE',
  'TABLEALIAS' = 'TABLEALIAS',
  'FIELD' = 'FIELD',
  'FIELDALIAS' = 'FIELDALIAS',
  'SNIPPET' = 'SNIPPET',
}

export interface customMarker {
  message: string;
  startRow: number;
  endRow?: number;
  startColumn?: number;
  endColumn?: number;
}

export type CustomEditorInstance = monaco.editor.IStandaloneCodeEditor & {
  cleanCache?: () => void;
};
/** 补充补全参数 */
export interface CompletionProviderOptions {
  /** 编辑器配置 */
  options: OpenConf;
  className?: string;
  /** 编辑器配置 */
  completionTypes?: {
    KEYWORD: completionTypeStruct;
    CONSTS: completionTypeStruct;
    FUNCTION: completionTypeStruct;
    TABLE: completionTypeStruct;
    TABLEALIAS: completionTypeStruct;
    FIELD: completionTypeStruct;
    FIELDALIAS: completionTypeStruct;
    [key: string]: completionTypeStruct;
  };
  /** 是否退化，原子指标，业务限定需要支持sql碎片，无法正常构建AST，退化为基于输入对表名查找 */
  degenerate?: boolean;

  onParser?: (ast: any) => void;
  /** 自定义格式化规则 */
  formatRules?: FormatRule[];
  lowerCaseComplete?: boolean;
  /** SQL编辑器左侧的错误标记 */
  marks?: any[];
  /** SQL编辑器创建成功的回调 */
  // onEditorCreated?: (editor: CustomEditorInstance) => void;
  /** 输入时触发回调 */
  onChange?: (data: {filepath: string, content:string}[]) => void;
  /** 提示表字段时回调 */
  onSuggestFields?: (
    prefix: string,
    options?: { [key: string]: any }
  ) =>
    | Promise<Array<Partial<monaco.languages.CompletionItem>>>
    | Array<Partial<monaco.languages.CompletionItem>>;
  /** 表名回调 */
  onSuggestTables?: (
    prefix: string,
    options?: { [key: string]: any }
  ) =>
    | Promise<Array<Partial<monaco.languages.CompletionItem>>>
    | Array<Partial<monaco.languages.CompletionItem>>;
  /** set参数提示回调 */
  onSuggestSetParams?: (
    prefix: string,
    options?: { [key: string]: any }
  ) =>
    | Promise<Array<Partial<monaco.languages.CompletionItem>>>
    | Array<Partial<monaco.languages.CompletionItem>>;
  /** set参数值提示回调 */
  onSuggestSetValues?: (
    prefix: string,
    options?: { [key: string]: any }
  ) =>
    | Promise<Array<Partial<monaco.languages.CompletionItem>>>
    | Array<Partial<monaco.languages.CompletionItem>>;
  /** 内置提示类型的排序函数，对返回的string进行比较，越小位置越靠前 */
  sorter?: (type: builtInCompletionType) => string;
  /** 智能提示是否降级 */
  intelligentDegrade?: boolean;
  /** 进行校验时触发的回调，返回值markers将作为错误信息数据 */
  onValidation?: (ast: any, diagnostics: customMarker[]) => customMarker[];
  /** 选中提示时触发回调 */
  onSuggestionSelect?: (item: monaco.languages.CompletionItem) => void;
  /** 查询uri接口 */
  onDefinition?: ({
    contents,
    type,
  }: {
    contents: string;
    type: IType;
  }) => Promise<string | undefined>;
  /** 格式化回调 */
  onFormat?: (document: string, data: any) => string;
  /** 补全回调 */
  onComplete?: (items: monaco.languages.CompletionItem) => monaco.languages.CompletionItem[];
  /** 选中提示项时回调 */
  onSelectSuggestionItem?: (event: any) => void;
  onProvideCompletion?: (data: any) => void;
  onWokerLoad?: (data: { language: string; loadTime: number }) => void;
  /** 语法错误快速修复回调函数 */
  onQuickfix?: (markers: monaco.editor.IMarkerData[]) => Promise<AutofixReturnValue[]>;
  // 劫持字段提示, 若传了，则在字段场景下不使用原生提示，用户自主挂载 widget
  customizeFieldSuggest?: (
    show?: boolean,
    tableNames?: string[],
    keywords?: {
      text: string;
      range: monaco.Range;
    },
    syncItemList?: any[],
    isWhereClause?: boolean
  ) => void;
  // 拿到当前 SQL 中表相关数据，转为 Diagnostic 数据
  // mapAuthInfoToDiagnostic?: (authInfo: TableAuthResponse) => Promise<Diagnostic[]>;
  // 用户可以自己根据现有的 item 进行部分字段的修改
  resolveCodeCompletionItem?: (
    completionItem: monaco.languages.CompletionItem
  ) => Promise<monaco.languages.CompletionItem>;
  // 是否开启函数签名提示（目前仅对 ODPS 生效）
  enableSignature?: boolean;
}

export type CustomCompletionProviderOptions = CompletionProviderOptions & {
  udf: any[];
  editorMap: Map<string, CustomEditorInstance>;
};

export const generateCompleteItem = (
  text = '',
  HotWords,
  lowerCase: boolean,
  optional?: { kind: number; [propName: string]: any }
): monaco.languages.CompletionItem => {
  let specMark = 9;

  if (text.toUpperCase() === 'WHEN') {
    specMark = 1;
  } else if (text.toUpperCase() === 'THEN') {
    specMark = 2;
  } else if (text.toUpperCase() === 'END') {
    specMark = 3;
  }

  const sortText = priority(text, optional?.kind, [], specMark);

  const newValues = lowerCase && text ? text.toLowerCase() : text;
  return {
    label: newValues,
    /** 定义一个较低的优先级 */
    sortText,
    kind: optional?.kind,
    ...optional,
    // detail=sortText[0] === '1' ? `历史词-${optional.detail }` =optional.detail
  } as monaco.languages.CompletionItem;
};

export interface FormatRule {
  regex: RegExp;
  value: string;
}

export const builtinFunctions = [
  // Aggregate
  'AVG',
  'DateFormatChangeWithZone',
  'CHECKSUM_AGG',
  'COUNT',
  'COUNT_BIG',
  'GROUPING',
  'GROUPING_ID',
  'MAX',
  'MIN',
  'SUM',
  'STDEV',
  'STDEVP',
  'VAR',
  'VARP',
  // Analytic
  'CUME_DIST',
  'FIRST_VALUE',
  'LAG',
  'LAST_VALUE',
  'LEAD',
  'PERCENTILE_CONT',
  'PERCENTILE_DISC',
  'PERCENT_RANK',
  // Collation
  'COLLATE',
  'COLLATIONPROPERTY',
  'TERTIARY_WEIGHTS',
  // Azure
  'FEDERATION_FILTERING_VALUE',
  // Conversion
  'CAST',
  'CONVERT',
  'PARSE',
  'TRY_CAST',
  'TRY_CONVERT',
  'TRY_PARSE',
  // Cryptographic
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
  // Cursor
  'CURSOR_STATUS',
  // Datatype
  'DATALENGTH',
  'IDENT_CURRENT',
  'IDENT_INCR',
  'IDENT_SEED',
  'IDENTITY',
  'SQL_VARIANT_PROPERTY',
  // Datetime
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
  // Logical
  'CHOOSE',
  'COALESCE',
  'IIF',
  'NULLIF',
  // Mathematical
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
  'SIGN',
  'SIN',
  'SQRT',
  'SQUARE',
  'TAN',
  // Metadata
  'APP_NAME',
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
  'TYPE_ID',
  'TYPE_NAME',
  'TYPEPROPERTY',
  // Ranking
  'DENSE_RANK',
  'NTILE',
  'RANK',
  'ROW_NUMBER',
  // Replication
  'PUBLISHINGSERVERNAME',
  // Rowset
  'OPENDATASOURCE',
  'OPENQUERY',
  'OPENROWSET',
  'OPENXML',
  // Security
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
  'USER_ID',
  'USER_NAME',
  // String
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
  'SOUNDEX',
  'SPACE',
  'STR',
  'STUFF',
  'SUBSTRING',
  'UNICODE',
  'UPPER',
  // System
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
  // TextImage
  'TEXTPTR',
  'TEXTVALID',
  // Trigger
  'COLUMNS_UPDATED',
  'EVENTDATA',
  'TRIGGER_NESTLEVEL',
  'UPDATE',
  // ChangeTracking
  'CHANGETABLE',
  'CHANGE_TRACKING_CONTEXT',
  'CHANGE_TRACKING_CURRENT_VERSION',
  'CHANGE_TRACKING_IS_COLUMN_IN_MASK',
  'CHANGE_TRACKING_MIN_VALID_VERSION',
  // FullTextSearch
  'CONTAINSTABLE',
  'FREETEXTTABLE',
  // SemanticTextSearch
  'SEMANTICKEYPHRASETABLE',
  'SEMANTICSIMILARITYDETAILSTABLE',
  'SEMANTICSIMILARITYTABLE',
  // FileStream
  'FILETABLEROOTPATH',
  'GETFILENAMESPACEPATH',
  'GETPATHLOCATOR',
  'PATHNAME',
  // ServiceBroker
  'GET_TRANSMISSION_STATUS',
];

/**
 *
 * @param text
 * @param completionItemKind
 * @param hotWords
 * @param specMark 特殊关键词，改变权重
 */
export const priority = (
  text,
  completionItemKind,
  hotWords: Array<IHotWords>,
  specMark: number
) => {
  /** 热词以a开头，排位更靠前，设置访问上限1000，访问次数越多，排位越靠前 */
  const target = hotWords.find((item) => item.text === text);
  if (target) {
    return `${completionItemKind < 10 ? `0${completionItemKind}` : completionItemKind}1${
      1000 - target.visited
    }${specMark}`;
  } else {
    return `${
      completionItemKind < 10 ? `0${completionItemKind}` : completionItemKind
    }2000${specMark}`;
  }
};

export const CLIDict = {
  chmodCmd: {
    validOption: ['c', 'f', 'v', 'R'],
    desc: '-c：若该文件权限确实已经更改，才显示其更改动作 \n\n-f：若该文件权限无法被更改也不要显示错误讯息 \n\n-v：显示权限变更的详细资料，\n\n-R：对目前目录下的所有文件与子目录进行相同的权限变更(即以递回的方式逐个变更)',
    modDesc:
      'u 表示该文件的拥有者，g 表示与该文件的拥有者属于同一个群体(group)者，o 表示其他以外的人，a 表示这三者皆是\n\n+ 表示增加权限、- 表示取消权限、= 表示唯一设定权限\n\nr 表示可读取，w 表示可写入，x 表示可执行，X 表示只有当该文件是个子目录或者该文件已经被设定过为可执行',
  },
  chownCmd: {
    validOption: ['c', 'f', 'v', 'R', 'h'],
    desc: '-c：显示更改的部分的信息 \n\n-f：忽略错误信息 \n\n-h :修复符号链接 \n\n-v：显示详细的处理信息 \n\n-R：对目前目录下的所有文件与子目录进行相同的权限变更(即以递回的方式逐个变更)',
  },
  catCmd: {
    validOption: ['A', 'b', 'e', 'E', 'n', 's', 't', 'T', 'u', 'v'],
    desc: `-n 或 --number：由 1 开始对所有输出的行数编号。\n\n-b 或 --number-nonblank：和 -n 相似，只不过对于空白行不编号。\n\n-s 或 --squeeze-blank：当遇到有连续两行以上的空白行，就代换为一行的空白行。\n\n-v 或 --show-nonprinting：使用 ^ 和 M- 符号，除了 LFD 和 TAB 之外。\n\n-E 或 --show-ends : 在每行结束处显示 $。\n\n-T 或 --show-tabs: 将 TAB 字符显示为 ^I。\n\n-A, --show-all：等价于 -vET。\n\n-e：等价于"-vE"选项；\n\n-t：等价于"-vT"选项；`,
  },
  touchCmd: {
    validOption: [],
    desc: '',
  },
};

export interface OpenConf extends monaco.editor.IEditorConstructionOptions {
  /** 是否开启autofix */
  autofix?: boolean;
  /** 编辑器语法 */
  language: supportLanguage | string;
  /** 最大字符数 */
  maxLength?: number;
  /** 主题配置 使用  */ 
  // theme?: 'dark' | 'white';
  /** 是否将性能参数输出至控制台 */
  monitorTime?: boolean;
  /** 是否开启静态检查 */
  /** @deprecated 通过修改onValidation返回值可关闭 */
  diagnostic?: boolean;
  /** 是否禁止日志上报 */
  skipReport?: boolean;
  /** 语法特殊配置 */
  monarchSetting?: Record<string, string[]>;
  /** 使用内置函数 */
  useInnerFunction?: boolean;
  /** 禁用异步补全中的缓存 */
  disableAsyncItemCache?: boolean;
  /** 自定义校验规则 */
  validationRules?: ValidationRules[];
  /** 编辑器默认语法配置使用文件系统初始化 */
  // value?: string;
}

interface baseAsyncItemType {
  /** 返回结果分为简单场景或复合场景，默认为简单场景 */
  completeType?: 'simple' | 'recombination';
  /** 未命中缓存时，返回查询需要的参数 */
  params?: Array<string>;
  /** 用户提供cb场景，决定触发字段提示还是表名提示 */
  type?: CompleteType;
}

interface nocacheAsyncItemType extends baseAsyncItemType {
  /** 是否命中缓存，简单场景下必选，复杂场景下非必选 */
  hitCache?: false;
  /**
   * 简单场景下，命中缓存时，返回缓存结果
   * 复合场景下，为一组简单场景的值
   */
  items?: Array<asyncItemsType>;
}

export interface cacheAsyncItemType extends baseAsyncItemType {
  /** 是否命中缓存，简单场景下必选，复杂场景下非必选 */
  hitCache?: true;
  items?: Array<monaco.languages.CompletionItem & { builtInCompletionType: builtInCompletionType }>;
}

export type asyncItemsType = nocacheAsyncItemType | cacheAsyncItemType;

export interface CompleteProviderReturnType {
  isIncomplete: boolean;
  fixedValue?: monaco.IRange & { text: string };
  visitedTable?: Array<any>;
  syncItems?: Array<
    monaco.languages.CompletionItem & {
      textEdit: monaco.languages.TextEdit;
      builtInCompletionType: builtInCompletionType;
    }
  >;
  asyncItems?: asyncItemsType;

  /** 退化场景，不构建ast，不记录各个节点时间 */
  monitorInfo?: {
    parseTime: number;
    traverseTime: number;
    fetchTime?: number;
  };
  /** 退化场景，不构建ast */
  ast?: object;
  // 当前正在编辑语句的 ast
  currentSqlIndex?: number;
}

/** 请求结果产生完成补全信息 */
export function complementedInsertText(item, completionTypes, autoPrefix = true) {
  const needPrefix = [
    'LOGIC_MODEL_SUMMARY',
    'LOGIC_MODEL_FACT',
    'LOGIC_MODEL_DIM',
    'PHYSICAL_TABLE_ONLINE',
    'SAMPLE_TYPE_ONE',
  ];
  const needBrackets = ['FUNCTION', 'FUNCTION-HADOOP', 'FUNCTION-MAX_COMPUTE'];
  if (needPrefix.includes(item.type) && autoPrefix) {
    return {
      insertText: `${item.parentEntityName ? `${item.parentEntityName}.` : ''}${item.name}`,
      detail: completionTypes[item.type].text,
      kind: completionTypes[item.type].kind,
      documentation: item.nameCn || item.des,
      searchKey: `${item.parentEntityName ? `${item.parentEntityName}.` : ''}${item.name}`,
    };
  }

  if (needBrackets.includes(item.type)) {
    return {
      insertText: `${item.name}($0)`,
      insertTextRules: 4,
      detail: completionTypes[item.type].text,
      kind: completionTypes[item.type].kind,
      documentation: item.nameCn || item.des,
    };
  }
  return {
    insertText: item.name,
    detail: completionTypes[item.type].text,
    kind: completionTypes[item.type].kind,
    documentation: item.nameCn || item.des,
    searchKey: needPrefix.includes(item.type)
      ? `${item.parentEntityName ? `${item.parentEntityName}.` : ''}${item.name}`
      : '',
  };
}

/** 提示类型 */
export enum CompleteType {
  table = 'table',
  field = 'field',
  /** set的参数提示 */
  setParam = 'setParam',
  /** set参数的值提示 */
  setValue = 'setValue',
}

/** validation 返回值类型 */

export interface ValidationReturnType {
  diagnostics: Diagnostic[];
  errors?: any;
  astInfo?: any;
  // 权限校验相关内容
  // authInfo?: TableAuthResponse;
}

/** 额外SQL校验规则 */
export enum ValidationRules {
  // 语法校验
  'DEFAULT' = 'DEFAULT',
  // groupby子规则
  'GROUP_BY' = 'GROUP_BY',
  // select *规则
  'SELECT_STAR' = 'SELECT_STAR',
  // 表权限校验
  'TABLE_AUTH' = 'TABLE_AUTH',
}

/** 老的 export 不去破坏，兼容老版本改动 */
export enum VadalitionRules {
  // 语法校验
  'DEFAULT' = 'DEFAULT',
  // groupby子规则
  'GROUP_BY' = 'GROUP_BY',
  // select *规则
  'SELECT_STAR' = 'SELECT_STAR',
  // 表权限校验
  'TABLE_AUTH' = 'TABLE_AUTH',
}

export interface AutofixReturnValue {
  // autofix标题
  title: string;
  // 替换的文案
  replace?: string;
  // 标记的错误，返回对应列表项即可。用于支持一个错误对应多个autofix方案。不传则以入参的顺序排列。
  error: monaco.editor.IMarkerData;
  // 被替换文案的范围，未传则默认替换当前语法错误的范围
  range?: monaco.Range;
  // 一些修复场景是跳转链接的情况，此时可能没有 replace
  jumpUrl?: string;
}

export interface WorkerAccessor {
  (first: monaco.Uri, ...more: monaco.Uri[]): Promise<any>;
}

export interface SuggestControllerProps extends monaco.editor.IEditorContribution {
  cancelSuggestWidget: () => void;
}
