import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';
import { Compte } from './liste.model';
import { ResponseHttp } from 'src/app/interfaces/response';


const COMPTE_URL = GlobalComponent.API_URL + "/admin/comptes"

@Injectable({
  providedIn: 'root'
})

export class ListeService {
  private compteListSubject = new BehaviorSubject<any[]>([]);
  compteList$: Observable<any[]> = this.compteListSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchComptesList(): void {
    this.http.get<any>(COMPTE_URL, { ...GlobalComponent.httpOptionWithAuth, observe: 'response' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      )
      .subscribe((response ) => {
        // Mise à jour des données dans le service
        this.compteListSubject.next(response.body!.data.comptes);
      });
  }
}
