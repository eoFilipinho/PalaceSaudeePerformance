import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowLeft, Package, Search, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

type Product = {
  id: string;
  name: string;
  price: number;
  category_id: string | null;
  image_url: string | null;
  weight: string | null;
  description: string | null;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const emptyForm = {
  name: "",
  price: "",
  category_id: "",
  image_url: "",
  weight: "",
  description: "",
  stock_quantity: "0",
  is_active: true,
};

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signIn, signOut } = useAuth();
  const { categories } = useCategories();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");

  const categoryName = (id: string | null) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(`Erro ao carregar produtos: ${error.message}`);
    } else {
      setProducts((data as Product[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchProducts();
  }, [isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    setLoginError(null);
    const { error } = await signIn(email, password);
    if (error) setLoginError("E-mail ou senha inválidos");
    setPassword("");
    setSigningIn(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto p-8">
          <div className="text-center mb-8">
            <Package className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="text-xl font-semibold text-foreground">Painel Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {user && !isAdmin
                ? "Esta conta não tem permissão de administrador"
                : "Entre com seu e-mail e senha de administrador"}
            </p>
          </div>

          {user && !isAdmin ? (
            <div className="space-y-4">
              <Button variant="outline" className="w-full gap-2" onClick={() => signOut()}>
                <LogOut className="w-4 h-4" /> Sair desta conta
              </Button>
              <div className="text-center">
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  ← Voltar para a loja
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-email">E-mail</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLoginError(null); }}
                  placeholder="admin@exemplo.com"
                  required
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Senha</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(null); }}
                  placeholder="Sua senha"
                  required
                />
                {loginError && <p className="text-sm text-destructive mt-1">{loginError}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={signingIn}>
                {signingIn ? "Entrando..." : "Entrar"}
              </Button>
              <div className="text-center">
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  ← Voltar para a loja
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
      category_id: product.category_id ?? "",
      image_url: product.image_url || "",
      weight: product.weight || "",
      description: product.description || "",
      stock_quantity: String(product.stock_quantity),
      is_active: product.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category_id) {
      toast.error("Preencha nome, preço e categoria");
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      category_id: form.category_id,
      image_url: form.image_url || null,
      weight: form.weight || null,
      description: form.description || null,
      stock_quantity: parseInt(form.stock_quantity) || 0,
      is_active: form.is_active,
    };

    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingProduct.id);

      if (error) {
        toast.error("Erro ao atualizar produto");
      } else {
        toast.success("Produto atualizado!");
        setDialogOpen(false);
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from("products").insert(payload);

      if (error) {
        toast.error("Erro ao criar produto");
      } else {
        toast.success("Produto criado!");
        setDialogOpen(false);
        fetchProducts();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Deseja excluir "${product.name}"?`)) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (error) {
      toast.error("Erro ao excluir produto");
    } else {
      toast.success("Produto excluído!");
      fetchProducts();
    }
  };

  const toggleActive = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);

    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      fetchProducts();
    }
  };

  const filteredProducts = products.filter((p) => {
    const catName = categoryName(p.category_id);
    const matchesCategory = categoryFilter === "Todos" || p.category_id === categoryFilter;
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      p.name.toLowerCase().includes(term) ||
      (p.description || "").toLowerCase().includes(term) ||
      catName.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-popover border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Package className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground hidden lg:block">Gerenciar Produtos</h1>
          </div>

          <div className="flex-1 flex items-center justify-end gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar produto..."
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todas as categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={openCreate} className="gap-2 shrink-0">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Produto</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sair">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Carregando...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum produto cadastrado</p>
            <Button onClick={openCreate} className="mt-4 gap-2">
              <Plus className="w-4 h-4" />
              Adicionar primeiro produto
            </Button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum produto encontrado para esta busca</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-right">Estoque</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-muted"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <Package className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.weight}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {categoryName(product.category_id)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {Number(product.price).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-medium ${
                          product.stock_quantity <= 5
                            ? "text-destructive"
                            : product.stock_quantity <= 20
                            ? "text-yellow-600"
                            : "text-foreground"
                        }`}
                      >
                        {product.stock_quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => toggleActive(product)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                          product.is_active
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {product.is_active ? "Ativo" : "Inativo"}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(product)}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product)}
                          title="Excluir"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      {/* Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nome do produto"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  value={form.stock_quantity}
                  onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Categoria *</Label>
                <Select
                  value={form.category_id}
                  onValueChange={(val) => setForm({ ...form, category_id: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="weight">Peso/Quantidade</Label>
                <Input
                  id="weight"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  placeholder="Ex: 500g, 60 cáps"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="image_url">Imagem do Produto (URL)</Label>
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-lg border border-border bg-muted overflow-hidden flex items-center justify-center shrink-0">
                  {form.image_url ? (
                    <img src={form.image_url} alt="Pré-visualização" className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    id="image_url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="/products/chia.jpg ou https://..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    As fotos da loja ficam em /products/ (ex: /products/chia.jpg)
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descrição do produto"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="is_active">Produto ativo (visível na loja)</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Salvando..." : editingProduct ? "Salvar" : "Criar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
