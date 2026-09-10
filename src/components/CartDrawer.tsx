import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PaymentMethod = "pix" | "cartao" | "boleto";

const CartDrawer = () => {
  const { items, total, isOpen, setIsOpen, removeItem, updateQuantity, clear } = useCart();
  const { user } = useAuth();
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [placing, setPlacing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Entre na sua conta para finalizar a compra");
      return;
    }
    if (items.length === 0) return;

    setPlacing(true);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ user_id: user.id, total, status: "pending" })
      .select("id")
      .single();

    if (orderError || !order) {
      toast.error("Não foi possível criar o pedido");
      setPlacing(false);
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: Number((item.price * item.quantity).toFixed(2)),
      })),
    );

    if (itemsError) {
      toast.error("Não foi possível salvar os itens do pedido");
      setPlacing(false);
      return;
    }

    await supabase.from("payments").insert({
      order_id: order.id,
      amount: total,
      method,
      status: "pending",
    });

    toast.success("Pedido realizado! Acompanhe em Meus Pedidos.");
    clear();
    setIsOpen(false);
    setPlacing(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col p-0 w-full sm:max-w-md">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="flex items-center gap-2 font-display text-lg">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Meu Carrinho
          </SheetTitle>
        </SheetHeader>

        <Separator />

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 opacity-30" />
            <p className="text-sm">Seu carrinho está vazio</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 py-4 border-b border-border/50 last:border-0"
                  >
                    <div className="w-14 h-14 rounded-xl bg-muted overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.weight}</p>
                      <p className="text-sm font-semibold text-primary mt-1">
                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>

            <div className="mt-auto">
              <Separator />
              <SheetFooter className="px-6 py-5 flex flex-col gap-4 sm:flex-col">
                <div className="w-full space-y-2">
                  <span className="text-xs text-muted-foreground">Forma de pagamento</span>
                  <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">Pix</SelectItem>
                      <SelectItem value="cartao">Cartão</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-xl font-display font-bold">
                    R$ {total.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={placing}
                  className="w-full rounded-full h-12 text-sm font-bold tracking-wide"
                >
                  {placing ? "Enviando pedido..." : user ? "Finalizar Compra" : "Entre para finalizar"}
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
