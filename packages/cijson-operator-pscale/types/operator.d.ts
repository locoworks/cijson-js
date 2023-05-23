interface Operator {
    instance: any;
    pscale: any;
    run(operations: any[]): any;
    setInstance(instance: any, pscale: any): void;
}
declare class PScaleOperator implements Operator {
    instance: any;
    pscale: any;
    setInstance(instance: any, pscale: any): void;
    run(operations: any[]): Promise<any>;
}
export default PScaleOperator;
