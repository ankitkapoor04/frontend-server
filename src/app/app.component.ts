import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { NewticketComponent } from "./newticket/newticket.component";
import { LoginComponent } from './login/login.component';
import { NoInternetConnectionComponent } from './no-internet-connection/no-internet-connection.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NewticketComponent, SidebarComponent,LoginComponent,NoInternetConnectionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'event-management-web';
}
