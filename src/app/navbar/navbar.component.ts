import { Component, OnInit } from '@angular/core';
import * as navbarStrings from '../stringFile/navbar.json';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './navbar.component.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { routeConstants } from '../constant/navigationString';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  navbarStrings: any = navbarStrings;
  private token: string | null = null;
  private username: string | null = null;
  constructor(private authService: AuthService, private toastr: ToastrService, private router: Router, private searchService: SearchService) { }


  ngOnInit() {
    this.token = localStorage.getItem(navbarStrings.tokenText);
    this.username = localStorage.getItem(navbarStrings.usernameText);
  }

  async onLogout() {
    if (!this.token) {
      this.toastr.error(this.navbarStrings.notokenfoundText, this.navbarStrings.errorText);
      return;
    }
    try {
      const response = await firstValueFrom(this.authService.logout(this.token));
      if (response.success) {
        this.toastr.success(response.message, this.navbarStrings.successText);
        localStorage.removeItem(navbarStrings.tokenText);
        localStorage.removeItem(navbarStrings.usernameText);
        this.router.navigate([routeConstants.login]);
        this.searchService.updateTicketAvailability(false);

      } else {
        this.toastr.error(response.message, this.navbarStrings.errorText);
      }
    } catch (error: any) {
      this.toastr.error(error.error.message || this.navbarStrings.logoutfailedText, this.navbarStrings.errorText);
    }
  }
}
