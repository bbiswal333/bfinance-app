import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AppComponent } from "../../app.component";
import { map } from 'rxjs/operators';
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  appUrl = 'https://bfinance-service.herokuapp.com';
  //appUrl: string = 'http://localhost:5555';
  loginUrl: string = this.appUrl + '/oauth/token';
  loggedInUserUrl: string = this.appUrl + '/user';
  registerUrl: string = this.appUrl + '/signup';
  forgotPasswordUrl: string = this.appUrl + '/forgot-password';
  changePasswordUrl: string = this.appUrl + '/user/changePassword';
  displayName = ":)";
  user: any;
  displayNameLoader = true;

  constructor(private http: HttpClient) { }

  changePassword(payload) {
    return this.http.put(this.changePasswordUrl, payload);
  }
  updateUser(payload) {
    return this.http.put(this.loggedInUserUrl, payload);
  }
  register(payload) {

    return this.http.post(this.registerUrl, payload);

  }
  forgotPassword(payload) {
    const headers = {
      responseType: 'text',
    };
    return this.http.post(this.forgotPasswordUrl, payload, { responseType: 'text' });
  }

  login(payload) {
    const headers = {
      'Authorization': 'Basic ' + btoa('testjwtclientid:XY7kmzoNzl100'),
      'Content-type': 'application/x-www-form-urlencoded'
    }
    return this.http.post(this.loginUrl, payload, { headers });
  }

  isLoggedIn() {
    if (sessionStorage.getItem('token') !== null) {
      return true;
    } else {
      return localStorage.getItem('token') !== null;
    }

  }
  getLoggedInUser() {
    return this.http.get(this.loggedInUserUrl);
  }

  getAuthToken() {
    if (sessionStorage.getItem('token') != null) {
      return sessionStorage.getItem('token');
    } else {
      return localStorage.getItem('token');
    }
  }
  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  showDisplayName() {
    this.getLoggedInUser().subscribe(data => {
      this.user = data;
      this.displayNameLoader = false;
       //getting First alphanbet of FN and LN
       let firstname = this.user.firstname;
       let lastname = this.user.lastname;
       this.displayName = firstname.substr(0, 1).toUpperCase() + lastname.substr(0, 1).toUpperCase(); 
      //this.displayLoginName();
    }, error => {
      console.log(error);
    })


  }
}
