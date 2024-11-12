import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../../demo/api/cliente.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ClienteService } from '../../../../demo/service/cliente.service';
import { CepService } from '../../../../demo/service/cep.service';

@Component({
    templateUrl: './cliente.component.html',
    providers: [MessageService]
})
export class ClienteComponent implements OnInit {

    clienteDialog: boolean = false;

    deleteClienteDialog: boolean = false;

    deleteClientesDialog: boolean = false;

    clientes: Cliente[] = [];

    cliente: Cliente = {};

    selectedClientes: Cliente[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    ufs: any[] = [];

    municipios: any[] = [];


    constructor(private clienteService: ClienteService, private messageService: MessageService, private cepService: CepService) { }

    ngOnInit() {
        this.clienteService.getClientes().subscribe(data => this.clientes = data);

        this.cols = [
            { field: 'name', header: 'Nome' },
            { field: 'email', header: 'Email' },
            { field: 'telefone', header: 'Telefone' },
            { field: 'endereco', header: 'Endereço' }
        ];

        this.cepService.buscarEstado().subscribe((ufs: any) => {
            this.ufs = ufs;
        });
    }

    getCep(cep: any) {
        this.cepService.buscar(cep).subscribe((cep: any) => {
            this.cliente.endereco.rua = cep.logradouro;
            this.cliente.endereco.bairro = cep.bairro;
            this.cliente.endereco.cep = cep.cep;
            const estado = this.ufs.find((uf: any) => uf.sigla === cep.uf);
            this.cliente.endereco.estado = estado;
            this.getMunicipios(estado.id);
            setTimeout(() => {
                const municipio = this.municipios.find((cidade: { nome: string }) => cidade.nome === cep.localidade);
                this.cliente.endereco.cidade = municipio;
            }, 500);
        });
    }

    getMunicipios(code: String) {
        this.cepService.buscarCidade(code).subscribe((municipios: any) => {
            this.municipios = municipios;
        });
    }

    openNovo() {
        this.cliente = { endereco: {} }; // Inicializa o objeto endereco
        this.submitted = false;
        this.clienteDialog = true;
    }

    deleteSelectedClientes() {
        this.deleteClientesDialog = true;
    }

    editCliente(cliente: Cliente) {
        this.cliente = { ...cliente, endereco: cliente.endereco || {} }; // Garante que endereco esteja inicializado
        this.clienteDialog = true;
    }

    deleteCliente(cliente: Cliente) {
        this.deleteClienteDialog = true;
        this.cliente = { ...cliente };
    }
    
    confirmDeleteSelected() {
        this.deleteClientesDialog = false;
    
        // Excluir cada cliente selecionado
        this.selectedClientes.forEach(cliente => {
            this.clienteService.deleteCliente(cliente.key).then(() => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Cliente ${cliente.name} Excluído`, life: 3000 });
            }).catch(error => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Erro ao excluir cliente ${cliente.name}`, life: 3000 });
            });
        });
    
        // Atualizar a lista de clientes
        this.clientes = this.clientes.filter(val => !this.selectedClientes.includes(val));
        this.selectedClientes = [];
    }

    confirmDelete() {
        this.deleteClienteDialog = false;
        this.clienteService.deleteCliente(this.cliente.key).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente Excluído', life: 3000 });
            this.cliente = {};
            this.clientes = this.clientes.filter(val => val.key !== this.cliente.key); // Atualiza a lista de clientes
        }).catch(error => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir cliente', life: 3000 });
        });
    }

    hideDialog() {
        this.clienteDialog = false;
        this.submitted = false;
    }

    saveCliente() {
        this.submitted = true;

        if (this.cliente.name?.trim()) {
            if (this.cliente.id) {
                this.clienteService.updateCliente(this.cliente.key, this.cliente);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente Atualizado', life: 3000 });
            } else {
                this.cliente.id = this.createId();
                this.clienteService.createCliente(this.cliente);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Cliente Criado', life: 3000 });
            }

            this.clientes = [...this.clientes];
            this.clienteDialog = false;
            this.cliente = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.clientes.length; i++) {
            if (this.clientes[i].id === id) {
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
}