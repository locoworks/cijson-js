// const runTransformation = require("./runTransformation");
import runTransformation from "./runTransformation";
import type { Config, Context } from "../interfaces";

const runTransformationsForFilters = async (config: Config, context: Context) => {
    // console.log("context!::>", context)
    // console.log("config!::>", config)

    const { payload } = context;
    // console.log("payload::>", payload);
    const resourceSpec = config.resources[context.resourceName];
    // console.log("resourceSpec::>", resourceSpec.filterBy, context.filterBy);
    const operations = [];
    // let filterBy = mentalAction.payload.filterBy || [];
    let filterBy = payload?.filterBy || context.filterBy || [];
    let newFilterBy: any = {};
    let filters = [];

    filterBy = filterBy.filter((f: any) => {
        return !f.op;
    });

    // console.log("filterBy", filterBy);

    filterBy.forEach((element: any) => {
        newFilterBy[element.attribute] = element.value;
    });

    for (let index = 0; index < filterBy.length; index++) {
        // console.log("inside for loop");
        const element = filterBy[index];
        const resourceSpecFilter = resourceSpec.filterBy[element.attribute];

        // console.log("resourceSpecFilter", resourceSpecFilter);
        if (resourceSpecFilter) {
            const transformations = resourceSpecFilter.transformations;
            // console.log("transformations", transformations);

            if (transformations !== undefined && transformations.length > 0) {
                let transformedValue = newFilterBy;
                // console.log("transformedValue", transformedValue);

                for (let index = 0; index < transformations.length; index++) {
                    const transformation = transformations[index];
                    // console.log("inside another loop transformation", transformation);

                    transformedValue = await runTransformation(
                        config,
                        context,
                        transformedValue,
                        transformation
                    );
                }

                // console.log("resourceSpecFilter", resourceSpecFilter);

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
                console.log("whereClause", whereClause);
                filters.push(whereClause);
            }
        }
    }
    console.log("filters", filters)
    context["filters"] = filters;
    return context;
};

export default runTransformationsForFilters;
