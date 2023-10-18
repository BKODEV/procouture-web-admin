import { HttpHeaders } from "@angular/common/http";

export const GlobalComponent = {
    // Api Calling
    API_URL : 'https://api.procouture.shop/api',
    // API_URL : 'http://127.0.0.1:3000/',
    headerToken : {'Authorization': `Bearer ${localStorage.getItem('token')}`},

    // Auth Api
    AUTH_API: "https://api.procouture.shop/api/admin/login",
    // AUTH_API:"http://127.0.0.1:3000/auth/",

    
    // Products Api
    product:'apps/product',
    productDelete:'apps/product/',

    // Orders Api
    order:'apps/order',
    orderId:'apps/order/',

    // Customers Api
    customer:'apps/customer',

    httpOption :{
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept' : 'application/json' }),
    },
    httpOptionWithAuth :{
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept' : 'application/json', 'Authorization' : `Bearer ${localStorage.getItem('token')}` }),
    }
}