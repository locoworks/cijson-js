import { pickKeysFromObject } from "@locoworks/cijson-utils";

import { Config, Context } from "../../interfaces";

const generateOperations = async (config: Config, context: Context) => {
  const { payload } = context;
  const resourceSpec = config.resources[context.resourceName];
  const operations = [];
  const primaryColumns = context.primaryColumns || [];
  // const directColumns = context.directColumns || []

  const updateWhere = pickKeysFromObject(payload, primaryColumns);

  operations.push({
    resourceSpec: resourceSpec,
    type: "update",
    payload: payload,
    where: updateWhere,
  });

  // We have to run an insert query insert for has many via pivot relationships

  // const hasManyViaPivotColumns = locoAction.hasManyViaPivotColumns;

  // for (let index = 0; index < hasManyViaPivotColumns.length; index++) {
  //   const hasManyViaPivotColumn = hasManyViaPivotColumns[index];
  //   if (hasManyPayload[hasManyViaPivotColumn] !== undefined) {
  //     const attributeSpec = attributes.find((element) => {
  //       return element.identifier === hasManyViaPivotColumn;
  //     });

  //     if (
  //       attributeSpec.relation.sync !== undefined &&
  //       attributeSpec.relation.sync === false
  //     ) {
  //       continue;
  //     }

  //     const resourcePayload = hasManyPayload[hasManyViaPivotColumn];
  //     let deleteWhere = { ...attributeSpec.relation.filter } || {};
  //     deleteWhere[attributeSpec.relation.foreignKey] =
  //       payload[attributeSpec.relation.localKey];

  //     const insertObjects = resourcePayload.map((value) => {
  //       const insertObject = { ...deleteWhere };
  //       insertObject[attributeSpec.relation.resourceForeignKey] = value;
  //       return insertObject;
  //     });

  //     operations.push({
  //       resourceSpec: {
  //         meta: {
  //           table: attributeSpec.relation.pivotTable,
  //         },
  //       },
  //       operation: "delete",
  //       where: deleteWhere,
  //     });

  //     if (insertObjects.length > 0) {
  //       operations.push({
  //         resourceSpec: {
  //           meta: {
  //             table: attributeSpec.relation.pivotTable,
  //           },
  //         },
  //         operation: "insert",
  //         payload: insertObjects,
  //       });
  //     }
  //   }
  // }

  const filters: any = [];
  Object.keys(updateWhere).forEach((key) => {
    filters.push({
      column: key,
      op: "eq",
      value: updateWhere[key],
    });
  });

  operations.push({
    resourceSpec: resourceSpec,
    type: "select",
    filters: filters,
  });

  context["operations"] = operations;

  return context;
};

export default generateOperations;
