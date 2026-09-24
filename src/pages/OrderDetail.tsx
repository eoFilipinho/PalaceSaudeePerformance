import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package, Truck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerOrder } from "@/hooks/useCustomerOrders";
import OrderTimeline from "@/components/customer/OrderTimeline";
import {
  brl,
  formatDateTime,
  orderPaymentLabel,
  statusLabels,
  statusTone,
} from "@/lib/orderUtils";

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-medium">{value}</span>
  </div>
);

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { order, loading, error } = useCustomerOrder(id);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <Link to="/minha-conta" className="rounded-full p-2 transition-colors hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-xl font-semibold">Detalhes do pedido</h1>
        </div>

        {loading ? (
          <p className="py-20 text-center text-sm text-muted-foreground">Carregando pedido...</p>
        ) : error ? (
          <p className="py-20 text-center text-sm text-destructive">{error}</p>
        ) : !order ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Package className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Pedido não encontrado ou indisponível para esta conta.
            </p>
            <Link to="/minha-conta">
              <Button variant="outline">Voltar para a área do cliente</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-popover p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(order.created_at)}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusTone(order.status)}`}>
                  {statusLabels[order.status]}
                </span>
              </div>
              <div className="mt-6">
                <OrderTimeline status={order.status} />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-popover p-5 space-y-2">
              <h2 className="mb-3 font-display text-base font-semibold">Resumo</h2>
              <Row label="Forma de pagamento" value={orderPaymentLabel(order)} />
              <Row
                label="Subtotal dos produtos"
                value={brl(
                  order.subtotal && Number(order.subtotal) > 0
                    ? order.subtotal
                    : order.order_items?.reduce((s, i) => s + Number(i.subtotal), 0) ?? 0,
                )}
              />
              <Row
                label="Frete"
                value={Number(order.shipping_cost ?? 0) > 0 ? brl(order.shipping_cost) : "Grátis"}
              />
              <div className="mt-2 flex justify-between border-t border-border pt-3">
                <span className="text-sm font-semibold">Total</span>
                <span className="font-display text-lg font-bold">{brl(order.total)}</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-popover p-5">
              <h2 className="mb-4 font-display text-base font-semibold">Itens do pedido</h2>
              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.products?.image_url ? (
                        <img
                          src={item.products.image_url}
                          alt={item.products.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.products?.name ?? "Produto"}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {brl(item.unit_price)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">{brl(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-popover p-5">
              <h2 className="mb-4 flex items-center gap-2 font-display text-base font-semibold">
                <MapPin className="h-4 w-4 text-primary" /> Informações de entrega
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Row label="Destinatário" value={order.recipient_name ?? "Não informado"} />
                <Row label="Endereço" value={order.shipping_street ?? "Não informado"} />
                <Row label="Número" value={order.shipping_number ?? "-"} />
                <Row label="Complemento" value={order.shipping_complement ?? "-"} />
                <Row label="Bairro" value={order.shipping_district ?? "-"} />
                <Row label="Cidade" value={order.shipping_city ?? "-"} />
                <Row label="Estado" value={order.shipping_state ?? "-"} />
                <Row label="CEP" value={order.shipping_zip ?? "-"} />
              </div>

              {(order.status === "shipped" || order.status === "delivered") && (
                <div className="mt-5 rounded-lg bg-accent p-4 text-accent-foreground">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    <p className="text-sm font-semibold">
                      {order.status === "shipped"
                        ? "Seu pedido já foi despachado e está a caminho"
                        : "Pedido entregue"}
                    </p>
                  </div>
                  <div className="mt-3 space-y-2">
                    <Row
                      label="Data de envio"
                      value={order.shipped_at ? formatDateTime(order.shipped_at) : "Não informada"}
                    />
                    <Row label="Código de rastreamento" value={order.tracking_code ?? "Não informado"} />
                    {order.carrier && <Row label="Transportadora" value={order.carrier} />}
                  </div>
                  {order.tracking_url && (
                    <a href={order.tracking_url} target="_blank" rel="noreferrer">
                      <Button size="sm" className="mt-4">
                        Acompanhar rastreamento
                      </Button>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;
