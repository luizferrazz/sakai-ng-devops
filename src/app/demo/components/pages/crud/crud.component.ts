import { Component, OnInit } from '@angular/core';
import { Pizzaria } from '../../../../demo/api/pizzaria.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PizzariaService } from '../../../../demo/service/pizzaria.service';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {

    pizzariaDialog: boolean = false;

    deletePizzariaDialog: boolean = false;

    deletePizzariasDialog: boolean = false;

    pizzarias: Pizzaria[] = [];

    pizzaria: Pizzaria = {};

    selectedPizzarias: Pizzaria[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private pizzariaService: PizzariaService, private messageService: MessageService) { }

    ngOnInit() {
        this.pizzariaService.getPizzarias().subscribe(data => this.pizzarias = data);

        this.cols = [
            { field: 'product', header: 'Pizzaria' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
    }

    openNew() {
        this.pizzaria = {};
        this.submitted = false;
        this.pizzariaDialog = true;
    }

    deleteSelectedPizzarias() {
        this.deletePizzariasDialog = true;
    }

    editPizzaria(pizzaria: Pizzaria) {
        this.pizzaria = { ...pizzaria };
        this.pizzariaDialog = true;
    }

    deletePizzaria(pizzaria: Pizzaria) {
        this.deletePizzariaDialog = true;
        this.pizzaria = { ...pizzaria };
    }

    confirmDeleteSelected() {
        this.deletePizzariasDialog = false;
        /* this.pizzarias = this.pizzarias.filter(val => !this.selectedPizzarias.includes(val)); */
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedPizzarias = [];
    }

    confirmDelete() {
        this.deletePizzariaDialog = false;
        /* this.pizzarias = this.pizzarias.filter(val => val.id !== this.pizzaria.id); */
        this.pizzariaService.deletePizzaria(this.pizzaria.key);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pizzaria Deleted', life: 3000 });
        this.pizzaria = {};
    }

    hideDialog() {
        this.pizzariaDialog = false;
        this.submitted = false;
    }

    savePizzaria() {
        this.submitted = true;

        if (this.pizzaria.name?.trim()) {
            if (this.pizzaria.id) {
                // @ts-ignore
                this.pizzaria.inventoryStatus = this.pizzaria.inventoryStatus.value ? this.pizzaria.inventoryStatus.value : this.pizzaria.inventoryStatus;
                /* this.pizzarias[this.findIndexById(this.pizzaria.id)] = this.pizzaria; */
                this.pizzariaService.updatePizzaria(this.pizzaria.key, this.pizzaria);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pizzaria Updated', life: 3000 });
            } else {
                this.pizzaria.id = this.createId();
                this.pizzariaService.createPizzaria(this.pizzaria);
                // @ts-ignore
                this.pizzaria.inventoryStatus = this.pizzaria.inventoryStatus ? this.pizzaria.inventoryStatus.value : 'INSTOCK';
                /* this.pizzarias.push(this.pizzaria); */
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Pizzaria Created', life: 3000 });
            }

            this.pizzarias = [...this.pizzarias];
            this.pizzariaDialog = false;
            this.pizzaria = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.pizzarias.length; i++) {
            if (this.pizzarias[i].id === id) {
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
