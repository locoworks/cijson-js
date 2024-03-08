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

export interface LimitBy {
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
  addlFilterBy?: any;
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
  addlFilterBy?: any;
  limitBy?: LimitBy;
  sortBy?: SortBy;
  filters?: any[];
  includeRelations?: string[];
  transformations?: any[];
  directColumns?: string[];
  primaryColumns?: string[];
  hasManyColumns?: string[];
  hasManyMappings?: any;
  hasOneColumns?: string[];
  hasOneMappings?: any;
  relationColumns?: any;
  belongsToOneColumns?: string[];
  belongsToOneMappings?: any;
  hasManyViaPivotColumns?: string[];
  hasManyViaPivotMappings?: any;
  operations?: any[];
  actionResult?: any;
}
