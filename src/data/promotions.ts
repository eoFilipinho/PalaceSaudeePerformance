// Promoções de reserva. A promoção oficial agora é o campo "Desconto (%)" do painel admin (coluna discount_percent).
// Estes valores só valem enquanto a coluna não existir no banco. A chave é o NOME do produto.
export const PROMOTIONS: Record<string, number> = {
  "Granola Artesanal": 5,
  "Vitamina C Natural": 8,
  "Whey Vegetal": 15,
};

export const applyPromotion = (name: string, price: number) => {
  const percent = PROMOTIONS[name];
  if (!percent) return { price };
  const discounted = Math.round(price * (100 - percent)) / 100;
  return { price: discounted, originalPrice: price, discountPercent: percent };
};

export const applyDiscount = (price: number, percent: number) => {
  if (!percent || percent <= 0) return { price };
  const discounted = Math.round(price * (100 - percent)) / 100;
  return { price: discounted, originalPrice: price, discountPercent: percent };
};
