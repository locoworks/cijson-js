import type { Config, Hook, HookCollection, Resource, ResourceCollection, Validator, ValidatorCollection } from "../interfaces";
declare class CIJConfig implements Config {
    resources: ResourceCollection;
    mixins: ResourceCollection;
    validators: ValidatorCollection;
    hooks: HookCollection;
    operator: any;
    constructor();
    registerOperator(operator: any): void;
    registerMixin(name: string, resource: Resource): void;
    registerValidator(validatorName: string, validatorFunc: Validator): void;
    registerResource(resource: Resource): void;
    registerHook(hookName: string, hookFunction: Hook): void;
}
export default CIJConfig;
