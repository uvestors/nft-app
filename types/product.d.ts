interface Price {
  id: string;
  product_id: string;
  active: boolean;
  currency: string;
  unit_amount: number;
  type: "one_time" | "recurring"; // 建议使用字面量类型
  interval: string | null; // 如果是 one_time，通常为 null
  metadata: RAnyObject;
  created_at?: string;
}

interface ProductItem {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  active: boolean;
  created_at: string;
  prices?: Price[];
  price_id: string;
  currency: string;
  unit_amount: number;
  type: string;
  metadata?: AnyObject;
}
