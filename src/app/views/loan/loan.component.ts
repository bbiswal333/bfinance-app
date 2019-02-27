import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpParams } from "@angular/common/http";

import { AuthService } from '../../services/auth/auth.service';
import { LoaderService } from '../../loader.service';
import { LoanService } from '../../services/loan/loan.service';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
    templateUrl: 'loan.component.html'
  })

  export class LoanComponent implements OnInit {

    public loanDeletewarningModal;

    @ViewChild('loanDeletewarningModal') modal: ModalDirective;

    loanDetails : any;

    loanIdToDelete: string;

    

    constructor(private route: Router,private formBuilder: FormBuilder, private authService: AuthService, private loaderService: LoaderService, private loanService: LoanService) { }
    
    ngOnInit() {
     this.getLoanDetails();
    }

    getLoanDetails(){
      this.loanService.getLoanDetails().subscribe(data => {
        this.loanDetails = data;
        console.log(this.loanDetails);
      },error => {
        console.log(error);
      })
    }

    addLoanBtnClick(){
      this.route.navigate(['/loan/add'])
    }

    onDeleteLoan(loanId: string){
      this.loanIdToDelete = loanId;
      this.modal.show();
    }
    deleteLoan(){
      let loanId = this.loanIdToDelete;
      this.loanService.deleteLoanById(loanId).subscribe(data => {
        this.modal.hide();
        this.getLoanDetails();
      },error=>{
        console.log(error);
      })
    }
    getClosedLoanStyle(val){
      let style = {}
      if(val == 0){
        return style = {"background-color":"#def9db"}
      }
    }
    showLoanDetails(loanId){
      this.route.navigate(['/loan/'+loanId+'/details'])
    }
  }