import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';
import { Compte } from './liste.model';
import { ResponseHttp } from 'src/app/interfaces/response';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


const COMPTE_URL = GlobalComponent.API_URL + "/admin/comptes"

@Injectable({
  providedIn: 'root'
})

export class ListeService {
  private compteListSubject = new BehaviorSubject<any[]>([]);
  compteList$: Observable<any[]> = this.compteListSubject.asObservable();

  constructor(private http: HttpClient, private router : Router) {}

  fetchComptesList(): void {
    this.http.get<any>(COMPTE_URL, { ...GlobalComponent.httpOptionWithAuth, observe: 'response' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if(error.status === 401){
            localStorage.clear()
            this.router.navigate(['/auth/login'])
          }
          this.msgAlert()
          return throwError(error);
        })
      )
      .subscribe((response ) => {
        // Mise à jour des données dans le service
        this.compteListSubject.next(response.body!.data.comptes);
      });
  }


  deleteCompte(id : number){
    return this.http.post<any>(COMPTE_URL + '/' +  id,{'_method' : 'DELETE'},{...GlobalComponent.httpOptionWithAuth, observe : 'response'})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401){
          this.router.navigate(['/auth/login'])
        }
        this.msgAlert()
        return throwError(error);
      })
    )
  }

  msgAlert() {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: "Une erreur est survenue",
      showConfirmButton: false,
      showCancelButton: true,
      timer: 2500,
    });
  }
}
