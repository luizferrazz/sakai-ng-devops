import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ingrediente } from '../api/ingrediente.model';

@Injectable({
    providedIn: 'root'
})
export class IngredienteService {
    private basePath = "ingredientes";

    constructor(private db: AngularFireDatabase) { }

    createIngrediente(ingrediente: Ingrediente): any {
        this.db.list<Ingrediente>(this.basePath).push(ingrediente);
    }

    getIngredientes(): Observable<Ingrediente[]> {
        return this.db.list<Ingrediente>(this.basePath).snapshotChanges().pipe(
            map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
        );
    }

    getIngredienteId(key: string): Observable<Ingrediente | null> {
        return this.db.object<Ingrediente>(`${this.basePath}/${key}`).valueChanges();
    }

    updateIngrediente(key: string, value: any): Promise<void> {
        return this.db.object<Ingrediente>(`${this.basePath}/${key}`).update(value);
    }

    deleteIngrediente(key: string): Promise<void> {
        return this.db.object<Ingrediente>(`${this.basePath}/${key}`).remove();
    }
}