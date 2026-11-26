import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group rounded-lg shadow-card hover:shadow-card-hover transition-shadow bg-popover overflow-hidden cursor-pointer"
      onClick={() => navigate(`/produto/${product.id}`)}
    >
      {/* Image area */}
      <div className="relative aspect-square bg-accent flex items-center justify-center overflow-hidden">
        {product.discountPercent && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white">
            -{product.discountPercent}%
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          {product.category}
        </p>
        <h3 className="text-base font-semibold text-foreground leading-tight">{product.name}</h3>
        <p className="text-xs text-muted-foreground">{product.weight}</p>

        <div className="flex items-center justify-between pt-1">
          {product.originalPrice ? (
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-red-600 line-through tabular-nums">
                R$ {product.originalPrice.toFixed(2).replace(".", ",")}
              </span>
              <span className="text-sm font-bold text-green-700 tabular-nums">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
            </div>
          ) : (
            <span className="text-sm font-semibold text-foreground tabular-nums">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); addItem(product); }}
            className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
