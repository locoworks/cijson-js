import ReadAction from "../actions/read";
import type { Config, Context } from "../interfaces";
import prepareRelationIncludes from "../utils/prepareRelationIncludes";

const fillBelongsToOneResources = async (config: Config, context: Context) => {
  const { belongsToOneMappings } = context;
  const belongsToOneColumns = context.belongsToOneColumns || [];

  const includeRelations = prepareRelationIncludes(
    context,
    belongsToOneColumns,
    belongsToOneMappings
  );

  // Get the current data
  const currentData = context.actionResult["data"];

  if (currentData.length === 0) {
    return context;
  }

  for (let index = 0; index < belongsToOneColumns.length; index++) {
    const column = belongsToOneColumns[index];
    const columnSpec = belongsToOneMappings[column];

    if (!includeRelations.includes(columnSpec.identifier)) {
      continue;
    }

    const localKey = columnSpec.relation.localKey;
    const filters = columnSpec.relation.filter;

    let allColumnValues = currentData.map((d: any) => {
      return d[localKey];
    });

    allColumnValues = [...new Set(allColumnValues)];
    const resourceSpec = config.resources[columnSpec.relation.resource];

    if (resourceSpec === undefined) {
      return context;
    }

    const whereClause: any = {};
    whereClause["op"] = "in";
    whereClause["attribute"] = columnSpec.relation.foreignKey;
    whereClause["value"] = allColumnValues;

    const filterWhereClauses: any = [];

    for (const key in filters) {
      if (Object.hasOwnProperty.call(filters, key)) {
        const value = filters[key];

        filterWhereClauses.push({
          attribute: key,
          op: "eq",
          value: value,
        });
      }
    }

    filterWhereClauses.push(whereClause);

    const sortBy = resourceSpec.sortBy || [
      { attribute: "created_at", order: "desc" },
    ];

    const internalPayload = {
      apiConfig: {
        includeRelations: [],
      },
      pagination: {
        per_page: 1,
        page: 1,
      },
      sortBy: sortBy,
      filterBy: filterWhereClauses,
    };
    const internalRelationData: any = await ReadAction(config, {
      resourceName: resourceSpec.name,
      action: "read",
      payload: internalPayload,
    });

    const relationData = internalRelationData["actionResult"]["data"];

    for (
      let indexCurrent = 0;
      indexCurrent < currentData.length;
      indexCurrent++
    ) {
      const currentDataElement = currentData[indexCurrent];

      const belongsToOneData = relationData.filter(
        (relationDataElement: any) => {
          return (
            currentDataElement[localKey] ===
            relationDataElement[columnSpec.relation.foreignKey]
          );
        }
      );

      if (belongsToOneData.length > 0) {
        currentDataElement[columnSpec.identifier] = belongsToOneData[0];
        currentData[indexCurrent] = currentDataElement;
      }
    }
  }

  return context;
};

export default fillBelongsToOneResources;
