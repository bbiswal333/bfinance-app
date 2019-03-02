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
    isPay = false;
    loanAnalysisYearDropdown: any[] = [];
    loanLoader = true;
    loanStatementsLoader = true;
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
        this.getLoanAnalysisMonthly(this.loanId);
        this.getLoanAnalysisYearly(this.loanId, this.getCurrentYear());
        this.getLoanStatements(this.loanId);

    }

    getLoanAnalysisYear() {
        let array = [];
        if (this.loanStatments != undefined) {
            for (let statement of this.loanStatments) {
                let date = statement.date;
                let arr: string[] = date.split(" ");
                array.push(arr[2])
            }
            this.loanAnalysisYearDropdown = array.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            })
        }
    }

    onRefresh() {
        this.getLoanById(this.loanId);
        this.getLoanAnalysisMonthly(this.loanId);
        this.getLoanAnalysisYearly(this.loanId, this.getCurrentYear());
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
            this.loanStatementsLoader = false;
            this.getLoanAnalysisYear();
        }, error => {
            console.log(error);
        })
    }

    getLoanById(loanId) {
        this.loanService.getLoanById(loanId).subscribe(data => {
            this.loan = data;
            this.loanLoader = false;
            if (this.loan.balanceAmount == 0) {
                this.isPay = true;
            }
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
        this.loanService.payLoan(this.loanId, payload).subscribe(data => {
            this.payModal.hide();
            this.getLoanById(this.loanId);
            this.getLoanStatements(this.loanId);
            this.alertService.state = true;
            this.onRefresh();
            this.alertService.showSuccessModal('Payment successfull');
        }, error => {
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

    // barChart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };

    public barChartType = 'bar';
    public barChartLegend = true;

    public barChartLabels: string[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    public barChartData: any[] = [
        { data: [], label: 'Interest' },
        { data: [], label: 'Amount Paid' }
    ];

    loanAnaysisMonthly: any;
    loanAnaysisMonthlyLoader = true;

    getLoanAnalysisMonthly(loanId) {
        this.loanService.getLoanAnalysisMonthly(loanId).subscribe(data => {
            this.loanAnaysisMonthly = data;
            this.loanAnaysisMonthlyLoader = false;
            this.renderBarChart();

        }, error => {
            console.log("Error")
        });
    }
    monthtoInt(month) {
        let monthStr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        for (let i = 0; i < monthStr.length; i++) {
            if (month === monthStr[i]) {
                return i;
            }
        }
    }
    renderBarChart() {
        if (this.loanAnaysisMonthly != null) {
            let payloadCredit = this.loanAnaysisMonthly.filter(data => data.transactionType === 'CREDIT')
            let payloadDebit = this.loanAnaysisMonthly.filter(data => data.transactionType === 'DEBIT')
            console.log(payloadCredit)
            let creditValues = [];
            let debitValues = [];
            //creating data for CREDIT
            for (let credit of payloadCredit) {
                let index = this.monthtoInt(credit.month)
                creditValues[index] = credit.totalAmount;
            }

            //creating data for DEBIT
            for (let debit of payloadDebit) {
                let index = this.monthtoInt(debit.month)
                debitValues[index] = debit.totalAmount
            }


            let clone = JSON.parse(JSON.stringify(this.barChartData));
            clone[0].data = debitValues;
            clone[1].data = creditValues;
            this.barChartData = clone;
        }
    }


    // Pie chart
    public pieChartLabels: string[] = ['Interest Paid', 'Amount Paid'];
    public pieChartData: number[] = [0, 0];
    public pieChartType = 'pie';
    pieChartYear;

    loanAnalysisYearly: any;
    loanAnaysisYearlyLoader = true;

    getLoanAnalysisYearly(loanId, year) {
        this.loanService.getLoanAnalysisYearly(loanId, year).subscribe(data => {
            this.loanAnalysisYearly = data;
            this.pieChartYear = year
            this.loanAnaysisYearlyLoader = false;
            this.renderPieChart();
        }, error => {
            console.log(error);
        });
    }

    renderPieChart() {
        if (this.loanAnalysisYearly != null) {
            let interestPayload = this.loanAnalysisYearly.filter(data => data.transactionType === 'DEBIT');
            let amountPayload = this.loanAnalysisYearly.filter(data => data.transactionType === 'CREDIT');

            let clone = JSON.parse(JSON.stringify(this.pieChartData));
            if (interestPayload != "") {
                clone[0] = interestPayload[0].totalAmount;
            } else {
                clone[0] = 0;
            }
            if (amountPayload != "") {
                clone[1] = amountPayload[0].totalAmount;
            } else {
                clone[1] = 0;
            }

            this.pieChartData = clone;
        }

    }

    getCurrentYear() {
        return new Date().getFullYear();
    }

    onLoanAnalysisYearChange(year) {
        this.getLoanAnalysisYearly(this.loanId, year);
    }
}