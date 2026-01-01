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

export const formatCurrency = (value: number | string) => {
  const num = Number(value);

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10, // 最多保留 10 位小数
    useGrouping: false, // 不使用千分位逗号（可选，Crypto通常为了复制方便不加逗号）
  }).format(num);
};
