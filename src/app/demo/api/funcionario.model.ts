export interface Funcionario {
  id?: string;
  key?: string;
  code?: string;
  name?: string; // Nome do funcionário
  email?: string; // Email do funcionário
  telefone?: string; // Telefone do funcionário
  endereco?: {
    rua?: string; // Rua do endereço
    numero?: string; // Número do endereço
    complemento?: string; // Complemento do endereço
    bairro?: string; // Bairro do endereço
    cidade?: string; // Cidade do endereço
    estado?: string; // Estado do endereço
    cep?: string; // CEP do endereço
  };
  cpf?: string; // CPF do funcionário
  cargo?: string; // Cargo do funcionário
  dataAdmissao?: Date; // Data de admissão do funcionário
  salario?: number; // Salário do funcionário
}