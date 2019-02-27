import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AuthGuard} from '../../services/auth/auth.guard';

import { AccountComponent } from './account.component';


const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'User'
    },
    children: [
     
      {
        path: 'account',
        component: AccountComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Account Settings'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
