import QueryString from "qs";

export function serializateQuery(
  data: Record<string, any>,
  addQueryPrefix: boolean = true
) {
  return QueryString.stringify(data, { addQueryPrefix });
}

export function serializateUrl<T extends object>(url: string, param: T) {
  const query = serializateQuery(param);
  return url + query;
}
