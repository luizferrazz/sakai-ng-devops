import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Funcionario } from '../api/funcionario.model';

@Injectable({
    providedIn: 'root'
})
export class FuncionarioService {
    private basePath = "funcionarios";

    constructor(private db: AngularFireDatabase) { }

    createFuncionario(funcionario: Funcionario): any {
        this.db.list<Funcionario>(this.basePath).push(funcionario);
    }

    getFuncionarios(): Observable<Funcionario[]> {
        return this.db.list<Funcionario>(this.basePath).snapshotChanges().pipe(
            map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
        );
    }

    getFuncionarioId(key: string): Observable<Funcionario | null> {
        return this.db.object<Funcionario>(`${this.basePath}/${key}`).valueChanges();
    }

    updateFuncionario(key: string, value: any): Promise<void> {
        return this.db.object<Funcionario>(`${this.basePath}/${key}`).update(value);
    }

    deleteFuncionario(key: string): Promise<void> {
        return this.db.object<Funcionario>(`${this.basePath}/${key}`).remove();
    }
}