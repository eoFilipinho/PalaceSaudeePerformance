import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";
import { applyPromotion, applyDiscount } from "@/data/promotions";

export type DbCategory = {
  id: string;
  name: string;
  description: string | null;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name, description")
      .order("name")
      .then(({ data }) => {
        setCategories(data ?? []);
        setLoading(false);
      });
  }, []);

  return { categories, loading };
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*, categories(name)")
      .eq("is_active", true)
      .order("name")
      .then(({ data }) => {
        const mapped: Product[] = (data ?? []).map((p) => ({
          id: p.id,
          name: p.name,
          ...("discount_percent" in p
            ? applyDiscount(Number(p.price), Number((p as { discount_percent?: number | null }).discount_percent ?? 0))
            : applyPromotion(p.name, Number(p.price))),
          category: (p.categories as { name: string } | null)?.name ?? "",
          image: p.image_url ?? "/placeholder.svg",
          weight: p.weight ?? "",
          description: p.description ?? "",
        }));
        setProducts(mapped);
        setLoading(false);
      });
  }, []);

  return { products, loading };
};
