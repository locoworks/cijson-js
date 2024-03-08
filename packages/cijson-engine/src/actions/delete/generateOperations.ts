import { pickKeysFromObject } from "@locoworks/cijson-utils";

import { Config, Context, FilterBy } from "../../interfaces";

const generateOperations = async (config: Config, context: Context) => {
  const { payload, filterBy, addlFilterBy } = context;
  const resourceSpec = config.resources[context.resourceName];
  const operations = [];
  const primaryColumns = context.primaryColumns || [];
  // const directColumns = context.directColumns || []

  const deleteWhere = pickKeysFromObject(payload, primaryColumns);
  let filters: any = [];

  if (filterBy !== undefined) {
    filters = filterBy
      .filter((f: FilterBy) => {
        return f.op;
      })
      .map((f: FilterBy) => {
        return {
          column: f.attribute.toLowerCase(),
          op: f.op,
          value: f.value,
          comparator: f.comparator,
        };
      });
  }

  filters = [...filters];

  if (resourceSpec.softDelete === false) {
    operations.push({
      resourceSpec: resourceSpec,
      type: "delete",
      where: deleteWhere,
      filters: filters,
      addlFilterBy: addlFilterBy || undefined,
    });
  } else {
    operations.push({
      resourceSpec: resourceSpec,
      type: "soft_delete",
      payload: payload,
      filters: filters,
      addlFilterBy: addlFilterBy || undefined,
      where: deleteWhere,
    });
  }

  context["operations"] = operations;

  return context;
};

export default generateOperations;
