// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
// Forms Component
import { LoanComponent } from './loan.component';
import {AddLoanComponent} from './add-loan.component';

// Components Routing
import { LoanRoutingModule } from './loan-routing.module';
import { from } from 'rxjs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LoanDetailsComponent } from './loan-details.component';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    LoanRoutingModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    ChartsModule
  ],
  declarations: [
    LoanComponent,
    AddLoanComponent,
    LoanDetailsComponent
  ]
})
export class LoanModule { }
