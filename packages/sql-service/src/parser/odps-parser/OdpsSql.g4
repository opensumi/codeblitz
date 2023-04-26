grammar OdpsSql;

tokens {
	DELIMITER
}

program: statement+ EOF;
// starting rule script : (stmt+=statement)+ EOF;

// add compound statement and change delimiter to ';'
statement:
	explainStatement // SEMICOLON
	//  | compoundStatement
	| execStatement // SEMICOLON
	// | ifStatement | loopStatement
	| setStatement // SEMICOLON
	| setProjectStatement // SEMICOLON
	| funDef = functionDefinition
	| emptyStatement
	| streamSqlJobStatement;

// compound statement defnition compoundStatement: KW_BEGIN statement* KW_END;

emptyStatement: SEMICOLON;

// add assign statement, function definition statement, if statement and loop statement
execStatement:
	queryStatement
	// | insertStatement
	| loadStatement
	| exportStatement
	| importStatement
	| readStatement
	| ddlStatement
	| deleteStatement
	| updateStatement
	| assignStatement
	| authorizationStatement
	| statisticStatement
	| resourceManagement
	| instanceManagement
	| undoStatement
	| mergeStatement
	| redoStatement
	| purgeStatement
	| dropTableVairableStatement
	| msckRepairTableStatement;

cteStatement:
	id = identifier (
		LPAREN cols = columnNameCommentList RPAREN
		| param = functionParameters (
			KW_RETURNS retvar = variableName retType = parameterTypeDeclaration
		)?
	)? KW_AS (
		LPAREN (queryExp = queryExpression | exp = expression) RPAREN
	);

// | cpd=compoundStatement
tableAliasWithCols:
	KW_AS? table = identifier (
		LPAREN col += identifier (COMMA col += identifier)* RPAREN
	)?;

subQuerySource:
	subQuery = subQueryExpression alias = tableAliasWithCols?;

explainStatement:
	KW_EXPLAIN (
		option = explainOption* execStatement
		| KW_REWRITE queryExpression
	);

// if statement
ifStatement:
	KW_IF exp = expression trueStatement = statement (
		KW_ELSE falseStatement = statement
	)?;

// loop statement
loopStatement:
	KW_LOOP rvar = variableName KW_FROM from = expression KW_TO to = expression stmt = statement;

// function definition statement
functionDefinition:
	KW_FUNCTION name = functionIdentifier param = functionParameters (
		KW_RETURNS retvar = variableName retType = parameterTypeDeclaration
	)? KW_AS (
		expr = expression SEMICOLON
		| queryExp = queryExpressionWithCTE SEMICOLON
	);
// funBody=compoundStatement | 
functionParameters:
	LPAREN (
		param += parameterDefinition (
			COMMA param += parameterDefinition
		)*
	)? RPAREN;

parameterDefinition:
	rvar = variableName decl = parameterTypeDeclaration (
		EQUAL init = expression
	)? (KW_COMMENT comment = stringLiteral)?;

typeDeclaration:
	KW_TABLE LPAREN columnsType = columnNameTypeList RPAREN
	| singleType = colType;

parameterTypeDeclaration:
	KW_TABLE LPAREN (
		rvar = varSizeParam
		| columnsType = parameterColumnNameTypeList (
			COMMA rvar = varSizeParam
		)?
	) RPAREN
	| funType = functionTypeDeclaration
	| singleType = anyType;

functionTypeDeclaration:
	KW_FUNCTION LPAREN argType = parameterTypeDeclarationList? RPAREN KW_RETURNS ret =
		parameterTypeDeclaration;

parameterTypeDeclarationList:
	parameterTypeDeclaration (COMMA parameterTypeDeclaration)*;

parameterColumnNameTypeList:
	parameterColumnNameType (COMMA parameterColumnNameType)*;

parameterColumnNameType:
	colName = identifier t = anyType (
		KW_COMMENT comment = stringLiteral
	)?;

varSizeParam: STAR any = anyType;

// assign statement definition
assignStatement:
	rvar = variableName decl = typeDeclaration? (
		ASSIGN (
			cache = KW_CACHE (
				KW_WITH KW_CACHEPROPERTIES cacheprops = tableProperties
			)? KW_ON
		)? (exp = expression | queryExp = queryExpressionWithCTE)
	)?;

preSelectClauses:
	w = whereClause g = groupByClause? h = havingClause? win = window_clause?
	| g = groupByClause h = havingClause? win = window_clause?
	| h = havingClause win = window_clause?
	| win = window_clause;

postSelectClauses:
	o = orderByClause? c = clusterByClause? d = distributeByClause? sort = sortByClause? zorder =
		zorderByClause? l = limitClause?;

selectRest:
	(f = fromClause | lv = lateralView)? pre = preSelectClauses? post = postSelectClauses;

multiInsertFromRest:
	s = selectClause lv = lateralView? pre = preSelectClauses? post = postSelectClauses
	| lv = lateralView? pre = preSelectClauses s = selectClause post = postSelectClauses;

fromRest:
	s = selectClause pre = preSelectClauses? post = postSelectClauses
	| pre = preSelectClauses s = selectClause post = postSelectClauses;

simpleQueryExpression:
	s = selectQueryExpression
	| f = fromQueryExpression;

selectQueryExpression: s = selectClause rest = selectRest;

fromQueryExpression: f = fromClause rest = fromRest;

setOperationFactor:
	s = simpleQueryExpression
	| LPAREN q = queryExpression RPAREN;

queryExpression:
	(
		LPAREN q = queryExpression RPAREN rhs += setRHS
		| s = simpleQueryExpression
	) (rhs += setRHS)*;

queryExpressionWithCTE: (w = withClause)? exp = queryExpression;

setRHS: op = setOperator operand = setOperationFactor;

multiInsertSetOperationFactor:
	f = fromRest
	| LPAREN m = multiInsertSelect RPAREN;

multiInsertSelect:
	(
		LPAREN m = multiInsertSelect RPAREN rhs += multiInsertSetRHS
		| f = multiInsertFromRest
	) (rhs += multiInsertSetRHS)*;

multiInsertSetRHS:
	op = setOperator operand = multiInsertSetOperationFactor;

multiInsertBranch: i = insertClause m = multiInsertSelect;

fromStatement:
	f = fromClause (
		rest = fromRest (rhs += setRHS)*
		| (branch += multiInsertBranch)+
	);

insertStatement:
	i = insertClause (q = queryExpression | v = valuesClause);

selectQueryStatement:
	LPAREN q = queryExpression RPAREN (rhs += setRHS)+
	| s = selectQueryExpression (rhs += setRHS)*;

queryStatement: (withClause)? (
		s = selectQueryStatement
		| f = fromStatement
		| i = insertStatement
	);

subQueryExpression: LPAREN query = queryExpression RPAREN;

limitClause:
	KW_LIMIT offset = mathExpression COMMA exp = mathExpression
	| KW_LIMIT exp = mathExpression (
		KW_OFFSET offset = mathExpression
	)?;

// add Variable to from source
fromSource:
	pt = partitionedTableFunction
	| t = tableSource
	| sq = subQuerySource
	| vt = virtualTableSource
	| tv = tableVariableSource
	| tf = tableFunctionSource
	| LPAREN js = joinSource RPAREN;

tableVariableSource:
	rvar = variableName alias = tableAliasWithCols?;

tableFunctionSource:
	fun = rfunction (KW_AS? alias = identifier)?;

variableName: Variable;

// add Varaiable and native type instialization to atom expressions
atomExpression:
	KW_NULL
	| con = constant // literals
	| castExp = castExpression
	| caseExp = caseExpression
	| whenExp = whenExpression
	| LPAREN exp = expression RPAREN
	| rvar = variableRef // @xxx
	| varFun = variableCall // @xxx
	| fun = rfunction
	| col = tableOrColumnRef // maybe dbname, tablename, colname, funcName, className, package...
	| newExp = newExpression // new xxxclass()
	| exists = existsExpression
	| subQuery = scalarSubQueryExpression;

// 新增的
customVariable: SCRIPT_VARIABLE | SCHEDULER_VARIABLE;

variableRef: variableName;

variableCall: variableName LPAREN expressionList? RPAREN;

funNameRef: db = identifier COLON fn = identifier;

lambdaExpression:
	KW_FUNCTION LPAREN (
		p += lambdaParameter (COMMA p += lambdaParameter)*
	)? RPAREN (
		KW_RETURNS retvar = variableName retType = parameterTypeDeclaration
	)? KW_AS (q = queryExpressionWithCTE | e = expression)
	| (
		p += lambdaParameter
		| LPAREN (
			p += lambdaParameter (COMMA p += lambdaParameter)*
		)? RPAREN
	) LAMBDA_IMPLEMENT e = expression;
// c=compoundStatement | 
lambdaParameter:
	(v = variableName | i = identifier) p = parameterTypeDeclaration?;

tableOrColumnRef: identifier;

tableAndColumnRef: t = identifier DOT c = identifier;

newExpression:
	KW_NEW classNameWithPackage (
		LPAREN args = expressionList? RPAREN
		| (arr += LSQUARE RSQUARE)+ init = LCURLY elem = expressionList? RCURLY
		| (arr += LSQUARE len += expression RSQUARE)+ (
			arr += LSQUARE RSQUARE
		)*
	);

existsExpression: KW_EXISTS query = subQueryExpression;

scalarSubQueryExpression: subQuery = subQueryExpression;

classNameWithPackage:
	(packages += identifier DOT)* className = identifier (
		LESSTHAN types = classNameList GREATERTHAN
	)?;

classNameOrArrayDecl:
	classNameWithPackage (arr += LSQUARE RSQUARE)*;

classNameList:
	cn += classNameOrArrayDecl (COMMA cn += classNameOrArrayDecl)*;

// We have add some keywords. But those keywords are identifyable with Identifier during parsing So
// we can use them as identifier without quote to keep compatible.
odpsqlNonReserved:
	KW_RETURNS
	| KW_BEGIN
	| KW_LOOP
	| KW_NEW
	| KW_REMOVE
	| KW_GRANTS
	| KW_ACL
	| KW_TYPE
	| KW_LIST
	| KW_USERS
	| KW_WHOAMI
	| KW_TRUSTEDPROJECTS
	| KW_TRUSTEDPROJECT
	| KW_SECURITYCONFIGURATION
	| KW_PACKAGE
	| KW_PACKAGES
	| KW_INSTALL
	| KW_UNINSTALL
	| KW_PRIVILEGES
	| KW_PROJECT
	| KW_PROJECTS
	| KW_LABEL
	| KW_ALLOW
	| KW_DISALLOW
	| KW_P
	| KW_JOB
	| KW_JOBS
	| KW_ACCOUNTPROVIDERS
	| KW_RESOURCES
	| KW_FLAGS
	| KW_STATISTIC_LIST
	| KW_STATISTIC
	| KW_COUNT
	| KW_GET
	| KW_PUT
	| KW_POLICY
	| KW_PROJECTPROTECTION
	| KW_EXCEPTION
	| KW_CLEAR
	| KW_EXPIRED
	| KW_EXP
	| KW_ACCOUNTPROVIDER
	| KW_SUPER
	| KW_VOLUMEFILE
	| KW_VOLUMEARCHIVE
	| KW_OFFLINEMODEL
	| KW_PY
	| KW_RESOURCE
	| KW_STATUS
	| KW_KILL
	| KW_HUBLIFECYCLE
	| KW_SHARDS
	| KW_SETPROJECT
	| KW_MERGE
	| KW_SMALLFILES
	| KW_PARTITIONPROPERTIES
	| KW_EXSTORE
	| KW_CHANGELOGS
	| KW_REDO
	| KW_HUBTABLE
	| KW_CHANGEOWNER
	| KW_RECYCLEBIN
	| KW_PRIVILEGEPROPERTIES
	| relaxedKeywords
	| KW_NULL_VALUE
	| KW_DISTINCT_VALUE
	| KW_TABLE_COUNT
	| KW_COLUMN_SUM
	| KW_COLUMN_MAX
	| KW_COLUMN_MIN
	| KW_EXPRESSION_CONDITION
	| KW_GROUPS
	| KW_CACHE
	| ByteLengthLiteral
	| KW_VARIABLES
	| KW_EXCEPT
	| KW_SELECTIVITY
	| KW_LOCALTIMESTAMP
	| KW_EXTRACT
	| KW_SUBSTRING
	| KW_LAST
	| KW_NULLS
	| KW_DEFAULT
	| KW_ANY
	| KW_OFFSET
	| KW_CLONE
	| KW_CONSTRAINT
	| KW_UNIQUEJOIN
	| KW_TABLESAMPLE
	| KW_MACRO
	| KW_FILE
	| KW_DYNAMICFILTER
	| KW_DATABASE
	| KW_UDFPROPERTIES
	| KW_UNBOUNDED
	| KW_PRECEDING
	| KW_FOLLOWING
	| KW_MORE
	| KW_OVER
	| KW_PARTIALSCAN
	| KW_EXCHANGE
	| KW_CONF
	| KW_LIFECYCLE
	| KW_CACHEPROPERTIES
	| KW_TENANT
	| KW_DISTMAPJOIN
	| KW_SPLIT_SIZE
	| KW_CATALOG
	| KW_BLOOMFILTER
	| KW_EVERY
	| KW_AT
	| KW_REFRESH
	| KW_SECURE
	| KW_DIM
	| KW_DIMENSION
	| KW_RESULT
	| KW_STREAM
	| KW_TEMP
	| KW_KEY;

relaxedKeywords:
	KW_INTERVAL
	| KW_CONF
	| KW_EXCHANGE
	| KW_LESS
	| KW_MORE;

allIdentifiers:
	id = Identifier
	| nonReservedId = nonReserved
	| sq11KeywordAsId = sql11ReservedKeywordsUsedAsIdentifier
	| odpsNonReservedId = odpsqlNonReserved
	| reservedId = reserved;

identifier:
	id = Identifier
	| nonReservedId = nonReserved
	| sq11KeywordAsId = sql11ReservedKeywordsUsedAsIdentifier
	| odpsNonReservedId = odpsqlNonReserved
	| scriptVariableId = SCRIPT_VARIABLE; // 新增的

identifierWithoutSql11:
	id = Identifier
	| nonReservedId = nonReserved
	| odpsNonReservedId = odpsqlNonReserved;

alterTableChangeOwner: KW_CHANGEOWNER KW_TO stringLiteral;

alterViewChangeOwner: KW_CHANGEOWNER KW_TO stringLiteral;

alterTableEnableHubTable:
	KW_ENABLE KW_HUBTABLE KW_WITH shardNum = Number KW_SHARDS KW_HUBLIFECYCLE hubLifeCycle = Number;

tableLifecycle: KW_LIFECYCLE lifecycleDays = Number;

setStatement:
	KW_SET KW_PROJECTPROTECTION EQUAL (KW_TRUE | KW_FALSE) (
		KW_WITH KW_EXCEPTION filePath
	)?
	| (KW_SET | unset = KW_UNSET) KW_LABEL (
		cat = identifier
		| min = MINUS? num = label
	) KW_TO (
		p = principalName
		| KW_TABLE t = privilegeObjectName (
			LPAREN cols = columnNameList RPAREN
		)?
	)
	| KW_SET key = anythingButEqualOrSemi veq (
		skewInfo = skewInfoVal
		| val += anythingButSemi*?
	);
veq: EQUAL;

anythingButEqualOrSemi: (~(EQUAL | SEMICOLON | WS))+;

anythingButSemi: ~SEMICOLON;

setProjectStatement:
	KW_SETPROJECT key = anythingButEqualOrSemi EQUAL expression;

label: Number;

skewInfoVal:
	skewSource = tableName COLON LPAREN key += allIdentifiers (
		COMMA key += allIdentifiers
	)* RPAREN LSQUARE LPAREN expressionList RPAREN (
		COMMA? LPAREN expressionList RPAREN
	)* RSQUARE;

memberAccessOperator: DOT field = identifier;

methodAccessOperator:
	DOT (LESSTHAN types = classNameList GREATERTHAN)? field = identifier LPAREN arguments =
		expressionList? RPAREN;

isNullOperator: KW_IS not = KW_NOT? KW_NULL;

inOperator:
	not = KW_NOT? KW_IN (
		exp = expressionsInParenthese
		| subQuery = subQueryExpression
	);

betweenOperator:
	not = KW_NOT? KW_BETWEEN (min = mathExpression) KW_AND (
		max = mathExpression
	);

mathExpression:
	lhs = mathExpression (
		op = BITWISEXOR
		| op = STAR
		| op = DIVIDE
		| op = MOD
		| op = DIV
		| op = PLUS
		| op = MINUS
		| op = CONCATENATE
		| op = AMPERSAND
		| op = BITWISEOR
	) rhs = mathExpression
	| exp = unarySuffixExpression
	| expIn = mathExpressionListInParentheses; //|cast=nativeCast operand=mathExpression

mathExpressionListInParentheses:
	LPAREN mathExpressionList RPAREN;

mathExpressionList: mathExpression (COMMA mathExpression)*;

unarySuffixExpression:
	operand = unarySuffixExpression op = isNullOperator
	| exp = unaryPrefixExpression;

unaryPrefixExpression:
	(op = PLUS | op = MINUS | op = TILDE) operand = unaryPrefixExpression
	| exp = fieldExpression;

fieldExpression:
	operand = fieldExpression (
		member = memberAccessOperator
		| ls = LSQUARE index = expression RSQUARE
		| method = methodAccessOperator
	)
	| exp = atomExpression;

logicalExpression:
	lhs = logicalExpression (op = KW_AND | op = KW_OR) rhs = logicalExpression
	| exp = notExpression;

notExpression:
	op = KW_NOT operand = notExpression
	| exp = equalExpression;

equalExpression:
	lhs = equalExpression (
		not = KW_NOT? (
			op = KW_LIKE
			| op = KW_RLIKE
			| op = KW_REGEXP
		)
		| op = EQUAL
		| op = EQUAL_NS
		| KW_IS not = KW_NOT? op = KW_DISTINCT KW_FROM
		| op = NOTEQUAL
		| op = LESSTHANOREQUALTO
		| op = LESSTHAN
		| op = GREATERTHANOREQUALTO
		| op = GREATERTHAN
	) rhs = equalExpression
	| lhs = equalExpression (
		r_in = inOperator
		| between = betweenOperator
	)
	| exp = mathExpression;

expression: logicalExpression;

statisticStatement:
	addRemoveStatisticStatement
	| showStatisticStatement
	| showStatisticListStatement
	| analyzeStatement
	| countTableStatement;

// we cannot use a uniform way to parse the statement. for example, the statment " add statistic
// tableName statisticName c1 - 1 > c2;" could have two explaination: 1. when statisticName ==
// 'COLUMN_SUM', it means "select sum(c1) from tableName where -1 > c2;" 2. when statisticName ==
// 'EXPRESSION_CONDITION', it means select count(*) from tableName where c1-1 > c2;
addRemoveStatisticStatement:
	(KW_ADD | KW_REMOVE) KW_STATISTIC tab = tableName info = statisticInfo;

statisticInfo:
	sName = KW_NULL_VALUE identifier
	| sName = KW_DISTINCT_VALUE identifier (COMMA identifier)*
	| sName = KW_TABLE_COUNT
	| sName = KW_COLUMN_SUM identifier expression?
	| sName = KW_COLUMN_MAX identifier expression?
	| sName = KW_COLUMN_MIN identifier expression?
	| sName = KW_EXPRESSION_CONDITION expression?;

showStatisticStatement:
	KW_SHOW KW_STATISTIC tableName partitionSpec? (
		KW_COLUMNS (LPAREN columnNameList RPAREN)?
	)?;

showStatisticListStatement:
	KW_SHOW KW_STATISTIC_LIST tableName?;

countTableStatement: KW_COUNT tableName partitionSpec?;

statisticName: identifier;

/////////////////////////////
// Instance management statements ////////////////////////////

instanceManagement: instanceStatus | killInstance;

instanceStatus: KW_STATUS instanceId;

killInstance: KW_KILL instanceId;

instanceId: Identifier;

/////////////////////////////
// Resource Management statements ////////////////////////////

resourceManagement:
	addResource
	| dropResource
	| getResource
	| dropOfflineModel;

addResource:
	KW_ADD (KW_FILE | KW_ARCHIVE | KW_VOLUMEFILE) filePath (
		KW_AS identifier
	)? (KW_COMMENT stringLiteral)? roptions?
	| KW_ADD KW_TABLE tableName partitionSpec? (KW_AS identifier)? (
		KW_COMMENT stringLiteral
	)? roptions?
	| KW_ADD (KW_PY | KW_JAR) filePath (KW_COMMENT stringLiteral)? roptions?;

dropResource: KW_DROP KW_RESOURCE resourceId;

resourceId: identifier (DOT identifier)*;

dropOfflineModel: KW_DROP KW_OFFLINEMODEL ifExists? identifier;

getResource:
	KW_GET KW_RESOURCE (identifier COLON)? resourceId filePath;

roptions: MINUS identifier;

/////////////////////////////
// Authorization statements ////////////////////////////

authorizationStatement:
	// not supported hive grammar: odps do not have current role
	setRole
	| showCurrentRole

	// odps only
	| addUserStatement
	| removeUserStatement
	| addGroupStatement
	| removeGroupStatement
	| addAccountProvider
	| removeAccountProvider
	| listUsers
	| listGroups
	| whoami
	| showAcl
	//  | describeRole    // merge with describe statemenet
	| listRoles
	| listTrustedProjects
	| addTrustedProject
	| removeTrustedProject
	| showSecurityConfiguration
	| showPackages
	| showItems
	//  | describePackage // move to describe statement
	| installPackage
	| uninstallPackage
	| createPackage
	| deletePackage
	| addToPackage
	| removeFromPackage
	| allowPackage
	| disallowPackage
	| putPolicy
	| getPolicy
	| clearExpiredGrants
	| grantLabel
	| revokeLabel
	| showLabel
	| grantSuperPrivilege
	| revokeSuperPrivilege

	// Odps privilege commands
	| createRoleStatement
	| dropRoleStatement
	| grantRole
	| revokeRole
	| grantPrivileges
	| revokePrivileges
	| showGrants // odps: show grants
	| showRoleGrants // odps show grants
	| showRoles // odps: list roles
	| showRolePrincipals; // odps: describe role

listUsers: KW_LIST KW_USERS;

listGroups: KW_LIST KW_GROUPS (KW_FOR KW_USER user)?;

addUserStatement:
	KW_ADD KW_USER name = user comment = userRoleComments?;

addGroupStatement:
	KW_ADD KW_GROUP name = principalIdentifier comment = userRoleComments?;

removeUserStatement: KW_REMOVE KW_USER user;

removeGroupStatement: KW_REMOVE KW_GROUP principalIdentifier;

addAccountProvider: KW_ADD KW_ACCOUNTPROVIDER accountProvider;

removeAccountProvider:
	KW_REMOVE KW_ACCOUNTPROVIDER accountProvider;

showAcl:
	KW_SHOW KW_ACL KW_FOR privilegeObjectName (
		KW_ON KW_TYPE privilegeObjectType
	)?;

listRoles: KW_LIST KW_ROLES;

whoami: KW_WHOAMI;

listTrustedProjects: KW_LIST KW_TRUSTEDPROJECTS;

addTrustedProject: KW_ADD KW_TRUSTEDPROJECT projectName;

removeTrustedProject: KW_REMOVE KW_TRUSTEDPROJECT projectName;

showSecurityConfiguration: KW_SHOW KW_SECURITYCONFIGURATION;

showPackages:
	KW_SHOW KW_PACKAGES (KW_WITH privilegeObject)? privilegeProperties?;

showItems:
	KW_SHOW KW_PACKAGE (
		pkg = packageName
		| KW_ITEMS (KW_FROM prj = projectName)? (
			KW_ON KW_TYPE tp = privilegeObjectType
		)?
	) privilegeProperties?;

installPackage:
	KW_INSTALL KW_PACKAGE pkg = packageNameWithProject privilegeProperties?;

uninstallPackage:
	KW_UNINSTALL KW_PACKAGE pkg = packageNameWithProject privilegeProperties?;

createPackage: KW_CREATE KW_PACKAGE packageName;

deletePackage: (KW_DELETE | KW_DROP) KW_PACKAGE packageName;

addToPackage:
	KW_ADD privilegeObject KW_TO KW_PACKAGE packageName (
		KW_WITH KW_PRIVILEGES privilege (COMMA privilege)*
	)? props = privilegeProperties?;

removeFromPackage:
	KW_REMOVE privilegeObject KW_FROM KW_PACKAGE packageName;

allowPackage:
	KW_ALLOW KW_PROJECT (pj = projectName | st = STAR) KW_TO KW_INSTALL KW_PACKAGE packageName (
		KW_WITH privilege (COMMA privilege)*
	)? (KW_USING KW_LABEL label)? (KW_EXP Number)?;

disallowPackage:
	KW_DISALLOW KW_PROJECT (pj = projectName | st = STAR) KW_TO KW_INSTALL KW_PACKAGE packageName;

putPolicy: KW_PUT KW_POLICY filePath (KW_ON KW_ROLE roleName)?;

getPolicy: KW_GET KW_POLICY (KW_ON KW_ROLE roleName)?;

clearExpiredGrants: KW_CLEAR KW_EXPIRED KW_GRANTS;

grantLabel:
	KW_GRANT KW_LABEL label KW_ON KW_TABLE tabName = privilegeObjectName (
		LPAREN columnNameList RPAREN
	)? KW_TO (
		p = principalName KW_WITH KW_EXP Number
		| p = principalName
	) props = privilegeProperties?;

revokeLabel:
	KW_REVOKE KW_LABEL KW_ON KW_TABLE tabName = privilegeObjectName (
		LPAREN columnNameList RPAREN
	)? KW_FROM p = principalName props = privilegeProperties?;

showLabel:
	KW_SHOW KW_LABEL label? KW_GRANTS (
		KW_ON KW_TABLE tabName = privilegeObjectName (
			KW_FOR p = principalName
		)?
		| KW_FOR p = principalName
		| forTable = KW_FOR KW_TABLE tabName = privilegeObjectName
	)? props = privilegeProperties?;

grantSuperPrivilege:
	KW_GRANT KW_SUPER privilege (COMMA privilege)* KW_TO (
		KW_USER user
		| KW_GROUP principalIdentifier
	);

revokeSuperPrivilege:
	KW_REVOKE KW_SUPER privilege (COMMA privilege)* KW_FROM (
		KW_USER user
		| KW_GROUP principalIdentifier
	);

createRoleStatement:
	KW_CREATE KW_ROLE role = roleName comment = userRoleComments? props = privilegeProperties?;

dropRoleStatement: (KW_DELETE | KW_DROP) KW_ROLE roleName;

grantRole:
	KW_GRANT KW_ROLE? roleName (COMMA roleName)* KW_TO principalSpecification withAdminOption?;

revokeRole:
	KW_REVOKE adminOptionFor? KW_ROLE? roleName (COMMA roleName)* KW_FROM principalSpecification;

grantPrivileges:
	KW_GRANT privilege (COMMA privilege)* KW_ON privilegeObject KW_TO principalSpecification
		withGrantOption? privilegeProperties?;

privilegeProperties:
	KW_PRIVILEGEPROPERTIES LPAREN keyValueProperty (
		COMMA keyValueProperty
	)* RPAREN;

privilegePropertieKeys:
	KW_PRIVILEGEPROPERTIES LPAREN keyPrivProperty (
		COMMA keyPrivProperty
	)* RPAREN;

revokePrivileges:
	KW_REVOKE grantOptionFor? privilege (COMMA privilege)* KW_ON privilegeObject KW_FROM
		principalSpecification privilegeProperties?;

showGrants:
	KW_SHOW (KW_GRANT | KW_GRANTS) KW_FOR? principalName? (
		KW_ON KW_TYPE privilegeObjectType
		| KW_ON privilegeObject
	)? privilegeProperties?;

showRoleGrants: KW_SHOW KW_ROLE KW_GRANT principalName;

showRoles: KW_SHOW KW_ROLES;

showRolePrincipals: KW_SHOW KW_PRINCIPALS roleName;

user:
	(allIdentifiers DOLLAR)? // account provider
	(allIdentifiers | Number) (
		(DOT | MINUS | UNDERLINE) (allIdentifiers | Number)
	)* // main body
	(
		(Variable | AT (allIdentifiers | Number)) (
			(DOT | MINUS | UNDERLINE) (allIdentifiers | Number)
		)*
	)? (COLON (identifier | Number | DOT | MINUS | AT)+)?;

userRoleComments: (KW_COMMENT | roptions) stringLiteral;

accountProvider: identifier;

projectName: identifier;

privilegeObjectName:
	STAR? identifier (
		(Number | DOT | MINUS | AT | SHARP | DOLLAR | STAR)+ identifier
	)* STAR?
	| STAR;

privilegeObjectType: identifier | KW_FUNCTION | KW_DATABASE;

roleName: identifier;

packageName: identifier;

packageNameWithProject:
	(proj = identifier DOT)? name = identifier;

principalSpecification: principalName (COMMA principalName)*;

principalName:
	KW_USER? (principalIdentifier | user)
	| KW_GROUP principalIdentifier
	| KW_ROLE identifier;

principalIdentifier: id = identifier;

privilege: privilegeType (LPAREN cols = columnNameList RPAREN)?;

privilegeType: identifier | KW_SELECT;

// database or table type. Type is optional, default type is table
privilegeObject:
	KW_TABLE? tableName (LPAREN cols = columnNameList RPAREN)? parts = partitionSpec?
	| privilegeObjectType privilegeObjectName;

filePath:
	stringLiteral
	| DIVIDE? identifier (
		(COLON | DIVIDE | ESCAPE | DOT | MINUS)+ identifier
	)*;

policyCondition:
	lhs = policyCondition and = KW_AND rhs = policyConditionOp
	| rhs = policyConditionOp;

policyConditionOp:
	key = policyKey (
		eq = EQUAL
		| ne = NOTEQUAL
		| not = KW_NOT? like = KW_LIKE
		| lt = LESSTHAN
		| le = LESSTHANOREQUALTO
		| gt = GREATERTHAN
		| ge = GREATERTHANOREQUALTO
		| not = KW_NOT? rin = KW_IN
	) (
		val += policyValue
		| LPAREN val += policyValue (COMMA val += policyValue)* RPAREN
	)
	| op = identifier LPAREN key = policyKey (
		COMMA val += policyValue
	)+ RPAREN;

policyKey:
	lower = identifier LPAREN (prefix = identifier COLON)? key = identifier RPAREN
	| (prefix = identifier COLON)? key = identifier;

policyValue: str = stringLiteral | neg = MINUS? num = Number;

/*********** not supported by odps *********/

showCurrentRole: KW_SHOW KW_CURRENT KW_ROLES;

setRole: KW_SET KW_ROLE (KW_ALL | identifier);

adminOptionFor: KW_ADMIN KW_OPTION KW_FOR;

withAdminOption: KW_WITH KW_ADMIN KW_OPTION;

withGrantOption: KW_WITH KW_GRANT KW_OPTION;

grantOptionFor: KW_GRANT KW_OPTION KW_FOR;

/******* end not supported *********/

///////////////////////////////////
// end authorization statements /////////////////////////////////

///////////////////////////////////
// stream sql statements /////////////////////////////////

streamSqlJobStatement:
	KW_CREATE KW_STREAMJOB jobName KW_AS statements += streamBodyStatement+ KW_END KW_STREAMJOB
		SEMICOLON;

jobName: identifier;

streamBodyStatement:
	createStreamTableStatement SEMICOLON
	| streamSqlStatement SEMICOLON;

createStreamTableStatement:
	KW_CREATE (KW_DIM | KW_DIMENSION | KW_STREAM) KW_TABLE tableName LPAREN columnNameTypeList
		RPAREN KW_LOCATION stringLiteral
	| KW_CREATE KW_RESULT KW_TABLE tableName LPAREN columnNameTypeList (
		COMMA KW_PRIMARY KW_KEY LPAREN columnNameList RPAREN
	)? RPAREN KW_LOCATION stringLiteral
	| KW_CREATE KW_TEMP KW_TABLE tableName LPAREN columnNameTypeList RPAREN;

streamSqlStatement: insertStatement | replaceStatement;

replaceStatement:
	KW_REPLACE KW_INTO KW_TABLE? tableName partitionSpec? queryExpression;

explainOption:
	KW_EXTENDED
	| KW_FORMATTED
	| KW_DEPENDENCY
	| KW_LOGICAL
	| KW_AUTHORIZATION;

loadStatement:
	KW_LOAD KW_DATA (islocal = KW_LOCAL)? KW_INPATH (
		path = stringLiteral
	) (isoverwrite = KW_OVERWRITE)? KW_INTO KW_TABLE (
		tab = tableOrPartition
	)
	| KW_LOAD (KW_INTO | KW_OVERWRITE) KW_TABLE (
		tab = tableOrPartition
	) KW_FROM dd = dataFormatDesc;

replicationClause:
	KW_FOR (isMetadataOnly = KW_METADATA)? KW_REPLICATION LPAREN (
		replId = StringLiteral
	) RPAREN;

exportStatement:
	KW_EXPORT KW_TABLE (tab = tableOrPartition) (
		to = KW_TO (path = StringLiteral) replicationClause?
	)?;

importStatement:
	KW_IMPORT (
		(ext = KW_EXTERNAL)? KW_TABLE (tab = tableOrPartition)
	)? KW_FROM (path = StringLiteral) tableLocation?;

readStatement:
	KW_READ tableName (LPAREN columnNameList RPAREN)? partitionSpec? Number?;

undoStatement:
	KW_UNDO KW_TABLE tableName partitionSpec? KW_TO Number;

redoStatement:
	KW_REDO KW_TABLE tableName partitionSpec? KW_TO Number;

purgeStatement:
	KW_PURGE KW_TABLE t = tableName
	| KW_PURGE KW_ALL
	| KW_PURGE KW_TEMPORARY KW_OUTPUT KW_ALL
	| KW_PURGE KW_TEMPORARY KW_OUTPUT i = instanceId;

dropTableVairableStatement:
	KW_DROP KW_TABLE KW_VARIABLES variableName;

msckRepairTableStatement:
	KW_MSCK KW_REPAIR? KW_TABLE tableName (
		(KW_ADD | KW_DROP) KW_PARTITIONS
	)?;

ddlStatement:
	createDatabaseStatement
	| createMaterializedViewStatement
	| switchDatabaseStatement
	| dropDatabaseStatement
	| createTableStatement
	| dropTableStatement
	| truncateTableStatement
	| alterStatement
	| descStatement
	| showStatement
	| listStatement
	| createViewStatement
	| dropViewStatement
	| createFunctionStatement
	| createSqlFunctionStatement
	| cloneTableStatement
	| createMacroStatement
	| createIndexStatement
	| dropIndexStatement
	| dropFunctionStatement
	| reloadFunctionStatement
	| dropMacroStatement
	| lockStatement
	| unlockStatement
	| lockDatabase
	| unlockDatabase
	| tableHistoryStatement
	| setExstore;

createMaterializedViewStatement:
	KW_CREATE KW_SECURE? KW_MATERIALIZED KW_VIEW (ifNotExists)? name = tableName lifecycle =
		tableLifecycle? (
		(LPAREN columnNameCommentList RPAREN)?
		| param = functionParameters (
			KW_RETURNS retvar = variableName retType = typeDeclaration
		)?
	) rewriteDisabled? comment = tableComment? partitionCols = viewPartition? buckets = tableBuckets
		? schedule = scheduleSpec? prop = tablePropertiesPrefixed? KW_AS (
		funBody = compoundStatement
		| query = queryExpressionWithCTE
	);

compoundStatement: KW_BEGIN statement* KW_END;

scheduleSpec:
	KW_REFRESH KW_EVERY value = Number? qualifier = intervalQualifiersUnit (
		(KW_AT | KW_OFFSET KW_BY) offsetTs = simpleStringLiteral
	)?;

simpleStringLiteral: StringLiteral;

partitionSpecOrPartitionId:
	partitionSpec
	| KW_PARTITION LPAREN tablePropertiesList RPAREN;

tableOrTableId:
	KW_TABLE table = tableName (
		LPAREN tablePropertiesList RPAREN
	)?;

tableHistoryStatement:
	KW_RESTORE tableOrTableId part += partitionSpecOrPartitionId* KW_TO KW_VERSION v = stringLiteral
		(
		KW_AS as = tableName
	)?
	| KW_SHOW KW_HISTORY KW_FOR tableOrTableId part += partitionSpecOrPartitionId*
	| KW_SHOW KW_HISTORY KW_FOR KW_TABLES;

setExstore: KW_EXSTORE tableName partitionSpec;

ifExists: KW_IF KW_EXISTS;

restrictOrCascade: KW_RESTRICT | KW_CASCADE;

ifNotExists: KW_IF KW_NOT KW_EXISTS;

storedAsDirs: KW_STORED KW_AS KW_DIRECTORIES;

orReplace: KW_OR KW_REPLACE;

ignoreProtection: KW_IGNORE KW_PROTECTION;

createDatabaseStatement:
	KW_CREATE (KW_DATABASE | KW_SCHEMA) ifNotExists? name = identifier databaseComment? dbLocation?
		(
		KW_WITH KW_DBPROPERTIES dbprops = dbProperties
	)?;

dbLocation: KW_LOCATION locn = StringLiteral;

dbProperties: LPAREN dbPropertiesList RPAREN;

dbPropertiesList: keyValueProperty (COMMA keyValueProperty)*;

switchDatabaseStatement: KW_USE identifier;

dropDatabaseStatement:
	KW_DROP (KW_DATABASE | KW_SCHEMA) ifExists? identifier restrictOrCascade?;

databaseComment: KW_COMMENT comment = stringLiteral;

dataFormatDesc:
	rf = tableRowFormat? ff = tableFileFormat? loc = tableLocation? res = externalTableResource?
	| loc = tableLocation? rf = tableRowFormat? ff = tableFileFormat? res = externalTableResource?;

createTableStatement:
	KW_CREATE (temp = KW_TEMPORARY)? (ext = KW_EXTERNAL)? KW_TABLE ine = ifNotExists? name =
		tableName (
		like = KW_LIKE likeName = tableName dd = dataFormatDesc prop = tablePropertiesPrefixed?
			lifecycle = tableLifecycle?
		| (
			LPAREN columns = columnNameTypeConstraintList (
				COMMA outOfLineConstraints
			)? RPAREN
		)? comment = tableComment? partitions = tablePartition? buckets = tableBuckets? skewed =
			tableSkewed? dd = dataFormatDesc prop = tablePropertiesPrefixed? lifecycle =
			tableLifecycle? (KW_INTO shards = Number KW_SHARDS)? (
			KW_HUBLIFECYCLE hubLifeCycle = Number
		)? (KW_CHANGELOGS changeLogs = Number)? (
			KW_AS dataSource = queryExpressionWithCTE
		)?
	);

truncateTableStatement:
	KW_TRUNCATE KW_TABLE tablePartitionPrefix (
		KW_COLUMNS LPAREN columnNameList RPAREN
	)?;

createIndexStatement:
	KW_CREATE KW_INDEX indexName = identifier KW_ON KW_TABLE tab = tableName LPAREN indexedCols =
		columnNameList RPAREN KW_AS typeName = StringLiteral autoRebuild? indexPropertiesPrefixed?
		indexTblName? tableRowFormat? tableFileFormat? tableLocation? tablePropertiesPrefixed?
		indexComment?;

indexComment: KW_COMMENT comment = stringLiteral;

autoRebuild: KW_WITH KW_DEFERRED KW_REBUILD;

indexTblName: KW_IN KW_TABLE indexTbl = tableName;

indexPropertiesPrefixed: KW_IDXPROPERTIES indexProperties;

indexProperties: LPAREN indexPropertiesList RPAREN;

indexPropertiesList: keyValueProperty (COMMA keyValueProperty)*;

dropIndexStatement:
	KW_DROP KW_INDEX ifExists? indexName = identifier KW_ON tab = tableName;

dropTableStatement:
	KW_DROP KW_TABLE ifExists? tableName KW_PURGE? replicationClause?;

alterStatement:
	KW_ALTER KW_TABLE tableName tableSuffix = alterTableStatementSuffix
	| KW_ALTER KW_VIEW tableName KW_AS? viewSuffix = alterViewStatementSuffix
	| KW_ALTER KW_INDEX idxSuffix = alterIndexStatementSuffix
	| KW_ALTER (KW_DATABASE | KW_SCHEMA) dbSuffix = alterDatabaseStatementSuffix
	| KW_ALTER (u = KW_USER | KW_ROLE) uname = user (
		KW_SET p = privilegeProperties
		| KW_UNSET k = privilegePropertieKeys
	)
	| KW_ALTER KW_MATERIALIZED KW_VIEW tableName materializedViewSuffix =
		alterMaterializedViewStatementSuffix;
// 新增
alterMaterializedViewStatementSuffix:
	alterMaterializedViewSuffixRewrite
	| alterMaterializedViewSuffixRebuild;

alterMaterializedViewSuffixRebuild:
	KW_REBUILD partitionSpecExpression?;

partitionSpecExpression:
	KW_PARTITION LPAREN expr += expression (
		COMMA expr += expression
	)* RPAREN;

alterMaterializedViewSuffixRewrite: (
		rewriteEnabled
		| rewriteDisabled
	);

rewriteEnabled: KW_ENABLE KW_REWRITE;

rewriteDisabled: KW_DISABLE KW_REWRITE;

alterTableStatementSuffix:
	rename = alterStatementSuffixRename[true]
	| dropPartition = alterStatementSuffixDropPartitions[true]
	| addPartition = alterStatementSuffixAddPartitions[true]
	| alterStatementSuffixTouch
	| alterStatementSuffixArchive
	| alterStatementSuffixUnArchive
	| alterStatementSuffixProperties
	| alterStatementSuffixSkewedby
	| alterStatementSuffixExchangePartition
	| alterStatementPartitionKeyType
	| partition = partitionSpec? tblPartition = alterTblPartitionStatementSuffix
	| alterTableChangeOwner
	| alterTableEnableHubTable
	| alterTableMergePartitionSuffix
	| alterStatementSuffixAddConstraint;

alterTableMergePartitionSuffix:
	KW_MERGE (c = KW_IF KW_EXISTS)? src += partitionSpec (
		COMMA src += partitionSpec
	)* KW_OVERWRITE dest = partitionSpec p = KW_PURGE?;

alterStatementSuffixAddConstraint:
	KW_DROP (KW_CONSTRAINT n = identifier | KW_PRIMARY KW_KEY?)
	| KW_ADD oolc = outOfLineConstraints
	| KW_RENAME KW_CONSTRAINT n = identifier KW_TO nn = identifier;

alterTblPartitionStatementSuffix:
	alterStatementSuffixFileFormat
	| alterStatementSuffixLocation
	| alterStatementSuffixProtectMode
	| alterStatementSuffixMergeFiles
	| alterStatementSuffixSerdeProperties
	| alterStatementSuffixRenamePart
	| alterStatementSuffixBucketNum
	| alterTblPartitionStatementSuffixSkewedLocation
	| alterStatementSuffixClusterbySortby
	| alterStatementSuffixCompact
	| alterStatementSuffixUpdateStatsCol
	| renameCol = alterStatementSuffixRenameCol
	| addCol = alterStatementSuffixAddCol
	| alterStatementSuffixDropCol
	| properties = alterTblPartitionStatementSuffixProperties
	| alterStatementSuffixPartitionLifecycle;

alterStatementSuffixPartitionLifecycle:
	(KW_ENABLE | KW_DISABLE) KW_LIFECYCLE;

alterTblPartitionStatementSuffixProperties:
	KW_SET KW_PARTITIONPROPERTIES tableProperties;

alterStatementPartitionKeyType:
	KW_PARTITION KW_COLUMN LPAREN columnNameType RPAREN;

alterViewStatementSuffix:
	alterViewSuffixProperties
	| alterStatementSuffixRename[false]
	| alterStatementSuffixAddPartitions[false]
	| alterStatementSuffixDropPartitions[false]
	| alterViewChangeOwner
	| query = queryExpressionWithCTE
	| alterViewColumnCommentSuffix;

alterIndexStatementSuffix:
	indexName = identifier KW_ON tableName partitionSpec? (
		KW_REBUILD
		| KW_SET KW_IDXPROPERTIES indexProperties
	);

alterDatabaseStatementSuffix:
	alterDatabaseSuffixProperties
	| alterDatabaseSuffixSetOwner;

alterDatabaseSuffixProperties:
	name = identifier KW_SET KW_DBPROPERTIES dbProperties;

alterDatabaseSuffixSetOwner:
	dbName = identifier KW_SET KW_OWNER principalName;

alterStatementSuffixRename[boolean table]:
	KW_RENAME KW_TO identifier;

alterStatementSuffixAddCol: (add = KW_ADD | replace = KW_REPLACE) KW_COLUMNS LPAREN cols =
		columnNameTypeList RPAREN restrictOrCascade?;

alterStatementSuffixRenameCol:
	KW_CHANGE KW_COLUMN? oldName = multipartIdentifier (
		KW_RENAME KW_TO newName = identifier
		| KW_COMMENT comment = stringLiteral
		| n += constraints+
		| newName = identifier colType n += constraints* (
			KW_COMMENT comment = stringLiteral
		)? alterStatementChangeColPosition? restrictOrCascade?
	);

alterStatementSuffixDropCol:
	KW_DROP (KW_COLUMNS | KW_COLUMN) (
		part += multipartIdentifier (
			COMMA part += multipartIdentifier
		)*
		| LPAREN part += multipartIdentifier (
			COMMA part += multipartIdentifier
		)* RPAREN
	);

multipartIdentifier:
	parts += identifier ('.' parts += identifier)*;

alterStatementSuffixUpdateStatsCol:
	KW_UPDATE KW_STATISTICS KW_FOR KW_COLUMN? colName = identifier KW_SET tableProperties (
		KW_COMMENT comment = StringLiteral
	)?;

alterStatementChangeColPosition:
	first = KW_FIRST
	| KW_AFTER afterCol = identifier;

alterStatementSuffixAddPartitions[boolean table]:
	KW_ADD ifNotExists? elem += alterStatementSuffixAddPartitionsElement+;

alterStatementSuffixAddPartitionsElement:
	spec = partitionSpec location = partitionLocation?;

alterStatementSuffixTouch: KW_TOUCH (partitionSpec)*;

alterStatementSuffixArchive: KW_ARCHIVE (partitionSpec)*;

alterStatementSuffixUnArchive: KW_UNARCHIVE (partitionSpec)*;

partitionLocation: KW_LOCATION locn = stringLiteral;

alterStatementSuffixDropPartitions[boolean table]:
	KW_DROP ifExists? elem += dropPartitionSpec (
		COMMA elem += dropPartitionSpec
	)* ignore = ignoreProtection? purge = KW_PURGE? replication = replicationClause?;

alterStatementSuffixProperties:
	KW_SET KW_TBLPROPERTIES tableProperties
	| KW_UNSET KW_TBLPROPERTIES ifExists? tableProperties
	| KW_SET tableLifecycle
	| KW_SET tableComment
	| KW_SET KW_CHANGELOGS Number
	| KW_SET KW_HUBLIFECYCLE Number;

alterViewSuffixProperties:
	KW_SET KW_TBLPROPERTIES prop = tableProperties
	| KW_UNSET KW_TBLPROPERTIES ifExists? tableProperties;

alterViewColumnCommentSuffix:
	KW_CHANGE KW_COLUMN col = identifier KW_COMMENT cmt = stringLiteral;

alterStatementSuffixSerdeProperties:
	KW_SET KW_SERDE serdeName = StringLiteral (
		KW_WITH KW_SERDEPROPERTIES tableProperties
	)?
	| KW_SET KW_SERDEPROPERTIES tableProperties;

tablePartitionPrefix: tableName partitionSpec?;

alterStatementSuffixFileFormat: KW_SET KW_FILEFORMAT fileFormat;

alterStatementSuffixClusterbySortby:
	notClustered = KW_NOT KW_CLUSTERED
	| notSorted = KW_NOT KW_SORTED
	| shards = tableShards
	| buckets = tableBuckets;

alterTblPartitionStatementSuffixSkewedLocation:
	KW_SET KW_SKEWED KW_LOCATION skewedLocations;

skewedLocations: LPAREN skewedLocationsList RPAREN;

skewedLocationsList:
	skewedLocationMap (COMMA skewedLocationMap)*;

skewedLocationMap:
	key = skewedValueLocationElement EQUAL value = StringLiteral;

alterStatementSuffixLocation:
	KW_SET KW_LOCATION newLoc = StringLiteral;

alterStatementSuffixSkewedby:
	tableSkewed
	| KW_NOT KW_SKEWED
	| KW_NOT storedAsDirs;

alterStatementSuffixExchangePartition:
	KW_EXCHANGE partitionSpec KW_WITH KW_TABLE exchangename = tableName;

alterStatementSuffixProtectMode: alterProtectMode;

alterStatementSuffixRenamePart: KW_RENAME KW_TO partitionSpec;

alterStatementSuffixStatsPart:
	KW_UPDATE KW_STATISTICS KW_FOR KW_COLUMN? colName = identifier KW_SET tableProperties (
		KW_COMMENT comment = StringLiteral
	)?;

alterStatementSuffixMergeFiles:
	KW_CONCATENATE
	| KW_MERGE KW_SMALLFILES;

alterProtectMode:
	KW_ENABLE alterProtectModeMode
	| KW_DISABLE alterProtectModeMode;

alterProtectModeMode:
	KW_OFFLINE
	| KW_NO_DROP KW_CASCADE?
	| KW_READONLY;

alterStatementSuffixBucketNum:
	KW_INTO num = Number (KW_BUCKETS | KW_SHARDS) (
		KW_HUBLIFECYCLE hubLifeCycle = Number
	)?;

alterStatementSuffixCompact:
	KW_COMPACT compactType = StringLiteral;

fileFormat:
	KW_INPUTFORMAT inFmt = StringLiteral KW_OUTPUTFORMAT outFmt = StringLiteral KW_SERDE serdeCls =
		StringLiteral (
		KW_INPUTDRIVER inDriver = StringLiteral KW_OUTPUTDRIVER outDriver = StringLiteral
	)?
	| genericSpec = identifier;

tabTypeExpr:
	allIdentifiers (
		DOT (
			KW_ELEM_TYPE
			| KW_KEY_TYPE
			| KW_VALUE_TYPE
			| allIdentifiers
		)
	)* identifier?;

partTypeExpr: tabTypeExpr partitionSpec?;

descStatement:
	(KW_DESCRIBE | KW_DESC) (
		(KW_DATABASE | KW_SCHEMA) KW_EXTENDED? identifier
		| KW_PACKAGE (proj = projectName DOT)? pkgName = packageName privilegeProperties?
		| KW_PACKAGE KW_ITEMS obj = privilegeObject (
			KW_FROM proj = projectName
		)?
		| KW_ROLE roleName
		| KW_FUNCTION KW_EXTENDED? descFuncNames
		| KW_CHANGELOGS? KW_FOR? KW_TABLE? tableName partitionSpec? Number?
		| KW_EXTENDED? variableName
		| (KW_FORMATTED | KW_EXTENDED | KW_PRETTY)? partTypeExpr
	);

analyzeStatement:
	KW_ANALYZE KW_TABLE (parttype = tableOrPartition) (
		KW_COMPUTE KW_STATISTICS (
			(noscan = KW_NOSCAN)
			| (partialscan = KW_PARTIALSCAN)
			| (forColumns = forColumnsStatement)
		)?
		| del = KW_DELETE KW_STATISTICS (
			forColumns = forColumnsStatement
		)
	);

forColumnsStatement:
	KW_FOR KW_COLUMNS (
		LPAREN cols += columnNameOrList (
			COMMA cols += columnNameOrList
		)* RPAREN
	)?;

columnNameOrList: columnName | LPAREN columnNameList RPAREN;

showStatement:
	KW_SHOW (KW_DATABASES | KW_SCHEMAS) (
		KW_LIKE showStmtIdentifier
	)? // odps: list projects
	| KW_SHOW KW_TABLES ((KW_FROM | KW_IN) db_name = identifier)? (
		KW_LIKE showStmtIdentifier
		| showStmtIdentifier
	)?
	| KW_SHOW KW_COLUMNS (KW_FROM | KW_IN) tableName (
		(KW_FROM | KW_IN) db_name = identifier
	)?
	| KW_SHOW KW_FUNCTIONS (
		KW_LIKE showFunctionIdentifier
		| showFunctionIdentifier
	)?
	| KW_SHOW KW_PARTITIONS tabName = tableName partitionSpec?
	| KW_SHOW KW_CREATE KW_TABLE tabName = tableName
	| KW_SHOW KW_TABLE KW_EXTENDED (
		(KW_FROM | KW_IN) db_name = identifier
	)? KW_LIKE showStmtIdentifier partitionSpec?
	| KW_SHOW KW_TBLPROPERTIES tableName (
		LPAREN prptyName = StringLiteral RPAREN
	)?
	| KW_SHOW KW_LOCKS (
		(KW_DATABASE | KW_SCHEMA) (dbName = Identifier) (
			isExtended = KW_EXTENDED
		)?
		| (parttype = partTypeExpr)? (isExtended = KW_EXTENDED)?
	)
	| KW_SHOW (showOptions = KW_FORMATTED)? (
		KW_INDEX
		| KW_INDEXES
	) KW_ON showStmtIdentifier (
		(KW_FROM | KW_IN) db_name = identifier
	)?
	| KW_SHOW KW_COMPACTIONS
	| KW_SHOW KW_TRANSACTIONS
	| KW_SHOW KW_CONF StringLiteral
	| KW_SHOW KW_P (KW_FROM bareDate KW_TO bareDate)? (Number)? // show instances
	| KW_SHOW KW_JOB stringLiteral (
		KW_FROM bareDate KW_TO bareDate
	)?
	| KW_SHOW KW_FLAGS
	| KW_SHOW KW_CHANGELOGS KW_FOR KW_TABLE? tableName partitionSpec? Number?
	| KW_SHOW KW_RECYCLEBIN (
		(KW_FROM | KW_IN) db_name = identifier
	)?
	| KW_SHOW KW_VARIABLES (KW_LIKE showStmtIdentifier)?;

listStatement:
	KW_LIST (
		KW_PROJECTS
		| KW_JOBS
		| KW_RESOURCES
		| KW_FUNCTIONS
		| KW_ACCOUNTPROVIDERS
		| KW_TEMPORARY KW_OUTPUT
	);

bareDate: stringLiteral | dateWithoutQuote;

lockStatement:
	KW_LOCK KW_TABLE tableName partitionSpec? lockMode;

lockDatabase:
	KW_LOCK (KW_DATABASE | KW_SCHEMA) (dbName = Identifier) lockMode;

lockMode: KW_SHARED | KW_EXCLUSIVE;

unlockStatement: KW_UNLOCK KW_TABLE tableName partitionSpec?;

unlockDatabase:
	KW_UNLOCK (KW_DATABASE | KW_SCHEMA) (dbName = Identifier);

resourceList: resource (COMMA resource)*;

resource: resType = resourceType? resPath = StringLiteral;

resourceType: KW_JAR | KW_FILE | KW_ARCHIVE;

createFunctionStatement:
	KW_CREATE (temp = KW_TEMPORARY)? KW_FUNCTION functionIdentifier KW_AS StringLiteral (
		KW_USING rList = resourceList
	)?;
// 暂不支持userCodeBlock

dropFunctionStatement:
	KW_DROP (temp = KW_TEMPORARY)? KW_FUNCTION ifExists? functionIdentifier;

reloadFunctionStatement: KW_RELOAD KW_FUNCTION;

createMacroStatement:
	KW_CREATE KW_TEMPORARY KW_MACRO Identifier LPAREN columnNameTypeList? RPAREN expression;

dropMacroStatement:
	KW_DROP KW_TEMPORARY KW_MACRO ifExists? Identifier;

createSqlFunctionStatement:
	KW_CREATE (orReplace)? KW_FUNCTION (ifNotExists)? name = tableName param = functionParameters (
		KW_RETURNS retvar = variableName retType = typeDeclaration
	)? comment = tableComment? res = viewResource? KW_AS (
		query = queryExpressionWithCTE
		| exp = expression
	);
// funBody=compoundStatement|
cloneTableStatement:
	KW_CLONE KW_TABLE src = tableName (
		par += partitionSpec (COMMA par += partitionSpec)*
	)? KW_TO dest = tableName (
		KW_IF KW_EXISTS (o = KW_OVERWRITE | i = KW_IGNORE)
	)?;

createViewStatement:
	KW_CREATE (orReplace)? KW_VIEW (ifNotExists)? name = tableName (
		(LPAREN columnNameCommentList RPAREN)?
		| param = functionParameters (
			KW_RETURNS retvar = variableName retType = typeDeclaration
		)?
	) comment = tableComment? viewPartition? res = viewResource? prop = tablePropertiesPrefixed?
		KW_AS (query = queryExpressionWithCTE);
// funBody=compoundStatement|
viewPartition:
	KW_PARTITIONED KW_ON LPAREN columnNameList RPAREN;

dropViewStatement: KW_DROP KW_VIEW ifExists? name = tableName;

showFunctionIdentifier: functionIdentifier | StringLiteral;

showStmtIdentifier: identifier | StringLiteral;

tableComment: KW_COMMENT comment = stringLiteral;

tablePartition:
	KW_PARTITIONED KW_BY LPAREN columnNameTypeList RPAREN;

tableBuckets:
	KW_CLUSTERED KW_BY LPAREN bucketCols = clusterColumnNameOrderList RPAREN (
		KW_SORTED KW_BY LPAREN sortCols = columnNameOrderList RPAREN
	)? KW_INTO num = Number KW_BUCKETS
	| range = KW_RANGE KW_CLUSTERED KW_BY LPAREN bucketCols = clusterColumnNameOrderList RPAREN (
		KW_SORTED KW_BY LPAREN sortCols = columnNameOrderList RPAREN
	)? (KW_INTO num = Number KW_BUCKETS)?;

tableShards:
	KW_CLUSTERED KW_BY LPAREN bucketCols = columnNameList RPAREN (
		KW_SORTED KW_BY LPAREN sortCols = columnNameOrderList RPAREN
	)? KW_INTO num = Number shard = KW_SHARDS
	| KW_DISTRIBUTE KW_BY LPAREN bucketCols = columnNameList RPAREN (
		KW_SORT KW_BY LPAREN sortCols = columnNameOrderList RPAREN
	)? KW_INTO num = Number shard = KW_SHARDS;

tableSkewed:
	KW_SKEWED KW_BY LPAREN skewedCols = columnNameList RPAREN KW_ON LPAREN (
		skewedValues = skewedValueElement
	) RPAREN storedAsDirs?;

rowFormat: rowFormatSerde | rowFormatDelimited;

recordReader: KW_RECORDREADER reader = stringLiteral;

recordWriter: KW_RECORDWRITER writer = stringLiteral;

rowFormatSerde:
	KW_ROW KW_FORMAT KW_SERDE name = stringLiteral (
		KW_WITH KW_SERDEPROPERTIES serdeprops = tableProperties
	)?;

rowFormatDelimited:
	KW_ROW KW_FORMAT KW_DELIMITED fd = tableRowFormatFieldIdentifier? cd =
		tableRowFormatCollItemsIdentifier? md = tableRowFormatMapKeysIdentifier? ld =
		tableRowFormatLinesIdentifier? nul = tableRowNullFormat?;

tableRowFormat: rfd = rowFormatDelimited | rfs = rowFormatSerde;

tablePropertiesPrefixed: KW_TBLPROPERTIES tableProperties;

tableProperties: LPAREN tablePropertiesList RPAREN;

tablePropertiesList:
	kv += keyValueProperty (COMMA kv += keyValueProperty)*;
// | k += keyProperty (COMMA k += keyProperty)*;

keyValueProperty:
	key = StringLiteral EQUAL value = StringLiteral;

userDefinedJoinPropertiesList:
	kv += keyValueProperty (COMMA kv += keyValueProperty)*;

keyPrivProperty: key = stringLiteral;

keyProperty: key = StringLiteral;

tableRowFormatFieldIdentifier:
	KW_FIELDS KW_TERMINATED KW_BY fldIdnt = stringLiteral (
		KW_ESCAPED KW_BY fldEscape = stringLiteral
	)?;

tableRowFormatCollItemsIdentifier:
	KW_COLLECTION KW_ITEMS KW_TERMINATED KW_BY collIdnt = stringLiteral;

tableRowFormatMapKeysIdentifier:
	KW_MAP KW_KEYS KW_TERMINATED KW_BY mapKeysIdnt = stringLiteral;

tableRowFormatLinesIdentifier:
	KW_LINES KW_TERMINATED KW_BY linesIdnt = stringLiteral;

tableRowNullFormat:
	KW_NULL KW_DEFINED KW_AS nullIdnt = stringLiteral;
tableFileFormat:
	KW_STORED KW_AS KW_INPUTFORMAT inFmt = stringLiteral KW_OUTPUTFORMAT outFmt = stringLiteral (
		KW_INPUTDRIVER inDriver = StringLiteral KW_OUTPUTDRIVER outDriver = StringLiteral
	)?
	| KW_STORED KW_BY storageHandler = stringLiteral (
		KW_WITH KW_SERDEPROPERTIES serdeprops = tableProperties
	)?
	| KW_STORED KW_AS genericSpec = identifier;

tableLocation: KW_LOCATION locn = stringLiteral;

externalTableResource: KW_USING res = stringLiteral;

viewResource:
	KW_RESOURCES res += stringLiteral (
		COMMA res += stringLiteral
	)*;

outOfLineConstraints:
	(KW_CONSTRAINT n = identifier)? KW_PRIMARY KW_KEY? LPAREN c = columnNameList RPAREN e =
		enableSpec? v = validateSpec? r = relySpec?;

enableSpec: KW_ENABLE | KW_DISABLE;

validateSpec: KW_VALIDATE | KW_NOVALIDATE;

relySpec: KW_RELY | KW_NORELY;

columnNameTypeConstraintList:
	columnNameTypeConstraint (COMMA columnNameTypeConstraint)*;

columnNameTypeList: columnNameType (COMMA columnNameType)*;

columnNameColonTypeList:
	t += columnNameColonType (COMMA t += columnNameColonType)*;

columnNameList: columnName (COMMA columnName)*;

columnName: identifier;

columnNameOrderList: columnNameOrder (COMMA columnNameOrder)*;

clusterColumnNameOrderList:
	columnNameOrder (COMMA columnNameOrder)*;

skewedValueElement:
	skewedColumnValues
	| skewedColumnValuePairList;

skewedColumnValuePairList:
	skewedColumnValuePair (COMMA skewedColumnValuePair)*;

skewedColumnValuePair:
	LPAREN colValues = skewedColumnValues RPAREN;

skewedColumnValues:
	skewedColumnValue (COMMA skewedColumnValue)*;

skewedColumnValue: constant;

skewedValueLocationElement:
	skewedColumnValue
	| skewedColumnValuePair;

columnNameOrder:
	identifier (asc = KW_ASC | desc = KW_DESC)? (
		KW_NULLS (first = KW_FIRST | last = KW_LAST)
	)?;

columnNameCommentList:
	columnNameComment (COMMA columnNameComment)*;

columnNameComment:
	colName = identifier (KW_COMMENT comment = stringLiteral)?;

columnRefOrder:
	expression (asc = KW_ASC | desc = KW_DESC)? (
		KW_NULLS (first = KW_FIRST | last = KW_LAST)
	)?;

columnNameTypeConstraint:
	colName = identifier t = colType n += constraints* (
		KW_COMMENT comment = stringLiteral
	)?;

columnNameType:
	colName = identifier t = colType (
		KW_COMMENT comment = stringLiteral
	)?;

constraints:
	n = nullableSpec
	| d = defaultValue
	| p = primaryKey;

primaryKey: KW_PRIMARY KW_KEY?;

nullableSpec: not = KW_NOT? KW_NULL;

defaultValue: KW_DEFAULT constant;

// columnNameColonType: n = identifier COLON t = builtinTypeOrUdt ( KW_COMMENT c = stringLiteral )?;
columnNameColonType:
	n = identifier (KW_COMMENT c = stringLiteral)?;

colType: t = type;

colTypeList: colType (COMMA colType)*;

anyType: t = type | KW_ANY;

// root grammar
anyTypeList: anyType (COMMA anyType)*;

// root grammar
tableTypeInfo:
	table = KW_TABLE LPAREN cols = columnNameTypeConstraintList RPAREN (
		KW_PARTITIONED KW_BY LPAREN pars = columnNameTypeConstraintList RPAREN
	)?
	| view = KW_VIEW LPAREN cols = columnNameTypeConstraintList RPAREN KW_AS stmt = statement;

type:
	pt = primitiveType
	| lt = listType
	| st = structType
	| mt = mapType
	| ut = unionType;

primitiveType:
	KW_TINYINT
	| KW_SMALLINT
	| KW_INT
	| KW_BIGINT
	| KW_BOOLEAN
	| KW_FLOAT
	| KW_DOUBLE
	| KW_DATE
	| KW_DATETIME
	| KW_TIMESTAMP
	// Uncomment to allow intervals as table column types | KW_INTERVAL KW_YEAR KW_TO KW_MONTH ->
	// TOK_INTERVAL_YEAR_MONTH | KW_INTERVAL KW_DAY KW_TO KW_SECOND -> TOK_INTERVAL_DAY_TIME
	| KW_STRING
	| KW_BINARY
	| KW_DECIMAL (
		LPAREN prec = Number (COMMA scale = Number)? RPAREN
	)?
	| KW_VARCHAR LPAREN length = Number RPAREN
	| KW_CHAR LPAREN length = Number RPAREN;

builtinTypeOrUdt: t = type | cn = classNameOrArrayDecl;

primitiveTypeOrUdt:
	t = primitiveType
	| cn = classNameOrArrayDecl;

listType:
	KW_ARRAY LESSTHAN elemType = builtinTypeOrUdt GREATERTHAN;

structType:
	KW_STRUCT LESSTHAN tl = columnNameColonTypeList GREATERTHAN;

mapType:
	KW_MAP LESSTHAN left = primitiveTypeOrUdt COMMA right = builtinTypeOrUdt GREATERTHAN;

unionType: KW_UNIONTYPE LESSTHAN colTypeList GREATERTHAN;

setOperator:
	KW_UNION all = KW_ALL
	| KW_UNION KW_DISTINCT?
	| intersect = KW_INTERSECT all = KW_ALL
	| intersect = KW_INTERSECT KW_DISTINCT?
	| minus = (KW_MINUS | KW_EXCEPT) all = KW_ALL
	| minus = (KW_MINUS | KW_EXCEPT) KW_DISTINCT?;

withClause:
	KW_WITH branches += cteStatement (
		COMMA branches += cteStatement
	)*;

insertClause:
	KW_INSERT KW_OVERWRITE dest = destination ifNotExists?
	| KW_INSERT KW_INTO KW_TABLE? intoTable = tableOrPartition (
		LPAREN targetCols = columnNameList RPAREN
	)?;

destination:
	(local = KW_LOCAL)? KW_DIRECTORY StringLiteral tableRowFormat? tableFileFormat?
	| KW_TABLE table = tableOrColumOrPartition;

// 新增
tableOrColumOrPartition:
	table = tableName (LPAREN targetCols = columnNameList RPAREN)? partitions = partitionSpec?;

/* overwritten by our extension -- commenting out the original here limitClause : KW_LIMIT
 num=Number ;
 */

//DELETE FROM <tableName> WHERE ...;
deleteStatement:
	KW_DELETE KW_FROM tableOrPartition (whereClause)?;

/*SET <columName> = (3 + col2)*/
columnAssignmentClause:
	tableOrColumn EQUAL expression; //precedencePlusExpression

/*SET col1 = 5, col2 = (4 + col4), ...*/
setColumnsClause:
	KW_SET columnAssignmentClause (COMMA columnAssignmentClause)*;

/*
 UPDATE <table> SET col1 = val1, col2 = val2... WHERE ...
 */
updateStatement:
	KW_UPDATE tp = tableOrPartition s = setColumnsClause w = whereClause?;

mergeStatement:
	KW_MERGE KW_INTO target = mergeTargetTable KW_USING source = mergeSourceTable KW_ON mergeOn =
		expression mergeAction+;

mergeTargetTable: t = tableName (KW_AS? alias = identifier)?;

mergeSourceTable: vjs = joinSource;

mergeAction:
	KW_WHEN KW_NOT? KW_MATCHED (KW_AND mergeAnd = expression)? KW_THEN (
		KW_INSERT values = mergeValuesCaluse
		| KW_UPDATE s = mergeSetColumnsClause
		| KW_DELETE
	);

mergeValuesCaluse:
	KW_VALUES LPAREN cols += mathExpression (
		COMMA cols += mathExpression
	)* RPAREN;

mergeSetColumnsClause:
	KW_SET mergeColumnAssignmentClause (
		COMMA mergeColumnAssignmentClause
	)*;

mergeColumnAssignmentClause:
	tableAndColumnRef EQUAL expression
	| tableOrColumnRef EQUAL expression;

selectClause:
	KW_SELECT hintClause? (
		((KW_ALL | dist = KW_DISTINCT)? selectList)
		| (transform = KW_TRANSFORM selectTrfmClause)
	)
	| trfmClause;

selectList: selectItem ( COMMA selectItem)*;

selectTrfmClause:
	LPAREN exprs = selectExpressionList RPAREN inSerde = tableRowFormat? inRec = recordWriter?
		KW_USING using = stringLiteral (
		KW_RESOURCES res += stringLiteral (
			COMMA res += stringLiteral
		)*
	)? (
		KW_AS (
			(
				LPAREN (
					aliases = aliasList
					| cols = columnNameTypeList
				) RPAREN
			)
			| (aliases = aliasList | cols = columnNameTypeList)
		)
	)? outSerde = tableRowFormat? outRec = recordReader?;

hintClause: HintStart hintList STAR DIVIDE;

hintList: hintItem (COMMA hintItem)*;

hintItem:
	mapjoin = mapJoinHint
	| selectivity = selectivityHint
	| dynamicfilter = dynamicfilterHint
	| skewjoin = skewjoinHint
	| dist = distMapJoin
	| split=splitSizeHint
	| hintName (LPAREN hintArgs RPAREN)?;

splitSizeHint:
    KW_SPLIT_SIZE (LPAREN Number RPAREN)?;

distMapJoin: KW_DISTMAPJOIN LPAREN distMapJoinHintArgs RPAREN;

distMapJoinHintArgs:
	distMapJoinHintArgName (COMMA distMapJoinHintArgName)*;

distMapJoinHintArgName:
	identifier (LPAREN distMapjoinPropertiesList RPAREN)?;

distMapjoinPropertiesList:
	kv += distMapjoinProperty (COMMA kv += distMapjoinProperty)*;

distMapjoinProperty: key = identifier EQUAL value = Number;

dynamicfilterHint: KW_DYNAMICFILTER (LPAREN hintArgs RPAREN);

mapJoinHint: KW_MAPJOIN (LPAREN hintArgs RPAREN)?;

skewjoinHint: KW_SKEWJOIN (LPAREN skewhitArgs RPAREN);

skewhitArgs: identifier (LPAREN skewhitFn RPAREN)?;

skewhitFn:
	hintArgs
	| LPAREN skewhitFn RPAREN (COMMA LPAREN skewhitFn RPAREN)*;

selectivityHint:
	name = KW_SELECTIVITY (LPAREN num = Number RPAREN)?;

hintName: KW_STREAMTABLE | KW_HOLD_DDLTIME | id = identifier;

hintArgs: hintArgName (COMMA hintArgName)*;

hintArgName: identifier;

selectItem:
	tableAllColumns
	| (
		expression (
			(KW_AS? alias += identifier)
			| (
				KW_AS LPAREN alias += identifier (
					COMMA alias += identifier
				)* RPAREN
			)
		)?
	);

trfmClause:
	(
		KW_MAP exprs = selectExpressionList
		| KW_REDUCE exprs = selectExpressionList
	) inSerde = rowFormat inRec = recordWriter KW_USING using = stringLiteral (
		KW_RESOURCES res += stringLiteral (
			COMMA res += stringLiteral
		)*
	)? (
		KW_AS (
			(
				LPAREN (
					aliases = aliasList
					| cols = columnNameTypeList
				) RPAREN
			)
			| (aliases = aliasList | cols = columnNameTypeList)
		)
	)? outSerde = rowFormat outRec = recordReader;

selectExpression:
	wildcardCol = tableAllColumns
	| lambdaExpression
	| exp = expression;

selectExpressionList:
	selectExpression (COMMA selectExpression)*;

//---------------------- Rules for windowing clauses -------------------------------
window_clause:
	KW_WINDOW winDef += window_defn (COMMA winDef += window_defn)*;

window_defn:
	name = identifier KW_AS spec = window_specification;

window_specification:
	id = identifier
	| LPAREN (
		id = identifier p = partitioningSpec? w = window_frame?
		| p = partitioningSpec w = window_frame?
		|
	) RPAREN;

window_frame:
	rows = window_range_expression
	| range = window_value_expression;

window_range_expression:
	//KW_ROWS sb=window_frame_start_boundary |
	KW_ROWS b = window_frame_boundary
	| KW_ROWS KW_BETWEEN s = window_frame_boundary KW_AND end = window_frame_boundary;

window_value_expression:
	KW_RANGE sb = window_frame_start_boundary
	| KW_RANGE KW_BETWEEN s = window_frame_boundary KW_AND end = window_frame_boundary;

window_frame_start_boundary:
	KW_UNBOUNDED KW_PRECEDING
	| KW_CURRENT KW_ROW
	|
	//  Number KW_PRECEDING
	value = mathExpression /*precedenceBitwiseOrExpression*/ KW_PRECEDING;

window_frame_boundary:
	KW_UNBOUNDED (d = KW_PRECEDING | d = KW_FOLLOWING)
	| KW_CURRENT KW_ROW
	|
	//  Number (d=KW_PRECEDING | d=KW_FOLLOWING )
	value = mathExpression /*precedenceBitwiseOrExpression*/ (
		d = KW_PRECEDING
		| d = KW_FOLLOWING
	);

tableAllColumns: STAR | tb = tableName DOT? STAR;

// (table|column)
tableOrColumn: identifier;

expressionList: expression (COMMA expression)*;

aliasList: identifier (COMMA identifier)*;

//----------------------- Rules for parsing fromClause ------------------------------ from [col1,
// col2, col3] table1, [col4, col5] table2
fromClause: KW_FROM hintClause? joinSource;

joinSource:
	lhs = fromSource hintClause? (rhs += joinRHS)*
	| uniqueJoinToken uniqueJoinSource (COMMA uniqueJoinSource)+;

joinRHS:
	joinType = joinToken joinTable = fromSource (
		KW_USING LPAREN commonCols += identifier (
			COMMA commonCols += identifier
		)* RPAREN
		| (KW_ON joinOn += expression)* (
			KW_USING cbn = functionIdentifier (
				LPAREN exprs = selectExpressionList RPAREN
			)? (tableAlias)? (
				(KW_AS? alias += identifier)
				| (
					KW_AS LPAREN alias += identifier (
						COMMA alias += identifier
					)* RPAREN
				)
			)? (
				KW_WITH KW_UDFPROPERTIES LPAREN userDefinedJoinPropertiesList RPAREN
			)? (sort = sortByClause)?
		)?
	)
	| natural = KW_NATURAL joinType = joinToken joinTable = fromSource
	| lv = lateralView (KW_ON joinOn += expression)?;

uniqueJoinSource: KW_PRESERVE? fromSource uniqueJoinExpr;

uniqueJoinExpr:
	LPAREN e1 += expression (COMMA e1 += expression)* RPAREN;

uniqueJoinToken: KW_UNIQUEJOIN;

joinToken:
	KW_JOIN
	| KW_INNER KW_JOIN
	| COMMA
	| KW_CROSS KW_JOIN
	| KW_LEFT (outer = KW_OUTER)? KW_JOIN
	| KW_RIGHT (outer = KW_OUTER)? KW_JOIN
	| KW_FULL (outer = KW_OUTER)? KW_JOIN
	| KW_LEFT semi = KW_SEMI KW_JOIN
	| KW_LEFT anti = KW_ANTI KW_JOIN;

lateralView:
	KW_LATERAL KW_VIEW outer = KW_OUTER rfunction tableAlias (
		KW_AS identifier (COMMA identifier)*
	)?
	| KW_LATERAL KW_VIEW rfunction tableAlias KW_AS identifier (
		COMMA identifier
	)*;

tableAlias: identifier;

/* overwritten by our extension -- commenting out the original here fromSource :
 (partitionedTableFunction | tableSource | subQuerySource | virtualTableSource) (lateralView)* ;
 */

tableBucketSample:
	KW_TABLESAMPLE LPAREN KW_BUCKET (numerator = Number) KW_OUT KW_OF (
		denominator = Number
	) (KW_ON expr += expression (COMMA expr += expression)*)? RPAREN;

splitSample:
	KW_TABLESAMPLE LPAREN (numerator = Number) (
		percent = KW_PERCENT
		| KW_ROWS
	) RPAREN
	| KW_TABLESAMPLE LPAREN (numerator = ByteLengthLiteral) RPAREN;

tableSample: tableBucketSample | splitSample;

tableSource:
	tabname = tableName (props = tableProperties)? (
		ts = tableSample
	)? (
		KW_AS? (
			alias = identifierWithoutSql11
			| extra = availableSql11KeywordsForOdpsTableAlias
		) (
			LPAREN col += identifier (COMMA col += identifier)* RPAREN
		)?
	)?;

availableSql11KeywordsForOdpsTableAlias: KW_USER | KW_INNER;

tableName:
	db = identifier DOT tab = identifier
	| tab = identifier;

//---------------------- Rules for parsing PTF clauses -----------------------------
partitioningSpec:
	p = partitionByClause o = orderByClause?
	| o = orderByClause
	| d = distributeByClause s = sortByClause?
	| s = sortByClause
	| c = clusterByClause;

partitionTableFunctionSource:
	subQuerySource
	| tableSource
	| partitionedTableFunction;

partitionedTableFunction:
	name = Identifier LPAREN KW_ON (
		ptfsrc = partitionTableFunctionSource spec = partitioningSpec?
	) (
		Identifier LPAREN expression RPAREN (
			COMMA Identifier LPAREN expression RPAREN
		)*
	)? RPAREN alias = Identifier?;

//----------------------- Rules for parsing whereClause ----------------------------- where a=b and
// ...
whereClause: KW_WHERE expression;

//-----------------------------------------------------------------------------------

//-------- Row Constructor ---------------------------------------------------------- in support of
// SELECT * FROM (VALUES(1,2,3),(4,5,6),...) as FOO(a,b,c) and INSERT INTO <table> (col1,col2,...)
// VALUES(...),(...),... INSERT INTO <table> (col1,col2,...) SELECT * FROM
// (VALUES(1,2,3),(4,5,6),...) as Foo(a,b,c)
valueRowConstructor:
	//LPAREN precedenceUnaryPrefixExpression (COMMA precedenceUnaryPrefixExpression)* RPAREN
	LPAREN cols += mathExpression (COMMA cols += mathExpression)* RPAREN;

valuesTableConstructor:
	rows += valueRowConstructor (
		COMMA rows += valueRowConstructor
	)*;

/*
 VALUES(1),(2) means 2 rows, 1 column each. VALUES(1,2),(3,4) means 2 rows, 2 columns each.
 VALUES(1,2,3) means 1 row, 3 columns
 */
valuesClause: KW_VALUES values = valuesTableConstructor;

/*
 This represents a clause like this: (VALUES(1,2),(2,3)) as VirtTable(col1,col2)
 */
virtualTableSource:
	LPAREN values = valuesClause RPAREN tableDecl = tableNameColList
	| values = valuesClause tableDecl = tableNameColList;
/*
 e.g. as VirtTable(col1,col2) Note that we only want literals as column names
 */
tableNameColList:
	KW_AS? table = identifier LPAREN col += identifier (
		COMMA col += identifier
	)* RPAREN;

functionTypeCubeOrRollup: (c = KW_CUBE | r = KW_ROLLUP) LPAREN gs += groupingSetExpression (
		COMMA gs += groupingSetExpression
	)* RPAREN;

groupingSetsItem:
	functionTypeCubeOrRollup
	| groupingSetExpression;

groupingSetsClause:
	sets = KW_GROUPING KW_SETS LPAREN groupingSetsItem (
		COMMA groupingSetsItem
	)* RPAREN;

groupByKey:
	gp = groupingSetsClause
	| cr = functionTypeCubeOrRollup
	| exp = expression;

// group by a,b
groupByClause:
	KW_GROUP KW_BY groupByKey (COMMA groupByKey)* (
		(rollup = KW_WITH KW_ROLLUP)
		| (cube = KW_WITH KW_CUBE)
		| (groupingset = groupingSetsClause)
	)?;

groupingSetExpression:
	groupingSetExpressionMultiple
	| groupingExpressionSingle;

groupingSetExpressionMultiple:
	LPAREN expression? (COMMA expression)* RPAREN;

groupingExpressionSingle: expression;

havingClause: KW_HAVING havingCondition;

havingCondition: expression;

expressionsInParenthese:
	LPAREN expressionsNotInParenthese RPAREN;

expressionsNotInParenthese: expression (COMMA expression)*;

columnRefOrderInParenthese:
	LPAREN columnRefOrderNotInParenthese RPAREN;

columnRefOrderNotInParenthese:
	columnRefOrder (COMMA columnRefOrder)*;

// order by a,b
orderByClause:
	KW_ORDER KW_BY exp += columnRefOrder (
		COMMA exp += columnRefOrder
	)*;

columnNameOrIndexInParenthese:
	LPAREN columnNameOrIndexNotInParenthese RPAREN;

columnNameOrIndexNotInParenthese:
	col += columnNameOrIndex (COMMA col += columnNameOrIndex)*;

columnNameOrIndex: col = tableOrColumnRef | index = constant;

// zorder by a,b
zorderByClause:
	KW_ZORDER KW_BY (
		expsParen = columnNameOrIndexInParenthese
		| expsNoParen = columnNameOrIndexNotInParenthese
	);

clusterByClause:
	KW_CLUSTER KW_BY (
		expsParen = expressionsInParenthese
		| expsNoParen = expressionsNotInParenthese
	);

partitionByClause:
	KW_PARTITION KW_BY (
		expsParen = expressionsInParenthese
		| expsNoParen = expressionsNotInParenthese
	);

distributeByClause:
	KW_DISTRIBUTE KW_BY (
		expsParen = expressionsInParenthese
		| expsNoParen = expressionsNotInParenthese
	);

sortByClause:
	KW_SORT KW_BY (
		expsParen = columnRefOrderInParenthese
		| expsNoParen = columnRefOrderNotInParenthese
	);

// fun(par1, par2, par3)
rfunction:
	name = functionName lp = LPAREN (
		star = STAR
		| distinct = KW_DISTINCT? (
			arg += functionArgument (
				COMMA arg += functionArgument
			)*
		)?
	) RPAREN (
		(KW_WITHIN KW_GROUP LPAREN obc = orderByClause RPAREN)? (
			KW_FILTER LPAREN wc = whereClause RPAREN
		)?
		| (KW_FILTER LPAREN wc = whereClause RPAREN)? (
			KW_OVER ws = window_specification
		)?
	)
	| bfs = builtinFunctionStructure;

functionArgument:
	s = selectExpression
	| f = funNameRef
	| l = lambdaExpression;

builtinFunctionStructure:
	KW_EXTRACT LPAREN u = intervalQualifiersUnit KW_FROM arg = expression RPAREN
	| KW_SUBSTRING LPAREN arg = expression KW_FROM st = Number (
		KW_FOR end = Number
	)? RPAREN;

functionName: // Keyword IF is also a function name
	kwIf = KW_IF
	| kwArray = KW_ARRAY
	| KW_MAP
	| KW_STRUCT
	| KW_UNIONTYPE
	| id = functionIdentifier
	| sql11ReservedId = sql11ReservedKeywordsUsedAsCastFunctionName;

castExpression:
	KW_CAST LPAREN exp = expression KW_AS typeDecl = builtinTypeOrUdt RPAREN;

caseExpression:
	KW_CASE caseExp = expression (
		KW_WHEN whenExp += expression KW_THEN thenExp += expression
	)+ (KW_ELSE elseExp = expression)? KW_END;

whenExpression:
	KW_CASE (
		KW_WHEN whenExp += expression KW_THEN thenExp += expression
	)+ (KW_ELSE elseExp = expression)? KW_END;

constant:
	n = Number
	| dt = dateLiteral
	| ts = timestampLiteral
	| dtl = dateTimeLiteral
	| i = intervalLiteral
	| s = stringLiteral
	| bi = BigintLiteral
	| si = SmallintLiteral
	| ti = TinyintLiteral
	| df = DecimalLiteral
	| cs = charSetStringLiteral
	| b = booleanValue
	| cusVar = customVariable;

stringLiteral: StringLiteral+;

charSetStringLiteral: CharSetStringLiteral;

dateLiteral: KW_DATE s = StringLiteral | KW_CURRENT_DATE;
// | KW_CURRENT_DATE // for compatible, CURRENT_DATE should be recognized as identifier;

dateTimeLiteral: KW_DATETIME s = StringLiteral;

timestampLiteral:
	KW_TIMESTAMP s = StringLiteral
	| KW_CURRENT_TIMESTAMP
	| KW_LOCALTIMESTAMP;

intervalLiteral:
	KW_INTERVAL v = stringLiteral q = intervalQualifiers
	| KW_INTERVAL e = mathExpression u = intervalQualifiersUnit;

intervalQualifiers:
	y2m = KW_YEAR intervalQualifierPrecision? KW_TO KW_MONTH intervalQualifierPrecision?
	| d2h = KW_DAY intervalQualifierPrecision? KW_TO KW_HOUR intervalQualifierPrecision?
	| d2m = KW_DAY intervalQualifierPrecision? KW_TO KW_MINUTE intervalQualifierPrecision?
	| d2s = KW_DAY intervalQualifierPrecision? KW_TO KW_SECOND intervalQualifierPrecision?
	| h2m = KW_HOUR intervalQualifierPrecision? KW_TO KW_MINUTE intervalQualifierPrecision?
	| h2s = KW_HOUR intervalQualifierPrecision? KW_TO KW_SECOND intervalQualifierPrecision?
	| m2s = KW_MINUTE intervalQualifierPrecision? KW_TO KW_SECOND intervalQualifierPrecision?
	| u = intervalQualifiersUnit intervalQualifierPrecision?;

intervalQualifiersUnit:
	y = KW_YEAR
	| y = KW_YEARS
	| M = KW_MONTH
	| M = KW_MONTHS
	| d = KW_DAY
	| d = KW_DAYS
	| h = KW_HOUR
	| h = KW_HOURS
	| m = KW_MINUTE
	| m = KW_MINUTES
	| s = KW_SECOND
	| s = KW_SECONDS;

intervalQualifierPrecision: LPAREN Number RPAREN;

booleanValue: KW_TRUE | KW_FALSE;

tableOrPartition: table = tableName partitions = partitionSpec?;

partitionSpec:
	KW_PARTITION LPAREN partitionVal (COMMA partitionVal)* RPAREN;

partitionVal: identifier (EQUAL (constant | variableRef))?;

// for compatibility
dateWithoutQuote: Number MINUS Number MINUS Number;

dropPartitionSpec:
	KW_PARTITION LPAREN dropVal += expression (
		COMMA dropVal += expression
	)* RPAREN;

// dropPartitionVal: col = identifier op = dropPartitionOperator val = constant;

// dropPartitionOperator: EQUAL | NOTEQUAL | LESSTHANOREQUALTO | LESSTHAN | GREATERTHANOREQUALTO |
// GREATERTHAN;

sysFuncNames:
	KW_AND
	| KW_OR
	| KW_NOT
	| KW_LIKE
	| KW_IF
	| KW_CASE
	| KW_WHEN
	| KW_TINYINT
	| KW_SMALLINT
	| KW_INT
	| KW_BIGINT
	| KW_FLOAT
	| KW_DOUBLE
	| KW_BOOLEAN
	| KW_STRING
	| KW_BINARY
	| KW_ARRAY
	| KW_MAP
	| KW_STRUCT
	| KW_UNIONTYPE
	| EQUAL
	| EQUAL_NS
	| NOTEQUAL
	| LESSTHANOREQUALTO
	| LESSTHAN
	| GREATERTHANOREQUALTO
	| GREATERTHAN
	| DIVIDE
	| PLUS
	| MINUS
	| STAR
	| MOD
	| DIV
	| AMPERSAND
	| TILDE
	| BITWISEOR
	| BITWISEXOR
	| KW_RLIKE
	| KW_REGEXP
	| KW_IN
	| KW_BETWEEN;

descFuncNames:
	sysFuncNames
	| StringLiteral
	| functionIdentifier;

/* overwritten by our extension -- commenting out the original here identifier : Identifier |
 nonReserved // If it decides to support SQL11 reserved keywords, i.e.,
 useSQL11ReservedKeywordsForIdentifier()=false, // the sql11keywords in existing q tests will NOT be
 added back. | sql11ReservedKeywordsUsedAsIdentifier ;
 */

functionIdentifier:
	db = identifier (DOT | COLON) fn = identifier
	| builtin = COLON COLON fn = identifier
	| fn = identifier;

reserved:
	KW_AND
	| KW_OR
	| KW_NOT
	| KW_LIKE
	| KW_IF
	| KW_HAVING
	| KW_FROM
	| KW_SELECT
	| KW_DISTINCT
	| KW_UNIQUEJOIN
	| KW_PRESERVE
	| KW_JOIN
	| KW_ON
	| KW_TRANSFORM
	| KW_COLUMN
	| KW_CHAR
	| KW_VARCHAR
	| KW_TABLESAMPLE
	| KW_CAST
	| KW_MACRO
	| KW_EXTENDED
	| KW_CASE
	| KW_WHEN
	| KW_THEN
	| KW_ELSE
	| KW_END
	| KW_CROSS
	| KW_UNBOUNDED
	| KW_PRECEDING
	| KW_FOLLOWING
	| KW_CURRENT
	| KW_PARTIALSCAN
	| KW_OVER
	| KW_WHERE;

//the new version of nonReserved + sql11ReservedKeywordsUsedAsIdentifier = old version of nonReserved
nonReserved:
	KW_ADD
	| KW_ADMIN
	| KW_AFTER
	| KW_ANALYZE
	| KW_ARCHIVE
	| KW_ASC
	| KW_BEFORE
	| KW_BUCKET
	| KW_BUCKETS
	| KW_CASCADE
	| KW_CHANGE
	| KW_CLUSTER
	| KW_CLUSTERED
	| KW_CLUSTERSTATUS
	| KW_COLLECTION
	| KW_COLUMNS
	| KW_COMMENT
	| KW_COMPACT
	| KW_COMPACTIONS
	| KW_COMPUTE
	| KW_CONCATENATE
	| KW_CONTINUE
	| KW_DATA
	| KW_DAY
	| KW_DATABASES
	| KW_DATETIME
	| KW_DBPROPERTIES
	| KW_DEFERRED
	| KW_DEFINED
	| KW_DELIMITED
	| KW_DEPENDENCY
	| KW_DESC
	| KW_DIRECTORIES
	| KW_DIRECTORY
	| KW_DISABLE
	| KW_DISTRIBUTE
	| KW_ELEM_TYPE
	| KW_ENABLE
	| KW_ESCAPED
	| KW_EXCLUSIVE
	| KW_EXPLAIN
	| KW_EXPORT
	| KW_FIELDS
	| KW_FILE
	| KW_FILEFORMAT
	| KW_FIRST
	| KW_FORMAT
	| KW_FORMATTED
	| KW_FUNCTIONS
	| KW_HOLD_DDLTIME
	| KW_HOUR
	| KW_IDXPROPERTIES
	| KW_IGNORE
	| KW_INDEX
	| KW_INDEXES
	| KW_INPATH
	| KW_INPUTDRIVER
	| KW_INPUTFORMAT
	| KW_ITEMS
	| KW_JAR
	| KW_KEYS
	| KW_KEY_TYPE
	| KW_LIMIT
	| KW_LINES
	| KW_LOAD
	| KW_LOCATION
	| KW_LOCK
	| KW_LOCKS
	| KW_LOGICAL
	| KW_LONG
	| KW_MAPJOIN
	| KW_SKEWJOIN
	| KW_MATERIALIZED
	| KW_METADATA
	| KW_MINUS
	| KW_MINUTE
	| KW_MONTH
	| KW_MSCK
	| KW_NOSCAN
	| KW_NO_DROP
	| KW_OFFLINE
	| KW_OPTION
	| KW_OUTPUTDRIVER
	| KW_OUTPUTFORMAT
	| KW_OVERWRITE
	| KW_OWNER
	| KW_PARTITIONED
	| KW_PARTITIONS
	| KW_PLUS
	| KW_PRETTY
	| KW_PRINCIPALS
	| KW_PROTECTION
	| KW_PURGE
	| KW_READ
	| KW_READONLY
	| KW_REBUILD
	| KW_RECORDREADER
	| KW_RECORDWRITER
	| KW_REGEXP
	| KW_RELOAD
	| KW_RENAME
	| KW_REPAIR
	| KW_REPLACE
	| KW_REPLICATION
	| KW_RESTRICT
	| KW_REWRITE
	| KW_RLIKE
	| KW_ROLE
	| KW_ROLES
	| KW_SCHEMA
	| KW_SCHEMAS
	| KW_SECOND
	| KW_SEMI
	| KW_SERDE
	| KW_SERDEPROPERTIES
	| KW_SERVER
	| KW_SETS
	| KW_SHARED
	| KW_SHOW
	| KW_SHOW_DATABASE
	| KW_SKEWED
	| KW_SORT
	| KW_SORTED
	| KW_SSL
	| KW_STATISTICS
	| KW_STORED
	| KW_STREAMTABLE
	| KW_STRING
	| KW_STRUCT
	| KW_TABLES
	| KW_TBLPROPERTIES
	| KW_TEMPORARY
	| KW_TERMINATED
	| KW_TINYINT
	| KW_TOUCH
	| KW_TRANSACTIONS
	| KW_UNARCHIVE
	| KW_UNDO
	| KW_UNIONTYPE
	| KW_UNLOCK
	| KW_UNSET
	| KW_UNSIGNED
	| KW_URI
	| KW_USE
	| KW_UTC
	| KW_UTCTIMESTAMP
	| KW_VALUE_TYPE
	| KW_VIEW
	| KW_WHILE
	| KW_YEAR
	| KW_MAP
	| KW_REDUCE
	| KW_SEMI
	| KW_ANTI
	| KW_CUBE
	| KW_PRIMARY
	| KW_KEY
	| KW_VALIDATE
	| KW_NOVALIDATE
	| KW_RELY
	| KW_NORELY
	| KW_OUTPUT
	| KW_YEARS
	| KW_MONTHS
	| KW_DAYS
	| KW_HOURS
	| KW_MINUTES
	| KW_SECONDS
	| KW_CODE_BEGIN
	| KW_CODE_END
	| KW_HISTORY
	| KW_RESTORE
	| KW_WITHIN
	| KW_FILTER
	| KW_VERSION
	| KW_MATCHED
	| KW_ZORDER;

//The following SQL2011 reserved keywords are used as cast function name only, it is a subset of the sql11ReservedKeywordsUsedAsIdentifier.
sql11ReservedKeywordsUsedAsCastFunctionName:
	KW_BIGINT
	| KW_BINARY
	| KW_BOOLEAN
	| KW_CURRENT_DATE
	| KW_CURRENT_TIMESTAMP
	| KW_DATE
	| KW_DOUBLE
	| KW_FLOAT
	| KW_INT
	| KW_SMALLINT
	| KW_TIMESTAMP
	| KW_TRANSFORM
;

//The following SQL2011 reserved keywords are used as identifiers in many q tests, they may be added back due to backward compatibility.
sql11ReservedKeywordsUsedAsIdentifier:
	KW_ALL
	| KW_ALTER
	| KW_ARRAY
	| KW_AS
	| KW_AUTHORIZATION
	| KW_BETWEEN
	| KW_BIGINT
	| KW_BINARY
	| KW_BOOLEAN
	| KW_BOTH
	| KW_BY
	| KW_CREATE
	| KW_CURRENT_DATE
	| KW_CURRENT_TIMESTAMP
	| KW_CURSOR
	| KW_DATE
	| KW_DECIMAL
	| KW_DELETE
	| KW_DESCRIBE
	| KW_DOUBLE
	| KW_DROP
	| KW_EXISTS
	| KW_EXTERNAL
	| KW_FALSE
	| KW_FETCH
	| KW_FLOAT
	| KW_FOR
	| KW_FULL
	| KW_GRANT
	| KW_GROUP
	| KW_GROUPING
	| KW_IMPORT
	| KW_IN
	| KW_INNER
	| KW_INSERT
	| KW_INT
	| KW_INTERSECT
	| KW_INTO
	| KW_IS
	| KW_LATERAL
	| KW_LEFT
	| KW_LIKE
	| KW_LOCAL
	| KW_NONE
	| KW_NULL
	| KW_OF
	| KW_ORDER
	| KW_OUT
	| KW_OUTER
	| KW_PARTITION
	| KW_PERCENT
	| KW_PROCEDURE
	| KW_RANGE
	| KW_READS
	| KW_REVOKE
	| KW_RIGHT
	| KW_ROLLUP
	| KW_ROW
	| KW_ROWS
	| KW_SET
	| KW_SMALLINT
	| KW_TABLE
	| KW_TIMESTAMP
	| KW_TO
	| KW_TRIGGER
	| KW_TRUE
	| KW_TRUNCATE
	| KW_UNION
	| KW_UPDATE
	| KW_USER
	| KW_USING
	| KW_VALUES
	| KW_WITH
	| KW_WINDOW
	| KW_NATURAL;

// make keyword case insensitive
fragment A: ('a' | 'A');
fragment B: ('b' | 'B');
fragment C: ('c' | 'C');
fragment D: ('d' | 'D');
fragment E: ('e' | 'E');
fragment F: ('f' | 'F');
fragment G: ('g' | 'G');
fragment H: ('h' | 'H');
fragment I: ('i' | 'I');
fragment J: ('j' | 'J');
fragment K: ('k' | 'K');
fragment L: ('l' | 'L');
fragment M: ('m' | 'M');
fragment N: ('n' | 'N');
fragment O: ('o' | 'O');
fragment P: ('p' | 'P');
fragment Q: ('q' | 'Q');
fragment R: ('r' | 'R');
fragment S: ('s' | 'S');
fragment T: ('t' | 'T');
fragment U: ('u' | 'U');
fragment V: ('v' | 'V');
fragment W: ('w' | 'W');
fragment X: ('x' | 'X');
fragment Y: ('y' | 'Y');
fragment Z: ('z' | 'Z');

// Keywords

KW_TRUE: T R U E;
KW_FALSE: F A L S E;
KW_ALL: A L L;
KW_NONE: N O N E;
KW_AND: A N D;
KW_OR: O R;
KW_NOT: N O T | '!';
KW_LIKE: L I K E;

KW_IF: I F;
KW_EXISTS: E X I S T S;

KW_ASC: A S C;
KW_DESC: D E S C;
KW_ORDER: O R D E R;
KW_ZORDER: Z O R D E R;
KW_GROUP: G R O U P;
KW_GROUPS: G R O U P S;
KW_BY: B Y;
KW_HAVING: H A V I N G;
KW_WHERE: W H E R E;
KW_FROM: F R O M;
KW_AS: A S;
KW_SELECT: S E L E C T;
KW_DISTINCT: D I S T I N C T;
KW_INSERT: I N S E R T;
KW_OVERWRITE: O V E R W R I T E;
KW_OUTER: O U T E R;
KW_UNIQUEJOIN: U N I Q U E J O I N;
KW_PRESERVE: P R E S E R V E;
KW_JOIN: J O I N;
KW_LEFT: L E F T;
KW_RIGHT: R I G H T;
KW_FULL: F U L L;
KW_ON: O N;
KW_PARTITION: P A R T I T I O N;
KW_PARTITIONS: P A R T I T I O N S;
KW_TABLE: T A B L E;
KW_TABLES: T A B L E S;
KW_COLUMNS: C O L U M N S;
KW_INDEX: I N D E X;
KW_INDEXES: I N D E X E S;
KW_REBUILD: R E B U I L D;
KW_FUNCTIONS: F U N C T I O N S;
KW_SHOW: S H O W;
KW_MSCK: M S C K;
KW_REPAIR: R E P A I R;
KW_DIRECTORY: D I R E C T O R Y;
KW_LOCAL: L O C A L;
KW_TRANSFORM: T R A N S F O R M;
KW_USING: U S I N G;
KW_CLUSTER: C L U S T E R;
KW_DISTRIBUTE: D I S T R I B U T E;
KW_SORT: S O R T;
KW_UNION: U N I O N;
KW_LOAD: L O A D;
KW_EXPORT: E X P O R T;
KW_IMPORT: I M P O R T;
KW_REPLICATION: R E P L I C A T I O N;
KW_METADATA: M E T A D A T A;
KW_DATA: D A T A;
KW_INPATH: I N P A T H;
KW_IS: I S;
KW_NULL: N U L L;
KW_CREATE: C R E A T E;
KW_EXTERNAL: E X T E R N A L;
KW_ALTER: A L T E R;
KW_CHANGE: C H A N G E;
KW_COLUMN: C O L U M N;
KW_FIRST: F I R S T;
KW_LAST: L A S T;
KW_NULLS: N U L L S;
KW_AFTER: A F T E R;
KW_DESCRIBE: D E S C R I B E;
KW_DROP: D R O P;
KW_RENAME: R E N A M E;
KW_IGNORE: I G N O R E;
KW_PROTECTION: P R O T E C T I O N;
KW_TO: T O;
KW_COMMENT: C O M M E N T;
KW_BOOLEAN: B O O L E A N;
KW_TINYINT: T I N Y I N T;
KW_SMALLINT: S M A L L I N T;
KW_INT: I N T;
KW_BIGINT: B I G I N T;
KW_FLOAT: F L O A T;
KW_DOUBLE: D O U B L E;
KW_DATE: D A T E;
KW_DATETIME: D A T E T I M E;
KW_TIMESTAMP: T I M E S T A M P;
KW_INTERVAL: I N T E R V A L;
KW_DECIMAL: D E C I M A L;
KW_STRING: S T R I N G;
KW_CHAR: C H A R;
KW_VARCHAR: V A R C H A R;
KW_ARRAY: A R R A Y;
KW_STRUCT: S T R U C T;
KW_MAP: M A P;
KW_UNIONTYPE: U N I O N T Y P E;
KW_REDUCE: R E D U C E;
KW_PARTITIONED: P A R T I T I O N E D;
KW_CLUSTERED: C L U S T E R E D;
KW_SORTED: S O R T E D;
KW_INTO: I N T O;
KW_BUCKETS: B U C K E T S;
KW_ROW: R O W;
KW_ROWS: R O W S;
KW_FORMAT: F O R M A T;
KW_DELIMITED: D E L I M I T E D;
KW_FIELDS: F I E L D S;
KW_TERMINATED: T E R M I N A T E D;
KW_ESCAPED: E S C A P E D;
KW_COLLECTION: C O L L E C T I O N;
KW_ITEMS: I T E M S;
KW_KEYS: K E Y S;
KW_KEY_TYPE: '$' K E Y '$';
KW_LINES: L I N E S;
KW_STORED: S T O R E D;
KW_FILEFORMAT: F I L E F O R M A T;
KW_INPUTFORMAT: I N P U T F O R M A T;
KW_OUTPUTFORMAT: O U T P U T F O R M A T;
KW_INPUTDRIVER: I N P U T D R I V E R;
KW_OUTPUTDRIVER: O U T P U T D R I V E R;
KW_OFFLINE: O F F L I N E;
KW_ENABLE: E N A B L E;
KW_DISABLE: D I S A B L E;
KW_READONLY: R E A D O N L Y;
KW_NO_DROP: N O '_' D R O P;
KW_LOCATION: L O C A T I O N;
KW_TABLESAMPLE: T A B L E S A M P L E;
KW_BUCKET: B U C K E T;
KW_OUT: O U T;
KW_OF: O F;
KW_PERCENT: P E R C E N T;
KW_CAST: C A S T;
KW_ADD: A D D;
KW_REPLACE: R E P L A C E;
KW_RLIKE: R L I K E;
KW_REGEXP: R E G E X P;
KW_TEMPORARY: T E M P O R A R Y;
KW_FUNCTION: F U N C T I O N;
KW_MACRO: M A C R O;
KW_FILE: F I L E;
KW_JAR: J A R;
KW_EXPLAIN: E X P L A I N;
KW_EXTENDED: E X T E N D E D;
KW_FORMATTED: F O R M A T T E D;
KW_PRETTY: P R E T T Y;
KW_DEPENDENCY: D E P E N D E N C Y;
KW_LOGICAL: L O G I C A L;
KW_SERDE: S E R D E;
KW_WITH: W I T H;
KW_DEFERRED: D E F E R R E D;
KW_SERDEPROPERTIES: S E R D E P R O P E R T I E S;
KW_DBPROPERTIES: D B P R O P E R T I E S;
KW_LIMIT: L I M I T;
KW_OFFSET: O F F S E T;
KW_SET: S E T;
KW_UNSET: U N S E T;
KW_TBLPROPERTIES: T B L P R O P E R T I E S;
KW_IDXPROPERTIES: I D X P R O P E R T I E S;
KW_VALUE_TYPE: '$' V A L U E '$';
KW_ELEM_TYPE: '$' E L E M '$';
KW_DEFINED: D E F I N E D;
KW_CASE: C A S E;
KW_WHEN: W H E N;
KW_THEN: T H E N;
KW_ELSE: E L S E;
KW_END: E N D;
KW_MAPJOIN: M A P J O I N;
KW_SKEWJOIN: S K E W J O I N;
KW_DYNAMICFILTER: D Y N A M I C F I L T E R;
KW_STREAMTABLE: S T R E A M T A B L E;
KW_DISTMAPJOIN: D I S T M A P J O I N;
KW_HOLD_DDLTIME: H O L D '_' D D L T I M E;
KW_CLUSTERSTATUS: C L U S T E R S T A T U S;
KW_UTC: U T C;
KW_UTCTIMESTAMP: U T C '_' T M E S T A M P;
KW_LONG: L O N G;
KW_DELETE: D E L E T E;
KW_PLUS: P L U S;
KW_MINUS: M I N U S;
KW_FETCH: F E T C H;
KW_INTERSECT: I N T E R S E C T;
KW_VIEW: V I E W;
KW_IN: I N;
KW_DATABASE: D A T A B A S E;
KW_DATABASES: D A T A B A S E S;
KW_MATERIALIZED: M A T E R I A L I Z E D;
KW_SCHEMA: S C H E M A;
KW_SCHEMAS: S C H E M A S;
KW_GRANT: G R A N T;
KW_REVOKE: R E V O K E;
KW_SSL: S S L;
KW_UNDO: U N D O;
KW_LOCK: L O C K;
KW_LOCKS: L O C K S;
KW_UNLOCK: U N L O C K;
KW_SHARED: S H A R E D;
KW_EXCLUSIVE: E X C L U S I V E;
KW_PROCEDURE: P R O C E D U R E;
KW_UNSIGNED: U N S I G N E D;
KW_WHILE: W H I L E;
KW_READ: R E A D;
KW_READS: R E A D S;
KW_PURGE: P U R G E;
KW_RANGE: R A N G E;
KW_ANALYZE: A N A L Y Z E;
KW_BEFORE: B E F O R E;
KW_BETWEEN: B E T W E E N;
KW_BOTH: B O T H;
KW_BINARY: B I N A R Y;
KW_CROSS: C R O S S;
KW_CONTINUE: C O N T I N U E;
KW_CURSOR: C U R S O R;
KW_TRIGGER: T R I G G E R;
KW_RECORDREADER: R E C O R D R E A D E R;
KW_RECORDWRITER: R E C O R D W R I T E R;
KW_SEMI: S E M I;
KW_ANTI: A N T I;
KW_LATERAL: L A T E R A L;
KW_TOUCH: T O U C H;
KW_ARCHIVE: A R C H I V E;
KW_UNARCHIVE: U N A R C H I V E;
KW_COMPUTE: C O M P U T E;
KW_STATISTICS: S T A T I S T I C S;
KW_NULL_VALUE: N U L L '_' V A L U E;
KW_DISTINCT_VALUE: D I S T I N C T '_' V A L U E;
KW_TABLE_COUNT: T A B L E '_' C O U N T;
KW_COLUMN_SUM: C O L U M N '_' S U M;
KW_COLUMN_MAX: C O L U M N '_' M A X;
KW_COLUMN_MIN: C O L U M N '_' M I N;
KW_EXPRESSION_CONDITION:
	E X P R E S S I O N '_' C O N D I T I O N;
KW_USE: U S E;
KW_OPTION: O P T I O N;
KW_CONCATENATE: C O N C A T E N A T E;
KW_SHOW_DATABASE: S H O W '_' D A T A B A S E;
KW_UPDATE: U P D A T E;
KW_MATCHED: M A T C H E D;
KW_RESTRICT: R E S T R I C T;
KW_CASCADE: C A S C A D E;
KW_SKEWED: S K E W E D;
KW_ROLLUP: R O L L U P;
KW_CUBE: C U B E;
KW_DIRECTORIES: D I R E C T O R I E S;
KW_FOR: F O R;
KW_WINDOW: W I N D O W;
KW_UNBOUNDED: U N B O U N D E D;
KW_PRECEDING: P R E C E D I N G;
KW_FOLLOWING: F O L L O W I N G;
KW_CURRENT: C U R R E N T;
KW_LOCALTIMESTAMP: L O C A L T I M E S T A M P;
KW_CURRENT_DATE: C U R R E N T '_' D A T E;
KW_CURRENT_TIMESTAMP: C U R R E N T '_' T I M E S T A M P;
KW_LESS: L E S S;
KW_MORE: M O R E;
KW_OVER: O V E R;
KW_GROUPING: G R O U P I N G;
KW_SETS: S E T S;
KW_TENANT: T E N A N T;
KW_SECURE: S E C U R E;
KW_REFRESH: R E F R E S H;
KW_EVERY: E V E R Y;
KW_AT: A T;
KW_TRUNCATE: T R U N C A T E;
KW_NOSCAN: N O S C A N;
KW_PARTIALSCAN: P A R T I A L S C A N;
KW_USER: U S E R;
KW_ROLE: R O L E;
KW_ROLES: R O L E S;
KW_INNER: I N N E R;
KW_EXCHANGE: E X C H A N G E;
KW_URI: U R I;
KW_SERVER: S E R V E R;
KW_ADMIN: A D M I N;
KW_OWNER: O W N E R;
KW_PRINCIPALS: P R I N C I P A L S;
KW_COMPACT: C O M P A C T;
KW_COMPACTIONS: C O M P A C T I O N S;
KW_TRANSACTIONS: T R A N S A C T I O N S;
KW_REWRITE: R E W R I T E;
KW_AUTHORIZATION: A U T H O R I Z A T I O N;
KW_CONF: C O N F;
KW_VALUES: V A L U E S;
KW_RELOAD: R E L O A D;
KW_YEAR: Y E A R;
KW_MONTH: M O N T H;
KW_DAY: D A Y;
KW_HOUR: H O U R;
KW_MINUTE: M I N U T E;
KW_SECOND: S E C O N D;
KW_YEARS: Y E A R S;
KW_MONTHS: M O N T H S;
KW_DAYS: D A Y S;
KW_HOURS: H O U R S;
KW_MINUTES: M I N U T E S;
KW_SECONDS: S E C O N D S;
KW_UDFPROPERTIES: U D F P R O P E R T I E S;

// odps extensions

KW_BEGIN: B E G I N;
KW_RETURNS: R E T U R N S;
KW_LOOP: L O O P;
KW_NEW: 'new';
KW_LIFECYCLE: L I F E C Y C L E;
KW_REMOVE: R E M O V E;
KW_GRANTS: G R A N T S;
KW_ACL: A C L;
KW_TYPE: T Y P E;
KW_LIST: L I S T;
KW_USERS: U S E R S;
KW_WHOAMI: W H O A M I;
KW_TRUSTEDPROJECTS: T R U S T E D P R O J E C T S;
KW_TRUSTEDPROJECT: T R U S T E D P R O J E C T;
KW_SECURITYCONFIGURATION:
	S E C U R I T Y C O N F I G U R A T I O N;
KW_PRIVILEGES: P R I V (I L E G E)? S;
KW_PROJECT: P R O J E C T;
KW_PROJECTS: P R O J E C T S;
KW_LABEL: L A B E L;
KW_ALLOW: A L L O W;
KW_DISALLOW: D I S A L L O W;
KW_PACKAGE: P A C K A G E;
KW_PACKAGES: P A C K A G E S;
KW_INSTALL: I N S T A L L;
KW_UNINSTALL: U N I N S T A L L;
KW_P: P;
KW_JOB: J O B;
KW_JOBS: J O B S;
KW_ACCOUNTPROVIDERS: A C C O U N T P R O V I D E R S;
KW_RESOURCES: R E S O U R C E S;
KW_FLAGS: F L A G S;
KW_COUNT: C O U N T;
KW_STATISTIC: S T A T I S T I C;
KW_STATISTIC_LIST: S T A T I S T I C '_' L I S T;
KW_GET: G E T;
KW_PUT: P U T;
KW_POLICY: P O L I C Y;
KW_PROJECTPROTECTION: P R O J E C T P R O T E C T I O N;
KW_EXCEPTION: E X C E P T I O N;
KW_EXCEPT: E X C E P T;
KW_CLEAR: C L E A R;
KW_EXPIRED: E X P I R E D;
KW_EXP: E X P;
KW_ACCOUNTPROVIDER: A C C O U N T P R O V I D E R;
KW_SUPER: S U P E R;
KW_VOLUMEFILE: V O L U M E F I L E;
KW_VOLUMEARCHIVE: V O L U M E A R C H I V E;
KW_OFFLINEMODEL: O F F L I N E M O D E L;
KW_PY: P Y;
KW_RESOURCE: R E S O U R C E;
KW_KILL: K I L L;
KW_STATUS: S T A T U S;
KW_SETPROJECT: S E T P R O J E C T;
KW_MERGE: M E R G E;
KW_SMALLFILES: S M A L L F I L E S;
KW_PARTITIONPROPERTIES: P A R T I T I O N P R O P E R T I E S;
KW_EXSTORE: E X S T O R E;
KW_CHANGELOGS: C H A N G E L O G S;
KW_REDO: R E D O;
KW_CHANGEOWNER: C H A N G E O W N E R;
KW_RECYCLEBIN: R E C Y C L E B I N;
KW_PRIVILEGEPROPERTIES: P R I V I L E G E P R O P E R T I E S;
KW_CACHE: C A C H E;
KW_CACHEPROPERTIES: C A C H E P R O P E R T I E S;
KW_VARIABLES: V A R I A B L E S;
KW_SELECTIVITY: S E L E C T I V I T Y;
KW_EXTRACT: E X T R A C T;
KW_SUBSTRING: S U B S T R I N G;
KW_DEFAULT: D E F A U L T;
KW_ANY: A N Y;
KW_NATURAL: N A T U R A L;
KW_CONSTRAINT: C O N S T R A I N T;
KW_PRIMARY: P R I M A R Y;
KW_KEY: K E Y;
KW_VALIDATE: V A L I D A T E;
KW_NOVALIDATE: N O V A L I D A T E;
KW_RELY: R E L Y;
KW_NORELY: N O R E L Y;
KW_CLONE: C L O N E;
KW_HISTORY: H I S T O R Y;
KW_RESTORE: R E S T O R E;
KW_VERSION: V E R S I O N;
KW_WITHIN: W I T H I N;
KW_FILTER: F I L T E R;
KW_SPLIT_SIZE: S P L I T '_' S I Z E;

// stream sql
KW_STREAMJOB: S T R E A M J O B;
KW_TEMP: T E M P;
KW_DIM: D I M;
KW_DIMENSION: D I M E N S I O N;
KW_RESULT: R E S U L T;
KW_STREAM: S T R E A M;
KW_SHARDS: S H A R D S;
KW_HUBLIFECYCLE: H U B L I F E C Y C L E;
KW_HUBTABLE: H U B T A B L E;
KW_OUTPUT: O U T P U T;
KW_CODE_BEGIN: SHARP C O D E;
KW_CODE_END: SHARP E N D WS C O D E;
KW_CATALOG: C A T A L O G;
KW_BLOOMFILTER: B L O O M F I L T E R;

// virtual table KW_VIRTUAL: V I R T U A L;

// Operators NOTE: if you add a new function/operator, add it to sysFuncNames so that describe
// function _FUNC_ will work.

DOT: '.'; // generated as a part of Number rule
COLON: ':';
COMMA: ',' | '，';
SEMICOLON: ';' | '；';

LPAREN: '(' | '（';
RPAREN: ')' | '）';
LSQUARE: '[';
RSQUARE: ']';
LCURLY: '{';
RCURLY: '}';

EQUAL: '=' | '==';
EQUAL_NS: '<=>';
NOTEQUAL: '<>' | '!=';
LESSTHANOREQUALTO: '<=';
LESSTHAN: '<';
GREATERTHANOREQUALTO: '>=';
GREATERTHAN: '>';

DIVIDE: '/';
PLUS: '+';
MINUS: '-';
STAR: '*';
MOD: '%';
DIV: D I V;

AMPERSAND: '&';
TILDE: '~';
BITWISEOR: '|';
BITWISEXOR: '^';
CONCATENATE: '||';
QUESTION: '?';
DOLLAR: '$';

SHARP: '#';

ASSIGN: ':=';

LAMBDA_IMPLEMENT: '->';

SCRIPT_VARIABLE:
	'${'+ (Letter | Digit | '_' | '-' | '+' | ' ')+ '}'
	| '$${'+ (Letter | Digit | '_')+ '}';

SCHEDULER_VARIABLE: '@@{' ( ~'}')+ '}' | '@@[' ( ~']')+ ']';

// LITERALS
fragment Letter: 'a' ..'z' | 'A' ..'Z';

fragment HexDigit: 'a' ..'f' | 'A' ..'F';

fragment Digit: '0' ..'9';

fragment Exponent: E ( PLUS | MINUS)? (Digit)+;

//fragment
// RegexComponent : 'a'..'z' | 'A'..'Z' | '0'..'9' | '_' | PLUS | STAR | QUESTION | MINUS | DOT |
// LPAREN | RPAREN | LSQUARE | RSQUARE | LCURLY | RCURLY | BITWISEXOR | BITWISEOR | DOLLAR ;

StringLiteral:
	'\'' (~('\'' | '\\') | ('\\' .))* '\''
	| '"' ( ~('"' | '\\') | ('\\' .))* '"';

// CharSetLiteral: StringLiteral | '0' X (HexDigit | Digit)+;

BigintLiteral: (Digit)+ L;

SmallintLiteral: (Digit)+ S;

TinyintLiteral: (Digit)+ Y;

DecimalLiteral: Number B D;

ByteLengthLiteral: (Digit)+ (B | K | M | G);

Number: (Digit)+ ( DOT (Digit)* (Exponent)? | Exponent)?;

Variable: '@' (Letter | Digit | '_')+;

/*
 An Identifier can be: - tableName - columnName - select expr alias - lateral view aliases -
 database name - view name - subquery alias - function name - ptf argument identifier - index name -
 property name for: db,tbl,partition... - fileFormat - role name - privilege name - principal name -
 macro name - hint name - window name
 */

// Ported from Java.g
fragment IDLetter:
	'\u0024'
	| '\u0041' ..'\u005a'
	| '\u005f'
	| '\u0061' ..'\u007a'
	| '\u00c0' ..'\u00d6'
	| '\u00d8' ..'\u00f6'
	| '\u00f8' ..'\u00ff'
	| '\u0100' ..'\u1fff'
	| '\u3040' ..'\u318f'
	| '\u3300' ..'\u337f'
	| '\u3400' ..'\u3d2d'
	| '\u4e00' ..'\u9fff'
	| '\uf900' ..'\ufaff';

fragment IDDigit:
	'\u0030' ..'\u0039'
	| '\u0660' ..'\u0669'
	| '\u06f0' ..'\u06f9'
	| '\u0966' ..'\u096f'
	| '\u09e6' ..'\u09ef'
	| '\u0a66' ..'\u0a6f'
	| '\u0ae6' ..'\u0aef'
	| '\u0b66' ..'\u0b6f'
	| '\u0be7' ..'\u0bef'
	| '\u0c66' ..'\u0c6f'
	| '\u0ce6' ..'\u0cef'
	| '\u0d66' ..'\u0d6f'
	| '\u0e50' ..'\u0e59'
	| '\u0ed0' ..'\u0ed9'
	| '\u1040' ..'\u1049';

// Identifier: (IDLetter | IDDigit) ( IDLetter | IDDigit | '_' | SCRIPT_VARIABLE | '.' | '.*' | '.'
// QuotedIdentifier | (WS* ':' WS*) )* | QuotedIdentifier; | '`' RegexComponent+ '`'

fragment Id: (IDLetter | IDDigit) (
		IDLetter
		| IDDigit
		| '_'
		| SCRIPT_VARIABLE
	)*
	| QuotedIdentifier; // | '`' RegexComponent+ '`'

Identifier: Id ('.' {!this.__FORMAT_MODE}? | '.*' | '.' Id)*;

QuotedIdentifier: '`' ( '``' | ~('`'))* '`';

fragment CharSetName:
	'_' (Letter | Digit | '_' | '-' | '.' | ':')+;

fragment CharSetLiteral:
	StringLiteral
	| '0' X (HexDigit | Digit)+;
// CharSetName: '_' (Letter | Digit | '_' | '-' | '.' | ':')+;
CharSetStringLiteral: CharSetName WS* CharSetLiteral;

// move whitespaces and comments to separate hidden channels, ODPS Studio will use these tokens
WS: (' ' | '\r' | '\t' | '\n' | '\u00a0') -> channel(HIDDEN);

COMMENT: '--' (~('\n' | '\r'))* -> channel(HIDDEN);

HintStart: '/' [ \r\t]* '*' [ \r\t]* '+';

//
// BlockComment: ('/*' [ \r\t]* '*' [ ]* '/' | '/*' [ \r\t]* ~[ \r\t+] .*? '*' [ ]* '/') ->
// channel(HIDDEN);

ESCAPE: '\\';

AT: '@';

UNDERLINE: '_';

ANY_CHAR: .;
