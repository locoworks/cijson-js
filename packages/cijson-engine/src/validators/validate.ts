import { resolveByDot } from "@locoworks/cijson-utils";

import { APIPayload, Config, Context } from "../interfaces";
import validator from "./validator";

const addToConstraints = (
  config: Config,
  context: Context,
  constraints: any,
  attribute: any,
  validators: any
) => {
  const payload: APIPayload = context.payload || {};
  const attribute_identifier = attribute.relation
    ? attribute.relation.resolveTo
    : attribute.identifier;

  const validatorTypes = validators.map((v: any) => {
    return v.type;
  });

  constraints[attribute_identifier] = {};

  if (
    validatorTypes.includes("optional") &&
    payload["attribute_identifier"] === undefined
  ) {
    return {};
  }

  for (let vCounter = 0; vCounter < validators.length; vCounter++) {
    const validator = validators[vCounter];
    if (validator.type === "required") {
      constraints[attribute_identifier]["presence"] = {
        allowEmpty: false,
        message: `^Please enter ${attribute.label || attribute_identifier}`,
      };
    }

    if (validator.type === "uuid") {
      constraints[attribute_identifier]["presence"] = {
        allowEmpty: false,
        message: `^Please enter ${attribute.label}`,
      };

      constraints[attribute_identifier]["format"] = {
        pattern:
          "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
        message: `^Please enter valid ${attribute.label} matching an uuid`,
      };
    }

    if (validator.type === "date_iso") {
      constraints[attribute_identifier]["format"] = {
        /* eslint-disable max-len */
        pattern:
          /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,
        /* eslint-enable max-len */
        message: `^Please enter valid ${attribute.label} matching date_iso`,
      };
    }

    if (validator.type === "regex") {
      constraints[attribute_identifier]["format"] = {
        pattern: validator.value,
        message: `^Please enter valid ${attribute.label} matching ${validator.value}`,
      };
    }

    if (validator.type === "within") {
      constraints[attribute_identifier]["inclusion"] = {
        within: validator.value,
        message: `^Please choose valid type within ${JSON.stringify(
          validator.value
        )}`,
      };
    }

    if (validator.type === "unique") {
      const where: any = {};
      const whereNot: any = {};

      if (
        payload[attribute_identifier] !== undefined &&
        payload[attribute_identifier] !== ""
      ) {
        const includeAttributes = validator.includeAttributes || [];
        const excludeAttributes = validator.excludeAttributes || [];

        where[validator.column || attribute_identifier] =
          payload[attribute_identifier];

        for (let index = 0; index < includeAttributes.length; index++) {
          const includeAttribute = includeAttributes[index];
          if (payload[includeAttribute]) {
            where[includeAttribute] = payload[includeAttribute];
          }
        }

        for (let index = 0; index < excludeAttributes.length; index++) {
          const excludeAttribute = excludeAttributes[index];
          if (payload[excludeAttribute]) {
            whereNot[excludeAttribute] = payload[excludeAttribute];
          }
        }

        constraints[attribute_identifier]["unique"] = {
          message: `${attribute_identifier} should be unique.`,
          context: context,
          table: validator.table,
          where: where,
          whereNot: whereNot,
        };
      }
    }

    if (validator.type === "exists") {
      if (
        payload[attribute_identifier] !== undefined &&
        payload[attribute_identifier] !== ""
      ) {
        const where: any = {};
        const whereNot: any = {};
        const includeAttributes = validator.includeAttributes || [];
        const excludeAttributes = validator.excludeAttributes || [];
        where[validator.column || attribute_identifier] =
          payload[attribute_identifier];

        for (let index = 0; index < includeAttributes.length; index++) {
          const includeAttribute = includeAttributes[index];
          if (payload[includeAttribute]) {
            where[includeAttribute] = payload[includeAttribute];
          }
        }

        for (let index = 0; index < excludeAttributes.length; index++) {
          const excludeAttribute = excludeAttributes[index];
          if (payload[excludeAttribute]) {
            whereNot[excludeAttribute] = payload[excludeAttribute];
          }
        }

        constraints[attribute_identifier]["exists"] = {
          message: `${attribute_identifier} should exist.`,
          context: context,
          table: validator.table,
          where: where,
          whereNot: whereNot,
        };
      }
    }

    const outsideValidatorFunctions = config.validators;

    if (validator.type === "custom_validator") {
      if (outsideValidatorFunctions[validator.value] !== undefined) {
        validator["custom_validator"] =
          outsideValidatorFunctions[validator.value];
        constraints[attribute_identifier]["outside_function"] = validator;
      } else {
        validator["custom_validator"] = () => {
          return `^custom_validator ${validator.value} doesn't exist`;
        };
        constraints[attribute_identifier]["outside_function"] = validator;
      }
    }
  }

  return constraints;
};

const validate = async (config: Config, context: Context) => {
  const resourceSpec = config.resources[context.resourceName];
  const attributes = resourceSpec.attributes;
  const action = context.action;
  const payload: APIPayload = context.payload || {};

  const attributesWithOperations = attributes.filter((a: any) => {
    return a.operations !== undefined;
  });

  const payloadObjectKeys = Object.keys(payload);
  let constraints: any = {};

  for (
    let forIndex = 0;
    forIndex < attributesWithOperations.length;
    forIndex++
  ) {
    const attribute = attributesWithOperations[forIndex];
    const operationKeys = Object.keys(attribute.operations);
    let validators: any = [];

    if (
      action === "patch" &&
      !payloadObjectKeys.includes(attribute.resolved_identifier)
    ) {
      continue;
    }

    for (let index = 0; index < operationKeys.length; index++) {
      const operationKey = operationKeys[index];
      const operationActions = operationKey.split(",");
      if (operationActions.includes("*") || operationActions.includes(action)) {
        const verificationType: any =
          resolveByDot(`operations.${operationKey}.validate`, attribute) ||
          undefined;

        if (verificationType !== undefined) {
          validators = [...validators, ...verificationType];
        }
      }
    }

    if (validators.length > 0) {
      //   console.log("validators", identifier, validators);
      constraints = addToConstraints(
        config,
        context,
        constraints,
        attribute,
        validators
      );
    }
  }

  await validator(config, context, constraints);

  return context;
};

export default validate;
