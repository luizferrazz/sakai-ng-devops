import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Fornecedor } from '../api/fornecedor.model';

@Injectable({
    providedIn: 'root'
})
export class FornecedorService {
    private basePath = "fornecedores";

    constructor(private db: AngularFireDatabase) { }

    createFornecedor(fornecedor: Fornecedor): any {
        this.db.list<Fornecedor>(this.basePath).push(fornecedor);
    }

    getFornecedores(): Observable<Fornecedor[]> {
        return this.db.list<Fornecedor>(this.basePath).snapshotChanges().pipe(
            map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
        );
    }

    getFornecedorId(key: string): Observable<Fornecedor | null> {
        return this.db.object<Fornecedor>(`${this.basePath}/${key}`).valueChanges();
    }

    updateFornecedor(key: string, value: any): Promise<void> {
        return this.db.object<Fornecedor>(`${this.basePath}/${key}`).update(value);
    }

    deleteFornecedor(key: string): Promise<void> {
        return this.db.object<Fornecedor>(`${this.basePath}/${key}`).remove();
    }
}