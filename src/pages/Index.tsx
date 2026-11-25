import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import PromoBanner from "@/components/PromoBanner";
import Footer from "@/components/Footer";
import { BenefitsStrip, CategoryTiles } from "@/components/HomeHighlights";
import { CartProvider } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { categories } from "@/data/products";

const validTabs = ["Início", "Produtos", "Promoções", ...categories.filter((c) => c !== "Todos")];

const IndexContent = () => {
  const [params] = useSearchParams();
  const tabParam = params.get("tab") ?? "";
  const [activeTab, setActiveTab] = useState(validTabs.includes(tabParam) ? tabParam : "Início");
  const [searchQuery, setSearchQuery] = useState(params.get("q") ?? "");

  // Vindo da página de um produto com uma busca: devolve o foco ao campo, no fim do texto.
  useEffect(() => {
    if (!params.get("q")) return;
    const el = document.getElementById("site-search") as HTMLInputElement | null;
    if (el) {
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, []);
  const { products } = useProducts();

  const featuredProducts = useMemo(() => products.filter((_, i) => i % 2 === 0).slice(0, 12), [products]);

  const filteredProducts = useMemo(() => {
    let list =
      activeTab === "Início"
        ? featuredProducts
        : activeTab === "Produtos"
        ? products
        : activeTab === "Promoções"
        ? products.filter((p) => p.discountPercent)
        : products.filter((p) => p.category === activeTab);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = (activeTab === "Início" || activeTab === "Produtos" ? products : list).filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeTab, searchQuery, products, featuredProducts]);

  const title = activeTab === "Início" ? "Colheita da Semana" : activeTab === "Produtos" ? "Todos os Produtos" : activeTab;

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="max-w-7xl mx-auto px-6">
        {activeTab === "Início" && !searchQuery && (<><HeroSection /><PromoBanner onShop={setActiveTab} /><BenefitsStrip /></>)}
        <ProductGrid products={filteredProducts} title={title} />
        {activeTab === "Início" && !searchQuery && <CategoryTiles onSelect={setActiveTab} />}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

const Index = () => (
  <CartProvider>
    <IndexContent />
  </CartProvider>
);

export default Index;
