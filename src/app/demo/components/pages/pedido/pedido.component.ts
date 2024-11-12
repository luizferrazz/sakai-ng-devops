import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../../api/pedido.model';
import { Cliente } from '../../../api/cliente.model';
import { Cardapio } from '../../../api/cardapio.model';
import { Funcionario } from '../../../api/funcionario.model';
import { MessageService } from 'primeng/api';
import { PedidoService } from '../../../service/pedido.service';
import { ClienteService } from '../../../service/cliente.service';
import { CardapioService } from '../../../service/cardapio.service';
import { FuncionarioService } from '../../../service/funcionario.service';
import { Table } from 'primeng/table';

@Component({
    templateUrl: './pedido.component.html',
    providers: [MessageService]
})
export class PedidoComponent implements OnInit {

    pedidoDialog: boolean = false;

    deletePedidoDialog: boolean = false;

    deletePedidosDialog: boolean = false;

    pedidos: Pedido[] = [];

    pedido: Pedido = {};

    clientes: Cliente[] = [];
    cardapios: Cardapio[] = [];
    funcionarios: Funcionario[] = [];

    selectedPedidos: Pedido[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    statusOptions = [
        { label: 'Pendente', value: 'Pendente' },
        { label: 'Pago', value: 'Pago' }
    ];

    constructor(
        private pedidoService: PedidoService,
        private clienteService: ClienteService,
        private cardapioService: CardapioService,
        private funcionarioService: FuncionarioService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.pedidoService.getPedidos().subscribe(data => this.pedidos = data);
        this.clienteService.getClientes().subscribe(data => this.clientes = data);
        this.cardapioService.getCardapios().subscribe(data => this.cardapios = data);
        this.funcionarioService.getFuncionarios().subscribe(data => this.funcionarios = data);

        this.cols = [
            { field: 'cliente', header: 'Cliente' },
            { field: 'total', header: 'Total' },
            { field: 'status', header: 'Status' }
        ];
    }

    openNovo() {
        this.pedido = { cliente: { name: '', endereco: '' }, itens: [{ cardapio: { name: '', price: 0 }, quantidade: 1 }], funcionario: { name: '', id: '' } }; // Inicializa o objeto itens
        this.submitted = false;
        this.pedidoDialog = true;
    }

    deleteSelectedPedidos() {
        this.deletePedidosDialog = true;
    }

    editPedido(pedido: Pedido) {
        this.pedido = { ...pedido, itens: pedido.itens || [{ cardapio: { name: '', price: 0 }, quantidade: 1 }] }; // Garante que itens esteja inicializado
        this.pedidoDialog = true;
    }

    deletePedido(pedido: Pedido) {
        this.deletePedidoDialog = true;
        this.pedido = { ...pedido };
    }

    confirmDeleteSelected() {
        this.deletePedidosDialog = false;

        // Excluir cada pedido selecionado
        this.selectedPedidos.forEach(pedido => {
            this.pedidoService.deletePedido(pedido.key).then(() => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Pedido ${pedido.cliente?.name} Excluído`, life: 3000 });
            }).catch(error => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Erro ao excluir pedido ${pedido.cliente?.name}`, life: 3000 });
            });
        });

        // Atualizar a lista de pedidos
        this.pedidos = this.pedidos.filter(val => !this.selectedPedidos.includes(val));
        this.selectedPedidos = [];
    }

    confirmDelete() {
        this.deletePedidoDialog = false;
        this.pedidoService.deletePedido(this.pedido.key).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pedido Excluído', life: 3000 });
            this.pedido = {};
            this.pedidos = this.pedidos.filter(val => val.key !== this.pedido.key); // Atualiza a lista de pedidos
        }).catch(error => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir pedido', life: 3000 });
        });
    }

    hideDialog() {
        this.pedidoDialog = false;
        this.submitted = false;
    }

    savePedido() {
        this.submitted = true;

        if (this.pedido.cliente?.name?.trim()) {
            if (this.pedido.id) {
                this.pedidoService.updatePedido(this.pedido.key, this.pedido);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pedido Atualizado', life: 3000 });
            } else {
                this.pedido.id = this.createId();
                this.pedidoService.createPedido(this.pedido);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Pedido Criado', life: 3000 });
            }

            this.pedidos = [...this.pedidos];
            this.pedidoDialog = false;
            this.pedido = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.pedidos.length; i++) {
            if (this.pedidos[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onPizzaChange(event: any) {
        const selectedPizza = this.cardapios.find(pizza => pizza.id === event.value.id);
        if (selectedPizza) {
            this.pedido.total = selectedPizza.price;
        }
    }
}