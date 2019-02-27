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
  public myModal;
  public largeModal;
  public smallModal;
  public primaryModal;
  public successModal;
  public warningModal;
  public dangerModal;
  public infoModal;

  modalName: string;
  counter = 0

  constructor(public alertsService: AlertsService, private authService: AuthService){}

  @ViewChild('serviceNotAvailableModal') snaModal: ModalDirective;
  @ViewChild('sessionExpiredModal') seModal: ModalDirective;
  @ViewChild('successModal') sModal: ModalDirective;

  ngAfterViewInit(){ 
    this.alertsService.showSNAModal().subscribe(data => {
      if(this.alertsService.state){
          this.alertsService.state = false;
          this.modalName = data;
          if(this.modalName === 'snaModal'){
            this.snaModal.show();
          }
          if(this.modalName === 'seModal'){
            this.seModal.show();
          }
          if(this.modalName === 'sModal'){
            this.sModal.show();
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
