import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pizzaria } from '../api/pizzaria.model';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class PizzariaService {
    private basePath = "products";

    constructor(private db: AngularFireDatabase) { }

    createPizzaria(pizzaria: Pizzaria): any {
        this.db.list<Pizzaria>(this.basePath).push(pizzaria);
    }
    getPizzarias(){
      return this.db.list<Pizzaria>(this.basePath).snapshotChanges().pipe(
        map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    }
    getPizzariaId(key: string){
      return this.db.object<Pizzaria>(`${this.basePath}/${key}`).valueChanges();
    }
    updatePizzaria(key: string, value: any): Promise<void> {
      return this.db.object<Pizzaria>(`${this.basePath}/${key}`).update(value);
    }
    deletePizzaria(key: string): Promise<void> {
      return this.db.object<Pizzaria>(`${this.basePath}/${key}`).remove();
    }

}
