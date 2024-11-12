import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cardapio } from '../api/cardapio.model';
import { IngredienteService } from './ingrediente.service';

@Injectable({
    providedIn: 'root'
})
export class CardapioService {
    private basePath = "cardapio";

    constructor(private db: AngularFireDatabase, private ingredienteService: IngredienteService) { }

    createCardapio(cardapio: Cardapio): any {
        this.db.list<Cardapio>(this.basePath).push(cardapio);
    }

    getCardapios(): Observable<Cardapio[]> {
        return this.db.list<Cardapio>(this.basePath).snapshotChanges().pipe(
            map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
        );
    }

    getCardapioId(key: string): Observable<Cardapio | null> {
        return this.db.object<Cardapio>(`${this.basePath}/${key}`).valueChanges();
    }

    updateCardapio(key: string, value: any): Promise<void> {
        return this.db.object<Cardapio>(`${this.basePath}/${key}`).update(value);
    }

    deleteCardapio(key: string): Promise<void> {
        return this.db.object<Cardapio>(`${this.basePath}/${key}`).remove();
    }

    checkIngredientAvailability(): void {
        this.getCardapios().subscribe(cardapios => {
            cardapios.forEach(cardapio => {
                let available = true;
                (Array.isArray(cardapio.ingrediente) ? cardapio.ingrediente : []).forEach(ingrediente => {
                    this.ingredienteService.getIngredienteId(ingrediente.id).subscribe(ingrediente => {
                        if (ingrediente.quantity < Number(ingrediente.quantity)) {
                            available = false;
                        }
                    });
                });
                this.updateCardapio(cardapio.key, { available });
            });
        });
    }
}