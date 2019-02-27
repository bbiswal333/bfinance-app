// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';

// Forms Component
import { AccountComponent } from './account.component';




// Components Routing
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
  ],
  declarations: [
    AccountComponent
  ]
})
export class UserModule { }
