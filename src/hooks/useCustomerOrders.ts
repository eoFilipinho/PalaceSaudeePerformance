import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "@/integrations/supabase/db";
import { useAuth } from "@/hooks/useAuth";
import type { CustomerOrder, PurchasedProduct } from "@/types/customer";

const SELECT =
  "id, status, subtotal, shipping_cost, total, created_at, recipient_name, shipping_street, shipping_number, shipping_complement, shipping_district, shipping_city, shipping_state, shipping_zip, shipped_at, tracking_code, carrier, tracking_url, order_items(id, quantity, unit_price, subtotal, product_id, products(name, image_url, weight)), payments(id, amount, method, status, paid_at)";

export const useCustomerOrders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await db
      .from("orders")
      .select(SELECT)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setError("Não foi possível carregar seus pedidos.");
      setOrders([]);
    } else {
      setError(null);
      setOrders((data as CustomerOrder[]) ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    load();
  }, [authLoading, load]);

  const purchasedProducts = useMemo<PurchasedProduct[]>(() => {
    const map = new Map<string, PurchasedProduct>();
    orders
      .filter((o) => o.status !== "cancelled")
      .forEach((order) => {
        order.order_items?.forEach((item) => {
          const current = map.get(item.product_id);
          if (current) {
            current.totalQuantity += item.quantity;
            current.totalPaid += Number(item.subtotal);
            if (new Date(order.created_at) > new Date(current.lastPurchase)) {
              current.lastPurchase = order.created_at;
              current.lastOrderId = order.id;
            }
          } else {
            map.set(item.product_id, {
              productId: item.product_id,
              name: item.products?.name ?? "Produto",
              image: item.products?.image_url ?? null,
              totalQuantity: item.quantity,
              totalPaid: Number(item.subtotal),
              lastPurchase: order.created_at,
              lastOrderId: order.id,
            });
          }
        });
      });
    return [...map.values()].sort(
      (a, b) => new Date(b.lastPurchase).getTime() - new Date(a.lastPurchase).getTime(),
    );
  }, [orders]);

  return { orders, purchasedProducts, loading: loading || authLoading, error, reload: load };
};

export const useCustomerOrder = (orderId?: string) => {
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !orderId) {
      setOrder(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    db.from("orders")
      .select(SELECT)
      .eq("id", orderId)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }: { data: unknown; error: unknown }) => {
        if (error) setError("Não foi possível carregar o pedido.");
        else setError(null);
        setOrder((data as CustomerOrder) ?? null);
        setLoading(false);
      });
  }, [user, orderId, authLoading]);

  return { order, loading: loading || authLoading, error };
};
