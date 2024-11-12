export interface Ingrediente {
  id?: string;
  key?: string;
  code?: string;
  name?: string; // Nome do ingrediente
  description?: string; // Descrição do ingrediente
  quantity?: number; // Quantidade do ingrediente
  unit?: string; // Unidade de medida (e.g., kg, g, l, ml)
  supplier?: string; // Fornecedor do ingrediente
  price?: number; // Preço do ingrediente
  expirationDate?: Date; // Data de validade do ingrediente
  storageLocation?: string; // Local de armazenamento do ingrediente
}