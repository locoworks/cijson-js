import validate from "validate.js";

import { Config, Context } from "../interfaces";
import runOperations from "../utils/runOperations";

validate.validators.outside_function = function (value: any, options: any) {
  // @ts-ignore
  return new validate.Promise(async function (resolve: any) {
    try {
      const result = await options.custom_validator(value, options);
      if (result === true) {
        return resolve();
      } else {
        return resolve(result);
      }
    } catch (error) {
      resolve("^" + "something went wrong, couldn't validate");
    }
  });
};

validate.validators.exists = function (
  value: any,
  options: any,
  key: any,
  attributes: any,
  cieData: any
) {
  let context: Context = cieData.context;
  const config: Config = cieData.config;

  // @ts-ignore
  return new validate.Promise(async function (resolve: any) {
    try {
      let count = 0;
      const operations = [];

      operations.push({
        resourceSpec: {
          persistence: {
            table: options.table,
          },
        },
        type: "count",
        where: options.where,
        whereNot: options.whereNot,
      });

      context["operations"] = operations;
      context = await runOperations(config, context);
      count = context["actionResult"];

      if (count > 0) {
        return resolve();
      }

      return resolve("^" + options["message"]);
    } catch (error) {
      console.log("error", error);
      resolve("^" + options["message"]);
    }
  });
};

validate.validators.unique = function (
  value: any,
  options: any,
  key: any,
  attributes: any,
  cieData: any
) {
  let context: Context = cieData.context;
  const config: Config = cieData.config;

  // @ts-ignore
  return new validate.Promise(async function (resolve: any) {
    try {
      let count = 0;
      const operations = [];

      operations.push({
        resourceSpec: {
          persistence: {
            table: options.table,
          },
        },
        type: "count",
        where: options.where,
        whereNot: options.whereNot,
      });

      context["operations"] = operations;

      context = await runOperations(config, context);

      count = context["actionResult"];

      if (count === 0) {
        return resolve();
      }

      return resolve("^" + options["message"]);
    } catch (error) {
      console.log("error", error);
      resolve("^" + options["message"]);
    }
  });
};

// validate.validators.custom_callback = function (
//   value,
//   options,
//   key,
//   attributes,
//   constraints
// ) {
//   return new validate.Promise(async function (resolve, reject) {
//     try {
//       let result = await options["callback"].apply(null, [
//         constraints["payload"],
//       ]);

//       if (result === true) {
//         return resolve();
//       }
//       return resolve("^" + options["message"]);
//     } catch (error) {
//       resolve("^" + options["message"]);
//     }
//   });
// };

// const validator = (payload: any, schema: any, pickOneError = false) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const v = new Validator({
//         useNewCustomCheckerFunction: true, // using new version
//       });

//       schema["$$async"] = true;

//       const check = v.compile(schema);

//       const res = await check(user);

//       validate
//         .async(payload, constraints, {
//           payload: payload,
//           format: "detailed",
//         })
//         .then(
//           () => {
//             resolve({});
//           },
//           (validateJsErrors) => {
//             var response = {
//               message: `Validation failed. ${validateJsErrors.length} error(s)`,
//             };

//             let errors = {};

//             validateJsErrors.forEach((d) => {
//               if (!errors[d.attribute]) {
//                 errors[d.attribute] = [];
//               }
//               errors[d.attribute].push(d.error);
//             });

//             if (pickOneError) {
//               for (k in errors) {
//                 errors[k] = errors[k][0];
//               }
//             }

//             response["errorCode"] = "InputNotValid";
//             response["statusCode"] = 422;
//             response["errors"] = errors;

//             reject(response);
//           }
//         );
//     } catch (error) {
//       throw error;
//     }
//   });
// };

const validator = (config: Config, context: Context, constraints: any) => {
  return new Promise((resolve, reject) => {
    try {
      validate
        .async(context.payload, constraints, {
          // @ts-ignore
          config: config,
          context: context,
          format: "detailed",
          fullMessages: true,
        })
        .then(
          () => {
            resolve({});
          },
          (validateJsErrors: any) => {
            // console.log("validateJsErrors", validateJsErrors);

            let response: any = {};
            const errors: any = {};

            response = {
              message: `Validation failed. ${validateJsErrors.length} error(s)`,
            };

            validateJsErrors.forEach((d: any) => {
              if (!errors[d.attribute]) {
                errors[d.attribute] = [];
              }
              errors[d.attribute].push(d.error);
            });

            // if (pickOneError) {
            //   for (let k in errors) {
            //     errors[k] = errors[k][0];
            //   }
            // }

            response["errorCode"] = "InputNotValid";
            response["statusCode"] = 422;
            response["errors"] = errors;

            reject(response);
          }
        );
    } catch (error) {
      reject(error);
    }
  });
};

export default validator;
