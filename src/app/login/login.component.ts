import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { NgForm, FormsModule } from '@angular/forms';
import { loginService } from './login.component.service';
import { commonFunctionService } from '../utils/commonFunction';
import * as loginStrings from '../stringFile/login.json';
import { LoginResponse } from './login.response.modal';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { routeConstants } from '../constant/navigationString';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule],
    styleUrls: ['./login.component.css'],
})

export class LoginComponent {
    passwordFieldType: string = 'password';
    isSubmitted = false;
    loginStrings = loginStrings;
    errorMessage = '';

    loginObj = {
        emailOrUsername: '',
        password: ''
    };

    constructor(
        private loginService: loginService,
        private commonFunction: commonFunctionService,
        private router: Router,
        private toastr: ToastrService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.router.navigate([routeConstants.dashboard]);
        }
    }

    trimValue(controlName: 'emailOrUsername' | 'password') {
        if (this.loginObj[controlName]) {
            this.loginObj[controlName] = this.loginObj[controlName].trim();
        }
    }

    togglePasswordVisibility() {
        this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    }

    space(event: KeyboardEvent) {
        if (event.key === ' ') {
            event.preventDefault();
        }
    }

    trimInput() {
      this.loginObj.emailOrUsername = this.loginObj.emailOrUsername.trim();
    }

    async onLogin(form: NgForm) {
        this.isSubmitted = true;
        this.trimValue('emailOrUsername');
        this.trimValue('password');

        if (!this.loginObj.emailOrUsername || !this.loginObj.password) {
            Object.keys(form.controls).forEach(key => {
                form.controls[key].markAsTouched();
            });
            return;
        }

        if (form.invalid) {
            Object.keys(form.controls).forEach(key => {
                form.controls[key].markAsTouched();
            });
            return;
        }

        this.errorMessage = '';

        try {
            const body = {
                emailOrUsername: this.loginObj.emailOrUsername,
                password: this.loginObj.password
            };
            const response: LoginResponse = await firstValueFrom(this.loginService.VerifyLogin(body));

            if (response.success) {
                localStorage.setItem(loginStrings.tokenText, response.token);
                localStorage.setItem('username', response.username);
                this.toastr.success(response.message, loginStrings.successText);
                this.router.navigate([routeConstants.dashboard]);
            } else {
                this.toastr.error(response.message, loginStrings.errorText);
            }
        } catch (error: any) {
            if (error.error && error.error.message) {
                this.toastr.error(error.error.message, loginStrings.errorText);
            } else {
                this.toastr.error(error.message || loginStrings.anUnexpectedErrorOccurredText, loginStrings.errorText);
            }
        }
    }
}
