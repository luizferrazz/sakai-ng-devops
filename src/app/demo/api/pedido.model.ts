interface InventoryStatus {
  label: string;
  value: string;
}

interface Cardapio {
  // Define the properties of Cardapio here
  name: string;
  price: number;
}

interface Cliente {
  // Define the properties of Cliente here
  name: string;
  endereco: string;
}

interface Funcionario {
  // Define the properties of Funcionario here
  name: string;
  id: string;
}
export interface Pedido {
  id?: string;
  key?: string;
  code?: string;
  cliente?: Cliente; // Cliente associado ao pedido
  itens?: Array<{
    cardapio: Cardapio; // Item do cardápio
    quantidade: number; // Quantidade do item
  }>;
  funcionario?: Funcionario; // Funcionário que atendeu
  total?: number; // Total do pedido
  status?: string; // Status do pedido (e.g., Pendente, Enviado, Entregue)
  dataPedido?: Date; // Data do pedido
  dataEntrega?: Date; // Data de entrega do pedido
}