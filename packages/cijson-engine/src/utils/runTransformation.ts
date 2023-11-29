// const pickKeysFromObject = requireUtil("pickKeysFromObject");
import { pickKeysFromObject } from "@locoworks/cijson-utils";
import type { Config, Context } from "../interfaces";


const runTransformation = async (config: Config, context: Context, valueFromSource: any, transformation: any) => {
    let transformedValue = valueFromSource;

    const operations = [];
    let resourceSpec = null;

    if (transformation.resource) {
        resourceSpec = config.resources[transformation.resource];
    }

    switch (transformation.operation) {
        case "alias":
            transformedValue = transformedValue[transformation.findByKey];
            break;

        case "find":
            let getWhere: any = {};
            getWhere[transformation.findByKey] =
                valueFromSource[transformation.findByValue];
            //   console.log("here to find", valueFromSource, transformation);

            operations.push({
                resourceSpec: resourceSpec,
                operation: "select_first",
                where: getWhere,
            });

            // transformedValue = await mentalConfig.operator(operations);
            transformedValue = await config.operator.run(operations || []);

            transformedValue = pickKeysFromObject(
                transformedValue,
                Array.isArray(transformation.extract)
                    ? transformation.extract
                    : [transformation.extract]
            );

            break;

        case "in":
            let whereClause: any = {};
            whereClause["op"] = "in";
            whereClause["column"] = transformation.findByKey;
            whereClause["value"] = valueFromSource[transformation.findByValue];

            operations.push({
                resourceSpec: resourceSpec,
                type: "select",
                filters: [whereClause],
                selectColumns: [transformation.extract],
            });

            // console.log("RUNTRANSFORMATION---operations::>", operations);

            transformedValue = await config.operator.run(operations || []);

            // console.log("RUNTRANSFORMATION---transformedValue::>", transformedValue);

            transformedValue = transformedValue.data.map((t: any) => {
                return t[transformation.extract];
            });

            let arrangedTransformedValue: any = {};
            arrangedTransformedValue[transformation.findByValue] = transformedValue;
            transformedValue = arrangedTransformedValue;

            break;

        default:
            break;
    }

    //   console.log("ope", operations);

    // console.log("result", transformedValue);

    return transformedValue;
};

export default runTransformation;
