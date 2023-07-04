// @ts-nocheck

import { CstNode, IToken } from 'chevrotain/lib/chevrotain.d';
import _get from 'lodash/get';
import {
  peelCstToAtomQuerys,
  peelFromClauseToTableName,
  peelAtomQueryCstToFieldNames,
  buildRange,
  cstFind,
  findDeleteStatementFromCst,
  findInsertIntoFromCst,
  findInsertOverWriteFromCst,
  findUpdateFromCst,
  findDropFromCst,
  findAlterFromCst,
  findTruncateFromCst,
  getCstNodesInfo,
} from './define';

interface Range {
  start: {
    line: number;
    character: number;
  };
  end: {
    line: number;
    character: number;
  };
}

// 目前 TableAuth 功能只针对 ODPSSQL，查场景需要同时校验表和字段
interface AtomQueryTableAuth {
  tables: {
    // 表名
    tableName: string;
    // 表名在 编辑器中的位置
    tableRange: Range;
  }[];
  fields: {
    // 字段名
    fieldName: string;
    // 字段名在 编辑器中的位置
    fieldRange: Range;
  }[];
  authType: 'select' | 'insert' | 'delete' | 'alter';
}

// 删、改表时只需要校验表权限
interface AtomDeleteOrUpdataTableAuth {
  tables: {
    // 表名
    tableName: string;
    // 表名在 编辑器中的位置
    tableRange: Range;
  }[];
  authType: 'select' | 'insert' | 'delete' | 'alter';
}

export type TableAuthResponse = (AtomQueryTableAuth | AtomDeleteOrUpdataTableAuth)[];

export const validateTableAuth = (cst: CstNode): TableAuthResponse => {
  let tableAndFieldsInfo: TableAuthResponse;
  /**
   * 查表权限相关逻辑
   * 收集 sql 中 query 语句中出现的表名, 以及表名的位置
   * 查语句中，每个原子 sql 中可能有多个表名，也可能只有一个表名
   * 单个表名时，字段名可包含表名也可不包含 select a from table1;
   * 多个表名时，字段名解析出来是包含表名的 select table1.a from table1, table2;
   * 这里只做 字段名 和 表名 及 他们的 位置解析，具体的权限校验交给自定义方法
   */

  const atomQueryExpressions = peelCstToAtomQuerys(cst);

  tableAndFieldsInfo = atomQueryExpressions.reduce((result, atom) => {
    const queryFromClause = _get(atom, 'children.fromClause[0]');
    const queryTables = peelFromClauseToTableName(queryFromClause, true, true) as IToken[];
    const queryFields = peelAtomQueryCstToFieldNames(atom, true) as IToken[];

    if (queryTables.length) {
      return result.concat({
        tables: queryTables.map(item => {
          return {
            tableName: item.image.split('-alias-')[0],
            tableAlias: item.image.split('-alias-')[1],
            tableRange: buildRange(item),
          };
        }),
        fields: queryFields.map(item => {
          return {
            fieldName: item.image,
            fieldRange: buildRange(item),
          };
        }),
        authType: 'select',
      });
    }
    return result;
  }, []);

  /**
   * 删、改 表权限相关逻辑
   * 收集以下场景下表名、以及表出现的位置
   * - 删除表中的行
   *  - eg: delete from table1 where id = 1;
   * - 插入指定表 insert into、insert overwrite
   *  - eg: insert into websites (id,name,url) select id,app_name,url from  apps;
   *  - eg: insert overwrite table sale_detail_insert partition (sale_date='2013', region='china') select shop_name,customer_id,total_price from sale_detail zorder by customer_id, total_price;
   * - 更新表
   *  - eg: update acid_update set id = 4 where id = 2;
   * - 删除整张表
   *  - eg: drop table table1;
   * - 清空表中的数据
   *  - eg: truncate table table1;
   * - 修改表的各种信息
   *  - eg: alter table table1 rename to table2;
   */

  // delete
  const deleteStatements = findDeleteStatementFromCst(cst);
  const deleteTableNameCstNodes = deleteStatements
    .map(deleteStatement => cstFind(deleteStatement, ['tableName[0]']))
    .filter(Boolean);

  const deleteTables = getCstNodesInfo(deleteTableNameCstNodes, true) as IToken[];

  if (deleteTables.length) {
    tableAndFieldsInfo.push({
      tables: deleteTables?.map(item => {
        return {
          tableName: item.image,
          tableRange: buildRange(item),
        };
      }),
      authType: 'delete',
    });
  }

  // insert into
  const inserIntoClause = findInsertIntoFromCst(cst);

  const insertIntoTableNameCstNodes = inserIntoClause
    .map(insertStatement => cstFind(insertStatement, ['tableOrPartition', 'tableName[0]']))
    .filter(Boolean);

  const insertIntoTables = getCstNodesInfo(insertIntoTableNameCstNodes, true) as IToken[];

  if (insertIntoTables.length) {
    tableAndFieldsInfo.push({
      tables: insertIntoTables?.map(item => {
        return {
          tableName: item.image,
          tableRange: buildRange(item),
        };
      }),
      authType: 'insert',
    });
  }

  // insert overwrite
  const insertOverwriteClause = findInsertOverWriteFromCst(cst);
  const insertOverwriteTableNameCstNodes = insertOverwriteClause
    .map(insertStatement => cstFind(insertStatement, ['tableOrPartition', 'tableName[0]']))
    .filter(Boolean);

  const insertOverwriteTables = getCstNodesInfo(insertOverwriteTableNameCstNodes, true) as IToken[];

  if (insertOverwriteTables.length) {
    tableAndFieldsInfo.push({
      tables: insertOverwriteTables?.map(item => {
        return {
          tableName: item.image,
          tableRange: buildRange(item),
        };
      }),
      authType: 'insert',
    });
  }

  // update
  const updateStatements = findUpdateFromCst(cst);
  const updateTableNameCstNodes = updateStatements
    .map(updateStatement => cstFind(updateStatement, ['tableName[0]']))
    .filter(Boolean);

  const updateTables = getCstNodesInfo(updateTableNameCstNodes, true) as IToken[];

  if (updateTables.length) {
    tableAndFieldsInfo.push({
      tables: updateTables?.map(item => {
        return {
          tableName: item.image,
          tableRange: buildRange(item),
        };
      }),
      authType: 'insert',
    });
  }

  // drop
  const dropStatements = findDropFromCst(cst);
  const dropTableNameCstNodes = dropStatements
    .map(dropStatement => cstFind(dropStatement, ['tableName[0]']))
    .filter(Boolean);

  const dropTables = getCstNodesInfo(dropTableNameCstNodes, true) as IToken[];

  if (dropTables.length) {
    tableAndFieldsInfo.push({
      tables: dropTables?.map(item => {
        return {
          tableName: item.image,
          tableRange: buildRange(item),
        };
      }),
      authType: 'delete',
    });
  }

  // alter
  const alterStatements = findAlterFromCst(cst);
  const alterTableNameCstNodes = alterStatements
    .map(alterStatement => cstFind(alterStatement, ['tableName[0]']))
    .filter(Boolean);

  const alterTables = getCstNodesInfo(alterTableNameCstNodes, true) as IToken[];

  if (alterTables.length) {
    tableAndFieldsInfo.push({
      tables: alterTables?.map(item => {
        return {
          tableName: item.image,
          tableRange: buildRange(item),
        };
      }),
      authType: 'alter',
    });
  }

  // trucate
  const truncateStatements = findTruncateFromCst(cst);
  const truncateTableNameCstNodes = truncateStatements
    .map(truncateStatement => cstFind(truncateStatement, ['tablePartitionPrefix', 'tableName[0]']))
    .filter(Boolean);

  const truncateTables = getCstNodesInfo(truncateTableNameCstNodes, true) as IToken[];

  if (truncateTables.length) {
    tableAndFieldsInfo.push({
      tables: truncateTables?.map(item => {
        return {
          tableName: item.image,
          tableRange: buildRange(item),
        };
      }),
      authType: 'insert',
    });
  }

  return tableAndFieldsInfo;
};
