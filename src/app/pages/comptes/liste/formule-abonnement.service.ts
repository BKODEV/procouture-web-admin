import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { GlobalService } from 'src/app/core/services/global-service';
import Swal from 'sweetalert2';





@Injectable({
  providedIn: 'root'
})
export class FormuleAbonnementService {

  constructor(private http : HttpClient, private global : GlobalService) { }


  FORMULE_URL = this.global.getApiUrl() + "/abonnement/offres"
  ABONNEMENT_URL = this.global.getApiUrl() + "/abonnements"


  getSubscriptionFormule(){
    const httpOptions = { headers: this.global.getHeaders() };
    return this.http.get<any>(this.FORMULE_URL, { ...httpOptions, observe: 'response' }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    )
  }


  addSubscription(data : any){
    const httpOptions = { headers: this.global.getHeaders() };
    return this.http.post<any>(this.ABONNEMENT_URL,{compte : data.compte, formule : data.formule },  { ...httpOptions, observe: 'response' }).pipe(
      catchError((error : HttpErrorResponse) => {
        this.msgAlert()
          return throwError(error)
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