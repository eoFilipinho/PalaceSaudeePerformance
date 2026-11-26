import { Leaf, ShieldCheck, PackageCheck } from "lucide-react";
import { categories } from "@/data/products";

const benefits = [
  { icon: Leaf, title: "Produtos naturais", text: "Selecionados com cuidado para nutrir seu corpo." },
  { icon: ShieldCheck, title: "Compra segura", text: "Seus dados protegidos em todo o pedido." },
  { icon: PackageCheck, title: "Acompanhe seu pedido", text: "Veja o andamento em Meus Pedidos." },
];

export const BenefitsStrip = () => (
  <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
    {benefits.map(({ icon: Icon, title, text }) => (
      <div key={title} className="flex items-center gap-4 rounded-lg bg-popover shadow-card px-5 py-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{text}</p>
        </div>
      </div>
    ))}
  </section>
);

export const CategoryTiles = ({ onSelect }: { onSelect: (tab: string) => void }) => (
  <section className="py-8">
    <h2 className="font-display text-3xl font-semibold mb-4 text-foreground">Compre por categoria</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories
        .filter((c) => c !== "Todos")
        .map((c) => (
          <button
            key={c}
            onClick={() => onSelect(c)}
            className="rounded-lg bg-accent px-4 py-6 text-center text-sm font-semibold text-foreground shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
          >
            {c}
          </button>
        ))}
    </div>
  </section>
);
