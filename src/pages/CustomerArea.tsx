import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, ShoppingBasket, User as UserIcon, History, Pencil } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useCustomerOrders } from "@/hooks/useCustomerOrders";
import OrderSummaryCard from "@/components/customer/OrderSummaryCard";
import type { CustomerProfile, OrderStatus } from "@/types/customer";
import { brl, formatDate, statusLabels, statusTone } from "@/lib/orderUtils";

const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
    <Package className="mb-3 h-12 w-12 text-muted-foreground/40" />
    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
  </div>
);

const ProfileTab = () => {
  const { user } = useAuth();
  const { profile, loading, error, save } = useProfile();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<CustomerProfile>>({});

  const startEditing = () => {
    setForm({
      name: profile?.name ?? "",
      phone: profile?.phone ?? "",
      cpf: profile?.cpf ?? "",
      address_street: profile?.address_street ?? "",
      address_number: profile?.address_number ?? "",
      address_complement: profile?.address_complement ?? "",
      address_district: profile?.address_district ?? "",
      address_city: profile?.address_city ?? "",
      address_state: profile?.address_state ?? "",
      address_zip: profile?.address_zip ?? "",
    });
    setEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error: saveError } = await save(form);
    setSaving(false);
    if (saveError) toast.error(saveError);
    else {
      toast.success("Dados atualizados");
      setEditing(false);
    }
  };

  if (loading) return <p className="py-16 text-center text-sm text-muted-foreground">Carregando seus dados...</p>;
  if (error) return <p className="py-16 text-center text-sm text-destructive">{error}</p>;

  const field = (label: string, value?: string | null) => (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value?.trim() ? value : "Não informado"}</p>
    </div>
  );

  const addressLine = [
    profile?.address_street && `${profile.address_street}${profile.address_number ? `, ${profile.address_number}` : ""}`,
    profile?.address_complement,
    profile?.address_district,
    profile?.address_city && profile?.address_state
      ? `${profile.address_city} - ${profile.address_state}`
      : profile?.address_city,
    profile?.address_zip && `CEP ${profile.address_zip}`,
  ]
    .filter(Boolean)
    .join(" · ");

  if (!editing) {
    return (
      <div className="rounded-xl border border-border bg-popover p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Dados cadastrais</h2>
          <Button variant="outline" size="sm" className="gap-2" onClick={startEditing}>
            <Pencil className="h-3.5 w-3.5" /> Editar
          </Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {field("Nome completo", profile?.name)}
          {field("E-mail", user?.email ?? null)}
          {field("Telefone", profile?.phone)}
          {field("CPF", profile?.cpf)}
          <div className="sm:col-span-2">{field("Endereço de entrega", addressLine)}</div>
          {field("Data de cadastro", profile?.created_at ? formatDate(profile.created_at) : null)}
        </div>
      </div>
    );
  }

  const input = (key: keyof CustomerProfile, label: string, placeholder?: string) => (
    <div>
      <Label htmlFor={key as string}>{label}</Label>
      <Input
        id={key as string}
        value={(form[key] as string) ?? ""}
        placeholder={placeholder}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <form onSubmit={handleSave} className="rounded-xl border border-border bg-popover p-6">
      <h2 className="mb-5 font-display text-lg font-semibold">Editar dados cadastrais</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {input("name", "Nome completo")}
        <div>
          <Label>E-mail</Label>
          <Input value={user?.email ?? ""} disabled />
        </div>
        {input("phone", "Telefone", "(00) 00000-0000")}
        {input("cpf", "CPF", "000.000.000-00")}
        {input("address_street", "Rua")}
        {input("address_number", "Número")}
        {input("address_complement", "Complemento")}
        {input("address_district", "Bairro")}
        {input("address_city", "Cidade")}
        {input("address_state", "Estado", "SP")}
        {input("address_zip", "CEP", "00000-000")}
      </div>
      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

const CustomerArea = () => {
  const { user, loading: authLoading } = useAuth();
  const { orders, purchasedProducts, loading, error } = useCustomerOrders();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [orderQuery, setOrderQuery] = useState("");

  const filteredHistory = useMemo(() => {
    const now = Date.now();
    const periodDays: Record<string, number> = { "30": 30, "90": 90, "365": 365 };
    return orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (periodFilter !== "all") {
        const days = periodDays[periodFilter];
        if (now - new Date(order.created_at).getTime() > days * 86400000) return false;
      }
      if (orderQuery.trim() && !order.id.toLowerCase().includes(orderQuery.trim().toLowerCase())) return false;
      return true;
    });
  }, [orders, statusFilter, periodFilter, orderQuery]);

  if (authLoading) {
    return <p className="py-24 text-center text-sm text-muted-foreground">Carregando...</p>;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <UserIcon className="h-14 w-14 text-muted-foreground/40" />
        <h1 className="text-lg font-semibold">Entre para acessar sua área do cliente</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Faça login pelo ícone de usuário no cabeçalho da loja para ver seus dados e pedidos.
        </p>
        <Link to="/">
          <Button>Ir para a loja</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <Link to="/" className="rounded-full p-2 transition-colors hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-semibold">Área do Cliente</h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Tabs defaultValue="perfil">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
            <TabsTrigger value="perfil" className="gap-2">
              <UserIcon className="h-4 w-4" /> Meu Perfil
            </TabsTrigger>
            <TabsTrigger value="pedidos" className="gap-2">
              <Package className="h-4 w-4" /> Meus Pedidos
            </TabsTrigger>
            <TabsTrigger value="produtos" className="gap-2">
              <ShoppingBasket className="h-4 w-4" /> Produtos Adquiridos
            </TabsTrigger>
            <TabsTrigger value="historico" className="gap-2">
              <History className="h-4 w-4" /> Histórico de Compras
            </TabsTrigger>
          </TabsList>

          <TabsContent value="perfil" className="mt-6">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="pedidos" className="mt-6 space-y-4">
            {loading ? (
              <p className="py-16 text-center text-sm text-muted-foreground">Carregando pedidos...</p>
            ) : error ? (
              <p className="py-16 text-center text-sm text-destructive">{error}</p>
            ) : orders.length === 0 ? (
              <EmptyState
                title="Nenhum pedido encontrado"
                description="Quando você finalizar uma compra, o pedido aparecerá aqui com o status da entrega."
              />
            ) : (
              orders.map((order) => <OrderSummaryCard key={order.id} order={order} />)
            )}
          </TabsContent>

          <TabsContent value="produtos" className="mt-6">
            {loading ? (
              <p className="py-16 text-center text-sm text-muted-foreground">Carregando itens...</p>
            ) : purchasedProducts.length === 0 ? (
              <EmptyState
                title="Você ainda não comprou nenhum produto"
                description="Os produtos que você comprar ficarão reunidos aqui para facilitar a recompra."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {purchasedProducts.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 rounded-xl border border-border bg-popover p-4"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Quantidade total adquirida: {item.totalQuantity}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Última compra: {formatDate(item.lastPurchase)}
                      </p>
                      <div className="mt-1 flex items-center gap-3">
                        <span className="text-sm font-semibold">{brl(item.totalPaid)}</span>
                        <Link
                          to={`/pedido/${item.lastOrderId}`}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Pedido #{item.lastOrderId.slice(0, 8).toUpperCase()}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="historico" className="mt-6 space-y-4">
            <div className="grid gap-3 rounded-xl border border-border bg-popover p-4 sm:grid-cols-3">
              <div>
                <Label className="text-xs">Período</Label>
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todo o período</SelectItem>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                    <SelectItem value="90">Últimos 90 dias</SelectItem>
                    <SelectItem value="365">Último ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Status do pedido</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    {(Object.keys(statusLabels) as OrderStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {statusLabels[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Número do pedido</Label>
                <Input
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="Ex.: 3F2A9C1B"
                />
              </div>
            </div>

            {loading ? (
              <p className="py-16 text-center text-sm text-muted-foreground">Carregando histórico...</p>
            ) : error ? (
              <p className="py-16 text-center text-sm text-destructive">{error}</p>
            ) : filteredHistory.length === 0 ? (
              <EmptyState
                title="Nenhuma compra encontrada"
                description="Ajuste os filtros de período, status ou número do pedido para ver outras compras."
              />
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((order) => (
                  <div key={order.id} className="rounded-xl border border-border bg-popover p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">
                          Pedido #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusTone(order.status)}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1">
                      {order.order_items?.map((item) => (
                        <li key={item.id} className="flex justify-between text-xs text-muted-foreground">
                          <span className="truncate">
                            {item.quantity}× {item.products?.name ?? "Produto"}
                          </span>
                          <span>{brl(item.subtotal)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                      <Link to={`/pedido/${order.id}`} className="text-xs font-semibold text-primary hover:underline">
                        Ver detalhes
                      </Link>
                      <span className="text-sm font-bold">{brl(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerArea;
