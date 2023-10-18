import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListeComponent } from './liste/liste.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule,BsModalService } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';
// component

// Ng Search 
import { NgPipesModule } from 'ngx-pipes';

// Sorting page
import { NgbdListSortableHeader } from './liste/liste-sortable.directive';
import { ComptesRoutingModule } from './comptes-routing-module';


@NgModule({
  declarations: [
    ListeComponent,
    NgbdListSortableHeader
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    PaginationModule.forRoot(),
    NgPipesModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    ModalModule,
  
    ComptesRoutingModule
  ],
  providers : [BsModalService],
  
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ComptesModule { }
