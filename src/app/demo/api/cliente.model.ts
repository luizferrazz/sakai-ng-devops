export interface Cliente {
  id?: string;
  key?: string;
  code?: string;
  name?: string; // Nome do cliente
  email?: string; // Email do cliente
  telefone?: string; // Telefone do cliente
  endereco?: {
    rua?: string; // Rua do endereço
    numero?: string; // Número do endereço
    complemento?: string; // Complemento do endereço
    bairro?: string; // Bairro do endereço
    cidade?: string; // Cidade do endereço
    estado?: string; // Estado do endereço
    cep?: string; // CEP do endereço
  };
}