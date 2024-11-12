import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IngredienteComponent } from './ingrediente.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: IngredienteComponent }
	])],
	exports: [RouterModule]
})
export class IngredienteRoutingModule { }
