import { Search, ShoppingBag, User, Package } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const navItems = ["Início", "Produtos", "Cereais", "Temperos", "Vitaminas", "Suplementação", "Chás", "Grãos e Sementes"];

const LoginBox = () => {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, isAdmin, signIn, signUp, signOut } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) toast.error("E-mail ou senha inválidos");
      else {
        toast.success("Bem-vindo!");
        setOpen(false);
      }
    } else {
      const { error, needsConfirmation } = await signUp(email, password, name);
      if (error) toast.error(error);
      else if (needsConfirmation) toast.success("Confira seu e-mail para confirmar a conta");
      else {
        toast.success("Conta criada!");
        setOpen(false);
      }
    }
    setPassword("");
    setBusy(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-foreground/[0.03] rounded-full transition-colors"
        aria-label="Login"
      >
        <User className={`w-6 h-6 ${user ? "text-primary" : "text-foreground"}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 top-12 w-72 bg-popover border border-border rounded-xl shadow-lg p-5 z-50"
          >
            {user ? (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Minha conta</h3>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>
                </div>
                <Link
                  to="/minha-conta"
                  onClick={() => setOpen(false)}
                  className="block text-sm text-foreground hover:text-primary transition-colors"
                >
                  Área do Cliente
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="block text-sm text-foreground hover:text-primary transition-colors"
                  >
                    Painel do administrador
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await signOut();
                    setOpen(false);
                    toast.success("Você saiu da conta");
                  }}
                  className="w-full bg-muted text-foreground rounded-lg py-2 text-sm font-semibold hover:bg-muted/70 transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-sm font-bold text-foreground mb-4">
                  {isLogin ? "Entrar" : "Criar Conta"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                  {!isLogin && (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nome completo"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                    />
                  )}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail"
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full bg-primary text-primary-foreground rounded-lg py-2 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {busy ? "Aguarde..." : isLogin ? "Entrar" : "Registrar"}
                  </button>
                </form>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-center"
                >
                  {isLogin ? "Não tem conta? Criar conta" : "Já tem conta? Entrar"}
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type HeaderProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
};

const Header = ({ activeTab, onTabChange, searchQuery, onSearchChange }: HeaderProps) => {
  const { count, setIsOpen } = useCart();

  return (
    <header className="w-full bg-popover/80 backdrop-blur-md sticky top-0 z-50 shadow-[0_1px_0_0_rgba(0,0,0,0.03)]">
      {/* Top Row */}
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Palace <span className="text-primary">Saúde & Performance</span>
          </h1>
        </div>

        {/* Search + Icons */}
        <div className="flex items-center gap-3">
          <div className="relative group max-w-md w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-foreground/[0.03] rounded-full py-2.5 pl-10 pr-4 text-sm focus:bg-foreground/[0.06] transition-all outline-none placeholder:text-muted-foreground"
              placeholder="Buscar sementes, chás..."
            />
          </div>
          <Link
            to="/minha-conta?tab=pedidos"
            className="p-2 hover:bg-foreground/[0.03] rounded-full transition-colors"
            aria-label="Meus Pedidos"
          >
            <Package className="w-6 h-6 text-foreground" />
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 hover:bg-foreground/[0.03] rounded-full transition-colors"
          >
            <ShoppingBag className="w-6 h-6 text-foreground" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold tabular-nums"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <LoginBox />
        </div>
      </div>

      {/* Nav Row */}
      <nav className="flex justify-center gap-8 py-3.5 border-t border-foreground/[0.03] overflow-x-auto px-4">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => onTabChange(item)}
            className={`text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors relative ${
              activeTab === item ? "text-primary" : "text-foreground/50 hover:text-foreground/80"
            }`}
          >
            {item}
            {activeTab === item && (
              <motion.div
                layoutId="nav-underline"
                className="absolute -bottom-3.5 left-0 right-0 h-0.5 bg-primary rounded-full"
              />
            )}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
