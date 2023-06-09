import {
  hashPassword as generateHashForPassword,
  resolveByDot,
} from "@locoworks/cijson-utils";

import { APIPayload, Config, Context } from "../interfaces";
import generateRandomNumber from "./generateRandomNumber";
import { generateSCRUIdWithPrefix } from "./generateSCRUId";

const generateAttribute = async (
  config: Config,
  context: Context,
  identifier: any,
  value: any,
  generator: any
) => {
  // const { locoAction, resourceModels, locoConfig } = context;
  // let payload = locoAction.payload;
  // const resourceSpec = resourceModels[locoAction.resource];

  switch (generator.type) {
    case "password":
      value = await generateHashForPassword(value);
      break;

    case "scru_pid":
      value = generateSCRUIdWithPrefix(generator.prefix);
      break;

    case "rand_number": {
      const otpLength = generator.length || 6;
      value = generateRandomNumber(otpLength);
      break;
    }

    case "datetime":
      // value = new Date().toISOString();
      value = new Date().toISOString().replace("T", " ").replace("Z", "");
      break;

    case "future_datetime": {
      const date = new Date();
      date.setMinutes(date.getMinutes() + generator.minutes);
      value = date.toISOString();
      break;
    }

    // case "custom_generator":
    //   if (outsideGeneratorFunctions[generator["value"]] !== undefined) {
    //     value = await outsideGeneratorFunctions[generator["value"]](
    //       resourceSpec,
    //       identifier,
    //       payload[generator["source"]]
    //     );
    //   } else {
    //     throw `custom_generator ${generator["value"]} doesn't exist`;
    //   }
    //   break;

    default:
      break;
  }

  return value;
};

const generate = async (config: Config, context: Context) => {
  const resourceSpec = config.resources[context.resourceName];
  const attributes = resourceSpec.attributes;
  const action = context.action;
  const payload: APIPayload = context.payload || {};

  const attributesWithOperations = attributes.filter((a: any) => {
    return a.operations !== undefined;
  });

  console.log("resourceSpec......", JSON.stringify(resourceSpec));

  for (
    let forIndex = 0;
    forIndex < attributesWithOperations.length;
    forIndex++
  ) {
    const attribute = attributesWithOperations[forIndex];
    const identifier = attribute.identifier;
    const operationKeys = Object.keys(attribute.operations);
    let generators: any = [];

    for (let index = 0; index < operationKeys.length; index++) {
      const operationKey = operationKeys[index];
      const operationActions = operationKey.split(",");

      if (operationActions.includes("*") || operationActions.includes(action)) {
        let attributeGens: any = resolveByDot(
          `operations.${operationKey}.generate`,
          attribute
        );

        if (Array.isArray(attributeGens) === false) {
          if (attributeGens !== undefined) {
            attributeGens = [
              {
                type: attributeGens,
              },
            ];
          }
        }

        if (attributeGens !== undefined) {
          generators = [...attributeGens];
        }

        // console.log("generators", generators);
      }
    }

    if (generators.length > 0) {
      let value = payload[identifier] || undefined;
      // console.log("use generators", identifier, payload, generators);
      for (let index = 0; index < generators.length; index++) {
        const generator = generators[index];
        value = await generateAttribute(
          config,
          context,
          identifier,
          value,
          generator
        );
      }

      if (value !== undefined) {
        payload[identifier] = value;
      }
    }
  }

  context.payload = payload;
  return context;
};

export default generate;
