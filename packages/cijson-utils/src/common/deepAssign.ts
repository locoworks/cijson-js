/* eslint-disable @typescript-eslint/no-explicit-any */
function toType(a: any) {
  const type = {}.toString.call(a).match(/([a-z]+)(:?\])/i);
  return type !== null ? type[1] : null;
}

function isDeepObject(obj: any) {
  return "Object" === toType(obj);
}

function deepAssign(
  options = { nonEnum: true, symbols: true, descriptors: true, proto: true }
) {
  return function deepAssignWithOptions(target: any, ...sources: any) {
    sources.forEach((source: any) => {
      if (!isDeepObject(source) || !isDeepObject(target)) {
        return;
      }

      // Copy source's own properties into target's own properties
      function copyProperty(property: any) {
        const descriptor: any = Object.getOwnPropertyDescriptor(
          source,
          property
        );
        //default: omit non-enumerable properties
        if (descriptor.enumerable || options.nonEnum) {
          // Copy in-depth first
          if (
            isDeepObject(source[property]) &&
            isDeepObject(target[property])
          ) {
            descriptor.value = deepAssign(options)(
              target[property],
              source[property]
            );
          }
          //default: omit descriptors
          if (options.descriptors) {
            Object.defineProperty(target, property, descriptor);
          }
          // shallow copy descriptor
          else {
            target[property] = descriptor.value;
          } // shallow copy value only
        }
      }

      // Copy string-keyed properties
      Object.getOwnPropertyNames(source).forEach(copyProperty);

      //default: omit symbol-keyed properties
      if (options.symbols) {
        Object.getOwnPropertySymbols(source).forEach(copyProperty);
      }

      //default: omit prototype's own properties
      if (options.proto) {
        // Copy souce prototype's own properties into target prototype's own properties
        deepAssign(Object.assign({}, options, { proto: false }))(
          // Prevent deeper copy of the prototype chain
          Object.getPrototypeOf(target),
          Object.getPrototypeOf(source)
        );
      }
    });
    return target;
  };
}

export default deepAssign;
