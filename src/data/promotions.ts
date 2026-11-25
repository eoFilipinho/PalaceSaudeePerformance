// Produtos em promoção. A chave é o NOME do produto (igual ao cadastrado) e o valor é o desconto em %.
// Para mudar, trocar ou remover uma promoção, edite apenas este arquivo.
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
