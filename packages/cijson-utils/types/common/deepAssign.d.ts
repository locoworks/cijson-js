declare function deepAssign(options?: {
    nonEnum: boolean;
    symbols: boolean;
    descriptors: boolean;
    proto: boolean;
}): (target: any, ...sources: any) => any;
export default deepAssign;
