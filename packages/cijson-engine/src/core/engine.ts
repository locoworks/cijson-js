import CreateAction from "../actions/create";
import DeleteAction from "../actions/delete";
import ReadAction from "../actions/read";
import UpdateAction from "../actions/update";
import type { Config, Context } from "../interfaces";
import executeSequence from "../utils/executeSequence";
import fillHasManyResources from "./fillHasManyResources";

class CIJEngine {
  public config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async create(resourceName: string, context: any) {
    // console.log("we came here to create -----");

    return await this.performAction({
      ...{
        resourceName: resourceName,
        action: "create",
      },
      ...context,
    });
  }

  async read(resourceName: string, context: any) {
    return await this.performAction({
      ...{
        resourceName: resourceName,
        action: "read",
      },
      ...context,
    });
  }

  async update(resourceName: string, context: any) {
    return await this.performAction({
      ...{
        resourceName: resourceName,
        action: "update",
      },
      ...context,
    });
  }

  async patch(resourceName: string, context: any) {
    return await this.performAction({
      ...{
        resourceName: resourceName,
        action: "patch",
      },
      ...context,
    });
  }

  async delete(resourceName: string, context: any) {
    return await this.performAction({
      ...{
        resourceName: resourceName,
        action: "delete",
      },
      ...context,
    });
  }

  async query(resourceName: string, context: any) {
    return await this.performAction({
      ...{
        resourceName: resourceName,
        action: "query",
      },
      ...context,
    });
  }

  async performAction(context: Context) {
    // console.log("performAction", context.resourceName, context.action);
    const transformations = context.transformations || [];

    if (context.action === "read") {
      const result = await ReadAction(this.config, context);

      context = await executeSequence(this.config, context, [
        fillHasManyResources,
      ]);

      if (transformations.length > 0) {
        if (context.transformations?.includes("pick_first")) {
          return result["actionResult"].data.length > 0
            ? result["actionResult"].data[0]
            : null;
        }
      }

      return result;
    }

    if (context.action === "create") {
      const result = await CreateAction(this.config, context);

      if (transformations.length > 0) {
        if (context.transformations?.includes("pick_first")) {
          return result["actionResult"].data.length > 0
            ? result["actionResult"].data[0]
            : null;
        }
      }

      return result;
    }

    if (context.action === "update") {
      const result = await UpdateAction(this.config, context);

      if (transformations.length > 0) {
        if (context.transformations?.includes("pick_first")) {
          return result["actionResult"].data.length > 0
            ? result["actionResult"].data[0]
            : null;
        }
      }

      return result;
    }

    if (context.action === "patch") {
      const result = await UpdateAction(this.config, context);

      if (transformations.length > 0) {
        if (context.transformations?.includes("pick_first")) {
          return result["actionResult"].data.length > 0
            ? result["actionResult"].data[0]
            : null;
        }
      }

      return result;
    }

    if (context.action === "delete") {
      const result = await DeleteAction(this.config, context);

      if (transformations.length > 0) {
        if (context.transformations?.includes("pick_first")) {
          return result["actionResult"].data.length > 0
            ? result["actionResult"].data[0]
            : null;
        }
      }

      return result;
    }
  }
}

export default CIJEngine;
