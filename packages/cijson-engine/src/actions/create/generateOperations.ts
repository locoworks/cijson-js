import { pickKeysFromObject } from "@locoworks/cijson-utils";

import { Config, Context } from "../../interfaces";

const generateOperations = async (config: Config, context: Context) => {
  const { payload } = context;
  const resourceSpec = config.resources[context.resourceName];
  const operations = [];
  const primaryColumns = context.primaryColumns || [];

  operations.push({
    resourceSpec: resourceSpec,
    type: "insert",
    payload: payload,
  });

  const getWhere = pickKeysFromObject(payload, primaryColumns);

  // console.log("create filter getWhere", primaryColumns, getWhere);

  const filters: any = [];
  Object.keys(getWhere).forEach((key) => {
    filters.push({
      column: key,
      op: "eq",
      value: getWhere[key],
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
