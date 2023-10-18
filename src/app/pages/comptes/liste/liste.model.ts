export interface ListJsModel {
  id: any;
  customer_name: string;
  email: string;
  phone: string;
  date: string;
  status: string;
  status_color: string;
  isSelected?: any;
}

export interface paginationModel {
  ids: any;
  name: string;
  type: string;
  img: string;
}

export interface Compte {
  id: number;
  ref: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string | null;
  created_at: string;
  email_verified_at: string;
}

