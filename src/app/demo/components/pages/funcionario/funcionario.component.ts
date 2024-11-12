import { Component, OnInit } from '@angular/core';
import { Funcionario } from '../../../../demo/api/funcionario.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FuncionarioService } from '../../../../demo/service/funcionario.service';

@Component({
    templateUrl: './funcionario.component.html',
    providers: [MessageService]
})
export class FuncionarioComponent implements OnInit {

    funcionarioDialog: boolean = false;

    deleteFuncionarioDialog: boolean = false;

    deleteFuncionariosDialog: boolean = false;

    funcionarios: Funcionario[] = [];

    funcionario: Funcionario = {};

    selectedFuncionarios: Funcionario[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private funcionarioService: FuncionarioService, private messageService: MessageService) { }

    ngOnInit() {
        this.funcionarioService.getFuncionarios().subscribe(data => this.funcionarios = data);

        this.cols = [
            { field: 'name', header: 'Nome' },
            { field: 'email', header: 'Email' },
            { field: 'telefone', header: 'Telefone' },
            { field: 'endereco', header: 'Endereço' }
        ];
    }

    openNovo() {
        this.funcionario = { endereco: {} }; // Inicializa o objeto endereco
        this.submitted = false;
        this.funcionarioDialog = true;
    }

    deleteSelectedFuncionarios() {
        this.deleteFuncionariosDialog = true;
    }

    editFuncionario(funcionario: Funcionario) {
        this.funcionario = { ...funcionario, endereco: funcionario.endereco || {} }; // Garante que endereco esteja inicializado
        this.funcionarioDialog = true;
    }

    deleteFuncionario(funcionario: Funcionario) {
        this.deleteFuncionarioDialog = true;
        this.funcionario = { ...funcionario };
    }

    confirmDeleteSelected() {
        this.deleteFuncionariosDialog = false;

        // Excluir cada funcionário selecionado
        this.selectedFuncionarios.forEach(funcionario => {
            this.funcionarioService.deleteFuncionario(funcionario.key).then(() => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: `Funcionário ${funcionario.name} Excluído`, life: 3000 });
            }).catch(error => {
                this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Erro ao excluir funcionário ${funcionario.name}`, life: 3000 });
            });
        });

        // Atualizar a lista de funcionários
        this.funcionarios = this.funcionarios.filter(val => !this.selectedFuncionarios.includes(val));
        this.selectedFuncionarios = [];
    }

    confirmDelete() {
        this.deleteFuncionarioDialog = false;
        this.funcionarioService.deleteFuncionario(this.funcionario.key).then(() => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário Excluído', life: 3000 });
            this.funcionario = {};
            this.funcionarios = this.funcionarios.filter(val => val.key !== this.funcionario.key); // Atualiza a lista de funcionários
        }).catch(error => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir funcionário', life: 3000 });
        });
    }

    hideDialog() {
        this.funcionarioDialog = false;
        this.submitted = false;
    }

    saveFuncionario() {
        this.submitted = true;

        if (this.funcionario.name?.trim()) {
            if (this.funcionario.id) {
                this.funcionarioService.updateFuncionario(this.funcionario.key, this.funcionario);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário Atualizado', life: 3000 });
            } else {
                this.funcionario.id = this.createId();
                this.funcionarioService.createFuncionario(this.funcionario);
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário Criado', life: 3000 });
            }

            this.funcionarios = [...this.funcionarios];
            this.funcionarioDialog = false;
            this.funcionario = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.funcionarios.length; i++) {
            if (this.funcionarios[i].id === id) {
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