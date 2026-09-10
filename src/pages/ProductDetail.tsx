import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { CartProvider } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import CartDrawer from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ProductDetailContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, count, setIsOpen } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

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
      {/* Mini header */}
      <header className="w-full bg-popover/80 backdrop-blur-md sticky top-0 z-50 shadow-[0_1px_0_0_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1
            className="font-display text-xl font-semibold tracking-tight text-foreground cursor-pointer"
            onClick={() => navigate("/")}
          >
            Palace <span className="text-primary">Saúde & Performance</span>
          </h1>
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 hover:bg-foreground/[0.03] rounded-full transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-foreground" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold tabular-nums">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
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
              <p className="text-3xl font-display font-bold text-foreground">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </p>

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
            </div>
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
