import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../services/auth/auth.guard';

import { LoanComponent } from './loan.component';
import { AddLoanComponent } from './add-loan.component';
import { LoanDetailsComponent } from './loan-details.component';


const routes: Routes = [
  {
    path: '',
    children: [

      {
        path: '',
        component: LoanComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Loan'
        },
        children: [
          
        ]
      },
      {
        path: 'add',
        component: AddLoanComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Add Loan Details'
        }
      },
      {
        path: ':loanId/details',
        component: LoanDetailsComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Loan Details'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanRoutingModule { }
