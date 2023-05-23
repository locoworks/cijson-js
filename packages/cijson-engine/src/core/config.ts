//import { deepAssign } from "@locospec-cijson/utils";
import { deepAssign } from "@locoworks/cijson-utils";

import type {
  Config,
  Hook,
  HookCollection,
  Resource,
  ResourceCollection,
  Validator,
  ValidatorCollection,
} from "../interfaces";

class CIJConfig implements Config {
  public resources: ResourceCollection;
  public mixins: ResourceCollection;
  public validators: ValidatorCollection;
  public hooks: HookCollection;
  public operator: any;

  constructor() {
    this.resources = {};
    this.mixins = {};
    this.hooks = {};
    this.validators = {};
    this.operator = undefined;
  }

  registerOperator(operator: any) {
    this.operator = operator;
  }

  registerMixin(name: string, resource: Resource): void {
    this.mixins[name] = resource;
  }

  registerValidator(validatorName: string, validatorFunc: Validator) {
    this.validators[validatorName] = validatorFunc;
  }

  registerResource(resource: Resource): void {
    const attributesArray = [];
    const relationsArray = [];

    resource.mixins.forEach((mixin: string) => {
      if (this.mixins[mixin]) {
        resource = deepAssign()(resource, this.mixins[mixin]);
      }
    });

    // console.log("resource.attributes", resource.attributes);

    for (const identifier in resource.attributes) {
      const attribute = resource.attributes[identifier];
      attribute["identifier"] = identifier;
      attributesArray.push(attribute);
    }

    for (const identifier in resource.relations) {
      const attribute = resource.relations[identifier];
      attribute["identifier"] = identifier;
      relationsArray.push(attribute);
    }

    resource.attributes = attributesArray;
    resource.relations = relationsArray;
    this.resources[resource.name] = resource;
  }

  registerHook(hookName: string, hookFunction: Hook) {
    this.hooks[hookName] = hookFunction;
  }
}

export default CIJConfig;
