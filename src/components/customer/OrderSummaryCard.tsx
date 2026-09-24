import { Link } from "react-router-dom";
import { Package, ChevronRight, Truck } from "lucide-react";
import type { CustomerOrder } from "@/types/customer";
import {
  brl,
  formatDateTime,
  orderItemsCount,
  orderPaymentLabel,
  statusLabels,
  statusTone,
} from "@/lib/orderUtils";

const OrderSummaryCard = ({ order }: { order: CustomerOrder }) => (
  <div className="rounded-xl border border-border bg-popover p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-foreground">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
        <p className="text-xs text-muted-foreground">{formatDateTime(order.created_at)}</p>
      </div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusTone(order.status)}`}>
        {statusLabels[order.status]}
      </span>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Itens</p>
        <p className="text-sm font-medium">{orderItemsCount(order)}</p>
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Total</p>
        <p className="text-sm font-semibold">{brl(order.total)}</p>
      </div>
      <div className="col-span-2">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Pagamento</p>
        <p className="text-sm font-medium">{orderPaymentLabel(order)}</p>
      </div>
    </div>

    {order.status === "shipped" && (
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-accent px-3 py-2 text-accent-foreground">
        <Truck className="mt-0.5 h-4 w-4 shrink-0" />
        <p className="text-xs">
          Seu pedido já foi despachado
          {order.tracking_code ? ` · Rastreio: ${order.tracking_code}` : ""}
          {order.carrier ? ` · ${order.carrier}` : ""}
        </p>
      </div>
    )}

    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Package className="h-3.5 w-3.5" />
        {order.order_items?.[0]?.products?.name ?? "Produtos"}
        {order.order_items?.length > 1 ? ` +${order.order_items.length - 1}` : ""}
      </div>
      <Link
        to={`/pedido/${order.id}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
      >
        Ver detalhes <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

export default OrderSummaryCard;
