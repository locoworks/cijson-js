import sqlBricks from "mysql-bricks";

/* eslint-disable  @typescript-eslint/no-explicit-any */
interface Operator {
  instance: any;
  pscale: any;
  run(operations: any[]): any;
  setInstance(instance: any, pscale: any): void;
}

const addFilters = (sDataBuilder: any, filters: any) => {
  for (let index = 0; index < filters.length; index++) {
    const filter = filters[index];
    switch (filter.op.toLowerCase()) {
      // case "like":
      //   sDataBuilder = sDataBuilder.where(
      //     knex.raw(`LOWER(${filter.column})`),
      //     "LIKE",
      //     `%${filter.value.toLowerCase()}%`
      //   );
      //   break;

      // case "gte":
      //   dataBuilder = dataBuilder.where(filter.column, ">=", `${filter.value}`);
      //   break;

      // case "in":
      //   // console.log("in col", filter.value);
      //   dataBuilder = dataBuilder.whereIn(filter.column, filter.value);
      //   break;

      case "noteq":
        sDataBuilder = sDataBuilder.where(
          sqlBricks.notEq(filter.column, `${filter.value}`)
        );
        break;

      case "eq":
        sDataBuilder = sDataBuilder.where(filter.column, `${filter.value}`);
        break;

      case "json_path_like":
        console.log("Filter", filter);
        let json_path_like_columnArray = filter.column.split(".");
        let json_path_like_json_col = json_path_like_columnArray[0];
        json_path_like_columnArray[0] = "$";
        let json_path_like_json_path = json_path_like_columnArray.join(".");
        console.log("json_path_like_json_path", json_path_like_json_path);
        sDataBuilder = sDataBuilder.where(
          sqlBricks.like(
            `LOWER(${json_path_like_json_col}->'${json_path_like_json_path}')`,
            `%${filter.value.toLowerCase()}%`
          )
        );
        break;

      //   case "json_path_comp":
      //     let json_path_comp_columnArray = filter.column.split(".");
      //     let json_path_comp_json_col = json_path_comp_columnArray[0];
      //     json_path_comp_columnArray[0] = "$";
      //     let json_path_comp_json_path = json_path_comp_columnArray.join(".");

      //     dataBuilder = dataBuilder.where(
      //       knex.raw(
      //         `lower(jsonb_path_query_first("${json_path_comp_json_col}", '${json_path_comp_json_path}') #>> '{}')`
      //       ),
      //       filter.comparator,
      //       filter.value
      //     );

      //     break;

      //   case "json_path_not_contains":
      //     let json_path_not_contains_columnArray = filter.column.split(".");
      //     let json_path_not_contains_json_col =
      //       json_path_not_contains_columnArray[0];
      //     json_path_not_contains_columnArray.shift();
      //     let json_path_not_contains_json_path =
      //       json_path_not_contains_columnArray.join(".");

      //     var json_path_not_contains_tempObject = {};
      //     var json_path_not_contains_container =
      //       json_path_not_contains_tempObject;
      //     json_path_not_contains_json_path.split(".").map((k, i, values) => {
      //       json_path_not_contains_container = json_path_not_contains_container[
      //         k
      //       ] = i == values.length - 1 ? filter.value : {};
      //     });

      //     dataBuilder = dataBuilder.whereNot(
      //       json_path_not_contains_json_col,
      //       "@>",
      //       JSON.stringify(json_path_not_contains_tempObject)
      //     );

      //     break;

      //   case "json_path_contains":
      //     let json_path_contains_columnArray = filter.column.split(".");
      //     let json_path_contains_json_col = json_path_contains_columnArray[0];
      //     json_path_contains_columnArray.shift();
      //     let json_path_contains_json_path =
      //       json_path_contains_columnArray.join(".");

      //     var json_path_contains_tempObject = {};
      //     var json_path_contains_container = json_path_contains_tempObject;
      //     json_path_contains_json_path.split(".").map((k, i, values) => {
      //       json_path_contains_container = json_path_contains_container[k] =
      //         i == values.length - 1 ? filter.value : {};
      //     });
      //     dataBuilder = dataBuilder.where(
      //       json_path_contains_json_col,
      //       "@>",
      //       JSON.stringify(json_path_contains_tempObject)
      //     );

      //     break;

      default:
        break;
    }
  }

  return sDataBuilder;
};

class PScaleOperator implements Operator {
  instance: any;
  pscale: any;

  setInstance(instance: any, pscale: any) {
    this.instance = instance;
    this.pscale = pscale;
  }

  async run(operations: any[]) {
    // console.log("run", operations);

    const results = await this.pscale.transaction(async (tx: any) => {
      let opResult: any = [];

      for (
        let dbOpsCounter = 0;
        dbOpsCounter < operations.length;
        dbOpsCounter++
      ) {
        const dbOp = operations[dbOpsCounter];
        dbOp["table"] = dbOp.resourceSpec.persistence.table;
        const deleted_at_column =
          dbOp.resourceSpec.persistence.deleted_at_column || "deleted_at";

        let filters;
        let dataBuilder;
        let totalBuilder;
        let queryPrinter;
        let dataResult;
        let totalResult;
        let total;
        let builtResult;

        switch (dbOp.type) {
          case "soft_delete":
            filters = dbOp.filters;
            dataBuilder = sqlBricks.update(dbOp.table, dbOp.payload);
            dataBuilder = addFilters(dataBuilder, filters);
            dataBuilder = dataBuilder.where(dbOp.where);

            queryPrinter = dataBuilder.clone();

            dataResult = await tx.execute(dataBuilder.clone().toString(), []);

            builtResult = {
              data: dataResult.rows,
              debug: {
                queryPrinter: queryPrinter.toString(),
              },
            };

            opResult = builtResult;

            break;

          case "delete":
            filters = dbOp.filters;
            dataBuilder = sqlBricks.delete(dbOp.table);
            dataBuilder = addFilters(dataBuilder, filters);
            dataBuilder = dataBuilder.where(dbOp.where);

            queryPrinter = dataBuilder.clone();
            dataResult = await tx.execute(dataBuilder.clone().toString(), []);

            builtResult = {
              data: dataResult.rows,
              debug: {
                queryPrinter: queryPrinter.toString(),
              },
            };

            opResult = builtResult;

            break;

          case "insert":
            dataBuilder = await sqlBricks.insert(dbOp.table, dbOp.payload);

            queryPrinter = dataBuilder.clone();

            opResult = await tx.execute(dataBuilder.clone().toString(), []);

            break;

          case "count":
            totalBuilder = sqlBricks
              .select("COUNT(*)")
              .from(dbOp.table)
              .where(sqlBricks.isNull(deleted_at_column));

            if (Object.keys(dbOp.where).length > 0) {
              totalBuilder = totalBuilder.where(dbOp.where);
            }
            if (Object.keys(dbOp.whereNot).length > 0) {
              totalBuilder = totalBuilder.where(sqlBricks.not(dbOp.whereNot));
            }

            queryPrinter = totalBuilder.clone();

            totalResult = await tx.execute(totalBuilder.clone().toString(), []);
            opResult = parseInt(totalResult.rows[0]["count(*)"]);

            break;

          case "update":
            dataBuilder = await sqlBricks
              .update(dbOp.table, dbOp.payload)
              .where(dbOp.where);

            queryPrinter = dataBuilder.clone();

            opResult = await tx.execute(dataBuilder.clone().toString(), []);

            // console.log("opResult update ---", opResult);

            break;

          case "select_first":
            dataBuilder = await sqlBricks(dbOp.table)
              .select("*")
              .where(dbOp.where)
              .first();

            opResult = await tx.execute(dataBuilder.clone().toString(), []);

            // console.log("opResult", opResult.rows);

            break;

          case "select":
            filters = dbOp.filters;

            if (dbOp.selectColumns) {
              dataBuilder = sqlBricks.select(dbOp.selectColumns);
            } else {
              dataBuilder = sqlBricks.select("*");
            }

            dataBuilder = dataBuilder
              .from(dbOp.table)
              .where(sqlBricks.isNull(deleted_at_column));

            totalBuilder = sqlBricks
              .select("COUNT(*)")
              .from(dbOp.table)
              .where(sqlBricks.isNull(deleted_at_column));

            // dataBuilder = this.instance(dbOp.table).whereNull(
            //   deleted_at_column
            // );
            // dataBuilder = addFilters(this.instance, dataBuilder, filters);
            dataBuilder = addFilters(dataBuilder, filters);
            totalBuilder = addFilters(totalBuilder, filters);

            if (dbOp.sortBy) {
              let orderByClause = dbOp.sortBy
                .map((s: any) => {
                  return `${s.column} ${s.order}`;
                })
                .join(", ");
              if (orderByClause !== "") {
                dataBuilder = dataBuilder.orderBy(orderByClause);
              }
            }

            if (dbOp.limit !== undefined && dbOp.limit !== 999) {
              dataBuilder = dataBuilder.limit(dbOp.limit);
            }

            if (dbOp.offset && dbOp.limit !== undefined && dbOp.limit !== 999) {
              dataBuilder = dataBuilder.offset(dbOp.offset);
            }

            queryPrinter = dataBuilder.clone();

            dataResult = await tx.execute(dataBuilder.clone().toString(), []);
            totalResult = await tx.execute(totalBuilder.clone().toString(), []);
            total = parseInt(totalResult.rows[0]["count(*)"]);

            // console.log("dataBuilder", dataResult);
            // console.log("totalResult", totalResult);
            // console.log("totalBuilder", totalBuilder.clone().toString());

            builtResult = {
              data: dataResult.rows,
              meta: {
                total: total,
                offset: dbOp.offset,
                page: dbOp.page,
                per_page: dbOp.limit,
                total_page: Math.ceil(total / dbOp.limit),
              },
              debug: {
                queryPrinter: queryPrinter.toString(),
              },
            };

            // console.log("builtResult", builtResult);

            opResult = builtResult;

            break;
        }
      }

      return opResult;
    });

    // console.log("pscale results ---->", results);

    return results;
  }
}

export default PScaleOperator;
