import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AppComponent } from "../../app.component";
import { map } from 'rxjs/operators';
import { Observable, from } from "rxjs";

import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  appUrl = 'https://bfinance-service.herokuapp.com';
  //appUrl: string = 'http://localhost:5555';
  loanProgressPercent: number;
 
  constructor(private http: HttpClient, private authService: AuthService) { }

  getLoanAnalysisYearly(loanId,year){
    return this.http.get(this.appUrl+"/loan/"+loanId+"/analysis/yearly?year="+year);
  }
  getLoanAnalysisMonthly(loanId){
    return this.http.get(this.appUrl+"/loan/"+loanId+"/analysis/monthly");
  }

  payLoan(loanId,payload){
    return this.http.post(this.appUrl+ "/loan/"+loanId+"/statement",payload);
  }
  getLoanStatementsByLoanId(loanId){
    return this.http.get(this.appUrl+ "/loan/"+loanId+"/statement");
  }

  getLoanById(loanId){
    return this.http.get(this.appUrl+'/loan/'+loanId);
  }

  deleteLoanById(loanId){
    return this.http.delete(this.appUrl+'/loan/'+loanId);
  }
  getLoanDetails(){
    return this.http.get(this.appUrl +  '/loan');
  }

  addLoanDetails(payload){
    return this.http.post(this.appUrl + "/loan",payload);
  }
  calculateProgress(p: number, b:number){
   if(b == p){
     this.loanProgressPercent = 0;
      return 0;
    }
    this.loanProgressPercent = Math.round(((b/p) * 100));
    return Math.round(100 - ((b/p) * 100));
  }
  getProgressStyle(percent:number){
    let style: any = {};
   // if(this.loanProgressPercent !== undefined && this.loanProgressPercent !== 0){
     style = {"width":percent+"%"};
    //}
    return style;
  }

  getProgressClass(percent:number){
    if(percent >= 70){
      return "progress-bar bg-success";
    }
    if(percent >= 50 && percent < 70){
      return "progress-bar bg-warning";
    }
    if(percent < 50){
      return "progress-bar bg-danger";
    }
  }

}
