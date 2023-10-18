import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';


const COMPTE_API = GlobalComponent.API_URL + "/admin/comptes"
const httpOptionWithAuth = GlobalComponent.httpOptionWithAuth;

@Injectable({
  providedIn: 'root'
})
export class ComptesServiceService {

  constructor(private http : HttpClient) { }

  

  getAll(){
    return this.http.get(COMPTE_API, {...httpOptionWithAuth, observe : 'response'})
  }

}
