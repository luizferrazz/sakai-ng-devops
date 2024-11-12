import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CardapioComponent } from './cardapio.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CardapioComponent }
	])],
	exports: [RouterModule]
})
export class CardapioRoutingModule { }
