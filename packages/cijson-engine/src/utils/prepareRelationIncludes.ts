const prepareRelationIncludes = (
  context: any,
  relationColumns: any,
  relationMappings: any
) => {
  const includes = [];

  if (context.includeRelations !== undefined) {
    if (Array.isArray(context.includeRelations)) {
      return context.includeRelations;
    }

    if (context.includeRelations === "*") {
      for (let index = 0; index < relationColumns.length; index++) {
        const column = relationColumns[index];
        const columnSpec = relationMappings[column];
        includes.push(columnSpec.identifier);
      }
    }
  }

  return includes;
};

export default prepareRelationIncludes;
