import type { Config, Context, FilterBy, SortBy } from "../interfaces";

const getOperations = async (config: Config, context: Context) => {
  const { action, payload } = context;
  const resourceSpec = config.resources[context.resourceName];
  const operations = [];
  const directColumns = context.directColumns || [];

  if (action === "read") {
    const limitBy = payload?.limitBy ||
      resourceSpec.limitBy || { page: 1, per_page: 10 };
    const filterBy = payload?.filterBy || [];
    let sortBy = payload?.sortBy || resourceSpec.sortBy || [];
    const table = resourceSpec.persistence.table;
    let filters = [];

    const selectColumns = [...directColumns].map((m) => `${table}.${m}`);

    filters = filterBy
      .filter((f: FilterBy) => {
        return f.op;
      })
      .map((f: FilterBy) => {
        return {
          column: f.attribute.toLowerCase(),
          op: f.op,
          value: f.value,
          comparator: f.comparator,
        };
      });

    filters = [...filters];

    sortBy = sortBy.map((s: SortBy) => {
      return { column: s.attribute, order: s.order, nulls: "last" };
    });

    operations.push({
      resourceSpec: resourceSpec,
      type: "select",
      filters: filters,
      selectColumns: selectColumns,
      limit: limitBy.per_page,
      offset: (limitBy.page - 1) * limitBy.per_page,
      sortBy,
    });
  }

  context["operations"] = operations;

  return context;
};

export default getOperations;
