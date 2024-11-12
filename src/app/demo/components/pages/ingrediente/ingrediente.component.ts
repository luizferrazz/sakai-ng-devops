import { Component, OnInit } from '@angular/core';
import { Ingrediente } from '../../../../demo/api/ingrediente.model';
import { Fornecedor } from '../../../../demo/api/fornecedor.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { IngredienteService } from '../../../../demo/service/ingrediente.service';
import { FornecedorService } from '../../../../demo/service/fornecedor.service';

@Component({
    templateUrl: './ingrediente.component.html',
    providers: [MessageService]
})
export class IngredienteComponent implements OnInit {

    ingredienteDialog: boolean = false;

    deleteIngredienteDialog: boolean = false;

    deleteIngredientesDialog: boolean = false;

    ingredientes: Ingrediente[] = [];

    ingrediente: Ingrediente = {};

    fornecedores: Fornecedor[] = [];

    selectedIngredientes: Ingrediente[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private ingredienteService: IngredienteService,
        private fornecedorService: FornecedorService,
        private messageService: MessageService
    ) { }

    ngOnInit() {
        this.ingredienteService.getIngredientes().subscribe(data => this.ingredientes = data);
        this.fornecedorService.getFornecedores().subscribe(data => this.fornecedores = data);

        this.cols = [
            { field: 'name', header: 'Nome' },
            { field: 'description', header: 'Descrição' },
            { field: 'quantity', header: 'Quantidade' },
            { field: 'unit', header: 'Unidade' },
            { field: 'supplier', header: 'Fornecedor' },
            { field: 'price', header: 'Preço' },
            { field: 'expirationDate', header: 'Data de Validade' },
            { field: 'storageLocation', header: 'Local de Armazenamento' }
        ];
    }

    openNovo() {
        this.ingrediente = {};
        this.submitted = false;
        this.ingredienteDialog = true;
    }

    deleteSelectedIngredientes() {
        this.deleteIngredientesDialog = true;
    }

    editIngrediente(ingrediente: Ingrediente) {
        this.ingrediente = { ...ingrediente };
        this.ingredienteDialog = true;
    }

    deleteIngrediente(ingrediente: Ingrediente) {
        this.deleteIngredienteDialog = true;
        this.ingrediente = { ...ingrediente };
    }

    confirmDeleteSelected() {
        this.deleteIngredientesDialog = false;

        // Excluir cada ingrediente selecionado
        this.selectedIngredientes.forEach(ingrediente => {
            this.ingredienteService.deleteIngrediente(ingrediente.key).then(() => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Ingrediente ${ingrediente.name} Excluído`, life: 3000 });
            }).catch(error => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Erro ao excluir ingrediente ${ingrediente.name}`, life: 3000 });
            });
        });

        // Atualizar a lista de ingredientes
        this.ingredientes = this.ingredientes.filter(val => !this.selectedIngredientes.includes(val));
        this.selectedIngredientes = [];
    }

    confirmDelete() {
        this.deleteIngredienteDialog = false;
        this.ingredienteService.deleteIngrediente(this.ingrediente.key).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ingrediente Excluído', life: 3000 });
            this.ingrediente = {};
            this.ingredientes = this.ingredientes.filter(val => val.key !== this.ingrediente.key); // Atualiza a lista de ingredientes
        }).catch(error => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir ingrediente', life: 3000 });
        });
    }

    hideDialog() {
        this.ingredienteDialog = false;
        this.submitted = false;
    }

    saveIngrediente() {
        this.submitted = true;

        if (this.ingrediente.name?.trim()) {
            if (this.ingrediente.id) {
                this.ingredienteService.updateIngrediente(this.ingrediente.key, this.ingrediente);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ingrediente Atualizado', life: 3000 });
            } else {
                this.ingrediente.id = this.createId();
                this.ingredienteService.createIngrediente(this.ingrediente);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Ingrediente Criado', life: 3000 });
            }

            this.ingredientes = [...this.ingredientes];
            this.ingredienteDialog = false;
            this.ingrediente = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.ingredientes.length; i++) {
            if (this.ingredientes[i].id === id) {
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