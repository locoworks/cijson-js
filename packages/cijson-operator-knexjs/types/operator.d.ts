interface Operator {
    instance: any;
    run(operations: any[]): any;
    setInstance(instance: any): void;
}
declare class KnexJSOperator implements Operator {
    instance: any;
    setInstance(instance: any): void;
    run(operations: any[]): Promise<any>;
}
export default KnexJSOperator;
