import ReadAction from "../actions/read";
import type { Config, Context } from "../interfaces";
import prepareRelationIncludes from "../utils/prepareRelationIncludes";

const fillHasManyWithPivotResources = async (config: Config, context: Context) => {
    const { hasManyViaPivotMappings } = context;
    const hasManyViaPivotColumns = context.hasManyViaPivotColumns || [];

    const includeRelations = prepareRelationIncludes(
        context,
        hasManyViaPivotColumns,
        hasManyViaPivotMappings
    );

    // Get the current data
    const currentData = context.actionResult["data"];

    for (let index = 0; index < hasManyViaPivotColumns.length; index++) {
        const operations = [];

        const column = hasManyViaPivotColumns[index];
        const columnSpec = { ...hasManyViaPivotMappings[column] };

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

        const whereClause: any = {};
        whereClause["op"] = "in";
        whereClause["column"] = columnSpec.relation.foreignKey;
        whereClause["value"] = allColumnValues;

        const filterWhereClauses: any = [];

        for (const key in filters) {
            if (Object.hasOwnProperty.call(filters, key)) {
                const value = filters[key];

                filterWhereClauses.push({
                    column: key,
                    op: "eq",
                    value: value,
                });
            }
        }

        filterWhereClauses.push(whereClause);

        operations.push({
            resourceSpec: {
                persistence: {
                    table: columnSpec.relation.pivotTable,
                },
            },
            type: "select",
            filters: filterWhereClauses,
            selectColumns: "*",
        });

        let relationData = await config.operator.run(operations || []);
        relationData = relationData["data"];

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

            const resourceKeys = hasManyData.map((h: any) => {
                return h[columnSpec.relation.resourceForeignKey];
            });

            let resourceWhereClause: any = {};
            resourceWhereClause["op"] = "in";
            resourceWhereClause["column"] = columnSpec.relation.resourceLocalKey;
            resourceWhereClause["value"] = resourceKeys;

            let operations = [];
            operations.push({
                resourceSpec: resourceSpec,
                type: "select",
                filters: [resourceWhereClause],
                selectColumns: "*",
            });

            let resourceData = await config.operator.run(operations);
            resourceData = resourceData["data"];

            currentDataElement[columnSpec.identifier] = resourceData;
            currentData[indexCurrent] = currentDataElement;
        }
    }

    return context;
};

export default fillHasManyWithPivotResources;
