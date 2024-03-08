import { Config, Context, FilterBy, SortBy } from "../../interfaces";

const generateOperations = async (config: Config, context: Context) => {
  const { payload } = context;
  const resourceSpec = config.resources[context.resourceName];
  const operations = [];
  // const primaryColumns = context.primaryColumns || []
  const directColumns = context.directColumns || [];

  const limitBy = context?.limitBy ||
    payload?.limitBy ||
    payload?.pagination ||
    resourceSpec.limitBy || { page: 1, per_page: 10 };
  const filterBy = context?.filterBy || payload?.filterBy || [];
  const addlFilterBy =
    context?.addlFilterBy || payload?.addlFilterBy || undefined;
  let sortBy = context?.sortBy || payload?.sortBy || resourceSpec.sortBy || [];
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

  filters = [...filters, ...(context.filters || [])];

  sortBy = sortBy.map((s: SortBy) => {
    return { column: s.attribute, order: s.order, nulls: "last" };
  });

  operations.push({
    resourceSpec: resourceSpec,
    type: "select",
    filters: filters,
    addlFilterBy: addlFilterBy,
    selectColumns: selectColumns,
    limit: limitBy.per_page,
    offset: (limitBy.page - 1) * limitBy.per_page,
    sortBy,
  });

  context["operations"] = operations;

  return context;
};

export default generateOperations;
