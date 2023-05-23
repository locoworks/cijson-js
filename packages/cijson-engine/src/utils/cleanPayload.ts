import type { Config, Context, ResourceAttribute } from "../interfaces";

const cleanPayload = async (config: Config, context: Context) => {
  // console.log(
  //   "clean payload called..",
  //   context
  //   // typeof config.resources[context.resourceName]
  // );
  // const { locoAction, resourceModels, locoConfig } = context;

  const resourceSpec = config.resources[context.resourceName];
  const attributes = resourceSpec.attributes;

  // console.log("resourceSpec", resourceSpec.relations);

  // Todo, only take that data from payload, which has current "action" as part of operations

  // console.log("attributes", attributes);

  // const payload = context.payload || {};
  // const action = context.action;

  const relationColumns: any = {
    belongs_to_one: [],
    has_one: [],
    has_many: [],
    has_many_via_pivot: [],
  };

  let directColumns = attributes.map((c: ResourceAttribute) => {
    return `${c.identifier}`;
  });

  directColumns = [...directColumns];

  // let mutationColumns = attributes
  //   .filter((c: Attribute) => {
  //     return c.mutateFrom;
  //   })
  //   .map((c: Attribute) => {
  //     return `${c.identifier}`;
  //   });

  // mutationColumns = [...mutationColumns];

  // let belongsToOneColumns = attributes
  //   .filter((c: Attribute) => {
  //     return c.relation && c.relation.type === "belongs_to_one";
  //   })
  //   .map((c: Attribute) => {
  //     relationColumns["belongs_to_one"].push(c.identifier);
  //     return `${c.relation.resolveTo || c.identifier}`;
  //   });

  // belongsToOneColumns = [...belongsToOneColumns];

  // let belongsToOneMappings = attributes
  // 	.filter((c) => {
  // 		return c.relation && c.relation.type === "belongs_to_one";
  // 	})
  // 	.reduce(
  // 		(obj, c) =>
  // 			Object.assign(obj, {
  // 				[`${c.relation.resolveTo || c.identifier}`]: c,
  // 			}),
  // 		{},
  // 	);

  // belongsToOneMappings = { ...belongsToOneMappings };

  // let hasOneColumns = attributes
  // 	.filter((c) => {
  // 		return c.relation && c.relation.type === "has_one";
  // 	})
  // 	.map((c) => {
  // 		relationColumns["has_one"].push(c.identifier);
  // 		return `${c.relation.resolveTo || c.identifier}`;
  // 	});

  // hasOneColumns = [...hasOneColumns];

  // let hasOneMappings = attributes
  // 	.filter((c) => {
  // 		return c.relation && c.relation.type === "has_one";
  // 	})
  // 	.reduce(
  // 		(obj, c) =>
  // 			Object.assign(obj, {
  // 				[`${c.relation.resolveTo || c.identifier}`]: c,
  // 			}),
  // 		{},
  // 	);

  // hasOneMappings = { ...hasOneMappings };

  let hasManyColumns = resourceSpec.relations
    .filter((c: any) => {
      return c.relation.type === "has_many";
    })
    .map((c: any) => {
      relationColumns["has_many"].push(c.identifier);
      return `${c.relation.resolveTo || c.identifier}`;
    });

  hasManyColumns = [...hasManyColumns];

  let hasManyMappings = resourceSpec.relations
    .filter((c: any) => {
      return c.relation.type === "has_many";
    })
    .reduce(
      (obj: any, c: any) =>
        Object.assign(obj, {
          [`${c.relation.resolveTo || c.identifier}`]: c,
        }),
      {}
    );

  hasManyMappings = { ...hasManyMappings };

  // let hasManyViaPivotColumns = attributes
  // 	.filter((c) => {
  // 		return c.relation && c.relation.type === "has_many_via_pivot";
  // 	})
  // 	.map((c) => {
  // 		relationColumns["has_many_via_pivot"].push(c.identifier);
  // 		return `${c.relation.resolveTo || c.identifier}`;
  // 	});

  // hasManyViaPivotColumns = [...hasManyViaPivotColumns];

  // let hasManyViaPivotMappings = attributes
  // 	.filter((c) => {
  // 		return c.relation && c.relation.type === "has_many_via_pivot";
  // 	})
  // 	.reduce(
  // 		(obj, c) =>
  // 			Object.assign(obj, {
  // 				[`${c.relation.resolveTo || c.identifier}`]: c,
  // 			}),
  // 		{},
  // 	);

  // hasManyViaPivotMappings = { ...hasManyViaPivotMappings };

  // // console.log("before cleaning", attributes, hasOneColumns);

  // let otherKeys = [];

  // if (action === "read") {
  //   otherKeys = ["limitBy", "sortBy", "filterBy"];
  // }

  // otherKeys = ["limitBy", "sortBy", "filterBy"];

  // // console.log("includes -----", includes);

  // const hasManyPayload = pickKeysFromObject(payload, [
  // 	...hasManyViaPivotColumns,
  // ]);

  // // console.log("cleanPayload", payload);

  // const payloadKeys = [...directColumns, ...otherKeys];

  // console.log("payloadKeys", payloadKeys);

  // payload = pickKeysFromObject(payload, payloadKeys);

  // locoAction["payload"] = payload;
  // locoAction["hasManyPayload"] = hasManyPayload;
  context["directColumns"] = directColumns;
  context["primaryColumns"] = resourceSpec.primary;

  // context["belongsToOneColumns"] = belongsToOneColumns;
  // locoAction["belongsToOneMappings"] = belongsToOneMappings;
  // locoAction["hasOneColumns"] = hasOneColumns;
  // locoAction["hasOneMappings"] = hasOneMappings;
  context["hasManyColumns"] = hasManyColumns;
  context["hasManyMappings"] = hasManyMappings;
  // locoAction["hasManyViaPivotColumns"] = hasManyViaPivotColumns;
  // locoAction["hasManyViaPivotMappings"] = hasManyViaPivotMappings;
  // locoAction["mutationColumns"] = mutationColumns;
  context["relationColumns"] = relationColumns;

  // console.log(
  //   "hasManyColumns",
  //   hasManyColumns,
  //   relationColumns,
  //   hasManyMappings
  // );

  // context.locoAction = locoAction;

  return context;
};

export default cleanPayload;
