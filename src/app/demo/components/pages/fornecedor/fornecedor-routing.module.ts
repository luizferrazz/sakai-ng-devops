import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FornecedorComponent } from './fornecedor.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: FornecedorComponent}
	])],
	exports: [RouterModule]
})
export class FornecedorRoutingModule { }
