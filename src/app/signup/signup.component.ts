import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { signupService } from './signup.component.service';
import * as signupStrings from '../stringfile/signup.json';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { routeConstants } from '../constant/navigationString';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupStrings = signupStrings;

  userData = {
    username: '',
    email: '',
    contactNumber: '',
    password: ''
  };

  isSubmitted = false;

  constructor(private signupService: signupService, private toastr: ToastrService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([routeConstants.dashboard]);
    }
  }
  
  validateNoLeadingSpace(control: any) {
    if (control.value) {
      const trimmedValue = control.value.trim();
      if (trimmedValue !== control.value) {
        control.control.setValue(trimmedValue);
      }
      if (trimmedValue.startsWith(' ')) {
        control.control.setErrors({ noLeadingSpace: true });
      } else {
        control.control.setErrors(null);
      }
    }
  }

  async onSubmit(form: NgForm) {
    this.isSubmitted = true;
    if (form.invalid) {
      return;
    }
    this.userData.username = this.userData.username.trim();
    this.userData.contactNumber = this.userData.contactNumber.toString().trim();

    try {
      const response = await firstValueFrom(this.signupService.registerUser(this.userData));

      if (response.success) {
        this.toastr.success(response.message, signupStrings.successText);
        form.resetForm();
        this.isSubmitted = false;
        this.router.navigate([routeConstants.login]);
      } else {
        this.toastr.error(response.message || signupStrings.registrationfailedText, signupStrings.errorText);
      }
    } catch (error: any) {
      this.toastr.error(error.error.message || signupStrings.registrationfailedText, signupStrings.errorText);
    }
  }
}