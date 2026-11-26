import { Mail, Phone, MapPin, FileText } from "lucide-react";

// Dados FICTÍCIOS. Troque pelos dados reais da loja antes de publicar.
const STORE = {
  name: "Palace Saúde & Performance",
  email: "contato@palacesaude.exemplo.com.br",
  cnpj: "00.000.000/0001-00",
  phone: "(47) 90000-0000",
  location: "Joinville - SC",
};

const Footer = () => (
  <footer className="mt-16 bg-primary text-primary-foreground">
    <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-2">
      <div className="space-y-3">
        <h3 className="font-display text-2xl font-semibold">{STORE.name}</h3>
        <p className="text-sm text-primary-foreground/80 max-w-sm">
          A curadoria da terra, direto para sua mesa. Produtos naturais selecionados com cuidado.
        </p>
      </div>
      <ul className="space-y-3 text-sm">
        <li className="flex items-center gap-3">
          <Mail className="h-4 w-4 shrink-0" />
          <span>{STORE.email}</span>
        </li>
        <li className="flex items-center gap-3">
          <Phone className="h-4 w-4 shrink-0" />
          <span>{STORE.phone}</span>
        </li>
        <li className="flex items-center gap-3">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{STORE.location}</span>
        </li>
        <li className="flex items-center gap-3">
          <FileText className="h-4 w-4 shrink-0" />
          <span>CNPJ {STORE.cnpj}</span>
        </li>
      </ul>
    </div>
    <div className="border-t border-white/15">
      <p className="max-w-7xl mx-auto px-6 py-4 text-xs text-primary-foreground/70">
        © {new Date().getFullYear()} {STORE.name}. Todos os direitos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
