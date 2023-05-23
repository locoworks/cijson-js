export interface APIConfig {
    includeRelations?: string[];
}
export interface FilterBy {
    attribute: string;
    op: string;
    value: string;
    comparator?: string;
}
export interface Pagination {
    page?: number;
    per_page?: number;
}
export interface SortBy {
    attribute: string;
    order: string;
}
export interface APIPayload {
    apiConfig?: APIConfig;
    sortBy?: SortBy[];
    pagination?: Pagination;
    filterBy?: FilterBy[];
    [key: string]: any;
}
export interface Payload {
    [key: string]: any;
}
export interface Context {
    resourceName: string;
    action: string;
    payload?: Payload;
    filterBy?: FilterBy[];
    includeRelations?: string[];
    transformations?: any[];
    directColumns?: string[];
    primaryColumns?: string[];
    hasManyColumns?: string[];
    hasManyMappings?: any;
    relationColumns?: any;
    belongsToOneColumns?: string[];
    operations?: any[];
    actionResult?: any;
}
