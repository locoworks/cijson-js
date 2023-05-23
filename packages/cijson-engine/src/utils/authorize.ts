import type { Config, Context } from "../interfaces";

const authorize = (config: Config, context: Context) => {
  // const action = context.action;
  // const resourceName = context.resourceName;
  // const requiredBasicPermission = `${action}_${resourceName}`;

  //   if (
  //     locoAction.permissions !== "*" &&
  //     !locoAction.permissions.includes(requiredBasicPermission)
  //   ) {
  //     throw {
  //       statusCode: 403,
  //       message: "Forbidden",
  //     };
  //   }

  return context;
};

export default authorize;
