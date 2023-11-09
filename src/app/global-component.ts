import { HttpHeaders } from "@angular/common/http";


export const GlobalComponent = {
    // Api Calling
    //API_URL : 'https://api.procouture.shop/api',
    API_URL : 'http://127.0.0.1:8000/api',
    headerToken: () => ({ 'Authorization': `Bearer ${localStorage.getItem('token')}` }), // Utilisez une fonction pour dynamiquement obtenir le token

    // Auth Api
    //AUTH_API: "https://api.procouture.shop/api/admin/login",
    AUTH_API:"http://127.0.0.1:8000/api/admin/login",



    httpOption : new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
    })
}