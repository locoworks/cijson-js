/* eslint-disable @typescript-eslint/no-explicit-any */
import validate from "validate.js";

validate.validators.custom_callback = function (
  value: any,
  options: any,
  key: any,
  attributes: any,
  constraints: any
) {
  console.log("constraints", constraints, options);
  // @ts-ignore
  return new validate.Promise(async function (resolve: any) {
    try {
      const result = await options["callback"].apply(null, [
        constraints["payload"],
      ]);

      if (result === true) {
        return resolve();
      }
      return resolve("^" + options["message"]);
    } catch (error) {
      resolve("^" + options["message"]);
    }
  });
};

const validator = (payload: any, constraints: any, pickOneError = false) => {
  return new Promise((resolve, reject) => {
    try {
      validate
        .async(payload, constraints, {
          // @ts-ignore
          payload: payload,
          format: "detailed",
        })
        .then(
          () => {
            resolve({});
          },
          (validateJsErrors) => {
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

            if (pickOneError) {
              for (const k in errors) {
                errors[k] = errors[k][0];
              }
            }

            response["errorCode"] = "InputNotValid";
            response["statusCode"] = 422;
            response["errors"] = errors;

            reject(response);
          }
        );
    } catch (error) {
      console.log("Error in validator.ts", error);
      throw error;
    }
  });
};

export default validator;
