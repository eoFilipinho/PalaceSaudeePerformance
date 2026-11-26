import { useParams, useNavigate, Link } from "react-router-dom";
import { Plus, Minus, ShoppingBag, Leaf, ShieldCheck, PackageCheck, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { CartProvider } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ProductDetailContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { products, loading } = useProducts();

  const product = products.find((p) => p.id === id);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Produto não encontrado</p>
          <Button variant="outline" onClick={() => navigate("/")}>
            Voltar à loja
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        activeTab={product.category}
        onTabChange={(tab) => navigate(`/?tab=${encodeURIComponent(tab)}`)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim()) navigate(`/?q=${encodeURIComponent(q)}`);
        }}
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
          <span>›</span>
          <span>{product.category}</span>
          <span>›</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* Product detail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          {/* Image */}
          <div className="aspect-square bg-accent rounded-2xl overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-2">
                {product.category}
              </p>
              <h2 className="font-display text-4xl font-bold text-foreground leading-tight">
                {product.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{product.weight}</p>
            </div>

            <p className="text-base text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <Separator />

            <div className="space-y-5">
              {product.originalPrice ? (
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-display font-bold text-green-700">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </p>
                  <p className="text-lg text-red-600 line-through">
                    R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                  </p>
                  <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
                    -{product.discountPercent}%
                  </span>
                </div>
              ) : (
                <p className="text-3xl font-display font-bold text-foreground">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </p>
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-muted rounded-full px-1 py-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-full h-11 text-sm font-bold tracking-wide gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Adicionar ao Carrinho
                </Button>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-muted-foreground">
                    Total ({quantity} {quantity === 1 ? "unidade" : "unidades"})
                  </span>
                  <span className="font-semibold text-foreground tabular-nums">
                    R$ {(product.price * quantity).toFixed(2).replace(".", ",")}
                  </span>
                </div>
                {product.originalPrice && (
                  <p className="text-xs font-medium text-green-700">
                    Você economiza R$ {((product.originalPrice - product.price) * quantity).toFixed(2).replace(".", ",")}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <ul className="space-y-3">
              {[
                { icon: Leaf, title: "Produto natural", text: "Selecionado com cuidado para nutrir seu corpo." },
                { icon: ShieldCheck, title: "Compra segura", text: "Seus dados protegidos em todo o pedido." },
                { icon: PackageCheck, title: "Acompanhe seu pedido", text: "Veja o andamento em Meus Pedidos." },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="rounded-xl bg-popover shadow-card divide-y divide-black/5 text-sm">
              <div className="flex justify-between px-5 py-3">
                <span className="text-muted-foreground">Categoria</span>
                <span className="font-medium text-foreground">{product.category}</span>
              </div>
              <div className="flex justify-between px-5 py-3">
                <span className="text-muted-foreground">Quantidade</span>
                <span className="font-medium text-foreground">{product.weight}</span>
              </div>
              {product.discountPercent && (
                <div className="flex justify-between px-5 py-3">
                  <span className="text-muted-foreground">Promoção</span>
                  <span className="font-medium text-green-700">{product.discountPercent}% de desconto</span>
                </div>
              )}
            </div>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${product.name} - ${window.location.href}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Compartilhar no WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20">
            <h3 className="font-display text-2xl font-semibold mb-8 text-foreground">
              Produtos Relacionados
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
};

const ProductDetail = () => (
  <CartProvider>
    <ProductDetailContent />
  </CartProvider>
);

export default ProductDetail;
