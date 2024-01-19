import type { Config, Context } from "../interfaces";
declare class CIJEngine {
    config: Config;
    eventHandler?: (arg: any) => void;
    constructor(config: Config);
    setEventHandler(handler: (arg: any) => void): void;
    triggerEventHandler(arg: any): void;
    create(resourceName: string, context: any): Promise<any>;
    read(resourceName: string, context: any): Promise<any>;
    update(resourceName: string, context: any): Promise<any>;
    patch(resourceName: string, context: any): Promise<any>;
    delete(resourceName: string, context: any): Promise<any>;
    query(resourceName: string, context: any): Promise<any>;
    performAction(context: Context): Promise<any>;
}
export default CIJEngine;
