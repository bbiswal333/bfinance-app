import { Injectable , ViewChild} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertsComponent } from '../views/alerts/alerts.component';

import {Observable, ReplaySubject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  state = false;
  successMessage: string;
  modalName: ReplaySubject<string> = new ReplaySubject();


  constructor() { }

  showSNAModal(){
    this.modalName.next('snaModal');
    return this.modalName.asObservable();
  }

  showSEModal(){
    this.modalName.next('seModal');
    return this.modalName.asObservable();
  }

  showSuccessModal(msg:string){
    this.modalName.next('sModal');
    this.successMessage = msg;
    return this.modalName.asObservable();
  }

}
