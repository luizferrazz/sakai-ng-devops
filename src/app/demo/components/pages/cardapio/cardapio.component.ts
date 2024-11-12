import { Component, OnInit } from '@angular/core';
import { Cardapio } from '../../../../demo/api/cardapio.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CardapioService } from '../../../../demo/service/cardapio.service';

@Component({
    templateUrl: './cardapio.component.html',
    providers: [MessageService]
})
export class CardapioComponent implements OnInit {

    cardapioDialog: boolean = false;

    deleteCardapioDialog: boolean = false;

    deleteCardapiosDialog: boolean = false;

    cardapios: Cardapio[] = [];

    cardapio: Cardapio = {};

    selectedCardapios: Cardapio[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private cardapioService: CardapioService, private messageService: MessageService) { }

    ngOnInit() {
        this.cardapioService.getCardapios().subscribe(data => this.cardapios = data);

        this.cols = [
            { field: 'name', header: 'Nome' },
            { field: 'description', header: 'Descrição' },
            { field: 'price', header: 'Preço' },
            { field: 'category', header: 'Categoria' }
        ];
    }

    openNovo() {
        this.cardapio = {};
        this.submitted = false;
        this.cardapioDialog = true;
    }

    deleteSelectedCardapios() {
        this.deleteCardapiosDialog = true;
    }

    editCardapio(cardapio: Cardapio) {
        this.cardapio = { ...cardapio };
        this.cardapioDialog = true;
    }

    deleteCardapio(cardapio: Cardapio) {
        this.deleteCardapioDialog = true;
        this.cardapio = { ...cardapio };
    }
    
    confirmDeleteSelected() {
        this.deleteCardapiosDialog = false;
    
        // Excluir cada item do cardápio selecionado
        this.selectedCardapios.forEach(cardapio => {
            this.cardapioService.deleteCardapio(cardapio.key).then(() => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Item ${cardapio.name} Excluído`, life: 3000 });
            }).catch(error => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Erro ao excluir item ${cardapio.name}`, life: 3000 });
            });
        });
    
        // Atualizar a lista de itens do cardápio
        this.cardapios = this.cardapios.filter(val => !this.selectedCardapios.includes(val));
        this.selectedCardapios = [];
    }

    confirmDelete() {
        this.deleteCardapioDialog = false;
        this.cardapioService.deleteCardapio(this.cardapio.key).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Item Excluído', life: 3000 });
            this.cardapio = {};
            this.cardapios = this.cardapios.filter(val => val.key !== this.cardapio.key); // Atualiza a lista de itens do cardápio
        }).catch(error => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir item', life: 3000 });
        });
    }

    hideDialog() {
        this.cardapioDialog = false;
        this.submitted = false;
    }

    saveCardapio() {
        this.submitted = true;

        if (this.cardapio.name?.trim()) {
            if (this.cardapio.id) {
                this.cardapioService.updateCardapio(this.cardapio.key, this.cardapio);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Item Atualizado', life: 3000 });
            } else {
                this.cardapio.id = this.createId();
                this.cardapioService.createCardapio(this.cardapio);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Item Criado', life: 3000 });
            }

            this.cardapios = [...this.cardapios];
            this.cardapioDialog = false;
            this.cardapio = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.cardapios.length; i++) {
            if (this.cardapios[i].id === id) {
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