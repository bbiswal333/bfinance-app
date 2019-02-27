import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpParams } from "@angular/common/http";

import { AuthService } from '../../services/auth/auth.service';
import { LoaderService } from '../../loader.service';
import { LoanService } from '../../services/loan/loan.service';
import { AlertsService } from '../../services/alerts.service';


@Component({
  templateUrl: 'add-loan.component.html'
})

export class AddLoanComponent implements OnInit {

  addLoanForm: FormGroup;
  hasBalanceAmountError: boolean;

  constructor(private route:Router, public alertService: AlertsService,private formBuilder: FormBuilder, private authService: AuthService, private loaderService: LoaderService, private loanService: LoanService) { }

  ngOnInit() {
    this.addLoanForm = this.formBuilder.group({
      bankName: ['', Validators.required],
      loanDesc: ['', Validators.required],
      principalAmount: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      balanceAmount: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      interestRate: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      loanYear: ['2019'],
      eduLoan: [false],
      homeLoan: [false]
    });
  }

  changeBalanceAmountValue() {
    this.addLoanForm.controls.balanceAmount.setValue(this.addLoanForm.controls.principalAmount.value);
  }

  matchValidator() {
    if (this.addLoanForm.controls.balanceAmount.value <= this.addLoanForm.controls.principalAmount.value) {
      this.hasBalanceAmountError = false;
    } else {
      this.hasBalanceAmountError = true;
    }
  }

  changeLoanType(value: string) {
    if (value === 'EL' && this.addLoanForm.controls.eduLoan.value === true) {
      this.addLoanForm.controls.homeLoan.disable();
    }
    if (value === 'EL' && this.addLoanForm.controls.eduLoan.value === false) {
      this.addLoanForm.controls.homeLoan.enable();
    }
    if (value === 'HL' && this.addLoanForm.controls.homeLoan.value === true) {
      this.addLoanForm.controls.eduLoan.disable();
    }
    if (value === 'HL' && this.addLoanForm.controls.homeLoan.value === false) {
      this.addLoanForm.controls.eduLoan.enable();
    }
  }

  submit(){
    let payload = {
      loanType: this.getLoanType(),
      loanDesc: this.addLoanForm.controls.loanDesc.value,
      principalAmount: this.addLoanForm.controls.principalAmount.value,
      interestRate: this.addLoanForm.controls.interestRate.value,
      balanceAmount: this.addLoanForm.controls.balanceAmount.value,
      loanBank: this.addLoanForm.controls.bankName.value,
      loanYear: this.addLoanForm.controls.loanYear.value
    }
    if (this.addLoanForm.invalid) {
      return;
    }

    this.loanService.addLoanDetails(payload).subscribe(
      data => {
        //alert("success");
        this.alertService.state = true;
        this.alertService.showSuccessModal("Loan added successfully")
        this.addLoanForm.reset();
        this.route.navigate(['/loan']);
      }, error => {
        console.log(error);
      }
    )
  }
  getLoanType(){
    if(this.addLoanForm.controls.eduLoan.value){
      return "EL";
    }
    if(this.addLoanForm.controls.homeLoan.value){
      return "HL";
    }
  }
}