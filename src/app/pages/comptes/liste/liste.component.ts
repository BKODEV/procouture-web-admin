import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Compte } from './liste.model';
import { ListeService } from './liste.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { FormuleAbonnementService } from './formule-abonnement.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.scss'],
})
export class ListeComponent implements OnInit {

  @ViewChild('showSubscriptionModal', { static: false }) showSubscriptionModal?: ModalDirective;
  @ViewChild('deleteCompteModal', { static: false }) deleteCompteModal?: ModalDirective;
  @ViewChild('offre', { static: false }) selectElement ?: ElementRef;

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  
  
  

  constructor(private compteListService : ListeService, private elementRef : ElementRef, private fb : FormBuilder, private formuleService : FormuleAbonnementService){
    this.breadCrumbItems = [
      {label : "Dashboard"},
      {label : "Comptes", active : true}
    ]
    
  }

  //Afficher les bouton last et first && les direction de la pagination
  showBoundaryLinks: boolean = true;
  showDirectionLinks: boolean = true;

  //Message d'alerte de la page
  alertMessage = "";

  AllComptes: any[] = [];
  comptes : any[] = []
  
  //pagination state
  state = {
    totalItem : this.AllComptes.length,
    itemPerPage : 10
  }

  formules : any[] = []
  selectedFormule : any
  selectedFormuleOptionIndex: number | null = null;
  paginationCurrentPage = 1;
  selectedCompteForDeleting : number | null = null;
  
  
  CompteFormGroupSubmited : boolean = false
  
  CompteFormGroup = this.fb.group({
    formule : ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    compte : ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
  })
   
  //variable de filtre formulaire
  selectedStatus = "";
  searchQuery = "";

  ngOnInit(): void {
      // Souscrivez-vous à l'observable dans le service pour obtenir les données
    this.compteListService.compteList$.subscribe((comptes_list) => {
      this.AllComptes = comptes_list;
      this.comptes = this.AllComptes.slice(0,(this.state.itemPerPage))
      this.state.totalItem = this.AllComptes.length; // Mettez à jour totalItem
    });

    // Chargez les données dès que le composant est initialisé
    this.compteListService.fetchComptesList();
  }
  

  //Changement de page pour la pagination
  tablepageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    if(this.selectedStatus === ""){
      this.paginationCurrentPage = 1
      this.comptes = this.AllComptes.slice(startItem,endItem)
      this.state.totalItem = this.AllComptes.length; // Mettez à jour totalItem
    }else {
      
      this.paginationCurrentPage = 1
      var smallCompte = this.AllComptes.filter( (abonnement_item) => {
        return abonnement_item.abonnement_status === JSON.parse(this.selectedStatus);
      })
      this.comptes = smallCompte.slice(startItem,endItem)
      this.state.totalItem = smallCompte.length
    }
      // this.comptes = this.AllComptes.slice(startItem, endItem);
      // this.state.totalItem = this.AllComptes.length; // Mettez à jour totalItem
  }
  //Modal handler 
  hideSubscriptionModalAction(type : string, event : ModalDirective){
    //renitialiser les formules choisies
    this.selectedFormule = null
    this.CompteFormGroup.patchValue({formule : '', compte : ''})
  }
  hideDeleteCompteModalAction(type : string, event : ModalDirective){
    //renitialiser les formules choisies
    this.selectedCompteForDeleting = null
  }

  openSubscriptionModal(id : any){
    this.formuleService.getSubscriptionFormule().subscribe(
      (response)=>{
        this.formules = response.body.data.offre_abonnement
      })
      this.CompteFormGroup.get('compte')?.setValue(id)
      this.showSubscriptionModal?.show()
  }

  //Ouverture de modale de confirmation de suppression
  openDeleteCompteModal(id : number){
      this.selectedCompteForDeleting = id;
      this.deleteCompteModal?.show()
  }

  //FOnction de suppression de compte
  deleteSelectedCompte(){
    if(this.selectedCompteForDeleting === null){
      //MAJ du message d'alerte en cas d'erreur
      this.alertMessage = "Une erreur innatendue est survenue, veuillez ressayer !!!"
      //affichage du message d'alert
      this.msgAlert('warning', this.alertMessage)
    }else{
      this.compteListService.deleteCompte(this.selectedCompteForDeleting)
      .subscribe(
        (response) => {
          if(response.ok){
            
            //recupérer les information du compte precedent
            var deletedCompte = this.AllComptes.find( (compte) => compte.id === this.selectedCompteForDeleting)
            //Supprimer la ligne dudit compte
            this.supprimerLigneParId("compte_" + deletedCompte.id)
            //rénitialisé la varieble de compte selectionné
            this.selectedCompteForDeleting = null;
            //Mettre à jour le message d'alerte
            this.alertMessage = "le compte <small class='text-danger'>" + deletedCompte.email + "</small> à été supprimé !!!"
            //afficher une alerte
            this.msgAlert('success', this.alertMessage)
            this.deleteCompteModal?.hide()
            
          }else{
            //MAJ du message d'alerte en cas d'erreur
            this.alertMessage = "Une erreur innatendue est survenue !!!"
            //affichage du message d'alert
            this.msgAlert('error', this.alertMessage)
            this.deleteCompteModal?.hide()
          }
        }
      )
      
    }

  }
  
  //changement de valeur du select des offres
  initialiseFormuleData() {
    this.selectedFormule = this.formules.find((item) => item.id === parseInt(this.selectElement?.nativeElement.value, 10))
    this.selectedFormuleOptionIndex = null
    this.CompteFormGroup.get('formule')?.setValue('')
  }

  initialiseFormAbonnementData(index : number, formule : any){
    this.CompteFormGroupSubmited = false
    this.selectedFormuleOptionIndex = index
    this.CompteFormGroup.get('formule')?.setValue(formule)
  }

  submitSubscriptionForm(){
    
    this.CompteFormGroupSubmited = !this.CompteFormGroupSubmited
    if (this.CompteFormGroup.valid) {
      this.formuleService.addSubscription(this.CompteFormGroup.value).subscribe(
        (response) => {
          if (response.ok) {
            this.compteListService.fetchComptesList();
            this.showSubscriptionModal?.hide()
            this.paginationCurrentPage = 1
            alert('Opération éffectuée !')
          }
        }
      )
    }
  }

  searchStatus (){
    this.searchQuery = "";
    if(this.selectedStatus === ""){
      this.paginationCurrentPage = 1
      this.comptes = this.AllComptes.slice(0,(this.state.itemPerPage))
      this.state.totalItem = this.AllComptes.length; // Mettez à jour totalItem
    }else {
      this.paginationCurrentPage = 1
      var smallCompte = this.AllComptes.filter( (abonnement_item) => {
        return abonnement_item.abonnement_status === JSON.parse(this.selectedStatus);
      })
      this.comptes = smallCompte.slice(0,(this.state.itemPerPage))
      this.state.totalItem = smallCompte.length
    }
    
  }

  searchObjects(array : any[], searchQuery : string) {
    // Convert la recherche en minuscules (pour la recherche insensible à la casse)
    const query = searchQuery.toLowerCase();
    
    // Filtrer les objets qui contiennent la recherche dans l'un de leurs champs
    return array.filter(obj => {
        for (const key in obj) {
            if (typeof obj[key] === 'string' && obj[key].toLowerCase().includes(query)) {
                return true;
            }
            if (typeof obj[key] === 'object') {
                const nestedResult = this.searchObjects([obj[key]], searchQuery);
                if (nestedResult.length > 0) {
                    return true;
                }
            }
        }
        return false;
    });
  }
  //Filtre a la saisie
  digitFilter(){
    var elements = this.searchObjects(this.AllComptes, this.searchQuery);
    if(this.selectedStatus === ""){
      this.paginationCurrentPage = 1
      this.comptes = elements.slice(0,(this.state.itemPerPage))
      this.state.totalItem = elements.length; // Mettez à jour totalItem
    }else {
      this.paginationCurrentPage = 1
      var smallCompte = elements.filter( (abonnement_item) => {
        return abonnement_item.abonnement_status === JSON.parse(this.selectedStatus);
      })
      this.comptes = smallCompte.slice(0,(this.state.itemPerPage))
      this.state.totalItem = smallCompte.length
    }

  }

  // Supprimer une ligne de tableau par son id
 supprimerLigneParId(id : any) {
  var row = document.getElementById(id);
  if (row) {
    row.parentNode?.removeChild(row);
  }
}


///alert
msgAlert(type: any,  title : any) {
  Swal.fire({
    position: 'center',
    icon: type,
    title: title,
    showConfirmButton: false,
    showCancelButton: true,
    timer: 2500,
  });
}


}
