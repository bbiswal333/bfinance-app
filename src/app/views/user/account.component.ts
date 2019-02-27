import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpParams } from "@angular/common/http";

import { AuthService } from '../../services/auth/auth.service';
import { LoaderService } from '../../loader.service';

@Component({
  templateUrl: 'account.component.html'
})
export class AccountComponent implements OnInit {
  myProfileForm: FormGroup;
  isEdit = false;
  user: any;
  validProfile = false;
  invalidProfile = false;
  errorMessage = [];
  profileSuccessMessage = 'Profile updated successfully';
  hasFirstnameError = false;
  hasLastnameError = false;

  //change password
  changePasswordForm: FormGroup;
  changePasswordSuccessMsg = 'Password has been changed successfully';
  changePasswordErrorMsg = [];
  changePasswordSuccess = false;
  changePasswordError = false;
  payload: any = {};

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private loaderService: LoaderService) { }

  ngOnInit() {

    
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    })

    this.myProfileForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
    });
    this.getUserProfile();
  }

  onChangePasswordSubmit() {
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.payload = {
      userId: this.user.id,
      oldPassword: this.changePasswordForm.controls.oldPassword.value,
      newPassword: this.changePasswordForm.controls.newPassword.value,
      confirmPassword: this.changePasswordForm.controls.confirmNewPassword.value
    }
    this.authService.changePassword(this.payload).subscribe(data => {
      this.changePasswordSuccess = true;
      this.changePasswordError = false;
      //alert("Success");
    }, error => {
      this.changePasswordSuccess = false;
      this.changePasswordError = true;
      if (error.status == 400) {
        this.changePasswordErrorMsg = [];
        error.error.errors.forEach(element => {
          this.changePasswordErrorMsg.push(element.defaultMessage);
          // if(element.field === 'email'){
          //   this.hasEmailError = true;
          // }
          // if(element.field === 'password'){
          //   this.hasPasswordError = true;
          // }
        });
      }
    });
  }

  onChangePasswordReset() {
    this.changePasswordForm.reset();
    this.changePasswordError = false;
    this.changePasswordSuccess = false;
  }

  onEdit() {
    this.validProfile = false;
    this.isEdit = true;
    this.myProfileForm.controls['firstname'].enable();
    this.myProfileForm.controls['lastname'].enable();
  }
  onCancelEdit() {
    this.getUserProfile();
    this.isEdit = false;
    this.myProfileForm.controls['firstname'].disable();
    this.myProfileForm.controls['lastname'].disable();
    this.invalidProfile = false;
    this.validProfile = false;
    this.hasFirstnameError = false;
    this.hasLastnameError = false;
  }

  getUserProfile() {
    this.authService.getLoggedInUser().subscribe(data => {
      this.user = data;
      console.log(this.user);
      //building myProfile form
      this.myProfileForm = this.formBuilder.group({
        firstname: [{ value: this.user.firstname, disabled: true }, Validators.required],
        lastname: [{ value: this.user.lastname, disabled: true }, Validators.required],
        email: [{ value: this.user.email, disabled: true }, Validators.compose([Validators.required])]
      });
    }, error => {
      //alert(error.error.error_description);
    });
  }
  onProfileSubmit() {
    this.user.firstname = this.myProfileForm.controls.firstname.value,
      this.user.lastname = this.myProfileForm.controls.lastname.value
    console.log(this.user);
    this.authService.updateUser(this.user).subscribe(data => {
      this.authService.showDisplayName();
      this.validProfile = true;
      this.invalidProfile = false;
      this.getUserProfile();
      this.isEdit = false;
      this.myProfileForm.controls['firstname'].disable();
      this.myProfileForm.controls['lastname'].disable();
    }, error => {
      if (error.status == 400) {
        this.invalidProfile = true;
        this.validProfile = false;
        this.errorMessage = [];
        error.error.errors.forEach(element => {
          this.errorMessage.push(element.defaultMessage);
          if (element.field === 'firstname') {
            this.hasFirstnameError = true;
          }
          if (element.field === 'lastname') {
            this.hasLastnameError = true;
          }
        });
      }
    });
  }

}
