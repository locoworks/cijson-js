export interface StoryExecutionContext {
    prepareResult?: any;
    authorizeResult?: any;
    handleResult?: any;
    respondResult?: any;
}
declare const executeStrategy: (sequence: string[]) => (story: any, ...args: any) => Promise<any>;
declare const pahrStrategy: (story: any, ...args: any) => Promise<any>;
export { executeStrategy, pahrStrategy };
