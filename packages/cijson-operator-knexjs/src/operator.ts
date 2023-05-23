/* eslint-disable  @typescript-eslint/no-explicit-any */
interface Operator {
  instance: any;
  run(operations: any[]): any;
  setInstance(instance: any): void;
}

const addFilters = (knex: any, dataBuilder: any, filters: any) => {
  for (let index = 0; index < filters.length; index++) {
    const filter = filters[index];
    switch (filter.op.toLowerCase()) {
      case "like":
        dataBuilder = dataBuilder.where(
          knex.raw(`LOWER(${filter.column})`),
          "LIKE",
          `%${filter.value.toLowerCase()}%`
        );
        break;

      case "gte":
        dataBuilder = dataBuilder.where(filter.column, ">=", `${filter.value}`);
        break;

      case "in":
        // console.log("in col", filter.value);
        dataBuilder = dataBuilder.whereIn(filter.column, filter.value);
        break;

      case "eq":
        dataBuilder = dataBuilder.where(filter.column, "=", `${filter.value}`);
        break;

      //   case "json_path_like":
      //     let json_path_like_columnArray = filter.column.split(".");
      //     let json_path_like_json_col = json_path_like_columnArray[0];
      //     json_path_like_columnArray[0] = "$";
      //     let json_path_like_json_path = json_path_like_columnArray.join(".");
      //     dataBuilder = dataBuilder.where(
      //       knex.raw(
      //         `lower(jsonb_path_query_first("${json_path_like_json_col}", '${json_path_like_json_path}') #>> '{}')`
      //       ),
      //       "LIKE",
      //       `%${filter.value.toLowerCase()}%`
      //     );
      //     break;

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

  return dataBuilder;
};

class KnexJSOperator implements Operator {
  instance: any;

  setInstance(instance: any) {
    this.instance = instance;
  }

  async run(operations: any[]) {
    // console.log("run", operations);

    return await this.instance.transaction(async (trx: any) => {
      let opResult: any = {};

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
            dataBuilder = trx(dbOp.table);
            dataBuilder = addFilters(this.instance, dataBuilder, filters);
            dataBuilder = dataBuilder
              .where(dbOp.where)
              .update(dbOp.payload)
              .returning("*");

            queryPrinter = dataBuilder.clone();

            if (process.env.PRINT_QUERY === "true") {
              console.log("queryPrinter", queryPrinter.toString());
            }

            dataResult = await dataBuilder;

            builtResult = {
              data: dataResult,
              debug: {
                queryPrinter: queryPrinter.toString(),
              },
            };

            opResult = builtResult;

            break;

          case "delete":
            filters = dbOp.filters;
            dataBuilder = trx(dbOp.table);
            dataBuilder = addFilters(this.instance, dataBuilder, filters);

            dataBuilder = dataBuilder.where(dbOp.where).delete();

            queryPrinter = dataBuilder.clone();

            if (process.env.PRINT_QUERY === "true") {
              console.log("queryPrinter", queryPrinter.toString());
            }

            dataResult = await dataBuilder;

            builtResult = {
              data: dataResult,
              debug: {
                queryPrinter: queryPrinter.toString(),
              },
            };

            opResult = builtResult;

            break;

          case "insert":
            dataBuilder = trx(dbOp.table).insert(dbOp.payload).returning("*");

            queryPrinter = dataBuilder.clone();

            if (process.env.PRINT_QUERY === "true") {
              console.log("queryPrinter", queryPrinter.toString());
            }

            opResult = await dataBuilder;
            break;

          case "count":
            dataBuilder = trx(dbOp.table)
              .where(dbOp.where)
              .whereNot(dbOp.whereNot)
              .whereNull(deleted_at_column)
              .count({ count: "*" })
              .first();

            queryPrinter = dataBuilder.clone();

            if (process.env.PRINT_QUERY === "true") {
              console.log("queryPrinter", queryPrinter.toString());
            }

            opResult = await dataBuilder;
            opResult = parseInt(opResult.count);
            break;

          case "update":
            // console.log("dbOp.where", dbOp.where, dbOp.payload);

            dataBuilder = trx(dbOp.table)
              .where(dbOp.where)
              .update(dbOp.payload)
              .returning("*");

            queryPrinter = dataBuilder.clone();

            if (process.env.PRINT_QUERY === "true") {
              console.log("queryPrinter", queryPrinter.toString());
            }

            opResult = await dataBuilder;
            break;

          case "select_first":
            opResult = await trx(dbOp.table)
              .where(dbOp.where)
              .select("*")
              .first();
            break;

          case "select":
            filters = dbOp.filters;
            dataBuilder = trx(dbOp.table).whereNull(deleted_at_column);
            dataBuilder = addFilters(this.instance, dataBuilder, filters);

            totalBuilder = dataBuilder.clone();
            // const facetBuilder = dataBuilder.clone();

            if (dbOp.sortBy) {
              dataBuilder = dataBuilder.orderBy(dbOp.sortBy);
            }

            if (dbOp.selectColumns) {
              dataBuilder = dataBuilder.select(dbOp.selectColumns);
            }

            if (dbOp.limit !== undefined && dbOp.limit !== 999) {
              dataBuilder = dataBuilder.limit(dbOp.limit);
            }

            if (dbOp.offset && dbOp.limit !== undefined && dbOp.limit !== 999) {
              dataBuilder = dataBuilder.offset(dbOp.offset);
            }

            queryPrinter = dataBuilder.clone();

            builtResult = {};
            dataResult = await dataBuilder;
            totalResult = await totalBuilder.count({ count: "*" }).first();
            total = parseInt(totalResult.count);

            // console.log("process.env.PRINT_QUERY", process.env.PRINT_QUERY);

            if (process.env.PRINT_QUERY === "true") {
              console.log("queryPrinter", queryPrinter.toString());
            }

            builtResult = {
              data: dataResult,
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

            opResult = builtResult;
            break;
        }
      }

      return opResult;
    });
  }
}

export default KnexJSOperator;
