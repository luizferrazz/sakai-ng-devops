import { Component, OnInit } from '@angular/core';
import { Fornecedor } from '../../../../demo/api/fornecedor.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FornecedorService } from '../../../../demo/service/fornecedor.service';

@Component({
    templateUrl: './fornecedor.component.html',
    providers: [MessageService]
})
export class FornecedorComponent implements OnInit {

    fornecedorDialog: boolean = false;

    deleteFornecedorDialog: boolean = false;

    deleteFornecedoresDialog: boolean = false;

    fornecedores: Fornecedor[] = [];

    fornecedor: Fornecedor = {};

    selectedFornecedores: Fornecedor[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private fornecedorService: FornecedorService, private messageService: MessageService) { }

    ngOnInit() {
        this.fornecedorService.getFornecedores().subscribe(data => this.fornecedores = data);

        this.cols = [
            { field: 'name', header: 'Nome' },
            { field: 'email', header: 'Email' },
            { field: 'telefone', header: 'Telefone' },
            { field: 'endereco', header: 'Endereço' }
        ];
    }

    openNovo() {
        this.fornecedor = { endereco: {} }; // Inicializa o objeto endereco
        this.submitted = false;
        this.fornecedorDialog = true;
    }

    deleteSelectedFornecedores() {
        this.deleteFornecedoresDialog = true;
    }

    editFornecedor(fornecedor: Fornecedor) {
        this.fornecedor = { ...fornecedor, endereco: fornecedor.endereco || {} }; // Garante que endereco esteja inicializado
        this.fornecedorDialog = true;
    }

    deleteFornecedor(fornecedor: Fornecedor) {
        this.deleteFornecedorDialog = true;
        this.fornecedor = { ...fornecedor };
    }

    confirmDeleteSelected() {
        this.deleteFornecedoresDialog = false;

        // Excluir cada fornecedor selecionado
        this.selectedFornecedores.forEach(fornecedor => {
            this.fornecedorService.deleteFornecedor(fornecedor.key).then(() => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Fornecedor ${fornecedor.name} Excluído`, life: 3000 });
            }).catch(error => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Erro ao excluir fornecedor ${fornecedor.name}`, life: 3000 });
            });
        });

        // Atualizar a lista de fornecedores
        this.fornecedores = this.fornecedores.filter(val => !this.selectedFornecedores.includes(val));
        this.selectedFornecedores = [];
    }

    confirmDelete() {
        this.deleteFornecedorDialog = false;
        this.fornecedorService.deleteFornecedor(this.fornecedor.key).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor Excluído', life: 3000 });
            this.fornecedor = {};
            this.fornecedores = this.fornecedores.filter(val => val.key !== this.fornecedor.key); // Atualiza a lista de fornecedores
        }).catch(error => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir fornecedor', life: 3000 });
        });
    }

    hideDialog() {
        this.fornecedorDialog = false;
        this.submitted = false;
    }

    saveFornecedor() {
        this.submitted = true;

        if (this.fornecedor.name?.trim()) {
            if (this.fornecedor.id) {
                this.fornecedorService.updateFornecedor(this.fornecedor.key, this.fornecedor);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor Atualizado', life: 3000 });
            } else {
                this.fornecedor.id = this.createId();
                this.fornecedorService.createFornecedor(this.fornecedor);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Fornecedor Criado', life: 3000 });
            }

            this.fornecedores = [...this.fornecedores];
            this.fornecedorDialog = false;
            this.fornecedor = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.fornecedores.length; i++) {
            if (this.fornecedores[i].id === id) {
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