import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Edite aqui o texto da promoção. Confira os dados reais antes de publicar.
const PROMO = {
  badge: "Promoção da semana",
  title: "Semana da Saúde e Performance",
  subtitle: "Condições especiais em suplementos, vitaminas e chás selecionados.",
  cta: "Ver promoções",
  targetTab: "Promoções",
};

const PromoBanner = ({ onShop }: { onShop: (tab: string) => void }) => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground my-6"
  >
    <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
    <div className="absolute right-24 -bottom-24 h-56 w-56 rounded-full bg-white/5" />
    <div className="relative px-8 py-10 md:px-14 md:py-14 max-w-2xl space-y-4">
      <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
        {PROMO.badge}
      </span>
      <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight">{PROMO.title}</h2>
      <p className="text-sm md:text-base text-primary-foreground/80">{PROMO.subtitle}</p>
      <button
        onClick={() => onShop(PROMO.targetTab)}
        className="inline-flex items-center gap-2 rounded-full bg-popover px-6 py-3 text-sm font-semibold text-primary hover:bg-popover/90 transition-colors"
      >
        {PROMO.cta}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  </motion.section>
);

export default PromoBanner;
