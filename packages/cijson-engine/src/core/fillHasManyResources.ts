import ReadAction from "../actions/read";
import type { Config, Context } from "../interfaces";
import prepareRelationIncludes from "../utils/prepareRelationIncludes";

const fillHasManyResources = async (config: Config, context: Context) => {
  const { hasManyMappings } = context;
  const hasManyColumns = context.hasManyColumns || [];
  const includeRelations = prepareRelationIncludes(
    context,
    hasManyColumns,
    hasManyMappings
  );

  //   console.log("includeRelations", includeRelations);

  // Get the current data

  const currentData = context.actionResult["data"];

  if (currentData.length === 0) {
    return context;
  }

  for (let index = 0; index < hasManyColumns.length; index++) {
    const column = hasManyColumns[index];
    const columnSpec = hasManyMappings[column];
    if (!includeRelations.includes(columnSpec.identifier)) {
      continue;
    }
    const localKey = columnSpec.relation.localKey;
    const filters = columnSpec.relation.filter;
    // console.log("localKey", localKey);

    let allColumnValues = currentData.map((d: any) => {
      return d[localKey];
    });
    allColumnValues = [...new Set(allColumnValues)];
    // console.log("columnSpec", columnSpec);
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
    // console.log("filterWhereClauses", filterWhereClauses);
    const internalPayload = {
      apiConfig: {
        includeRelations: [],
      },
      pagination: {
        per_page: undefined,
        page: 1,
      },
      sortBy: sortBy,
      filterBy: filterWhereClauses,
    };
    // console.log("internalPayload", internalPayload);

    const internalRelationData: any = await ReadAction(config, {
      resourceName: resourceSpec.name,
      action: "read",
      payload: internalPayload,
    });

    // console.log("internalRelationData", internalRelationData);
    const relationData = internalRelationData["actionResult"]["data"];
    for (
      let indexCurrent = 0;
      indexCurrent < currentData.length;
      indexCurrent++
    ) {
      const currentDataElement = currentData[indexCurrent];
      const hasManyData = relationData.filter((relationDataElement: any) => {
        return (
          currentDataElement[localKey] ===
          relationDataElement[columnSpec.relation.foreignKey]
        );
      });
      currentDataElement[columnSpec.identifier] = hasManyData;
      currentData[indexCurrent] = currentDataElement;
    }
  }

  return context;
};

export default fillHasManyResources;
