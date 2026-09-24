import type { CustomerOrder, OrderStatus, PaymentMethod, PaymentStatus } from "@/types/customer";

export const brl = (value: number | null | undefined) =>
  `R$ ${Number(value ?? 0).toFixed(2).replace(".", ",")}`;

export const statusLabels: Record<OrderStatus, string> = {
  pending: "Pedido realizado",
  confirmed: "Pagamento aprovado",
  preparing: "Em preparação",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export const statusOrder: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
];

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  pix: "Pix",
  cartao: "Cartão",
  boleto: "Boleto",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  failed: "Não aprovado",
  refunded: "Reembolsado",
};

export const statusTone = (status: OrderStatus) => {
  switch (status) {
    case "delivered":
      return "bg-primary/10 text-primary";
    case "cancelled":
      return "bg-destructive/10 text-destructive";
    case "shipped":
      return "bg-accent text-accent-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const orderItemsCount = (order: CustomerOrder) =>
  order.order_items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

export const orderPaymentLabel = (order: CustomerOrder) => {
  const payment = order.payments?.[0];
  if (!payment) return "Não informada";
  return `${paymentMethodLabels[payment.method] ?? payment.method} · ${
    paymentStatusLabels[payment.status] ?? payment.status
  }`;
};

export const formatDateTime = (iso: string) => new Date(iso).toLocaleString("pt-BR");
export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");

export const formatAddress = (order: CustomerOrder) => {
  const parts = [
    order.shipping_street && `${order.shipping_street}${order.shipping_number ? `, ${order.shipping_number}` : ""}`,
    order.shipping_complement,
    order.shipping_district,
    order.shipping_city && order.shipping_state
      ? `${order.shipping_city} - ${order.shipping_state}`
      : order.shipping_city,
    order.shipping_zip && `CEP ${order.shipping_zip}`,
  ].filter(Boolean);
  return parts.join(" · ");
};
