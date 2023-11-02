import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';
import Swal from 'sweetalert2';


const FORMULE_URL = GlobalComponent.API_URL + "/abonnement/offres"
const ABONNEMENT_URL = GlobalComponent.API_URL + "/abonnements"


@Injectable({
  providedIn: 'root'
})
export class FormuleAbonnementService {

  constructor(private http : HttpClient) { }

  getSubscriptionFormule(){
    return this.http.get<any>(FORMULE_URL,{...GlobalComponent.httpOptionWithAuth, observe : 'response'}).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    )
  }


  addSubscription(data : any){
    return this.http.post<any>(ABONNEMENT_URL,{compte : data.compte, formule : data.formule }, {...GlobalComponent.httpOptionWithAuth, observe : 'response'}).pipe(
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