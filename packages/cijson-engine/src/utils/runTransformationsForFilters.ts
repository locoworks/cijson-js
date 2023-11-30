import runTransformation from "./runTransformation";
import type { Config, Context } from "../interfaces";

const runTransformationsForFilters = async (config: Config, context: Context) => {
    const { payload } = context;
    const resourceSpec = config.resources[context.resourceName];
    const operations = [];
    let filterBy = payload?.filterBy || context.filterBy || [];
    let newFilterBy: any = {};
    let filters = [];

    filterBy = filterBy.filter((f: any) => {
        return !f.op;
    });

    filterBy.forEach((element: any) => {
        newFilterBy[element.attribute] = element.value;
    });

    for (let index = 0; index < filterBy.length; index++) {
        const element = filterBy[index];
        const resourceSpecFilter = resourceSpec.filterBy[element.attribute];

        if (resourceSpecFilter) {
            const transformations = resourceSpecFilter.transformations;

            if (transformations !== undefined && transformations.length > 0) {
                let transformedValue = newFilterBy;

                for (let index = 0; index < transformations.length; index++) {
                    const transformation = transformations[index];
                    transformedValue = await runTransformation(
                        config,
                        context,
                        transformedValue,
                        transformation
                    );
                }

                let whereClause: any = {};
                whereClause["op"] = "in";
                whereClause["column"] = resourceSpecFilter.localKey;
                whereClause["value"] = transformedValue[element.attribute];
                filters.push(whereClause);
            } else {
                let whereClause: any = {};
                whereClause["op"] = "in";
                whereClause["column"] = resourceSpecFilter.localKey;
                whereClause["value"] = element.value;
                filters.push(whereClause);
            }
        }
    }
    context["filters"] = filters;
    return context;
};

export default runTransformationsForFilters;
