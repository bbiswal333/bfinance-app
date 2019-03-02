import { Component, OnInit, ViewChild} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AlertsService } from '../../services/alerts.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  modalName: string;
  counter = 0

  constructor(public alertsService: AlertsService, private authService: AuthService){}

  @ViewChild('sessionExpiredModal') seModal: ModalDirective;
  @ViewChild('successModal') sModal: ModalDirective;
  @ViewChild('errorModal') eModal: ModalDirective;
  @ViewChild('warningModal') wModal: ModalDirective;



  ngAfterViewInit(){ 
    this.alertsService.showModal().subscribe(data => {
      if(this.alertsService.state){
          this.alertsService.state = false;
          this.modalName = data;
          if(this.modalName === 'seModal'){
            this.seModal.show();
          }
          if(this.modalName === 'sModal'){
            this.sModal.show();
          }
          if(this.modalName === 'eModal'){
            this.eModal.show();
          }
          if(this.modalName === 'wModal'){
            this.wModal.show();
          }
      }
    })
    
  } 
  ngOnInit(){ }

  restart(){
    this.seModal.hide();
    this.authService.logout();
    location.reload();
  }

}
