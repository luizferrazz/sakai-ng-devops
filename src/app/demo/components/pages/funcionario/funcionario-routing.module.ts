import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuncionarioComponent } from './funcionario.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: FuncionarioComponent }
	])],
	exports: [RouterModule]
})
export class FuncionarioRoutingModule { }
