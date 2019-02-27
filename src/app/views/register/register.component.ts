import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpParams } from "@angular/common/http";

import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  invalidRegistration: boolean = false;
  validRegistration: boolean = false;
  errorMessage = [];
  successMessage: string = '';

  hasEmailError = false;
  hasPasswordError = false;

  registerState: boolean = false;
  registerBtnText = 'Create Account';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.hasEmailError = false;
    this.hasPasswordError = false;
    if (this.registerForm.invalid) {
      return;
    }
    this.invalidRegistration = false;
    this.registerBtnText = 'Creating account...';
    this.registerState = true;

    let payload = {
      "firstname": this.registerForm.controls.firstname.value,
      "lastname": this.registerForm.controls.lastname.value,
      "email": this.registerForm.controls.email.value,
      "password": this.registerForm.controls.password.value
    }
    this.authService.register(payload).subscribe(data => {
      this.validRegistration = true;
      this.invalidRegistration = false;
      this.successMessage = "Registered succesfully";
      this.registerForm.reset();

      this.registerBtnText = 'Create Account';
      this.registerState = false;

    }, error => {
      this.registerBtnText = 'Create Account';
      this.registerState = false;
      console.log(error);
      this.validRegistration = false;
      this.invalidRegistration = true;
      if (error.status == 400) {
        this.errorMessage = [];
        error.error.errors.forEach(element => {
          this.errorMessage.push(element.defaultMessage);
          if(element.field === 'email'){
            this.hasEmailError = true;
          }
          if(element.field === 'password'){
            this.hasPasswordError = true;
          }
        });
      }
    });
  }

}
