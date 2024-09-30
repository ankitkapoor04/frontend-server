import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { SettingsComponent } from './settings/settings.component';
import { authGuard } from './auth/auth.guard';


export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'login', component: LoginComponent},
    { path: 'signup', component: SignupComponent },
    { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'login', pathMatch: 'full' },
];