import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Compte } from './liste.model';
import { ListeService } from './liste.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { FormuleAbonnementService } from './formule-abonnement.service';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.scss'],
})
export class ListeComponent implements OnInit {

  @ViewChild(ModalDirective, { static: false }) showSubscriptionModal?: ModalDirective;
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


  AllComptes: any[] = [];
  comptes : any[] = []
  state = {
    totalItem : this.AllComptes.length,
    itemPerPage : 10
  }
  formules : any[] = []
  selectedFormule : any
  selectedFormuleOptionIndex: number | null = null;
  paginationCurrentPage = 1;

  
  CompteFormGroupSubmited : boolean = false
  
  CompteFormGroup = this.fb.group({
    formule : ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
    compte : ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
  })
   

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
  //Modal handler 
  handler(type : string, event : ModalDirective){
    //renitialiser les formules choisies
    this.selectedFormule = null
    this.CompteFormGroup.patchValue({formule : '', compte : ''})
  }

  //Changement de page pour la pagination
  tablepageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
      this.comptes = this.AllComptes.slice(startItem, endItem);
      this.state.totalItem = this.AllComptes.length; // Mettez à jour totalItem
  }

  openSubscriptionModal(id : any){
    this.formuleService.getSubscriptionFormule().subscribe(
      (response)=>{
        this.formules = response.body.data.offre_abonnement
      })
      this.CompteFormGroup.get('compte')?.setValue(id)
      this.showSubscriptionModal?.show()
  }
  
  //changement de valeur du select des offres
  initialiseFormuleData() {
    this.selectedFormule = this.formules.find((item) => item.id === parseInt(this.selectElement?.nativeElement.value, 10))
    this.selectedFormuleOptionIndex = null
    this.CompteFormGroup.get('formule')?.setValue('')
  }

  initialiseFormAbonnementData(index : number, formule : any){
    this.CompteFormGroupSubmited = false
    console.log(this.CompteFormGroupSubmited);
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

}
