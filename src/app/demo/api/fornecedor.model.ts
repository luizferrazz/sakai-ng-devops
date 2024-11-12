interface InventoryStatus {
  label: string;
  value: string;
}
export interface Fornecedor {
  id?: string;
  key?: string;
  code?: string;
  name?: string; // Nome do fornecedor
  email?: string; // Email do fornecedor
  telefone?: string; // Telefone do fornecedor
  endereco?: {
    rua?: string; // Rua do endereço
    numero?: string; // Número do endereço
    complemento?: string; // Complemento do endereço
    bairro?: string; // Bairro do endereço
    cidade?: string; // Cidade do endereço
    estado?: string; // Estado do endereço
    cep?: string; // CEP do endereço
  };
  cnpj?: string; // CNPJ do fornecedor
  razaoSocial?: string; // Razão social do fornecedor
}