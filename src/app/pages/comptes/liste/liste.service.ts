import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { Compte } from './liste.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { GlobalService } from 'src/app/core/services/global-service';


@Injectable({
  providedIn: 'root'
})

export class ListeService {
  private compteListSubject = new BehaviorSubject<any[]>([]);
  compteList$: Observable<any[]> = this.compteListSubject.asObservable();
  constructor(private http: HttpClient, private router : Router, private global : GlobalService) {}

  COMPTE_URL = this.global.getApiUrl() + "/admin/comptes"

  fetchComptesList(): void {
    const httpOptions = { headers: this.global.getHeaders() };
    this.http.get<any>(this.COMPTE_URL, {...httpOptions, observe : 'response'})
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error(error);
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
    const httpOptions = { headers: this.global.getHeaders() };
    return this.http.post<any>(this.COMPTE_URL + '/' +  id,{'_method' : 'DELETE'}, {...httpOptions,  observe : 'response'})
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
