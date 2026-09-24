export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "pix" | "cartao" | "boleto";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type CustomerProfile = {
  id: string;
  name: string | null;
  phone: string | null;
  cpf: string | null;
  address_street: string | null;
  address_number: string | null;
  address_complement: string | null;
  address_district: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product_id: string;
  products: { name: string; image_url: string | null; weight: string | null } | null;
};

export type PaymentRow = {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paid_at: string | null;
};

export type CustomerOrder = {
  id: string;
  status: OrderStatus;
  subtotal: number | null;
  shipping_cost: number | null;
  total: number;
  created_at: string;
  recipient_name: string | null;
  shipping_street: string | null;
  shipping_number: string | null;
  shipping_complement: string | null;
  shipping_district: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zip: string | null;
  shipped_at: string | null;
  tracking_code: string | null;
  carrier: string | null;
  tracking_url: string | null;
  order_items: OrderItemRow[];
  payments: PaymentRow[];
};

export type PurchasedProduct = {
  productId: string;
  name: string;
  image: string | null;
  totalQuantity: number;
  totalPaid: number;
  lastPurchase: string;
  lastOrderId: string;
};
