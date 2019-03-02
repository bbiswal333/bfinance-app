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
  errorMessage: string;
  warningMessage: string;
  modalName: ReplaySubject<string> = new ReplaySubject();


  constructor() { }

  showModal(){
    return this.modalName.asObservable();
  }

  showSessionExpiredModal(){
    this.modalName.next('seModal');
    return this.modalName.asObservable();
  }

  showSuccessModal(msg:string){
    this.modalName.next('sModal');
    this.successMessage = msg;
    return this.modalName.asObservable();
  }

  showErrorModal(msg:string){
    this.modalName.next('eModal');
    this.errorMessage = msg;
    return this.modalName.asObservable();
  }

  showWarningModal(msg:string){
    this.modalName.next('wModal');
    this.warningMessage = msg;
    return this.modalName.asObservable();
  }

}
