import imgAveiaEmFlocos from "@/assets/products/aveia-em-flocos.jpg";
import imgGranolaArtesanal from "@/assets/products/granola-artesanal.jpg";
import imgMuesliTropical from "@/assets/products/muesli-tropical.jpg";
import imgFareloDeTrigo from "@/assets/products/farelo-de-trigo.jpg";
import imgCurcuma from "@/assets/products/curcuma.jpg";
import imgPimentaCaiena from "@/assets/products/pimenta-caiena.jpg";
import imgCanelaCeilao from "@/assets/products/canela-ceilao.jpg";
import imgGengibreDesidratado from "@/assets/products/gengibre-desidratado.jpg";
import imgVitaminaC from "@/assets/products/vitamina-c.jpg";
import imgComplexoB from "@/assets/products/complexo-b.jpg";
import imgVitaminaD3 from "@/assets/products/vitamina-d3.jpg";
import imgZincoQuelado from "@/assets/products/zinco-quelado.jpg";
import imgWheyVegetal from "@/assets/products/whey-vegetal.jpg";
import imgCreatinaPura from "@/assets/products/creatina-pura.jpg";
import imgSpirulina from "@/assets/products/spirulina.jpg";
import imgColagenoHidrolisado from "@/assets/products/colageno-hidrolisado.jpg";
import imgCamomila from "@/assets/products/camomila.jpg";
import imgChaVerde from "@/assets/products/cha-verde.jpg";
import imgHibisco from "@/assets/products/hibisco.jpg";
import imgErvaCidreira from "@/assets/products/erva-cidreira.jpg";
import imgChia from "@/assets/products/chia.jpg";
import imgLinhacaDourada from "@/assets/products/linhaca-dourada.jpg";
import imgQuinoaReal from "@/assets/products/quinoa-real.jpg";
import imgSementeGirassol from "@/assets/products/semente-girassol.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  weight: string;
  description: string;
  originalPrice?: number;
  discountPercent?: number;
};

export const categories = [
  "Todos",
  "Cereais",
  "Temperos",
  "Vitaminas",
  "Suplementação",
  "Chás",
  "Grãos e Sementes",
] as const;

export type Category = (typeof categories)[number];

export const products: Product[] = [
  { id: "1", name: "Aveia em Flocos", price: 12.9, category: "Cereais", image: imgAveiaEmFlocos, weight: "500g", description: "Aveia em flocos finos de alta qualidade, ideal para preparar mingaus, vitaminas e receitas saudáveis. Rica em fibras solúveis e beta-glucana, auxilia no controle do colesterol e promove saciedade prolongada. Sem conservantes ou aditivos." },
  { id: "2", name: "Granola Artesanal", price: 18.5, category: "Cereais", image: imgGranolaArtesanal, weight: "400g", description: "Granola artesanal crocante feita com aveia, mel orgânico, castanhas e frutas secas selecionadas. Assada lentamente para garantir textura perfeita. Excelente fonte de energia para o café da manhã ou lanches intermediários." },
  { id: "3", name: "Muesli Tropical", price: 22.0, category: "Cereais", image: imgMuesliTropical, weight: "350g", description: "Muesli tropical com flocos de aveia, coco ralado, manga desidratada, abacaxi e castanha de caju. Uma explosão de sabores tropicais em cada colherada. Sem adição de açúcar, adoçado naturalmente com as frutas." },
  { id: "4", name: "Farelo de Trigo", price: 8.9, category: "Cereais", image: imgFareloDeTrigo, weight: "300g", description: "Farelo de trigo finamente moído, rico em fibras insolúveis que auxiliam no bom funcionamento intestinal. Versátil para adicionar em sucos, iogurtes, massas de pão e bolos integrais." },
  { id: "5", name: "Cúrcuma em Pó", price: 15.0, category: "Temperos", image: imgCurcuma, weight: "100g", description: "Cúrcuma (açafrão-da-terra) em pó de origem orgânica, com alta concentração de curcumina. Poderoso anti-inflamatório e antioxidante natural. Ideal para golden milk, temperar arroz, sopas e molhos." },
  { id: "6", name: "Pimenta Caiena", price: 11.5, category: "Temperos", image: imgPimentaCaiena, weight: "80g", description: "Pimenta caiena moída com intensidade moderada, perfeita para quem busca um toque picante nas refeições. Auxilia no metabolismo e na circulação sanguínea. Embalada em pote com tampa dosadora." },
  { id: "7", name: "Canela do Ceilão", price: 19.9, category: "Temperos", image: imgCanelaCeilao, weight: "120g", description: "Canela do Ceilão (canela verdadeira) em pó, considerada a variedade mais nobre e aromática. Baixo teor de cumarina, segura para consumo diário. Perfeita para sobremesas, cafés especiais e chás." },
  { id: "8", name: "Gengibre Desidratado", price: 14.0, category: "Temperos", image: imgGengibreDesidratado, weight: "100g", description: "Gengibre desidratado em lascas finas, concentrando todo o sabor e propriedades da raiz fresca. Anti-inflamatório e digestivo natural. Ideal para chás, temperos e preparações culinárias diversas." },
  { id: "9", name: "Vitamina C Natural", price: 45.0, category: "Vitaminas", image: imgVitaminaC, weight: "60 cáps", description: "Vitamina C extraída de acerola orgânica, com 500mg por cápsula. Poderoso antioxidante que fortalece o sistema imunológico e auxilia na absorção de ferro. Livre de corantes e aromatizantes artificiais." },
  { id: "10", name: "Complexo B", price: 38.0, category: "Vitaminas", image: imgComplexoB, weight: "90 cáps", description: "Complexo B completo com todas as 8 vitaminas do grupo B em doses otimizadas. Essencial para o metabolismo energético, saúde do sistema nervoso e formação de células sanguíneas. Formulação vegana." },
  { id: "11", name: "Vitamina D3", price: 32.0, category: "Vitaminas", image: imgVitaminaD3, weight: "60 cáps", description: "Vitamina D3 (colecalciferol) com 2000 UI por cápsula, em base de óleo de coco para melhor absorção. Essencial para saúde óssea, imunidade e bem-estar geral. Recomendada especialmente nos meses de inverno." },
  { id: "12", name: "Zinco Quelado", price: 28.0, category: "Vitaminas", image: imgZincoQuelado, weight: "60 cáps", description: "Zinco quelado bisglicinato com 30mg por cápsula, forma de alta biodisponibilidade. Fundamental para imunidade, saúde da pele, cabelos e unhas. Tecnologia de quelação para absorção superior." },
  { id: "13", name: "Whey Vegetal", price: 89.9, category: "Suplementação", image: imgWheyVegetal, weight: "900g", description: "Proteína vegetal premium com blend de ervilha, arroz e amaranto, oferecendo 25g de proteína por dose. Perfil completo de aminoácidos essenciais. Sabor neutro, sem adoçantes artificiais. Ideal para atletas e veganos." },
  { id: "14", name: "Creatina Pura", price: 65.0, category: "Suplementação", image: imgCreatinaPura, weight: "300g", description: "Creatina monoidratada micronizada com 99,9% de pureza. Auxilia no ganho de força, potência muscular e performance em exercícios de alta intensidade. 100 doses por embalagem. Selo Creapure®." },
  { id: "15", name: "Spirulina", price: 42.0, category: "Suplementação", image: imgSpirulina, weight: "120 cáps", description: "Spirulina orgânica em cápsulas de 500mg, superalimento com mais de 60% de proteína. Rica em ferro, vitaminas do complexo B e antioxidantes. Cultivada em águas controladas sem contaminantes." },
  { id: "16", name: "Colágeno Hidrolisado", price: 55.0, category: "Suplementação", image: imgColagenoHidrolisado, weight: "300g", description: "Colágeno hidrolisado tipo I e III com peptídeos bioativos de alta absorção. Auxilia na firmeza da pele, saúde das articulações e fortalecimento de cabelos e unhas. Dissolve facilmente em água." },
  { id: "17", name: "Camomila Premium", price: 16.5, category: "Chás", image: imgCamomila, weight: "30 sachês", description: "Camomila premium com flores inteiras selecionadas de origem orgânica. Propriedades calmantes e digestivas reconhecidas. Sachês individuais em envelope de papel que preserva aroma e frescor. Perfeita para relaxar antes de dormir." },
  { id: "18", name: "Chá Verde Orgânico", price: 21.0, category: "Chás", image: imgChaVerde, weight: "100g", description: "Chá verde orgânico de folhas inteiras, colhido na primeira safra para máximo teor de catequinas e L-teanina. Termogênico natural que auxilia no metabolismo. Sabor suave e levemente adstringente." },
  { id: "19", name: "Hibisco", price: 14.0, category: "Chás", image: imgHibisco, weight: "80g", description: "Flores de hibisco desidratadas com cor rubi intenso e sabor levemente ácido e refrescante. Rico em antocianinas e vitamina C. Auxilia na redução da retenção de líquidos. Pode ser consumido quente ou gelado." },
  { id: "20", name: "Erva-cidreira", price: 12.0, category: "Chás", image: imgErvaCidreira, weight: "50g", description: "Erva-cidreira (melissa) desidratada com aroma cítrico suave e propriedades calmantes. Auxilia na digestão e no alívio de cólicas. Cultivada sem agrotóxicos em pequenas propriedades familiares." },
  { id: "21", name: "Chia", price: 17.5, category: "Grãos e Sementes", image: imgChia, weight: "250g", description: "Sementes de chia selecionadas, ricas em ômega-3 vegetal, fibras e proteínas. Absorvem até 12x seu peso em água, promovendo saciedade. Versáteis para pudins, smoothies, saladas e receitas diversas." },
  { id: "22", name: "Linhaça Dourada", price: 13.0, category: "Grãos e Sementes", image: imgLinhacaDourada, weight: "300g", description: "Linhaça dourada em grãos, fonte excepcional de lignanas, ômega-3 e fibras. A variedade dourada possui sabor mais suave que a marrom. Ideal para consumir triturada em sucos, vitaminas e receitas integrais." },
  { id: "23", name: "Quinoa Real", price: 24.0, category: "Grãos e Sementes", image: imgQuinoaReal, weight: "500g", description: "Quinoa real boliviana em grãos, considerada um superalimento com todos os aminoácidos essenciais. Rica em ferro, magnésio e fibras. Versátil para substituir arroz, preparar saladas e tabules nutritivos." },
  { id: "24", name: "Semente de Girassol", price: 11.0, category: "Grãos e Sementes", image: imgSementeGirassol, weight: "200g", description: "Sementes de girassol descascadas e cruas, fonte de vitamina E, selênio e magnésio. Excelente para snacks saudáveis, granolas caseiras, saladas e decoração de pães artesanais. Sem sal adicionado." },
];

export const featuredProducts = products.filter((_, i) => [0, 4, 8, 12, 16, 20].includes(i));
