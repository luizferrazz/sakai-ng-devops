import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'PÁGINA INICIAL',
                items: [
                    { label: 'Monitoramento', icon: 'pi pi-fw pi-chart-line', routerLink: ['/'] }
                ]
            },
            {
                label: 'CADASTROS',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Clientes',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/pages/cliente']
                    },
                    {
                        label: 'Cardápio',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/pages/cardapio']
                    },
                    {
                        label: 'Pedidos',
                        icon: 'pi pi-fw pi-shopping-cart',
                        routerLink: ['/pages/pedido']
                    },
                    {
                        label: 'Funcionários',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/pages/funcionario']
                    },
                    {
                        label: 'Fornecedores',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/pages/fornecedor']
                    },
                    {
                        label: 'Ingredientes - Estoque',	
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/pages/ingrediente']
                    }
                ]},
        ] 
    }
}
