interface Ingrediente {
  key?: string;
  quantity?: number;
}


export interface Cardapio {
  id?: string;
  key?: string;
  code?: string;
  name?: string; // Nome do item do cardápio
  description?: string; // Descrição do item
  price?: number; // Preço do item
  category?: string; // Categoria do item (e.g., Bebidas, Pratos Principais)
  imageUrl?: string; // URL da imagem do item
  ingrediente?: Ingrediente;
}