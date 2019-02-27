import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertsService } from '../../services/alerts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { LoaderService } from '../../loader.service';
import { LoanService } from '../../services/loan/loan.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: 'loan-details.component.html',
    styleUrls: ['./loan-details.component.css']
})

export class LoanDetailsComponent implements OnInit {
    myDateValue: Date;
    loan: any;
    loanStatments: any;
    loanId: string;
    showStatements = 5;
    payLoanForm: FormGroup;
    public payLoanModal;

    @ViewChild('payLoanModal') payModal: ModalDirective

    constructor(private formBuilder: FormBuilder, private activeRoute: ActivatedRoute, private route: Router, public alertService: AlertsService, private authService: AuthService, private loaderService: LoaderService, private loanService: LoanService) {

    }
    createForm() {
        this.payLoanForm = this.formBuilder.group({
            transactionType: ['CREDIT', Validators.required],
            transactionAmount: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
            transactionDesc: ['', [Validators.required]],
            transactionDate: [this.myDateValue, [Validators.required, Validators.pattern("")]]

        });
    }

    ngOnInit() {
        this.myDateValue = new Date();
        this.loanId = this.activeRoute.snapshot.params.loanId;
        this.createForm();

    }
    ngAfterViewInit() {
        this.getLoanById(this.loanId);
        this.getLoanStatements(this.loanId);
    }

    loadMoreStatements() {
        this.showStatements += 2;
    }
    showLess() {
        this.showStatements = 5
    }
    getLoanStatements(loanId) {
        this.loanService.getLoanStatementsByLoanId(loanId).subscribe(data => {
            this.loanStatments = data;
        }, error => {

        })
    }

    getLoanById(loanId) {
        this.loanService.getLoanById(loanId).subscribe(data => {
            this.loan = data;
            console.log(this.loan)
        }, error => {
            if (error.status === 404) {
                this.route.navigate(['404'])
            }
        })
    }
    getClosedLoanStyle(val) {
        let style = {}
        if (val == 0) {
            return style = { "background-color": "#def9db" }
        }
    }

    onPay() {
        this.payLoanForm.reset();
        this.createForm();
        this.payLoanForm.controls.transactionDate.setValue(new Date())
        this.payModal.show();
    }

    pay() {
        // let date = this.payLoanForm.controls.transactionDate.value;
        // alert(this.convertDate(date))
        if (this.payLoanForm.invalid) {
            return;
          }
        let payload = {
            "transactionType": this.payLoanForm.controls.transactionType.value,
            "transactionAmount": this.payLoanForm.controls.transactionAmount.value,
            "desc": this.payLoanForm.controls.transactionDesc.value,
            "date": this.convertDate(this.payLoanForm.controls.transactionDate.value)
        }
        this.loanService.payLoan(this.loanId,payload).subscribe(data => {
            this.payModal.hide();
            this.getLoanById(this.loanId);
            this.getLoanStatements(this.loanId);
            this.alertService.state = true;
            this.alertService.showSuccessModal('Payment successfull');
        },error => {
            alert("Error");
        })
    }

    //dd-mm-yyyy
    convertDate(str) {
        let date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [day, mnth, date.getFullYear()].join("-");
    }
}