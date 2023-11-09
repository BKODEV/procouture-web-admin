import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";




@Injectable({ providedIn: 'root' })

export class GlobalService {

    getApiUrl () {
        //return 'http://127.0.0.1:8000/api'
        return 'https://api.procouture.shop/api'
    }

    getToken(): string | null {
        // Récupère le token depuis le localStorage
        return localStorage.getItem('token');
    }

    getHeaders(): HttpHeaders {
        // Configure les en-têtes HTTP avec le Content-Type et le token
        return  new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`,
        });
    }
}

