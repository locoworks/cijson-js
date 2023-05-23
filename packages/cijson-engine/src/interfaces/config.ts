import type { HookCollection } from "./hook";
import type { ResourceCollection } from "./resource";
import type { ValidatorCollection } from "./validator";

export interface Config {
  resources: ResourceCollection;
  mixins: ResourceCollection;
  hooks: HookCollection;
  validators: ValidatorCollection;
  operator: any;
}
