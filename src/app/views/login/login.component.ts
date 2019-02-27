import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpParams } from "@angular/common/http";

import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  invalidLogin: boolean = false;
  authCredentials: any = null;
  redirectUrl: string = '';
  rememberMe: boolean = false;

  loginState: boolean = false;
  loginBtnText: string = "Sign In"

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    window.localStorage.removeItem('token');
    window.sessionStorage.removeItem('token');
    this.loginForm = this.formBuilder.group({
      username: ['test@test.in', Validators.compose([Validators.required])],
      password: ['12345', Validators.required],
      rememberme: [this.rememberMe]
    });
    this.route.queryParams.subscribe(params => {
      this.redirectUrl = params.redirectUrl;
    });
  }

  rememberMeChange(){
    this.rememberMe = this.loginForm.controls.rememberme.value;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.invalidLogin = false;
    this.loginState = true;
    this.loginBtnText = "Signing in..."

    const body = new HttpParams()
      .set('username', this.loginForm.controls.username.value)
      .set('password', this.loginForm.controls.password.value)
      .set('grant_type', 'password');
    this.authService.login(body.toString()).subscribe(data => {
      this.authCredentials = data;
      window.sessionStorage.setItem('token', this.authCredentials.access_token);
      //check for remember me
      if(this.rememberMe){
        window.localStorage.setItem('token', this.authCredentials.access_token);
      }

      //navigating
      if (this.redirectUrl === '' || this.redirectUrl === undefined) {
        this.router.navigate(['dashboard']);
      } else {
        this.router.navigate([this.redirectUrl]);
      }

    }, error => {
      if(error.status === 0){
        this.loginState = false;
        this.loginBtnText = "Sign In";
      }
      if (error.status === 400) {
        this.invalidLogin = true;
        this.loginState = false;
        this.loginBtnText = "Sign In";
      }
    });
  }
}
