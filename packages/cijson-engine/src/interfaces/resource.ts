export type ResourceAttribute = {
  identifier: string;
  mutateFrom?: string;
};
type Resource = Record<string, any>;
type ResourceCollection = Record<string, Resource>;

export { Resource, ResourceCollection };
